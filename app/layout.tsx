import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { rootSchemas, jsonLdScript } from "@/lib/seo"
import { TooltipProvider } from "@/components/ui/tooltip"
import ScrollToTop from "@/app/components/scroll-to-top"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: ["400", "500", "700"],
})

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
