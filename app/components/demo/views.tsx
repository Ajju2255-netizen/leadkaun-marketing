"use client"

import { useMemo, useState } from "react"
import {
  Upload, Search, Inbox, Flame, PhoneCall, IndianRupee, Trophy, Zap, AlertTriangle,
  Activity as ActivityIcon, Check, Clock, Bell, LayoutDashboard, Users, Columns2,
  CalendarCheck, BarChart2, ChevronDown, ChevronRight, Crown, Download, Plus,
  MessageCircle, Mail, Target, ShieldCheck, Sparkles, RotateCcw, X, TrendingUp,
  CircleCheck, Snowflake,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  activeAgo, contribution, formatRupee, gradeOf, nextAction, rankScore, totalScore,
  STAGES, STAGE_DOT, WEIGHTS, LEARNING_PATTERNS, REPS, type DemoLead, type Stage,
} from "@/lib/demo-app"
import {
  Avatar, Btn, Card, GradeBadge, Kpi, PageHeader, ScoreCell, SourcePill, Th, useDemo,
} from "./primitives"

// ── Priority Queue ────────────────────────────────────────────────────────────

const GRADE_TABS = [
  { key: "all", label: "All leads", dot: "" },
  { key: "A", label: "Grade A", dot: "bg-emerald-400" },
  { key: "B", label: "Grade B", dot: "bg-sky-400" },
  { key: "C", label: "Grade C", dot: "bg-orange-400" },
  { key: "D", label: "Grade D", dot: "bg-orange-500" },
  { key: "E", label: "Grade E", dot: "bg-rose-400" },
  { key: "F", label: "Grade F", dot: "bg-slate-400" },
]

/** The ranked ribbon on the left of each queue row. Top three carry a crown. */
function RankRibbon({ rank }: { rank: number }) {
  const top = rank <= 3
  return (
    <span
      className={cn(
        "relative grid h-[52px] w-9 shrink-0 place-items-center rounded-md text-[13px] font-bold",
        top ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
      )}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)" }}
    >
      <span className="flex flex-col items-center gap-0.5 pb-2">
        {top && <Crown className="h-3 w-3" strokeWidth={2.5} />}
        {rank}
      </span>
    </span>
  )
}

function ActionPill({ grade, onClick }: { grade: string; onClick: () => void }) {
  if (grade === "A" || grade === "B") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-sky-500 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-sky-600"
      >
        🔥 Call now
      </button>
    )
  }
  if (grade === "C") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-sky-200 bg-white px-4 text-[13px] font-semibold text-sky-700 transition-colors hover:bg-sky-50"
      >
        🌱 Nurture
      </button>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-500 transition-colors hover:bg-slate-50"
    >
      ⏳ Low priority
    </button>
  )
}

function QueueRow({ lead, rank, onOpen }: { lead: DemoLead; rank: number; onOpen: () => void }) {
  const g = gradeOf(lead)
  return (
    <div
      onClick={onOpen}
      className="flex cursor-pointer flex-wrap items-center gap-3 px-4 py-3.5 transition-colors hover:bg-sky-50/40 sm:flex-nowrap sm:gap-4"
    >
      <RankRibbon rank={rank} />
      <Avatar name={lead.name} size={44} />
      <div className="min-w-[150px] flex-1">
        <p className="truncate text-[14px] font-bold text-slate-800">{lead.name}</p>
        <p className="mt-0.5 text-[12.5px] leading-snug text-slate-400">
          <span className="text-slate-500">{lead.company}</span> · {lead.signal}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <SourcePill source={lead.source} />
          <span className="text-[11.5px] text-slate-400">· Active {activeAgo(lead.activeMinutesAgo)}</span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-slate-400">Est. revenue</p>
        <p className="text-[17px] font-bold leading-tight tabular-nums text-slate-800">{formatRupee(lead.value)}</p>
      </div>
      <ActionPill grade={g} onClick={onOpen} />
    </div>
  )
}

