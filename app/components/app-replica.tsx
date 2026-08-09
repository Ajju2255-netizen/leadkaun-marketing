"use client"

import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import {
  LayoutDashboard, Zap, Users, Columns2, CalendarCheck, BarChart2, AlertTriangle,
  Trophy, Activity as ActivityIcon, Bell, Upload, LogOut, Layers, Brain, Menu,
  Phone, MessageCircle, X, RotateCcw, type LucideIcon,
} from "lucide-react"

import { LeadkaunMark } from "@/app/components/leadkaun-mark"
import { cn } from "@/lib/utils"
import {
  CALL_OUTCOMES, WA_OUTCOMES, activeAgo, demoReducer, formatRupee, gradeOf,
  INITIAL_STATE, nextAction,
} from "@/lib/demo-app"
import {
  Avatar, Btn, DemoCtx, GradeBadge, NEXT_TONE, ScoreBar, useDemo,
} from "@/app/components/demo/primitives"
import {
  ActivityView, AnalyticsView, DashboardView, FollowUpsView, ImportView, LeadsView,
  LearningView, MissedView, NotificationsView, PipelineView, QueueView, RepTrackingView,
} from "@/app/components/demo/views"

/**
 * AppReplica — the Leadkaun product, rebuilt as a working demo for the landing page.
 *
 * Not a screenshot and not a click-through prototype: it holds real state. Logging
 * a call adds the product's own intent weight to the lead's score, the grade is
 * recomputed through the product's own grade matrix, and the queue re-ranks. See
 * lib/demo-app.ts, which documents exactly which constants are copied from the app.
 *
 * Every name, company and figure is invented, and the frame says so.
 */

type View =
  | "queue" | "follow-ups" | "pipeline" | "leads" | "import"
  | "dashboard" | "activity" | "analytics" | "rep" | "learning" | "missed" | "notifications"

