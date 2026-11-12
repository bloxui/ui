"use client";

import * as React from "react";
import { OTPInput, REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { cn } from "../lib/cn";
import { useFieldControl } from "../lib/field-context";

export { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS };

export interface InputOTPProps {
  /** Number of characters in the code. */
  length?: number;
  /** Split the boxes into groups of this size, e.g. 3 for "123 – 456". */
  groupSize?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called once every box is filled. */
  onComplete?: (value: string) => void;
  /** Allowed characters as a regex source. Digits only by default. */
  pattern?: string;
  invalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/** A one-time-code field. It is a single real input, so paste and SMS autofill work. */
export function InputOTP({
  length = 6,
  groupSize,
  pattern = REGEXP_ONLY_DIGITS,
  invalid,
  id,
  className,
  "aria-describedby": describedBy,
  ...props
}: InputOTPProps) {
  const control = useFieldControl({ id, invalid, "aria-describedby": describedBy });
  const perGroup = groupSize && groupSize > 0 ? groupSize : length;

  return (
    <OTPInput
      data-slot="input-otp"
      maxLength={length}
      pattern={pattern}
      inputMode={pattern === REGEXP_ONLY_DIGITS ? "numeric" : "text"}
      autoComplete="one-time-code"
      id={control.id}
      aria-describedby={control["aria-describedby"]}
      aria-invalid={control.invalid || undefined}
      containerClassName={cn("flex w-fit items-center gap-2 has-[:disabled]:opacity-50", className)}
      className="disabled:cursor-not-allowed"
      {...props}
      render={({ slots }) => {
        const groups: (typeof slots)[] = [];
        for (let start = 0; start < slots.length; start += perGroup) {
          groups.push(slots.slice(start, start + perGroup));
        }
        return groups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 ? (
              <span aria-hidden className="text-muted">
                –
              </span>
            ) : null}
            <div className="flex">
              {group.map((slot, index) => (
                <div
                  key={index}
                  data-slot="input-otp-slot"
                  data-active={slot.isActive ? "" : undefined}
                  className={cn(
                    "relative -ml-px flex size-10 items-center justify-center border bg-surface text-base font-medium tabular-nums shadow-xs",
                    "transition-[border-color,box-shadow] duration-150 first:ml-0 first:rounded-l-lg last:rounded-r-lg",
                    "data-[active]:z-[1] data-[active]:border-ring data-[active]:ring-3 data-[active]:ring-ring/25",
                    control.invalid ? "border-danger" : "border-border-strong",
                  )}
                >
                  {slot.char}
                  {slot.hasFakeCaret ? (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="h-5 w-px animate-pulse bg-fg" />
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </React.Fragment>
        ));
      }}
    />
  );
}
