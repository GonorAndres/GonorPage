---
title: "Poisson GLM vs XGBoost for Insurance Pricing: Interactive Lab"
description: "On 678,013 motor policies XGBoost ranks risk better than a Poisson GLM, but a rate still has to be explained in a technical note and defended to a regulator, which keeps ML as a pricing challenger. The interactive lab shows SHAP explanations and a geographic fairness check."
date: "2026-09-13"
category: "proyectos-y-analisis"
lang: "en"
shape: "case-study"
ficha:
  rol: "Sole author"
  año: "2026"
  stack: "Python · XGBoost · LightGBM · SHAP · FastAPI · Cloud Run · Cloudflare"
  datos: "freMTPL2 (678,013 French motor policies)"
  regulacion: "LISF technical note · Solvency II"
  estado: "Completed"
  live: "https://ml-insurance.gonor.me"
tags: ["insurance pricing", "GLM", "XGBoost", "SHAP", "fairness", "freMTPL2", "actuarial", "Cloud Run"]
lastModified: "2026-10-03"
heroImage: "/blog-illustrations/insurance-pricing-lab.webp"
heroAlt: "Controls build a car policy that feeds two instruments: an open formula with every weight visible and a box of trees whose lens shows what moved the prediction; behind them, the technical note."
heroCaption: "The formula is visible in full; the model needs a lens to explain itself, and both must be defended in a technical note."
relatedPosts: ["actuarial-ml-pricing", "sima", "gmm-explorer"]
---

An insurer cannot use a model merely because it is more accurate. Every rate has to be explained in a technical note, defended to a regulator, and maintained when the portfolio changes. The Insurance Pricing Lab makes that trade-off tangible: enter a hypothetical motor policy and compare the standard actuarial formula with a machine-learning challenger.

The lab is live at [ml-insurance.gonor.me](https://ml-insurance.gonor.me). Its Spanish Guide and interactive Lab are served from Cloudflare Pages; a FastAPI backend on Cloud Run responds through a same-origin `/api/*` proxy. The app serves frozen model files exported from the research workflow. It never retrains a model when someone changes a field.

## The question behind the interface

The comparison is between a Poisson GLM, the conventional frequency model, and gradient-boosted trees. The GLM uses an exposure offset and makes each factor visible as a multiplicative rating effect. XGBoost can capture interactions and non-linear effects that the formula averages out, but its price needs an explanation layer before an actuary can defend it.

The data is freMTPL2: 678,013 real French motor third-party-liability policies, split into 406,807 training, 135,603 validation, and 135,603 test policies. Exposure is capped at one year and claim counts at four; no policies are removed. The validation set is used for tuning and early stopping, and every headline metric below comes from the held-out test set.

## Better at ranking risk

| Model | Gini | D², Poisson deviance explained |
|---|---:|---:|
| Poisson GLM | 0.242 | 0.031 |
| XGBoost | 0.341 | 0.085 |
| LightGBM | 0.337 | 0.086 |

XGBoost improves Gini by 41% relative to the GLM. It also spreads predicted frequency more sharply: the highest predicted-risk decile is 4.8 times the lowest, against 4.5 times for the GLM. That is useful for ordering a portfolio by risk.

It is not a claim that the model can predict whether one driver will crash next year. D² stays low for every model because claim occurrence is mostly random at the individual-policy level. The 40 Optuna trials per boosted model were a deliberately modest comparison budget on a 2-vCPU machine: 320 seconds for XGBoost and 252 seconds for LightGBM, enough to compare them fairly but not to imply exhaustive optimization.

## What moves a prediction

TreeSHAP makes the XGBoost result inspectable. Average absolute contribution is largest for BonusMalus (0.2927), followed by vehicle age (0.1870), driver age (0.1286), region (0.0711), vehicle brand (0.0674), vehicle power (0.0635), density (0.0510), and Area (0.0314).

That ordering matters. The boosted model leans most on driving history and the vehicle, while the GLM's largest categorical relativities are geographic dummies: Area E 1.237, Area F 1.228, and Region R21 1.214. These are different kinds of evidence, so they should not be merged into one misleading ranking table.

In the lab's sample profile—driver age 35, vehicle age 5, BonusMalus 60, density 1,000, Area C, brand B1, regular fuel, Region R24, and one year of exposure—the GLM estimates frequency at 0.1004 and XGBoost at 0.0809. On this safe-ish example, the boosted challenger prices below the formula.

## A check on geographic fairness

Area runs from rural A to dense-city F. Density is actuarially relevant, but it can also stand in for socioeconomic differences. The audit compares each model's average predicted frequency with observed frequency across the six areas.

The mean absolute deviation is 0.0020 claims per policy-year for the GLM and 0.0021 for XGBoost; the largest individual gap is 0.0037 in Area F. This run finds no meaningful evidence that XGBoost uses Area as an unfair proxy beyond what the GLM already does. It is a null result on one variable in one dataset, not a clean bill of health for the method.

## Why the model remains a challenger

The severity half did not work: a Gamma GLM on the 4,999 test claims scored D² = −0.051, worse than charging every claimant the average cost. Crash cost depends on details the policy file does not contain. The project therefore models frequency well, not a full pure premium.

It also has no expense loading, risk margin, credibility weighting for thin segments, capital view, reserving component, or hold-out year to test changing driving behavior. LISF and Solvency II demand a technical note that can be audited; a model that ranks risk better but cannot be turned into a defensible rate structure does not clear that bar.

The responsible use here is as a challenger: inspect where it changes the GLM ordering, turn stable findings into proposed rating terms, and validate those terms within the filed actuarial framework. Natural next steps are a Tweedie pure-premium baseline, monotonic constraints for BonusMalus, splines or a GAM where lift is flat, and credibility weighting for small regions.

The [technical research analysis](/en/blog/actuarial-ml-pricing/) contains the wider comparison. Together with [SIMA](/en/blog/sima/), which implements the capital and reserving side of Mexico's insurance regulation, this lab locates pricing inside the larger actuarial control cycle.
