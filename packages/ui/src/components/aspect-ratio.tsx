import * as React from "react";
import { cn } from "../lib/cn";

export interface AspectRatioProps extends React.ComponentProps<"div"> {
  /** Width divided by height, e.g. 16 / 9. */
  ratio?: number;
}

/** Keeps its box at a fixed ratio; a direct <img> or <video> child fills and crops to fit. */
export function AspectRatio({ className, ratio = 1, style, ...props }: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ aspectRatio: ratio, ...style }}
      className={cn(
        "relative w-full overflow-hidden [&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover",
        className,
      )}
      {...props}
    />
  );
}
