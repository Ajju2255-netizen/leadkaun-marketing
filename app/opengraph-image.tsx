import { ImageResponse } from "next/og"

export const alt = "Leadkaun — India's Sales Behaviour OS"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const PRIMARY = "#3AA7FF"
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
          <svg width="76" height="76" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="lkBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7ED3FF" />
                <stop offset="100%" stopColor="#3AA7FF" />
              </linearGradient>
              <linearGradient id="lkOrange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD7B5" />
                <stop offset="100%" stopColor="#FF9A4D" />
              </linearGradient>
            </defs>
            <path d="M36 18 L46 18 L28 86 L16 86 Z" fill="url(#lkBlue)" />
            <path d="M54 18 L64 18 L84 86 L72 86 Z" fill="url(#lkOrange)" />
            <circle cx="50" cy="66" r="6.5" fill="#3AA7FF" />
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
