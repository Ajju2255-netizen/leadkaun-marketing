/**
 * Site-wide content review stamp.
 *
 * Brain 09 block 10 (review timestamp) was at zero coverage outside /blog. Rather
 * than back-date a per-record `updated` field we cannot substantiate, pages fall
 * back to the date the corpus was last reviewed as a whole. Records that carry
 * their own `updated` (e.g. best.json) override it.
 *
 * Bump this when a content pass actually happens — not on every deploy.
 */
export const CONTENT_REVIEWED = "August 2026"
export const CONTENT_REVIEWER = "the Leadkaun product team"
