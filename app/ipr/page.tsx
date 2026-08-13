import type { Metadata } from "next"

import { LegalPage, type LegalSection } from "@/app/components/legal-page"

export const metadata: Metadata = {
  title: "IPR Complaints, Leadkaun",
  description:
    "How to report copyright or trademark infringement on Leadkaun, what a valid notice must contain, how we handle counter-notices, and our repeat-infringer policy.",
  alternates: { canonical: "/ipr" },
}

const SECTIONS: LegalSection[] = [
  {
    title: "Our position",
    body: `Leadkaun respects intellectual property rights and expects its customers to do the same. If content stored, displayed or transmitted through Leadkaun infringes your copyright, trademark or other intellectual property right, this page tells you how to have it removed.

We act on complete, good-faith notices. We do not act on vague accusations, and we will not remove content on the basis of a complaint that does not identify the work and the material with enough precision for us to find both.`,
  },
  {
    title: "What a valid notice must contain",
    body: `Send your notice to team@leadkaun.com with the subject line "IPR Complaint". It must include all of the following:
• Your name, postal address, telephone number and email address.
• Identification of the work you say is infringed — the registration number where one exists, or a description and a link to where the work can be seen.
• Identification of the material you say infringes it, precise enough for us to locate it: the URL, account, workspace or record.
• A statement that you have a good-faith belief the use is not authorised by the rights owner, its agent, or the law.
• A statement that the information in the notice is accurate, and that you are the rights owner or authorised to act on the owner's behalf.
• Your physical or electronic signature.

An incomplete notice will be returned rather than actioned, with a note on what is missing.`,
  },
  {
    title: "What we do when we receive one",
    body: `We acknowledge every complete notice within 36 hours.

We then assess the notice and, where it is valid on its face, disable access to the identified material and notify the customer who supplied it, passing on your notice so they can respond. Where the material is a customer's own lead or account data rather than published content, we contact the customer first except where the law requires otherwise.

We aim to conclude the process within 15 days of a complete notice.`,
  },
  {
    title: "Counter-notice",
    body: `If your material has been removed and you believe that was a mistake or a misidentification, send a counter-notice to team@leadkaun.com containing:
• Your name, address, telephone number and email.
• Identification of the material removed and where it appeared before removal.
• A statement, under penalty of perjury where applicable, that you have a good-faith belief the material was removed as a result of mistake or misidentification.
• Your consent to the jurisdiction of the courts specified in our Terms of Service.
• Your physical or electronic signature.

We will forward a valid counter-notice to the original complainant. If they do not tell us within 10 business days that they have initiated proceedings, we may restore the material.`,
  },
  {
    title: "Trademarks",
    body: `Trademark complaints follow the same route and require the same completeness: the mark, the registration details or jurisdiction of the unregistered right, the specific use you object to, and why you believe it is likely to cause confusion.

Descriptive, comparative or nominative use of a name — including references to competing products on our comparison pages — is not by itself infringement, and we will say so where that is our view.`,
  },
  {
    title: "Repeat infringers",
    body: `We maintain a record of complaints upheld against an account. Accounts that repeatedly infringe intellectual property rights are suspended and, on a further occurrence, terminated in accordance with our Terms of Service and Abuse Policy.`,
  },
  {
    title: "Misuse of this process",
    body: `Filing a knowingly false notice wastes our time and can cause real harm to a customer's business. We keep records of all notices and reserve the right to refuse to act on further complaints from a party that has repeatedly filed notices in bad faith, and to pass those records to an affected customer.`,
  },
  {
    title: "Contact",
    body: `Email: team@leadkaun.com — use the subject line "IPR Complaint" or "IPR Counter-notice" so it is routed correctly.
Postal: Leadkaun, [Registered Address], India

Designated agent for IPR notices: [Name]`,
  },
]

export default function IprPage() {
  return (
    <LegalPage
      title="IPR Complaints"
      intro="How to report copyright or trademark infringement on Leadkaun, what a valid notice must contain, and how counter-notices are handled."
      updated="13 August 2026"
      sections={SECTIONS}
      current="/ipr"
    />
  )
}
