package ui

import (
	x "github.com/bloxui/blox"
)

// CardArg interface for UI card arguments
// This interface allows both UI-specific args and core blox args
type CardArg interface {
	applyUICard(*cardState)
}

// cardState holds our card configuration
type cardState struct {
	children []x.Component
	baseArgs []x.DivArg
}

// Universal adapter for any x.DivArg
type CardArgAdapter struct{ arg x.DivArg }

func (a CardArgAdapter) applyUICard(s *cardState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.DivArg work directly with ui.Card
func adaptCardArg(arg interface{}) CardArg {
	if uiArg, ok := arg.(CardArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.DivArg); ok {
		return CardArgAdapter{coreArg}
	}
	return nil
}

// Card creates a UI card with styling
// Accepts both UI arguments and core blox arguments directly
func Card(args ...interface{}) x.Component {
	state := &cardState{}

	for _, arg := range args {
		if adapted := adaptCardArg(arg); adapted != nil {
			adapted.applyUICard(state)
		}
	}

	// Build the final card args
	classes := "rounded-lg border bg-card text-card-foreground shadow"
	cardArgs := append([]x.DivArg{x.Class(classes)}, state.baseArgs...)

	// Add children
	for _, child := range state.children {
		cardArgs = append(cardArgs, x.Child(child))
	}

	return x.Div(cardArgs...)
}

// CardHeaderArg interface for UI card header arguments
type CardHeaderArg interface {
	applyUICardHeader(*cardHeaderState)
}

// cardHeaderState holds our card header configuration
type cardHeaderState struct {
	children []x.Component
	baseArgs []x.DivArg
}

// Universal adapter for any x.DivArg
type CardHeaderArgAdapter struct{ arg x.DivArg }

func (a CardHeaderArgAdapter) applyUICardHeader(s *cardHeaderState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.DivArg work directly with ui.CardHeader
func adaptCardHeaderArg(arg interface{}) CardHeaderArg {
	if uiArg, ok := arg.(CardHeaderArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.DivArg); ok {
		return CardHeaderArgAdapter{coreArg}
	}
	return nil
}

// CardHeader creates a UI card header with styling
func CardHeader(args ...interface{}) x.Component {
	state := &cardHeaderState{}

	for _, arg := range args {
		if adapted := adaptCardHeaderArg(arg); adapted != nil {
			adapted.applyUICardHeader(state)
		}
	}

	// Build the final card header args with shadcn/ui classes
	classes := "flex flex-col space-y-1.5 p-6"
	headerArgs := append([]x.DivArg{x.Class(classes)}, state.baseArgs...)

	// Add children
	for _, child := range state.children {
		headerArgs = append(headerArgs, x.Child(child))
	}

	return x.Div(headerArgs...)
}

// CardTitleArg interface for UI card title arguments
type CardTitleArg interface {
	applyUICardTitle(*cardTitleState)
}

// cardTitleState holds our card title configuration
type cardTitleState struct {
	text     string
	children []x.Component
	baseArgs []x.DivArg
}

// CardTitleTextWrapper for text content
type CardTitleTextWrapper struct{ text string }

func (w CardTitleTextWrapper) applyUICardTitle(s *cardTitleState) {
	s.text = w.text
}

func CardTitleText(text string) CardTitleTextWrapper {
	return CardTitleTextWrapper{text}
}

// CardTitleChildWrapper for child components
type CardTitleChildWrapper struct{ child x.Component }

func (w CardTitleChildWrapper) applyUICardTitle(s *cardTitleState) {
	s.children = append(s.children, w.child)
}

func CardTitleChild(child x.Component) CardTitleChildWrapper {
	return CardTitleChildWrapper{child}
}

// Universal adapter for any x.DivArg
type CardTitleArgAdapter struct{ arg x.DivArg }

func (a CardTitleArgAdapter) applyUICardTitle(s *cardTitleState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.DivArg work directly with ui.CardTitle
func adaptCardTitleArg(arg interface{}) CardTitleArg {
	if uiArg, ok := arg.(CardTitleArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.DivArg); ok {
		return CardTitleArgAdapter{coreArg}
	}
	return nil
}

// CardTitle creates a UI card title with styling
func CardTitle(args ...interface{}) x.Component {
	state := &cardTitleState{}

	for _, arg := range args {
		if adapted := adaptCardTitleArg(arg); adapted != nil {
			adapted.applyUICardTitle(state)
		}
	}

	// Build the final card title args with shadcn/ui classes
	classes := "font-semibold leading-none tracking-tight"
	titleArgs := append([]x.DivArg{x.Class(classes)}, state.baseArgs...)

	// Add text if provided
	if state.text != "" {
		titleArgs = append(titleArgs, x.Text(state.text))
	}

	// Add children
	for _, child := range state.children {
		titleArgs = append(titleArgs, x.Child(child))
	}

	return x.Div(titleArgs...)
}

// CardDescriptionArg interface for UI card description arguments
type CardDescriptionArg interface {
	applyUICardDescription(*cardDescriptionState)
}

// cardDescriptionState holds our card description configuration
type cardDescriptionState struct {
	text     string
	children []x.Component
	baseArgs []x.DivArg
}

// CardDescriptionTextWrapper for text content
type CardDescriptionTextWrapper struct{ text string }

func (w CardDescriptionTextWrapper) applyUICardDescription(s *cardDescriptionState) {
	s.text = w.text
}

func CardDescriptionText(text string) CardDescriptionTextWrapper {
	return CardDescriptionTextWrapper{text}
}

// CardDescriptionChildWrapper for child components
type CardDescriptionChildWrapper struct{ child x.Component }

func (w CardDescriptionChildWrapper) applyUICardDescription(s *cardDescriptionState) {
	s.children = append(s.children, w.child)
}

func CardDescriptionChild(child x.Component) CardDescriptionChildWrapper {
	return CardDescriptionChildWrapper{child}
}

// Universal adapter for any x.DivArg
type CardDescriptionArgAdapter struct{ arg x.DivArg }

func (a CardDescriptionArgAdapter) applyUICardDescription(s *cardDescriptionState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.DivArg work directly with ui.CardDescription
func adaptCardDescriptionArg(arg interface{}) CardDescriptionArg {
	if uiArg, ok := arg.(CardDescriptionArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.DivArg); ok {
		return CardDescriptionArgAdapter{coreArg}
	}
	return nil
}

// CardDescription creates a UI card description with styling
func CardDescription(args ...interface{}) x.Component {
	state := &cardDescriptionState{}

	for _, arg := range args {
		if adapted := adaptCardDescriptionArg(arg); adapted != nil {
			adapted.applyUICardDescription(state)
		}
	}

	// Build the final card description args with shadcn/ui classes
	classes := "text-sm text-muted-foreground"
	descArgs := append([]x.DivArg{x.Class(classes)}, state.baseArgs...)

	// Add text if provided
	if state.text != "" {
		descArgs = append(descArgs, x.Text(state.text))
	}

	// Add children
	for _, child := range state.children {
		descArgs = append(descArgs, x.Child(child))
	}

	return x.Div(descArgs...)
}

// CardContentArg interface for UI card content arguments
type CardContentArg interface {
	applyUICardContent(*cardContentState)
}

// cardContentState holds our card content configuration
type cardContentState struct {
	children []x.Component
	baseArgs []x.DivArg
}

// Universal adapter for any x.DivArg
type CardContentArgAdapter struct{ arg x.DivArg }

func (a CardContentArgAdapter) applyUICardContent(s *cardContentState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.DivArg work directly with ui.CardContent
func adaptCardContentArg(arg interface{}) CardContentArg {
	if uiArg, ok := arg.(CardContentArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.DivArg); ok {
		return CardContentArgAdapter{coreArg}
	}
	return nil
}

// CardContent creates a UI card content with styling
func CardContent(args ...interface{}) x.Component {
	state := &cardContentState{}

	for _, arg := range args {
		if adapted := adaptCardContentArg(arg); adapted != nil {
			adapted.applyUICardContent(state)
		}
	}

	// Build the final card content args with shadcn/ui classes
	classes := "p-6 pt-0"
	contentArgs := append([]x.DivArg{x.Class(classes)}, state.baseArgs...)

	// Add children
	for _, child := range state.children {
		contentArgs = append(contentArgs, x.Child(child))
	}

	return x.Div(contentArgs...)
}

// CardFooterArg interface for UI card footer arguments
type CardFooterArg interface {
	applyUICardFooter(*cardFooterState)
}

// cardFooterState holds our card footer configuration
type cardFooterState struct {
	children []x.Component
	baseArgs []x.DivArg
}

// Universal adapter for any x.DivArg
type CardFooterArgAdapter struct{ arg x.DivArg }

func (a CardFooterArgAdapter) applyUICardFooter(s *cardFooterState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.DivArg work directly with ui.CardFooter
func adaptCardFooterArg(arg interface{}) CardFooterArg {
	if uiArg, ok := arg.(CardFooterArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.DivArg); ok {
		return CardFooterArgAdapter{coreArg}
	}
	return nil
}

// CardFooter creates a UI card footer with styling
func CardFooter(args ...interface{}) x.Component {
	state := &cardFooterState{}

	for _, arg := range args {
		if adapted := adaptCardFooterArg(arg); adapted != nil {
			adapted.applyUICardFooter(state)
		}
	}

	// Build the final card footer args with shadcn/ui classes
	classes := "flex items-center p-6 pt-0"
	footerArgs := append([]x.DivArg{x.Class(classes)}, state.baseArgs...)

	// Add children
	for _, child := range state.children {
		footerArgs = append(footerArgs, x.Child(child))
	}

	return x.Div(footerArgs...)
}
