/**
 * Bridges the two env type names in this project.
 *
 * `wrangler types` generates `Cloudflare.Env` (see worker-configuration.d.ts),
 * but @opennextjs/cloudflare's getCloudflareContext() types `.env` as
 * `CloudflareEnv`. Without this, every binding — including PSEO_DATA, which the
 * whole pSEO corpus reads from — appears untyped.
 *
 * Kept in its own file so regenerating worker-configuration.d.ts cannot drop it.
 */
declare global {
  interface CloudflareEnv extends Cloudflare.Env {}
}

export {}
