/**
 * State for the landing-page product demo.
 *
 * The demo is not a picture: logging a call really moves the lead's intent
 * score, the grade is recomputed from that score, and the queue re-ranks.
 * To make that behave like the product rather than like a guess, two things
 * are copied verbatim from the app:
 *
 *   • the grade matrix          (leadkaun/lib/scoring/grade.ts)
 *   • the signal intent weights (leadkaun/lib/scoring/signal-weights.ts)
 *
 * Everything else here is invented sample data. If the product's thresholds
 * change, this file is the one place to update.
 */

export type Grade = "A" | "B" | "C" | "D" | "E" | "F"
export type Stage =
  | "New Inquiry" | "Contacted" | "Qualified" | "Proposal Sent"
  | "Negotiation" | "Follow-up" | "Won" | "Lost"

/** Copied from the product. Post-execution thresholds; F is a hard veto. */
export function assignGrade(fit: number, intent: number, quality: number): Grade {
  if (quality < 20) return "F"
  if (fit >= 65 && intent >= 60 && quality >= 60) return "A"
  if (fit >= 55 && intent >= 40 && quality >= 50) return "B"
  if (fit >= 40 && intent >= 30 && quality >= 40) return "C"
  if (fit >= 30 && intent >= 15 && quality >= 25) return "D"
  return "E"
}

/** Copied from the product's signal weights. Intent points per logged signal. */
export const SIGNAL_WEIGHTS: Record<string, number> = {
  CALL_ANSWERED_INTERESTED: 20,
  CALL_ANSWERED_CALLBACK: 10,
  CALL_NOT_ANSWERED: -3,
  CALL_BUSY: -2,
  CALL_ANSWERED_NOT_INTERESTED: -20,
  WA_REPLIED_1H: 15,
  WA_REPLIED_4H: 10,
  WA_REPLIED_24H: 5,
  WA_NO_REPLY: -5,
  WA_TAG_NOT_SERIOUS: -15,
}

export const CALL_OUTCOMES = [
  { value: "CALL_ANSWERED_INTERESTED", label: "Interested", tone: "good" },
  { value: "CALL_ANSWERED_CALLBACK", label: "Callback", tone: "warm" },
  { value: "CALL_NOT_ANSWERED", label: "No answer", tone: "neutral" },
  { value: "CALL_BUSY", label: "Busy", tone: "neutral" },
  { value: "CALL_ANSWERED_NOT_INTERESTED", label: "Not interested", tone: "cold" },
] as const

export const WA_OUTCOMES = [
  { value: "WA_REPLIED_1H", label: "Replied in an hour", tone: "good" },
  { value: "WA_REPLIED_4H", label: "Replied in four", tone: "warm" },
  { value: "WA_REPLIED_24H", label: "Replied today", tone: "warm" },
  { value: "WA_NO_REPLY", label: "No reply", tone: "neutral" },
  { value: "WA_TAG_NOT_SERIOUS", label: "Not serious", tone: "cold" },
] as const

export const STAGES: Stage[] = [
  "New Inquiry", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Follow-up", "Won", "Lost",
]

/** Colour per stage, matching the funnel dots in the product. */
export const STAGE_DOT: Record<Stage, string> = {
  "New Inquiry": "bg-sky-400", Contacted: "bg-cyan-400", Qualified: "bg-violet-400",
  "Proposal Sent": "bg-orange-400", Negotiation: "bg-amber-400", "Follow-up": "bg-pink-400",
  Won: "bg-emerald-400", Lost: "bg-slate-300",
}

/**
 * The product shows each dimension as its weighted contribution to the /100
 * score: Fit out of 40, Intent out of 30, Quality out of 30. The dimensions
 * themselves are 0-100 internally, which is what the grade matrix reads.
 */
export const WEIGHTS = { fit: 40, intent: 30, quality: 30 } as const

export function contribution(value: number, of: number): number {
  return Math.round((value / 100) * of)
}

