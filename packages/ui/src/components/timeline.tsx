import * as React from "react";
import { cn } from "../lib/cn";
import { toneClasses, type Tone } from "../lib/tone";

export interface TimelineItem {
  /** Stable id; falls back to the index. */
  id?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** When it happened. A Date is shown with the `formatTime` prop; strings are shown as they are. */
  time?: Date | string;
  /** Icon inside the marker; a plain dot is drawn without one. */
  icon?: React.ReactNode;
  tone?: Tone;
  /** Extra content under the description, e.g. a quote or attachments. */
  content?: React.ReactNode;
}

export interface TimelineProps extends React.ComponentProps<"ol"> {
  items: TimelineItem[];
  /** How Date values are shown. Fixed locale by default so server and client render the same text. */
  formatTime?: (time: Date) => string;
}

const defaultFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

/** A vertical list of events in order, each with a marker on a connecting line. */
export function Timeline({ items, formatTime = (time) => defaultFormat.format(time), className, ...props }: TimelineProps) {
  return (
    <ol data-slot="timeline" className={cn("grid", className)} {...props}>
      {items.map((item, index) => {
        const last = index === items.length - 1;
        const tone = item.tone ?? "neutral";
        return (
          <li key={item.id ?? index} className={cn(toneClasses[tone], "relative flex gap-4", !last && "pb-6")}>
            {!last ? <span aria-hidden className="absolute top-8 bottom-0 left-[15px] w-0.5 bg-border" /> : null}
            <span
              aria-hidden
              className={cn(
                "relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full",
                item.icon ? "bg-(--t-soft) text-(color:--t-text) [&_svg]:size-4" : "bg-transparent",
              )}
            >
              {item.icon ?? <span className="size-2.5 rounded-full bg-(--t) ring-4 ring-bg" />}
            </span>
            <div className="grid min-w-0 flex-1 gap-1 pt-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className="text-sm font-medium">{item.title}</p>
                {item.time ? (
                  <time
                    dateTime={item.time instanceof Date ? item.time.toISOString() : undefined}
                    className="text-xs text-muted tabular-nums"
                  >
                    {item.time instanceof Date ? formatTime(item.time) : item.time}
                  </time>
                ) : null}
              </div>
              {item.description ? <p className="text-sm text-muted">{item.description}</p> : null}
              {item.content ? <div className="pt-1">{item.content}</div> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
