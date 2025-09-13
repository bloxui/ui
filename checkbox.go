package ui

import x "github.com/bloxui/blox"

type CheckboxArg interface {
	applyUICheckbox(*checkboxState)
}

type checkboxState struct {
	label    string
	baseArgs []x.InputArg
}

type CheckboxLabelWrapper struct{ text string }

func (w CheckboxLabelWrapper) applyUICheckbox(s *checkboxState) {
	s.label = w.text
}

func CheckboxLabel(text string) CheckboxLabelWrapper {
	return CheckboxLabelWrapper{text}
}

type CheckboxArgAdapter struct{ arg x.InputArg }

func (a CheckboxArgAdapter) applyUICheckbox(s *checkboxState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

func adaptCheckboxArg(arg interface{}) CheckboxArg {
	if uiArg, ok := arg.(CheckboxArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.InputArg); ok {
		return CheckboxArgAdapter{coreArg}
	}
	return nil
}

func Checkbox(args ...interface{}) x.Component {
	state := &checkboxState{}

	for _, arg := range args {
		if adapted := adaptCheckboxArg(arg); adapted != nil {
			adapted.applyUICheckbox(state)
		}
	}

	// W3Schools approach with shadcn/ui styling
	containerClasses := "flex items-center gap-2 cursor-pointer text-sm select-none relative"
	inputClasses := "absolute opacity-0 cursor-pointer h-0 w-0"
	checkmarkClasses := "size-4 shrink-0 rounded-[4px] border border-input bg-background dark:bg-input/30 shadow-xs transition-colors flex items-center justify-center after:content-[''] after:absolute after:left-[5px] after:top-[3px] after:w-[5px] after:h-[10px] after:border-solid after:border-white after:border-r-2 after:border-b-2 after:rotate-45 after:opacity-0 after:transition-opacity"

	// Add hover and checked states using peer selectors
	containerWithStates := containerClasses + " hover:[&>.checkmark]:bg-muted [&>input:checked~.checkmark]:bg-primary [&>input:checked~.checkmark]:border-primary [&>input:checked~.checkmark:after]:opacity-100 [&>input:focus-visible~.checkmark]:ring-[3px] [&>input:focus-visible~.checkmark]:ring-ring/50"

	checkboxArgs := append([]x.InputArg{
		x.Class(inputClasses),
		x.InputType("checkbox"),
	}, state.baseArgs...)

	return x.FormLabel(
		x.Class(containerWithStates),
		x.Child(x.Input(checkboxArgs...)),
		x.Child(x.Span(x.Class(checkmarkClasses+" checkmark"))),
		x.Text(state.label),
	)
}
