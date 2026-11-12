"use client";

import * as React from "react";
import { DropdownMenu as MenuPrimitive } from "radix-ui";
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

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;
export const DropdownMenuSub = MenuPrimitive.Sub;

const contentSizing =
  "max-h-(--radix-dropdown-menu-content-available-height) origin-(--radix-dropdown-menu-content-transform-origin)";

export function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 6,
  collisionPadding = 8,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        data-slot="dropdown-menu-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(menuContentClass, contentSizing, className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
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
      data-slot="dropdown-menu-item"
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

export function DropdownMenuCheckboxItem({
  className,
  shortcut,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem> & Pick<MenuItemExtras, "shortcut">) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
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

export function DropdownMenuRadioItem({
  className,
  shortcut,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem> & Pick<MenuItemExtras, "shortcut">) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
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

export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Label> & Pick<MenuItemExtras, "inset">) {
  return (
    <MenuPrimitive.Label
      data-slot="dropdown-menu-label"
      className={cn(menuLabelClass, inset && "pl-8", className)}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(menuSeparatorClass, className)}
      {...props}
    />
  );
}

export function DropdownMenuSubTrigger({
  className,
  icon,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.SubTrigger> & Pick<MenuItemExtras, "icon" | "inset">) {
  return (
    <MenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      className={cn(menuItemClass, "data-[state=open]:bg-neutral-soft", inset && "pl-8", className)}
      {...props}
    >
      <MenuItemInner icon={icon}>{children}</MenuItemInner>
      <ChevronRightIcon className="ml-auto text-muted" />
    </MenuPrimitive.SubTrigger>
  );
}

export function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent
        data-slot="dropdown-menu-sub-content"
        className={cn(menuContentClass, contentSizing, className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}
