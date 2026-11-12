/**
 * Hand-written facts about each registry item: what it is and where it belongs.
 * Everything else (files, npm dependencies, which other items it needs) is worked
 * out from the source by scripts/build-registry.mjs.
 *
 * Adding a component? Add one entry here. The build fails if an entry is missing.
 */

/** @typedef {{ title: string, description: string, category: string }} ItemMeta */

/** @type {Record<string, ItemMeta>} */
export const components = {
  accordion: { title: "Accordion", description: "Stacked headings that expand to show their content.", category: "Disclosure" },
  alert: { title: "Alert", description: "An inline message with a tone, icon, actions and optional dismiss.", category: "Feedback" },
  "alert-dialog": { title: "Alert Dialog", description: "A dialog that interrupts the user and requires a decision.", category: "Overlays" },
  "aspect-ratio": { title: "Aspect Ratio", description: "Keeps content at a fixed width-to-height ratio.", category: "Layout" },
  avatar: { title: "Avatar", description: "A user image that falls back to initials, with status and grouping.", category: "Display" },
  badge: { title: "Badge", description: "A small label for status, counts or categories.", category: "Display" },
  breadcrumb: { title: "Breadcrumb", description: "Shows where the current page sits in the hierarchy.", category: "Navigation" },
  button: { title: "Button", description: "Triggers an action, in any tone and variant, with loading and icons.", category: "Forms" },
  "button-group": { title: "Button Group", description: "Joins related buttons into one segmented control.", category: "Forms" },
  calendar: { title: "Calendar", description: "A month grid for picking a day, several days or a range.", category: "Forms" },
  card: { title: "Card", description: "A container that groups related content and actions.", category: "Display" },
  carousel: { title: "Carousel", description: "Swipeable slides with arrows, dots and keyboard support.", category: "Display" },
  chart: { title: "Chart", description: "Themed Recharts wrapper with tooltip, legend and a validated palette.", category: "Data" },
  checkbox: { title: "Checkbox", description: "A box the user can tick, with an indeterminate state.", category: "Forms" },
  collapsible: { title: "Collapsible", description: "A single region that shows and hides with an animation.", category: "Disclosure" },
  combobox: { title: "Combobox", description: "A searchable select driven by an options array.", category: "Forms" },
  command: { title: "Command", description: "A searchable list of actions and a Ctrl/Cmd+K palette.", category: "Overlays" },
  "context-menu": { title: "Context Menu", description: "A menu opened by right-click or long-press.", category: "Overlays" },
  "data-table": { title: "Data Table", description: "A table with sorting, search, pagination and row selection.", category: "Data" },
  "date-picker": { title: "Date Picker", description: "A field that opens a calendar to pick a date or a range.", category: "Forms" },
  dialog: { title: "Dialog", description: "A window over the page, in five sizes with a scrollable body.", category: "Overlays" },
  drawer: { title: "Drawer", description: "A bottom panel the user can drag down to dismiss.", category: "Overlays" },
  "dropdown-menu": { title: "Dropdown Menu", description: "A menu of actions opened from a button.", category: "Overlays" },
  empty: { title: "Empty", description: "An empty state with an icon, message and next steps.", category: "Feedback" },
  field: { title: "Field", description: "Wires a label, hint and error to the control inside it.", category: "Forms" },
  "hover-card": { title: "Hover Card", description: "A preview shown when hovering or focusing a link.", category: "Overlays" },
  input: { title: "Input", description: "A text field with leading and trailing slots.", category: "Forms" },
  "input-otp": { title: "Input OTP", description: "A one-time-code field with grouped boxes.", category: "Forms" },
  kbd: { title: "Kbd", description: "Displays a keyboard key or shortcut.", category: "Display" },
  label: { title: "Label", description: "An accessible label for a form control.", category: "Forms" },
  menubar: { title: "Menubar", description: "A desktop-style row of menus.", category: "Overlays" },
  "navigation-menu": { title: "Navigation Menu", description: "A site header menu whose items open panels of links.", category: "Navigation" },
  pagination: { title: "Pagination", description: "Page navigation that works out its own page list.", category: "Navigation" },
  popover: { title: "Popover", description: "Floating content anchored to a trigger.", category: "Overlays" },
  progress: { title: "Progress", description: "A progress bar, with an indeterminate mode.", category: "Feedback" },
  "radio-group": { title: "Radio Group", description: "A set of options where only one can be chosen.", category: "Forms" },
  resizable: { title: "Resizable", description: "Panels the user can resize by dragging a handle.", category: "Layout" },
  "scroll-area": { title: "Scroll Area", description: "A scroll container with thin, themed scrollbars.", category: "Layout" },
  select: { title: "Select", description: "A list of options opened from a trigger.", category: "Forms" },
  separator: { title: "Separator", description: "A dividing line, optionally with a label.", category: "Layout" },
  sheet: { title: "Sheet", description: "A panel that slides in from any screen edge.", category: "Overlays" },
  sidebar: { title: "Sidebar", description: "A collapsible app sidebar that becomes a sheet on mobile.", category: "Navigation" },
  skeleton: { title: "Skeleton", description: "A shimmering placeholder shown while content loads.", category: "Feedback" },
  slider: { title: "Slider", description: "Picks a value or a range by dragging a thumb.", category: "Forms" },
  spinner: { title: "Spinner", description: "An animated loading indicator.", category: "Feedback" },
  switch: { title: "Switch", description: "An on/off toggle.", category: "Forms" },
  table: { title: "Table", description: "A styled table with striped, dense and sticky-header modes.", category: "Data" },
  tabs: { title: "Tabs", description: "Switches between panels, as underline tabs or pills.", category: "Navigation" },
  textarea: { title: "Textarea", description: "A multi-line text field that can grow with its content.", category: "Forms" },
  toast: { title: "Toast", description: "Brief notifications raised from anywhere with toast().", category: "Feedback" },
  toggle: { title: "Toggle", description: "A two-state button, alone or in a group.", category: "Forms" },
  tooltip: { title: "Tooltip", description: "A short label shown on hover or focus.", category: "Overlays" },
};

/** Shared helpers that components import. Installed automatically when a component needs them. */
/** @type {Record<string, ItemMeta & { file: string }>} */
export const libs = {
  cn: { file: "cn.ts", title: "cn", description: "Merges class names, resolving Tailwind conflicts.", category: "Lib" },
  tone: { file: "tone.ts", title: "Tone", description: "Maps the five tones onto local CSS variables.", category: "Lib" },
  icons: { file: "icons.tsx", title: "Icons", description: "The small icon set the components use internally.", category: "Lib" },
  "field-context": { file: "field-context.tsx", title: "Field context", description: "Lets a control read its label, hint and error wiring from Field.", category: "Lib" },
  overlay: { file: "overlay.tsx", title: "Overlay styles", description: "Shared styles for dialogs, popovers and menus.", category: "Lib" },
  control: { file: "control.ts", title: "Control styles", description: "Shared styles for button-like form triggers.", category: "Lib" },
};

/** The stylesheet with the design tokens. Installed by `init`. */
export const theme = {
  file: "blox.css",
  title: "Theme",
  description: "Design tokens for light and dark themes, exposed as Tailwind utilities.",
  category: "Style",
};

/** What `init` installs before any component. */
export const initItems = ["theme", "cn"];
