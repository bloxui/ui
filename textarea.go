package ui

import x "github.com/bloxui/blox"

type TextareaArg interface {
	applyUITextarea(*textareaState)
}

type textareaState struct {
	baseArgs []x.TextareaArg
}

type TextareaArgAdapter struct{ arg x.TextareaArg }

func (a TextareaArgAdapter) applyUITextarea(s *textareaState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

func adaptTextareaArg(arg interface{}) TextareaArg {
	if uiArg, ok := arg.(TextareaArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.TextareaArg); ok {
		return TextareaArgAdapter{coreArg}
	}
	return nil
}

func Textarea(args ...interface{}) x.Component {
	state := &textareaState{}

	for _, arg := range args {
		if adapted := adaptTextareaArg(arg); adapted != nil {
			adapted.applyUITextarea(state)
		}
	}

	classes := "flex min-h-[60px] w-full rounded-md border border-muted-foreground/50 bg-background dark:bg-input px-3 py-2 text-base shadow-inner placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"

	textareaArgs := append([]x.TextareaArg{x.Class(classes)}, state.baseArgs...)

	return x.Textarea(textareaArgs...)
}
