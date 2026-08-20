"use client"

import { Check } from "lucide-react"
import { SignupForm } from "@/app/components/signup-form"

/**
 * Post-result capture for the calculators.
 *
 * The calculators are the strongest lead magnets on the site — someone who has
 * moved the sliders has just told us their team size, lead volume and deal
 * value, and has seen a rupee figure they do not like. Until now that moment
 * captured nothing at all: no email, no event, no follow-up. The visitor read
 * the number and left.
 *
 * Deliberately NOT gated. Hiding the result behind an email wall is the
 * conventional move and it would cost more than it earns here: the number IS
 * the argument, and a visitor who never sees it has no reason to sign up. The
 * result stays free; this sits underneath it and asks for the obvious next
 * step once the number has done the persuading.
 *
 * It used to take an email and send the visitor to the app's register page to
 * fill a second, longer form. Someone who had just told us their team size,
 * their lead volume and their deal value was then asked to start over. It
 * renders the same SignupForm the hero does now, so the account is created
 * here and the visitor lands inside the product signed in. Lead capture still
 * happens on the way past, and `/api/lead` failing must never block the
 * submit: a lead we did not record is recoverable, a signup we blocked is not.
 */
export function CalcCapture({
  source,
  headline = "See this on your own leads",
  sub = "Leadkaun grades your real leads A to F the same day and prices what is going cold. Free forever on 1 user and 100 active leads.",
}: {
  /** Attribution tag, e.g. "calc-missed-revenue". Lands on the lead record. */
  source: string
  headline?: string
  sub?: string
}) {
  return (
    <div
      className="mt-10 rounded-2xl p-6 md:p-8"
      style={{ background: "var(--paper)", border: "1px solid var(--paper-line-2)" }}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-center lg:gap-12">
        <div>
          <h3 className="text-[21px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[24px]">
            {headline}
          </h3>
          <p className="mt-2.5 max-w-[52ch] text-[14.5px] leading-[1.6] text-ink-soft">{sub}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {["Free forever", "No credit card", "Setup the same day"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 text-[12px] text-ink-muted">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-100">
                  <Check className="h-2.5 w-2.5 text-emerald-600" strokeWidth={3} />
                </span>
                {t}
              </span>
            ))}
          </div>
        </div>

        <SignupForm source={source} />
      </div>
    </div>
  )
}
