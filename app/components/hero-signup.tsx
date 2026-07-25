"use client"

import { useState } from "react"
import { ArrowRight, Check, User, Mail, Building2, Sparkles } from "lucide-react"
import { APP_URLS } from "@/lib/urls"

/**
 * Product-led hero signup CARD (the ads landing form). The visitor fills their
 * details and starts creating a free account right here; we capture the email as
 * a lead, then hand off to the app's register page with everything pre-filled so
 * the only remaining step is setting a password (the app owns auth — the
 * marketing site never handles passwords, and the session cookie is set
 * first-party on app.leadkaun.com so it works in every browser).
 */
export function HeroSignupCard() {
  const [form, setForm] = useState({ name: "", email: "", company: "" })
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }))

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = form.email.trim()
    if (!email) return
    setBusy(true)

    try {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "hero-signup-form" }),
        keepalive: true,
      }).catch(() => {})
    } catch {
      /* never block the redirect */
    }

    const parts = form.name.trim().split(/\s+/).filter(Boolean)
    const q = new URLSearchParams({ email })
    if (parts[0]) q.set("firstName", parts[0])
    if (parts.length > 1) q.set("lastName", parts.slice(1).join(" "))
    if (form.company.trim()) q.set("org", form.company.trim())

    window.location.href = `${APP_URLS.register}?${q.toString()}`
  }

  const field =
    "h-11 w-full rounded-xl border border-white/70 bg-white/70 glass-1 gloss-edge pl-10 pr-3.5 text-[14px] " +
    "text-ink placeholder:text-ink-faint transition-all focus:border-sky-400 focus:[background:rgba(255,255,255,0.95)] " +
    "focus:outline-none focus:ring-4 focus:ring-sky-100"
  const iconCls = "pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-ink-muted"

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* soft glow behind the card */}
      <div
        className="pointer-events-none absolute -inset-8 -z-10"
        style={{ background: "radial-gradient(55% 45% at 50% 8%, rgba(56,189,248,0.25), transparent 70%)" }}
      />

      {/* floating accent chip for depth */}
      <div className="pointer-events-none absolute -right-3 -top-3 z-20 hidden -rotate-3 sm:block">
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 glass-peach gloss-edge elevate-2">
          <Sparkles className="h-3.5 w-3.5 text-orange-500" strokeWidth={2.2} />
          <span className="font-mono text-[11px] font-semibold text-orange-500">Free · no card</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] glass-3 gloss-edge elevate-3 p-6 md:p-7">
        {/* top gradient hairline */}
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, #38BDF8 0%, #06B6D4 50%, #FB923C 100%)" }}
        />

        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">Start free</span>
        </div>

        <h2 className="mt-3.5 text-[22px] font-bold tracking-[-0.025em] text-ink">Create your free account</h2>
        <p className="mt-1.5 text-[13.5px] leading-[1.5] text-ink-soft">
          Grade your leads A–F the same day. No credit card.
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <div className="relative">
            <User className={iconCls} strokeWidth={2} />
            <input className={field} placeholder="Full name" value={form.name} onChange={set("name")} autoComplete="name" />
          </div>
          <div className="relative">
            <Mail className={iconCls} strokeWidth={2} />
            <input className={field} type="email" required placeholder="Work email" value={form.email} onChange={set("email")} autoComplete="email" />
          </div>
          <div className="relative">
            <Building2 className={iconCls} strokeWidth={2} />
            <input className={field} placeholder="Company name" value={form.company} onChange={set("company")} autoComplete="organization" />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="btn-gloss-primary shimmer-on-hover relative inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-xl text-[15px] font-medium tracking-tight disabled:opacity-60"
          >
            <span className="relative z-[2] inline-flex items-center gap-1.5">
              {busy ? "Creating…" : "Create free account"}
              {!busy && <ArrowRight className="h-4 w-4" />}
            </span>
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {["Free tier", "No credit card", "Setup the same day"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 text-[12px] text-ink-muted">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-100">
                <Check className="h-2.5 w-2.5 text-emerald-600" strokeWidth={3} />
              </span>
              {t}
            </span>
          ))}
        </div>

        <p className="mt-4 border-t border-hairline pt-4 text-center text-[13px] text-ink-soft">
          Already have an account?{" "}
          <a href={APP_URLS.login} className="font-semibold text-sky-600 underline-offset-4 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
