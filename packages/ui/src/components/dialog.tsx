"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { XIcon } from "../lib/icons";
import { backdropClass, closeButtonClass } from "../lib/overlay";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "h-[calc(100dvh-2rem)] max-w-none",
} as const;

export interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  size?: keyof typeof sizes;
  /** Show the corner close button. */
  showClose?: boolean;
  closeLabel?: string;
  /** Set to false to keep the dialog open on outside click and Escape (e.g. unsaved changes). */
  dismissible?: boolean;
}

/** Portal and backdrop are built in. Tall content scrolls inside <DialogBody>, keeping header and footer in view. */
export function DialogContent({
  className,
  children,
  size = "md",
  showClose = true,
  closeLabel = "Close",
  dismissible = true,
  onInteractOutside,
  onEscapeKeyDown,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay data-slot="dialog-backdrop" className={backdropClass} />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        onInteractOutside={(event) => {
          onInteractOutside?.(event);
          if (!dismissible) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          onEscapeKeyDown?.(event);
          if (!dismissible) event.preventDefault();
        }}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col",
          "rounded-xl border border-border bg-surface text-fg shadow-raised outline-none [--dialog-pad:--spacing(6)]",
          "data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out",
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
        {showClose ? (
          <DialogPrimitive.Close aria-label={closeLabel} className={closeButtonClass}>
            <XIcon className="size-4" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      // Right padding leaves room for the close button.
      className={cn("flex shrink-0 flex-col gap-1.5 p-(--dialog-pad) pr-14 pb-4", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-snug font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted", className)}
      {...props}
    />
  );
}

/** The scrollable middle of the dialog. */
export function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto px-(--dialog-pad) pb-(--dialog-pad) first:pt-(--dialog-pad)",
        className,
      )}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex shrink-0 flex-col-reverse gap-2 px-(--dialog-pad) pb-(--dialog-pad) first:pt-(--dialog-pad) sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}
