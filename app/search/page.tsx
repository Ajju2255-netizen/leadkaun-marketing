import type { Metadata } from "next"
import { Suspense } from "react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { SearchClient } from "./search-client"

export const metadata: Metadata = {
  title: "Search — Leadkaun",
  description: "Search Leadkaun — features, comparisons, guides, glossary, research, and cities.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />
      <SectionGround variant="cream" size="lg">
        <Container>
          <div className="mx-auto mb-8 max-w-3xl">
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-ink md:text-[34px]">Search Leadkaun</h1>
            <p className="mt-2 text-[15px] text-ink-soft">Features, comparisons, guides, glossary, research and cities — all in one place.</p>
          </div>
          <Suspense fallback={<p className="text-center text-[14px] text-ink-muted">Loading search…</p>}>
            <SearchClient />
          </Suspense>
        </Container>
      </SectionGround>
      <Footer />
    </main>
  )
}
