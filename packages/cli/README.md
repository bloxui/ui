# @bloxui/cli

Adds [Blox UI](https://github.com/bloxui/ui) components to your project. The CLI copies each component's source into your codebase, so you own it and can change it freely.

Requires Node 18.17 or later, React 18 or 19, and Tailwind CSS v4.

## Set up

Run this in your project's root folder:

```bash
npx @bloxui/cli init
```

It:

- creates `blox.json` with where components go and how they import each other
- adds the theme (`styles/blox.css`) and the `cn` helper (`lib/cn.ts`)
- imports the theme in your global stylesheet, right after `@import "tailwindcss"`
- installs the packages those files need with your package manager

If your project has a `src` folder, everything goes inside it. If `tsconfig.json` maps `@/*` to that folder, imports use `@/…`; otherwise they are written as relative paths.

## Add components

```bash
npx @bloxui/cli add button dialog
npx @bloxui/cli add data-table      # also adds table, pagination, checkbox, input…
npx @bloxui/cli add block-login     # a ready-made screen
npx @bloxui/cli add --all           # every component
```

Each component brings the other components and helpers it uses. A file you have changed is never overwritten unless you pass `--overwrite`.

## See what is available

```bash
npx @bloxui/cli list
```

## Options

| Option | Does |
|---|---|
| `--overwrite` | Replace files that already exist |
| `--dry-run` | Show what would change, write nothing |
| `--no-install` | Skip installing packages and print the command instead |
| `--force` | `init`: recreate `blox.json` |
| `--registry <url>` | Use another registry, a URL or a local folder |
| `--cwd <path>` | Run in another folder |

## blox.json

```json
{
  "registry": "https://raw.githubusercontent.com/bloxui/ui/main/apps/www/public/r",
  "aliases": { "ui": "@/components/ui", "lib": "@/lib", "blocks": "@/components/blocks" },
  "dirs": { "ui": "src/components/ui", "lib": "src/lib", "blocks": "src/components/blocks", "styles": "src/styles" },
  "css": "src/app/globals.css"
}
```

`dirs` are where files are written. `aliases` are the import paths written into them; leave it empty (`{}`) to use relative imports. Edit either to match your layout.
