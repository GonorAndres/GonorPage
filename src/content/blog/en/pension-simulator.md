---
title: "IMSS Pension Simulator: Ley 73, Ley 97, and Fondo Bienestar in One Tool"
description: "Most Mexican workers do not know which pension regime they contribute under or what they will actually receive at retirement, and official sources do not simplify the comparison between Ley 73, Ley 97, and Fondo Bienestar. This simulator implements all three formulas with current data (UMA, CONSAR tables, EMSSA 2009 mortality) and lets users explore scenarios with interactive sensitivity analysis. The result is an educational estimate that shows what you control and what you do not."
date: "2026-03-16"
category: "proyectos-y-analisis"
lang: "en"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "R · Shiny · bslib · Plotly · Docker"
  datos: "DOF (reforma 2020) · CONAPO · IMSS (constantes regulatorias 2025)"
  regulacion: "LSS (Ley 73 · Ley 97 · Art. 167) · CONSAR · Fondo de Pensiones para el Bienestar (DOF 2024)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/seguridad-social/tree/main/fondo_bienestar"
  live: "https://simulador-pension-d3qj5vwxtq-uc.a.run.app/"
tags: ["R", "Shiny", "IMSS", "AFORE", "Pensions", "Ley 73", "Ley 97", "Fondo Bienestar", "social security", "CONSAR"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/pension-simulator.webp"
heroAlt: "Two routes convert a work history into pension payments; the individual-savings route includes a conditional supplement."
heroCaption: "The pension regime determines the calculation; on the individual-savings route, a supplement depends on eligibility."
---

Mexico's pension system is a legislative palimpsest. Since July 1997, two IMSS pension regimes have run in parallel. Workers who began contributing before that cutoff retire under Ley 73 (Law 73), a defined-benefit formula tied to salary and weeks worked. Those who started after 1997 fall into Ley 97 (Law 97), where individual AFORE accounts accumulate a balance that becomes their pension. Then, in May 2024, the government published the Fondo de Pensiones para el Bienestar (Welfare Pension Fund) decree. This third layer supplements pensions for Ley 97 workers earning below the IMSS average salary. The result: three overlapping rule sets, each with its own formulas, eligibility gates, and hidden assumptions. This simulator calculates all three in one place, with all rates updated to 2025.

## Two laws, three scenarios

Ley 73 uses a 23-bracket salary table (Article 167 of the LSS, Mexico's Social Security Law). Each bracket gets a base percentage (cuantia basica) plus an increment for every year worked beyond 500 weeks. A worker earning 1.77 times minimum wage with 1,500 weeks accumulates 19 years of increments, yielding roughly 73%. At 65, that's paid in full. At 60, the cesantia factor cuts it to 75%. The minimum pension floor is one monthly minimum wage: \$8,474 MXN in 2025. The mechanism is entirely deterministic. Plug in the same numbers, get the same answer, every time.

Ley 97 works differently. Worker and employer both contribute monthly to an individual AFORE account (Mexico's private pension fund administrators). The account balance grows by the real return minus the fund's management fee. At retirement, the pension comes from dividing the accumulated balance by the remaining months of life expectancy (retiro programado, scheduled withdrawal). Three unknowns drive the outcome: the AFORE's real return, the worker's contribution density (what fraction of months they actually contributed), and the administrator's commission rate. If the projected balance yields a pension below 2.5 monthly UMAs (\$8,598 MXN in 2025), the government guarantees that floor anyway.

The Fondo Bienestar adds a third layer, but only for Ley 97 workers who meet four conditions: enrolled under Ley 97, at least 65 years old, at least 1,000 contributed weeks, and earning below the Fund threshold (roughly \$17,364/month in 2025, indexed to IMSS average salary). For those who qualify, the Fund fills the gap between what the AFORE pension pays and 100% of their last salary, subject to the threshold cap.

## The reform that changes the math

The December 2020 DOF reform raised employer retirement contributions in phases from 2023 to 2030. The headline change: CEAV rates (Cesantia en Edad Avanzada y Vejez) stopped being flat. They're now tiered across 8 salary brackets, measured in UMAs (Mexico's inflation-indexed reference unit). At the top bracket (4.01+ UMAs, roughly \$13,600/month and up), the employer CEAV rate climbs from 4.241% in 2023 to 11.875% in 2030. The worker's contribution rate (1.125%) and the employer retirement base (2%) don't change.

This matters for AFORE projections. Using a flat rate throughout the projection underestimates the final balance by 15 to 25 percent, depending on the salary bracket and years remaining. The simulator applies the correct rate for each year, using DOF data. It includes all 8 transition tables from 2023 to 2030, then applies the 2030 rate for subsequent years.

The same reform also changed the minimum weeks to qualify for a Ley 97 pension. It started at 750 weeks in 2021 and rises by 25 weeks per year, reaching 1,000 in 2031. In 2025, the requirement is 850 weeks. (This is separate from the 1,000-week floor the Fondo Bienestar itself requires.)

## The Fondo de Pensiones para el Bienestar

The May 1, 2024 decree created the Fund to solve a real problem. Projected replacement rates for Ley 97 workers are disappointing: typically 20 to 40 percent of last salary for those without voluntary contributions. The Fund aims to close that gap for workers in the low and middle brackets.

The formula is straightforward: complement = min(salary, threshold) - AFORE pension. If your AFORE pension is \$5,000 and your salary was \$12,000, the complement is \$7,000, for a total pension of \$12,000 (100% replacement). If your salary exceeded the threshold, the complement is calculated using the threshold as a cap.

But transparency matters here. The Fund draws from the federal budget with no dedicated tax or underlying reserve. Its fiscal viability over 20 or 30 years rests on political decisions nobody can promise will stick. I chose to present the Fund as one possible scenario, with clear warnings that it's a projection under today's assumptions and that tomorrow may change. Calling the supplement a guarantee would be misleading. Showing it as an educational possibility is more honest.

## What the numbers reveal

Take a Ley 73 worker earning \$15,000/month with 1,500 weeks on the books. The simulator calculates a pension of \$11,245/month at 65 (75% replacement rate). Add Modalidad 40 (5 years at maximum SBC), and it jumps to \$17,694/month; that costs \$6,939/month but pays for itself in 14 months. The beauty of Ley 73: it's predictable. No market risk, no surprise shortfalls.

Now a Ley 97 worker: same \$15,000 salary, \$300,000 current AFORE balance, 800 weeks, base 4% real return. At 65, the balance projects to \$1,624,910. The scheduled withdrawal divides that by 204 months of male life expectancy, yielding \$7,965/month. That's below the legal floor of \$8,598/month (2.5 UMAs), so the floor applies instead. Add the Fondo Bienestar, and the pension jumps to \$15,000/month. The \$6,401 gap between the legal minimum and full salary gets filled.

The gender gap is brutal and mathematical. A woman with the same \$12,000 salary, \$150,000 in AFORE, and 600 weeks projects a \$1,011,005 balance. But female life expectancy is longer (240 months vs. 204 for men), so the scheduled withdrawal is only \$4,212/month. The Fondo closes the gap up to \$12,000, but without it, the gender penalty is nearly 50 percent, pure life expectancy math.

Sensitivity analysis across conservative (3%), base (4%), and optimistic (5%) return scenarios shows a 30 to 40 percent spread in final balance. But here's what surprised me: the variable that moves the Ley 97 result most is not the return rate, it's the 2020 contribution reform. Employer CEAV rates nearly triple between 2023 and 2030. That compounding effect over the working years beats market returns in impact. For Ley 73, the cesantia factor behaves as expected: retiring at 62 gives 85% of the age-65 amount (roughly \$10,588 vs. the full \$12,456).

One real bug caught in testing: the simulator used to accept weeks below 500 for Ley 73. With 300 weeks, it would calculate a pension that hit the minimum floor (\$8,485). In reality, workers with fewer than 500 weeks don't get a pension under Ley 73 at all, just a lump-sum return of contributions. This is why 126 unit tests matter. The bug surfaced in the test suite, I fixed it, and it deployed in the same cycle. The validation is live in production now.

## Engineering decisions

The architecture keeps calculation separate from the interface. Formulas for Ley 73/97 live in `R/calculations.R` (777 lines); the Fondo Bienestar logic is in `R/fondo_bienestar.R` (505 lines). Neither depends on Shiny at all. Both can be executed and tested from the terminal using `testthat`. That design enabled me to maintain 126 unit tests covering the Article 167 table, cesantia factors, variable-rate AFORE projections, Fund calculations, and edge cases (weeks below minimum, salary above cap, zero return).

Regulatory constants live in `R/constants.R` outside any Shiny context. UMA 2025 (\$113.14 daily), minimum wage (\$278.80), Fund threshold (\$17,364): one place to update them all. The DOF 2020 reform rates come from a CSV with all 8 brackets and year-by-year columns (2023-2030), not hardcoded.

The interface is a 4-step wizard built with `bslib` (Bootstrap 5 for R Shiny), navigation controlled by `shinyjs`. Balance trajectory charts use Plotly. Users can download a PDF report (generated with `rmarkdown`) that shows all assumptions and results. I deployed it on Google Cloud Run with Docker and set up CI/CD via GitHub Actions and Workload Identity Federation.

## What I learned

For Ley 97 workers, the contribution reform matters more than either return rates or AFORE commissions. Employer CEAV rates balloon from 4.2% to nearly 12% in the top brackets over seven years. Compound that over 30 years of work, and it dominates the math.

The Fondo Bienestar threshold extrapolation is a choice, not a formula. The published 2025 threshold is \$17,364 (average IMSS salary). For future years, I assumed 3.5% annual growth, based on observed trends. Change that assumption to 2% or 4%, and the results shift materially. The simulator flags this as an assumption because that's what it is.

One detail links to other projects in the portfolio: the Ley 97 scheduled withdrawal divides the balance by remaining life expectancy. Those come from CONAPO tables (17 years for a 65-year-old man, 20 for a woman). Projecting mortality with long-term longevity improvements (as SIMA does with Lee-Carter) would require generational data not available for pensioner populations; the legal minimum pension floor captures the uncertainty in practice. <a href="/blog/sima/" style="color: #C17654; text-decoration: underline;">SIMA</a> does exactly that: it projects mortality with Lee-Carter on INEGI data and builds life tables that could feed into this kind of calculation. Meanwhile, the <a href="/blog/cartera-autos/" style="color: #C17654; text-decoration: underline;">auto insurance platform</a> shares the same R Shiny architecture with Cloud Run deployment, but applied to a completely different problem: pricing and reserving for property damage.

<img src="/screenshots/pension-simulator.png" alt="IMSS Pension Simulator showing the estimated pension breakdown with AFORE, legal floor, and Fondo Bienestar supplement" style="max-width: 100%; border: 1px solid #d4d4d4; border-radius: 4px; margin: 1rem 0;" />

The application is deployed on <a href="https://simulador-pension-d3qj5vwxtq-uc.a.run.app/" target="_blank" rel="noopener">Google Cloud Run</a> and the source code is on <a href="https://github.com/GonorAndres/seguridad-social/tree/main/fondo_bienestar" target="_blank" rel="noopener">GitHub</a>.
