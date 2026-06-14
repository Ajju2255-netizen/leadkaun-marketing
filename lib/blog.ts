import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"

/**
 * Blog data layer — reads Markdown files from content/blog/ at build time,
 * parses frontmatter with gray-matter, renders body via marked.
 *
 * Each post is an .md file with YAML frontmatter (see `BlogPost` type).
 */

export type BlogFaq = { q: string; a: string }

export type BlogPostFrontmatter = {
  title: string
  description: string
  date: string                       // ISO 8601
  updated?: string                   // ISO 8601
  category: BlogCategorySlug
  pillar: number                     // 1..10
  author?: string
  tags?: string[]
  cover?: string                     // /blog/... optional image
  readingTime?: string               // e.g. "8 min read"
  faqs?: BlogFaq[]
}

export type BlogPost = BlogPostFrontmatter & {
  slug: string
  body: string                       // raw Markdown
  html: string                       // rendered HTML
}

export type BlogCategorySlug =
  | "lead-management"
  | "sales-behaviour"
  | "rupee-first-analytics"
  | "real-estate-sales"
  | "edtech-sales"
  | "bfsi-insurance"
  | "crm-alternatives"
  | "sales-team-management"
  | "whatsapp-b2b-sales"
  | "startup-smb-sales-ops"

/** A down-funnel commercial link surfaced on a category hub (→ /compare, /features, /pricing). */
export type CategoryMoneyLink = { label: string; href: string; note?: string }

export type BlogCategory = {
  slug: BlogCategorySlug
  title: string
  pillar: number
  description: string
  color: string
  /** Primary target keyword for the hub (cluster term — distinct from /compare exact terms). */
  keyword?: string
  /** SEO overrides (Keyword-Matrix formulas). Fall back to title/description when absent. */
  metaTitle?: string
  metaDescription?: string
  /** 80–120 word direct answer — the AIO/GEO citation hook rendered at the top of the hub. */
  quickAnswer?: string
  /** Pinned cornerstone post slug; falls back to the latest post when absent. */
  featuredSlug?: string
  /** Category-level, buying-intent FAQs (also emitted as FAQPage JSON-LD). */
  faqs?: BlogFaq[]
  /** Conversion bridge: links down to money pages (/compare, /features, /pricing). */
  moneyLinks?: CategoryMoneyLink[]
}

