package ui

import x "github.com/bloxui/blox"

type LabelArg interface {
	applyUILabel(*labelState)
}

type labelState struct {
	children []x.Component
	baseArgs []x.LabelArg
}

type LabelTextWrapper struct{ text string }

func (w LabelTextWrapper) applyUILabel(s *labelState) {
	s.children = append(s.children, x.TextNode(w.text))
}

func LabelText(text string) LabelTextWrapper {
	return LabelTextWrapper{text}
}

type LabelChildWrapper struct{ child x.Component }

func (w LabelChildWrapper) applyUILabel(s *labelState) {
	s.children = append(s.children, w.child)
}

func LabelChild(child x.Component) LabelChildWrapper {
	return LabelChildWrapper{child}
}

type LabelArgAdapter struct{ arg x.LabelArg }

func (a LabelArgAdapter) applyUILabel(s *labelState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

func adaptLabelArg(arg interface{}) LabelArg {
	if uiArg, ok := arg.(LabelArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.LabelArg); ok {
		return LabelArgAdapter{coreArg}
	}
	return nil
}

func Label(args ...interface{}) x.Component {
	state := &labelState{}

	for _, arg := range args {
		if adapted := adaptLabelArg(arg); adapted != nil {
			adapted.applyUILabel(state)
		}
	}

	classes := "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"

	labelArgs := append([]x.LabelArg{x.Class(classes)}, state.baseArgs...)
	for _, child := range state.children {
		labelArgs = append(labelArgs, x.Child(child))
	}

	return x.FormLabel(labelArgs...)
}
