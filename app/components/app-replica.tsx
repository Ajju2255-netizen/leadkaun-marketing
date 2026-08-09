"use client"

import { useState } from "react"
import {
  LayoutDashboard, Zap, Users, Columns2, CalendarCheck, BarChart2, AlertTriangle,
  Trophy, Activity, Bell, Upload, LogOut, Layers, Brain, Menu, Search,
  SlidersHorizontal, ChevronRight, Inbox, Flame, PhoneCall, IndianRupee,
  Snowflake, ArrowUpRight, type LucideIcon,
} from "lucide-react"

import { LeadkaunMark } from "@/app/components/leadkaun-mark"
import { cn } from "@/lib/utils"

/**
 * AppReplica — the Leadkaun product, rebuilt as a self-contained demo for the
 * landing page.
 *
 * This mirrors the real application's structure rather than inventing a
 * marketing illustration: the sidebar groups (Execute / Leads / Insights), the
 * Priority Queue table columns, the six quick-stat cards, the grade badge
 * palette and the A to F tabs are all lifted from the product's own components
 * so what a visitor sees is what they get after signing in.
 *
 * Everything in it is sample data, labelled as such on the frame. No figure
 * here describes a real customer, and nothing is claimed about outcomes.
 */

// ── Sample data ───────────────────────────────────────────────────────────────

type Grade = "A" | "B" | "C" | "D" | "F"

type Lead = {
  name: string
  company: string
  value: string
  grade: Grade
  signal: string
  next: string
  source: string
  ago: string
}

const LEADS: Lead[] = [
  { name: "Priya Sharma",   company: "Sunrise Realty",      value: "₹42L",  grade: "A", signal: "Asked for pricing on WhatsApp",  next: "Call now",        source: "Website form", ago: "4m ago" },
  { name: "Rahul Mehta",    company: "Apex Capital",        value: "₹28L",  grade: "A", signal: "Replied, wants a walkthrough",   next: "Call now",        source: "Google Ads",   ago: "22m ago" },
  { name: "Vikram Desai",   company: "Deccan Motors",       value: "₹15L",  grade: "B", signal: "Booked a site visit",            next: "Follow up today", source: "Website form", ago: "1h ago" },
  { name: "Anjali Rao",     company: "BrightEdu Institute", value: "₹9L",   grade: "B", signal: "Downloaded the brochure twice",  next: "Follow up today", source: "Facebook Ads", ago: "2h ago" },
  { name: "Arjun Nair",     company: "Kochi Exports",       value: "₹6.5L", grade: "C", signal: "Opened the quote, no reply",     next: "Nurture",         source: "Referral",     ago: "5h ago" },
  { name: "Neha Kulkarni",  company: "Sahyadri Clinics",    value: "₹1.2L", grade: "C", signal: "Enquiry from a listing site",    next: "Nurture",         source: "Listings",     ago: "9h ago" },
  { name: "Imran Khan",     company: "Metro Logistics",     value: "₹3L",   grade: "D", signal: "No response in nine days",       next: "Light touch",     source: "Trade fair",   ago: "2d ago" },
  { name: "Sneha Patil",    company: "Pune Interiors",      value: "₹85K",  grade: "F", signal: "Number unreachable",             next: "Archive",         source: "Bulk import",  ago: "6d ago" },
]

const MISSED = [
  { name: "Rohit Iyer",    company: "Nashik Agro",      value: "₹22L", stale: "31 days", grade: "A" as Grade, why: "Grade A, never called back after the first reply" },
  { name: "Kavita Menon",  company: "Trivandrum Homes", value: "₹17L", stale: "24 days", grade: "A" as Grade, why: "Site visit booked, no follow-up logged" },
  { name: "Sameer Joshi",  company: "Indore Plastics",  value: "₹11L", stale: "19 days", grade: "B" as Grade, why: "Asked for a revised quote, none sent" },
  { name: "Farah Sheikh",  company: "Hyderabad Tutors", value: "₹8L",  stale: "16 days", grade: "B" as Grade, why: "Two replies, then silence for a fortnight" },
]

