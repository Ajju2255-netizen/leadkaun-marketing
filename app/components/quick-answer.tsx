/**
 * AI-search / GEO primitive (Phase 5).
 *
 * A short, extractable answer block designed for ChatGPT / Gemini / Claude /
 * Perplexity / Google SGE and voice assistants to lift verbatim. Keep `answer`
 * to 40–60 words, lead with the direct answer, no marketing throat-clearing.
 *
 * Emits `speakable` schema so voice surfaces know which node to read aloud.
 */
import { Sparkles } from "lucide-react"

type QuickAnswerProps = {
  /** The question this page answers, phrased as a user would ask it. */
  question: string
  /** 40–60 word direct answer. First sentence must stand alone. */
  answer: string
  /** Optional heading override (default "Quick answer"). */
  label?: string
}

export function QuickAnswer({ question, answer, label = "Quick answer" }: QuickAnswerProps) {
  const speakable = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".quick-answer-q", ".quick-answer-a"] },
  }
  return (
    <div className="mx-auto max-w-3xl rounded-2xl glass-1 gloss-edge p-6 md:p-7" data-quick-answer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakable) }} />
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-sky-500" aria-hidden />
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">{label}</p>
      </div>
      <p className="quick-answer-q mt-3 text-[15px] font-semibold text-ink">{question}</p>
      <p className="quick-answer-a mt-2 text-[16px] leading-[1.6] text-ink-soft">{answer}</p>
    </div>
  )
}

type KeyTakeawaysProps = {
  items: string[]
  label?: string
}

/** A scannable takeaways list — LLMs and skimmers both lift these. */
export function KeyTakeaways({ items, label = "Key takeaways" }: KeyTakeawaysProps) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--hairline)] p-6 md:p-7" data-key-takeaways>
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{label}</p>
      <ul className="mt-3 space-y-2.5">
        {items.map((t, i) => (
          <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.55] text-ink-soft">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" aria-hidden />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
