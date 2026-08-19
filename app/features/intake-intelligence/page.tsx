import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Upload, Gauge, ListOrdered, ShieldAlert, Copy, FileSearch, ArrowRight, Sparkles, ShieldCheck, Clock, History, type LucideIcon } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { AppReplica } from "@/app/components/app-replica"
import { Voices } from "@/app/components/voices"
import { faqPageSchema, breadcrumbListSchema, jsonLdScript, ogMeta } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

const title = "Lead List Check Before Import, Intake Intelligence"
const description =
  "See what is actually in a lead file before you import it: phone and email validity, duplicates, missing fields, and whether it is B2B at all. Deterministic, no model, runs while you wait."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/features/intake-intelligence" },
  ...ogMeta({ title, description, path: "/features/intake-intelligence" }),
}

/** Inline highlighted term chip for the Quick Answer. */
function Chip({ children, tone = "sky" }: { children: ReactNode; tone?: "sky" | "mint" | "warn" }) {
  const styles: Record<string, string> = {
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    mint: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warn: "bg-orange-50 text-orange-700 ring-orange-200",
  }
  return <span className={`whitespace-nowrap rounded-md px-1.5 py-[1px] text-[13.5px] font-semibold ring-1 ${styles[tone]}`}>{children}</span>
}

const CHECKS: { icon: LucideIcon; tag: string; title: string; description: string }[] = [
  { icon: ShieldAlert, tag: "Contactability", title: "Valid phones, not populated ones",
    description: "A filled phone column tells you nothing. Every number is checked against real Indian mobile formats before a rep dials it." },
  { icon: Copy, tag: "Duplicates", title: "Rows you already have",
    description: "Matched on normalised phone, so a lead someone is already working does not arrive twice under a different spelling." },
  { icon: FileSearch, tag: "Shape", title: "B2B or B2C, honestly",
    description: "Company names are read to tell whether this is a business list or a consumer one, whatever it was sold as." },
  { icon: Gauge, tag: "Readiness", title: "One verdict, not a score",
    description: "High, Medium or Low. A band is a decision; a number is an argument." },
]

