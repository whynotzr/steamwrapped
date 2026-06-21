import { ImageResponse } from "next/og";

export const alt = "Steam Wrapped";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          gap: 28,
          background: "linear-gradient(135deg, #0a0a0a 0%, #1b2838 40%, #2a475e 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 88 }}>🎮</div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            justifyContent: "center",
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: "-0.02em",
          }}
        >
          <span>Steam </span>
          <span style={{ color: "#22d3ee" }}>Wrapped</span>
        </div>
        <div
          style={{
            fontSize: 30,
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Temps de jeu · Top jeux · Achievements rares · Roast · Flex card
        </div>
        <div
          style={{
            marginTop: 16,
            padding: "14px 32px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            fontSize: 22,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Colle un pseudo Steam et c&apos;est parti
        </div>
      </div>
    ),
    { ...size }
  );
}
