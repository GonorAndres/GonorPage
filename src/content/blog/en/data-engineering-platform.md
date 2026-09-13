---
title: "Insurance Claims Data Platform on GCP"
description: "Actuarial teams generate valuable data that gets trapped in spreadsheets and manual processes that do not scale. This platform builds the complete pipeline on GCP, from streaming claims intake to Tweedie GLM pricing, with Dataform and BigQuery as the backbone. The result is an automated, tested, and reproducible flow that turns raw data into inputs ready for the regulator."
date: "2026-03-18"
category: "proyectos-y-analisis"
lang: "en"
shape: "narrative"
tags: ["BigQuery", "Terraform", "Pub/Sub", "Apache Beam", "Dagster", "Cloud Run", "DuckDB", "Tweedie GLM", "GCP", "actuarial"]
ficha:
  rol: "Solo author"
  año: "2026"
  stack: "Python · BigQuery · Dataform · Dagster · Terraform · Pub/Sub · Apache Beam · Cloud Run · DuckDB · FastAPI"
  datos: "608 synthetic claims · 5 business lines · 32 states"
  regulacion: "LISF · CNSF"
  estado: "Completed"
  repositorio: "https://github.com/GonorAndres/data-engineer-path"
  live: "https://data-engineer.gonor.me"
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/data-engineering-platform.webp"
heroAlt: "Claim records pass through validation and structured tables; an exception branches to review before analysis."
heroCaption: "Validating and transforming data before analysis makes results traceable and exceptions reviewable."
---

A mid-sized insurer in Mexico processes between 5,000 and 50,000 claims per year. Each one arrives with inconsistent field names, shifting status codes, and amounts at different stages of settlement. The typical workflow: claims exports a CSV, sends it to the technical team, an analyst opens it in Excel, transforms it manually, pastes it into triangles, generates development factors. At 500 claims it works. At 5,000 it becomes fragile. At 50,000 it breaks. The problem is not just volume; it is reliability. A manual process has no audit trail, no integrity tests, no reproducibility. If someone asks the same question a month later, you repeat everything from scratch.

<a href="/en/blog/sima/">SIMA</a> demonstrated that an actuary can build the full calculation engine: graduated mortality, capital requirements under LISF. But SIMA assumes clean, available data. The next question is more fundamental: can an actuary build the infrastructure that moves data from source to model, automatically, tested, and reproducible?

Six interconnected projects answer that question, forming a complete data platform on Google Cloud.

## The platform: six projects, one architecture

The six projects are not independent exercises. They are layers: a warehouse to store, an orchestrator to execute, streaming to ingest, Terraform to provision, and pricing to consume. Each was built on the one before it.

### P01: Claims data warehouse

The core idea is to organize data so that an actuary can ask questions directly: "show me incurred losses by coverage type and accident quarter." A star schema does exactly that: four dimensions (policyholders, coverages, dates, geography) surrounding two fact tables (transactions and monthly snapshots). Instead of hunting through spreadsheets, you write a query and get the answer.

Raw data flows through four transformation layers managed by Dataform: cleaned and standardized first (staging), then joined and enriched with reference catalogs (intermediate), then aggregated into metrics like loss triangles and claim frequency (marts), and finally shaped into dashboard-ready views (reports). Each layer feeds the next, and errors get caught before reaching the model. Everything uses Mexican locale names, INEGI state codes, and MXN currency; a warehouse that reflects the real domain demonstrates business understanding, not just the ability to move columns around.

For local development, DuckDB runs directly on the machine with no servers to install or pay for. The same SQL runs on BigQuery without changes, so what works locally works in production. The dashboard is deployed on Cloud Run: <a href="https://data-engineer.gonor.me" target="_blank" rel="noopener">claims-dashboard</a>. It shows the portfolio summary (608 claims, \$26.9M total paid, \$44K average severity), cumulative loss triangles with development factors, and the full pipeline documentation. Fifty-two pytest tests verify schema correctness, referential integrity between tables, and business rules (positive amounts, coherent dates, sums that balance across layers).

Cost: under \$1 per month. BigQuery's free tier covers 10 GB of storage and 1 TB of queries. GCS for source files costs pennies.

### P02: Orchestrated ELT pipeline

With the warehouse built, the next question is what feeds it and when. The industry standard is Apache Airflow, deployed on GCP via Cloud Composer. Composer costs \$400+ per month because it keeps a Kubernetes cluster running permanently, even when no DAGs are executing. For a pipeline of five linear steps that runs once a day, that cost cannot be justified.

The alternative is Cloud Run + Cloud Scheduler: a container that wakes up when scheduled, runs the pipeline, and goes back to sleep. Cost: \$0.10 per month. The logic is identical, the results are identical, and the cost is 4,000 times lower. This pattern works for any small-to-medium pipeline running on a predictable schedule.

For local development, Dagster offers something Cloud Run does not: a visual interface to see the data flow, track what ran and when, and debug failures without reading terminal logs. A reference Airflow DAG is also in the repository; an employer who uses Airflow can see that their tooling is familiar. The decision not to deploy it is economic, not technical.

