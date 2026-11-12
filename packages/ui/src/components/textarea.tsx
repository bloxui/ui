"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { useFieldControl } from "../lib/field-context";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  invalid?: boolean;
  /** Grows with its content instead of scrolling. */
  autoResize?: boolean;
}

export function Textarea({
  className,
  invalid,
  autoResize = false,
  id,
  required,
  onInput,
  ref,
  "aria-describedby": describedBy,
  ...props
}: TextareaProps) {
  const control = useFieldControl({ id, invalid, required, "aria-describedby": describedBy });
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

  const resize = React.useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = "auto";
    // scrollHeight excludes borders, which a border-box height must include.
    el.style.height = `${el.scrollHeight + (el.offsetHeight - el.clientHeight)}px`;
  }, []);

  React.useLayoutEffect(() => {
    if (autoResize) resize();
  }, [autoResize, resize, props.value]);

  const setRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <textarea
      data-slot="textarea"
      ref={setRef}
      id={control.id}
      required={control.required}
      aria-describedby={control["aria-describedby"]}
      aria-invalid={control.invalid || undefined}
      onInput={(event) => {
        onInput?.(event);
        if (autoResize) resize();
      }}
      className={cn(
        "block min-h-20 w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-fg shadow-xs",
        "transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-muted/70",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25",
        "disabled:cursor-not-allowed disabled:bg-sunken disabled:opacity-60",
        "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/25",
        autoResize ? "resize-none overflow-hidden" : "resize-y",
        className,
      )}
      {...props}
    />
  );
}
