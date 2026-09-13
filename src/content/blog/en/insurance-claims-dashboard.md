---
title: "Reserves and Loss Experience: Interactive P&C Insurance Dashboard"
description: "Actuarial reserve analysis using Chain-Ladder and Bornhuetter-Ferguson methods on NAIC Schedule P regulatory data. Interactive dashboard with loss triangles, IBNR estimates, and combined ratios across 6 lines of business."
date: "2026-03-05"
category: "proyectos-y-analisis"
lang: "en"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Python · FastAPI · Next.js · SQL · Jupyter"
  datos: "NAIC Schedule P · siniestros sintéticos (~50,000 reclamaciones)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/data-analyst-path/tree/main/projects/01-insurance-claims-dashboard"
  live: "https://data-analyst.gonor.me/insurance"
tags: ["reserves", "chain-ladder", "BF", "IBNR", "P&C", "dashboard", "Python", "SQL"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/insurance-claims-dashboard.webp"
heroAlt: "A development triangle distinguishes observed payments from estimated future-development cells."
heroCaption: "Observed experience supports projections of remaining development; the future portion remains an estimate."
---

> **Note:** This project is part of the [Data Analyst Portfolio: 7 End-to-End Projects](/en/blog/data-analyst-portfolio). Here you will find the complete analysis for this particular project.

Every quarter, an insurance CFO faces the same uncomfortable question: are our reserves enough? Not "probably enough," but actually enough, with a defensible methodology that will hold up under regulatory scrutiny and survive an adverse development year. Getting that answer wrong in either direction is costly. Under-reserving invites insolvency and regulatory sanction. Over-reserving freezes capital that could be deployed elsewhere and misrepresents the company's financial position to investors.

This project builds the full pipeline from raw regulatory data to an interactive dashboard designed to answer that question clearly and honestly across six lines of business.

## The data problem

The NAIC Schedule P is the US insurance regulatory equivalent of an open book: carriers must report cumulative paid losses, incurred losses, and premium by accident year for every major line of business. This creates actuarially-rich triangular data structures, the raw material for reserve development analysis. I used public Schedule P data as the structural backbone of the project.

The complication is that Schedule P data captures aggregated totals, not individual claims. To build the frequency-severity analytics that actually matter for pricing decisions (how often do claims occur, and when they do, how much do they cost) I generated a synthetic dataset of approximately 50,000 individual claims with distributions calibrated to actuarial standards: lognormal severity, Poisson claim frequency, exponential report lag, and gamma settlement delay. The distributions are realistic, not arbitrary. They reflect the empirical patterns documented in the actuarial literature for P&C lines.

The limitation is real and worth stating directly: synthetic claims do not capture cross-line correlations, geographic concentration risk, or the fat-tailed catastrophic events that define years like 2005 or 2017. The frequency-severity results in this dashboard are diagnostic and illustrative, not production-grade estimates. For a production reserve analysis, you need individual loss run data from the carrier's claims system.

## Chain-Ladder vs. Bornhuetter-Ferguson

The two methods complement each other in a specific way that matters for decision-making.

Chain-Ladder is purely experience-driven. You compute age-to-age development factors from the historical triangle: how much does cumulative paid loss grow from year 1 to year 2, from year 2 to year 3, and so on, and project incomplete accident years to ultimate using those factors. The method requires only one input: the historical loss triangle. Its weakness is volatility in thin data: when an accident year has few developed periods, the development factors carry high uncertainty, and the ultimate estimate swings wildly with a single unusual claim.

Bornhuetter-Ferguson hybridizes observed experience with an a priori expected loss ratio. It computes expected unreported losses as a function of both the prior (how much loss we expected based on premium and pricing assumptions) and the actual experience to date. Early in a year's development, when claims are sparse and the triangle says little, BF leans on the prior and produces stable estimates. Late in development, when the triangle has accumulated enough credibility, BF converges toward Chain-Ladder. The intuition is that you trust the data more as more of it exists.

The development factors I computed for this dataset show the pattern cleanly. Private Passenger Auto matures quickly: most claims are reported and closed within 18 months, so the 5-year-old accident years are near-fully developed. Medical Malpractice is the opposite: a canonical long-tail line where claims can incubate for years before the injury is discovered and litigation is resolved. The tail factor assumption for Medical Malpractice is the single biggest driver of uncertainty in the IBNR estimate for that line.

## What the data actually shows

The headline finding is stark: the six lines split cleanly into two groups.

Private Passenger Auto and Product Liability are the only profitable lines in the portfolio, both with combined ratios below 100%. Private Passenger Auto benefits from the high premium volume and mature development, so the reserve uncertainty is low and the business is generating underwriting profit.

Medical Malpractice shows a loss ratio of approximately 280%. That is not a rounding artifact or a data error; it reflects the reality that malpractice lines written in soft market conditions, where competition drives premium inadequacy, can take 8 to 10 years to reveal their true cost. Commercial Auto and Workers' Compensation also show combined ratios above 100%, consistent with the broader industry experience of sustained profitability challenges in these lines.

The total portfolio IBNR estimate is approximately \$20.4 million. That is the capital the insurer needs to hold today against losses that have occurred but not yet been fully paid. It is not theoretical; it is a direct constraint on dividend capacity, investment strategy, and reinsurance structure.

## The dashboard

The interactive front end (Next.js + FastAPI) was built to make the reserve analysis navigable without requiring a spreadsheet. It presents six views:

A **KPI bar** shows portfolio-level loss ratio, combined ratio, and total IBNR at a glance, the numbers a CFO reads first. A **loss triangle heatmap** visualizes cumulative development by accident year and age, making it immediately visible which years are underdeveloped and where development factors are most uncertain. An **IBNR waterfall chart** breaks down the \$20.4M estimate by line of business, so the concentration of reserve uncertainty is obvious. The **frequency-severity chart** plots claim frequency against average severity across lines, revealing which lines are high-frequency/low-severity (Private Passenger Auto) vs. low-frequency/catastrophic (Medical Malpractice). The **loss ratio by line** and **combined ratio trend** panels complete the picture.

The dark/light mode toggle is not decorative; it reflects how these dashboards actually get used, switching between presentation contexts (board slides on white) and after-hours analysis (dark terminal).

What interactive visualization adds over a static report is the ability to ask follow-up questions without rebuilding a spreadsheet. When you see that Medical Malpractice has a 280% loss ratio, the next question is: is that one bad accident year dragging the average, or a systemic pricing problem? The heatmap answers that in seconds by showing the development pattern year by year.

## Connections to other work

The reserving logic in this dashboard overlaps directly with the actuarial technical notes in my portfolio on property insurance pricing, where the same chain-ladder development factors that appear in NAIC analysis form the conceptual foundation for prospective reserve calculations in the Mexican market, where the CNSF requires carriers to demonstrate reserve adequacy under the LISF framework.

The SIMA insurance engine I built implements the underlying reserve calculation primitives: the same discount factors, development patterns, and expected loss projections that appear here live as modular functions in SIMA's core. This dashboard is what the output of that engine looks like when you give it a data layer and a front end.

The data pipeline itself (ingestion, cleaning, normalization of the NAIC Schedule P files across five Jupyter notebooks) follows the same methodology I applied in the [Proust Attention Machine](./proust-attention-machine) project's data cleaning phase: understand the noise first, clean minimally and auditably, document every transformation. The five SQL queries that back the dashboard analytics (loss ratio by line, development factor computation, IBNR aggregation, frequency-severity segmentation, combined ratio trend) are also included in the repository and follow the same principle: readable, annotated, and verifiable.

## Limitations and what I'd do differently

Three things I would add with more time:

**Mack's method for confidence intervals.** The Chain-Ladder point estimates in this dashboard carry no uncertainty bounds. Mack's model uses the triangle's own residual variance to compute standard errors on the development factors, which propagates into standard errors on the ultimate estimate. Without that, the \$20.4M IBNR figure conveys false precision. A CFO should know whether the 90th percentile is \$22M or \$35M.

**Stochastic bootstrapping.** Overdispersed Poisson bootstrapping on the development triangle produces a full distribution of reserve outcomes, not just a point estimate. That distribution is what feeds the stochastic capital models that regulators increasingly expect under Solvency II-style frameworks. The CNSF's capital adequacy rules for Mexican carriers are moving in the same direction.

**Tail factor sensitivity analysis.** For long-tail lines like Medical Malpractice, the tail factor (the development factor assumed beyond the last observed diagonal) drives more reserve uncertainty than all the other factors combined. I used a single deterministic tail factor per line. A serious analysis would run sensitivity scenarios: flat tail, industry-benchmarked tail, fitted curve extrapolation. The Medical Malpractice IBNR could change by 30% to 40% depending on that single assumption.

## Study materials

- <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/01-insurance-claims-dashboard" target="_blank" rel="noopener">GitHub repository</a>: Complete source code including all five Jupyter notebooks (ingestion, EDA, frequency-severity, loss triangles, loss ratios), five SQL analytical queries, the synthetic claim generator, and the full Next.js + FastAPI dashboard. Notebooks can be rendered directly on GitHub or viewed on nbviewer for interactive output.
