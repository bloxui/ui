import * as React from "react";
import { cn } from "../lib/cn";

/** Placeholder block with a shimmer; size it with className (e.g. "h-4 w-32"). */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-md bg-neutral-soft",
        "before:absolute before:inset-0 before:animate-shimmer before:bg-linear-to-r before:from-transparent before:via-surface/70 before:to-transparent",
        "motion-reduce:before:hidden",
        className,
      )}
      {...props}
    />
  );
}

export interface SkeletonTextProps extends React.ComponentProps<"div"> {
  lines?: number;
}

/** Paragraph placeholder; the last line is shorter, like real text. */
export function SkeletonText({ className, lines = 3, ...props }: SkeletonTextProps) {
  return (
    <div data-slot="skeleton-text" aria-hidden className={cn("flex flex-col gap-2", className)} {...props}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn("h-3.5", index === lines - 1 && lines > 1 ? "w-3/5" : "w-full")}
        />
      ))}
    </div>
  );
}
