"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { FieldContext } from "../lib/field-context";
import { Label } from "./label";

export interface FieldProps extends Omit<React.ComponentProps<"div">, "id"> {
  label?: React.ReactNode;
  /** Helper text shown under the control. */
  hint?: React.ReactNode;
  /** Error message. When set, the control is marked invalid and the hint is replaced. */
  error?: React.ReactNode;
  required?: boolean;
  /** `horizontal` puts the control beside its label — use it for Checkbox, Radio and Switch. */
  orientation?: "vertical" | "horizontal";
  /** Id for the control. Generated when omitted. */
  id?: string;
}

/**
 * Wires a label, hint and error to the control inside it: ids, aria-describedby,
 * aria-invalid and required are all handled, so you only write the control.
 */
export function Field({
  className,
  label,
  hint,
  error,
  required,
  orientation = "vertical",
  id: idProp,
  children,
  ...props
}: FieldProps) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const hasError = Boolean(error);
  const messageId = hasError ? `${id}-error` : hint ? `${id}-hint` : undefined;

  const context = React.useMemo(
    () => ({ id, describedBy: messageId, invalid: hasError, required }),
    [id, messageId, hasError, required],
  );

  const labelNode = label ? (
    <Label htmlFor={id} required={required}>
      {label}
    </Label>
  ) : null;

  const messageNode = hasError ? (
    <p id={messageId} data-slot="field-error" className="text-sm text-danger-text">
      {error}
    </p>
  ) : hint ? (
    <p id={messageId} data-slot="field-hint" className="text-sm text-muted">
      {hint}
    </p>
  ) : null;

  return (
    <FieldContext.Provider value={context}>
      {orientation === "horizontal" ? (
        <div data-slot="field" className={cn("flex items-start gap-3", className)} {...props}>
          {/* Fixed height matches the label's line so the control aligns with its first line. */}
          <span className="flex h-5 shrink-0 items-center">{children}</span>
          <div className="flex min-w-0 flex-col gap-0.5">
            {labelNode}
            {messageNode}
          </div>
        </div>
      ) : (
        <div data-slot="field" className={cn("flex flex-col gap-1.5", className)} {...props}>
          {labelNode}
          {children}
          {messageNode}
        </div>
      )}
    </FieldContext.Provider>
  );
}
