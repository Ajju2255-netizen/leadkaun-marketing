---
title: "What is Lead Scoring? A Plain-English Guide for Indian B2B Teams"
description: "Lead scoring ranks your leads by how likely they are to convert — so your rep always knows who to call first. Here's how it works, built for Indian B2B."
date: "2026-04-22"
updated: "2026-04-23"
category: "lead-management"
pillar: 1
author: "Leadkaun"
tags: ["lead-scoring", "lead-management", "india", "crm"]
readingTime: "9 min read"
faqs:
  - q: "What is lead scoring in simple terms?"
    a: "Lead scoring is a system that gives every lead a number or grade based on how likely they are to convert. Instead of your rep deciding who to call first by gut feel, the score tells them. The best systems use three independent signals — Fit (does this lead match your ICP?), Intent (are they showing buying readiness?), and Quality (is the data reliable?) — and combine them into a grade A–F."
  - q: "How is lead scoring different from lead qualification?"
    a: "Qualification is a yes/no gate — does this lead meet minimum criteria to be worked? Scoring is continuous — of the leads that qualify, which one should I work first, second, third? Qualification happens once; scoring updates every time a signal arrives."
  - q: "Do I need a CRM to do lead scoring?"
    a: "Not necessarily. You can run a lightweight manual version in a Google Sheet with an ICP score column and a fresh-signal column. But manual systems don't re-rank when intent decays, and they require the rep to update them — which rarely happens past week two. A purpose-built scoring engine automates the part humans forget."
  - q: "Is AI scoring better than rule-based scoring?"
    a: "Not automatically. AI scoring tends to be a black box — you can't see why a lead is Grade A, and you can't tune it per market. Rule-based scoring with transparent weights (Fit: 30 pts industry, 20 pts geography, etc.) is auditable, explainable to your reps, and customisable to Indian B2B reality. Most Indian SMBs do better with transparent rules than with AI opacity."
  - q: "How fast does a scoring system need to run?"
    a: "Under 500 milliseconds per lead. Scoring that takes seconds breaks the user experience — reps won't wait, and the queue can't re-rank in real time. Leadkaun's scoring engine runs in under 500ms on every signal event."
---

Your rep walks into work on Tuesday with 200 open leads. They have 7 productive hours. If they call them all, they give each lead 2 minutes, which isn't enough for anyone. If they cherry-pick, they pick wrong — because humans pick by recency, not by potential. If they ask their manager, their manager picks by whichever lead made the most noise last week.

This is the problem lead scoring solves. Done right, it tells your rep — in under a second per lead — exactly who to call first, second, and third today.

## TL;DR

- **Lead scoring** is a system that ranks every lead by how likely they are to convert.
- Modern scoring uses three independent scores: **Fit** (ICP match), **Intent** (engagement signals), and **Quality** (data reliability).
- Each score is 0–100. Combinations produce a grade — A, B, C, D, or F.
- The best systems update the score in real time as new signals arrive, and **decay** intent when leads go silent.
- Scoring is not qualification — qualification is a yes/no gate, scoring is continuous ranking.

## Why scoring matters more than qualification

Qualification asks: *should we work this lead at all?* If the answer is no, it's disqualified and goes out of the pipeline. Fine — a necessary first filter.

Scoring asks a different question: *of the 200 leads that qualified, which one is likely to close this week, and which one should I touch in three weeks?* Qualification is one decision. Scoring is 200 decisions, made continuously, and updated every time something changes.

Most Indian B2B SMBs stop at qualification. They mark leads as "qualified" and then their rep picks from the qualified pile based on mood. This is where lakhs of rupees leak out — not because the leads are bad, but because the rep worked the wrong one first.

## The three-score model

Good lead scoring treats three things as independent signals:

### Fit Score (0–100)
Does this lead match your ICP? Fit is static — it doesn't change unless new ICP information arrives. Typical weights for Indian B2B SMBs:

- Industry match — 30 points
- Geography (city tier, region) — 20 points
- Business type / size — 20 points
- Role of primary contact — 15 points
- Budget signal — 15 points

A real estate agency with a Tier-1 city presence enquiring about a CRM is 80–100 fit. A college student enquiring about the same CRM is 10–20.

### Intent Score (0–100)
How engaged is this lead right now? Intent is dynamic — it spikes when signals arrive, decays when silence continues. Typical weights:

- Source baseline — starting value (paid ad: 30, referral: 60, organic search: 50)
- Call signal — +15 per meaningful call
- WhatsApp reply — +10 per substantive reply
- Meeting booked — +25
- Website re-visit — +5
- Intent decay — −3 per day of no activity after crossing a threshold

