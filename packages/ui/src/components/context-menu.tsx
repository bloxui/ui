"use client";

import * as React from "react";
import { ContextMenu as MenuPrimitive } from "radix-ui";
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

/** A menu opened by right-click or long-press on its trigger area. Same items as DropdownMenu. */
export const ContextMenu = MenuPrimitive.Root;
export const ContextMenuTrigger = MenuPrimitive.Trigger;
export const ContextMenuGroup = MenuPrimitive.Group;
export const ContextMenuRadioGroup = MenuPrimitive.RadioGroup;
export const ContextMenuSub = MenuPrimitive.Sub;

const contentSizing =
  "max-h-(--radix-context-menu-content-available-height) origin-(--radix-context-menu-content-transform-origin)";

export function ContextMenuContent({
  className,
  collisionPadding = 8,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        data-slot="context-menu-content"
        collisionPadding={collisionPadding}
        className={cn(menuContentClass, contentSizing, className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

export function ContextMenuItem({
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
      data-slot="context-menu-item"
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

export function ContextMenuCheckboxItem({
  className,
  shortcut,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem> & Pick<MenuItemExtras, "shortcut">) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
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

export function ContextMenuRadioItem({
  className,
  shortcut,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem> & Pick<MenuItemExtras, "shortcut">) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
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

export function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Label> & Pick<MenuItemExtras, "inset">) {
  return (
    <MenuPrimitive.Label
      data-slot="context-menu-label"
      className={cn(menuLabelClass, inset && "pl-8", className)}
      {...props}
    />
  );
}

export function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn(menuSeparatorClass, className)}
      {...props}
    />
  );
}

export function ContextMenuSubTrigger({
  className,
  icon,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.SubTrigger> & Pick<MenuItemExtras, "icon" | "inset">) {
  return (
    <MenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      className={cn(menuItemClass, "data-[state=open]:bg-neutral-soft", inset && "pl-8", className)}
      {...props}
    >
      <MenuItemInner icon={icon}>{children}</MenuItemInner>
      <ChevronRightIcon className="ml-auto text-muted" />
    </MenuPrimitive.SubTrigger>
  );
}

export function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent
        data-slot="context-menu-sub-content"
        className={cn(menuContentClass, contentSizing, className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}
