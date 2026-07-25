"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { X, ArrowRight, Check } from "lucide-react"
import { APP_URLS } from "@/lib/urls"

/**
 * Site-wide conversion popup (mounted once in the root layout).
 *
 * Strategy — the point is to convert without nagging, so it is heavily gated:
 *
 *   TRIGGERS (whichever fires first, and only after MIN_ENGAGE_MS on the page):
 *     • exit-intent  — desktop only: cursor leaves the viewport toward the top
 *     • scroll depth — reader passes SCROLL_TRIGGER of the page (engaged)
 *     • dwell time   — TIME_TRIGGER_MS elapsed (fallback so mobile still sees it)
 *
 *   FREQUENCY CAP (persistent, localStorage):
 *     • once per browser session (sessionStorage)
 *     • not again for SNOOZE_DAYS after a dismiss
 *     • not again for CONVERTED_DAYS after the visitor clicks a CTA
 *
 *   SUPPRESSED entirely on pages where the visitor is already converting
 *   (pricing, demo, contact, register) — a popup there only gets in the way.
 *
 * All copy is real, verifiable product messaging — no fabricated stats or
 * testimonials. The illustration is a decorative flat character, not a customer.
 */

// ── Tunables ──────────────────────────────────────────────────────────────────
const MIN_ENGAGE_MS   = 6_000      // never fire in the first 6s (feels spammy)
const TIME_TRIGGER_MS = 32_000     // dwell fallback
const SCROLL_TRIGGER  = 0.55       // 55% of the page scrolled
const SNOOZE_DAYS     = 7          // after a dismiss
const CONVERTED_DAYS  = 90         // after a CTA click

const K_LAST      = "lk_popup_last"       // last shown/dismissed (ms)
const K_CONVERTED = "lk_popup_converted"  // CTA-clicked timestamp (ms)
const K_SESSION   = "lk_popup_session"    // shown this session

const EXCLUDED = ["/pricing", "/demo", "/contact", "/register", "/checkout"]
const DAY = 86_400_000

function track(event: string, extra: Record<string, unknown> = {}) {
  try {
    const w = window as unknown as { gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] }
    w.gtag?.("event", event, extra)
    w.dataLayer?.push({ event, ...extra })
  } catch {
    /* analytics optional — never block the UI */
  }
}

