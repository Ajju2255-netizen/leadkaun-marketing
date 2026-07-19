import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

type Lead = {
  name?: string
  email?: string
  topic?: string
  message?: string
  company?: string
  phone?: string
  source?: string
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/**
 * Read Worker env. On Cloudflare Workers, secrets/vars live on the Cloudflare
 * context env (like the R2 binding in lib/pseo/lookup.ts) and are NOT reliably
 * mirrored to process.env — so merge both, preferring the Worker context.
 */
async function readEnv(): Promise<Record<string, string | undefined>> {
  const base = { ...(process.env as Record<string, string | undefined>) }
  if (typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers") {
    try {
      const { getCloudflareContext } = await import("@opennextjs/cloudflare")
      const ctx = await getCloudflareContext({ async: true })
      if (ctx?.env) Object.assign(base, ctx.env as Record<string, string | undefined>)
    } catch {
      /* fall back to process.env */
    }
  }
  return base
}

/**
 * POST /api/lead — marketing lead capture (contact / demo forms).
 *
 * Provider-flexible so it works the moment ONE of these is set in the Worker env:
 *   • LEAD_WEBHOOK_URL — POSTs the lead JSON (Zapier / Make / n8n / your CRM /
 *     the app's API). Preferred.
 *   • RESEND_API_KEY + LEAD_NOTIFY_EMAIL — emails the lead (from LEAD_FROM_EMAIL,
 *     default leads@leadkaun.com).
 * With neither set it returns 503 "not_configured"; the form then points the
 * visitor at the mailto channels, so a lead is never lost silently.
 */
export async function POST(req: Request) {
  let lead: Lead
  try {
    lead = (await req.json()) as Lead
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 })
  }

  if (!lead.email || !EMAIL_RE.test(lead.email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 422 })
  }

  const payload = {
    name: lead.name?.slice(0, 200) ?? null,
    email: lead.email.slice(0, 200),
    company: lead.company?.slice(0, 200) ?? null,
    phone: lead.phone?.slice(0, 40) ?? null,
    topic: lead.topic?.slice(0, 80) ?? null,
    message: lead.message?.slice(0, 4000) ?? null,
    source: lead.source?.slice(0, 40) ?? "contact",
    receivedAt: new Date().toISOString(),
  }

  const env = await readEnv()

  // 1) Webhook (preferred).
  const webhook = env.LEAD_WEBHOOK_URL
  if (webhook) {
    try {
      const r = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (r.ok) return NextResponse.json({ ok: true })
      console.error("[lead] webhook non-2xx:", r.status)
    } catch (e) {
      console.error("[lead] webhook failed:", e)
    }
  }

  // 2) Resend email (fallback). Trim any stray whitespace/newline on secrets.
  const key = env.RESEND_API_KEY?.trim()
  const to = env.LEAD_NOTIFY_EMAIL?.trim()
  const from = (env.LEAD_FROM_EMAIL ?? "leads@leadkaun.com").trim()
  if (key && to) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: payload.email,
          subject: `New lead (${payload.source}) — ${payload.name ?? payload.email}`,
          text: Object.entries(payload)
            .map(([k, v]) => `${k}: ${v ?? "—"}`)
            .join("\n"),
        }),
      })
      if (r.ok) return NextResponse.json({ ok: true })
      const detail = await r.text().catch(() => "")
      console.error("[lead] resend non-2xx:", r.status, detail)
      return NextResponse.json({ ok: false, error: "delivery_failed", status: r.status, detail: detail.slice(0, 300) }, { status: 502 })
    } catch (e) {
      console.error("[lead] resend failed:", e)
      return NextResponse.json({ ok: false, error: "delivery_error", detail: String(e).slice(0, 200) }, { status: 502 })
    }
  }

  // 3) Not configured — never lose it silently. `seen` reveals which env vars the
  // Worker can actually see (booleans only, no secret values) for diagnosis.
  const seen = {
    webhook: !!env.LEAD_WEBHOOK_URL,
    key: !!env.RESEND_API_KEY,
    to: !!env.LEAD_NOTIFY_EMAIL,
    from: !!env.LEAD_FROM_EMAIL,
    runtime: typeof navigator !== "undefined" ? navigator.userAgent : "node",
  }
  console.warn("[lead] no LEAD_WEBHOOK_URL / RESEND config; lead not delivered:", payload)
  return NextResponse.json({ ok: false, error: "not_configured", seen }, { status: 503 })
}
