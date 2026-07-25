"use client"

import { useEffect, useState } from "react"
import { X, ArrowRight } from "lucide-react"
import { APP_URLS } from "@/lib/urls"
import { GlossLink } from "@/app/components/gloss-button"

/**
 * Compact, dismissible conversion card anchored to the bottom-right corner
 * (mounted site-wide in the root layout). It appears once the reader scrolls
 * past the fold, and automatically hides when the footer scrolls into view — so
 * it never overlaps the footer — or when dismissed for the session.
 */
export function StickyCTA() {
  const [scrolled, setScrolled] = useState(false)
  const [nearFooter, setNearFooter] = useState(false)
  const [dismissed, setDismissed] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("lk_sticky_dismissed") === "1") return
    setDismissed(false)

    const onScroll = () => setScrolled(window.scrollY > 900)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    // Hide the card whenever the footer is on screen so the two never overlap.
    let observer: IntersectionObserver | undefined
    const footer = document.querySelector("footer")
    if (footer && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(([e]) => setNearFooter(e.isIntersecting), {
        rootMargin: "0px 0px -32px 0px",
      })
      observer.observe(footer)
    }

    return () => {
      window.removeEventListener("scroll", onScroll)
      observer?.disconnect()
    }
  }, [])

  const visible = !dismissed && scrolled && !nearFooter

  useEffect(() => {
    if (visible) {
      const id = requestAnimationFrame(() => setMounted(true))
      return () => cancelAnimationFrame(id)
    }
    setMounted(false)
  }, [visible])

  function dismiss() {
    setDismissed(true)
    try {
      sessionStorage.setItem("lk_sticky_dismissed", "1")
    } catch {
      /* private mode — ignore */
    }
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[min(92vw,340px)] rounded-2xl border border-white/70 glass-2 gloss-edge p-4"
      role="region"
      aria-label="Get started with Leadkaun"
      style={{
        boxShadow: "0 16px 40px rgba(2,132,199,0.22), 0 2px 8px rgba(15,23,42,0.08)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 260ms cubic-bezier(0.16,1,0.3,1), transform 320ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-black/5 hover:text-ink"
      >
        <X className="h-4 w-4" />
      </button>

      <p className="pr-7 text-[14px] font-semibold leading-snug text-ink">
        Grade your leads A–F in 60 minutes.
      </p>
      <p className="mt-1 text-[12.5px] leading-snug text-ink-soft">Free tier — no card required.</p>

      <GlossLink
        variant="primary"
        size="sm"
        href={APP_URLS.register}
        className="mt-3.5 w-full justify-center"
      >
        Start free <ArrowRight className="h-3.5 w-3.5" />
      </GlossLink>
    </div>
  )
}
