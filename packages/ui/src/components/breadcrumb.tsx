import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/cn";
import { ChevronRightIcon } from "../lib/icons";

export interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  /** Shown between items. Inserted automatically, so you only write the items. */
  separator?: React.ReactNode;
}

export function Breadcrumb({
  className,
  children,
  separator = <ChevronRightIcon />,
  "aria-label": ariaLabel = "Breadcrumb",
  ...props
}: BreadcrumbProps) {
  const items = React.Children.toArray(children).filter(React.isValidElement);
  return (
    <nav data-slot="breadcrumb" aria-label={ariaLabel} {...props}>
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm text-muted", className)}>
        {items.map((item, index) => (
          <React.Fragment key={item.key ?? index}>
            {item}
            {index < items.length - 1 ? (
              <li role="presentation" aria-hidden className="flex items-center [&_svg]:size-3.5">
                {separator}
              </li>
            ) : null}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

export function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  );
}

export interface BreadcrumbLinkProps extends React.ComponentProps<"a"> {
  /** Render your router's link component instead of an <a>. */
  asChild?: boolean;
}

export function BreadcrumbLink({ className, asChild, ...props }: BreadcrumbLinkProps) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "rounded-sm transition-colors outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}

/** The current page: not a link, announced as the current location. */
export function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn("font-medium text-fg", className)}
      {...props}
    />
  );
}

/** Stands in for collapsed middle items. */
export function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="breadcrumb-ellipsis" className={cn("flex items-center", className)} {...props}>
      <span aria-hidden>…</span>
      <span className="sr-only">More pages</span>
    </span>
  );
}