The deployment lesson illustrates what happens when local assumptions meet cloud reality. Cloud Run expects an HTTP server listening permanently. The original Dockerfile executed the pipeline as a batch script that exited when finished; Cloud Run interpreted that exit as a crash and restarted in a loop. The fix was adding an HTTP endpoint that triggers execution on demand. A simple error, but exactly the kind of problem that only surfaces in production.

### P03: Streaming claims intake

In practice, claims do not wait for someone to run a batch process at end of day. One adjuster files at 3pm, another at 3:15, another at 4. The question is whether the system can react to each claim as it arrives, rather than waiting for them to accumulate.

Pub/Sub works like a mailbox that never loses a message. Each claim becomes a message with its coverage type, deductible, status, and amount. A Cloud Run service receives each message, checks that all fields are present and valid, enriches it with catalog information (coverage type, state code), and writes it to the warehouse. If a message arrives malformed, it gets routed to a review queue instead of contaminating the data.

Apache Beam groups those events into time windows: how many claims arrived this hour? What is the total amount by coverage this shift? The important detail: the code is written with the same logic a real-time system would use, but runs in batch to control costs. Streaming Dataflow costs \$1,000+ per month continuously. In batch mode, it costs pennies per run. The code is identical; switching to real-time means changing a configuration parameter, not rewriting anything.

Cost: \$1 to \$5 per month.

### P04: GCP infrastructure with Terraform

What happens if the entire platform is deleted? Can it be rebuilt? Terraform answers that. Instead of going into the GCP console and creating resources one by one through clicks, you describe what you need (databases, storage, services, permissions) in text files, and Terraform creates it. A single command (`terraform apply`) reconstructs everything from scratch.

This matters for three concrete reasons. Reproducibility: anyone with access to the repository can stand up the complete platform. Auditability: every infrastructure change is recorded in Git, just like code. Collaboration: changes are reviewed in pull requests before being applied, with `terraform plan` showing exactly what will change.

The platform has 24 resources organized in 6 modules. For automated deployment, GitHub Actions connects to GCP using Workload Identity Federation, which generates short-lived temporary tokens without storing passwords or service account keys. Nobody holds static credentials that could leak.

The initialization paradox: Terraform stores its state in a GCS bucket, but that bucket is part of the infrastructure Terraform should create. You cannot initialize Terraform without the bucket, and you cannot create the bucket without Terraform. The solution is to create the bucket first with local state on disk, then migrate. A problem that seems trivial but only surfaces when you actually deploy.

Cost: \$0. Terraform is open source. The state bucket costs fractions of a cent.

### P05: True streaming pipeline (local only)

P03 answers "what happened today?" after the fact. P05 answers "what is happening right now?" as it unfolds. The difference matters in production: fraud detection needs seconds, not hours.

What does true streaming give you that batch does not? Three things. First: late-arriving data is handled correctly; a claim registered 40 minutes late gets incorporated into the right time window instead of being lost or double-counted. Second: results update as new information arrives, rather than producing a single final number at end of day. Third: guaranteed deduplication, each event processed exactly once per window regardless of whether the message was resent.

Technically, P03 uses discarding mode (each result is independent). P05 uses accumulating mode (each result includes everything before it), accepts data up to one hour after window close, and guarantees exactly-once processing through state-based deduplication.

P05 is not deployed because streaming Dataflow costs \$50 to \$100 per day; it requires workers running permanently. The code is Dataflow-ready; only the deployment target changes. Not deploying it is a cost decision, not a technical limitation. A two-hour demo would cost under \$10 if needed to prove it works in production.

### P06: Insurance pricing ML pipeline

Everything above converges here: data from the warehouse, processed by the orchestrated pipeline, feeds a pricing model. Feature engineering is pure SQL across three transformation layers, designed for BigQuery ML without modification.

The model is a Tweedie GLM with power parameter $p = 1.5$. The Tweedie distribution is the actuarial standard for pure premium modeling because it handles a property unique to insurance data: most policyholders in a given period file zero claims (point mass at zero), but when claims do occur, the cost is continuous and positive. The Tweedie with $1 < p < 2$ is a compound Poisson-Gamma: the frequency-severity decomposition the industry has used for decades, estimated in a single regression pass. Pure premium: $E[Y] = \exp(X\beta)$, where $Y$ is total cost per policy and $X$ includes vehicle, driver, and geographic characteristics.

Model evaluation uses actuarial metrics: the Gini coefficient for discriminatory power, lift curves across predicted risk deciles, and the actual-to-expected (A/E) ratio by coverage type. An A/E ratio materially different from 1.0 means the tariff is inadequate for that segment; that is exactly the diagnostic the CNSF expects in a premium sufficiency technical note.

Why Tweedie GLM rather than XGBoost? Interpretability and regulatory compliance. The CNSF requires explainable pricing models. A GLM produces multiplicative relativities for a tariff table. The <a href="/en/blog/actuarial-ml-pricing/">insurance pricing ML project</a> demonstrates that gradient boosting outperforms GLMs on discriminatory power; this project establishes the regulatory baseline that comparison is made against.

