import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Building2, Gauge, ListOrdered, MessageCircle, AlertTriangle, Mail, Upload, History, Users, ArrowRight, Sparkles, IndianRupee, CalendarClock, Home, Building, Landmark, Trees, MapPin, TrendingUp, type LucideIcon } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { GradeBadge } from "@/app/components/demo/primitives"
import { GradeDistribution } from "@/app/components/viz/grade-distribution"
import { AppReplica } from "@/app/components/app-replica"
import { Voices } from "@/app/components/voices"
import { UseCaseRoiCalc, type RoiConfig } from "@/app/components/use-case-roi-calc"
import { UseCasePricing } from "@/app/components/use-case-pricing"
import type { Grade } from "@/lib/demo-app"
import { faqPageSchema, breadcrumbListSchema, jsonLdScript, ogMeta } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

const title = "Real Estate Lead Management India, stop losing property enquiries"
const description =
  "Leadkaun grades every property enquiry A–F, builds a priority callback queue so reps reach the freshest high-fit buyers first, and surfaces stale site-visit leads with their ₹ value, the whole platform, built for real estate."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/use-cases/real-estate" },
  ...ogMeta({ title, description, path: "/use-cases/real-estate" }),
}

function Chip({ children, tone = "sky" }: { children: ReactNode; tone?: "sky" | "mint" | "warn" }) {
  const styles: Record<string, string> = {
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    mint: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warn: "bg-orange-50 text-orange-700 ring-orange-200",
  }
  return <span className={`whitespace-nowrap rounded-md px-1.5 py-[1px] text-[13.5px] font-semibold ring-1 ${styles[tone]}`}>{children}</span>
}

const HERO_QUEUE: { grade: Grade; name: string; meta: string; tag: string; next?: boolean }[] = [
  { grade: "A", name: "Rohan Mehta", meta: "3BHK, Whitefield · ₹1.4Cr", tag: "Site visit requested", next: true },
  { grade: "A", name: "Anjali Rao", meta: "2BHK, Wakad · ₹85L", tag: "Replied on WhatsApp" },
  { grade: "B", name: "Karan Shah", meta: "Villa, ECR · ₹3.2Cr", tag: "Toured last week" },
  { grade: "C", name: "Portal lead", meta: "2BHK, Thane · ₹62L", tag: "99acres form ×10" },
]

const STATS = [
  { Icon: IndianRupee, label: "Deal size (GCV)", value: "₹5L – ₹5Cr" },
  { Icon: CalendarClock, label: "Enquiry-to-booking", value: "2 days – 4 months" },
  { Icon: Building2, label: "Where leads come from", value: "99acres · MagicBricks · Ads" },
]

const PAINS = [
  { n: "01", title: "Enquiries go cold within the hour.", body: "A buyer who fills a 99acres or MagicBricks form is visible to a dozen builders at once, and interest fades the moment the calls pour in. Most teams call back hours later, or lose the lead in a shared portal inbox nobody owns. The first to reach a fresh enquiry usually wins the site visit." },
  { n: "02", title: "One missed site visit is a booking gone.", body: "The site visit is where intent turns into a booking, and a buyer who never gets scheduled almost never comes back on their own, they tour whoever followed up first. Against a ₹50L flat or a multi-crore villa, one lost booking can outweigh a month of portal and ad spend." },
  { n: "03", title: "Reps chase new noise, forget the warm ones.", body: "Without a shared queue, reps gravitate to whatever name just landed. But a Grade B buyer who toured last week and replied on WhatsApp is far closer to booking than a cold lead who filled ten forms in one sitting. The warm, mid-funnel buyer quietly ages out." },
]

