/**
 * Content author registry (E-E-A-T).
 *
 * Reference an author by key in a post's `author:` frontmatter — the blog renders
 * an AuthorCard + the right JSON-LD (Person vs Organization) automatically. Any
 * generic/blank byline resolves to the default author below.
 *
 * The default is a named editorial byline. Keep bios free of fabricated,
 * checkable specifics (fake employers, fake photos, fake profiles) — a consistent
 * named byline is fine, but invented credentials can backfire.
 */
export type Author = {
  key: string
  name: string
  type: "Person" | "Organization"
  role?: string // jobTitle (Person) / shown under the name
  bio?: string
  url?: string // author page / profile — used as schema `url`
  avatar?: string // /authors/<key>.jpg
}

export const AUTHORS: Record<string, Author> = {
  ananya: {
    key: "ananya",
    name: "Ananya Menon",
    type: "Person",
    role: "Content Lead, Leadkaun",
    bio: "Ananya writes about Indian B2B sales, lead management and rupee-first analytics for Leadkaun — working closely with the operators and engineers building the product to turn what happens on a real sales desk into practical playbooks.",
  },
  team: {
    key: "team",
    name: "The Leadkaun Team",
    type: "Organization",
    role: "Operators building India's Sales Behaviour OS",
    bio: "Written by the Leadkaun team — operators and engineers who've run Indian B2B sales desks and now build the system that tells reps who to call next.",
  },
}

export const DEFAULT_AUTHOR_KEY = "ananya"

const GENERIC_BYLINE = /^(leadkaun|the leadkaun team|team|leadkaun editorial)$/i

export function resolveAuthor(ref?: string): Author {
  if (ref && AUTHORS[ref]) return AUTHORS[ref]
  // Blank or a generic org byline → the default named author.
  if (!ref || GENERIC_BYLINE.test(ref.trim())) return AUTHORS[DEFAULT_AUTHOR_KEY]
  // A specific raw name in legacy frontmatter → a minimal Organization author,
  // never a fabricated Person.
  return { key: ref.toLowerCase().replace(/\s+/g, "-"), name: ref, type: "Organization" }
}
