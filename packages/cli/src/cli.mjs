/**
 * blox — copies Blox UI components from the registry into your project.
 *
 *   blox init                 set up blox.json, the theme and the cn helper
 *   blox add button dialog    add components (and everything they need)
 *   blox add --all            add every component
 *   blox list                 show what the registry offers
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, posix } from "node:path";
import {
  adaptStarterStyles,
  addThemeImport,
  CONFIG_FILE,
  DEFAULT_REGISTRY,
  detectLayout,
  detectPackageManager,
  installCommand,
  readConfig,
  relativeImport,
  writeConfig,
} from "./project.mjs";
import { applyAliases, collectDependencies, resolveItems } from "./registry.mjs";

const HELP = `Usage: blox <command> [options]

Commands:
  init              Create ${CONFIG_FILE}, add the theme and the cn helper
  add <names...>    Add components or blocks and everything they need
  list              List what the registry offers

Options:
  --all             add: every component (blocks excluded)
  --overwrite       add: replace files that already exist
  --dry-run         Show what would change without writing anything
  --no-install      Skip installing npm packages (print the command instead)
  --force           init: recreate ${CONFIG_FILE} even if it exists
  --registry <url>  Registry URL or local folder (default: ${DEFAULT_REGISTRY})
  --cwd <path>      Project folder (default: current folder)
  -h, --help        Show this help
`;

export class CliError extends Error {}

export function parseArgs(argv) {
  const options = { _: [], install: true };
  const flags = { "--all": "all", "--overwrite": "overwrite", "--dry-run": "dryRun", "--force": "force" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "-h" || arg === "--help") options.help = true;
    else if (arg === "--no-install") options.install = false;
    else if (flags[arg]) options[flags[arg]] = true;
    else if (arg === "--registry" || arg === "--cwd") {
      const value = argv[index + 1];
      if (!value || value.startsWith("-")) throw new CliError(`${arg} needs a value.`);
      options[arg.slice(2)] = value;
      index += 1;
    } else if (arg.startsWith("-")) throw new CliError(`Unknown option "${arg}". Run "blox --help".`);
    else options._.push(arg);
  }
  return options;
}

/** Loads registry files from a URL or a local folder. */
export function createRegistry(source) {
  const cache = new Map();
  async function load(file) {
    if (cache.has(file)) return cache.get(file);
    const promise = (async () => {
      if (/^https?:\/\//.test(source)) {
        const url = `${source.replace(/\/$/, "")}/${file}`;
        let response;
        try {
          response = await fetch(url);
        } catch (error) {
          throw new CliError(`Could not reach the registry at ${url} (${error.cause?.code ?? error.message}).`);
        }
        if (response.status === 404) return null;
        if (!response.ok) throw new CliError(`The registry returned ${response.status} for ${url}.`);
        return response.json();
      }
      const path = join(source, file);
      if (!existsSync(path)) return null;
      return JSON.parse(await readFile(path, "utf8"));
    })();
    cache.set(file, promise);
    return promise;
  }

  return {
    async index() {
      const index = await load("index.json");
      if (!index) throw new CliError(`No registry found at ${source}.`);
      return index;
    },
    async item(name) {
      const item = await load(`${name}.json`);
      if (!item) throw new CliError(`"${name}" is not in the registry. Run "blox list" to see what is.`);
      return item;
    },
  };
}

const log = {
  out: (message = "") => process.stdout.write(`${message}\n`),
  step: (message) => process.stdout.write(`  ${message}\n`),
};

/** Folder and import alias for each item type, from the project's config. */
function placement(config, cwd) {
  const aliasFor = (key) => config.aliases[key];
  return {
    ui: { dir: join(cwd, config.dirs.ui) },
    block: { dir: join(cwd, config.dirs.blocks) },
    lib: { dir: join(cwd, config.dirs.lib) },
    style: { dir: join(cwd, config.dirs.styles) },
    aliasesFor(type) {
      // Without a project alias, imports are written as relative paths from the file's own folder.
      const from = type === "block" ? config.dirs.blocks : type === "lib" ? config.dirs.lib : config.dirs.ui;
      return {
        ui: aliasFor("ui") ?? relativeImport(from, config.dirs.ui),
        lib: aliasFor("lib") ?? relativeImport(from, config.dirs.lib),
      };
    },
  };
}

