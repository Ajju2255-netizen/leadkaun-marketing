"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { X, ArrowRight, CheckCircle2 } from "lucide-react"
import { APP_URLS } from "@/lib/urls"
import { LeadkaunMark } from "@/app/components/leadkaun-mark"

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
        className="relative w-full max-w-[760px] overflow-hidden rounded-[26px] bg-bg-pure outline-none"
        style={{
          boxShadow: "0 30px 80px rgba(15,23,42,0.32), 0 4px 16px rgba(15,23,42,0.12)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0) scale(1)" : "translateY(32px) scale(0.94)",
          transition: `opacity 360ms ${EASE}, transform 420ms ${EASE}`,
          willChange: "opacity, transform",
        }}
      >
        <div className="flex flex-col sm:flex-row">
          {/* ── Left: model photo (Grade-A / ₹-at-risk chips baked in) ──────── */}
          <div className="relative h-[210px] w-full shrink-0 overflow-hidden bg-slate-100 sm:h-auto sm:w-[41%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/popup-hero.jpg"
              alt="A Leadkaun sales rep at her desk"
              draggable={false}
              className="absolute inset-0 h-full w-full select-none object-cover object-[center_22%] sm:object-center"
            />
          </div>

          {/* ── Right: logo + copy + CTAs ──────────────────────────────────── */}
          <div className="relative flex flex-1 flex-col justify-center px-7 py-7 sm:px-9 sm:py-8">
            <button
              onClick={() => close("dismiss")}
              aria-label="Close"
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-ink-muted transition-colors hover:bg-black/5 hover:text-ink"
            >
              <X className="h-[18px] w-[18px]" />
            </button>

            {/* our logo */}
            <div className="flex items-center gap-2.5">
              <LeadkaunMark size={30} gloss />
              <span className="text-[19px] font-bold tracking-[-0.03em] text-ink">Leadkaun</span>
            </div>

            <h2 id="lk-popup-title" className="mt-5 text-[32px] font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[34px]">
              Close more.<br />Chase less.
            </h2>

            <p className="mt-3.5 max-w-[44ch] text-[14px] leading-[1.55] text-ink-soft">
              Leadkaun grades every lead <span className="font-medium text-blue-600">A–F</span>, builds each
              rep&apos;s Priority Queue, and flags the <span className="font-medium text-blue-600">₹</span> you&apos;re
              about to lose — live in about 60 minutes.
            </p>

            <ul className="mt-5 space-y-2.5">
              {["A–F lead grading, automatically", "A Priority Queue reps actually follow", "Missed ₹ surfaced before it's gone"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[13.5px] text-ink-soft">
                  <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-blue-500" strokeWidth={2} />
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-3">
              <a
                href={APP_URLS.register}
                onClick={() => onCta("register")}
                className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white transition-all duration-200 active:scale-[0.99]"
                style={{
                  background: "linear-gradient(95deg, #2563EB 0%, #3B82F6 55%, #4F97FF 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 12px 26px rgba(37,99,235,0.38)",
                }}
              >
                Start free — no card
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a
                href="/pricing"
                onClick={() => onCta("pricing")}
                className="flex h-9 w-full items-center justify-center text-[14px] font-semibold text-blue-600 transition-opacity hover:opacity-80"
              >
                See plans from ₹2,999/mo →
              </a>
            </div>

            <p className="mt-4 text-[12px] text-ink-muted">
              Free tier · No credit card · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
