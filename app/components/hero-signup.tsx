"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { APP_URLS } from "@/lib/urls"

/**
 * Product-led hero signup — email-first. The visitor enters their work email
 * and starts free right here; we capture the email (so abandoned starts are
 * still a lead) and hand off to the app's register page with the email
 * pre-filled, so signup finishes in one more step. Existing users sign in.
 *
 * Auth itself lives in the product app (app.leadkaun.com) — the marketing site
 * never handles passwords.
 */
export function HeroSignup() {
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)

  function startFree(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = email.trim()
    if (!value) return
    setBusy(true)

    // Capture the email up front (non-blocking) so a half-finished signup is
    // still a lead we can follow up on.
    try {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source: "hero-signup" }),
        keepalive: true,
      }).catch(() => {})
    } catch {
      /* ignore — never block the redirect */
    }

    window.location.href = `${APP_URLS.register}?email=${encodeURIComponent(value)}`
  }

  return (
    <div className="mt-9 max-w-md">
      <form onSubmit={startFree} className="flex flex-col gap-2.5 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your work email"
          aria-label="Work email"
          autoComplete="email"
          className="h-12 min-w-0 flex-1 rounded-xl border border-white/80 bg-white/85 gloss-edge px-4 text-[15px] text-ink placeholder:text-ink-faint transition-all focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100"
        />
        <button
          type="submit"
          disabled={busy}
          className="btn-gloss-primary shimmer-on-hover relative inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-xl px-6 text-[15px] font-medium tracking-tight disabled:opacity-60"
        >
          <span className="relative z-[2] inline-flex items-center gap-1.5">
            {busy ? "Starting…" : "Start free"}
            {!busy && <ArrowRight className="h-4 w-4" />}
          </span>
        </button>
      </form>

      <p className="mt-3.5 text-[13.5px]">
        <span className="text-ink-muted">Already using Leadkaun?</span>{" "}
        <a href={APP_URLS.login} className="font-semibold text-sky-600 underline-offset-4 hover:underline">
          Sign in →
        </a>
      </p>
    </div>
  )
}
