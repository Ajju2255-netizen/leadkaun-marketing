/**
 * Content author registry (E-E-A-T).
 *
 * Google rewards content with a named, credible author over an anonymous org
 * byline. Add real people here (founders, operators) and reference them by key
 * in a post's `author:` frontmatter — the blog renders an AuthorCard + the right
 * JSON-LD (Person vs Organization) automatically.
 *
 * The default is HONESTLY typed as an Organization ("The Leadkaun Team"). Do not
 * invent a fake Person — that's the same trust problem we removed elsewhere. Add
 * real Person authors when you have them (see the TODO below).
 */
export type Author = {
  key: string
  name: string
  type: "Person" | "Organization"
  role?: string // jobTitle (Person) / shown under the name
  bio?: string
  url?: string // author page / LinkedIn — used as schema `url`
  avatar?: string // /authors/<key>.jpg
}

export const AUTHORS: Record<string, Author> = {
  team: {
    key: "team",
    name: "The Leadkaun Team",
    type: "Organization",
    role: "Operators building India's Sales Behaviour OS",
    bio: "Written by the Leadkaun team — operators and engineers who've run Indian B2B sales desks and now build the system that tells reps who to call next.",
  },
  // TODO (you): add real Person authors for stronger E-E-A-T, e.g.
  // founder: {
  //   key: "founder", name: "<Full Name>", type: "Person",
  //   role: "Founder, Leadkaun",
  //   bio: "<1–2 lines of real credentials — years in Indian B2B sales, etc.>",
  //   url: "https://www.linkedin.com/in/<handle>",
  //   avatar: "/authors/founder.jpg",
  // },
}

export const DEFAULT_AUTHOR_KEY = "team"

export function resolveAuthor(ref?: string): Author {
  if (ref && AUTHORS[ref]) return AUTHORS[ref]
  // A raw name in legacy frontmatter → a minimal Organization author, never a
  // fabricated Person.
  if (ref) return { key: ref.toLowerCase().replace(/\s+/g, "-"), name: ref, type: "Organization" }
  return AUTHORS[DEFAULT_AUTHOR_KEY]
}
