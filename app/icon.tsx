import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Tab favicon — solid teal tile + bold G (stands out among blue/gray icons). */
export default function Icon() {
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
          borderRadius: 8,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0a0a0a",
            fontSize: 20,
            fontWeight: 800,
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            letterSpacing: "-0.06em",
            lineHeight: 1,
            marginTop: -1,
          }}
        >
          G
        </div>
        <div
          style={{
            position: "absolute",
            right: 5,
            bottom: 5,
            width: 5,
            height: 5,
            borderRadius: 999,
            background: "#0a0a0a",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
