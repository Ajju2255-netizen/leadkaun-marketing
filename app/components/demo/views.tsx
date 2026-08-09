"use client"

import { useMemo, useState } from "react"
import {
  Upload, Search, ChevronRight, Inbox, Flame, PhoneCall, IndianRupee, Trophy, Zap,
  AlertTriangle, Activity as ActivityIcon, Check, Clock, Users, CalendarClock,
  CheckCircle2, Gauge, Snowflake, TrendingDown, Brain, Bell, RotateCcw, X, Target,
  ArrowUpRight, Columns2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  activeAgo, contribution, formatRupee, gradeOf, nextAction, rankScore, totalScore,
  STAGES, WEIGHTS, LEARNING_PATTERNS, REPS, type Stage,
} from "@/lib/demo-app"
import {
  Avatar, Btn, Card, FunnelBar, GradeBadge, KpiCard, PageHead, ScoreCell, StatCard,
  Th, useDemo,
} from "./primitives"

/**
 * The app's screens, each rebuilt from its page file in the product at HEAD
 * (d1e1f2c, "Redesign product app UI to a flat, modern system").
 *
 * Where a screen looks unlike the pre-August app, that is the point: the queue
 * is a stats panel plus a table, the dashboard funnel is one segmented bar, and
 * Follow-ups is quick stats plus a list. The hero panel, rank ribbons and
 * score ring belonged to the old design and are gone from the product.
 */

// ── Priority Queue ────────────────────────────────────────────────────────────

const GRADE_TABS = [
  { key: "all", label: "All", dot: "", active: "bg-slate-800" },
  { key: "A", label: "Grade A", dot: "bg-emerald-400", active: "bg-emerald-500" },
  { key: "B", label: "Grade B", dot: "bg-sky-400", active: "bg-sky-500" },
  { key: "C", label: "Grade C", dot: "bg-orange-400", active: "bg-orange-500" },
  { key: "D", label: "Grade D", dot: "bg-orange-500", active: "bg-orange-600" },
  { key: "E", label: "Grade E", dot: "bg-rose-400", active: "bg-rose-500" },
  { key: "F", label: "Grade F", dot: "bg-slate-400", active: "bg-slate-500" },
]

const NEXT_TONE: Record<string, string> = {
  A: "bg-sky-50 text-sky-700", B: "bg-sky-50 text-sky-700", C: "bg-amber-50 text-amber-700",
  D: "bg-orange-50 text-orange-700", E: "bg-orange-50 text-orange-700", F: "bg-slate-100 text-slate-500",
}

