# Blox UI

[![CI](https://github.com/bloxui/ui/actions/workflows/ci.yml/badge.svg)](https://github.com/bloxui/ui/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@bloxui/cli?label=%40bloxui%2Fcli)](https://www.npmjs.com/package/@bloxui/cli)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**Accessible React components you copy into your project and own.** 86 components and 6 ready-made screens, built on Tailwind CSS v4 and Radix, themed with plain CSS variables.

**[Docs and live examples →](https://bloxui-kit.vercel.app)**

Blox UI is not a package you install and import from `node_modules`. A small CLI copies each component's source into your project, with everything it needs. From then on it is your code: read it, change it, delete what you do not use.

## Quick start

You need a React 18 or 19 project with **Tailwind CSS v4** (Next.js, Vite, React Router…).

**1. Set up Blox UI** in your project's root folder:

```bash
npx @bloxui/cli init
```

This adds the theme and a small helper, imports the theme in your global stylesheet, and installs the two packages they need.

**2. Add components:**

```bash
npx @bloxui/cli add button dialog
```

Each component brings the other components and packages it uses. Adding `data-table` also adds the table, checkbox, input and pagination it is built from.

**3. Use them** like any other file in your project:

```tsx
import { Button } from "@/components/ui/button";

export default function Page() {
  return <Button tone="brand">Get started</Button>;
}
```

Starting from scratch? Create a Next.js app with Tailwind first (`npx create-next-app@latest`), then follow the steps above. The [installation guide](https://bloxui-kit.vercel.app/docs/installation) covers it step by step.

## What you get

| | |
|---|---|
| **Forms** | Button, Input, Textarea, Field, Form, Checkbox, Radio Group, Switch, Slider, Select, Combobox, Multi Select, Cascader, Tree Select, Transfer, Mentions, Input OTP, Phone Input, Input Number, Time Picker, Calendar, Date Picker, Color Picker, File Upload, Rating, Toggle… |
| **Overlays** | Dialog, Alert Dialog, Sheet, Drawer, Popover, Popconfirm, Tooltip, Hover Card, Dropdown Menu, Context Menu, Menubar, Command palette, Tour |
| **Navigation** | Tabs, Breadcrumb, Pagination, Navigation Menu, Sidebar, Stepper, Accordion, Tree View, Anchor, Float Button |
| **Data** | Table, Data Table (sort, search, select, paginate), Chart, Kanban, Statistic, Descriptions, List, Timeline |
| **Feedback** | Alert, Toast, Progress, Skeleton, Spinner, Empty, Result (any HTTP status), Watermark |
| **Display and layout** | Card, Badge, Avatar, Image, QR Code, Carousel, Typography, Scroll Area, Resizable, Flex, Grid, Theme Provider |
| **AI** | Chat: messages, typing indicator, suggestions and a prompt input |
| **Blocks** | Login, Sign-up, Settings, Dashboard, 404 page, error page |

Browse them all with live previews at **[bloxui-kit.vercel.app](https://bloxui-kit.vercel.app/docs/components/button)**, or list them in your terminal:

```bash
npx @bloxui/cli list
```

## Why Blox UI

- **One colour model everywhere.** Every component takes the same five tones (`brand`, `neutral`, `success`, `warning`, `danger`), so a soft danger button, badge and alert always match.
- **Forms that wire themselves.** Wrap any control in `Field` and its label, hint, error message and ARIA attributes are connected for you.
- **Less to assemble.** Pagination works out its own page list, Combobox and Data Table take data instead of markup, Tooltip is a single element.
- **Accessible by default.** Keyboard support, focus handling and screen reader names are built in and covered by tests. Kanban cards even move by keyboard and touch.
- **Your theme in one place.** Change any `--bx-*` CSS variable and every component follows. Light and dark modes are built in, and the [theme builder](https://bloxui-kit.vercel.app/docs/theming) generates the CSS for you.
- **Works with your layout.** The CLI detects your `src` folder and `@/` import alias, and writes relative imports if you have no alias.

## CLI reference

| Command | What it does |
|---|---|
| `npx @bloxui/cli init` | Set up a project |
| `npx @bloxui/cli add <names...>` | Add components or blocks (e.g. `add button block-login`) |
| `npx @bloxui/cli add --all` | Add every component |
| `npx @bloxui/cli list` | Show everything available |

Useful options: `--dry-run` to preview changes, `--overwrite` to replace files you already have, `--no-install` to skip installing packages. A file you have changed is never overwritten without `--overwrite`. See the [CLI guide](https://bloxui-kit.vercel.app/docs/cli) for everything else.

## Requirements

- React 18 or 19
- Tailwind CSS v4
- Node.js 18.17 or later to run the CLI
- TypeScript is recommended; the components are written in it

## Links

- Docs and examples: https://bloxui-kit.vercel.app
- CLI on npm: https://www.npmjs.com/package/@bloxui/cli
- Changelog: [components](packages/ui/CHANGELOG.md) · [CLI](packages/cli/CHANGELOG.md)
- Found a bug or want a component? [Open an issue](https://github.com/bloxui/ui/issues)

If Blox UI saves you time, you can [buy me a coffee ☕](https://buymeacoffee.com/harshit187).

## License

MIT
