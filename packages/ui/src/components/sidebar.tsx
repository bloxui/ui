"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { PanelLeftIcon } from "../lib/icons";
import { Button, type ButtonProps } from "./button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./sheet";
import { Tooltip, TooltipProvider } from "./tooltip";

interface SidebarContextValue {
  /** Desktop: the sidebar is reduced to an icon rail. */
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  /** Below the mobile breakpoint the sidebar becomes a slide-in sheet. */
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  /** Collapses on desktop, opens the sheet on mobile. */
  toggle: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used inside <SidebarProvider>.");
  return context;
}

function useMediaQuery(query: string) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export interface SidebarProviderProps extends React.ComponentProps<"div"> {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Key that toggles the sidebar with Ctrl (Windows/Linux) or ⌘ (macOS). Pass null to turn it off. */
  hotkey?: string | null;
  /** Viewport width (px) below which the sidebar becomes a sheet. */
  mobileBreakpoint?: number;
}

/** Holds the sidebar state and lays out <Sidebar> next to <SidebarInset>. */
export function SidebarProvider({
  className,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  hotkey = "b",
  mobileBreakpoint = 768,
  children,
  ...props
}: SidebarProviderProps) {
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint - 1}px)`);
  const collapsed = collapsedProp ?? internalCollapsed;

  const setCollapsed = React.useCallback(
    (next: boolean) => {
      if (collapsedProp === undefined) setInternalCollapsed(next);
      onCollapsedChange?.(next);
    },
    [collapsedProp, onCollapsedChange],
  );

  const toggle = React.useCallback(() => {
    if (isMobile) setMobileOpen((open) => !open);
    else setCollapsed(!collapsed);
  }, [isMobile, collapsed, setCollapsed]);

  React.useEffect(() => {
    if (!hotkey) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === hotkey.toLowerCase()) {
        event.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [hotkey, toggle]);

  const context = React.useMemo(
    () => ({ collapsed, setCollapsed, isMobile, mobileOpen, setMobileOpen, toggle }),
    [collapsed, setCollapsed, isMobile, mobileOpen, toggle],
  );

  return (
    <SidebarContext.Provider value={context}>
      <TooltipProvider delayDuration={100}>
        <div
          data-slot="sidebar-provider"
          className={cn("flex min-h-dvh w-full [--sidebar-rail:3.5rem] [--sidebar-width:16rem]", className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

export interface SidebarProps extends React.ComponentProps<"aside"> {
  side?: "left" | "right";
  /** Accessible name for the navigation landmark and the mobile sheet. */
  label?: string;
}

/** A collapsible app sidebar. On small screens it turns into a sheet opened by <SidebarTrigger>. */
export function Sidebar({ className, side = "left", label = "Sidebar", children, ...props }: SidebarProps) {
  const { collapsed, isMobile, mobileOpen, setMobileOpen } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side={side} showClose={false} className="w-(--sidebar-width) bg-sunken p-0">
          <SheetTitle className="sr-only">{label}</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
          <div data-slot="sidebar" className="flex min-h-0 flex-1 flex-col">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      data-slot="sidebar"
      data-collapsed={collapsed ? "" : undefined}
      aria-label={label}
      className={cn(
        "group/sidebar sticky top-0 flex h-dvh w-(--sidebar-width) shrink-0 flex-col overflow-hidden bg-sunken text-fg",
        "transition-[width] duration-200 data-[collapsed]:w-(--sidebar-rail)",
        side === "left" ? "border-r border-border" : "order-last border-l border-border",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-header" className={cn("flex shrink-0 flex-col gap-2 p-3", className)} {...props} />;
}

export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-3", className)}
      {...props}
    />
  );
}

export function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("flex shrink-0 flex-col gap-2 border-t border-border p-3", className)}
      {...props}
    />
  );
}

export interface SidebarGroupProps extends React.ComponentProps<"div"> {
  /** Heading for this group of links. Hidden visually when the sidebar is collapsed. */
  label?: React.ReactNode;
}

export function SidebarGroup({ className, label, children, ...props }: SidebarGroupProps) {
  return (
    <div data-slot="sidebar-group" className={cn("flex flex-col gap-1", className)} {...props}>
      {label ? (
        <div className="px-2.5 pb-1 text-xs font-medium text-muted group-data-[collapsed]/sidebar:sr-only">{label}</div>
      ) : null}
      {children}
    </div>
  );
}

export function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="sidebar-menu" className={cn("flex flex-col gap-0.5", className)} {...props} />;
}

export interface SidebarMenuItemProps extends Omit<React.ComponentProps<"button">, "ref"> {
  icon?: React.ReactNode;
  /** Marks the current page. */
  active?: boolean;
  /** Content shown at the end, e.g. a count. Hidden when collapsed. */
  badge?: React.ReactNode;
  /** Renders a link. */
  href?: string;
  /** Component to render instead of <a>/<button>, e.g. your router's Link. */
  as?: React.ElementType;
  /** Tooltip shown when the sidebar is collapsed. Defaults to the label. */
  tooltip?: React.ReactNode;
}

/** A sidebar link or button. When the sidebar is collapsed it shows only the icon, with the label as a tooltip. */
export function SidebarMenuItem({
  className,
  icon,
  active,
  badge,
  href,
  as,
  tooltip,
  children,
  ...props
}: SidebarMenuItemProps) {
  const { collapsed, isMobile } = useSidebar();
  const Comp: React.ElementType = as ?? (href ? "a" : "button");

  return (
    <li data-slot="sidebar-menu-item">
      <Tooltip content={tooltip ?? children} side="right" disabled={!collapsed || isMobile}>
        <Comp
          href={href}
          type={Comp === "button" ? "button" : undefined}
          data-active={active ? "" : undefined}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-sm font-medium text-muted transition-colors outline-none",
            "hover:bg-neutral-soft hover:text-fg focus-visible:ring-2 focus-visible:ring-ring",
            "data-[active]:bg-brand-soft data-[active]:text-brand-text",
            "group-data-[collapsed]/sidebar:justify-center group-data-[collapsed]/sidebar:px-0",
            "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            className,
          )}
          {...props}
        >
          {icon}
          <span className="min-w-0 flex-1 truncate group-data-[collapsed]/sidebar:sr-only">{children}</span>
          {badge ? <span className="shrink-0 group-data-[collapsed]/sidebar:hidden">{badge}</span> : null}
        </Comp>
      </Tooltip>
    </li>
  );
}

/** Button that collapses the sidebar on desktop and opens it on mobile. */
export function SidebarTrigger({ onClick, ...props }: ButtonProps) {
  const { toggle } = useSidebar();
  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      tone="neutral"
      size="sm"
      iconOnly
      aria-label="Toggle sidebar"
      onClick={(event) => {
        onClick?.(event);
        toggle();
      }}
      {...props}
    >
      <PanelLeftIcon />
    </Button>
  );
}

/** The main content area beside the sidebar. */
export function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return <main data-slot="sidebar-inset" className={cn("flex min-w-0 flex-1 flex-col", className)} {...props} />;
}
