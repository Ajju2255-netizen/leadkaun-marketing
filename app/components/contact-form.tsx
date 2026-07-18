"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { FloatingCard } from "@/app/components/floating-card"
import { GlossButton } from "@/app/components/gloss-button"

const inputCls =
  "h-11 w-full rounded-xl glass-1 gloss-edge px-4 text-[14px] text-ink placeholder:text-ink-faint " +
  "transition-all focus:outline-none focus:[background:rgba(255,255,255,0.85)] focus:border-sky-400 " +
  "border border-white/70"

const labelCls =
  "mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted"

type Status = "idle" | "sending" | "sent" | "error"

export function ContactForm({ source = "contact" }: { source?: string }) {
  const [status, setStatus] = useState<Status>("idle")
  const [err, setErr] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const lead = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      topic: String(fd.get("topic") ?? ""),
      message: String(fd.get("message") ?? ""),
      source,
    }
    if (!lead.email) {
      setErr("Please enter your work email.")
      setStatus("error")
      return
    }
    setStatus("sending")
    setErr("")
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      })
      if (res.ok) {
        setStatus("sent")
        return
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      setStatus("error")
      setErr(
        body?.error && body.error !== "not_configured"
          ? body.error
          : "We couldn't send that just now — please email sales@leadkaun.com and we'll jump on it.",
      )
    } catch {
      setStatus("error")
      setErr("We couldn't send that just now — please email sales@leadkaun.com and we'll jump on it.")
    }
  }

  if (status === "sent") {
    return (
      <FloatingCard tier="3" depth="3" gloss className="mt-8 flex items-start gap-4 p-6 md:p-8">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" strokeWidth={2} />
        <div>
          <p className="text-[16px] font-semibold text-ink">Got it — thank you.</p>
          <p className="mt-1.5 text-[14px] leading-[1.6] text-ink-soft">
            We read every message and reply within 4 business hours (Mon–Sat, 9 AM–7 PM IST). Prefer to move faster?{" "}
            <Link href="/demo" className="font-semibold text-sky-600 underline-offset-4 hover:underline">
              Book a 15-min call →
            </Link>
          </p>
        </div>
      </FloatingCard>
    )
  }

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Name</label>
            <input type="text" name="name" placeholder="Sunita Patel" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Work email</label>
            <input type="email" name="email" required placeholder="sunita@edureach.in" className={inputCls} />
          </div>
        </div>

        <div className="mt-5">
          <label className={labelCls}>Topic</label>
          <select name="topic" className={inputCls + " text-ink-soft"} defaultValue="">
            <option value="" disabled>
              Select a topic…
            </option>
            <option value="sales">Sales / Pricing</option>
            <option value="support">Product Support</option>
            <option value="partnership">Partnership / Reseller</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mt-5">
          <label className={labelCls}>Message</label>
          <textarea
            name="message"
            rows={5}
            placeholder="Tell us what you need. Include team size, current tool, and what you're trying to fix."
            className="w-full resize-none rounded-xl glass-1 gloss-edge px-4 py-3 text-[14px] leading-[1.6] text-ink placeholder:text-ink-faint border border-white/70 transition-all focus:outline-none focus:border-sky-400 focus:[background:rgba(255,255,255,0.85)]"
          />
        </div>

        {status === "error" && <p className="mt-4 text-[13px] leading-[1.5] text-red-600">{err}</p>}

        <GlossButton variant="primary" size="md" type="submit" disabled={status === "sending"} className="mt-6 w-full">
          {status === "sending" ? "Sending…" : "Send message"}
          {status !== "sending" && <span className="font-mono opacity-80">→</span>}
        </GlossButton>

        <p className="mt-4 text-center text-[12px] text-ink-muted">
          Prefer a demo?{" "}
          <Link href="/demo" className="text-sky-600 underline-offset-4 hover:underline">
            Book a 15-min call →
          </Link>
        </p>
      </FloatingCard>
    </form>
  )
}
