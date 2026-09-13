---
title: "Data Analyst Portfolio: 7 End-to-End Projects"
description: "Seven end-to-end projects across six domains: real estate, insurance reserves, e-commerce cohorts, product experimentation, finance (SaaS KPIs and portfolio risk), and public-sector operations. The same statistical toolkit runs through all of them, and that is the argument: a data analyst has to hold several domains in view at once, because range is what makes depth transferable. Each project ships as an interactive dashboard, all on one live domain."
date: "2026-03-13"
category: "proyectos-y-analisis"
lang: "en"
shape: "narrative"
tags: ["portfolio", "data-analyst", "SQL", "Python", "Next.js", "multi-domain"]
ficha:
  rol: "Solo author"
  año: "2024-2026"
  stack: "Python · SQL · Next.js · Plotly"
  datos: "7 projects: real estate, e-commerce, insurance, finance, A/B testing, executive KPIs, operational efficiency"
  estado: "Completed"
  repositorio: "https://github.com/GonorAndres/data-analyst-path"
  live: "https://data-analyst.gonor.me"
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/data-analyst-portfolio.webp"
heroAlt: "Different data series follow a common process of organization, segmentation, and comparison."
heroCaption: "The domains change; organizing data, comparing groups, and interpreting evidence recur."
---


A data analyst's job is not to produce charts. It is to convert a business question into an informed decision. Every project in this portfolio follows that full arc: a stakeholder has a question, the data exists in some inconvenient format, the analysis produces a finding, and that finding gets delivered in a format the audience can act on.

The arc repeats across six domains that share almost no vocabulary: short-term rentals in Mexico City, US insurance reserves, Brazilian e-commerce, product experiments, the finances of a SaaS company and of an ETF portfolio, New York's public complaint system. The range is deliberate. Each domain asks its question in its own terms (occupancy, loss ratios, retention, conversion lift, churn, risk-adjusted return, SLAs), and the analyst has to hold several of those lenses at once, because underneath them the statistical work repeats: segment a distribution, estimate what has not yet been observed, check whether an aggregate is hiding its subgroups. Range and depth are not rivals here. Range is what makes the depth transferable: a survival curve fitted to insurance policies reads e-commerce retention without modification.

Actuarial training supplies the statistical rigor: Kaplan-Meier, severity distributions, reserving methods. The analyst role demands the complement: fluent SQL, dashboards a stakeholder can navigate alone, storytelling for non-technical audiences. The method holds constant across all seven projects: careful ETL, exploratory analysis before any conclusion, segmentation as the recurring tool, and delivery in the format the stakeholder needs, whether an interactive dashboard or an automated PDF.

## The 7 projects

### 00 - Airbnb CDMX: market analysis

**Business question:** How is Mexico City's short-term rental market structured, and how concentrated is supply?

The Inside Airbnb dataset for CDMX contains 27,051 listings across 79 columns. The ETL pipeline cleans prices (they arrive as strings with currency symbols), handles nulls, and segments hosts into enterprise vs. casual operators: set thresholds on a distribution, assign labels, compare the groups. That move returns in every project that follows. The central finding: 7% of hosts control 40% of supply. Blueground, Mr. W, and Clau are not individuals sharing their apartment; they are hospitality companies operating at industrial scale. Cuauhtémoc concentrates 46% of listings, while peripheral boroughs like Tlalpan (MXN 2,493 average) show premium pricing with thin supply.

Dashboard built with Next.js and Recharts, static architecture: precomputed JSON, zero backend.

**Status:** Complete | <a href="https://data-analyst.gonor.me/airbnb/" target="_blank" rel="noopener">Live app</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/00-demo-aestehtics" target="_blank" rel="noopener">GitHub</a>

### 01 - P&C actuarial reserves: IBNR and loss experience

**Business question:** Of the 6 lines of business in the portfolio, which are profitable and what is the total IBNR (incurred but not reported) the insurer must reserve?

US insurers are required to file their claims history with regulators in a standardized format called NAIC Schedule P: essentially a table showing, for each accident year, how much has been paid and how much is still outstanding. The challenge is that many claims take years to surface. Medical Malpractice insurance, which covers medical errors like a botched surgery or a missed diagnosis, can produce lawsuits that emerge 5 to 7 years after the incident. Compare that to auto insurance, where you know the damage the same day the accident happens.

Chain-Ladder and Bornhuetter-Ferguson address that problem differently: the first extrapolates historical claim development patterns to project what is still outstanding; the second blends that projection with an industry-wide prior when the insurer's own data is thin. Both produce an estimate of the IBNR: the money the insurer must set aside today for accidents that have already happened but have not yet been filed as claims.

