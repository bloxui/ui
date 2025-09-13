package ui

import (
	x "github.com/bloxui/blox"
)

// Card creates a UI card with styling
// Accepts both UI arguments and core blox arguments directly
func Card(args ...any) x.Component {
	// Base shadcn/ui classes
	classes := "rounded-lg border bg-card text-card-foreground shadow"
	cardArgs := []x.DivArg{x.Class(classes)}

	for _, arg := range args {
		switch a := arg.(type) {
		case x.DivArg:
			cardArgs = append(cardArgs, a)
		}
	}

	return x.Div(cardArgs...)
}

// CardHeaderArg interface for UI card header arguments
type CardHeaderArg any

// CardHeader creates a UI card header with styling
func CardHeader(args ...any) x.Component {
	classes := "flex flex-col space-y-1.5 p-6"
	headerArgs := []x.DivArg{x.Class(classes)}
	for _, arg := range args {
		switch a := arg.(type) {
		case x.DivArg:
			headerArgs = append(headerArgs, a)
		}
	}

	return x.Div(headerArgs...)
}

// CardTitleArg interface for UI card title arguments
type CardTitleArg any

// For text, pass x.Text/x.T

// CardTitle creates a UI card title with styling
func CardTitle(args ...any) x.Component {
	classes := "font-semibold leading-none tracking-tight"
	titleArgs := []x.DivArg{x.Class(classes)}
	for _, arg := range args {
		switch a := arg.(type) {
		case x.DivArg:
			titleArgs = append(titleArgs, a)
        // text should be provided using x.Text/x.T
		}
	}

	return x.Div(titleArgs...)
}

// CardDescriptionArg interface for UI card description arguments
type CardDescriptionArg any

// For text, pass x.Text/x.T

// CardDescription creates a UI card description with styling
func CardDescription(args ...any) x.Component {
	classes := "text-sm text-muted-foreground"
	descArgs := []x.DivArg{x.Class(classes)}
	for _, arg := range args {
		switch a := arg.(type) {
		case x.DivArg:
			descArgs = append(descArgs, a)
        // text should be provided using x.Text/x.T
		}
	}

	return x.Div(descArgs...)
}

// CardContentArg interface for UI card content arguments
type CardContentArg any

// CardContent creates a UI card content with styling
func CardContent(args ...any) x.Component {
	classes := "p-6 pt-0"
	contentArgs := []x.DivArg{x.Class(classes)}
	for _, arg := range args {
		switch a := arg.(type) {
		case x.DivArg:
			contentArgs = append(contentArgs, a)
		}
	}

	return x.Div(contentArgs...)
}

// CardFooterArg interface for UI card footer arguments
type CardFooterArg any

// CardFooter creates a UI card footer with styling
func CardFooter(args ...any) x.Component {
	classes := "flex items-center p-6 pt-0"
	footerArgs := []x.DivArg{x.Class(classes)}
	for _, arg := range args {
		switch a := arg.(type) {
		case x.DivArg:
			footerArgs = append(footerArgs, a)
		}
	}

	return x.Div(footerArgs...)
}
