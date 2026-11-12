"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

type TabsVariant = "underline" | "pills";
type TabsSize = "sm" | "md";

const TabsContext = React.createContext<{ variant: TabsVariant; size: TabsSize }>({
  variant: "underline",
  size: "md",
});

export interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  /** `underline` for page-level navigation, `pills` for a compact segmented switch. */
  variant?: TabsVariant;
  size?: TabsSize;
}

/** Set `orientation="vertical"` for a side list; styles adapt automatically. */
export function Tabs({ className, variant = "underline", size = "md", ...props }: TabsProps) {
  const context = React.useMemo(() => ({ variant, size }), [variant, size]);
  return (
    <TabsContext.Provider value={context}>
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn("flex gap-4 data-[orientation=horizontal]:flex-col", className)}
        {...props}
      />
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.ComponentProps<typeof TabsPrimitive.List> {
  /** Stretch the tabs to share the full width equally. */
  fullWidth?: boolean;
}

export function TabsList({ className, fullWidth, ...props }: TabsListProps) {
  const { variant } = React.useContext(TabsContext);
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex shrink-0 items-center gap-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        variant === "underline"
          ? "border-b border-border data-[orientation=vertical]:border-r data-[orientation=vertical]:border-b-0"
          : "rounded-lg bg-sunken p-1",
        variant === "pills" && !fullWidth && "data-[orientation=horizontal]:w-fit",
        fullWidth && "w-full *:flex-1",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { variant, size } = React.useContext(TabsContext);
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap text-muted transition-colors outline-none select-none",
        "hover:text-fg focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        "data-[orientation=vertical]:justify-start [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm",
        variant === "underline"
          ? [
              "-mb-px rounded-t-md border-b-2 border-transparent",
              "data-[state=active]:border-brand data-[state=active]:text-brand-text",
              "data-[orientation=vertical]:-mr-px data-[orientation=vertical]:mb-0 data-[orientation=vertical]:rounded-t-none data-[orientation=vertical]:rounded-l-md data-[orientation=vertical]:border-r-2 data-[orientation=vertical]:border-b-0",
            ]
          : "rounded-md data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=active]:shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      {...props}
    />
  );
}
