"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  /** Appends a required marker (hidden from screen readers; set `required` on the control too). */
  required?: boolean;
}

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("inline-flex items-center gap-1 text-sm leading-5 font-medium text-fg select-none", className)}
      {...props}
    >
      {children}
      {required ? (
        <span aria-hidden className="text-danger-text">
          *
        </span>
      ) : null}
    </LabelPrimitive.Root>
  );
}
