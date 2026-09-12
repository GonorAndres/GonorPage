---
title: "Risk Analyst: 13 Quantitative Risk Analysis Projects"
description: "Financial risk models lose credibility when they exist only as formulas in a PDF. These 13 modules implement them in typed Python with automated tests: from portfolio VaR and Monte Carlo simulation to copulas, EVT, deep hedging, and graph neural networks for systemic contagion. Each module pairs LaTeX theory with reproducible results on public market data."
date: "2026-03-19"
category: "proyectos-y-analisis"
lang: "en"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Python · PyTorch · scikit-learn · QuantLib · arch · PyTorch Geometric"
  datos: "yfinance · FRED (datos de mercado públicos)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/risk-analyst"
tags: ["Python", "Financial Risk", "VaR", "Monte Carlo", "Machine Learning", "Deep Hedging", "Copulas", "EVT"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/risk-analyst.webp"
heroAlt: "Observed samples and modeled distributions meet on a comparison plate that keeps mismatches visible."
heroCaption: "A risk measure becomes useful when its estimates are checked against observed losses."
---

How do you go from a VaR number on a spreadsheet to a system that is actually validated and reproducible? You build it yourself, piece by piece. This project is 13 modules that walk from the foundations (portfolio VaR, Monte Carlo engines) through regulatory-grade tools (stress testing, EVT tail risk) into research territory (deep hedging, graph neural networks for systemic contagion). Each one pairs LaTeX theory with typed Python, automated tests, and results you can reproduce. Not textbook exercises; implementations that reflect how risks get measured and managed in practice.

## Three tiers

The three tiers reflect how risk knowledge actually accumulates. You start with the tools everyone needs (VaR, Monte Carlo, credit scoring, GARCH). Then you confront the problems that regulation and portfolio management throw at you (extreme tails, copula dependence, stress scenarios). Then you reach the frontier, where machine learning meets open questions.

### Tier 1: Foundations (P01 to P04)

**P01. Portfolio Risk Dashboard.** The central question in portfolio risk: what is the maximum a portfolio could lose tomorrow at a given confidence level? And how do you know when that estimate is wrong? The dashboard computes VaR three ways (historical, parametric, Monte Carlo) and validates each with three industry-standard backtests (Kupiec, Christoffersen, Basel traffic-light). The interesting part is the rolling backtest: it catches exactly when the model starts underestimating losses. Every automated test checks a mathematical property, not just that the code runs.

**P02. Monte Carlo Simulation Engine.** The engine prices European options within 1% of Black-Scholes on 100,000 paths. Getting there required solving two problems: generating correlated asset paths that respect the covariance structure, and making simulations converge fast enough to be usable. Variance reduction does the heavy lifting; antithetic variates cut variance by 60%, control variates by 85%.

**P03. Credit Scoring with ML.** Every lending decision is a bet on whether a borrower will repay. Getting that bet wrong costs money on one side and denies credit on the other. The real test is not accuracy but calibration: when the model says "5% default probability," do roughly 5% of those borrowers actually default? Three classifiers compete on the same dataset, SHAP explains individual decisions, and the calibration tests verify that stated probabilities match observed defaults. AUC above 0.85.

**P04. Volatility Modeling.** Risk models that treat volatility as constant get blindsided every time markets shift between calm and turbulent periods. Detecting which regime you are in changes the VaR number, the hedge ratio, and the margin requirement. Four GARCH variants capture different asymmetries in how markets react to good vs bad news. The most revealing model is the Markov switching: it identifies transitions between regimes with filtered probabilities, producing a VaR that knows whether the market is in crisis or not.

### Tier 2: Intermediate to Advanced (P05 to P07)

**P05. EVT for Tail Risk.** VaR at 99.9% under proper tail modeling runs 40 to 60% higher than the Gaussian estimate. That gap matters because regulators set capital requirements at exactly those confidence levels, and underestimating the tail means underestimating the capital you need. Extreme value theory offers two approaches (GEV for block maxima, GPD for peaks-over-threshold) with automatic threshold selection. The gap between Gaussian and EVT estimates widens precisely where it counts most.

**P06. Copula Dependency Modeling.** Diversification is supposed to protect a portfolio, but in a crisis everything falls together. Linear correlation misses this. Five copula families model the dependency structure, and the t-copula is the critical one: it captures the fact that assets correlate much more when markets fall than in normal conditions. Portfolio VaR under the t-copula runs 15 to 25% higher than under Gaussian assumptions, which means any risk model relying on linear correlation is systematically optimistic about diversification.

**P07. Stress Testing Framework.** After 2008, regulators worldwide required financial institutions to prove their portfolios could survive specific adverse macro scenarios. The exercise is not hypothetical; it determines capital buffers and can block dividend payments. The framework transmits DFAST/CCAR-style scenarios to the portfolio. The more interesting module inverts the usual question: instead of asking "what happens if GDP drops 5%?", it asks "what macro combination produces an unacceptable loss?" In the literature, that inversion surfaces scenarios that forward analysis misses entirely.

### Tier 3: Frontier (P08 to P13)

**P08. Deep Hedging.** Classical delta hedging assumes frictionless markets: zero transaction costs, continuous rebalancing. Real markets charge for every trade, which means the textbook strategy systematically overpays. Neural networks that learn hedging strategies from scratch, including transaction costs, without assuming any particular market model. When transaction costs are significant, the learned strategies outperform classical delta hedging because they internalize the cost of rebalancing instead of ignoring it.

**P09. CVA Counterparty Risk.** When you enter a derivative contract, you are exposed not just to market moves but to the chance that your counterparty defaults before settling. After 2008, this was no longer a theoretical concern; CVA became a mandatory accounting and capital charge. The implementation estimates default probabilities from market prices, simulates how exposure evolves over the contract's life, and models the worst case: wrong-way risk, where your exposure to a counterparty grows precisely when that counterparty is most likely to default.

**P10. GNN Credit Contagion.** When Lehman Brothers collapsed, the shock propagated through the interbank network and hit institutions that had no direct exposure to subprime mortgages. Predicting which nodes are most vulnerable requires modeling the network structure itself, not just individual balance sheets. Graph neural networks on interbank networks model how one bank's failure cascades through the system. DebtRank measures each bank's systemic importance; the graph model predicts who is vulnerable before contagion starts.

**P11. Conformal Risk Prediction.** Every parametric VaR model makes distributional assumptions that can fail. The question is whether you can get valid coverage without committing to a specific distribution. Conformal prediction applied to VaR and ES bands delivers exactly that: nominal coverage regardless of the underlying distribution, no parametric assumptions required. The intervals adapt automatically to the volatility regime.

**P12. Climate Risk Scenarios.** Central banks and regulators now require financial institutions to assess how climate transition pathways affect their portfolios. The risk is not just physical damage; it is that policy changes strand entire asset classes before they mature. Three NGFS scenarios (Net Zero, Delayed Transition, Current Policies) translated into portfolio-level climate risk measures. Sobol sensitivity indices reveal which climate assumptions drive the uncertainty, a question the literature flags as frequently missing from standard reports.

**P13. RL for Portfolio Risk.** Most rebalancing strategies follow a fixed calendar or threshold, regardless of what the market is doing. The idea here is to let the model learn when to act and how much to move, based on the current state. Two reinforcement learning algorithms train an agent that keeps tail losses under control while preserving returns. The result: maximum drawdown drops 30 to 40% compared to a naive equal-weight portfolio.

## The numbers

| Metric | Value |
|--------|-------|
| Projects | 13 |
| Lines of typed Python | 25,000+ |
| Automated tests (pytest) | 192 |
| LaTeX theory documents | 13 PDFs |
| Compiled showcase | 31 pages |
| Risk techniques implemented | VaR, CVaR, EVT, GARCH, copulas, stress testing, deep hedging, CVA, GNN, conformal, climate VaR, RL |

The 192 pytest tests are written against the code itself. They verify that the implementations respect the mathematical properties they claim to implement: VaR grows with confidence level, CVaR exceeds VaR, Monte Carlo converges to the closed-form answer when one exists. These are not checks that the code runs without errors; they are checks that the code does what the theory says it should.

## Technical stack

The project uses Python exclusively, with clear separation between data, models, risk measures, simulation, and visualization:

- **Risk and finance:** QuantLib, riskfolio-lib, arch (GARCH), pyextremes (EVT), copulae
- **Machine learning:** scikit-learn, XGBoost, LightGBM, PyTorch, PyTorch Geometric, SHAP
- **Simulation:** custom Monte Carlo engine with variance reduction (antithetic, control variates, importance sampling)
- **Data:** yfinance, FRED, pandas
- **Documentation:** LaTeX (texlive) for theory, Jupyter for interactive walkthroughs

## Connection to the rest of the portfolio

Two portfolio projects were the direct starting point. The <a href="/en/blog/cartera-autos/">auto insurance portfolio</a> works with reserves and loss triangles for a single line of business; here those ideas extend to portfolios with multiple asset classes. The <a href="https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/Credit_Risk_Model">credit model</a> was originally a basic scorer; P03 picks it up with calibration and explainability, and P10 takes the same question to interbank networks.

The code, tests, and complete documentation are on <a href="https://github.com/GonorAndres/risk-analyst" target="_blank" rel="noopener">GitHub</a>.
