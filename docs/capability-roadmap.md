# Capability roadmap (exploration, 2026-09-28)

The [September 2026 skill-gap review](https://drive.google.com/file/d/13Bbwml02eQ4kxSgYtTXnhvmdi8Jk_Kom/view?usp=sharing) compares the portfolio with 39 job postings in Mexico. It is a snapshot of demand, not a specification for eight new projects. Experience thresholds, degree requirements and location cannot be fixed by adding a framework to a repository. The ranking and counts in that review are hypotheses to revisit as postings change.

## Direction

AI engineering leads the next investigation. BI and actuarial work stay in scope because they supply useful data and difficult test cases. The aim is to build capabilities that would remain useful if the sampled postings disappeared:

- Reliable AI systems: establish a retrieval and answer-quality baseline, inspect failures, control tool access, and measure changes before making claims about improvement.
- Decision-quality data products: model data at a consistent grain, reconcile metrics, document uncertainty and make the result inspectable by someone who did not build the pipeline.
- Domain applications: test those methods against real regulatory and business questions. Insurance gives the AI work meaningful citation and correctness requirements; commercial data gives the BI work decisions to support.

Do not create separate projects merely to collect AWS, Tableau, SAS, VBA or other job-description keywords. A new dependency needs a concrete problem and a result that can be evaluated. Keep private employer data and tailored job-search material out of this public repository.

## First pass: evidence audit

Before changing the public CV, cards or posts, record each material claim, its current evidence, and an action: retain, qualify, remove, or build proof. Check the working artifact, not just a README or a tag. Synchronize `src/data/projects.ts`, the corresponding ES/EN posts, and `cv/cv-andres-gonzalez.tex` only after the evidence is checked. Publishing the CV PDF or changing the permanent Drive file requires separate approval.

Start with these candidates for verification:

| Claim or question | Current observation | Decision to investigate |
|---|---|---|
| Power BI on the Data Analyst Portfolio card | `src/data/projects.ts` lists it; the gap review found no completed Power BI artifact in the linked project | Verify against the source. If unsupported, remove the tag and check both blog versions; restore it only after a working artifact exists. |
| Advanced Excel on the public CV | `cv/cv-andres-gonzalez.tex` claims it; the review cites an Excel quoter but limited public evidence for pivots or Power Query | Inspect the workbook and describe only what it demonstrates. Do not infer VBA competence from Excel use. |
| Insurance-pricing model repository | `src/data/projects.ts` already omits a public repo link because the source repository is private | Keep it unlinked unless its owner separately approves publication. The review's broken-link action is stale for the card; check posts independently before calling them fixed. |
| LangGraph and agent evaluations | The review cites a private lab and a small LISF retrieval benchmark | Inspect the implementations and permission to publish before adding public links or stronger claims. |

The review also suggests wording and certifications. Verify each employment detail with Andrés and the public CV before using it; do not publish client names, proprietary data, private repositories or unearned credentials. A certificate can support an existing skill, but cannot substitute for a working example.

## Workstream A: reliable AI

Use the existing LISF/CUSF agent as the first case. Inspect its current FTS5/BM25 retrieval, citation path, gold queries and deployment constraints. Record baseline retrieval, citation correctness, abstention on unanswerable questions, latency and cost with a versioned evaluation set. Include ambiguous cross-references and adversarial instructions in held-out tests; review expected citations by hand.

Try dense retrieval and reranking as comparisons against that baseline. Keep the simpler system if the added complexity does not improve the relevant failures. Add injection, PII and tool-permission tests where the threat model warrants them. LangGraph, MCP and tracing are candidates only when orchestration, external tool access or diagnosis needs them. Do not claim measured improvements before the tests run. Separate any future deployment or public corpus release from this planning work.

Exit criterion: a reproducible comparison with failure examples and justified design choices, plus a documented path from an answer back to its legal source. The evaluation method should be usable with a second document collection without copying LISF-specific assertions into generic code.

## Workstream B: decision-quality data

Choose one coherent public dataset and a question someone could actually decide from its metrics. Define grain, keys, reconciliations and assumptions first. A Power BI report and an Excel companion can then test whether the same definitions survive different tools. Tableau is optional and should be added only if comparing its interaction or sharing model teaches something.

Do not merge GA4 sample sessions, Olist orders and synthetic advertising costs as though they were observations from one company. If synthetic spend is needed, label it in the dataset, calculations, visuals and write-up; simulated ROAS or CAC is an illustration, not a measured campaign result. Show missing data and sensitivity to allocation assumptions rather than presenting fabricated precision.

Exit criterion: source data and transformations can be traced to the reported measures, the dashboard and workbook agree on shared metrics, and the write-up states which decisions the evidence does and does not support.

## Sequence and decision gates

1. Evidence audit and correction proposals. No unsupported skill stays in a public claim merely because it appears frequently in postings.
2. LISF baseline and error taxonomy. Choose the next AI change from observed failures, then rerun the same evaluation.
3. Select the BI dataset and model. Build the smallest report and workbook that expose reconciled metrics.
4. Review the two results and the next sample of postings. Only then choose whether to deepen AI, analytics, or actuarial work. Cloud ports, automation agents and IFRS modules are deferred, not promised deliverables.

This document records direction, not authorization to modify sibling repositories, deploy services, spend on cloud or examinations, make private projects public, or publish CV revisions.
