import Link from "next/link"
import { Container } from "@/app/components/container"
import { LeadkaunLogo } from "@/app/components/leadkaun-logo"
import { EmailCapture } from "@/app/components/email-capture"
import { APP_URLS } from "@/lib/urls"

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works",       href: "/how-it-works" },
      { label: "All features",       href: "/features" },
      { label: "Lead Scoring",       href: "/features/lead-scoring" },
      { label: "Priority Queue",     href: "/features/priority-queue" },
      { label: "Missed Opportunity", href: "/features/missed-opportunity-engine" },
      { label: "Morning Brief",      href: "/features/morning-brief" },
      { label: "WhatsApp Tracking",  href: "/features/whatsapp-tracking" },
      { label: "Pricing",            href: "/pricing" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Real Estate",   href: "/use-cases/real-estate" },
      { label: "EdTech",        href: "/use-cases/edtech" },
      { label: "BFSI",          href: "/use-cases/bfsi" },
      { label: "SaaS",          href: "/use-cases/saas" },
      { label: "Manufacturing", href: "/use-cases/manufacturing" },
      { label: "Agencies",      href: "/use-cases/agencies" },
      { label: "Healthcare",    href: "/use-cases/healthcare" },
      { label: "Retail",        href: "/use-cases/retail" },
      { label: "Logistics",     href: "/use-cases/logistics" },
      { label: "Fintech",       href: "/use-cases/fintech" },
      { label: "Hospitality",   href: "/use-cases/hospitality" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "vs Zoho CRM",      href: "/compare/leadkaun-vs-zoho-crm" },
      { label: "vs LeadSquared",   href: "/compare/leadkaun-vs-leadsquared" },
      { label: "vs HubSpot",       href: "/compare/leadkaun-vs-hubspot" },
      { label: "vs Salesforce",    href: "/compare/leadkaun-vs-salesforce" },
      { label: "vs Freshsales",    href: "/compare/leadkaun-vs-freshsales" },
      { label: "All comparisons", href: "/compare" },
      { label: "All alternatives", href: "/alternatives" },
      { label: "Best software",    href: "/best" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Learn (guides)", href: "/learn" },
      { label: "Blog",         href: "/blog" },
      { label: "Research",     href: "/research" },
      { label: "Glossary",     href: "/glossary" },
      { label: "FAQ",          href: "/questions" },
      { label: "How-to",       href: "/how-to" },
      { label: "Integrations", href: "/integrations" },
      { label: "Templates",    href: "/resources" },
      { label: "ROI calculator", href: "/tools/missed-revenue-calculator" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About",          href: "/about" },
      { label: "Get Started",    href: APP_URLS.register },
      { label: "Contact",        href: "/contact" },
      { label: "Security",       href: "/security" },
      { label: "Methodology",    href: "/methodology" },
      { label: "Cities we serve", href: "/city" },
      { label: "Sitemap",        href: "/sitemap" },
      { label: "Privacy",        href: "/privacy" },
      { label: "Terms",          href: "/terms" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t" style={{ background: "linear-gradient(180deg, var(--paper) 0%, var(--paper-2) 100%)", borderColor: "var(--paper-line)" }}>

      <Container as="div" className="relative pt-20 pb-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.5fr_repeat(5,1fr)]">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="Leadkaun home" className="group inline-flex items-center">
              <LeadkaunLogo height={30} className="transition-transform group-hover:scale-[1.04]" />
            </Link>
            <p className="mt-4 max-w-[240px] text-[13.5px] leading-[1.6] text-ink-soft">
              The Sales Behaviour OS for Indian B2B SMBs. Grade every lead, build a Priority Queue, surface missed ₹.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1 glass-peach gloss-edge">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-500">
                Runs alongside your CRM
              </span>
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-ink-soft transition-colors hover:text-sky-600"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border bg-white p-6 md:p-8" style={{ borderColor: "var(--paper-line)" }}>
          <EmailCapture source="footer-newsletter" layout="split" />
        </div>

        <div
          className="mt-12 flex flex-wrap items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid var(--paper-line)" }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
            © {new Date().getFullYear()} Leadkaun · Built for Indian sales teams
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
            Sales Behaviour OS · Runs alongside your CRM
          </p>
        </div>
      </Container>
    </footer>
  )
}
