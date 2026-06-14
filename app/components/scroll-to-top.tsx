"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * Forces the window to the top on every route (pathname) change, so clicking
 * any link lands at the top of the destination page — not wherever the
 * previous page was scrolled. In-page hash links (same pathname) are untouched.
 */
export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior })
  }, [pathname])

  return null
}
