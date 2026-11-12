"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { useFieldControl } from "../lib/field-context";
import { CheckIcon, ChevronsUpDownIcon } from "../lib/icons";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  /** Extra words the search should match, e.g. ["js"] for JavaScript. */
  keywords?: string[];
}

const triggerSizes = {
  sm: "h-8 rounded-md px-2.5 text-sm",
  md: "h-9 rounded-lg px-3 text-sm",
  lg: "h-11 rounded-lg px-3.5 text-base",
} as const;

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  /** Called with the new value, or "" when the selection is cleared. */
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: React.ReactNode;
  /** Let the user clear the selection by picking the selected option again. */
  clearable?: boolean;
  size?: keyof typeof triggerSizes;
  invalid?: boolean;
  disabled?: boolean;
  /** Submits the value with a form under this name. */
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/** A searchable select. Pass the options as data; search, keyboard and selection are handled. */
export function Combobox({
  options,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search",
  emptyText = "No results found.",
  clearable = false,
  size = "md",
  invalid,
  disabled,
  name,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: ComboboxProps) {
  const control = useFieldControl({ id, invalid, "aria-describedby": describedBy });
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = valueProp ?? internalValue;
  const selected = options.find((option) => option.value === value);

  function select(next: string) {
    const resolved = next === value ? (clearable ? "" : value) : next;
    if (valueProp === undefined) setInternalValue(resolved);
    if (resolved !== value) onValueChange?.(resolved);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-slot="combobox-trigger"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={ariaLabel}
          id={control.id}
          aria-describedby={control["aria-describedby"]}
          aria-invalid={control.invalid || undefined}
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between gap-2 border border-border-strong bg-surface text-left text-fg shadow-xs",
            "transition-[border-color,box-shadow] duration-150 outline-none",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25",
            "disabled:cursor-not-allowed disabled:bg-sunken disabled:opacity-60 aria-invalid:border-danger",
            triggerSizes[size],
            className,
          )}
        >
          <span className={cn("flex min-w-0 items-center gap-2", !selected && "text-muted/70")}>
            {selected?.icon ? <span className="flex shrink-0 text-muted [&_svg]:size-4">{selected.icon}</span> : null}
            <span className="truncate">{selected ? selected.label : placeholder}</span>
          </span>
          <ChevronsUpDownIcon className="size-4 shrink-0 text-muted" />
        </button>
      </PopoverTrigger>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) min-w-48 p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                keywords={option.keywords}
                disabled={option.disabled}
                icon={option.icon}
                onSelect={() => select(option.value)}
              >
                {option.label}
                <CheckIcon
                  className={cn("ml-auto text-brand-text", option.value === value ? "opacity-100" : "opacity-0")}
                />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
