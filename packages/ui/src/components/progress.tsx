"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { toneClasses, type Tone } from "../lib/tone";

const sizes = { sm: "h-1", md: "h-2", lg: "h-3" } as const;

export interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  tone?: Tone;
  size?: keyof typeof sizes;
}

/** Omit `value` (or pass null) for an indeterminate bar. Give it an aria-label. */
export function Progress({
  className,
  tone = "brand",
  size = "md",
  value,
  max = 100,
  ...props
}: ProgressProps) {
  const indeterminate = value === null || value === undefined;
  const percent = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={indeterminate ? null : value}
      max={max}
      className={cn(
        toneClasses[tone],
        "relative w-full overflow-hidden rounded-full bg-border",
        sizes[size],
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "block h-full rounded-full bg-(--t)",
          indeterminate ? "w-2/5 animate-indeterminate" : "transition-[width] duration-300 ease-out",
        )}
        style={indeterminate ? undefined : { width: `${percent}%` }}
      />
    </ProgressPrimitive.Root>
  );
}