const FEATURES: { Icon: LucideIcon; title: string; body: string; href: string }[] = [
  { Icon: Gauge, title: "Lead Scoring", body: "Every enquiry graded A–F on project price band, city and location match, source reliability and engagement, so reps see who deserves the first call.", href: "/features/lead-scoring" },
  { Icon: ListOrdered, title: "Priority Queue", body: "The freshest, highest-fit buyers on top, so the callback happens while the buyer is still deciding whom to visit, not whoever enquired first.", href: "/features/priority-queue" },
  { Icon: MessageCircle, title: "WhatsApp Tracking", body: "3-tap logging of call outcome, WhatsApp stage and site-visit booking in seconds. Manual today; BSP auto-sync (AiSensy, Gupshup, Interakt) on the roadmap.", href: "/features/whatsapp-tracking" },
  { Icon: AlertTriangle, title: "Missed Opportunity Engine", body: "Every stale Grade A/B enquiry with the project's ₹ value attached, rolled up per rep, so the sales head sees exactly where bookings are leaking.", href: "/features/missed-opportunity-engine" },
  { Icon: Mail, title: "Morning Brief", body: "Lands before the day starts: “4 Grade A enquiries need callback · ₹12L in site visits at risk today.”", href: "/features/morning-brief" },
  { Icon: Upload, title: "Intake Intelligence", body: "Check a bought or portal list, valid phones, duplicates, B2C-vs-genuine, before a rep burns a day dialling a bad file.", href: "/features/intake-intelligence" },
  { Icon: History, title: "Score Evolution", body: "Why a hot walk-in cooled to Grade C over three quiet weeks: the append-only timeline names the cause.", href: "/features/score-evolution" },
  { Icon: Users, title: "Rep Tracking", body: "Per-rep ₹ booked, Grade A response time, site visits set, follow-ups kept, outcomes, not dial-counts.", href: "/features/sales-rep-tracking" },
]

const SEGMENTS: { Icon: LucideIcon; name: string; signal: string }[] = [
  { Icon: Home, name: "Affordable · ₹25–60L", signal: "Volume game. Speed-to-call and EMI fit decide it. Fast, high-intent cycles." },
  { Icon: Building, name: "Mid-income · ₹60L–1.5Cr", signal: "Family decision, weekend site visits. Location match and school proximity weigh in." },
  { Icon: Landmark, name: "Premium · ₹1.5–5Cr", signal: "Longer cycle, multiple tours. Source quality and repeat engagement matter most." },
  { Icon: Trees, name: "Villa / Luxury · ₹5Cr+", signal: "HNI, relationship-led. Few leads, each one worth a partner's personal follow-up." },
  { Icon: Building2, name: "Plots / Commercial", signal: "Investor intent, ROI-driven. Yield and clear-title questions signal a serious buyer." },
]

const FUNNEL = [
  { stage: "Enquiries", count: 1000, color: "#38BDF8" },
  { stage: "Contacted", count: 640, color: "#0EA5E9" },
  { stage: "Site visit booked", count: 240, color: "#10B981" },
  { stage: "Visited", count: 150, color: "#FB923C" },
  { stage: "Booked", count: 42, color: "#F97316" },
]

const FAQ = [
  { q: "How long does it take to set up Leadkaun for a real-estate team?", a: "The same day from signup to your first graded property enquiry in the queue. Real estate ICP weights are pre-configured. You tweak project tiers and city focus, then go live." },
  { q: "Do you integrate with 99acres, MagicBricks, and Housing?", a: "Yes, via CSV bulk import and webhooks, most teams pipe portal leads in the same day. Google Sheets sync and WhatsApp BSP auto-logging (AiSensy, Gupshup, Interakt) are on our roadmap; until then, WhatsApp is tracked with fast 3-tap manual logging." },
  { q: "What if a rep handles HNI buyers, a different ICP from mass-market?", a: "Your ICP is set once per account and captures what a strong real-estate lead looks like, price band, city and location match, and source reliability. It's shared across the account today (per-segment weighting isn't available yet), but the Fit score still reflects each lead's price band and geography, so an HNI-fit enquiry and an affordable-housing-fit enquiry grade on their own merits." },
  { q: "How does Missed Opportunity work for property leads?", a: "Every Grade A/B lead not contacted inside your follow-up window surfaces with the project's average ticket size attached, and the totals roll up per rep so the sales head sees who is sitting on booking-ready buyers, e.g. '6 leads · ₹2.4 Cr at risk'. The number is illustrative and reflects your own pipeline, not a promised outcome." },
  { q: "Do we have to drop our existing CRM to use Leadkaun?", a: "No. Leadkaun runs alongside your CRM as the lead-intelligence layer most builder CRMs are missing. Portal and ad leads flow in via CSV or webhook, get graded and queued, and your reps keep recording deals wherever they already do. Pricing is flat per account, so adding site executives or a second project team never changes the bill." },
]

