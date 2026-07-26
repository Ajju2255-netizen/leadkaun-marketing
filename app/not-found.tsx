import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"

const LINKS = [
  { href: "/product", label: "Product" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/compare", label: "Compare CRMs" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/learn", label: "Learn" },
  { href: "/blog", label: "Blog" },
  { href: "/tools/missed-revenue-calculator", label: "Missed-revenue calculator" },
]

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />
      <SectionGround variant="pure" size="lg">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-sky-600">404</p>
            <h1 className="mt-4 text-[34px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[46px]">
              This page went cold.
            </h1>
            <p className="mt-5 text-[17px] leading-[1.6] text-ink-soft">
              The link you followed doesn&apos;t exist — or moved. Leadkaun is the Sales Behaviour OS for Indian B2B teams; here are the pages people usually want.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-2.5">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 rounded-full glass-1 gloss-edge px-4 py-2 text-[14px] font-medium text-ink-soft transition-all hover:text-sky-600 lift">
                  {l.label}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </SectionGround>
      <Footer />
    </main>
  )
}
