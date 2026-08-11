/**
 * SEO + JSON-LD helpers.
 *
 * Schemas referenced: Organization, WebSite, SoftwareApplication, FAQPage,
 * BreadcrumbList, Article, LocalBusiness, Place, Offer, HowTo, QAPage,
 * DefinedTerm, Product.
 *
 * Emit with:
 *   <script type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
 */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://leadkaun.com").replace(/\/$/, "")

export function canonical(path: string): string {
  if (!path.startsWith("/")) path = "/" + path
  return SITE_URL + (path === "/" ? "" : path)
}

/** Default social/OG card image (1200×630). Also used as JSON-LD image fallback. */
export const OG_IMAGE = `${SITE_URL}/og-default.png`

/**
 * Page-specific Open Graph + Twitter block for `generateMetadata`.
 *
 * Next.js applies the `title.template` ("%s | Leadkaun") only to the document
 * <title>, never to `openGraph.title` — so without this, every page inherits
 * the layout's single generic og:title. Spread the result into the metadata
 * return (pages keep their own `title`, `alternates.canonical` and `robots`).
 */
export function ogMeta(params: { title: string; description: string; path: string; image?: string }) {
  const image = params.image ?? OG_IMAGE
  return {
    openGraph: {
      type: "website" as const,
      url: canonical(params.path),
      title: params.title,
      description: params.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: params.title,
      description: params.description,
      images: [image],
    },
  }
}

type JsonLd = Record<string, unknown>

export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Leadkaun",
    legalName: "Leadkaun",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/leadkaun-logo.png`,
    description:
      "Sales Behaviour Operating System for Indian sales teams. Grades every lead A–F, builds Priority Queues, and surfaces missed revenue in rupees.",
    sameAs: [
      "https://www.linkedin.com/company/leadkaun",
      "https://twitter.com/leadkaun",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "sales@leadkaun.com",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@leadkaun.com",
        areaServed: "IN",
      },
    ],
  }
}

export function webSiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Leadkaun",
    url: SITE_URL,
    inLanguage: "en-IN",
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: { "@id": `${SITE_URL}/#software` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function softwareApplicationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: "Leadkaun",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Sales Behaviour Operating System",
    operatingSystem: "Web",
    description:
      "Grades every lead A–F in real time, builds each rep's Priority Queue, and surfaces missed revenue in rupees. Built for Indian B2B SMB sales teams.",
    url: SITE_URL,
    image: `${SITE_URL}/og-default.png`,
    featureList: [
      "Lead scoring (Grade A–F) in real time",
      "Priority Queue with real-time re-ranking",
      "Missed Opportunity Engine (₹-denominated)",
      "Morning Brief email at 8:30 AM IST",
      "WhatsApp behaviour tracking (3-tap logging)",
      "Sales rep tracking and accountability",
      "Analytics dashboard with Source Truth cards",
      "Follow-up engine with grade-aware cadence",
      "Smart message templates",
      "Team & admin role management",
    ],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      // Flat per-account tiers: Starter ₹2,999 → Scale ₹19,999 (Free ₹0 and
      // custom Enterprise excluded from the priced range).
      lowPrice: "2999",
      highPrice: "19999",
      offerCount: "3",
      availability: "https://schema.org/InStock",
    },
    // aggregateRating intentionally omitted: a hardcoded/unverifiable rating is a
    // Google structured-data manual-action risk. Re-add only with real reviews.
    publisher: { "@id": `${SITE_URL}/#organization` },
  }
}

export function rootSchemas(): JsonLd[] {
  return [organizationSchema(), webSiteSchema(), softwareApplicationSchema()]
}

export function faqPageSchema(
  faqs: { q: string; a: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
}

export function breadcrumbListSchema(
  items: { name: string; url?: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: canonical(item.url) } : {}),
    })),
  }
}

export function articleSchema(params: {
  headline: string
  description: string
  datePublished: string
  dateModified?: string
  author?: string | { name: string; type?: "Person" | "Organization"; url?: string; jobTitle?: string }
  url: string
  image?: string
}): JsonLd {
  // Accept a plain name (→ Organization) or a full author object (→ Person for a
  // real human, which Google's E-E-A-T rewards over an anonymous org byline).
  const a =
    typeof params.author === "object" && params.author
      ? params.author
      : { name: (params.author as string | undefined) ?? "Leadkaun", type: "Organization" as const }
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    datePublished: params.datePublished,
    dateModified: params.dateModified ?? params.datePublished,
    author: {
      "@type": a.type ?? "Organization",
      name: a.name,
      ...(a.url ? { url: a.url } : {}),
      ...(a.type === "Person" && "jobTitle" in a && a.jobTitle ? { jobTitle: a.jobTitle } : {}),
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: canonical(params.url),
    image: params.image ? [params.image] : [`${SITE_URL}/og-default.png`],
  }
}

export function localBusinessSchema(params: {
  name: string
  city: string
  state: string
  industry: string
  url: string
  description?: string
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: params.name,
    description:
      params.description ??
      `${params.industry} sales software serving ${params.city}, ${params.state}.`,
    url: canonical(params.url),
    areaServed: {
      "@type": "City",
      name: params.city,
      containedInPlace: { "@type": "AdministrativeArea", name: params.state },
    },
    serviceType: `${params.industry} lead management`,
    provider: { "@id": `${SITE_URL}/#organization` },
  }
}

export function placeSchema(params: {
  city: string
  state: string
  lat?: number
  lng?: number
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: params.city,
    address: {
      "@type": "PostalAddress",
      addressLocality: params.city,
      addressRegion: params.state,
      addressCountry: "IN",
    },
    ...(params.lat !== undefined && params.lng !== undefined
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: params.lat,
            longitude: params.lng,
          },
        }
      : {}),
  }
}

export function offerSchema(params: {
  name: string
  priceInr: number
  url: string
  unit?: string
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: params.name,
    url: canonical(params.url),
    priceCurrency: "INR",
    price: params.priceInr.toString(),
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: params.priceInr,
      priceCurrency: "INR",
      // Flat per-account pricing — the tier's rep count is a seat limit, not a
      // multiplier. This string reaches Google's rich results; keep it truthful.
      unitText: params.unit ?? "per month",
    },
    availability: "https://schema.org/InStock",
  }
}

export function howToSchema(params: {
  name: string
  description: string
  steps: { name: string; text: string }[]
  totalTime?: string
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: params.name,
    description: params.description,
    ...(params.totalTime ? { totalTime: params.totalTime } : {}),
    step: params.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}

export function qaPageSchema(params: {
  question: string
  answer: string
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: params.question,
      acceptedAnswer: { "@type": "Answer", text: params.answer },
    },
  }
}

export function definedTermSchema(params: {
  term: string
  definition: string
  inDefinedTermSet?: string
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: params.term,
    description: params.definition,
    inDefinedTermSet:
      params.inDefinedTermSet ?? canonical("/glossary"),
  }
}

export function productSchema(params: {
  name: string
  description: string
  url: string
  brand?: string
  image?: string
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: params.name,
    description: params.description,
    url: canonical(params.url),
    brand: {
      "@type": "Brand",
      name: params.brand ?? "Leadkaun",
    },
    image: params.image ?? `${SITE_URL}/og-default.png`,
  }
}

/** Emit one or more JSON-LD blocks as a single <script> tag payload. */
export function jsonLdScript(schemas: JsonLd | JsonLd[]): string {
  return JSON.stringify(Array.isArray(schemas) ? schemas : [schemas])
}