The most revealing finding: Medical Malpractice shows a loss ratio of ~280%, meaning for every \$100 in premiums collected, the insurer paid \$280 in claims. That is not a bad year; it is a structural pricing problem. Only Private Passenger Auto and Product Liability are profitable. Total portfolio IBNR is ~\$20.4M, concentrated in the lines where claims take the longest to resolve.

Interactive dashboard with Next.js and FastAPI: loss triangle heatmap, IBNR waterfall, frequency-severity and combined ratio trend.

**Status:** Complete | <a href="https://data-analyst.gonor.me/insurance" target="_blank" rel="noopener">Live app</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/01-insurance-claims-dashboard" target="_blank" rel="noopener">GitHub</a>

### 02 - E-Commerce cohorts: retention, RFM, and LTV

**Business question:** What differentiates the 3% of Olist customers who repurchase from the 97% who never return?

The Olist dataset has ~99K orders across 9 data files. The finding that reframes everything: only ~3% of customers come back for a second purchase. In a typical e-commerce business that would be a crisis; here it is the reality of the Brazilian market in that period, and it shifts the question from "how well do we retain?" to "what is different about that 3%?"

One technical detail that matters: the dataset has two customer identifier fields, and using the wrong one makes every order look like a new customer, artificially inflating retention numbers. Getting that right is the first step before any analysis is trustworthy.

The analysis builds four views of that 3%: a heatmap showing how many customers from each purchase month returned in the following months; a survival curve tracing how quickly buyers are lost over time (the same Kaplan-Meier estimator that tracks policyholder mortality in insurance); an RFM segmentation (Recency, Frequency, Monetary value) grouping customers by how recently they bought, how often, and how much they spent; and an estimate of the total revenue each segment will generate over their lifetime as a customer.

Delivered as a six-page dashboard with no backend at all: the 36 MB of parquet behind it is pre-aggregated into 276 KB of static JSON, because all three of the app's filters turn out to be subsets of an already-aggregated matrix rather than recomputations. How this project lost its backend is a story of its own, told in the architecture section below. The full technical pipeline stays visible: all four notebooks are published inside the dashboard.

**Status:** Complete | <a href="https://data-analyst.gonor.me/cohorts" target="_blank" rel="noopener">Live app</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/02-ecommerce-cohort-analysis" target="_blank" rel="noopener">GitHub</a>

### 03 - A/B Testing: frequentist, Bayesian, and Simpson's Paradox

**Business question:** If we run a conversion A/B test, which statistical approach gives us the most reliable answer and why can aggregated results lie?

Imagine a product team wants to know whether changing the checkout button from blue to green increases conversions. They run the experiment for two weeks, and the global result shows the green version wins by 2 percentage points. Do you ship it? That depends on three questions: is that difference real or is it noise? How much confidence do you need before making the call? And if you split the result by mobile vs desktop users, does green still win in both groups?

The project evaluates that exact situation using three statistical approaches: classic frequentist testing (is the p-value below 0.05?), Bayesian inference with PyMC (what is the probability that B beats A, and by how much?), and sequential monitoring (can you stop early if the answer is already obvious?). The central analysis is Simpson's Paradox: how a result that looks clear at the aggregate level can reverse completely when you segment by subgroup, a real risk in any product experiment.

Interactive Next.js dashboard for exploring each statistical approach, calculating test power, and visualizing Bayesian convergence.

**Status:** Complete | <a href="https://data-analyst.gonor.me/abtest" target="_blank" rel="noopener">Live app</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/03-ab-test-analysis" target="_blank" rel="noopener">GitHub</a>

### 04 - Executive KPI Report: automated SaaS metrics

**Business question:** How to automate monthly executive report generation with anomaly detection and key metric forecasting?

CEOs and VPs do not live in dashboards. They receive a PDF or slide deck once a month. The manual process behind it takes a full day to assemble, the numbers are always slightly stale, and anomalies only get caught if someone happens to be looking at the right chart at the right time. A month of unusually high churn can slip through unnoticed.

This pipeline replaces that process. A single command generates the complete report: it calculates the key SaaS metrics (MRR, churn, customer acquisition cost, lifetime value), flags any metric that deviates from its historical trend, forecasts the next quarter, and produces a bilingual PDF ready to send. That lifetime value is the same quantity project 02 estimated from purchase cohorts; here it comes out of revenue data instead. The analyst spends their time interpreting findings, not copying numbers between spreadsheets.

9 notebooks covering data generation, EDA, anomaly detection, forecasting, report automation, backend architecture, KPI calculations, analytics algorithms, and PDF pipeline. Complementary Next.js dashboard.

**Status:** Complete | <a href="https://data-analyst.gonor.me/kpi" target="_blank" rel="noopener">Live app</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/04-executive-kpi-report" target="_blank" rel="noopener">GitHub</a>