export function ConversionPopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)   // drives the entrance animation
  const firedRef = useRef(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const excluded = EXCLUDED.some((p) => pathname === p || pathname.startsWith(p + "/"))

  const eligible = useCallback((): boolean => {
    if (excluded) return false
    try {
      if (sessionStorage.getItem(K_SESSION) === "1") return false
      const conv = Number(localStorage.getItem(K_CONVERTED) || 0)
      if (conv && Date.now() - conv < CONVERTED_DAYS * DAY) return false
      const last = Number(localStorage.getItem(K_LAST) || 0)
      if (last && Date.now() - last < SNOOZE_DAYS * DAY) return false
    } catch {
      return false   // storage blocked (private mode) → don't risk nagging
    }
    return true
  }, [excluded])

  const fire = useCallback((force = false) => {
    if (firedRef.current) return
    if (!force && !eligible()) return
    firedRef.current = true
    if (!force) {
      // Forced previews don't count against the frequency cap, so you can
      // re-test freely.
      try {
        sessionStorage.setItem(K_SESSION, "1")
        localStorage.setItem(K_LAST, String(Date.now()))
      } catch { /* ignore */ }
    }
    setOpen(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)))
    track("popup_shown", { path: pathname, forced: force })
  }, [eligible, pathname])

  // Force-show for testing/demos: add ?lkpopup=1 to any URL (ignores the cap,
  // the delays, and the excluded-page list).
  useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).has("lkpopup")) fire(true)
    } catch { /* ignore */ }
  }, [fire])

  // Arm the triggers once the visitor is eligible.
  useEffect(() => {
    if (!eligible()) return
    let armed = false
    const engageTimer = setTimeout(() => { armed = true }, MIN_ENGAGE_MS)
    const timeTimer   = setTimeout(() => fire(), TIME_TRIGGER_MS)

    const onScroll = () => {
      if (!armed) return
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      if (max > 0 && doc.scrollTop / max >= SCROLL_TRIGGER) fire()
    }
    const onExit = (e: MouseEvent) => {
      if (armed && e.clientY <= 0) fire()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("mouseout", onExit)
    return () => {
      clearTimeout(engageTimer); clearTimeout(timeTimer)
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("mouseout", onExit)
    }
  }, [eligible, fire])

  const close = useCallback((reason: "dismiss" | "cta") => {
    setMounted(false)
    if (reason === "dismiss") track("popup_dismissed", { path: pathname })
    setTimeout(() => setOpen(false), 260)   // let the exit animation finish
  }, [pathname])

  const onCta = useCallback((cta: string) => {
    try { localStorage.setItem(K_CONVERTED, String(Date.now())) } catch { /* ignore */ }
    track("popup_cta_click", { cta, path: pathname })
  }, [pathname])

  // ESC to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close("dismiss") }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    panelRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, close])

  if (!open) return null

  const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"   // smooth, spring-like ease-out

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lk-popup-title"
    >
      <style>{`
        @keyframes lkFloatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes lkFloatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
        @keyframes lkBlob  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(6px,-8px) scale(1.06)} }
        .lk-float-a{animation:lkFloatA 4.5s ease-in-out infinite}
        .lk-float-b{animation:lkFloatB 5.2s ease-in-out infinite}
        .lk-blob{animation:lkBlob 9s ease-in-out infinite}
        @media (prefers-reduced-motion: reduce){
          .lk-float-a,.lk-float-b,.lk-blob{animation:none!important}
        }
      `}</style>

      {/* backdrop */}
      <div
        onClick={() => close("dismiss")}
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[3px]"
        style={{ opacity: mounted ? 1 : 0, transition: `opacity 320ms ${EASE}` }}
        aria-hidden="true"
      />

      {/* panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-[680px] overflow-hidden rounded-[28px] bg-bg-pure outline-none"
        style={{
          boxShadow: "0 30px 80px rgba(2,132,199,0.30), 0 4px 16px rgba(15,23,42,0.12)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0) scale(1)" : "translateY(32px) scale(0.94)",
          transition: `opacity 360ms ${EASE}, transform 420ms ${EASE}`,
          willChange: "opacity, transform",
        }}
      >
        <button
          onClick={() => close("dismiss")}
          aria-label="Close"
          className="absolute right-3.5 top-3.5 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/70 text-ink-soft backdrop-blur transition-colors hover:bg-white hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col sm:flex-row">
          {/* ── Left: gradient hero + illustration ─────────────────────────── */}
          <div
            className="relative h-[190px] w-full shrink-0 overflow-hidden sm:h-auto sm:w-[45%]"
            style={{ background: "linear-gradient(158deg, #38BDF8 0%, #60C6F5 34%, #7FE3D0 72%, #A7F3D0 100%)" }}
          >
            {/* soft decorative blobs */}
            <div className="lk-blob absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/25 blur-2xl" />
            <div className="lk-blob absolute -bottom-16 -right-8 h-44 w-44 rounded-full bg-sky-300/40 blur-2xl" style={{ animationDelay: "1.2s" }} />

            {/* floating product chips */}
            <div className="lk-float-a absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 shadow-md backdrop-blur">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">A</span>
              <span className="text-[11px] font-semibold text-ink">Grade A lead</span>
            </div>
            <div className="lk-float-b absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 shadow-md backdrop-blur" style={{ animationDelay: "0.6s" }}>
              <span className="text-[11px] font-semibold text-ink">₹ at risk</span>
              <span className="text-[11px]">⚡</span>
            </div>

            {/* saleswoman — decorative flat illustration */}
            <Saleswoman />
          </div>

          {/* ── Right: copy + CTAs ─────────────────────────────────────────── */}
          <div className="flex flex-1 flex-col justify-center px-6 py-6 sm:px-8 sm:py-8">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">Leadkaun</span>
            </div>

            <h2 id="lk-popup-title" className="mt-3.5 text-[26px] font-bold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[28px]">
              Close more.<br />Chase less.
            </h2>
            <p className="mt-2.5 text-[13.5px] leading-[1.55] text-ink-soft">
              Leadkaun grades every lead A–F, builds each rep&apos;s Priority Queue, and flags the ₹ you&apos;re
              about to lose — live in about 60 minutes.
            </p>

            <ul className="mt-4 space-y-2">
              {["A–F lead grading, automatically", "A Priority Queue reps actually follow", "Missed ₹ surfaced before it's gone"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-[12.5px] leading-tight text-ink-soft">
                  <span className="mt-[1px] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-100">
                    <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2.5">
              <a
                href={APP_URLS.register}
                onClick={() => onCta("register")}
                className="group flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-sky-500 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-sky-400 active:scale-[0.99]"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 10px 24px rgba(14,165,233,0.34)" }}
              >
                Start free — no card
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a
                href="/pricing"
                onClick={() => onCta("pricing")}
                className="flex h-10 w-full items-center justify-center rounded-xl text-[13px] font-semibold text-ink-soft transition-colors hover:text-ink"
              >
                See plans from ₹2,999/mo →
              </a>
            </div>

            <p className="mt-3 text-center text-[11px] text-ink-muted sm:text-left">
              Free tier · No credit card · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Decorative flat-illustration saleswoman with a headset. Not a real person. */
function Saleswoman() {
  return (
    <svg
      viewBox="0 0 200 220"
      className="absolute bottom-0 left-1/2 h-[170px] w-auto -translate-x-1/2 sm:h-[86%]"
      role="img"
      aria-label="Illustration of a sales representative"
      preserveAspectRatio="xMidYMax meet"
    >
      {/* hair back */}
      <path d="M54,220 C36,150 52,74 100,74 C148,74 164,150 146,220 Z" fill="#4A3B34" />
      {/* blouse / shoulders */}
      <path d="M44,220 C44,174 70,156 100,156 C130,156 156,174 156,220 Z" fill="#FB7185" />
      {/* collar */}
      <path d="M100,156 L86,178 L100,187 L114,178 Z" fill="#FFFFFF" opacity="0.92" />
      {/* neck */}
      <rect x="88" y="136" width="24" height="30" rx="11" fill="#EBB48C" />
      {/* ears */}
      <circle cx="60" cy="108" r="8" fill="#F0C4A0" />
      <circle cx="140" cy="108" r="8" fill="#F0C4A0" />
      <circle cx="60" cy="118" r="3" fill="#FBBF24" />
      <circle cx="140" cy="118" r="3" fill="#FBBF24" />
      {/* head */}
      <ellipse cx="100" cy="104" rx="42" ry="47" fill="#F0C4A0" />
      {/* hair top / fringe */}
      <path d="M56,106 C54,64 76,46 100,46 C124,46 146,64 144,106 C132,84 120,76 100,76 C80,76 68,84 56,106 Z" fill="#4A3B34" />
      {/* brows */}
      <path d="M79,95 Q86,91 93,95" stroke="#4A3B34" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M107,95 Q114,91 121,95" stroke="#4A3B34" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="86" cy="104" r="3.6" fill="#2A2A2A" />
      <circle cx="114" cy="104" r="3.6" fill="#2A2A2A" />
      <circle cx="87.2" cy="102.8" r="1.1" fill="#FFFFFF" />
      <circle cx="115.2" cy="102.8" r="1.1" fill="#FFFFFF" />
      {/* blush */}
      <ellipse cx="80" cy="116" rx="6" ry="4" fill="#F9A8A8" opacity="0.55" />
      <ellipse cx="120" cy="116" rx="6" ry="4" fill="#F9A8A8" opacity="0.55" />
      {/* smile */}
      <path d="M89,122 Q100,132 111,122" stroke="#B4472E" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* headset band */}
      <path d="M62,94 Q100,46 138,94" stroke="#334155" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* left earpad + mic boom */}
      <rect x="52" y="100" width="12" height="16" rx="5" fill="#334155" />
      <path d="M58,116 Q48,138 74,140" stroke="#334155" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="74" cy="140" r="3.4" fill="#334155" />
    </svg>
  )
}
