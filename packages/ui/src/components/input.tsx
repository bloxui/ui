"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { useFieldControl } from "../lib/field-context";

const inputWrapperVariants = cva(
  [
    "flex w-full items-center border border-border-strong bg-surface text-fg shadow-xs",
    "transition-[border-color,box-shadow] duration-150",
    "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25",
    "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-sunken has-[input:disabled]:opacity-60",
    "has-[input[aria-invalid=true]]:border-danger has-[input[aria-invalid=true]]:focus-within:ring-danger/25",
    "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.15em]",
  ],
  {
    variants: {
      size: {
        sm: "h-8 gap-1.5 rounded-md px-2.5 text-sm",
        md: "h-9 gap-2 rounded-lg px-3 text-sm",
        lg: "h-11 gap-2.5 rounded-lg px-3.5 text-base",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputWrapperVariants> {
  /** Marks the field as invalid (sets aria-invalid and the danger styling). */
  invalid?: boolean;
  /** Content before the text, e.g. an icon or a "https://" prefix. */
  leading?: React.ReactNode;
  /** Content after the text, e.g. a unit, a shortcut hint or a button. */
  trailing?: React.ReactNode;
  /** Class for the outer wrapper; `className` targets the <input> itself. */
  wrapperClassName?: string;
}

export function Input({
  className,
  wrapperClassName,
  size,
  invalid,
  leading,
  trailing,
  type = "text",
  id,
  required,
  "aria-describedby": describedBy,
  ...props
}: InputProps) {
  const control = useFieldControl({ id, invalid, required, "aria-describedby": describedBy });
  return (
    <div data-slot="input-wrapper" className={cn(inputWrapperVariants({ size }), wrapperClassName)}>
      {leading ? (
        <span data-slot="input-leading" className="flex shrink-0 items-center text-muted">
          {leading}
        </span>
      ) : null}
      <input
        data-slot="input"
        type={type}
        id={control.id}
        required={control.required}
        aria-describedby={control["aria-describedby"]}
        aria-invalid={control.invalid || undefined}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted/70",
          "disabled:cursor-not-allowed",
          "file:mr-2 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-fg",
          className,
        )}
        {...props}
      />
      {trailing ? (
        <span data-slot="input-trailing" className="flex shrink-0 items-center text-muted">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}
