package ui

import (
	x "github.com/bloxui/blox"
)

// Base button classes (shadcn/ui parity)
func baseButtonClass() x.ButtonArg {
	return x.Class("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0")
}

// Internal wrappers embed x.Global so they are valid x.ButtonArg
type variantArg struct{ x.Global }
type sizeArg struct{ x.Global }

// Variants

func Default() x.ButtonArg {
	return variantArg{x.Class("bg-primary text-primary-foreground shadow hover:bg-primary/90")}
}
func Destructive() x.ButtonArg {
	return variantArg{x.Class("bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90")}
}
func Outline() x.ButtonArg {
	return variantArg{x.Class("border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground")}
}
func OutlineBlue() x.ButtonArg {
	return variantArg{x.Class("border-2 border-blue-500 text-blue-600 bg-background shadow-sm hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950")}
}
func OutlineYellow() x.ButtonArg {
	return variantArg{x.Class("border-2 border-yellow-500 text-yellow-600 bg-background shadow-sm hover:bg-yellow-50 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-950")}
}
func OutlineRed() x.ButtonArg {
	return variantArg{x.Class("border-2 border-red-500 text-red-600 bg-background shadow-sm hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950")}
}
func OutlineMuted() x.ButtonArg {
	return variantArg{x.Class("border-2 border-current text-current bg-background shadow-sm hover:bg-current/10")}
}
func Secondary() x.ButtonArg {
	return variantArg{x.Class("bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80")}
}
func Ghost() x.ButtonArg { return variantArg{x.Class("hover:bg-accent hover:text-accent-foreground")} }
func Link() x.ButtonArg {
	return variantArg{x.Class("text-primary underline-offset-4 hover:underline")}
}

// Sizes

func DefaultSize() x.ButtonArg { return sizeArg{x.Class("h-9 px-4 py-2")} }
func Sm() x.ButtonArg          { return sizeArg{x.Class("h-8 rounded-md px-3 text-xs")} }
func Lg() x.ButtonArg          { return sizeArg{x.Class("h-10 rounded-md px-8")} }
func Icon() x.ButtonArg        { return sizeArg{x.Class("h-6 w-6")} }

// Button creates a UI button with styling. Accepts strictly x.ButtonArg values.
func Button(args ...x.ButtonArg) x.Component {
	buttonArgs := make([]x.ButtonArg, 0, len(args)+3)
	buttonArgs = append(buttonArgs, baseButtonClass())

	var hasVariant, hasSize bool
	for _, a := range args {
		switch a.(type) {
		case variantArg:
			hasVariant = true
		case sizeArg:
			hasSize = true
		}
		buttonArgs = append(buttonArgs, a)
	}

	if !hasVariant {
		buttonArgs = append(buttonArgs, Default())
	}
	if !hasSize {
		buttonArgs = append(buttonArgs, DefaultSize())
	}

	return x.Button(buttonArgs...)
}
