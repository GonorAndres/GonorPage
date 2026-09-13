---
title: "Why every analyst should understand APIs (not just developers)"
description: "If you work with Fed rates, Banxico exchange rates, or World Bank life expectancy, you already consume APIs. Understanding what happens between your request and your data makes you a better analyst: you can diagnose when something fails, optimize when something is slow, and build when you need something custom. This project demonstrates it with real data and interactive labs."
date: "2026-05-03"
category: "herramientas"
lang: "en"
shape: "case-study"
ficha:
  rol: "Sole author"
  año: "2026"
  stack: "Next.js · TypeScript · Tailwind · Recharts"
  datos: "FRED · Banxico · World Bank · Custom mortality API"
  estado: "Completed"
  repositorio: "https://github.com/GonorAndres/learning-apis"
  live: "https://learning-apis.gonor.me"
tags: ["APIs", "Next.js", "TypeScript", "FRED", "Banxico", "World Bank", "Educational"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/teaching-apis.webp"
heroAlt: "A request travels from an analysis table to a remote source; the response returns through potential delay and failure points."
heroCaption: "Following the request and response helps identify where data delivery slows down or fails."
---

When an actuary opens R and types `fredr::fredr(series_id = "FEDFUNDS")`, they are consuming an API. When a risk analyst downloads the USD/MXN exchange rate from Banxico's portal, the portal is consuming an API for them. When a demographer looks up life expectancy on the World Bank site, there is an API behind that table.

Most analysts work with data that arrives through APIs without knowing it. This works fine until something breaks: the query takes too long, the server responds with an error you don't understand, your script stops working because authentication changed, or you need to combine data from two sources and don't know how. At that point, the gap between "consuming data" and "understanding how it arrives" becomes visible.

## The idea

This project comes from a personal conviction: to build tools that work in production, an actuary needs to understand the infrastructure that delivers the data. APIs are that infrastructure. They are universal (FRED, Banxico, World Bank, INEGI, any modern data source exposes them), and the concepts surrounding them (latency, error codes, authentication, caching, rate limiting) show up in any system you want to build or consume.

The platform has two levels. The main page teaches fundamentals: what an API is, how a request works, and a playground where you can make real queries to FRED, Banxico, the World Bank, and a mortality API built within the project itself. The advanced page has interactive labs where things break on purpose.

## The playground

The playground is the center of the project. It has four tabs, one per API, and in each one you can configure the query parameters, see exactly what request will be sent (URL, method, headers), execute it against the real API, and see the full response: tabulated data, raw JSON, response time, status code.

The FRED API returns Federal Reserve interest rates. Banxico returns the USD/MXN exchange rate. The World Bank returns life expectancy by country. And the fourth is a mortality API I built within the project: an actuarial mortality table that responds with death probabilities by age and sex. That fourth tab closes the loop: you go from consuming other people's APIs to having your own working API.

## The labs

The advanced page has labs designed to teach what tutorials leave out: the unhappy path.

**Latency race.** Four APIs compete in real time. FRED responds from St. Louis, Banxico from Mexico City, the World Bank from Washington, and your API from localhost. The difference is visible: the local API responds in milliseconds, the remote ones take hundreds. Running the race several times shows that latency is not fixed; it fluctuates. That is something an analyst who only sees the final data never perceives.

**Chaos lab.** Tutorials only show the happy path: send a request, get a 200 OK, parse the JSON. In production, servers go down, rate limits block you, authentication expires, your URL has a typo. This lab lets you trigger every HTTP error on purpose in a safe environment, so you recognize them when they happen for real.

**What-if scenarios.** You take real life expectancy data for Mexico from the World Bank and adjust it with a slider: what would happen if life expectancy were 10% higher, or 20% lower. Real and hypothetical data are plotted together. The point is that once you have direct access to data via API, manipulating it for sensitivity analysis is immediate.

There are more labs (a debugger that logs every call, an API health monitor, a request anatomy visualizer, a multi-source data mixer), but the point is the same: each one teaches a concept that shows up in any system consuming external data.

## Why this matters for an actuary

An actuary who understands APIs can build a pipeline that queries Fed rates every morning and updates projections automatically. Can detect when Banxico changes an endpoint and their model stops receiving exchange rates. Can combine World Bank mortality data with local INEGI data for comparative analysis. Can build their own API to expose the calculations from the <a href="/en/blog/suite-actuarial/" style="color: #C17654; text-decoration: underline;">actuarial suite</a> to other systems.

The difference between an analyst who only consumes data and one who understands how it arrives is the same as between someone who can drive and someone who can also pop the hood when the car won't start. Both reach their destination most days, but only one can solve the problem when something fails.

<div style="margin-top: 2rem; padding: 1rem 1.5rem; border-left: 4px solid #C17654; background-color: #f9f6f2;">
  <p style="margin: 0 0 0.5rem 0;"><strong>Live app:</strong> <a href="https://learning-apis.gonor.me" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">learning-apis.gonor.me</a></p>
</div>
