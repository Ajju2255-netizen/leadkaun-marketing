"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { APP_URLS } from "@/lib/urls"
import { LeadkaunMark } from "@/app/components/leadkaun-mark"
import { GlossLink } from "@/app/components/gloss-button"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Product",   href: "/product" },
  { label: "Solutions", href: "/use-cases" },
  { label: "Pricing",   href: "/pricing" },
  { label: "Compare",   href: "/compare" },
  { label: "Resources", href: "/blog" },
]

function Wordmark() {
  return (
    <Link href="/" aria-label="Leadkaun home" className="group inline-flex items-center gap-2.5">
      <LeadkaunMark size={26} gloss className="transition-transform group-hover:scale-[1.06]" />
      <span className="font-semibold text-[17px] tracking-[-0.035em] leading-none text-ink">
        Leadkaun
      </span>
    </Link>
  )
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/")
}

export default function Navbar() {
  const pathname = usePathname() ?? "/"
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass-2 gloss-edge shadow-[0_8px_24px_-12px_rgba(15,23,42,0.10)]"
          : "glass-1"
      )}
      style={
        scrolled
          ? { borderBottom: "1px solid rgba(125,211,252,0.45)" }
          : { borderBottom: "1px solid transparent" }
      }
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-8 px-6 md:px-8">
        <Wordmark />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => {
            const active = isActive(pathname, l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[13.5px] font-medium transition-colors",
                  active ? "bg-sky-50 text-sky-600" : "text-ink-soft hover:bg-sky-50 hover:text-sky-600"
                )}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={APP_URLS.login}
            className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-ink-soft transition-colors hover:bg-sky-50 hover:text-sky-600"
          >
            Log in
          </Link>
          <GlossLink variant="primary" size="sm" href={APP_URLS.register}>
            Start free trial
          </GlossLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-soft glass-1 gloss-edge lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden glass-3 gloss-edge"
             style={{ borderTop: "1px solid var(--hairline)" }}>
          <div className="mx-auto w-full max-w-[1200px] px-6 py-6">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(pathname, l.href) ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-3 py-3 text-[15px] font-medium hover:bg-sky-50",
                    isActive(pathname, l.href) ? "bg-sky-50 text-sky-600" : "text-ink"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2 pt-4"
                 style={{ borderTop: "1px solid var(--hairline)" }}>
              <Link
                href={APP_URLS.login}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl glass-1 gloss-edge px-4 py-2.5 text-center text-[14px] font-medium text-ink hover:text-sky-600"
              >
                Log in
              </Link>
              <GlossLink
                variant="primary"
                size="md"
                href={APP_URLS.register}
                onClick={() => setMobileOpen(false)}
                className="w-full"
              >
                Start free trial →
              </GlossLink>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