## The cost strategy

| Project | Monthly cost | Conventional equivalent |
|---------|-------------|-------------------------|
| P01: Claims warehouse | < \$1 | Enterprise data warehouse: \$500+/mo |
| P02: Orchestrated ELT | \$0.10 | Cloud Composer: \$400+/mo |
| P03: Streaming intake | \$1-5 | Streaming Dataflow: \$1,000+/mo |
| P04: Terraform IaC | \$0 | Manual console provisioning |
| P05: Streaming pipeline | \$0 (local) | Streaming Dataflow: \$1,500+/mo |
| P06: Pricing ML | < \$1 | Vertex AI managed endpoints: \$200+/mo |
| **Total** | **< \$10/mo** | **\$3,600+/mo** |

The philosophy here is not cost minimization. It is selecting the right tool for the actual workload. Cloud Composer costs \$400/month because it runs a persistent Kubernetes cluster with the Airflow webserver, scheduler, and workers always on. If your pipeline needs that (complex DAGs, SLA monitoring, dynamic task generation), Composer is the right choice. For five sequential steps on a cron schedule, you are paying for infrastructure you never use. DuckDB locally for zero-cost iteration, Cloud Run with scale-to-zero so production costs accumulate only when requests arrive, Beam in batch mode for streaming patterns at a fraction of the operational cost. Every decision has a technical rationale; the savings are a consequence.

## Key decisions and trade-offs

| Decision | Choice | Alternative | Rationale |
|----------|--------|-------------|-----------|
| Local database | DuckDB | PostgreSQL | Zero-install, in-process, columnar. Fast enough for development data volumes. |
| Orchestrator (local) | Dagster | Airflow | Free UI, software-defined assets. Reference Airflow DAG included for employers who use it. |
| Orchestrator (cloud) | Cloud Run + Scheduler | Cloud Composer | 4,000x cost difference for a linear pipeline with no fan-out. |
| Streaming approach | Beam batch mode | Beam streaming on Dataflow | 1,000x cost difference. Identical API surface. Code is deployment-target agnostic. |
| Pricing model | Tweedie GLM | XGBoost / LightGBM | Interpretability for CNSF regulatory compliance. Gradient boosting explored separately. |
| Infrastructure provisioning | Terraform | Console / gcloud CLI | Reproducibility. If the project is deleted, `terraform apply` rebuilds everything. |
| CI/CD authentication | Workload Identity Federation | Service account keys | No static credentials to rotate or leak. |

Each trade-off has a different correct answer in a different context. An insurer with 200 interdependent DAGs needs Composer. A fraud detection pipeline needs true streaming. Pricing for millions of policies justifies XGBoost with SHAP. The right decisions are the ones that demonstrate understanding of the trade-offs, not the ones that follow convention by default.

## The connection to actuarial work

Actuarial work, at its core, is about taking large volumes of uncertain events (claims, payments, recoveries) and turning them into reliable numbers: reserves, premiums, capital requirements. A data platform does exactly the same thing, but automated.

Claims arrive one by one (streaming), get grouped by period (warehouse), get aggregated into development triangles (marts), and feed pricing models. That flow is the actuarial process. The difference is that instead of relying on someone copying columns correctly between files, every step is automated, verified with tests, and recorded in Git. When the CNSF asks how you arrived at a number, the answer is a commit hash, a pipeline execution log, and 52 passing tests.

The connections to the rest of the portfolio are natural. <a href="/en/blog/sima/">SIMA</a> computes graduated mortality, commutation functions, and capital requirements under LISF; all of that needs clean data as input, exactly what this platform produces. The <a href="/en/blog/actuarial-ml-pricing/">insurance pricing ML project</a> uses the same frequency-severity decomposition as P06, but explores more complex models to compare against the regulatory baseline. The <a href="/en/blog/data-analyst-portfolio/">data analyst portfolio</a> is the analysis layer on top of this infrastructure: dashboards and reports that consume what the marts produce.

## What I would change

The most significant limitation is the synthetic data. Every project generates claims with calibrated distributions (lognormal severity, Poisson frequency, exponential report lag), but synthetic data lacks the real correlations, seasonality, and tail behavior of production data. The natural next iteration is migrating to freMTPL2 (French Motor Third-Party Liability), a public dataset that is actuarially realistic and comparable against published benchmarks.

P05's streaming pipeline should run on Dataflow at least once, even for a two-hour demo. Local execution proves the code works; Dataflow execution proves the deployment works. That distinction matters.

Data quality monitoring is also missing. Great Expectations or a similar framework sitting between ingestion and transformation would catch schema drift and distribution shifts before they propagate to the warehouse. In production, data quality is as critical as service availability.

When data infrastructure is reliable, actuarial judgment can focus on what actually matters: choosing assumptions, calibrating models, interpreting results. Not cleaning data.

The code, tests, and infrastructure definitions are on <a href="https://github.com/GonorAndres/data-engineer-path" target="_blank" rel="noopener">GitHub</a>. The claims dashboard is live on <a href="https://data-engineer.gonor.me" target="_blank" rel="noopener">Cloud Run</a>.