const REPS = [
  { name: "Aditya Rane",   graded: 214, contacted: 186, won: "₹64L", pct: 87 },
  { name: "Meera Shah",    graded: 198, contacted: 151, won: "₹51L", pct: 76 },
  { name: "Karan Bedi",    graded: 173, contacted: 118, won: "₹33L", pct: 68 },
  { name: "Divya Pillai",  graded: 141, contacted: 79,  won: "₹21L", pct: 56 },
]

const FUNNEL = [
  { stage: "New",        count: 486, pct: 100 },
  { stage: "Contacted",  count: 312, pct: 64 },
  { stage: "Qualified",  count: 173, pct: 36 },
  { stage: "Proposal",   count: 88,  pct: 18 },
  { stage: "Won",        count: 41,  pct: 8 },
]

const HEALTH = [
  { label: "Healthy", count: 612, pct: 48, icon: Activity,      tone: "text-emerald-600", bar: "bg-emerald-400" },
  { label: "At risk", count: 341, pct: 27, icon: AlertTriangle, tone: "text-orange-500",  bar: "bg-orange-400" },
  { label: "Missed",  count: 174, pct: 14, icon: ArrowUpRight,  tone: "text-red-500",     bar: "bg-red-400" },
  { label: "Cold",    count: 157, pct: 11, icon: Snowflake,     tone: "text-slate-500",   bar: "bg-slate-300" },
]

// ── Product primitives, matched to the app ────────────────────────────────────

/** GradeBadge palette, copied from the product's shared component. */
const GRADE_STYLES: Record<Grade, string> = {
  A: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  B: "bg-sky-50 text-sky-700 ring-sky-200",
  C: "bg-orange-50 text-orange-600 ring-orange-200",
  D: "bg-orange-100 text-orange-700 ring-orange-300",
  F: "bg-slate-100 text-slate-500 ring-slate-200",
}

function GradeBadge({ grade }: { grade: Grade }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-lg text-[13px] font-bold leading-none ring-1",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
        GRADE_STYLES[grade]
      )}
    >
      {grade}
    </span>
  )
}

const NEXT_TONE: Record<Grade, string> = {
  A: "bg-sky-50 text-sky-700",
  B: "bg-sky-50 text-sky-700",
  C: "bg-amber-50 text-amber-700",
  D: "bg-orange-50 text-orange-700",
  F: "bg-slate-100 text-slate-500",
}

const AVATAR_TINTS = [
  "linear-gradient(180deg, #BAE6FD 0%, #7DD3FC 100%)",
  "linear-gradient(180deg, #BBF7D0 0%, #86EFAC 100%)",
  "linear-gradient(180deg, #FED7AA 0%, #FDBA74 100%)",
  "linear-gradient(180deg, #DDD6FE 0%, #C4B5FD 100%)",
]

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
  const tint = AVATAR_TINTS[name.charCodeAt(0) % AVATAR_TINTS.length]
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full text-[11px] font-bold text-slate-700"
      style={{ width: size, height: size, background: tint, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)" }}
    >
      {initials}
    </span>
  )
}

function StatCard({
  icon: Icon, label, value, tintBg, tintFg, caption,
}: {
  icon: LucideIcon; label: string; value: string; tintBg: string; tintFg: string; caption: string
}) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white p-3.5">
      <div className="flex min-w-0 items-center gap-2">
        <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", tintBg)}>
          <Icon className={cn("h-4 w-4", tintFg)} strokeWidth={2} />
        </span>
        <span className="text-[12px] font-medium leading-tight text-slate-600">{label}</span>
      </div>
      <div className="mt-3 text-[23px] font-bold leading-none tabular-nums text-slate-900">{value}</div>
      <div className="mt-2 min-h-[16px] text-[11.5px] text-slate-400">{caption}</div>
    </div>
  )
}

