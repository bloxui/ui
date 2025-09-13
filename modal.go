package ui

import x "github.com/bloxui/blox"

// ModalAssets provides CSS for modal functionality
type ModalAssets struct{}

func (ModalAssets) CSS() string {
	return `
#basic-modal:target,
#confirm-modal:target,
.modal:target {
    opacity: 1 !important;
    pointer-events: auto !important;
}

#basic-modal:target .modal-content,
#confirm-modal:target .modal-content,
.modal:target .modal-content {
    transform: scale(1) translateY(0) !important;
    opacity: 1 !important;
}

.modal:target .modal-content a:focus,
.modal:target .modal-content button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}`
}

func (ModalAssets) JS() string {
	return `
(function() {
    let currentModal = null;
    
    // Track when modal opens
    function handleHashChange() {
        const hash = window.location.hash;
        if (hash && hash !== '#') {
            const modal = document.querySelector(hash);
            if (modal && modal.classList.contains('fixed') && modal.getAttribute('role') === 'dialog') {
                currentModal = modal;
            }
        } else {
            currentModal = null;
        }
    }
    
    // Handle ESC key
    function handleEscKey(e) {
        if (e.key === 'Escape' && currentModal) {
            window.location.hash = '#';
            currentModal = null;
        }
    }
    
    // Set up event listeners
    window.addEventListener('hashchange', handleHashChange);
    document.addEventListener('keydown', handleEscKey);
    
    // Initialize on page load
    handleHashChange();
})();`
}

// ModalArg interface for UI modal arguments
type ModalArg interface {
	applyUIModal(*modalState)
}

// modalState holds our modal configuration
type modalState struct {
	id       string
	baseArgs []x.DivArg
}

// ModalIdWrapper for modal ID
type ModalIdWrapper struct{ id string }

func (w ModalIdWrapper) applyUIModal(s *modalState) {
	s.id = w.id
}

func ModalId(id string) ModalIdWrapper {
	return ModalIdWrapper{id}
}

// Universal adapter for any x.DivArg
type ModalArgAdapter struct{ arg x.DivArg }

