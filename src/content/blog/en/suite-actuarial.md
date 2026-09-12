---
title: "suite_actuarial: open-source actuarial platform for the Mexican insurance market"
description: "There is no open-source actuarial library built for Mexican regulation. suite_actuarial fills that gap: it covers eight insurance domains (life, P&C, health, pensions, reserves, reinsurance, regulatory, and configuration) with EMSSA-09 mortality tables, CNSF circulars, and SAT tax articles built into the design. It installs with pip, deploys with Docker, and exposes 28 REST endpoints alongside a bilingual Next.js dashboard."
date: "2026-03-19"
category: "proyectos-y-analisis"
lang: "en"
shape: "case-study"
ficha:
  rol: "Sole author"
  año: "2026"
  stack: "Python · Pydantic · FastAPI · Next.js · React · Docker"
  datos: "EMSSA-09 · AMIS · CNSF parameters"
  regulacion: "LISF · CUSF · CNSF (RCS) · SAT (ISR) · Circular S-11.4"
  estado: "Completed"
  repositorio: "https://github.com/GonorAndres/suite-actuarial"
  live: "https://suite.gonor.me"
tags: ["Python", "Pydantic", "LISF", "CUSF", "CNSF", "RCS", "Reserves", "Chain Ladder", "Reinsurance", "Next.js", "EMSSA-09", "SAT", "FastAPI", "GMM", "IMSS"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/suite-actuarial.webp"
heroAlt: "A modular actuarial calculation core connects the same logic to a library, a service interface, and a dashboard."
heroCaption: "A shared foundation of calculations and parameters lets different interfaces reuse the same actuarial logic."
---

If an actuary in Mexico wants to price a term life policy using the EMSSA-09 table, there are two options: an Excel spreadsheet inherited from the technical department, or writing everything from scratch. Open-source actuarial libraries exist in Python (`chainladder`, `lifelines`, `pyliferisk`), but none of them integrate Mexican regulation: they don't know what an EMSSA-09 table is, don't compute the RCS as defined by the LISF, don't apply articles 93, 142, 151, and 158 of Mexico's income tax law (LISR) to determine premium deductibility. Mexican regulation has requirements that exist in no other market, and the available software assumes the user will adapt generic formulas to their jurisdiction.

**suite_actuarial** is an open-source actuarial platform built from scratch for Mexican regulation. It can be used three ways: as a Python library (`pip install`), as a REST API (28 endpoints via FastAPI), or as a web application with interactive calculators (bilingual Next.js 16, ES/EN). Eight insurance domains in a single package, with the EMSSA-09 mortality table bundled as package data, Pydantic v2 validation on every input, and `Decimal` precision on every calculation.

## Why open-source

The Mexican insurance market operates under the LISF and the CUSF, but the actuarial tools that implement those rules live in private spreadsheets inside each company. Every insurer reinvents the same commutation functions, the same development triangles, the same RCS validations. There is no shared foundation.

An open-source library changes that. An actuarial student can install `suite_actuarial` and price a term life policy in five lines of code. An actuary at an insurer can validate their RCS calculations against an independent implementation. A data team can integrate pricing and reserves into an automated pipeline by calling REST endpoints. The code is open, the formulas are auditable, and the tests verify that results match published tables.

## The eight domains

### Life

Term, whole life, and endowment, built on the EMSSA-09 table with equivalence principle pricing at a 5.5% technical rate. Fractional premium factors computed with UDD.

A 35-year-old male with MXN \$1,000,000 sum assured on a 20-year term pays \$2,024 net premium and \$2,388 gross premium. Loading breakdown: administration \$101, acquisition \$202, profit \$60.

### Property and casualty

Auto, fire, and liability. Auto pricing is calibrated with AMIS data: base frequency, average severity, target loss ratio, and Bonus-Malus system by claims history. Fire uses rate tables by construction type and risk zone. Liability calculates frequency and severity by coverage type. A collective model aggregates claims using Poisson-Gamma and Poisson-Lognormal distributions (Monte Carlo), and Buhlmann credibility adjusts premiums when the insured's history is short.

### Health

Major Medical Expenses (GMM) with quinquennial age-band pricing, geographic zone, and hospital level, adjusting for deductible and coinsurance. Accidents and illness is covered as a separate product.

### Pensions

IMSS Ley 73 (defined benefit) and Ley 97 (Afore), life annuities, and full commutation tables. The dashboard displays regime, contribution weeks, average daily salary, pension percentage, age factor, monthly and annual pension including the year-end bonus. This module shares actuarial logic with the <a href="/blog/pension-simulator/" style="color: #C17654; text-decoration: underline;">pension simulator</a>, but integrated within the library to connect with the other domains.

### Reserves

Chain Ladder, Bornhuetter-Ferguson, and stochastic Bootstrap with percentiles. The Bootstrap delivers a full distribution of possible reserves: if P50 = \$2.5M and P75 = \$3.1M, the decision of how much capital to hold is informed by the tail of the distribution.

### Reinsurance

Quota share (proportional cession), excess of loss (large-claim protection with reinstatements), and stop loss (aggregate portfolio protection). A `model_validator` checks that the limit exceeds retention; in spreadsheet cells, that condition gets violated more often than anyone would like to admit.

### Regulatory

RCS with three risk modules (life, P&C, investment) aggregated using the CNSF correlation matrix. Tax deductibility per articles 93, 142, 151, and 158 of the LISR. ISR withholdings on endowment insurance returns. Technical reserves per Circular S-11.4.

### Configuration

Regulatory parameters versioned by fiscal year: 2024, 2025, and 2026. UMA values, SAT tax rates (corporate ISR, VAT, withholdings), CNSF factors, and technical actuarial parameters. Adding a new year to the system means creating one configuration file.

## Three ways to use it

The same actuarial logic is exposed three ways:

**As a library.** `from suite_actuarial import VidaTemporal, TablaMortalidad` and five lines of code to get a premium. Mortality data ships bundled with the package; no external file downloads required.

**As an API.** REST endpoints organized by domain, with Swagger documentation at `/docs`. A quoting system calls the pricing endpoint, a batch process computes reserves for an entire portfolio, a data pipeline runs regulatory validations.

**As a dashboard.** A bilingual web application (ES/EN) with interactive calculators for each domain. Each page shows key calculation results with detail tables and CSV download. `docker-compose up` brings up the API and frontend together.

## Why standardize

When every insurer implements its own commutation functions, its own development triangles, and its own RCS validations, errors replicate silently. A bug in a technical reserve formula can live for years inside a spreadsheet that nobody audits because "it has always produced reasonable results." A shared codebase reverses that dynamic: if someone finds an error in the commutation function, the fix benefits everyone using the library. If someone implements a more efficient reserve method, everyone gets that improvement with `pip install --upgrade`.

Standardizing also lowers the barrier to entry. A newly graduated actuary can start working with tools whose formulas are verified against published EMSSA-09 tables, instead of inheriting an undocumented Excel file. A data team can integrate actuarial calculations into an automated pipeline without rewriting the logic from scratch. The domain complexity doesn't disappear, but the infrastructure stops being an obstacle.

## What's missing

This library meets its technical purpose: tests pass, calculations match published tables, the API responds, the dashboard works in two languages. But an open-source library is only successful when someone else uses it. So far, suite_actuarial has one author and zero external contributors.

The next step is for an actuary at another insurer to report a bug, or for a student to propose a new product, or for someone to adapt the pensions module for a case I didn't anticipate. There are also design decisions that only someone with operational experience can challenge: whether the GMM base rates reflect the real market or are optimistic approximations, whether the collective model needs a distribution I didn't include, whether the RCS calculation handles correctly a regulatory edge case I've never seen in practice. Those are the details that unit tests don't catch but real usage does. That is when the code stops being a personal project and becomes shared infrastructure. The repository has a `CONTRIBUTING.md`, the architecture is documented, and every module can be tested in isolation. The invitation is open.

## Connections

The suite connects with other projects in the portfolio. <a href="/blog/sima/" style="color: #C17654; text-decoration: underline;">SIMA</a> builds its own mortality pipeline from INEGI data via Lee-Carter; with the suite as a module, that pipeline could reuse the commutation functions and RCS calculation that are already validated. The <a href="/blog/regulation-agent-rag/" style="color: #C17654; text-decoration: underline;">regulation agent</a> navigates the LISF and CUSF to find the relevant provisions; this suite implements the math those provisions define.

<div style="margin-top: 2rem; padding: 1rem 1.5rem; border-left: 4px solid #C17654; background-color: #f9f6f2;">
  <p style="margin: 0 0 0.5rem 0;"><strong>Repository:</strong> <a href="https://github.com/GonorAndres/suite-actuarial" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">github.com/GonorAndres/suite-actuarial</a></p>
  <p style="margin: 0;"><strong>Live app:</strong> <a href="https://suite.gonor.me" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">suite.gonor.me</a></p>
</div>