### 05 - Financial Portfolio: Monte Carlo and efficient frontier

**Business question:** Given a diversified ETF portfolio, does that diversification actually pay off compared to simply buying the S&P 500?

The dashboard analyzes a real 6-ETF portfolio spanning different asset classes, with live data from Yahoo Finance and the S&P 500 as the benchmark. The central question is simple but uncomfortable: if your diversified portfolio had worse risk-adjusted performance than a single index ETF, diversification cost you money rather than protecting you.

To answer that rigorously, the analysis calculates the Markowitz efficient frontier (the set of portfolios that maximize return for each level of risk), runs Monte Carlo simulations to map the range of plausible future outcomes, and measures risk in multiple ways: VaR (maximum expected loss under normal conditions), CVaR (expected loss in the worst-case scenarios, the tail of the distribution), and the Sharpe and Sortino ratios (return per unit of risk). The result is a quantitative answer to whether your asset mix makes mathematical sense.

5 notebooks covering data acquisition, portfolio construction, performance analysis, risk analytics, and Monte Carlo frontier optimization.

**Status:** Complete | <a href="https://data-analyst.gonor.me/portfolio" target="_blank" rel="noopener">Live app</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/05-financial-portfolio-tracker" target="_blank" rel="noopener">GitHub</a>

### 06 - Operational Efficiency: NYC 311, process mining, and SLA

**Business question:** What inefficiency patterns exist in NYC 311 service requests and where are SLAs systematically violated?

NYC 311 is New York City's public service complaint system: residents report potholes, noise, rat infestations, building code violations, broken heating, accumulated garbage. Over 30 million records since 2010, spanning 40+ complaint types across 20+ agencies. The volume is not the interesting part for operational analysis; what matters is what the data captures implicitly.

The data records when each complaint was opened and when it was closed, but not the steps in between. Process mining reconstructs those hidden workflows: if a building violation complaint takes 14 days on average but the fastest ones close in 2, the algorithm looks for what the fast resolutions have in common. That surfaces the real bottlenecks, not the reported ones.

The analysis shows what simple averages miss. Some agencies have SLA (service level agreement) commitments that are structurally impossible to meet at their complaint volume: not because they are slow, but because the target was set without accounting for actual demand. Response times in certain neighborhoods are systematically slower for identical complaints. Certain complaint types have predictable seasonal spikes that pile into backlogs when agencies do not adjust capacity. The dashboard makes those patterns navigable by agency, complaint type, neighborhood, and time period.

Next.js dashboard with process flow visualizations, SLA heatmaps, and agency rankings.

**Status:** Complete | <a href="https://data-analyst.gonor.me/operations" target="_blank" rel="noopener">Live app</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/06-operational-efficiency" target="_blank" rel="noopener">GitHub</a>

## Architecture decisions

None of these tools was chosen once and for all. The choice follows the shape of the data and the audience, and it gets revisited when the data proves the first choice wrong. Three questions decide it: who is the audience, how interactive the output needs to be, and how often it updates.

**Next.js** now ships all seven projects (00 through 06). What it buys: full control over aesthetics, dark mode, mobile responsiveness, and components reused across dashboards (KPICard, ChartContainer, and ThemeToggle are shared by all of them). The cost is real: React, TypeScript, and a build pipeline. It is justified when dashboards have a long shelf life and the components are genuinely reused, and after seven projects, they are.

**Streamlit** is gone, and how it left teaches more than how it arrived. Project 02 began as a Streamlit app deployed on Cloud Run, a reasonable choice: the analysis lived in Python, and Streamlit is the shortest path from notebook to interactive app. Then the analysis undid its own infrastructure. All three of the app's filters turned out to be subsets of an already-aggregated matrix, not recomputations over the raw orders; nothing the user could click needed Python at request time. The app was rebuilt as a zero-backend static export. The interactivity survived intact, and a stateful service disappeared, along with its cold starts and its cost. The Streamlit source was archived outside the repo and removed; the research notebooks and data were preserved.

The line between **static JSON** and a **FastAPI backend** looked at first like a question about filters: if the user can filter, you need a server. Project 02 disproved that rule. The real question is whether a filter changes the computation or merely selects a subset of a precomputed aggregate. The cohort views only slice an aggregated matrix, so they ship as static JSON. The loss triangles in project 01 do recompute against the underlying data, so that dashboard keeps its FastAPI backend; and the live market data in project 05 cannot be precomputed at all, so that one keeps a backend too.

**One domain, one service.** The seven dashboards began as seven separate deployments, each on its own provider URL. They are now a single Cloudflare Pages project serving data-analyst.gonor.me, with routes for each analysis (/insurance, /olist, /cohorts, /abtest, /kpi, /portfolio, /operations, and /airbnb); the root introduces the portfolio. The backends went through the same consolidation: one FastAPI service on Cloud Run, with each project's API mounted under its own path prefix. The reasons are plain. Seven URLs split whatever audience a portfolio has, and none of them said whose work it was. One domain is one thing to maintain, one place to send a recruiter, and one set of analytics.

