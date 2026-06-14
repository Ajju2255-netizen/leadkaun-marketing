import type { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { Reveal } from "@/app/components/reveal"

import { getHowTo } from "@/lib/pseo/lookup"

type HowToEntry = {
  slug: string
  title: string
  tldr: string
  category: string
  timeRequired?: string
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

      <PageHero
        eyebrow={`${HOW_TOS.length} guides · ${categories.length} categories`}
        h1={<>Step-by-step <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>playbooks.</span></>}
        sub="Field-tested workflows for Indian B2B sales — lead scoring rollouts, Priority Queue rituals, Morning Brief cadences, WhatsApp logging, CRM migration. Every guide ends with a live checklist your team can run on Monday."
        center={false}
        primary={undefined}
        meta={
          <span className="inline-flex flex-wrap justify-start gap-1.5 normal-case tracking-normal">
            {categories.map((c) => (
              <a
                key={c}
                href={`#cat-${c}`}
                className="inline-flex h-8 items-center rounded-full glass-1 gloss-edge px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft transition-all hover:text-sky-600 lift"
              >
                {prettyCategory(c)}
              </a>
            ))}
          </span>
        }
      />

      <SectionGround variant="cream" size="lg">
        <Container>
          {categories.map((cat, idx) => (
            <section key={cat} id={`cat-${cat}`} className={idx === 0 ? "" : "mt-14"}>
              <Reveal className="mb-6">
                <NumberedTag
                  number={String(idx + 1).padStart(2, "0")}
                  tone={idx % 2 === 1 ? "warm" : "default"}
                  label={`${prettyCategory(cat)} · ${byCategory[cat].length} ${byCategory[cat].length === 1 ? "guide" : "guides"}`}
                />
              </Reveal>
              <Reveal delay={0.08} className="grid gap-4 md:grid-cols-2 md:gap-5">
                {byCategory[cat].map((h) => (
                  <Link
                    key={h.slug}
                    href={`/how-to/${h.slug}`}
                    className="group flex flex-col justify-between gap-4 rounded-2xl p-5 md:p-6 glass-2 gloss-edge elevate-1 lift aura-sky-hover transition-all"
                  >
                    <div>
                      <p className="text-[15px] font-semibold leading-[1.35] tracking-[-0.01em] text-ink group-hover:text-sky-600 transition-colors md:text-[16px]">
                        {h.title}
                      </p>
                      <p className="mt-2 line-clamp-2 text-[13px] leading-[1.6] text-ink-soft">{h.tldr}</p>
                    </div>
                    {h.timeRequired && (
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.10em] text-orange-500">
                        {h.timeRequired}
                      </p>
                    )}
                  </Link>
                ))}
              </Reveal>
            </section>
          ))}
        </Container>
      </SectionGround>

      <CTABanner />
      <Footer />
    </main>
  )
}
