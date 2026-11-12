# Registry

The registry is how Blox UI components reach a project. Each component, shared helper and the theme is published as one JSON file that carries its source code and says what else it needs. The CLI downloads these files and copies the source into the user's project.

## Build it

```bash
pnpm registry:build    # regenerate apps/www/public/r/*.json
pnpm registry:check    # fail if the committed files are out of date
pnpm registry:verify   # install every item into a scratch project and type-check it
```

The generated files are committed, so the registry has a stable URL as soon as the repo or the site is public, and changes to it show up in review. `pnpm test` runs the check and the verification, and the preview site rebuilds the registry before `dev` and `build`. It is served at `/r/index.json` and `/r/<name>.json`.

After changing a component, run `pnpm registry:build` and commit the result.

## How it is made

`scripts/build-registry.mjs` reads the real source in `packages/ui/src`, so the registry cannot drift from the components:

- **Files:** every `.tsx` in `src/components` (tests and stories excluded) becomes a `ui` item, and every `.tsx` in `src/blocks` becomes a `block` item named `block-<name>`. The helpers listed in `meta.mjs` become `lib` items, and `blox.css` becomes the `theme` item.
- **npm dependencies:** worked out from each file's imports and pinned to the version range in `packages/ui/package.json`. React is left out because every project has it.
- **Registry dependencies:** `./button`, `../components/button` and `../lib/cn` imports become the names of the other items to install.
- **Titles, descriptions, categories:** written by hand in `meta.mjs`. This is the only part to edit when adding a component.

The build fails when a component has no `meta.mjs` entry, an entry has no file, a dependency is unknown or circular, or a package is imported without being in `package.json`.

## Item format

```jsonc
{
  "name": "dialog",
  "type": "ui",                      // "ui" | "block" | "lib" | "style"
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
| `block` | `blocks/login.tsx` | `components/blocks/login.tsx` |
| `lib` | `lib/cn.ts` | `lib/cn.ts` |
| `style` | `blox.css` | `styles/blox.css` |

## Verification

`scripts/verify-registry.mjs` installs all items into a temporary project that uses a different layout from this repo (`components/ui`, `components/blocks`, `lib`, with `@/…` imports) and runs TypeScript over it. It catches a file that imports something the registry does not ship, and aliases that do not resolve.
