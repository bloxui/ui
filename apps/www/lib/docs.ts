import "server-only";

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { highlight } from "./highlight";

/** Next runs from apps/www; everything below is read at build time. */
const appRoot = process.cwd();
const uiRoot = join(appRoot, "../../packages/ui");
const componentsDir = join(uiRoot, "src/components");

export interface RegistrySummary {
  name: string;
  type: "ui" | "block" | "lib" | "style";
  title: string;
  description: string;
  category: string;
  dependencies: Record<string, string>;
  registryDependencies: string[];
}

interface RegistryIndex {
  items: RegistrySummary[];
}

function readIndex(): RegistryIndex {
  return JSON.parse(readFileSync(join(appRoot, "public/r/index.json"), "utf8"));
}

/** Order categories appear in the navigation. Anything else follows alphabetically. */
const categoryOrder = ["Forms", "Display", "Feedback", "Overlays", "Navigation", "Disclosure", "Data", "Layout", "AI"];

export interface NavGroup {
  title: string;
  items: { name: string; title: string; href: string }[];
}

export function getComponentList(): RegistrySummary[] {
  return readIndex()
    .items.filter((item) => item.type === "ui")
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getNavigation(): NavGroup[] {
  const groups = new Map<string, NavGroup["items"]>();
  for (const item of getComponentList()) {
    const list = groups.get(item.category) ?? [];
    list.push({ name: item.name, title: item.title, href: `/docs/components/${item.name}` });
    groups.set(item.category, list);
  }
  const rank = (category: string) => {
    const index = categoryOrder.indexOf(category);
    return index === -1 ? categoryOrder.length : index;
  };
  return [...groups.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([title, items]) => ({ title, items }));
}

// --- Example code, as the reader would write it in their project ---------------------------

let exportMap: Map<string, string> | undefined;

/** Which component file exports each symbol, e.g. "DialogTrigger" → "dialog". */
function getExportMap() {
  if (exportMap) return exportMap;
  exportMap = new Map();
  for (const file of readdirSync(componentsDir)) {
    if (!file.endsWith(".tsx") || file.includes(".test.") || file.includes(".stories.")) continue;
    const name = file.replace(/\.tsx$/, "");
    const source = readFileSync(join(componentsDir, file), "utf8");
    for (const match of source.matchAll(/export\s+(?:declare\s+)?(?:function|const|class|interface|type|enum)\s+(\w+)/g)) {
      exportMap.set(match[1]!, name);
    }
    for (const match of source.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)) {
      for (const part of match[1]!.split(",")) {
        const symbol = part.trim().split(/\s+as\s+/).pop()?.trim();
        if (symbol) exportMap.set(symbol, name);
      }
    }
  }
  return exportMap;
}

/**
 * Examples import everything from "@blox-ui/ui" so they run in this repo. Readers install
 * components one file at a time, so the code they see imports each from its own file.
 */
export function toProjectImports(source: string) {
  const exports = getExportMap();
  return source.replace(/import\s*\{([^}]+)\}\s*from\s*"@blox-ui\/ui";/g, (_whole, list: string) => {
    const byFile = new Map<string, string[]>();
    for (const raw of list.split(",")) {
      const specifier = raw.trim();
      if (!specifier) continue;
      const symbol = specifier.replace(/^type\s+/, "");
      const file = exports.get(symbol);
      if (!file) throw new Error(`Example imports "${symbol}", which no component exports.`);
      byFile.set(file, [...(byFile.get(file) ?? []), specifier]);
    }
    return [...byFile.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([file, symbols]) => `import { ${symbols.join(", ")} } from "@/components/ui/${file}";`)
      .join("\n");
  });
}

// --- Props tables, read from the component source with the TypeScript compiler -------------

export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface PropsTable {
  /** e.g. "Button" for ButtonProps, or the full name of a data type such as DataTableColumn. */
  component: string;
  props: PropDoc[];
  /** What the component also accepts, e.g. "Radix Dialog.Content props". */
  extends?: string;
}

function jsDocText(node: ts.Node) {
  const docs = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc);
  const text = docs.map((doc) => ts.getTextOfJSDocComment(doc.comment) ?? "").join(" ").trim();
  return text || undefined;
}

function membersOf(node: ts.TypeNode | undefined): ts.TypeElement[] {
  if (!node) return [];
  if (ts.isTypeLiteralNode(node)) return [...node.members];
  if (ts.isIntersectionTypeNode(node)) return node.types.flatMap(membersOf);
  if (ts.isParenthesizedTypeNode(node)) return membersOf(node.type);
  return [];
}

function heritageText(node: ts.TypeNode | undefined, sourceFile: ts.SourceFile): string[] {
  if (!node) return [];
  if (ts.isIntersectionTypeNode(node)) return node.types.flatMap((part) => heritageText(part, sourceFile));
  if (ts.isTypeLiteralNode(node)) return [];
  return [node.getText(sourceFile)];
}

/** Turns "React.ComponentProps<typeof DialogPrimitive.Content>" into a short, readable phrase. */
function describeBase(text: string) {
  const primitive = text.match(/typeof\s+(\w+?)(?:Primitive)?\.(\w+)/);
  if (primitive) return `${primitive[1]} ${primitive[2]} props from Radix`;
  const element = text.match(/ComponentProps<"(\w+)">/);
  if (element) return `<${element[1]}> attributes`;
  const variants = text.match(/VariantProps<typeof (\w+)>/);
  if (variants) return null;
  return text.replace(/\s+/g, " ");
}

