# Blox UI

Crafted React components you own. Built with Tailwind CSS v4 and Radix UI.

> Early development. APIs can change until the first release.

## What is inside

- `packages/ui` — the components, design tokens, tests and Storybook
- `apps/www` — a Next.js preview site that shows every component

## Components

**Forms:** Button, Input, Textarea, Field, Label, Checkbox, Radio Group, Switch, Slider, Select

**Display and feedback:** Card, Badge, Avatar, Alert, Progress, Skeleton, Separator, Kbd, Spinner

**Overlays:** Dialog, Alert Dialog, Sheet, Drawer, Popover, Tooltip, Hover Card, Dropdown Menu, Context Menu, Menubar, Command

## Highlights

- **Tone × variant:** every component takes the same five tones (`brand`, `neutral`, `success`, `warning`, `danger`).
- **Field:** wires the label, hint, error and ARIA attributes to the control inside it.
- **Themeable:** override any `--bx-*` CSS variable; light and dark themes are built in.

## Development

Requires Node 22 and pnpm 9.

```bash
pnpm install
pnpm dev          # preview site on http://localhost:3000
pnpm storybook    # Storybook on http://localhost:6006
pnpm test         # component tests
pnpm typecheck
pnpm build
```

## License

MIT
