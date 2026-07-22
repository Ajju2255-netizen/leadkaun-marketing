"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Search as SearchIcon, ArrowRight } from "lucide-react"

type Entry = { t: string; u: string; k: string; x: string }

export function SearchClient() {
  const params = useSearchParams()
  const router = useRouter()
  const initial = params.get("q") ?? ""
  const [q, setQ] = useState(initial)
  const [index, setIndex] = useState<Entry[] | null>(null)

  useEffect(() => {
    fetch("/search-index.json").then((r) => r.json()).then(setIndex).catch(() => setIndex([]))
  }, [])

  useEffect(() => { setQ(initial) }, [initial])

  const results = useMemo(() => {
    if (!index || q.trim().length < 2) return []
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
    return index
      .map((e) => {
        const hay = (e.t + " " + e.x + " " + e.k).toLowerCase()
        let score = 0
        for (const term of terms) {
          if (!hay.includes(term)) return { e, score: -1 }
          if (e.t.toLowerCase().includes(term)) score += 3
          else score += 1
        }
        if (e.t.toLowerCase().startsWith(q.toLowerCase())) score += 4
        return { e, score }
      })
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40)
      .map((r) => r.e)
  }, [index, q])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.replace(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={onSubmit} className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
          placeholder="Search features, guides, comparisons, glossary, cities…"
          aria-label="Search Leadkaun"
          className="h-14 w-full rounded-2xl glass-1 gloss-edge border border-white/70 pl-12 pr-4 text-[16px] text-ink placeholder:text-ink-faint transition-all focus:outline-none focus:border-sky-400 focus:[background:rgba(255,255,255,0.9)]"
        />
      </form>

      <div className="mt-6">
        {index === null && <p className="text-[14px] text-ink-muted">Loading…</p>}
        {index !== null && q.trim().length >= 2 && (
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            {results.length} result{results.length === 1 ? "" : "s"} for “{q}”
          </p>
        )}
        {index !== null && q.trim().length < 2 && (
          <p className="text-[14px] text-ink-soft">Type at least two characters. Try “lead scoring”, “whatsapp”, “vs zoho”, “mumbai”, or “template”.</p>
        )}
        <ul className="flex flex-col gap-2">
          {results.map((r) => (
            <li key={r.u}>
              <Link href={r.u} className="group flex items-center justify-between gap-4 rounded-xl border border-[var(--hairline)] bg-surface px-4 py-3 transition-all hover:border-sky-400 hover:[background:var(--surface-2,transparent)]">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-ink group-hover:text-sky-600">{r.t}</p>
                  {r.x && <p className="mt-0.5 truncate text-[13px] text-ink-soft">{r.x}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">{r.k}</span>
                  <ArrowRight className="h-4 w-4 text-ink-muted transition-all group-hover:text-sky-500 group-hover:translate-x-0.5" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
