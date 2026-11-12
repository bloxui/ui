"use client";

import * as React from "react";
import type { DateRange, Matcher } from "react-day-picker";
import { cn } from "../lib/cn";
import { fieldTriggerClass, fieldTriggerSizes, type FieldTriggerSize } from "../lib/control";
import { useFieldControl } from "../lib/field-context";
import { CalendarIcon, XIcon } from "../lib/icons";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type { DateRange };

interface SharedProps {
  placeholder?: string;
  /** BCP 47 locale for the displayed date. Fixed by default so server and client render the same text. */
  locale?: string;
  /** Custom display format; overrides `locale`. */
  formatDate?: (date: Date) => string;
  /** Earliest and latest selectable days. */
  min?: Date;
  max?: Date;
  /** Extra days to disable, in react-day-picker matcher form. */
  disabledDates?: Matcher | Matcher[];
  /** Show a button that clears the value. */
  clearable?: boolean;
  size?: FieldTriggerSize;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

function useFormatter(locale: string, formatDate?: (date: Date) => string) {
  return React.useMemo(() => {
    if (formatDate) return formatDate;
    const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
    return (date: Date) => formatter.format(date);
  }, [locale, formatDate]);
}

function disabledMatchers({ min, max, disabledDates }: Pick<SharedProps, "min" | "max" | "disabledDates">) {
  const matchers: Matcher[] = [];
  if (min) matchers.push({ before: min });
  if (max) matchers.push({ after: max });
  if (disabledDates) matchers.push(...(Array.isArray(disabledDates) ? disabledDates : [disabledDates]));
  return matchers;
}

/** Local calendar day as YYYY-MM-DD (not UTC, so the day never shifts). */
function toISODate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

interface ShellProps extends SharedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  text: string | undefined;
  onClear: () => void;
  children: React.ReactNode;
}

function PickerShell({
  open,
  onOpenChange,
  text,
  onClear,
  children,
  placeholder,
  clearable,
  size = "md",
  invalid,
  disabled,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: ShellProps) {
  const control = useFieldControl({ id, invalid, "aria-describedby": describedBy });
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <div data-slot="date-picker" className={cn("relative w-full", className)}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={control.id}
            aria-label={ariaLabel}
            aria-describedby={control["aria-describedby"]}
            aria-invalid={control.invalid || undefined}
            disabled={disabled}
            className={cn(fieldTriggerClass, fieldTriggerSizes[size], clearable && text && "pr-9")}
          >
            <CalendarIcon className="size-4 shrink-0 text-muted" />
            <span className={cn("truncate", !text && "text-muted/70")}>{text ?? placeholder}</span>
          </button>
        </PopoverTrigger>
        {clearable && text && !disabled ? (
          <button
            type="button"
            aria-label="Clear date"
            onClick={onClear}
            className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors outline-none hover:bg-neutral-soft hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            <XIcon className="size-3.5" />
          </button>
        ) : null}
      </div>
      <PopoverContent align="start" className="w-auto p-0">
        {children}
      </PopoverContent>
    </Popover>
  );
}

export interface DatePickerProps extends SharedProps {
  /** Pass `value` (with `onChange`) to control it, or `defaultValue` to let it manage itself. */
  value?: Date | null;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  /** Submits the date as YYYY-MM-DD under this name. */
  name?: string;
}

/** A date field: a button that opens a calendar. Works inside <Field>. */
export function DatePicker({
  value: valueProp,
  defaultValue,
  onChange,
  name,
  placeholder = "Pick a date",
  locale = "en-US",
  formatDate,
  ...shared
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue);
  // `null` means "controlled and empty"; `undefined` means uncontrolled.
  const controlled = valueProp !== undefined;
  const value = controlled ? (valueProp ?? undefined) : internal;
  const format = useFormatter(locale, formatDate);

  function change(next: Date | undefined) {
    if (!controlled) setInternal(next);
    onChange?.(next);
  }

  return (
    <>
      <PickerShell
        {...shared}
        open={open}
        onOpenChange={setOpen}
        placeholder={placeholder}
        text={value ? format(value) : undefined}
        onClear={() => change(undefined)}
      >
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          disabled={disabledMatchers(shared)}
          onSelect={(date) => {
            change(date);
            if (date) setOpen(false);
          }}
        />
      </PickerShell>
      {name ? <input type="hidden" name={name} value={value ? toISODate(value) : ""} /> : null}
    </>
  );
}

export interface DateRangePickerProps extends SharedProps {
  /** Pass `value` (with `onChange`) to control it, or `defaultValue` to let it manage itself. */
  value?: DateRange | null;
  defaultValue?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  /** Months shown side by side. */
  numberOfMonths?: number;
}

/** Picks a start and end date. Stays open until the user closes it, so the range can be adjusted. */
export function DateRangePicker({
  value: valueProp,
  defaultValue,
  onChange,
  numberOfMonths = 2,
  placeholder = "Pick a date range",
  locale = "en-US",
  formatDate,
  ...shared
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? (valueProp ?? undefined) : internal;
  const format = useFormatter(locale, formatDate);

  function change(next: DateRange | undefined) {
    if (!controlled) setInternal(next);
    onChange?.(next);
  }

  const text = value?.from
    ? value.to
      ? `${format(value.from)} – ${format(value.to)}`
      : format(value.from)
    : undefined;

  return (
    <PickerShell
      {...shared}
      open={open}
      onOpenChange={setOpen}
      placeholder={placeholder}
      text={text}
      onClear={() => change(undefined)}
    >
      <Calendar
        mode="range"
        selected={value}
        defaultMonth={value?.from}
        numberOfMonths={numberOfMonths}
        disabled={disabledMatchers(shared)}
        onSelect={change}
      />
    </PickerShell>
  );
}
