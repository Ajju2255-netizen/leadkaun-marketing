import type { Metadata } from "next"

import { LegalPage, type LegalSection } from "@/app/components/legal-page"

export const metadata: Metadata = {
  title: "Privacy Policy, Leadkaun",
  description: "Leadkaun's privacy policy: what data we collect, how we use it, and your rights as a user.",
  alternates: { canonical: "/privacy" },
}

const SECTIONS: LegalSection[] = [
  { title: "Data we collect", body: `When you use Leadkaun, we collect:
• Account information, name, work email, phone number, company name.
• Lead data. The records you import or create, including names, phone numbers, emails, and custom fields.
• Usage data, how you interact with the product: pages visited, features used, actions logged.
• Device data, browser type, IP address, operating system, used for security and analytics.

We do not collect payment card details directly. Payments are processed by Razorpay, subject to their privacy policy.` },
  { title: "How we use your data", body: `We use your data to:
• Provide and improve the Leadkaun service.
• Send the Morning Brief and other product notifications you have opted into.
• Respond to support requests.
• Prevent fraud and maintain security.
• Comply with legal obligations.

We do not sell your data to third parties.` },
  { title: "Storage and security", body: `Your data is stored on servers located in India and/or Singapore. We use industry-standard encryption (TLS in transit, AES-256 at rest) and strict access controls to protect your data.

Lead data is logically isolated per account. No other Leadkaun customer can access your lead records.` },
  { title: "Third-party services", body: `Leadkaun uses the following third-party services that may process your data:
• Razorpay, payment processing
• Cloudflare, infrastructure and security
• Google Analytics, anonymised usage analytics
• WhatsApp Business API (optional), message tracking for opted-in integrations

Each provider is subject to their own privacy policy and data-processing terms.` },
  { title: "Your rights", body: `You have the right to:
• Access the personal data we hold about you.
• Correct inaccurate data.
• Request deletion of your account and associated data.
• Export your lead data at any time from within the app.
• Withdraw consent for non-essential communications.

To exercise any of these rights, contact us at privacy@leadkaun.com.` },
  { title: "Data retention", body: `We retain your data for as long as your account is active. If you cancel your subscription, we retain your data for 90 days to allow recovery, after which it is permanently deleted from our systems.

Anonymised, aggregated usage data may be retained indefinitely for product improvement.` },
  { title: "Cookies", body: `Leadkaun uses essential cookies (for authentication and session management) and analytics cookies (to understand feature usage). You can disable analytics cookies via your browser settings without affecting core product functionality.` },
  { title: "Contact", body: `For privacy-related questions or to exercise your rights:

Email: privacy@leadkaun.com
Postal: Leadkaun, [Registered Address], India

We aim to respond to all privacy requests within 7 business days.` },
]

export default function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What Leadkaun collects, why, where it is stored, who else touches it, and the rights you have over it."
      updated="13 August 2026"
      sections={SECTIONS}
      current="/privacy"
    />
  )
}
