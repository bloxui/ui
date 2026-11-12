"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { useFieldControl } from "../lib/field-context";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "../lib/icons";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** Extra words the search should match. */
  keywords?: string[];
}

const sizes = {
  sm: "min-h-8 rounded-md px-1.5 text-sm",
  md: "min-h-9 rounded-lg px-1.5 text-sm",
  lg: "min-h-11 rounded-lg px-2 text-base",
} as const;

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: React.ReactNode;
  /** Show at most this many chips, then "+N more". */
  maxVisible?: number;
  /** Stop adding once this many are selected. */
  maxSelected?: number;
  size?: keyof typeof sizes;
  invalid?: boolean;
  disabled?: boolean;
  /** Submits each selected value under this name. */
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/** Pick several options from a searchable list. Selected options show as chips you can remove. */
export function MultiSelect({
  options,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  placeholder = "Select options",
  searchPlaceholder = "Search",
  emptyText = "No results found.",
  maxVisible = 3,
  maxSelected,
  size = "md",
  invalid,
  disabled,
  name,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: MultiSelectProps) {
  const control = useFieldControl({ id, invalid, "aria-describedby": describedBy });
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue);
  const value = valueProp ?? internal;
  const selected = value
    .map((item) => options.find((option) => option.value === item))
    .filter((option): option is MultiSelectOption => option !== undefined);
  const full = maxSelected !== undefined && value.length >= maxSelected;
  const visible = selected.slice(0, maxVisible);
  const hidden = selected.length - visible.length;

  function change(next: string[]) {
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
  }

  function toggle(item: string) {
    if (value.includes(item)) change(value.filter((entry) => entry !== item));
    else if (!full) change([...value, item]);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          data-slot="multi-select"
          data-invalid={control.invalid ? "" : undefined}
          data-disabled={disabled ? "" : undefined}
          className={cn(
            "flex w-full flex-wrap items-center gap-1 border border-border-strong bg-surface py-1 text-fg shadow-xs",
            "transition-[border-color,box-shadow] duration-150",
            "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25",
            "data-[invalid]:border-danger data-[disabled]:cursor-not-allowed data-[disabled]:bg-sunken data-[disabled]:opacity-60",
            sizes[size],
            className,
          )}
        >
          {visible.map((option) => (
            <span
              key={option.value}
              className="inline-flex h-6 items-center gap-0.5 rounded-md bg-neutral-soft pr-0.5 pl-2 text-xs font-medium"
            >
              {option.label}
              <button
                type="button"
                aria-label={`Remove ${option.label}`}
                disabled={disabled}
                onClick={() => change(value.filter((entry) => entry !== option.value))}
                className="flex size-5 items-center justify-center rounded text-muted outline-none hover:bg-fg/10 hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
              >
                <XIcon className="size-3" />
              </button>
            </span>
          ))}
          {hidden > 0 ? <span className="px-1 text-xs text-muted">+{hidden} more</span> : null}
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-label={ariaLabel}
              id={control.id}
              aria-describedby={control["aria-describedby"]}
              aria-invalid={control.invalid || undefined}
              disabled={disabled}
              className="flex h-6 min-w-16 flex-1 items-center justify-between gap-2 rounded-md px-1.5 text-left outline-none disabled:cursor-not-allowed"
            >
              <span className={cn("truncate", selected.length > 0 ? "text-muted" : "text-muted/70")}>
                {selected.length > 0 ? `${selected.length} selected` : placeholder}
              </span>
              <ChevronsUpDownIcon className="size-4 shrink-0 text-muted" />
            </button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      {name ? value.map((item) => <input key={item} type="hidden" name={name} value={item} />) : null}
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) min-w-56 p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList aria-multiselectable="true">
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    keywords={option.keywords}
                    disabled={option.disabled || (full && !isSelected)}
                    data-checked={isSelected ? "" : undefined}
                    onSelect={() => toggle(option.value)}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-[4px] border",
                        isSelected ? "border-brand bg-brand text-brand-fg" : "border-border-strong",
                      )}
                    >
                      {isSelected ? <CheckIcon strokeWidth={3} className="size-3" /> : null}
                    </span>
                    {option.label}
                    {isSelected ? <span className="sr-only">, selected</span> : null}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          {value.length > 0 ? (
            <div className="border-t border-border p-1">
              <button
                type="button"
                onClick={() => change([])}
                className="w-full rounded-md px-2.5 py-1.5 text-left text-sm text-muted outline-none hover:bg-neutral-soft hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
              >
                Clear selection ({value.length})
              </button>
            </div>
          ) : null}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
