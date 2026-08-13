import type { Metadata } from "next"

import { LegalPage, type LegalSection } from "@/app/components/legal-page"

export const metadata: Metadata = {
  title: "Compliance, Leadkaun",
  description:
    "How Leadkaun approaches Indian data protection law, GST invoicing, payment compliance, data residency, and sub-processors — including what we are not certified for.",
  alternates: { canonical: "/compliance" },
}

const SECTIONS: LegalSection[] = [
  {
    title: "What this page covers",
    body: `This page sets out the regulatory framework Leadkaun operates under, the obligations we take on, and — as importantly — the certifications we do not currently hold. If you are running a vendor assessment, this is the page to send to your legal or procurement team.

Nothing here is a substitute for your own compliance review. If your organisation needs a specific attestation or contractual commitment, ask us before you buy rather than after.`,
  },
  {
    title: "Indian data protection law",
    body: `Leadkaun is an Indian service, operated for Indian businesses, and processes personal data under the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000 together with the rules made under it.

In DPDP terms, the split of responsibility is:
• You are the Data Fiduciary for the lead records you upload, create or capture. You decide why that data is collected and how it is used.
• Leadkaun is a Data Processor acting on your instructions for that lead data.
• Leadkaun is the Data Fiduciary for your own account data — the name, work email, phone number and company of the people who sign in.

That means obtaining a valid basis to contact the individuals in your lead list remains your responsibility. We give you the tools to record and honour consent and opt-outs; we cannot supply consent you did not obtain.`,
  },
  {
    title: "Grievance redressal",
    body: `Under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and the DPDP Act, we publish a grievance contact.

Grievance Officer: [Name]
Email: team@leadkaun.com
Postal: Leadkaun, [Registered Address], India

We acknowledge grievances within 24 hours and aim to resolve them within 15 days, or explain why more time is needed.`,
  },
  {
    title: "Data residency and sub-processors",
    body: `Customer data is stored on managed cloud infrastructure in India and/or Singapore. We will tell you, on request, which region your account's data sits in.

We use the following sub-processors, each under their own terms:
• Razorpay — payment processing (India)
• Cloudflare — infrastructure, CDN and security
• Google Analytics — anonymised product usage analytics
• WhatsApp Business API providers — only where you have enabled a messaging integration

We will give reasonable notice before adding a sub-processor that materially changes how your data is handled.`,
  },
  {
    title: "Payments, GST and invoicing",
    body: `Leadkaun bills in Indian Rupees. Where GST applies, invoices are issued with the applicable tax details so they can be claimed as input credit.

Card and netbanking details are handled entirely by Razorpay, a PCI-DSS Level 1 certified payment provider. Leadkaun does not see, transmit or store payment card numbers on its own systems.`,
  },
  {
    title: "Security posture",
    body: `Our technical controls are described in full on the Security page: encryption in transit and at rest, role-based access, per-account data separation, and export or deletion on demand.

To be explicit about the limits of what we claim: Leadkaun is not currently ISO 27001 certified and does not hold a SOC 2 Type I or Type II report. If you see either claimed about us anywhere, it is wrong and we would like to know. Where a control matters to your assessment, ask and we will describe exactly how it is implemented today.`,
  },
  {
    title: "Data processing agreement",
    body: `A Data Processing Agreement covering the DPDP Act and, where relevant, the GDPR is available on request for customers on any paid plan. Write to team@leadkaun.com with your entity name and we will send the current version.

If your organisation requires its own paper rather than ours, send it over and we will review it.`,
  },
  {
    title: "Reporting a concern",
    body: `If you believe Leadkaun is handling data in a way that breaches a legal obligation, tell us directly before escalating — we would rather fix it.

Email: team@leadkaun.com

Put the reason in the subject line — "Compliance", "Privacy" or "Security" — so it reaches the right person quickly.

If we cannot resolve your complaint, you retain the right to complain to the Data Protection Board of India or your local supervisory authority.`,
  },
]

export default function CompliancePage() {
  return (
    <LegalPage
      title="Compliance"
      intro="The regulatory framework Leadkaun operates under, who is responsible for what, and the certifications we do not hold. Written to be sent to a procurement team."
      updated="13 August 2026"
      sections={SECTIONS}
      current="/compliance"
    />
  )
}
