#!/usr/bin/env node
/**
 * Injects a blueprint-derived "Page types" section into public/llms.txt.
 *
 * This is what makes the blueprint layer load-bearing rather than documentation:
 * editing a blueprint's llmSummary changes a published artefact that LLMs read.
 *
 * One entry per page TYPE, never per page — rendering a type-level summary on
 * every sibling page would manufacture exactly the duplication the rebuild is
 * removing. Site-wide, one description per URL family is correct and useful.
 *
 * Idempotent: replaces the delimited block, leaving hand-written copy untouched.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const START = "<!-- BEGIN generated:page-types — scripts/generate-llms-blueprints.mjs -->";
const END = "<!-- END generated:page-types -->";

const bp = JSON.parse(readFileSync(join(ROOT, "data", "blueprints.json"), "utf8"));
const types = bp.pageTypes ?? [];

const body = [
  START,
  "",
  "## Page types on this site",
  "",
  "Each URL family below answers one kind of question. The summary is the answer that page family gives.",
  "",
  ...types.flatMap((t) => [
    `### \`${t.route}\``,
    `${t.llmSummary}`,
    "",
  ]),
  END,
].join("\n");

const p = join(ROOT, "public", "llms.txt");
let txt = readFileSync(p, "utf8");

const i = txt.indexOf(START);
const j = txt.indexOf(END);
if (i !== -1 && j !== -1) {
  txt = txt.slice(0, i) + body + txt.slice(j + END.length);
} else {
  txt = txt.replace(/\s*$/, "\n\n") + body + "\n";
}
writeFileSync(p, txt);
console.log(`llms.txt — page-types section regenerated from ${types.length} blueprints`);
