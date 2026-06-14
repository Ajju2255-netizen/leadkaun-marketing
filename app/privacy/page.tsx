import type { Metadata } from "next"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { FloatingCard } from "@/app/components/floating-card"

export const metadata: Metadata = {
  title: "Privacy Policy — Leadkaun",
  description: "Leadkaun's privacy policy: what data we collect, how we use it, and your rights as a user.",
  alternates: { canonical: "/privacy" },
}

const SECTIONS: { n: string; title: string; body: string }[] = [
  { n: "01", title: "Data we collect", body: `When you use Leadkaun, we collect:
• Account information — name, work email, phone number, company name.
• Lead data — the records you import or create, including names, phone numbers, emails, and custom fields.
• Usage data — how you interact with the product: pages visited, features used, actions logged.
• Device data — browser type, IP address, operating system — used for security and analytics.

We do not collect payment card details directly. Payments are processed by Razorpay, subject to their privacy policy.` },
  { n: "02", title: "How we use your data", body: `We use your data to:
• Provide and improve the Leadkaun service.
• Send the Morning Brief and other product notifications you have opted into.
• Respond to support requests.
• Prevent fraud and maintain security.
• Comply with legal obligations.

We do not sell your data to third parties.` },
  { n: "03", title: "Storage and security", body: `Your data is stored on servers located in India and/or Singapore. We use industry-standard encryption (TLS in transit, AES-256 at rest) and strict access controls to protect your data.

Lead data is logically isolated per account. No other Leadkaun customer can access your lead records.` },
  { n: "04", title: "Third-party services", body: `Leadkaun uses the following third-party services that may process your data:
• Razorpay — payment processing
• Cloudflare — infrastructure and security
• Google Analytics — anonymised usage analytics
• WhatsApp Business API (optional) — message tracking for opted-in integrations

Each provider is subject to their own privacy policy and data-processing terms.` },
  { n: "05", title: "Your rights", body: `You have the right to:
• Access the personal data we hold about you.
• Correct inaccurate data.
• Request deletion of your account and associated data.
• Export your lead data at any time from within the app.
• Withdraw consent for non-essential communications.

To exercise any of these rights, contact us at privacy@leadkaun.com.` },
  { n: "06", title: "Data retention", body: `We retain your data for as long as your account is active. If you cancel your subscription, we retain your data for 90 days to allow recovery, after which it is permanently deleted from our systems.

Anonymised, aggregated usage data may be retained indefinitely for product improvement.` },
  { n: "07", title: "Cookies", body: `Leadkaun uses essential cookies (for authentication and session management) and analytics cookies (to understand feature usage). You can disable analytics cookies via your browser settings without affecting core product functionality.` },
  { n: "08", title: "Contact", body: `For privacy-related questions or to exercise your rights:

Email: privacy@leadkaun.com
Postal: Leadkaun, [Registered Address], India

We aim to respond to all privacy requests within 7 business days.` },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <DetailHero
        eyebrow="Legal · Last updated April 2026"
        h1="Privacy Policy"
        sub="We take your lead data seriously — because your buyers trusted you with it. This document tells you exactly what we collect, why, and how you keep control."
      />

      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="mx-auto max-w-3xl">
            <FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
              <ol className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                {SECTIONS.map((s, i) => (
                  <li key={s.title} className="grid gap-6 px-7 py-8 md:grid-cols-[auto_1fr] md:gap-10 md:px-10">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-mono text-[14px] font-bold text-white"
                      style={{
                        background: i % 3 === 1 ? "linear-gradient(180deg, #FDBA74 0%, #FB923C 100%)" : "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 10px rgba(14,165,233,0.30)",
                      }}
                    >
                      {s.n}
                    </span>
                    <div>
                      <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink md:text-[22px]">{s.title}</h2>
                      <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </FloatingCard>
          </div>
        </Container>
      </SectionGround>

      <Footer />
    </main>
  )
}
