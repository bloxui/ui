import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { toneClasses, type Tone } from "../lib/tone";
import { Spinner } from "./spinner";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap font-medium select-none",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-150",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.15em]",
  ],
  {
    variants: {
      variant: {
        solid: "bg-(--t) text-(color:--t-fg) shadow-xs hover:bg-(--t-hover)",
        soft: "bg-(--t-soft) text-(color:--t-text) hover:bg-[color-mix(in_oklab,var(--t-soft),var(--t)_16%)]",
        outline:
          "border border-border-strong bg-surface text-(color:--t-text) hover:border-(color:--t) hover:bg-(--t-soft)",
        ghost: "text-(color:--t-text) hover:bg-(--t-soft)",
        link: "text-(color:--t-text) underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 gap-1 rounded-md px-2.5 text-xs",
        sm: "h-8 gap-1.5 rounded-md px-3 text-sm",
        md: "h-9 gap-2 rounded-lg px-4 text-sm",
        lg: "h-11 gap-2 rounded-lg px-5 text-base",
      },
      iconOnly: { true: "aspect-square px-0" },
      fullWidth: { true: "w-full" },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0 active:scale-100" }],
    defaultVariants: { variant: "solid", size: "md" },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  /** Colour intent. Works with every variant. */
  tone?: Tone;
  /** Shows a spinner and blocks interaction while keeping the button's width. */
  loading?: boolean;
  /** Icon rendered before the label. Replaced by the spinner while loading. */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  rightIcon?: React.ReactNode;
  /** Render the child element (e.g. a link) with button styles instead of a <button>. */
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  tone = "brand",
  iconOnly,
  fullWidth,
  loading = false,
  leftIcon,
  rightIcon,
  asChild = false,
  disabled,
  type,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const inactive = disabled || loading;

  return (
    <Comp
      data-slot="button"
      // Native buttons default to type="submit", which submits forms by accident.
      type={asChild ? undefined : (type ?? "button")}
      disabled={asChild ? undefined : inactive}
      aria-disabled={asChild && inactive ? true : undefined}
      aria-busy={loading || undefined}
      className={cn(
        toneClasses[tone],
        buttonVariants({ variant, size, iconOnly, fullWidth }),
        className,
      )}
      {...props}
    >
      {loading ? <Spinner label="" /> : leftIcon}
      {/* An icon-only button swaps its icon for the spinner instead of showing both. */}
      {loading && iconOnly && !asChild ? null : <Slottable>{children}</Slottable>}
      {rightIcon}
    </Comp>
  );
}
