/**
 * Builds the registry: one JSON file per component, helper and theme, plus an index.
 * The CLI downloads these to copy source into a user's project.
 *
 *   node scripts/build-registry.mjs            write to apps/www/public/r
 *   node scripts/build-registry.mjs --check    validate only, write nothing
 */

import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { components as componentMeta, initItems, libs as libMeta, theme as themeMeta } from "../registry/meta.mjs";
import { classifyImports, LIB_ALIAS, resolveItems, rewriteImports, UI_ALIAS } from "./registry-lib.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const uiRoot = join(root, "packages/ui");
const outDir = join(root, "apps/www/public/r");
const checkOnly = process.argv.includes("--check");

const uiPackage = JSON.parse(await readFile(join(uiRoot, "package.json"), "utf8"));
const knownVersions = { ...uiPackage.dependencies };

function fail(message) {
  console.error(`\nRegistry build failed: ${message}\n`);
  process.exit(1);
}

/** Pins each npm package to the version range the library is built and tested with. */
function withVersions(packages, itemName) {
  return Object.fromEntries(
    packages.map((name) => {
      const range = knownVersions[name];
      if (!range) fail(`"${itemName}" imports "${name}", which is not in packages/ui dependencies.`);
      return [name, range];
    }),
  );
}

async function buildItem({ name, type, meta, sourcePath, targetPath }) {
  const source = await readFile(sourcePath, "utf8");
  const kind = type === "lib" ? "lib" : "ui";
  const imports = classifyImports(source, kind);
  return {
    name,
    type,
    title: meta.title,
    description: meta.description,
    category: meta.category,
    dependencies: withVersions(imports.packages, name),
    registryDependencies: [...imports.libs, ...imports.components].filter((item) => item !== name),
    files: [{ path: targetPath, content: rewriteImports(source, kind) }],
  };
}

// --- Collect items -------------------------------------------------------------------------

const componentFiles = (await readdir(join(uiRoot, "src/components")))
  .filter((file) => file.endsWith(".tsx") && !file.includes(".test.") && !file.includes(".stories."))
  .sort();

const items = [];

for (const file of componentFiles) {
  const name = file.replace(/\.tsx$/, "");
  const meta = componentMeta[name];
  if (!meta) fail(`components/${file} has no entry in registry/meta.mjs.`);
  items.push(
    await buildItem({
      name,
      type: "ui",
      meta,
      sourcePath: join(uiRoot, "src/components", file),
      targetPath: `ui/${file}`,
    }),
  );
}

for (const name of Object.keys(componentMeta)) {
  if (!componentFiles.includes(`${name}.tsx`)) fail(`registry/meta.mjs lists "${name}" but components/${name}.tsx does not exist.`);
}

for (const [name, meta] of Object.entries(libMeta)) {
  items.push(
    await buildItem({
      name,
      type: "lib",
      meta,
      sourcePath: join(uiRoot, "src/lib", meta.file),
      targetPath: `lib/${meta.file}`,
    }),
  );
}

items.push({
  name: "theme",
  type: "style",
  title: themeMeta.title,
  description: themeMeta.description,
  category: themeMeta.category,
  dependencies: {},
  registryDependencies: [],
  files: [{ path: themeMeta.file, content: await readFile(join(uiRoot, "src/styles", themeMeta.file), "utf8") }],
});

// --- Validate ------------------------------------------------------------------------------

const itemsByName = Object.fromEntries(items.map((item) => [item.name, item]));
if (Object.keys(itemsByName).length !== items.length) fail("Two registry items share a name.");

try {
  // Walks every dependency chain, so unknown names and cycles surface here rather than in the CLI.
  resolveItems(Object.keys(itemsByName), itemsByName);
  resolveItems(initItems, itemsByName);
} catch (error) {
  fail(error.message);
}

for (const item of items) {
  for (const file of item.files) {
    if (/from\s+["']\.{1,2}\//.test(file.content)) fail(`"${item.name}" still has a relative import after rewriting.`);
  }
}

// --- Write ---------------------------------------------------------------------------------

const index = {
  name: "blox-ui",
  version: uiPackage.version,
  aliases: { ui: UI_ALIAS, lib: LIB_ALIAS },
  init: initItems,
  items: items.map(({ files, ...summary }) => ({ ...summary, files: files.map((file) => file.path) })),
};

const counts = items.reduce((total, item) => ({ ...total, [item.type]: (total[item.type] ?? 0) + 1 }), {});
const summary = Object.entries(counts)
  .map(([type, count]) => `${count} ${type}`)
  .join(", ");

if (checkOnly) {
  console.log(`Registry is valid: ${items.length} items (${summary}).`);
} else {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`);
  await Promise.all(
    items.map((item) => writeFile(join(outDir, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`)),
  );
  console.log(`Registry built: ${items.length} items (${summary}) → apps/www/public/r`);
}
