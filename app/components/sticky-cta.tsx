"use client"

import { useEffect, useState } from "react"
import { X, ArrowRight } from "lucide-react"
import { APP_URLS } from "@/lib/urls"

/**
 * Scroll-triggered, dismissible conversion bar shown site-wide (mounted in the
 * root layout). Appears after the reader scrolls past the fold; hidden once
 * dismissed for the session so it never nags.
 */
export function StickyCTA() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem("lk_sticky_dismissed") === "1") return
    setDismissed(false)
    const onScroll = () => setShow(window.scrollY > 900)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function dismiss() {
    setShow(false)
    setDismissed(true)
    try {
      sessionStorage.setItem("lk_sticky_dismissed", "1")
    } catch {
      /* private mode — ignore */
    }
  }

  if (dismissed || !show) return null

  return (
    <div
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border border-white/70 glass-2 gloss-edge px-4 py-3 shadow-lg md:inset-x-0 md:bottom-5"
      role="region"
      aria-label="Get started with Leadkaun"
      style={{ boxShadow: "0 8px 30px rgba(2,132,199,0.18)" }}
    >
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 text-[13.5px] leading-[1.4] text-ink">
          <span className="font-semibold">Grade your leads A–F in 60 minutes.</span>{" "}
          <span className="text-ink-soft">Free tier, no card.</span>
        </p>
        <a
          href={APP_URLS.register}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-sky-500 px-4 text-[13.5px] font-semibold text-white transition-all hover:bg-sky-400"
        >
          Start free <ArrowRight className="h-3.5 w-3.5" />
        </a>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-black/5 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
