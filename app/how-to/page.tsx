import type { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { ArticleHeader } from "@/app/components/reading"
import { LedgerCTA } from "@/app/components/ledger"

import { getHowTo } from "@/lib/pseo/lookup"

/* A workshop index: every guide shows what it costs you up front — how long it
   takes and how many steps — so you can pick one that fits this afternoon. */

type HowToEntry = {
  slug: string
  title: string
  tldr: string
  category: string
  timeRequired?: string
  steps?: unknown[]
}

export const metadata: Metadata = {
  title: "Sales Ops How-To Guides for Indian B2B Teams | Leadkaun",
  description:
    "Step-by-step guides for Indian B2B sales teams: lead scoring, priority queues, Morning Brief rituals, WhatsApp logging, CRM migration, and weekly sales reviews.",
  alternates: { canonical: "/how-to" },
}

function prettyCategory(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

/** "PT90M" → "90 min", "PT2H" → "2 hr", "PT1H30M" → "1 hr 30 min". */
export function humanDuration(iso?: string): string | null {
  if (!iso) return null
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?$/.exec(iso.trim())
  if (!m) return iso
  const [, h, min] = m
  const parts: string[] = []
  if (h) parts.push(`${h} hr`)
  if (min) parts.push(`${min} min`)
  return parts.length ? parts.join(" ") : null
}

export default async function HowToIndexPage() {
  const HOW_TOS = (await getHowTo()) as HowToEntry[]
  const byCategory = HOW_TOS.reduce<Record<string, HowToEntry[]>>((acc, h) => {
    if (!acc[h.category]) acc[h.category] = []
    acc[h.category].push(h)
    return acc
  }, {})
  const categories = Object.keys(byCategory).sort()

  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <ArticleHeader
        kicker="How-to"
        title="Step-by-step playbooks."
        dek="Field-tested workflows for Indian B2B sales: lead-scoring rollouts, Priority Queue rituals, Morning Brief cadences, WhatsApp logging, CRM migration. Every guide tells you what it costs in time before you start."
        meta={[`${HOW_TOS.length} guides`, `${categories.length} categories`, "Free, no signup"]}
      />

      <SectionGround variant="cream" size="lg">
        <Container>
          {categories.map((c, ci) => (
            <section key={c} className={ci > 0 ? "mt-16" : ""}>
              <div className="flex items-baseline justify-between gap-6 border-b pb-4" style={{ borderColor: "var(--paper-line-2)" }}>
                <h2 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-ink md:text-[26px]">
                  {prettyCategory(c)}
                </h2>
                <span className="ledger-num text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  {byCategory[c].length} {byCategory[c].length === 1 ? "guide" : "guides"}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-5">
                {byCategory[c].map((h) => {
                  const time = humanDuration(h.timeRequired)
                  const steps = Array.isArray(h.steps) ? h.steps.length : null
                  return (
                    <Link
                      key={h.slug}
                      href={`/how-to/${h.slug}`}
                      className="group flex flex-col rounded-2xl bg-white p-6 transition-colors hover:border-sky-300 md:p-7"
                      style={{ border: "1px solid var(--paper-line)" }}
                    >
                      {(time || steps) && (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          {time && (
                            <span className="ledger-num text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500">
                              {time}
                            </span>
                          )}
                          {time && steps && <span aria-hidden className="ledger-num text-[10px] text-ink-faint">·</span>}
                          {steps && (
                            <span className="ledger-num text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                              {steps} steps
                            </span>
                          )}
                        </div>
                      )}
                      <h3 className="mt-3 text-[18px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-sky-700 md:text-[19px]">
                        {h.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">{h.tldr}</p>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </Container>
      </SectionGround>

      <LedgerCTA
        headline="Or skip the setup entirely."
        sub="Most of these playbooks are what Leadkaun does out of the box: grading, the queue, the morning brief. Import a CSV and it runs the same afternoon."
        secondary={{ label: "See the product", href: "/product" }}
      />

      <Footer />
    </main>
  )
}
