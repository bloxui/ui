import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/cn";
import { flexGapClasses, type Gap } from "./flex";

type Columns = 1 | 2 | 3 | 4 | 5 | 6 | 12;

// Every class written out so Tailwind generates it.
const columns = {
  base: { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6", 12: "grid-cols-12" },
  sm: { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6", 12: "sm:grid-cols-12" },
  md: { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5", 6: "md:grid-cols-6", 12: "md:grid-cols-12" },
  lg: { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6", 12: "lg:grid-cols-12" },
  xl: { 1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3", 4: "xl:grid-cols-4", 5: "xl:grid-cols-5", 6: "xl:grid-cols-6", 12: "xl:grid-cols-12" },
} as const;

export type ResponsiveColumns = Columns | Partial<Record<keyof typeof columns, Columns>>;

export interface GridProps extends React.ComponentProps<"div"> {
  /** A number, or one per breakpoint: { base: 1, md: 2, lg: 4 }. */
  columns?: ResponsiveColumns;
  gap?: Gap;
  asChild?: boolean;
}

export function gridColumnClasses(value: ResponsiveColumns) {
  if (typeof value === "number") return columns.base[value];
  return (Object.keys(value) as (keyof typeof columns)[]).map((breakpoint) => columns[breakpoint][value[breakpoint]!]).join(" ");
}

/** A responsive grid: give it columns per breakpoint and a gap. */
export function Grid({ columns: cols = 1, gap = 4, asChild, className, ...props }: GridProps) {
  const Comp = asChild ? Slot : "div";
  return <Comp data-slot="grid" className={cn("grid", gridColumnClasses(cols), flexGapClasses[gap], className)} {...props} />;
}
