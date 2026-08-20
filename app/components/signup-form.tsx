"use client"

import { useEffect, useState } from "react"
import { ArrowRight, User, Mail, Building2, Phone, Lock, Eye, EyeOff } from "lucide-react"
import { APP_URLS } from "@/lib/urls"

/**
 * The signup form. One definition, used everywhere this site asks someone to
 * create an account.
 *
 * It exists as a shared component because the alternative kept going wrong.
 * Every place that collected a detail used to hand off to the app's /register
 * page, which then asked for the same details over again, and each of those
 * places drifted separately: the hero asked three questions, the calculator
 * asked one, and /register asked six. Now there is one set of questions and
 * every form that asks them completes a signup.
 *
 * It is a plain HTML form posting to app.leadkaun.com, deliberately. The submit
 * is a top level navigation, so the app's response is first party for its own
 * host and its session cookie is accepted everywhere, Safari included. The
 * password goes from the browser straight to the app: this site's JavaScript
 * never holds it and its server never sees it. Nothing in the submit path needs
 * hydration, so the form still works if this component fails to load.
 */
export function SignupForm({
  source,
  submitLabel = "Create free account",
  className = "",
}: {
  /** Lead attribution, e.g. "hero-signup-form" or "calc-missed-revenue". */
  source: string
  submitLabel?: string
  className?: string
}) {
  const [busy, setBusy] = useState(false)
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")

  // The app redirects a refused submission back here with the reason.
  // Deferred to a microtask rather than set synchronously: the page is static,
  // so setting it during the effect would both trip the cascading render lint
  // and make the first client render disagree with the server's HTML.
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const message = new URLSearchParams(window.location.search).get("signup_error")
        if (message) setError(message)
      } catch {
        /* a malformed query string just means no error to show */
      }
    })
  }, [])

  function onSubmit() {
    // Capture the email as a lead on the way past. keepalive matters: the form
    // navigation begins immediately and would otherwise cancel this in flight.
    // Never blocks or cancels the submit, whatever happens.
    try {
      if (email.trim()) {
        fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), source }),
          keepalive: true,
        }).catch(() => {})
      }
    } catch {
      /* never block the submit */
    }
    setBusy(true)
  }

  // 16px below sm: iOS Safari zooms the viewport on focus under that size.
  const field =
    "h-12 w-full rounded-xl border border-white/70 bg-white/70 glass-1 gloss-edge pl-10 pr-3.5 text-[16px] sm:text-[14px] " +
    "text-ink placeholder:text-ink-faint transition-all focus:border-sky-400 focus:[background:rgba(255,255,255,0.95)] " +
    "focus:outline-none focus:ring-4 focus:ring-sky-100"
  const iconCls = "pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-ink-muted"

  return (
    <form method="POST" action={APP_URLS.signup} onSubmit={onSubmit} className={`space-y-3 ${className}`}>
      <div className="relative">
        <Building2 className={iconCls} strokeWidth={2} />
        <input name="orgName" required className={field} placeholder="Organisation name" autoComplete="organization" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <User className={iconCls} strokeWidth={2} />
          <input name="firstName" required className={field} placeholder="First name" autoComplete="given-name" />
        </div>
        <div className="relative">
          <input
            name="lastName" required autoComplete="family-name" placeholder="Last name"
            className={field.replace("pl-10", "pl-3.5")}
          />
        </div>
      </div>

      <div className="relative">
        <Mail className={iconCls} strokeWidth={2} />
        <input
          name="email" type="email" required className={field} placeholder="Work email"
          autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false}
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex h-12 shrink-0 items-center rounded-xl border border-white/70 bg-white/70 glass-1 gloss-edge px-3 text-[15px] text-ink-soft sm:text-[14px]">
          +91
        </span>
        <div className="relative flex-1">
          <Phone className={iconCls} strokeWidth={2} />
          <input
            name="phone" required className={field} placeholder="98765 43210"
            type="tel" inputMode="numeric" autoComplete="tel-national"
            pattern="[0-9]{10}" maxLength={10}
          />
        </div>
      </div>

      <div className="relative">
        <Lock className={iconCls} strokeWidth={2} />
        <input
          name="password" required minLength={8}
          type={show ? "text" : "password"}
          autoComplete="new-password" placeholder="Password, at least 8 characters"
          className={`${field} pr-11`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
          className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-ink-muted transition-colors hover:text-ink-soft"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="btn-gloss-primary shimmer-on-hover relative inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-xl text-[15px] font-medium tracking-tight disabled:opacity-60"
      >
        <span className="relative z-[2] inline-flex items-center gap-1.5">
          {busy ? "Creating…" : submitLabel}
          {!busy && <ArrowRight className="h-4 w-4" />}
        </span>
      </button>
    </form>
  )
}
