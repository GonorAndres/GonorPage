# Insurance Pricing Lab — source of truth for the blog post

Written 2026-09-13 from the deployed app and the research repo, not from memory.
Every number below was read out of `results.json`, `reports/RESULTS.md`, or a live
response from the production API. The post that gets written from this file
should not introduce a figure that is not here; if a new one is needed, take it
from the repo rather than estimating it.

## What the project is

Two repos, one exhibit:

| Repo | Role | Visibility (2026-09-13) |
|---|---|---|
| `GonorAndres/insurance-pricing-ml` | research: pipeline, tuning, SHAP, fairness audit | private |
| `GonorAndres/insurance-pricing-lab` | public exhibit: Guide page + interactive Lab, FastAPI backend | private |

The lab serves the frozen model files exported from the research repo. It does
not retrain anything at request time.

**Live:** https://ml-insurance.gonor.me (Spanish at `/`, English at `/en`, lab at
`/lab` and `/en/lab`). Frontend on Cloudflare Pages, backend on Cloud Run
(`insurance-pricing-lab`, `us-central1`), reached through a same-origin
`/api/*` proxy so the browser never makes a cross-origin call.

**Caveat to respect when writing:** both repos are private. The Guide page invites
readers to the research repository and that link 404s for anyone who is not the
owner. Either the repo goes public before the post links it, or the post should
not promise a repo the reader cannot open.

## The question the project answers

Whether a machine-learning model beats the standard actuarial formula by enough
to justify replacing it, given that an insurer has to defend every price to a
regulator who did not build the model.

The answer the work supports: it wins on **ranking risk**, it does not win on
predicting an individual driver's year, and it does not clear the bar to replace
a filed formula. It lands as a **challenger** whose findings feed new terms back
into the GLM.

## Data

- freMTPL2, public benchmark, French motor insurer, via `fetch_openml` IDs
  **41214** (frequency) and **41215** (severity).
- **678,013** policies. Split **406,807 train / 135,603 validation / 135,603 test**.
  Validation is used for Optuna and early stopping; all reported metrics are test set.
- Two cleaning steps only, no rows dropped: `Exposure` capped at 1.0, `ClaimNb`
  capped at 4 (a handful of policies reported 5 to 16 claims on almost no exposure).
- Severity test set: **4,999 claims**.

## Headline numbers (test set)

| Model | Gini | D² (Poisson deviance explained) |
|---|---|---|
| Poisson GLM | 0.242 | 0.031 |
| XGBoost | 0.341 | 0.085 |
| LightGBM | 0.337 | 0.086 |

- Gini improvement GLM → XGBoost: **+41%** relative.
- Top-decile to bottom-decile predicted frequency spread: **GLM 4.5×, XGBoost 4.8×**.
- XGBoost has the higher Gini, so it is the model used for SHAP, fairness, and the lab.
- **D² is low for all three and that is the expected result, not a bug.** Whether a
  specific driver files a claim in a given year is mostly random; the published
  freMTPL2 literature lands in the same place. Do not write this up as a
  disappointment, and do not write it up as a triumph either.

### Tuning

40 Optuna trials per model, on a 2-vCPU machine: **320s XGBoost, 252s LightGBM**.
Enough for a fair comparison between the two, short of pushing either to its limit.
Say that plainly rather than implying an exhaustive search.

### SHAP (TreeSHAP, mean |SHAP|)

| Feature | Mean abs SHAP |
|---|---|
| BonusMalus | 0.2927 |
| VehAge | 0.1870 |
| DrivAge | 0.1286 |
| Region | 0.0711 |
| VehBrand | 0.0674 |
| VehPower | 0.0635 |
| Density | 0.0510 |
| Area | 0.0314 |

Worth a paragraph: the boosted model leans hardest on **driving record and
vehicle**, while the GLM's largest multipliers are **area and region dummies**
(Area_E 1.237, Area_F 1.228, Region_R21 1.214). Do **not** claim SHAP and the
coefficient table rank the same factors; they do not, and the difference favours
the boosted model. GLM relativities on category dummies are also not comparable
to coefficients on continuous variables, so avoid a "top factor" table that mixes
the two.

