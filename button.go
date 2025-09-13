package ui

import (
	"strings"

	x "github.com/bloxui/blox"
)

// ButtonArg describes UI-specific button options (variant, size).
// Core blox args (x.ButtonArg) are accepted directly — use x.Text/x.T and x.Child/x.C.
type ButtonArg interface {
	applyUIButton(*buttonState)
}

// buttonState holds our button configuration
type buttonState struct {
	variant  string
	size     string
	baseArgs []x.ButtonArg
}

// Variant option types

type VariantOpt struct{ v string }
type SizeOpt struct{ v string }

// Variant constructors

func Default() VariantOpt       { return VariantOpt{"default"} }
func Destructive() VariantOpt   { return VariantOpt{"destructive"} }
func Outline() VariantOpt       { return VariantOpt{"outline"} }
func OutlineBlue() VariantOpt   { return VariantOpt{"outline-blue"} }
func OutlineYellow() VariantOpt { return VariantOpt{"outline-yellow"} }
func OutlineRed() VariantOpt    { return VariantOpt{"outline-red"} }
func OutlineMuted() VariantOpt  { return VariantOpt{"outline-muted"} }
func Secondary() VariantOpt     { return VariantOpt{"secondary"} }
func Ghost() VariantOpt         { return VariantOpt{"ghost"} }
func Link() VariantOpt          { return VariantOpt{"link"} }

// Size constructors

func DefaultSize() SizeOpt { return SizeOpt{"default"} }
func Sm() SizeOpt          { return SizeOpt{"sm"} }
func Lg() SizeOpt          { return SizeOpt{"lg"} }
func Icon() SizeOpt        { return SizeOpt{"icon"} }

// Apply methods for variant and size
func (o VariantOpt) applyUIButton(s *buttonState) { s.variant = o.v }
func (o SizeOpt) applyUIButton(s *buttonState)    { s.size = o.v }

// getButtonClasses generates the CSS classes for button variants and sizes
func getButtonClasses(variant, size string) string {
	var classes []string

	// Base classes - matching shadcn/ui exactly
	baseClasses := "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
	classes = append(classes, baseClasses)

	// Variant classes
	switch variant {
	case "default":
		classes = append(classes, "bg-primary text-primary-foreground shadow hover:bg-primary/90")
	case "destructive":
		classes = append(classes, "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90")
	case "outline":
		classes = append(classes, "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground")
	case "outline-blue":
		classes = append(classes, "border-2 border-blue-500 text-blue-600 bg-background shadow-sm hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950")
	case "outline-yellow":
		classes = append(classes, "border-2 border-yellow-500 text-yellow-600 bg-background shadow-sm hover:bg-yellow-50 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-950")
	case "outline-red":
		classes = append(classes, "border-2 border-red-500 text-red-600 bg-background shadow-sm hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950")
	case "outline-muted":
		classes = append(classes, "border-2 border-current text-current bg-background shadow-sm hover:bg-current/10")
	case "secondary":
		classes = append(classes, "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80")
	case "ghost":
		classes = append(classes, "hover:bg-accent hover:text-accent-foreground")
	case "link":
		classes = append(classes, "text-primary underline-offset-4 hover:underline")
	}

	// Size classes
	switch size {
	case "default":
		classes = append(classes, "h-9 px-4 py-2")
	case "sm":
		classes = append(classes, "h-8 rounded-md px-3 text-xs")
	case "lg":
		classes = append(classes, "h-10 rounded-md px-8")
	case "icon":
		classes = append(classes, "h-6 w-6")
	}

	return strings.Join(classes, " ")
}

// Button creates a UI button with styling
// Accepts both UI arguments (variants, sizes) and core blox arguments directly
func Button(args ...interface{}) x.Component {
	state := &buttonState{
		variant: "default",
		size:    "default",
	}

	// Collect UI options and core blox args in one pass
	for _, arg := range args {
		switch a := arg.(type) {
		case ButtonArg:
			a.applyUIButton(state)
		case x.ButtonArg:
			state.baseArgs = append(state.baseArgs, a)
		}
	}

	// Build the final button args
	classes := getButtonClasses(state.variant, state.size)
	buttonArgs := append([]x.ButtonArg{x.Class(classes)}, state.baseArgs...)

	return x.Button(buttonArgs...)
}
