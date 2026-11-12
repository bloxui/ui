import * as React from "react";
import { encode } from "uqr";
import { cn } from "../lib/cn";

export interface QRCodeProps extends Omit<React.ComponentProps<"svg">, "children"> {
  /** The text or URL to encode. */
  value: string;
  /** Width and height in pixels. */
  size?: number;
  /** How much damage the code survives: L 7%, M 15%, Q 25%, H 30%. Use H with an icon. */
  level?: "L" | "M" | "Q" | "H";
  /** Quiet zone around the code, in modules. Scanners need at least 2. */
  margin?: number;
  /** Module colour; defaults to the text colour. Keep strong contrast with the background. */
  color?: string;
  background?: string;
  /** A small logo drawn in the middle. Raise `level` to "H" so the code still scans. */
  icon?: React.ReactNode;
  /** Accessible name; defaults to "QR code" plus the value. */
  label?: string;
}

/** Turns a value into a QR code drawn as one SVG path, so it stays sharp at any size and prints well. */
export function QRCode({
  value,
  size = 160,
  level = "M",
  margin = 2,
  color = "currentColor",
  background = "transparent",
  icon,
  label,
  className,
  ...props
}: QRCodeProps) {
  const { data, size: modules } = React.useMemo(() => encode(value, { ecc: level, border: 0 }), [value, level]);
  const total = modules + margin * 2;

  // One path of 1×1 squares is far lighter than an element per module.
  const path = React.useMemo(() => {
    let d = "";
    data.forEach((row, y) => {
      row.forEach((on, x) => {
        if (on) d += `M${x + margin} ${y + margin}h1v1h-1z`;
      });
    });
    return d;
  }, [data, margin]);

  const iconSize = total * 0.22;

  return (
    <svg
      data-slot="qr-code"
      role="img"
      aria-label={label ?? `QR code: ${value}`}
      width={size}
      height={size}
      viewBox={`0 0 ${total} ${total}`}
      shapeRendering="crispEdges"
      className={cn("shrink-0", className)}
      {...props}
    >
      <rect width={total} height={total} fill={background} />
      <path d={path} fill={color} />
      {icon ? (
        <foreignObject x={(total - iconSize) / 2} y={(total - iconSize) / 2} width={iconSize} height={iconSize}>
          <div className="flex size-full items-center justify-center rounded-[20%] bg-white p-[8%] [&>*]:size-full">{icon}</div>
        </foreignObject>
      ) : null}
    </svg>
  );
}
