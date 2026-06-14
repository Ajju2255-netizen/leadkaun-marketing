import type { Metadata } from "next"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { FloatingCard } from "@/app/components/floating-card"

export const metadata: Metadata = {
  title: "Terms of Service — Leadkaun",
  description: "Leadkaun's terms of service: your rights and obligations as a subscriber to the Leadkaun platform.",
  alternates: { canonical: "/terms" },
}

const SECTIONS: { n: string; title: string; body: string }[] = [
  { n: "01", title: "Definitions", body: `"Leadkaun", "we", "us" refers to the operator of the Leadkaun platform.
"Service" refers to the Leadkaun software platform, including all features and APIs.
"Subscriber" or "you" refers to the individual or company that has created an account and accepted these terms.
"Lead data" refers to records, contacts, and associated information imported into or created within the Service.` },
  { n: "02", title: "Use of the service", body: `You may use Leadkaun solely for your internal business purposes. You agree not to:
• Resell or sublicense access to the Service.
• Use the Service to store or process data in violation of applicable law.
• Attempt to reverse-engineer, decompile, or extract source code.
• Use automated tools to scrape or overload the Service.
• Use the Service to send unsolicited communications.

You are responsible for maintaining the security of your account credentials.` },
  { n: "03", title: "Subscriptions and payment", body: `Leadkaun is offered on monthly or annual subscription plans. Prices are listed in Indian Rupees (INR) inclusive of GST where applicable.

Payments are processed by Razorpay. By subscribing, you authorise recurring charges to your selected payment method on each renewal date.

Annual plans are non-refundable after 14 days from the date of purchase. Monthly plans can be cancelled at any time; you retain access until the end of the current billing period.

We reserve the right to change pricing with 30 days' notice. Existing subscribers on annual plans are not subject to price changes during their current term.` },
  { n: "04", title: "Free trial", body: `Certain plans include a free trial period. No credit card is required to start a free trial. If you upgrade during or at the end of the trial, your paid term begins from the date of first payment.

We may terminate a free-trial account that shows signs of abuse (e.g. multiple trial accounts per organisation).` },
  { n: "05", title: "Your data", body: `You own all lead data and content you input into the Service. We do not claim any intellectual-property rights over your data.

You grant Leadkaun a limited licence to process your data solely to provide the Service (e.g. running the scoring engine, generating the Morning Brief).

You may export your data at any time. Upon account termination, we retain your data for 90 days before permanent deletion, as described in our Privacy Policy.` },
  { n: "06", title: "Service availability", body: `We aim for 99.5% monthly uptime excluding scheduled maintenance. Scheduled maintenance will be notified at least 24 hours in advance via in-app notice or email.

We do not guarantee uninterrupted or error-free operation. In the event of an outage lasting more than 24 consecutive hours, affected subscribers may request a pro-rated credit for the affected period.` },
  { n: "07", title: "Limitation of liability", body: `To the maximum extent permitted by law, Leadkaun's total liability for any claim arising from your use of the Service shall not exceed the amount you paid in the 3 months preceding the claim.

We are not liable for indirect, incidental, consequential, or punitive damages, including lost profits or revenue, even if we have been advised of the possibility of such damages.` },
  { n: "08", title: "Termination", body: `You may cancel your subscription at any time via account settings or by contacting support@leadkaun.com.

We may suspend or terminate your account if you breach these terms, fail to pay fees, or engage in behaviour that poses a risk to other users or the platform. We will provide reasonable notice before termination unless the breach is severe.` },
  { n: "09", title: "Governing law", body: `These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in [City], India.` },
  { n: "10", title: "Changes to these terms", body: `We may update these terms from time to time. We will notify subscribers of material changes by email at least 14 days before they take effect. Continued use of the Service after that date constitutes acceptance of the updated terms.

For questions about these terms, contact us at legal@leadkaun.com.` },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <DetailHero
        eyebrow="Legal · Last updated April 2026"
        h1="Terms of Service"
        sub="The agreement between you and Leadkaun. Short, plainly written, and no hidden asterisks."
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
