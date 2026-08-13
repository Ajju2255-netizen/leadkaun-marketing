import type { Metadata } from "next"

import { LegalPage, type LegalSection } from "@/app/components/legal-page"

export const metadata: Metadata = {
  title: "Security & Data Protection, Leadkaun",
  description:
    "How Leadkaun protects your sales data, encryption in transit and at rest, PCI-DSS-compliant payments via Razorpay, role-based access, and responsible disclosure.",
  alternates: { canonical: "/security" },
}

const SECTIONS: LegalSection[] = [
  {
    title: "Encryption in transit and at rest",
    body: `All traffic to Leadkaun is served over HTTPS/TLS. Your data is stored on managed cloud infrastructure that encrypts data at rest by default.`,
  },
  {
    title: "Payments never touch our servers",
    body: `Payments are processed by Razorpay, a PCI-DSS Level 1 certified provider. Leadkaun never sees or stores your card details — Razorpay handles them end to end.`,
  },
  {
    title: "Role-based access",
    body: `Team and admin controls let you decide who sees and does what: Admin, Manager and Rep roles, per-workspace data separation, and a full audit export. Each account's data is kept separate.`,
  },
  {
    title: "Managed, resilient infrastructure",
    body: `Leadkaun runs on managed cloud platforms — edge delivery via Cloudflare, managed databases for application data — which maintain their own physical and network security and durability.`,
  },
  {
    title: "Data you control",
    body: `Your lead data is yours. You can export it at any time, and we will delete it on request when you close your account. We do not sell your data.`,
  },
  {
    title: "Privacy by design",
    body: `We collect what the product needs to work and no more. The Privacy Policy and Terms of Service set out how data is handled, retained and processed.`,
  },
  {
    title: "What we do not claim",
    body: `Leadkaun is not currently ISO 27001 certified and does not hold a SOC 2 Type I or Type II report. We would rather say that plainly than let a procurement team assume otherwise.

Where a specific control matters to your assessment, ask and we will describe exactly how it is implemented today. The Compliance page covers data residency, sub-processors and the Data Processing Agreement.`,
  },
  {
    title: "Responsible disclosure",
    body: `If you believe you have found a security vulnerability in Leadkaun, tell us before you tell anyone else and we will work with you.

Email: team@leadkaun.com with "Security" in the subject line.

Please include the steps to reproduce, the impact as you understand it, and anything we need to see it ourselves. We acknowledge reports within 24 hours and will keep you updated until it is resolved. We will not pursue action against researchers who report in good faith, avoid privacy violations and data destruction, and give us reasonable time to fix the issue before disclosing it.`,
  },
]

export default function SecurityPage() {
  return (
    <LegalPage
      title="Security"
      intro="Leadkaun holds your leads, contacts and pipeline, so this page sets out how that data is protected — in plain language, including the certifications we do not hold."
      updated="13 August 2026"
      sections={SECTIONS}
      current="/security"
    />
  )
}
