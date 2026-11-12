"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { ImageOffIcon, RotateIcon, XIcon, ZoomInIcon, ZoomOutIcon } from "../lib/icons";
import { Button } from "./button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "./dialog";
import { Skeleton } from "./skeleton";

export interface ImageProps extends Omit<React.ComponentProps<"img">, "alt"> {
  /** Required: describe the image, or pass "" when it is purely decorative. */
  alt: string;
  /** Click to open a full-screen preview with zoom and rotate. */
  preview?: boolean;
  /** Shown if the image fails to load. */
  fallback?: React.ReactNode;
  /** Class for the wrapper; `className` targets the <img>. */
  wrapperClassName?: string;
}

const ZOOM_STEPS = [0.5, 0.75, 1, 1.5, 2, 3];

/** An image with a loading placeholder, an error fallback and an optional zoomable preview. */
export function Image({ alt, preview = false, fallback, wrapperClassName, className, onLoad, onError, ...props }: ImageProps) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">("loading");
  const [open, setOpen] = React.useState(false);
  const [zoom, setZoom] = React.useState(2);
  const [rotation, setRotation] = React.useState(0);
  const ref = React.useRef<HTMLImageElement>(null);

  // An image already in the cache can finish before React attaches onLoad.
  React.useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setStatus("loaded");
  }, []);

  const image = (
    <img
      ref={ref}
      alt={alt}
      onLoad={(event) => {
        setStatus("loaded");
        onLoad?.(event);
      }}
      onError={(event) => {
        setStatus("error");
        onError?.(event);
      }}
      className={cn("block size-full object-cover transition-opacity duration-300", status === "loaded" ? "opacity-100" : "opacity-0", className)}
      {...props}
    />
  );

  return (
    <div data-slot="image" className={cn("relative overflow-hidden rounded-lg bg-sunken", wrapperClassName)}>
      {status === "loading" ? <Skeleton className="absolute inset-0 rounded-none" /> : null}
      {status === "error" ? (
        <div role="img" aria-label={alt || "Image failed to load"} className="flex size-full min-h-24 items-center justify-center text-muted">
          {fallback ?? <ImageOffIcon className="size-6" />}
        </div>
      ) : preview ? (
        <button
          type="button"
          onClick={() => {
            setZoom(2);
            setRotation(0);
            setOpen(true);
          }}
          aria-label={alt ? `Preview: ${alt}` : "Preview image"}
          className="block size-full cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        >
          {image}
        </button>
      ) : (
        image
      )}

      {preview ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent size="full" showClose={false} className="border-none bg-black/90 p-0 text-white shadow-none">
            <DialogTitle className="sr-only">{alt || "Image preview"}</DialogTitle>
            <DialogDescription className="sr-only">Use the toolbar to zoom and rotate. Press Escape to close.</DialogDescription>
            <div
              className="flex min-h-0 flex-1 items-center justify-center overflow-auto"
              onWheel={(event) => {
                setZoom((current) => Math.min(ZOOM_STEPS.length - 1, Math.max(0, current + (event.deltaY < 0 ? 1 : -1))));
              }}
            >
              <img
                src={props.src}
                srcSet={props.srcSet}
                alt={alt}
                className="max-h-full max-w-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${ZOOM_STEPS[zoom]}) rotate(${rotation}deg)` }}
              />
            </div>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/10 p-1 backdrop-blur-sm">
              {[
                { label: "Zoom out", icon: <ZoomOutIcon />, onClick: () => setZoom((z) => Math.max(0, z - 1)), disabled: zoom === 0 },
                { label: "Zoom in", icon: <ZoomInIcon />, onClick: () => setZoom((z) => Math.min(ZOOM_STEPS.length - 1, z + 1)), disabled: zoom === ZOOM_STEPS.length - 1 },
                { label: "Rotate", icon: <RotateIcon />, onClick: () => setRotation((r) => r + 90), disabled: false },
              ].map((tool) => (
                <Button
                  key={tool.label}
                  variant="ghost"
                  tone="neutral"
                  size="sm"
                  iconOnly
                  aria-label={tool.label}
                  disabled={tool.disabled}
                  onClick={tool.onClick}
                  className="rounded-full text-white hover:bg-white/15"
                >
                  {tool.icon}
                </Button>
              ))}
              <span className="px-2 text-xs tabular-nums" aria-live="polite">
                {Math.round(ZOOM_STEPS[zoom]! * 100)}%
              </span>
              <DialogClose asChild>
                <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Close preview" className="rounded-full text-white hover:bg-white/15">
                  <XIcon />
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
