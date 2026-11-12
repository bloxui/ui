"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { ArrowDownIcon, ArrowUpIcon } from "../lib/icons";

export interface StatisticProps extends Omit<React.ComponentProps<"div">, "prefix"> {
  label: React.ReactNode;
  value: number;
  /** Number format, e.g. { style: "currency", currency: "INR" } or { notation: "compact" }. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Fixed by default so server and client render the same text. */
  locale?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  /** Change against a previous period, in percent, e.g. 12.5 or -3. */
  change?: number;
  /** Whether a rise is good news. False for numbers like costs or churn. */
  riseIsGood?: boolean;
  /** Text after the change, e.g. "from last month". */
  changeLabel?: React.ReactNode;
  /** Count up from zero when it first appears. Skipped for people who prefer reduced motion. */
  animate?: boolean;
  size?: "sm" | "md" | "lg";
}

const valueSizes = { sm: "text-xl", md: "text-3xl", lg: "text-4xl" } as const;

function useCountUp(target: number, enabled: boolean) {
  // Start from the real value, so server HTML and no-JS readers see the right number.
  const [shown, setShown] = React.useState(target);
  React.useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 900);
      setShown(target * (1 - (1 - progress) ** 3));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    setShown(0);
    frame = requestAnimationFrame(tick);
    // Browsers pause animation frames in background tabs; never leave a wrong number behind.
    const settle = setTimeout(() => setShown(target), 1200);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
  }, [target, enabled]);
  return shown;
}

/** A labelled number with an optional change indicator. The arrow and wording carry the trend, not colour alone. */
export function Statistic({
  label,
  value,
  formatOptions,
  locale = "en-US",
  prefix,
  suffix,
  change,
  riseIsGood = true,
  changeLabel,
  animate = false,
  size = "md",
  className,
  ...props
}: StatisticProps) {
  const formatter = React.useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, formatOptions]);
  const shown = useCountUp(value, animate);
  const rose = (change ?? 0) >= 0;
  const good = rose === riseIsGood;
  const Arrow = rose ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div data-slot="statistic" className={cn("grid gap-1", className)} {...props}>
      <div className="text-sm text-muted">{label}</div>
      <div className={cn("flex items-baseline gap-1 font-semibold tracking-tight tabular-nums", valueSizes[size])}>
        {prefix ? <span className="text-[0.6em] font-medium text-muted">{prefix}</span> : null}
        {/* Screen readers get the final value, not every animation frame. */}
        <span aria-hidden={animate || undefined}>{formatter.format(shown)}</span>
        {animate ? <span className="sr-only">{formatter.format(value)}</span> : null}
        {suffix ? <span className="text-[0.6em] font-medium text-muted">{suffix}</span> : null}
      </div>
      {change !== undefined ? (
        <p className="flex items-center gap-1 text-xs">
          <span className={cn("inline-flex items-center gap-0.5 font-medium", good ? "text-success-text" : "text-danger-text")}>
            <Arrow className="size-3.5" />
            <span className="tabular-nums">{Math.abs(change)}%</span>
            <span className="sr-only">{rose ? "increase" : "decrease"}</span>
          </span>
          {changeLabel ? <span className="text-muted">{changeLabel}</span> : null}
        </p>
      ) : null}
    </div>
  );
}
