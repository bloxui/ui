"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "../lib/cn";
import { SearchIcon } from "../lib/icons";
import { MenuItemInner, menuSeparatorClass, type MenuItemExtras } from "../lib/overlay";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog";

/** A searchable list of actions. Use it inline, or inside <CommandDialog> for a ⌘K palette. */
export function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn("flex size-full flex-col overflow-hidden rounded-[inherit] bg-surface text-fg", className)}
      {...props}
    />
  );
}

export function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="flex shrink-0 items-center gap-2 border-b border-border px-3.5">
      <SearchIcon className="size-4 shrink-0 text-muted" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted/70 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn("max-h-80 scroll-py-1 overflow-x-hidden overflow-y-auto p-1 outline-none", className)}
      {...props}
    />
  );
}

export function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-8 text-center text-sm text-muted", className)}
      {...props}
    />
  );
}

export function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function CommandItem({
  className,
  tone = "neutral",
  icon,
  shortcut,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item> & Omit<MenuItemExtras, "inset">) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      data-tone={tone}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none select-none",
        "data-[selected=true]:bg-neutral-soft data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "data-[tone=danger]:text-danger-text data-[tone=danger]:data-[selected=true]:bg-danger-soft",
        "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MenuItemInner icon={icon} shortcut={shortcut}>
        {children}
      </MenuItemInner>
    </CommandPrimitive.Item>
  );
}

export function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn(menuSeparatorClass, className)}
      {...props}
    />
  );
}

export interface CommandDialogProps extends React.ComponentProps<typeof Dialog> {
  /** Accessible name; visually hidden. */
  title?: string;
  description?: string;
  /** A key that toggles the palette together with Ctrl (Windows/Linux) or ⌘ (macOS), e.g. "k". */
  hotkey?: string;
  /** Width of the palette. */
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** The ⌘K palette: a Command inside a Dialog, with the keyboard shortcut built in. */
export function CommandDialog({
  title = "Command palette",
  description = "Search for a command to run.",
  hotkey,
  size = "md",
  className,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: CommandDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  React.useEffect(() => {
    if (!hotkey) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === hotkey.toLowerCase()) {
        event.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [hotkey, open, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogContent
        size={size}
        showClose={false}
        className={cn("top-[15%] translate-y-0 overflow-hidden p-0", className)}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}
