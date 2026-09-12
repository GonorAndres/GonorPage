---
title: "What 5.74 Million Flights Taught Me About PostgreSQL, BigQuery, and Knowing When to Use Each"
description: "Airlines generate millions of flight, delay, and revenue records, but analyzing that data requires choosing the right database for each question. This project takes 5.74M real records, analyzes them first in PostgreSQL with engine-level optimization, migrates to BigQuery to compare both paradigms, and presents the trade-offs with real timing, real costs, and real query plans."
date: "2026-03-18"
category: "proyectos-y-analisis"
lang: "en"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "PostgreSQL · BigQuery · Python · Plotly · Folium · Cloudflare Pages"
  datos: "PostgresPro Airlines demo DB (5.74M filas, 104 aeropuertos)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/learning-posgre"
  live: "https://analytics-flights.gonor.me"
tags: ["PostgreSQL", "BigQuery", "Python", "ETL", "EXPLAIN ANALYZE", "Docker", "GIS", "Plotly", "Folium", "data-engineering"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/flight-analytics-pg-bq.webp"
heroAlt: "An index-guided access selects one record, while a column-oriented read gathers data for an aggregation."
heroCaption: "Finding one record and aggregating many records call for different reading patterns."
---

A composite index on two columns cut a query from 33.9ms to 2.6ms. That's 13x faster from a single `CREATE INDEX`. A materialized view over the same dataset dropped it from 174ms to 0.13ms: 1,300x. The most extreme result in the project came from monthly partitioning, which reduced full-table scans to single-partition reads, producing a measured 3,024x speedup in the EXPLAIN ANALYZE output.

These aren't synthetic benchmark numbers. They come from working through 5.74 million real rows of Russian airline operations and watching how PostgreSQL's engine responds to each design decision.

## The dataset and the questions it raised

The <a href="https://postgrespro.com/community/demodb" target="_blank" rel="noopener">PostgresPro Airlines demo database</a> contains real operational data: flight schedules across 104 Russian airports, bookings, tickets, boarding passes, seat maps, and aircraft specs. Eight tables, 5.74 million rows, JSONB columns for bilingual names, a `point` type for airport coordinates, and timezone-aware timestamps. It's the kind of schema that exposes database differences far better than any toy example.

The questions I started with weren't technical. They were operational: which routes lose the most time to delays? How does revenue concentrate across the network? Which aircraft are underutilized?

## What the data reveals

The Voronezh-to-Pulkovo route leads in delay rate at 11.1%: 10 of 90 flights delayed by more than 15 minutes. The network-wide rate is 4.9%, affecting 2,394 flights. The hour-of-day and day-of-week heatmap makes a clear pattern visible: early-morning flights carry disproportionate delays, likely from cascading disruptions accumulated overnight.

Revenue concentration is sharper. Economy class captures 70.8% of total revenue from 88% of tickets. Business takes 26.5% from just 10%. But the more useful finding sits in the Pareto curve: 128 routes generate 80% of the 37.7 billion rubles in total revenue. The remaining 64% of routes contribute the last 20%. That level of concentration has direct implications for network planning.

The fleet utilization gap is hard to ignore. Boeing 777-300s run at a 72.8% average load factor; Cessna 208 Caravans reach 16%. That's not a small-aircraft problem. It's a signal that either those regional routes have weak demand or the boarding pass data is incomplete. The two explanations have very different consequences for anyone designing the network.

Route distance doesn't predict delays linearly. Short routes under 500km and very long routes over 4,000km show similar delay rates. The worst performance clusters in the 500-2,000km range, where turnaround pressure is highest and crews don't have time to fully recover between legs.

## What PostgreSQL teaches

Knowing SQL syntax is table stakes. Understanding why a query takes 1,283 milliseconds instead of 2.6 milliseconds is the actual skill.

EXPLAIN ANALYZE was the most instructive tool in the project. A simple filter on `flights WHERE departure_airport = 'SVO' AND status = 'Arrived'` was doing a Sequential Scan across all 65,664 rows in the table. A composite index on `(departure_airport, status)` switched that to a Bitmap Index Scan: from 33.9ms to 2.6ms. The query didn't change. The execution plan did.

Materialized views produced the most dramatic result. A route delay summary took 174ms from raw tables. The same data served from the materialized view: 0.13ms. The trade-off is real: you have to run `REFRESH MATERIALIZED VIEW CONCURRENTLY` to update the data without blocking reads. For analytics where staleness matters less than speed, that's usually the right call.

Monthly range partitioning made the EXPLAIN output explicit: "Partitions selected: 1 of 5." A query for July 2017 flights scans only that partition, not the full table. With 5.74 million rows spread across five months, the 3,024x measured speedup reflects how much work gets eliminated simply by designing the schema with the queries in mind.

WAL and checkpoints surfaced trade-offs that the documentation doesn't emphasize. A bulk operation with 100,000 inserts produces measurable WAL volume. Setting `synchronous_commit = off` speeds up writes at the cost of losing the last ~600ms of commits on a crash. For analytics workloads, that risk may be acceptable. For financial transactions, it isn't.

## The migration and where each system wins

The migration pipeline is four Python files. `extract.py` reads from PostgreSQL using batched cursors at 56,000 rows per second. `transform.py` flattens JSONB columns, converts the `point` type to separate latitude and longitude floats, strips trailing whitespace from `character(3)` fields, and normalizes all timestamps to UTC. `load.py` pushes DataFrames to BigQuery using Application Default Credentials. The full pipeline moves 5.74 million rows in 102 seconds.

Each transformation exposed a concrete difference between the two systems. JSONB doesn't exist in BigQuery; the `airport_name` column storing `{"en": "...", "ru": "..."}` became two flat columns. The `point` type has no direct equivalent. Timezone handling differs. None of these are documentation footnotes; they're the things that cause silent failures in a real migration.

Timing comparison running the same queries on both systems:

| Query | PostgreSQL (indexed) | BigQuery |
|:------|:--------------------|:---------|
| Route delay analysis (49K rows, 2 JOINs) | 111ms | ~1.5s |
| Revenue by fare class (2.3M rows) | 1,635ms | ~1.2s |
| Point lookup (1 flight by ID) | 2.6ms | ~800ms |
| Materialized view query | 0.13ms | N/A |

PostgreSQL wins on point lookups and it isn't close. With a proper index, a single-row lookup takes 2.6ms. BigQuery's minimum latency is around 500ms due to job scheduling overhead. For an API backend serving individual flight records, PostgreSQL is 300x faster.

BigQuery wins on full-table analytics. The revenue query over 2.3 million rows of `ticket_flights` ran faster on BigQuery (1.2s vs 1.6s) without any indexing work. Columnar storage and parallel execution handle large aggregations naturally.

Cost tells the full story. For this 500MB dataset with analytical queries, BigQuery runs about \$0.25/month at \$5/TB pay-per-query pricing. The smallest Cloud SQL instance costs around \$7/month. BigQuery charges for what you scan; Cloud SQL charges for what you provision. At scale, that gap only widens.

The takeaway isn't which system is better. It's that each solves a different problem, and the pipeline between them is the part most often underestimated.

## The map and the dashboard as a communication layer

Airport coordinates enabled a geospatial layer. In PostgreSQL, great-circle distances require a PL/pgSQL haversine function. In BigQuery, the same calculation uses `ST_GEOGPOINT()` and `ST_DISTANCE()` with no custom code. The route map in the dashboard reflects that work: 104 airports connected by 532 routes colored by delay rate, filterable by hub.

The <a href="https://analytics-flights.gonor.me" target="_blank" rel="noopener">dashboard</a> is deployed on Cloudflare Pages, bilingual, and runs entirely on pre-extracted JSON with no database connection. That's not an architectural compromise; it's a deliberate decision to eliminate hosting cost and network latency in a layer that only needs to display results.

The internals section translates EXPLAIN ANALYZE output into comparison bars: the 13x, 1,300x, and 3,024x improvements sit side by side without requiring visitors to read query planner text. The pipeline section shows ETL metrics alongside the timing comparison table. Revenue exposes the interactive Pareto curve. Fleet puts the Boeing 777 at 72.8% load factor next to the Cessna 208 at 16%, left as an open question.

## Limitations and what comes next

The data is operational, not financial. The revenue analysis uses fares from the dataset that may not reflect actual discounts, airport fees, or revenue-sharing arrangements. The 37.7 billion rubles is what the available data produces, not necessarily actual airline revenue.

The delay analysis has no weather or air traffic control data, which are the external factors that explain most systemic delays. The 500-2,000km range performs worst, but without root-cause data it's hard to separate turnaround pressure from routes sharing congested infrastructure.

The natural next step would be time-series analysis: whether the delay rate shifted across the dataset's time range, whether revenue concentration in 128 routes is stable or consolidating. That analysis needs the same tooling already built here; it just needs better questions.

Source code is at <a href="https://github.com/GonorAndres/learning-posgre" target="_blank" rel="noopener">github.com/GonorAndres/learning-posgre</a> and the dashboard at <a href="https://analytics-flights.gonor.me" target="_blank" rel="noopener">analytics-flights.gonor.me</a>. The pipeline reproduces with `docker compose up` and a GCP project.

This project shares its core decision logic with the <a href="/en/blog/data-engineering-platform/">actuarial data engineering platform</a>: in both cases, the central question isn't which technology to use, but when the cost of the more capable tool is justified by the problem it solves.
