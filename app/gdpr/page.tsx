import type { Metadata } from "next"

import { LegalPage, type LegalSection } from "@/app/components/legal-page"

export const metadata: Metadata = {
  title: "GDPR Compliance, Leadkaun",
  description:
    "How Leadkaun handles GDPR: controller and processor roles, lawful basis, international transfers, data subject rights, sub-processors and the DPA.",
  alternates: { canonical: "/gdpr" },
}

const SECTIONS: LegalSection[] = [
  {
    title: "Who this applies to",
    body: `Leadkaun is built for Indian B2B teams and most of our customers process data about people in India, where the Digital Personal Data Protection Act, 2023 applies rather than the GDPR.

This page is for the cases where the GDPR does apply: you are established in the EU or UK, or you are outside it but hold data about people who are in it. If that describes you, read this alongside the Privacy Policy and the Compliance page.`,
  },
  {
    title: "Controller and processor",
    body: `The roles split the same way they do under Indian law:
• For lead data — the records you import, create or capture — you are the Controller and Leadkaun is the Processor. You decide the purpose and means; we act on your instructions.
• For account data — the names, work emails and phone numbers of the people who sign in to Leadkaun, plus billing and support records — Leadkaun is the Controller.

This distinction matters. A request from someone in your lead list is your request to answer, because it is your data and your relationship. We will help you answer it, and we will tell the individual to contact you if they reach us first.`,
  },
  {
    title: "Lawful basis",
    body: `For the account data we control, we rely on:
• Contract — to provide the service you have signed up for, bill you, and support you.
• Legitimate interests — to secure the service, prevent abuse and improve the product, balanced against your rights.
• Consent — for optional marketing email, which you can withdraw at any time without affecting the service.
• Legal obligation — where tax or other law requires us to keep records.

For lead data, establishing and evidencing a lawful basis is yours. See the Anti-spam Policy for what that means in practice.`,
  },
  {
    title: "International transfers",
    body: `Leadkaun stores customer data on managed cloud infrastructure in India and/or Singapore, and our team is in India. Where you are in the EU or UK, using Leadkaun therefore involves a transfer of personal data outside the EEA.

India is not, at the date of this page, the subject of an adequacy decision by the European Commission. We therefore rely on Standard Contractual Clauses, incorporated into our Data Processing Agreement, together with the supplementary technical measures described on the Security page — encryption in transit and at rest, role-based access, and per-account data separation.

If your assessment concludes those measures are insufficient for your use case, tell us before you buy. We would rather lose the sale than have you rely on a transfer you are not comfortable with.`,
  },
  {
    title: "Data subject rights",
    body: `Where Leadkaun is the Controller, you can ask us to:
• Confirm what personal data we hold about you and give you a copy.
• Correct data that is inaccurate or incomplete.
• Delete your data, where we have no overriding obligation to keep it.
• Restrict or object to processing based on legitimate interests.
• Receive your data in a portable, machine-readable format.
• Withdraw consent to marketing at any time.

Write to team@leadkaun.com. We respond within 30 days and will not charge for a first request. We may ask you to verify your identity before we act, because handing data to the wrong person is its own breach.`,
  },
  {
    title: "Sub-processors",
    body: `We use a small number of sub-processors, each under a written agreement:
• Razorpay — payment processing
• Cloudflare — infrastructure, CDN and security
• Google Analytics — anonymised product analytics
• WhatsApp Business API providers — only where you enable a messaging integration

The current list is maintained on the Compliance page. We give reasonable notice before adding a sub-processor that materially changes how personal data is handled, so you have the opportunity to object.`,
  },
  {
    title: "Retention and deletion",
    body: `We keep account data while your account is active. After cancellation, data is retained for 90 days so it can be recovered, then permanently deleted from live systems, with backups aged out on their own cycle.

You can export your lead data from within the product at any time, and you can ask us to delete an account sooner than the 90-day window.`,
  },
  {
    title: "Personal data breaches",
    body: `If a breach affecting personal data occurs, we will notify affected customers without undue delay and, where the GDPR requires it, within 72 hours of becoming aware — with what we know, what we are doing, and what you may need to do.

We will not sit on a breach while we work out the messaging.`,
  },
  {
    title: "Data Processing Agreement and contacts",
    body: `A Data Processing Agreement incorporating Standard Contractual Clauses is available for customers on any paid plan. Request it at team@leadkaun.com.

The same address handles data subject requests and security reports — put "Privacy request", "DPA" or "Security" in the subject line so it is routed correctly.

Email: team@leadkaun.com
Postal: Leadkaun, [Registered Address], India

Leadkaun has not appointed an Article 27 representative in the EU or UK. If you require one as a condition of contracting, raise it with us before purchase.

You have the right to complain to your local supervisory authority. We would appreciate the chance to put things right first.`,
  },
]

export default function GdprPage() {
  return (
    <LegalPage
      title="GDPR Compliance"
      intro="Where the GDPR applies to your use of Leadkaun: who controls what, the basis we rely on, how international transfers are handled, and how to exercise your rights."
      updated="13 August 2026"
      sections={SECTIONS}
      current="/gdpr"
    />
  )
}
