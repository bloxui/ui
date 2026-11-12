"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { useFieldControl } from "../lib/field-context";
import { CheckIcon, ChevronDownIcon } from "../lib/icons";

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

const triggerSizes = {
  sm: "h-8 rounded-md px-2.5 text-sm",
  md: "h-9 rounded-lg px-3 text-sm",
  lg: "h-11 rounded-lg px-3.5 text-base",
} as const;

export interface SelectTriggerProps extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
  size?: keyof typeof triggerSizes;
  invalid?: boolean;
}

export function SelectTrigger({
  className,
  size = "md",
  invalid,
  id,
  children,
  "aria-describedby": describedBy,
  ...props
}: SelectTriggerProps) {
  const control = useFieldControl({ id, invalid, "aria-describedby": describedBy });
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      id={control.id}
      aria-describedby={control["aria-describedby"]}
      aria-invalid={control.invalid || undefined}
      className={cn(
        "flex w-full items-center justify-between gap-2 border border-border-strong bg-surface text-fg shadow-xs",
        "transition-[border-color,box-shadow] duration-150 outline-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25",
        "disabled:cursor-not-allowed disabled:bg-sunken disabled:opacity-60",
        "data-[placeholder]:text-muted/70 aria-invalid:border-danger",
        "[&>span]:truncate",
        triggerSizes[size],
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 shrink-0 text-muted" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={sideOffset}
        className={cn(
          "relative z-50 min-w-32 overflow-hidden rounded-lg border border-border bg-surface text-fg shadow-raised",
          "max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) animate-pop-in",
          position === "popper" && "w-full min-w-(--radix-select-trigger-width)",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-2.5 py-1.5 text-xs font-medium text-muted", className)}
      {...props}
    />
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center rounded-md py-1.5 pr-8 pl-2.5 text-sm outline-none select-none",
        "data-[highlighted]:bg-neutral-soft data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2.5 flex items-center">
        <CheckIcon className="size-4 text-brand-text" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
