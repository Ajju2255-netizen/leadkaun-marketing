import type { Metadata } from "next"

import { LegalPage, type LegalSection } from "@/app/components/legal-page"

export const metadata: Metadata = {
  title: "Anti-spam Policy, Leadkaun",
  description:
    "Leadkaun's anti-spam policy: consent requirements for calls, WhatsApp and email, TRAI and DPDP obligations, prohibited practices, and how we act on complaints.",
  alternates: { canonical: "/anti-spam" },
}

const SECTIONS: LegalSection[] = [
  {
    title: "Why this policy exists",
    body: `Leadkaun helps sales teams reach leads faster. Used carelessly, a tool like that becomes a tool for spam — and spam is both unlawful and, on WhatsApp and phone in particular, the fastest way to get your own numbers blocked.

This policy is a condition of using Leadkaun. It applies to every message, call and email you send to a contact whose record lives in your Leadkaun account, whether or not Leadkaun sent it for you.`,
  },
  {
    title: "Consent is your obligation",
    body: `You are the Data Fiduciary for the leads you upload. Before you contact anyone in your Leadkaun account, you must have a lawful basis to do so under the Digital Personal Data Protection Act, 2023 and, where the contact is outside India, under the law that applies to them.

In practice that means the contact:
• submitted an enquiry, form, or bid to you; or
• was supplied by a lead provider that obtained consent to pass their details to you; or
• has an existing business relationship with you; or
• has otherwise given consent you can evidence.

Leadkaun gives you fields to record where a lead came from and when. Use them. If you cannot say why you are allowed to contact a lead, do not contact it.`,
  },
  {
    title: "Telephone and SMS in India",
    body: `Calls and SMS to Indian numbers are subject to TRAI's Telecom Commercial Communications Customer Preference Regulations. Where you send commercial SMS, you are responsible for registration on the DLT platform, for registered headers and templates, and for honouring Do Not Disturb preferences.

Leadkaun does not register your sender IDs or templates for you, and does not scrub your list against DND. Those obligations sit with you and your telecom provider.`,
  },
  {
    title: "WhatsApp",
    body: `WhatsApp is a personal channel and its rules are stricter than email. Where you use WhatsApp alongside Leadkaun, you must comply with WhatsApp's Business Messaging Policy and, where you use the Business API, your provider's terms.

That includes obtaining opt-in before initiating a conversation, using approved templates where required, identifying yourself clearly, and honouring a block or an opt-out immediately. Bulk unsolicited messaging from personal WhatsApp accounts is a fast route to a permanent ban of your number, and is not something Leadkaun can protect you from.`,
  },
  {
    title: "Prohibited practices",
    body: `You may not use Leadkaun to:
• Message or call contacts on a purchased, scraped or harvested list you have no lawful basis to use.
• Continue contacting someone after they have asked you to stop, on any channel.
• Conceal or falsify your identity, sender name, reply address or the purpose of your message.
• Send messages promoting anything unlawful, fraudulent, deceptive, or prohibited by our Abuse Policy.
• Circumvent an opt-out by moving a contact to a different number, address or account.
• Attempt to evade rate limits, filtering or platform enforcement on any messaging channel.`,
  },
  {
    title: "Honouring opt-outs",
    body: `An opt-out applies to the person, not the channel. When someone asks to stop hearing from you, mark the record in Leadkaun and stop contacting them across every channel you hold for them.

Suppression must survive re-import. If you re-upload a list that contains a contact who previously opted out, you are responsible for keeping them suppressed — a fresh CSV is not a fresh consent.`,
  },
  {
    title: "Complaints and enforcement",
    body: `Anyone can report misuse of Leadkaun to team@leadkaun.com. Please include the message received, the sender's identity if known, and the date.

Where a complaint is substantiated we will contact the customer and require a remedy. Depending on severity and history we may restrict messaging features, suspend the account, or terminate it. We act immediately and without notice where there is ongoing harm or a legal requirement to do so.

We may be required to disclose account information to a regulator or law enforcement acting under lawful authority.`,
  },
  {
    title: "Contact",
    body: `To report spam sent using Leadkaun, or to ask about this policy, write to team@leadkaun.com with "Spam report" in the subject line.

If you received a message you believe was sent through Leadkaun and you want your details removed, contact the sender first where you can identify them — they hold your data, not us. If that fails, write to us and we will route the request to the account responsible.`,
  },
]

export default function AntiSpamPage() {
  return (
    <LegalPage
      title="Anti-spam Policy"
      intro="What you must have before you contact a lead through Leadkaun, the rules that apply on phone, SMS and WhatsApp in India, and what happens when someone complains."
      updated="13 August 2026"
      sections={SECTIONS}
      current="/anti-spam"
    />
  )
}
