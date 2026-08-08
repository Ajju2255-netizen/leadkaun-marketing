import type { Metadata } from "next"
import { BarChart3, ListOrdered, AlertTriangle, Mail, MessageSquare, Users, FileSearch, History } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { ProductBlock } from "@/app/components/sell/blocks"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { breadcrumbListSchema, jsonLdScript, canonical } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Lead Management & Lead Scoring Features for Indian B2B Teams",
  description:
    "Every Leadkaun module in one place: A–F lead scoring, the Priority Queue, the Missed Opportunity Engine, the 8:30 AM Morning Brief, WhatsApp tracking, and sales-rep tracking — built for how Indian B2B teams sell.",
  alternates: { canonical: "/features" },
}

const FEATURES = [
  { icon: BarChart3,     href: "/features/lead-scoring",              title: "Lead Scoring Engine",       description: "Grade every lead A–F in real time on Fit, Intent and Quality. Transparent, fixed weights — a rep can always see why a lead is Grade A." },
  { icon: ListOrdered,   href: "/features/priority-queue",            title: "Priority Queue",            description: "One ranked list per rep that re-ranks live as signals arrive. Reps work top-down instead of triaging their inbox." },
  { icon: AlertTriangle, href: "/features/missed-opportunity-engine", title: "Missed Opportunity Engine", description: "Every stale lead gets a rupee value, so the ₹ at risk becomes a number you can rank and act on — not a feeling." },
  { icon: Mail,          href: "/features/morning-brief",             title: "Morning Brief",             description: "An 8:30 AM IST email listing the day's Grade A leads, overdue follow-ups, and ₹ at risk. The day starts with a plan." },
  { icon: MessageSquare, href: "/features/whatsapp-tracking",         title: "WhatsApp Tracking",         description: "WhatsApp as a first-class signal. Log each exchange in three taps from any regular account — it feeds the Intent Score." },
  { icon: Users,         href: "/features/sales-rep-tracking",        title: "Sales Rep Tracking",        description: "Per-rep ₹ recovered, Grade A response time, and follow-up completion — behaviour over vanity activity counts." },
  { icon: FileSearch,   href: "/features/intake-intelligence",        title: "Intake Intelligence",       description: "See what is actually in a lead file before you import it — valid phones, duplicates, missing fields, B2B or not." },
  { icon: History,      href: "/features/score-evolution",            title: "Score Evolution",           description: "Every grade change written to an append-only timeline, so a drop traces back to the event that caused it." },
]

export default function FeaturesHub() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([
        breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Features" }]),
        { "@context": "https://schema.org", "@type": "ItemList", name: "Leadkaun features",
          itemListElement: FEATURES.map((f, i) => ({ "@type": "ListItem", position: i + 1, name: f.title, url: canonical(f.href) })) },
      ]) }} />
      <Navbar />

      <PageHero
        eyebrow="Features · 6 core modules"
        h1={<>The layer your CRM is missing —<br /><span className="hero-accent">module by module.</span></>}
        sub="A CRM records what happened. Leadkaun reshapes what happens next. Here is every behaviour module, and exactly what each one does for an Indian B2B sales team."
        primary={undefined}
      />

      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="mb-10 md:mb-14">
            <NumberedTag number="01" tone="warm" label="The behaviour core" />
            <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
              Six modules that reshape the day.
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">
              The jobs a CRM was never designed for — grading, prioritising, alerting, and recovering revenue your team was losing silently.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.href} {...f} variant={i % 2 === 1 ? "soft" : "default"} />
            ))}
          </div>
        </Container>
      </SectionGround>

      <ProductBlock />

      <CTABanner />
      <Footer />
    </main>
  )
}