export function QueueView({ onImport }: { onImport: () => void }) {
  const { state, openLead } = useDemo()
  const [tab, setTab] = useState("all")
  const [q, setQ] = useState("")

  const ranked = useMemo(() => [...state.leads].sort((a, b) => rankScore(b) - rankScore(a)), [state.leads])
  const matching = ranked
    .filter((l) => tab === "all" || gradeOf(l) === tab)
    .filter((l) => `${l.name} ${l.company}`.toLowerCase().includes(q.toLowerCase()))
  const PAGE = 5
  const rows = matching.slice(0, PAGE)

  const high = state.leads.filter((l) => ["A", "B"].includes(gradeOf(l))).length
  const hot = state.leads.filter((l) => l.activeMinutesAgo < 180).length
  const contacted = state.leads.filter((l) => l.contactedToday).length
  const inPlay = state.leads.filter((l) => gradeOf(l) !== "F").reduce((s, l) => s + l.value, 0)
  const topThree = ranked.slice(0, 3).reduce((s, l) => s + l.value, 0)

  return (
    <>
      <PageHead
        title="Priority Queue"
        action={<Btn tone="primary" onClick={onImport}><Upload className="h-4 w-4" /> Import leads</Btn>}
      />

      <Card className="mt-4" pad="p-4 sm:p-5">
        <h2 className="mb-3.5 text-[14px] font-semibold text-slate-900">Quick stats</h2>
        <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-3 @6xl:grid-cols-6">
          <StatCard icon={Inbox}       label="Total leads"     value={state.leads.length}    tintBg="bg-slate-100"  tintFg="text-slate-500"   caption="in your queue" />
          <StatCard icon={Flame}       label="High priority"   value={high}                  tintBg="bg-rose-50"    tintFg="text-rose-500"    caption="grade A and B" />
          <StatCard icon={Zap}         label="Hot right now"   value={hot}                   tintBg="bg-amber-50"   tintFg="text-amber-500"   caption="live signals" />
          <StatCard icon={PhoneCall}   label="Contacted today" value={contacted}             tintBg="bg-emerald-50" tintFg="text-emerald-600" caption="today" />
          <StatCard icon={IndianRupee} label="In play"         value={formatRupee(inPlay)}   tintBg="bg-sky-50"     tintFg="text-sky-600"     caption="pipeline value" />
          <StatCard icon={Trophy}      label="Top 3 potential" value={formatRupee(topThree)} tintBg="bg-violet-50"  tintFg="text-violet-500"  caption="your best 3" />
        </div>
      </Card>

      {/* Search, grade tabs and the table share one panel, as the product does. */}
      <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-slate-200 px-3 focus-within:border-sky-400">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search leads, company…"
              aria-label="Search queue"
              className="w-full bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
            />
            {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search"><X className="h-3.5 w-3.5 text-slate-400" /></button>}
          </label>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {GRADE_TABS.map((t) => {
              const count = t.key === "all" ? ranked.length : ranked.filter((l) => gradeOf(l) === t.key).length
              if (t.key !== "all" && count === 0) return null
              const active = tab === t.key
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold transition-all",
                    active
                      ? cn(t.active, "text-white shadow-[0_1px_2px_rgba(15,23,42,0.18)]")
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {t.dot && !active && <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", t.dot)} />}
                  {t.label}
                  <span className={cn("rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums", active ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600")}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50/60">
              <tr>
                <Th className="pl-5">Lead</Th>
                <Th className="hidden @3xl:table-cell">Signal</Th>
                <Th className="text-right">Value</Th>
                <Th>Grade</Th>
                <Th className="hidden @xl:table-cell">Next action</Th>
                <Th className="hidden @6xl:table-cell">Source</Th>
                <Th className="hidden @5xl:table-cell">Last active</Th>
                <Th className="pr-5"><span className="sr-only">Open</span></Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((l, i) => {
                const g = gradeOf(l)
                return (
                  <tr key={l.id} onClick={() => openLead(l.id)} className="group cursor-pointer transition-colors hover:bg-sky-50/40">
                    <td className="py-3 pl-5 pr-3 align-middle">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={l.name} />
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="truncate text-[13.5px] font-semibold text-slate-900 group-hover:text-sky-700">{l.name}</span>
                            {i === 0 && tab === "all" && !q && (
                              <span className="inline-flex h-[18px] shrink-0 items-center rounded-full bg-sky-100 px-1.5 text-[9px] font-bold uppercase tracking-[0.06em] text-sky-700">Next</span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-[12px] text-slate-400">{l.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-3 py-3 align-middle @3xl:table-cell">
                      <p className="max-w-[220px] truncate text-[13px] text-slate-600">{l.signal}</p>
                    </td>
                    <td className="px-3 py-3 text-right align-middle">
                      <span className="text-[13.5px] font-semibold tabular-nums text-slate-900">{formatRupee(l.value)}</span>
                    </td>
                    <td className="px-3 py-3 align-middle"><GradeBadge grade={g} /></td>
                    <td className="hidden px-3 py-3 align-middle @xl:table-cell">
                      <span className={cn("inline-flex h-7 items-center whitespace-nowrap rounded-full px-3 text-[12px] font-semibold", NEXT_TONE[g])}>
                        {nextAction(g)}
                      </span>
                    </td>
                    <td className="hidden px-3 py-3 align-middle @6xl:table-cell">
                      <span className="whitespace-nowrap text-[12.5px] text-slate-400">{l.source}</span>
                    </td>
                    <td className="hidden px-3 py-3 align-middle @5xl:table-cell">
                      <span className="whitespace-nowrap text-[12.5px] text-slate-400">{activeAgo(l.activeMinutesAgo)}</span>
                    </td>
                    <td className="py-3 pl-3 pr-5 text-right align-middle">
                      <ChevronRight className="ml-auto h-4 w-4 text-slate-300 group-hover:text-sky-500" />
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-[13px] text-slate-400">Nothing matches that.</td></tr>
              )}
              {matching.length > PAGE && (
                <tr>
                  <td colSpan={8} className="px-5 py-3 text-center text-[12px] text-slate-400">
                    Showing {PAGE} of {matching.length} · page 1
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

const FUNNEL_COLORS = [
  { bar: "bg-sky-400", swatch: "bg-sky-400" },
  { bar: "bg-cyan-400", swatch: "bg-cyan-400" },
  { bar: "bg-violet-400", swatch: "bg-violet-400" },
  { bar: "bg-orange-400", swatch: "bg-orange-400" },
  { bar: "bg-amber-400", swatch: "bg-amber-400" },
  { bar: "bg-pink-400", swatch: "bg-pink-400" },
  { bar: "bg-emerald-400", swatch: "bg-emerald-400" },
]
const FUNNEL_STAGES: Stage[] = ["New Inquiry", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Follow-up", "Won"]

export function DashboardView() {
  const { state } = useDemo()
  const won = state.leads.filter((l) => l.stage === "Won")
  const entered = state.leads.length

  const stages = FUNNEL_STAGES.map((s, i) => {
    const count = state.leads.filter((l) => l.stage === s).length
    return { name: s, count, pct: Math.round((count / Math.max(entered, 1)) * 100), ...FUNNEL_COLORS[i] }
  })

  const sources = useMemo(() => {
    const m = new Map<string, number>()
    state.leads.forEach((l) => m.set(l.source, (m.get(l.source) ?? 0) + 1))
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }, [state.leads])

  const health = [
    { label: "Healthy", n: state.leads.filter((l) => ["A", "B"].includes(gradeOf(l))).length, icon: ActivityIcon, tone: "text-emerald-600", bar: "bg-emerald-400" },
    { label: "At risk", n: state.leads.filter((l) => gradeOf(l) === "C").length, icon: AlertTriangle, tone: "text-orange-500", bar: "bg-orange-400" },
    { label: "Missed", n: state.leads.filter((l) => l.staleDays >= 14).length, icon: ArrowUpRight, tone: "text-rose-500", bar: "bg-rose-400" },
    { label: "Cold", n: state.leads.filter((l) => ["D", "E", "F"].includes(gradeOf(l))).length, icon: Snowflake, tone: "text-slate-500", bar: "bg-slate-300" },
  ]

  return (
    <>
      <PageHead
        title="Sales Behaviour Pulse"
        sub="Today's revenue radar. What your team did, what's slipping, and where the next ₹ is hiding."
      />

      <div className="mt-4 grid grid-cols-2 gap-3 @2xl:grid-cols-3 @6xl:grid-cols-5">
        <KpiCard label="New Leads"            value={state.leads.length} icon={Users}        tintBg="bg-sky-50"     tintFg="text-sky-600" />
        <KpiCard label="First Contacts Made"  value={state.leads.filter((l) => l.stage !== "New Inquiry").length} icon={PhoneCall} tintBg="bg-orange-50" tintFg="text-orange-500" delta={100} />
        <KpiCard label="Follow-ups Completed" value={state.leads.filter((l) => l.contactedToday).length} icon={CheckCircle2} tintBg="bg-violet-50" tintFg="text-violet-500" />
        <KpiCard label="Leads Won"            value={won.length}         icon={Trophy}       tintBg="bg-emerald-50" tintFg="text-emerald-600" />
        <KpiCard label="Revenue"              value={formatRupee(won.reduce((s, l) => s + l.value, 0))} icon={IndianRupee} tintBg="bg-emerald-50" tintFg="text-emerald-600" />
      </div>

      <div className="mt-4 grid gap-4 @5xl:grid-cols-[1.5fr_1fr]">
        <Card
          title="Pipeline Funnel"
          meta={<span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">All-time</span>}
          action={<span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">{entered} leads entered</span>}
        >
          <FunnelBar stages={stages} />
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-sky-50/70 px-4 py-3">
            <Target className="h-4 w-4 shrink-0 text-sky-500" />
            <p className="text-[13px] text-slate-700">
              <span className="font-semibold">Your conversion rate is {Math.round((won.length / Math.max(entered, 1)) * 100)}%.</span>{" "}
              <span className="text-slate-400">Goal: 15%.</span>
            </p>
          </div>
        </Card>

        <Card title="Top Performing Reps" action={<span className="text-[12px] font-semibold text-sky-600">View all →</span>}>
          <div className="space-y-4">
            {REPS.map((r, i) => (
              <div key={r.name}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] font-semibold text-slate-900">{r.name}</span>
                  <span className="flex items-baseline gap-3">
                    <span className="text-[11.5px] text-slate-400">{4 - i} wins</span>
                    <span className="text-[13px] font-bold tabular-nums text-slate-900">{formatRupee(r.won)}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full", ["bg-emerald-400", "bg-sky-400", "bg-violet-400", "bg-orange-400"][i])} style={{ width: `${100 - i * 22}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </>
  )
}

// ── All Leads ─────────────────────────────────────────────────────────────────

export function LeadsView({ onImport }: { onImport: () => void }) {
  const { state, dispatch, openLead } = useDemo()
  const [q, setQ] = useState("")
  const [stage, setStage] = useState<"All" | Stage>("All")

  const matching = state.leads.filter((l) => {
    const hay = `${l.name} ${l.company} ${l.source} ${l.phone}`.toLowerCase()
    return hay.includes(q.toLowerCase()) && (stage === "All" || l.stage === stage)
  })
  const rows = matching.slice(0, 5)

  return (
    <>
      <PageHead
        title="All Leads"
        sub={`${state.leads.length} leads`}
        action={<Btn tone="primary" onClick={onImport}><Upload className="h-4 w-4" /> Import</Btn>}
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="flex h-9 min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 focus-within:border-sky-400">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, company…"
            aria-label="Search leads"
            className="w-full bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
          />
          {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search"><X className="h-3.5 w-3.5 text-slate-400" /></button>}
        </label>
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value as "All" | Stage)}
          aria-label="Filter by stage"
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none hover:border-slate-300"
        >
          {(["All", ...STAGES] as const).map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200/70 bg-white">
        <table className="w-full border-collapse">
          <thead className="border-b border-slate-100 bg-slate-50/60">
            <tr>
              <Th className="pl-5">Lead</Th>
              <Th className="text-right">Score</Th>
              <Th>Grade</Th>
              <Th className="hidden @5xl:table-cell">Fit</Th>
              <Th className="hidden @5xl:table-cell">Intent</Th>
              <Th className="hidden @5xl:table-cell">Quality</Th>
              <Th>Stage</Th>
              <Th className="hidden @4xl:table-cell">Rep</Th>
              <Th className="pr-5 text-right">Last activity</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((l) => {
              const score = totalScore(l)
              return (
                <tr key={l.id} className="transition-colors hover:bg-sky-50/40">
                  <td className="py-3.5 pl-5 pr-3">
                    <button type="button" onClick={() => openLead(l.id)} className="text-left">
                      <span className="block text-[13.5px] font-semibold text-slate-900">{l.name}</span>
                      <span className="mt-0.5 block text-[12px] text-slate-400">{l.company}</span>
                    </button>
                  </td>
                  <td className="px-3 text-right">
                    <span className={cn("text-[16px] font-bold tabular-nums", score >= 60 ? "text-sky-600" : score >= 45 ? "text-orange-500" : "text-slate-400")}>{score}</span>
                  </td>
                  <td className="px-3"><GradeBadge grade={gradeOf(l)} /></td>
                  <td className="hidden px-3 @5xl:table-cell"><ScoreCell value={contribution(l.fit, WEIGHTS.fit)} of={WEIGHTS.fit} tone="fit" /></td>
                  <td className="hidden px-3 @5xl:table-cell"><ScoreCell value={contribution(l.intent, WEIGHTS.intent)} of={WEIGHTS.intent} tone="intent" /></td>
                  <td className="hidden px-3 @5xl:table-cell"><ScoreCell value={contribution(l.quality, WEIGHTS.quality)} of={WEIGHTS.quality} tone="quality" /></td>
                  <td className="px-3">
                    <select
                      value={l.stage}
                      aria-label={`Stage for ${l.name}`}
                      onChange={(e) => dispatch({ type: "SET_STAGE", leadId: l.id, stage: e.target.value as Stage })}
                      className="h-7 cursor-pointer rounded-lg border border-slate-200 bg-white px-2 text-[12px] text-slate-700 outline-none hover:border-sky-300"
                    >
                      {STAGES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="hidden px-3 @4xl:table-cell"><Avatar name={l.rep} size={26} /></td>
                  <td className="px-3 pr-5 text-right text-[12px] text-slate-400">{activeAgo(l.activeMinutesAgo)}</td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr><td colSpan={9} className="px-5 py-10 text-center text-[13px] text-slate-400">No leads match that.</td></tr>
            )}
            {matching.length > 5 && (
              <tr><td colSpan={9} className="px-5 py-3 text-center text-[12px] text-slate-400">Showing 5 of {matching.length} · page 1</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

// ── Pipeline ──────────────────────────────────────────────────────────────────

const BOARD: Stage[] = ["New Inquiry", "Contacted", "Qualified", "Proposal Sent"]

export function PipelineView() {
  const { state, dispatch, openLead } = useDemo()
  const won = state.leads.filter((l) => l.stage === "Won").length
  const lost = state.leads.filter((l) => l.stage === "Lost").length
  const open = state.leads.length - won - lost

  return (
    <>
      <PageHead
        title="Pipeline"
        sub="Auto-stage tracker for every deal in motion. Moves when calls and WhatsApp signals land."
      />

      <div className="mt-4 grid grid-cols-2 gap-3 @2xl:grid-cols-3 @6xl:grid-cols-5">
        <KpiCard label="Total Deals" value={state.leads.length} icon={Columns2} tintBg="bg-sky-50"     tintFg="text-sky-600"     spark={[4, 6, 5, 8, 7, 9, 12]} />
        <KpiCard label="Open Deals"  value={open}               icon={Zap}     tintBg="bg-violet-50"  tintFg="text-violet-500"  spark={[8, 7, 9, 6, 8, 7, 9]} />
        <KpiCard label="Won Deals"   value={won}                icon={Trophy}  tintBg="bg-emerald-50" tintFg="text-emerald-600" spark={[1, 2, 1, 3, 2, 4, 5]} />
        <KpiCard label="Lost Deals"  value={lost}               icon={X}       tintBg="bg-orange-50"  tintFg="text-orange-500"  spark={[2, 1, 3, 2, 1, 2, 1]} invertDelta />
        <KpiCard label="Win Rate"    value={Math.round((won / Math.max(won + lost, 1)) * 100)} suffix="%" icon={Target} tintBg="bg-sky-50" tintFg="text-sky-600" spark={[3, 5, 4, 7, 5, 8, 9]} />
      </div>

      <div className="mt-4 grid gap-3 @2xl:grid-cols-2 @5xl:grid-cols-4">
        {BOARD.map((stage, si) => {
          const inStage = state.leads.filter((l) => l.stage === stage)
          const next = STAGES[STAGES.indexOf(stage) + 1]
          return (
            <div key={stage} className="rounded-2xl border border-slate-200/70 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-slate-900">
                  <span className={cn("h-2 w-2 rounded-full", FUNNEL_COLORS[si].swatch)} /> {stage}
                </p>
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-slate-600">{inStage.length}</span>
              </div>
              <p className="mt-2 text-[12px] tabular-nums text-slate-400">{formatRupee(inStage.reduce((s, l) => s + l.value, 0))}</p>

              <div className="mt-4 space-y-3">
                {inStage.slice(0, 2).map((l) => (
                  <div key={l.id} className="rounded-xl border border-slate-200/70 p-3">
                    <button type="button" onClick={() => openLead(l.id)} className="flex w-full items-start gap-2 text-left">
                      <GradeBadge grade={gradeOf(l)} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-slate-900">{l.name}</span>
                        <span className="block truncate text-[11.5px] text-slate-400">{l.company}</span>
                      </span>
                      <span className="shrink-0 text-[12.5px] font-semibold tabular-nums text-slate-900">{formatRupee(l.value)}</span>
                    </button>
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      {l.staleDays > 0 && (
                        <span className="inline-flex h-6 items-center gap-1 rounded-full bg-rose-50 px-2 text-[11px] font-medium text-rose-600">
                          <Clock className="h-3 w-3" /> {l.staleDays}d stuck
                        </span>
                      )}
                      {next && (
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "SET_STAGE", leadId: l.id, stage: next })}
                          className="inline-flex h-6 items-center gap-1 rounded-full bg-sky-50 px-2 text-[11px] font-semibold text-sky-700 transition-colors hover:bg-sky-100"
                        >
                          Move to {next}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {inStage.length > 2 && (
                  <p className="pt-1 text-center text-[11.5px] text-slate-400">+{inStage.length - 2} more</p>
                )}
                {inStage.length === 0 && (
                  <div className="grid h-20 place-items-center rounded-xl border border-dashed border-slate-200 text-[12px] text-slate-300">
                    Drag a deal here
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ── Follow-ups ────────────────────────────────────────────────────────────────

export function FollowUpsView() {
  const { state, dispatch, openLead } = useDemo()
  const due = state.leads.filter((l) => l.followUp)
  const overdue = due.filter((l) => l.followUp === "overdue")
  const pending = due.filter((l) => l.followUp === "today")
  const doneWeek = state.leads.filter((l) => l.contactedToday).length
  const atRisk = overdue.reduce((s, l) => s + l.value, 0)
  const score = Math.round((doneWeek / Math.max(doneWeek + due.length, 1)) * 100)

  return (
    <>
      <PageHead title="Follow-ups" sub="What you promised to do, and when it was due." />

      <Card className="mt-4" pad="p-4 sm:p-5">
        <h2 className="mb-3.5 text-[14px] font-semibold text-slate-900">Quick stats</h2>
        <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-3 @6xl:grid-cols-5">
          <StatCard icon={AlertTriangle} label="Overdue"         value={overdue.length}      tintBg="bg-rose-50"    tintFg="text-rose-500"    caption="need action now" />
          <StatCard icon={CalendarClock} label="Due today"       value={pending.length}      tintBg="bg-sky-50"     tintFg="text-sky-600"     caption="on schedule" />
          <StatCard icon={IndianRupee}   label="At risk"         value={formatRupee(atRisk)} tintBg="bg-amber-50"   tintFg="text-amber-500"   caption="overdue value" />
          <StatCard icon={CheckCircle2}  label="Done this week"  value={doneWeek}            tintBg="bg-emerald-50" tintFg="text-emerald-600" caption="completed" />
          <StatCard icon={Gauge}         label="Follow-up score" value={`${score}%`}         tintBg="bg-violet-50"  tintFg="text-violet-500"  caption="consistency" />
        </div>
      </Card>

      <Card title="Your follow-up list" className="mt-4" action={<span className="text-[12px] text-slate-400">{due.length} outstanding</span>}>
        {due.length === 0 ? (
          <p className="py-10 text-center text-[13px] text-slate-400">All caught up. Nothing scheduled.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {due.slice(0, 4).map((l) => (
              <div key={l.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                <button type="button" onClick={() => openLead(l.id)} className="flex min-w-[170px] flex-1 items-center gap-3 text-left">
                  <Avatar name={l.name} />
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-semibold text-slate-900">{l.name}</span>
                    <span className="block truncate text-[12px] text-slate-400">{l.company}</span>
                  </span>
                </button>
                <span className={cn(
                  "inline-flex h-7 items-center rounded-full px-3 text-[12px] font-semibold",
                  l.followUp === "overdue" ? "bg-rose-50 text-rose-600" : "bg-sky-50 text-sky-700"
                )}>
                  {l.followUp === "overdue" ? `${l.staleDays}d overdue` : "Due today"}
                </span>
                <GradeBadge grade={gradeOf(l)} />
                <span className="w-[62px] text-right text-[13px] font-semibold tabular-nums text-slate-900">{formatRupee(l.value)}</span>
                <span className="flex gap-1.5">
                  <Btn size="sm" tone="soft" onClick={() => dispatch({ type: "COMPLETE_FOLLOWUP", leadId: l.id })}><Check className="h-3.5 w-3.5" /> Done</Btn>
                  {l.followUp === "overdue" && <Btn size="sm" onClick={() => dispatch({ type: "SNOOZE_FOLLOWUP", leadId: l.id })}>Today</Btn>}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  )
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export function AnalyticsView() {
  const { state } = useDemo()
  const missed = state.leads.filter((l) => l.staleDays >= 14)
  const missedValue = missed.reduce((s, l) => s + l.value, 0)
  const recoverable = Math.round(missedValue * 0.78)
  const trend = [42, 26, 55, 55, 30, 78, 61]
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const losses = [
    { label: "Engaged but went cold", n: missed.filter((l) => l.intent >= 40).length, value: Math.round(missedValue * 0.67), pct: 67, tone: "bg-amber-400", fix: "Add a re-engagement follow-up within 24h of every signal" },
    { label: "Never contacted", n: missed.filter((l) => l.intent < 40).length, value: Math.round(missedValue * 0.33), pct: 33, tone: "bg-orange-400", fix: "Assign an owner the moment a lead lands" },
  ]

  return (
    <>
      <PageHead title="Analytics" sub="Find what's slowing your pipeline. See loss patterns, recovery potential, and one-click fixes." />

      {/* Headline-insight hero, the shape the August redesign introduced. */}
      <Card className="mt-4" pad="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 @3xl:flex-row @3xl:items-stretch">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">The headline</p>
            <div className="mt-2 flex flex-wrap items-baseline gap-2.5">
              <span className="text-[34px] font-bold leading-none tabular-nums text-rose-600">{formatRupee(missedValue)}</span>
              <span className="text-[13.5px] text-slate-500">missed · {missed.length} leads</span>
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-600">
                <TrendingDown className="h-3.5 w-3.5" /> improving
              </span>
            </div>
            <p className="mt-3 max-w-[520px] text-[13px] leading-relaxed text-slate-500">
              Most of it is recoverable. The pattern below says where it is going.
            </p>
          </div>
          <div className="shrink-0 rounded-xl border border-slate-200/70 p-4 @3xl:w-[220px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Recoverable now</p>
            <p className="mt-2 text-[26px] font-bold leading-none tabular-nums text-emerald-600">{formatRupee(recoverable)}</p>
            <p className="mt-2 text-[12px] text-slate-400">overdue follow-ups →</p>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3 @2xl:grid-cols-3">
        <KpiCard label="Speed-to-Win avg"  value="—"  icon={Clock}        tintBg="bg-sky-50"    tintFg="text-sky-600" />
        <KpiCard label="Speed-to-Miss avg" value="3h" icon={Clock}        tintBg="bg-orange-50" tintFg="text-orange-500" />
        <KpiCard label="Loss rate"         value={`${Math.round((missed.length / Math.max(state.leads.length, 1)) * 100)}%`} icon={TrendingDown} tintBg="bg-rose-50" tintFg="text-rose-500" />
      </div>

      <Card title="Daily Miss Trend" action={<span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">₹ missed per day</span>} className="mt-4" pad="p-6">
        <div className="relative h-[132px] w-full">
          <svg viewBox="0 0 700 132" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="missFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon fill="url(#missFill)" points={trend.map((v, i) => `${(i / 6) * 650 + 25},${112 - (v / 100) * 92}`).join(" ") + " 675,112 25,112"} />
            <polyline fill="none" stroke="#F43F5E" strokeWidth="2" vectorEffect="non-scaling-stroke"
                      points={trend.map((v, i) => `${(i / 6) * 650 + 25},${112 - (v / 100) * 92}`).join(" ")} />
            {trend.map((v, i) => (
              <circle key={i} cx={(i / 6) * 650 + 25} cy={112 - (v / 100) * 92} r="4" fill={i === 6 ? "#F43F5E" : "#fff"} stroke="#F43F5E" strokeWidth="2" />
            ))}
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex justify-between px-3">
            {DAYS.map((d, i) => <span key={d} className={cn("text-[11px]", i === 6 ? "font-semibold text-slate-700" : "text-slate-400")}>{d}</span>)}
          </div>
        </div>
      </Card>

    </>
  )
}

// ── Rep Tracking ──────────────────────────────────────────────────────────────

export function RepTrackingView() {
  const recovered = REPS.reduce((s, r) => s + r.won, 0)
  return (
    <>
      <PageHead title="Sales Rep Tracking" sub="Per-rep ₹ recovered, Grade A response time, follow-up completion." />

      <div className="mt-4 grid grid-cols-2 gap-3 @3xl:grid-cols-4">
        <KpiCard label="₹ Recovered"             value={formatRupee(recovered)} icon={IndianRupee}  tintBg="bg-emerald-50" tintFg="text-emerald-600" delta={110} />
        <KpiCard label="Grade A Response Time"   value="3h 3m"                  icon={Clock}        tintBg="bg-sky-50"     tintFg="text-sky-600" />
        <KpiCard label="Follow-up Completion"    value="86%"                    icon={CheckCircle2} tintBg="bg-violet-50"  tintFg="text-violet-500" />
        <KpiCard label="Recommendation Adoption" value="72%"                    icon={Target}       tintBg="bg-orange-50"  tintFg="text-orange-500" />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-[15px] font-semibold text-slate-900">Rep Performance Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50/60">
              <tr>
                <Th className="pl-5">Rep</Th>
                <Th>₹ Recovered</Th>
                <Th>Grade A response time</Th>
                <Th>Follow-up completion</Th>
                <Th className="pr-5 text-right">Rep score</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {REPS.map((r, i) => (
                <tr key={r.name}>
                  <td className="py-4 pl-5 pr-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.name} />
                      <span className="text-[13.5px] font-semibold text-slate-900">{r.name}</span>
                      {i === 0 && <span className="inline-flex h-[18px] items-center rounded-full bg-amber-100 px-1.5 text-[9px] font-bold uppercase tracking-[0.06em] text-amber-700">Top</span>}
                    </div>
                  </td>
                  <td className="px-3">
                    <p className="text-[13px] font-semibold tabular-nums text-slate-900">₹{r.won.toLocaleString("en-IN")}</p>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
                      <div className={cn("h-full rounded-full", ["bg-emerald-400", "bg-sky-400", "bg-sky-400", "bg-orange-400"][i])} style={{ width: `${100 - i * 18}%` }} />
                    </div>
                  </td>
                  <td className="px-3">
                    <p className="text-[13px] tabular-nums text-slate-700">{Math.floor(r.responseMins / 60)}h {r.responseMins % 60}m</p>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
                      <div className={cn("h-full rounded-full", i === 0 ? "bg-amber-400" : "bg-rose-400")} style={{ width: `${Math.min(100, r.responseMins)}%` }} />
                    </div>
                  </td>
                  <td className="px-3">
                    <p className="text-[13px] tabular-nums text-slate-700">{r.completion}%</p>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
                      <div className={cn("h-full rounded-full", r.completion >= 80 ? "bg-emerald-400" : "bg-sky-400")} style={{ width: `${r.completion}%` }} />
                    </div>
                  </td>
                  <td className="px-3 pr-5 text-right">
                    <span className="text-[15px] font-bold tabular-nums text-slate-900">{Math.round(r.completion * 0.6)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-slate-100 px-5 py-4 text-[12px] text-slate-400">
          This measures whether the recommendation was followed, not whether it worked. The two are different questions.
        </p>
      </div>
    </>
  )
}

// ── Missed Opps ───────────────────────────────────────────────────────────────

export function MissedView() {
  const { state, dispatch, openLead } = useDemo()
  const missed = state.leads.filter((l) => l.staleDays >= 14).sort((a, b) => b.value - a.value)
  const atRisk = missed.reduce((s, l) => s + l.value, 0)

  return (
    <>
      <PageHead title="Missed Opportunity Engine" sub="Every stale lead gets a rupee value. Aggregate ₹ at risk, surfaced daily." />

      <div className="mt-4 grid grid-cols-2 gap-3 @3xl:grid-cols-4">
        <KpiCard label="At risk today"  value={formatRupee(atRisk)} icon={IndianRupee}   tintBg="bg-rose-50"    tintFg="text-rose-500" />
        <KpiCard label="Stale leads"    value={missed.length}       icon={AlertTriangle} tintBg="bg-orange-50"  tintFg="text-orange-500" />
        <KpiCard label="Recovered · 7d" value={state.leads.filter((l) => l.contactedToday && l.staleDays === 0).length} icon={Trophy} tintBg="bg-emerald-50" tintFg="text-emerald-600" />
        <KpiCard label="Grade A stale"  value={missed.filter((l) => gradeOf(l) === "A").length} icon={Flame} tintBg="bg-amber-50" tintFg="text-amber-500" />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-5">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-900">High-value missed opportunities</h2>
            <p className="mt-0.5 text-[11.5px] text-slate-400">Sorted by ₹ at risk · highest first</p>
          </div>
          <span className="text-[12px] text-slate-400">Total ₹ at risk <span className="font-semibold text-slate-900">{formatRupee(atRisk)}</span></span>
        </div>
        {missed.length === 0 ? (
          <p className="py-12 text-center text-[13px] text-slate-400">No missed leads. Everything worth working has been touched.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50/60">
                <tr>
                  <Th className="pl-5">Lead</Th>
                  <Th>Last activity</Th>
                  <Th>Status</Th>
                  <Th className="text-right">₹ at risk</Th>
                  <Th className="pr-5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {missed.slice(0, 4).map((m) => (
                  <tr key={m.id} className="hover:bg-rose-50/30">
                    <td className="py-3.5 pl-5 pr-3">
                      <button type="button" onClick={() => openLead(m.id)} className="flex items-center gap-3 text-left">
                        <Avatar name={m.name} />
                        <span>
                          <span className="block text-[13.5px] font-semibold text-slate-900">{m.name}</span>
                          <span className="block text-[12px] text-slate-400">{m.company}</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-3 text-[12.5px] text-slate-500">{m.staleDays} days ago</td>
                    <td className="px-3">
                      <span className="inline-flex h-7 items-center rounded-full bg-rose-50 px-3 text-[12px] font-semibold text-rose-600">Going cold</span>
                    </td>
                    <td className="px-3 text-right text-[14px] font-bold tabular-nums text-rose-500">{formatRupee(m.value)}</td>
                    <td className="px-3 pr-5 text-right">
                      <Btn size="sm" tone="soft" onClick={() => dispatch({ type: "COMPLETE_FOLLOWUP", leadId: m.id })}>Recover</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

// ── Notifications ─────────────────────────────────────────────────────────────

export function NotificationsView() {
  const { state, dispatch } = useDemo()
  const unread = state.notifications.filter((n) => !n.read)

  const KINDS = [
    { key: "sql", label: "At risk", n: state.notifications.filter((n) => n.kind === "sql").length, bg: "bg-rose-50", fg: "text-rose-500", icon: AlertTriangle },
    { key: "overdue", label: "Follow-up", n: state.notifications.filter((n) => n.kind === "overdue").length, bg: "bg-amber-50", fg: "text-amber-500", icon: Clock },
    { key: "drop", label: "Missed", n: state.notifications.filter((n) => n.kind === "drop").length, bg: "bg-slate-100", fg: "text-slate-500", icon: X },
    { key: "rec", label: "Recovery", n: state.leads.filter((l) => l.contactedToday).length, bg: "bg-emerald-50", fg: "text-emerald-600", icon: RotateCcw },
  ]

  return (
    <>
      <PageHead
        title="Notifications"
        sub={`${unread.length} unread · ${state.notifications.length} total · last 7 days`}
        action={<Btn onClick={() => dispatch({ type: "MARK_ALL_READ" })}><Check className="h-4 w-4" /> Mark all read</Btn>}
      />

      <div className="mt-4 grid grid-cols-2 gap-3 @3xl:grid-cols-4">
        {KINDS.map((k) => (
          <div key={k.key} className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3">
            <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", k.bg, k.fg)}>
              <k.icon className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">{k.label}</p>
              <p className="text-[20px] font-bold leading-none tabular-nums text-slate-900">{k.n}</p>
            </div>
          </div>
        ))}
      </div>

      <Card className="mt-4">
        <div className="divide-y divide-slate-100">
          {state.notifications.slice(0, 4).map((n) => {
            const Icon = n.kind === "sql" ? AlertTriangle : n.kind === "overdue" ? Clock : Bell
            return (
              <div key={n.id} className={cn("flex items-start gap-3 py-3.5 first:pt-0 last:pb-0", n.read && "opacity-55")}>
                <span className={cn(
                  "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                  n.kind === "sql" ? "bg-rose-50 text-rose-500" : n.kind === "overdue" ? "bg-amber-50 text-amber-500" : "bg-sky-50 text-sky-600"
                )}>
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold text-slate-900">{n.title}</p>
                  <p className="mt-0.5 text-[12.5px] text-slate-500">{n.body}</p>
                </div>
                {!n.read && <Btn size="sm" onClick={() => dispatch({ type: "MARK_READ", id: n.id })}>Read</Btn>}
              </div>
            )
          })}
        </div>
      </Card>
    </>
  )
}

// ── Import ────────────────────────────────────────────────────────────────────

export function ImportView({ onDone }: { onDone: () => void }) {
  const { dispatch } = useDemo()
  const [batch, setBatch] = useState("August portal export")
  const [source, setSource] = useState("Website form")
  const [stage, setStage] = useState<Stage>("New Inquiry")
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <>
        <PageHead title="Lead Ingestion" sub="Ingestion summary" />
        <Card className="mt-4">
          <h2 className="mb-4 text-[15px] font-semibold text-slate-900">Ingestion summary</h2>
          <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-3 @6xl:grid-cols-5">
            <StatCard icon={Inbox}       label="Total Rows"         value={6}    tintBg="bg-slate-100"  tintFg="text-slate-500" />
            <StatCard icon={Users}       label="New Leads"          value={6}    tintBg="bg-sky-50"     tintFg="text-sky-600" />
            <StatCard icon={X}           label="Duplicates Removed" value={0}    tintBg="bg-orange-50"  tintFg="text-orange-500" />
            <StatCard icon={Flame}       label="Hot Leads (A/B)"    value={2}    tintBg="bg-rose-50"    tintFg="text-rose-500" />
            <StatCard icon={IndianRupee} label="Pipeline Value"     value="₹13L" tintBg="bg-emerald-50" tintFg="text-emerald-600" />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Btn tone="primary" onClick={onDone}>See them in the queue</Btn>
            <Btn onClick={() => setDone(false)}><RotateCcw className="h-3.5 w-3.5" /> Import another</Btn>
          </div>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageHead title="Lead Ingestion" sub="Set the batch details, then bring the rows in." />
      <Card className="mt-4 max-w-3xl" pad="p-5 sm:p-6">
        <h2 className="mb-4 text-[15px] font-semibold text-slate-900">Set the batch details</h2>
        <div className="grid gap-4 @2xl:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-slate-600">Batch Name</span>
            <input value={batch} onChange={(e) => setBatch(e.target.value)}
                   className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] text-slate-900 outline-none focus:border-sky-400" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-slate-600">Lead Source</span>
            <select value={source} onChange={(e) => setSource(e.target.value)} aria-label="Lead source"
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none focus:border-sky-400">
              {["Website form", "Google Ads", "Facebook Ads", "Referral", "Trade fair", "Bulk import"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-slate-600">Initial Stage</span>
            <select value={stage} onChange={(e) => setStage(e.target.value as Stage)} aria-label="Initial stage"
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none focus:border-sky-400">
              {STAGES.slice(0, 4).map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>

        <h2 className="mb-3 mt-6 text-[15px] font-semibold text-slate-900">Upload your file</h2>
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-10 text-center">
          <Upload className="mx-auto h-6 w-6 text-slate-400" />
          <p className="mt-2 text-[13px] font-medium text-slate-700">Drop a CSV here, or browse</p>
          <p className="mt-0.5 text-[12px] text-slate-400">leads-august.csv · 6 rows ready</p>
        </div>

        <Btn tone="primary" className="mt-5" onClick={() => { dispatch({ type: "IMPORT", count: 6, source, batch }); setDone(true) }}>
          Import and grade 6 leads
        </Btn>
      </Card>
    </>
  )
}

// ── Activity ──────────────────────────────────────────────────────────────────

export function ActivityView() {
  const { state } = useDemo()
  return (
    <>
      <PageHead title="Activity" sub="Everything the team logged, newest first." />
      <Card className="mt-4">
        <ol className="relative space-y-0 border-l border-slate-200 pl-5">
          {state.activity.slice(0, 5).map((a) => (
            <li key={a.id} className="relative py-2.5">
              <span className="absolute -left-[23px] top-4 h-2 w-2 rounded-full bg-sky-400 ring-4 ring-white" />
              <p className="text-[13px] text-slate-700">
                <span className="font-semibold text-slate-900">{a.who}</span> {a.what}
                {a.lead && <> on <span className="font-medium text-slate-900">{a.lead}</span></>}
              </p>
              <p className="mt-0.5 text-[11.5px] text-slate-400">{a.at}</p>
            </li>
          ))}
        </ol>
      </Card>
    </>
  )
}

// ── Learning ──────────────────────────────────────────────────────────────────

export function LearningView() {
  return (
    <>
      <PageHead title="Learning Engine" sub="Patterns the account has enough data to state." />
      <Card title="Patterns unlocked" className="mt-4">
        <div className="divide-y divide-slate-100">
          {LEARNING_PATTERNS.slice(0, 4).map((p) => (
            <div key={p.pattern} className="flex flex-wrap items-center gap-3 py-3.5 first:pt-0 last:pb-0">
              <Brain className="h-4 w-4 shrink-0 text-violet-400" />
              <p className="min-w-[200px] flex-1 text-[13px] text-slate-700">{p.pattern}</p>
              <span className={cn(
                "inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold",
                p.confidence === "High" ? "bg-emerald-50 text-emerald-700"
                  : p.confidence === "Medium" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"
              )}>
                {p.confidence} confidence
              </span>
              <span className="text-[11.5px] tabular-nums text-slate-400">{p.sample}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
