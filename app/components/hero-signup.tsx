"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Check, User, Mail, Building2, Sparkles, Phone, Lock, Eye, EyeOff } from "lucide-react"
import { APP_URLS } from "@/lib/urls"

/**
 * The hero signup card. A complete signup, not the first half of one.
 *
 * It used to collect a name, an email and a company, then send the visitor to
 * the app's /register page to fill a second form. Two forms on the highest
 * intent page in the funnel, and the second one opened by asking again for the
 * three things just typed. This card now asks for everything an account needs
 * and the visitor lands inside the product already signed in.
 *
 * It is a plain HTML form posting to app.leadkaun.com, and that is deliberate.
 * The submission is a top level navigation, so the app's response is first
 * party for its own host and its session cookie is accepted everywhere,
 * Safari included. It also means the password goes straight from the browser
 * to the app: this site's JavaScript never holds it and its server never sees
 * it. And because nothing here depends on fetch, the form still works if this
 * component fails to hydrate.
 *
 * The fields are deliberately identical to /register. Two ways in, one set of
 * questions, no second form either way.
 */
export function HeroSignupCard() {
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
          body: JSON.stringify({ email: email.trim(), source: "hero-signup-form" }),
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
    <div id="signup" className="relative mx-auto w-full max-w-md scroll-mt-24">
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
          Grade your leads A to F the same day. No credit card.
        </p>

        <form method="POST" action={APP_URLS.signup} onSubmit={onSubmit} className="mt-5 space-y-3">
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
              {busy ? "Creating…" : "Create free account"}
              {!busy && <ArrowRight className="h-4 w-4" />}
            </span>
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {["Free forever", "No credit card", "Setup the same day"].map((t) => (
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
