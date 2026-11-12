"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { toneClasses, type Tone } from "../lib/tone";

export interface RadioGroupProps extends React.ComponentProps<typeof RadioGroupPrimitive.Root> {
  /** Applies to every item in the group. */
  tone?: Tone;
}

export function RadioGroup({ className, tone = "brand", orientation = "vertical", ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      orientation={orientation}
      className={cn(
        toneClasses[tone],
        orientation === "horizontal" ? "flex flex-wrap gap-x-5 gap-y-2.5" : "grid gap-2.5",
        className,
      )}
      {...props}
    />
  );
}

export function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "inline-flex size-[1.125rem] shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface shadow-xs",
        "transition-[background-color,border-color,box-shadow] duration-150 outline-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-(color:--t) data-[state=checked]:bg-(--t)",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="size-2 rounded-full bg-(--t-fg)" />
    </RadioGroupPrimitive.Item>
  );
}
