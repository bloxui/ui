"use client";

import * as React from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { popupClass } from "../lib/overlay";

/** A preview shown when hovering or focusing a link. For sighted pointer users only: never put essential content here. */
export function HoverCard({
  openDelay = 400,
  closeDelay = 150,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root openDelay={openDelay} closeDelay={closeDelay} {...props} />;
}

export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export function HoverCardContent({
  className,
  align = "center",
  sideOffset = 8,
  collisionPadding = 8,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          popupClass,
          "w-72 origin-(--radix-hover-card-content-transform-origin) p-4 text-sm",
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}
