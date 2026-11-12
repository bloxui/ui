"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { TriangleAlertIcon } from "../lib/icons";
import { popupClass } from "../lib/overlay";
import type { Tone } from "../lib/tone";
import { Button } from "./button";

export interface PopconfirmProps {
  /** The element that opens the confirmation, usually a button. */
  children: React.ReactElement;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Runs on confirm. Return a promise to show a spinner and keep it open until it settles. */
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" for destructive actions. */
  tone?: Tone;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

/**
 * A small confirmation next to the button that triggered it, for actions that need a
 * second look but not a full dialog. Focus starts on Cancel so Enter never confirms by accident.
 */
export function Popconfirm({
  children,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  side = "top",
  align = "center",
}: PopconfirmProps) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const titleId = React.useId();
  const descriptionId = React.useId();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (pending) return;
        setOpen(next);
        if (!next) onCancel?.();
      }}
    >
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="popconfirm"
          role="alertdialog"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          side={side}
          align={align}
          sideOffset={8}
          collisionPadding={8}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            cancelRef.current?.focus();
          }}
          className={cn(popupClass, "grid w-72 gap-3 p-4 text-sm")}
        >
          <div className="flex gap-2.5">
            <TriangleAlertIcon className={cn("mt-0.5 size-4 shrink-0", tone === "danger" ? "text-danger-text" : "text-warning-text")} />
            <div className="grid gap-1">
              <p id={titleId} className="font-medium">
                {title}
              </p>
              {description ? (
                <p id={descriptionId} className="text-muted">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              ref={cancelRef}
              variant="outline"
              tone="neutral"
              size="xs"
              disabled={pending}
              onClick={() => {
                setOpen(false);
                onCancel?.();
              }}
            >
              {cancelLabel}
            </Button>
            <Button
              tone={tone}
              size="xs"
              loading={pending}
              onClick={async () => {
                setPending(true);
                try {
                  await onConfirm();
                  setOpen(false);
                } finally {
                  setPending(false);
                }
              }}
            >
              {confirmLabel}
            </Button>
          </div>
          <PopoverPrimitive.Arrow className="fill-surface" width={12} height={6} />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
