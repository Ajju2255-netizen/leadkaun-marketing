import type { Metadata } from "next"
import Link from "next/link"
import { FileSearch, ShieldAlert, Copy, Gauge } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { ProofBand, ProductBlock } from "@/app/components/sell/blocks"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { QuickAnswer } from "@/app/components/quick-answer"
import { MidCta, ReviewStamp, AuthorLine } from "@/app/components/page-blocks"
import { createSectionNumbering } from "@/app/components/section-numbering"
import { CONTENT_REVIEWED, CONTENT_REVIEWER } from "@/lib/content-meta"
import { faqPageSchema, breadcrumbListSchema, jsonLdScript } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export const metadata: Metadata = {
  title: "Lead List Check Before Import — Intake Intelligence | Leadkaun",
  description:
    "See what is actually in a lead file before you import it: phone and email validity, duplicates, missing fields, and whether it is B2B at all. Deterministic, no model, runs while you wait.",
  alternates: { canonical: "/features/intake-intelligence" },
}

const CHECKS = [
  { icon: ShieldAlert, tag: "Contactability", accent: "mint" as const, title: "Valid phones, not populated ones",
    description: "A filled phone column tells you nothing. Every number is checked against real Indian mobile formats before a rep dials it." },
  { icon: Copy, tag: "Duplicates", accent: "sky" as const, title: "Rows you already have",
    description: "Matched on normalised phone, so a lead someone is already working does not arrive twice under a different spelling." },
  { icon: FileSearch, tag: "Shape", accent: "peach" as const, title: "B2B or B2C, honestly",
    description: "Company names are read to tell whether this is a business list or a consumer one — whatever it was sold as." },
  { icon: Gauge, tag: "Readiness", accent: "cyan" as const, title: "One verdict, not a score",
    description: "High, Medium or Low. A band is a decision; a number is an argument." },
]

const FAQS = [
  { q: "Does this use AI?", a: "No, and deliberately. It is deterministic arithmetic on formats and completeness — phone shape, email validity, duplicate matching, field coverage, business-versus-consumer signals. Around eighty per cent of understanding a dataset needs no model at all, and a rule you can read is easier to trust than one you cannot." },
  { q: "Does it run in the background while I work?", a: "No. The analysis runs while you wait, on a sample of the file rather than every row. It is fast enough not to need a queue, and we would rather say that plainly than imply a background job that does not exist." },
  { q: "What happens if my file scores Low?", a: "Nothing is blocked. A Low band tells you to expect a poor connect rate and to judge reps against that, which is more useful than discovering the same thing across three weeks of calls. The decision stays yours." },
  { q: "Does it change my data?", a: "The analysis writes nothing. It reads a sample and reports. Normalisation and duplicate handling happen at import, as a separate step you approve." },
]

export default function IntakeIntelligencePage() {
  const n = createSectionNumbering()
  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Features", url: "/features" }, { name: "Intake Intelligence" }]),
    faqPageSchema(FAQS),
  ]
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />
      <main className="min-h-screen bg-bg-pure">
        <Navbar />
        <PageHero
          eyebrow="Feature · Intake Intelligence"
          h1={<>Know what is in the list <span className="hero-accent">before you import it.</span></>}
          sub="You bought a file six months ago. Before a single row reaches a rep, Leadkaun tells you how much of it is real."
          primary={{ kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true }}
          secondary={{ kind: "glass", label: "See pricing", href: "/pricing" }}
        />

        <SectionGround variant="pure" size="sm">
          <Container>
            <QuickAnswer
              question="What does Leadkaun check before importing a lead list?"
              answer="Leadkaun profiles a sample of the file before import and reports a readiness band — High, Medium or Low. It checks how many rows carry a valid Indian mobile, how many companies look like businesses rather than individuals, how many rows duplicate each other, which fields are systematically missing, and whether the dataset is B2B or B2C. The analysis is deterministic arithmetic on formats and completeness rather than a model, and it runs while you wait rather than in the background."
            />
          </Container>
        </SectionGround>

        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl">
              <NumberedTag number={n.next()} tone="warm" label="The hour that costs the most" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[34px]">
                The expensive moment is the hour after a bad import.
              </h2>
              <div className="mt-6 space-y-4 text-[16px] leading-[1.65] text-ink-soft">
                <p>
                  It goes the same way every time. The list arrives and looks substantial. It gets imported. For two
                  weeks the team works it hard, connect rates are poor but not catastrophic, so nobody stops. A month
                  later it is quietly abandoned and the next one is bought.
                </p>
                <p>
                  What usually went wrong is not that the data was fake. It is that nothing said what the data was —
                  how old, how valid, how much of it the team already had. All of that is knowable in twenty minutes,
                  before anyone picks up a phone.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2">
              {CHECKS.map((c) => (
                <FeatureCard key={c.title} icon={c.icon} tag={c.tag} accent={c.accent} title={c.title} description={c.description} />
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        <MidCta lead="Run the check on a list you already have." />

        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number={n.next()} label="What you get" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[34px]">
                A band, not a number.
              </h2>
              <div className="mt-6 space-y-4 text-[16px] leading-[1.65] text-ink-soft">
                <p>
                  The report ends in one of three verdicts — High, Medium or Low — because a band is a decision and a
                  number is an argument. Teams that get a score debate the score; teams that get a band act on it.
                </p>
                <p>
                  Nothing is blocked either way. A Low band is not a refusal to import; it is a warning about what to
                  expect, and a reason to hold reps to a different standard on that file. The point is never to reject
                  data. It is to know what you are importing while you still have the option not to.
                </p>
                <p>
                  Once imported, every lead carries a freshness band that keeps ageing and a confidence reading
                  separate from its grade — so an old list stays visibly old. That is covered in{" "}
                  <Link href="/learn/lead-data-trust" className="text-sky-600 underline-offset-2 hover:underline">the guide to lead data trust</Link>.
                </p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number={n.next()} tone="warm" label="FAQ" /></div>
              <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">Common questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQS} /></Reveal>
          </Container>
        </SectionGround>

        <ProofBand />
        <ProductBlock />
        <ReviewStamp updated={CONTENT_REVIEWED} reviewedBy={CONTENT_REVIEWER} cadence="quarterly" />
        <SectionGround variant="pure" size="sm">
          <Container><Reveal className="mx-auto max-w-3xl"><AuthorLine /></Reveal></Container>
        </SectionGround>
        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
