import { revalidateTag, revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

/**
 * POST /api/revalidate
 *   Body: { tags?: string[], paths?: string[] }
 *   Header: Authorization: Bearer <REVALIDATE_TOKEN>
 *
 * Used by the R2 upload script (and CI) to flush the ISR cache for a
 * specific PSEO slice without redeploying the worker.
 *
 * The full slice-tag list lives in lib/pseo/lookup.ts (each loader tags
 * itself `pseo:<name>`).
 */

export const runtime = "nodejs"

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? ""
  const expected = process.env.REVALIDATE_TOKEN
  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let body: { tags?: string[]; paths?: string[] } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  const tagsRevalidated: string[] = []
  const pathsRevalidated: string[] = []

  for (const t of body.tags ?? []) {
    if (typeof t === "string" && t.length > 0) {
      revalidateTag(t)
      tagsRevalidated.push(t)
    }
  }
  for (const p of body.paths ?? []) {
    if (typeof p === "string" && p.startsWith("/")) {
      revalidatePath(p)
      pathsRevalidated.push(p)
    }
  }

  return NextResponse.json({
    ok: true,
    revalidated: { tags: tagsRevalidated, paths: pathsRevalidated },
    at: new Date().toISOString(),
  })
}
