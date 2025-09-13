package ui

import x "github.com/bloxui/blox"

// TabsAssets provides CSS for tabs functionality
type TabsAssets struct{}

func (TabsAssets) CSS() string {
	return `
/* Tabs CSS-only functionality */
.tabs-content { 
	display: none; 
}

/* General approach: Use data attributes for tab group and value matching */
[data-tabs-name] input[type="radio"]:checked ~ [data-tab-group][data-tab-value] {
	display: block !important;
}

/* More specific selectors for different structures */
input[id$="-account"]:checked ~ * [data-tab-group][data-tab-value="account"],
input[id$="-password"]:checked ~ * [data-tab-group][data-tab-value="password"],
input[id$="-settings"]:checked ~ * [data-tab-group][data-tab-value="settings"],
input[id$="-overview"]:checked ~ * [data-tab-group][data-tab-value="overview"],
input[id$="-analytics"]:checked ~ * [data-tab-group][data-tab-value="analytics"],
input[id$="-general"]:checked ~ * [data-tab-group][data-tab-value="general"],
input[id$="-advanced"]:checked ~ * [data-tab-group][data-tab-value="advanced"] {
	display: block !important;
}`
}

// TabsArg interface for UI tabs arguments
type TabsArg interface {
	applyUITabs(*tabsState)
}

// tabsState holds our tabs configuration
type tabsState struct {
	name     string // radio group name for grouping tabs
	baseArgs []x.DivArg
}

// TabsNameWrapper for tabs group name
type TabsNameWrapper struct{ name string }

func (w TabsNameWrapper) applyUITabs(s *tabsState) {
	s.name = w.name
}

func TabsName(name string) TabsNameWrapper {
	return TabsNameWrapper{name}
}

// Universal adapter for any x.DivArg
type TabsArgAdapter struct{ arg x.DivArg }

