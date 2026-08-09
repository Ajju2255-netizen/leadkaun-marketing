"use client"

import { useMemo, useState } from "react"
import {
  Upload, Search, ChevronRight, Inbox, Flame, PhoneCall, IndianRupee, Trophy,
  Zap, AlertTriangle, Activity as ActivityIcon, Snowflake, ArrowUpRight, Check,
  Clock, Bell, Brain, CheckCheck, RotateCcw, X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  activeAgo, formatRupee, gradeOf, nextAction, rankScore, STAGES, LEARNING_PATTERNS,
  REPS, type DemoLead, type Stage,
} from "@/lib/demo-app"
import { Avatar, Btn, GradeBadge, NEXT_TONE, PageHead, Panel, StatCard, Th, useDemo } from "./primitives"

// ── Priority Queue ────────────────────────────────────────────────────────────

const GRADE_TABS = [
  { key: "all", label: "All", dot: "", active: "bg-slate-800" },
  { key: "A", label: "Grade A", dot: "bg-emerald-400", active: "bg-emerald-500" },
  { key: "B", label: "Grade B", dot: "bg-sky-400", active: "bg-sky-500" },
  { key: "C", label: "Grade C", dot: "bg-orange-400", active: "bg-orange-500" },
  { key: "D", label: "Grade D", dot: "bg-orange-500", active: "bg-orange-600" },
  { key: "E", label: "Grade E", dot: "bg-red-400", active: "bg-red-500" },
  { key: "F", label: "Grade F", dot: "bg-slate-400", active: "bg-slate-500" },
]

export function QueueView({ onImport }: { onImport: () => void }) {
  const { state, openLead } = useDemo()
  const [tab, setTab] = useState("all")

  const ranked = useMemo(
    () => [...state.leads].sort((a, b) => rankScore(b) - rankScore(a)),
    [state.leads]
  )
  const rows = tab === "all" ? ranked : ranked.filter((l) => gradeOf(l) === tab)

  const inPlay = state.leads.filter((l) => gradeOf(l) !== "F").reduce((s, l) => s + l.value, 0)
  const topThree = ranked.slice(0, 3).reduce((s, l) => s + l.value, 0)
  const hot = state.leads.filter((l) => l.activeMinutesAgo < 180).length
  const highPriority = state.leads.filter((l) => ["A", "B"].includes(gradeOf(l))).length
  const contacted = state.leads.filter((l) => l.contactedToday).length

  return (
    <>
      <PageHead
        title="Priority Queue"
        action={<Btn tone="primary" onClick={onImport}><Upload className="h-4 w-4" /> Import leads</Btn>}
      />

      <section className="mt-4 rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-5">
        <h3 className="mb-3.5 text-[14px] font-semibold text-slate-900">Quick stats</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <StatCard icon={Inbox}       label="Total leads"     value={String(state.leads.length)} tintBg="bg-slate-100"  tintFg="text-slate-500"   caption="in your queue" />
          <StatCard icon={Flame}       label="High priority"   value={String(highPriority)}       tintBg="bg-rose-50"    tintFg="text-rose-500"    caption="grade A and B" />
          <StatCard icon={Zap}         label="Hot right now"   value={String(hot)}                tintBg="bg-amber-50"   tintFg="text-amber-500"   caption="live signals" />
          <StatCard icon={PhoneCall}   label="Contacted today" value={String(contacted)}          tintBg="bg-emerald-50" tintFg="text-emerald-600" caption="today" />
          <StatCard icon={IndianRupee} label="In play"         value={formatRupee(inPlay)}        tintBg="bg-sky-50"     tintFg="text-sky-600"     caption="pipeline value" />
          <StatCard icon={Trophy}      label="Top 3 potential" value={formatRupee(topThree)}      tintBg="bg-violet-50"  tintFg="text-violet-500"  caption="your best 3" />
        </div>
      </section>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
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
                  ? cn(t.active, "text-white shadow-[0_1px_2px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.45)]")
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
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

      <LeadTable rows={rows} onOpen={openLead} showNext={tab === "all"} />
    </>
  )
}

