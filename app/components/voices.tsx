"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────────────────────
   IN THEIR WORDS.

   Every person, company, lead and figure below is invented for the site.
   None of it is a real customer statement. Replace VOICES with real,
   permissioned quotes before treating this as evidence of anything.

   Deliberately NOT wired to Review or AggregateRating structured data:
   pushing invented reviews into search rich results is a different order
   of problem from what is on the page.
   ───────────────────────────────────────────────────────────────────────── */

type Voice = {
  /** The complaint, in their words, about how it worked before. */
  before: string
  /** What changed, the quote proper. */
  quote: string
  name: string
  role: string
  company: string
  city: string
  sector: string
  /** The lead the quote is about, rendered as a row from their queue. */
  lead: { name: string; org: string; value: string; grade: "A" | "B" | "C"; quiet: string }
}

const VOICES: Voice[] = [
  {
    before: "Forty portal enquiries a day, and the one we called first was whoever had messaged most recently.",
    quote:
      "We were never short of leads. We were short of an order to work them in. The first morning the queue told us to call a site visit from nine days ago before any of the fresh ones, and that settled an argument we had been having for two years.",
    name: "Mandar Deshpande",
    role: "Director of Sales",
    company: "Vaastavik Realty",
    city: "Pune",
    sector: "Real estate",
    lead: { name: "Sunil Bafna", org: "Site visit, Baner", value: "₹34L", grade: "A", quiet: "9 days quiet" },
  },
  {
    before: "Our cycle runs four months. A buyer goes silent for three weeks and the floor writes them off.",
    quote:
      "Quiet is not the same as gone, but nobody on my floor could tell the difference. The ones who went quiet with money still on the table now come back to the top of the list instead of sliding off the bottom of it.",
    name: "Bhavesh Ranka",
    role: "Partner",
    company: "Rangoli Toolworks",
    city: "Rajkot",
    sector: "Industrial equipment",
    lead: { name: "Harish Patel", org: "Saurashtra Forge", value: "₹21L", grade: "B", quiet: "24 days quiet" },
  },
  {
    before: "Three counsellors, three phones, and every serious parent conversation living inside someone's personal WhatsApp.",
    quote:
      "When a counsellor resigned we lost the thread on about sixty families and there was nothing to hand over. I did not want another chat tool. I wanted the outcome of the conversation written somewhere the business could see it.",
    name: "Shraddha Reddy",
    role: "Founder",
    company: "Nucleus Learning Labs",
    city: "Hyderabad",
    sector: "Education",
    lead: { name: "Anup Ghosh", org: "Parent enquiry, Gachibowli", value: "₹1.4L", grade: "A", quiet: "6 days quiet" },
  },
  {
    before: "Every row in the sheet said follow up later. Nobody could tell me what later meant.",
    quote:
      "My reps were not lazy, they were guessing. The day the system started saying call this one now and leave that one alone, the arguing in the morning meeting stopped and we just went to work.",
    name: "Tarun Ahluwalia",
    role: "Sales Head",
    company: "Foldline Interiors",
    city: "Bengaluru",
    sector: "Interior fitouts",
    lead: { name: "Ritika Anand", org: "Cobalt Workspaces", value: "₹9L", grade: "B", quiet: "12 days quiet" },
  },
  {
    before: "The CRM held every field we ever asked for and answered none of the questions I actually had.",
    quote:
      "I could always tell you how many calls we made last week. I could not tell you which enquiry we were about to lose. Those are two different reports and only one of them is worth a Monday morning.",
    name: "Deepa Raghavan",
    role: "Chief Operating Officer",
    company: "Marina Freightlines",
    city: "Chennai",
    sector: "Logistics",
    lead: { name: "Vasanth Kumar", org: "Ennore Packworks", value: "₹26L", grade: "A", quiet: "17 days quiet" },
  },
  {
    before: "A new rep cannot tell a serious buyer from someone collecting quotes. That takes a year to learn.",
    quote:
      "The grade did the teaching. My newest rep works the same list my best one does, and she has stopped spending her mornings on people who were never going to buy from us.",
    name: "Yusuf Bandukwala",
    role: "Managing Partner",
    company: "Malwa Diagnostics",
    city: "Indore",
    sector: "Healthcare",
    lead: { name: "Anita Sane", org: "Nimar Pathology", value: "₹7.5L", grade: "C", quiet: "21 days quiet" },
  },
]

const DWELL = 8000

const GRADE_TINT: Record<Voice["lead"]["grade"], string> = {
  A: "bg-emerald-50 text-emerald-700 ring-emerald-200/70",
  B: "bg-sky-50 text-sky-700 ring-sky-200/70",
  C: "bg-amber-50 text-amber-700 ring-amber-200/70",
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("")
}

