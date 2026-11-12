"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { ChevronDownIcon } from "../lib/icons";

export const collapseAnimation =
  "overflow-hidden data-[state=open]:animate-collapse-down data-[state=closed]:animate-collapse-up";

export type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root> & {
  /** `divided` separates items with lines; `card` gives each item its own bordered box. */
  variant?: "divided" | "card";
};

/** Use type="single" (add `collapsible` to allow closing) or type="multiple". */
export function Accordion({ className, variant = "divided", ...props }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      data-variant={variant}
      className={cn("group/accordion flex w-full flex-col", variant === "card" && "gap-2", className)}
      {...props}
    />
  );
}

export function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "group-data-[variant=divided]/accordion:border-b group-data-[variant=divided]/accordion:border-border group-data-[variant=divided]/accordion:last:border-b-0",
        "group-data-[variant=card]/accordion:rounded-lg group-data-[variant=card]/accordion:border group-data-[variant=card]/accordion:border-border group-data-[variant=card]/accordion:bg-surface group-data-[variant=card]/accordion:px-4",
        className,
      )}
      {...props}
    />
  );
}

export interface AccordionTriggerProps extends React.ComponentProps<typeof AccordionPrimitive.Trigger> {
  /** Heading level wrapping the trigger, so the accordion fits the page outline. */
  headingLevel?: "h2" | "h3" | "h4" | "h5" | "h6";
}

export function AccordionTrigger({
  className,
  children,
  headingLevel: Heading = "h3",
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header asChild>
      <Heading className="flex">
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(
            "group flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-colors outline-none",
            "hover:text-brand-text focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            className,
          )}
          {...props}
        >
          {children}
          <ChevronDownIcon className="size-4 shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content data-slot="accordion-content" className={collapseAnimation} {...props}>
      {/* Padding lives on the inner element so the height animation stays smooth. */}
      <div className={cn("pb-4 text-sm text-muted", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
