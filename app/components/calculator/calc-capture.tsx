"use client"

import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { APP_URLS } from "@/lib/urls"

/**
 * Post-result capture for the calculators.
 *
 * The calculators are the strongest lead magnets on the site — someone who has
 * moved the sliders has just told us their team size, lead volume and deal
 * value, and has seen a rupee figure they do not like. Until now that moment
 * captured nothing at all: no email, no event, no follow-up. The visitor read
 * the number and left.
 *
 * Deliberately NOT gated. Hiding the result behind an email wall is the
 * conventional move and it would cost more than it earns here: the number IS
 * the argument, and a visitor who never sees it has no reason to sign up. The
 * result stays free; this sits underneath it and asks for the obvious next
 * step once the number has done the persuading.
 *
 * Same handoff contract as HeroSignupCard: capture the email as a lead, then
 * send them to the app's register page pre-filled. `/api/lead` failing must
 * never block that redirect — a lead we did not record is recoverable, a
 * signup we blocked is not.
 */
export function CalcCapture({
  source,
  headline = "See this on your own leads",
  sub = "Leadkaun grades your real leads A–F the same day and prices what is going cold. Free forever on 1 user and 100 active leads.",
}: {
  /** Attribution tag, e.g. "calc-missed-revenue". Lands on the lead record. */
  source: string
  headline?: string
  sub?: string
}) {
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const clean = email.trim()
    if (!clean) return
    setBusy(true)

    try {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean, source }),
        keepalive: true,
      }).catch(() => {})
    } catch {
      /* never block the redirect */
    }

    window.location.href = `${APP_URLS.register}?${new URLSearchParams({ email: clean })}`
  }

  return (
    <div
      className="mt-10 rounded-2xl p-6 md:p-8"
      style={{ background: "var(--paper)", border: "1px solid var(--paper-line-2)" }}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-center lg:gap-12">
        <div>
          <h3 className="text-[21px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[24px]">
            {headline}
          </h3>
          <p className="mt-2.5 max-w-[52ch] text-[14.5px] leading-[1.6] text-ink-soft">{sub}</p>
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
        </div>

        <form onSubmit={submit} className="flex flex-col gap-2.5 sm:flex-row lg:flex-col">
          <label className="sr-only" htmlFor={`calc-email-${source}`}>Work email</label>
          <input
            id={`calc-email-${source}`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work email"
            autoComplete="email"
            className="h-11 w-full rounded-xl border border-white/70 bg-white/80 px-3.5 text-[14px] text-ink placeholder:text-ink-faint transition-all focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
          />
          <button
            type="submit"
            disabled={busy}
            className="btn-gloss-primary inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-[14px] font-semibold disabled:opacity-60"
            style={{ color: "#FFFFFF" }}
          >
            {busy ? "Creating…" : "Create free account"}
            {!busy && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}
