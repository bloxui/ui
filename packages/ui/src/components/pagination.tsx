import * as React from "react";
import { cn } from "../lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "../lib/icons";
import { Button } from "./button";

export type PaginationRangeItem = number | "ellipsis";

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/**
 * Pages to show for a given position, e.g. page 6 of 20 → [1, "ellipsis", 5, 6, 7, "ellipsis", 20].
 * The result always has the same length for a given `count`, so the control does not jump around.
 */
export function getPaginationRange(page: number, count: number, siblings = 1): PaginationRangeItem[] {
  const slots = siblings * 2 + 5;
  if (count <= slots) return range(1, Math.max(count, 0));

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, count);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < count - 1;
  const edgeCount = siblings * 2 + 3;

  if (!showLeftEllipsis && showRightEllipsis) return [...range(1, edgeCount), "ellipsis", count];
  if (showLeftEllipsis && !showRightEllipsis) return [1, "ellipsis", ...range(count - edgeCount + 1, count)];
  return [1, "ellipsis", ...range(left, right), "ellipsis", count];
}

export interface PaginationProps extends Omit<React.ComponentProps<"nav">, "onChange"> {
  /** Current page, starting at 1. */
  page: number;
  /** Total number of pages. */
  count: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current one. */
  siblings?: number;
  size?: "sm" | "md";
  disabled?: boolean;
}

/** Give it the page and the page count; the page list and ellipses are worked out for you. */
export function Pagination({
  className,
  page,
  count,
  onPageChange,
  siblings = 1,
  size = "md",
  disabled = false,
  "aria-label": ariaLabel = "Pagination",
  ...props
}: PaginationProps) {
  const items = getPaginationRange(page, count, siblings);
  const itemSize = size === "sm" ? "min-w-8 px-2" : "min-w-9 px-2";

  return (
    <nav
      data-slot="pagination"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap items-center gap-1", className)}
      {...props}
    >
      <Button
        variant="ghost"
        tone="neutral"
        size={size}
        iconOnly
        aria-label="Previous page"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeftIcon />
      </Button>
      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden
            className={cn("flex items-center justify-center text-muted", size === "sm" ? "h-8 w-8" : "h-9 w-9")}
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? "soft" : "ghost"}
            tone={item === page ? "brand" : "neutral"}
            size={size}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            disabled={disabled}
            className={cn("tabular-nums", itemSize)}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        ),
      )}
      <Button
        variant="ghost"
        tone="neutral"
        size={size}
        iconOnly
        aria-label="Next page"
        disabled={disabled || page >= count}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRightIcon />
      </Button>
    </nav>
  );
}
