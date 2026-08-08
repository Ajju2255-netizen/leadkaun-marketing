"use client"

import { useState } from "react"
import { CheckCircle2, ArrowRight } from "lucide-react"

type Status = "idle" | "sending" | "sent" | "error"

type Props = {
  /** Tag so the team knows where the lead came from (e.g. "newsletter", "research-report"). */
  source?: string
  /** Short heading above the field. */
  heading?: string
  /** One line of context under the heading. */
  blurb?: string
  /** Button label. */
  cta?: string
  /** Confirmation line after a successful submit — keep it truthful about what happens next. */
  doneNote?: string
  className?: string
  /** "stack" (default) = heading/blurb over the field; "split" = text left, form right. */
  layout?: "stack" | "split"
}

const inputCls =
  "h-11 flex-1 min-w-0 rounded-xl glass-1 gloss-edge px-4 text-[14px] text-ink placeholder:text-ink-faint " +
  "border border-white/70 transition-all focus:outline-none focus:border-sky-400 focus:[background:rgba(255,255,255,0.85)]"

export function EmailCapture({
  source = "newsletter",
  heading = "Get new sales research & product updates",
  blurb = "Occasional, genuinely useful. No spam, unsubscribe anytime.",
  cta = "Keep me posted",
  doneNote = "You're on the list. We'll be in touch, nothing spammy.",
  className = "",
  layout = "stack",
}: Props) {
  const [status, setStatus] = useState<Status>("idle")
  const [err, setErr] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get("email") ?? "").trim()
    if (!email) {
      setErr("Please enter your email.")
      setStatus("error")
      return
    }
    setStatus("sending")
    setErr("")
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      })
      if (res.ok) {
        setStatus("sent")
        return
      }
      setStatus("error")
      setErr("Couldn't sign you up just now, please try again in a moment.")
    } catch {
      setStatus("error")
      setErr("Couldn't sign you up just now, please try again in a moment.")
    }
  }

  if (status === "sent") {
    return (
      <div className={`flex items-start gap-2.5 text-[14px] text-ink-soft ${className}`}>
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" strokeWidth={2} />
        <span>{doneNote}</span>
      </div>
    )
  }

  const isSplit = layout === "split"
  return (
    <div className={className}>
      <div className={isSplit ? "flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between" : ""}>
        {(heading || blurb) && (
          <div className={isSplit ? "lg:max-w-sm" : ""}>
            {heading && <p className="text-[15px] font-semibold text-ink">{heading}</p>}
            {blurb && <p className="mt-1 text-[13px] leading-[1.5] text-ink-muted">{blurb}</p>}
          </div>
        )}
        <form onSubmit={onSubmit} className={`flex flex-col gap-2.5 sm:flex-row ${isSplit ? "w-full sm:w-auto" : "mt-3"}`}>
          <input
            type="email"
            name="email"
            required
            placeholder="you@company.com"
            aria-label="Email address"
            className={`${inputCls} ${isSplit ? "sm:flex-none sm:w-[260px]" : ""}`}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-gloss-primary shimmer-on-hover relative inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl px-5 text-[14px] font-medium tracking-tight disabled:opacity-60"
          >
            <span className="relative z-[2] inline-flex items-center gap-1.5">
              {status === "sending" ? "Signing up…" : cta}
              {status !== "sending" && <ArrowRight className="h-4 w-4" />}
            </span>
          </button>
        </form>
      </div>
      {status === "error" && <p className="mt-2 text-[13px] text-red-600">{err}</p>}
    </div>
  )
}