export function QueueView({ onImport }: { onImport: () => void }) {
  const { state, openLead } = useDemo()
  const [tab, setTab] = useState("all")

  const ranked = useMemo(() => [...state.leads].sort((a, b) => rankScore(b) - rankScore(a)), [state.leads])
  const rows = tab === "all" ? ranked : ranked.filter((l) => gradeOf(l) === tab)
  const high = state.leads.filter((l) => ["A", "B"].includes(gradeOf(l))).length
  const potential = ranked.slice(0, 3).reduce((s, l) => s + l.value, 0)
  const total = state.leads.reduce((s, l) => s + l.value, 0)

  const top = rows.slice(0, 5)
  const rest = rows.slice(5)

  return (
    <div className="flex flex-col gap-5 xl:flex-row">
      {/* Left summary column */}
      <div className="w-full shrink-0 xl:w-[300px]">
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-100 text-sky-600">
              <Zap className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-slate-800">Priority Queue</h2>
              <p className="mt-1 text-[12.5px] leading-snug text-slate-400">
                Your ranked list of leads most likely to convert.
              </p>
            </div>
          </div>

          {/* The product shows an illustration here; this is the same idea in bars. */}
          <div className="my-6 flex items-end justify-center gap-3" aria-hidden>
            <span className="h-12 w-14 rounded-lg bg-gradient-to-b from-violet-200 to-violet-300" />
            <span className="relative h-24 w-16 rounded-lg bg-gradient-to-b from-sky-300 to-sky-400">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[22px]">⭐</span>
            </span>
            <span className="h-16 w-14 rounded-lg bg-gradient-to-b from-violet-300 to-violet-400" />
          </div>

          <div className="rounded-xl bg-slate-50/80 p-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-sky-600">High priority</p>
            <p className="mt-1.5 text-[30px] font-bold leading-none tabular-nums text-slate-800">{high}</p>
            <p className="mt-1.5 text-[11.5px] text-slate-400">leads · vs last 7 days</p>
            <div className="mt-4 border-t border-slate-200/70 pt-4">
              <p className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                <TrendingUp className="h-3 w-3" /> Est. revenue
              </p>
              <p className="mt-1.5 text-[26px] font-bold leading-none tabular-nums text-slate-800">{formatRupee(total)}</p>
              <p className="mt-1.5 text-[11.5px] text-slate-400">potential this week</p>
            </div>
          </div>

          <p className="mt-4 flex items-start gap-1.5 text-[11.5px] leading-snug text-slate-400">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Ranked by activity, intent and conversion probability.
          </p>
        </Card>
      </div>

      {/* Right column */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-slate-400">
          <span><span className="font-bold text-slate-800">{state.leads.length}</span> active leads</span>
          <span>·</span>
          <span><span className="font-bold text-sky-600">{high}</span> high priority</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> LIVE
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
          <span className="inline-flex h-9 min-w-[180px] flex-1 items-center gap-2 rounded-lg px-3 text-[13px] text-slate-400 sm:flex-none">
            <Search className="h-4 w-4" /> Search leads…
          </span>
          {["All reps", "All Sources"].map((f) => (
            <span key={f} className="inline-flex h-9 items-center gap-1.5 border-l border-slate-200 px-3 text-[13px] text-slate-500">
              {f} <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </span>
          ))}
          <button type="button" onClick={onImport} className="inline-flex h-9 items-center gap-1.5 px-3 text-[13px] text-slate-500 hover:text-sky-600">
            <Upload className="h-3.5 w-3.5" /> Import
          </button>
        </div>

        <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
          <div className="divide-y divide-slate-100">
            {top.map((l, i) => <QueueRow key={l.id} lead={l} rank={i + 1} onOpen={() => openLead(l.id)} />)}
            {top.length === 0 && <p className="px-4 py-10 text-center text-[13px] text-slate-400">Nothing in this band right now.</p>}
          </div>
        </div>

        {/* Actions banner */}
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-50 to-sky-50 px-4 py-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-violet-500">
            <Target className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <div className="min-w-[180px] flex-1">
            <p className="text-[13.5px] font-bold text-slate-800">Complete {Math.min(3, top.length)} actions today</p>
            <p className="text-[12.5px] text-slate-500">You could unlock {formatRupee(potential)} in potential revenue.</p>
          </div>
          <button
            type="button"
            onClick={() => top[0] && openLead(top[0].id)}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-violet-500 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-violet-600"
          >
            Start Now <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
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
                  "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-semibold transition-all",
                  active ? "bg-sky-100 text-sky-700" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                {t.dot && <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", t.dot)} />}
                {t.label}
                <span className={cn("rounded-full px-1.5 text-[11px] font-bold tabular-nums", active ? "bg-white/70 text-sky-700" : "bg-slate-100 text-slate-500")}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {rest.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
            <div className="divide-y divide-slate-100">
              {rest.map((l, i) => <QueueRow key={l.id} lead={l} rank={i + 6} onOpen={() => openLead(l.id)} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── All Leads ─────────────────────────────────────────────────────────────────

export function LeadsView({ onImport }: { onImport: () => void }) {
  const { state, dispatch, openLead } = useDemo()
  const [q, setQ] = useState("")
  const [stage, setStage] = useState<"All" | Stage>("All")

  const rows = state.leads.filter((l) => {
    const hay = `${l.name} ${l.company} ${l.source} ${l.phone}`.toLowerCase()
    return hay.includes(q.toLowerCase()) && (stage === "All" || l.stage === stage)
  })
  const gradeA = state.leads.filter((l) => gradeOf(l) === "A")

  return (
    <>
      <PageHeader
        icon={Users}
        title="All Leads"
        sub={`${state.leads.length} leads`}
        action={
          <>
            <button type="button" className="inline-flex h-9 items-center gap-1.5 px-3 text-[13px] font-medium text-slate-600 hover:text-sky-600">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <Btn tone="primary" onClick={onImport}><Plus className="h-4 w-4" /> Import</Btn>
          </>
        }
      />

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <label className="flex h-9 min-w-[220px] flex-1 items-center gap-2 rounded-lg bg-slate-50 px-3 focus-within:bg-white focus-within:ring-1 focus-within:ring-sky-300">
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
        <div className="flex flex-wrap items-center gap-1">
          {(["All", ...STAGES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStage(s)}
              className={cn(
                "h-8 rounded-full px-3 text-[12px] font-medium transition-colors",
                stage === s ? "bg-sky-100 text-sky-700" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {gradeA.length > 0 && (
        <div className="mt-4 flex items-center gap-3 overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-r from-white to-orange-50/60 px-4 py-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-100 text-orange-500">
            <Flame className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-bold text-slate-800">{gradeA.length} Grade A leads need immediate attention</p>
            <p className="truncate text-[12.5px] text-slate-500">{gradeA.slice(0, 3).map((l) => l.name).join(" · ")}{gradeA.length > 3 ? ` +${gradeA.length - 3} more` : ""}</p>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse">
            <thead className="border-b border-slate-100">
              <tr>
                <Th className="pl-5">Lead</Th>
                <Th className="text-right">Score</Th>
                <Th>Grade</Th>
                <Th>Fit</Th>
                <Th>Intent</Th>
                <Th>Quality</Th>
                <Th>Stage</Th>
                <Th>Rep</Th>
                <Th className="pr-5 text-right">Last activity</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((l) => {
                const score = totalScore(l)
                return (
                  <tr key={l.id} onClick={() => openLead(l.id)} className="cursor-pointer transition-colors hover:bg-sky-50/40">
                    <td className="py-3.5 pl-5 pr-3">
                      <p className="text-[13.5px] font-bold text-slate-800">{l.name}</p>
                      <p className="mt-0.5 text-[12px] text-slate-400">{l.company}</p>
                    </td>
                    <td className="px-3 text-right">
                      <span className={cn("text-[16px] font-bold tabular-nums", score >= 60 ? "text-sky-600" : score >= 45 ? "text-orange-500" : "text-slate-400")}>
                        {score}
                      </span>
                    </td>
                    <td className="px-3"><GradeBadge grade={gradeOf(l)} /></td>
                    <td className="px-3"><ScoreCell value={contribution(l.fit, WEIGHTS.fit)} of={WEIGHTS.fit} tone="fit" /></td>
                    <td className="px-3"><ScoreCell value={contribution(l.intent, WEIGHTS.intent)} of={WEIGHTS.intent} tone="intent" /></td>
                    <td className="px-3"><ScoreCell value={contribution(l.quality, WEIGHTS.quality)} of={WEIGHTS.quality} tone="quality" /></td>
                    <td className="px-3">
                      <select
                        value={l.stage}
                        aria-label={`Stage for ${l.name}`}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => dispatch({ type: "SET_STAGE", leadId: l.id, stage: e.target.value as Stage })}
                        className="h-7 cursor-pointer rounded-full border border-slate-200 bg-white px-2 text-[12px] text-slate-700 outline-none hover:border-sky-300"
                      >
                        {STAGES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-3"><Avatar name={l.rep} size={26} single={false} /></td>
                    <td className="px-3 pr-5 text-right text-[12px] text-slate-400">{activeAgo(l.activeMinutesAgo)}</td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-10 text-center text-[13px] text-slate-400">No leads match that.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

const FUNNEL_STAGES: Stage[] = ["New Inquiry", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Follow-up", "Won"]

export function DashboardView({ onImport }: { onImport: () => void }) {
  const { state } = useDemo()
  const won = state.leads.filter((l) => l.stage === "Won")
  const contacted = state.leads.filter((l) => l.stage !== "New Inquiry")
  const entered = state.leads.length

  const health = [
    { label: "Healthy", n: state.leads.filter((l) => ["A", "B"].includes(gradeOf(l))).length, icon: ActivityIcon, tone: "text-emerald-600", bar: "bg-emerald-400" },
    { label: "At risk", n: state.leads.filter((l) => gradeOf(l) === "C").length, icon: AlertTriangle, tone: "text-orange-500", bar: "bg-orange-400" },
    { label: "Missed", n: state.leads.filter((l) => l.staleDays >= 14).length, icon: Flame, tone: "text-rose-500", bar: "bg-rose-400" },
    { label: "Cold", n: state.leads.filter((l) => ["D", "E", "F"].includes(gradeOf(l))).length, icon: Snowflake, tone: "text-slate-500", bar: "bg-slate-300" },
  ]

  const sources = useMemo(() => {
    const m = new Map<string, number>()
    state.leads.forEach((l) => m.set(l.source, (m.get(l.source) ?? 0) + 1))
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }, [state.leads])

  return (
    <>
      <PageHeader
        icon={LayoutDashboard}
        title="Sales Behaviour Pulse"
        sub="Today's revenue radar. What your team did, what's slipping, and where the next ₹ is hiding."
        action={
          <>
            <Btn onClick={onImport}><Plus className="h-4 w-4" /> Import leads</Btn>
            <Btn><CalendarCheck className="h-4 w-4" /> This Month</Btn>
          </>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Kpi icon={Users} label="New Leads" value={String(state.leads.length)} tintBg="bg-sky-100" tintFg="text-sky-600" caption="vs last month" />
        <Kpi icon={PhoneCall} label="First Contacts Made" value={String(contacted.length)} tintBg="bg-orange-100" tintFg="text-orange-500" delta="100.0%" caption="vs last month" />
        <Kpi icon={CircleCheck} label="Follow-ups Completed" value={String(state.leads.filter((l) => l.contactedToday).length)} tintBg="bg-violet-100" tintFg="text-violet-500" caption="vs last month" />
        <Kpi icon={Trophy} label="Leads Won" value={String(won.length)} tintBg="bg-emerald-100" tintFg="text-emerald-600" caption="vs last month" />
        <Kpi icon={IndianRupee} label="Revenue" value={formatRupee(won.reduce((s, l) => s + l.value, 0))} tintBg="bg-emerald-100" tintFg="text-emerald-600" caption="closed value" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card
          title="Pipeline Funnel"
          meta={<span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">All-time</span>}
          action={<span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">{entered} leads entered</span>}
        >
          <div className="space-y-2.5">
            {FUNNEL_STAGES.map((s) => {
              const n = state.leads.filter((l) => l.stage === s).length
              const pct = Math.round((n / Math.max(entered, 1)) * 100)
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className="flex w-[112px] shrink-0 items-center gap-2 text-[12.5px] text-slate-600">
                    <span className={cn("h-1.5 w-1.5 rounded-full", STAGE_DOT[s])} /> {s}
                  </span>
                  <span className="h-6 flex-1 overflow-hidden rounded-full bg-slate-50">
                    <span className={cn("block h-full rounded-full transition-all duration-500", STAGE_DOT[s])} style={{ width: `${Math.max(pct, 3)}%` }} />
                  </span>
                  <span className="w-[62px] shrink-0 text-right text-[12.5px] tabular-nums">
                    <span className="font-bold text-slate-800">{n}</span> <span className="text-slate-400">({pct}%)</span>
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-sky-50/70 px-4 py-3">
            <Sparkles className="h-4 w-4 shrink-0 text-sky-500" />
            <p className="text-[13px] text-slate-700">
              <span className="font-bold">Your conversion rate is {Math.round((won.length / Math.max(entered, 1)) * 100)}%.</span>{" "}
              <span className="text-slate-400">Goal: 15%.</span>
            </p>
          </div>
        </Card>

        <Card title="Top Performing Reps" action={<span className="text-[12px] font-semibold text-sky-600">View all →</span>}>
          <div className="space-y-4">
            {REPS.map((r, i) => (
              <div key={r.name}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] font-semibold text-slate-800">{r.name}</span>
                  <span className="flex items-baseline gap-3">
                    <span className="text-[11.5px] text-slate-400">{4 - i} wins</span>
                    <span className="text-[13px] font-bold tabular-nums text-slate-800">{formatRupee(r.won)}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full", ["bg-emerald-400", "bg-sky-400", "bg-violet-400", "bg-orange-400"][i])}
                    style={{ width: `${100 - i * 22}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Active Sources">
          <div className="space-y-3">
            {sources.map(([src, n]) => (
              <div key={src} className="flex items-center justify-between gap-2">
                <span className="truncate text-[13px] text-slate-700">{src}</span>
                <span className="text-[12.5px] tabular-nums text-slate-400"><span className="font-bold text-slate-800">{n}</span> leads</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Activity">
          <div className="space-y-3.5">
            {state.activity.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-orange-100 text-orange-500">
                  <ActivityIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold text-slate-800">{a.who} {a.what}</p>
                  <p className="truncate text-[11.5px] text-slate-400">{a.lead}</p>
                </div>
                <span className="shrink-0 text-[11px] text-slate-400">{a.at}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Behaviour Health">
          <div className="space-y-3">
            {health.map((h) => (
              <div key={h.label}>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[12.5px] text-slate-600">
                    <h.icon className={cn("h-3.5 w-3.5", h.tone)} strokeWidth={2.5} /> {h.label}
                  </span>
                  <span className="text-[12.5px] font-bold tabular-nums text-slate-800">{h.n}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full", h.bar)} style={{ width: `${(h.n / Math.max(state.leads.length, 1)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
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
      <PageHeader
        icon={Columns2}
        title="Pipeline"
        sub="Auto-stage tracker for every deal in motion. Moves when calls and WhatsApp signals land."
        action={
          <>
            <span className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
              {["All", "Hot A+B", "A", "B"].map((f, i) => (
                <span key={f} className={cn("rounded-full px-3 py-1 text-[12px] font-semibold", i === 0 ? "bg-sky-500 text-white" : "text-slate-500")}>{f}</span>
              ))}
            </span>
            <Btn tone="primary"><Sparkles className="h-4 w-4" /> Add leads</Btn>
          </>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Kpi dot="bg-sky-400" label="Total Deals" value={String(state.leads.length)} caption="vs May 2026" spark={[4, 6, 5, 8, 7, 9, 12]} />
        <Kpi dot="bg-violet-400" label="Open Deals" value={String(open)} caption="vs May 2026" spark={[8, 7, 9, 6, 8, 7, 9]} />
        <Kpi dot="bg-emerald-400" label="Won Deals" value={String(won)} caption="vs May 2026" spark={[1, 2, 1, 3, 2, 4, 5]} />
        <Kpi dot="bg-orange-400" label="Lost Deals" value={String(lost)} caption="vs May 2026" spark={[2, 1, 3, 2, 1, 2, 1]} />
        <Kpi dot="bg-sky-400" label="Win Rate" value={`${Math.round((won / Math.max(won + lost, 1)) * 100)}%`} caption="vs May 2026" spark={[3, 5, 4, 7, 5, 8, 9]} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {BOARD.map((stage) => {
          const inStage = state.leads.filter((l) => l.stage === stage)
          const next = STAGES[STAGES.indexOf(stage) + 1]
          return (
            <div key={stage} className="rounded-2xl border border-slate-200/70 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-slate-800">
                  <span className={cn("h-2 w-2 rounded-full", STAGE_DOT[stage])} /> {stage}
                </p>
                <span className="text-slate-300">···</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between text-[12px]">
                <span className="text-slate-400"><span className="font-bold text-slate-800">{inStage.length}</span> Deals</span>
                <span className="font-semibold tabular-nums text-slate-500">{formatRupee(inStage.reduce((s, l) => s + l.value, 0))}</span>
              </div>
              <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-slate-100">
                <div className={cn("h-full rounded-full", STAGE_DOT[stage])} style={{ width: `${Math.max(6, (inStage.length / Math.max(state.leads.length, 1)) * 100)}%` }} />
              </div>

              <div className="mt-4 space-y-4">
                {inStage.map((l) => (
                  <div key={l.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <button type="button" onClick={() => openLead(l.id)} className="flex w-full items-start gap-2 text-left">
                      <GradeBadge grade={gradeOf(l)} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-bold text-slate-800">{l.name}</span>
                        <span className="block truncate text-[11.5px] text-slate-400">{l.email}</span>
                      </span>
                      <span className="shrink-0 text-[12.5px] font-bold tabular-nums text-slate-800">{formatRupee(l.value)}</span>
                    </button>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {l.staleDays > 0 && (
                        <span className="inline-flex h-6 items-center gap-1 rounded-full bg-rose-50 px-2 text-[11px] font-medium text-rose-600">
                          <Clock className="h-3 w-3" /> {l.staleDays}d · stuck
                        </span>
                      )}
                      {["A", "B"].includes(gradeOf(l)) && (
                        <span className="inline-flex h-6 items-center gap-1 rounded-full bg-amber-50 px-2 text-[11px] font-medium text-amber-600">🔥 Hot</span>
                      )}
                      {next && (
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "SET_STAGE", leadId: l.id, stage: next })}
                          className="inline-flex h-6 items-center gap-1 rounded-full bg-emerald-50 px-2 text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                        >
                          Move to {next}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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

// ── Follow-up Engine ──────────────────────────────────────────────────────────

export function FollowUpsView() {
  const { state, dispatch, openLead } = useDemo()
  const due = state.leads.filter((l) => l.followUp)
  const overdue = due.filter((l) => l.followUp === "overdue")
  const done = state.leads.filter((l) => l.contactedToday).length
  const score = Math.round((done / Math.max(done + due.length, 1)) * 100)
  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  return (
    <>
      <PageHeader icon={Zap} title="Follow-up Engine" sub="Consistency wins deals. The right follow-up, at the right time." />

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card className="relative overflow-hidden">
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-600">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> Follow-up score
          </p>
          <div className="mt-4 grid place-items-center">
            <div className="relative grid h-[132px] w-[132px] place-items-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                <circle cx="50" cy="50" r="44" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="44" fill="none" stroke="#10B981" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 276} 276`}
                />
              </svg>
              <div className="text-center">
                <p className="text-[26px] font-bold leading-none tabular-nums text-slate-800">{score}<span className="text-[15px]">%</span></p>
                <p className="mt-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.1em] text-emerald-600">
                  {score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs work"}
                </p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-[13px] font-semibold text-slate-700">
            {score >= 80 ? "You're doing great!" : "Keep working the list."}
          </p>
          <p className="text-center text-[11.5px] text-slate-400">Keep up the consistency.</p>
        </Card>

        <Card>
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-600">
            <Users className="h-3.5 w-3.5 text-sky-500" /> Active leads
          </p>
          <p className="mt-3 text-[44px] font-bold leading-none tabular-nums text-slate-800">{state.leads.length}</p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11.5px] font-semibold text-sky-700">
            <TrendingUp className="h-3 w-3" /> +{done} this week
          </span>
          <p className="mt-3 text-[11.5px] text-slate-400">Open · not won, not lost.</p>
        </Card>

        <Card>
          <div className="flex items-baseline justify-between">
            <p className="text-[13px] font-semibold text-slate-800">This week&apos;s consistency</p>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">7-day</span>
          </div>
          <div className="mt-4 flex items-end justify-between gap-1">
            {DAYS.map((d, i) => (
              <div key={d} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="font-mono text-[9.5px] font-semibold text-slate-400">{d}</span>
                <span className={cn(
                  "grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold",
                  i === 5 ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-300"
                )}>
                  {i === 5 ? <Clock className="h-3.5 w-3.5" /> : "·"}
                </span>
                {i === 5 && <span className="text-[9.5px] font-semibold text-sky-600">Today</span>}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-100 text-violet-500">
            <Target className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <p className="mt-3 text-[13.5px] font-bold text-slate-800">Stay consistent</p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">
            Leads engaged in <span className="font-bold text-slate-700">3+ follow-ups</span> are far more likely to convert.
          </p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card title="Today's sequence" action={<span className="text-[12px] text-slate-400">Call → Close</span>}>
          <div className="flex items-center justify-between gap-1">
            {[
              { icon: PhoneCall, label: "Call" }, { icon: MessageCircle, label: "WhatsApp" },
              { icon: Mail, label: "Email" }, { icon: Clock, label: "Follow-up" }, { icon: Target, label: "Close" },
            ].map((s, i, arr) => (
              <div key={s.label} className="flex flex-1 items-center">
                <div className="flex flex-1 flex-col items-center gap-2">
                  <span className={cn(
                    "grid h-12 w-12 place-items-center rounded-full",
                    i === arr.length - 1 ? "bg-rose-50 text-rose-400" : "bg-sky-100 text-sky-600"
                  )}>
                    <s.icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="text-[12px] font-semibold text-slate-700">{s.label}</span>
                  <span className={cn("text-[11px]", i === arr.length - 1 ? "text-rose-400" : "text-slate-400")}>
                    {i === arr.length - 1 ? "Not done" : "Queued"}
                  </span>
                </div>
                {i < arr.length - 1 && <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />}
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent activity" action={<span className="text-[12px] text-slate-400">Last 24h</span>}>
          <div className="space-y-3">
            {state.activity.slice(0, 4).map((a) => (
              <p key={a.id} className="text-[12.5px] text-slate-600">
                <span className="font-semibold text-slate-800">{a.who}</span> {a.what}
                <span className="ml-1 text-slate-400">· {a.at}</span>
              </p>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Upcoming follow-ups" action={<span className="text-[12px] text-slate-400">{due.length} scheduled</span>} className="mt-4">
        {due.length === 0 ? (
          <div className="grid place-items-center py-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CalendarCheck className="h-5 w-5" />
            </span>
            <p className="mt-3 text-[14px] font-bold text-slate-800">All caught up</p>
            <p className="text-[12.5px] text-slate-400">Nothing scheduled in the next week.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {due.map((l) => (
              <div key={l.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                <button type="button" onClick={() => openLead(l.id)} className="flex min-w-[170px] flex-1 items-center gap-3 text-left">
                  <Avatar name={l.name} size={34} />
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-bold text-slate-800">{l.name}</span>
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
                <span className="w-[62px] text-right text-[13px] font-bold tabular-nums text-slate-800">{formatRupee(l.value)}</span>
                <span className="flex gap-1.5">
                  <Btn size="sm" tone="soft" onClick={() => dispatch({ type: "COMPLETE_FOLLOWUP", leadId: l.id })}><Check className="h-3.5 w-3.5" /> Done</Btn>
                  {l.followUp === "overdue" && <Btn size="sm" onClick={() => dispatch({ type: "SNOOZE_FOLLOWUP", leadId: l.id })}>Today</Btn>}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
      <p className="mt-2 text-right text-[11.5px] text-slate-400">Overdue: {overdue.length}</p>
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
      <PageHeader
        icon={BarChart2}
        title="Analytics"
        sub="Find what's slowing your pipeline. See loss patterns, recovery potential, and one-click fixes."
        action={
          <>
            <Btn tone="pill">Missed Opps →</Btn>
            <span className="flex items-center gap-1 rounded-full border border-slate-200 p-1">
              {["7 days", "30 days", "90 days"].map((d, i) => (
                <span key={d} className={cn("rounded-full px-3 py-1 text-[12px] font-semibold", i === 1 ? "bg-sky-500 text-white" : "text-slate-500")}>{d}</span>
              ))}
            </span>
          </>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Kpi icon={AlertTriangle} label="₹ Missed" value={formatRupee(missedValue)} tintBg="bg-rose-100" tintFg="text-rose-500" caption={`${missed.length} leads`} />
        <Kpi icon={Target} label="₹ Recoverable" value={formatRupee(recoverable)} tintBg="bg-emerald-100" tintFg="text-emerald-600" caption="overdue follow-ups →" />
        <Kpi icon={Clock} label="Speed-to-Win avg" value="—" tintBg="bg-sky-100" tintFg="text-sky-600" caption="not enough data" />
        <Kpi icon={Clock} label="Speed-to-Miss avg" value="3h" tintBg="bg-orange-100" tintFg="text-orange-500" caption="for missed leads" />
        <Kpi icon={TrendingUp} label="7-Day Trend" value="Improving" tintBg="bg-violet-100" tintFg="text-violet-500" caption={`${formatRupee(missedValue)} all-time`} />
      </div>

      <Card title="Daily Miss Trend" action={<span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">₹ missed per day</span>} className="mt-4">
        <div className="relative h-[190px] w-full">
          <svg viewBox="0 0 700 170" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="missFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              fill="url(#missFill)"
              points={trend.map((v, i) => `${(i / 6) * 660 + 20},${150 - (v / 100) * 120}`).join(" ") + " 680,150 20,150"}
            />
            <polyline
              fill="none" stroke="#F43F5E" strokeWidth="2" vectorEffect="non-scaling-stroke"
              points={trend.map((v, i) => `${(i / 6) * 660 + 20},${150 - (v / 100) * 120}`).join(" ")}
            />
            {trend.map((v, i) => (
              <circle key={i} cx={(i / 6) * 660 + 20} cy={150 - (v / 100) * 120} r="4"
                      fill={i === 6 ? "#F43F5E" : "#fff"} stroke="#F43F5E" strokeWidth="2" />
            ))}
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex justify-between px-2">
            {DAYS.map((d, i) => (
              <span key={d} className={cn("text-[11px]", i === 6 ? "font-bold text-slate-700" : "text-slate-400")}>{d}</span>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card title="Why You're Losing" action={<span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">{missed.length} leads · {formatRupee(missedValue)}</span>}>
          <div className="space-y-3">
            {losses.map((l) => (
              <div key={l.label} className="rounded-2xl border border-slate-200/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-500">❄️</span>
                    <div>
                      <p className="text-[13.5px] font-bold text-slate-800">{l.label}</p>
                      <p className="text-[12px] text-slate-400">{l.n} leads</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-bold tabular-nums text-rose-500">{formatRupee(l.value)}</p>
                    <p className="text-[11.5px] text-slate-400">{l.pct}% of losses</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full", l.tone)} style={{ width: `${l.pct}%` }} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-sky-50/70 px-3 py-2.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-sky-600">Fix</span>
                  <p className="min-w-[180px] flex-1 text-[12.5px] text-slate-700">{l.fix}</p>
                  <Btn size="sm" tone="pill">Follow-ups →</Btn>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card title="Speed to First Contact">
            <div className="flex items-baseline justify-between">
              <span className="text-[12.5px] text-slate-500">Missed leads</span>
              <span className="text-[15px] font-bold text-rose-500">3h</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-rose-400" style={{ width: "68%" }} />
            </div>
          </Card>
          <Card title="Recovery Simulation">
            <p className="text-[12.5px] leading-relaxed text-slate-400">
              Simulation appears when average response time exceeds 3h.
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}

// ── Rep tracking ──────────────────────────────────────────────────────────────

function RepScoreRing({ score }: { score: number }) {
  return (
    <div className="relative grid h-11 w-11 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="10" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#F43F5E" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 264} 264`} />
      </svg>
      <span className="text-[12px] font-bold tabular-nums text-slate-700">{score}</span>
    </div>
  )
}

export function RepTrackingView() {
  const recovered = REPS.reduce((s, r) => s + r.won, 0)
  return (
    <>
      <PageHeader icon={Users} title="Sales Rep Tracking" sub="Per-rep ₹ recovered, Grade A response time, follow-up completion." />

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12.5px] font-medium text-slate-500">₹ Recovered</p>
              <p className="mt-2 text-[30px] font-bold leading-none tabular-nums text-emerald-600">{formatRupee(recovered)}</p>
              <p className="mt-2 text-[12px] text-slate-400">This month</p>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <IndianRupee className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12.5px] font-medium text-slate-500">Grade A Response Time</p>
              <p className="mt-2 text-[30px] font-bold leading-none text-sky-600">3h 3m</p>
              <p className="mt-2 text-[12px] text-slate-400">Average</p>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-sky-100 text-sky-600">
              <Clock className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12.5px] font-medium text-slate-500">Follow-up Completion</p>
              <p className="mt-2 text-[30px] font-bold leading-none text-violet-500">86%</p>
              <p className="mt-2 text-[12px] text-slate-400">Completed</p>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-violet-100 text-violet-500">
              <CircleCheck className="h-5 w-5" />
            </span>
          </div>
        </Card>
      </div>

      <Card title="Rep Performance Overview" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <Th>Rep</Th>
                <Th>₹ Recovered</Th>
                <Th>Grade A response time</Th>
                <Th>Follow-up completion</Th>
                <Th className="text-right">Rep score</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {REPS.map((r, i) => (
                <tr key={r.name}>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.name} size={34} />
                      <span className="text-[13.5px] font-semibold text-slate-800">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-3">
                    <p className="text-[13px] font-semibold tabular-nums text-slate-800">₹{r.won.toLocaleString("en-IN")}</p>
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
                  <td className="px-3">
                    <div className="flex justify-end"><RepScoreRing score={Math.round(r.completion * 0.6)} /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[12px] text-slate-400">
          This measures whether the recommendation was followed, not whether it worked. The two are different questions.
        </p>
      </Card>
    </>
  )
}

// ── Missed Opportunity Engine ─────────────────────────────────────────────────

export function MissedView() {
  const { state, dispatch, openLead } = useDemo()
  const missed = state.leads.filter((l) => l.staleDays >= 14).sort((a, b) => b.value - a.value)
  const atRisk = missed.reduce((s, l) => s + l.value, 0)

  return (
    <>
      <PageHeader icon={AlertTriangle} title="Missed Opportunity Engine" tint="rose"
        sub="Every stale lead gets a rupee value. Aggregate ₹ at risk, surfaced daily." />

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card className="relative overflow-hidden">
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-600"><IndianRupee className="h-3.5 w-3.5 text-rose-500" /> ₹ at risk today</p>
          <p className="mt-3 text-[28px] font-bold leading-none tabular-nums text-rose-500">{formatRupee(atRisk)}</p>
          <p className="mt-3 text-[11.5px] text-slate-400">First snapshot</p>
          <p className="text-[11.5px] text-slate-400">{missed.length} stale leads · in pool now.</p>
        </Card>
        <Card>
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-600"><TrendingUp className="h-3.5 w-3.5 text-rose-500" /> 7-day trend</p>
          <div className="mt-6 h-[2px] w-full rounded-full bg-gradient-to-r from-rose-200 to-rose-500" />
          <p className="mt-6 text-right text-[11.5px] text-slate-400">Need 7+ days</p>
        </Card>
        <Card>
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-600"><Trophy className="h-3.5 w-3.5 text-emerald-600" /> Recovered · 7d</p>
          <p className="mt-3 text-[28px] font-bold leading-none tabular-nums text-emerald-600">
            {state.leads.filter((l) => l.contactedToday && l.staleDays === 0).length}
          </p>
          <p className="mt-3 text-[11.5px] text-slate-400">A/B leads won, last 7 days.</p>
        </Card>
        <Card>
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-600"><Users className="h-3.5 w-3.5 text-sky-500" /> By grade · top</p>
          <div className="mt-3 space-y-2">
            {(["A", "B", "C"] as const).map((g) => (
              <div key={g} className="flex items-center gap-2">
                <GradeBadge grade={g} size="sm" />
                <span className="flex-1 text-[12px] text-slate-500">{missed.filter((l) => gradeOf(l) === g).length} stale</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card
        title="High-value missed opportunities"
        meta={<span className="text-[11.5px] text-slate-400">Sorted by ₹ at risk · highest first</span>}
        action={<span className="grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-[11px] font-bold text-white">{missed.length}</span>}
        className="mt-4"
      >
        {missed.length === 0 ? (
          <p className="py-10 text-center text-[13px] text-slate-400">Nothing has gone stale.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <Th>Lead</Th>
                  <Th>Last activity</Th>
                  <Th>Status</Th>
                  <Th className="text-right">₹ at risk</Th>
                  <Th />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {missed.map((m) => (
                  <tr key={m.id} className="hover:bg-rose-50/30">
                    <td className="py-3.5">
                      {/* The name is the click target, not the whole row: the row also
                          carries a Recover button, and one click must mean one thing. */}
                      <button type="button" onClick={() => openLead(m.id)} className="flex items-center gap-3 text-left">
                        <Avatar name={m.name} size={34} />
                        <span>
                          <span className="block text-[13.5px] font-bold text-slate-800">{m.name}</span>
                          <span className="block text-[12px] text-slate-400">{m.company}</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-3 text-[12.5px] text-slate-500">{m.staleDays} days ago</td>
                    <td className="px-3">
                      <span className="inline-flex h-7 items-center rounded-full bg-rose-50 px-3 text-[12px] font-semibold text-rose-600">Going cold</span>
                    </td>
                    <td className="px-3 text-right text-[14px] font-bold tabular-nums text-rose-500">{formatRupee(m.value)}</td>
                    <td className="px-3 text-right">
                      <Btn size="sm" tone="soft" onClick={() => dispatch({ type: "COMPLETE_FOLLOWUP", leadId: m.id })}>Recover</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}

// ── Notifications ─────────────────────────────────────────────────────────────

export function NotificationsView() {
  const { state, dispatch } = useDemo()
  const [filter, setFilter] = useState<"all" | "unread" | "high">("all")
  const unread = state.notifications.filter((n) => !n.read)
  const list = filter === "unread" ? unread : filter === "high" ? state.notifications.filter((n) => n.kind === "sql") : state.notifications

  const KINDS = [
    { key: "sql", label: "At risk", n: state.notifications.filter((n) => n.kind === "sql").length, bg: "bg-rose-100", fg: "text-rose-500", icon: AlertTriangle },
    { key: "overdue", label: "Follow-up", n: state.notifications.filter((n) => n.kind === "overdue").length, bg: "bg-amber-100", fg: "text-amber-500", icon: Clock },
    { key: "drop", label: "Missed", n: state.notifications.filter((n) => n.kind === "drop").length, bg: "bg-slate-200", fg: "text-slate-500", icon: X },
    { key: "rec", label: "Recovery", n: state.leads.filter((l) => l.contactedToday).length, bg: "bg-emerald-100", fg: "text-emerald-600", icon: RotateCcw },
  ]

  return (
    <>
      <PageHeader
        icon={Bell}
        title="Notifications"
        sub={`${unread.length} unread · ${state.notifications.length} total · last 7 days`}
        action={<button type="button" onClick={() => dispatch({ type: "MARK_ALL_READ" })} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 hover:text-sky-600"><Check className="h-4 w-4" /> Mark all read</button>}
      />

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {KINDS.map((k) => (
          <div key={k.key} className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-4">
            <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", k.bg, k.fg)}>
              <k.icon className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">{k.label}</p>
              <p className="text-[22px] font-bold leading-none tabular-nums text-slate-800">{k.n}</p>
            </div>
          </div>
        ))}
      </div>

      {unread.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-rose-100 bg-gradient-to-r from-white to-rose-50/60 px-4 py-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-500">
            <AlertTriangle className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <div className="min-w-[200px] flex-1">
            <p className="text-[14px] font-bold text-slate-800">{unread.length} high-priority alerts, act now</p>
            <p className="text-[12.5px] text-slate-500">These leads are at risk of being lost.</p>
          </div>
          <Btn tone="primary" onClick={() => setFilter("high")}>See high <ChevronRight className="h-3.5 w-3.5" /></Btn>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {([["all", "All", state.notifications.length], ["unread", "Unread", unread.length], ["high", "High", state.notifications.filter((n) => n.kind === "sql").length]] as const).map(([k, label, n]) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-semibold transition-colors",
              filter === k ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            )}
          >
            {label}
            <span className={cn("rounded-full px-1.5 text-[11px] font-bold tabular-nums", filter === k ? "bg-white/70" : "bg-white")}>{n}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {list.map((n) => {
          const tone = n.kind === "sql" ? "rose" : n.kind === "overdue" ? "amber" : "emerald"
          const Icon = n.kind === "sql" ? AlertTriangle : n.kind === "overdue" ? Clock : RotateCcw
          return (
            <div
              key={n.id}
              className={cn("overflow-hidden rounded-2xl border border-slate-200/70 bg-white", n.read && "opacity-60")}
              style={{ borderLeft: `3px solid ${tone === "rose" ? "#F43F5E" : tone === "amber" ? "#F59E0B" : "#10B981"}` }}
            >
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full",
                    tone === "rose" ? "bg-rose-100 text-rose-500" : tone === "amber" ? "bg-amber-100 text-amber-500" : "bg-emerald-100 text-emerald-600")}>
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    {n.kind === "sql" ? "At risk" : n.kind === "overdue" ? "Follow-up" : "Recovery"}
                  </span>
                  {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />}
                  <span className="ml-auto text-[11.5px] text-slate-400">just now</span>
                </div>
                <p className="mt-3 text-[14px] font-bold text-slate-800">{n.title}</p>
                <p className="mt-1 text-[12.5px] text-slate-500">{n.body}</p>
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "MARK_READ", id: n.id })}
                    className={cn(
                      "mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold text-white transition-opacity hover:opacity-90",
                      tone === "rose" ? "bg-rose-500" : tone === "amber" ? "bg-amber-500" : "bg-sky-500"
                    )}
                  >
                    Mark read <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
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
        <PageHeader icon={Upload} title="Lead Ingestion" sub="Ingestion summary" />
        <Card title="6 leads imported" className="mt-5">
          <ul className="space-y-2.5 text-[13px] text-slate-600">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> 6 rows read, 6 valid</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Every row scored on fit, intent and quality</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Graded and placed in the Priority Queue</li>
            <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-orange-400" /> Arrived unassigned, so a manager still picks the owner</li>
          </ul>
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
      <PageHeader icon={Upload} title="Lead Ingestion" sub="Set the batch details, then bring the rows in." />
      <Card title="Batch details" className="mt-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Batch name</span>
            <input value={batch} onChange={(e) => setBatch(e.target.value)}
                   className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] text-slate-900 outline-none focus:border-sky-400" />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Lead source</span>
            <select value={source} onChange={(e) => setSource(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none focus:border-sky-400">
              {["Website form", "Google Ads", "Facebook Ads", "Referral", "Trade fair", "Bulk import"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Initial stage</span>
            <select value={stage} onChange={(e) => setStage(e.target.value as Stage)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none focus:border-sky-400">
              {STAGES.slice(0, 4).map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-7 text-center">
          <Upload className="mx-auto h-5 w-5 text-slate-400" />
          <p className="mt-2 text-[13px] font-medium text-slate-600">leads-august.csv</p>
          <p className="text-[12px] text-slate-400">6 rows ready, sample file</p>
        </div>

        <Btn tone="primary" className="mt-5"
             onClick={() => { dispatch({ type: "IMPORT", count: 6, source, batch }); setDone(true) }}>
          Import and grade 6 leads
        </Btn>
      </Card>
    </>
  )
}

// ── Learning (kept from the product's nav) ────────────────────────────────────

export function LearningView() {
  return (
    <>
      <PageHeader icon={Sparkles} title="Learning Engine" tint="violet" sub="Patterns the account has enough data to state." />
      <Card title="Patterns unlocked" className="mt-5">
        <div className="divide-y divide-slate-50">
          {LEARNING_PATTERNS.map((p) => (
            <div key={p.pattern} className="flex flex-wrap items-center gap-3 py-3.5 first:pt-0 last:pb-0">
              <Sparkles className="h-4 w-4 shrink-0 text-violet-400" />
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

// ── Activity ──────────────────────────────────────────────────────────────────

export function ActivityView() {
  const { state } = useDemo()
  return (
    <>
      <PageHeader icon={ActivityIcon} title="Activity" sub="Everything the team logged, newest first." />
      <Card title="Team activity" className="mt-5">
        <ol className="relative space-y-0 border-l border-slate-200 pl-5">
          {state.activity.map((a) => (
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
