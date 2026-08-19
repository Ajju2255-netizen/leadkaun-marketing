"use client"

import { useEffect } from "react"
import { trackCta } from "@/lib/analytics"

/**
 * Site-wide CTA instrumentation, via one delegated listener.
 *
 * The obvious approach — an onClick on each CTA — would mean editing ~72 links
 * across 40 files, and would force server components like app/components/
 * ledger.tsx (rendered on every programmatic page) to become client
 * components purely to carry a handler. That is a large, permanent cost for
 * an analytics concern.
 *
 * Instead this mounts once and listens on the document in the CAPTURE phase,
 * so it sees the click even if something downstream calls stopPropagation.
 * It catches every current CTA and every future one automatically, with no
 * per-link wiring and no change to the render tree.
 *
 * Only outbound app links and the commercial internal destinations are
 * counted; ordinary navigation is not an event.
 */

/** Where on the page did this link sit? Nearest labelled ancestor wins. */
function zoneFor(el: HTMLElement): string {
  const tagged = el.closest<HTMLElement>("[data-cta-zone]")
  if (tagged?.dataset.ctaZone) return tagged.dataset.ctaZone

  if (el.closest("nav")) return "nav"
  if (el.closest("footer")) return "footer"
  if (el.closest("header")) return "header"

  // Fall back to ordinal position among sections — enough to tell a hero CTA
  // from the one at the bottom of a 2,000-word guide.
  const section = el.closest("section")
  if (section) {
    const all = Array.from(document.querySelectorAll("section"))
    const i = all.indexOf(section)
    if (i === 0) return "hero"
    if (i === all.length - 1) return "page-end"
    return `section-${i + 1}`
  }
  return "unknown"
}

/** Destinations worth counting as a CTA rather than plain navigation. */
function isCta(href: string): boolean {
  if (!href) return false
  // Any link off to the product app: register, login, or the app root.
  if (/^https?:\/\/app\.leadkaun\.com/i.test(href)) return true
  if (/^https?:\/\/localhost:3000/i.test(href)) return true
  if (/\/(register|login)(\/|\?|$)/i.test(href)) return true
  // Commercial internal steps.
  return /^\/(pricing|demo|contact)(\/|\?|$)/i.test(href)
}

export function CtaTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target
      if (!(target instanceof Element)) return

      const anchor = target.closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href") ?? ""
      if (!isCta(href)) return

      trackCta({
        label: (anchor.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 100) || "(no label)",
        href,
        zone: zoneFor(anchor),
        pagePath: window.location.pathname,
      })
    }

    document.addEventListener("click", onClick, { capture: true, passive: true })
    return () => document.removeEventListener("click", onClick, { capture: true })
  }, [])

  return null
}
