#!/usr/bin/env node
/**
 * Builds public/search-index.json — a lightweight client-side search index over
 * the editorial + commercial + hub pages (NOT the 20k pSEO long-tail; those are
 * reached via hubs). The /search page fetches this and filters in the browser.
 * Runs in postbuild alongside the sitemap.
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.join(__dirname, "..")
const DATA = path.join(ROOT, "data", "pseo")
const readJson = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"))
const out = []
const add = (title, url, type, text = "") => out.push({ t: title, u: url, k: type, x: text.slice(0, 160) })

// --- Curated core / money / company pages ---
const core = [
  ["Product — India's Sales Behaviour OS", "/product", "Page", "grade leads A-F, priority queue, missed revenue, 12 modules"],
  ["Pricing", "/pricing", "Page", "flat per account free starter growth scale enterprise INR"],
  ["Book a demo", "/demo", "Page", "15 minute demo see leadkaun score your leads"],
  ["How it works", "/how-it-works", "Page", "four steps import grade queue accountability"],
  ["Contact", "/contact", "Page", "sales support get in touch"],
  ["Security", "/security", "Page", "TLS razorpay PCI-DSS role-based access data protection"],
  ["About", "/about", "Page", "company mission sales behaviour os"],
  ["Compare — all CRM alternatives", "/compare", "Compare", "zoho hubspot salesforce pipedrive"],
  ["Alternatives to every CRM", "/alternatives", "Alternatives", "switch migrate"],
  ["Best software guides", "/best", "Guide", "best lead management whatsapp crm india"],
  ["Learn — topic guides", "/learn", "Learn", "pillars lead scoring whatsapp follow-up"],
  ["Research & benchmarks", "/research", "Research", "sourced data report india b2b sales"],
  ["Free tools & calculators", "/tools/missed-revenue-calculator", "Tool", "missed revenue ROI calculator"],
  ["Resources & templates", "/resources", "Resource", "downloadable templates trackers playbooks"],
  ["Integrations", "/integrations", "Integrations", "whatsapp csv google sheets"],
  ["Blog", "/blog", "Blog", "sales behaviour insights india"],
  ["Glossary", "/glossary", "Glossary", "sales terms definitions"],
  ["FAQ / Questions", "/questions", "Q&A", "common questions answered"],
  ["How-to guides", "/how-to", "How-to", "step by step workflows"],
]
core.forEach(([t, u, k, x]) => add(t, u, k, x))

// --- Features ---
const features = [
  ["Lead Scoring Engine", "lead-scoring"], ["Priority Queue", "priority-queue"],
  ["Missed Opportunity Engine", "missed-opportunity-engine"], ["Morning Brief", "morning-brief"],
  ["WhatsApp Tracking", "whatsapp-tracking"], ["Sales Rep Tracking", "sales-rep-tracking"],
]
features.forEach(([t, s]) => add(t, `/features/${s}`, "Feature", "product feature"))

// --- Data-driven collections ---
try { readJson("pillars.json").forEach((p) => add(p.title + " — complete guide", `/learn/${p.slug}`, "Learn", p.dek || "")) } catch {}
try { readJson("best.json").forEach((b) => add(b.h1, `/best/${b.slug}`, "Guide", b.metaDescription || "")) } catch {}
try { readJson("alternatives.json").forEach((a) => add(`${a.name} alternatives`, `/alternatives/${a.slug}`, "Alternatives", a.intro || "")) } catch {}
try { readJson("research.json").forEach((r) => add(r.h1, `/research/${r.slug}`, "Research", r.metaDescription || "")) } catch {}
try { readJson("glossary.json").forEach((g) => add(g.term, `/glossary/${g.slug}`, "Glossary", g.definitionShort || "")) } catch {}
try { readJson("questions.json").forEach((q) => add(q.question, `/questions/${q.slug}`, "Q&A", q.answerShort || "")) } catch {}
try { readJson("how-to.json").forEach((h) => add(h.title || h.slug, `/how-to/${h.slug}`, "How-to", h.tldr || "")) } catch {}
try { readJson("resources.json").forEach((r) => add(r.name, `/resources/${r.slug}`, "Resource", r.tagline || "")) } catch {}
try { readJson("integrations.json").filter((i) => i.status === "live").forEach((i) => add(i.name, `/integrations/${i.slug}`, "Integration", i.tagline || "")) } catch {}
try { readJson("industries.json").forEach((i) => add(`${i.name} — use case`, `/use-cases/${i.slug}`, "Industry", i.heroSub || "")) } catch {}

// --- Compare pages (hand-built dirs) ---
try {
  fs.readdirSync(path.join(ROOT, "app", "compare")).filter((d) => d.startsWith("leadkaun-vs-")).forEach((d) => {
    const name = d.replace("leadkaun-vs-", "").replace(/-/g, " ")
    add(`Leadkaun vs ${name}`, `/compare/${d}`, "Compare", "comparison feature matrix pricing")
  })
} catch {}

// --- Blog (titles from frontmatter) ---
try {
  const BLOG = path.join(ROOT, "content", "blog")
  fs.readdirSync(BLOG).filter((f) => f.endsWith(".md")).forEach((f) => {
    const raw = fs.readFileSync(path.join(BLOG, f), "utf8")
    const m = raw.match(/^---[\s\S]*?title:\s*["']?(.+?)["']?\s*(?:\n|---)/)
    const title = m ? m[1].trim() : f.replace(/\.md$/, "").replace(/-/g, " ")
    add(title, `/blog/${f.replace(/\.md$/, "")}`, "Blog", "")
  })
} catch {}

// --- Top cities (indexable hubs only) ---
try {
  const cities = readJson("cities.json").filter((c) => c.tier <= 2 || c.districts).sort((a, b) => b.population - a.population).slice(0, 120)
  cities.forEach((c) => add(`Lead management in ${c.name}`, `/city/${c.slug}`, "City", `${c.state}${c.notes ? " — " + c.notes : ""}`))
} catch {}

const dest = path.join(ROOT, "public", "search-index.json")
fs.writeFileSync(dest, JSON.stringify(out))
console.log(`✓ search-index.json — ${out.length} entries`)
