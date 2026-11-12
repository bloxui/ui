"use client";

import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { collapseAnimation } from "./accordion";

/** A single show/hide region. Bring your own trigger with <CollapsibleTrigger asChild>. */
export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

export function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      data-slot="collapsible-content"
      className={cn(collapseAnimation, className)}
      {...props}
    />
  );
}