/** Writes the given items into the project. Returns what it did, per file. */
async function installItems(names, { registry, config, cwd, overwrite, dryRun }) {
  // Fetch items breadth-first until every dependency is known, then order them.
  const itemsByName = {};
  let pending = [...names];
  while (pending.length > 0) {
    const fetched = await Promise.all(pending.map((name) => registry.item(name)));
    pending = [];
    for (const item of fetched) {
      itemsByName[item.name] = item;
      for (const dependency of item.registryDependencies) {
        if (!itemsByName[dependency] && !pending.includes(dependency)) pending.push(dependency);
      }
    }
    pending = pending.filter((name) => !itemsByName[name]);
  }

  const ordered = resolveItems(names, itemsByName);
  const where = placement(config, cwd);
  const results = [];

  for (const name of ordered) {
    const item = itemsByName[name];
    for (const file of item.files) {
      const target = join(where[item.type].dir, posix.basename(file.path));
      const shown = posix.relative(cwd.split("\\").join("/"), target.split("\\").join("/"));
      const existed = existsSync(target);
      const content = item.type === "style" ? file.content : applyAliases(file.content, where.aliasesFor(item.type));
      if (existed) {
        const current = await readFile(target, "utf8");
        if (current.replace(/\r\n/g, "\n") === content) {
          results.push({ name, path: shown, action: "unchanged" });
          continue;
        }
        if (!overwrite) {
          results.push({ name, path: shown, action: "skipped" });
          continue;
        }
      }
      if (!dryRun) {
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, content);
      }
      results.push({ name, path: shown, action: existed ? "written" : "created" });
    }
  }

  return { ordered, results, dependencies: collectDependencies(ordered, itemsByName) };
}

function reportFiles(results, dryRun) {
  const verbs = {
    created: dryRun ? "would create" : "created",
    written: dryRun ? "would replace" : "replaced",
    unchanged: "unchanged",
    skipped: "skipped (exists, use --overwrite)",
  };
  for (const result of results) log.step(`${verbs[result.action].padEnd(12)} ${result.path}`);
}

async function installDependencies(dependencies, { cwd, install, dryRun }) {
  // Packages the project already lists are left alone, so its own versions win.
  const project = JSON.parse(await readFile(join(cwd, "package.json"), "utf8"));
  const present = { ...project.dependencies, ...project.devDependencies, ...project.peerDependencies };
  const packages = Object.entries(dependencies)
    .filter(([name]) => !(name in present))
    .map(([name, range]) => `${name}@${range}`);
  if (packages.length === 0) return;
  const manager = detectPackageManager(cwd);
  const [command, args] = installCommand(manager, packages);
  const printed = `${command} ${args.join(" ")}`;
  if (!install || dryRun) {
    log.out(`\nInstall the packages these files need:\n  ${printed}`);
    return;
  }
  log.out(`\nInstalling ${packages.length} package${packages.length === 1 ? "" : "s"} with ${manager}…`);
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) throw new CliError(`Installing packages failed. Run it yourself:\n  ${printed}`);
}

