"use client"

import { useState } from "react"
import Link from "next/link"
import { ListOrdered, Gauge, AlertTriangle, Sunrise, Phone, ArrowRight, Check, Search } from "lucide-react"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { Reveal } from "@/app/components/reveal"
import { APP_URLS } from "@/lib/urls"

/**
 * Interactive "experience the platform" section — a self-serve replacement for a
 * demo call. Tabbed, realistic mock UIs of the flagship modules, rendered in the
 * real Leadkaun visual language (glass, A–F grade colours, sky/mint/peach). All
 * numbers are illustrative product framing, not customer data.
 */

const GRADE_BG: Record<string, string> = {
  A: "linear-gradient(180deg,#6EE7B7,#10B981)",
  B: "linear-gradient(180deg,#38BDF8,#0EA5E9)",
  C: "linear-gradient(180deg,#FDBA74,#FB923C)",
  D: "linear-gradient(180deg,#FCA5A5,#EF4444)",
}

const TABS = [
  { key: "queue",   label: "Priority Queue",  desc: "Who to call next, ranked",    icon: ListOrdered },
  { key: "scoring", label: "AI Lead Scoring",  desc: "Every lead graded A–F",       icon: Gauge },
  { key: "missed",  label: "₹ at Risk",        desc: "Revenue before it slips",     icon: AlertTriangle },
  { key: "brief",   label: "Morning Brief",    desc: "The day, ready at 9 AM",      icon: Sunrise },
] as const

type TabKey = (typeof TABS)[number]["key"]

const ROUTE: Record<TabKey, string> = {
  queue: "app.leadkaun.com/queue",
  scoring: "app.leadkaun.com/leads",
  missed: "app.leadkaun.com/missed",
  brief: "app.leadkaun.com/brief",
}

