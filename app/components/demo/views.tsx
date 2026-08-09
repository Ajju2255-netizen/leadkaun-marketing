"use client"

import { useMemo, useState } from "react"
import {
  Upload, Search, ChevronRight, Inbox, Flame, PhoneCall, IndianRupee, Trophy, Zap,
  AlertTriangle, Activity as ActivityIcon, Check, Clock, Users, CalendarClock,
  CheckCircle2, Gauge, Snowflake, TrendingDown, Brain, Bell, RotateCcw, X, Target,
  ArrowUpRight, Columns2, ChevronLeft, MessageCircle, SlidersHorizontal, Download,
  LayoutDashboard, Users2, KanbanSquare, BarChart3, User, AlertCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  activeAgo, contribution, formatRupee, gradeOf, nextAction, rankScore, totalScore,
  STAGES, WEIGHTS, LEARNING_PATTERNS, REPS, CALL_OUTCOMES, WA_OUTCOMES, type Stage,
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

/** Labels and colours copied from components/queue/QueueGradeTabs.tsx. */
const GRADE_TABS = [
  { key: "all", label: "All", dot: "", active: "bg-sky-600" },
  { key: "A", label: "A", dot: "bg-emerald-500", active: "bg-emerald-500" },
  { key: "B", label: "B", dot: "bg-sky-500", active: "bg-sky-600" },
  { key: "C", label: "C", dot: "bg-orange-400", active: "bg-orange-500" },
  { key: "D", label: "D", dot: "bg-amber-500", active: "bg-amber-500" },
  { key: "E", label: "E", dot: "bg-rose-500", active: "bg-rose-500" },
  { key: "F", label: "F", dot: "bg-slate-400", active: "bg-slate-500" },
]

const NEXT_TONE: Record<string, string> = {
  A: "bg-sky-50 text-sky-700", B: "bg-sky-50 text-sky-700", C: "bg-amber-50 text-amber-700",
  D: "bg-orange-50 text-orange-700", E: "bg-orange-50 text-orange-700", F: "bg-slate-100 text-slate-500",
}

export function QueueView({ onImport }: { onImport: () => void }) {
  const { state, openLead } = useDemo()
  const [tab, setTab] = useState("all")
  const [q, setQ] = useState("")
  const [hideContacted, setHideContacted] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [channels, setChannels] = useState<string[]>([])
  const [rep, setRep] = useState("All reps")
  const [source, setSource] = useState("All sources")

  const ranked = useMemo(() => [...state.leads].sort((a, b) => rankScore(b) - rankScore(a)), [state.leads])
  const matching = ranked
    .filter((l) => tab === "all" || gradeOf(l) === tab)
    .filter((l) => `${l.name} ${l.company}`.toLowerCase().includes(q.toLowerCase()))
    .filter((l) => (hideContacted ? !l.contactedToday : true))
    .filter((l) => (rep === "All reps" ? true : l.rep === rep))
    .filter((l) => (source === "All sources" ? true : l.source === source))
  const PAGE = 12
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
        <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-3 @5xl:grid-cols-6">
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
        {/* Toolbar: one row, as the product has it since the filter-bar fix. */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-5">
          <div className="relative min-w-[170px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search leads, company…"
              aria-label="Search queue"
              className="h-9 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-8 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/25"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label="Clear search"
                      className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <span className="mx-1 hidden h-6 w-px shrink-0 bg-slate-200 lg:block" aria-hidden />

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

          <select
            aria-label="Filter by rep"
            value={rep}
            onChange={(e) => setRep(e.target.value)}
            className="h-9 max-w-[118px] rounded-full border border-slate-200 bg-white px-2.5 text-[12px] text-slate-700 outline-none hover:bg-slate-50"
          >
            {["All reps", ...REPS.map((r) => r.name)].map((r) => <option key={r}>{r}</option>)}
          </select>
          <select
            aria-label="Filter by source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="h-9 max-w-[118px] rounded-full border border-slate-200 bg-white px-2.5 text-[12px] text-slate-700 outline-none hover:bg-slate-50"
          >
            {["All sources", "Website form", "Google Ads", "Facebook Ads", "Referral", "Listings", "Trade fair", "Bulk import"].map((r) => <option key={r}>{r}</option>)}
          </select>
          {/* Filters opens a panel, as components/queue/QueueFilters.tsx does. */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-semibold transition-all",
                hideContacted || channels.length > 0
                  ? "border-sky-200 bg-sky-50 text-sky-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
              {(hideContacted || channels.length > 0) && (
                <span className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold tabular-nums text-white">
                  {channels.length + (hideContacted ? 1 : 0)}
                </span>
              )}
            </button>

            {filtersOpen && (
              <div className="absolute right-0 top-11 z-30 w-[248px] rounded-xl border border-slate-200 bg-white p-3.5 shadow-lg">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Activity</p>
                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={hideContacted}
                    onChange={(e) => setHideContacted(e.target.checked)}
                    className="h-3.5 w-3.5 accent-sky-600"
                  />
                  Hide leads contacted today
                </label>

                <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Channel activity</p>
                <div className="space-y-1.5">
                  {(["phone", "whatsapp"] as const).map((c) => (
                    <label key={c} className="flex cursor-pointer items-center gap-2 text-[13px] capitalize text-slate-700">
                      <input
                        type="checkbox"
                        checked={channels.includes(c)}
                        onChange={(e) =>
                          setChannels((prev) => (e.target.checked ? [...prev, c] : prev.filter((x) => x !== c)))
                        }
                        className="h-3.5 w-3.5 accent-sky-600"
                      />
                      {c === "whatsapp" ? "WhatsApp" : "Phone"}
                    </label>
                  ))}
                </div>
              </div>
            )}
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
                <Th className="hidden @4xl:table-cell">Source</Th>
                <Th className="hidden @5xl:table-cell">Last active</Th>
                <Th className="pr-5"><span className="sr-only">Open</span></Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((l, i) => {
                const g = gradeOf(l)
                return (
                  <tr key={l.id} onClick={() => openLead(l.id)} className="group cursor-pointer transition-colors hover:bg-sky-50/40">
                    <td className="py-2 pl-5 pr-3 align-middle">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Avatar name={l.name} size={28} />
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="truncate text-[13px] font-semibold text-slate-900 group-hover:text-sky-700">{l.name}</span>
                            {i === 0 && tab === "all" && !q && (
                              <span className="inline-flex h-[18px] shrink-0 items-center rounded-full bg-sky-100 px-1.5 text-[9px] font-bold uppercase tracking-[0.06em] text-sky-700">Next</span>
                            )}
                          </div>
                          <p className="truncate text-[11.5px] leading-tight text-slate-400">{l.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-3 py-2 align-middle @3xl:table-cell">
                      <p className="max-w-[220px] truncate text-[13px] text-slate-600">{l.signal}</p>
                    </td>
                    <td className="px-3 py-2 text-right align-middle">
                      <span className="text-[13.5px] font-semibold tabular-nums text-slate-900">{formatRupee(l.value)}</span>
                    </td>
                    <td className="px-3 py-2 align-middle"><GradeBadge grade={g} size="sm" /></td>
                    <td className="hidden px-3 py-2 align-middle @xl:table-cell">
                      <span className={cn("inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-[11.5px] font-semibold", NEXT_TONE[g])}>
                        {nextAction(g)}
                      </span>
                    </td>
                    <td className="hidden px-3 py-2 align-middle @4xl:table-cell">
                      <span className="whitespace-nowrap text-[12.5px] text-slate-400">{l.source}</span>
                    </td>
                    <td className="hidden px-3 py-2 align-middle @5xl:table-cell">
                      <span className="whitespace-nowrap text-[12.5px] text-slate-400">{activeAgo(l.activeMinutesAgo)}</span>
                    </td>
                    <td className="py-2 pl-3 pr-5 text-right align-middle">
                      <ChevronRight className="ml-auto h-4 w-4 text-slate-300 group-hover:text-sky-500" />
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-[13px] text-slate-400">Nothing matches that.</td></tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Footer: count + pagination, as the product has it */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3.5 sm:px-5">
          <p className="text-[12.5px] tabular-nums text-slate-400">
            Showing {rows.length === 0 ? 0 : 1}&ndash;{rows.length} of {matching.length} lead{matching.length === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-1">
            <span className="grid h-8 w-8 place-items-center rounded-lg text-slate-300"><ChevronLeft className="h-4 w-4" /></span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-600 text-[13px] font-semibold text-white">1</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg text-[13px] text-slate-600">2</span>
            <span className="w-8 text-center text-[13px] text-slate-400">…</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg text-[13px] text-slate-600">8</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg text-slate-500"><ChevronRight className="h-4 w-4" /></span>
          </div>
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
      <PageHead icon={LayoutDashboard}
        title="Sales Behaviour Pulse"
        sub="Today's revenue radar. What your team did, what's slipping, and where the next ₹ is hiding."
      />

      <div className="mt-4 grid grid-cols-2 gap-3 @2xl:grid-cols-3 @5xl:grid-cols-5">
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

      <div className="mt-4 grid gap-4 @3xl:grid-cols-3">
        <Card title="Active Sources">
          <div className="space-y-3">
            {sources.map(([src, n]) => (
              <div key={src} className="flex items-center justify-between gap-2">
                <span className="truncate text-[13px] text-slate-700">{src}</span>
                <span className="text-[12.5px] tabular-nums text-slate-400"><span className="font-semibold text-slate-900">{n}</span> leads</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Activity">
          <div className="space-y-3.5">
            {state.activity.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-orange-50 text-orange-500">
                  <ActivityIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold text-slate-900">{a.who} {a.what}</p>
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
                  <span className="text-[12.5px] font-semibold tabular-nums text-slate-900">{h.n}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full", h.bar)} style={{ width: `${(h.n / Math.max(entered, 1)) * 100}%` }} />
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
  const [gradeFilter, setGradeFilter] = useState("All grades")
  const [sourceFilter, setSourceFilter] = useState("All sources")
  const [repFilter, setRepFilter] = useState("All reps")
  const [dateFilter, setDateFilter] = useState("Any time")

  const matching = state.leads.filter((l) => {
    const hay = `${l.name} ${l.company} ${l.source} ${l.phone}`.toLowerCase()
    return hay.includes(q.toLowerCase())
      && (stage === "All" || l.stage === stage)
      && (gradeFilter === "All grades" || gradeOf(l) === gradeFilter.replace("Grade ", ""))
      && (sourceFilter === "All sources" || l.source === sourceFilter)
      && (repFilter === "All reps" || l.rep === repFilter)
  })
  const rows = matching

  return (
    <>
      <PageHead icon={Users2}
        title="All Leads"
        sub={`${state.leads.length} leads`}
        action={
          <>
            <button type="button" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-700 transition-all hover:text-slate-900">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
            <button type="button" onClick={onImport} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-sky-600 px-4 text-[12px] font-semibold text-white transition-colors hover:bg-sky-700 active:scale-[0.98]">
              <span className="text-[14px] font-bold leading-none">+</span> Import
            </button>
          </>
        }
      />

      {/* Filter bar: search pill + chip dropdowns, as the product has it. */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, company…"
            aria-label="Search leads"
            className="h-9 w-60 rounded-full border border-slate-200 bg-white pl-9 pr-3 text-[12px] text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
          />
        </div>
        {[
          { label: "Grade", value: gradeFilter, set: setGradeFilter, opts: ["All grades", "Grade A", "Grade B", "Grade C", "Grade D", "Grade E", "Grade F"] },
          { label: "Stage", value: stage, set: (v: string) => setStage(v as "All" | Stage), opts: ["All", ...STAGES] },
          { label: "Source", value: sourceFilter, set: setSourceFilter, opts: ["All sources", "Website form", "Google Ads", "Facebook Ads", "Referral", "Listings", "Trade fair", "Bulk import"] },
          { label: "Rep", value: repFilter, set: setRepFilter, opts: ["All reps", ...REPS.map((r) => r.name)] },
          { label: "Date added", value: dateFilter, set: setDateFilter, opts: ["Any time", "Today", "This week", "This month"] },
        ].map((f) => (
          <label key={f.label} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-[12px] font-medium text-slate-600">
            <span className="text-slate-500">{f.label}</span>
            <select
              aria-label={`Filter by ${f.label.toLowerCase()}`}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="cursor-pointer bg-transparent text-[12px] font-semibold text-slate-700 outline-none"
            >
              {f.opts.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        ))}
      </div>

      <div className="mt-4 grid gap-3 @2xl:grid-cols-3">
        <StatCard icon={Zap} label="Scoring Speed" value="< 1s" tintBg="bg-sky-50" tintFg="text-sky-600" caption="per lead on import" />
        <Card pad="p-3.5">
          <p className="text-[12px] font-medium text-slate-600">Score Breakdown</p>
          <div className="mt-3 space-y-1.5">
            {(["A", "B", "C", "D", "F"] as const).map((gr) => {
              const n = state.leads.filter((l) => gradeOf(l) === gr).length
              return (
                <div key={gr} className="flex items-center gap-2">
                  <GradeBadge grade={gr} size="sm" />
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <span className="block h-full rounded-full bg-sky-400" style={{ width: `${(n / Math.max(state.leads.length, 1)) * 100}%` }} />
                  </span>
                  <span className="w-5 text-right text-[11.5px] font-semibold tabular-nums text-slate-700">{n}</span>
                </div>
              )
            })}
          </div>
        </Card>
        <Card pad="p-3.5">
          <p className="text-[12px] font-medium text-slate-600">Score Decay</p>
          <p className="mt-3 text-[23px] font-bold leading-none tabular-nums text-slate-900">
            {state.leads.filter((l) => l.staleDays >= 28).length}
          </p>
          <p className="mt-2 text-[11.5px] text-slate-400">past 28 days, losing 3 intent a day</p>
        </Card>
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

          </tbody>
        </table>
      </div>
    </>
  )
}

// ── Pipeline ──────────────────────────────────────────────────────────────────

/** The product scrolls a board of every stage, not a four-up grid. */
const BOARD: Stage[] = ["New Inquiry", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Follow-up", "Won"]

type PipelineDialog = { kind: "move" | "won" | "lost"; leadId: string } | null

export function PipelineView() {
  const { state, dispatch, openLead } = useDemo()
  const [dialog, setDialog] = useState<PipelineDialog>(null)
  const dialogLead = dialog ? state.leads.find((l) => l.id === dialog.leadId) : undefined
  const won = state.leads.filter((l) => l.stage === "Won").length
  const lost = state.leads.filter((l) => l.stage === "Lost").length
  const open = state.leads.length - won - lost

  return (
    <>
      <PageHead icon={KanbanSquare}
        title="Pipeline"
        sub="Auto-stage tracker for every deal in motion. Moves when calls and WhatsApp signals land."
      />

      <div className="mt-4 grid grid-cols-2 gap-3 @2xl:grid-cols-3 @5xl:grid-cols-5">
        <KpiCard label="Total Deals" value={state.leads.length} icon={Columns2} tintBg="bg-sky-50"     tintFg="text-sky-600"     spark={[4, 6, 5, 8, 7, 9, 12]} />
        <KpiCard label="Open Deals"  value={open}               icon={Zap}     tintBg="bg-violet-50"  tintFg="text-violet-500"  spark={[8, 7, 9, 6, 8, 7, 9]} />
        <KpiCard label="Won Deals"   value={won}                icon={Trophy}  tintBg="bg-emerald-50" tintFg="text-emerald-600" spark={[1, 2, 1, 3, 2, 4, 5]} />
        <KpiCard label="Lost Deals"  value={lost}               icon={X}       tintBg="bg-orange-50"  tintFg="text-orange-500"  spark={[2, 1, 3, 2, 1, 2, 1]} invertDelta />
        <KpiCard label="Win Rate"    value={Math.round((won / Math.max(won + lost, 1)) * 100)} suffix="%" icon={Target} tintBg="bg-sky-50" tintFg="text-sky-600" spark={[3, 5, 4, 7, 5, 8, 9]} />
      </div>

      <div className="-mx-1 mt-4 flex gap-3 overflow-x-auto px-1 pb-4">
        {BOARD.map((stage, si) => {
          const inStage = state.leads.filter((l) => l.stage === stage)
          const next = STAGES[STAGES.indexOf(stage) + 1]
          return (
            <div key={stage} className="w-[260px] shrink-0 rounded-2xl border border-slate-200/70 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-slate-900">
                  <span className={cn("h-2 w-2 rounded-full", FUNNEL_COLORS[si].swatch)} /> {stage}
                </p>
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-slate-600">{inStage.length}</span>
              </div>
              <p className="mt-2 text-[12px] tabular-nums text-slate-400">{formatRupee(inStage.reduce((s, l) => s + l.value, 0))}</p>

              <div className="mt-4 space-y-3">
                {inStage.map((l) => (
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
                          onClick={() => setDialog({ kind: "move", leadId: l.id })}
                          className="inline-flex h-6 items-center gap-1 rounded-full bg-sky-50 px-2 text-[11px] font-semibold text-sky-700 transition-colors hover:bg-sky-100"
                        >
                          Move Stage
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDialog({ kind: "won", leadId: l.id })}
                        className="inline-flex h-6 items-center gap-1 rounded-full bg-emerald-50 px-2 text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                      >
                        Mark as Won
                      </button>
                      <button
                        type="button"
                        onClick={() => setDialog({ kind: "lost", leadId: l.id })}
                        className="inline-flex h-6 items-center gap-1 rounded-full bg-rose-50 px-2 text-[11px] font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                      >
                        Mark as Lost
                      </button>
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

      {dialog && dialogLead && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm" onClick={() => setDialog(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={dialog.kind === "move" ? "Move Stage" : dialog.kind === "won" ? "Mark as Won" : "Mark as Lost"}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200/70 bg-white p-6"
          >
            <h2 className="text-[15px] font-semibold text-slate-900">
              {dialog.kind === "move" ? "Move Stage" : dialog.kind === "won" ? "Mark as Won" : "Mark as Lost"}
            </h2>
            <p className="text-[13px] text-slate-600">{dialogLead.name} · {formatRupee(dialogLead.value)}</p>

            {dialog.kind === "move" && (
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-medium text-slate-600">Move to</span>
                <select
                  aria-label="Move to stage"
                  defaultValue={STAGES[Math.min(STAGES.indexOf(dialogLead.stage) + 1, STAGES.length - 1)]}
                  onChange={(e) => dispatch({ type: "SET_STAGE", leadId: dialogLead.id, stage: e.target.value as Stage })}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  {STAGES.map((st) => <option key={st}>{st}</option>)}
                </select>
              </label>
            )}
            {dialog.kind === "lost" && (
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-medium text-slate-600">Loss reason</span>
                <select aria-label="Loss reason" className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none focus:border-sky-400">
                  {["Price", "Went with a competitor", "No budget", "Went quiet", "Not a fit"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </label>
            )}

            <div className="flex justify-end gap-2">
              <Btn onClick={() => setDialog(null)}>Cancel</Btn>
              <Btn
                tone={dialog.kind === "lost" ? "danger" : "primary"}
                onClick={() => {
                  if (dialog.kind === "won") dispatch({ type: "SET_STAGE", leadId: dialogLead.id, stage: "Won" })
                  if (dialog.kind === "lost") dispatch({ type: "SET_STAGE", leadId: dialogLead.id, stage: "Lost" })
                  if (dialog.kind === "move") {
                    const nxt = STAGES[Math.min(STAGES.indexOf(dialogLead.stage) + 1, STAGES.length - 1)]
                    dispatch({ type: "SET_STAGE", leadId: dialogLead.id, stage: nxt })
                  }
                  setDialog(null)
                }}
              >
                Confirm
              </Btn>
            </div>
          </div>
        </div>
      )}
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
      <PageHead title="Follow-ups" sub="Work top to bottom, overdue first." />

      <Card className="mt-4" pad="p-4 sm:p-5">
        <h2 className="mb-3.5 text-[14px] font-semibold text-slate-900">Quick stats</h2>
        <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-3 @5xl:grid-cols-5">
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

  const sourceQuality = useMemo(() => {
    const m = new Map<string, { leads: number; missed: number }>()
    state.leads.forEach((l) => {
      const cur = m.get(l.source) ?? { leads: 0, missed: 0 }
      m.set(l.source, { leads: cur.leads + 1, missed: cur.missed + (l.staleDays >= 14 ? 1 : 0) })
    })
    return [...m.entries()]
      .map(([source, v]) => ({
        source,
        leads: v.leads,
        win: Math.round(((v.leads - v.missed) / Math.max(v.leads, 1)) * 100 * 0.3),
        miss: Math.round((v.missed / Math.max(v.leads, 1)) * 100),
      }))
      .sort((a, b) => b.leads - a.leads)
      .slice(0, 5)
  }, [state.leads])

  const losses = [
    { label: "Engaged but went cold", n: missed.filter((l) => l.intent >= 40).length, value: Math.round(missedValue * 0.67), pct: 67, tone: "bg-amber-400", fix: "Add a re-engagement follow-up within 24h of every signal" },
    { label: "Never contacted", n: missed.filter((l) => l.intent < 40).length, value: Math.round(missedValue * 0.33), pct: 33, tone: "bg-orange-400", fix: "Assign an owner the moment a lead lands" },
  ]

  return (
    <>
      <PageHead icon={BarChart3} title="Analytics" sub="Find what's slowing your pipeline, loss patterns, recovery potential, and where to act." />

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

      <div className="mt-4 grid grid-cols-2 gap-3 @2xl:grid-cols-4">
        <KpiCard label="Speed-to-Win avg"  value="—"  icon={Clock}        tintBg="bg-sky-50"     tintFg="text-sky-600"     caption="not enough data" />
        <KpiCard label="Speed-to-Miss avg" value="3h" icon={Clock}        tintBg="bg-orange-50"  tintFg="text-orange-500"  caption="for missed leads" />
        <KpiCard label="7-Day Trend"       value="Improving" icon={TrendingDown} tintBg="bg-emerald-50" tintFg="text-emerald-600" caption={`${formatRupee(missedValue)} all-time`} />
        <KpiCard label="Loss rate"         value={`${Math.round((missed.length / Math.max(state.leads.length, 1)) * 100)}%`} icon={AlertTriangle} tintBg="bg-rose-50" tintFg="text-rose-500" caption="of all leads" />
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

      <div className="mt-4 grid gap-4 @5xl:grid-cols-[1.5fr_1fr]">
        <Card title="Why You're Losing" action={<span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">{missed.length} leads · {formatRupee(missedValue)}</span>}>
          <div className="space-y-3">
            {losses.map((l) => (
              <div key={l.label} className="rounded-xl border border-slate-200/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[13.5px] font-semibold text-slate-900">{l.label}</p>
                    <p className="text-[12px] text-slate-400">{l.n} leads</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-bold tabular-nums text-rose-500">{formatRupee(l.value)}</p>
                    <p className="text-[11.5px] text-slate-400">{l.pct}% of losses</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full", l.tone)} style={{ width: `${l.pct}%` }} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-sky-50/70 px-3 py-2.5">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-sky-600">Fix</span>
                  <p className="min-w-[180px] flex-1 text-[12.5px] text-slate-700">{l.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card title="Missed by grade">
            <div className="space-y-2.5">
              {(["A", "B", "C", "D"] as const).map((gr) => {
                const n = missed.filter((l) => gradeOf(l) === gr).length
                return (
                  <div key={gr} className="flex items-center gap-3">
                    <GradeBadge grade={gr} size="sm" />
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <span className="block h-full rounded-full bg-rose-400" style={{ width: `${(n / Math.max(missed.length, 1)) * 100}%` }} />
                    </span>
                    <span className="w-6 text-right text-[12.5px] font-semibold tabular-nums text-slate-900">{n}</span>
                  </div>
                )
              })}
            </div>
          </Card>
          <Card title="Speed to First Contact">
            <div className="space-y-3">
              {[
                { label: "Won leads", value: "1h 10m", pct: 100, bar: "bg-emerald-500" },
                { label: "Missed leads", value: "3h", pct: 68, bar: "bg-rose-400" },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[12.5px] text-slate-500">{r.label}</span>
                    <span className="text-[13px] font-semibold text-slate-900">{r.value}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={cn("h-full rounded-full", r.bar)} style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Recovery Simulation">
            <p className="text-[12.5px] leading-relaxed text-slate-400">
              Simulation appears when average response time exceeds 3h.
            </p>
          </Card>
        </div>
      </div>

      <Card title="Lead Playbook" meta={<span className="text-[11.5px] text-slate-400">Recommended first touch by grade</span>} className="mt-4">
        <div className="grid gap-3 @2xl:grid-cols-2 @5xl:grid-cols-4">
          {[
            { g: "A" as const, when: "Within the hour", how: "Call. If unanswered, WhatsApp the same day." },
            { g: "B" as const, when: "Same day", how: "Call once, then a scheduled follow-up." },
            { g: "C" as const, when: "Within the week", how: "Nurture. Templates, not calls." },
            { g: "D" as const, when: "When capacity allows", how: "Light touch, or park it." },
          ].map((r) => (
            <div key={r.g} className="rounded-xl border border-slate-200/70 p-3.5">
              <div className="flex items-center gap-2">
                <GradeBadge grade={r.g} size="sm" />
                <span className="text-[12.5px] font-semibold text-slate-900">{r.when}</span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-slate-500">{r.how}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-4 grid gap-4 @4xl:grid-cols-2">
        <Card title="Source Quality">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b border-slate-100">
                <tr><Th>Source</Th><Th className="text-right">Leads</Th><Th className="text-right">Win%</Th><Th className="text-right">Miss%</Th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sourceQuality.map((r) => (
                  <tr key={r.source}>
                    <td className="py-2.5 text-[13px] text-slate-700">{r.source}</td>
                    <td className="px-3 text-right text-[13px] tabular-nums text-slate-700">{r.leads}</td>
                    <td className="px-3 text-right text-[13px] font-semibold tabular-nums text-emerald-600">{r.win}%</td>
                    <td className="px-3 text-right text-[13px] font-semibold tabular-nums text-rose-500">{r.miss}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Rep Performance">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b border-slate-100">
                <tr><Th>Rep</Th><Th className="text-right">A-rate</Th><Th className="text-right">Missed</Th><Th className="text-right">Conv%</Th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {REPS.map((r, i) => (
                  <tr key={r.name}>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={r.name} size={26} />
                        <span className="text-[13px] font-medium text-slate-800">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-3 text-right text-[13px] tabular-nums text-slate-700">{34 - i * 5}%</td>
                    <td className="px-3 text-right text-[13px] tabular-nums text-slate-700">{missed.filter((l) => l.rep === r.name).length}</td>
                    <td className="px-3 text-right text-[13px] font-semibold tabular-nums text-slate-900">{18 - i * 3}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  )
}

// ── Rep Tracking ──────────────────────────────────────────────────────────────

export function RepTrackingView() {
  const recovered = REPS.reduce((s, r) => s + r.won, 0)
  return (
    <>
      <PageHead icon={User} title="Sales Rep Tracking" sub="Per-rep ₹ recovered, Grade A response time, follow-up completion." />

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
      <PageHead icon={AlertCircle} tint="bg-amber-50 text-amber-600" title="Missed Opportunities" sub="Stale leads, valued by ₹ at risk, recover them before they're gone." />

      <div className="mt-4 grid grid-cols-2 gap-3 @3xl:grid-cols-4">
        <KpiCard label="At risk today"  value={formatRupee(atRisk)} icon={IndianRupee} tintBg="bg-rose-50" tintFg="text-rose-500" caption={`${missed.length} stale leads in the pool`} />
        <Card pad="p-4">
          <p className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
            <TrendingDown className="h-3.5 w-3.5 text-rose-500" /> 7-day trend
          </p>
          <div className="mt-4 h-[2px] w-full rounded-full bg-gradient-to-r from-rose-200 to-rose-500" />
          <p className="mt-4 text-right text-[11.5px] text-slate-400">Need 7+ days</p>
        </Card>
        <KpiCard label="Recovered · 7d" value={state.leads.filter((l) => l.contactedToday && l.staleDays === 0).length} icon={Trophy} tintBg="bg-emerald-50" tintFg="text-emerald-600" caption="A/B leads won" />
        <Card pad="p-4">
          <p className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
            <Users className="h-3.5 w-3.5 text-sky-500" /> By rep
          </p>
          <div className="mt-3 space-y-1.5">
            {REPS.slice(0, 3).map((r) => (
              <div key={r.name} className="flex items-center justify-between gap-2">
                <span className="truncate text-[12px] text-slate-600">{r.name}</span>
                <span className="text-[12px] font-semibold tabular-nums text-slate-900">
                  {missed.filter((l) => l.rep === r.name).length}
                </span>
              </div>
            ))}
          </div>
        </Card>
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
                {missed.map((m) => (
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
  const [filter, setFilter] = useState<"all" | "unread" | "high">("all")
  const unread = state.notifications.filter((n) => !n.read)
  const high = state.notifications.filter((n) => n.kind === "sql")
  const shown = filter === "unread" ? unread : filter === "high" ? high : state.notifications

  const KINDS = [
    { key: "sql", label: "At risk", n: state.notifications.filter((n) => n.kind === "sql").length, bg: "bg-rose-50", fg: "text-rose-500", icon: AlertTriangle },
    { key: "overdue", label: "Follow-up", n: state.notifications.filter((n) => n.kind === "overdue").length, bg: "bg-amber-50", fg: "text-amber-500", icon: Clock },
    { key: "drop", label: "Missed", n: state.notifications.filter((n) => n.kind === "drop").length, bg: "bg-slate-100", fg: "text-slate-500", icon: X },
    { key: "rec", label: "Recovery", n: state.leads.filter((l) => l.contactedToday).length, bg: "bg-emerald-50", fg: "text-emerald-600", icon: RotateCcw },
  ]

  return (
    <>
      <PageHead icon={Bell}
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

      {high.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-rose-100 bg-gradient-to-r from-white to-rose-50/60 px-4 py-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-500">
            <AlertTriangle className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <div className="min-w-[200px] flex-1">
            <p className="text-[13.5px] font-semibold text-slate-900">{high.length} high-priority alerts, act now</p>
            <p className="text-[12.5px] text-slate-500">These leads are at risk of being lost.</p>
          </div>
          <Btn tone="primary" onClick={() => setFilter("high")}>See high</Btn>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {([["all", "All", state.notifications.length], ["unread", "Unread", unread.length], ["high", "High", high.length]] as const).map(([k, label, n]) => (
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

      <Card className="mt-4">
        <div className="divide-y divide-slate-100">
          {shown.map((n) => {
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
                {!n.read && (
                  <span className="flex shrink-0 gap-1.5">
                    <Btn size="sm" onClick={() => dispatch({ type: "MARK_READ", id: n.id })}>Already handled</Btn>
                    <Btn size="sm" onClick={() => dispatch({ type: "MARK_READ", id: n.id })}>Not relevant</Btn>
                  </span>
                )}
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
  const [mode, setMode] = useState<"CSV" | "Google Sheet" | "Manual Entry">("CSV")
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <>
        <PageHead icon={Download} title="Lead Ingestion" sub="Ingestion summary" />
        <Card className="mt-4">
          <h2 className="mb-4 text-[15px] font-semibold text-slate-900">Ingestion summary</h2>
          <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-3 @5xl:grid-cols-5">
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
      <PageHead icon={Download} title="Lead Ingestion" sub="Set the batch details, then bring the rows in." />
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
        <div className="mb-3 flex flex-wrap gap-1.5">
          {(["CSV", "Google Sheet", "Manual Entry"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "h-9 rounded-lg px-3 text-[12.5px] font-semibold transition-colors",
                mode === m ? "bg-sky-50 text-sky-700" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {m}
            </button>
          ))}
          <span className="ml-auto inline-flex h-9 items-center gap-1.5 text-[12.5px] font-medium text-sky-600">
            <Download className="h-3.5 w-3.5" /> Download the template
          </span>
        </div>

        {mode === "CSV" && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-10 text-center">
            <Upload className="mx-auto h-6 w-6 text-slate-400" />
            <p className="mt-2 text-[13px] font-medium text-slate-700">Drop a CSV here, or browse</p>
            <p className="mt-0.5 text-[12px] text-slate-400">leads-august.csv · 6 rows ready</p>
          </div>
        )}
        {mode === "Google Sheet" && (
          <div className="rounded-xl border border-slate-200 p-4">
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-medium text-slate-600">Paste your Google Sheet URL</span>
              <input
                defaultValue="https://docs.google.com/spreadsheets/d/1AbC…/edit"
                aria-label="Google Sheet URL"
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] text-slate-900 outline-none focus:border-sky-400"
              />
            </label>
            <p className="mt-2 text-[11.5px] text-slate-400">The sheet must be viewable by anyone with the link.</p>
          </div>
        )}
        {mode === "Manual Entry" && (
          <div className="grid gap-3 rounded-xl border border-slate-200 p-4 @2xl:grid-cols-2">
            <Field label="Name" value="" />
            <Field label="Phone" value="" />
            <Field label="Company" value="" />
            <Field label="Expected value" value="" />
          </div>
        )}

        <Btn tone="primary" className="mt-5" onClick={() => { dispatch({ type: "IMPORT", count: 6, source, batch }); setDone(true) }}>
          Import and grade 6 leads
        </Btn>
      </Card>

      <Card title="Import history" className="mt-4 max-w-3xl">
        <table className="w-full border-collapse">
          <thead className="border-b border-slate-100">
            <tr><Th>Batch</Th><Th>Source</Th><Th className="text-right">Rows</Th><Th className="text-right">When</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              ["July portal export", "Website form", 240, "3 weeks ago"],
              ["Trade fair, Pune", "Trade fair", 86, "last month"],
            ].map(([b, src, rows, when]) => (
              <tr key={String(b)}>
                <td className="py-3 text-[13px] font-medium text-slate-800">{b}</td>
                <td className="px-3 text-[13px] text-slate-600">{src}</td>
                <td className="px-3 text-right text-[13px] tabular-nums text-slate-700">{rows}</td>
                <td className="px-3 text-right text-[12.5px] text-slate-400">{when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  )
}

// ── Activity ──────────────────────────────────────────────────────────────────

export function ActivityView() {
  const { state } = useDemo()
  return (
    <>
      <PageHead icon={ActivityIcon} title="Activity" sub="How the team is doing, what they did, whether they hit SLAs, what they recovered." />
      <Card className="mt-4">
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

// ── Learning ──────────────────────────────────────────────────────────────────

export function LearningView() {
  return (
    <>
      <PageHead icon={Brain} title="Learning Engine" sub="Patterns the account has enough data to state." />
      <Card title="Patterns unlocked" className="mt-4">
        <div className="divide-y divide-slate-100">
          {LEARNING_PATTERNS.map((p) => (
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

      <Card title="Still learning" className="mt-4">
        <div className="divide-y divide-slate-100">
          {[
            { pattern: "Which follow-up interval works best per grade", need: "needs 60 more logged touches" },
            { pattern: "Whether trade-fair leads justify their cost", need: "needs a full quarter" },
          ].map((p) => (
            <div key={p.pattern} className="flex flex-wrap items-center gap-3 py-3.5 first:pt-0 last:pb-0">
              <Clock className="h-4 w-4 shrink-0 text-slate-300" />
              <p className="min-w-[200px] flex-1 text-[13px] text-slate-500">{p.pattern}</p>
              <span className="text-[11.5px] text-slate-400">{p.need}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

// ── Lead detail ───────────────────────────────────────────────────────────────

/**
 * The full record at /leads/[id]. The queue opens a slide-over; this is the page
 * behind its "open full record" link, with the score, details, the inquiry and
 * the activity/WhatsApp tabs.
 */
export function LeadDetailView({ leadId, onBack }: { leadId: string; onBack: () => void }) {
  const { state, dispatch } = useDemo()
  const [tab, setTab] = useState<"activity" | "whatsapp">("activity")
  const [channel, setChannel] = useState<"call" | "wa" | null>(null)
  const lead = state.leads.find((l) => l.id === leadId)
  if (!lead) return null
  const g = gradeOf(lead)

  return (
    <>
      <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-sky-600">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <Avatar name={lead.name} size={44} />
            <div className="min-w-0">
              <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-slate-900">{lead.name}</h1>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-[12.5px] text-slate-500">
                <span>{lead.company}</span>
                <span className="inline-flex h-6 items-center rounded-full bg-slate-100 px-2 text-[11.5px]">{lead.source}</span>
                <span className="inline-flex h-6 items-center rounded-full bg-sky-50 px-2 text-[11.5px] font-medium text-sky-700">{lead.stage}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[22px] font-bold leading-none tabular-nums text-slate-900">{formatRupee(lead.value)}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">Expected</p>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          {channel === null ? (
            <div className="flex flex-wrap gap-2">
              <Btn tone="primary" onClick={() => setChannel("call")}><PhoneCall className="h-4 w-4" /> Call Now</Btn>
              <Btn onClick={() => setChannel("wa")}><MessageCircle className="h-4 w-4" /> WhatsApp</Btn>
              <Btn onClick={() => dispatch({ type: "SET_STAGE", leadId: lead.id, stage: "Won" })}>Mark as Won</Btn>
              <Btn tone="danger" onClick={() => dispatch({ type: "SET_STAGE", leadId: lead.id, stage: "Lost" })}>Mark as Lost</Btn>
              <Btn>Reassign rep</Btn>
            </div>
          ) : (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                How did the {channel === "call" ? "call" : "chat"} go?
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(channel === "call" ? CALL_OUTCOMES : WA_OUTCOMES).map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => { dispatch({ type: "LOG_OUTCOME", leadId: lead.id, channel, outcome: o.value, label: o.label }); setChannel(null) }}
                    className={cn(
                      "h-8 rounded-lg px-3 text-[12px] font-semibold transition-colors",
                      o.tone === "good" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : o.tone === "warm" ? "bg-sky-50 text-sky-700 hover:bg-sky-100"
                        : o.tone === "cold" ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
                <button type="button" onClick={() => setChannel(null)} className="h-8 rounded-lg px-2 text-[12px] text-slate-400 hover:text-slate-700">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 @4xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <Card title="Lead Score">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="mb-1.5 text-[12px] text-slate-500">Fit</p>
                <ScoreCell value={contribution(lead.fit, WEIGHTS.fit)} of={WEIGHTS.fit} tone="fit" />
              </div>
              <div>
                <p className="mb-1.5 text-[12px] text-slate-500">Intent</p>
                <ScoreCell value={contribution(lead.intent, WEIGHTS.intent)} of={WEIGHTS.intent} tone="intent" />
              </div>
              <div>
                <p className="mb-1.5 text-[12px] text-slate-500">Quality</p>
                <ScoreCell value={contribution(lead.quality, WEIGHTS.quality)} of={WEIGHTS.quality} tone="quality" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
              <GradeBadge grade={g} />
              <p className="text-[13px] text-slate-600">
                Total <span className="font-bold tabular-nums text-slate-900">{totalScore(lead)}</span>/100 ·{" "}
                <span className="text-slate-400">Grade A needs Fit 65, Intent 60, Quality 60</span>
              </p>
            </div>
          </Card>

          <Card title="Inquiry / Notes" action={<Btn size="sm">Add note</Btn>}>
            <p className="text-[13px] leading-relaxed text-slate-700">{lead.signal}</p>
          </Card>

          <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
            <div className="flex gap-4 border-b border-slate-100 px-5">
              {(["activity", "whatsapp"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    "-mb-px border-b-2 py-3 text-[13px] font-semibold capitalize transition-colors",
                    tab === t ? "border-sky-500 text-sky-700" : "border-transparent text-slate-400 hover:text-slate-600"
                  )}
                >
                  {t === "whatsapp" ? "WhatsApp log" : "Activity"}
                </button>
              ))}
            </div>
            <div className="p-5">
              {tab === "activity" ? (
                <ol className="relative space-y-0 border-l border-slate-200 pl-5">
                  {lead.timeline.map((t) => (
                    <li key={t.id} className="relative py-2">
                      <span className="absolute -left-[23px] top-3.5 h-2 w-2 rounded-full bg-sky-400 ring-4 ring-white" />
                      <p className="text-[12.5px] text-slate-700">
                        {t.label}
                        {typeof t.delta === "number" && t.delta !== 0 && (
                          <span className={cn("ml-1.5 font-semibold tabular-nums", t.delta > 0 ? "text-emerald-600" : "text-rose-600")}>
                            {t.delta > 0 ? "+" : ""}{t.delta} intent
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{t.at}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-[13px] text-slate-500">
                  Open the chat from here, have it in your own WhatsApp, then record the outcome. The log drives
                  stage advancement and rescoring.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card title="Details">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
              {[
                { label: "Phone", value: lead.phone },
                { label: "Email", value: lead.email },
                { label: "Source", value: lead.source },
                { label: "Assigned to", value: lead.rep },
                { label: "Added", value: "14 Apr" },
                { label: "First contact", value: lead.contactedToday ? "today" : "not yet" },
              ].map((d) => (
                <div key={d.label} className="min-w-0">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">{d.label}</p>
                  <p className="mt-0.5 break-words text-[12.5px] font-medium text-slate-700">{d.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Score Evolution">
            <div className="space-y-2.5">
              {[
                { at: "on arrival", grade: "C" as const, why: "Imported and graded" },
                { at: "day 2", grade: "B" as const, why: "Replied on WhatsApp" },
                { at: "now", grade: g, why: "Latest signal" },
              ].map((r) => (
                <div key={r.at} className="flex items-center gap-3">
                  <GradeBadge grade={r.grade} size="sm" />
                  <span className="flex-1 text-[12.5px] text-slate-600">{r.why}</span>
                  <span className="text-[11.5px] text-slate-400">{r.at}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

// ── Settings ──────────────────────────────────────────────────────────────────

const SETTINGS_NAV = [
  "Profile", "Security", "Organisation", "Billing", "Team",
  "Workspaces", "ICP Settings", "Lead Sources", "Templates",
] as const

type SettingsTab = (typeof SETTINGS_NAV)[number]

export function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-slate-600">{label}</span>
      <input
        defaultValue={value}
        aria-label={label}
        className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] text-slate-900 outline-none focus:border-sky-400"
      />
      {hint && <span className="mt-1 block text-[11.5px] text-slate-400">{hint}</span>}
    </label>
  )
}

/** The nine settings pages, reached from the user chip as in the product. */
export function SettingsView() {
  const [tab, setTab] = useState<SettingsTab>("Profile")

  return (
    <>
      <PageHead title="Settings" sub="Your account, your team, and how leads are scored." />

      <div className="mt-4 grid gap-4 @3xl:grid-cols-[176px_1fr]">
        <nav className="flex flex-wrap gap-1 @3xl:flex-col">
          {SETTINGS_NAV.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg px-3 py-2 text-left text-[13px] transition-colors",
                tab === t ? "bg-sky-50 font-semibold text-sky-700" : "font-medium text-slate-500 hover:bg-slate-50"
              )}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className="min-w-0">
          {tab === "Profile" && (
            <div className="space-y-4">
              <Card title="Personal info">
                <div className="grid gap-4 @2xl:grid-cols-2">
                  <Field label="First name" value="Ajsal" />
                  <Field label="Last name" value="Work" />
                  <Field label="Email address" value="ajsal@sunrisegroup.in" />
                  <Field label="Role" value="Admin" />
                </div>
              </Card>
              <Card title="Account info">
                <div className="grid gap-4 @2xl:grid-cols-2">
                  <Field label="Organisation ID" value="org_sunrise_9f21" />
                  <Field label="User ID" value="usr_4c0e18" />
                  <Field label="Workspace" value="Sunrise Group" />
                </div>
              </Card>
            </div>
          )}

          {tab === "Security" && (
            <Card title="Security">
              <div className="grid gap-4 @2xl:grid-cols-2">
                <Field label="Current password" value="••••••••••" />
                <Field label="New password" value="" />
              </div>
              <p className="mt-4 text-[12.5px] text-slate-500">
                Sessions sign out after 30 days of inactivity.
              </p>
            </Card>
          )}

          {tab === "Organisation" && (
            <Card title="Organisation">
              <div className="grid gap-4 @2xl:grid-cols-2">
                <Field label="Organisation name" value="Sunrise Group" />
                <Field label="Industry" value="Real Estate" />
                <Field label="Country" value="India" />
                <Field label="Currency" value="INR (₹)" />
              </div>
            </Card>
          )}

          {tab === "Billing" && (
            <div className="space-y-4">
              <Card title="Current plan">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[18px] font-bold text-slate-900">Growth</p>
                    <p className="text-[12.5px] text-slate-500">₹7,999 per month, flat for the account</p>
                  </div>
                  <Btn tone="primary">Change plan</Btn>
                </div>
                <div className="mt-4 grid gap-3 @2xl:grid-cols-2">
                  <div className="rounded-xl border border-slate-200/70 p-3.5">
                    <p className="text-[12px] text-slate-500">Active leads</p>
                    <p className="mt-1 text-[20px] font-bold tabular-nums text-slate-900">12 / 500</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/70 p-3.5">
                    <p className="text-[12px] text-slate-500">Team seats</p>
                    <p className="mt-1 text-[20px] font-bold tabular-nums text-slate-900">4 / 10</p>
                  </div>
                </div>
              </Card>
              <Card title="Invoices">
                <table className="w-full border-collapse">
                  <thead className="border-b border-slate-100">
                    <tr><Th>Invoice</Th><Th>Amount</Th><Th>Status</Th><Th className="text-right">Download</Th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[["INV-2026-07", "₹7,999", "Paid"], ["INV-2026-06", "₹7,999", "Paid"]].map(([id, amt, st]) => (
                      <tr key={id}>
                        <td className="py-3 text-[13px] text-slate-700">{id}</td>
                        <td className="px-3 text-[13px] tabular-nums text-slate-700">{amt}</td>
                        <td className="px-3"><span className="inline-flex h-6 items-center rounded-full bg-emerald-50 px-2 text-[11.5px] font-semibold text-emerald-700">{st}</span></td>
                        <td className="px-3 text-right text-[13px] font-medium text-sky-600">PDF</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {tab === "Team" && (
            <Card title="Team" action={<Btn tone="primary" size="sm">Invite a Team Member</Btn>}>
              <table className="w-full border-collapse">
                <thead className="border-b border-slate-100">
                  <tr><Th>Member</Th><Th>Role</Th><Th>Workspace access</Th><Th className="text-right">Action</Th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {REPS.map((r, i) => (
                    <tr key={r.name}>
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={r.name} size={28} />
                          <span className="text-[13px] font-semibold text-slate-900">{r.name}</span>
                          {i === 0 && <span className="text-[11px] text-slate-400">You</span>}
                        </div>
                      </td>
                      <td className="px-3 text-[13px] text-slate-600">{i === 0 ? "Admin" : i === 1 ? "Manager" : "Sales Rep"}</td>
                      <td className="px-3 text-[13px] text-slate-600">Sunrise Group</td>
                      <td className="px-3 text-right text-[13px] font-medium text-sky-600">Change Role</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {tab === "Workspaces" && (
            <Card title="Workspaces" action={<Btn tone="primary" size="sm">New workspace</Btn>}>
              <div className="divide-y divide-slate-100">
                {[["Sunrise Group", "4 members", "Default"], ["Sunrise Commercial", "2 members", ""]].map(([n, m, tag]) => (
                  <div key={n} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-50 text-sky-600"><Columns2 className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-slate-900">{n}</p>
                      <p className="text-[11.5px] text-slate-400">Who works in this workspace · {m}</p>
                    </div>
                    {tag && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">{tag}</span>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "ICP Settings" && (
            <div className="space-y-4">
              <Card title="SQL Thresholds">
                <div className="grid gap-4 @2xl:grid-cols-2">
                  <Field label="Fit Score Threshold" value="55" hint="How well the lead matches your ICP" />
                  <Field label="Intent Score Threshold" value="45" hint="What the lead has actually done" />
                </div>
              </Card>
              <Card title="Your winning segments">
                <div className="space-y-3">
                  {[
                    ["Industries in your leads", "Real Estate · BFSI · EdTech"],
                    ["States in your leads", "Maharashtra · Karnataka · Kerala"],
                    ["Decision makers in your leads", "Founder · Sales Head · Branch Manager"],
                    ["Typical sales cycle", "30 to 90 days"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                      <span className="text-[12.5px] text-slate-500">{k}</span>
                      <span className="text-[13px] font-medium text-slate-900">{v}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {tab === "Lead Sources" && (
            <div className="space-y-4">
              <Card title="Default sources">
                <table className="w-full border-collapse">
                  <thead className="border-b border-slate-100"><tr><Th>Source name</Th><Th className="text-right">Intent baseline</Th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {[["Website form", 20], ["Google Ads", 15], ["Facebook Ads", 10], ["Referral", 25], ["Bulk import", 0]].map(([n, b]) => (
                      <tr key={String(n)}>
                        <td className="py-3 text-[13px] text-slate-700">{n}</td>
                        <td className="px-3 text-right text-[13px] tabular-nums text-slate-700">{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
              <Card title="Custom sources" action={<Btn size="sm">New custom source</Btn>}>
                <p className="py-6 text-center text-[13px] text-slate-400">No custom sources yet.</p>
              </Card>
            </div>
          )}

          {tab === "Templates" && (
            <Card title="Smart Templates" action={<Btn tone="primary" size="sm">New template</Btn>}>
              <div className="divide-y divide-slate-100">
                {[
                  ["First touch", "New Inquiry", "Hi {{first_name}}, thanks for your enquiry about {{project}}."],
                  ["Site visit follow-up", "Qualified", "Hi {{first_name}}, confirming your visit on {{date}}."],
                ].map(([n, stage, body]) => (
                  <div key={n} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13px] font-semibold text-slate-900">{n}</p>
                      <span className="inline-flex h-6 items-center rounded-full bg-sky-50 px-2 text-[11.5px] font-medium text-sky-700">{stage}</span>
                    </div>
                    <p className="mt-1 text-[12.5px] text-slate-500">{body}</p>
                    <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-slate-400">Merge Fields · Preview with sample data</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
