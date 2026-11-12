"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { ArrowUpToLineIcon, PlusIcon } from "../lib/icons";
import { toneClasses, type Tone } from "../lib/tone";
import { Tooltip } from "./tooltip";

const positions = {
  "bottom-right": "right-6 bottom-6",
  "bottom-left": "bottom-6 left-6",
  "top-right": "top-6 right-6",
  "top-left": "top-6 left-6",
} as const;

type Position = keyof typeof positions;

export interface FloatButtonProps extends Omit<React.ComponentProps<"button">, "children"> {
  icon: React.ReactNode;
  /** Accessible name and tooltip. */
  label: string;
  tone?: Tone;
  /** Pin to a corner of the viewport. Leave unset inside a FloatButtonGroup. */
  position?: Position;
  /** Small count or dot in the corner. */
  badge?: React.ReactNode;
  size?: "md" | "lg";
}

/** A round button that floats over the page, such as "New message" or "Help". */
export function FloatButton({ icon, label, tone = "brand", position, badge, size = "lg", className, ...props }: FloatButtonProps) {
  return (
    <Tooltip content={label} side="left">
      <button
        type="button"
        aria-label={label}
        data-slot="float-button"
        className={cn(
          toneClasses[tone],
          "relative inline-flex items-center justify-center rounded-full bg-(--t) text-(color:--t-fg) shadow-raised transition-[background-color,transform] duration-150",
          "outline-none hover:bg-(--t-hover) focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-95",
          "[&_svg]:size-5",
          size === "lg" ? "size-14" : "size-11",
          position && cn("fixed z-40", positions[position]),
          className,
        )}
        {...props}
      >
        {icon}
        {badge !== undefined ? (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[0.6875rem] font-semibold text-danger-fg ring-2 ring-bg">
            {badge}
          </span>
        ) : null}
      </button>
    </Tooltip>
  );
}

export interface FloatButtonGroupProps {
  /** The actions revealed when the group opens. */
  children: React.ReactNode;
  label?: string;
  icon?: React.ReactNode;
  position?: Position;
  tone?: Tone;
}

/** One floating button that fans out into several actions. */
export function FloatButtonGroup({ children, label = "Actions", icon = <PlusIcon />, position = "bottom-right", tone = "brand" }: FloatButtonGroupProps) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const up = position.startsWith("bottom");
  return (
    <div
      data-slot="float-button-group"
      className={cn("fixed z-40 flex items-center gap-3", up ? "flex-col-reverse" : "flex-col", positions[position])}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <FloatButton
        icon={<span className={cn("flex transition-transform duration-200", open && "rotate-45")}>{icon}</span>}
        label={open ? `Close ${label.toLowerCase()}` : label}
        tone={tone}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      />
      <div id={id} hidden={!open} className={cn("flex items-center gap-3", up ? "flex-col-reverse" : "flex-col")}>
        {children}
      </div>
    </div>
  );
}

export interface BackToTopProps extends Omit<FloatButtonProps, "icon" | "label"> {
  /** Show after scrolling this many pixels. */
  threshold?: number;
  label?: string;
}

/** A floating button that appears after scrolling down and returns to the top. */
export function BackToTop({ threshold = 400, label = "Back to top", position = "bottom-right", tone = "neutral", ...props }: BackToTopProps) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const update = () => setVisible(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);
  if (!visible) return null;
  return (
    <FloatButton
      icon={<ArrowUpToLineIcon />}
      label={label}
      position={position}
      tone={tone}
      size="md"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      {...props}
    />
  );
}
