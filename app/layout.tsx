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
import { StickyCTA } from "@/app/components/sticky-cta"
import { ConversionPopup } from "@/app/components/conversion-popup"

const geistSans = GeistSans
const geistMono = GeistMono

export const metadata: Metadata = {
  title: {
    default: "Leadkaun — Sales Behaviour OS for Indian Sales Teams",
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
    title: "Leadkaun — Sales Behaviour OS for Indian Sales Teams",
    description:
      "Grade A–F. Priority Queue. Missed ₹ surfaced before it's gone. Built for Indian B2B sales teams.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leadkaun — Sales Behaviour OS for Indian Sales Teams",
    description:
      "Grade A–F. Priority Queue. Missed ₹ surfaced before it's gone.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Google Tag Manager — placed as high in <head> as possible */}
        <script
          id="gtm-init"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TV7T9Q5T');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Google tag (gtag.js) — GA4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YB7279SHGQ" />
        <script
          id="ga4-init"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-YB7279SHGQ');`,
          }}
        />
        {/* End Google tag (gtag.js) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(rootSchemas()) }}
        />
        <link rel="alternate" type="application/rss+xml" title="Leadkaun Blog" href="/feed.xml" />
      </head>
      <body className="antialiased bg-bg-pure text-ink-soft">
        {/* Google Tag Manager (noscript) — must be immediately after <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TV7T9Q5T"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ScrollToTop />
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <StickyCTA />
        <ConversionPopup />
      </body>
    </html>
  )
}
