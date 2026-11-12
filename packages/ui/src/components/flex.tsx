import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/cn";

// Written out in full so Tailwind finds every class when it scans this file.
const directions = { row: "flex-row", column: "flex-col", "row-reverse": "flex-row-reverse", "column-reverse": "flex-col-reverse" } as const;
const aligns = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch", baseline: "items-baseline" } as const;
const justifies = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between", around: "justify-around", evenly: "justify-evenly" } as const;
const gaps = { 0: "gap-0", 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4", 5: "gap-5", 6: "gap-6", 8: "gap-8", 10: "gap-10", 12: "gap-12" } as const;

export type Gap = keyof typeof gaps;

export interface FlexProps extends React.ComponentProps<"div"> {
  direction?: keyof typeof directions;
  align?: keyof typeof aligns;
  justify?: keyof typeof justifies;
  /** Spacing between children, on the Tailwind scale (4 = 1rem). */
  gap?: Gap;
  wrap?: boolean;
  /** inline-flex instead of flex. */
  inline?: boolean;
  /** Render the child element instead of a div, e.g. a <ul> or <section>. */
  asChild?: boolean;
}

/** A flex container with typed props, for when a class string would be harder to read or vary. */
export function Flex({ direction = "row", align, justify, gap, wrap, inline, asChild, className, ...props }: FlexProps) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      data-slot="flex"
      className={cn(
        inline ? "inline-flex" : "flex",
        directions[direction],
        align && aligns[align],
        justify && justifies[justify],
        gap !== undefined && gaps[gap],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    />
  );
}

export { gaps as flexGapClasses };