func (a ModalArgAdapter) applyUIModal(s *modalState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.DivArg work directly with ui.Modal
func adaptModalArg(arg interface{}) ModalArg {
	if uiArg, ok := arg.(ModalArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.DivArg); ok {
		return ModalArgAdapter{coreArg}
	}
	return nil
}

// ModalComponent wraps the modal div with asset registration
type ModalComponent struct {
	x.Component
}

func (mc ModalComponent) CSS() string {
	return ModalAssets{}.CSS()
}

func (mc ModalComponent) JS() string {
	return ModalAssets{}.JS()
}

func (mc ModalComponent) Name() string {
	return "modal"
}

// Modal creates a CSS-only modal using :target pseudo-class
func Modal(args ...interface{}) x.Component {
	state := &modalState{
		id: "modal", // default ID
	}

	for _, arg := range args {
		if adapted := adaptModalArg(arg); adapted != nil {
			adapted.applyUIModal(state)
		}
	}

	// CSS classes for modal - hidden by default, shown when targeted via CSS
	modalClasses := "fixed inset-0 z-50 bg-black/50 opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center"

	modalArgs := append([]x.DivArg{
		x.Id(state.id),
		x.Class(modalClasses),
		x.Role("dialog"),
		x.Aria("modal", "true"),
	}, state.baseArgs...)

	// Add backdrop link for closing modal (click outside)
	modalArgs = append(modalArgs, x.Child(x.A(
		x.Href("#"),
		x.Class("absolute inset-0 z-[-1]"),
	)))

	// Add accessible close link that can be reached with keyboard navigation
	modalArgs = append(modalArgs, x.Child(x.A(
		x.Href("#"),
		x.Class("modal-esc-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:bg-background focus:border focus:px-2 focus:py-1 focus:rounded focus:text-sm focus:z-[1002]"),
		x.Text("Press Tab then Enter to close"),
		x.Aria("label", "Close modal with keyboard"),
	)))

	return ModalComponent{
		Component: x.Div(modalArgs...),
	}
}

// ModalTriggerArg interface for UI modal trigger arguments
type ModalTriggerArg interface {
	applyUIModalTrigger(*modalTriggerState)
}

// modalTriggerState holds our modal trigger configuration
type modalTriggerState struct {
	text     string
	target   string
	children []x.Component
	baseArgs []x.AArg
}

// ModalTriggerTextWrapper for text content
type ModalTriggerTextWrapper struct{ text string }

func (w ModalTriggerTextWrapper) applyUIModalTrigger(s *modalTriggerState) {
	s.text = w.text
}

func ModalTriggerText(text string) ModalTriggerTextWrapper {
	return ModalTriggerTextWrapper{text}
}

// ModalTriggerTargetWrapper for target modal ID
type ModalTriggerTargetWrapper struct{ target string }

func (w ModalTriggerTargetWrapper) applyUIModalTrigger(s *modalTriggerState) {
	s.target = w.target
}

func ModalTriggerTarget(target string) ModalTriggerTargetWrapper {
	return ModalTriggerTargetWrapper{target}
}

// ModalTriggerChildWrapper for child components
type ModalTriggerChildWrapper struct{ child x.Component }

func (w ModalTriggerChildWrapper) applyUIModalTrigger(s *modalTriggerState) {
	s.children = append(s.children, w.child)
}

func ModalTriggerChild(child x.Component) ModalTriggerChildWrapper {
	return ModalTriggerChildWrapper{child}
}

// Universal adapter for any x.AArg
type ModalTriggerArgAdapter struct{ arg x.AArg }

func (a ModalTriggerArgAdapter) applyUIModalTrigger(s *modalTriggerState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.AArg work directly with ui.ModalTrigger
func adaptModalTriggerArg(arg interface{}) ModalTriggerArg {
	if uiArg, ok := arg.(ModalTriggerArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.AArg); ok {
		return ModalTriggerArgAdapter{coreArg}
	}
	return nil
}

// ModalTrigger creates a trigger link for opening the modal
func ModalTrigger(args ...interface{}) x.Component {
	state := &modalTriggerState{
		target: "modal", // default target
	}

	for _, arg := range args {
		if adapted := adaptModalTriggerArg(arg); adapted != nil {
			adapted.applyUIModalTrigger(state)
		}
	}

	triggerArgs := append([]x.AArg{
		x.Href("#" + state.target),
	}, state.baseArgs...)

	// Add text if provided
	if state.text != "" {
		triggerArgs = append(triggerArgs, x.Text(state.text))
	}

	// Add children
	for _, child := range state.children {
		triggerArgs = append(triggerArgs, x.Child(child))
	}

	return x.A(triggerArgs...)
}

// ModalContentArg interface for UI modal content arguments
type ModalContentArg interface {
	applyUIModalContent(*modalContentState)
}

// modalContentState holds our modal content configuration
type modalContentState struct {
	baseArgs []x.DivArg
}

// Universal adapter for any x.DivArg
type ModalContentArgAdapter struct{ arg x.DivArg }

func (a ModalContentArgAdapter) applyUIModalContent(s *modalContentState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.DivArg work directly with ui.ModalContent
func adaptModalContentArg(arg interface{}) ModalContentArg {
	if uiArg, ok := arg.(ModalContentArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.DivArg); ok {
		return ModalContentArgAdapter{coreArg}
	}
	return nil
}

// ModalContent creates the modal content container with shadcn/ui styling
func ModalContent(args ...interface{}) x.Component {
	state := &modalContentState{}

	for _, arg := range args {
		if adapted := adaptModalContentArg(arg); adapted != nil {
			adapted.applyUIModalContent(state)
		}
	}

	// Modal content styling - with entrance animation and focus management
	contentClasses := "modal-content relative bg-background border shadow-lg p-6 w-full max-w-lg grid gap-4 rounded-lg transform scale-90 translate-y-[-20px] opacity-0 transition-all duration-200"

	contentArgs := append([]x.DivArg{
		x.Class(contentClasses),
	}, state.baseArgs...)

	// Add close button (×) in top-right
	contentArgs = append(contentArgs, x.Child(x.A(
		x.Href("#"),
		x.Class("absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity text-xl leading-none w-4 h-4 flex items-center justify-center"),
		x.Aria("label", "Close modal"),
		x.Text("×"),
	)))

	return x.Div(contentArgs...)
}

// ModalHeaderArg interface for UI modal header arguments
type ModalHeaderArg interface {
	applyUIModalHeader(*modalHeaderState)
}

// modalHeaderState holds our modal header configuration
type modalHeaderState struct {
	baseArgs []x.DivArg
}

// Universal adapter for any x.DivArg
type ModalHeaderArgAdapter struct{ arg x.DivArg }

func (a ModalHeaderArgAdapter) applyUIModalHeader(s *modalHeaderState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.DivArg work directly with ui.ModalHeader
func adaptModalHeaderArg(arg interface{}) ModalHeaderArg {
	if uiArg, ok := arg.(ModalHeaderArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.DivArg); ok {
		return ModalHeaderArgAdapter{coreArg}
	}
	return nil
}

// ModalHeader creates a modal header with shadcn/ui styling
func ModalHeader(args ...interface{}) x.Component {
	state := &modalHeaderState{}

	for _, arg := range args {
		if adapted := adaptModalHeaderArg(arg); adapted != nil {
			adapted.applyUIModalHeader(state)
		}
	}

	headerClasses := "flex flex-col space-y-1.5 text-center sm:text-left"
	headerArgs := append([]x.DivArg{x.Class(headerClasses)}, state.baseArgs...)

	return x.Div(headerArgs...)
}

// ModalTitleArg interface for UI modal title arguments
type ModalTitleArg interface {
	applyUIModalTitle(*modalTitleState)
}

// modalTitleState holds our modal title configuration
type modalTitleState struct {
	text     string
	children []x.Component
	baseArgs []x.H2Arg
}

// ModalTitleTextWrapper for text content
type ModalTitleTextWrapper struct{ text string }

func (w ModalTitleTextWrapper) applyUIModalTitle(s *modalTitleState) {
	s.text = w.text
}

func ModalTitleText(text string) ModalTitleTextWrapper {
	return ModalTitleTextWrapper{text}
}

// ModalTitleChildWrapper for child components
type ModalTitleChildWrapper struct{ child x.Component }

func (w ModalTitleChildWrapper) applyUIModalTitle(s *modalTitleState) {
	s.children = append(s.children, w.child)
}

func ModalTitleChild(child x.Component) ModalTitleChildWrapper {
	return ModalTitleChildWrapper{child}
}

// Universal adapter for any x.H2Arg
type ModalTitleArgAdapter struct{ arg x.H2Arg }

func (a ModalTitleArgAdapter) applyUIModalTitle(s *modalTitleState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.H2Arg work directly with ui.ModalTitle
func adaptModalTitleArg(arg interface{}) ModalTitleArg {
	if uiArg, ok := arg.(ModalTitleArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.H2Arg); ok {
		return ModalTitleArgAdapter{coreArg}
	}
	return nil
}

// ModalTitle creates a modal title with shadcn/ui styling
func ModalTitle(args ...interface{}) x.Component {
	state := &modalTitleState{}

	for _, arg := range args {
		if adapted := adaptModalTitleArg(arg); adapted != nil {
			adapted.applyUIModalTitle(state)
		}
	}

	titleClasses := "text-lg font-semibold leading-none tracking-tight"
	titleArgs := append([]x.H2Arg{x.Class(titleClasses)}, state.baseArgs...)

	// Add text if provided
	if state.text != "" {
		titleArgs = append(titleArgs, x.Text(state.text))
	}

	// Add children
	for _, child := range state.children {
		titleArgs = append(titleArgs, x.Child(child))
	}

	return x.H2(titleArgs...)
}

// ModalDescriptionArg interface for UI modal description arguments
type ModalDescriptionArg interface {
	applyUIModalDescription(*modalDescriptionState)
}

// modalDescriptionState holds our modal description configuration
type modalDescriptionState struct {
	text     string
	children []x.Component
	baseArgs []x.PArg
}

// ModalDescriptionTextWrapper for text content
type ModalDescriptionTextWrapper struct{ text string }

func (w ModalDescriptionTextWrapper) applyUIModalDescription(s *modalDescriptionState) {
	s.text = w.text
}

func ModalDescriptionText(text string) ModalDescriptionTextWrapper {
	return ModalDescriptionTextWrapper{text}
}

// ModalDescriptionChildWrapper for child components
type ModalDescriptionChildWrapper struct{ child x.Component }

func (w ModalDescriptionChildWrapper) applyUIModalDescription(s *modalDescriptionState) {
	s.children = append(s.children, w.child)
}

func ModalDescriptionChild(child x.Component) ModalDescriptionChildWrapper {
	return ModalDescriptionChildWrapper{child}
}

// Universal adapter for any x.PArg
type ModalDescriptionArgAdapter struct{ arg x.PArg }

func (a ModalDescriptionArgAdapter) applyUIModalDescription(s *modalDescriptionState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.PArg work directly with ui.ModalDescription
func adaptModalDescriptionArg(arg interface{}) ModalDescriptionArg {
	if uiArg, ok := arg.(ModalDescriptionArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.PArg); ok {
		return ModalDescriptionArgAdapter{coreArg}
	}
	return nil
}

// ModalDescription creates a modal description with shadcn/ui styling
func ModalDescription(args ...interface{}) x.Component {
	state := &modalDescriptionState{}

	for _, arg := range args {
		if adapted := adaptModalDescriptionArg(arg); adapted != nil {
			adapted.applyUIModalDescription(state)
		}
	}

	descClasses := "text-sm text-muted-foreground"
	descArgs := append([]x.PArg{x.Class(descClasses)}, state.baseArgs...)

	// Add text if provided
	if state.text != "" {
		descArgs = append(descArgs, x.Text(state.text))
	}

	// Add children
	for _, child := range state.children {
		descArgs = append(descArgs, x.Child(child))
	}

	return x.P(descArgs...)
}

// ModalFooterArg interface for UI modal footer arguments
type ModalFooterArg interface {
	applyUIModalFooter(*modalFooterState)
}

// modalFooterState holds our modal footer configuration
type modalFooterState struct {
	baseArgs []x.DivArg
}

// Universal adapter for any x.DivArg
type ModalFooterArgAdapter struct{ arg x.DivArg }

func (a ModalFooterArgAdapter) applyUIModalFooter(s *modalFooterState) {
	s.baseArgs = append(s.baseArgs, a.arg)
}

// Magic: make any x.DivArg work directly with ui.ModalFooter
func adaptModalFooterArg(arg interface{}) ModalFooterArg {
	if uiArg, ok := arg.(ModalFooterArg); ok {
		return uiArg
	}
	if coreArg, ok := arg.(x.DivArg); ok {
		return ModalFooterArgAdapter{coreArg}
	}
	return nil
}

// ModalFooter creates a modal footer with shadcn/ui styling
func ModalFooter(args ...interface{}) x.Component {
	state := &modalFooterState{}

	for _, arg := range args {
		if adapted := adaptModalFooterArg(arg); adapted != nil {
			adapted.applyUIModalFooter(state)
		}
	}

	footerClasses := "flex justify-between sm:flex-row gap-2"
	footerArgs := append([]x.DivArg{x.Class(footerClasses)}, state.baseArgs...)

	return x.Div(footerArgs...)
}
