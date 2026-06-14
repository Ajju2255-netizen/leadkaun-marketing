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

type JsonLd = Record<string, unknown>

export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Leadkaun",
    legalName: "Leadkaun",
    url: SITE_URL,
    logo: `${SITE_URL}/og-default.png`,
    description:
      "India's first Sales Behaviour Operating System. Grades every lead A–F, builds Priority Queues, and surfaces missed revenue in rupees.",
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
    name: "Leadkaun",
    url: SITE_URL,
    inLanguage: "en-IN",
  }
}

export function softwareApplicationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Leadkaun",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Sales Behaviour Operating System",
    operatingSystem: "Web",
    description:
      "Grades every lead A–F in under 500ms, builds each rep's Priority Queue, and surfaces missed revenue in rupees. Built for Indian B2B SMB sales teams.",
    url: SITE_URL,
    image: `${SITE_URL}/og-default.png`,
    featureList: [
      "Lead scoring (Grade A–F) in under 500ms",
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
      lowPrice: "999",
      highPrice: "2999",
      offerCount: "3",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "50",
      bestRating: "5",
      worstRating: "1",
    },
    provider: {
      "@type": "Organization",
      name: "Leadkaun",
      url: SITE_URL,
    },
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
  author?: string
  url: string
  image?: string
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    datePublished: params.datePublished,
    dateModified: params.dateModified ?? params.datePublished,
    author: {
      "@type": "Organization",
      name: params.author ?? "Leadkaun",
    },
    publisher: {
      "@type": "Organization",
      name: "Leadkaun",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-default.png`,
      },
    },
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
    provider: {
      "@type": "Organization",
      name: "Leadkaun",
      url: SITE_URL,
    },
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
      unitText: params.unit ?? "per rep per month",
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
