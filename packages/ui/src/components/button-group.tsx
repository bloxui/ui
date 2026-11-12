import * as React from "react";
import { cn } from "../lib/cn";

export interface ButtonGroupProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical";
}

/** Joins the buttons (or inputs and selects) inside it into one segmented control. */
export function ButtonGroup({ className, orientation = "horizontal", ...props }: ButtonGroupProps) {
  return (
    <div
      data-slot="button-group"
      role="group"
      className={cn(
        "inline-flex w-fit [&>*]:relative [&>*:focus-visible]:z-[1] [&>*:focus-within]:z-[1]",
        // The two-class selectors outrank each child's own radius.
        orientation === "horizontal"
          ? "[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none"
          : "flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none",
        className,
      )}
      {...props}
    />
  );
}
