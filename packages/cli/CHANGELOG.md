# @bloxui/cli

## 0.0.2

### Patch Changes

- Fix two problems found when installing every component into a fresh Next.js 16 app: `themeScript` now lives in `lib/theme-script` so a server layout can call it without breaking the build, and `init` makes the create-next-app starter colours follow the Blox theme instead of hiding it.

## 0.0.1

First public release.

- `init` sets up a project: detects the `src` folder, the `@/*` import alias from `tsconfig.json`, the global stylesheet and the package manager; writes `blox.json`; adds the theme and the `cn` helper; and imports the theme after Tailwind.
- `add <names...>` installs components and blocks with every component, helper and npm package they need, rewriting imports to the project's alias or to relative paths. Files you have changed are left alone unless you pass `--overwrite`, and packages your project already lists keep their version.
- `add --all` installs every component; `list` shows what the registry offers.
- Options: `--dry-run`, `--no-install`, `--overwrite`, `--force`, `--registry` (a URL or a local folder) and `--cwd`.
- The default registry is the docs site, https://bloxui-kit.vercel.app/r.
- No runtime dependencies; requires Node 18.17 or later.