export function totalScore(l: { fit: number; intent: number; quality: number }): number {
  return contribution(l.fit, WEIGHTS.fit) + contribution(l.intent, WEIGHTS.intent) + contribution(l.quality, WEIGHTS.quality)
}

export type TimelineEntry = { id: string; label: string; at: string; delta?: number }

export type DemoLead = {
  id: string
  name: string
  company: string
  phone: string
  email: string
  /** Rupees. */
  value: number
  fit: number
  intent: number
  quality: number
  stage: Stage
  source: string
  rep: string
  signal: string
  /** Minutes since the last inbound signal. Drives "Last active". */
  activeMinutesAgo: number
  contactedToday: boolean
  /** null = nothing scheduled. */
  followUp: "today" | "overdue" | null
  /** Days with no activity. Drives the missed-opportunity list. */
  staleDays: number
  timeline: TimelineEntry[]
}

export type ActivityEntry = { id: string; who: string; what: string; lead: string; at: string }
export type Notification = { id: string; kind: "sql" | "drop" | "overdue"; title: string; body: string; read: boolean }

export type DemoState = {
  leads: DemoLead[]
  activity: ActivityEntry[]
  notifications: Notification[]
  toasts: { id: string; text: string }[]
  /** Monotonic counter, so ids never depend on Date.now() or Math.random(). */
  seq: number
}

function lead(
  id: string, name: string, company: string, value: number,
  fit: number, intent: number, quality: number,
  stage: Stage, source: string, signal: string, activeMinutesAgo: number,
  followUp: DemoLead["followUp"], staleDays: number, rep = "Aditya Rane",
): DemoLead {
  const digits = id.replace(/\D/g, "").padEnd(4, "0").slice(0, 4)
  return {
    id, name, company,
    phone: `+91 98${digits} ${digits}21`,
    email: `${name.split(" ")[0].toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, "")}.in`,
    value, fit, intent, quality, stage, source, rep, signal,
    activeMinutesAgo, contactedToday: false, followUp, staleDays,
    timeline: [{ id: `${id}-t0`, label: "Lead imported and graded", at: "on arrival" }],
  }
}

export const SEED_LEADS: DemoLead[] = [
  lead("l1",  "Priya Sharma",  "Sunrise Realty",      4_200_000, 82, 74, 88, "Qualified", "Website form", "Asked for pricing on WhatsApp", 4,    "today",   0),
  lead("l2",  "Rahul Mehta",   "Apex Capital",        2_800_000, 76, 68, 71, "Qualified", "Google Ads",   "Replied, wants a walkthrough",  22,   "today",   0),
  lead("l3",  "Vikram Desai",  "Deccan Motors",       1_500_000, 64, 52, 66, "Contacted", "Website form", "Booked a site visit",           60,   "today",   1, "Meera Shah"),
  lead("l4",  "Anjali Rao",    "BrightEdu Institute",   900_000, 58, 44, 62, "Contacted", "Facebook Ads", "Downloaded the brochure twice", 120,  null,      2, "Meera Shah"),
  lead("l5",  "Arjun Nair",    "Kochi Exports",         650_000, 47, 34, 55, "New Inquiry",       "Referral",     "Opened the quote, no reply",    300,  "overdue", 6, "Karan Bedi"),
  lead("l6",  "Neha Kulkarni", "Sahyadri Clinics",      120_000, 44, 31, 48, "New Inquiry",       "Listings",     "Enquiry from a listing site",   540,  null,      3, "Karan Bedi"),
  lead("l7",  "Imran Khan",    "Metro Logistics",       300_000, 36, 18, 40, "New Inquiry",       "Trade fair",   "No response in nine days",      2880, "overdue", 9, "Divya Pillai"),
  lead("l8",  "Sneha Patil",   "Pune Interiors",         85_000, 30, 12, 14, "New Inquiry",       "Bulk import",  "Number unreachable",            8640, null,      6, "Divya Pillai"),
  lead("l9",  "Rohit Iyer",    "Nashik Agro",         2_200_000, 78, 66, 74, "Proposal Sent",  "Referral",     "Went quiet after the first reply", 44640, "overdue", 31, "Meera Shah"),
  lead("l10", "Kavita Menon",  "Trivandrum Homes",    1_700_000, 71, 62, 68, "Proposal Sent",  "Website form", "Site visit booked, no follow-up", 34560, "overdue", 24, "Aditya Rane"),
  lead("l11", "Sameer Joshi",  "Indore Plastics",     1_100_000, 62, 46, 58, "Qualified", "Google Ads",   "Asked for a revised quote",     27360, "overdue", 19, "Karan Bedi"),
  lead("l12", "Farah Sheikh",  "Hyderabad Tutors",      800_000, 59, 42, 54, "Contacted", "Facebook Ads", "Two replies, then silence",     23040, "overdue", 16, "Divya Pillai"),
]

