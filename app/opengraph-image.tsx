import { ImageResponse } from "next/og"

export const alt = "Leadkaun — India's Sales Behaviour OS"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const PRIMARY = "#0066FF"
const FOREGROUND = "#0A0A0A"
const FOREGROUND_SOFT = "#525866"
const FOREGROUND_MUTED = "#868C98"
const BORDER = "#EAECF0"
const BG = "#FFFFFF"
const BG_SOFT = "#F7F8FA"

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Soft dot-grid backdrop (top right) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 520,
            height: 520,
            background: `radial-gradient(circle at 1px 1px, #D0D5DD 1px, transparent 0) 0 0 / 24px 24px`,
            opacity: 0.5,
            display: "flex",
          }}
        />
        {/* Radial fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 90% 70% at 50% 40%, transparent 0%, ${BG} 80%)`,
            display: "flex",
          }}
        />

        {/* Header — mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, zIndex: 1 }}>
          <svg width="72" height="72" viewBox="0 0 40 40">
            <rect x="0" y="0" width="40" height="40" rx="6" ry="6" fill={PRIMARY} />
            <path
              d="M12 31 L20 9 L28 31 M15.3 24 L24.7 24"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              color: FOREGROUND,
            }}
          >
            Leadkaun
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28, zIndex: 1, maxWidth: 980 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              alignSelf: "flex-start",
              background: "#F2F7FF",
              border: `1px solid ${BORDER}`,
              borderRadius: 999,
              padding: "8px 14px",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: PRIMARY,
                display: "flex",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: PRIMARY,
                fontFamily: "monospace",
              }}
            >
              India&apos;s Sales Behaviour OS
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 80,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.04,
              color: FOREGROUND,
            }}
          >
            The sales software that tells your team what to do next.
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.45,
              color: FOREGROUND_SOFT,
              maxWidth: 900,
            }}
          >
            Grade every lead A–F. Build each rep&apos;s Priority Queue. Surface missed ₹ before it&apos;s gone.
          </div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 24,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontFamily: "monospace",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: FOREGROUND_MUTED,
            }}
          >
            leadkaun.com
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              fontSize: 18,
              fontFamily: "monospace",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: FOREGROUND_MUTED,
            }}
          >
            <span>50+ teams</span>
            <span style={{ color: BG_SOFT }}>·</span>
            <span>60-min setup</span>
            <span style={{ color: BG_SOFT }}>·</span>
            <span>No credit card</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
