import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { breadcrumbListSchema, jsonLdScript } from "@/lib/seo"

/* ============================================================================
   LEGAL DOCUMENT
   ----------------------------------------------------------------------------
   Policy pages are read two ways: skimmed for one clause, or read end to end
   by someone doing diligence. So they get numbered clauses with stable
   anchors, a sticky contents rail, and a measured column — no cards, no
   marketing furniture, and every policy cross-linked at the foot so a reader
   who lands on one can find the rest.

   Placeholders are written as [Bracketed Text] on purpose. They mark facts
   only the company can supply (registered entity, address, grievance officer)
   and are meant to be obvious, not quietly plausible.
   ========================================================================== */

export type LegalSection = { title: string; body: string }

/** All policies, so every document links to its siblings. */
export const LEGAL_PAGES: { label: string; href: string }[] = [
  { label: "Contact Us",       href: "/contact" },
  { label: "Security",         href: "/security" },
  { label: "Compliance",       href: "/compliance" },
  { label: "IPR Complaints",   href: "/ipr" },
  { label: "Anti-spam Policy", href: "/anti-spam" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy",   href: "/privacy" },
  { label: "Cookie Policy",    href: "/cookie-policy" },
  { label: "GDPR Compliance",  href: "/gdpr" },
  { label: "Abuse Policy",     href: "/abuse" },
]

function clauseId(i: number) {
  return `clause-${i + 1}`
}

/**
 * Renders the plain-text body.
 *
 * Blank lines separate blocks. Inside a block, runs of "• " lines become a
 * list and everything else becomes prose — a block may contain both, e.g. a
 * lead-in sentence followed by bullets. Single newlines inside a prose run are
 * significant (definition entries, "Email: … / Postal: …") so they are kept as
 * line breaks rather than collapsed into one paragraph.
 */
function Body({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/)

  return (
    <div className="mt-4 space-y-4 text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
      {blocks.map((block, bi) => {
        // Split the block into alternating prose / bullet runs.
        const runs: { bullet: boolean; lines: string[] }[] = []
        for (const line of block.split("\n")) {
          if (!line.trim()) continue
          const bullet = line.trim().startsWith("•")
          const last = runs[runs.length - 1]
          if (last && last.bullet === bullet) last.lines.push(line)
          else runs.push({ bullet, lines: [line] })
        }

        return (
          <div key={bi} className="space-y-3">
            {runs.map((run, ri) =>
              run.bullet ? (
                <ul key={ri} className="space-y-2">
                  {run.lines.map((l, li) => (
                    <li key={li} className="flex gap-3">
                      <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                      <span>{l.replace(/^\s*•\s*/, "")}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p key={ri}>
                  {run.lines.map((l, li) => (
                    <span key={li}>
                      {li > 0 && <br />}
                      {l}
                    </span>
                  ))}
                </p>
              ),
            )}
          </div>
        )
      })}
    </div>
  )
}

export function LegalPage({ title, kicker = "Legal", intro, updated, effective, sections, current }: {
  title: string
  kicker?: string
  intro: string
  /** e.g. "13 August 2026" */
  updated: string
  effective?: string
  sections: LegalSection[]
  /** href of this page, so it is not linked to itself in the footer register. */
  current: string
}) {
  const others = LEGAL_PAGES.filter((p) => p.href !== current)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: title }])]),
        }}
      />
      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <SectionGround variant="pure" size="sm" ambient={false} className="pt-28 !pb-0 md:pt-32">
          <Container>
            <p className="ledger-num text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">{kicker}</p>
            <h1 className="display-lg mt-6 max-w-[20ch] text-[36px] text-ink md:text-[52px]">{title}</h1>
            <p className="mt-6 max-w-[68ch] text-[17px] leading-[1.65] text-ink-soft md:text-[18px]">{intro}</p>
            <p className="ledger-num mt-8 border-t pt-5 text-[11px] uppercase tracking-[0.14em] text-ink-muted" style={{ borderColor: "var(--paper-line)" }}>
              Last updated {updated}
              {effective && (
                <>
                  <span aria-hidden className="mx-2 text-ink-faint">·</span>
                  Effective {effective}
                </>
              )}
              <span aria-hidden className="mx-2 text-ink-faint">·</span>
              {sections.length} clauses
            </p>
          </Container>
        </SectionGround>

        <SectionGround variant="pure" size="md" className="!overflow-visible">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-16">
              <nav aria-label="Contents" className="lg:sticky lg:top-24 lg:self-start">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Contents</p>
                <ol className="mt-4 space-y-2.5 border-l pl-4" style={{ borderColor: "var(--paper-line)" }}>
                  {sections.map((s, i) => (
                    <li key={s.title} className="flex gap-2.5">
                      <span className="ledger-num shrink-0 pt-0.5 text-[10px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                      <a href={`#${clauseId(i)}`} className="text-[13px] leading-[1.45] text-ink-soft transition-colors hover:text-sky-700">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div>
                {sections.map((s, i) => (
                  <section
                    key={s.title}
                    id={clauseId(i)}
                    className="scroll-mt-28 border-t py-8 first:border-t-0 first:pt-0 md:py-10 md:first:pt-0"
                    style={{ borderColor: "var(--paper-line)" }}
                  >
                    <div className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 md:grid-cols-[56px_minmax(0,1fr)] md:gap-x-6">
                      <span className="ledger-num pt-1 text-[13px] font-semibold text-sky-700 tabular md:text-[15px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="max-w-[68ch]">
                        <h2 className="text-[20px] font-semibold leading-snug tracking-[-0.015em] text-ink md:text-[23px]">
                          {s.title}
                        </h2>
                        <Body text={s.body} />
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </Container>
        </SectionGround>

        {/* THE REST OF THE POLICIES */}
        <SectionGround variant="cream" size="md">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-16">
              <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1">
                Other policies
              </p>
              <ul className="grid gap-x-12 sm:grid-cols-2">
                {others.map((p) => (
                  <li key={p.href} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                    <Link href={p.href} className="group flex items-baseline justify-between gap-4 py-3">
                      <span className="text-[14px] text-ink group-hover:text-sky-700">{p.label}</span>
                      <span aria-hidden className="ledger-num text-[12px] text-ink-faint group-hover:text-sky-700">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </SectionGround>

        <Footer />
      </main>
    </>
  )
}
