import { ImageResponse } from "next/og";

export const alt = "Blox UI: accessible React components you copy into your project and own";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The same preview for X (Twitter) cards. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {/* The mark, drawn with boxes: white square with two black tiles cut out. */}
          <div style={{ width: 132, height: 132, borderRadius: 32, background: "#fafafa", position: "relative", display: "flex" }}>
            <div style={{ position: "absolute", left: 28, top: 28, width: 40, height: 40, background: "#0a0a0a" }} />
            <div style={{ position: "absolute", left: 68, top: 68, width: 40, height: 40, background: "#0a0a0a" }} />
          </div>
          <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -4 }}>Blox UI</div>
        </div>
        <div style={{ marginTop: 48, fontSize: 40, color: "#a1a1aa", maxWidth: 940, lineHeight: 1.3 }}>
          Accessible React components you copy into your project and own.
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 16, fontSize: 28, color: "#d4d4d8" }}>
          <div style={{ display: "flex", padding: "10px 22px", border: "2px solid #3f3f46", borderRadius: 999 }}>86 components</div>
          <div style={{ display: "flex", padding: "10px 22px", border: "2px solid #3f3f46", borderRadius: 999 }}>Tailwind CSS v4</div>
          <div style={{ display: "flex", padding: "10px 22px", border: "2px solid #3f3f46", borderRadius: 999 }}>npx @bloxui/cli</div>
        </div>
      </div>
    ),
    size,
  );
}