const NAV_GROUPS: { label: string | null; items: { view: View; label: string; icon: LucideIcon }[] }[] = [
  {
    label: "Execute",
    items: [
      { view: "queue", label: "Priority Queue", icon: Zap },
      { view: "follow-ups", label: "Follow-ups", icon: CalendarCheck },
      { view: "pipeline", label: "Pipeline", icon: Columns2 },
    ],
  },
  {
    label: "Leads",
    items: [
      { view: "leads", label: "All Leads", icon: Users },
      { view: "import", label: "Import Leads", icon: Upload },
    ],
  },
  {
    label: "Insights",
    items: [
      { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { view: "activity", label: "Activity", icon: ActivityIcon },
      { view: "analytics", label: "Analytics", icon: BarChart2 },
      { view: "rep", label: "Rep Tracking", icon: Trophy },
      { view: "learning", label: "Learning", icon: Brain },
      { view: "missed", label: "Missed Opps", icon: AlertTriangle },
    ],
  },
  { label: null, items: [{ view: "notifications", label: "Notifications", icon: Bell }] },
]

const VIEW_TITLE: Record<View, string> = {
  queue: "Priority Queue", "follow-ups": "Follow-ups", pipeline: "Pipeline",
  leads: "All Leads", import: "Import Leads", dashboard: "Dashboard",
  activity: "Activity", analytics: "Analytics", rep: "Rep Tracking",
  learning: "Learning", missed: "Missed Opps", notifications: "Notifications",
}

// ── Lead detail, the product's slide-over ─────────────────────────────────────

function LeadPanel({ leadId, onClose }: { leadId: string; onClose: () => void }) {
  const { state, dispatch } = useDemo()
  const [channel, setChannel] = useState<"call" | "wa" | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  const lead = state.leads.find((l) => l.id === leadId)
  if (!lead) return null

  const grade = gradeOf(lead)
  const outcomes = channel === "call" ? CALL_OUTCOMES : WA_OUTCOMES

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Lead ${lead.name}`}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-[440px] max-w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_-20px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5"
      >
        <div className="relative shrink-0 border-b border-slate-100 px-5 pb-4 pt-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sky-50/70 to-transparent" />
          <div className="relative flex items-start gap-3 pr-9">
            <Avatar name={lead.name} size={44} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-bold leading-tight text-slate-900">{lead.name}</p>
              <p className="mt-0.5 truncate text-[12px] text-slate-400">{lead.company}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close lead"
              className="absolute right-0 top-0 grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="relative mt-3.5 flex items-end justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <GradeBadge grade={grade} />
              <span className={cn("inline-flex h-7 items-center rounded-full px-3 text-[12px] font-semibold", NEXT_TONE[grade])}>
                {nextAction(grade)}
              </span>
              <span className="text-[11.5px] text-slate-400">{activeAgo(lead.activeMinutesAgo)}</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Value</p>
              <p className="text-[18px] font-black leading-none tabular-nums text-slate-900">{formatRupee(lead.value)}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Contact actions, mirroring the product's shared Call / WhatsApp control */}
          <div className="px-5 py-4">
            {channel === null ? (
              <div className="flex gap-2">
                <Btn tone="primary" className="flex-1" onClick={() => setChannel("call")}>
                  <Phone className="h-4 w-4" /> Call
                </Btn>
                <Btn className="flex-1" onClick={() => setChannel("wa")}>
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </Btn>
              </div>
            ) : (
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  How did the {channel === "call" ? "call" : "chat"} go?
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {outcomes.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => {
                        dispatch({ type: "LOG_OUTCOME", leadId: lead.id, channel, outcome: o.value, label: o.label })
                        setChannel(null)
                      }}
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
                  <button
                    type="button"
                    onClick={() => setChannel(null)}
                    className="h-8 rounded-lg px-2 text-[12px] text-slate-400 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-50 px-5 py-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Lead score</p>
            <div className="space-y-3">
              <ScoreBar label="Fit" value={lead.fit} threshold={65} />
              <ScoreBar label="Intent" value={lead.intent} threshold={60} />
              <ScoreBar label="Quality" value={lead.quality} threshold={60} />
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-slate-400">
              The line on each bar is the Grade A threshold. Quality below 20 forces F whatever the other two say.
            </p>
          </div>

          <div className="border-t border-slate-50 px-5 py-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Details</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
              {[
                { label: "Phone", value: lead.phone },
                { label: "Email", value: lead.email },
                { label: "Stage", value: lead.stage },
                { label: "Source", value: lead.source },
                { label: "Rep", value: lead.rep },
                { label: "Last signal", value: lead.signal },
              ].map((d) => (
                <div key={d.label} className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">{d.label}</p>
                  <p className="mt-0.5 break-words text-[12px] font-medium leading-snug text-slate-700">{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-50 px-5 py-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Timeline</p>
            <ol className="relative space-y-0 border-l border-slate-200 pl-4">
              {lead.timeline.map((t) => (
                <li key={t.id} className="relative py-2">
                  <span className="absolute -left-[19px] top-3.5 h-1.5 w-1.5 rounded-full bg-sky-400 ring-4 ring-white" />
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
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Shell ─────────────────────────────────────────────────────────────────────

export function AppReplica() {
  const [state, dispatch] = useReducer(demoReducer, INITIAL_STATE)
  const [view, setView] = useState<View>("queue")
  const [openId, setOpenId] = useState<string | null>(null)

  const openLead = useCallback((id: string) => setOpenId(id), [])
  const ctxValue = useMemo(() => ({ state, dispatch, openLead }), [state, openLead])

  // Toasts expire on their own, so the corner never fills up.
  const firstToast = state.toasts[0]?.id
  useEffect(() => {
    if (!firstToast) return
    const t = setTimeout(() => dispatch({ type: "DISMISS_TOAST", id: firstToast }), 2600)
    return () => clearTimeout(t)
  }, [firstToast])

  const unread = state.notifications.filter((n) => !n.read).length
  const missedCount = state.leads.filter((l) => l.staleDays >= 14).length

  function go(v: View) {
    setView(v)
    setOpenId(null)
  }

  return (
    <DemoCtx.Provider value={ctxValue}>
      <div
        className="overflow-hidden rounded-[20px] bg-white"
        style={{ border: "1px solid var(--paper-line-2)", boxShadow: "0 30px 60px -40px rgba(15,23,42,0.45)" }}
      >
        {/* Frame bar */}
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
          <span className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => { dispatch({ type: "RESET" }); go("queue") }}
              className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted transition-colors hover:text-sky-700"
              style={{ border: "1px solid var(--paper-line)" }}
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
            <span
              className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted"
              style={{ border: "1px solid var(--paper-line)" }}
            >
              Sample data
            </span>
          </span>
        </div>

        {/* App canvas */}
        {/* A fixed viewport, mirroring the app's own h-screen shell. Without it
            the frame grew and shrank as you moved between views, which shifts
            everything below it on the page. */}
        <div
          className="relative flex h-[560px] gap-3 overflow-hidden p-3 md:h-[660px]"
          style={{ background: "#F1F5F9" }}
        >
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
                      const badge = item.view === "missed" ? missedCount : item.view === "notifications" ? unread : 0
                      return (
                        <button
                          key={item.view}
                          type="button"
                          onClick={() => go(item.view)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] transition-all duration-150",
                            active
                              ? "bg-sky-50/80 font-semibold text-sky-700 before:absolute before:bottom-1.5 before:left-0 before:top-1.5 before:w-[3px] before:rounded-r-full before:bg-sky-500"
                              : "font-medium text-slate-600 hover:bg-sky-50/40 hover:text-sky-600"
                          )}
                        >
                          <Icon className={cn("h-[15px] w-[15px] shrink-0", active ? "text-sky-500" : "text-slate-400")} strokeWidth={active ? 2.5 : 2} />
                          {item.label}
                          {badge > 0 && (
                            <span
                              className="ml-auto inline-flex h-[18px] min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
                              style={{
                                background: item.view === "missed"
                                  ? "linear-gradient(180deg, #FDBA74 0%, #FB923C 100%)"
                                  : "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                              }}
                            >
                              {badge}
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
                  <p className="mt-0.5 truncate font-mono text-[10px] uppercase leading-tight tracking-[0.10em] text-slate-400">Manager</p>
                </div>
                <LogOut className="h-3.5 w-3.5 shrink-0 text-slate-400" strokeWidth={2} />
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {/* Mobile top bar, as in the product */}
            <div className="mb-3 flex h-12 items-center justify-between rounded-xl border border-slate-200/70 bg-white px-3 md:hidden">
              <Menu className="h-5 w-5 text-slate-700" strokeWidth={2.25} />
              <span className="flex items-center gap-2">
                <LeadkaunMark size={20} gloss />
                <span className="text-[14px] font-semibold tracking-[-0.025em] text-slate-900">{VIEW_TITLE[view]}</span>
              </span>
              <span className="relative">
                <Bell className="h-5 w-5 text-slate-700" strokeWidth={2.25} />
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-sky-500 text-[9px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </span>
            </div>

            {/* The sidebar is hidden on small screens, so views need another way across */}
            <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1 md:hidden">
              {NAV_GROUPS.flatMap((g) => g.items).map((item) => (
                <button
                  key={item.view}
                  type="button"
                  onClick={() => go(item.view)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
                    view === item.view ? "bg-sky-600 text-white" : "border border-slate-200 bg-white text-slate-600"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-1">
              {view === "queue" && <QueueView onImport={() => go("import")} />}
              {view === "leads" && <LeadsView onImport={() => go("import")} />}
              {view === "follow-ups" && <FollowUpsView />}
              {view === "pipeline" && <PipelineView />}
              {view === "import" && <ImportView onDone={() => go("queue")} />}
              {view === "dashboard" && <DashboardView />}
              {view === "activity" && <ActivityView />}
              {view === "analytics" && <AnalyticsView />}
              {view === "rep" && <RepTrackingView />}
              {view === "learning" && <LearningView />}
              {view === "missed" && <MissedView />}
              {view === "notifications" && <NotificationsView />}
            </div>
          </div>

          {openId && <LeadPanel leadId={openId} onClose={() => setOpenId(null)} />}

          <div className="pointer-events-none absolute bottom-4 right-4 z-40 flex flex-col gap-2">
            {state.toasts.map((t) => (
              <div key={t.id} className="rounded-xl bg-slate-900 px-3.5 py-2.5 text-[12.5px] font-medium text-white shadow-lg">
                {t.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoCtx.Provider>
  )
}
