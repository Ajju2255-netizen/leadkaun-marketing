/**
 * Per-page section numbering.
 *
 * Numbers were hand-written per section and drifted: /for/[role]/[city] skipped
 * "02" entirely, and /research/[slug] hardcoded "07" for a section that follows a
 * variable-length loop. Conditional sections made it worse — a `{cond && <X
 * number="05" />}` leaves a hole whenever cond is false.
 *
 * A counter fixes both. Server components build JSX top-down and `&&`
 * short-circuits before evaluating the element, so a skipped section never
 * consumes a number.
 *
 *   const n = createSectionNumbering()
 *   <NumberedTag number={n.next()} ... />        // "01"
 *   {maybe && <NumberedTag number={n.next()} />} // "02" only if rendered
 */
export function createSectionNumbering(start = 1) {
  let i = start
  return {
    next(): string {
      return String(i++).padStart(2, "0")
    },
    peek(): string {
      return String(i).padStart(2, "0")
    },
  }
}