const CITIES = [
  { city: "Mumbai", href: "/real-estate/mumbai" },
  { city: "Pune", href: "/real-estate/pune" },
  { city: "Bengaluru", href: "/real-estate/bengaluru" },
  { city: "Delhi", href: "/real-estate/delhi" },
  { city: "Hyderabad", href: "/real-estate/hyderabad" },
  { city: "Chennai", href: "/real-estate/chennai" },
]

const GUIDES = [
  { label: "Lead scoring, explained", href: "/features/lead-scoring" },
  { label: "How Leadkaun works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
]

const ROI: RoiConfig = {
  volumeLabel: "Enquiries per month", volumeDefault: 400, volumeMin: 50, volumeMax: 3000, volumeStep: 50,
  valueLabel: "Average ticket (GCV)", valueDefault: 80_00_000, valueMin: 25_00_000, valueMax: 5_00_00_000, valueStep: 5_00_000,
  coldLabel: "Warm enquiries that go cold without follow-up", coldDefault: 20,
  conv: 0.03, outcomeNoun: "bookings", riskLabel: "₹ bookings at risk", coldNoun: "warm buyers",
}

/** Bespoke "first call wins" race visual (server-safe). */
function SpeedRace() {
  const rows = [
    { who: "Your team, via the queue", t: "≈ 90 sec", win: true, pct: 12 },
    { who: "Builder B", t: "18 min", win: false, pct: 34 },
    { who: "Builder C", t: "2 hours", win: false, pct: 70 },
    { who: "Builder D", t: "next morning", win: false, pct: 100 },
  ]
  return (
    <div>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Same 99acres lead · time to first call</p>
      <div className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r.who}>
            <div className="flex items-baseline justify-between">
              <span className={`text-[13px] ${r.win ? "font-semibold text-emerald-700" : "text-ink-soft"}`}>{r.who}</span>
              <span className={`font-mono text-[12.5px] font-semibold ${r.win ? "text-emerald-600" : "text-ink-muted"}`}>{r.t}</span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-black/[0.04]">
              <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.win ? "linear-gradient(90deg,#34D399,#10B981)" : "linear-gradient(90deg,#CBD5E1,#94A3B8)" }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t pt-3.5 text-[12px] leading-snug text-ink-muted rule-paper">The buyer books a visit with whoever calls while they&apos;re still deciding. The queue makes that you.</p>
    </div>
  )
}

