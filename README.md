# Blox UI

[![CI](https://github.com/bloxui/ui/actions/workflows/ci.yml/badge.svg)](https://github.com/bloxui/ui/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@bloxui/cli?label=%40bloxui%2Fcli)](https://www.npmjs.com/package/@bloxui/cli)

Crafted React components you own. Built with Tailwind CSS v4 and Radix UI.

**Docs and live examples: [bloxui-kit.vercel.app](https://bloxui-kit.vercel.app)**

> Early development. APIs can change until the first release.

## Use it in your project

```bash
npx @bloxui/cli init
npx @bloxui/cli add button dialog
```

The CLI copies each component's source into your project, with everything it needs. See [packages/cli](packages/cli/README.md) for options.

## What is inside

- `packages/ui` — the components, blocks, design tokens, tests and Storybook
- `packages/cli` — the `blox` command that installs components from the registry
- `apps/www` — the docs website: a page per component with a live example, its code and an API table, guides, a theme builder, blocks, and the registry it serves
- `registry` and `scripts` — build the registry JSON the CLI installs from ([details](registry/README.md))

## Components

**Forms:** Button, Button Group, Input, Textarea, Field, Label, Checkbox, Radio Group, Switch, Slider, Select, Combobox, Multi Select, Cascader, Tree Select, Transfer, Mentions, Input OTP, Phone Input, Input Number, Time Picker, Calendar, Date Picker, Color Picker, File Upload, Rating, Toggle, Toggle Group, Form

**Display and feedback:** Card, Badge, Avatar, Alert, Toast, Progress, Skeleton, Spinner, Empty, Separator, Kbd, Carousel, Timeline, Typography, Descriptions, List, Statistic, Image, QR Code, Result, Watermark

**Overlays:** Dialog, Alert Dialog, Sheet, Drawer, Popover, Tooltip, Hover Card, Dropdown Menu, Context Menu, Menubar, Command, Popconfirm, Tour

**Navigation:** Tabs, Breadcrumb, Pagination, Navigation Menu, Sidebar, Accordion, Collapsible, Stepper, Tree View, Anchor, Float Button

**Data and layout:** Table, Data Table, Chart, Scroll Area, Aspect Ratio, Resizable, Kanban, Flex, Grid, Space, Affix, Theme Provider

**AI:** Chat (messages, typing indicator, suggestions, input)

**Blocks:** Login, Signup, Settings, Dashboard, 404 page, Error page (any status code)

## Highlights

- **Tone × variant:** every component takes the same five tones (`brand`, `neutral`, `success`, `warning`, `danger`).
- **Field:** wires the label, hint, error and ARIA attributes to the control inside it.
- **Themeable:** override any `--bx-*` CSS variable; light and dark themes are built in.

## Development

Requires Node 22 and pnpm 9.

```bash
pnpm install
pnpm dev          # docs site on http://localhost:3000
pnpm storybook    # Storybook on http://localhost:6006
pnpm test         # component, CLI and registry tests
pnpm registry:build   # regenerate the registry JSON after changing a component
pnpm typecheck
pnpm build
```

## Releasing

Versions and changelogs are managed with [Changesets](https://github.com/changesets/changesets). Two packages are versioned:

- `@bloxui/cli`, published to npm
- `@blox-ui/ui`, the components; not published to npm, but its version is shown in the registry

**1. Describe each change** in the pull request (or commit) that makes it:

```bash
pnpm changeset
```

Pick the packages that changed, choose patch (fix), minor (new feature) or major (breaking change), and write one line for the changelog. This adds a small file in `.changeset/`; commit it with your change.

**2. When you are ready to release**, turn the collected changesets into versions and changelog entries:

```bash
pnpm version-packages
```

This bumps the versions, writes `CHANGELOG.md` in each package, rebuilds the registry, and deletes the used changeset files. Review the diff, then commit and push it.

**3. Publish the CLI** to npm (needs `npm login` with two-factor authentication):

```bash
pnpm release
```

The docs site and registry update on their own when the commit reaches `main`.

## License

MIT
