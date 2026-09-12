---
title: "Interactive Math Visualizations"
description: "Interactive demonstrations of fundamental calculus concepts: the sin(x)/x limit, derivative of sine, and Euler's formula. With manipulable SVG visualizations."
date: "2026-02-01"
category: "herramientas"
lang: "en"
tags: ["math", "visualization", "calculus", "interactive"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/math-visualizations.webp"
heroAlt: "A point on the circle projects onto a sine curve; a tangent shows its local change."
heroCaption: "Projecting circular motion produces a wave; its tangent describes how it changes at each point."
---

Three interactive demonstrations built with React and SVG that let you directly manipulate the parameters of fundamental concepts from calculus and complex analysis.

## Why these concepts matter

These three results are not just mathematical curiosities; they show up directly in actuarial and financial work:

- The **sin(x)/x limit** underpins the linear approximations used when computing sensitivities. If you don't understand why sin(θ) ≈ θ for small angles, you're using approximation formulas without knowing when they break down.
- The **derivative of sine** connects to the analysis of periodic functions: claim seasonality, interest rate cycles, demographic patterns. The relationship between a function and its rate of change is the essence of applied calculus.
- **Euler's formula** unifies trigonometric functions with the complex exponential. This is what allows characteristic functions to be expressed in probability, the key tool for proving the Central Limit Theorem and analyzing distributions of sums of random variables.

## What's included

- **sin(x)/x limit**: Geometric visualization of the fundamental limit using the unit circle. Drag the angle and watch the ratio converge to 1.
- **Derivative of sine**: Manipulate the point on the curve and observe how the tangent line slope traces out cosine.
- **Euler's formula**: Explore the relationship between complex exponentials and trigonometric functions in the complex plane.

Each visualization is designed to build intuition before formalization. The goal isn't to prove theorems but to understand *why* the results are true.

## Connection to other projects

The intuition these visualizations build has direct applications: trigonometric derivatives appear in options sensitivity calculations (as in the Currency Derivatives project), and Euler's formula is the bridge between moment generating functions and probability distributions, a central concept in the [SOA Exam P foundations](/en/blog/soa-probability-foundations/).

<a href="/en/blog/visualizaciones-matematicas/" style="display:inline-block;margin-top:1rem;padding:0.75rem 1.5rem;background:#C17654;color:#FFF8F0;font-weight:500;border-radius:0.5rem;text-decoration:none;">Explore demonstrations &rarr;</a>