export const SEED_ACTIVITY: ActivityEntry[] = [
  { id: "a1", who: "Meera Shah",   what: "logged a call, interested", lead: "Vikram Desai",  at: "12 minutes ago" },
  { id: "a2", who: "Aditya Rane",  what: "moved to Proposal",         lead: "Kavita Menon",  at: "40 minutes ago" },
  { id: "a3", who: "Karan Bedi",   what: "logged a WhatsApp reply",   lead: "Sameer Joshi",  at: "1 hour ago" },
  { id: "a4", who: "Divya Pillai", what: "marked not interested",     lead: "Imran Khan",    at: "3 hours ago" },
  { id: "a5", who: "Meera Shah",   what: "imported 240 leads",        lead: "Bulk import",   at: "yesterday" },
]

export const SEED_NOTIFICATIONS: Notification[] = [
  { id: "n1", kind: "sql",     title: "Priya Sharma crossed the SQL threshold", body: "Fit 82 and Intent 74 both cleared. She is top of your queue.", read: false },
  { id: "n2", kind: "overdue", title: "4 follow-ups are overdue",               body: "Rohit Iyer has been waiting 31 days, worth ₹22L.",             read: false },
  { id: "n3", kind: "drop",    title: "Imran Khan dropped to Grade D",          body: "Nine days with no reply. Intent decayed on its own.",           read: false },
  { id: "n4", kind: "sql",     title: "Rahul Mehta asked for a walkthrough",    body: "Logged from WhatsApp 22 minutes ago.",                          read: true  },
  { id: "n5", kind: "overdue", title: "Follow-up due today: Vikram Desai",      body: "Site visit booked. Confirm the slot.",                          read: true  },
  { id: "n6", kind: "drop",    title: "Sneha Patil forced to Grade F",          body: "Quality 14 is below the floor of 20, so the grade is capped.",  read: true  },
]

export const REPS = [
  { name: "Aditya Rane",  graded: 214, contacted: 186, won: 6_400_000, responseMins: 9,  completion: 87 },
  { name: "Meera Shah",   graded: 198, contacted: 151, won: 5_100_000, responseMins: 14, completion: 76 },
  { name: "Karan Bedi",   graded: 173, contacted: 118, won: 3_300_000, responseMins: 26, completion: 68 },
  { name: "Divya Pillai", graded: 141, contacted: 79,  won: 2_100_000, responseMins: 41, completion: 56 },
]

export const LEARNING_PATTERNS = [
  { pattern: "Leads from Website form convert about twice as often as Bulk import", confidence: "High",   sample: "1,284 leads" },
  { pattern: "A reply inside the first hour is the strongest single predictor here", confidence: "High",   sample: "946 signals" },
  { pattern: "Enquiries arriving after 7 PM close more often than mid-morning ones", confidence: "Medium", sample: "312 leads" },
  { pattern: "Grade C leads chased more than four times rarely move",               confidence: "Medium", sample: "208 leads" },
  { pattern: "Trade fair leads need a second touch within three days",              confidence: "Low",    sample: "64 leads" },
]

