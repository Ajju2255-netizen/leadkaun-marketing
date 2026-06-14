import { APP_URLS } from "@/lib/urls"
import { Container } from "@/app/components/container"
import { NumberedTag } from "@/app/components/numbered-tag"
import { SectionGround } from "@/app/components/section-ground"
import { GradientBlob } from "@/app/components/gradient-blob"
import { GlossLink, GlossNavLink } from "@/app/components/gloss-button"

type Props = {
  /** Optional override of the numbered tag */
  tag?: { number: string; label: string }
  headline?: string
  sub?: string
  primaryLabel?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export default function CTABanner({
  tag,
  headline = "Your reps open their queue tomorrow.",
  sub = "Setup in 60 minutes. 14-day free trial. No credit card required.",
  primaryLabel = "Start free trial",
  secondaryLabel = "Book a 15-min demo",
  secondaryHref = "/demo",
}: Props) {
  return (
    <SectionGround variant="mesh" size="xl" ambient={false}>
      {/* Stronger blobs to bookend the page with the hero */}
      <GradientBlob color="sky"    size="xl" position="-top-40 -left-40"   intensity={0.65} />
      <GradientBlob color="peach"  size="xl" position="-bottom-40 -right-40" intensity={0.75} delay={3} />
      <GradientBlob color="cyan"   size="lg" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" intensity={0.30} delay={5} />

      <Container className="relative">
        <div className="mx-auto max-w-3xl rounded-3xl glass-3 gloss-edge px-8 py-14 md:px-14 md:py-20 text-center">
          {tag && (
            <div className="mb-6 flex justify-center">
              <NumberedTag number={tag.number} label={tag.label} />
            </div>
          )}
          <h2 className="text-[36px] md:text-[56px] font-semibold tracking-[-0.035em] leading-[1.05] text-ink">
            {headline}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-[1.6] text-ink-soft">
            {sub}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <GlossLink variant="primary" size="lg" href={APP_URLS.register}>
              {primaryLabel}
              <span className="font-mono opacity-80">→</span>
            </GlossLink>
            <GlossNavLink variant="warm" size="lg" href={secondaryHref}>
              {secondaryLabel}
            </GlossNavLink>
          </div>
        </div>
      </Container>
    </SectionGround>
  )
}
