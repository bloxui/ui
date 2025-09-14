# UI Component Authoring Guide

This guide explains how to add a new `ui` element with a strict, Go‑idiomatic API that matches existing components (Button, Card, Input, Checkbox, Modal).

## Core Principles

- Strict typing: Functions accept only the correct `x.*Arg` for the underlying tag (e.g., `x.DivArg`, `x.AArg`, `x.ButtonArg`). Avoid `interface{}` and adapters.
- Prefixed helpers: Any element‑specific helpers are prefixed with the element name (e.g., `ButtonDefault`, `ButtonOutline`, `CardTitle`). The renderer is the element name (e.g., `Button`, `Card`, `Modal`).
- Content via core only: Use `x.C` for children and `x.T` (or `x.Text`) for text. Do not create new text/child wrappers.
- CSS first: Prefer CSS state (e.g., `data-*`, `:target`, `:checked`, sibling selectors). Add JS only when 100% necessary; expose via `.JS()` on a small wrapper. Likewise for `.CSS()`.
- Accessibility by default: Correct semantics (role/aria). For inputs, ensure a native `<input>` drives state; for button‑like links, add `role`/`aria` if needed.

## API Shape

- Renderer (strict):
  - `func Element(args ...x.<Tag>Arg) x.Component`
  - Example: `func Badge(args ...x.SpanArg) x.Component`
- Style helpers (optional, prefixed, strict):
  - Variants/sizes as `x.<Tag>Arg` (e.g., `ButtonOutline()`, `ButtonSm()`)
  - AsChild helper: `ElementClass(args ...x.<Tag>Arg) x.Global` returning one `x.Class` with base + variant + size
- Defaults (optional):
  - The renderer may prepend base classes and inject default variant/size if none provided.

## Styling & Behavior

- Base classes: Prepend inside the renderer so callers don’t repeat them.
- Variants/sizes: Return `x.Global` (or `x.<Tag>Arg`) that only add classes. If you need to detect presence for defaults, wrap `x.Global` in a small internal type (e.g., `buttonVariantArg`) that implements `x.<Tag>Arg` and carries a marker/class string.
- AsChild: Provide `ElementClass(...)` to compute the exact classes callers can apply to any tag for the same look.

## Content & Children

- Text: `x.T("...")` (or `x.Text("..."))` only.
- Children: `x.C(child)` only.
- Never invent new Text/Child wrappers.

## Accessibility Patterns

- Controls (checkbox/radio): Use a native hidden `<input>` to drive `:checked` and focus styles; control the visual indicator with sibling selectors.
- Dialogs: Add `role="dialog"`, `aria-modal="true"`, focus‑visible affordances, CSS‑only open/close when possible (`:target`); add JS only for must‑have behavior (e.g., ESC to close).
- Labels: Don’t bake labels into controls. Compose with `ui.Label`/`x.FormLabel` and `x.For`/`x.Id` in forms.

## CSS/JS Assets

- Prefer CSS‑only state management. If JS is unavoidable, provide it via a small wrapper component that implements `.JS()`. Same for component‑scoped `.CSS()`.
- Keep assets minimal and opt‑in.

## Skeleton Template

Renderer (Span example):

```go
func Chip(args ...x.SpanArg) x.Component {
    base := "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
    chipArgs := []x.SpanArg{x.Class(base)}
    chipArgs = append(chipArgs, args...)
    return x.Span(chipArgs...)
}
```

Optional variants/sizes (with presence detection):

```go
type chipVariantArg struct{ x.Global; cls string }

func ChipPrimary() x.SpanArg { s := "bg-primary text-primary-foreground"; return chipVariantArg{Global: x.Class(s), cls: s} }

func ChipClass(args ...x.SpanArg) x.Global {
    base := "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
    var v string
    for _, a := range args {
        if vv, ok := a.(chipVariantArg); ok && v == "" { v = vv.cls }
    }
    if v == "" { v = ChipPrimary().(chipVariantArg).cls }
    return x.Class(base + " " + v)
}
```

## Do/Don’t Checklist

- Do strictly type variadics with `x.*Arg`.
- Do prefix helpers with the element name (e.g., `ButtonDefault`).
- Do use `x.T`/`x.C` for content.
- Do prefer CSS; use JS/CSS assets only when necessary via `.JS()`/`.CSS()`.
- Don’t introduce `interface{}` or adapters for new APIs.
- Don’t create custom text/child wrappers.
- Don’t embed labels inside controls; compose in forms.

