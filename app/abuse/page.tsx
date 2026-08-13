import type { Metadata } from "next"

import { LegalPage, type LegalSection } from "@/app/components/legal-page"

export const metadata: Metadata = {
  title: "Abuse Policy, Leadkaun",
  description:
    "What counts as abuse of Leadkaun, how to report it, how we investigate, what enforcement looks like, and how to appeal a decision.",
  alternates: { canonical: "/abuse" },
}

const SECTIONS: LegalSection[] = [
  {
    title: "Scope",
    body: `This policy sets out what you may not do with Leadkaun, how anyone — customer or not — can report misuse, and what we do about it. It applies to every account, including free trials, and sits alongside the Terms of Service and the Anti-spam Policy.

Where this policy and a customer contract disagree on prohibited conduct, the stricter of the two applies.`,
  },
  {
    title: "Prohibited use",
    body: `You may not use Leadkaun to:
• Break the law, or to help someone else break it.
• Store or process data you have no lawful basis to hold, including scraped, purchased or leaked personal data.
• Send unsolicited commercial messages, in breach of our Anti-spam Policy.
• Harass, threaten, defame or stalk anyone, or facilitate someone doing so.
• Run fraud, phishing, fake job offers, or any scheme that deceives people about who you are or who you represent.
• Promote lending, investment, medical or educational outcomes with claims you cannot evidence.
• Infringe intellectual property rights — see IPR Complaints.
• Distribute malware, or use Leadkaun as infrastructure for an attack on anyone.
• Probe, scan, overload or attempt to bypass the security or rate limits of the service.
• Resell, sublicense or white-label access to Leadkaun without a written agreement.
• Share sign-in credentials so more people use the product than your plan's seat cap allows.`,
  },
  {
    title: "Special-category data",
    body: `Leadkaun is a sales tool and is not designed to hold sensitive personal data. Do not upload health records, financial account credentials, government identifiers such as Aadhaar or PAN in free-text fields, biometric data, or data about children.

If your sales process genuinely requires processing sensitive categories, speak to us first at team@leadkaun.com rather than assuming it is permitted.`,
  },
  {
    title: "How to report abuse",
    body: `Write to team@leadkaun.com. You do not need to be a Leadkaun customer to file a report.

Please include:
• What happened, and when.
• Any message, call record or screenshot you have.
• The identity of the sender or account if you know it.
• How we can contact you for follow-up, if you are willing.

We accept anonymous reports, but they are harder to act on because we cannot come back to you for detail.`,
  },
  {
    title: "How we investigate",
    body: `We acknowledge reports within 24 hours. We then look at the evidence supplied and, where necessary and lawful, at account metadata such as sending volumes and login patterns.

We do not read customers' lead data as a matter of routine. We access it only where it is strictly necessary to investigate a specific, credible report, to comply with a legal obligation, or to protect someone from imminent harm — and we record when we do.

We contact the account holder for their account of events, except where doing so would frustrate the investigation or increase the risk of harm.`,
  },
  {
    title: "Enforcement",
    body: `Depending on the severity, the history of the account, and whether harm is ongoing, we may:
• Warn the account holder and require a specific remedy within a deadline.
• Restrict a capability, such as messaging or bulk import.
• Suspend the account, retaining the data during the suspension.
• Terminate the account and delete the data in line with our retention schedule.
• Report the matter to law enforcement or the relevant regulator.

We act immediately and without prior notice where there is ongoing harm, a credible threat to someone's safety, or a legal requirement to do so. Otherwise we prefer to warn and let the customer fix it, because most misuse is carelessness rather than malice.

Suspension or termination for abuse does not entitle you to a refund of fees already paid.`,
  },
  {
    title: "Appeals",
    body: `If your account has been restricted, suspended or terminated and you believe we got it wrong, reply to the enforcement notice or write to team@leadkaun.com within 30 days.

Tell us what you think we misread and include anything that supports it. A different person from the one who made the original decision reviews the appeal, and we aim to respond within 10 business days. If we were wrong, we will say so and restore the account.`,
  },
  {
    title: "Legal requests and transparency",
    body: `We disclose customer information to law enforcement only against valid legal process, and only to the extent that process requires. Where we are permitted to tell the affected customer, we do, so they have the opportunity to respond.

Reports made in bad faith — to harass a competitor, for instance — are themselves a breach of this policy, and we keep records accordingly.`,
  },
  {
    title: "Contact",
    body: `Everything on this page reaches the same inbox. Put the reason in the subject line so it gets to the right person quickly — "Abuse report", "Security", or "Appeal".

Email: team@leadkaun.com
Postal: Leadkaun, [Registered Address], India`,
  },
]

export default function AbusePolicyPage() {
  return (
    <LegalPage
      title="Abuse Policy"
      intro="What you may not do with Leadkaun, how anyone can report misuse, how we investigate it, and how to appeal if we get a decision wrong."
      updated="13 August 2026"
      sections={SECTIONS}
      current="/abuse"
    />
  )
}
