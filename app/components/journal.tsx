import Link from "next/link"

import { CATEGORIES } from "@/lib/blog"

/* ============================================================================
   JOURNAL — /blog
   ----------------------------------------------------------------------------
   The blog is an archive, so it reads like one: entries in reverse date order
   with the date hanging in the left margin, category as a coloured tick rather
   than a chip, and no cards. The date is the organising fact here — not the
   thumbnail, which we don't have, and not the category, which is secondary.
   ========================================================================== */

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
}

export function shortDate(d: string) {
  const dt = new Date(d)
  return {
    day: dt.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: dt.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
    year: String(dt.getFullYear()),
  }
}

export function categoryColor(slug?: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.color ?? "var(--paper-line-2)"
}

export function categoryTitle(slug?: string): string | null {
  return CATEGORIES.find((c) => c.slug === slug)?.title ?? null
}

export type JournalItem = {
  slug: string
  title: string
  description: string
  date: string
  category?: string
  readingTime?: string
}

/** One archive entry: date in the margin, a colour tick for the category. */
export function JournalEntry({ post }: { post: JournalItem }) {
  const d = shortDate(post.date)
  const cat = categoryTitle(post.category)
  return (
    <li style={{ borderBottom: "1px solid var(--paper-line)" }}>
      <Link href={`/blog/${post.slug}`} className="group grid gap-x-10 gap-y-3 py-7 md:grid-cols-[minmax(0,84px)_minmax(0,1fr)] md:py-8">
        <time dateTime={post.date} className="flex items-baseline gap-2 md:block">
          <span className="ledger-num block text-[22px] font-semibold leading-none text-ink tabular md:text-[26px]">{d.day}</span>
          <span className="ledger-num mt-1 block text-[10px] uppercase tracking-[0.16em] text-ink-muted">{d.month} {d.year}</span>
        </time>

        <div>
          {cat && (
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="inline-block h-2 w-2 rounded-full" style={{ background: categoryColor(post.category) }} />
              <span className="ledger-num text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{cat}</span>
            </span>
          )}
          <h3 className="mt-2 text-[20px] font-semibold leading-snug tracking-[-0.015em] text-ink transition-colors group-hover:text-sky-700 md:text-[23px]">
            {post.title}
          </h3>
          <p className="mt-2 max-w-[72ch] text-[15px] leading-[1.6] text-ink-soft">{post.description}</p>
          {post.readingTime && (
            <p className="ledger-num mt-3 text-[10px] uppercase tracking-[0.14em] text-ink-faint">{post.readingTime}</p>
          )}
        </div>
      </Link>
    </li>
  )
}

/** Category filter strip — a row of ticks, current one filled. */
export function CategoryStrip({ active }: { active?: string }) {
  return (
    <nav aria-label="Categories" className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <Link
        href="/blog"
        className={`ledger-num text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
          active ? "text-ink-muted hover:text-sky-700" : "text-ink"
        }`}
      >
        All
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={`/blog/categories/${c.slug}`}
          className={`inline-flex items-center gap-2 transition-colors ${
            active === c.slug ? "text-ink" : "text-ink-muted hover:text-sky-700"
          }`}
        >
          <span aria-hidden className="inline-block h-2 w-2 rounded-full" style={{ background: c.color }} />
          <span className="ledger-num text-[10px] font-semibold uppercase tracking-[0.16em]">{c.title}</span>
        </Link>
      ))}
    </nav>
  )
}
