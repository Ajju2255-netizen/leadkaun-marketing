import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BarChart3, ExternalLink, Check } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { createSectionNumbering } from "@/app/components/section-numbering"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"
import { QuickAnswer } from "@/app/components/quick-answer"
import { EmailCapture } from "@/app/components/email-capture"
import { getResearch, getResearchReport } from "@/lib/pseo/lookup"
import { articleSchema, jsonLdScript, breadcrumbListSchema, canonical } from "@/lib/seo"
import { resolveAuthor } from "@/lib/authors"

export const revalidate = 86400

type Stat = { claim: string; figure: string; source: string; url: string; year: string }
type Section = { heading: string; intro?: string; stats: Stat[] }
type Report = {
  slug: string; metaTitle: string; metaDescription: string; h1: string; dek: string
  updated: string; quickAnswer: { question: string; answer: string }; keyFindings: string[]
  sections: Section[]; methodology: string; leadkaunAngle: string
}

export async function generateStaticParams() {
  const list = (await getResearch()) as Report[]
  return list.map((r) => ({ slug: r.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const r = await getResearchReport<Report>(slug)
  if (!r) return {}
  return {
    title: r.metaTitle,
    description: r.metaDescription,
    alternates: { canonical: `/research/${r.slug}` },
  }
}

export default async function ResearchReportPage({ params }: Params) {
  const { slug } = await params
  const r = await getResearchReport<Report>(slug)
  if (!r) notFound()
  const author = resolveAuthor("ananya")

  // Distinct sources for the Dataset citations + references list.
  const sources = Array.from(new Map(r.sections.flatMap((s) => s.stats).map((st) => [st.url, st])).values())

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: r.h1,
    description: r.metaDescription,
    url: canonical(`/research/${r.slug}`),
    creator: { "@type": "Organization", name: "Leadkaun" },
    citation: sources.map((s) => `${s.source} (${s.year}) — ${s.url}`),
  }
  const n = createSectionNumbering()
  const schemas = [
    breadcrumbListSchema([
      { name: "Home", url: "/" },
      { name: "Research", url: "/research" },
      { name: r.h1 },
    ]),
    articleSchema({
      headline: r.h1,
      description: r.metaDescription,
      datePublished: `${r.updated}-01`,
      dateModified: `${r.updated}-01`,
      url: `/research/${r.slug}`,
      author: { name: author.name, type: author.type, jobTitle: author.role },
    }),
    dataset,
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <PageHero
          eyebrow={<><BarChart3 className="h-3 w-3" strokeWidth={2} /> Leadkaun Research · updated {r.updated}</>}
          h1={r.h1}
          sub={r.dek}
          primary={{ kind: "glass", label: "See how Leadkaun acts on this", href: "/product" }}
        />

        <SectionGround variant="pure" size="sm">
          <Container>
            <QuickAnswer question={r.quickAnswer.question} answer={r.quickAnswer.answer} />
          </Container>
        </SectionGround>

        {/* KEY FINDINGS */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number={n.next()} tone="warm" label="Key findings" />
              <ul className="mt-6 space-y-3">
                {r.keyFindings.map((k, i) => (
                  <li key={i} className="flex items-start gap-3 text-[16px] leading-[1.55] text-ink">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-sky-500" aria-hidden />
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </SectionGround>

        {/* SECTIONS */}
        {r.sections.map((sec, si) => (
          <SectionGround key={si} variant={si % 2 === 0 ? "sky" : "pure"} size="lg">
            <Container>
              <Reveal className="mx-auto max-w-3xl mb-8">
                <NumberedTag number={n.next()} label="Benchmark" />
                <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[34px]">{sec.heading}</h2>
                {sec.intro && <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">{sec.intro}</p>}
              </Reveal>
              <Reveal delay={0.08} className="mx-auto max-w-3xl space-y-4">
                {sec.stats.map((st, i) => (
                  <FloatingCard key={i} tier="3" depth="2" gloss className="p-6 md:p-7">
                    <div className="flex items-baseline gap-4">
                      <span className="shrink-0 font-mono text-[26px] font-bold tracking-[-0.02em] text-sky-600 tabular md:text-[30px]">{st.figure}</span>
                      <p className="text-[15px] leading-[1.55] text-ink">{st.claim}</p>
                    </div>
                    <p className="mt-3 text-[13px] text-ink-muted">
                      Source:{" "}
                      <a href={st.url} target="_blank" rel="noopener nofollow" className="inline-flex items-center gap-1 font-medium text-sky-600 hover:text-sky-500">
                        {st.source} ({st.year}) <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </FloatingCard>
                ))}
              </Reveal>
            </Container>
          </SectionGround>
        ))}

        {/* LEADKAUN ANGLE */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number={n.next()} tone="warm" label="What this means for your team" />
              <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">{r.leadkaunAngle}</p>
            </Reveal>
          </Container>
        </SectionGround>

        {/* METHODOLOGY + REFERENCES */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-ink">Methodology</h2>
              <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">{r.methodology}</p>
              <h2 className="mt-8 text-[20px] font-semibold tracking-[-0.01em] text-ink">References</h2>
              <ol className="mt-3 space-y-2">
                {sources.map((s, i) => (
                  <li key={i} className="text-[13px] leading-[1.5] text-ink-soft">
                    {i + 1}.{" "}
                    <a href={s.url} target="_blank" rel="noopener nofollow" className="text-sky-600 hover:text-sky-500">{s.source} ({s.year})</a>
                  </li>
                ))}
              </ol>
            </Reveal>
          </Container>
        </SectionGround>

        {/* GET NEW REPORTS */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto max-w-2xl rounded-2xl glass-1 gloss-edge p-7 md:p-8">
              <EmailCapture
                source="research-report"
                heading="Get the next Leadkaun report first"
                blurb="We publish new sourced benchmarks on Indian B2B sales periodically. Leave your email and we'll send the next one your way."
                cta="Send me new reports"
                doneNote="Done — you'll get the next report when it's out."
              />
            </Reveal>
          </Container>
        </SectionGround>

        

        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
