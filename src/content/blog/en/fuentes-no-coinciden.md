---
title: "Why Ad Platform Conversions Don't Match Sales Data (and How to Reconcile)"
description: "Ad platform and sales counts differ because each observes a different moment, unit and attribution window, so neither is necessarily broken. A fictional example with 20 attributed conversions against 15 confirmed orders reconciles them and shows which number answers which question."
date: "2026-09-27"
lastModified: "2026-10-03"
category: "proyectos-y-analisis"
lang: "en"
shape: "case-study"
tags: ["measurement", "attribution", "data quality", "GCP"]
ficha:
  rol: "Author"
  año: "2026"
  datos: "Fictional example; no figures come from a client"
  estado: "Method case study"
relatedPosts: ["data-engineering-platform", "teaching-apis"]
---

A campaign may report twenty conversions while the commercial system records fifteen sales. That difference alone does not prove either source is broken. Each observes a different moment and answers a different question: the platform estimates the actions it can credit to itself; the business records what happened in the sale.

Working with advertising and sales data taught me to begin with that distinction. Before building a rate or a dashboard, I write down what each number represents: unit of analysis, date, attribution window, exclusions and source. This article uses an **entirely fictional** example. It does not reproduce any client's data, screens or rules.

## Two measurement lanes

Suppose that, over one week, a platform reports 20 attributed conversions. The sales system holds 15 confirmed orders, 12 of which preserve enough information to link them to the campaign.

| Reading | Fictional value | Question answered |
|---|---:|---|
| Platform-attributed conversions | 20 | How many actions does the platform credit under its rules? |
| Business-confirmed orders | 15 | How many sales were recorded? |
| Orders with a verifiable campaign link | 12 | How many orders can be connected to this campaign with available data? |

Subtracting 15 from 20 does not measure “lost conversions.” A person may interact with several ads before buying; the platform may count an action the business does not consider a sale; an order may arrive after the reporting cutoff; and three of the fifteen orders lack a verifiable link. Even when both sources use the word *conversion*, their definitions are not interchangeable.

## What to check before drawing a conclusion

I would first compare complete periods in the same time zone. Then I would inspect which action the platform counts, how long its attribution window lasts, and which order states the commercial system includes. Finally I would measure link coverage: 12 of 15 orders, or 80%, in this fictional week. That figure does not say the other 20% came from a different channel; it says their origin cannot be verified with the available data.

The useful practice is to preserve both lanes. The platform supports campaign decisions inside its own framework; the commercial record supports sales analysis. Reconciliation shows where they meet and where a question remains open. If coverage suddenly falls, the first decision is to investigate measurement, not move spend.

This case connects to my [insurance data platform](/en/blog/data-engineering-platform/), where a number must also be traceable to its source, and to [APIs for analysts](/en/blog/teaching-apis/), which explores what can fail before a number reaches a report.
