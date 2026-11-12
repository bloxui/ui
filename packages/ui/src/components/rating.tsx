"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { useFieldControl } from "../lib/field-context";
import { StarIcon } from "../lib/icons";

const sizes = { sm: "size-4", md: "size-5", lg: "size-7" } as const;

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Number of stars. */
  max?: number;
  /** Show the value without letting the user change it. Fractions such as 3.5 are drawn partly filled. */
  readOnly?: boolean;
  disabled?: boolean;
  /** Clicking the current value again clears it to 0. */
  clearable?: boolean;
  size?: keyof typeof sizes;
  /** Spoken label for each value, e.g. ["Terrible", "Bad", "OK", "Good", "Great"]. */
  labels?: string[];
  /** Submits the value under this name. */
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

function Star({ fill, size }: { fill: number; size: keyof typeof sizes }) {
  return (
    <span className={cn("relative inline-flex", sizes[size])}>
      <StarIcon className="size-full text-border-strong" fill="currentColor" stroke="none" />
      {fill > 0 ? (
        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
          <StarIcon className={cn("text-warning", sizes[size])} fill="currentColor" stroke="none" />
        </span>
      ) : null}
    </span>
  );
}

/**
 * A star rating. Interactive ratings are a radio group: arrow keys change the value,
 * and hovering previews it. Read-only ratings are a single image with a text value.
 */
export function Rating({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  max = 5,
  readOnly = false,
  disabled = false,
  clearable = false,
  size = "md",
  labels,
  name,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: RatingProps) {
  const control = useFieldControl({ id, "aria-describedby": describedBy });
  const [internal, setInternal] = React.useState(defaultValue);
  const [hover, setHover] = React.useState<number | null>(null);
  const value = valueProp ?? internal;
  const shown = hover ?? value;
  const stars = Array.from({ length: max }, (_, index) => index + 1);
  const describe = (n: number) => labels?.[n - 1] ?? `${n} ${n === 1 ? "star" : "stars"}`;

  function change(next: number) {
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
  }

  if (readOnly) {
    return (
      <span
        data-slot="rating"
        role="img"
        id={control.id}
        aria-label={`${ariaLabel ? `${ariaLabel}: ` : ""}${value} out of ${max}`}
        className={cn("inline-flex items-center gap-0.5", className)}
      >
        {stars.map((star) => (
          <Star key={star} fill={Math.min(1, Math.max(0, value - (star - 1)))} size={size} />
        ))}
      </span>
    );
  }

  return (
    <div
      data-slot="rating"
      role="radiogroup"
      id={control.id}
      aria-label={ariaLabel}
      aria-describedby={control["aria-describedby"]}
      aria-disabled={disabled || undefined}
      onMouseLeave={() => setHover(null)}
      className={cn("inline-flex items-center gap-0.5", disabled && "pointer-events-none opacity-50", className)}
    >
      {stars.map((star) => {
        const checked = star === Math.round(value);
        // Only one star is in the tab order: the selected one, or the first.
        const focusable = checked || (value === 0 && star === 1);
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={describe(star)}
            tabIndex={focusable ? 0 : -1}
            disabled={disabled}
            onMouseEnter={() => setHover(star)}
            onFocus={() => setHover(null)}
            onClick={() => change(clearable && star === value ? 0 : star)}
            onKeyDown={(event) => {
              const keys: Record<string, number> = {
                ArrowRight: star + 1,
                ArrowUp: star + 1,
                ArrowLeft: star - 1,
                ArrowDown: star - 1,
                Home: 1,
                End: max,
              };
              const target = keys[event.key];
              if (target === undefined) return;
              event.preventDefault();
              const next = Math.min(max, Math.max(1, target));
              change(next);
              const group = event.currentTarget.parentElement;
              group?.querySelectorAll<HTMLButtonElement>("button")[next - 1]?.focus();
            }}
            className="rounded-sm p-0.5 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Star fill={star <= shown ? 1 : 0} size={size} />
          </button>
        );
      })}
      {name ? <input type="hidden" name={name} value={value} /> : null}
    </div>
  );
}
