"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { CheckIcon } from "../lib/icons";

export interface StepperStep {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Shown in place of the step number. */
  icon?: React.ReactNode;
}

export type StepState = "complete" | "current" | "upcoming";

export interface StepperProps extends Omit<React.ComponentProps<"ol">, "onChange"> {
  steps: StepperStep[];
  /** Index of the current step, starting at 0. Every step before it counts as complete. */
  current: number;
  orientation?: "horizontal" | "vertical";
  /** Make finished steps clickable, to go back to them. */
  onStepClick?: (index: number) => void;
}

export function stepState(index: number, current: number): StepState {
  if (index < current) return "complete";
  return index === current ? "current" : "upcoming";
}

/** Shows progress through a multi-step flow. Pair it with your own content for each step. */
export function Stepper({
  steps,
  current,
  orientation = "horizontal",
  onStepClick,
  className,
  "aria-label": ariaLabel = "Progress",
  ...props
}: StepperProps) {
  const horizontal = orientation === "horizontal";
  return (
    <ol
      data-slot="stepper"
      aria-label={ariaLabel}
      className={cn("flex", horizontal ? "w-full items-start" : "flex-col", className)}
      {...props}
    >
      {steps.map((step, index) => {
        const state = stepState(index, current);
        const last = index === steps.length - 1;
        const clickable = onStepClick !== undefined && state === "complete";
        const label = (
          <>
            <span
              className={cn(
                "relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                state === "complete" && "border-brand bg-brand text-brand-fg",
                state === "current" && "border-brand bg-surface text-brand-text",
                state === "upcoming" && "border-border-strong bg-surface text-muted",
                "[&_svg]:size-4",
              )}
            >
              {state === "complete" ? <CheckIcon strokeWidth={3} /> : (step.icon ?? index + 1)}
            </span>
            <span className={cn("grid gap-0.5", horizontal ? "text-center" : "pt-1 pb-6 text-left")}>
              <span className={cn("text-sm font-medium", state === "upcoming" && "text-muted")}>{step.title}</span>
              {step.description ? <span className="text-xs text-muted">{step.description}</span> : null}
              <span className="sr-only">
                {state === "complete" ? "(completed)" : state === "current" ? "(current step)" : ""}
              </span>
            </span>
          </>
        );
        const layout = cn("flex gap-3", horizontal ? "flex-col items-center px-2" : "items-start");

        return (
          <li
            key={index}
            data-state={state}
            aria-current={state === "current" ? "step" : undefined}
            className={cn("relative", horizontal ? "flex-1" : "")}
          >
            {!last ? (
              <span
                aria-hidden
                className={cn(
                  "absolute",
                  horizontal ? "top-4 left-[calc(50%+1.25rem)] h-0.5 w-[calc(100%-2.5rem)]" : "top-9 bottom-1 left-[15px] w-0.5",
                  index < current ? "bg-brand" : "bg-border",
                )}
              />
            ) : null}
            {clickable ? (
              <button
                type="button"
                onClick={() => onStepClick(index)}
                className={cn(layout, "w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring")}
              >
                {label}
              </button>
            ) : (
              <div className={layout}>{label}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
