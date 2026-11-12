"use client";

import * as React from "react";
import { Toaster as Sonner, toast } from "sonner";

/**
 * Call `toast("Saved")`, `toast.success(...)`, `toast.error(...)` or `toast.promise(...)`
 * from anywhere. Render <Toaster /> once, near the root of your app.
 */
export { toast };

// Sonner reads these variables; pointing them at Blox tokens makes toasts follow the theme.
const themeVariables = {
  "--normal-bg": "var(--bx-surface)",
  "--normal-text": "var(--bx-fg)",
  "--normal-border": "var(--bx-border)",
  "--success-bg": "var(--bx-success-soft)",
  "--success-text": "var(--bx-success-text)",
  "--success-border": "transparent",
  "--error-bg": "var(--bx-danger-soft)",
  "--error-text": "var(--bx-danger-text)",
  "--error-border": "transparent",
  "--warning-bg": "var(--bx-warning-soft)",
  "--warning-text": "var(--bx-warning-text)",
  "--warning-border": "transparent",
  "--info-bg": "var(--bx-brand-soft)",
  "--info-text": "var(--bx-brand-text)",
  "--info-border": "transparent",
  "--border-radius": "var(--bx-radius)",
  fontFamily: "inherit",
} as React.CSSProperties;

export type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ position = "bottom-right", richColors = true, style, ...props }: ToasterProps) {
  return (
    <Sonner
      data-slot="toaster"
      position={position}
      richColors={richColors}
      style={{ ...themeVariables, ...style }}
      {...props}
    />
  );
}
