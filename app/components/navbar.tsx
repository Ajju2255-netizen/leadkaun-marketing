"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { Menu, X, Search, ChevronDown } from "lucide-react"
import { APP_URLS } from "@/lib/urls"
import { LeadkaunLogo } from "@/app/components/leadkaun-logo"
import { GlossLink } from "@/app/components/gloss-button"
import { cn } from "@/lib/utils"

type NavItem = { label: string; href: string; hint?: string }
type NavGroup = {
  label: string
  /** Where the trigger itself points, and what counts as "active". */
  href: string
  /** Two columns once a group passes six items. */
  items: NavItem[]
}
type NavEntry = NavGroup | { label: string; href: string; items?: undefined }

const NAV: NavEntry[] = [
  {
    label: "Product",
    href: "/product",
    items: [
      { label: "Product overview", href: "/product", hint: "What Leadkaun does" },
      { label: "How it works", href: "/how-it-works", hint: "Import to graded queue" },
      { label: "All features", href: "/features", hint: "Every module" },
      { label: "Lead Scoring", href: "/features/lead-scoring", hint: "A to F on published weights" },
      { label: "Priority Queue", href: "/features/priority-queue", hint: "One ranked list per rep" },
      { label: "Missed Opportunity", href: "/features/missed-opportunity-engine", hint: "Stale leads, priced" },
      { label: "Morning Brief", href: "/features/morning-brief", hint: "8:30 AM IST" },
      { label: "WhatsApp Tracking", href: "/features/whatsapp-tracking", hint: "Log an exchange in taps" },
      { label: "Score Evolution", href: "/features/score-evolution", hint: "Why a grade changed" },
      { label: "Methodology", href: "/methodology", hint: "Weights and thresholds" },
    ],
  },
  {
    label: "Solutions",
    href: "/use-cases",
    items: [
      { label: "All industries", href: "/use-cases" },
      { label: "Real Estate", href: "/use-cases/real-estate" },
      { label: "EdTech", href: "/use-cases/edtech" },
      { label: "BFSI", href: "/use-cases/bfsi" },
      { label: "SaaS", href: "/use-cases/saas" },
      { label: "Manufacturing", href: "/use-cases/manufacturing" },
      { label: "Agencies", href: "/use-cases/agencies" },
      { label: "Healthcare", href: "/use-cases/healthcare" },
      { label: "Fintech", href: "/use-cases/fintech" },
      { label: "Cities we serve", href: "/city" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Compare",
    href: "/compare",
    items: [
      { label: "All comparisons", href: "/compare" },
      { label: "vs Zoho CRM", href: "/compare/leadkaun-vs-zoho-crm" },
      { label: "vs LeadSquared", href: "/compare/leadkaun-vs-leadsquared" },
      { label: "vs HubSpot", href: "/compare/leadkaun-vs-hubspot" },
      { label: "vs Salesforce", href: "/compare/leadkaun-vs-salesforce" },
      { label: "vs Freshsales", href: "/compare/leadkaun-vs-freshsales" },
      { label: "Alternatives", href: "/alternatives" },
      { label: "All buyer guides", href: "/best" },
      { label: "Best lead management software", href: "/best/lead-management-software-india", hint: "Buyer's guide" },
      { label: "Best CRM for real estate", href: "/best/crm-for-real-estate-india", hint: "Buyer's guide" },
      { label: "Best WhatsApp CRM", href: "/best/whatsapp-crm-india", hint: "Buyer's guide" },
    ],
  },
  {
    label: "Resources",
    href: "/learn",
    items: [
      { label: "Learn (guides)", href: "/learn", hint: "The pillar guides" },
      { label: "Blog", href: "/blog" },
      { label: "Glossary", href: "/glossary" },
      { label: "Questions", href: "/questions" },
      { label: "How-to", href: "/how-to" },
      { label: "Research", href: "/research" },
      { label: "Integrations", href: "/integrations" },
      { label: "Templates", href: "/resources" },
      { label: "ROI calculator", href: "/tools/missed-revenue-calculator" },
      { label: "About", href: "/about" },
    ],
  },
]

function Wordmark() {
  return (
    <Link href="/" aria-label="Leadkaun home" className="group inline-flex items-center">
      <LeadkaunLogo height={30} className="transition-transform group-hover:scale-[1.04]" />
    </Link>
  )
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/")
}

function groupActive(pathname: string, entry: NavEntry) {
  if (isActive(pathname, entry.href)) return true
  return (entry.items ?? []).some((i) => isActive(pathname, i.href))
}

export default function Navbar() {
  const pathname = usePathname() ?? "/"
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileSection, setMobileSection] = useState<string | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClick)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClick)
    }
  }, [])

  // Hover open with a short close delay, so crossing the gap to the panel does
  // not dismiss it.
  const openNow = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(label)
  }, [])
  const closeSoon = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140)
  }, [])

  return (
    <header
      ref={navRef}
      className={cn(
        // !fixed: the scrolled state adds `gloss-edge`, whose `position: relative`
        // would otherwise override `fixed` and drop the navbar into flow (causing a
        // 66px jump + flicker on scroll). Force fixed to win.
        "!fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "shadow-[0_6px_20px_-14px_rgba(15,23,42,0.22)]" : "glass-1"
      )}
      style={
        scrolled
          ? {
              borderBottom: "1px solid var(--paper-line-2)",
              background: "rgba(252,250,246,0.92)",
              backdropFilter: "saturate(180%) blur(14px)",
            }
          : { borderBottom: "1px solid transparent" }
      }
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-8 px-6 md:px-8">
        <Wordmark />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((entry) => {
            const active = groupActive(pathname, entry)

            if (!entry.items) {
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  onClick={() => setOpenMenu(null)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[13.5px] font-medium transition-colors",
                    active ? "bg-sky-50 text-sky-600" : "text-ink-soft hover:bg-sky-50 hover:text-sky-600"
                  )}
                >
                  {entry.label}
                </Link>
              )
            }

            const open = openMenu === entry.label
            const wide = entry.items.length > 6
            return (
              <div
                key={entry.label}
                className="relative"
                onPointerEnter={() => openNow(entry.label)}
                onPointerLeave={closeSoon}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu(open ? null : entry.label)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[13.5px] font-medium transition-colors",
                    active || open ? "bg-sky-50 text-sky-600" : "text-ink-soft hover:bg-sky-50 hover:text-sky-600"
                  )}
                >
                  {entry.label}
                  <ChevronDown
                    className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
                    strokeWidth={2}
                  />
                </button>

                {open && (
                  <div
                    className={cn(
                      "absolute left-0 top-full z-50 mt-2 rounded-2xl bg-white p-2",
                      wide ? "w-[520px]" : "w-[260px]"
                    )}
                    style={{
                      border: "1px solid var(--paper-line)",
                      boxShadow: "0 18px 40px -24px rgba(15,23,42,0.28)",
                    }}
                  >
                    <div className={cn("grid gap-0.5", wide && "grid-cols-2")}>
                      {entry.items.map((item) => {
                        const itemActive = isActive(pathname, item.href)
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenMenu(null)}
                            aria-current={itemActive ? "page" : undefined}
                            className={cn(
                              "rounded-xl px-3 py-2 transition-colors",
                              itemActive ? "bg-sky-50" : "hover:bg-paper"
                            )}
                            style={itemActive ? undefined : { background: "transparent" }}
                          >
                            <span
                              className={cn(
                                "block text-[13.5px] font-medium",
                                itemActive ? "text-sky-700" : "text-ink"
                              )}
                            >
                              {item.label}
                            </span>
                            {item.hint && (
                              <span className="mt-0.5 block text-[12px] leading-snug text-ink-muted">
                                {item.hint}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/search"
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-sky-50 hover:text-sky-600"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={2} />
          </Link>
          <Link
            href={APP_URLS.login}
            className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-ink-soft transition-colors hover:bg-sky-50 hover:text-sky-600"
          >
            Log in
          </Link>
          <GlossLink variant="primary" size="sm" href={APP_URLS.register}>
            Start free
          </GlossLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-soft glass-1 gloss-edge lg:hidden"
          onClick={() => { setMobileOpen(!mobileOpen); setMobileSection(null) }}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="max-h-[calc(100vh-4rem)] overflow-y-auto bg-white lg:hidden"
          style={{ borderTop: "1px solid var(--paper-line)" }}
        >
          <div className="mx-auto w-full max-w-[1200px] px-6 py-5">
            <nav className="flex flex-col">
              {NAV.map((entry) => {
                if (!entry.items) {
                  return (
                    <Link
                      key={entry.href}
                      href={entry.href}
                      onClick={() => { setMobileOpen(false); setMobileSection(null) }}
                      className={cn(
                        "rounded-xl px-3 py-3 text-[15px] font-medium",
                        isActive(pathname, entry.href) ? "text-sky-600" : "text-ink"
                      )}
                    >
                      {entry.label}
                    </Link>
                  )
                }
                const open = mobileSection === entry.label
                return (
                  <div key={entry.label} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setMobileSection(open ? null : entry.label)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-medium",
                        groupActive(pathname, entry) ? "text-sky-600" : "text-ink"
                      )}
                    >
                      {entry.label}
                      <ChevronDown
                        className={cn("h-4 w-4 text-ink-muted transition-transform duration-200", open && "rotate-180")}
                        strokeWidth={2}
                      />
                    </button>
                    {open && (
                      <div className="pb-2 pl-3">
                        {entry.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => { setMobileOpen(false); setMobileSection(null) }}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-[14px]",
                              isActive(pathname, item.href) ? "text-sky-700" : "text-ink-soft"
                            )}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            <div className="mt-4 flex flex-col gap-2 pt-4" style={{ borderTop: "1px solid var(--paper-line)" }}>
              <Link
                href={APP_URLS.login}
                onClick={() => { setMobileOpen(false); setMobileSection(null) }}
                className="rounded-xl px-4 py-2.5 text-center text-[14px] font-medium text-ink hover:text-sky-600"
                style={{ border: "1px solid var(--paper-line-2)" }}
              >
                Log in
              </Link>
              <GlossLink
                variant="primary"
                size="md"
                href={APP_URLS.register}
                onClick={() => { setMobileOpen(false); setMobileSection(null) }}
                className="w-full"
              >
                Start free
              </GlossLink>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
