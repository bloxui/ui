"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "../lib/cn";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "../lib/icons";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const navButton =
  "pointer-events-auto inline-flex size-8 items-center justify-center rounded-md text-muted transition-colors outline-none hover:bg-neutral-soft hover:text-fg focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40";

/**
 * A month grid for picking dates. Takes every react-day-picker prop:
 * mode="single" | "multiple" | "range", `selected`, `onSelect`, `disabled`, `numberOfMonths`…
 */
export function Calendar({ className, classNames, showOutsideDays = true, components, ...props }: CalendarProps) {
  return (
    <DayPicker
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      className={cn("w-fit p-3", className)}
      classNames={{
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex flex-col gap-3",
        month_caption: "flex h-8 items-center justify-center px-9",
        caption_label: "text-sm font-medium",
        // The bar spans the caption, so only its buttons take pointer events.
        nav: "pointer-events-none absolute inset-x-0 top-0 z-[1] flex items-center justify-between",
        button_previous: navButton,
        button_next: navButton,
        dropdowns: "flex items-center gap-1.5 text-sm font-medium",
        dropdown_root:
          "relative inline-flex h-8 items-center gap-1 rounded-md border border-border-strong px-2 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
        dropdown: "absolute inset-0 cursor-pointer opacity-0",
        month_grid: "border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-xs font-normal text-muted",
        week: "mt-1 flex",
        day: "relative size-9 p-0 text-center text-sm",
        day_button:
          "inline-flex size-9 items-center justify-center rounded-md transition-colors outline-none hover:bg-neutral-soft focus-visible:ring-2 focus-visible:ring-ring",
        today: "[&>button]:ring-1 [&>button]:ring-border-strong [&>button]:ring-inset",
        selected: "[&>button]:bg-brand [&>button]:font-medium [&>button]:text-brand-fg [&>button]:hover:bg-brand-hover",
        range_start: "rounded-l-md bg-brand-soft",
        range_end: "rounded-r-md bg-brand-soft",
        // Middle days carry `selected` too, so these need to win over it.
        range_middle:
          "bg-brand-soft [&>button]:rounded-none [&>button]:bg-transparent! [&>button]:font-normal! [&>button]:text-brand-text!",
        outside: "[&>button]:opacity-45",
        disabled: "[&>button]:pointer-events-none [&>button]:opacity-35",
        hidden: "invisible",
        chevron: "size-4",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass }) => {
          const Icon =
            orientation === "left" ? ChevronLeftIcon : orientation === "right" ? ChevronRightIcon : ChevronDownIcon;
          return <Icon className={cn("size-4", chevronClass)} />;
        },
        ...components,
      }}
      {...props}
    />
  );
}
