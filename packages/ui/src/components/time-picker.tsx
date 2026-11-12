"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { fieldTriggerClass, fieldTriggerSizes, type FieldTriggerSize } from "../lib/control";
import { useFieldControl } from "../lib/field-context";
import { ClockIcon } from "../lib/icons";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface TimePickerProps {
  /** "HH:mm" in 24-hour time, e.g. "09:30", or "" when empty. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Show a 12-hour clock with AM/PM. The value stays 24-hour. */
  hour12?: boolean;
  /** Minutes between options. */
  minuteStep?: number;
  placeholder?: string;
  size?: FieldTriggerSize;
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

const pad = (value: number) => String(value).padStart(2, "0");

/** "14:05" → { hour: 14, minute: 5 }, or null. */
export function parseTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return hour < 24 && minute < 60 ? { hour, minute } : null;
}

/** "14:05" → "2:05 PM" with hour12, else "14:05". */
export function formatTime(value: string, hour12: boolean) {
  const time = parseTime(value);
  if (!time) return "";
  if (!hour12) return `${pad(time.hour)}:${pad(time.minute)}`;
  const period = time.hour < 12 ? "AM" : "PM";
  return `${time.hour % 12 || 12}:${pad(time.minute)} ${period}`;
}

function Column({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { value: number | string; text: string }[];
  selected: number | string | undefined;
  onSelect: (value: number | string) => void;
}) {
  const listRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    listRef.current?.querySelector<HTMLElement>("[aria-selected=true]")?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label={label}
      className="flex max-h-56 w-14 flex-col gap-0.5 overflow-y-auto p-1 [scrollbar-width:thin]"
      onKeyDown={(event) => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=option]")];
        const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
        buttons[Math.min(buttons.length - 1, Math.max(0, index + (event.key === "ArrowDown" ? 1 : -1)))]?.focus();
      }}
    >
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={isSelected}
            tabIndex={isSelected || (selected === undefined && option === options[0]) ? 0 : -1}
            onClick={() => onSelect(option.value)}
            className={cn(
              "h-8 shrink-0 rounded-md text-sm tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected ? "bg-brand font-medium text-brand-fg" : "hover:bg-neutral-soft",
            )}
          >
            {option.text}
          </button>
        );
      })}
    </div>
  );
}

/** A time field that opens columns of hours and minutes (and AM/PM). */
export function TimePicker({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  hour12 = false,
  minuteStep = 5,
  placeholder = "Pick a time",
  size = "md",
  invalid,
  disabled,
  name,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: TimePickerProps) {
  const control = useFieldControl({ id, invalid, "aria-describedby": describedBy });
  const [internal, setInternal] = React.useState(defaultValue);
  const value = valueProp ?? internal;
  const time = parseTime(value);

  function change(hour: number, minute: number) {
    const next = `${pad(hour)}:${pad(minute)}`;
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
  }

  const hour = time?.hour;
  const minute = time?.minute ?? 0;
  const period = hour === undefined ? undefined : hour < 12 ? "AM" : "PM";

  const hours = hour12
    ? Array.from({ length: 12 }, (_, index) => ({ value: index === 0 ? 12 : index, text: String(index === 0 ? 12 : index) }))
    : Array.from({ length: 24 }, (_, index) => ({ value: index, text: pad(index) }));
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, index) => ({
    value: index * minuteStep,
    text: pad(index * minuteStep),
  }));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={control.id}
          aria-label={ariaLabel}
          aria-describedby={control["aria-describedby"]}
          aria-invalid={control.invalid || undefined}
          disabled={disabled}
          className={cn(fieldTriggerClass, fieldTriggerSizes[size], className)}
        >
          <ClockIcon className="size-4 shrink-0 text-muted" />
          <span className={cn("truncate tabular-nums", !time && "text-muted/70")}>
            {time ? formatTime(value, hour12) : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <PopoverContent align="start" className="flex w-auto divide-x divide-border p-0">
        <Column
          label="Hour"
          options={hours}
          selected={hour === undefined ? undefined : hour12 ? hour % 12 || 12 : hour}
          onSelect={(picked) => {
            const h = Number(picked);
            change(hour12 ? (h % 12) + (period === "PM" ? 12 : 0) : h, minute);
          }}
        />
        <Column
          label="Minute"
          options={minutes}
          selected={time ? minute : undefined}
          onSelect={(picked) => change(hour ?? 9, Number(picked))}
        />
        {hour12 ? (
          <Column
            label="AM or PM"
            options={[
              { value: "AM", text: "AM" },
              { value: "PM", text: "PM" },
            ]}
            selected={period}
            onSelect={(picked) => {
              const base = (hour ?? 9) % 12;
              change(picked === "PM" ? base + 12 : base, minute);
            }}
          />
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
