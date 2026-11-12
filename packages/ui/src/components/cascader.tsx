"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { fieldTriggerClass, fieldTriggerSizes, type FieldTriggerSize } from "../lib/control";
import { useFieldControl } from "../lib/field-context";
import { CheckIcon, ChevronRightIcon, ChevronsUpDownIcon } from "../lib/icons";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface CascaderOption {
  value: string;
  label: string;
  disabled?: boolean;
  children?: CascaderOption[];
}

export interface CascaderProps {
  options: CascaderOption[];
  /** The chosen path, e.g. ["india", "gujarat", "surat"]. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], options: CascaderOption[]) => void;
  /** Allow choosing an option that still has children. */
  changeOnSelect?: boolean;
  /** Joins labels in the trigger. */
  separator?: string;
  placeholder?: string;
  size?: FieldTriggerSize;
  invalid?: boolean;
  disabled?: boolean;
  /** Submits the path joined with "/" under this name. */
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/** The options along a path of values, stopping at the first unknown value. */
export function optionsForPath(options: CascaderOption[], path: string[]) {
  const result: CascaderOption[] = [];
  let level: CascaderOption[] | undefined = options;
  for (const value of path) {
    const match: CascaderOption | undefined = level?.find((option) => option.value === value);
    if (!match) break;
    result.push(match);
    level = match.children;
  }
  return result;
}

/** Picks one option from nested levels (country → state → city), one column per level. */
export function Cascader({
  options,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  changeOnSelect = false,
  separator = " / ",
  placeholder = "Select",
  size = "md",
  invalid,
  disabled,
  name,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: CascaderProps) {
  const control = useFieldControl({ id, invalid, "aria-describedby": describedBy });
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue);
  const value = valueProp ?? internal;
  const [activePath, setActivePath] = React.useState<string[]>(value);
  const selected = optionsForPath(options, value);

  React.useEffect(() => {
    if (open) setActivePath(value);
    // Reset the browsing path each time the menu opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const columns: CascaderOption[][] = [options];
  for (const option of optionsForPath(options, activePath)) {
    if (option.children?.length) columns.push(option.children);
  }

  function choose(level: number, option: CascaderOption) {
    const path = [...activePath.slice(0, level), option.value];
    setActivePath(path);
    const isLeaf = !option.children?.length;
    if (isLeaf || changeOnSelect) {
      if (valueProp === undefined) setInternal(path);
      onValueChange?.(path, optionsForPath(options, path));
    }
    if (isLeaf) setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-haspopup="tree"
          aria-expanded={open}
          id={control.id}
          aria-label={ariaLabel}
          aria-describedby={control["aria-describedby"]}
          aria-invalid={control.invalid || undefined}
          disabled={disabled}
          className={cn(fieldTriggerClass, fieldTriggerSizes[size], "justify-between", className)}
        >
          <span className={cn("truncate", selected.length === 0 && "text-muted/70")}>
            {selected.length ? selected.map((option) => option.label).join(separator) : placeholder}
          </span>
          <ChevronsUpDownIcon className="size-4 shrink-0 text-muted" />
        </button>
      </PopoverTrigger>
      {name ? <input type="hidden" name={name} value={value.join("/")} /> : null}
      <PopoverContent align="start" className="flex w-auto max-w-[calc(100vw-1rem)] divide-x divide-border overflow-x-auto p-0">
        {columns.map((column, level) => (
          <div
            key={level}
            role="listbox"
            aria-label={level === 0 ? "Options" : `Level ${level + 1}`}
            className="flex max-h-64 w-44 shrink-0 flex-col gap-0.5 overflow-y-auto p-1"
            onKeyDown={(event) => {
              const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=option]:not(:disabled)")];
              const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                buttons[Math.min(buttons.length - 1, Math.max(0, index + (event.key === "ArrowDown" ? 1 : -1)))]?.focus();
              } else if (event.key === "ArrowLeft" && level > 0) {
                event.preventDefault();
                event.currentTarget.previousElementSibling?.querySelector<HTMLButtonElement>("[aria-selected=true]")?.focus();
              }
            }}
          >
            {column.map((option) => {
              const isActive = activePath[level] === option.value;
              const isChosen = value[level] === option.value && value.length === level + 1;
              const hasChildren = Boolean(option.children?.length);
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  aria-haspopup={hasChildren ? "listbox" : undefined}
                  disabled={option.disabled}
                  onClick={() => choose(level, option)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight" && hasChildren) {
                      event.preventDefault();
                      choose(level, option);
                      requestAnimationFrame(() =>
                        event.currentTarget.parentElement?.nextElementSibling?.querySelector<HTMLButtonElement>("[role=option]")?.focus(),
                      );
                    }
                  }}
                  className={cn(
                    "flex h-8 shrink-0 items-center gap-2 rounded-md px-2.5 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    isActive ? "bg-neutral-soft font-medium" : "hover:bg-neutral-soft",
                  )}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  {hasChildren ? <ChevronRightIcon className="size-3.5 text-muted" /> : null}
                  {isChosen && !hasChildren ? <CheckIcon className="size-4 text-brand-text" /> : null}
                </button>
              );
            })}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
