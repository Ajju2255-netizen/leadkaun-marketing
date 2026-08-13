import type { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { ArticleHeader, MEASURE } from "@/app/components/reading"
import { LEGAL_PAGES } from "@/app/components/legal-page"
import { ContactForm } from "@/app/components/contact-form"

export const metadata: Metadata = {
  title: "Contact Leadkaun Sales, Support & Partnerships",
  description:
    "Reach the Leadkaun team for sales questions, product support, or partnership enquiries. We respond within 4 business hours on WhatsApp or email.",
  alternates: { canonical: "/contact" },
}

/** One row per inbox, so the reader can skip the form if they know who they want. */
const CHANNELS = [
  { label: "Sales",        desc: "Pricing, onboarding, team demos",         handle: "sales@leadkaun.com" },
  { label: "Support",      desc: "Help with your account or integrations",  handle: "support@leadkaun.com" },
  { label: "Partnerships", desc: "Reseller, referral, API integrations",    handle: "partnerships@leadkaun.com" },
  { label: "Legal & privacy", desc: "Policies, DPAs, data requests, abuse", handle: "team@leadkaun.com" },
]

export default function ContactPage() {
  const otherPolicies = LEGAL_PAGES.filter((p) => p.href !== "/contact")

  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <ArticleHeader
        kicker="Contact"
        title="Get in touch."
        dek="We're a small team, and every message is read by a person. Expect a reply within 4 business hours, Monday to Saturday, 9 AM to 7 PM IST. No ticketing black hole, no round-robin bot."
        meta={["Replies within 4 business hours", "Mon–Sat · 9 AM–7 PM IST"]}
      />

      <SectionGround variant="pure" size="lg">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:gap-20">
            {/* FORM */}
            <div>
              <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                Send a message
              </p>
              <h2 className="mt-4 text-[24px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[28px]">
                Tell us what you need.
              </h2>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            {/* DIRECT CHANNELS */}
            <aside>
              <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                Or go straight to an inbox
              </p>
              <ul className="mt-5 border-t" style={{ borderColor: "var(--paper-line-2)" }}>
                {CHANNELS.map((c) => (
                  <li key={c.handle + c.label} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                    <a href={`mailto:${c.handle}`} className="group block py-4">
                      <p className="text-[15px] font-semibold text-ink group-hover:text-sky-700">{c.label}</p>
                      <p className="mt-1 text-[13px] leading-[1.5] text-ink-muted">{c.desc}</p>
                      <p className="ledger-num mt-2 text-[12px] text-sky-700 group-hover:text-sky-600">{c.handle}</p>
                    </a>
                  </li>
                ))}
              </ul>

              <div
                className="mt-8 rounded-2xl bg-[color:var(--paper)] p-6"
                style={{ border: "1px solid var(--paper-line)", boxShadow: "inset 3px 0 0 #EA580C" }}
              >
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-500">
                  Fastest reply
                </p>
                <p className="mt-3 text-[15px] font-semibold text-ink">WhatsApp to sales</p>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-ink-soft">
                  We typically respond within 2 hours during IST business hours, Monday to Saturday, 9 AM to 7 PM.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </SectionGround>

      {/* WHAT NOT TO SEND HERE — routes the awkward stuff before it arrives */}
      <SectionGround variant="cream" size="md">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
            <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">
              Before you write
            </p>
            <div>
              <div className={`space-y-4 text-[15px] leading-[1.7] text-ink-soft md:text-[16px] ${MEASURE}`}>
                <p>
                  If you&apos;re evaluating Leadkaun against something else, the{" "}
                  <Link href="/compare" className="text-sky-700 underline underline-offset-2 hover:text-sky-600">comparison pages</Link>{" "}
                  answer most of it, including where the other tool wins. Pricing is published in full on the{" "}
                  <Link href="/pricing" className="text-sky-700 underline underline-offset-2 hover:text-sky-600">pricing page</Link> —
                  there is no quote to request.
                </p>
                <p>
                  For a data request, a DPA, an abuse report or an IPR notice, use{" "}
                  <a href="mailto:team@leadkaun.com" className="text-sky-700 underline underline-offset-2 hover:text-sky-600">team@leadkaun.com</a>{" "}
                  with the reason in the subject line. The relevant policy pages set out what to include.
                </p>
              </div>

              <ul className="mt-8 grid gap-x-12 sm:grid-cols-2">
                {otherPolicies.map((p) => (
                  <li key={p.href} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                    <Link href={p.href} className="group flex items-baseline justify-between gap-4 py-3">
                      <span className="text-[14px] text-ink group-hover:text-sky-700">{p.label}</span>
                      <span aria-hidden className="ledger-num text-[12px] text-ink-faint group-hover:text-sky-700">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </SectionGround>

      <Footer />
    </main>
  )
}
