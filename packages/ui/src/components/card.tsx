import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

export const cardVariants = cva("flex flex-col rounded-xl text-fg", {
  variants: {
    variant: {
      outline: "border border-border bg-surface",
      raised: "border border-border/60 bg-surface shadow-raised",
      sunken: "bg-sunken",
    },
    /** Controls inner spacing for every Card part at once. */
    padding: {
      sm: "[--card-pad:--spacing(4)]",
      md: "[--card-pad:--spacing(6)]",
      lg: "[--card-pad:--spacing(8)]",
    },
    /** Adds hover and focus affordances for clickable cards. */
    interactive: {
      true: [
        "cursor-pointer transition-[border-color,box-shadow,transform] duration-200",
        "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-raised",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
      ],
    },
  },
  defaultVariants: { variant: "outline", padding: "md" },
});

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, padding, interactive, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, padding, interactive }), className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-(--card-pad)", className)}
      {...props}
    />
  );
}

export interface CardTitleProps extends React.ComponentProps<"h3"> {
  /** Heading level to render, so the card fits the page outline. */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function CardTitle({ className, as: Comp = "h3", ...props }: CardTitleProps) {
  return (
    <Comp
      data-slot="card-title"
      className={cn("text-base leading-snug font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p data-slot="card-description" className={cn("text-sm text-muted", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      // Sits flush under a header instead of doubling the gap.
      className={cn("p-(--card-pad) [[data-slot=card-header]+&]:pt-0", className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2 p-(--card-pad) pt-0", className)}
      {...props}
    />
  );
}
