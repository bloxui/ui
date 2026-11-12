import * as React from "react";
import { cn } from "../lib/cn";

export interface EmptyProps extends Omit<React.ComponentProps<"div">, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Buttons or links that help the user fill the empty space. */
  actions?: React.ReactNode;
  /** Heading level for the title. */
  headingLevel?: "h2" | "h3" | "h4" | "h5" | "h6";
  /** Draw the dashed outline. */
  bordered?: boolean;
}

/** An empty state: what is missing, why, and what to do next. */
export function Empty({
  className,
  icon,
  title,
  description,
  actions,
  headingLevel: Heading = "h3",
  bordered = true,
  children,
  ...props
}: EmptyProps) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl p-8 text-center",
        bordered && "border border-dashed border-border-strong",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="flex size-12 items-center justify-center rounded-full bg-neutral-soft text-muted [&_svg]:size-6">
          {icon}
        </div>
      ) : null}
      <div className="flex max-w-sm flex-col gap-1">
        <Heading className="text-base font-semibold">{title}</Heading>
        {description ? <p className="text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center justify-center gap-2">{actions}</div> : null}
      {children}
    </div>
  );
}
