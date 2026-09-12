---
title: "CreditGraph: Topological Credit Risk with Neo4j, PySpark, and LightGBM"
description: "Traditional credit analysis treats each loan as independent, but guarantee chains, circular guarantees, and ownership concentration create correlated exposure that relational models cannot express. This project models a 500-client portfolio as a Neo4j knowledge graph, processed with PySpark on Databricks and scored with calibrated LightGBM, to surface structural risk patterns that SQL keeps hidden."
date: "2026-03-30"
category: "proyectos-y-analisis"
lang: "en"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Neo4j · PySpark · Databricks · LightGBM · Python"
  datos: "Registro PSC del Reino Unido · GLEIF · 500 clientes ficticios"
  regulacion: "CNBV Circular Única de Bancos (Art. 73, Circular 3/2012)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/graph-relation-db"
  live: "https://graph-db.gonor.me/"
tags: ["Neo4j", "PySpark", "Databricks", "Credit risk", "Cypher", "LightGBM", "Platt calibration", "Graphs"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/credit-graph-topological-risk.webp"
heroAlt: "One shared owner connects three groups of borrowing companies in a relationship map."
heroCaption: "Shared ownership can connect loans that appear independent when reviewed record by record."
---

When AIG collapsed in 2008, the most expensive question wasn't how much individual clients owed. It was who guaranteed whom, and how many degrees of separation existed between a toxic mortgage and an institution that claimed to have no exposure. Lehman Brothers needed 7,000 legal entities to report its risk structure to regulators, a structure no relational database could represent coherently. That's why GLEIF exists today: to map global ownership topology in a format models can actually read.

The problem wasn't a lack of data. It was a lack of structure for seeing connections.

## Why SQL isn't enough

A loan table in SQL has one row per credit. Each row is, from the engine's perspective, completely independent of every other. You can JOIN to relate borrowers to guarantors, and with another JOIN you can reach the guarantor's guarantor. But SQL has no native notion of variable depth: the query that searches two hops away is structurally different from the one that searches five hops.

In a real portfolio, that matters. A borrower with a 725 bureau score can have an impeccable individual profile while sitting two nodes away from an active default, via a guarantee chain no analyst has traced because the database doesn't make it easy. Three borrowers can guarantee each other in a closed loop, reporting 100% coverage when the actual coverage is zero: if any of the three defaults, the system collapses in cascade.

That's not a data quality problem. It's a representation problem.

## The real motivation: Neo4j and Databricks in job listings

Looking through credit risk job postings, two names kept appearing: Neo4j for relationship modeling and Databricks for at-scale processing. I didn't want to study them through isolated tutorials. I wanted to build something where the problem itself demanded those tools, where the technology choice wasn't arbitrary but the logical consequence of what the problem requires.

A credit portfolio with guarantee structures and ownership topology is that problem.

## The architecture

The project has four layers that connect in sequence.

**Data with real topology.** The foundation isn't a randomly generated graph. Corporate entity nodes come from the UK PSC register (Person with Significant Control) and from GLEIF for Mexican entities: real ownership data where edges represent verified legal relationships. On top of that topology, 500 fictional clients were embedded with their loans, guarantees, and credit attributes.

**PySpark ETL on Databricks.** Five CSVs with 1,150 records total, and 127 intentionally planted quality problems: null values in key fields, Mexican states without standardization (records with "Jalisco", "JAL", and "jalisco" coexisting), inconsistent date formats, negative amounts. The pipeline catches all of them.

At 1,150 rows, pandas solves this in milliseconds. I chose PySpark because I wanted to force myself to think in production patterns from the start: explicit `StructType` schemas instead of `inferSchema=True` (which guesses types and you find out about the error three months later), anti-joins for foreign key validation instead of `.isin()` which chokes the driver on large datasets. It took longer than pandas would have, but every mistake I made in PySpark at this scale is one I won't make when the data actually matters.

**LightGBM scoring with Platt calibration.** The classification model produces scores, but raw scores from a classifier are not probabilities. LightGBM optimizes AUC, not calibration. The difference matters: if the model says "score 0.8", that doesn't mean 80% of those borrowers will default. It might mean 40% default, or 60%, depending on how scores are distributed.

To convert scores into usable probability of default (PD) values for the expected loss formula (EL = PD × EAD × LGD), calibration is necessary. Platt calibration fits a logistic regression on model scores using a calibration set separate from both training and test: three partitions instead of two. The calibration set is the difference between a number the model uses internally and a PD the provisioning team can use to calculate reserves.

**Neo4j AuraDB: 853 nodes, 726 edges.** The final graph has corporate entities, individuals, borrowers, loans, and guarantees as nodes; edges represent ownership stakes, guarantees issued, and control relationships. With 248 scored loans embedded in the graph, Cypher queries can combine topology with calibrated scores in a single expression.

## What the graph sees that SQL doesn't

The stress testing notebook runs four Cypher queries against the live graph. Each reveals a category of risk invisible in the relational view.

### Guarantee chains

```cypher
MATCH path = (defaulted:Client)-[:GUARANTEES*1..5]->(target:Client)
WHERE defaulted.loan_status = 'Default'
  AND target.loan_status <> 'Default'
RETURN target.name,
       target.bureau_score,
       length(path) AS hops,
       [n IN nodes(path) | n.name] AS chain
ORDER BY hops ASC
```

The `[:GUARANTEES*1..5]` operator traverses up to five hops in a single expression. No five nested JOINs, no recursive CTEs: variable depth is native in Cypher. The result: a borrower with a 725 bureau score appears two hops from an active default. In the SQL view, that borrower is low risk. In the graph, their immediate guarantor has a guarantor in default.

### Circular guarantees

```cypher
MATCH path = (a:Client)-[:GUARANTEES*2..6]->(a)
RETURN [n IN nodes(path) | n.name] AS cycle,
       length(path) AS cycle_length,
       reduce(exp = 0, n IN nodes(path) |
         exp + n.total_exposure) AS combined_exposure
```

Three borrowers guarantee each other in a closed loop. Combined exposure reported as guaranteed reaches MXN 2.1 million. Actual coverage in case of default is zero. This violates CNBV Circular 3/2012 on reciprocal guarantees: the regulator considers them fictitious coverage instruments and requires institutions to identify them and exclude them from credit risk mitigation calculations.

Cycle detection on a graph is trivial. The same logic in SQL requires a recursive CTE with depth defined upfront, and in engines without recursive CTE support it becomes impractical.

### Concentration by individual

```cypher
MATCH (p:Person)-[:CONTROLS]->(company:Company)-[:HAS_LOAN]->(loan:Loan)
WITH p,
     count(DISTINCT company) AS companies_controlled,
     sum(loan.outstanding_balance) AS total_exposure
WHERE companies_controlled >= 3
RETURN p.name,
       companies_controlled,
       total_exposure
ORDER BY total_exposure DESC
```

A single individual controls four companies in different sectors with total exposure of MXN 7.1 million. The four companies appear across different industries, which in the SQL view looks like diversification. In the graph, they're a single concentration point. CNBV Circular Única de Bancos Article 73 (related persons) requires institutions to identify and consolidate exposure to groups of connected persons, precisely because of this pattern.

### Contagion hubs

A company under restructuring has five shareholders with active loans. Aggregate indirect exposure through that hub is MXN 5.2 million. If the restructuring fails, the impact isn't limited to the company's own credit: it propagates to the five shareholders whose repayment capacity partly depends on the value of their stake.

## SQL vs. graph: stress test summary

| Dimension | SQL view | Graph view |
|:---|:---|:---|
| Individual risk | 725 bureau score = low risk | 2 hops from an active default |
| Guarantee coverage | MXN 2.1M reported | MXN 0 actual (closed loop) |
| Sector concentration | 4 companies, 4 sectors | 1 person, MXN 7.1M real exposure |
| Contagion risk | Not directly modelable | Hub with MXN 5.2M indirect exposure |

SQL wasn't wrong. It was correctly describing what the data structure allows it to see. The problem was the structure itself.

## The limitations worth naming

The data is synthetic. Ownership topology comes from real registries, but borrowers, amounts, scores, and guarantee relationships are fictional and designed to illustrate the patterns. In a real portfolio, the quality of these conclusions depends critically on two things: completeness of the guarantee registry (a chain that isn't in the system is invisible), and update frequency of the graph (a company entering restructuring today should change portfolio risk today, not at the next monthly cutoff).

The LightGBM model is also not production-ready. It wasn't calibrated on real Mexican default data, nor validated over a period long enough to capture a credit cycle. The PDs it produces are internally calibrated and useful for illustrating the technical flow; they're not estimates a provisioning team could use directly.

The full flow: PySpark cleans and validates, LightGBM scores with Platt calibration, Neo4j stores topology and scores, Cypher answers the questions SQL cannot formulate.

## Connection to the portfolio

The <a href="/en/blog/risk-analyst/" style="color: #C17654; text-decoration: underline;">Risk Analyst</a> project has a module (P10) that models interbank contagion with graph neural networks: the same intuition that network topology matters more than individual balance sheets, applied to systemic risk rather than portfolio credit risk. The <a href="/en/blog/regulation-agent-rag/" style="color: #C17654; text-decoration: underline;">regulation assistant</a> navigates the CNBV Circular Única de Bancos and LISF: the same rules this project applies in detecting related persons and reciprocal guarantees. And <a href="/en/blog/sima/" style="color: #C17654; text-decoration: underline;">SIMA</a> implements the actuarial math for reserves that the EL = PD × EAD × LGD formula feeds into directly.

The code is on <a href="https://github.com/GonorAndres/graph-relation-db" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">GitHub</a>.

What stays with me: cycle detection and variable-depth traversal are trivial in Cypher. These aren't minor advantages of Neo4j over SQL; they're fundamentally different capabilities. For a credit risk analyst working exclusively with relational models today, the cost of adopting a graph is a learning curve. The cost of not adopting one is the patterns the portfolio already has that the model simply cannot see.
