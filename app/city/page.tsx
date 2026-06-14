import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"
import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { getCities } from "@/lib/pseo/lookup"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Leadkaun by City — Sales Behaviour OS for Indian B2B Teams",
  description:
    "Find Leadkaun for your city. Lead scoring, priority queues, and ₹-at-risk recovery for B2B sales teams across 625+ Indian cities — grouped by state.",
  alternates: { canonical: "/city" },
}

const TIER1_BLURB: Record<string, string> = {
  delhi: "Capital region · government + enterprise buyers",
  mumbai: "Financial capital · BFSI + real estate",
  bengaluru: "SaaS + tech · high-velocity pipelines",
  hyderabad: "Pharma + IT · enterprise cycles",
  chennai: "Manufacturing + auto · long cycles",
  kolkata: "Trading + education · relationship-led",
  pune: "Auto + IT services · growth SMBs",
  ahmedabad: "Manufacturing + textiles · SME-dense",
  jaipur: "Real estate + edtech · emerging metro",
  surat: "Textiles + diamonds · export-led",
}

export default async function CityDirectory() {
  const cities = await getCities()

  const tier1 = cities
    .filter((c) => c.tier === 1)
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))

  // group the full catalogue by state
  const byState = new Map<string, typeof cities>()
  for (const c of cities) {
    const k = c.state ?? "Other"
    if (!byState.has(k)) byState.set(k, [])
    byState.get(k)!.push(c)
  }
  const states = [...byState.entries()]
    .map(([state, list]) => ({
      state,
      list: [...list].sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.state.localeCompare(b.state))

  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow="Locations"
        h1={
          <>
            Leadkaun for your city,<br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}
            >
              across India.
            </span>
          </>
        }
        sub={`Lead scoring, priority queues, and ₹-at-risk recovery tuned for B2B sales teams in ${cities.length}+ Indian cities. Pick your city to see local context and the verticals we serve there.`}
        primary={undefined}
      />

      {/* Featured metros */}
      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="mb-10">
            <NumberedTag number="01" tone="warm" label="Top metros" />
            <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
              Start with the major hubs.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tier1.map((c) => (
              <Link
                key={c.slug}
                href={`/city/${c.slug}`}
                className="group relative flex items-start gap-3.5 rounded-2xl px-5 py-5 lift glass-1 gloss-edge elevate-1 hover:[background:linear-gradient(180deg,rgba(254,215,170,0.45)_0%,rgba(255,255,255,0.7)_100%)] hover:border-orange-400/45 transition-[background,border-color,box-shadow] duration-200"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "linear-gradient(180deg,#FFEDD5,#FED7AA)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)" }}
                >
                  <MapPin className="h-[19px] w-[19px] text-orange-500" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-ink transition-colors group-hover:text-orange-500">
                    {c.name}
                  </p>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-ink-muted">
                    {TIER1_BLURB[c.slug] ?? c.state}
                  </p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:text-orange-500" strokeWidth={1.75} />
              </Link>
            ))}
          </div>
        </Container>
      </SectionGround>

      {/* All cities by state */}
      <SectionGround variant="sky" size="lg">
        <Container>
          <div className="mb-10">
            <NumberedTag number="02" label="All cities" />
            <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
              Every city, by state.
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-[1.55] text-ink-soft">
              {cities.length} cities across {states.length} states &amp; union territories. Each city page covers local sales context and the verticals we serve there.
            </p>
          </div>

          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {states.map(({ state, list }) => (
              <div key={state} className="mb-7 break-inside-avoid rounded-2xl glass-1 gloss-edge p-5">
                <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-600">
                  {state}
                </h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {list.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/city/${c.slug}`}
                        className="text-[13.5px] text-ink-soft transition-colors hover:text-sky-600"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </SectionGround>

      <CTABanner />
      <Footer />
    </main>
  )
}
