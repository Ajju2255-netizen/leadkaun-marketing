import Link from "next/link"
import { Container } from "@/app/components/container"
import { NumberedTag } from "@/app/components/numbered-tag"
import { SectionGround } from "@/app/components/section-ground"
import { GradientBlob } from "@/app/components/gradient-blob"

const COLS = [
  {
    title: "Product",
    links: [
      { label: "Lead Scoring",              href: "/features/lead-scoring" },
      { label: "Priority Queue",            href: "/features/priority-queue" },
      { label: "Missed Opportunity Engine", href: "/features/missed-opportunity-engine" },
      { label: "Morning Brief",             href: "/features/morning-brief" },
      { label: "WhatsApp Tracking",         href: "/features/whatsapp-tracking" },
      { label: "Sales Rep Tracking",        href: "/features/sales-rep-tracking" },
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
      { label: "CRM alternatives", href: "/compare" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog",          href: "/blog" },
      { label: "Glossary",      href: "/glossary" },
      { label: "FAQ",           href: "/questions" },
      { label: "How-to guides", href: "/how-to" },
      { label: "Integrations",  href: "/integrations" },
      { label: "Templates",     href: "/resources" },
    ],
  },
]

export default function InternalLinksGrid() {
  return (
    <SectionGround variant="pure" size="md" ambient={false}>
      <GradientBlob color="sky" size="lg" position="-top-20 right-1/4" intensity={0.18} />

      <Container>
        <div className="mb-10">
          <NumberedTag number="—" label="Explore the product" />
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-6">
          {COLS.map((col) => (
            <div
              key={col.title}
              className="rounded-2xl p-6 glass-1 gloss-edge"
            >
              <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">
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
      </Container>
    </SectionGround>
  )
}
