"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { FloatingCard } from "@/app/components/floating-card"
import { GlossButton } from "@/app/components/gloss-button"
import { APP_URLS } from "@/lib/urls"

const inputCls =
  "h-11 w-full rounded-xl glass-1 gloss-edge px-4 text-[14px] text-ink placeholder:text-ink-faint " +
  "transition-all focus:outline-none focus:[background:rgba(255,255,255,0.85)] focus:border-sky-400 " +
  "border border-white/70"

const labelCls =
  "mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted"

type Status = "idle" | "sending" | "sent" | "error"

export function DemoForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [err, setErr] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get("email") ?? "").trim()
    if (!email) {
      setErr("Please add your work email so we can confirm the slot.")
      setStatus("error")
      return
    }
    const teamSize = String(fd.get("team_size") ?? "")
    const time = String(fd.get("preferred_time") ?? "")
    const lead = {
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email,
      phone: String(fd.get("phone") ?? ""),
      topic: "demo",
      message: `Demo request — team size: ${teamSize || "—"}, preferred time (IST): ${time || "—"}.`,
      source: "demo",
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
      setStatus("error")
      setErr("We couldn't book that just now — please email sales@leadkaun.com and we'll set it up.")
    } catch {
      setStatus("error")
      setErr("We couldn't book that just now — please email sales@leadkaun.com and we'll set it up.")
    }
  }

  if (status === "sent") {
    return (
      <FloatingCard tier="3" depth="3" gloss className="mt-8 flex items-start gap-4 p-6 md:p-8">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" strokeWidth={2} />
        <div>
          <p className="text-[16px] font-semibold text-ink">Request received — thank you.</p>
          <p className="mt-1.5 text-[14px] leading-[1.6] text-ink-soft">
            We'll confirm your slot on WhatsApp or email within 2 business hours (Mon–Sat, 9 AM–7 PM IST). Want to explore in the meantime?{" "}
            <Link href={APP_URLS.register} className="font-semibold text-sky-600 underline-offset-4 hover:underline">
              Start free →
            </Link>
          </p>
        </div>
      </FloatingCard>
    )
  }

  return (
    <FloatingCard tier="3" depth="3" gloss className="mt-8 p-6 md:p-8" as="form" onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Your name</label>
          <input type="text" name="name" placeholder="Rajan Mehta" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Company</label>
          <input type="text" name="company" placeholder="Growfast Realty" className={inputCls} />
        </div>
      </div>

      <div className="mt-5">
        <label className={labelCls}>Work email</label>
        <input type="email" name="email" required placeholder="rajan@growfast.in" className={inputCls} />
      </div>

      <div className="mt-5">
        <label className={labelCls}>Phone / WhatsApp</label>
        <input type="tel" name="phone" placeholder="+91 98765 43210" className={inputCls} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Team size</label>
          <select name="team_size" defaultValue="" className={inputCls + " text-ink-soft"}>
            <option value="" disabled>Select…</option>
            <option value="1-3">1–3 reps</option>
            <option value="4-10">4–10 reps</option>
            <option value="11-25">11–25 reps</option>
            <option value="26+">26+ reps</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Preferred time (IST)</label>
          <select name="preferred_time" defaultValue="" className={inputCls + " text-ink-soft"}>
            <option value="" disabled>Select…</option>
            <option value="morning">Morning (9 AM – 12 PM)</option>
            <option value="afternoon">Afternoon (12 – 4 PM)</option>
            <option value="evening">Evening (4 – 7 PM)</option>
          </select>
        </div>
      </div>

      {status === "error" && <p className="mt-4 text-[13px] leading-[1.5] text-red-600">{err}</p>}

      <GlossButton variant="primary" size="md" type="submit" disabled={status === "sending"} className="mt-6 w-full">
        {status === "sending" ? "Booking…" : "Book my demo"}
        {status !== "sending" && <span className="font-mono opacity-80">→</span>}
      </GlossButton>

      <p className="mt-4 text-center text-[12px] text-ink-muted">
        We confirm on WhatsApp or email within 2 hours.
      </p>
    </FloatingCard>
  )
}
