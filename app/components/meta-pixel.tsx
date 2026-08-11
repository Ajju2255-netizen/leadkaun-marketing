"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

/**
 * Meta Pixel, route-change half.
 *
 * The inline snippet in app/layout.tsx fires `init` and the first `PageView`
 * on hard load. App Router navigations swap the page without reloading, so
 * without this every visitor would count as a single view no matter how many
 * pages they read. Fires on pathname change only, and skips the first run so
 * the landing view is not counted twice.
 */
export function MetaPixelRouteChange() {
  const pathname = usePathname()
  const settled = useRef(false)

  useEffect(() => {
    if (!settled.current) {
      settled.current = true
      return
    }
    window.fbq?.("track", "PageView")
  }, [pathname])

  return null
}
