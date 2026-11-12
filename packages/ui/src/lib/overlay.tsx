import * as React from "react";

/** Class names shared by every overlay, so dialogs, popovers and menus look like one family. */

export const backdropClass =
  "fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out";

export const closeButtonClass =
  "absolute top-3.5 right-3.5 flex size-8 items-center justify-center rounded-md text-muted transition-colors outline-none hover:bg-neutral-soft hover:text-fg focus-visible:ring-2 focus-visible:ring-ring";

/** Floating surface for popovers, hover cards and menus. */
export const popupClass =
  "z-50 rounded-lg border border-border bg-surface text-fg shadow-raised outline-none data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out";

export const menuContentClass = `${popupClass} min-w-44 overflow-x-hidden overflow-y-auto p-1`;

export const menuItemClass =
  "relative flex cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-sm outline-none select-none data-[highlighted]:bg-neutral-soft data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[tone=danger]:text-danger-text data-[tone=danger]:data-[highlighted]:bg-danger-soft [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

export const menuIndicatorClass = "absolute left-2.5 flex size-4 items-center justify-center";
export const menuLabelClass = "px-2.5 py-1.5 text-xs font-medium text-muted";
export const menuSeparatorClass = "-mx-1 my-1 h-px bg-border";

export interface MenuItemExtras {
  /** `danger` styles destructive actions such as Delete. */
  tone?: "neutral" | "danger";
  /** Icon shown before the label. */
  icon?: React.ReactNode;
  /** Keyboard hint shown at the end, e.g. "⌘K". Display only. */
  shortcut?: React.ReactNode;
  /** Indents the item to line up with checkbox and radio items. */
  inset?: boolean;
}

/** Icon + label + shortcut layout used inside every menu and command item. */
export function MenuItemInner({
  icon,
  shortcut,
  children,
}: Pick<MenuItemExtras, "icon" | "shortcut"> & { children?: React.ReactNode }) {
  return (
    <>
      {icon ? (
        <span className="flex shrink-0 text-muted [[data-tone=danger]_&]:text-danger-text">{icon}</span>
      ) : null}
      {children}
      {shortcut ? <span className="ml-auto pl-4 text-xs tracking-wide text-muted">{shortcut}</span> : null}
    </>
  );
}
