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
  url?: string // author page / profile, used as schema `url`
  avatar?: string // /authors/<key>.jpg
}

export const AUTHORS: Record<string, Author> = {
  // DEMOTED 2026-08 from Person to Organization.
  //
  // A schema.org Person with no avatar, no url and no sameAs is an E-E-A-T
  // LIABILITY, not an asset — it is precisely the pattern helpful-content
  // guidance targets, and it was shipping on 33 posts. An editorial byline is
  // the honest form until a real, verifiable person exists to attribute to.
  //
  // To reinstate a Person: add a real name, a populated `url` pointing at a
  // /authors/<key> page, and `sameAs` links that resolve. Not before.
  ananya: {
    key: "ananya",
    name: "The Leadkaun editorial team",
    type: "Organization",
    role: "Product & content, Leadkaun",
    bio: "Written and maintained by the team building Leadkaun, from the shipping product and its published scoring model. Product claims on this site are checked against code. See our methodology.",
  },
  team: {
    key: "team",
    name: "The Leadkaun Team",
    type: "Organization",
    role: "Operators building India's Sales Behaviour OS",
    bio: "Written by the Leadkaun team operators and engineers who've run Indian B2B sales desks and now build the system that tells reps who to call next.",
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
