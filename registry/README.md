# Registry

The registry is how Blox UI components reach a project. Each component, shared helper and the theme is published as one JSON file that carries its source code and says what else it needs. The CLI downloads these files and copies the source into the user's project.

## Build it

```bash
pnpm registry:build   # writes apps/www/public/r/*.json
pnpm registry:check   # validates without writing
```

The preview site builds the registry before `dev` and `build`, so it is served at `/r/index.json` and `/r/<name>.json`. The output folder is generated and not committed.

## How it is made

`scripts/build-registry.mjs` reads the real source in `packages/ui/src`, so the registry cannot drift from the components:

- **Files:** every `.tsx` in `src/components` (tests and stories excluded) becomes a `ui` item. The helpers listed in `meta.mjs` become `lib` items, and `blox.css` becomes the `theme` item.
- **npm dependencies:** worked out from each file's imports and pinned to the version range in `packages/ui/package.json`. React is left out because every project has it.
- **Registry dependencies:** `./button` and `../lib/cn` imports become the names of the other items to install.
- **Titles, descriptions, categories:** written by hand in `meta.mjs`. This is the only part to edit when adding a component.

The build fails when a component has no `meta.mjs` entry, an entry has no file, a dependency is unknown or circular, or a package is imported without being in `package.json`.

## Item format

```jsonc
{
  "name": "dialog",
  "type": "ui",                      // "ui" | "lib" | "style"
  "title": "Dialog",
  "description": "A window over the page, in five sizes with a scrollable body.",
  "category": "Overlays",
  "dependencies": { "radix-ui": "^1.8.1" },          // npm packages to install
  "registryDependencies": ["cn", "icons", "overlay"], // other items to install first
  "files": [{ "path": "ui/dialog.tsx", "content": "…source…" }]
}
```

`index.json` lists every item without its file contents, plus:

- `init`: the items installed before any component (`theme` and `cn`).
- `aliases`: the import prefixes used inside file contents.

## Import aliases

Source files import each other with relative paths. In the registry these are rewritten to two aliases so the files work in any folder layout:

| In the registry | Means | Example |
|---|---|---|
| `~ui/<name>` | another component | `import { Button } from "~ui/button"` |
| `~lib/<name>` | a shared helper | `import { cn } from "~lib/cn"` |

The CLI replaces `~ui` and `~lib` with the paths from the user's configuration (for example `@/components/ui` and `@/lib`).

## File paths

`files[].path` is relative to a base folder chosen by the CLI:

| Type | Path | Typical destination |
|---|---|---|
| `ui` | `ui/dialog.tsx` | `components/ui/dialog.tsx` |
| `lib` | `lib/cn.ts` | `lib/cn.ts` |
| `style` | `blox.css` | `styles/blox.css` |
