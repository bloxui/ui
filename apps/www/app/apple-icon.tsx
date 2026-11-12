import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iOS and Android: the mark in white on black, edge to edge. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0a0a", position: "relative" }}>
        <div style={{ position: "absolute", left: 38, top: 38, width: 52, height: 52, background: "#fafafa" }} />
        <div style={{ position: "absolute", left: 90, top: 90, width: 52, height: 52, background: "#fafafa" }} />
      </div>
    ),
    size,
  );
}
