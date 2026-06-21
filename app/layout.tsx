import type { Metadata } from "next"
// Geist via Vercel's `geist` package: font files are bundled in the package
// (next/font/local under the hood), so the build never fetches from Google
// Fonts. This avoids the transient "Failed to fetch `Geist` from Google Fonts"
// build failures that next/font/google causes on flaky networks. GeistSans /
// GeistMono expose --font-geist-sans / --font-geist-mono, matching globals.css.
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { rootSchemas, jsonLdScript } from "@/lib/seo"
import { TooltipProvider } from "@/components/ui/tooltip"
import ScrollToTop from "@/app/components/scroll-to-top"

const geistSans = GeistSans
const geistMono = GeistMono

export const metadata: Metadata = {
  title: {
    default: "Leadkaun — India's First Sales Behaviour OS",
    template: "%s | Leadkaun",
  },
  description:
    "Leadkaun tells your team exactly who to call, when to call, and where money is being lost — so your team closes more and wastes less. Grade A–F. Priority Queue. Missed ₹ surfaced.",
  keywords: [
    "sales behaviour os india",
    "sales tracking software india",
    "lead management software india",
    "lead scoring software india",
  ],
  authors: [{ name: "Leadkaun" }],
  creator: "Leadkaun",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://leadkaun.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Leadkaun",
    title: "Leadkaun — India's First Sales Behaviour OS",
    description:
      "Grade A–F. Priority Queue. Missed ₹ surfaced before it's gone. Built for Indian B2B sales teams.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leadkaun — India's First Sales Behaviour OS",
    description:
      "Grade A–F. Priority Queue. Missed ₹ surfaced before it's gone.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(rootSchemas()) }}
        />
      </head>
      <body className="antialiased bg-bg-pure text-ink-soft">
        <ScrollToTop />
        <TooltipProvider delayDuration={120}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}
