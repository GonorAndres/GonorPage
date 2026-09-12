---
title: "Transforming a Random Variable Doesn't Move the Probability: The Inverse Function Trick"
description: "When an insurance policy modifies the payment based on the loss, what you have is a transformed random variable. Finding its percentiles doesn't require deriving a new distribution from scratch — it only requires inverting the transformation and using the CDF you already have."
date: "2026-03-05"
category: "fundamentos-actuariales"
lang: "en"
shape: "study-guide"
tags: ["transformations", "percentiles", "exam-P", "SOA", "insurance", "CDF"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/soa-inverse-transform-percentiles.webp"
heroAlt: "The same ordered dots appear on two scales; the transformation compresses values while preserving the group below the percentile."
heroCaption: "An increasing transformation changes the percentile value while preserving the set of scenarios below it."
---

When you first study distributions, the standard exercise is: you're given a distribution, you compute its mean, its variance, its CDF. But Exam P has another favorite question that feels uncomfortable at first: you're given a random variable X, told that Y = g(X) for some function g, and asked for the 90th percentile of Y.

The instinctive reaction is to find the distribution of Y from scratch — derive its PDF, integrate, set up the equation. That works, but it's slow and error-prone. There's a cleaner path that only requires understanding one thing: *transforming the variable doesn't move the probability, it only moves the values*.

## The simple case: an ordinary deductible

Imagine a policy with loss X and deductible d. The insurer's payment is:

$$Y = (X - d)_+ = \max(X - d,\ 0)$$

If the loss doesn't exceed d, the insurer pays nothing. If it does, the insurer pays the excess. This transformation is monotone non-decreasing: as X grows, Y grows or stays the same.

Now someone asks: what is the 80th percentile of Y? That is, what value y satisfies P(Y ≤ y) = 0.80?

The key idea is that the event {Y ≤ y} and the event {X ≤ something} are exactly the same event — just described in different units. If Y = X − d, then Y ≤ y if and only if X ≤ y + d. Therefore:

$$P(Y \leq y) = P(X \leq y + d) = F_X(y + d)$$

To find the 80th percentile of Y, you set F_X(y + d) = 0.80 and solve for y. You didn't need the PDF of Y. You didn't need to integrate anything new. You just used the CDF of X evaluated at a point that depends on y.

That's the whole trick. Formally:

$$F_Y(y) = F_X(g^{-1}(y))$$

Where g^{-1}(y) is the inverse of the transformation: the value of x that produces payment y. You invert the transformation, substitute into the CDF of X, and you get the CDF of Y automatically.

## Why it works: probability doesn't move

The underlying reason is simple. The function g is monotone, so order is preserved: if x₁ < x₂ then g(x₁) ≤ g(x₂). This means the event "the loss produces a payment less than y" is exactly the same set of scenarios as "the loss is less than g^{-1}(y)". The probability of that set doesn't change just because you write it one way or the other.

In set notation: {ω : Y(ω) ≤ y} = {ω : X(ω) ≤ g^{-1}(y)}. Same scenarios, same probability.

Monotonicity is the requirement that makes this work without flipping the inequality. Every standard insurance transformation satisfies it: multiplying by a positive constant (coinsurance α·X), shifting (X − d), taking minimums (min(X, u)), or combining all of that into a piecewise function. Greater loss means greater or equal payment — never the reverse.

## The piecewise case

The problem where this trick really shines is when the policy has a different structure over different ranges of loss. Suppose the loss X has an exponential distribution with F(x) = 1 − e^{−x/4}, and the policy pays as follows:

- If the loss does not exceed 10: the insurer reimburses 100% of the loss — that is, Y = X
- If the loss exceeds 10: the insurer reimburses 100% of the first 10, plus 50% of the excess above 10

This defines Y as a piecewise function:

$$Y = \begin{cases} X & 0 < X \leq 10 \\ 10 + \dfrac{X - 10}{2} & X > 10 \end{cases}$$

What is the 90th percentile of Y?

- (A) 5.6
- (B) 7.2
- (C) 8.0
- (D) 9.2
- (E) 10.0

**Step 1 — Identify which piece the percentile lives in.**

I need to know whether P(Y ≤ 10) is greater or less than 0.90. Since in the first piece Y = X, this is the same as P(X ≤ 10):

$$F(10) = 1 - e^{-10/4} = 1 - e^{-2.5} \approx 0.9179$$

The 90th percentile requires 90% of the probability mass below it. Since F(10) = 0.9179 > 0.90, the cutoff at 10 already accumulates more than 90% — so the 90th percentile of Y lives in the first piece, where Y = X directly.

In the first piece the transformation is the identity: g(x) = x, g^{-1}(y) = y. So F_Y(y) = F_X(y) and the 90th percentile of Y is simply the 90th percentile of X:

$$F(x) = 0.90 \implies 1 - e^{-x/4} = 0.90 \implies e^{-x/4} = 0.10 \implies x = -4\ln(0.10) \approx 9.21$$

**The 90th percentile of Y is 9.21.** The answer is (D).

---

Now suppose the question asked for the 95th percentile instead. The process is identical, but the classification changes.

**Step 1 — Check the piece.** F(10) = 0.9179 < 0.95, so the 95th percentile lives in the second piece.

**Step 2 — Invert the transformation of the second piece.** In that piece, y = 10 + (x − 10)/2. Solving for x:

$$y - 10 = \frac{x - 10}{2} \implies x = 2(y - 10) + 10 = 2y - 10$$

**Step 3 — Substitute into the CDF of X and set equal to 0.95.**

$$F_X(2y - 10) = 0.95$$
$$1 - e^{-(2y-10)/4} = 0.95$$
$$e^{-(2y-10)/4} = 0.05$$
$$-\frac{2y-10}{4} = \ln(0.05)$$
$$2y - 10 = -4\ln(0.05)$$
$$y = 5 - 2\ln(0.05) \approx 5 + 5.99 \approx 10.99$$

**The 95th percentile of Y is approximately 11.0.**

The algorithm was always the same: identify the piece, invert, substitute, solve.

## The general pattern

Any time you have Y = g(X) with g monotone (or piecewise monotone), the algorithm is:

1. Determine which piece the target percentile lives in by evaluating the CDF of X at the breakpoints.
2. Invert the transformation of the relevant piece to express x in terms of y.
3. Set F_X(x(y)) = p and solve for y.

This turns any percentile problem for a transformed variable into elementary algebra plus one lookup into the CDF of X. The distribution of Y never needs to be derived explicitly.

## On Exam P

This type of problem appears regularly on Exam P, especially in combination with exponential, uniform, and Pareto distributions, where the CDF has a simple closed form. The difficulty isn't in the algebraic inversion — it's in correctly identifying the piece before inverting, and in not getting confused when the transformation involves coinsurance, a deductible, and a policy limit simultaneously.

The warning signal that tells you this trick is needed: the problem defines Y as a function of X with different formulas over different ranges of X, and asks for a percentile of Y. At that point, the first thing you compute is the accumulated probability at each breakpoint. That number classifies the percentile and tells you exactly which inverse to use.

One additional note: when the transformation has *flat* pieces — for example, a policy limit that caps Y at some maximum value — the distribution of Y has a point mass at that cap. This doesn't break the method; it just means the CDF of Y has a jump there, and all percentiles within that jump range correspond to the same value. It's the mathematical signature of many claims landing exactly at the policy limit.

---

## Appendix: the formal derivation

Let X be a continuous random variable with CDF F_X, and let Y = g(X) where g is strictly monotone increasing. We want to find F_Y(y) = P(Y ≤ y).

Since g is strictly increasing, the inequality Y ≤ y is equivalent to g(X) ≤ y, which in turn is equivalent to X ≤ g^{-1}(y). Therefore:

$$F_Y(y) = P(Y \leq y) = P(g(X) \leq y) = P(X \leq g^{-1}(y)) = F_X(g^{-1}(y))$$

The equality P(g(X) ≤ y) = P(X ≤ g^{-1}(y)) holds precisely because g is strictly increasing: applying g^{-1} to both sides of the inequality preserves its direction.

If g were strictly decreasing, the inequality would flip: P(g(X) ≤ y) = P(X ≥ g^{-1}(y)) = 1 − F_X(g^{-1}(y)). In insurance this almost never happens because payments always increase with losses.

For the piecewise case, the same argument applies piece by piece. If g₁ operates on (−∞, c] and g₂ on (c, ∞), and both are monotone increasing within their domain, then for y in the range of g₂:

$$F_Y(y) = P(X \leq c) + P(c < X \leq g_2^{-1}(y)) = F_X(g_2^{-1}(y))$$

The first equality decomposes the event by piece; the second collapses it into a single evaluation of F_X because both pieces point in the same direction.
