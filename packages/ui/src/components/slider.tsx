"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { toneClasses, type Tone } from "../lib/tone";

export interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  tone?: Tone;
  /** Accessible name for each thumb, e.g. ["Minimum price", "Maximum price"]. Falls back to aria-label. */
  thumbLabels?: string[];
}

/** Pass an array with two values for a range slider; one thumb is rendered per value. */
export function Slider({
  className,
  tone = "brand",
  thumbLabels,
  value,
  defaultValue,
  min = 0,
  "aria-label": ariaLabel,
  ...props
}: SliderProps) {
  const thumbCount = (value ?? defaultValue ?? [min]).length;
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      min={min}
      className={cn(
        toneClasses[tone],
        "relative flex touch-none items-center select-none data-[disabled]:opacity-50",
        "data-[orientation=horizontal]:h-5 data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-32 data-[orientation=vertical]:w-5 data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative grow overflow-hidden rounded-full bg-border data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5">
        <SliderPrimitive.Range className="absolute bg-(--t) data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          aria-label={thumbLabels?.[index] ?? ariaLabel}
          className="block size-[1.125rem] rounded-full border-2 border-(color:--t) bg-white shadow-sm transition-[box-shadow,scale] duration-150 outline-none hover:scale-110 focus-visible:ring-4 focus-visible:ring-ring/30 data-[disabled]:pointer-events-none"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
