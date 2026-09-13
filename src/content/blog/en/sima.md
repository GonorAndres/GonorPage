---
title: "SIMA: From Raw INEGI Data to Solvency Capital Requirements Under Mexican LISF, End-to-End"
description: "SIMA centralizes actuarial techniques for pricing life insurance: it takes raw mortality data from INEGI/CONAPO, graduates it with methods like Whittaker-Henderson and Lee-Carter to obtain curves that respect human biology, and projects forward to calculate premiums, reserves, and capital requirements under LISF. Everything exposed as an API, allowing it to connect with other systems, automate sensitivity analysis, and meet CNSF requirements. Open source and built to expand into other lines of business."
date: "2026-03-15"
category: "proyectos-y-analisis"
lang: "en"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Python · FastAPI · React · scipy"
  datos: "INEGI · CONAPO · Human Mortality Database"
  regulacion: "LISF · CUSF · CNSF (SCR/RCS, Solvencia II)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/SIMA"
  live: "https://sima.gonor.me"
tags: ["Lee-Carter", "mortality", "LISF", "CUSF", "CNSF", "Whittaker-Henderson", "SVD", "reserves", "SCR", "commutation-functions", "INEGI", "CONAPO", "FastAPI", "React"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/sima.webp"
heroAlt: "Mortality observations become a graduated curve, a projection with uncertainty, and actuarial calculation blocks."
heroCaption: "Graduating and projecting mortality connects observed data with premiums, reserves, and capital calculations."
---

The actuarial science curriculum in Mexico teaches $q_x$, $p_x$, commutation functions, and the equivalence principle. It also teaches how to build life tables. What it treats as secondary, as a mechanical exercise, is precisely what defines actuarial work in practice: given real empirical data, what is the best way to arrive at that table? Which graduation method, which projection model, how to handle a catastrophic event in the time series. Those decisions have concrete regulatory and financial implications, and they are the core of what an insurer defends before the CNSF every quarter. SIMA is an attempt to build that entire pipeline, from raw CSV to final SCR, with every step documented, tested, and exposed via API.

The starting point is raw Mexican mortality data: death counts by age and year from INEGI crossed with mid-year population estimates from CONAPO. The resulting crude rate $m_{x,t} = d_{x,t} / E_{x,t}$ is noisy, especially at extreme ages, and requires a formal graduation method before those numbers become actuarially useful. That distance between the raw datum and the pricing-ready life table is the central problem SIMA solves.

## The mortality pipeline

Graduating mortality rates is analogous to fitting a trend line, but with a constraint: the curve must respect the known biological shape (bathtub curve). Whittaker-Henderson does exactly that: it optimizes $(W + \lambda D'D)^{-1} W m$, where $\lambda$ is the parameter that decides how much weight to give the observed data vs. the expected smoothness. With low $\lambda$, you reproduce every oscillation; with high $\lambda$, you impose a trend. With data from Mexico, $\lambda$ between 10 and 1000 with second-order differences produces curves that respect those patterns without chasing sampling noise. The solution is solved efficiently with `scipy.sparse.linalg.spsolve`.

On top of the graduated data, SIMA fits the Lee-Carter model: $\ln(m_{x,t}) = a_x + b_x \cdot k_t$. Each parameter has a precise demographic interpretation. $a_x$ is the average age pattern of mortality, the general shape of the curve. $b_x$ measures each age's sensitivity to temporal change: ages where $b_x$ is high improve rapidly when $k_t$ declines, ages where $b_x$ is low are refractory to improvement. $k_t$ is the temporal mortality index, a single number per year that summarizes the long-term historical trend in mortality improvement.

SVD estimation yields exactly the rank-1 approximation that maximizes explained variance of the log rates. With Mexican data from 1990-2019 (pre-COVID), the first singular component explains 77.7% of the variance, consistent with the international literature. SIMA also processes data from the U.S. and Spain via the Human Mortality Database, which allows comparing improvement speeds across markets: the Mexican pre-COVID drift ($-1.076$) against the American and Spanish ones reveals that mortality does not improve at the same pace everywhere.

The interesting problem emerged with $k_t$ re-estimation. The original Lee-Carter method requires re-estimating $k_t$ so that the total observed deaths match the total implied by the model. This is solved by finding the point where a residual function crosses zero. But when you pre-graduate the data with Whittaker-Henderson, some $b_x$ values become negative at specific ages (77, 78, 85 in the Mexican data), which makes that function bend inward without crossing zero: the standard algorithm looks for a crossing and cannot find one, so it fails silently. The fix was an adaptive bracket search that progressively expands the interval until it finds that crossing, or recognizes none exists and falls back to the SVD $k_t$ directly. This is the kind of detail that never appears in textbooks but determines whether your code works on real data.

Projection uses Random Walk with Drift: $k_{T+h} = k_T + h \cdot \text{drift} + \sigma \sqrt{h} \cdot Z$. The estimated pre-COVID drift is $-1.076$ (mortality consistently improving). The negative sign is intuitive: in Lee-Carter, $k_t$ falls when mortality improves, because $b_x$ is positive on average and $\ln(m_{x,t})$ decreases when people live longer. A drift of $-1.076$ means the mortality index fell, on average, 1.076 points per year over that period. When you include the pandemic years, the drift rises to $-0.855$: the long-run improvement trend slowed. The premium impact is direct and quantifiable: between 3% and 10% increase depending on the product and issue age. That number matters because it is exactly the kind of analysis the CNSF expects in a premium sufficiency technical note.

## The financial engine

Once you have a projected life table, the step to commutation functions is computationally trivial but conceptually deep. $D_x = v^x \cdot l_x$ combines survivorship with the time value of money in a single number. $N_x = \sum_{k=x}^{\omega} D_k$ is computed via backward recursion: $N_{\omega} = D_{\omega}$, $N_x = N_{x+1} + D_x$. What appeared to be nested summations of $O(n^2)$ complexity become $O(n)$ operations. Commutation functions are, in essence, a data structure that precomputes all the actuarial information needed for any annuity, insurance, or reserve calculation.

The most important finding from the sensitivity analysis is that the interest rate dominates everything. For a whole life policy issued at age 40, moving the technical interest rate from 2% to 8% produces a 101% spread in net premium (\$17,910 vs \$7,014). Mortality shocks matter but are asymmetric: a 30% increase in $q_x$ generates +16.2% in premium, but a 30% decrease generates -18.2%.

This asymmetry is called convexity: premiums react more strongly to an improvement in mortality than to an equivalent deterioration. Term insurance is the most proportional to mortality, nearly linear. Endowments are the least sensitive: the savings component dominates and absorbs demographic shocks.

## Capital requirements under LISF

The Solvency II framework, adapted in Mexico through LISF and CUSF, requires insurers to hold sufficient capital to absorb losses at the 99.5% confidence level over one year. SIMA implements four SCR life risk modules, using the European standard formula as a reference: mortality (+15% shock to $q_x$), longevity (-20% shock to $q_x$), interest rate ($\pm$100 bps as a first approximation to a curve shock), and catastrophe (+35% spike calibrated from COVID data as a proxy for the pandemic module). The key identity that simplifies everything is that the BEL (Best Estimate of Liabilities) is the prospective reserve. No new mathematics are needed: $\text{BEL} = SA \cdot A_{x+t} - P \cdot \ddot{a}_{x+t}$ for death products, and $\text{BEL} = \text{pension} \cdot \ddot{a}_x$ for life annuities. The commutation function machinery you already built for pricing serves identically for Solvency II.

The test portfolio results reveal the risk structure of a life insurance book. Interest rate risk accounts for 79.7% of total SCR because it affects all products simultaneously. Longevity risk ranks second (44.4% before diversification) because annuities dominate the BEL: \$4.27M of \$5.16M total (83%). Mortality risk is surprisingly small (4.2%) because death products represent little relative reserve. Catastrophe risk is the smallest (2.4%). Diversification reduces the SCR by 14.4%, thanks to the negative correlation between mortality and longevity ($\rho = -0.25$): an event that increases deaths simultaneously reduces annuity obligations.

## Engineering decisions

The backend consists of 12 Python modules with a progressive dependency chain: `a01_life_table` depends on nothing, `a02_commutation` depends on `a01`, and so on through `a12_scr` which integrates everything. Each module exposes a clean interface, and the tests verify formal actuarial properties: the fundamental identity $A_x + d \cdot \ddot{a}_x = 1$ confirms that actuarial values are internally consistent, and the convergence of $l_x$ to zero confirms that the life table is demographically valid. There are 240 tests in total, including 33 integration tests that verify the API endpoints.

The pipeline is sex-differentiated: male, female, and unisex. HMD (Human Mortality Database) data cannot be redistributed under its CC BY 4.0 license, so the CI tests use mock data generated with Gompertz-Makeham: $\mu(x) = A + B \cdot c^x$, calibrated to reproduce the biological pattern of Mexican mortality including the infant spike and young-adult hump.
## What this project taught me

Three technical lessons I did not expect. First: the identifiability constraints of SVD in Lee-Carter are precisely what gives the parameters demographic interpretation. Without the constraint $\sum b_x = 1$, $b_x$ and $k_t$ are defined only up to an arbitrary multiplicative constant, and you lose the ability to compare sensitivities across ages. Second: the fundamental identity $A_x + d \cdot \ddot{a}_x = 1$ says something concrete: one unit of currency received today can be decomposed exactly into a life insurance (contingent payment at death) plus a life annuity (contingent payments during survival). If your commutation functions do not satisfy this identity to numerical precision, there is a bug. Third: the bridge between empirical and theoretical actuarial work is the `to_life_table()` method, which converts projected central rates $m_x$ into probabilities $q_x = 1 - e^{-m_x}$ and builds $l_x$ from them. That 15-line method connects the entire Lee-Carter pipeline to the entire classical commutation machinery. Without it, you would have two worlds that do not speak to each other.

SIMA is a demonstration that an actuary can understand and build every layer of the regulatory pipeline, from raw demographic data to the number that appears on the solvency report. The code, tests, and documentation are on <a href="https://github.com/GonorAndres/SIMA" target="_blank" rel="noopener">GitHub</a>, and the application is deployed on <a href="https://sima.gonor.me" target="_blank" rel="noopener">Google Cloud Run</a>.
