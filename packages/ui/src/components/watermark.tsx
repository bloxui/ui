import * as React from "react";
import { cn } from "../lib/cn";

export interface WatermarkProps extends React.ComponentProps<"div"> {
  /** One or more lines of text repeated across the content. */
  text: string | string[];
  /** Degrees; negative tilts up to the right. */
  rotate?: number;
  /** Space between repeats, in pixels. */
  gap?: [number, number];
  fontSize?: number;
  /** 0–1. */
  opacity?: number;
  /** Any CSS colour; defaults to the text colour. */
  color?: string;
}

/**
 * Repeats text over its content, e.g. "Confidential" or the viewer's email on a document.
 * It is a visual deterrent only: anyone can remove it in the browser's developer tools.
 */
export function Watermark({
  text,
  rotate = -22,
  gap = [100, 80],
  fontSize = 14,
  opacity = 0.12,
  color = "currentColor",
  className,
  children,
  ...props
}: WatermarkProps) {
  const lines = Array.isArray(text) ? text : [text];
  const lineHeight = fontSize * 1.4;
  const longest = Math.max(...lines.map((line) => line.length));
  const width = Math.ceil(longest * fontSize * 0.62) + gap[0];
  const height = Math.ceil(lines.length * lineHeight) + gap[1];

  const escape = (value: string) => value.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
  // A mask lets the watermark take its colour from CSS (currentColor or a token), which an <img> could not.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><g transform="rotate(${rotate} ${width / 2} ${height / 2})" font-family="system-ui, sans-serif" font-size="${fontSize}" text-anchor="middle" fill="#000">${lines
    .map((line, index) => `<text x="${width / 2}" y="${height / 2 + (index - (lines.length - 1) / 2) * lineHeight}">${escape(line)}</text>`)
    .join("")}</g></svg>`;
  const mask = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

  return (
    <div data-slot="watermark" className={cn("relative", className)} {...props}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 select-none"
        style={{
          backgroundColor: color,
          opacity,
          maskImage: mask,
          WebkitMaskImage: mask,
          maskSize: `${width}px ${height}px`,
          WebkitMaskSize: `${width}px ${height}px`,
          maskRepeat: "repeat",
          WebkitMaskRepeat: "repeat",
        }}
      />
    </div>
  );
}