export function PlatformShowcase() {
  const [tab, setTab] = useState<TabKey>("queue")

  return (
    <SectionGround variant="sky" size="lg">
      <Container>
        <Reveal className="mb-10 md:mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1">
            <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-500" /></span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">See it in action</span>
          </div>
          <h2 className="mt-5 font-serif text-[32px] font-medium leading-[1.12] tracking-[-0.015em] text-ink md:text-[44px]">
            Experience the platform — not a demo call.
          </h2>
          <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
            Click through the modules your reps actually live in. Same grading, same Priority Queue, same
            ₹-at-risk — no sales call, no scheduling. Just Leadkaun, doing the thinking.
          </p>
        </Reveal>

        {/* app window frame */}
        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-[24px] glass-3 gloss-edge elevate-3">
            {/* window chrome */}
            <div className="flex items-center gap-3 border-b border-hairline px-4 py-3" style={{ background: "rgba(255,255,255,0.5)" }}>
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#FCA5A5" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#FDE68A" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#86EFAC" }} />
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-lg bg-white/70 px-3 py-1 gloss-edge">
                <Search className="h-3 w-3 text-ink-muted" strokeWidth={2} />
                <span className="font-mono text-[11px] text-ink-muted">{ROUTE[tab]}</span>
              </div>
              <span className="hidden font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600 sm:inline">● live</span>
            </div>

            <div className="grid md:grid-cols-[236px_1fr]">
              {/* tab rail */}
              <div className="flex gap-2 overflow-x-auto border-b border-hairline p-3 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
                {TABS.map((t) => {
                  const active = t.key === tab
                  const Icon = t.icon
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setTab(t.key)}
                      className={`group flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all md:w-full ${
                        active ? "bg-white/85 gloss-edge elevate-1" : "hover:bg-white/50"
                      }`}
                    >
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors"
                        style={active
                          ? { background: "linear-gradient(180deg,#38BDF8,#0EA5E9)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)" }
                          : { background: "rgba(255,255,255,0.7)" }}
                      >
                        <Icon className={`h-[18px] w-[18px] ${active ? "text-white" : "text-sky-600"}`} strokeWidth={2} />
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-[13.5px] font-semibold leading-tight ${active ? "text-ink" : "text-ink-soft"}`}>{t.label}</span>
                        <span className="hidden text-[11.5px] leading-tight text-ink-muted md:block">{t.desc}</span>
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* mock panel */}
              <div key={tab} className="lk-fade min-h-[420px] bg-white/40 p-5 md:p-7">
                {tab === "queue"   && <QueueMock />}
                {tab === "scoring" && <ScoringMock />}
                {tab === "missed"  && <MissedMock />}
                {tab === "brief"   && <BriefMock />}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center">
          <a
            href={APP_URLS.register}
            className="btn-gloss-primary shimmer-on-hover relative inline-flex h-12 items-center justify-center gap-1.5 rounded-xl px-7 text-[15px] font-medium tracking-tight"
          >
            <span className="relative z-[2] inline-flex items-center gap-1.5">
              Run it on your own leads <ArrowRight className="h-4 w-4" />
            </span>
          </a>
          <Link href="/product" className="text-[14px] font-semibold text-sky-600 hover:text-sky-500">
            Tour all 12 modules →
          </Link>
        </Reveal>
      </Container>

      <style>{`
        @keyframes lkFade { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        .lk-fade { animation: lkFade 320ms cubic-bezier(0.16,1,0.3,1) }
        @media (prefers-reduced-motion: reduce){ .lk-fade { animation:none } }
      `}</style>
    </SectionGround>
  )
}

/* ── mock helpers ─────────────────────────────────────────────────────────── */

function GradePill({ g, size = 32 }: { g: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-xl font-mono font-bold text-white"
      style={{ height: size, width: size, fontSize: size * 0.42, background: GRADE_BG[g] ?? GRADE_BG.C, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 3px 8px rgba(15,23,42,0.16)" }}
    >
      {g}
    </span>
  )
}

function PanelHead({ title, sub, right }: { title: string; sub: string; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{sub}</p>
        <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.02em] text-ink">{title}</h3>
      </div>
      {right}
    </div>
  )
}

/* ── Priority Queue ───────────────────────────────────────────────────────── */

const QUEUE = [
  { g: "A", name: "Priya Sharma", co: "Sunrise Realty",   val: "42L", now: true },
  { g: "A", name: "Rahul Mehta",  co: "Apex Capital",     val: "28L", ago: "4m" },
  { g: "B", name: "Anjali Rao",   co: "BrightEdu",        val: "9L",  ago: "1h" },
  { g: "B", name: "Karan Malhotra", co: "DesignCraft",    val: "6L",  ago: "2h" },
  { g: "C", name: "Imran Khan",   co: "Metro Logistics",  val: "3L",  ago: "3h" },
]

function QueueMock() {
  return (
    <div>
      <PanelHead
        title="Who to call next"
        sub="Priority Queue · Today"
        right={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 gloss-edge">
            <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" /></span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">8 hot</span>
          </span>
        }
      />
      <div className="mb-3 flex items-center justify-between rounded-xl px-4 py-2.5 glass-peach gloss-edge">
        <span className="text-[12.5px] font-medium text-ink-soft">₹ at risk today</span>
        <span className="font-mono text-[18px] font-semibold text-orange-500">₹4.2L</span>
      </div>
      <div className="space-y-2">
        {QUEUE.map((l) => (
          <div key={l.name} className="flex items-center gap-3 rounded-xl border border-white/70 bg-white/70 px-3.5 py-2.5 gloss-edge">
            <GradePill g={l.g} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold leading-tight text-ink">{l.name}</p>
              <p className="truncate font-mono text-[11px] text-ink-muted">{l.co} · ₹{l.val}</p>
            </div>
            {l.now ? (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white" style={{ background: "linear-gradient(180deg,#38BDF8,#0EA5E9)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), 0 3px 10px rgba(14,165,233,0.32)" }}>
                <Phone className="h-3 w-3" strokeWidth={2.4} /> Call now
              </span>
            ) : (
              <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-faint">{l.ago} ago</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── AI Lead Scoring ──────────────────────────────────────────────────────── */

function Meter({ label, value, tint }: { label: string; value: number; tint: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[12px] font-medium text-ink-soft">{label}</span>
        <span className="font-mono text-[12px] font-semibold text-ink">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: tint }} />
      </div>
    </div>
  )
}

function ScoringMock() {
  return (
    <div>
      <PanelHead title="How Leadkaun graded this lead" sub="AI Lead Scoring · Live" />
      <div className="rounded-2xl border border-white/70 bg-white/70 p-5 gloss-edge">
        <div className="flex items-center gap-4">
          <GradePill g="A" size={52} />
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold text-ink">Priya Sharma</p>
            <p className="font-mono text-[12px] text-ink-muted">Sunrise Realty · Enquiry ₹42L</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">Call within the hour</span>
        </div>

        <div className="mt-5 grid gap-3.5 sm:grid-cols-3">
          <Meter label="Fit" value={82} tint="linear-gradient(90deg,#7DD3FC,#0EA5E9)" />
          <Meter label="Intent" value={91} tint="linear-gradient(90deg,#6EE7B7,#10B981)" />
          <Meter label="Quality" value={78} tint="linear-gradient(90deg,#FDBA74,#FB923C)" />
        </div>

        <div className="mt-5 border-t border-hairline pt-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Signals that moved the score</p>
          <ul className="mt-3 space-y-2">
            {[
              { t: "Replied on WhatsApp", v: "+40" },
              { t: "Visited the pricing page", v: "+30" },
              { t: "Enquiry less than 1 hour old", v: "+30" },
            ].map((s) => (
              <li key={s.t} className="flex items-center gap-2.5 text-[13px] text-ink-soft">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100"><Check className="h-3 w-3 text-emerald-600" strokeWidth={3} /></span>
                <span className="flex-1">{s.t}</span>
                <span className="font-mono text-[12px] font-semibold text-emerald-600">{s.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ── ₹ at Risk ────────────────────────────────────────────────────────────── */

const MISSED = [
  { g: "A", name: "Neha Kapoor",  note: "No follow-up · 3 days", val: "₹1.9L" },
  { g: "B", name: "Vikram Singh", note: "Callback missed · 2 days", val: "₹1.4L" },
  { g: "B", name: "Sana Sheikh",  note: "Went quiet · 4 days", val: "₹2.1L" },
  { g: "C", name: "Arjun Nair",   note: "No touch · 5 days", val: "₹1.4L" },
]

function MissedMock() {
  return (
    <div>
      <PanelHead
        title="Deals quietly going cold"
        sub="Missed Opportunity Engine"
        right={
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">Total at risk</p>
            <p className="font-mono text-[18px] font-semibold text-orange-500">₹6.8L</p>
          </div>
        }
      />
      <div className="space-y-2">
        {MISSED.map((l) => (
          <div key={l.name} className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/40 px-3.5 py-2.5">
            <GradePill g={l.g} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold leading-tight text-ink">{l.name}</p>
              <p className="truncate flex items-center gap-1 font-mono text-[11px] text-orange-600"><AlertTriangle className="h-3 w-3" strokeWidth={2.2} /> {l.note}</p>
            </div>
            <span className="font-mono text-[13px] font-semibold text-ink">{l.val}</span>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-orange-200 bg-white/70 px-3 py-1.5 text-[11px] font-semibold text-orange-700">
              Follow up <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Morning Brief ────────────────────────────────────────────────────────── */

function BriefMock() {
  return (
    <div>
      <PanelHead title="Namaste, Priya — here's your day" sub="Morning Brief · 9:00 AM" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/70 bg-white/70 p-4 gloss-edge">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-600">Call first · 3</p>
          <ul className="mt-3 space-y-2">
            {[["A", "Priya Sharma", "₹42L"], ["A", "Rahul Mehta", "₹28L"], ["B", "Anjali Rao", "₹9L"]].map(([g, n, v]) => (
              <li key={n} className="flex items-center gap-2.5">
                <GradePill g={g} size={26} />
                <span className="flex-1 truncate text-[13px] font-medium text-ink">{n}</span>
                <span className="font-mono text-[12px] text-ink-muted">{v}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-white/70 bg-white/70 p-4 gloss-edge">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-500">Callbacks due · 2</p>
            <p className="mt-2 text-[13px] leading-snug text-ink-soft">Karan Malhotra promised 11 AM · Sana Sheikh promised 2 PM.</p>
          </div>
          <div className="flex items-center justify-between rounded-2xl p-4 glass-peach gloss-edge">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Recoverable today</p>
              <p className="mt-1 font-mono text-[22px] font-semibold text-emerald-600">₹3.4L</p>
            </div>
            <Sunrise className="h-8 w-8 text-orange-400" strokeWidth={1.6} />
          </div>
        </div>
      </div>
    </div>
  )
}
