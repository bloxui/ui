/**
 * Pure helpers for building and consuming the registry. Kept free of file access
 * so they can be unit-tested and reused by the CLI.
 */

/** Import aliases written into registry files. The CLI swaps them for the user's own paths. */
export const UI_ALIAS = "~ui";
export const LIB_ALIAS = "~lib";

const IMPORT_PATTERN = /(?:^|\n)\s*(?:import|export)\s+(?:[^"';]*?\sfrom\s+)?["']([^"']+)["']/g;

/** Git may check files out with CRLF on Windows; the registry must be identical on every machine. */
export function normalizeNewlines(source) {
  return source.replace(/\r\n/g, "\n");
}

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
 * Where a relative import points, given the kind of file it is in:
 *   ui     components import "./sibling" and "../lib/x"
 *   lib    helpers import "./other-helper"
 *   block  blocks import "../components/x" and "../lib/x"
 * Returns null for package imports.
 */
function resolveRelative(specifier, kind) {
  if (!specifier.startsWith(".")) return null;
  if (specifier.startsWith("../lib/")) return { group: "lib", name: specifier.slice("../lib/".length) };
  if (kind === "block" && specifier.startsWith("../components/")) {
    return { group: "ui", name: specifier.slice("../components/".length) };
  }
  if (kind !== "block" && specifier.startsWith("./")) {
    return { group: kind === "lib" ? "lib" : "ui", name: specifier.slice(2) };
  }
  throw new Error(`Unsupported relative import "${specifier}" in a ${kind} file.`);
}

/** Sorts a file's imports into npm packages, components and shared lib files. */
export function classifyImports(source, kind) {
  const packages = new Set();
  const components = new Set();
  const libs = new Set();

  for (const specifier of findImports(source)) {
    const relative = resolveRelative(specifier, kind);
    if (relative) {
      (relative.group === "lib" ? libs : components).add(stripExtension(relative.name));
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
    const relative = resolveRelative(specifier, kind);
    if (!relative) return whole;
    const alias = relative.group === "lib" ? LIB_ALIAS : UI_ALIAS;
    return `${lead}${quote}${alias}/${relative.name}${quote}`;
  });
}

/**
 * Replaces the registry aliases with a project's own import paths,
 * e.g. { ui: "@/components/ui", lib: "@/lib" }. This is what the CLI does on install.
 */
export function applyAliases(source, aliases) {
  return source.replace(/(from\s+|import\s+)(["'])(~ui|~lib)\//g, (_whole, lead, quote, alias) => {
    return `${lead}${quote}${alias === UI_ALIAS ? aliases.ui : aliases.lib}/`;
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

/** Every npm package a set of items needs, merged into one { name: range } map. */
export function collectDependencies(names, itemsByName) {
  const merged = {};
  for (const name of names) Object.assign(merged, itemsByName[name].dependencies);
  return Object.fromEntries(Object.entries(merged).sort(([a], [b]) => a.localeCompare(b)));
}
