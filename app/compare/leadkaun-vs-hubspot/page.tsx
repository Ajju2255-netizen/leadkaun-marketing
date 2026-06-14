import type { Metadata } from "next"
import { ComparePageLayout } from "@/app/components/compare-layout"

export const metadata: Metadata = {
  title: "Leadkaun vs HubSpot (2026) — Which fits Indian B2B SMBs better?",
  description:
    "HubSpot is USD-billed and marketing-first. Leadkaun is INR-priced and sales-behaviour-first. See the feature matrix, pricing comparison, and switching guide.",
  alternates: { canonical: "/compare/leadkaun-vs-hubspot" },
}

export default function VsHubSpot() {
  return (
    <ComparePageLayout
      competitor="HubSpot"
      tldr="HubSpot is marketing-automation-first with a sales layer bolted on. Leadkaun is sales-behaviour-first, priced in rupees. Most Indian SMBs use HubSpot Free for marketing + Leadkaun for the sales layer — together costing less than HubSpot Professional alone."
      positioning="HubSpot built a phenomenal marketing automation platform that grew a sales hub. The seams show in USD pricing, per-contact pricing that scales badly on 50k cold leads, and 2–6 week Professional-tier onboarding. For Indian B2B SMBs selling to SMBs, the marketing-first bias costs — literally and in focus."
      strengths={[
        "Best-in-class marketing automation",
        "Smooth product-led freemium onboarding",
        "Vast integrations marketplace",
        "Clean content / landing-page builders",
        "Strong reporting UX",
      ]}
      weaknesses={[
        "USD pricing shocks Indian buyers",
        "Marketing-first bias; sales-behaviour features weak",
        "Per-contact pricing punishes 50k+ cold lead databases",
        "No lakhs/crores UI; US-style phone formats",
        "Complex at Professional/Enterprise tiers",
      ]}
      features={[
        { label: "3-dimensional scoring (Fit × Intent × Quality)", leadkaun: true,         competitor: "Properties + workflows" },
        { label: "Intent decay over time",                          leadkaun: true,         competitor: false },
        { label: "Priority Queue (auto-ranked)",                    leadkaun: true,         competitor: false },
        { label: "Missed Opportunity Engine",                       leadkaun: true,         competitor: false },
        { label: "Morning Brief email",                             leadkaun: true,         competitor: false },
        { label: "WhatsApp 3-tap logging",                          leadkaun: true,         competitor: "Integration" },
        { label: "Marketing automation depth",                      leadkaun: false,        competitor: true },
        { label: "Content / landing-page builder",                  leadkaun: false,        competitor: true },
        { label: "INR pricing with GST",                            leadkaun: true,         competitor: false },
        { label: "Per-rep pricing (no contact limits)",             leadkaun: true,         competitor: false },
      ]}
      pricing={{
        leadkaun:   { tier: "Growth",        price: "₹1,999 / rep / mo", note: "All modules, 14-day trial, no credit card" },
        competitor: { tier: "Sales Pro",     price: "₹7,500+ / rep / mo", note: "Plus per-contact band; scales badly at 50k+ leads" },
      }}
      switching={[
        { title: "Export from HubSpot",          body: "Export contacts, companies, deals, activity history as CSV. HubSpot's export is clean; nothing lost." },
        { title: "Pick what to keep",            body: "HubSpot Free for marketing? Keep it. Your sales team moves to Leadkaun for the behaviour layer." },
        { title: "Onboard Leadkaun",             body: "60-minute wizard; import the CSV. First graded lead in the queue within the hour." },
        { title: "Compare ₹ recovered vs HS bill", body: "At day 60, compare Leadkaun recovery + HubSpot Free (₹0) to HubSpot Sales Pro bill. Most SMBs save ₹5–10 L/year." },
      ]}
      faqs={[
        { q: "We use HubSpot for marketing automation. Can Leadkaun replace it?", a: "Not in Phase 1. Keep HubSpot (Free tier is often enough for SMB marketing). Add Leadkaun for the sales-behaviour layer. Combined cost is typically lower than HubSpot Sales Pro alone." },
        { q: "HubSpot is billed in USD. Is Leadkaun different?", a: "Leadkaun bills in INR. All invoices GST-compliant. Predictable monthly spend; no exchange-rate swings." },
        { q: "Our contacts list is 80,000 leads. What happens in HubSpot?", a: "HubSpot charges per-contact over bands. 80k contacts push you into enterprise tiers. Leadkaun is per-rep with no contact limits — the 80k make no difference to your bill." },
        { q: "Will reps find Leadkaun easier than HubSpot Sales?", a: "Yes. 3-tap WhatsApp logging + auto-ranked Priority Queue beats HubSpot's form-heavy workflow for Indian SMB reps." },
      ]}
    />
  )
}
