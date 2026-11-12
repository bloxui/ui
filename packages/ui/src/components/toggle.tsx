"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive, ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { toneClasses, type Tone } from "../lib/tone";

export const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap text-fg transition-colors outline-none select-none",
    "hover:bg-neutral-soft focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=on]:bg-(--t-soft) data-[state=on]:text-(color:--t-text)",
    "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        ghost: "",
        outline: "border border-border-strong bg-surface shadow-xs data-[state=on]:border-(color:--t)",
      },
      size: {
        sm: "h-8 min-w-8 rounded-md px-2 text-sm",
        md: "h-9 min-w-9 rounded-lg px-2.5 text-sm",
        lg: "h-11 min-w-11 rounded-lg px-3 text-base",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  },
);

type ToggleStyleProps = VariantProps<typeof toggleVariants> & {
  /** Colour used when the toggle is on. */
  tone?: Tone;
};

/** A two-state button (e.g. Bold). Give icon-only toggles an aria-label. */
export function Toggle({
  className,
  variant,
  size,
  tone = "brand",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & ToggleStyleProps) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toneClasses[tone], toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}

const ToggleGroupContext = React.createContext<ToggleStyleProps>({});

/** A set of toggles: type="single" behaves like radio buttons, type="multiple" like checkboxes. */
export function ToggleGroup({
  className,
  variant,
  size,
  tone,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & ToggleStyleProps) {
  const context = React.useMemo(() => ({ variant, size, tone }), [variant, size, tone]);
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn(
        "inline-flex w-fit items-center",
        variant === "outline"
          ? // Joined segments: the two-class selectors outrank each item's own radius.
            "[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>[data-state=on]]:z-[1]"
          : "gap-1",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={context}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

export function ToggleGroupItem({
  className,
  variant,
  size,
  tone,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & ToggleStyleProps) {
  const group = React.useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toneClasses[tone ?? group.tone ?? "brand"],
        toggleVariants({ variant: variant ?? group.variant, size: size ?? group.size }),
        "relative",
        className,
      )}
      {...props}
    />
  );
}