function LeadTable({ rows, onOpen, showNext }: { rows: DemoLead[]; onOpen: (id: string) => void; showNext?: boolean }) {
  return (
    <section className="mt-3 overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead className="border-b border-slate-200/70 bg-slate-50/60">
            <tr>
              <Th className="pl-5">Lead</Th>
              <Th className="hidden lg:table-cell">Signal</Th>
              <Th className="text-right">Value</Th>
              <Th>Grade</Th>
              <Th className="hidden sm:table-cell">Next action</Th>
              <Th className="hidden xl:table-cell">Source</Th>
              <Th className="hidden lg:table-cell">Last active</Th>
              <Th className="pr-5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((l, i) => {
              const g = gradeOf(l)
              return (
                <tr
                  key={l.id}
                  onClick={() => onOpen(l.id)}
                  className="group cursor-pointer transition-colors hover:bg-sky-50/40"
                >
                  <td className="py-3 pl-5 pr-3 align-middle">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={l.name} />
                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="truncate text-[13.5px] font-semibold text-slate-900 group-hover:text-sky-700">{l.name}</span>
                          {i === 0 && showNext && (
                            <span className="inline-flex h-[18px] shrink-0 items-center rounded-full bg-sky-100 px-1.5 text-[9px] font-bold uppercase tracking-[0.06em] text-sky-700">
                              Next
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-[12px] text-slate-400">{l.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-3 py-3 align-middle lg:table-cell">
                    <p className="max-w-[220px] truncate text-[13px] text-slate-600">{l.signal}</p>
                  </td>
                  <td className="px-3 py-3 text-right align-middle">
                    <span className="text-[13.5px] font-semibold tabular-nums text-slate-900">{formatRupee(l.value)}</span>
                  </td>
                  <td className="px-3 py-3 align-middle"><GradeBadge grade={g} /></td>
                  <td className="hidden px-3 py-3 align-middle sm:table-cell">
                    <span className={cn("inline-flex h-7 items-center whitespace-nowrap rounded-full px-3 text-[12px] font-semibold", NEXT_TONE[g])}>
                      {nextAction(g)}
                    </span>
                  </td>
                  <td className="hidden px-3 py-3 align-middle xl:table-cell">
                    <span className="whitespace-nowrap text-[12.5px] text-slate-400">{l.source}</span>
                  </td>
                  <td className="hidden px-3 py-3 align-middle lg:table-cell">
                    <span className="whitespace-nowrap text-[12.5px] text-slate-400">{activeAgo(l.activeMinutesAgo)}</span>
                  </td>
                  <td className="py-3 pl-3 pr-5 text-right align-middle">
                    <ChevronRight className="ml-auto h-4 w-4 text-slate-300 group-hover:text-sky-500" />
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-[13px] text-slate-400">Nothing in this band right now.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// ── All Leads ─────────────────────────────────────────────────────────────────

export function LeadsView({ onImport }: { onImport: () => void }) {
  const { state, openLead } = useDemo()
  const [q, setQ] = useState("")
  const [stage, setStage] = useState<"All" | Stage>("All")

  const rows = state.leads.filter((l) => {
    const hay = `${l.name} ${l.company} ${l.source} ${l.phone}`.toLowerCase()
    return hay.includes(q.toLowerCase()) && (stage === "All" || l.stage === stage)
  })

  return (
    <>
      <PageHead
        title="All Leads"
        sub={`${rows.length} of ${state.leads.length} shown`}
        action={<Btn tone="primary" onClick={onImport}><Upload className="h-4 w-4" /> Import leads</Btn>}
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="flex h-9 min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 focus-within:border-sky-400">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, company or number"
            aria-label="Search leads"
            className="w-full bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
          />
          {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search"><X className="h-3.5 w-3.5 text-slate-400" /></button>}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...STAGES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStage(s)}
              className={cn(
                "h-9 rounded-lg px-3 text-[12px] font-semibold transition-colors",
                stage === s ? "bg-slate-800 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <LeadTable rows={rows} onOpen={openLead} />
    </>
  )
}

// ── Follow-ups ────────────────────────────────────────────────────────────────

export function FollowUpsView() {
  const { state, dispatch, openLead } = useDemo()
  const due = state.leads.filter((l) => l.followUp)
  const overdue = due.filter((l) => l.followUp === "overdue")

  return (
    <>
      <PageHead title="Follow-ups" sub="What you promised to do, and when it was due." />

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={Clock}       label="Due today"   value={String(due.length - overdue.length)} tintBg="bg-sky-50"     tintFg="text-sky-600"     caption="scheduled" />
        <StatCard icon={AlertTriangle} label="Overdue"   value={String(overdue.length)}              tintBg="bg-orange-50"  tintFg="text-orange-500"  caption="past due" />
        <StatCard icon={Check}       label="Completed"   value={String(state.leads.filter((l) => l.contactedToday).length)} tintBg="bg-emerald-50" tintFg="text-emerald-600" caption="today" />
        <StatCard icon={IndianRupee} label="Value at risk" value={formatRupee(overdue.reduce((s, l) => s + l.value, 0))} tintBg="bg-rose-50" tintFg="text-rose-500" caption="in overdue" />
      </div>

      <Panel title="Your follow-up list" className="mt-4">
        {due.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-slate-400">Nothing outstanding. The list is clear.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {due.map((l) => (
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
                  l.followUp === "overdue" ? "bg-orange-50 text-orange-700" : "bg-sky-50 text-sky-700"
                )}>
                  {l.followUp === "overdue" ? `${l.staleDays} days overdue` : "Due today"}
                </span>
                <GradeBadge grade={gradeOf(l)} size="sm" />
                <span className="w-[62px] text-right text-[13px] font-semibold tabular-nums text-slate-900">{formatRupee(l.value)}</span>
                <span className="flex gap-1.5">
                  <Btn size="sm" tone="soft" onClick={() => dispatch({ type: "COMPLETE_FOLLOWUP", leadId: l.id })}>
                    <Check className="h-3.5 w-3.5" /> Done
                  </Btn>
                  {l.followUp === "overdue" && (
                    <Btn size="sm" onClick={() => dispatch({ type: "SNOOZE_FOLLOWUP", leadId: l.id })}>Today</Btn>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  )
}

// ── Pipeline ──────────────────────────────────────────────────────────────────

const BOARD: Stage[] = ["New", "Contacted", "Qualified", "Proposal", "Won"]

export function PipelineView() {
  const { state, dispatch, openLead } = useDemo()
  return (
    <>
      <PageHead title="Pipeline" sub="Drag is not needed here: move a lead with the arrow on its card." />
      <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        {BOARD.map((stage) => {
          const inStage = state.leads.filter((l) => l.stage === stage)
          const next = BOARD[BOARD.indexOf(stage) + 1]
          return (
            <div key={stage} className="rounded-2xl border border-slate-200/70 bg-white p-3">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-[12px] font-semibold text-slate-700">{stage}</p>
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-slate-600">{inStage.length}</span>
              </div>
              <p className="mb-3 text-[11.5px] tabular-nums text-slate-400">{formatRupee(inStage.reduce((s, l) => s + l.value, 0))}</p>
              <div className="space-y-2">
                {inStage.map((l) => (
                  <div key={l.id} className="rounded-xl border border-slate-200/70 p-2.5 transition-colors hover:border-sky-300">
                    <button type="button" onClick={() => openLead(l.id)} className="flex w-full items-center gap-2 text-left">
                      <GradeBadge grade={gradeOf(l)} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12.5px] font-semibold text-slate-900">{l.name}</span>
                        <span className="block truncate text-[11px] text-slate-400">{formatRupee(l.value)}</span>
                      </span>
                    </button>
                    {next && (
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "SET_STAGE", leadId: l.id, stage: next })}
                        className="mt-2 inline-flex h-7 w-full items-center justify-center gap-1 rounded-lg bg-sky-50 text-[11px] font-semibold text-sky-700 transition-colors hover:bg-sky-100"
                      >
                        Move to {next} <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                {inStage.length === 0 && <p className="py-4 text-center text-[11.5px] text-slate-300">Empty</p>}
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
  const [stage, setStage] = useState<Stage>("New")
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <>
        <PageHead title="Import Leads" sub="Ingestion summary" />
        <Panel title="6 leads imported" className="mt-4">
          <ul className="space-y-2 text-[13px] text-slate-600">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> 6 rows read, 6 valid</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Every row scored on fit, intent and quality</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Graded and placed in the Priority Queue</li>
            <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-orange-400" /> Arrived unassigned, so a manager still picks the owner</li>
          </ul>
          <div className="mt-4 flex gap-2">
            <Btn tone="primary" onClick={onDone}>See them in the queue</Btn>
            <Btn onClick={() => setDone(false)}><RotateCcw className="h-3.5 w-3.5" /> Import another</Btn>
          </div>
        </Panel>
      </>
    )
  }

  return (
    <>
      <PageHead title="Import Leads" sub="Set the batch details, then bring the rows in." />
      <Panel title="Batch details" className="mt-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Batch name</span>
            <input
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] text-slate-900 outline-none focus:border-sky-400"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Lead source</span>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none focus:border-sky-400"
            >
              {["Website form", "Google Ads", "Facebook Ads", "Referral", "Trade fair", "Bulk import"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Initial stage</span>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as Stage)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none focus:border-sky-400"
            >
              {STAGES.slice(0, 4).map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-6 text-center">
          <Upload className="mx-auto h-5 w-5 text-slate-400" />
          <p className="mt-2 text-[13px] font-medium text-slate-600">leads-august.csv</p>
          <p className="text-[12px] text-slate-400">6 rows ready, sample file</p>
        </div>

        <Btn
          tone="primary"
          className="mt-4 w-full sm:w-auto"
          onClick={() => { dispatch({ type: "IMPORT", count: 6, source, batch }); setDone(true) }}
        >
          Import and grade 6 leads
        </Btn>
      </Panel>
    </>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function DashboardView() {
  const { state } = useDemo()
  const won = state.leads.filter((l) => l.stage === "Won")
  const funnel = BOARD.map((s) => ({
    stage: s,
    count: state.leads.filter((l) => BOARD.indexOf(l.stage) >= BOARD.indexOf(s)).length,
  }))
  const max = funnel[0]?.count || 1

  const health = [
    { label: "Healthy", n: state.leads.filter((l) => ["A", "B"].includes(gradeOf(l))).length, icon: ActivityIcon, tone: "text-emerald-600", bar: "bg-emerald-400" },
    { label: "At risk", n: state.leads.filter((l) => gradeOf(l) === "C").length,              icon: AlertTriangle, tone: "text-orange-500",  bar: "bg-orange-400" },
    { label: "Missed",  n: state.leads.filter((l) => l.staleDays >= 14).length,               icon: ArrowUpRight,  tone: "text-red-500",     bar: "bg-red-400" },
    { label: "Cold",    n: state.leads.filter((l) => ["D", "E", "F"].includes(gradeOf(l))).length, icon: Snowflake, tone: "text-slate-500",  bar: "bg-slate-300" },
  ]

  return (
    <>
      <PageHead title="Dashboard" />
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <StatCard icon={Inbox}       label="Total leads"     value={String(state.leads.length)} tintBg="bg-sky-50"     tintFg="text-sky-600"     caption="all time" />
        <StatCard icon={PhoneCall}   label="Contacted"       value={String(state.leads.filter((l) => l.stage !== "New").length)} tintBg="bg-emerald-50" tintFg="text-emerald-600" caption="at least once" />
        <StatCard icon={Check}       label="Follow-ups open" value={String(state.leads.filter((l) => l.followUp).length)} tintBg="bg-violet-50" tintFg="text-violet-500" caption="scheduled" />
        <StatCard icon={Trophy}      label="Leads won"       value={String(won.length)}         tintBg="bg-amber-50"   tintFg="text-amber-500"   caption="closed" />
        <StatCard icon={IndianRupee} label="Won value"       value={formatRupee(won.reduce((s, l) => s + l.value, 0))} tintBg="bg-slate-100" tintFg="text-slate-500" caption="closed value" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Pipeline Funnel">
          <div className="space-y-3">
            {funnel.map((f) => (
              <div key={f.stage}>
                <div className="flex items-baseline justify-between text-[12.5px]">
                  <span className="font-medium text-slate-600">{f.stage}</span>
                  <span className="font-semibold tabular-nums text-slate-900">{f.count}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-sky-400 transition-all duration-500" style={{ width: `${(f.count / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Top Performing Reps">
          <div className="divide-y divide-slate-100">
            {REPS.map((r) => (
              <div key={r.name} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <Avatar name={r.name} size={28} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-slate-900">{r.name}</p>
                  <p className="text-[11.5px] text-slate-400">{r.graded} graded, {r.contacted} contacted</p>
                </div>
                <span className="text-[13px] font-semibold tabular-nums text-slate-900">{formatRupee(r.won)}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Behaviour Health" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {health.map((h) => (
              <div key={h.label} className="rounded-xl border border-slate-200/70 p-3.5">
                <div className="flex items-center gap-2">
                  <h.icon className={cn("h-3.5 w-3.5", h.tone)} strokeWidth={2.5} />
                  <span className="text-[12px] font-medium text-slate-600">{h.label}</span>
                </div>
                <p className="mt-2 text-[20px] font-bold leading-none tabular-nums text-slate-900">{h.n}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full transition-all duration-500", h.bar)} style={{ width: `${(h.n / state.leads.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}

// ── Missed ────────────────────────────────────────────────────────────────────

export function MissedView() {
  const { state, dispatch, openLead } = useDemo()
  const missed = state.leads.filter((l) => l.staleDays >= 14).sort((a, b) => b.value - a.value)

  return (
    <>
      <PageHead title="Missed Opportunities" sub="Leads that went quiet while they were still worth working." />

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={AlertTriangle} label="Missed leads"  value={String(missed.length)} tintBg="bg-orange-50"  tintFg="text-orange-500"  caption="recoverable" />
        <StatCard icon={IndianRupee}   label="Value at risk" value={formatRupee(missed.reduce((s, l) => s + l.value, 0))} tintBg="bg-rose-50" tintFg="text-rose-500" caption="in this list" />
        <StatCard icon={Flame}         label="Grade A stale" value={String(missed.filter((l) => gradeOf(l) === "A").length)} tintBg="bg-amber-50" tintFg="text-amber-500" caption="top priority" />
        <StatCard icon={PhoneCall}     label="Recovered"     value={String(state.leads.filter((l) => l.contactedToday && l.staleDays === 0).length)} tintBg="bg-emerald-50" tintFg="text-emerald-600" caption="this session" />
      </div>

      <Panel title="High-value missed opportunities" className="mt-4">
        {missed.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-slate-400">Nothing has gone stale. Everything worth working has been touched.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {missed.map((m) => (
              <div key={m.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                <button type="button" onClick={() => openLead(m.id)} className="flex min-w-[160px] flex-1 items-center gap-3 text-left">
                  <Avatar name={m.name} />
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-semibold text-slate-900">{m.name}</span>
                    <span className="block truncate text-[12px] text-slate-400">{m.company}</span>
                  </span>
                </button>
                <p className="hidden max-w-[260px] flex-1 text-[12.5px] text-slate-500 md:block">{m.signal}</p>
                <span className="inline-flex h-7 items-center rounded-full bg-orange-50 px-3 text-[12px] font-semibold text-orange-700">
                  {m.staleDays} days stale
                </span>
                <GradeBadge grade={gradeOf(m)} size="sm" />
                <span className="w-[62px] text-right text-[13.5px] font-semibold tabular-nums text-slate-900">{formatRupee(m.value)}</span>
                <Btn size="sm" tone="soft" onClick={() => dispatch({ type: "COMPLETE_FOLLOWUP", leadId: m.id })}>Recover</Btn>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  )
}

// ── Activity ──────────────────────────────────────────────────────────────────

export function ActivityView() {
  const { state } = useDemo()
  return (
    <>
      <PageHead title="Activity" sub="Everything the team logged, newest first." />
      <Panel title="Team activity" className="mt-4">
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
      </Panel>
    </>
  )
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export function AnalyticsView() {
  const { state } = useDemo()
  const bySource = useMemo(() => {
    const m = new Map<string, { n: number; value: number }>()
    state.leads.forEach((l) => {
      const cur = m.get(l.source) ?? { n: 0, value: 0 }
      m.set(l.source, { n: cur.n + 1, value: cur.value + l.value })
    })
    return [...m.entries()].sort((a, b) => b[1].value - a[1].value)
  }, [state.leads])
  const maxV = bySource[0]?.[1].value || 1

  const byGrade = (["A", "B", "C", "D", "E", "F"] as const).map((g) => ({
    g, n: state.leads.filter((l) => gradeOf(l) === g).length,
  }))
  const maxG = Math.max(...byGrade.map((b) => b.n), 1)

  return (
    <>
      <PageHead title="Analytics" sub="Where the value sits, and where it leaks." />
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Pipeline value by source">
          <div className="space-y-3">
            {bySource.map(([src, v]) => (
              <div key={src}>
                <div className="flex items-baseline justify-between text-[12.5px]">
                  <span className="font-medium text-slate-600">{src}</span>
                  <span className="tabular-nums text-slate-900">{formatRupee(v.value)} <span className="text-slate-400">/ {v.n}</span></span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-sky-400" style={{ width: `${(v.value / maxV) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Leads by grade">
          <div className="flex h-[180px] items-end gap-3">
            {byGrade.map((b) => (
              <div key={b.g} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[12px] font-bold tabular-nums text-slate-900">{b.n}</span>
                <div className="w-full rounded-t-lg bg-sky-400 transition-all duration-500" style={{ height: `${Math.max(4, (b.n / maxG) * 130)}px` }} />
                <GradeBadge grade={b.g} size="sm" />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Speed to first contact" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-4">
            {REPS.map((r) => (
              <div key={r.name} className="rounded-xl border border-slate-200/70 p-3.5">
                <p className="truncate text-[12px] font-medium text-slate-600">{r.name}</p>
                <p className="mt-2 text-[20px] font-bold leading-none tabular-nums text-slate-900">{r.responseMins}m</p>
                <p className="mt-1 text-[11.5px] text-slate-400">median first touch</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}

// ── Rep tracking ──────────────────────────────────────────────────────────────

export function RepTrackingView() {
  return (
    <>
      <PageHead title="Rep Tracking" sub="Did the rep do the thing, on the lead we recommended." />
      <Panel title="Rep performance overview" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse">
            <thead className="border-b border-slate-200/70">
              <tr>
                <Th>Rep</Th>
                <Th className="text-right">Graded</Th>
                <Th className="text-right">Contacted</Th>
                <Th className="text-right">Median response</Th>
                <Th className="text-right">Follow-up completion</Th>
                <Th className="text-right">Won</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {REPS.map((r, i) => (
                <tr key={r.name}>
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={r.name} size={28} />
                      <span className="text-[13px] font-semibold text-slate-900">{r.name}</span>
                      {i === 0 && <span className="inline-flex h-[18px] items-center rounded-full bg-amber-100 px-1.5 text-[9px] font-bold uppercase tracking-[0.06em] text-amber-700">Leader</span>}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right text-[13px] tabular-nums text-slate-700">{r.graded}</td>
                  <td className="px-3 py-3 text-right text-[13px] tabular-nums text-slate-700">{r.contacted}</td>
                  <td className="px-3 py-3 text-right text-[13px] tabular-nums text-slate-700">{r.responseMins}m</td>
                  <td className="px-3 py-3 text-right">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                        <span className="block h-full rounded-full bg-emerald-400" style={{ width: `${r.completion}%` }} />
                      </span>
                      <span className="text-[13px] tabular-nums text-slate-700">{r.completion}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-[13px] font-semibold tabular-nums text-slate-900">{formatRupee(r.won)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[12px] text-slate-400">
          This measures whether the recommendation was followed, not whether it worked. The two are different questions.
        </p>
      </Panel>
    </>
  )
}

// ── Learning ──────────────────────────────────────────────────────────────────

export function LearningView() {
  return (
    <>
      <PageHead title="Learning Engine" sub="Patterns the account has enough data to state." />
      <Panel title="Patterns unlocked" className="mt-4">
        <div className="divide-y divide-slate-100">
          {LEARNING_PATTERNS.map((p) => (
            <div key={p.pattern} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
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
      </Panel>
    </>
  )
}

// ── Notifications ─────────────────────────────────────────────────────────────

const NOTIF_ICON = { sql: Flame, drop: AlertTriangle, overdue: Clock }

export function NotificationsView() {
  const { state, dispatch } = useDemo()
  const unread = state.notifications.filter((n) => !n.read).length
  return (
    <>
      <PageHead
        title="Notifications"
        sub={unread ? `${unread} unread` : "All clear"}
        action={<Btn onClick={() => dispatch({ type: "MARK_ALL_READ" })}><CheckCheck className="h-4 w-4" /> Mark all read</Btn>}
      />
      <Panel title="Recent" className="mt-4">
        <div className="divide-y divide-slate-100">
          {state.notifications.map((n) => {
            const Icon = NOTIF_ICON[n.kind] ?? Bell
            return (
              <div key={n.id} className={cn("flex items-start gap-3 py-3 first:pt-0 last:pb-0", n.read && "opacity-55")}>
                <span className={cn(
                  "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                  n.kind === "sql" ? "bg-emerald-50 text-emerald-600" : n.kind === "drop" ? "bg-orange-50 text-orange-500" : "bg-sky-50 text-sky-600"
                )}>
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-slate-900">{n.title}</p>
                  <p className="mt-0.5 text-[12px] text-slate-500">{n.body}</p>
                </div>
                {!n.read && <Btn size="sm" onClick={() => dispatch({ type: "MARK_READ", id: n.id })}>Read</Btn>}
              </div>
            )
          })}
        </div>
      </Panel>
    </>
  )
}
