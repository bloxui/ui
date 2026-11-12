/**
 * Proves the registry works outside this repo's folder layout.
 *
 * It installs every registry item into a scratch project the way the CLI will
 * (components in components/ui, helpers in lib, blocks in components/blocks, with
 * "@/…" import aliases) and type-checks the result with TypeScript. A file that
 * imports something the registry does not ship, or a wrong alias, fails here.
 *
 *   node scripts/verify-registry.mjs
 */

import { spawnSync } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildRegistry } from "./build-registry.mjs";
import { applyAliases, collectDependencies, resolveItems } from "./registry-lib.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const uiRoot = join(root, "packages/ui");
// Inside packages/ui so the scratch project resolves the same installed packages.
const projectDir = join(uiRoot, ".registry-check");

/** A project layout that differs from this repo's, like a real app. */
const aliases = { ui: "@/components/ui", lib: "@/lib" };
const folders = { ui: "components/ui", lib: "lib", block: "components/blocks", style: "styles" };

function destination(item, file) {
  // "ui/button.tsx" → components/ui/button.tsx, "blocks/login.tsx" → components/blocks/login.tsx
  const name = file.path.split("/").pop();
  return join(projectDir, folders[item.type], name);
}

const { items, itemsByName } = await buildRegistry();
const ordered = resolveItems(Object.keys(itemsByName), itemsByName);

await rm(projectDir, { recursive: true, force: true });

try {
  for (const name of ordered) {
    const item = itemsByName[name];
    for (const file of item.files) {
      const target = destination(item, file);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, item.type === "style" ? file.content : applyAliases(file.content, aliases));
    }
  }

  await writeFile(
    join(projectDir, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          lib: ["dom", "dom.iterable", "ES2022"],
          module: "ESNext",
          moduleResolution: "Bundler",
          jsx: "react-jsx",
          strict: true,
          noUncheckedIndexedAccess: true,
          skipLibCheck: true,
          noEmit: true,
          baseUrl: ".",
          paths: { "@/*": ["./*"] },
        },
        include: ["**/*.ts", "**/*.tsx"],
      },
      null,
      2,
    ),
  );

  const tsc = join(uiRoot, "node_modules/typescript/bin/tsc");
  const result = spawnSync(process.execPath, [tsc, "-p", projectDir], { encoding: "utf8" });

  if (result.status !== 0) {
    console.error(`\nRegistry verification failed. Installed files do not type-check:\n\n${result.stdout}${result.stderr}`);
    process.exitCode = 1;
  } else {
    const packages = Object.keys(collectDependencies(ordered, itemsByName));
    console.log(
      `Registry verified: ${items.length} items installed into a separate project layout and type-checked (${packages.length} npm packages).`,
    );
  }
} finally {
  await rm(projectDir, { recursive: true, force: true });
}