The decay is the important bit. Without decay, intent scores climb forever and stop being useful. With decay, a Grade A lead that goes silent for a week automatically becomes a Grade B, without any manager intervention.

### Quality Score (0–100)
Is the data on this lead even usable? A phone number that's 9 digits is junk. A company name that reads "asdfghjkl" is junk. An inquiry text that says "call me" with no context is low-quality. Typical weights:

- Valid phone (E.164, Indian carrier range) — 30 points
- Valid email (MX record check) — 15 points
- Company name present and plausible — 15 points
- Inquiry text contains meaningful content — 20 points
- Source reliability (agency vs direct vs referral) — 10 points
- Junk penalty (test strings, known bad patterns) — up to −10

Leads scoring under 20 on Quality are Grade F regardless of Fit or Intent. Trying to work a junk lead is worse than working no lead — it eats time that should go to the Grade A queue.

## How grades are assigned

A grade is a deterministic function of the three scores. A typical matrix:

| Grade | Fit | Intent | Quality | Rep Action |
|---|---|---|---|---|
| A | ≥ 65 | ≥ 60 | ≥ 60 | Call today — SLA 24 hours |
| B | ≥ 55 | ≥ 40 | ≥ 50 | Follow up this week — SLA 48 hours |
| C | ≥ 40 | ≥ 25 | ≥ 35 | Nurture cadence |
| D | ≥ 20 | ≥ 10 | ≥ 20 | Low priority |
| F | — | — | < 20 | Junk — discard |

The power of this matrix is that every rep, every day, sees a crisp action tied to a grade. "Grade A — call today" is unambiguous. "Qualified lead — needs follow-up" is not.

## Why three scores beat one number

You will see vendors pitch a single-number lead score — sometimes dressed up as "AI scoring" or "predictive score". A single number tells you one thing only: the model's verdict.

Three scores tell you:
- **Why** a lead is Grade A (high Fit, high Intent, or high Quality — or all three?)
- **What changed** when a lead moves from Grade A to Grade B (did Intent decay? Did new ICP info arrive? Did Quality drop?)
- **How to act differently** — a high-Fit-low-Intent lead needs a different touch than a high-Intent-low-Quality lead

Transparency is not a feature. It is the thing that makes reps trust the system and managers coach effectively.

## What scoring doesn't replace

Scoring is not a pipeline replacement. A rep still needs:
- A CRM record per lead (notes, contacts, history).
- A call / WhatsApp / email log.
- A follow-up scheduler.

Scoring is the priority signal on top of those tools. It says "of everything in your pipeline, work this first". Without scoring, the rep defaults to the pipeline view and picks by gut. With scoring, the priority queue is the rep's morning.

## India-specific scoring considerations

Most US CRMs ship scoring defaults that are calibrated for North American B2B. Swapping in Indian reality requires changes:

1. **WhatsApp as first-class signal.** A US CRM would track email open and email reply. In India, 70% of B2B first-contact happens on WhatsApp. Any scoring model that doesn't treat WhatsApp replies as a primary intent signal will under-weight your warmest leads.
2. **Phone normalisation.** Scoring Quality based on phone validity only works if the phone normaliser understands Indian formats — with/without +91, with leading 0, with spaces.
3. **Industry-specific decay windows.** A real estate enquiry cools in 24–48 hours. An industrial B2B quote cools in 30+ days. One-size-fits-all decay is wrong for multi-industry teams.
4. **Lakh-denominated pricing in Quality's budget signal.** A lead mentioning "20k/month" is a small deal; "2L/month" is a real deal. Quality + Intent should weight the implied budget in Indian scale, not translate everything to USD.

## Implementing scoring in your team

### Week 1 — manual scoring
Pick 50 open leads. Score each one by hand on Fit, Intent, Quality. Use a Google Sheet with three columns. Grade them A–F using the matrix above. Give the Grade A list to your best rep on Monday morning. Count how many close by Friday.

### Week 2 — shared vocabulary
Train the whole team on Grade A / B / C vocabulary. Every stand-up, every 1:1, every deal review uses the same grades. This alone drops response times — reps self-prioritise when the vocabulary is consistent.

### Week 3 — automate
If the behaviour change holds, automate it. The manual version breaks at scale (nobody updates Google Sheets religiously past week 3). A purpose-built scoring engine runs on every new lead and every signal event, in under 500ms, with transparent weights you control. See [how Leadkaun's scoring engine works](/features/lead-scoring).

## The bottom line

Lead scoring is how your rep stops guessing who to call next. The good versions are three-dimensional (Fit + Intent + Quality), transparent (you can see why a lead is Grade A), fast (under 500ms), and decay-aware (silence matters). The bad versions are AI black boxes that no one trusts.

Start manual. Prove the behaviour. Automate when it holds.
