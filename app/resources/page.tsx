import type { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import InternalLinksGrid from "@/app/components/internal-links-grid"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { Reveal } from "@/app/components/reveal"

import { getResources } from "@/lib/pseo/lookup"

type ResourceEntry = {
  slug: string
  name: string
  type: "calculator" | "template" | "guide" | "checklist" | "framework" | "report"
  tagline: string
  audiencePersona: string
}

export const metadata: Metadata = {
  title: "Leadkaun Resources — Calculators, Templates, Guides for Indian Sales Teams",
  description:
    "Free calculators, Google Sheet templates, checklists, and frameworks for Indian B2B sales — lead scoring, Morning Brief, ICP definition, ₹ at risk, CRM migration.",
  alternates: { canonical: "/resources" },
}

const TYPE_ORDER = ["calculator", "template", "guide", "checklist", "framework", "report"]

function typeLabel(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1) + "s"
}
function prettyPersona(p: string) {
  return p.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export default async function ResourcesHubPage() {
  const RESOURCES = (await getResources()) as ResourceEntry[]
  const byType = RESOURCES.reduce<Record<string, ResourceEntry[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = []
    acc[r.type].push(r)
    return acc
  }, {})
  const sortedTypes = Object.keys(byType).sort((a, b) => {
    const ai = TYPE_ORDER.indexOf(a)
    const bi = TYPE_ORDER.indexOf(b)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })

  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow={`${RESOURCES.length} free resources`}
        h1={<>Sales resources you can <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>use today.</span></>}
        sub="Calculators, Google Sheet templates, checklists, and frameworks to help Indian founders and sales managers build better lead systems — with or without Leadkaun. All free. No gating."
        center={false}
        primary={undefined}
        meta={
          <span className="inline-flex flex-wrap justify-start gap-1.5 normal-case tracking-normal">
            {sortedTypes.map((t) => (
              <a
                key={t}
                href={`#type-${t}`}
                className="inline-flex h-8 items-center rounded-full glass-1 gloss-edge px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft transition-all hover:text-sky-600 lift"
              >
                {typeLabel(t)}
              </a>
            ))}
          </span>
        }
      />

      <SectionGround variant="cream" size="lg">
        <Container>
          {sortedTypes.map((t, idx) => (
            <section key={t} id={`type-${t}`} className={idx === 0 ? "" : "mt-14"}>
              <Reveal className="mb-6">
                <NumberedTag
                  number={String(idx + 1).padStart(2, "0")}
                  tone={idx % 2 === 1 ? "warm" : "default"}
                  label={`${typeLabel(t)} · ${byType[t].length}`}
                />
              </Reveal>
              <Reveal delay={0.08} className="grid gap-4 md:grid-cols-2 md:gap-5">
                {byType[t].map((r) => (
                  <Link
                    key={r.slug}
                    href={`/resources/${r.slug}`}
                    className="group rounded-2xl p-5 md:p-6 glass-2 gloss-edge elevate-1 lift aura-sky-hover transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[16px] font-semibold text-ink group-hover:text-sky-600 transition-colors">
                        {r.name}
                      </p>
                      <span className="shrink-0 rounded-full glass-1 gloss-edge px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                        {prettyPersona(r.audiencePersona)}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-[1.6] text-ink-soft">{r.tagline}</p>
                  </Link>
                ))}
              </Reveal>
            </section>
          ))}
        </Container>
      </SectionGround>

      <CTABanner
        tag={{ number: "→", label: "Skip the manual version" }}
        headline="Or just let Leadkaun run it."
        sub="Everything these resources teach you to build by hand, Leadkaun automates in 60 minutes. Scoring, Priority Queue, Morning Brief, ₹ at risk — no spreadsheet maintenance."
      />
      <InternalLinksGrid />
      <Footer />
    </main>
  )
}
