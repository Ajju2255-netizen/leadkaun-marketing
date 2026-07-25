"use client"

import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"
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

    // Capture the email up front (non-blocking) so a half-finished signup is
    // still a lead we can follow up on.
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

  const input =
    "h-11 w-full rounded-xl border border-hairline-strong bg-white px-3.5 text-[14px] text-ink " +
    "placeholder:text-ink-faint transition-all focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"

  return (
    <div
      className="relative mx-auto w-full max-w-md rounded-[24px] border border-white/70 bg-white/85 gloss-edge p-6 backdrop-blur md:p-7"
      style={{ boxShadow: "0 24px 60px rgba(2,132,199,0.20), 0 2px 8px rgba(15,23,42,0.06)" }}
    >
      <h2 className="text-[21px] font-bold tracking-[-0.02em] text-ink">Create your free account</h2>
      <p className="mt-1.5 text-[13.5px] leading-[1.5] text-ink-soft">
        Grade your leads A–F in 60 minutes. Free tier, no credit card.
      </p>

      <form onSubmit={submit} className="mt-5 space-y-3">
        <input className={input} placeholder="Full name" value={form.name} onChange={set("name")} autoComplete="name" />
        <input className={input} type="email" required placeholder="Work email" value={form.email} onChange={set("email")} autoComplete="email" />
        <input className={input} placeholder="Company name" value={form.company} onChange={set("company")} autoComplete="organization" />
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
        {["Free tier", "No credit card", "Setup in 60 min"].map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5 text-[12px] text-ink-muted">
            <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.5} /> {t}
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
  )
}
