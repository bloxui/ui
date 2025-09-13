package ui

import x "github.com/bloxui/blox"

// Input renders a styled input. Pass standard input attributes via x.InputArg
func Input(args ...any) x.Component {
	classes := "flex h-9 w-full rounded-md border border-muted-foreground/50 bg-background dark:bg-input px-3 py-1 text-base shadow-inner transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"

	var inputArgs []x.InputArg
	for _, arg := range args {
		if a, ok := arg.(x.InputArg); ok {
			inputArgs = append(inputArgs, a)
		}
	}

	inputArgs = append([]x.InputArg{x.Class(classes)}, inputArgs...)

	return x.Input(inputArgs...)
}
