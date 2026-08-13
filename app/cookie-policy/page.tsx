import type { Metadata } from "next"

import { LegalPage, type LegalSection } from "@/app/components/legal-page"

export const metadata: Metadata = {
  title: "Cookie Policy, Leadkaun",
  description:
    "What cookies Leadkaun sets, which are strictly necessary, which are analytics, how long they last, and how to turn the optional ones off.",
  alternates: { canonical: "/cookie-policy" },
}

const SECTIONS: LegalSection[] = [
  {
    title: "What cookies are",
    body: `A cookie is a small text file a site stores on your device so it can recognise your browser on the next request. Similar technologies — local storage, session storage and tracking pixels — do much the same job, and everything in this policy applies to them too.

This policy covers leadkaun.com and the Leadkaun web application.`,
  },
  {
    title: "Strictly necessary cookies",
    body: `These make the product work. They cannot be turned off from within Leadkaun, because without them you cannot stay signed in or submit a form safely.

They are used for:
• Authentication — keeping you signed in between page loads.
• Session integrity — protecting forms against cross-site request forgery.
• Load balancing and security — set by Cloudflare to route requests and block abusive traffic.
• Preferences — remembering choices such as a dismissed banner.

These are set on the basis of legitimate interest in delivering a service you asked for, and typically expire when your session ends or within 12 months.`,
  },
  {
    title: "Analytics cookies",
    body: `We use Google Analytics to understand which pages and features get used, in aggregate. This tells us which guides are worth writing and which parts of the product confuse people.

We configure it to collect anonymised usage data. We do not use it to build advertising profiles, and we do not sell what it collects. These cookies typically expire within 24 months.

You can decline analytics cookies without losing any product functionality.`,
  },
  {
    title: "Advertising cookies",
    body: `Where a marketing pixel is active on the public site — for example to measure whether an ad campaign led to a signup — it is listed here and treated as optional.

Leadkaun does not sell personal data to advertising networks, and does not use lead records you upload for any advertising purpose whatsoever. Your leads are yours.`,
  },
  {
    title: "Cookies set by others",
    body: `Some cookies are set by services we embed rather than by us directly:
• Cloudflare — security and performance.
• Google Analytics — product and site analytics.
• Razorpay — only on checkout, to complete a payment securely.

Each of those providers publishes its own cookie and privacy documentation, and their handling is governed by it.`,
  },
  {
    title: "How to control cookies",
    body: `You have three routes:
• Browser settings. Every major browser can block or delete cookies, per site or globally. Blocking strictly necessary cookies will stop you being able to sign in.
• Device or browser tracking controls, such as Global Privacy Control, which we honour where the browser sends it.
• Google's own opt-out add-on, which prevents Google Analytics collecting data from your browser across all sites.

Clearing cookies signs you out and resets your preferences, which is expected rather than a fault.`,
  },
  {
    title: "Changes to this policy",
    body: `If we add a cookie category — for example an advertising pixel for a specific campaign — we will update this page before or at the time it goes live, and change the date at the top.`,
  },
  {
    title: "Contact",
    body: `Questions about cookies or tracking: team@leadkaun.com

For the wider picture of what we collect and why, read the Privacy Policy. For rights specific to the EU and UK, see the GDPR Compliance page.`,
  },
]

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="What Leadkaun stores on your device, which parts are strictly necessary, which are optional analytics, and exactly how to turn the optional ones off."
      updated="13 August 2026"
      sections={SECTIONS}
      current="/cookie-policy"
    />
  )
}
