# Blox UI

Crafted React components you own. Built with Tailwind CSS v4 and Radix UI.

> Early development. APIs can change until the first release.

## What is inside

- `packages/ui` — the components, design tokens, tests and Storybook
- `apps/www` — a Next.js preview site that shows every component and serves the registry
- `registry` and `scripts` — build the registry JSON the CLI installs from ([details](registry/README.md))

## Components

**Forms:** Button, Button Group, Input, Textarea, Field, Label, Checkbox, Radio Group, Switch, Slider, Select, Combobox, Input OTP, Calendar, Date Picker, Toggle, Toggle Group

**Display and feedback:** Card, Badge, Avatar, Alert, Toast, Progress, Skeleton, Spinner, Empty, Separator, Kbd, Carousel

**Overlays:** Dialog, Alert Dialog, Sheet, Drawer, Popover, Tooltip, Hover Card, Dropdown Menu, Context Menu, Menubar, Command

**Navigation:** Tabs, Breadcrumb, Pagination, Navigation Menu, Sidebar, Accordion, Collapsible

**Data and layout:** Table, Data Table, Chart, Scroll Area, Aspect Ratio, Resizable

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
pnpm test         # component tests, registry tests and registry validation
pnpm registry:build   # generate the registry JSON
pnpm typecheck
pnpm build
```

## License

MIT
