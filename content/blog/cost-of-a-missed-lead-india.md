---
title: "How to Calculate the Cost of a Missed Lead (in ₹, for Indian B2B)"
description: "Every stale lead has a rupee cost — most Indian SMBs just don't see it. Here's the formula, the industry numbers, and how to surface ₹ at risk every Monday."
date: "2026-04-17"
updated: "2026-04-23"
category: "rupee-first-analytics"
pillar: 3
author: "Leadkaun"
tags: ["rupee-first", "missed-opportunity", "analytics", "india"]
readingTime: "7 min read"
faqs:
  - q: "What does 'cost of a missed lead' mean?"
    a: "The expected rupee value that walked away when a lead went unfollowed past its SLA. It's computed as: average deal value for that grade × grade-specific conversion rate × 1 lead. The idea is to translate 'stale lead' from an abstract operational term into a concrete financial one, so managers can prioritise coaching and reps can prioritise recovery."
  - q: "How do I know my average deal value?"
    a: "Pull the last 90 days of closed-won deals, sum the deal values, divide by count. Do this per industry line if you sell into multiple verticals. Real estate teams: average GCV per closed deal. EdTech: average annual fee. BFSI: average first-year premium. SaaS: average first-year ARR."
  - q: "What's a typical ₹-at-risk number for an Indian B2B SMB?"
    a: "For a 10-rep team managing ~1,500 open leads, we see ₹2–5 lakh in ₹-at-risk every week as baseline. When a team first sees the number, it's often higher — ₹8–15 lakh — because the baseline has accumulated over months. The first 2–3 weeks of surfacing drive recovery; then the number stabilises."
  - q: "Should reps see the ₹-at-risk number for their own leads?"
    a: "Yes, but framed carefully. Rep-facing copy should say 'Grade A leads to recover — ₹X at risk' not 'you missed ₹X'. The former is opportunity language, the latter is blame language. The same number, framed differently, produces either ownership or defensiveness."
---

Every stale lead has a cost. Most Indian B2B SMBs don't see it because it doesn't show up on any standard dashboard. "32 leads overdue for follow-up" is operations speak. "₹4.2 lakh at risk this week" is business speak. The second one is the conversation you actually want to have.

This article gives you the formula, the industry benchmarks, and the process for surfacing ₹-at-risk every Monday — so your sales reviews become conversations about money recovered, not activity logged.

## TL;DR

- **Cost of a missed lead** = (average deal value for that grade) × (grade-specific conversion rate) × (1 lead stale past SLA).
- For most Indian B2B SMBs, the weekly ₹-at-risk baseline is **₹2–5 lakh** for a 10-rep team.
- The metric changes sales reviews from "how many calls?" to "how much ₹ did we recover?".
- Frame rep-facing copy as **opportunity language** ("₹ to recover"), not **blame language** ("you missed").
- Automate the calculation — manual tracking breaks past 300 leads.

## The formula

```
Cost of one missed lead (₹) = Avg deal value × Conversion rate at that grade × 1
```

Breaking it down:

- **Avg deal value (₹)** — for a recent 90-day window, what's your average closed-won deal size? Pull it per industry if you sell into multiple verticals.
- **Conversion rate at that grade** — of all the leads at this grade over the same period, what % closed? This is different per grade: Grade A is 15–30% for most B2B, Grade B is 5–12%, Grade C is 1–4%.
- **1 lead** — because we're pricing a single stale lead. Multiply by N stale leads for the aggregate.

### Example (real estate team)
- Avg closed GCV: ₹45 lakh per deal
- Grade A conversion rate: 10%
- Cost of 1 Grade A lead going stale: ₹45 lakh × 10% = **₹4.5 lakh**

For 8 Grade A leads stale this week: 8 × ₹4.5 lakh = ₹36 lakh at risk.

That's the conversation opener for Monday's manager review.

### Example (EdTech team)
- Avg annual fee: ₹75,000
- Grade A conversion rate (in admission cycle): 22%
- Cost of 1 Grade A stale: ₹75k × 22% = **₹16,500**
- 40 Grade A stale: ₹6.6 lakh at risk

### Example (B2B industrial)
- Avg order value: ₹6 lakh
- Grade A conversion: 30% (longer cycle, fewer but bigger)
- Cost per Grade A stale: ₹6 lakh × 30% = **₹1.8 lakh**
- 12 Grade A stale: ₹21.6 lakh at risk

## Industry benchmarks

Typical numbers we see across Indian B2B SMBs:

| Industry | Avg deal value | Grade A conv. | ₹ per stale Grade A |
|---|---|---|---|
| Real estate | ₹25–50 lakh GCV | 8–12% | ₹2–6 lakh |
| EdTech (admissions) | ₹30k–₹1.5 lakh fee | 18–25% | ₹5k–₹38k |
| BFSI (insurance) | ₹15k–₹2 lakh premium | 22–30% | ₹3k–₹60k |
| B2B SaaS | ₹30k–₹3 lakh ARR | 15–22% | ₹5k–₹66k |
| Industrial B2B | ₹1–25 lakh order | 25–35% | ₹25k–₹8.7 lakh |
| Healthcare (packages) | ₹5k–₹2 lakh | 22–28% | ₹1k–₹56k |