### Fairness audit by Area (A rural → F dense city)

Mean absolute deviation from actual frequency across the six area codes:
**GLM 0.0020, XGBoost 0.0021**, about a 5% relative difference. Largest single
gap is Area F at **0.0037** claims per policy-year.

Reading: this run found no meaningful evidence the boosted model uses density as
an unfair proxy beyond what the GLM already does. It is a null result on one
variable in one dataset. It is not a clean bill of health for the method.

## The limitations the post has to carry

These are already published on the Guide page, so a post that omits them reads as
a weaker version of the site it links to:

- **Severity failed.** The Gamma GLM scored **D² = −0.051** on the 4,999 test
  claims: worse than charging every claimant the average claim. Published, not
  dropped. What a crash costs depends on circumstances no policy variable records.
- Only the frequency half of the price was modelled well. There is no pure
  premium, no risk margin or expense loading, no credibility weighting for thin
  segments, no capital or solvency view, no reserving.
- Validation is a single random split. No hold-out year was reserved, so nothing
  tests what happens when driving behaviour shifts.
- The tuning budget was deliberately modest (see above).

## Toolkit, and what would extend it

Used: Poisson GLM with exposure offset (frequency), Gamma GLM (severity), XGBoost
and LightGBM tuned with Optuna and early stopping, TreeSHAP, double-lift chart,
fairness audit by segment. All standard in the actuarial literature on purpose;
an unfamiliar method would have made the result harder to check against published work.

Not done, and each is the honest next step rather than a flaw: Tweedie for the
pure premium in one step, **monotonic constraints** (so predicted frequency has to
rise with bonus-malus, a structure a regulator can verify without reading a single
tree), splines or a GAM where the double-lift chart runs flat, credibility
weighting so small regions cannot move the table on a handful of claims.

## Regulatory framing

LISF requires the frequency/severity split and a technical note the regulator can
audit; Solvency II imposes the equivalent demand in Europe. A model that ranks
risk better but cannot be written as a rate structure does not clear that bar,
whatever its Gini. This is why the conclusion is "challenger, not substitute", and
it is the natural bridge to the SIMA post (SIMA is the LISF capital and reserving
implementation; this project is the pricing side of the same regulation).

## Live behaviour, verified 2026-09-13

- `/`, `/lab`, `/en` → 200
- `/api/health` → `{"status":"ok"}`
- Sample prediction, `POST /api/predict` with DrivAge 35, VehAge 5, VehPower 6,
  BonusMalus 60, Density 1000, Area C, VehBrand B1, VehGas Regular, Region R24,
  Exposure 1 → **GLM 0.1004, XGBoost 0.0809** predicted claim frequency.
  A usable concrete example for the post: on this particular safe-ish profile the
  boosted model prices *below* the formula.

## When the post is written

1. Filename: same English slug in `src/content/blog/es/` and `src/content/blog/en/`.
   Suggested slug `insurance-pricing-lab`, which keeps it distinct from the existing
   `actuarial-ml-pricing` post.
2. Add `blogSlug: 'insurance-pricing-lab'` to the `insurance-pricing-lab` card in
   `src/data/projects.ts`. It is deliberately absent right now: `FeaturedProjects.astro`
   turns `blogSlug` into a `/blog/<slug>/` link, and the post does not exist yet.
3. `ficha` block: `rol`, `stack`, `estado`, `live: https://ml-insurance.gonor.me`,
   and `repositorio` only once the repo is public.
4. The existing `actuarial-ml-pricing` post (ES and EN) still describes the research
   repo alone and does not know the lab exists. It needs a link to
   `https://ml-insurance.gonor.me` and a `lastModified` bump in the same pass.
5. `PORTFOLIO_STATUS_AND_DOMAIN.md` (repo parent directory) does not list
   `ml-insurance.gonor.me` yet. Add it to the live-links table.
