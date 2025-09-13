package ui

import x "github.com/bloxui/blox"

// Checkbox renders a label-wrapped checkbox input with shadcn/ui styles.
func Checkbox(args ...any) x.Component {
	// Base classes
	containerClasses := "flex items-center gap-2 cursor-pointer text-sm select-none relative"
	inputClasses := "absolute opacity-0 cursor-pointer h-0 w-0"
	checkmarkClasses := "size-4 shrink-0 rounded-[4px] border border-input bg-background dark:bg-input/30 shadow-xs transition-colors flex items-center justify-center after:content-[''] after:absolute after:left-[5px] after:top-[3px] after:w-[5px] after:h-[10px] after:border-solid after:border-white after:border-r-2 after:border-b-2 after:rotate-45 after:opacity-0 after:transition-opacity"

	// States via sibling selectors
	containerWithStates := containerClasses + " hover:[&>.checkmark]:bg-muted [&>input:checked~.checkmark]:bg-primary [&>input:checked~.checkmark]:border-primary [&>input:checked~.checkmark:after]:opacity-100 [&>input:focus-visible~.checkmark]:ring-[3px] [&>input:focus-visible~.checkmark]:ring-ring/50"

	var inputArgs []x.InputArg
	var labelExtras []x.LabelArg

	for _, arg := range args {
		switch a := arg.(type) {
		case x.InputArg:
			inputArgs = append(inputArgs, a)
		case x.LabelArg:
			labelExtras = append(labelExtras, a)
		case string:
			labelExtras = append(labelExtras, x.Text(a))
		}
	}

	// Build input args
	inputArgs = append([]x.InputArg{
		x.Class(inputClasses),
		x.InputType("checkbox"),
	}, inputArgs...)

	// Compose label with input + custom checkmark + any extra label content
	labelArgs := []x.LabelArg{x.Class(containerWithStates)}
	labelArgs = append(labelArgs,
		x.Child(x.Input(inputArgs...)),
		x.Child(x.Span(x.Class(checkmarkClasses+" checkmark"))),
	)
	labelArgs = append(labelArgs, labelExtras...)

	return x.FormLabel(labelArgs...)
}
