# Creating a UI Component (ui/)

This guide shows how to add a new UI component to the `ui/` folder. UI components are thin, styled wrappers around core Blox tags (from `github.com/bloxui/blox`, imported as `h`). They accept both UI‑specific options and raw core args like `h.Class`, `h.Id`, etc.

## Core Principles

- Single entry `func Component(args ...interface{}) h.Component`.
- Adapter pattern: accept both UI options and core args.
- Maintain defaults and compute classes in Go (no runtime reflection).
- Always use `h.Child(...)` for children and `h.Text(...)` for text.
- Prefer semantic CSS tokens (e.g., `bg-card`, `text-muted-foreground`).
- Add CSS/JS assets via a wrapper type only when needed (see Modal/Tabs).

## Anatomy Of A Component

1. UI arg interface: `type XArg interface { applyUIX(*xState) }`.
2. State struct: holds defaults, children, UI fields, and `baseArgs` of the underlying tag arg type.
3. Adapters:
   - `XArgAdapter` to wrap a core arg (e.g., `h.DivArg`) as a UI arg.
   - `adaptXArg(arg interface{}) XArg` to accept both UI args and core args.
4. Option wrappers (optional): small types like `VariantOpt`, `SizeOpt`, `TextOpt`, etc., that mutate state.
5. Constructor: `func X(args ...interface{}) h.Component` that:
   - Initializes defaults in state
   - Applies args via `adaptXArg`
   - Builds class string(s)
   - Builds final arg list: prepend `h.Class(...)`, append `state.baseArgs`, append children via `h.Child(...)`
   - Returns the underlying element (e.g., `h.Div(...)`, `h.Button(...)`, ...)

## Minimal Template

```go
package ui

import x "github.com/bloxui/blox"

type BadgeArg interface{ applyUIBadge(*badgeState) }

type badgeState struct {
    variant string
    children []h.Component
    baseArgs []h.SpanArg // underlying tag: span
}

// UI option wrappers
type BadgeVariant struct{ v string }
func (o BadgeVariant) applyUIBadge(s *badgeState) { s.variant = o.v }
func BadgeDefault() BadgeVariant { return BadgeVariant{"default"} }
func BadgeSecondary() BadgeVariant { return BadgeVariant{"secondary"} }

// Allow core args to pass through
type BadgeArgAdapter struct{ arg h.SpanArg }
func (a BadgeArgAdapter) applyUIBadge(s *badgeState) { s.baseArgs = append(s.baseArgs, a.arg) }

// Accept both UI and core args
func adaptBadgeArg(arg interface{}) BadgeArg {
    if ui, ok := arg.(BadgeArg); ok { return ui }
    if core, ok := arg.(h.SpanArg); ok { return BadgeArgAdapter{core} }
    return nil
}

// Optional helpers for content
type BadgeText struct{ t string }
func (o BadgeText) applyUIBadge(s *badgeState) { s.children = append(s.children, h.TextNode(o.t)) }
func TextBadge(t string) BadgeText { return BadgeText{t} }

func Badge(args ...interface{}) h.Component {
    st := &badgeState{ variant: "default" }

    for _, a := range args {
        if ad := adaptBadgeArg(a); ad != nil { ad.applyUIBadge(st) }
    }

    // classes per variant
    base := "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
    switch st.variant {
    case "default":
        base += " bg-primary text-primary-foreground"
    case "secondary":
        base += " bg-secondary text-secondary-foreground"
    }

    spanArgs := append([]h.SpanArg{ h.Class(base) }, st.baseArgs...)
    for _, c := range st.children { spanArgs = append(spanArgs, h.Child(c)) }
    return h.Span(spanArgs...)
}
```

## Common Patterns In This Repo

