"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { useFieldControl } from "../lib/field-context";
import { MinusIcon, PlusIcon } from "../lib/icons";

export interface InputNumberProps {
  /** null when the field is empty. */
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Decimal places to keep; derived from `step` when omitted. */
  precision?: number;
  /** Display format, e.g. { style: "currency", currency: "INR" }. Typing uses plain digits. */
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
  /** Hide the − and + buttons. */
  hideStepper?: boolean;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

const sizes = { sm: "h-8 text-sm", md: "h-9 text-sm", lg: "h-11 text-base" } as const;

function decimalsOf(step: number) {
  const text = String(step);
  return text.includes(".") ? text.split(".")[1]!.length : 0;
}

/** Keeps a number inside [min, max] and rounds it to `precision` places. */
export function clampNumber(value: number, min = -Infinity, max = Infinity, precision = 0) {
  const factor = 10 ** precision;
  return Math.min(max, Math.max(min, Math.round(value * factor) / factor));
}

/** "1,234.5", "₹ 1,234.50", " 12 " → numbers; anything without digits → null. */
export function parseNumber(text: string) {
  const cleaned = text.replace(/[^\d.-]/g, "");
  if (!/\d/.test(cleaned)) return null;
  const value = Number.parseFloat(cleaned);
  return Number.isNaN(value) ? null : value;
}

/**
 * A number field with − and + buttons. Arrow keys step, Page Up/Down step by ten,
 * Home/End jump to min/max, and the value is clamped and formatted when focus leaves.
 */
export function InputNumber({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 1,
  precision,
  formatOptions,
  locale = "en-US",
  hideStepper = false,
  size = "md",
  invalid,
  disabled,
  readOnly,
  placeholder,
  name,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: InputNumberProps) {
  const control = useFieldControl({ id, invalid, "aria-describedby": describedBy });
  const places = precision ?? decimalsOf(step);
  const [internal, setInternal] = React.useState(defaultValue);
  const value = valueProp === undefined ? internal : valueProp;
  const [draft, setDraft] = React.useState<string | null>(null);

  const formatter = React.useMemo(
    () => new Intl.NumberFormat(locale, { minimumFractionDigits: places, maximumFractionDigits: places, ...formatOptions }),
    [locale, places, formatOptions],
  );

  function commit(next: number | null) {
    const clamped = next === null ? null : clampNumber(next, min, max, places);
    if (valueProp === undefined) setInternal(clamped);
    if (clamped !== value) onValueChange?.(clamped);
    return clamped;
  }

  /** Steps the value. While typing (focused), the field keeps showing the raw number. */
  function stepBy(times: number, editing = false) {
    const base = value ?? (min !== undefined && min > 0 ? min - step * Math.sign(times) : 0);
    const next = commit(base + step * times);
    setDraft(editing && next !== null ? String(next) : null);
  }

  const atMin = value !== null && min !== undefined && value <= min;
  const atMax = value !== null && max !== undefined && value >= max;
  const stepButton =
    "flex w-8 shrink-0 items-center justify-center text-muted transition-colors outline-none hover:bg-neutral-soft hover:text-fg focus-visible:bg-neutral-soft disabled:pointer-events-none disabled:opacity-40";

  return (
    <div
      data-slot="input-number"
      data-invalid={control.invalid ? "" : undefined}
      className={cn(
        "flex w-full items-stretch overflow-hidden rounded-lg border border-border-strong bg-surface text-fg shadow-xs",
        "transition-[border-color,box-shadow] duration-150 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25",
        "data-[invalid]:border-danger has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-sunken has-[input:disabled]:opacity-60",
        sizes[size],
        className,
      )}
    >
      {!hideStepper ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Decrease"
          disabled={disabled || readOnly || atMin}
          onClick={() => stepBy(-1)}
          className={cn(stepButton, "border-r border-border")}
        >
          <MinusIcon className="size-3.5" />
        </button>
      ) : null}
      <input
        type="text"
        inputMode={places > 0 ? "decimal" : "numeric"}
        role="spinbutton"
        id={control.id}
        name={name}
        aria-label={ariaLabel}
        aria-describedby={control["aria-describedby"]}
        aria-invalid={control.invalid || undefined}
        aria-valuenow={value ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={value === null ? undefined : formatter.format(value)}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        autoComplete="off"
        value={draft ?? (value === null ? "" : formatter.format(value))}
        onFocus={() => setDraft(value === null ? "" : String(value))}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          if (draft !== null) commit(parseNumber(draft));
          setDraft(null);
        }}
        onKeyDown={(event) => {
          if (readOnly) return;
          const jump = (target: number | undefined) => {
            if (target === undefined) return;
            const next = commit(target);
            setDraft(next === null ? "" : String(next));
          };
          const keys: Record<string, () => void> = {
            ArrowUp: () => stepBy(1, true),
            ArrowDown: () => stepBy(-1, true),
            PageUp: () => stepBy(10, true),
            PageDown: () => stepBy(-10, true),
            Home: () => jump(min),
            End: () => jump(max),
            Enter: () => {
              const next = commit(draft === null ? value : parseNumber(draft));
              setDraft(next === null ? "" : String(next));
            },
          };
          const action = keys[event.key];
          if (!action) return;
          event.preventDefault();
          action();
        }}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-center tabular-nums outline-none placeholder:text-muted/70 disabled:cursor-not-allowed"
      />
      {!hideStepper ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Increase"
          disabled={disabled || readOnly || atMax}
          onClick={() => stepBy(1)}
          className={cn(stepButton, "border-l border-border")}
        >
          <PlusIcon className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