Use these as starting points, then calibrate to your own 90-day numbers in month 2.

## Calculating your own numbers — step by step

### Step 1 — pull 90-day closed-won
Export last 90 days of won deals from your CRM or Google Sheet. Keep: deal value, close date, industry (if applicable), grade when closed.

### Step 2 — compute average deal value per industry
```
Avg deal value (industry X) = Σ(deal values for X) ÷ count(deals for X)
```
If you only have 50 deals over 90 days, pool them. Don't split too thinly.

### Step 3 — compute conversion rate per grade
For each grade A/B/C:
```
Conv rate (Grade A) = (closed-won Grade A) ÷ (total Grade A over same 90 days)
```
You need "total Grade A" — this is why grading every lead from day one matters. Without the denominator, you can't compute the rate.

### Step 4 — compute ₹ per stale lead by grade
```
₹ per stale Grade A = Avg deal value × Conv rate Grade A
```
Repeat for B, C.

### Step 5 — count stale leads this week
Stale = past SLA for its grade. Grade A stale after 24 hours. Grade B stale after 48 hours. Grade C stale after 7 days (industry-dependent).

Multiply counts × ₹ per grade. Sum. That's your **₹ at risk this week** number.

## Making the number usable

A number nobody sees doesn't change behaviour. Three places to surface ₹-at-risk:

### Place 1 — Monday manager review
Open the Monday all-hands / leadership standup with ₹ at risk this week. Break down by rep:
- *"₹4.2 lakh at risk. Priya: ₹1.8L. Rajesh: ₹1.2L. Mohan: ₹1.2L."*

Don't discuss anything else until there's a recovery plan per rep.

### Place 2 — Rep Morning Brief (8:30 AM IST)
Each rep gets an email at 8:30 AM with their personal ₹-at-risk number:
- *"Good morning, Priya. You have 4 Grade A leads overdue — ₹1.8 lakh to recover today. Top 3: [names + next actions]."*

Opportunity language, not blame language.

### Place 3 — Friday team scorecard
End of week, share team-level ₹-at-risk delta vs last week. If the number dropped, celebrate. If it grew, diagnose: more volume? Higher staleness? Process gap?

## Automating the calculation

Doing this manually works for 50 leads. At 500+ leads, you need the calculation running automatically, because:
- Grade assignments change as Intent decays.
- Deal values and conversion rates need 90-day rolling updates.
- Staleness windows are grade-sensitive (A=24h, B=48h, C=7d) — manual bucketing breaks.
- Per-rep rollups need to update continuously.

[Leadkaun's Missed Opportunity Engine](/features/missed-opportunity-engine) runs this calculation continuously, surfaces it on a per-rep dashboard, and includes it in the daily Morning Brief email. Setup time: 60 minutes. First ₹-at-risk number visible within the first day of data.

## Framing traps to avoid

### Trap 1 — publicly shaming reps
"Priya missed ₹3 lakh this week" is the wrong sentence, even if true. Rep-facing copy always frames ₹-at-risk as opportunity to recover: "Priya has ₹3 lakh to recover this week." Same data, different conversation.

### Trap 2 — using ₹-at-risk as the only metric
It's a leading indicator, not the whole scoreboard. Pair it with actual ₹ recovered (deals closed from at-risk pool) and conversion rate to give a complete picture. A rep might reduce ₹-at-risk by bulk-closing leads as lost, which is worse than leaving them open.

### Trap 3 — tuning deal values optimistically
Using last-quarter's best deal as the average inflates the number and makes reps tune out. Use the median, not the max. Better to have a realistic ₹2 lakh number you can recover than a fantasy ₹10 lakh number that's never achievable.

### Trap 4 — ignoring Grade C aggregate
Single Grade C leads don't feel worth recovering (₹1k–₹5k each). But 200 of them is ₹2–10 lakh. Don't skip Grade C — aggregate them in reports.

## What good ₹-at-risk management looks like

- **Week 1 after surfacing the number**: reps react with shock. Number feels high. Some denial.
- **Week 2**: reps start recovering — calling the stale Grade A leads. ₹-at-risk drops 30–40%.
- **Week 3–4**: steady state. ₹-at-risk stabilises at a healthy weekly flow (new stale replacing recovered).
- **Month 2**: sales reviews are 80% about money, 20% about activity. This is the cultural shift.
- **Month 3+**: ₹-recovered per rep becomes the headline metric. Activity metrics fade to secondary.

## The bottom line

Translating "stale lead" into "₹ at risk" is the single highest-leverage move in Indian B2B SMB sales reviews. It converts abstract operations data into concrete financial data. Reps work differently when they see the number. Managers coach differently. Reviews become conversations about recovery, not blame.

Compute it manually for a quarter. Automate when the behaviour holds. [See how Leadkaun's Missed Opportunity Engine surfaces ₹-at-risk automatically](/features/missed-opportunity-engine), or [book a 15-minute demo](/demo) to see it live on your data.
