/**
 * Reading and writing the user's project: config, layout detection, package manager.
 */

import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

export const CONFIG_FILE = "blox.json";

/** Where the registry lives unless the project or a flag says otherwise. */
export const DEFAULT_REGISTRY = "https://bloxui-kit.vercel.app/r";

/**
 * @typedef {object} BloxConfig
 * @property {string} registry   URL or local folder of the registry JSON
 * @property {{ ui: string, lib: string, blocks: string }} aliases   import paths written into files
 * @property {{ ui: string, lib: string, blocks: string, styles: string }} dirs   folders relative to the project root
 * @property {string | null} css   the stylesheet that imports the theme, if any
 */

/** Reads JSON that may contain comments and trailing commas, as tsconfig files often do. */
export function parseLooseJson(text) {
  const withoutComments = text.replace(/("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (_m, string) => string ?? "");
  return JSON.parse(withoutComments.replace(/,\s*([}\]])/g, "$1"));
}

async function readJson(path) {
  try {
    return parseLooseJson(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

export async function readConfig(cwd) {
  const config = await readJson(join(cwd, CONFIG_FILE));
  if (!config) return null;
  for (const key of ["aliases", "dirs"]) {
    if (!config[key]) throw new Error(`${CONFIG_FILE} is missing "${key}". Run "init --force" to recreate it.`);
  }
  return config;
}

export async function writeConfig(cwd, config) {
  await writeFile(join(cwd, CONFIG_FILE), `${JSON.stringify(config, null, 2)}\n`);
}

const toPosix = (path) => path.split(sep).join("/");

/**
 * Works out a sensible layout: a `src` folder if there is one, and the "@/…" alias from
 * tsconfig/jsconfig paths when it is set up. Falls back to relative-free plain folders.
 */
export async function detectLayout(cwd) {
  const base = existsSync(join(cwd, "src")) ? "src" : "";
  const dir = (path) => (base ? `${base}/${path}` : path);

  let prefix = null;
  for (const file of ["tsconfig.json", "jsconfig.json"]) {
    const config = await readJson(join(cwd, file));
    const paths = config?.compilerOptions?.paths ?? {};
    for (const [key, targets] of Object.entries(paths)) {
      const target = Array.isArray(targets) ? targets[0] : undefined;
      if (!key.endsWith("/*") || typeof target !== "string" || !target.endsWith("/*")) continue;
      // "@/*": ["./src/*"] maps the alias onto the folder the components will live in.
      const targetDir = target.slice(0, -2).replace(/^\.\//, "").replace(/\/$/, "");
      if (targetDir === base) {
        prefix = key.slice(0, -2);
        break;
      }
    }
    if (prefix) break;
  }

  const dirs = {
    ui: dir("components/ui"),
    lib: dir("lib"),
    blocks: dir("components/blocks"),
    styles: dir("styles"),
  };
  const aliases = prefix
    ? { ui: `${prefix}/components/ui`, lib: `${prefix}/lib`, blocks: `${prefix}/components/blocks` }
    : null;

  const css = ["app/globals.css", "src/app/globals.css", "src/index.css", "src/styles/globals.css", "styles/globals.css", "src/globals.css"].find(
    (path) => existsSync(join(cwd, path)),
  );

  return { dirs, aliases, css: css ?? null };
}

/** Import path from one project file to another, for projects without an alias. */
export function relativeImport(fromDir, toDir) {
  const path = toPosix(relative(fromDir, toDir)) || ".";
  return path.startsWith(".") ? path : `./${path}`;
}

export function detectPackageManager(cwd) {
  const userAgent = process.env.npm_config_user_agent ?? "";
  for (const [lockfile, manager] of [
    ["pnpm-lock.yaml", "pnpm"],
    ["bun.lockb", "bun"],
    ["bun.lock", "bun"],
    ["yarn.lock", "yarn"],
    ["package-lock.json", "npm"],
  ]) {
    if (existsSync(join(cwd, lockfile))) return manager;
  }
  for (const manager of ["pnpm", "yarn", "bun"]) {
    if (userAgent.startsWith(manager)) return manager;
  }
  return "npm";
}

export function installCommand(manager, packages) {
  return manager === "npm" ? ["npm", ["install", ...packages]] : [manager, ["add", ...packages]];
}

/** Adds the theme import to a stylesheet that loads Tailwind. Returns false when it cannot. */
export function addThemeImport(css, importPath) {
  const line = `@import "${importPath}";`;
  if (css.includes(importPath)) return { css, changed: false, reason: "already imported" };
  const tailwind = css.match(/@import\s+["']tailwindcss["'][^;]*;/);
  if (!tailwind) return { css, changed: false, reason: 'no @import "tailwindcss" found' };
  const end = tailwind.index + tailwind[0].length;
  return { css: `${css.slice(0, end)}\n${line}${css.slice(end)}`, changed: true };
}

/**
 * create-next-app's starter stylesheet sets the page background and text colour from its
 * own variables, after the theme import, and flips them with the operating system rather
 * than the dark class. That hides the Blox theme. When those exact starter rules are still
 * untouched, point the variables at the theme instead and drop the overriding rules.
 * Anything the user has edited is left alone.
 */
export function adaptStarterStyles(css) {
  const rootBlock = /:root\s*\{\s*--background:\s*#ffffff;\s*--foreground:\s*#171717;\s*\}/;
  const darkBlock =
    /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{\s*--background:\s*#0a0a0a;\s*--foreground:\s*#ededed;\s*\}\s*\}\s*/;
  const bodyBlock =
    /body\s*\{\s*background:\s*var\(--background\);\s*color:\s*var\(--foreground\);\s*font-family:\s*Arial,\s*Helvetica,\s*sans-serif;\s*\}\s*/;
  const normalized = css.replace(/\r\n/g, "\n");
  if (!rootBlock.test(normalized) || !darkBlock.test(normalized) || !bodyBlock.test(normalized)) {
    return { css, changed: false };
  }
  const next = normalized
    .replace(
      rootBlock,
      ":root {\n  /* Follows the Blox theme, including dark mode. */\n  --background: var(--bx-bg);\n  --foreground: var(--bx-fg);\n}",
    )
    .replace(darkBlock, "")
    .replace(bodyBlock, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s*$/, "\n");
  return { css: next, changed: true };
}
