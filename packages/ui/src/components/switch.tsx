"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { useFieldControl } from "../lib/field-context";
import { toneClasses, type Tone } from "../lib/tone";

export interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  size?: "sm" | "md";
  tone?: Tone;
}

export function Switch({
  className,
  size = "md",
  tone = "brand",
  id,
  required,
  "aria-describedby": describedBy,
  ...props
}: SwitchProps) {
  const control = useFieldControl({ id, required, "aria-describedby": describedBy });
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      id={control.id}
      required={control.required}
      aria-describedby={control["aria-describedby"]}
      className={cn(
        toneClasses[tone],
        "inline-flex shrink-0 items-center rounded-full bg-border-strong p-0.5",
        "transition-[background-color,box-shadow] duration-200 outline-none",
        "focus-visible:ring-3 focus-visible:ring-ring/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-(--t)",
        size === "sm" ? "h-4 w-7" : "h-5 w-9",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block rounded-full bg-white shadow-sm transition-transform duration-200",
          size === "sm"
            ? "size-3 data-[state=checked]:translate-x-3"
            : "size-4 data-[state=checked]:translate-x-4",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
