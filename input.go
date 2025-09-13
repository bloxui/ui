package ui

import x "github.com/bloxui/blox"

type InputArg interface {
	applyUIInput(*inputState)
}

type inputState struct {
	inputType string
	baseArgs  []x.InputArg
}

type InputTypeWrapper struct{ inputType string }

func (w InputTypeWrapper) applyUIInput(s *inputState) {
	s.inputType = w.inputType
}

func InputType(inputType string) InputTypeWrapper {
	return InputTypeWrapper{inputType}
}

type InputArgAdapter struct{ arg x.InputArg }

func (a InputArgAdapter) applyUIInput(s *inputState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

func adaptInputArg(arg interface{}) InputArg {
	if uiArg, ok := arg.(InputArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.InputArg); ok {
		return InputArgAdapter{coreArg}
	}
	return nil
}

func Input(args ...interface{}) x.Component {
	state := &inputState{
		inputType: "text",
	}

	for _, arg := range args {
		if adapted := adaptInputArg(arg); adapted != nil {
			adapted.applyUIInput(state)
		}
	}

	classes := "flex h-9 w-full rounded-md border border-muted-foreground/50 bg-background dark:bg-input px-3 py-1 text-base shadow-inner transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"

	inputArgs := append([]x.InputArg{
		x.Class(classes),
		x.InputType(state.inputType),
	}, state.baseArgs...)

	return x.Input(inputArgs...)
}
