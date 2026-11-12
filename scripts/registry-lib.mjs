/**
 * Pure helpers for building the registry. Kept free of file access so they can be unit-tested.
 */

/** Import aliases written into registry files. The CLI swaps them for the user's own paths. */
export const UI_ALIAS = "~ui";
export const LIB_ALIAS = "~lib";

const IMPORT_PATTERN = /(?:^|\n)\s*(?:import|export)\s+(?:[^"';]*?\sfrom\s+)?["']([^"']+)["']/g;

/** Every module specifier a file imports or re-exports from, in order, without duplicates. */
export function findImports(source) {
  const found = new Set();
  for (const match of source.matchAll(IMPORT_PATTERN)) found.add(match[1]);
  return [...found];
}

/** "@radix-ui/react-slot/x" → "@radix-ui/react-slot", "recharts/es6" → "recharts". */
export function packageName(specifier) {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

const stripExtension = (path) => path.replace(/\.(tsx?|mjs|js)$/, "");

/**
 * Sorts a file's imports into npm packages, sibling components and shared lib files.
 * `kind` is where the file itself lives: components import "../lib/x" and "./sibling",
 * lib files import "./other-lib".
 */
export function classifyImports(source, kind) {
  const packages = new Set();
  const components = new Set();
  const libs = new Set();

  for (const specifier of findImports(source)) {
    if (specifier.startsWith("../lib/")) {
      libs.add(stripExtension(specifier.slice("../lib/".length)));
    } else if (specifier.startsWith("./")) {
      const name = stripExtension(specifier.slice(2));
      (kind === "lib" ? libs : components).add(name);
    } else if (specifier.startsWith(".")) {
      throw new Error(`Unsupported relative import "${specifier}". Use "./name" or "../lib/name".`);
    } else {
      const name = packageName(specifier);
      // React is a peer dependency every project already has.
      if (name !== "react" && name !== "react-dom") packages.add(name);
    }
  }

  return { packages: [...packages].sort(), components: [...components].sort(), libs: [...libs].sort() };
}

/** Rewrites relative imports to the registry aliases so files work from any folder layout. */
export function rewriteImports(source, kind) {
  return source.replace(/(from\s+|import\s+)(["'])(\.{1,2}\/[^"']+)\2/g, (whole, lead, quote, specifier) => {
    let target;
    if (specifier.startsWith("../lib/")) target = `${LIB_ALIAS}/${specifier.slice("../lib/".length)}`;
    else if (specifier.startsWith("./")) target = `${kind === "lib" ? LIB_ALIAS : UI_ALIAS}/${specifier.slice(2)}`;
    else return whole;
    return `${lead}${quote}${target}${quote}`;
  });
}

/**
 * All items an item needs, directly or through other items, in install order
 * (dependencies first). Throws on unknown names and on cycles.
 */
export function resolveItems(names, itemsByName) {
  const ordered = [];
  const done = new Set();
  const visiting = new Set();

  function visit(name, trail) {
    if (done.has(name)) return;
    const item = itemsByName[name];
    if (!item) throw new Error(`Unknown registry item "${name}"${trail.length ? ` (needed by ${trail.at(-1)})` : ""}.`);
    if (visiting.has(name)) throw new Error(`Circular dependency: ${[...trail, name].join(" → ")}.`);
    visiting.add(name);
    for (const dependency of item.registryDependencies) visit(dependency, [...trail, name]);
    visiting.delete(name);
    done.add(name);
    ordered.push(name);
  }

  for (const name of names) visit(name, []);
  return ordered;
}
