"use client";

import * as React from "react";
import { Menubar as MenuPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { CheckIcon, ChevronRightIcon } from "../lib/icons";
import {
  menuContentClass,
  menuIndicatorClass,
  menuItemClass,
  MenuItemInner,
  menuLabelClass,
  menuSeparatorClass,
  type MenuItemExtras,
} from "../lib/overlay";

export const MenubarMenu = MenuPrimitive.Menu;
export const MenubarGroup = MenuPrimitive.Group;
export const MenubarRadioGroup = MenuPrimitive.RadioGroup;
export const MenubarSub = MenuPrimitive.Sub;

const contentSizing =
  "max-h-(--radix-menubar-content-available-height) origin-(--radix-menubar-content-transform-origin)";

/** A desktop-style row of menus (File, Edit, View…). Same items as DropdownMenu. */
export function Menubar({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return (
    <MenuPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex h-10 items-center gap-1 rounded-lg border border-border bg-surface p-1 shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

export function MenubarTrigger({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex h-full cursor-default items-center rounded-md px-3 text-sm font-medium outline-none select-none",
        "data-[highlighted]:bg-neutral-soft data-[state=open]:bg-neutral-soft",
        className,
      )}
      {...props}
    />
  );
}

export function MenubarContent({
  className,
  align = "start",
  sideOffset = 8,
  alignOffset = -4,
  collisionPadding = 8,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        data-slot="menubar-content"
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={cn(menuContentClass, contentSizing, className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

export function MenubarItem({
  className,
  tone = "neutral",
  icon,
  shortcut,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & MenuItemExtras) {
  return (
    <MenuPrimitive.Item
      data-slot="menubar-item"
      data-tone={tone}
      className={cn(menuItemClass, inset && "pl-8", className)}
      {...props}
    >
      <MenuItemInner icon={icon} shortcut={shortcut}>
        {children}
      </MenuItemInner>
    </MenuPrimitive.Item>
  );
}

export function MenubarCheckboxItem({
  className,
  shortcut,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem> & Pick<MenuItemExtras, "shortcut">) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(menuItemClass, "pl-8", className)}
      {...props}
    >
      <span className={menuIndicatorClass}>
        <MenuPrimitive.ItemIndicator>
          <CheckIcon />
        </MenuPrimitive.ItemIndicator>
      </span>
      <MenuItemInner shortcut={shortcut}>{children}</MenuItemInner>
    </MenuPrimitive.CheckboxItem>
  );
}

export function MenubarRadioItem({
  className,
  shortcut,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem> & Pick<MenuItemExtras, "shortcut">) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(menuItemClass, "pl-8", className)}
      {...props}
    >
      <span className={menuIndicatorClass}>
        <MenuPrimitive.ItemIndicator>
          <span className="block size-2 rounded-full bg-current" />
        </MenuPrimitive.ItemIndicator>
      </span>
      <MenuItemInner shortcut={shortcut}>{children}</MenuItemInner>
    </MenuPrimitive.RadioItem>
  );
}

export function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Label> & Pick<MenuItemExtras, "inset">) {
  return (
    <MenuPrimitive.Label
      data-slot="menubar-label"
      className={cn(menuLabelClass, inset && "pl-8", className)}
      {...props}
    />
  );
}

export function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      data-slot="menubar-separator"
      className={cn(menuSeparatorClass, className)}
      {...props}
    />
  );
}

export function MenubarSubTrigger({
  className,
  icon,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.SubTrigger> & Pick<MenuItemExtras, "icon" | "inset">) {
  return (
    <MenuPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      className={cn(menuItemClass, "data-[state=open]:bg-neutral-soft", inset && "pl-8", className)}
      {...props}
    >
      <MenuItemInner icon={icon}>{children}</MenuItemInner>
      <ChevronRightIcon className="ml-auto text-muted" />
    </MenuPrimitive.SubTrigger>
  );
}

export function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent
        data-slot="menubar-sub-content"
        className={cn(menuContentClass, contentSizing, className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}
