import type { Metadata } from "next"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { ArticleHeader, Syllabus } from "@/app/components/reading"
import { LedgerCTA } from "@/app/components/ledger"
import { getPillars } from "@/lib/pseo/lookup"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Learn, Complete Guides to Sales Behaviour, Lead Scoring & More | Leadkaun",
  description:
    "In-depth topic guides for Indian B2B sales teams: lead scoring, lead management, WhatsApp sales, follow-up & response time, missed revenue, and sales behaviour.",
  alternates: { canonical: "/learn" },
}

type Cluster = { heading: string; links: { label: string; href: string }[] }
type Pillar = { slug: string; title: string; dek: string; clusters?: Cluster[] }

export default async function LearnHub() {
  const pillars = (await getPillars()) as Pillar[]
  const topicCount = pillars.reduce(
    (n, p) => n + (p.clusters ?? []).reduce((m, c) => m + c.links.length, 0),
    0,
  )

  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <ArticleHeader
        kicker="The library"
        title="The Indian B2B sales playbook."
        dek="Complete, honest guides to the topics that decide whether your team closes or leaks. Each one maps every concept, guide and tool on its subject into a single place, so you can read it end to end or dip in where you're stuck."
        meta={[`${pillars.length} guides`, `${topicCount} topics mapped`, "Free, no signup"]}
      />

      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="mb-10 md:mb-12">
            <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Syllabus</p>
            <h2 className="mt-4 max-w-2xl text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
              Start anywhere. They cross-reference.
            </h2>
          </div>
          <Syllabus
            items={pillars.map((p) => {
              const n = (p.clusters ?? []).reduce((m, c) => m + c.links.length, 0)
              return {
                href: `/learn/${p.slug}`,
                title: p.title,
                dek: p.dek,
                count: n ? `${n} topics` : undefined,
              }
            })}
          />
        </Container>
      </SectionGround>

      <LedgerCTA
        headline="Reading is the slow way to find out."
        sub="Import a CSV and watch Leadkaun grade your own leads A–F in a few minutes. Everything in these guides, applied to your pipeline."
        secondary={{ label: "See the product", href: "/product" }}
      />

      <Footer />
    </main>
  )
}
