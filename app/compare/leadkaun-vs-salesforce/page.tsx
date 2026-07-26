import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs Salesforce (2026) — Right-sized for Indian SMBs",
  description:
    "Salesforce is enterprise-grade; Leadkaun is SMB-grade. Honest side-by-side: feature matrix, ₹ pricing vs USD+admin, switching guide.",
  alternates: { canonical: "/compare/leadkaun-vs-salesforce" },
}

export default function VsSalesforce() {
  return (
    <ComparePageLayout
      competitor="Salesforce"
      tldr="Salesforce is the enterprise standard — irrational at <200 reps. Leadkaun is purpose-built for Indian SMBs (3–50 reps). Below enterprise scale, picking Salesforce is paying 5–10× for admin overhead you don't need. At enterprise scale, Salesforce is still the right answer."
      positioning="Salesforce wins at 200+ reps, regulated enterprise, dedicated admin teams, and 7,000+ AppExchange integrations. Below that, the cost of ownership (₹7,500+/rep + implementation + admin + retraining) dwarfs the payoff. For most Indian SMB sales teams, Salesforce is a Ferrari for a school run."
      strengths={[
        "Unmatched AppExchange ecosystem (7,000+ apps)",
        "Unlimited customisation (Apex / Flow / Lightning)",
        "Scales to 10,000+ reps without breaking",
        "Enterprise security, SOC2, HIPAA, SSO",
        "Deepest reporting at enterprise scale",
      ]}
      weaknesses={[
        "₹7,500+/rep/month base (Sales Cloud Professional)",
        "3–12 month consultant-led implementation",
        "Requires a dedicated admin (₹1–2L/month)",
        "India localisation is partial, not native",
        "Notoriously low mid-market rep adoption",
      ]}
      features={[
        { label: "Lead scoring (transparent, 3-dim)",          leadkaun: true,         competitor: "Einstein AI (black-box)" },
        { label: "Priority Queue (auto-ranked, real-time)",    leadkaun: true,         competitor: "Flow-built workaround" },
        { label: "Missed Opportunity Engine (₹ at risk)",      leadkaun: true,         competitor: false },
        { label: "Morning Brief at 8:30 AM IST",               leadkaun: true,         competitor: "Custom reports" },
        { label: "WhatsApp 3-tap native",                      leadkaun: true,         competitor: "Via AppExchange" },
        { label: "INR pricing, GST-compliant",                 leadkaun: true,         competitor: "USD + India GST" },
        { label: "Customisation ceiling",                      leadkaun: "Growth tier", competitor: "Unlimited" },
        { label: "AppExchange equivalent",                     leadkaun: false,        competitor: true },
        { label: "Requires dedicated admin",                   leadkaun: false,        competitor: true },
        { label: "Setup time (typical SMB)",                   leadkaun: "same day",     competitor: "3–12 mo" },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",       price: "₹7,999 / mo", note: "All modules included. No admin overhead." },
        competitor: { tier: "Sales Pro",    price: "₹7,500+ / rep / mo", note: "Plus admin (₹1–2L/mo) + implementation (₹5–50L one-time)" },
      }}
      switching={[
        { title: "Be honest about scale",        body: "Under 200 reps? You're paying Salesforce for capabilities you don't use. Above? Salesforce is the right call." },
        { title: "Export Salesforce data",       body: "Export leads, accounts, opportunities, activity history. The SF export is thorough; CSV imports cleanly into Leadkaun." },
        { title: "Skip the consultant",          body: "Salesforce rebuilds take months. Leadkaun onboarding is same-day. The speed itself is a feature." },
        { title: "Measure over 90 days",         body: "Compare rep adoption rate, response-time, ₹ recovered. If Leadkaun wins outcomes at 1/4 the cost, the decision is made." },
      ]}
      faqs={[
        { q: "Our investors like Salesforce. Will switching hurt optics?", a: "Reframe: you're right-sizing, not downgrading. SF at 20 reps is under-utilisation, not sophistication. Investors respect operators who don't over-buy." },
        { q: "We use Salesforce for marketing + service + sales. Can Leadkaun do all that?", a: "No. Leadkaun is focused on sales behaviour. If you need SF for Service Cloud or Marketing Cloud, keep it. Add Leadkaun for sales behaviour alone." },
        { q: "We've invested in Apex customisations. Is switching worth it?", a: "Honest answer: only if those customisations aren't driving outcomes today. If they are, keep SF. If they're gathering dust while reps still work in Excel, switching recovers that ₹." },
        { q: "What about the AppExchange integrations we rely on?", a: "Leadkaun keeps integrations lean and India-first — CSV import today, with WhatsApp BSP (Gupshup / AiSensy / Interakt) and native Google Sheets sync on the roadmap. We won't match AppExchange breadth — but most Indian SMBs don't need it." },
      ]}
      verdict={{
        competitorWins: "Salesforce is the enterprise standard for good reason: unlimited customisation through Apex and Flow, a 7,000-plus app AppExchange, enterprise-grade security and compliance, and reporting that scales to thousands of reps. At 200-plus reps with a dedicated admin team, nothing matches its depth and ecosystem, and Leadkaun does not try to compete on that ground.",
        leadkaunWins: "Leadkaun is not an enterprise-CRM replacement; it is the sales behaviour layer for leaner Indian teams. It grades leads on a transparent 3-dimensional model, builds each rep a Priority Queue, and surfaces ₹ at risk, all on flat INR pricing with no dedicated admin and no months-long implementation. For a 3–50 rep team, that right-sizing is the entire point.",
        bottomLine: "At enterprise scale, or if you rely on Service Cloud, Marketing Cloud, or deep Apex customisations, Salesforce remains the right answer, so keep it. For a smaller Indian SMB team paying enterprise cost for capacity it never uses, Leadkaun delivers grading and prioritisation at a fraction of the overhead, and can even run alongside Salesforce purely as the sales behaviour layer.",
      }}
    />
  )
}
