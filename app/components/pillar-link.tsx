import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"

/**
 * "Part of the {pillar} guide" rail — links a supporting page UP to its topic
 * pillar, completing the internal-linking mesh. Render only when a pillar is found.
 */
export function PillarLink({ pillar }: { pillar: { slug: string; title: string } | null }) {
  if (!pillar) return null
  return (
    <Link
      href={`/learn/${pillar.slug}`}
      className="group inline-flex items-center gap-2 rounded-full glass-1 gloss-edge px-3.5 py-1.5 text-[12.5px] font-medium text-ink-soft transition-all hover:text-sky-600 lift"
    >
      <BookOpen className="h-3.5 w-3.5 text-sky-500" strokeWidth={2} aria-hidden />
      <span>Part of the <span className="font-semibold text-ink group-hover:text-sky-600">{pillar.title}</span> guide</span>
      <ArrowRight className="h-3.5 w-3.5 text-ink-muted transition-all group-hover:text-sky-500 group-hover:translate-x-0.5" />
    </Link>
  )
}
