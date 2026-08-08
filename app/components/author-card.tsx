import Link from "next/link"
import type { Author } from "@/lib/authors"

/**
 * Byline/author block for content pages (E-E-A-T). Renders the author's name,
 * role; links out when a profile URL is set. The bio is deliberately not
 * rendered: it repeated the review-stamp sentence that was removed sitewide.
 */
export function AuthorCard({ author, updated }: { author: Author; updated?: string }) {
  const initials = author.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="flex items-start gap-4 rounded-2xl glass-1 gloss-edge p-5">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-bold text-white"
        style={{ background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)" }}
        aria-hidden
      >
        {initials}
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-600">Written by</p>
        {author.url ? (
          <Link href={author.url} rel="author" className="text-[15px] font-semibold text-ink hover:text-sky-600">
            {author.name}
          </Link>
        ) : (
          <p className="text-[15px] font-semibold text-ink">{author.name}</p>
        )}
        {author.role && <p className="text-[12.5px] text-ink-muted">{author.role}</p>}
        {updated && (
          <p className="mt-2 font-mono text-[11px] text-ink-muted">
            Last updated {updated}
          </p>
        )}
      </div>
    </div>
  )
}
