import { ImageResponse } from "next/og";

export const alt = "Gorbenko — KI-Automatisierung & Marketing, Wien";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #050508 0%, #0a1512 100%)",
          color: "#f0f0f0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#00d4aa",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 28, color: "#9ca3af", display: "flex" }}>
            gorbenko.at
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Ihr Business,</span>
            <span style={{ display: "flex" }}>
              digital auf&nbsp;
              <span style={{ color: "#00d4aa" }}>Autopilot</span>.
            </span>
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#9ca3af", display: "flex" }}>
            KI-Chatbots · Websites · Content · Werbung — Wien
          </div>
        </div>

        <div style={{ fontSize: 26, color: "#00d4aa", display: "flex" }}>
          Kostenlose Beratung — online oder bei Ihnen im Betrieb
        </div>
      </div>
    ),
    { ...size }
  );
}
