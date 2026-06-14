import Link from "next/link"
import { Container } from "@/app/components/container"
import { LeadkaunMark } from "@/app/components/leadkaun-mark"
import { GradientBlob } from "@/app/components/gradient-blob"

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works",       href: "/how-it-works" },
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
      { label: "All alternatives", href: "/compare" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog",         href: "/blog" },
      { label: "Glossary",     href: "/glossary" },
      { label: "FAQ",          href: "/questions" },
      { label: "How-to",       href: "/how-to" },
      { label: "Integrations", href: "/integrations" },
      { label: "Templates",    href: "/resources" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About",          href: "/about" },
      { label: "Demo",           href: "/demo" },
      { label: "Contact",        href: "/contact" },
      { label: "Cities we serve", href: "/city" },
      { label: "Privacy",        href: "/privacy" },
      { label: "Terms",          href: "/terms" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ground-cream">
      <GradientBlob color="peach" size="xl" position="-bottom-40 -right-40" intensity={0.45} />
      <GradientBlob color="sky"   size="lg" position="-top-32  -left-32"   intensity={0.30} delay={6} />

      <Container as="div" className="relative pt-20 pb-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.5fr_repeat(5,1fr)]">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="Leadkaun home" className="group inline-flex items-center gap-2.5">
              <LeadkaunMark size={26} gloss className="transition-transform group-hover:scale-[1.06]" />
              <span className="font-semibold text-[17px] tracking-[-0.035em] leading-none text-ink">
                Leadkaun
              </span>
            </Link>
            <p className="mt-4 max-w-[240px] text-[13.5px] leading-[1.6] text-ink-soft">
              India&apos;s first Sales Behaviour OS. Grade every lead, build a Priority Queue, surface missed ₹.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1 glass-peach gloss-edge">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-500">
                Not a CRM
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

        <div
          className="mt-16 flex flex-wrap items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid var(--hairline)" }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
            © {new Date().getFullYear()} Leadkaun · Built for Indian sales teams
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
            Revenue Execution System · Not a CRM
          </p>
        </div>
      </Container>
    </footer>
  )
}
