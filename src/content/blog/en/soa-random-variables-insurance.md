---
title: "Random Variables in Insurance: Deductibles, Limits, and the Math of Paying Claims"
description: "Study guide for the heaviest topic on Exam P: random variables, distributions, and payment modifications. The topic where mechanical errors hurt more than conceptual ones."
date: "2026-02-18"
category: "fundamentos-actuariales"
lang: "en"
shape: "study-guide"
tags: ["random-variables", "exam-P", "SOA", "insurance", "distributions"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/soa-random-variables-insurance.webp"
heroAlt: "The payment curve stays at zero, rises after the deductible, and flattens at the coverage limit."
heroCaption: "The deductible, coinsurance, and limit transform the loss amount into the insurer’s payment."
---

Of the three Exam P topics, this is the densest. Random variables are the daily bread of actuarial science: distributions, expected values, moment generating functions. What changes is the angle: the SOA does not ask whether you can integrate a PDF, it asks whether you can think in terms of policies, deductibles, and losses.

The hard part of this section is not conceptual. It is mechanical. The tricky thing is choosing the right approach: condition or go direct, use the CDF or a transformation, survival integral or closed-form formula. And then there are the execution errors: plugging the wrong number into the calculator, forgetting to use the complement, confusing parameters between distributions. You lose points not because you do not understand, but because you slip up on step 4 of 7.

This post covers what the SOA evaluates on univariate random variables, around 45% of the exam weight. It is not a formula sheet. It is a guide to how the pieces connect and why they matter in insurance.

## What a random variable actually is

In the classroom, the formal definition has a clean elegance: a random variable X is a measurable function from a sample space to the real numbers. In insurance, that abstraction takes concrete form. X is a loss. A car accident, a medical claim, a fire, a liability judgment. Every policy generates a random variable whose behavior we need to understand before the loss event occurs.

What makes this powerful is that the same random variable answers different questions depending on how you interrogate it. The cumulative distribution function F(x) = P(X <= x) answers "what is the probability that the loss is at most x?", a question relevant to the policyholder assessing their exposure. The survival function S(x) = 1 - F(x) answers "what is the probability that the loss exceeds x?", and this is the question that keeps reinsurers awake at night, because they assume the tail of the distribution, the region where losses are enormous and rare. The hazard rate h(x) = f(x)/S(x) answers "given that we have survived to x without the event occurring, what is the instantaneous risk right now?", which in life insurance is precisely the force of mortality, the foundational concept behind every life table used in actuarial practice.

Three operational questions, one random variable, three mathematical functions that characterize it. Exam P expects fluency with all three, and rightly so: an actuary who only knows the CDF is seeing a third of the picture.

## The distribution zoo

The Exam P syllabus includes roughly a dozen named distributions. The temptation is to memorize them as a catalog of formulas: mean here, variance there, MGF over there. But each distribution earns its place because it models something specific, and understanding that *why* renders much of the memorization unnecessary.

The selection is also surprisingly compact. Occam's razor: a handful of well-understood univariate distributions cover an enormous range of phenomena because they interconnect. The exponential and Poisson are two faces of the same coin. The lognormal is a transformed normal. The gamma generalizes the exponential. You do not need an infinite zoo; you need to understand the relationships.

The exponential appears because of its memoryless property: P(X > s + t | X > s) = P(X > t). If you have gone 3 months without a claim, the probability of going another 3 months claim-free is exactly the same as at the start. Counterintuitive, but that is what "random arrival" means: no pattern, no trend, no risk accumulation. The only continuous distribution with this property.

The Poisson counts events in fixed intervals. It does not model the *when* but the *how many*: how many claims per month, how many fires per year. If individual claims arrive exponentially, the count in a fixed period is Poisson. The connection between the two surfaces constantly on the exam.

The Pareto is the mathematical reason reinsurance exists. Heavy tails: a small fraction of claims concentrates an enormous share of total costs. The 80/20 rule is not a cliche; it is a property of heavy-tailed distributions. When a portfolio has Pareto-distributed losses, the primary insurer cannot absorb the tail without jeopardizing solvency, so it cedes that risk to a reinsurer. The decision of where to cut (the retention point) is a direct calculation on the survival function.

The lognormal appears because the logarithm of many real-world costs behaves approximately normally. Medical costs, property damage, liability amounts. It makes sense: costs are driven by multiplicative factors (inflation, severity, complexity), and the sum of multiplicative factors in log scale becomes normal via the CLT. Right-skewed, always positive, heavier tail than the normal but lighter than the Pareto, an intermediate profile for "ordinary" claims that do not reach catastrophic levels.

The normal, incidentally, almost never models losses directly. Losses are positive, skewed, often heavy-tailed, the opposite of a symmetric distribution ranging from negative to positive infinity. The normal enters through the back door of the Central Limit Theorem: the sum of many independent losses behaves approximately normally regardless of individual distributions. That belongs to Topic 3 of the exam.

## Payment modifications: where Exam P becomes actuarial

Everything discussed so far could appear in a university probability course. Random variables, named distributions, distribution functions, expected values. What follows is the territory that separates Exam P from a university exam: policy payment modifications.

Defining a deductible analytically, deriving the survival integral, and understanding why E[(X - d)+] takes that form is the difference between applying formulas mechanically and knowing when to abandon them when the scenario changes. It is the difference between "I know how to calculate it" and "I know why it works that way."

In practice, the insurer almost never pays X, the full loss amount. They pay a function of X that depends on the policy structure: deductible, limit, coinsurance.

The central idea is that the insurer almost never pays the full claim. With an ordinary deductible, the policyholder absorbs the first dollars and the insurer only pays what exceeds that threshold. With a franchise deductible it is the other way around: if the claim does not reach the threshold nothing is paid, but if it crosses it, the insurer covers everything, including what is below the line. The franchise is more expensive for exactly that reason. On top of either one you can layer a limit (a maximum cap per claim) and coinsurance (the insurer pays only a percentage of the excess, say 80%, and the policyholder retains the rest). All of this combines into a single formula that Exam P expects you to handle fluently, and the mathematical tool that holds it together is the survival function integral. It is probably the most important formula on the exam in practical terms.

Then there is the Loss Elimination Ratio, which measures how aggressive a deductible is. If a deductible absorbs 40% of expected losses, it means the insurer is filtering a good portion of small claims before they become costly. That is efficient from a business perspective, but from a regulatory standpoint it can be a problem: a deductible that absorbs too much means the policy transfers so little risk that it barely functions as insurance.

And then there is inflation, which is where it gets interesting. If claim costs rise but the deductible stays fixed, the insurer's expected payment grows more than proportionally. A 20% inflation in claim costs can produce close to a 30% increase in what the insurer pays, because the fixed deductible becomes relatively smaller against larger losses. This is what forces pricing actuaries to revisit rates every year, and it is why medical cost inflation is one of the most closely watched variables in health insurance.

## The gap between university and SOA-P

In the university course, the distribution is the end of the exercise: integrate the PDF, compute the variance, derive the MGF. On Exam P, the distribution is the starting point. What matters is what you do with it: apply a deductible, adjust for inflation, compute the LER, and produce a number that makes sense as a premium. Same tools, different direction of thought.

What also changes is the question structure. The SOA does not vary the format much; once you recognize the pattern, the variance between questions is low. But what it does evaluate is concept interrelation: a single problem can combine a Pareto with a deductible, inflation, and coinsurance all at once. Knowing each piece in isolation is not enough.

The same logic shows up in the [GMM Explorer](https://gmm.gonor.me/contexto), one of my projects from a risk management course, where the problem is exactly this: you have claims data and need to decide which mixture of distributions describes it best so you can price it. Also in the [credit risk model with GLMs](https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/Credit_Risk_Model), which shares the fundamental structure: a random variable, a distribution, and a function that transforms probability into an operational decision.

## Study materials

- <a href="https://drive.google.com/file/d/1YRa658huJEPi_X1GUXaZPMJI5zaNKy7p/view" target="_blank" rel="noopener">SOA Exam P: Complete Study Reference (v2)</a>: Extensive reference covering all three exam topics with hundreds of solved problems, explanations, and intuitions.
- <a href="https://drive.google.com/file/d/19CMJeh0T0nQBHCdcLc4OToks4e-McaHj/view" target="_blank" rel="noopener">Exponential & Gamma Guide</a>: Quick reference for the exponential and gamma distributions: formulas, memoryless property, the gamma integral trick, and inter-distribution connections.

