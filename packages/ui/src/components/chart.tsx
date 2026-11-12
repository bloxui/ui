"use client";

import * as React from "react";
import { Legend, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "../lib/cn";

/** Number of validated series colours (--bx-chart-1 … --bx-chart-8). */
export const CHART_COLOR_COUNT = 8;

export interface ChartSeriesConfig {
  /** Name shown in the tooltip and legend. */
  label?: React.ReactNode;
  /** Any CSS colour. Defaults to the next colour in the Blox chart palette. */
  color?: string;
}

/** Maps each data key to its label and colour, e.g. { desktop: { label: "Desktop" } }. */
export type ChartConfig = Record<string, ChartSeriesConfig>;

const ChartContext = React.createContext<ChartConfig>({});

/**
 * Colours are assigned in the order the keys appear and never cycled, so a series
 * keeps its colour when others are filtered out. Past eight series the last colour
 * repeats: group the rest as "Other" or split the chart instead.
 */
function seriesColor(config: ChartConfig, key: string) {
  const explicit = config[key]?.color;
  if (explicit) return explicit;
  const index = Object.keys(config).indexOf(key);
  return `var(--bx-chart-${Math.min(Math.max(index, 0) + 1, CHART_COLOR_COUNT)})`;
}

export interface ChartContainerProps extends React.ComponentProps<"div"> {
  config: ChartConfig;
  /** A single Recharts chart, e.g. <BarChart>. */
  children: React.ReactElement;
}

/**
 * Wraps a Recharts chart: sizes it responsively, themes its grid, axes and cursor
 * with Blox tokens, and exposes each series colour as `var(--color-<key>)`.
 *
 * Give the chart a text alternative (a caption or a table of the same data):
 * on a light background the aqua, yellow and magenta series are under 3:1 contrast.
 */
export function ChartContainer({ className, config, children, style, ...props }: ChartContainerProps) {
  const colorVariables = Object.fromEntries(
    Object.keys(config).map((key) => [`--color-${key}`, seriesColor(config, key)]),
  );
  return (
    <ChartContext.Provider value={config}>
      <div
        data-slot="chart"
        style={{ ...colorVariables, ...style } as React.CSSProperties}
        className={cn(
          "flex aspect-video w-full justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted [&_.recharts-polar-angle-axis-tick_text]:fill-muted",
          "[&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-polar-grid_line]:stroke-border",
          "[&_.recharts-cartesian-axis-line]:stroke-border-strong [&_.recharts-reference-line_line]:stroke-border-strong",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border-strong [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-neutral-soft",
          "[&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

interface PayloadItem {
  dataKey?: string | number | ((...args: never[]) => unknown);
  name?: string | number;
  value?: unknown;
  color?: string;
}

function itemKey(item: PayloadItem) {
  return typeof item.dataKey === "string" || typeof item.dataKey === "number"
    ? String(item.dataKey)
    : String(item.name ?? "");
}

function Swatch({ color }: { color: string }) {
  return <span aria-hidden className="size-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: color }} />;
}

export const ChartTooltip = Tooltip;

export interface ChartTooltipContentProps {
  // Recharts fills these in when the element is passed to <ChartTooltip content={…} />.
  active?: boolean;
  payload?: readonly PayloadItem[];
  label?: React.ReactNode;
  /** Hide the heading (the x-axis value). */
  hideLabel?: boolean;
  labelFormatter?: (label: React.ReactNode) => React.ReactNode;
  valueFormatter?: (value: unknown, key: string) => React.ReactNode;
  className?: string;
}

/** Tooltip body. Text uses the normal text colours; the swatch alone carries the series colour. */
export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  labelFormatter,
  valueFormatter,
  className,
}: ChartTooltipContentProps) {
  const config = React.useContext(ChartContext);
  if (!active || !payload?.length) return null;

  return (
    <div
      data-slot="chart-tooltip"
      className={cn(
        "grid min-w-32 gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-2 text-xs text-fg shadow-raised",
        className,
      )}
    >
      {hideLabel || label === undefined || label === null ? null : (
        <div className="font-medium">{labelFormatter ? labelFormatter(label) : label}</div>
      )}
      <div className="grid gap-1">
        {payload.map((item, index) => {
          const key = itemKey(item);
          return (
            <div key={`${key}-${index}`} className="flex items-center gap-2">
              <Swatch color={item.color ?? seriesColor(config, key)} />
              <span className="text-muted">{config[key]?.label ?? item.name ?? key}</span>
              <span className="ml-auto pl-3 font-medium tabular-nums">
                {valueFormatter
                  ? valueFormatter(item.value, key)
                  : typeof item.value === "number"
                    ? item.value.toLocaleString("en-US")
                    : String(item.value ?? "")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const ChartLegend = Legend;

export interface ChartLegendContentProps {
  // Recharts fills this in when the element is passed to <ChartLegend content={…} />.
  payload?: readonly PayloadItem[];
  className?: string;
}

/** Legend row. Show it whenever the chart has two or more series. */
export function ChartLegendContent({ payload, className }: ChartLegendContentProps) {
  const config = React.useContext(ChartContext);
  if (!payload?.length) return null;
  return (
    <ul
      data-slot="chart-legend"
      className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-3 text-xs text-muted", className)}
    >
      {payload.map((item, index) => {
        const key = itemKey(item);
        return (
          <li key={`${key}-${index}`} className="flex items-center gap-1.5">
            <Swatch color={item.color ?? seriesColor(config, key)} />
            {config[key]?.label ?? key}
          </li>
        );
      })}
    </ul>
  );
}