export const CATEGORIES: BlogCategory[] = [
  {
    slug: "lead-management",
    title: "Lead Management",
    pillar: 1,
    color: "#F59E0B",
    description: "Scoring, prioritisation, and response-time playbooks for Indian B2B SMBs — the cornerstone pillar.",
    keyword: "lead management india",
    metaTitle: "Lead Management for Indian B2B Teams — Scoring, Priority & Response Time",
    metaDescription: "Practical lead management for Indian sales teams: how to grade leads A–F, build a priority queue, hit the response-time window, and stop leads going cold. Written for SMBs, in rupees.",
    quickAnswer:
      "Lead management in India isn't about storing more contacts — it's about working the right lead next, fast. Three things decide whether a lead converts: fit (does it match your ICP), intent (how engaged, and how recently), and speed (Grade A leads convert when you reach them inside ~47 minutes). Most SMBs lose pipeline not to bad leads but to good leads contacted on day two. The fix is a system that grades every lead A–F, ranks each rep's day, and flags ₹ at risk before a hot lead cools — not a bigger spreadsheet.",
    featuredSlug: "what-is-lead-scoring-india-b2b",
    faqs: [
      { q: "What is lead management, in plain terms?", a: "It's the discipline of capturing every lead, scoring it for fit and intent, routing it to the right rep, and following up before it goes cold — then measuring what slipped. For Indian SMBs the highest-leverage parts are scoring (so reps know who to call first) and response time (Grade A leads convert when contacted within ~47 minutes)." },
      { q: "How do I prioritise leads when reps have 200+ in the pipe?", a: "Stop sorting by recency or who shouts loudest. Score each lead on fit (ICP match), intent (engagement with time-decay), and quality (data reliability) into a Grade A–F, then work the queue top-down. Leadkaun's Priority Queue does this automatically and re-ranks in real time as new signals land." },
      { q: "What's a good lead response time in India?", a: "Faster than you think. Grade A leads convert at the highest rate when contacted within roughly 47 minutes; most Indian SMB teams average several hours to a day. The gap between those two is where the pipeline leaks — and it's measurable in rupees." },
      { q: "Do I need a CRM for lead management?", a: "Not necessarily a heavy one. A solo founder can run on a spreadsheet. Once multiple reps work hundreds of leads and follow-ups slip, you need scoring, a priority queue, and reminders — which a record-keeping CRM doesn't provide. That's the behaviour layer Leadkaun adds." },
    ],
    moneyLinks: [
      { label: "Lead Scoring (Grade A–F)", href: "/features/lead-scoring", note: "Every lead graded in under 500ms." },
      { label: "Priority Queue", href: "/features/priority-queue", note: "The list that tells reps who to call next." },
      { label: "Missed Opportunity Engine", href: "/features/missed-opportunity-engine", note: "See ₹ slipping before it's gone." },
      { label: "See pricing", href: "/pricing", note: "Plans from ₹999/rep/month." },
    ],
  },
  {
    slug: "sales-behaviour",
    title: "Sales Behaviour & Productivity",
    pillar: 2,
    color: "#6366F1",
    description: "Shifting Indian sales teams from activity tracking to behaviour-level accountability.",
    keyword: "sales behaviour tracking",
    metaTitle: "Sales Behaviour & Productivity — Track What Reps Do, Not Just Activity",
    metaDescription: "Activity dashboards (calls made, emails sent) flatter everyone and predict nothing. Track sales behaviour instead — response time, follow-up discipline, working the right lead next — and coach without micromanaging.",
    quickAnswer:
      "Activity is what reps did; behaviour is whether they did the right thing. A rep can log 60 calls and still miss every Grade A lead. The behaviours that actually predict revenue are response time on hot leads, follow-up completion, and whether reps work the priority order instead of whoever shouts loudest. The shift that matters for Indian SMBs is from counting activity to measuring behaviour — then coaching on it with a daily ritual (the Morning Brief) and per-rep rollups that show ₹ recovered, not just tasks closed.",
    featuredSlug: "how-to-track-sales-behaviour-not-just-activity",
    faqs: [
      { q: "What's the difference between sales activity and sales behaviour?", a: "Activity is volume — calls made, emails sent, meetings booked. Behaviour is quality and discipline — how fast a rep responds to a Grade A lead, whether follow-ups happen on time, whether the priority order is respected. Activity dashboards make busy reps look productive; behaviour metrics show who actually moves revenue." },
      { q: "How do I track sales behaviour without micromanaging?", a: "Measure outcomes and habits, not keystrokes. Leadkaun's Sales Rep Tracking surfaces per-rep response time, follow-up completion, and ₹ recovered — so 1:1s become specific coaching, not surveillance. The Morning Brief gives reps their own priorities at 8:30 AM IST, which builds self-direction." },
      { q: "Which behaviours predict revenue?", a: "Three repeatedly: speed to first contact on high-grade leads (the ~47-minute window), follow-up completion rate, and adherence to the priority queue. Teams that improve those three see more pipeline converted from the same lead volume." },
      { q: "Can a CRM track behaviour?", a: "Most record activity, not behaviour — they store what was logged but don't tell you whether the right lead was worked first or whether ₹ is slipping. That's the behaviour layer a Sales Behaviour OS adds on top." },
    ],
    moneyLinks: [
      { label: "Sales Rep Tracking", href: "/features/sales-rep-tracking", note: "Per-rep ₹ recovered, response time, follow-up rate." },
      { label: "Morning Brief", href: "/features/morning-brief", note: "The 8:30 AM ritual that sets the day." },
      { label: "WhatsApp Tracking", href: "/features/whatsapp-tracking", note: "3-tap logging reps actually use." },
      { label: "What is a Sales Behaviour OS?", href: "/product", note: "The category, explained." },
    ],
  },
  {
    slug: "rupee-first-analytics",
    title: "Rupee-First Analytics",
    pillar: 3,
    color: "#10B981",
    description: "₹ at risk, missed revenue, and the metrics that actually move commission conversations.",
    keyword: "sales analytics rupee at risk",
    metaTitle: "Rupee-First Sales Analytics — Measure ₹ at Risk, Not Vanity Percentages",
    metaDescription: "Percentages hide money; rupees move people. Learn to measure missed revenue, ₹ at risk, and the cost of a slow follow-up — the analytics that make founders and reps actually act.",
    quickAnswer:
      "A 12% conversion rate means nothing to a rep at 9 PM; ₹14 lakh slipping this week means everything. Rupee-first analytics reframes every sales metric in money: not 'response time up 30%' but '₹6 lakh of Grade A pipeline saved'; not 'leads aging' but '₹ at risk if no one calls by Friday'. For Indian SMBs thinking in lakhs and crores, this is the difference between a dashboard people ignore and a number that changes behaviour the same day.",
    featuredSlug: "cost-of-a-missed-lead-india",
    faqs: [
      { q: "What does '₹ at risk' actually mean?", a: "It's the expected rupee value of leads that will likely go cold if no one acts — high-grade leads aging past their follow-up window, multiplied by their probability and deal size. Leadkaun's Missed Opportunity Engine computes it continuously, so a manager can answer 'what's at risk this week?' in one glance instead of an afternoon of filtering." },
      { q: "Why measure rupees instead of percentages?", a: "Percentages abstract away urgency and are easy to argue with. Rupees are concrete and personal — a rep protects ₹8 lakh of pipeline more readily than they chase 'a 4-point conversion lift'. ₹-first metrics drive faster action and cleaner commission conversations." },
      { q: "How do I calculate the cost of a missed lead?", a: "Take the lead's expected deal value, multiply by the conversion probability at its grade, and weight by how recoverable it still is. Do that across every aging lead and you get the team's ₹ at risk — the single most motivating number on the dashboard." },
      { q: "What's the one metric a sales manager should watch daily?", a: "₹ at risk this week, broken down by rep. It tells you where revenue is leaking and who needs help today — far more actionable than activity counts or a lagging conversion percentage." },
    ],
    moneyLinks: [
      { label: "Missed Opportunity Engine", href: "/features/missed-opportunity-engine", note: "₹ at risk, surfaced every day." },
      { label: "Sales Rep Tracking", href: "/features/sales-rep-tracking", note: "₹ recovered, per rep." },
      { label: "See pricing", href: "/pricing", note: "ROI in rupees, from ₹999/rep/month." },
      { label: "Book a demo", href: "/demo", note: "See your ₹-at-risk number live." },
    ],
  },
  {
    slug: "real-estate-sales",
    title: "Real Estate Sales",
    pillar: 4,
    color: "#EF4444",
    description: "Property enquiry follow-up, the 47-minute window, and priority queues for Indian real estate teams.",
    keyword: "real estate lead management india",
    metaTitle: "Real Estate Sales in India — Enquiry Follow-Up, Scoring & Priority Queues",
    metaDescription: "Property enquiries arrive from 99acres, Housing and MagicBricks and go cold in hours. Learn how Indian real estate teams follow up inside the window, prioritise site-visit-likely leads, and recover ₹ from stale enquiries.",
    quickAnswer:
      "Real estate leads are perishable. An enquiry from 99acres or MagicBricks is hot for a few hours, but most teams call back the next day — after the buyer has spoken to three other projects. The teams that win site visits do three things: respond inside the window (Grade A converts within ~47 minutes), prioritise the enquiries most likely to visit instead of calling in arrival order, and log every WhatsApp thread so nothing slips. With GCV deal bands of ₹40 lakh to ₹3 crore, one recovered enquiry pays for the software many times over.",
    featuredSlug: "real-estate-lead-follow-up-best-practices-india",
    faqs: [
      { q: "Why do real estate teams lose property enquiries?", a: "Three reasons: enquiries come from 6+ portals with no unified view, the high-intent window is only a few hours but teams follow up after 24, and reps call in arrival order rather than by likelihood to visit. The leak is rarely lead quality — it's speed and prioritisation." },
      { q: "What's the ideal follow-up time for a property enquiry?", a: "Inside the hour wherever possible — Grade A leads convert at the highest rate when contacted within roughly 47 minutes. For a ₹40 lakh–₹3 crore purchase, the builder who calls first and books the site visit usually wins, regardless of project." },
      { q: "How should I prioritise property leads?", a: "Score each enquiry on fit (budget, location, configuration), intent (portal behaviour, repeat enquiries, WhatsApp replies) and quality (real number, complete data). Work the resulting Grade A–F queue top-down. Leadkaun builds and re-ranks this queue automatically." },
      { q: "Can I track WhatsApp property enquiries?", a: "Yes — and you should, because most buyers reply on WhatsApp before they pick up a call. Leadkaun's 3-tap logging turns each WhatsApp thread into a scored, queued lead without breaking the rep's flow." },
    ],
    moneyLinks: [
      { label: "Real Estate use case", href: "/use-cases/real-estate", note: "Built for property enquiry follow-up." },
      { label: "Priority Queue", href: "/features/priority-queue", note: "Work site-visit-likely leads first." },
      { label: "WhatsApp Tracking", href: "/features/whatsapp-tracking", note: "Log portal + WhatsApp enquiries in 3 taps." },
      { label: "Missed Opportunity Engine", href: "/features/missed-opportunity-engine", note: "Recover enquiries going cold." },
    ],
  },
  {
    slug: "edtech-sales",
    title: "EdTech Sales",
    pillar: 5,
    color: "#3B82F6",
    description: "Student lead management, parent WhatsApp threads, and admissions-cycle scoring for Indian EdTech teams.",
    keyword: "edtech lead management india",
    metaTitle: "EdTech Sales in India — Student Lead Management & Admissions Prioritisation",
    metaDescription: "Admissions counsellors drown in 200–500 leads a day from ads and WhatsApp. Learn how Indian EdTech teams score student leads, prioritise the hot ones, and follow up across the admissions cycle without losing fees.",
    quickAnswer:
      "EdTech sales is a volume game with a timing problem. An admissions counsellor can get 200–500 leads a day from ad campaigns and WhatsApp, then spend 30 minutes every morning guessing which to call. Most hot leads — a parent who replied at 11 PM, a student who watched the full demo — get buried under the pile. The fix is scoring every enquiry on fit and intent, surfacing the 8–10 that will actually enrol, and treating parent WhatsApp threads as first-class signal. With annual fees from ₹15,000 to ₹15 lakh, the counsellor who calls the right lead first wins the admission.",
    featuredSlug: "edtech-student-lead-management-india",
    faqs: [
      { q: "How do EdTech teams manage 300+ leads a day?", a: "Not by calling them in order. They score each lead on fit (programme match, location, budget) and intent (demo watched, WhatsApp replies, repeat visits), then work a Grade A–F priority queue. Leadkaun surfaces the handful most likely to enrol so counsellors stop triaging and start calling." },
      { q: "Why is WhatsApp so important in EdTech sales?", a: "Because parents and students reply there, often after hours, and rarely pick up cold calls. A WhatsApp reply is a strong intent signal — but it's invisible to most CRMs. Logging it in 3 taps turns it into a scored, queued lead instead of a message that scrolls away." },
      { q: "How does the admissions cycle change lead scoring?", a: "Intent decays differently near deadlines — a lead that's lukewarm in month one can spike as admission cut-offs approach. Time-aware scoring (intent with decay, re-ranked daily) keeps the queue honest as the cycle moves, instead of relying on a one-time score." },
      { q: "What does a missed EdTech lead cost?", a: "A single enrolment can be worth ₹15,000 to ₹15 lakh in annual fees. When a hot lead goes cold because no one called within the window, that's the ₹ at risk — and across hundreds of daily leads it compounds fast." },
    ],
    moneyLinks: [
      { label: "EdTech use case", href: "/use-cases/edtech", note: "Built for admissions teams." },
      { label: "WhatsApp Tracking", href: "/features/whatsapp-tracking", note: "Parent/student WhatsApp as real signal." },
      { label: "Priority Queue", href: "/features/priority-queue", note: "Find the 8 hot leads inside 300." },
      { label: "Morning Brief", href: "/features/morning-brief", note: "Counsellors start with the right leads." },
    ],
  },
  {
    slug: "bfsi-insurance",
    title: "BFSI & Insurance",
    pillar: 6,
    color: "#14B8A6",
    description: "Insurance agent tracking, renewals, and compliance-ready audit trails for Indian BFSI teams.",
    keyword: "insurance lead management india",
    metaTitle: "BFSI & Insurance Sales in India — Agent Tracking, Renewals & Lead Management",
    metaDescription: "Insurance branches run 10–40 agents on leads from PolicyBazaar, BankBazaar and referrals. Learn how Indian BFSI teams manage leads, catch lapsing renewals early, and hold agents accountable with audit-ready records.",
    quickAnswer:
      "BFSI sales has two leaks: new leads that age out and renewals that lapse unnoticed. A branch manager running 10–40 agents on leads from PolicyBazaar, BankBazaar and referrals usually has activity reports but no answer to 'which agent is sitting on ₹ at risk right now?'. The teams that fix this score every lead, hold agents accountable on outcomes (₹ recovered per agent, not calls logged), flag renewals 30 days before they lapse, and keep an audit-ready trail for compliance. With premium bands from ₹8,000 to ₹2 lakh, a few recovered renewals a month change the branch's number.",
    featuredSlug: "insurance-lead-management-india",
    faqs: [
      { q: "How should insurance branches manage leads?", a: "Score every lead on fit (product match, eligibility) and intent (engagement, callback requests), route to the right agent, and work a priority queue. Crucially, track renewals as their own pipeline — a lapsing policy is a lead with a deadline, and Leadkaun's Missed Opportunity Engine flags it before it's gone." },
      { q: "How do I track insurance agent performance fairly?", a: "Measure outcomes, not activity theatre. Per-agent ₹ recovered, response time on high-grade leads, and follow-up completion tell you who's effective. Leadkaun's Sales Rep Tracking surfaces this per agent, with an audit-ready record for compliance reviews." },
      { q: "How do I stop renewals from lapsing?", a: "Treat every upcoming renewal as a dated lead. Surface it 30 days out, assign it, and track ₹ at risk if it isn't actioned. Cross-sell signals (a customer browsing a second product) should flag the same way." },
      { q: "Is the record compliance-ready?", a: "Yes — a complete, exportable trail of who contacted whom, when, and with what outcome supports BFSI compliance and audit needs, without reps having to maintain it by hand." },
    ],
    moneyLinks: [
      { label: "BFSI use case", href: "/use-cases/bfsi", note: "Built for branches, agents and renewals." },
      { label: "Sales Rep Tracking", href: "/features/sales-rep-tracking", note: "Per-agent ₹ accountability + audit trail." },
      { label: "Missed Opportunity Engine", href: "/features/missed-opportunity-engine", note: "Catch lapsing renewals 30 days early." },
      { label: "Morning Brief", href: "/features/morning-brief", note: "Branch managers see ₹ at risk daily." },
    ],
  },
  {
    slug: "crm-alternatives",
    title: "CRM Alternatives",
    pillar: 7,
    color: "#F97316",
    description: "When to leave Zoho, Salesforce, HubSpot or LeadSquared — and what actually works for Indian B2B SMBs.",
    keyword: "crm alternatives india",
    metaTitle: "CRM Alternatives in India (2026) — When to Leave Zoho, Salesforce, HubSpot & LeadSquared",
    metaDescription: "The honest guide to CRM alternatives for Indian B2B teams. When to leave Zoho, Salesforce, HubSpot or LeadSquared, what to switch to by job-to-be-done, and how to migrate in weeks — not months.",
    quickAnswer:
      "Most Indian SMBs don't have a CRM problem — they have a fit problem. Salesforce is built for 200+ rep enterprises; HubSpot is USD-priced; Zoho and LeadSquared record activity but rarely change what reps do next. Pick by the job-to-be-done: Zoho or LeadSquared for workflow CRM, HubSpot for marketing-led pipelines, and Leadkaun when you need a Sales Behaviour OS that grades every lead A–F, builds each rep's priority queue, and surfaces ₹ at risk daily. Switching is a 2–4 week migration, not a 6-month consulting project — and usually cuts licence cost 50–80%.",
    featuredSlug: "why-indian-companies-leave-salesforce",
    faqs: [
      { q: "What is the best CRM alternative for Indian SMBs in 2026?", a: "There is no single best — it depends on the job. For workflow CRM at SMB price, Zoho CRM or LeadSquared (₹1,200–₹3,000/rep/month). For marketing-led pipelines, HubSpot (strongest automation, but USD-priced). For changing how reps sell — grading leads A–F, a real-time priority queue, and ₹-at-risk visibility — Leadkaun (₹999–₹2,999/rep/month), which usually runs alongside an existing CRM for 60–90 days, then consolidates." },
      { q: "When should an Indian company leave Salesforce?", a: "Salesforce earns its cost at ~200+ reps, in regulated industries, or with a dedicated admin. Below that, most Indian SMBs run a tool built for enterprises at 20–40% rep adoption while paying ₹7,500+/rep/month. If your reps don't log calls and your manager can't answer 'what's ₹ at risk this week', you've outgrown the fit, not the size." },
      { q: "Is HubSpot too expensive for Indian teams?", a: "HubSpot's paid tiers are USD-priced and roughly 2× most Indian alternatives, and the free tier breaks once you need automation or more than a few seats. For marketing-heavy pipelines it can still be worth it; for sales-behaviour problems, a ₹-priced India-built tool plus HubSpot's free CRM is often the cheaper, higher-adoption combination." },
      { q: "How long does it take to switch CRMs?", a: "For most Indian SMBs, 2–4 weeks: week 1 export + audit (30–60% of CRM data is usually stale), week 2 set up the target and ingest live records, week 3 train reps, week 4 cut over and measure adoption, response time, and licence savings. Run the old and new systems side-by-side for 30 days so nothing breaks." },
      { q: "Can Leadkaun replace my CRM?", a: "Often, for Indian SMBs — Leadkaun has a built-in CRM (pipeline, stages, notes, contacts) plus the behaviour layer most CRMs lack. But it's designed to win even when it doesn't replace: run it alongside Zoho or LeadSquared for 60–90 days, prove the ₹-recovered ROI, then decide whether to consolidate." },
    ],
    moneyLinks: [
      { label: "Leadkaun vs Zoho CRM", href: "/compare/leadkaun-vs-zoho-crm", note: "The default Indian SMB CRM — where adoption breaks." },
      { label: "Leadkaun vs LeadSquared", href: "/compare/leadkaun-vs-leadsquared", note: "India-built, EdTech/BFSI-strong — activity vs behaviour." },
      { label: "Leadkaun vs HubSpot", href: "/compare/leadkaun-vs-hubspot", note: "Marketing-led & USD-priced — the cost question." },
      { label: "Leadkaun vs Salesforce", href: "/compare/leadkaun-vs-salesforce", note: "Enterprise-grade — overkill below 200 reps." },
      { label: "Leadkaun vs Freshsales", href: "/compare/leadkaun-vs-freshsales", note: "Clean UI — but is the AI scoring calibrated for India?" },
    ],
  },
  {
    slug: "sales-team-management",
    title: "Sales Team Management",
    pillar: 8,
    color: "#8B5CF6",
    description: "Running an Indian sales team without micromanaging — rituals, systems, and outcome-based accountability.",
    keyword: "sales team accountability india",
    metaTitle: "Sales Team Management in India — Accountability Without Micromanaging",
    metaDescription: "Micromanagement kills adoption and morale. Build accountability through systems instead — outcome metrics, a daily Morning Brief ritual, and 1:1s driven by behaviour data, not gut feel.",
    quickAnswer:
      "The instinct when numbers dip is to demand more logging and longer check-ins — which lowers adoption and morale and still doesn't tell you what's wrong. Accountability that works comes from systems, not surveillance: make the standard about outcomes (₹ recovered, response time on Grade A leads, follow-up completion), give every rep their own priorities each morning, and run 1:1s off behaviour data instead of gut feel. The manager's job shifts from chasing updates to coaching on a shared, honest scoreboard.",
    featuredSlug: "hold-sales-reps-accountable-without-micromanaging",
    faqs: [
      { q: "How do I hold reps accountable without micromanaging?", a: "Set the standard on outcomes and habits, then make them visible. ₹ recovered per rep, response time on high-grade leads, and follow-up completion are objective and coachable. When the scoreboard is shared and fair, accountability stops feeling like surveillance and 1:1s become specific." },
      { q: "What sales rituals actually work for Indian teams?", a: "A daily Morning Brief (each rep's top leads and ₹ at risk at 8:30 AM IST), a weekly review anchored on ₹ recovered and ₹ at risk, and 1:1s that open with behaviour data, not anecdotes. Rituals beat ad-hoc nagging because they're predictable and rep-owned." },
      { q: "How do I improve rep adoption of a sales tool?", a: "Cut logging friction (3-tap, mobile, WhatsApp-aware) and make the tool give reps something back — a clear priority queue so they don't have to decide who to call next. Reps adopt tools that save them time, not ones that audit them." },
      { q: "What should a sales manager review weekly?", a: "₹ at risk this week by rep, response-time trends on Grade A leads, and follow-up completion. These point to where to coach today, unlike activity counts that reward busywork." },
    ],
    moneyLinks: [
      { label: "Sales Rep Tracking", href: "/features/sales-rep-tracking", note: "Coach on outcomes, not activity." },
      { label: "Morning Brief", href: "/features/morning-brief", note: "A coaching ritual, not a surveillance tool." },
      { label: "Missed Opportunity Engine", href: "/features/missed-opportunity-engine", note: "One number: ₹ at risk this week." },
      { label: "See pricing", href: "/pricing", note: "From ₹999/rep/month." },
    ],
  },
  {
    slug: "whatsapp-b2b-sales",
    title: "WhatsApp for B2B Sales",
    pillar: 9,
    color: "#25D366",
    description: "Around 70% of Indian B2B leads first-contact on WhatsApp — how to treat it as a real sales channel.",
    keyword: "whatsapp for b2b sales india",
    metaTitle: "WhatsApp for B2B Sales in India — Best Practices That Actually Convert",
    metaDescription: "Most Indian B2B leads reply on WhatsApp, yet it's invisible to CRMs. Learn how to log WhatsApp conversations, keep response-time discipline, and turn threads into scored, queued leads.",
    quickAnswer:
      "In India, WhatsApp is where the deal actually happens — roughly 70% of B2B leads first-contact there, reply there, and negotiate there. Yet most CRMs can't see it, so the richest intent signal your team has goes unlogged. Treating WhatsApp as a real channel means three things: log every conversation in seconds (stage, intent, outcome) without leaving the chat, hold the same response-time discipline you'd want on calls (Grade A converts within ~47 minutes), and turn each thread into a scored, queued lead instead of a message that scrolls out of sight.",
    featuredSlug: "whatsapp-for-b2b-sales-india-best-practices",
    faqs: [
      { q: "Why is WhatsApp critical for B2B sales in India?", a: "Because that's where buyers actually engage — they reply to a WhatsApp message they'll ignore as a call. A WhatsApp reply is a strong intent signal, and the team that treats it as first-class (logging it, scoring it, following up fast) wins the leads that CRM-only teams never even see." },
      { q: "How do I track WhatsApp sales conversations?", a: "With logging fast enough that reps actually do it. Leadkaun's 3-tap logging captures stage, intent and outcome from a WhatsApp thread in seconds, turning it into a scored lead in the priority queue — no copy-pasting into a CRM, no broken flow." },
      { q: "What are good WhatsApp response times?", a: "Treat hot WhatsApp replies like hot calls — inside the hour, ideally the ~47-minute window where Grade A leads convert best. A reply that sits for a day is a buyer who's already messaging a competitor." },
      { q: "Can WhatsApp leads be scored and prioritised?", a: "Yes. Once a thread is logged, it's scored on fit, intent and quality like any lead and dropped into the rep's Grade A–F priority queue — so WhatsApp stops being a separate inbox and becomes part of one ranked day." },
    ],
    moneyLinks: [
      { label: "WhatsApp Tracking", href: "/features/whatsapp-tracking", note: "WhatsApp as a first-class sales channel." },
      { label: "Priority Queue", href: "/features/priority-queue", note: "Turn WhatsApp threads into a ranked queue." },
      { label: "Real Estate use case", href: "/use-cases/real-estate", note: "A WhatsApp-heavy vertical in action." },
      { label: "Book a demo", href: "/demo", note: "See 3-tap WhatsApp logging live." },
    ],
  },
  {
    slug: "startup-smb-sales-ops",
    title: "Startup & SMB Sales Ops",
    pillar: 10,
    color: "#EC4899",
    description: "First sales hire, the right tech stack, and a 90-day sales-ops setup for Indian founders.",
    keyword: "sales operations setup india",
    metaTitle: "Sales Operations Setup for Indian Startups — A 90-Day Plan",
    metaDescription: "A founder's pragmatic 90-day sales-ops setup: what to track from day one, when a spreadsheet is enough, your first sales hire, and the lightweight stack — without enterprise bloat.",
    quickAnswer:
      "Most Indian founders set up sales ops too late or too heavy. Too late means tribal knowledge and leads lost in WhatsApp; too heavy means a Salesforce instance no one updates. The right path is staged: in the first 30 days track only what matters (every lead, its source, and what happened next) and a spreadsheet is fine; by day 60 add scoring and a priority queue so your first reps work the right lead first; by day 90 add ₹-first metrics so you can see what's at risk and coach on it. Buy the smallest tool that fixes the current pain, not the most famous one.",
    featuredSlug: "sales-operations-setup-indian-startups",
    faqs: [
      { q: "When should a startup set up sales operations?", a: "The moment a second person sells or lead volume outgrows your memory — usually well before founders think. Start light: capture every lead, its source, and its next step. You don't need a CRM on day one; you need a single source of truth and a follow-up habit." },
      { q: "What should I track from day one?", a: "Three things: every lead and where it came from, what happened on each (call, WhatsApp, outcome), and which leads are hot. That's enough to stop leaks. Add scoring and a priority queue once reps can't hold the pipeline in their heads." },
      { q: "When does a startup outgrow the spreadsheet?", a: "When multiple reps edit it, nobody knows who to call next, follow-ups slip without reminders, and you can't answer 'what's ₹ at risk this week'. At that point graduate to a tool that scores and queues leads — Leadkaun imports your sheet (CSV or Google Sheets) and is set up in about 60 minutes." },
      { q: "What's the right sales stack for an Indian SMB?", a: "Lean: a lead source or two, a way to log WhatsApp and calls in seconds, scoring + a priority queue so reps know what to do next, and ₹-first reporting. Avoid enterprise CRMs until you genuinely need their complexity — they lower adoption at this stage." },
    ],
    moneyLinks: [
      { label: "The product", href: "/product", note: "The whole system in one view." },
      { label: "See pricing", href: "/pricing", note: "Starter ₹999 → Scale ₹2,999/rep/month." },
      { label: "Lead Scoring", href: "/features/lead-scoring", note: "Score leads from day one." },
      { label: "Book a demo", href: "/demo", note: "60-minute setup, walked through." },
    ],
  },
]

const CONTENT_DIR = path.join(process.cwd(), "content", "blog")

function readAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
  const posts = files.map((file) => {
    const slug = file.replace(/\.(md|mdx)$/, "")
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8")
    const { data, content } = matter(raw)
    const fm = data as BlogPostFrontmatter
    const html = marked.parse(content, { async: false }) as string
    return { ...fm, slug, body: content, html }
  })
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getAllPosts(): BlogPost[] {
  return readAllPosts()
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = readAllPosts()
  return posts.find((p) => p.slug === slug) ?? null
}

export function getPostsByCategory(category: BlogCategorySlug): BlogPost[] {
  return readAllPosts().filter((p) => p.category === category)
}

export function getAllCategories() {
  return CATEGORIES
}

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug) ?? null
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const all = readAllPosts().filter((p) => p.slug !== post.slug)
  const sameCategory = all.filter((p) => p.category === post.category)
  const others = all.filter((p) => p.category !== post.category)
  return [...sameCategory, ...others].slice(0, limit)
}

export function estimateReadingTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 220))
  return `${minutes} min read`
}