function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={cn("whitespace-nowrap px-3 py-2.5 text-left text-[12px] font-semibold text-slate-600", className)}>
      {children}
    </th>
  )
}

function Panel({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-5", className)}>
      <h3 className="mb-3.5 text-[15px] font-semibold text-slate-900">{title}</h3>
      {children}
    </section>
  )
}

// ── Sidebar, mirroring the product's NAV_GROUPS ───────────────────────────────

type View = "queue" | "leads" | "dashboard" | "missed"

const NAV_GROUPS: { label: string | null; items: { key: string; label: string; icon: LucideIcon; view?: View }[] }[] = [
  {
    label: "Execute",
    items: [
      { key: "queue",      label: "Priority Queue", icon: Zap, view: "queue" },
      { key: "follow-ups", label: "Follow-ups",     icon: CalendarCheck },
      { key: "pipeline",   label: "Pipeline",       icon: Columns2 },
    ],
  },
  {
    label: "Leads",
    items: [
      { key: "leads",  label: "All Leads",    icon: Users, view: "leads" },
      { key: "import", label: "Import Leads", icon: Upload },
    ],
  },
  {
    label: "Insights",
    items: [
      { key: "dashboard", label: "Dashboard",   icon: LayoutDashboard, view: "dashboard" },
      { key: "activity",  label: "Activity",    icon: Activity },
      { key: "analytics", label: "Analytics",   icon: BarChart2 },
      { key: "rep",       label: "Rep Tracking", icon: Trophy },
      { key: "learning",  label: "Learning",    icon: Brain },
      { key: "missed",    label: "Missed Opps", icon: AlertTriangle, view: "missed" },
    ],
  },
  {
    label: null,
    items: [{ key: "notifications", label: "Notifications", icon: Bell }],
  },
]

const VIEW_TITLE: Record<View, string> = {
  queue: "Priority Queue",
  leads: "All Leads",
  dashboard: "Dashboard",
  missed: "Missed Opportunities",
}

// ── Views ─────────────────────────────────────────────────────────────────────

const GRADE_TABS: { key: string; label: string; dot: string; active: string }[] = [
  { key: "all", label: "All",     dot: "",                 active: "bg-slate-800" },
  { key: "A",   label: "Grade A", dot: "bg-emerald-400",   active: "bg-emerald-500" },
  { key: "B",   label: "Grade B", dot: "bg-sky-400",       active: "bg-sky-500" },
  { key: "C",   label: "Grade C", dot: "bg-orange-400",    active: "bg-orange-500" },
  { key: "D",   label: "Grade D", dot: "bg-orange-500",    active: "bg-orange-600" },
  { key: "F",   label: "Grade F", dot: "bg-slate-400",     active: "bg-slate-500" },
]

