package ui

import x "github.com/bloxui/blox"

// ModalComponent wraps the modal div with asset registration
type ModalComponent struct{ x.Component }

func (mc ModalComponent) CSS() string {
	return `
.modal:target {
    opacity: 1 !important;
    pointer-events: auto !important;
}

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

func (mc ModalComponent) JS() string {
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

func (mc ModalComponent) Name() string {
	return "modal"
}

// Modal creates a CSS-only modal using :target pseudo-class
func Modal(args ...x.DivArg) ModalComponent {

	// CSS classes for modal - hidden by default, shown when targeted via CSS
	modalClasses := "modal fixed inset-0 z-50 bg-black/50 opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center"

	modalArgs := append([]x.DivArg{
		x.Class(modalClasses),
		x.Role("dialog"),
		x.Aria("modal", "true"),
	}, args...)

	// Add backdrop link for closing modal (click outside)
	modalArgs = append(modalArgs, x.A(
		x.Href("#"),
		x.Class("absolute inset-0 z-[-1]"),
	))

	// Add accessible close link that can be reached with keyboard navigation
	modalArgs = append(modalArgs, x.A(
		x.Href("#"),
		x.Class("modal-esc-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:bg-background focus:border focus:px-2 focus:py-1 focus:rounded focus:text-sm focus:z-[1002]"),
		x.Text("Press Tab then Enter to close"),
		x.Aria("label", "Close modal with keyboard"),
	))

	return ModalComponent{Component: x.Div(modalArgs...)}
}

// ModalNode returns only the markup Node (no asset behaviors).
// Useful when you want to place the modal in the DOM without relying on wrappers.
func ModalNode(args ...x.DivArg) x.Node {
	// same base as Modal
	modalClasses := "modal fixed inset-0 z-50 bg-black/50 opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center"
	modalArgs := append([]x.DivArg{
		x.Class(modalClasses),
		x.Role("dialog"),
		x.Aria("modal", "true"),
	}, args...)
	// backdrop and accessible close link
	modalArgs = append(modalArgs,
		x.A(x.Href("#"), x.Class("absolute inset-0 z-[-1]")),
		x.A(
			x.Href("#"),
			x.Class("modal-esc-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:bg-background focus:border focus:px-2 focus:py-1 focus:rounded focus:text-sm focus:z-[1002]"),
			x.Text("Press Tab then Enter to close"),
			x.Aria("label", "Close modal with keyboard"),
		),
	)
	return x.Div(modalArgs...)
}

// ModalTrigger creates a trigger link for opening the modal. Pass x.AArg like x.Href("#id"), x.Text/x.T, classes, etc.
func ModalTrigger(args ...x.AArg) x.Node {
	return x.A(args...)
}

// ModalContent creates the modal content container with shadcn/ui styling
func ModalContent(args ...x.DivArg) x.Node {

	// Modal content styling - with entrance animation and focus management
	contentClasses := "modal-content relative bg-background border shadow-lg p-6 w-full max-w-lg grid gap-4 rounded-lg transform scale-90 translate-y-[-20px] opacity-0 transition-all duration-200"

	contentArgs := append([]x.DivArg{x.Class(contentClasses)}, args...)

	// Add close button (×) in top-right
	contentArgs = append(contentArgs, x.A(
		x.Href("#"),
		x.Class("absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity text-xl leading-none w-4 h-4 flex items-center justify-center"),
		x.Aria("label", "Close modal"),
		x.Text("×"),
	))

	return x.Div(contentArgs...)
}

// ModalHeader creates a modal header with shadcn/ui styling
func ModalHeader(args ...x.DivArg) x.Node {
	headerClasses := "flex flex-col space-y-1.5 text-center sm:text-left"
	headerArgs := append([]x.DivArg{x.Class(headerClasses)}, args...)
	return x.Div(headerArgs...)
}

// ModalTitle creates a modal title with shadcn/ui styling. Pass x.H2Arg (x.Text/x.T, x.Child, etc.)
func ModalTitle(args ...x.H2Arg) x.Node {
	titleClasses := "text-lg font-semibold leading-none tracking-tight"
	titleArgs := append([]x.H2Arg{x.Class(titleClasses)}, args...)
	return x.H2(titleArgs...)
}

// ModalDescription creates a modal description with shadcn/ui styling
func ModalDescription(args ...x.PArg) x.Node {
	descClasses := "text-sm text-muted-foreground"
	descArgs := append([]x.PArg{x.Class(descClasses)}, args...)
	return x.P(descArgs...)
}

// ModalFooter creates a modal footer with shadcn/ui styling
func ModalFooter(args ...x.DivArg) x.Node {
	footerClasses := "flex justify-between sm:flex-row gap-2"
	footerArgs := append([]x.DivArg{x.Class(footerClasses)}, args...)
	return x.Div(footerArgs...)
}

// Make ModalComponent passable where x.DivArg is expected (no x.Child needed)
func (mc ModalComponent) applyDiv(_ *x.DivAttrs, kids *[]x.Component) { *kids = append(*kids, mc) }
