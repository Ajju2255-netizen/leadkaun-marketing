import type { Metadata } from "next"
// Geist via Vercel's `geist` package: font files are bundled in the package
// (next/font/local under the hood), so the build never fetches from Google
// Fonts. This avoids the transient "Failed to fetch `Geist` from Google Fonts"
// build failures that next/font/google causes on flaky networks. GeistSans /
// GeistMono expose --font-geist-sans / --font-geist-mono, matching globals.css.
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
// Display face — Fraunces (variable, OFL). Self-hosted for the same reason Geist
// is: no build-time fetch, so a flaky network can never fail a deploy.
// See app/fonts/README.md.
import localFont from "next/font/local"
import "./globals.css"
import { rootSchemas, jsonLdScript } from "@/lib/seo"
import { TooltipProvider } from "@/components/ui/tooltip"
import ScrollToTop from "@/app/components/scroll-to-top"
import { MetaPixelRouteChange } from "@/app/components/meta-pixel"

/** Meta Pixel, Leadkaun ad account. Referenced by the inline snippet and the
 *  noscript fallback below, so the id is written once. */
const META_PIXEL_ID = "1615607493462627"

const geistSans = GeistSans
const geistMono = GeistMono

const fraunces = localFont({
  src: "./fonts/Fraunces-Variable.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "300 900",
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: "Leadkaun Sales Behaviour OS for Indian Sales Teams",
    template: "%s | Leadkaun",
  },
  description:
    "Leadkaun tells your team exactly who to call, when to call, and where money is being lost, so your team closes more and wastes less. Grade A–F. Priority Queue. Missed ₹ surfaced.",
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
    title: "Leadkaun Sales Behaviour OS for Indian Sales Teams",
    description:
      "Grade A–F. Priority Queue. Missed ₹ surfaced before it's gone. Built for Indian B2B sales teams.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leadkaun Sales Behaviour OS for Indian Sales Teams",
    description:
      "Grade A–F. Priority Queue. Missed ₹ surfaced before it's gone.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}>
      <head>
        {/* Google Tag Manager, placed as high in <head> as possible */}
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
        {/* Google tag (gtag.js), GA4 */}
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
        {/* Meta Pixel */}
        <script
          id="meta-pixel-init"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`,
          }}
        />
        {/* End Meta Pixel */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(rootSchemas()) }}
        />
        <link rel="alternate" type="application/rss+xml" title="Leadkaun Blog" href="/feed.xml" />
      </head>
      <body className="antialiased bg-bg-pure text-ink-soft">
        {/* Google Tag Manager (noscript) must be immediately after <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TV7T9Q5T"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Meta Pixel (noscript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        {/* End Meta Pixel (noscript) */}
        <ScrollToTop />
        {/* App Router client navigations do not reload the page, so the inline
            snippet above only ever counts the first view. This refires on route
            change so a visitor moving between pages is counted for each. */}
        <MetaPixelRouteChange />
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}
