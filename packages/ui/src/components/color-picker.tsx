"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { useFieldControl } from "../lib/field-context";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface Hsv {
  h: number;
  s: number;
  v: number;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/** "#4f46e5" or "#45e" → { r, g, b } in 0–255, or null for anything else. */
export function parseHex(hex: string) {
  const match = hex.trim().replace(/^#/, "").match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;
  const full = match[1]!.length === 3 ? [...match[1]!].map((c) => c + c).join("") : match[1]!;
  return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) };
}

export function toHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b].map((channel) => Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, "0")).join("")}`;
}

export function hexToHsv(hex: string): Hsv | null {
  const rgb = parseHex(hex);
  if (!rgb) return null;
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  let h = 0;
  if (delta) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: max ? delta / max : 0, v: max };
}

export function hsvToHex({ h, s, v }: Hsv) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return toHex({ r: f(5) * 255, g: f(3) * 255, b: f(1) * 255 });
}

const defaultSwatches = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#0f172a"];

export interface ColorPickerProps {
  /** A hex colour such as "#4f46e5". */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Quick picks shown under the editor. Pass [] to hide them. */
  swatches?: string[];
  disabled?: boolean;
  invalid?: boolean;
  /** Submits the hex value under this name. */
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/** Picks a colour with a saturation/brightness area, a hue slider, a hex field and swatches. All work from the keyboard. */
export function ColorPicker({
  value: valueProp,
  defaultValue = "#6366f1",
  onValueChange,
  swatches = defaultSwatches,
  disabled,
  invalid,
  name,
  id,
  className,
  "aria-label": ariaLabel = "Colour",
  "aria-describedby": describedBy,
}: ColorPickerProps) {
  const control = useFieldControl({ id, invalid, "aria-describedby": describedBy });
  const [internal, setInternal] = React.useState(defaultValue);
  const value = (valueProp ?? internal).toLowerCase();
  // Kept separately so hue survives at zero saturation (where it cannot be read back from the hex).
  const [hsv, setHsv] = React.useState<Hsv>(() => hexToHsv(value) ?? { h: 0, s: 0, v: 0 });
  const [draft, setDraft] = React.useState(value);

  React.useEffect(() => {
    if (hsvToHex(hsv) !== value) {
      const next = hexToHsv(value);
      if (next) setHsv((current) => ({ ...next, h: next.s === 0 ? current.h : next.h }));
    }
    setDraft(value);
    // Only react to outside changes of the value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function commit(next: Hsv) {
    setHsv(next);
    const hex = hsvToHex(next);
    if (valueProp === undefined) setInternal(hex);
    onValueChange?.(hex);
  }

  function commitHex(hex: string) {
    const next = hexToHsv(hex);
    if (!next) return false;
    commit({ ...next, h: next.s === 0 ? hsv.h : next.h });
    return true;
  }

  function dragArea(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    commit({
      h: hsv.h,
      s: clamp((event.clientX - rect.left) / rect.width),
      v: clamp(1 - (event.clientY - rect.top) / rect.height),
    });
  }

  function dragHue(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    commit({ ...hsv, h: clamp((event.clientX - rect.left) / rect.width) * 359 });
  }

  const pointer = (handler: (event: React.PointerEvent<HTMLDivElement>) => void) => ({
    onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      handler(event);
    },
    onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) handler(event);
    },
  });

  const percent = (n: number) => `${Math.round(n * 100)}%`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={control.id}
          disabled={disabled}
          aria-label={`${ariaLabel}: ${value}`}
          aria-describedby={control["aria-describedby"]}
          aria-invalid={control.invalid || undefined}
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-lg border border-border-strong bg-surface px-2 text-sm shadow-xs outline-none",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger",
            className,
          )}
        >
          <span aria-hidden className="size-5 shrink-0 rounded-md border border-fg/10" style={{ backgroundColor: value }} />
          <span className="font-mono text-xs uppercase">{value}</span>
        </button>
      </PopoverTrigger>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <PopoverContent align="start" className="grid w-64 gap-3 p-3">
        <div
          data-slot="color-area"
          role="slider"
          tabIndex={0}
          aria-label="Saturation and brightness"
          aria-valuetext={`Saturation ${percent(hsv.s)}, brightness ${percent(hsv.v)}`}
          aria-valuenow={Math.round(hsv.s * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          {...pointer(dragArea)}
          onKeyDown={(event) => {
            const step = event.shiftKey ? 0.1 : 0.01;
            const moves: Record<string, Partial<Hsv>> = {
              ArrowLeft: { s: clamp(hsv.s - step) },
              ArrowRight: { s: clamp(hsv.s + step) },
              ArrowUp: { v: clamp(hsv.v + step) },
              ArrowDown: { v: clamp(hsv.v - step) },
            };
            const move = moves[event.key];
            if (!move) return;
            event.preventDefault();
            commit({ ...hsv, ...move });
          }}
          className="relative h-36 touch-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          style={{
            backgroundColor: `hsl(${hsv.h} 100% 50%)`,
            backgroundImage: "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3)]"
            style={{ left: percent(hsv.s), top: percent(1 - hsv.v), backgroundColor: value }}
          />
        </div>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Hue"
          aria-valuenow={Math.round(hsv.h)}
          aria-valuemin={0}
          aria-valuemax={359}
          {...pointer(dragHue)}
          onKeyDown={(event) => {
            const step = event.shiftKey ? 10 : 1;
            const delta = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step }[event.key];
            if (delta === undefined) return;
            event.preventDefault();
            commit({ ...hsv, h: clamp(hsv.h + delta, 0, 359) });
          }}
          className="relative h-3 touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          style={{ background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)" }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3)]"
            style={{ left: `${(hsv.h / 359) * 100}%`, backgroundColor: `hsl(${hsv.h} 100% 50%)` }}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">Hex</span>
          <input
            value={draft}
            spellCheck={false}
            onChange={(event) => {
              setDraft(event.target.value);
              if (/^#?([0-9a-f]{6})$/i.test(event.target.value.trim())) commitHex(event.target.value);
            }}
            onBlur={() => {
              if (!commitHex(draft)) setDraft(value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !commitHex(draft)) setDraft(value);
            }}
            className="h-8 min-w-0 flex-1 rounded-md border border-border-strong bg-surface px-2 font-mono text-xs uppercase outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25"
          />
        </label>
        {swatches.length > 0 ? (
          <div role="group" aria-label="Swatches" className="flex flex-wrap gap-1.5">
            {swatches.map((swatch) => (
              <button
                key={swatch}
                type="button"
                aria-label={swatch}
                aria-pressed={swatch.toLowerCase() === value}
                onClick={() => commitHex(swatch)}
                className="size-6 rounded-md border border-fg/10 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-surface aria-pressed:ring-2 aria-pressed:ring-fg aria-pressed:ring-offset-1 aria-pressed:ring-offset-surface"
                style={{ backgroundColor: swatch }}
              />
            ))}
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