export function Voices() {
  const [i, setI] = useState(0)
  const [held, setHeld] = useState(false)

  // Advances on its own so the section is never the same twice, and stops
  // the moment someone is reading or tabbing through it.
  useEffect(() => {
    if (held) return
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return
    const t = setTimeout(() => setI((v) => (v + 1) % VOICES.length), DWELL)
    return () => clearTimeout(t)
  }, [i, held])

  const v = VOICES[i]

  return (
    <div
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-12">
        {/* The quote, and the complaint it answers. */}
        <figure className="flex min-h-[21rem] flex-col md:min-h-[23rem]">
          <div className="border-l-2 border-rose-300/80 pl-5">
            <p className="ledger-num text-[10px] uppercase tracking-[0.2em] text-rose-500">Before</p>
            <p className="mt-2 max-w-xl text-[14.5px] leading-[1.65] text-ink-soft md:text-[15px]">{v.before}</p>
          </div>

          <blockquote key={i} className="rise mt-7 flex-1">
            <p className="display-md max-w-2xl text-[22px] leading-[1.32] text-ink md:text-[27px]">
              &ldquo;{v.quote}&rdquo;
            </p>
          </blockquote>

          <figcaption className="mt-7 flex items-center gap-3.5 border-t pt-5 rule-paper">
            <span
              aria-hidden
              className="ledger-num grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink/[0.055] text-[13px] font-semibold text-ink-soft"
            >
              {initials(v.name)}
            </span>
            <div className="min-w-0">
              <p className="text-[14.5px] font-semibold leading-tight text-ink">{v.name}</p>
              <p className="mt-0.5 text-[13px] leading-tight text-ink-soft">
                {v.role}, {v.company}
              </p>
              <p className="ledger-num mt-1 text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                {v.city} · {v.sector}
              </p>
            </div>
          </figcaption>
        </figure>

        {/* The lead being described, drawn the way their queue draws it. */}
        <aside className="self-start rounded-2xl border p-5 rule-paper" style={{ background: "var(--bg-pure, #fff)" }}>
          <p className="ledger-num text-[10px] uppercase tracking-[0.18em] text-ink-soft">The lead they mean</p>
          <div key={i} className="rise mt-4">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="ledger-num grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-50 text-[11px] font-semibold text-sky-700"
              >
                {initials(v.lead.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold leading-tight text-ink">{v.lead.name}</p>
                <p className="mt-0.5 truncate text-[12.5px] text-ink-soft">{v.lead.org}</p>
              </div>
              <span
                className={cn(
                  "ledger-num grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[11px] font-bold ring-1",
                  GRADE_TINT[v.lead.grade],
                )}
              >
                {v.lead.grade}
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between border-t pt-3.5 rule-paper">
              <span className="ledger-num text-[19px] font-semibold text-ink">{v.lead.value}</span>
              <span className="ledger-num text-[11px] uppercase tracking-[0.12em] text-rose-500">{v.lead.quiet}</span>
            </div>
          </div>
          <p className="mt-4 text-[12.5px] leading-[1.6] text-ink-soft">
            Sitting in the pile, worth more than most of what sat above it.
          </p>
        </aside>
      </div>

      {/* The register. Every voice is reachable, and the hairline shows the dwell. */}
      <div className="mt-10 grid grid-cols-2 border-t rule-paper sm:grid-cols-3 md:mt-12 md:grid-cols-6">
        {VOICES.map((entry, n) => {
          const on = n === i
          return (
            <button
              key={entry.name}
              type="button"
              onClick={() => setI(n)}
              aria-current={on ? "true" : undefined}
              aria-label={`Read ${entry.name} of ${entry.company}`}
              className={cn(
                "group relative -mt-px border-t-2 px-1 pb-4 pt-4 text-left transition-colors",
                on ? "border-t-sky-500" : "border-t-transparent hover:border-t-ink/15",
              )}
            >
              {on && (
                <span
                  key={i}
                  aria-hidden
                  className={cn("voice-dwell absolute inset-x-0 -top-px h-0.5 origin-left bg-sky-500/40", held && "paused")}
                />
              )}
              <span className={cn("ledger-num text-[10px] tabular-nums", on ? "text-sky-600" : "text-ink-muted")}>
                {String(n + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "mt-1.5 block text-[13.5px] font-medium leading-tight transition-colors",
                  on ? "text-ink" : "text-ink-soft group-hover:text-ink",
                )}
              >
                {entry.name}
              </span>
              <span className="mt-0.5 block truncate text-[12px] leading-tight text-ink-soft">{entry.sector}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
