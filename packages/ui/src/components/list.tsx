import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/cn";
import { Skeleton } from "./skeleton";

export interface ListProps extends React.ComponentProps<"ul"> {
  /** Lines between items. */
  divided?: boolean;
  /** Border around the whole list. */
  bordered?: boolean;
  /** Show placeholder rows instead of children. */
  loading?: boolean;
  /** Rows shown while loading. */
  loadingRows?: number;
  /** Shown when there are no children. */
  empty?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/** A vertical list of rows: people, files, notifications, settings. */
export function List({
  divided = true,
  bordered = false,
  loading = false,
  loadingRows = 3,
  empty = "Nothing here yet.",
  header,
  footer,
  className,
  children,
  ...props
}: ListProps) {
  const hasChildren = React.Children.toArray(children).length > 0;
  return (
    <div data-slot="list" className={cn(bordered && "overflow-hidden rounded-lg border border-border", className)}>
      {header ? <div className={cn("px-4 py-3 text-sm font-medium", bordered && "border-b border-border bg-sunken")}>{header}</div> : null}
      <ul
        aria-busy={loading || undefined}
        className={cn(divided && "divide-y divide-border", bordered && "px-1")}
        {...props}
      >
        {loading ? (
          Array.from({ length: loadingRows }, (_, index) => (
            <li key={index} aria-hidden className="flex items-center gap-3 px-3 py-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </li>
          ))
        ) : hasChildren ? (
          children
        ) : (
          <li className="px-3 py-8 text-center text-sm text-muted">{empty}</li>
        )}
      </ul>
      {footer ? <div className={cn("px-4 py-3 text-sm", bordered && "border-t border-border")}>{footer}</div> : null}
    </div>
  );
}

export interface ListItemProps extends Omit<React.ComponentProps<"li">, "title" | "prefix"> {
  /** Leading visual: an avatar, icon or image. */
  prefix?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Trailing content: a badge, time, button or menu. */
  suffix?: React.ReactNode;
  /**
   * Make the whole row a link or button: pass the element (e.g. <a href="…" /> or your router's Link),
   * and the row's content renders inside it.
   */
  action?: React.ReactElement;
}

export function ListItem({ prefix, title, description, suffix, action, className, ...props }: ListItemProps) {
  const content = (
    <>
      {prefix ? <span className="flex shrink-0 items-center text-muted [&_svg]:size-5">{prefix}</span> : null}
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="truncate text-sm font-medium text-fg">{title}</span>
        {description ? <span className="truncate text-sm text-muted">{description}</span> : null}
      </span>
      {suffix ? <span className="flex shrink-0 items-center gap-2 text-sm text-muted">{suffix}</span> : null}
    </>
  );
  const rowClass = "flex w-full items-center gap-3 px-3 py-3 text-left";
  return (
    <li data-slot="list-item" className={cn(action && "p-0.5", className)} {...props}>
      {action ? (
        <Slot
          className={cn(
            rowClass,
            "rounded-md transition-colors outline-none hover:bg-neutral-soft focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          {React.cloneElement(action, undefined, content)}
        </Slot>
      ) : (
        <div className={rowClass}>{content}</div>
      )}
    </li>
  );
}
