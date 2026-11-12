"use client";

import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { cn } from "../lib/cn";
import { GripVerticalIcon } from "../lib/icons";

type Orientation = "horizontal" | "vertical";

const OrientationContext = React.createContext<Orientation>("horizontal");

export interface ResizablePanelGroupProps
  extends Omit<React.ComponentProps<typeof PanelGroup>, "direction"> {
  /** `horizontal` places panels side by side, `vertical` stacks them. */
  orientation?: Orientation;
}

/** Panels the user can resize by dragging the handle between them, or with the arrow keys. */
export function ResizablePanelGroup({ className, orientation = "horizontal", ...props }: ResizablePanelGroupProps) {
  return (
    <OrientationContext.Provider value={orientation}>
      <PanelGroup
        data-slot="resizable-panel-group"
        direction={orientation}
        className={cn("flex size-full", orientation === "vertical" && "flex-col", className)}
        {...props}
      />
    </OrientationContext.Provider>
  );
}

/** Sizes (`defaultSize`, `minSize`, `maxSize`) are percentages of the group, from 0 to 100. */
export const ResizablePanel = Panel;

export interface ResizableHandleProps extends React.ComponentProps<typeof PanelResizeHandle> {
  /** Show a visible grip in the middle of the handle. */
  withHandle?: boolean;
}

export function ResizableHandle({ className, withHandle, ...props }: ResizableHandleProps) {
  const orientation = React.useContext(OrientationContext);
  return (
    <PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "relative flex shrink-0 items-center justify-center bg-border transition-colors outline-none",
        "focus-visible:bg-ring data-[resize-handle-state=drag]:bg-ring data-[resize-handle-state=hover]:bg-border-strong",
        // The pseudo-element widens the hit area without widening the line.
        "after:absolute after:content-['']",
        orientation === "horizontal" ? "w-px after:inset-y-0 after:-inset-x-1.5" : "h-px after:inset-x-0 after:-inset-y-1.5",
        className,
      )}
      {...props}
    >
      {withHandle ? (
        <div
          className={cn(
            "z-[1] flex items-center justify-center rounded-sm border border-border bg-surface text-muted",
            orientation === "horizontal" ? "h-6 w-3" : "h-3 w-6 [&_svg]:rotate-90",
          )}
        >
          <GripVerticalIcon className="size-2.5" />
        </div>
      ) : null}
    </PanelResizeHandle>
  );
}