## What transfers across domains

After building 7 projects in different domains, the recurring patterns are more instructive than any individual finding. They are also the evidence for the claim this piece opened with.

**ETL consumes most of the actual time.** In every project, data cleaning and transformation took more time than the analysis itself. Airbnb prices arrive as strings with currency symbols and commas. Olist timestamps need careful parsing to build correct cohorts. NAIC Schedule P data requires cross-table validation before building reliable triangles. NYC 311 data has agency-level inconsistencies in how request types are recorded. The methodology transfers: type validation, explicit null handling, logging of discarded records.

**The segmentation move from project 00 never stopped appearing.** Airbnb hosts split into enterprise vs. casual (by listing count), Olist customers into RFM clusters (by recency, frequency, and monetary value), insurance lines by tail profile, NYC agencies by SLA compliance. The pattern is identical every time: define thresholds on a distribution, assign labels, measure differences between groups, make decisions based on the heterogeneity.

**Olist's 3% repurchase rate changes how you frame cohort analysis.** When the vast majority of customers are one-time buyers, the question is not "how well do we retain" but "what differentiates those who return." That reframing applies in insurance (what differentiates policies that renew), in SaaS (what differentiates users who don't churn), and in any business with high attrition.

**Actuarial statistical rigor applies directly to product analytics.** Kaplan-Meier is a curve showing what fraction of customers remained active at each point in time, without needing everyone to have left before you can estimate the trend. In insurance it models how many policyholders are still alive; in product analytics, how many users are still buying. Severity distributions describe not just the average transaction amount but the full shape of the distribution: how many customers spend \$50, how many spend \$500, how many spend \$5,000, which is exactly what you need to estimate customer lifetime value without outliers distorting the average. Bornhuetter-Ferguson blends what your current data says with what industry-wide historical experience suggests, useful when you have too few observations to trust your own data alone. The point is not the names. It is that insurance analytics and product analytics solve the same underlying problem: estimating what has not yet happened from what you have already observed.

## Connections to the actuarial portfolio

This DA portfolio does not exist in isolation. The actuarial projects in the main portfolio directly complement the work here:

- **SIMA** (Integrated Actuarial Modeling System) shares reserve calculation logic with project 01, though for life products rather than P&C. The same discount factors and development patterns that appear in the NAIC triangles live as modular functions in SIMA's engine.
- **GMM Explorer** connects to the segmentation across this portfolio: defining groups from Major Medical Expenses claim distributions is the same percentile-classification pattern that appears in RFM, host segmentation, and SLA analysis.
- The **insurance technical notes** (life and property) provide the regulatory reference: the CNSF frameworks governing how reserves are calculated in the Mexican market. Project 01's methodology is analogous, adapted to the US regulatory context (NAIC).

## Reference materials

- <a href="https://github.com/GonorAndres/data-analyst-path" target="_blank" rel="noopener">Main GitHub repository</a>: Complete source code for all 7 projects, numbered notebooks, SQL queries, ETL pipelines, and deployment configuration. The <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/apps/web" target="_blank" rel="noopener">shared frontend</a> lives in `apps/web`.
- <a href="https://data-analyst.gonor.me/airbnb/" target="_blank" rel="noopener">Airbnb CDMX (Live app)</a>: Next.js dashboard with short-term rental market analysis.
- <a href="https://data-analyst.gonor.me/insurance" target="_blank" rel="noopener">P&C Actuarial Reserves (Live app)</a>: Next.js + FastAPI dashboard with loss triangles and IBNR.
- <a href="https://data-analyst.gonor.me/cohorts" target="_blank" rel="noopener">E-Commerce Cohorts (Live app)</a>: zero-backend static export, with the four notebooks published alongside.
- <a href="https://data-analyst.gonor.me/abtest" target="_blank" rel="noopener">A/B Testing (Live app)</a>: Next.js dashboard with frequentist, Bayesian, and Simpson's Paradox approaches.
- <a href="https://data-analyst.gonor.me/kpi" target="_blank" rel="noopener">Executive KPI Report (Live app)</a>: Next.js dashboard with automated SaaS metrics.
- <a href="https://data-analyst.gonor.me/portfolio" target="_blank" rel="noopener">Financial Portfolio (Live app)</a>: Next.js + FastAPI dashboard with live yfinance data.
- <a href="https://data-analyst.gonor.me/operations" target="_blank" rel="noopener">Operational Efficiency (Live app)</a>: Next.js dashboard with process mining and SLA analysis.