export default function RealEstatePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Use cases", url: "/use-cases" }, { name: "Real Estate" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-600">
                  <Building2 className="h-3.5 w-3.5" strokeWidth={2} /> Use case · Real Estate
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  Stop losing enquiries
                  <br />
                  <span className="relative inline-block text-sky-600">
                    before they go cold.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  Property enquiries go cold within the hour, and the first team to call wins the site visit. Leadkaun grades every enquiry, ranks the freshest high-fit buyers on top, and surfaces the stale ones with the ₹ at stake, the same day you start.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="#platform" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See the platform <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="rise" style={{ animationDelay: "160ms" }}>
                <FloatingCard tier="2" depth="3" gloss aura="sky" className="mx-auto max-w-md p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Callback queue · today</p>
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-700 ring-1 ring-sky-100">call first</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {HERO_QUEUE.map((r) => (
                      <div key={r.name} className={`flex items-center gap-3 rounded-xl p-2.5 ring-1 ${r.next ? "bg-sky-50/70 ring-sky-200" : "bg-white/60 ring-black/5"}`}>
                        <GradeBadge grade={r.grade} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-semibold leading-tight text-ink">{r.name}</span>
                          <span className="block truncate text-[11.5px] text-ink-muted">{r.meta}</span>
                        </span>
                        {r.next
                          ? <span className="whitespace-nowrap rounded-full bg-sky-600 px-2 py-0.5 font-mono text-[10px] font-semibold text-white">Next</span>
                          : <span className="whitespace-nowrap font-mono text-[10px] font-semibold text-sky-600">{r.tag}</span>}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3.5 text-[12px] leading-snug text-ink-muted">Freshest high-fit buyers rise to the top, so the first call lands while they&apos;re still deciding.</p>
                </FloatingCard>
              </div>
            </div>
          </Container>
        </section>

        {/* CONTEXT STRIP */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <Reveal className="grid gap-4 md:grid-cols-3">
              {STATS.map(({ Icon, label, value }) => (
                <FloatingCard key={label} tier="2" depth="2" gloss aura="sky" className="flex items-center gap-4 p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100"><Icon className="h-5 w-5" strokeWidth={2} /></span>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{label}</p>
                    <p className="mt-1 text-[17px] font-semibold text-ink">{value}</p>
                  </div>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 01 — THE PLATFORM */}
        <SectionGround variant="sky" size="lg" id="platform">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number="01" label="The platform, live" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                This is the actual sales console.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Not a video, the real product. Open a lead, log a call or a WhatsApp reply, and watch the enquiry re-grade and climb the callback queue underneath you.
              </p>
            </Reveal>
          </Container>
          <Reveal delay={0.06} className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <AppReplica initialView="queue" />
          </Reveal>
        </SectionGround>

        {/* QUICK ANSWER */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-white p-6 pl-7 md:p-8 md:pl-10" style={{ borderColor: "var(--paper-line)" }} data-quick-answer>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", speakable: { "@type": "SpeakableSpecification", cssSelector: [".quick-answer-q", ".quick-answer-a"] } }) }} />
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ background: "#0877B8" }} />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-500" aria-hidden />
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">Quick answer</p>
              </div>
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">How does Leadkaun help real-estate sales teams in India?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                It grades every property enquiry <Chip>A–F</Chip> on price band, location match, source and engagement, then builds a <Chip tone="mint">Priority Queue</Chip> that puts the freshest, highest-fit buyers on top, so the callback happens while they&apos;re still deciding whom to visit. Stale Grade A/B leads resurface with the <Chip tone="warn">₹ at stake</Chip> attached. It runs alongside your builder CRM, not instead of it.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 02 — THE PROBLEM */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="02" tone="warm" label="Why site teams lose bookings" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Three patterns we see on every site.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {PAINS.map((p, i) => (
                <FloatingCard key={p.n} tier="2" depth="2" gloss aura={i === 1 ? "peach" : "sky"} className="p-7">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl font-mono text-[16px] font-bold text-white" style={{ background: i === 1 ? "#EA580C" : "#0877B8" }}>{p.n}</span>
                  <h3 className="mt-5 text-[18px] font-semibold leading-[1.3] tracking-[-0.01em] text-ink">{p.title}</h3>
                  <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">{p.body}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 03 — SPEED TO FIRST CALL (text left, race right) */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="03" label="Speed wins the site visit" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  A fresh enquiry is visible to a dozen builders at once.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  The buyer books a site visit with whoever calls while they&apos;re still deciding. Leadkaun surfaces the freshest, highest-fit enquiry at the top of the queue the moment it lands, so your rep dials in seconds, not after it&apos;s gone to the builder down the road.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7"><SpeedRace /></FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 04 — FEATURE GRID */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="04" label="The whole platform, for real estate" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Eight modules. Every one tuned to the enquiry-to-booking funnel.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Leadkaun isn&apos;t a lighter CRM, it&apos;s the lead-intelligence layer most builder CRMs are missing. Here&apos;s what each part does on a site.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ Icon, title: t, body, href }) => (
                <Link key={href} href={href} className="group block">
                  <FloatingCard tier="2" depth="2" gloss aura="sky" className="flex h-full flex-col p-6 transition-transform group-hover:-translate-y-0.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100"><Icon className="h-5 w-5" strokeWidth={2} /></span>
                    <p className="mt-4 text-[15.5px] font-semibold text-ink">{t}</p>
                    <p className="mt-2 flex-1 text-[13px] leading-[1.6] text-ink-soft">{body}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-sky-600">See how it works <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                  </FloatingCard>
                </Link>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 05 — WARM BEATS NEW (text left, re-rank right) */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="05" label="Warm beats new" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  A buyer who toured last week outranks ten fresh forms.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  The newest name always feels the most urgent, and that instinct loses bookings. The queue re-ranks the day by likelihood to book, so a Grade B who visited the project and replied on WhatsApp sits above a cold portal lead who filled ten forms in one sitting.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div>
                      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Gut feel</p>
                      {[["Cold form ×10", "C"], ["New portal lead", "C"], ["Toured last week", "B"], ["WhatsApp reply", "A"]].map(([l, g]) => (
                        <div key={l} className="mb-1.5 flex items-center gap-2 rounded-lg bg-white/60 p-2 ring-1 ring-black/5">
                          <GradeBadge grade={g as Grade} size="sm" />
                          <span className="truncate text-[11.5px] text-ink-soft">{l}</span>
                        </div>
                      ))}
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-sky-500" />
                    <div>
                      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Leadkaun queue</p>
                      {[["WhatsApp reply", "A", true], ["Toured last week", "B", false], ["New portal lead", "C", false], ["Cold form ×10", "C", false]].map(([l, g, hot]) => (
                        <div key={String(l)} className={`mb-1.5 flex items-center gap-2 rounded-lg p-2 ring-1 ${hot ? "bg-emerald-50/70 ring-emerald-200" : "bg-white/60 ring-black/5"}`}>
                          <GradeBadge grade={g as Grade} size="sm" />
                          <span className="truncate text-[11.5px] text-ink-soft">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 06 — SEGMENTS */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="06" tone="warm" label="One score, tuned per segment" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                An affordable 2BHK and a ₹5Cr villa aren&apos;t the same buyer.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                The Fit score reflects each lead&apos;s own price band and geography, so enquiries grade on their own merits across every project tier you sell.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {SEGMENTS.map(({ Icon, name, signal }) => (
                <FloatingCard key={name} tier="2" depth="2" gloss aura="sky" className="p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100"><Icon className="h-[18px] w-[18px]" strokeWidth={2} /></span>
                  <p className="mt-3.5 text-[14.5px] font-semibold text-ink">{name}</p>
                  <p className="mt-1.5 text-[12.5px] leading-[1.55] text-ink-soft">{signal}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 07 — FUNNEL + GRADES */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl">
              <NumberedTag number="07" label="From enquiry to booking" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                See the whole cohort narrow, and where it leaks.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Every enquiry is graded, so you can watch the batch move from portal list to booking, and see which grade band is falling out between contacted and site visit.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6">
              <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Booking funnel · illustrative</p>
                <div className="mt-5 space-y-3">
                  {FUNNEL.map((s) => (
                    <div key={s.stage}>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[13px] text-ink-soft">{s.stage}</span>
                        <span className="font-mono text-[12.5px] font-semibold tabular text-ink">{s.count.toLocaleString("en-IN")}<span className="ml-1.5 text-[11px] text-ink-muted">{Math.round((s.count / FUNNEL[0].count) * 100)}%</span></span>
                      </div>
                      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-black/[0.04]">
                        <div className="h-full rounded-full" style={{ width: `${(s.count / FUNNEL[0].count) * 100}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </FloatingCard>
              <FloatingCard tier="3" depth="3" gloss className="flex flex-col justify-center p-6 md:p-7">
                <GradeDistribution />
                <p className="mt-5 border-t pt-4 text-[12.5px] leading-snug text-ink-muted rule-paper">Grade A and B are your booking-ready buyers this week. The Missed Opportunity Engine flags any that slip before a site visit is set.</p>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 08 — ₹ CALCULATOR */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="08" label="What a cold enquiry costs" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Put a rupee figure on the site visits you&apos;re missing.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-9">
                <UseCaseRoiCalc cfg={ROI} />
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* INDUSTRY BENCHMARK */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
                <div className="grid md:grid-cols-[0.82fr_1.18fr]">
                  <div className="relative flex flex-col justify-center p-8 md:p-9" style={{ background: "linear-gradient(158deg,#EFF6FF 0%,#F0FDFA 100%)" }}>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">Industry benchmark</p>
                    <p className="mt-4 text-[34px] font-semibold leading-[1.04] tracking-[-0.03em] text-ink md:text-[40px]">
                      25 → 28 days
                      <br />
                      <span className="text-sky-600">to book.</span>
                    </p>
                    <p className="mt-3 text-[14px] leading-[1.55] text-ink-soft">Anarock&apos;s ASTRA analysis of 2.8M homebuyer leads: the average enquiry-to-booking cycle stretched from 25 days (2022) to 28 days (2024).</p>
                    <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted ring-1 ring-black/5">
                      <TrendingUp className="h-3 w-3 text-sky-500" strokeWidth={2.5} /> Source · Anarock ASTRA
                    </span>
                  </div>
                  <div className="p-8 md:p-9">
                    <p className="text-[16px] leading-[1.7] text-ink-soft">
                      A longer, multi-touch decision means the buyer talks to more builders before booking. Over a window that long, the teams that respond first and keep following up before leads go cold capture a disproportionate share.
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {[
                        { k: "First call", v: "Usually wins the site visit" },
                        { k: "28 days", v: "Room for follow-up to decide it" },
                        { k: "Multi-touch", v: "Warm leads need re-surfacing" },
                      ].map((s) => (
                        <div key={s.k} className="rounded-xl bg-sky-50/60 p-3.5 ring-1 ring-sky-100">
                          <p className="text-[13px] font-semibold text-ink">{s.k}</p>
                          <p className="mt-1 text-[11.5px] leading-[1.5] text-ink-soft">{s.v}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-6 border-t pt-5 text-[13.5px] leading-[1.65] text-ink-soft rule-paper">
                      Leadkaun turns a chaotic portal inbox into a ranked callback queue with a ₹ figure attached to the bookings you&apos;re about to lose, alongside your builder CRM, not instead of it.
                    </p>
                  </div>
                </div>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 09 — VOICES */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-2xl">
              <NumberedTag number="09" label="In their words" />
              <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">
                Nobody switches over a portal. They switch over the site visit they lost.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Voices /></Reveal>
          </Container>
        </SectionGround>

        {/* 10 — FAQ */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="10" label="FAQ" /></div>
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">Property sales questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* 11 — BY CITY */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="11" tone="warm" label="Real estate by city" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                Localised pages for top property markets.
              </h2>
              <p className="mt-4 text-[16px] leading-[1.55] text-ink-soft">
                City-level guides with local micro-markets, ticket bands, and the portals and channels that actually convert in each market.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CITIES.map((c) => (
                <Link key={c.href} href={c.href} className="group block">
                  <FloatingCard tier="2" depth="2" gloss aura="sky" className="flex items-center gap-3.5 p-5 transition-transform group-hover:-translate-y-0.5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100"><MapPin className="h-5 w-5" strokeWidth={2} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-semibold text-ink">{c.city}</span>
                      <span className="block text-[12px] text-ink-muted">Property leads in {c.city}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-sky-500 transition-transform group-hover:translate-x-0.5" />
                  </FloatingCard>
                </Link>
              ))}
            </Reveal>
            <Reveal delay={0.12} className="mt-10 border-t pt-6 rule-paper">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Keep reading</p>
              <div className="mt-3.5 flex flex-wrap items-center gap-x-6 gap-y-3">
                {GUIDES.map((g) => (
                  <Link key={g.href} href={g.href} className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
                    {g.label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 12 — PRICING */}
        <UseCasePricing
          headline="Flat per account, not per site executive."
          sub="Add the whole site team without the bill climbing seat by seat. Priced by team size and active-lead volume, free forever tier, no card, ~17% off on annual."
        />

        {/* CLOSING CTA */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-3xl border p-10 text-center md:p-14" style={{ borderColor: "var(--paper-line)", background: "linear-gradient(180deg,#FFFFFF, var(--paper))" }}>
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-96 rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle,#BAE6FD 0%,transparent 70%)" }} />
                <p className="ledger-num relative text-[11px] uppercase tracking-[0.22em] text-sky-600">Ready when you are</p>
                <h2 className="display-lg relative mx-auto mt-5 max-w-2xl text-[30px] text-ink md:text-[44px]">
                  Call the right buyer{" "}
                  <span className="relative inline-block text-sky-600">
                    before the builder next door.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  Import your portal and ad leads. Leadkaun grades every one and hands each rep a ranked callback queue the same day, with the ₹ at stake on top.
                </p>
                <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    How it works
                  </Link>
                </div>
                <p className="ledger-num relative mt-8 text-[11.5px] uppercase tracking-[0.16em] text-ink-muted">Free ₹0 · no card · same-day setup · runs alongside your CRM</p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <Footer />
      </main>
    </>
  )
}
