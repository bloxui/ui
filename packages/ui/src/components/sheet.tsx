"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { XIcon } from "../lib/icons";
import { backdropClass, closeButtonClass } from "../lib/overlay";
import { DialogBody, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";

/** A panel that slides in from a screen edge. Shares its parts with Dialog. */
export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetHeader = DialogHeader;
export const SheetTitle = DialogTitle;
export const SheetDescription = DialogDescription;
export const SheetBody = DialogBody;
export const SheetFooter = DialogFooter;

const sides = {
  right: "inset-y-0 right-0 h-full w-[min(100vw_-_3rem,var(--sheet-size))] border-l [--bx-slide-x:100%]",
  left: "inset-y-0 left-0 h-full w-[min(100vw_-_3rem,var(--sheet-size))] border-r [--bx-slide-x:-100%]",
  top: "inset-x-0 top-0 max-h-[min(100dvh_-_3rem,var(--sheet-size))] border-b [--bx-slide-y:-100%]",
  bottom: "inset-x-0 bottom-0 max-h-[min(100dvh_-_3rem,var(--sheet-size))] border-t [--bx-slide-y:100%]",
} as const;

const sizes = {
  sm: "[--sheet-size:20rem]",
  md: "[--sheet-size:24rem]",
  lg: "[--sheet-size:32rem]",
  xl: "[--sheet-size:42rem]",
} as const;

export interface SheetContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  side?: keyof typeof sides;
  /** Width for left/right sheets, maximum height for top/bottom sheets. */
  size?: keyof typeof sizes;
  showClose?: boolean;
  closeLabel?: string;
}

export function SheetContent({
  className,
  children,
  side = "right",
  size = "md",
  showClose = true,
  closeLabel = "Close",
  ...props
}: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay data-slot="sheet-backdrop" className={backdropClass} />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col border-border bg-surface text-fg shadow-raised outline-none [--dialog-pad:--spacing(6)]",
          "data-[state=open]:animate-slide-in data-[state=closed]:animate-slide-out",
          sizes[size],
          sides[side],
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
