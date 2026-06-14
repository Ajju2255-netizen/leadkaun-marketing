import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import InternalLinksGrid from "@/app/components/internal-links-grid"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { GlossLink } from "@/app/components/gloss-button"
import { NumberedTag } from "@/app/components/numbered-tag"
import { IndustryTile } from "@/app/components/industry-tile"
import { Reveal } from "@/app/components/reveal"

import { getCities, getCity, getRole, resolveCitySlug } from "@/lib/pseo/lookup"
import { tier0Cities, tier0Roles } from "@/lib/pseo/tier0"
import { breadcrumbListSchema, placeSchema, jsonLdScript } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export const revalidate = 86400

export async function generateStaticParams() {
  const [roles, cities] = await Promise.all([tier0Roles(), tier0Cities()])
  return roles.flatMap((r) => cities.map((c) => ({ role: r.slug, city: c.slug })))
}

type Params = { params: Promise<{ role: string; city: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { role, city } = await params
  const [r, cityRec, canonicalCityResolved] = await Promise.all([getRole(role), getCity(city), resolveCitySlug(city)])
  if (!r || !cityRec) return {}
  const canonicalCity = canonicalCityResolved ?? city
  return {
    title: `Sales Software for ${r.title}s in ${cityRec.name} | Leadkaun`,
    description: `${r.title}s in ${cityRec.name} use Leadkaun to grade leads A–F, build rep queues, and surface missed ₹. Setup in 60 min.`,
    alternates: { canonical: `/for/${role}/${canonicalCity}` },
  }
}

export default async function RoleCityPage({ params }: Params) {
  const { role, city } = await params
  const [r, cityRec, allCities] = await Promise.all([getRole(role), getCity(city), getCities()])
  if (!r || !cityRec) notFound()

  const schemas = [
    breadcrumbListSchema([
      { name: "Home", url: "/" }, { name: "For", url: "/" },
      { name: r.title }, { name: cityRec.name },
    ]),
    placeSchema({ city: cityRec.name, state: cityRec.state, lat: cityRec.lat, lng: cityRec.lng }),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <DetailHero
          breadcrumb={[{ label: "For" }, { label: `${r.title}s` }, { label: cityRec.name }]}
          eyebrow={`For ${r.title}s in ${cityRec.name}`}
          h1={<>Sales software built for the way <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>{r.title.toLowerCase()}s work.</span></>}
          sub={r.dailyStruggle}
          cta={
            <>
              <GlossLink variant="primary" size="md" href={APP_URLS.register}>
                Start free trial
                <span className="font-mono opacity-80">→</span>
              </GlossLink>
              <Link href="/demo" className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
                Book a demo →
              </Link>
            </>
          }
        />

        {/* HOW IT CHANGES THE DAY */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="01" tone="warm" label="How Leadkaun changes your day" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                From triage to action.
              </h2>
              <p className="mt-6 text-[17px] leading-[1.65] text-ink-soft">{r.leadkaunAngle}</p>
            </Reveal>
          </Container>
        </SectionGround>

        {/* FEATURES USED MOST */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10">
              <NumberedTag number="02" label={`Features ${r.title.toLowerCase()}s use most`} />
              <h2 className="mt-5 max-w-3xl text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[32px]">
                What to click first.
              </h2>
            </Reveal>

            <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              {r.featuresUsedMost.map((fSlug) => {
                const pretty = fSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
                return <IndustryTile key={fSlug} href={`/features/${fSlug}`} label={pretty} meta="Feature" />
              })}
            </Reveal>
          </Container>
        </SectionGround>

        {/* RELATED */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mb-8">
              <NumberedTag number="03" tone="warm" label="Same role, other cities" />
              <h2 className="mt-5 max-w-3xl text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[28px]">
                {r.title}s elsewhere in India.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="flex flex-wrap gap-2.5">
              {allCities.filter((c) => c.slug !== cityRec.slug).filter((c) => c.tier <= cityRec.tier + 1).slice(0, 8).map((c) => (
                <Link key={c.slug} href={`/for/${role}/${c.slug}`} className="inline-flex items-center rounded-full glass-1 gloss-edge px-4 py-2 text-[13px] font-medium text-ink-soft transition-all hover:text-sky-600 lift">
                  {r.title}s in {c.name}
                </Link>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        <CTABanner />
        <InternalLinksGrid />
        <Footer />
      </main>
    </>
  )
}
