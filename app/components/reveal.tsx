"use client"

import { useEffect, useRef, type ReactNode } from "react"

/**
 * Reveal — SEO-safe scroll-entrance motion (Coastal Sunrise polish).
 *
 * Design priority: content is NEVER hidden to crawlers or non-JS users.
 *   - SSR / no-JS / reduced-motion / no IntersectionObserver → renders fully visible.
 *   - Only elements that start BELOW the fold are briefly hidden (no visible flash,
 *     since they're off-screen) and fade+rise in when scrolled into view.
 *   - A 2.5s fallback timer forces visibility if the observer never fires.
 *
 * Pure CSS transition + IntersectionObserver — no animation library, no layout shift
 * (transform-based). Use for below-the-fold section headers, grids, content blocks.
 * NEVER wrap the hero / above-the-fold LCP content.
 */
type Props = {
  children: ReactNode
  /** Stagger delay in seconds (e.g. index * 0.08 across siblings). */
  delay?: number
  /** Rise distance in px (default 18). */
  y?: number
  className?: string
}

const EASE = "cubic-bezier(.2,.8,.2,1)"

export function Reveal({ children, delay = 0, y = 18, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (reduce || typeof IntersectionObserver === "undefined") return // stay visible

    // Skip elements already in/above the viewport on mount — avoids a hide→show flash.
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.9) return

    el.style.opacity = "0"
    el.style.transform = `translateY(${y}px)`
    el.style.willChange = "opacity, transform"

    let done = false
    const reveal = () => {
      if (done) return
      done = true
      el.style.transition = `opacity .55s ${EASE} ${delay}s, transform .55s ${EASE} ${delay}s`
      el.style.opacity = "1"
      el.style.transform = "none"
      el.addEventListener("transitionend", () => { el.style.willChange = "" }, { once: true })
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { reveal(); io.disconnect(); break }
        }
      },
      { rootMargin: "0px 0px -80px 0px" }
    )
    io.observe(el)
    const fallback = window.setTimeout(reveal, 2500) // never let content stay hidden

    return () => { io.disconnect(); clearTimeout(fallback) }
  }, [delay, y])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
