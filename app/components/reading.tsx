import Link from "next/link"
import type { ReactNode } from "react"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"

/* ============================================================================
   READING PRIMITIVES — /learn, /blog, /research
   ----------------------------------------------------------------------------
   The buyer pages (/compare, /alternatives, /best) are a register: label
   gutter, hairlines, tabular figures, no prose longer than a paragraph.

   The library pages are the opposite job — someone is here to read 2,000
   words. So they get a reading layout instead: a measured column of about 68
   characters, a sticky contents rail that tracks where you are in the piece,
   and generous leading. Nothing from the ledger spine applies here on purpose;
   a syllabus should not look like a spec sheet.
   ========================================================================== */

/** ~68 characters — the measure long-form prose is comfortable at. */
export const MEASURE = "max-w-[68ch]"

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

/** Rough reading time, at 220 words per minute. */
export function readingTime(text: string): number {
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / 220))
}

/* --- Article header ------------------------------------------------------- */

export function ArticleHeader({ kicker, title, dek, meta, actions }: {
  kicker: ReactNode
  title: string
  dek?: string
  /** Short facts: reading time, topic count, updated date. */
  meta?: string[]
  actions?: ReactNode
}) {
  return (
    <SectionGround variant="pure" size="sm" ambient={false} className="pt-28 md:pt-32">
      <Container>
        <div className="max-w-[52rem]">
          <p className="ledger-num text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">{kicker}</p>
          <h1 className="display-lg mt-6 text-[38px] text-ink md:text-[56px]">{title}</h1>
          {dek && <p className={`mt-6 text-[18px] leading-[1.6] text-ink-soft md:text-[20px] ${MEASURE}`}>{dek}</p>}
          {meta && meta.length > 0 && (
            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1">
              {meta.map((m, i) => (
                <span key={m} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden className="ledger-num text-[10px] text-ink-faint">·</span>}
                  <span className="ledger-num text-[11px] uppercase tracking-[0.14em] text-ink-muted">{m}</span>
                </span>
              ))}
            </div>
          )}
          {actions && <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">{actions}</div>}
        </div>
      </Container>
    </SectionGround>
  )
}

/* --- Contents rail -------------------------------------------------------- */

/**
 * Two-column reading layout: a sticky contents rail on the left, the measured
 * article column on the right. The rail collapses to a plain inline contents
 * list on small screens, where stickiness would only steal height.
 */
export function ReadingLayout({ contents, children, railLabel = "Contents" }: {
  contents: { id: string; label: string }[]
  children: ReactNode
  railLabel?: string
}) {
  return (
    <SectionGround variant="pure" size="md" className="!overflow-visible">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,200px)_minmax(0,1fr)] lg:gap-16">
          {contents.length > 0 ? (
            <nav aria-label={railLabel} className="lg:sticky lg:top-24 lg:self-start">
              <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">{railLabel}</p>
              <ol className="mt-4 space-y-2.5 border-l pl-4" style={{ borderColor: "var(--paper-line)" }}>
                {contents.map((c, i) => (
                  <li key={c.id} className="flex gap-2.5">
                    <span className="ledger-num shrink-0 pt-0.5 text-[10px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                    <a href={`#${c.id}`} className="text-[13px] leading-[1.45] text-ink-soft transition-colors hover:text-sky-700">
                      {c.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : (
            <div aria-hidden />
          )}
          <div>{children}</div>
        </div>
      </Container>
    </SectionGround>
  )
}

/* --- Prose ---------------------------------------------------------------- */

export function ProseSection({ id, heading, children }: { id: string; heading: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 pt-12 first:pt-0">
      <h2 className="text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">{heading}</h2>
      <div className={`mt-5 space-y-5 text-[17px] leading-[1.75] text-ink-soft md:text-[18px] ${MEASURE}`}>{children}</div>
    </section>
  )
}

/** Boxed lead-in: what the reader will get out of the piece. */
export function TakeawayBox({ label = "What you'll learn", items }: { label?: string; items: string[] }) {
  return (
    <aside className={`rounded-2xl bg-[color:var(--paper)] p-6 md:p-8 ${MEASURE}`} style={{ border: "1px solid var(--paper-line)" }}>
      <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">{label}</p>
      <ul className="mt-4 space-y-3">
        {items.map((t, i) => (
          <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.6] text-ink md:text-[16px]">
            <span className="ledger-num mt-0.5 shrink-0 text-[11px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

/* --- Syllabus register (hub) ---------------------------------------------- */

/**
 * The library index reads as a syllabus: chapter number, title set in the
 * display serif, a one-line dek and a count of what is inside.
 */
export function Syllabus({ items }: {
  items: { href: string; title: string; dek: string; count?: string }[]
}) {
  return (
    <ol className="border-t" style={{ borderColor: "var(--paper-line-2)" }}>
      {items.map((it, i) => (
        <li key={it.href} style={{ borderBottom: "1px solid var(--paper-line)" }}>
          <Link href={it.href} className="group grid gap-x-8 gap-y-2 py-7 md:grid-cols-[64px_minmax(0,1fr)_auto] md:py-8">
            <span className="ledger-num text-[13px] font-semibold text-ink-faint tabular md:pt-2 md:text-[15px]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-[24px] leading-tight tracking-[-0.02em] text-ink transition-colors group-hover:text-sky-700 md:text-[28px]">
                {it.title}
              </h3>
              <p className={`mt-2 text-[15px] leading-[1.6] text-ink-soft ${MEASURE}`}>{it.dek}</p>
            </div>
            {it.count && (
              <span className="ledger-num self-start text-[10px] uppercase tracking-[0.14em] text-ink-muted md:pt-3">
                {it.count}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ol>
  )
}
