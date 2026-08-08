/**
 * "Who signs off" — the page-specific replacement for the product mock.
 *
 * industries.json carries a `buyerRoles` list on every industry and nothing has
 * ever rendered it. It is the one piece of genuinely per-industry market data
 * left unused, and it doubles as a link into /for/[role]/[city].
 *
 * Why not reuse roles.json `dailyStruggle` / `leadkaunAngle` here: both are
 * written in second person for the role's own page, and both contain uncited
 * figures ("40% of your week", "90% of status questions"). Repeating them would
 * duplicate that page and drag quarantined stats onto 17k more URLs. The
 * clauses below are written for this context: what the person weighs when an
 * enquiry lands, stated plainly, with no numbers and no product claims.
 */

import { pickN, stableHash } from "@/lib/pseo/variation"

/** One clause per role slug in roles.json. Keep them free of statistics. */
const WEIGHS: Record<string, string> = {
  founder:
    "Wants to know whether this enquiry is worth anyone's afternoon before the team spends one.",
  "sales-head":
    "Cares less about the single lead than about whether the team is working the right ones this week.",
  "sales-manager":
    "Has to defend the call order in Monday's review, so the reason a lead ranks where it does has to survive being questioned.",
  "sales-rep":
    "Wants one clear answer to who to ring next, not a list to re-sort every morning.",
  "branch-manager":
    "Is answerable for what the branch did with the enquiry, which makes a written trail worth more than a recollection.",
  "business-development":
    "Is looking for whether this opens an account worth developing, not whether it closes this month.",
  "admissions-counselor":
    "Is judging urgency against the intake calendar. The same enquiry means different things in and out of season.",
  broker:
    "Is deciding whether the requirement matches inventory actually available right now.",
  "relationship-manager":
    "Is weighing the enquiry against the book already being serviced, because attention spent here is attention taken from there.",
  "account-manager":
    "Is checking whether this is genuinely new or an existing account arriving through a second door.",
}

export type CommitteeMember = {
  slug: string
  title: string
  seniority: string
  weighs: string
}

/**
 * Lower-case an industry name for mid-sentence use, but leave acronyms and
 * mixed-case names alone — "BFSI" must not become "bfsi", nor "SaaS" "saas".
 */
export function subjectNoun(name: string): string {
  return name
    .split(" ")
    .map((w) => (/^[A-Z][a-z]+$/.test(w) ? w.toLowerCase() : w))
    .join(" ")
}

/**
 * Seeded subset of an industry's buying committee.
 *
 * Seeding by city means two cities in the same industry surface different
 * members where the industry lists more than `n`, so neighbouring pages do not
 * read as one template with the place name swapped.
 */
export function buildCommittee(
  buyerRoles: readonly string[],
  roles: readonly { slug: string; title: string; seniority: string }[],
  seedKey: string,
  n = 3,
  exclude?: string
): CommitteeMember[] {
  const resolved = buyerRoles
    .filter((slug) => slug !== exclude)
    .map((slug) => roles.find((r) => r.slug === slug))
    .filter((r): r is { slug: string; title: string; seniority: string } => Boolean(r))
    .filter((r) => WEIGHS[r.slug])

  return pickN(resolved, Math.min(n, resolved.length), stableHash(seedKey)).map((r) => ({
    slug: r.slug,
    title: r.title,
    seniority: r.seniority,
    weighs: WEIGHS[r.slug],
  }))
}

/** Openings vary by angle so the section does not read identically across pages. */
const OPENINGS: ReadonlyArray<(c: { subject: string; where: string }) => string> = [
  (c) => `A ${c.subject} enquiry${c.where} is rarely decided by one person. Two or three read it, and they are not reading it for the same thing.`,
  (c) => `More than one person forms a view on every ${c.subject} enquiry${c.where}, and they weigh it differently.`,
  (c) => `Before a ${c.subject} lead${c.where} gets worked properly, it passes the judgement of two or three people with different stakes in it.`,
  (c) => `The people who decide what happens to a ${c.subject} enquiry${c.where} are not one audience. Each is asking their own question of it.`,
]

export function committeeOpening(subject: string, cityName: string | undefined, seedKey: string): string {
  const where = cityName ? ` in ${cityName}` : ""
  const pool = OPENINGS
  return pool[stableHash(seedKey) % pool.length]({ subject, where })
}
