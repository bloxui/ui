"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { useFieldControl } from "../lib/field-context";
import { CheckIcon, MinusIcon } from "../lib/icons";
import { toneClasses, type Tone } from "../lib/tone";

export interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  size?: "sm" | "md";
  tone?: Tone;
  invalid?: boolean;
}

/** Supports `checked="indeterminate"` for "some selected" states. */
export function Checkbox({
  className,
  size = "md",
  tone = "brand",
  invalid,
  id,
  required,
  "aria-describedby": describedBy,
  ...props
}: CheckboxProps) {
  const control = useFieldControl({ id, invalid, required, "aria-describedby": describedBy });
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      id={control.id}
      required={control.required}
      aria-describedby={control["aria-describedby"]}
      aria-invalid={control.invalid || undefined}
      className={cn(
        toneClasses[tone],
        "group inline-flex shrink-0 items-center justify-center rounded-[5px] border border-border-strong bg-surface text-(color:--t-fg) shadow-xs",
        "transition-[background-color,border-color,box-shadow] duration-150 outline-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-(color:--t) data-[state=checked]:bg-(--t)",
        "data-[state=indeterminate]:border-(color:--t) data-[state=indeterminate]:bg-(--t)",
        "aria-invalid:border-danger",
        size === "sm" ? "size-4" : "size-[1.125rem]",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <CheckIcon strokeWidth={3} className="size-3.5 group-data-[state=indeterminate]:hidden" />
        <MinusIcon strokeWidth={3} className="hidden size-3.5 group-data-[state=indeterminate]:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