// ── Formatting ────────────────────────────────────────────────────────────────

export function formatRupee(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(n % 10_000_000 === 0 ? 0 : 1)}Cr`
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(n % 100_000 === 0 ? 0 : 1)}L`
  if (n >= 1_000) return `₹${Math.round(n / 1000)}K`
  return `₹${n}`
}

export function activeAgo(minutes: number): string {
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

/** Next action, derived from grade exactly as the queue does. */
export function nextAction(grade: Grade): string {
  if (grade === "A") return "Call now"
  if (grade === "B") return "Follow up today"
  if (grade === "C") return "Nurture"
  if (grade === "D" || grade === "E") return "Light touch"
  return "Archive"
}

export function gradeOf(l: DemoLead): Grade {
  return assignGrade(l.fit, l.intent, l.quality)
}

/**
 * Queue rank, following the published weighting: grade first, then urgency,
 * then freshness. Fatigued and archived leads sink.
 */
export function rankScore(l: DemoLead): number {
  const g = gradeOf(l)
  const base = { A: 4000, B: 3000, C: 2000, D: 500, E: 200, F: -1 }[g]
  const urgency = l.followUp === "overdue" ? 800 : l.followUp === "today" ? 1500 : 0
  const recency = Math.max(0, 500 - Math.floor(l.activeMinutesAgo / 3))
  return base + urgency + recency
}

// ── Reducer ───────────────────────────────────────────────────────────────────

export type DemoAction =
  | { type: "LOG_OUTCOME"; leadId: string; channel: "call" | "wa"; outcome: string; label: string }
  | { type: "SET_STAGE"; leadId: string; stage: Stage }
  | { type: "COMPLETE_FOLLOWUP"; leadId: string }
  | { type: "SNOOZE_FOLLOWUP"; leadId: string }
  | { type: "MARK_READ"; id: string }
  | { type: "MARK_ALL_READ" }
  | { type: "IMPORT"; count: number; source: string; batch: string }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "RESET" }

export const INITIAL_STATE: DemoState = {
  leads: SEED_LEADS,
  activity: SEED_ACTIVITY,
  notifications: SEED_NOTIFICATIONS,
  toasts: [],
  seq: 0,
}

