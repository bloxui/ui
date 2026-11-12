import * as React from "react";
import { cn } from "../lib/cn";

export interface TableProps extends React.ComponentProps<"table"> {
  /** Shade every other row. */
  striped?: boolean;
  /** Tighter rows for data-heavy screens. */
  dense?: boolean;
  /** Keep the header visible while the body scrolls. Give the container a max height. */
  stickyHeader?: boolean;
  /** Class for the scrolling wrapper; `className` targets the <table>. */
  containerClassName?: string;
}

/** Scrolls horizontally inside its own container, so wide tables never break the page layout. */
export function Table({
  className,
  containerClassName,
  striped,
  dense,
  stickyHeader,
  ...props
}: TableProps) {
  return (
    <div
      data-slot="table-container"
      className={cn("relative w-full overflow-auto rounded-lg border border-border", containerClassName)}
    >
      <table
        data-slot="table"
        data-striped={striped ? "" : undefined}
        data-dense={dense ? "" : undefined}
        data-sticky={stickyHeader ? "" : undefined}
        className={cn("group/table w-full caption-bottom border-collapse text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "bg-sunken group-data-[sticky]/table:sticky group-data-[sticky]/table:top-0 group-data-[sticky]/table:z-10",
        className,
      )}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&_tr:last-child]:border-0 [&_tr:hover]:bg-neutral-soft/60",
        "group-data-[striped]/table:[&_tr:nth-child(even)]:bg-sunken/60",
        className,
      )}
      {...props}
    />
  );
}

export function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t border-border bg-sunken font-medium", className)}
      {...props}
    />
  );
}

/** Set data-state="selected" to highlight a selected row. */
export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border transition-colors data-[state=selected]:bg-brand-soft/60",
        className,
      )}
      {...props}
    />
  );
}

interface CellExtras {
  /** Right-align and use tabular figures, for numbers and money. */
  numeric?: boolean;
}

export function TableHead({ className, numeric, ...props }: React.ComponentProps<"th"> & CellExtras) {
  return (
    <th
      data-slot="table-head"
      scope="col"
      className={cn(
        "h-10 px-4 align-middle text-xs font-medium whitespace-nowrap text-muted",
        "group-data-[dense]/table:h-8 group-data-[dense]/table:px-3",
        numeric ? "text-right" : "text-left",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, numeric, ...props }: React.ComponentProps<"td"> & CellExtras) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-3 align-middle group-data-[dense]/table:px-3 group-data-[dense]/table:py-1.5",
        numeric && "text-right tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption data-slot="table-caption" className={cn("px-4 py-3 text-sm text-muted", className)} {...props} />
  );
}
