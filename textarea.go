package ui

import x "github.com/bloxui/blox"

func Textarea(args ...x.TextareaArg) x.Node {
	classes := "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
	textareaArgs := []x.TextareaArg{x.Class(classes)}
	textareaArgs = append(textareaArgs, args...)

	return x.Textarea(textareaArgs...)
}
