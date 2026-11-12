"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";
import { XIcon } from "../lib/icons";
import { Button } from "./button";

export interface TourStep {
  /** The element to highlight: a CSS selector, a ref, or a function returning it. Omit for a centred step. */
  target?: string | React.RefObject<Element | null> | (() => Element | null);
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Preferred side for the card; it flips when there is no room. */
  placement?: "top" | "bottom";
}

export interface TourProps {
  steps: TourStep[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Controlled step index. */
  current?: number;
  onCurrentChange?: (index: number) => void;
  /** Called when the user finishes the last step (not when they skip). */
  onFinish?: () => void;
  /** Space between the highlight and the element, in pixels. */
  padding?: number;
}

function resolveTarget(target: TourStep["target"]) {
  if (!target) return null;
  if (typeof target === "string") return document.querySelector(target);
  if (typeof target === "function") return target();
  return target.current;
}

/** Placement of the card next to a highlighted area, kept inside the viewport. */
export function placeTourCard(
  rect: { top: number; left: number; width: number; height: number } | null,
  card: { width: number; height: number },
  viewport: { width: number; height: number },
  preferred: "top" | "bottom" = "bottom",
  gap = 12,
) {
  const margin = 12;
  if (!rect) return { top: (viewport.height - card.height) / 2, left: (viewport.width - card.width) / 2 };
  const roomBelow = viewport.height - (rect.top + rect.height) - gap;
  const roomAbove = rect.top - gap;
  const below = preferred === "bottom" ? roomBelow >= card.height || roomBelow >= roomAbove : roomAbove < card.height && roomBelow > roomAbove;
  const top = below ? rect.top + rect.height + gap : rect.top - gap - card.height;
  const left = Math.min(Math.max(margin, rect.left + rect.width / 2 - card.width / 2), viewport.width - card.width - margin);
  return { top: Math.max(margin, Math.min(top, viewport.height - card.height - margin)), left };
}

/** Walks a new user through the interface, highlighting one element at a time. */
export function Tour({ steps, open, onOpenChange, current: currentProp, onCurrentChange, onFinish, padding = 6 }: TourProps) {
  const [internal, setInternal] = React.useState(0);
  const current = currentProp ?? internal;
  const step = steps[current];
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  const go = React.useCallback(
    (index: number) => {
      if (currentProp === undefined) setInternal(index);
      onCurrentChange?.(index);
    },
    [currentProp, onCurrentChange],
  );

  React.useEffect(() => {
    if (open) go(0);
    // Start from the first step every time the tour opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Measure the target and place the card; follow scrolling and resizing.
  React.useLayoutEffect(() => {
    if (!open || !step) return;
    const element = resolveTarget(step.target);
    element?.scrollIntoView({ block: "center", behavior: "smooth" });
    const measure = () => {
      const next = element?.getBoundingClientRect() ?? null;
      setRect(next);
      const card = cardRef.current?.getBoundingClientRect();
      const padded = next ? { top: next.top - padding, left: next.left - padding, width: next.width + padding * 2, height: next.height + padding * 2 } : null;
      setPosition(
        placeTourCard(padded, { width: card?.width ?? 320, height: card?.height ?? 160 }, { width: window.innerWidth, height: window.innerHeight }, step.placement),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, step, padding, current]);

  React.useEffect(() => {
    if (open) cardRef.current?.focus();
  }, [open, current]);

  if (!open || !step || typeof document === "undefined") return null;
  const last = current === steps.length - 1;

  return createPortal(
    <div data-slot="tour" className="fixed inset-0 z-50">
      {/* The dimmed backdrop with a hole cut around the target. */}
      <div aria-hidden className="absolute inset-0" onClick={() => onOpenChange(false)} />
      {rect ? (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-lg shadow-[0_0_0_9999px_rgb(0_0_0/0.55)] ring-2 ring-brand transition-all duration-300"
          style={{ top: rect.top - padding, left: rect.left - padding, width: rect.width + padding * 2, height: rect.height + padding * 2 }}
        />
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/55" />
      )}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={step.description ? descriptionId : undefined}
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === "Escape") onOpenChange(false);
          else if (event.key === "ArrowRight" && !last) go(current + 1);
          else if (event.key === "ArrowLeft" && current > 0) go(current - 1);
        }}
        className={cn(
          "absolute grid w-80 max-w-[calc(100vw-1.5rem)] gap-3 rounded-xl border border-border bg-surface p-4 text-fg shadow-raised outline-none animate-pop-in",
          !position && "invisible",
        )}
        style={position ?? undefined}
      >
        <button
          type="button"
          aria-label="Close tour"
          onClick={() => onOpenChange(false)}
          className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-md text-muted outline-none hover:bg-neutral-soft hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
        >
          <XIcon className="size-4" />
        </button>
        <div className="grid gap-1 pr-6">
          <h2 id={titleId} className="font-semibold">
            {step.title}
          </h2>
          {step.description ? (
            <p id={descriptionId} className="text-sm text-muted">
              {step.description}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted tabular-nums">
            {current + 1} of {steps.length}
          </span>
          <div className="ml-auto flex gap-2">
            {current > 0 ? (
              <Button variant="outline" tone="neutral" size="xs" onClick={() => go(current - 1)}>
                Back
              </Button>
            ) : (
              <Button variant="ghost" tone="neutral" size="xs" onClick={() => onOpenChange(false)}>
                Skip
              </Button>
            )}
            <Button
              size="xs"
              onClick={() => {
                if (last) {
                  onOpenChange(false);
                  onFinish?.();
                } else go(current + 1);
              }}
            >
              {last ? "Done" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
