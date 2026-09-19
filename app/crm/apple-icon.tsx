import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Иконка PWA «Cold CRM» на домашнем экране. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 86, display: "flex" }}>🗂</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#ef4444", display: "flex" }}>CRM</div>
      </div>
    ),
    size,
  );
}
