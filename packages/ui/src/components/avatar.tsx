"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { UserIcon } from "../lib/icons";

const sizes = {
  xs: "size-6 text-[0.625rem]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-lg",
} as const;

const statusColors = {
  online: "bg-success",
  away: "bg-warning",
  busy: "bg-danger",
  offline: "bg-border-strong",
} as const;

export type AvatarSize = keyof typeof sizes;

/** "Ada Lovelace" → "AL", "Ada" → "A". */
export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export interface AvatarProps
  extends Omit<React.ComponentProps<typeof AvatarPrimitive.Root>, "children"> {
  src?: string;
  /** Used for the image alt text and for the initials shown when there is no image. */
  name?: string;
  size?: AvatarSize;
  shape?: "circle" | "square";
  status?: keyof typeof statusColors;
  /** Replaces the initials / default icon shown when the image is missing or fails. */
  fallback?: React.ReactNode;
}

/** One element instead of Root + Image + Fallback: the image falls back to initials, then to an icon. */
export function Avatar({
  className,
  src,
  name,
  size = "md",
  shape = "circle",
  status,
  fallback,
  ...props
}: AvatarProps) {
  const radius = shape === "circle" ? "rounded-full" : "rounded-lg";
  const initials = name ? getInitials(name) : "";
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative inline-flex shrink-0 select-none", sizes[size], radius, className)}
      {...props}
    >
      <span className={cn("flex size-full overflow-hidden", radius)}>
        {src ? (
          <AvatarPrimitive.Image src={src} alt={name ?? ""} className="size-full object-cover" />
        ) : null}
        <AvatarPrimitive.Fallback
          role={name ? "img" : undefined}
          aria-label={name}
          className="flex size-full items-center justify-center bg-neutral-soft font-medium text-neutral-text"
        >
          {fallback ?? (initials || <UserIcon className="size-[55%]" />)}
        </AvatarPrimitive.Fallback>
      </span>
      {status ? (
        <span
          role="img"
          aria-label={status}
          className={cn(
            "absolute right-0 bottom-0 size-[28%] min-w-2 rounded-full ring-2 ring-bg",
            statusColors[status],
          )}
        />
      ) : null}
    </AvatarPrimitive.Root>
  );
}

export interface AvatarGroupProps extends React.ComponentProps<"div"> {
  /** Show at most this many avatars, then a "+N" counter. */
  max?: number;
  /** Size of the "+N" counter; match it to the avatars inside. */
  size?: AvatarSize;
}

export function AvatarGroup({ className, max, size = "md", children, ...props }: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const visible = max !== undefined ? items.slice(0, max) : items;
  const hidden = items.length - visible.length;
  return (
    <div
      data-slot="avatar-group"
      className={cn("flex items-center -space-x-2 *:ring-2 *:ring-bg", className)}
      {...props}
    >
      {visible}
      {hidden > 0 ? (
        <span
          className={cn(
            "relative inline-flex shrink-0 items-center justify-center rounded-full bg-neutral-soft font-medium text-neutral-text",
            sizes[size],
          )}
        >
          +{hidden}
        </span>
      ) : null}
    </div>
  );
}
