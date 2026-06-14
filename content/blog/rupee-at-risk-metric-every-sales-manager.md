---
title: "₹ at Risk: The One Number Every Sales Manager Should Watch"
description: "The rupee at risk sales metric tells you which high-grade leads are aging out and how much pipeline you'll lose this week if nobody acts. Here's how to compute and run it."
date: "2026-05-21"
updated: "2026-06-13"
category: "rupee-first-analytics"
pillar: 3
author: "Leadkaun"
tags: ["rupee-analytics", "sales-management", "metrics", "india"]
readingTime: "7 min read"
faqs:
  - q: "What is the rupee at risk sales metric?"
    a: "It's the expected rupee value of your high-grade leads that are aging past their response window right now — calculated as deal-size band × close probability × a recoverability factor that decays the longer the lead sits untouched. Unlike activity counts or conversion %, it's a forward-looking number that tells you what you're about to lose, not what already happened. Leadkaun's Missed Opportunity Engine computes it continuously across every open lead."
  - q: "How is ₹ at risk different from pipeline value?"
    a: "Pipeline value is the total of everything open — it sits there looking healthy even when half of it is quietly dying. ₹ at risk isolates only the slice that's slipping: high-grade leads that have crossed their contact window and are losing recoverability by the hour. A ₹2 crore pipeline can carry ₹14 lakh at risk this week. Pipeline value won't tell you that. ₹ at risk will."
  - q: "Why not just track conversion rate or calls made?"
    a: "Both are lagging or vanity numbers. Conversion % tells you what closed last quarter — too late to act on. Calls made tells you reps were busy, not that the right leads got worked. A rep can hit 60 calls a day and still let a Grade A lead worth ₹4 lakh go cold because it was buried under low-grade noise. ₹ at risk points straight at the money that's leaving."
  - q: "How often should a manager review ₹ at risk?"
    a: "Daily as a glance (it's in the 8:30 AM IST Morning Brief), and once a week as a structured per-rep review. The weekly review is where you go lead-by-lead through each rep's at-risk list, decide recover-or-release, and reset the queue. Anything longer than a week and high-grade leads cross the point where recoverability has decayed too far to matter."
---

A sales manager in Pune told me her pipeline report said ₹2.4 crore open. Healthy quarter, on paper. What it didn't say: ₹17 lakh of that was Grade A leads that had crossed their contact window in the last six days and were cooling by the hour. Nobody was watching that number because nobody was computing it. By the time the quarter closed, ₹11 lakh of it had walked to a competitor who called back faster.

That number — the **rupee at risk sales metric** — is the one figure a sales manager should be able to recite from memory every morning. Not calls made. Not pipeline total. The rupees that are leaving the building this week if nobody acts.

## TL;DR

- **₹ at risk** = the expected rupee value of high-grade leads aging past their response window, computed as deal-size band × close probability × recoverability factor.
- It is **forward-looking** — it tells you what you're about to lose, not what already closed. Conversion % and call counts can't do that.
- Recoverability **decays with time**: a Grade A lead is worth chasing at hour 2, marginal at day 3, mostly gone by day 7.
- Leadkaun's [Missed Opportunity Engine](/features/missed-opportunity-engine) computes ₹ at risk continuously and surfaces it in the 8:30 AM Morning Brief.
- Run a **weekly per-rep review** around it: go lead-by-lead, decide recover-or-release, reset the Priority Queue. That single habit beats every activity dashboard you own.

## What ₹ at risk actually measures

Most dashboards measure effort or history. ₹ at risk measures imminent loss. It answers one question: of the leads worth real money, how many are slipping out of reach right now, and what's the rupee total?

The precise definition has three parts, multiplied together for every open high-grade lead, then summed:

**Expected value × Close probability × Recoverability.**

- **Expected value** is the deal-size band for that lead — ₹3 lakh for an SMB software deal, ₹40 lakh for a commercial real estate enquiry, ₹80,000 for an annual edtech package. Use the band, not a guess.
- **Close probability** is tied to the grade. A Grade A lead might carry a 38% historical close rate; Grade C, 9%. This is where the [Grade A–F scoring](/features/sales-rep-tracking) earns its place — it gives you a probability anchored in behaviour, not a salesperson's optimism.
- **Recoverability** is the part everyone forgets. A lead that's two hours past its window is 90% recoverable. The same lead at day 4 might be 30% recoverable. By day 8 it's effectively gone — the buyer has talked to two competitors and made up their mind.

A worked example. A Grade A real estate enquiry, deal band ₹35 lakh, close probability 36%, currently three days past its 47-minute contact window so recoverability has decayed to roughly 45%. That single lead contributes ₹35,00,000 × 0.36 × 0.45 = **₹5.67 lakh** to your ₹ at risk total. Sum that across every aging high-grade lead on a 10-rep desk and the weekly number is rarely small. ₹12–₹20 lakh at risk in a single week is common for teams that aren't watching it.

## Why it beats activity counts and conversion %

Two metrics dominate Indian sales floors, and both lie to you in different ways.

