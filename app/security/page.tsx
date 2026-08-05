import type { Metadata } from "next"
import Link from "next/link"
import { Lock, CreditCard, Server, Users, Database, ShieldAlert, FileCheck } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"
import { QuickAnswer } from "@/app/components/quick-answer"

export const metadata: Metadata = {
  title: "Security & Data Protection — Leadkaun",
  description:
    "How Leadkaun protects your sales data — encryption in transit and at rest, PCI-DSS-compliant payments via Razorpay, role-based access, and responsible disclosure.",
  alternates: { canonical: "/security" },
}

const PRACTICES = [
  { icon: Lock, title: "Encryption in transit & at rest", body: "All traffic to Leadkaun is served over HTTPS/TLS. Your data is stored on managed cloud infrastructure that encrypts data at rest by default." },
  { icon: CreditCard, title: "Payments never touch our servers", body: "Payments are processed by Razorpay, a PCI-DSS Level 1 certified provider. Leadkaun never sees or stores your card details — Razorpay handles them end-to-end." },
  { icon: Users, title: "Role-based access", body: "Team and admin controls let you decide who sees and does what — Admin, Manager and Rep roles, per-workspace data separation, and a full audit export. Each account's data is kept separate." },
  { icon: Server, title: "Managed, resilient infrastructure", body: "Leadkaun runs on managed cloud platforms (edge delivery via Cloudflare; managed databases for application data) that maintain their own physical and network security and durability." },
  { icon: Database, title: "Data you control", body: "Your lead data is yours. You can export it at any time, and we'll delete it on request when you close your account. We don't sell your data." },
  { icon: FileCheck, title: "Privacy by design", body: "We collect what the product needs to work and no more. See our Privacy Policy and Terms for how data is handled, retained, and processed." },
]

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow={<><Lock className="h-3 w-3" strokeWidth={2} /> Security</>}
        h1={<>Your sales data, <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>handled carefully.</span></>}
        sub="Leadkaun holds your leads, contacts, and pipeline — so we treat that data with the care it deserves. Here's how we protect it, in plain language."
        primary={{ kind: "primary", label: "Talk to us about security", href: "/contact" }}
        secondary={{ kind: "glass", label: "Read the Privacy Policy", href: "/privacy" }}
      />

      <SectionGround variant="pure" size="sm">
        <Container>
          <QuickAnswer
            question="How does Leadkaun keep my data secure?"
            answer="Leadkaun serves all traffic over HTTPS/TLS and stores data on managed cloud infrastructure that encrypts it at rest. Payments run through Razorpay (PCI-DSS Level 1 certified), so card details never touch our servers. Access is controlled by roles, your data stays separate per account, and you can export or delete it anytime."
          />
        </Container>
      </SectionGround>

      <SectionGround variant="cream" size="lg">
        <Container>
          <Reveal className="mb-12 md:mb-16 max-w-3xl">
            <NumberedTag number="01" tone="warm" label="How we protect your data" />
            <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
              The practices behind the product.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6">
            {PRACTICES.map((p) => (
              <FloatingCard key={p.title} tier="3" depth="3" gloss className="p-7 md:p-8">
                <p.icon className="h-6 w-6 text-sky-500" strokeWidth={1.75} aria-hidden />
                <h3 className="mt-4 text-[19px] font-semibold tracking-[-0.01em] text-ink">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-ink-soft">{p.body}</p>
              </FloatingCard>
            ))}
          </Reveal>
        </Container>
      </SectionGround>

      {/* RESPONSIBLE DISCLOSURE */}
      <SectionGround variant="sky" size="md">
        <Container>
          <Reveal className="mx-auto max-w-3xl">
            <FloatingCard tier="2" depth="2" gloss className="p-8 md:p-10" aura="sky">
              <ShieldAlert className="h-6 w-6 text-orange-400" strokeWidth={1.75} aria-hidden />
              <h2 className="mt-4 text-[24px] font-semibold tracking-[-0.02em] text-ink">Found a vulnerability?</h2>
              <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">
                We appreciate responsible disclosure. If you believe you've found a security issue, email{" "}
                <a href="mailto:support@leadkaun.com" className="font-semibold text-sky-600 hover:text-sky-500">support@leadkaun.com</a>{" "}
                with the details and steps to reproduce. Please give us reasonable time to investigate and fix before disclosing publicly. We won't pursue action against good-faith research.
              </p>
            </FloatingCard>
          </Reveal>
        </Container>
      </SectionGround>

      {/* ENTERPRISE */}
      <SectionGround variant="cream" size="md">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-ink">Security review or questionnaire?</h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">
              Evaluating Leadkaun for a larger team and need a security questionnaire, a data-processing agreement, or details on our infrastructure? <Link href="/contact" className="font-semibold text-sky-600 hover:text-sky-500">Get in touch</Link> and we'll walk you through it.
            </p>
          </Reveal>
        </Container>
      </SectionGround>

      <CTABanner />
      <Footer />
    </main>
  )
}
