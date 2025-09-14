package ui

import (
	x "github.com/bloxui/blox"
)

// Card creates a UI card with styling. Strictly accepts x.DivArg.
func Card(args ...x.DivArg) x.Node {
	classes := "rounded-lg border bg-card text-card-foreground shadow"
	cardArgs := []x.DivArg{x.Class(classes)}
	cardArgs = append(cardArgs, args...)
	return x.Div(cardArgs...)
}

// CardHeader creates a UI card header with styling. Strictly accepts x.DivArg.
func CardHeader(args ...x.DivArg) x.Node {
	classes := "flex flex-col space-y-1.5 p-6"
	headerArgs := []x.DivArg{x.Class(classes)}
	headerArgs = append(headerArgs, args...)
	return x.Div(headerArgs...)
}

// CardTitle creates a UI card title with styling. Strictly accepts x.DivArg.
// For text, pass x.Text/x.T; for children, pass x.Child/x.C.
func CardTitle(args ...x.DivArg) x.Node {
	classes := "font-semibold leading-none tracking-tight"
	titleArgs := []x.DivArg{x.Class(classes)}
	titleArgs = append(titleArgs, args...)
	return x.Div(titleArgs...)
}

// CardDescription creates a UI card description with styling. Strictly accepts x.DivArg.
// For text, pass x.Text/x.T; for children, pass x.Child/x.C.
func CardDescription(args ...x.DivArg) x.Node {
	classes := "text-sm text-muted-foreground"
	descArgs := []x.DivArg{x.Class(classes)}
	descArgs = append(descArgs, args...)
	return x.Div(descArgs...)
}

// CardContent creates a UI card content with styling. Strictly accepts x.DivArg.
func CardContent(args ...x.DivArg) x.Node {
	classes := "p-6 pt-0"
	contentArgs := []x.DivArg{x.Class(classes)}
	contentArgs = append(contentArgs, args...)
	return x.Div(contentArgs...)
}

// CardFooter creates a UI card footer with styling. Strictly accepts x.DivArg.
func CardFooter(args ...x.DivArg) x.Node {
	classes := "flex items-center p-6 pt-0"
	footerArgs := []x.DivArg{x.Class(classes)}
	footerArgs = append(footerArgs, args...)
	return x.Div(footerArgs...)
}
