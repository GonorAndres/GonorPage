---
title: "Dashboards with React: Why Build Analytical Reports in Code"
description: "Two exploratory analysis dashboards (Airbnb CDMX and Olist E-Commerce) as a case study for why Next.js and Recharts are a serious alternative to Power BI and Tableau for production-grade analytical reports."
date: "2026-03-05"
category: "herramientas"
lang: "en"
tags: ["React", "Next.js", "Recharts", "dashboards", "data-analytics", "Airbnb", "Olist"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/analytics-dashboards.webp"
heroAlt: "Two paths, prepared results and computation on request, converge into one analytical presentation."
heroCaption: "The architecture depends on whether a filter selects prepared results or requires new computation."
---

> **Note:** This project is part of the [Data Analyst Portfolio: 7 End-to-End Projects](/en/blog/data-analyst-portfolio). Here you will find the complete analysis for this particular project.

Power BI is excellent at what it does. Drag a field onto a canvas, choose a chart type, connect to a live data source, publish to a workspace, and someone non-technical can have a working report in an afternoon. That is a genuine advantage, and I am not going to pretend otherwise.

But at some point the report needs to ship as a finished product, not a workspace artifact. It needs to look like it was designed, not generated. It needs to work on mobile, load in under a second, handle interactions that go beyond slicers, and be maintained by developers who want to use git, not upload `.pbix` files to SharePoint. At that point, the drag-and-drop tools start fighting you.

This is the argument I wanted to test with two dashboards I built back to back: an Airbnb CDMX market analysis and an Olist e-commerce cohort study. Both use Next.js 14, TypeScript, and Recharts. The Airbnb dashboard serves static JSON preloaded at build time. The Olist dashboard calls a FastAPI backend for real-time cohort computation. Same frontend stack, deliberately different architectures, because the choice between static and API-backed should follow the data's nature, not a default assumption.

## The two dashboards

### Airbnb CDMX: 27,051 listings, no server required

The data comes from Inside Airbnb's March 2025 snapshot: 27,051 active listings in Mexico City across 79 columns. The ETL pipeline (Python, pandas) handles price cleaning, null imputation, host segmentation, and geographic downsampling to 3,000 points for the map.

The key architectural decision was to compile everything into five static JSON files totaling under 500 KB, loaded at build time via Node's `fs.readFileSync`. No API, no database, no cold start. The dashboard is a single static deployment that responds instantly because all the computation happened at build time.

The findings the dashboard makes navigable: Cuauhtémoc concentrates 46% of listings (12,514), driven entirely by Roma Norte, Condesa, and Centro Histórico. Entire home/apartment listings represent 71% of supply and peak at MXN 1,000–1,500 per night, roughly double the private room average of around MXN 500. Enterprise hosts like Blueground (221 listings), Mr. W (164), and Clau (156) account for 7% of all hosts but control 40% of supply. And outer boroughs tell the inverse story: Tlalpan averages MXN 2,493 per night and Cuajimalpa MXN 2,151, both far above the city median, but supply is thin enough that those averages are driven by a handful of premium properties rather than a sustained market.

Four charts surface these patterns: a price histogram by room type (PriceHistogram), a geographic scatter with price encoding (GeoScatter), a neighborhood ranking by listing count (NeighborhoodBar), and a host segmentation breakdown (HostSegmentation). A FilterBar connects them with shared React state.

### Olist: Cohort retention, revenue, and RFM across 7 tables

The Brazilian E-Commerce by Olist dataset is a common Kaggle benchmark: seven relational CSV tables covering orders, customers, payments, products, reviews, and geolocation. The ETL outputs Parquet files. The backend is FastAPI, which handles filter context and serves cohort data, KPI aggregations, and LTV curves to the frontend.

The added complexity justified a backend. Cohort retention matrices require joining and pivoting across all customer orders grouped by acquisition month, and that computation is fast in pandas on a server and awkward to precompute into a static file for every possible filter combination. The OlistFilterBar uses React Context (OlistFilterProvider) to propagate filter state across seven chart components: CohortHeatmap, RevenueTimeline, LTVCurves, CategoryBreakdown, GeoStatesBar, DeliveryReview (delivery time vs. review score), and RFMSegments.

This dashboard also has full dark/light mode via CSS custom properties (`--color-bg`, `--color-surface`, `--color-text-primary`, and so on), toggled by a ThemeToggle component that writes a class to the document root. Every chart, card, and surface responds automatically. That is the entire implementation. No theme library, no conditional className juggling; just CSS doing what CSS does.

## The case for code-first dashboards

**Aesthetics are a first-class constraint.** The Olist dashboard uses serif headings (Georgia) with monospace data readouts and a carefully chosen dark palette that is not available in any Power BI theme. More importantly, dark mode in Power BI requires manually recoloring every element, publishing a separate theme JSON, and accepting that it will break when Microsoft updates the rendering engine. In code, dark mode is a CSS variable swap that propagates everywhere automatically.

**Interactivity goes deeper than filters.** React state management allows cross-chart interactions that BI tools can only approximate. When a user selects a cohort month in the heatmap, the revenue timeline and LTV curves update to reflect only that cohort. That is not a Power BI slicer; it is a controlled React state change that any developer can read, trace, and test. Animated transitions (framer-motion, or simple CSS transitions on SVG attributes) are trivial to add. Contextual tooltips with rich formatting (formatted numbers, secondary metrics, explanatory text) are just React components.

**Architecture flexibility.** The Airbnb and Olist dashboards made opposite architectural choices deliberately. Static JSON works when the dataset fits in memory, the filters can be applied client-side, and the deployment target is a CDN. FastAPI works when computation is complex, filters change the underlying SQL or pandas query, or the dataset is too large to serialize at build time. Both are valid. The point is that you choose, rather than inheriting whatever architecture the BI platform decided was universal.

**Reusability is real.** KPICard, ChartContainer, ThemeToggle, DatasetInfo, ColdStartBanner: these components are shared between both dashboards and would carry into a third project without modification. Building them once is cheaper than rebuilding equivalent widgets in every Power BI report. For an organization running more than three or four analytical products, the reuse dividend becomes decisive.

**Version control.** The entire dashboard is text. Every chart configuration, every color, every data transformation is in a file that can be diffed, reviewed, reverted, and deployed through a CI/CD pipeline. The alternative is a binary `.pbix` file. Those two sentences are the argument.

**Deployment.** The Airbnb and Olist dashboards now share one Next.js application on Cloudflare Pages. The Airbnb analysis is served as static files at <a href="https://data-analyst.gonor.me/airbnb/" target="_blank" rel="noopener">/airbnb/</a>. No license. No gateway. No workspace. The Olist API runs on Cloud Run, containerized, scales to zero when unused, costs nothing for moderate traffic. The operational overhead of code-first dashboards, once the pipeline is established, is lower than maintaining a licensed BI platform.

## The honest tradeoffs

This is not the right approach for every situation.

Ad-hoc exploration is what BI tools are built for. When a business analyst needs to pivot a table, try three chart types, and share a draft before lunch, Power BI wins. The drag-and-drop interface accelerates iteration at the exploration stage in a way that writing React components cannot match.

Non-technical users cannot maintain code-first dashboards without developer involvement. If the person who owns the report needs to update a KPI threshold or add a filter option, they need to open a PR. That is not a realistic expectation for most business stakeholders.

The upfront cost is real. Building the first dashboard in this stack (setting up Next.js, connecting Recharts, building the component library, wiring the FastAPI) takes days, not hours. The ROI only materializes if the dashboard has a long shelf life or its components are genuinely reused.

The argument is narrow: for dashboards that need to look exceptional, behave precisely, and be maintained as software, code wins. For everything else, use the tool that ships fastest.

## Static vs. API: the decision framework

The choice between precomputed JSON and a live backend comes down to three questions.

First, can the full result set be computed at build time? For the Airbnb dashboard, yes: the dataset is fixed, the filters are simple (room type, borough), and the aggregations are small enough to serialize. Total payload: under 500 KB.

Second, does the user's filter state change the underlying computation? For cohort analysis, yes: a date range filter changes which customers are assigned to which cohort, which changes every downstream metric. That computation belongs on a server.

Third, how often does the underlying data change? Static JSON re-deploys whenever the source data refreshes. If that is nightly, a build trigger solves it. If it is real-time, you need a backend regardless.

For most analytical dashboards that are not operational monitoring tools, the Airbnb architecture is the right default: it eliminates an entire infrastructure tier and the latency that comes with it.

## Connections to other work

The [insurance claims dashboard](./insurance-claims-dashboard) in my portfolio uses the same stack: Next.js frontend, FastAPI backend, Recharts for the loss triangles and combined ratio trend charts. The component patterns are directly parallel: KPI cards, heatmaps, multi-line charts with shared axes. Building these Airbnb and Olist dashboards first was part of establishing those patterns.

The ETL methodology (price cleaning on the Airbnb dataset, multi-table joins on the Olist dataset) follows the same principle I applied to the NAIC Schedule P pipeline in the insurance dashboard: understand the noise first, clean minimally, document every transformation. The Airbnb price column alone required handling MXN/USD ambiguity, outlier suppression, and null imputation before any chart was trustworthy.

## Study materials

- <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/apps/web" target="_blank" rel="noopener">Shared frontend on GitHub</a>: The Next.js application contains the React/TypeScript components for both dashboards and the rest of the portfolio.
- <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/00-demo-aestehtics" target="_blank" rel="noopener">Research and backend</a>: Python ETL scripts, Jupyter notebooks, static JSON output, and the FastAPI backend for the Olist marketplace analysis. The EDA notebooks remain available to browse directly in the repository.
