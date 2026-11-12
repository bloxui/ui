"use client";

import * as React from "react";
import { NavigationMenu as NavPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { ChevronDownIcon } from "../lib/icons";

const itemClass =
  "inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium transition-colors outline-none hover:bg-neutral-soft focus-visible:ring-2 focus-visible:ring-ring data-[active]:text-brand-text data-[state=open]:bg-neutral-soft";

/** A site header menu: top-level links, some of which open a panel of further links. */
export function NavigationMenu({ className, children, ...props }: React.ComponentProps<typeof NavPrimitive.Root>) {
  return (
    <NavPrimitive.Root
      data-slot="navigation-menu"
      className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
      {...props}
    >
      {children}
      {/* Panels render here so they can animate between sizes as the user moves across triggers. */}
      <div className="absolute top-full left-0 flex justify-center">
        <NavPrimitive.Viewport
          data-slot="navigation-menu-viewport"
          className={cn(
            "relative mt-2 h-(--radix-navigation-menu-viewport-height) w-full origin-top overflow-hidden rounded-lg border border-border bg-surface text-fg shadow-raised",
            "transition-[width,height] duration-200 md:w-(--radix-navigation-menu-viewport-width)",
            "data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out",
          )}
        />
      </div>
    </NavPrimitive.Root>
  );
}

export function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavPrimitive.List>) {
  return (
    <NavPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("flex list-none items-center gap-1", className)}
      {...props}
    />
  );
}

export const NavigationMenuItem = NavPrimitive.Item;

export function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavPrimitive.Trigger>) {
  return (
    <NavPrimitive.Trigger data-slot="navigation-menu-trigger" className={cn(itemClass, "group", className)} {...props}>
      {children}
      <ChevronDownIcon className="size-3.5 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </NavPrimitive.Trigger>
  );
}

export function NavigationMenuContent({ className, ...props }: React.ComponentProps<typeof NavPrimitive.Content>) {
  return (
    <NavPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn("top-0 left-0 w-full p-2 md:absolute md:w-auto", className)}
      {...props}
    />
  );
}

export interface NavigationMenuLinkProps extends Omit<React.ComponentProps<typeof NavPrimitive.Link>, "title"> {
  /** Inside a panel: a bold title with a description under it. Omit both for a plain top-level link. */
  title?: React.ReactNode;
  description?: React.ReactNode;
}

/** A link. Set `active` on the current page; use `asChild` to render your router's link. */
export function NavigationMenuLink({ className, title, description, children, ...props }: NavigationMenuLinkProps) {
  const rich = title !== undefined;
  return (
    <NavPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        rich
          ? "flex flex-col gap-1 rounded-md p-3 text-sm transition-colors outline-none hover:bg-neutral-soft focus-visible:ring-2 focus-visible:ring-ring data-[active]:bg-brand-soft"
          : itemClass,
        className,
      )}
      {...props}
    >
      {rich ? (
        <>
          <span className="leading-none font-medium">{title}</span>
          {description ? <span className="leading-snug text-muted">{description}</span> : null}
          {children}
        </>
      ) : (
        children
      )}
    </NavPrimitive.Link>
  );
}
