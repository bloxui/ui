import * as React from "react";
import { cn } from "../lib/cn";

export interface SpinnerProps extends React.ComponentProps<"svg"> {
  /** Accessible label. Pass an empty string when the spinner is decorative. */
  label?: string;
}

export function Spinner({ className, label = "Loading", ...props }: SpinnerProps) {
  const decorative = label === "";
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      role={decorative ? undefined : "status"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      className={cn("size-[1.1em] shrink-0 animate-spin", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
