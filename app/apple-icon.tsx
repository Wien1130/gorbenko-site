import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — same mark, larger. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#00d4aa",
          borderRadius: 40,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#0a0a0a",
            fontSize: 118,
            fontWeight: 800,
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            letterSpacing: "-0.06em",
            lineHeight: 1,
            marginTop: -6,
          }}
        >
          G
        </div>
        <div
          style={{
            position: "absolute",
            right: 34,
            bottom: 34,
            width: 28,
            height: 28,
            borderRadius: 999,
            background: "#0a0a0a",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
