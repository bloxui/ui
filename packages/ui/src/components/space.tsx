import * as React from "react";
import { cn } from "../lib/cn";
import { flexGapClasses, type Gap } from "./flex";

export interface SpaceProps extends React.ComponentProps<"div"> {
  gap?: Gap;
  direction?: "horizontal" | "vertical";
  /** Put this between every pair of children, e.g. a "·" or a vertical Separator. */
  separator?: React.ReactNode;
  wrap?: boolean;
  align?: "start" | "center" | "end" | "baseline";
}

const aligns = { start: "items-start", center: "items-center", end: "items-end", baseline: "items-baseline" } as const;

/** Evenly spaced inline items, optionally with a separator between them; empty children are skipped. */
export function Space({
  gap = 2,
  direction = "horizontal",
  separator,
  wrap = true,
  align = "center",
  className,
  children,
  ...props
}: SpaceProps) {
  // toArray already drops null, undefined and booleans; also skip empty strings.
  const items = React.Children.toArray(children).filter((child) => child !== "");
  return (
    <div
      data-slot="space"
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col" : cn("flex-row", wrap && "flex-wrap"),
        aligns[align],
        flexGapClasses[gap],
        className,
      )}
      {...props}
    >
      {items.map((child, index) => (
        <React.Fragment key={React.isValidElement(child) && child.key !== null ? child.key : index}>
          {index > 0 && separator ? (
            <span aria-hidden className="flex items-center text-muted">
              {separator}
            </span>
          ) : null}
          {child}
        </React.Fragment>
      ))}
    </div>
  );
}
