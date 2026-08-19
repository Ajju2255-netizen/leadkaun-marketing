/**
 * Marketing-side analytics helpers.
 *
 * The site had GA4, GTM and the Meta Pixel installed but not one of the ~72
 * "Start free" links across 40 files fired an event. So we knew how many
 * people arrived from search and (after the product-side GA4 landed) how many
 * accounts were created, but nothing about the step between: which page, and
 * which CTA, actually sends people to register. That is the step the growth
 * plan optimises, so it has to be measurable.
 *
 * Events go to BOTH gtag and dataLayer: GA4 is configured inline in
 * app/layout.tsx, GTM is also present, and which one a given tag lives in
 * should not decide whether the event exists.
 *
 * Note for whoever reads the reports: `cta_label`, `cta_href`, `cta_zone` and
 * `page_path` are custom event parameters. GA4 will collect them immediately,
 * but they stay invisible in standard reports until they are registered as
 * custom dimensions in Admin → Custom definitions. Realtime + DebugView show
 * them without that step.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export type CtaEvent = {
  /** Visible text of the link, trimmed. e.g. "Start free trial" */
  label: string
  /** Destination, so register vs pricing vs demo are separable. */
  href: string
  /** Where on the page it sat. e.g. "hero", "ledger-cta", "nav" */
  zone: string
  /** Path of the page the click happened on — the page that earned it. */
  pagePath: string
}

/**
 * Fire a `cta_click` event.
 *
 * Deliberately never throws and never awaits: this runs inside a click handler
 * on a link the user is trying to follow. Analytics failing must not cost a
 * visitor the navigation.
 */
export function trackCta(event: CtaEvent) {
  if (typeof window === "undefined") return
  const payload = {
    cta_label: event.label,
    cta_href: event.href,
    cta_zone: event.zone,
    page_path: event.pagePath,
  }
  try {
    window.gtag?.("event", "cta_click", payload)
  } catch {
    /* never break navigation */
  }
  try {
    window.dataLayer?.push({ event: "cta_click", ...payload })
  } catch {
    /* never break navigation */
  }
}
