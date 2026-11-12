# @blox-ui/ui

## 0.0.2

### Patch Changes

- Fix two problems found when installing every component into a fresh Next.js 16 app: `themeScript` now lives in `lib/theme-script` so a server layout can call it without breaking the build, and `init` makes the create-next-app starter colours follow the Blox theme instead of hiding it.

## 0.0.1

First public release: 86 components, 6 blocks and the theme.

### Foundations

- Design tokens for light and dark themes as CSS variables, exposed as Tailwind v4 utilities.
- Five tones (`brand`, `neutral`, `success`, `warning`, `danger`) shared by every component, each with fill, hover, text-on-fill, soft and coloured-text roles.
- An eight-colour chart palette checked for colour-blind separation in both themes.
- Native scrollbars and form controls follow the active theme.

### Components

- **Forms:** Button, Button Group, Input, Textarea, Field, Label, Form (react-hook-form), Checkbox, Radio Group, Switch, Slider, Select, Combobox, Multi Select, Cascader, Tree Select, Transfer, Mentions, Input OTP, Phone Input, Input Number, Time Picker, Calendar, Date Picker, Color Picker, File Upload, Rating, Toggle, Toggle Group.
- **Display:** Card, Badge, Avatar, Kbd, Carousel, Timeline, Typography, Descriptions, List, Statistic, Image, QR Code.
- **Feedback:** Alert, Toast, Progress, Skeleton, Spinner, Empty, Result, Watermark.
- **Overlays:** Dialog, Alert Dialog, Sheet, Drawer, Popover, Popconfirm, Tooltip, Hover Card, Dropdown Menu, Context Menu, Menubar, Command, Tour.
- **Navigation:** Tabs, Breadcrumb, Pagination, Navigation Menu, Sidebar, Stepper, Anchor, Float Button.
- **Disclosure:** Accordion, Collapsible, Tree View.
- **Data and layout:** Table, Data Table, Chart, Kanban, Scroll Area, Aspect Ratio, Resizable, Separator, Flex, Grid, Space, Affix, Theme Provider.
- **AI:** Chat (message log, messages, typing indicator, suggestions, input).

### Blocks

- Login, Signup, Settings, Dashboard, 404 page and an error page for any HTTP status code.

### Accessibility

- Keyboard support and screen reader names throughout, built on Radix primitives where they exist.
- `Field` wires labels, hints, errors and ARIA attributes to any control inside it.
- Kanban cards move by mouse, touch (press and hold) or keyboard, and every move is announced.
