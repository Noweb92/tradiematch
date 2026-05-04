import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TradieMatch — The smartest way to find the right tradie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #FF6B35 0%, transparent 50%), linear-gradient(180deg, #0A2540 0%, #061728 100%)",
          color: "white",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background:
                "linear-gradient(135deg, #FF8E5C 0%, #E5471A 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
            }}
          >
            ★
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.02em" }}>
            TradieMatch
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Swipe. Match.</span>
            <span style={{ color: "#FF8E5C" }}>Build.</span>
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 26,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          >
            Australia&apos;s smartest way to connect with verified tradies.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "rgba(255,255,255,0.55)",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            <span>1,247 verified tradies</span>
            <span>·</span>
            <span>8,932 customers</span>
            <span>·</span>
            <span>$487K GMV / mo</span>
          </div>
          <div style={{ color: "#FF8E5C" }}>Series A · 2026</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
