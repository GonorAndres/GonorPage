---
title: "Dashboard Data Freshness: Why Sources Need a Common Cutoff Time"
description: "A dashboard that compares sources refreshing at different times should show a common cutoff, the last hour all of them have complete. A fictional day, with ads complete through 3 p.m., sales through 1 p.m. and web traffic through 2 p.m., shows how a return metric otherwise mixes three clocks."
date: "2026-09-27"
lastModified: "2026-10-03"
category: "herramientas"
lang: "en"
shape: "case-study"
tags: ["dashboards", "freshness", "data quality", "GCP"]
ficha:
  rol: "Author"
  año: "2026"
  datos: "Fictional scenario; no figures come from a client"
  estado: "Method case study"
relatedPosts: ["analytics-dashboards", "fuentes-no-coinciden"]
---

A dashboard can look current while comparing data that arrived at different times. If advertising is complete through 3 p.m., sales through 1 p.m., and web traffic through 2 p.m., a return metric at 3 p.m. mixes three clocks. Spend seems to rise without matching sales. That may be a real problem, or merely a difference in when the data arrived.

This example is **fictional**. It illustrates a design decision I use when building tools for teams: before showing a change, the dashboard should be able to say how far the sources are comparable.

| Source | Last complete hour in the example |
|---|---:|
| Advertising | 3 p.m. |
| Web analytics | 2 p.m. |
| Sales | 1 p.m. |

The shared cutoff is the last complete hour of the slowest source: 1 p.m. The comparison of spend, sessions and sales therefore accumulates each series from the start of the day through 1 p.m. Later hours can be displayed as preliminary, but must not be blended into the same rate. The historical reference uses the same weekday and also stops at 1 p.m. Comparing today's first thirteen hours with a complete prior day would create another distortion.

## What the screen should show

The header can state when the dashboard was rebuilt, the last complete hour for each source, and which source sets the cutoff. A subtle marker distinguishes preliminary figures from comparable ones. If a source did not arrive, zero must not take its place: the data is marked missing, and any dependent metric remains pending.

This design does not guarantee that each source is correct. Definitions, time zones, failed loads and later record changes still need review. Nor does it prove that a campaign caused a decline. It does prevent one avoidable conclusion: calling a sale “lost” when it had simply not loaded yet.

The practical decision is to inspect freshness before performance. That connects to my [dashboard projects](/en/blog/analytics-dashboards/) and to [reconciling data sources](/en/blog/fuentes-no-coinciden/): a useful interface also shows where its evidence ends.
