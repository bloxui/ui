"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

const InsideProvider = React.createContext(false);

/**
 * Optional. Wrap your app (or a toolbar) to share one delay and let the pointer
 * move between neighbouring tooltips without waiting again.
 */
export function TooltipProvider({
  delayDuration = 300,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <InsideProvider.Provider value>
      <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
    </InsideProvider.Provider>
  );
}

export interface TooltipProps
  extends Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, "content" | "children"> {
  /** Tooltip text. Nothing is rendered when it is empty. */
  content: React.ReactNode;
  /** The element that triggers the tooltip. It must accept a ref and event props. */
  children: React.ReactElement;
  /** Keyboard hint shown after the text, e.g. "Ctrl S". */
  shortcut?: React.ReactNode;
  arrow?: boolean;
  /** Turns the tooltip off without unwrapping the trigger. */
  disabled?: boolean;
  delayDuration?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** One element: `<Tooltip content="Save"><Button /></Tooltip>`. No provider needed. */
export function Tooltip({
  content,
  children,
  shortcut,
  arrow = true,
  disabled = false,
  delayDuration,
  open,
  defaultOpen,
  onOpenChange,
  className,
  side = "top",
  sideOffset = 6,
  collisionPadding = 8,
  ...props
}: TooltipProps) {
  const insideProvider = React.useContext(InsideProvider);
  if (disabled || content === null || content === undefined || content === "") return children;

  const tooltip = (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          data-slot="tooltip"
          side={side}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          className={cn(
            "z-50 flex max-w-64 items-center gap-2 rounded-md bg-neutral px-2.5 py-1.5 text-xs font-medium text-neutral-fg shadow-raised",
            "origin-(--radix-tooltip-content-transform-origin) animate-pop-in data-[state=closed]:animate-pop-out",
            className,
          )}
          {...props}
        >
          {content}
          {shortcut ? <span className="opacity-65">{shortcut}</span> : null}
          {arrow ? <TooltipPrimitive.Arrow width={10} height={5} className="fill-neutral" /> : null}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );

  return insideProvider ? (
    tooltip
  ) : (
    <TooltipPrimitive.Provider delayDuration={delayDuration ?? 300}>{tooltip}</TooltipPrimitive.Provider>
  );
}