const BANDS = [
  { band: "High", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200", note: "Clean phones, few duplicates, clearly B2B. Import and work it." },
  { band: "Medium", tone: "bg-amber-50 text-amber-700 ring-amber-200", note: "Usable, with gaps. Expect a lower connect rate and judge reps against it." },
  { band: "Low", tone: "bg-rose-50 text-rose-700 ring-rose-200", note: "Poor formats or a consumer list sold as B2B. Know it before three weeks of calls." },
]

const PROOF: { Icon: LucideIcon; stat: string; label: string }[] = [
  { Icon: ShieldCheck, stat: "Deterministic", label: "Rules you can read, not a model" },
  { Icon: Clock, stat: "While you wait", label: "No queue, no background job" },
  { Icon: Copy, stat: "Non-destructive", label: "Reads a sample, writes nothing" },
  { Icon: Gauge, stat: "One band", label: "High / Medium / Low, a decision" },
]

const FAQ = [
  { q: "Does this use AI?", a: "No, and deliberately. It is deterministic arithmetic on formats and completeness, phone shape, email validity, duplicate matching, field coverage, business-versus-consumer signals. Around eighty per cent of understanding a dataset needs no model at all, and a rule you can read is easier to trust than one you cannot." },
  { q: "Does it run in the background while I work?", a: "No. The analysis runs while you wait, on a sample of the file rather than every row. It is fast enough not to need a queue, and we would rather say that plainly than imply a background job that does not exist." },
  { q: "What happens if my file scores Low?", a: "Nothing is blocked. A Low band tells you to expect a poor connect rate and to judge reps against that, which is more useful than discovering the same thing across three weeks of calls. The decision stays yours." },
  { q: "Does it change my data?", a: "The analysis writes nothing. It reads a sample and reports. Normalisation and duplicate handling happen at import, as a separate step you approve." },
]

const RELATED = [
  { icon: Gauge, title: "Lead Scoring", description: "Once a clean list is in, scoring grades every lead so reps know who to call first.", href: "/features/lead-scoring" },
  { icon: ListOrdered, title: "Priority Queue", description: "Imported leads land straight into one ranked queue per rep.", href: "/features/priority-queue" },
  { icon: History, title: "Score Evolution", description: "Same instinct as intake: show the working, so a number can be trusted.", href: "/features/score-evolution" },
]

export default function IntakeIntelligencePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Features", url: "/features" }, { name: "Intake Intelligence" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO — split, readiness band right */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-600">
                  <Upload className="h-3.5 w-3.5" strokeWidth={2} /> Intake Intelligence
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  Know what is in the list
                  <br />
                  <span className="relative inline-block text-sky-600">
                    before you import it.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  A bought list looks the same whether it is gold or garbage until a rep has burned a week on it. Intake reads a sample first, valid phones, duplicates, missing fields, B2B or not, and hands back one verdict: High, Medium, or Low.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/features/lead-scoring" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See lead scoring <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Readiness verdict */}
              <div className="rise" style={{ animationDelay: "160ms" }}>
                <FloatingCard tier="2" depth="3" gloss aura="sky" className="mx-auto max-w-md p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">leads-march.csv · 2,140 rows</p>
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-700 ring-1 ring-sky-100">sampled</span>
                  </div>
                  <div className="mt-4 flex items-center gap-3 rounded-xl bg-amber-50/70 p-4 ring-1 ring-amber-200">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-white font-mono text-[15px] font-bold text-amber-700 ring-1 ring-amber-200">M</span>
                    <div>
                      <p className="text-[15px] font-semibold text-ink">Medium readiness</p>
                      <p className="text-[12px] text-ink-muted">Usable, with gaps to plan around</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[["Valid phones", "82%", "text-emerald-600"], ["Duplicates of existing", "11%", "text-amber-600"], ["Missing company", "6%", "text-emerald-600"], ["Reads as B2B", "Yes", "text-emerald-600"]].map(([l, v, c]) => (
                      <div key={l} className="flex items-center justify-between text-[13px]">
                        <span className="text-ink-soft">{l}</span>
                        <span className={`font-mono font-semibold ${c}`}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3.5 text-[11px] leading-snug text-ink-muted">Deterministic checks on a sample. Illustrative figures.</p>
                </FloatingCard>
              </div>
            </div>
          </Container>
        </section>

        {/* 01 — THE LIVE PRODUCT (AppReplica opened on Import) */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number="01" label="The live product" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Drop a file in and read it before it lands.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                This is the actual import step. The check runs on a sample while you wait, and the verdict shows before a single row is committed.
              </p>
            </Reveal>
          </Container>
          <Reveal delay={0.06} className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <AppReplica initialView="import" />
          </Reveal>
        </SectionGround>

        {/* QUICK ANSWER — accent card, chipped terms */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-white p-6 pl-7 md:p-8 md:pl-10" style={{ borderColor: "var(--paper-line)" }} data-quick-answer>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", speakable: { "@type": "SpeakableSpecification", cssSelector: [".quick-answer-q", ".quick-answer-a"] } }) }} />
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ background: "#0877B8" }} />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-500" aria-hidden />
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">Quick answer</p>
              </div>
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">What does Intake Intelligence check before I import a lead list?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                Four things, on a <Chip>sample</Chip> of the file: whether phones are <Chip tone="mint">valid Indian mobiles</Chip>, how many rows <Chip tone="warn">duplicate leads you already have</Chip>, which fields are missing, and whether the list is genuinely B2B. It is <Chip>deterministic</Chip>, no model, runs while you wait, writes nothing, and returns a single readiness band, High, Medium or Low.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 02 — THE FOUR CHECKS */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="02" tone="warm" label="The checks" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Four questions, answered before you commit.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                The expensive moment is the hour after a bad import, once the rows are in and the calls have started. These checks happen before that.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2">
              {CHECKS.map(({ icon: Icon, tag, title: t, description }) => (
                <FloatingCard key={tag} tier="2" depth="2" gloss className="p-6 md:p-7">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100"><Icon className="h-[18px] w-[18px]" strokeWidth={2} /></span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{tag}</span>
                  </div>
                  <p className="mt-4 text-[16px] font-semibold text-ink">{t}</p>
                  <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">{description}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 03 — A BAND, NOT A NUMBER (text left, visual right) */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="03" label="The verdict" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  A band is a decision. A number is an argument.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  A readiness of &ldquo;71.4&rdquo; invites a debate about whether 71 is good. High, Medium or Low does not, it tells you whether to import, import with caution, or push back on whoever sold you the list. Nothing is ever blocked; the decision stays yours.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                  <div className="space-y-3">
                    {BANDS.map((b) => (
                      <div key={b.band} className="flex items-start gap-3 rounded-xl bg-white/60 p-4 ring-1 ring-black/5">
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg font-mono text-[13px] font-bold ring-1 ${b.tone}`}>{b.band[0]}</span>
                        <div>
                          <p className="text-[14px] font-semibold text-ink">{b.band}</p>
                          <p className="mt-0.5 text-[12.5px] leading-snug text-ink-soft">{b.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 04 — NO MODEL, ON PURPOSE */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="04" label="How it works" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                No AI. On purpose.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2">
              <FloatingCard tier="2" depth="2" gloss aura="sky" className="p-6 md:p-7">
                <p className="text-[17px] font-semibold text-ink">Deterministic arithmetic</p>
                <p className="mt-2.5 text-[14px] leading-[1.65] text-ink-soft">Phone shape, email validity, duplicate matching, field coverage, business-versus-consumer signals. Around eighty per cent of understanding a dataset needs no model at all, and a rule you can read is easier to trust than one you cannot.</p>
              </FloatingCard>
              <FloatingCard tier="2" depth="2" gloss aura="peach" className="p-6 md:p-7">
                <p className="text-[17px] font-semibold text-ink">Runs while you wait</p>
                <p className="mt-2.5 text-[14px] leading-[1.65] text-ink-soft">On a sample, not every row, fast enough to skip a queue. We would rather say that plainly than imply a background job that does not exist. The analysis writes nothing; normalisation happens later, as a step you approve.</p>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 05 — IN THEIR WORDS (illustrative placeholders, not real customer statements) */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-2xl">
              <NumberedTag number="05" tone="warm" label="In their words" />
              <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">
                A bad list costs three weeks before anyone admits it was bad.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Voices /></Reveal>
          </Container>
        </SectionGround>

        {/* 06 — FAQ */}
        <SectionGround variant="pure" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="06" label="FAQ" /></div>
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">Import questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* 07 — WORKS WITH */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mb-10">
              <NumberedTag number="07" tone="warm" label="Works with" />
              <h2 className="mt-5 max-w-3xl text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                Intake is step zero. Here&apos;s what comes after.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {RELATED.map((r, i) => <FeatureCard key={r.href} {...r} variant={i % 2 === 1 ? "soft" : "default"} />)}
            </Reveal>
          </Container>
        </SectionGround>

        {/* PROOF — product-mechanics stat tiles */}
        <SectionGround variant="pure" size="md">
          <Container>
            <Reveal className="mb-7 text-center">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Product mechanics, published in full at{" "}
                <Link href="/methodology" className="text-sky-600 hover:underline">/methodology</Link>
              </p>
            </Reveal>
            <Reveal delay={0.06} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PROOF.map(({ Icon, stat, label }) => (
                <FloatingCard key={stat} tier="2" depth="2" gloss aura="sky" className="p-6 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100"><Icon className="h-5 w-5" strokeWidth={2} /></span>
                  <p className="mt-4 text-[26px] font-semibold tracking-[-0.02em] text-ink md:text-[30px]">{stat}</p>
                  <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">{label}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* CLOSING CTA */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-3xl border p-10 text-center md:p-14" style={{ borderColor: "var(--paper-line)", background: "linear-gradient(180deg,#FFFFFF, var(--paper))" }}>
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-96 rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle,#BAE6FD 0%,transparent 70%)" }} />
                <p className="ledger-num relative text-[11px] uppercase tracking-[0.22em] text-sky-600">08 · Ready when you are</p>
                <h2 className="display-lg relative mx-auto mt-5 max-w-2xl text-[30px] text-ink md:text-[44px]">
                  Check the next list{" "}
                  <span className="relative inline-block text-sky-600">
                    before it costs you a week.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  Upload a file and see its readiness band in seconds, before a single row is imported or a single rep dials.
                </p>
                <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See pricing
                  </Link>
                </div>
                <p className="ledger-num relative mt-8 text-[11.5px] uppercase tracking-[0.16em] text-ink-muted">Free ₹0 · no card · same-day setup</p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <Footer />
      </main>
    </>
  )
}