func (a TabsArgAdapter) applyUITabs(s *tabsState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.DivArg work directly with ui.Tabs
func adaptTabsArg(arg interface{}) TabsArg {
	if uiArg, ok := arg.(TabsArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.DivArg); ok {
		return TabsArgAdapter{coreArg}
	}
	return nil
}

// TabsComponent wraps the tabs div with asset registration
type TabsComponent struct {
	x.Component
}

func (tc TabsComponent) CSS() string {
	return TabsAssets{}.CSS()
}

func (tc TabsComponent) Name() string {
	return "tabs"
}

// Tabs creates a CSS-only tabs container using radio buttons
func Tabs(args ...interface{}) x.Component {
	state := &tabsState{
		name: "tabs", // default group name
	}

	for _, arg := range args {
		if adapted := adaptTabsArg(arg); adapted != nil {
			adapted.applyUITabs(state)
		}
	}

	// Container with CSS variables for styling
	containerClasses := "w-full [--tabs-bg:hsl(var(--card))] [--tabs-border:hsl(var(--border))] [--tabs-text:hsl(var(--card-foreground))] [--tabs-muted:hsl(var(--muted-foreground))]"
	tabsArgs := append([]x.DivArg{
		x.Class(containerClasses),
		x.Data("tabs-name", state.name),
	}, state.baseArgs...)

	return TabsComponent{
		Component: x.Div(tabsArgs...),
	}
}

// TabsListArg interface for UI tabs list arguments
type TabsListArg interface {
	applyUITabsList(*tabsListState)
}

// tabsListState holds our tabs list configuration
type tabsListState struct {
	baseArgs []x.DivArg
}

// Universal adapter for any x.DivArg
type TabsListArgAdapter struct{ arg x.DivArg }

func (a TabsListArgAdapter) applyUITabsList(s *tabsListState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.DivArg work directly with ui.TabsList
func adaptTabsListArg(arg interface{}) TabsListArg {
	if uiArg, ok := arg.(TabsListArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.DivArg); ok {
		return TabsListArgAdapter{coreArg}
	}
	return nil
}

// TabsList creates the container for tab triggers
func TabsList(args ...interface{}) x.Component {
	state := &tabsListState{}

	for _, arg := range args {
		if adapted := adaptTabsListArg(arg); adapted != nil {
			adapted.applyUITabsList(state)
		}
	}

	// Styled as shadcn/ui tabs list - horizontal flex with background
	listClasses := "inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
	listArgs := append([]x.DivArg{x.Class(listClasses)}, state.baseArgs...)

	return x.Div(listArgs...)
}

// TabsTriggerArg interface for UI tabs trigger arguments
type TabsTriggerArg interface {
	applyUITabsTrigger(*tabsTriggerState)
}

// tabsTriggerState holds our tabs trigger configuration
type tabsTriggerState struct {
	value      string
	groupName  string
	label      string
	defaultTab bool
	baseArgs   []x.LabelArg
}

// TabsTriggerValueWrapper for trigger value
type TabsTriggerValueWrapper struct{ value string }

func (w TabsTriggerValueWrapper) applyUITabsTrigger(s *tabsTriggerState) {
	s.value = w.value
}

func TabsTriggerValue(value string) TabsTriggerValueWrapper {
	return TabsTriggerValueWrapper{value}
}

// TabsTriggerGroupWrapper for radio group name
type TabsTriggerGroupWrapper struct{ name string }

func (w TabsTriggerGroupWrapper) applyUITabsTrigger(s *tabsTriggerState) {
	s.groupName = w.name
}

func TabsTriggerGroup(name string) TabsTriggerGroupWrapper {
	return TabsTriggerGroupWrapper{name}
}

// TabsTriggerLabelWrapper for trigger label
type TabsTriggerLabelWrapper struct{ label string }

func (w TabsTriggerLabelWrapper) applyUITabsTrigger(s *tabsTriggerState) {
	s.label = w.label
}

func TabsTriggerLabel(label string) TabsTriggerLabelWrapper {
	return TabsTriggerLabelWrapper{label}
}

// TabsTriggerDefaultWrapper for default tab
type TabsTriggerDefaultWrapper struct{}

func (w TabsTriggerDefaultWrapper) applyUITabsTrigger(s *tabsTriggerState) {
	s.defaultTab = true
}

func TabsTriggerDefault() TabsTriggerDefaultWrapper {
	return TabsTriggerDefaultWrapper{}
}

// Universal adapter for any x.LabelArg
type TabsTriggerArgAdapter struct{ arg x.LabelArg }

func (a TabsTriggerArgAdapter) applyUITabsTrigger(s *tabsTriggerState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.LabelArg work directly with ui.TabsTrigger
func adaptTabsTriggerArg(arg interface{}) TabsTriggerArg {
	if uiArg, ok := arg.(TabsTriggerArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.LabelArg); ok {
		return TabsTriggerArgAdapter{coreArg}
	}
	return nil
}

// TabsTrigger creates a single tab trigger using hidden radio input
func TabsTrigger(args ...interface{}) x.Component {
	state := &tabsTriggerState{
		value:     "tab",
		groupName: "tabs",
		label:     "Tab",
	}

	for _, arg := range args {
		if adapted := adaptTabsTriggerArg(arg); adapted != nil {
			adapted.applyUITabsTrigger(state)
		}
	}

	// Hidden radio input for state management
	radioId := state.groupName + "-" + state.value
	radioArgs := []x.InputArg{
		x.Id(radioId),
		x.InputName(state.groupName),
		x.InputValue(state.value),
		x.InputType("radio"),
		x.Class("sr-only"),
	}

	if state.defaultTab {
		radioArgs = append(radioArgs, x.Checked())
	}

	// Label styled like shadcn/ui tabs trigger with peer selectors for checked state
	labelClasses := "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all cursor-pointer hover:text-foreground peer-checked:bg-background peer-checked:text-foreground peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"

	labelArgs := append([]x.LabelArg{
		x.For(radioId),
		x.Class(labelClasses),
	}, state.baseArgs...)

	labelArgs = append(labelArgs, x.Text(state.label))

	return x.Div(
		x.Class("relative"),
		x.Child(x.Input(radioArgs...)),
		x.Child(x.FormLabel(labelArgs...)),
	)
}

// TabsContentArg interface for UI tabs content arguments
type TabsContentArg interface {
	applyUITabsContent(*tabsContentState)
}

// tabsContentState holds our tabs content configuration
type tabsContentState struct {
	value     string
	groupName string
	baseArgs  []x.DivArg
}

// TabsContentValueWrapper for content value
type TabsContentValueWrapper struct{ value string }

func (w TabsContentValueWrapper) applyUITabsContent(s *tabsContentState) {
	s.value = w.value
}

func TabsContentValue(value string) TabsContentValueWrapper {
	return TabsContentValueWrapper{value}
}

// TabsContentGroupWrapper for radio group name
type TabsContentGroupWrapper struct{ name string }

func (w TabsContentGroupWrapper) applyUITabsContent(s *tabsContentState) {
	s.groupName = w.name
}

func TabsContentGroup(name string) TabsContentGroupWrapper {
	return TabsContentGroupWrapper{name}
}

// Universal adapter for any x.DivArg
type TabsContentArgAdapter struct{ arg x.DivArg }

func (a TabsContentArgAdapter) applyUITabsContent(s *tabsContentState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.DivArg work directly with ui.TabsContent
func adaptTabsContentArg(arg interface{}) TabsContentArg {
	if uiArg, ok := arg.(TabsContentArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.DivArg); ok {
		return TabsContentArgAdapter{coreArg}
	}
	return nil
}

// TabsContent creates a tab content panel that shows when its radio is checked
func TabsContent(args ...interface{}) x.Component {
	state := &tabsContentState{
		value:     "tab",
		groupName: "tabs",
	}

	for _, arg := range args {
		if adapted := adaptTabsContentArg(arg); adapted != nil {
			adapted.applyUITabsContent(state)
		}
	}

	// Content panel with CSS to show/hide based on radio state
	// Uses data attributes that will be targeted by CSS
	contentClasses := "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hidden tabs-content"

	contentArgs := append([]x.DivArg{
		x.Class(contentClasses),
		x.Data("tab-group", state.groupName),
		x.Data("tab-value", state.value),
		x.TabIndex(0),
	}, state.baseArgs...)

	return x.Div(contentArgs...)
}
