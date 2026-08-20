"use client"

import { Check, Sparkles } from "lucide-react"
import { SignupForm } from "@/app/components/signup-form"
import { APP_URLS } from "@/lib/urls"

/**
 * The hero signup card. A complete signup, not the first half of one.
 *
 * It used to collect a name, an email and a company, then send the visitor to
 * the app's /register page to fill a second form. Two forms on the highest
 * intent page in the funnel, and the second one opened by asking again for the
 * three things just typed. This card now asks for everything an account needs
 * and the visitor lands inside the product already signed in.
 *
 * It is a plain HTML form posting to app.leadkaun.com, and that is deliberate.
 * The submission is a top level navigation, so the app's response is first
 * party for its own host and its session cookie is accepted everywhere,
 * Safari included. It also means the password goes straight from the browser
 * to the app: this site's JavaScript never holds it and its server never sees
 * it. And because nothing here depends on fetch, the form still works if this
 * component fails to hydrate.
 *
 * The fields are deliberately identical to /register. Two ways in, one set of
 * questions, no second form either way.
 */
export function HeroSignupCard() {
  return (
    <div id="signup" className="relative mx-auto w-full max-w-md scroll-mt-24">
      {/* soft glow behind the card */}
      <div
        className="pointer-events-none absolute -inset-8 -z-10"
        style={{ background: "radial-gradient(55% 45% at 50% 8%, rgba(56,189,248,0.25), transparent 70%)" }}
      />

      {/* floating accent chip for depth */}
      <div className="pointer-events-none absolute -right-3 -top-3 z-20 hidden -rotate-3 sm:block">
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 glass-peach gloss-edge elevate-2">
          <Sparkles className="h-3.5 w-3.5 text-orange-500" strokeWidth={2.2} />
          <span className="font-mono text-[11px] font-semibold text-orange-500">Free · no card</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] glass-3 gloss-edge elevate-3 p-6 md:p-7">
        {/* top gradient hairline */}
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, #38BDF8 0%, #06B6D4 50%, #FB923C 100%)" }}
        />

        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">Start free</span>
        </div>

        <h2 className="mt-3.5 text-[22px] font-bold tracking-[-0.025em] text-ink">Create your free account</h2>
        <p className="mt-1.5 text-[13.5px] leading-[1.5] text-ink-soft">
          Grade your leads A to F the same day. No credit card.
        </p>

        <SignupForm source="hero-signup-form" className="mt-5" />

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

        <p className="mt-4 border-t border-hairline pt-4 text-center text-[13px] text-ink-soft">
          Already have an account?{" "}
          <a href={APP_URLS.login} className="font-semibold text-sky-600 underline-offset-4 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
