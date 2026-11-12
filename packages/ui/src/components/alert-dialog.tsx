"use client";

import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { backdropClass } from "../lib/overlay";
import { Button, type ButtonProps } from "./button";

/** A dialog that interrupts the user and requires a decision; it cannot be dismissed by clicking outside. */
export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay data-slot="alert-dialog-backdrop" className={backdropClass} />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-5 overflow-y-auto",
          "rounded-xl border border-border bg-surface p-6 text-fg shadow-raised outline-none",
          "data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out",
          className,
        )}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  );
}

export function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-header" className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

export function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg leading-snug font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted", className)}
      {...props}
    />
  );
}

export function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

/** The confirming button. Takes every Button prop, e.g. tone="danger" for destructive actions. */
export function AlertDialogAction(props: ButtonProps) {
  return (
    <AlertDialogPrimitive.Action asChild>
      <Button {...props} />
    </AlertDialogPrimitive.Action>
  );
}

/** The safe way out. Receives focus first, so Enter never triggers the destructive action by accident. */
export function AlertDialogCancel({ variant = "outline", tone = "neutral", ...props }: ButtonProps) {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button variant={variant} tone={tone} {...props} />
    </AlertDialogPrimitive.Cancel>
  );
}
