"use client"

import { useState } from "react"
import { Download, CheckCircle2, ArrowRight } from "lucide-react"

import { GlossLink } from "@/app/components/gloss-button"

const inputCls =
  "h-11 flex-1 min-w-0 rounded-xl glass-1 gloss-edge px-4 text-[14px] text-ink placeholder:text-ink-faint " +
  "border border-white/70 transition-all focus:outline-none focus:border-sky-400 focus:[background:rgba(255,255,255,0.85)]"

type Status = "idle" | "sending" | "unlocked" | "error"

/**
 * Email-gated download. Captures the lead via /api/lead, then reveals the file.
 * If capture fails (e.g. not configured), it still lets the visitor download —
 * a lead magnet should never withhold the asset because of a backend hiccup.
 */
export function GatedDownload({
  downloadUrl, type = "template", source,
}: { downloadUrl: string; type?: string; source: string }) {
  const [status, setStatus] = useState<Status>("idle")
  const [err, setErr] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get("email") ?? "").trim()
    if (!email) { setErr("Please enter your work email."); setStatus("error"); return }
    setStatus("sending")
    setErr("")
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, topic: "resource-download", source: `resource-${source}` }),
      })
    } catch {
      /* deliver the asset regardless */
    }
    setStatus("unlocked")
  }

  if (status === "unlocked") {
    return (
      <div className="flex flex-col gap-3">
        <p className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" strokeWidth={2} /> Unlocked here's your {type}.
        </p>
        <GlossLink variant="primary" size="md" href={downloadUrl} target="_blank" rel="noreferrer" download>
          <Download className="h-4 w-4" /> Download the {type}
        </GlossLink>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md">
      <p className="text-[13px] text-ink-muted mb-2.5">Enter your email and we'll unlock the {type} instantly. No spam.</p>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input type="email" name="email" required placeholder="you@company.com" aria-label="Work email" className={inputCls} />
        <button
          type="submit" disabled={status === "sending"}
          className="btn-gloss-primary shimmer-on-hover relative inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl px-5 text-[14px] font-medium tracking-tight disabled:opacity-60"
        >
          <span className="relative z-[2] inline-flex items-center gap-1.5">
            {status === "sending" ? "Unlocking…" : <>Get the {type} <ArrowRight className="h-4 w-4" /></>}
          </span>
        </button>
      </div>
      {status === "error" && <p className="mt-2 text-[13px] text-red-600">{err}</p>}
    </form>
  )
}
