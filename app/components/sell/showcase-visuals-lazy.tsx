"use client"

import dynamic from "next/dynamic"

/* Loads the heavy product visuals on the client only (ssr:false), so the
   Worker never SSRs them. A same-size skeleton keeps the layout stable. */
const ShowcaseVisuals = dynamic(() => import("./showcase-visuals"), {
  ssr: false,
  loading: () => (
    <div className="grid items-start gap-6 lg:grid-cols-[0.96fr_1.04fr] lg:gap-8" aria-hidden>
      <div className="h-[340px] rounded-[28px] glass-2 elevate-2 gloss-edge animate-pulse" />
      <div className="flex flex-col gap-6">
        <div className="h-[150px] rounded-3xl glass-2 elevate-2 gloss-edge animate-pulse" />
        <div className="h-[150px] rounded-3xl glass-2 elevate-2 gloss-edge animate-pulse" />
      </div>
    </div>
  ),
})

export default function ShowcaseVisualsLazy() {
  return <ShowcaseVisuals />
}