**Calls made, meetings booked, activities logged.** These reward motion. A rep can log 55 calls a day and look like a star while a ₹6 lakh Grade A lead sits untouched in their queue because it arrived during a busy patch and got buried under 30 Grade D enquiries. The activity dashboard is green. The money is leaving. Activity counts tell you reps were busy; they never tell you whether the right leads got worked.

**Conversion rate.** This is the comfortable one, and it's a rear-view mirror. Your Q1 conversion rate tells you what happened in January and February — useful for a post-mortem, useless for acting on the deal that's dying today. By the time a lead shows up in your conversion math, the decision has already been made. You're measuring the funeral, not the patient.

₹ at risk is different because it points forward and it's denominated in money. A manager who sees "₹14.2 lakh at risk, ₹9 lakh of it on Rohit's desk" knows exactly what to do this afternoon. A manager who sees "team conversion 11%, calls up 6% WoW" knows nothing actionable at all. The first number creates urgency the way urgency should be created — by naming the rupees about to slip, not by manufacturing pressure on people.

## How to compute it on your desk

You don't need a data team. You need three inputs you almost certainly already have, applied consistently.

1. **Assign a deal-size band to every lead at intake.** Not a precise figure — a band. Real estate: ₹15L / ₹35L / ₹1Cr+. SaaS: ₹50k / ₹3L / ₹12L ARR. Lock the bands so reps can't inflate them.
2. **Attach a close probability to each grade** from your own history. Pull last two quarters: of leads graded A, what % closed? B? C? Those percentages become your multipliers. Refresh them quarterly.
3. **Define the response window and a recoverability decay curve per lead type.** For a hot inbound enquiry the window might be under an hour, with recoverability halving roughly every two days past it. For a longer B2B cycle the window is wider and the decay is gentler. The curve doesn't have to be perfect — it has to be consistent.

Multiply, sum across all aging high-grade leads, and you have today's ₹ at risk. Do it by hand the first week to build intuition. Then stop doing it by hand — a human recomputing this across 400 open leads every morning will get it wrong by Wednesday. The [Missed Opportunity Engine](/features/missed-opportunity-engine) runs all three steps continuously, re-scoring as each lead ages and as reps act, so the number on screen at 9 AM is the number that's actually true at 9 AM.

If you want the underlying logic of why a single cooled lead costs what it does, the breakdown in [the cost of a missed lead in India](/blog/cost-of-a-missed-lead-india) walks through the rupee math lead by lead.

## Running the weekly review around ₹ at risk

The metric is only as good as the ritual attached to it. Here's the review that turns the number into recovered rupees. Block 45 minutes, one rep at a time, once a week.

**Open with the rep's at-risk list, sorted high to low.** Not their call count, not their pipeline total — the rupees slipping out of their specific queue, biggest first. This frames the conversation around the situation, not the person. "₹6.2 lakh is aging on your desk this week" is a problem you solve together. "Why aren't you calling people" is a fight.

**Go lead-by-lead on the top five.** For each one, a single decision: **recover or release.** Recover means it gets a concrete action and a deadline today — a call, a tailored WhatsApp, an escalation. Release means you both agree it's gone, mark it dead, and stop letting it inflate the pipeline and haunt the rep. Most desks carry far too many zombie leads that nobody will admit are dead.

**Then ask why the high-value ones aged.** Almost never laziness. Usually the lead arrived during a crunch, or the Priority Queue wasn't being followed, or three Grade A leads landed in the same hour and the rep could only work one. That's a queueing and capacity problem to fix, not a character flaw to scold. Blame the situation; fix the system.

**Close by resetting the queue.** Every recover decision should re-rank the rep's Priority Queue so the highest-recoverability, highest-value leads sit on top for Monday. The number you want to see next week is lower — and you want it to be lower because rupees got recovered, not because leads got quietly written off.

A desk that runs this review weekly for a quarter typically watches its standing ₹ at risk drop 30–50%, because the leaks get caught while recoverability is still high instead of discovered in a conversion post-mortem three months late.

## What changes when you watch this number

Three things shift on teams that put ₹ at risk at the centre.

Reps stop optimising for activity theatre and start optimising for the leads that matter, because the queue and the review both point at value, not volume. Managers stop running blind between monthly reviews, because the Morning Brief at 8:30 AM IST hands them the day's at-risk figure before standup. And leadership finally gets a forward number in the language they think in — rupees — instead of a lagging percentage that explains the past.

The Pune manager I opened with put ₹ at risk on a whiteboard, ran the weekly review for two months, and brought her standing at-risk figure from ₹17 lakh to ₹6 lakh. Same team. Same leads. The only change was watching the right number and acting before recoverability ran out.

## See your ₹ at risk for real

The hard part isn't understanding the metric — it's computing it accurately across hundreds of live leads, every hour, as they age. That's exactly what the engine does, and it surfaces the result where you'll actually use it.

[Book a 15-minute demo](/demo) and we'll show you your own ₹ at risk: the high-grade leads aging on each rep's desk right now, and the rupee total you'll lose this week if nobody moves. Most managers are surprised by the number. All of them act on it.
