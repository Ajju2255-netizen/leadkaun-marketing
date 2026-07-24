"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { X, ArrowRight, Gauge, ListChecks, IndianRupee } from "lucide-react"
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
 * testimonials.
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

  const fire = useCallback(() => {
    if (firedRef.current || !eligible()) return
    firedRef.current = true
    try {
      sessionStorage.setItem(K_SESSION, "1")
      localStorage.setItem(K_LAST, String(Date.now()))
    } catch { /* ignore */ }
    setOpen(true)
    requestAnimationFrame(() => setMounted(true))
    track("popup_shown", { path: pathname })
  }, [eligible, pathname])

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
    // let the exit animation play before unmount
    setTimeout(() => setOpen(false), 180)
  }, [pathname])

  const onCta = useCallback((cta: string) => {
    try { localStorage.setItem(K_CONVERTED, String(Date.now())) } catch { /* ignore */ }
    track("popup_cta_click", { cta, path: pathname })
    // navigation happens via the anchor's href
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
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none"
        style={{ opacity: mounted ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-[440px] overflow-hidden rounded-3xl border border-white/70 bg-bg-pure shadow-2xl outline-none transition-all duration-200 ease-out motion-reduce:transition-none"
        style={{
          boxShadow: "0 24px 70px rgba(2,132,199,0.28)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
        }}
      >
        {/* sky gradient cap */}
        <div
          className="relative px-6 pt-6 pb-5"
          style={{ background: "linear-gradient(160deg, #E0F2FE 0%, #F0F9FF 55%, #FFFFFF 100%)" }}
        >
          <button
            onClick={() => close("dismiss")}
            aria-label="Close"
            className="absolute right-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-black/5 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white/70 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">Leadkaun</span>
          </div>

          <h2 id="lk-popup-title" className="mt-3.5 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink">
            Know who to call next —{" "}
            <span className="text-sky-600">free.</span>
          </h2>
          <p className="mt-2 text-[13.5px] leading-[1.5] text-ink-soft">
            Leadkaun grades every lead A–F, builds each rep&apos;s Priority Queue, and surfaces the ₹ you&apos;re
            about to lose. Live in about 60 minutes.
          </p>
        </div>

        <div className="px-6 pb-6">
          {/* real capability chips */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: Gauge, label: "A–F grading" },
              { icon: ListChecks, label: "Priority Queue" },
              { icon: IndianRupee, label: "₹ at risk" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-hairline bg-bg-mist/60 px-2 py-3 text-center">
                <Icon className="h-4 w-4 text-sky-600" strokeWidth={2} />
                <span className="text-[11px] font-medium leading-tight text-ink-soft">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2.5">
            <a
              href={APP_URLS.register}
              onClick={() => onCta("register")}
              className="flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-sky-500 text-[14px] font-semibold text-white transition-all hover:bg-sky-400 active:scale-[0.99]"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 20px rgba(14,165,233,0.32)" }}
            >
              Start free — no card <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/pricing"
              onClick={() => onCta("pricing")}
              className="flex h-11 w-full items-center justify-center rounded-xl border border-hairline-strong bg-white text-[13.5px] font-semibold text-ink-soft transition-colors hover:bg-bg-mist hover:text-ink"
            >
              See plans from ₹2,999/mo
            </a>
          </div>

          <p className="mt-4 text-center text-[11px] text-ink-muted">
            Free tier · No credit card · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
}
