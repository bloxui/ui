import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { toneClasses, type Tone } from "../lib/tone";

export const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1.5 rounded-full font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        solid: "bg-(--t) text-(color:--t-fg)",
        soft: "bg-(--t-soft) text-(color:--t-text)",
        outline: "border border-border-strong text-(color:--t-text)",
      },
      size: {
        sm: "h-5 px-2 text-[0.6875rem]",
        md: "h-6 px-2.5 text-xs",
      },
    },
    defaultVariants: { variant: "soft", size: "md" },
  },
);

export interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
  tone?: Tone;
  /** Shows a status dot before the label. */
  dot?: boolean;
}

export function Badge({ className, variant, size, tone = "neutral", dot, children, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(toneClasses[tone], badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot ? <span aria-hidden className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
