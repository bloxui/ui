/**
 * Builds the registry: one JSON file per component, block, helper and theme, plus an index.
 * The CLI downloads these to copy source into a user's project.
 *
 *   node scripts/build-registry.mjs            write to apps/www/public/r
 *   node scripts/build-registry.mjs --check    fail if the committed files are out of date
 */

import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  blocks as blockMeta,
  components as componentMeta,
  initItems,
  libs as libMeta,
  theme as themeMeta,
} from "../registry/meta.mjs";
import {
  classifyImports,
  LIB_ALIAS,
  normalizeNewlines,
  resolveItems,
  rewriteImports,
  UI_ALIAS,
} from "../packages/cli/src/registry.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const uiRoot = join(root, "packages/ui");
export const registryDir = join(root, "apps/www/public/r");

class RegistryError extends Error {}

async function readSource(path) {
  return normalizeNewlines(await readFile(path, "utf8"));
}

async function sourceFiles(folder) {
  const files = await readdir(join(uiRoot, "src", folder));
  return files.filter((file) => file.endsWith(".tsx") && !file.includes(".test.") && !file.includes(".stories.")).sort();
}

/** Returns every registry item, built from the current source. Throws RegistryError when something is inconsistent. */
export async function buildRegistry() {
  const uiPackage = JSON.parse(await readFile(join(uiRoot, "package.json"), "utf8"));

  /** Pins each npm package to the version range the library is built and tested with. */
  function withVersions(packages, itemName) {
    return Object.fromEntries(
      packages.map((name) => {
        const range = uiPackage.dependencies[name];
        if (!range) throw new RegistryError(`"${itemName}" imports "${name}", which is not in packages/ui dependencies.`);
        return [name, range];
      }),
    );
  }

  async function buildItem({ name, type, meta, sourcePath, targetPath }) {
    const source = await readSource(sourcePath);
    const imports = classifyImports(source, type);
    return {
      name,
      type,
      title: meta.title,
      description: meta.description,
      category: meta.category,
      dependencies: withVersions(imports.packages, name),
      registryDependencies: [...imports.libs, ...imports.components].filter((item) => item !== name),
      files: [{ path: targetPath, content: rewriteImports(source, type) }],
    };
  }

  /** Builds one item per source file in a folder and checks the folder against its metadata. */
  async function buildFolder({ folder, type, meta, itemName = (file) => file }) {
    const files = await sourceFiles(folder);
    const built = [];
    for (const file of files) {
      const base = file.replace(/\.tsx$/, "");
      if (!meta[base]) throw new RegistryError(`${folder}/${file} has no entry in registry/meta.mjs.`);
      built.push(
        await buildItem({
          name: itemName(base),
          type,
          meta: meta[base],
          sourcePath: join(uiRoot, "src", folder, file),
          targetPath: `${folder === "components" ? "ui" : folder}/${file}`,
        }),
      );
    }
    for (const base of Object.keys(meta)) {
      if (!files.includes(`${base}.tsx`)) {
        throw new RegistryError(`registry/meta.mjs lists "${base}" but ${folder}/${base}.tsx does not exist.`);
      }
    }
    return built;
  }

  const items = [
    ...(await buildFolder({ folder: "components", type: "ui", meta: componentMeta })),
    // Blocks are named "block-<name>" so they can never collide with a component.
    ...(await buildFolder({ folder: "blocks", type: "block", meta: blockMeta, itemName: (base) => `block-${base}` })),
  ];

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
    files: [{ path: themeMeta.file, content: await readSource(join(uiRoot, "src/styles", themeMeta.file)) }],
  });

  // --- Validate ---

  const itemsByName = Object.fromEntries(items.map((item) => [item.name, item]));
  if (Object.keys(itemsByName).length !== items.length) throw new RegistryError("Two registry items share a name.");

  try {
    // Walks every dependency chain, so unknown names and cycles surface here rather than in the CLI.
    resolveItems(Object.keys(itemsByName), itemsByName);
    resolveItems(initItems, itemsByName);
  } catch (error) {
    throw new RegistryError(error.message);
  }

  for (const item of items) {
    for (const file of item.files) {
      if (/from\s+["']\.{1,2}\//.test(file.content)) {
        throw new RegistryError(`"${item.name}" still has a relative import after rewriting.`);
      }
    }
  }

  const index = {
    name: "blox-ui",
    version: uiPackage.version,
    aliases: { ui: UI_ALIAS, lib: LIB_ALIAS },
    init: initItems,
    items: items.map(({ files, ...summary }) => ({ ...summary, files: files.map((file) => file.path) })),
  };

  return { items, itemsByName, index };
}

/** The registry as { "file name": "file text" }, exactly as it is written to disk. */
export function registryFiles({ items, index }) {
  const toText = (value) => `${JSON.stringify(value, null, 2)}\n`;
  return Object.fromEntries([
    ["index.json", toText(index)],
    ...items.map((item) => [`${item.name}.json`, toText(item)]),
  ]);
}

function describe(items) {
  const counts = {};
  for (const item of items) counts[item.type] = (counts[item.type] ?? 0) + 1;
  const parts = Object.entries(counts).map(([type, count]) => `${count} ${type}`);
  return `${items.length} items (${parts.join(", ")})`;
}

async function main() {
  const registry = await buildRegistry();
  const files = registryFiles(registry);

  if (process.argv.includes("--check")) {
    const onDisk = await readdir(registryDir).catch(() => []);
    const stale = [];
    for (const [name, text] of Object.entries(files)) {
      const current = await readFile(join(registryDir, name), "utf8").catch(() => null);
      if (current === null) stale.push(`${name} (missing)`);
      else if (normalizeNewlines(current) !== text) stale.push(`${name} (out of date)`);
    }
    for (const name of onDisk) {
      if (!(name in files)) stale.push(`${name} (no longer generated)`);
    }
    if (stale.length > 0) {
      throw new RegistryError(
        `The committed registry does not match the source:\n  - ${stale.join("\n  - ")}\nRun "pnpm registry:build" and commit the result.`,
      );
    }
    console.log(`Registry is valid and up to date: ${describe(registry.items)}.`);
    return;
  }

  await rm(registryDir, { recursive: true, force: true });
  await mkdir(registryDir, { recursive: true });
  await Promise.all(Object.entries(files).map(([name, text]) => writeFile(join(registryDir, name), text)));
  console.log(`Registry built: ${describe(registry.items)} → apps/www/public/r`);
}

// Run only when executed directly, so other scripts can import buildRegistry().
if (process.argv[1] && fileURLToPath(import.meta.url) === join(process.argv[1])) {
  main().catch((error) => {
    if (!(error instanceof RegistryError)) throw error;
    console.error(`\nRegistry build failed: ${error.message}\n`);
    process.exit(1);
  });
}