async function init(options, cwd) {
  const existing = await readConfig(cwd).catch(() => null);
  if (existing && !options.force) {
    throw new CliError(`${CONFIG_FILE} already exists. Use "blox add <name>", or "blox init --force" to recreate it.`);
  }
  if (!existsSync(join(cwd, "package.json"))) {
    throw new CliError(`No package.json in ${cwd}. Run init in your project's root folder.`);
  }

  const layout = await detectLayout(cwd);
  const config = {
    registry: options.registry ?? DEFAULT_REGISTRY,
    aliases: layout.aliases ?? {},
    dirs: layout.dirs,
    css: layout.css,
  };

  const registry = createRegistry(config.registry);
  const index = await registry.index();

  log.out(`Setting up Blox UI in ${cwd}`);
  if (!layout.aliases) log.step('No "@/*" path alias found in tsconfig; imports will be relative.');
  if (!options.dryRun) await writeConfig(cwd, config);
  log.step(`${options.dryRun ? "would create" : "created"}      ${CONFIG_FILE}`);

  const { results, dependencies } = await installItems(index.init, {
    registry,
    config,
    cwd,
    overwrite: options.force,
    dryRun: options.dryRun,
  });
  reportFiles(results, options.dryRun);

  const themePath = posix.join(config.dirs.styles, "blox.css");
  if (config.css) {
    const cssPath = join(cwd, config.css);
    const importPath = relativeImport(posix.dirname(config.css), config.dirs.styles) + "/blox.css";
    const updated = addThemeImport(await readFile(cssPath, "utf8"), importPath);
    // create-next-app's starter colours would otherwise hide the theme.
    const adapted = adaptStarterStyles(updated.css);
    if (updated.changed || adapted.changed) {
      if (!options.dryRun) await writeFile(cssPath, adapted.css);
      const notes = [updated.changed && "imports the theme", adapted.changed && "starter colours now follow the theme"];
      log.step(`${options.dryRun ? "would update" : "updated"}      ${config.css} (${notes.filter(Boolean).join("; ")})`);
    }
    if (!updated.changed && updated.reason !== "already imported") {
      log.out(`\nAdd the theme to ${config.css} after Tailwind (${updated.reason}):\n  @import "${importPath}";`);
    }
  } else {
    log.out(`\nNo global stylesheet found. Import the theme after Tailwind in yours:\n  @import "tailwindcss";\n  @import "./${themePath}";`);
  }

  await installDependencies(dependencies, { cwd, install: options.install, dryRun: options.dryRun });
  log.out(`\nDone. Add components with:\n  npx @bloxui/cli add button`);
}

async function add(options, cwd) {
  const config = await readConfig(cwd);
  if (!config) throw new CliError(`No ${CONFIG_FILE} found. Run "blox init" first.`);
  const registry = createRegistry(options.registry ?? config.registry ?? DEFAULT_REGISTRY);

  let names = options._;
  if (options.all) {
    const index = await registry.index();
    names = index.items.filter((item) => item.type === "ui").map((item) => item.name);
  }
  if (names.length === 0) throw new CliError('Name at least one component, e.g. "blox add button", or use --all.');

  const { ordered, results, dependencies } = await installItems(names, {
    registry,
    config,
    cwd,
    overwrite: options.overwrite,
    dryRun: options.dryRun,
  });

  const extra = ordered.filter((name) => !names.includes(name));
  log.out(`Adding ${names.join(", ")}${extra.length ? ` (with ${extra.join(", ")})` : ""}`);
  reportFiles(results, options.dryRun);
  await installDependencies(dependencies, { cwd, install: options.install, dryRun: options.dryRun });

  const skipped = results.filter((result) => result.action === "skipped").length;
  if (skipped > 0) log.out(`\n${skipped} file${skipped === 1 ? " was" : "s were"} left as they are because you changed them. Use --overwrite to replace.`);
}

async function list(options, cwd) {
  const config = await readConfig(cwd).catch(() => null);
  const registry = createRegistry(options.registry ?? config?.registry ?? DEFAULT_REGISTRY);
  const index = await registry.index();
  const groups = {};
  for (const item of index.items) {
    if (item.type === "lib" || item.type === "style") continue;
    (groups[item.category] ??= []).push(item);
  }
  for (const [category, items] of Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))) {
    log.out(`\n${category}`);
    for (const item of items) log.step(`${item.name.padEnd(18)} ${item.description}`);
  }
}

export async function run(argv) {
  const options = parseArgs(argv);
  const [command, ...rest] = options._;
  options._ = rest;
  if (options.help || !command) {
    log.out(HELP);
    return;
  }
  const cwd = options.cwd ? join(process.cwd(), options.cwd) : process.cwd();
  const commands = { init, add, list };
  if (!commands[command]) throw new CliError(`Unknown command "${command}". Run "blox --help".`);
  await commands[command](options, cwd);
}