function QueueView() {
  const [tab, setTab] = useState("all")
  const rows = tab === "all" ? LEADS : LEADS.filter((l) => l.grade === tab)

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-slate-900">Priority Queue</h2>
        <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 text-[13px] font-semibold text-white">
          <Upload className="h-4 w-4" /> Import leads
        </span>
      </header>

      <section className="mt-4 rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-5">
        <h3 className="mb-3.5 text-[14px] font-semibold text-slate-900">Quick stats</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <StatCard icon={Inbox}       label="Total leads"     value="1,284"  tintBg="bg-slate-100"   tintFg="text-slate-500"   caption="in your queue" />
          <StatCard icon={Flame}       label="High priority"   value="37"     tintBg="bg-rose-50"     tintFg="text-rose-500"    caption="call today" />
          <StatCard icon={Zap}         label="Hot right now"   value="12"     tintBg="bg-amber-50"    tintFg="text-amber-500"   caption="live signals" />
          <StatCard icon={PhoneCall}   label="Contacted today" value="46"     tintBg="bg-emerald-50"  tintFg="text-emerald-600" caption="today" />
          <StatCard icon={IndianRupee} label="In play"         value="₹3.6Cr" tintBg="bg-sky-50"      tintFg="text-sky-600"     caption="pipeline value" />
          <StatCard icon={Trophy}      label="Top 3 potential" value="₹79L"   tintBg="bg-violet-50"   tintFg="text-violet-500"  caption="your best 3" />
        </div>
      </section>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {GRADE_TABS.map((t) => {
          const count = t.key === "all" ? LEADS.length : LEADS.filter((l) => l.grade === t.key).length
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
              {rows.map((l, i) => (
                <tr key={l.name} className="group transition-colors hover:bg-sky-50/40">
                  <td className="py-3 pl-5 pr-3 align-middle">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={l.name} />
                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="truncate text-[13.5px] font-semibold text-slate-900">{l.name}</span>
                          {i === 0 && tab === "all" && (
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
                    <span className="text-[13.5px] font-semibold tabular-nums text-slate-900">{l.value}</span>
                  </td>
                  <td className="px-3 py-3 align-middle"><GradeBadge grade={l.grade} /></td>
                  <td className="hidden px-3 py-3 align-middle sm:table-cell">
                    <span className={cn("inline-flex h-7 items-center whitespace-nowrap rounded-full px-3 text-[12px] font-semibold", NEXT_TONE[l.grade])}>
                      {l.next}
                    </span>
                  </td>
                  <td className="hidden px-3 py-3 align-middle xl:table-cell">
                    <span className="whitespace-nowrap text-[12.5px] text-slate-400">{l.source}</span>
                  </td>
                  <td className="hidden px-3 py-3 align-middle lg:table-cell">
                    <span className="whitespace-nowrap text-[12.5px] text-slate-400">{l.ago}</span>
                  </td>
                  <td className="py-3 pl-3 pr-5 text-right align-middle">
                    <ChevronRight className="ml-auto h-4 w-4 text-slate-300 transition-colors group-hover:text-sky-500" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function LeadsView() {
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-slate-900">All Leads</h2>
        <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 text-[13px] font-semibold text-white">
          <Upload className="h-4 w-4" /> Import leads
        </span>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex h-9 flex-1 min-w-[200px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-400">
          <Search className="h-4 w-4 text-slate-400" /> Search name, company or number
        </span>
        <span className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-600">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </span>
      </div>

      <section className="mt-3 overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead className="border-b border-slate-200/70 bg-slate-50/60">
              <tr>
                <Th className="pl-5">Lead</Th>
                <Th>Grade</Th>
                <Th className="text-right">Value</Th>
                <Th className="hidden sm:table-cell">Source</Th>
                <Th className="hidden lg:table-cell">Last active</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {LEADS.map((l) => (
                <tr key={l.name} className="transition-colors hover:bg-sky-50/40">
                  <td className="py-3 pl-5 pr-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={l.name} size={28} />
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-semibold text-slate-900">{l.name}</p>
                        <p className="truncate text-[12px] text-slate-400">{l.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3"><GradeBadge grade={l.grade} /></td>
                  <td className="px-3 py-3 text-right text-[13.5px] font-semibold tabular-nums text-slate-900">{l.value}</td>
                  <td className="hidden px-3 py-3 text-[12.5px] text-slate-400 sm:table-cell">{l.source}</td>
                  <td className="hidden px-3 py-3 text-[12.5px] text-slate-400 lg:table-cell">{l.ago}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function DashboardView() {
  return (
    <>
      <header>
        <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-slate-900">Dashboard</h2>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <StatCard icon={Inbox}       label="New Leads"        value="486"    tintBg="bg-sky-50"     tintFg="text-sky-600"     caption="this month" />
        <StatCard icon={PhoneCall}   label="First Contacts"   value="312"    tintBg="bg-emerald-50" tintFg="text-emerald-600" caption="this month" />
        <StatCard icon={CalendarCheck} label="Follow-ups Done" value="228"   tintBg="bg-violet-50"  tintFg="text-violet-500"  caption="this month" />
        <StatCard icon={Trophy}      label="Leads Won"        value="41"     tintBg="bg-amber-50"   tintFg="text-amber-500"   caption="this month" />
        <StatCard icon={IndianRupee} label="Revenue"          value="₹1.7Cr" tintBg="bg-slate-100"  tintFg="text-slate-500"   caption="closed value" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Pipeline Funnel">
          <div className="space-y-3">
            {FUNNEL.map((f) => (
              <div key={f.stage}>
                <div className="flex items-baseline justify-between text-[12.5px]">
                  <span className="font-medium text-slate-600">{f.stage}</span>
                  <span className="font-semibold tabular-nums text-slate-900">{f.count}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-sky-400" style={{ width: `${f.pct}%` }} />
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
                <span className="text-[13px] font-semibold tabular-nums text-slate-900">{r.won}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Behaviour Health" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HEALTH.map((h) => (
              <div key={h.label} className="rounded-xl border border-slate-200/70 p-3.5">
                <div className="flex items-center gap-2">
                  <h.icon className={cn("h-3.5 w-3.5", h.tone)} strokeWidth={2.5} />
                  <span className="text-[12px] font-medium text-slate-600">{h.label}</span>
                </div>
                <p className="mt-2 text-[20px] font-bold leading-none tabular-nums text-slate-900">{h.count}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full", h.bar)} style={{ width: `${h.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}

function MissedView() {
  return (
    <>
      <header>
        <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-slate-900">Missed Opportunities</h2>
        <p className="mt-1.5 text-[13px] text-slate-500">Leads that went quiet while they were still worth working.</p>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={AlertTriangle} label="Missed leads"  value="174"   tintBg="bg-orange-50" tintFg="text-orange-500" caption="recoverable" />
        <StatCard icon={IndianRupee}   label="₹ at risk"     value="₹58L"  tintBg="bg-rose-50"   tintFg="text-rose-500"   caption="this quarter" />
        <StatCard icon={Flame}         label="Grade A stale" value="21"    tintBg="bg-amber-50"  tintFg="text-amber-500"  caption="top priority" />
        <StatCard icon={PhoneCall}     label="Recovered"     value="37"    tintBg="bg-emerald-50" tintFg="text-emerald-600" caption="last 30 days" />
      </div>

      <Panel title="High-value missed opportunities" className="mt-4">
        <div className="divide-y divide-slate-100">
          {MISSED.map((m) => (
            <div key={m.name} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
              <Avatar name={m.name} />
              <div className="min-w-[160px] flex-1">
                <p className="text-[13.5px] font-semibold text-slate-900">{m.name}</p>
                <p className="text-[12px] text-slate-400">{m.company}</p>
              </div>
              <p className="hidden max-w-[280px] flex-1 text-[12.5px] text-slate-500 md:block">{m.why}</p>
              <span className="inline-flex h-7 items-center rounded-full bg-orange-50 px-3 text-[12px] font-semibold text-orange-700">
                {m.stale} stale
              </span>
              <GradeBadge grade={m.grade} />
              <span className="w-[64px] text-right text-[13.5px] font-semibold tabular-nums text-slate-900">{m.value}</span>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

// ── Shell ─────────────────────────────────────────────────────────────────────

export function AppReplica() {
  const [view, setView] = useState<View>("queue")

  return (
    <div
      className="overflow-hidden rounded-[20px] bg-white"
      style={{ border: "1px solid var(--paper-line-2)", boxShadow: "0 30px 60px -40px rgba(15,23,42,0.45)" }}
    >
      {/* Frame bar. Marks the whole thing as a demo, in the product's own chrome. */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ borderBottom: "1px solid var(--paper-line)", background: "var(--paper-2)" }}
      >
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </span>
        <span className="ledger-num truncate text-[11px] uppercase tracking-[0.14em] text-ink-muted">
          app.leadkaun.com/{view}
        </span>
        <span className="ml-auto shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted"
              style={{ border: "1px solid var(--paper-line)" }}>
          Sample data
        </span>
      </div>

      {/* App canvas */}
      <div className="flex gap-3 p-3" style={{ background: "#F1F5F9", minHeight: 560 }}>
        {/* Sidebar */}
        <aside className="hidden w-[224px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white md:flex">
          <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-slate-200/70 px-4">
            <LeadkaunMark size={24} gloss />
            <span className="text-[15px] font-semibold leading-none tracking-[-0.025em] text-slate-900">Leadkaun</span>
          </div>

          <div className="border-b border-slate-200/70 px-3 py-2.5">
            <p className="mb-1.5 px-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">Workspace</p>
            <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
              <Layers className="h-3.5 w-3.5 shrink-0 text-sky-500" />
              <span className="truncate text-[13px] font-medium text-slate-900">Sunrise Group</span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 pb-2 pt-3">
            {NAV_GROUPS.map((group, gi) => (
              <div
                key={group.label ?? "utility"}
                className={gi === 0 ? "" : group.label ? "mt-4" : "mt-3 border-t border-slate-200/70 pt-3"}
              >
                {group.label && (
                  <p className="mb-1 select-none px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {group.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = item.view === view
                    const Icon = item.icon
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => item.view && setView(item.view)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] transition-all duration-150",
                          active
                            ? "bg-sky-50/80 font-semibold text-sky-700 before:absolute before:bottom-1.5 before:left-0 before:top-1.5 before:w-[3px] before:rounded-r-full before:bg-sky-500"
                            : "font-medium text-slate-600 hover:bg-sky-50/40 hover:text-sky-600"
                        )}
                      >
                        <Icon
                          className={cn("h-[15px] w-[15px] shrink-0", active ? "text-sky-500" : "text-slate-400")}
                          strokeWidth={active ? 2.5 : 2}
                        />
                        {item.label}
                        {item.key === "missed" && (
                          <span
                            className="ml-auto inline-flex h-[18px] min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
                            style={{ background: "linear-gradient(180deg, #FDBA74 0%, #FB923C 100%)" }}
                          >
                            174
                          </span>
                        )}
                        {item.key === "notifications" && (
                          <span
                            className="ml-auto inline-flex h-[18px] min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
                            style={{ background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)" }}
                          >
                            6
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-t border-slate-200/70 px-3 py-3">
            <div className="flex items-center gap-2.5">
              <Avatar name="Aditya Rane" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold leading-tight text-slate-900">Aditya Rane</p>
                <p className="mt-0.5 truncate font-mono text-[10px] uppercase leading-tight tracking-[0.10em] text-slate-400">
                  Manager
                </p>
              </div>
              <LogOut className="h-3.5 w-3.5 shrink-0 text-slate-400" strokeWidth={2} />
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Mobile top bar, as in the product */}
          <div className="mb-3 flex h-12 items-center justify-between rounded-xl border border-slate-200/70 bg-white px-3 md:hidden">
            <Menu className="h-5 w-5 text-slate-700" strokeWidth={2.25} />
            <span className="flex items-center gap-2">
              <LeadkaunMark size={20} gloss />
              <span className="text-[14px] font-semibold tracking-[-0.025em] text-slate-900">{VIEW_TITLE[view]}</span>
            </span>
            <Bell className="h-5 w-5 text-slate-700" strokeWidth={2.25} />
          </div>

          {/* View switcher for small screens, where the sidebar is hidden */}
          <div className="mb-3 flex gap-1.5 overflow-x-auto md:hidden">
            {(["queue", "leads", "dashboard", "missed"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
                  view === v ? "bg-sky-600 text-white" : "border border-slate-200 bg-white text-slate-600"
                )}
              >
                {VIEW_TITLE[v]}
              </button>
            ))}
          </div>

          <div className="rounded-2xl p-1">
            {view === "queue" && <QueueView />}
            {view === "leads" && <LeadsView />}
            {view === "dashboard" && <DashboardView />}
            {view === "missed" && <MissedView />}
          </div>
        </div>
      </div>
    </div>
  )
}
