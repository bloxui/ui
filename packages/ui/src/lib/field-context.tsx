"use client";

import * as React from "react";

export interface FieldContextValue {
  /** Id the control should use so the label points at it. */
  id: string;
  /** Id of the hint / error text describing the control. */
  describedBy?: string;
  invalid: boolean;
  required?: boolean;
}

export const FieldContext = React.createContext<FieldContextValue | null>(null);

interface ControlProps {
  id?: string;
  invalid?: boolean;
  required?: boolean;
  "aria-describedby"?: string;
}

/**
 * Resolves a control's accessibility wiring. Props set directly on the
 * control win; anything missing is filled in from the surrounding <Field>.
 * Use it to make your own controls Field-aware.
 */
export function useFieldControl(props: ControlProps) {
  const field = React.useContext(FieldContext);
  const describedBy = [props["aria-describedby"], field?.describedBy].filter(Boolean).join(" ");
  return {
    id: props.id ?? field?.id,
    "aria-describedby": describedBy || undefined,
    invalid: props.invalid ?? field?.invalid ?? false,
    required: props.required ?? field?.required,
  };
}
