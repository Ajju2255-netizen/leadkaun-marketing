import type { Metadata } from "next"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { Reveal } from "@/app/components/reveal"
import { LedgerCTA } from "@/app/components/ledger"
import { AppReplica } from "@/app/components/app-replica"
import { breadcrumbListSchema, jsonLdScript, canonical, ogMeta } from "@/lib/seo"

/**
 * The pre-signup demo.
 *
 * `/demo` used to `permanentRedirect` to the register page — the booking flow
 * was retired and nothing replaced it, so the most demo-intent URL on the site
 * sent people straight to a form. Meanwhile a fully interactive replica of the
 * product (real reducer, real A–F grading weights, 14 views) already shipped
 * unauthenticated, but only as a section buried inside the homepage and three
 * feature pages, with no address of its own.
 *
 * This gives it one. It is the bridge between search traffic and activation:
 * someone who arrived from a buyer guide can work a ranked queue, open a lead
 * and see what "₹ at risk" means before deciding whether to hand over an email.
 *
 * The 24 leads here match the 24-lead Sample workspace a real account is given
 * at signup (leadkaun/lib/workspace/sample-data.ts), so "Explore 24 example
 * leads" is the same promise on both sides of the form.
 */

const title = "Try Leadkaun with 24 Example Leads"
const description =
  "Work a ranked queue, open a graded lead and see the ₹ going cold — no signup. The same 24 example leads a new account starts with."
const path = "/demo"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonical(path) },
  ...ogMeta({ title, description, path }),
  robots: { index: true, follow: true },
}

export default function DemoPage() {
  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Demo" }]),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <SectionGround variant="cream" size="sm" ambient={false} className="pt-28 md:pt-32">
          <Container>
            <Reveal className="max-w-3xl">
              <p className="ledger-num text-[11px] uppercase tracking-[0.22em] text-sky-600">
                Interactive demo · no signup
              </p>
              <h1 className="display-lg mt-6 text-[38px] text-ink md:text-[54px]">
                Twenty-four leads. Which three would you call?
              </h1>
              <p className="mt-6 text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                This is the product, running in your browser on example data. Every lead is graded
                A–F on fit, intent and quality. Open the Priority Queue to see the order Leadkaun
                would put your reps in, or Missed Opportunities to see the money already going cold.
                Nothing here is saved and nothing is sent.
              </p>
            </Reveal>
          </Container>
        </SectionGround>

        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal>
              <AppReplica initialView="queue" />
            </Reveal>
            <p className="mt-6 text-center text-[13px] text-ink-muted">
              Example data. The same 24 leads land in your account at signup, so you can try it
              before importing anything of your own.
            </p>
          </Container>
        </SectionGround>

        <LedgerCTA
          headline="Now run it on your own leads."
          sub="Import a CSV or connect a Google Sheet, and every lead comes back graded with a ranked queue per rep. Setup the same day."
          primaryLabel="Start free"
        />
        <Footer />
      </main>
    </>
  )
}