/** Default values from `{ size = "md" }` destructuring in the file's exported functions. */
function collectDefaults(sourceFile: ts.SourceFile) {
  const defaults = new Map<string, string>();
  function visit(node: ts.Node) {
    if (ts.isBindingElement(node) && node.initializer && ts.isIdentifier(node.propertyName ?? node.name)) {
      const name = (node.propertyName ?? node.name) as ts.Identifier;
      if (!defaults.has(name.text)) defaults.set(name.text, node.initializer.getText(sourceFile));
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return defaults;
}

export function getPropsTables(name: string): PropsTable[] {
  const path = join(componentsDir, `${name}.tsx`);
  const sourceFile = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const defaults = collectDefaults(sourceFile);
  const tables: PropsTable[] = [];

  for (const statement of sourceFile.statements) {
    const exported = ts.canHaveModifiers(statement) && ts.getModifiers(statement)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!exported) continue;

    let members: ts.TypeElement[] = [];
    let bases: string[] = [];
    let typeName: string | undefined;

    if (ts.isInterfaceDeclaration(statement)) {
      typeName = statement.name.text;
      members = [...statement.members];
      bases = statement.heritageClauses?.flatMap((clause) => clause.types.map((t) => t.getText(sourceFile))) ?? [];
    } else if (ts.isTypeAliasDeclaration(statement)) {
      typeName = statement.name.text;
      members = membersOf(statement.type);
      bases = heritageText(statement.type, sourceFile);
    }
    // Props types, plus the data shapes components take (DataTableColumn, ComboboxOption…).
    const isDataShape = ts.isInterfaceDeclaration(statement) && !typeName?.endsWith("Props");
    if (!typeName || (!typeName.endsWith("Props") && !isDataShape)) continue;

    const props: PropDoc[] = members.filter(ts.isPropertySignature).map((member) => {
      const propName = member.name.getText(sourceFile).replace(/^"|"$/g, "");
      return {
        name: propName,
        type: member.type?.getText(sourceFile).replace(/\s+/g, " ") ?? "unknown",
        required: !member.questionToken,
        defaultValue: defaults.get(propName),
        description: jsDocText(member),
      };
    });

    // Variant props come from cva; list their options so the table is complete.
    for (const base of bases) {
      const variants = base.match(/VariantProps<typeof (\w+)>/);
      if (variants) props.push(...variantProps(sourceFile, variants[1]!, defaults));
    }

    const described = bases.map((base) => describeBase(base.replace(/^Omit<(.+),\s*[^,]+>$/, "$1"))).filter(Boolean);
    tables.push({
      component: typeName.replace(/Props$/, ""),
      props: props.sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name)),
      extends: described.length ? described.join(", ") : undefined,
    });
  }
  return tables;
}

/** Reads the variant names and options from a `cva(base, { variants: {…} })` call. */
function variantProps(sourceFile: ts.SourceFile, variable: string, defaults: Map<string, string>): PropDoc[] {
  let result: PropDoc[] = [];
  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(sourceFile) === variable && node.initializer && ts.isCallExpression(node.initializer)) {
      const config = node.initializer.arguments[1];
      if (!config || !ts.isObjectLiteralExpression(config)) return;
      const variants = config.properties.find((p) => p.name?.getText(sourceFile) === "variants");
      const defaultsObject = config.properties.find((p) => p.name?.getText(sourceFile) === "defaultVariants");
      const declared = new Map<string, string>();
      if (defaultsObject && ts.isPropertyAssignment(defaultsObject) && ts.isObjectLiteralExpression(defaultsObject.initializer)) {
        for (const p of defaultsObject.initializer.properties) {
          if (ts.isPropertyAssignment(p)) declared.set(p.name.getText(sourceFile), p.initializer.getText(sourceFile));
        }
      }
      if (variants && ts.isPropertyAssignment(variants) && ts.isObjectLiteralExpression(variants.initializer)) {
        result = variants.initializer.properties.filter(ts.isPropertyAssignment).map((variant) => {
          const propName = variant.name.getText(sourceFile);
          const options = ts.isObjectLiteralExpression(variant.initializer)
            ? variant.initializer.properties.map((option) => option.name?.getText(sourceFile).replace(/^"|"$/g, "") ?? "")
            : [];
          const isBoolean = options.length === 1 && options[0] === "true";
          return {
            name: propName,
            type: isBoolean ? "boolean" : options.map((option) => `"${option}"`).join(" | "),
            required: false,
            defaultValue: declared.get(propName) ?? defaults.get(propName),
          };
        });
      }
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return result;
}

// --- Everything a component page needs -----------------------------------------------------

export interface ComponentDoc {
  item: RegistrySummary;
  exampleHtml: string;
  exampleCode: string;
  sourceHtml: string;
  sourceCode: string;
  props: PropsTable[];
  previous?: { name: string; title: string };
  next?: { name: string; title: string };
}

export async function getComponentDoc(name: string): Promise<ComponentDoc | null> {
  const list = getComponentList();
  const position = list.findIndex((item) => item.name === name);
  if (position === -1) return null;
  const item = list[position]!;

  const registryItem = JSON.parse(readFileSync(join(appRoot, `public/r/${name}.json`), "utf8"));
  const sourceCode = (registryItem.files[0].content as string)
    .replaceAll('from "~lib/', 'from "@/lib/')
    .replaceAll('from "~ui/', 'from "@/components/ui/');
  const exampleCode = toProjectImports(readFileSync(join(appRoot, `examples/${name}.tsx`), "utf8").replace(/\r\n/g, "\n"));

  const neighbour = (index: number) => {
    const other = list[index];
    return other ? { name: other.name, title: other.title } : undefined;
  };

  return {
    item,
    exampleCode,
    exampleHtml: await highlight(exampleCode, "tsx"),
    sourceCode,
    sourceHtml: await highlight(sourceCode, "tsx"),
    props: getPropsTables(name),
    previous: neighbour(position - 1),
    next: neighbour(position + 1),
  };
}
