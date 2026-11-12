import * as React from "react";
import { cn } from "../lib/cn";

export interface DescriptionItem {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Columns this item takes, up to `columns`. */
  span?: number;
}

export interface DescriptionsProps extends Omit<React.ComponentProps<"div">, "title"> {
  items: DescriptionItem[];
  title?: React.ReactNode;
  /** Extra content beside the title, e.g. an edit button. */
  extra?: React.ReactNode;
  /** Columns on wide screens; always one column on phones. */
  columns?: 1 | 2 | 3 | 4;
  /** Draw a grid of borders around every item. */
  bordered?: boolean;
  /** Put the label beside the value instead of above it. */
  layout?: "vertical" | "horizontal";
}

const columnClasses = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" } as const;
const spanClasses = { 1: "", 2: "sm:col-span-2", 3: "sm:col-span-2 lg:col-span-3", 4: "sm:col-span-2 lg:col-span-4" } as const;

/** Label–value pairs, such as the details of an order or a profile. Uses a description list. */
export function Descriptions({
  items,
  title,
  extra,
  columns = 3,
  bordered = false,
  layout = "vertical",
  className,
  ...props
}: DescriptionsProps) {
  return (
    <div data-slot="descriptions" className={cn("grid gap-3", className)} {...props}>
      {title || extra ? (
        <div className="flex items-center justify-between gap-3">
          {title ? <h3 className="text-base font-semibold">{title}</h3> : <span />}
          {extra}
        </div>
      ) : null}
      <dl
        className={cn(
          "grid grid-cols-1",
          columnClasses[columns],
          bordered ? "overflow-hidden rounded-lg border border-border [&>div]:border-border" : "gap-x-6 gap-y-4",
        )}
      >
        {items.map((item, index) => {
          const span = Math.min(item.span ?? 1, columns) as 1 | 2 | 3 | 4;
          return (
            <div
              key={index}
              className={cn(
                spanClasses[span],
                layout === "horizontal" ? "flex gap-3" : "grid gap-1",
                // Inner borders only: each cell draws its top and left edge, and the outer frame hides the overflow.
                bordered && "-mt-px -ml-px border-t border-l p-3",
              )}
            >
              <dt className={cn("text-sm text-muted", layout === "horizontal" && "w-32 shrink-0")}>{item.label}</dt>
              <dd className="min-w-0 text-sm font-medium break-words text-fg">{item.value}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
