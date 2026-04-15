import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "IMPerfect Esports — Puerto Rico's Premier Hero Shooter Team";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          background: "#0D0D0D",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "#C8E400",
              letterSpacing: "0.05em",
            }}
          >
            IMPERFECT
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Puerto Rico&apos;s Premier Hero Shooter Team
          </div>
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "16px",
              fontSize: "18px",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            <span>Overwatch 2</span>
            <span style={{ color: "#C8E400" }}>|</span>
            <span>Marvel Rivals</span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "#C8E400",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