- Button variants and sizes: see `ui/button.go` (`getButtonClasses`, defaults, `TextOpt`, `ChildOpt`).
- Form inputs: `ui/input.go` and `ui/textarea.go` set opinionated classes and pass through `h.InputArg`/`h.TextareaArg`.
- Labeled controls: `ui/checkbox.go`, `ui/radio.go` wrap an `input` and styled checkmark inside a `label`.
- Compound components: `ui/card.go` defines `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` as separate constructors, each with its own `Arg` and state.
- Components with assets: `ui/modal.go`, `ui/tabs.go` expose CSS (and JS for modal) via a wrapper struct implementing `CSS()`/`JS()`/`Name()`.

## Step‑By‑Step: Add A New Component

1. Pick the underlying HTML tag and arg type
   - Examples: `Div + h.DivArg`, `Span + h.SpanArg`, `Button + h.ButtonArg`, `Label + h.LabelArg`.
2. Define state with sensible defaults
   - Include `children []h.Component` if the component renders children.
   - Include a `baseArgs []h.<Tag>Arg` to pass through core args.
3. Define the UI arg interface and adapter(s)
   - `type XArg interface { applyUIX(*xState) }`
   - `type XArgAdapter struct{ arg h.<Tag>Arg }`, and `adaptXArg` function.
4. Add UI option wrappers (as needed)
   - e.g., `VariantOpt`, `SizeOpt`, `TextOpt`, `ChildOpt`, `InputTypeWrapper`.
   - Keep names consistent with existing components.
5. Implement the constructor
   - Iterate args, apply to state via the adapter.
   - Compute class string(s) and any attributes.
   - Build final args: `[]h.<Tag>Arg{ h.Class(classes), ...state.baseArgs }` + children.
   - Return the underlying element `h.<Tag>(...)` or an asset‑wrapping component when needed.
6. If the component needs CSS/JS
   - Create `type <X>Assets struct{}` with `CSS() string`/`JS() string` (embed strings).
   - Create `type <X>Component struct { h.Component }` implementing `CSS()`/`JS()`/`Name()` that returns the asset strings and a stable name.
   - Return the wrapper from your constructor.
7. Try it in the demo (optional)
   - Create a small snippet in `demo/` to visually verify.

## Example Usage

```go
// Badge with UI option and core arg passthrough
ui.Badge(
    ui.BadgeSecondary(),
    h.Id("new"),
    ui.TextBadge("New"),
)

// Button with UI options + core args
ui.Button(
    ui.Outline(),
    ui.Sm(),
    ui.Text("Save"),
    h.Id("save-btn"),
    h.ButtonType("submit"),
)

// Card compound pieces
ui.Card(
    h.Class("max-w-md"),
    h.Child(ui.CardHeader(
        h.Child(ui.CardTitle(h.Text("Welcome"))),
        h.Child(ui.CardDescription(h.Text("Get started quickly"))),
    )),
    h.Child(ui.CardContent(/* ... */)),
    h.Child(ui.CardFooter(/* ... */)),
)
```

## Naming & Organization

- Filenames: lowercase `component.go` (e.g., `button.go`, `card.go`).
- Exported funcs/types for public API: `Badge`, `BadgeVariant`, `BadgeDefault`, etc.
- Subcomponents live in the same file if closely related (see `card.go`).
- Keep class strings readable and consistent with existing components.

## Do/Don’t

- Do: accept both UI options and `h.*Arg` core options.
- Do: provide safe defaults and semantic classes.
- Do: keep the constructor small and predictable.
- Don’t: create custom `Child`/`Text` helpers unless you need extra behavior — prefer `h.Child`/`h.Text`.
- Don’t: couple components to runtime state; prefer CSS‑only interactivity or asset wrappers when needed.

## References In Repo

- `ui/button.go` – variants/sizes and text/child wrappers
- `ui/card.go` – compound subcomponents pattern
- `ui/checkbox.go`, `ui/radio.go` – labeled control pattern
- `ui/input.go`, `ui/textarea.go` – form input styling
- `ui/modal.go`, `ui/tabs.go` – asset‑backed components
- `CLAUDE.md` – additional architectural guidance and a template