const IMPORT_NAMES = [
  ["Deepak Bhat", "Konkan Steel"], ["Ritu Agarwal", "Jaipur Gems"], ["Sanjay Verma", "Bhopal Foods"],
  ["Aisha Qureshi", "Lucknow Textiles"], ["Manish Gupta", "Surat Polymer"], ["Lata Nambiar", "Calicut Spice"],
]

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  const seq = state.seq + 1
  const toast = (text: string) => [...state.toasts, { id: `tst-${seq}`, text }].slice(-3)

  switch (action.type) {
    case "LOG_OUTCOME": {
      const delta = SIGNAL_WEIGHTS[action.outcome] ?? 0
      let after: DemoLead | undefined
      let before: Grade | undefined
      const leads = state.leads.map((l) => {
        if (l.id !== action.leadId) return l
        before = gradeOf(l)
        const intent = Math.max(0, Math.min(100, l.intent + delta))
        after = {
          ...l,
          intent,
          contactedToday: true,
          activeMinutesAgo: 0,
          staleDays: 0,
          followUp: delta > 0 ? "today" : null,
          stage: l.stage === "New Inquiry" ? "Contacted" : l.stage,
          signal: action.label,
          timeline: [
            {
              id: `${l.id}-t${seq}`,
              label: `${action.channel === "call" ? "Call" : "WhatsApp"} logged: ${action.label}`,
              at: "just now",
              delta,
            },
            ...l.timeline,
          ],
        }
        return after
      })

      const changed = after && before && gradeOf(after) !== before
      const notifications = changed && after
        ? [{
            id: `ntf-${seq}`,
            kind: (gradeOf(after) < before! ? "sql" : "drop") as Notification["kind"],
            title: `${after.name} moved from Grade ${before} to ${gradeOf(after)}`,
            body: `Intent ${delta > 0 ? "+" : ""}${delta} from the signal you just logged.`,
            read: false,
          }, ...state.notifications]
        : state.notifications

      return {
        ...state,
        seq,
        leads,
        notifications,
        activity: [
          { id: `act-${seq}`, who: "You", what: `logged a ${action.channel === "call" ? "call" : "WhatsApp reply"}, ${action.label.toLowerCase()}`, lead: after?.name ?? "", at: "just now" },
          ...state.activity,
        ],
        toasts: toast(
          delta === 0
            ? `Logged for ${after?.name}.`
            : `Logged. Intent ${delta > 0 ? "+" : ""}${delta}, grade ${after ? gradeOf(after) : ""}.`
        ),
      }
    }

    case "SET_STAGE": {
      let name = ""
      const leads = state.leads.map((l) => {
        if (l.id !== action.leadId) return l
        name = l.name
        return {
          ...l,
          stage: action.stage,
          timeline: [{ id: `${l.id}-t${seq}`, label: `Moved to ${action.stage}`, at: "just now" }, ...l.timeline],
        }
      })
      return {
        ...state, seq, leads,
        activity: [{ id: `act-${seq}`, who: "You", what: `moved to ${action.stage}`, lead: name, at: "just now" }, ...state.activity],
        toasts: toast(`${name} moved to ${action.stage}.`),
      }
    }

    case "COMPLETE_FOLLOWUP": {
      let name = ""
      const leads = state.leads.map((l) => {
        if (l.id !== action.leadId) return l
        name = l.name
        return {
          ...l, followUp: null, contactedToday: true, staleDays: 0,
          timeline: [{ id: `${l.id}-t${seq}`, label: "Follow-up completed", at: "just now" }, ...l.timeline],
        }
      })
      return {
        ...state, seq, leads,
        activity: [{ id: `act-${seq}`, who: "You", what: "completed a follow-up", lead: name, at: "just now" }, ...state.activity],
        toasts: toast(`Follow-up cleared for ${name}.`),
      }
    }

    case "SNOOZE_FOLLOWUP": {
      let name = ""
      const leads = state.leads.map((l) => {
        if (l.id !== action.leadId) return l
        name = l.name
        return { ...l, followUp: "today" as const }
      })
      return { ...state, seq, leads, toasts: toast(`${name} moved to today.`) }
    }

    case "MARK_READ":
      return { ...state, seq, notifications: state.notifications.map((n) => (n.id === action.id ? { ...n, read: true } : n)) }

    case "MARK_ALL_READ":
      return { ...state, seq, notifications: state.notifications.map((n) => ({ ...n, read: true })), toasts: toast("All notifications marked read.") }

    case "IMPORT": {
      const added: DemoLead[] = Array.from({ length: Math.min(action.count, IMPORT_NAMES.length) }, (_, i) => {
        const [name, company] = IMPORT_NAMES[i]
        // Imported leads arrive unassigned and ungraded until scoring runs; the
        // demo scores them immediately, which is what the product does on import.
        const fit = 40 + ((i * 13) % 45)
        const intent = 10 + ((i * 7) % 30)
        const quality = 35 + ((i * 11) % 55)
        return lead(
          `imp${seq}-${i}`, name, company, 200_000 + i * 350_000,
          fit, intent, quality, "New Inquiry", action.source, "Imported, awaiting first contact",
          i, null, 0, "Unassigned",
        )
      })
      return {
        ...state, seq,
        leads: [...added, ...state.leads],
        activity: [{ id: `act-${seq}`, who: "You", what: `imported ${added.length} leads from ${action.source}`, lead: action.batch, at: "just now" }, ...state.activity],
        toasts: toast(`${added.length} leads imported and graded.`),
      }
    }

    case "DISMISS_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) }

    case "RESET":
      return { ...INITIAL_STATE, seq }

    default:
      return state
  }
}
