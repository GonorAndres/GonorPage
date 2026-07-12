---
title: "GMM Explorer: Three Hospitalization Levels to Price What the Industry Treats as a Single Risk"
description: "How classifying 5.1M Major Medical Expenses claims into three hospitalization levels changes the way you price a risk the industry treats as one. A UNAM team project that became a complete pricing system."
date: "2026-03-21"
lastModified: "2026-07-12"
category: "proyectos-y-analisis"
lang: "en"
shape: "case-study"
ficha:
  rol: "Autor principal, proyecto académico UNAM (equipo)"
  año: "2026"
  stack: "Python · Next.js · Recharts · shadcn/ui · Claude AI"
  datos: "CNSF (5.1M siniestros GMM, 2020-2024)"
  regulacion: "LISF Art. 201 · CUSF 15.3-15.8 · CNSF"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/gmm-explorer"
  live: "https://gmm-explorer.vercel.app/contexto"
tags: ["GMM", "pricing", "CNSF", "hospitalization", "Claude AI", "frequency-severity", "credibility", "LISF", "Next.js", "Python"]
---

This project started as a team final project for a course at UNAM's Facultad de Ciencias. We built a classification and pricing system for Major Medical Expenses (GMM) using CNSF open data. The original result worked, but the numbers didn't convince me: the diagnosis classification with Random Forest gave 59% accuracy, and any premium calculation built on that base carries the error forward. I picked the project back up afterward, redid the classification with a different approach and refined the pricing pipeline. The current result is materially better, and with more dedicated work it can keep improving.

The underlying question is straightforward: the GMM industry in Mexico prices risk as a single block. A scheduled cesarean and a cancer treatment feed the same average cost. The CNSF data, 5.1 million claims and 95.9 million insured-years from 2020 to 2024, shows why that is a problem. The ambulatory level accounts for 46.5% of claims but only 19.9% of total spending. The alta especialidad level generates 26% of spending from just 12.9% of events. These are fundamentally different risk populations treated as one, and what we still don't know is equally important: the shape of the severity distribution within each level. Level 3 almost certainly has heavier tails than Level 1; Level 2 is unknown territory in terms of kurtosis and distributional shape. Understanding those tails would change not just pricing but reserve decisions.

GMM Explorer builds the classification that analysis is missing: 9,409 diagnoses distributed across three hospitalization levels, frequencies and severities by individual age and sex, and an interactive tariff calculator deployed on Vercel.

## The three levels

The classification is not arbitrary; it reflects how differently each type of event consumes medical resources.

**Level 1 - Ambulatory:** Consultations, lab tests, dental care, gastroenteritis, minor respiratory illness. The patient is seen and released without formal hospitalization. This level represents 46.5% of claims and 19.9% of total spending. Average severity: \$23,846–\$26,651 depending on sex.

**Level 2 - Hospital:** Elective cesarean, gallbladder removal, scheduled spinal surgery, moderate COVID-19. The patient requires a hospital bed but not critical care. Concentrates 40.6% of claims and 54.1% of spending. Average severity: \$71,695–\$86,593.

**Level 3 - Alta Especialidad (High Complexity):** Oncology, acute myocardial infarction, cardiac surgery, hemorrhage, transplants, ICU. The 12.9% of events that consume 26% of total spending. Average severity: \$115,818–\$121,996.

The severity gap between Level 1 and Level 3 is 4.5 to 5 times. Averaging those two worlds doesn't produce a robust central estimate; it produces a number that underprices seriously ill policyholders and overprices those who only use their plan for routine visits and tests. Article 201 of the LISF requires the nota técnica to demonstrate premium sufficiency, and pricing without this distinction makes that demonstration technically thin. CUSF chapters 15.3 through 15.8, which govern the GMM line specifically, provide the regulatory framework that justifies the segmentation.

## Classifying 9,409 diagnoses

The CNSF medical cause catalog comes unlabeled. Free-text descriptions, partially aligned with ICD-10, with inconsistencies in capitalization, abbreviations, and special characters. Classifying those 9,409 diagnoses required two phases.

**Phase 1:** The team manually built a reference standard of 1,500 classified causes. The exercise immediately reveals where the ambiguity lives. "PARTO POR CESÁREA ELECTIVA" (elective cesarean) is clearly Level 2: scheduled hospitalization, no complications. "TUMOR MALIGNO DEL PEZÓN" (breast nipple malignancy) is Level 3 by definition. "COVID-19" has no single answer: a mild case resolved with outpatient medication is Level 1; a case that ends on a ventilator is Level 3. The assignment goes to the most common clinical presentation, not the worst-case scenario.

**Phase 2 original (team):** TF-IDF with a 5,000-term vocabulary and 1–3 n-grams, combined with a 200-tree Random Forest. Accuracy: 59%. F1-macro: 58.8%. The model learned text patterns, but medical severity doesn't live in text the same way a product keyword describes a category. "APENDICITIS AGUDA CON PERITONITIS" and "APENDICITIS AGUDA SIN COMPLICACIÓN" share the same main words; the differentiator is clinical context the model has no way to capture. At 59% accuracy, 41% of claims land in the wrong level, corrupting both frequency and severity estimates for all three tiers.

**Phase 2 rework (individual):** Claude AI classification of the remaining 7,909 diagnoses. The difference is that Claude understands medical terminology, recognizes severity gradations between related diagnoses, and can parse Spanish descriptions with spelling variations. Concrete examples: "COLECISTECTOMÍA" → Level 2, scheduled gallbladder surgery; "APENDICITIS AGUDA CON PERITONITIS" → Level 3, emergency abdominal complication; "CARIES DENTAL" → Level 1, routine dental care. Average classification confidence: 82.5%. Coverage: 100% of all claims.

Projects have lifecycles. The team built the data pipeline, the manual reference standard, the dashboard, and the Vercel deployment. The classification rework came later, when it became clear that 59% accuracy was insufficient for the tariff to have actuarial grounding. The distance between "works" and "correct" requires method, domain knowledge, and a willingness to revisit what was already built.

## The pricing pipeline

The core idea is simple: the risk premium is how often a claim happens (frequency) multiplied by how much it costs when it does (severity).

$$\text{Risk Premium} = \text{Frequency} \times \text{Severity}$$

Frequency is the number of claims divided by exposed insureds, segmented by individual age (25 to 70), hospitalization level, and sex. Severity is the average cost per claim in that same cell. The resulting matrix has 276 cells: 46 ages by 3 levels by 2 sexes.

One important adjustment: medical inflation in Mexico consistently outpaces general inflation. All amounts were adjusted to 2024 pesos using annual factors ranging from ×1.41 for 2020 to ×1.00 for 2024. The total adjustment raised the aggregate 18.9%, from \$179.7 billion to \$213.6 billion pesos. Without that step, historical severities underestimate the real cost of future claims.

On top of the risk premium, a 40% expense load covers administration (20%), acquisition (10%), and profit (10%), and the annual amount converts to a monthly premium using a 10% annual technical rate based on TIIE. The load percentages are model parameters; in a real nota técnica they are justified with the insurer's actual expense structure.

One result worth highlighting: all 276 cells exceed the minimum threshold of 30 claims for full credibility. That is unusual. Most insurers don't have enough internal exposure to achieve full credibility across all age and sex cells. The scale of the CNSF universe is the advantage of this analysis.

## What the age gradient reveals

The most striking finding isn't the average; it's the slope. From age 25 to age 70:

- Level 3 males: risk premium multiplies **22.6 times**
- Level 3 females: **13.9 times**
- Level 2 males: **6.9 times**; females: **4.2 times**
- Level 1 males: **7.1 times**; females: **2.9 times**

Level 3 males have the steepest gradient in the system. Cancer, acute cardiovascular events, and major surgical complications accelerate exponentially with age, and that acceleration is faster for men than for women past age 55. The direct consequence for pricing: the age curve is not the same across levels. A pricing scheme that pools levels implicitly creates a cross-subsidy, young policyholders generating ambulatory claims partially subsidize the alta especialidad risk of older insureds. That subsidy is invisible in the tariff but visible in the technical result.

The sex patterns also have structure. Women show higher frequency in levels 1 and 2 (maternal health, preventive care). Men show higher severity in levels 2 and 3 (cardiovascular, major trauma). The net premium by level and age captures that interaction in a way no aggregate average can.

## The dashboard

Five routes make up the final deliverable:

**/siniestros:** Claims explorer with filters by year, age, sex, and hospitalization level. Allows navigation through the distribution of amounts, frequencies, and year-over-year trends across the 4.7 million filtered records.

**/polizas:** Policy explorer with stacked bar, pie, and time-series charts. Shows how the insured population by level evolves and how exposure shifts between 2020 and 2024.

**/tarificador:** Interactive premium calculator. The user selects age and sex; the system returns three monthly premiums, one per hospitalization level. This is the deliverable an underwriting team would hand to pricing actuaries.

**/metodologia:** Full technical documentation of the pipeline: assumptions, sources, inflation adjustments, credibility factors, and expense load.

**/contexto:** Nota técnica summary and project context.

The architecture is Next.js 14 App Router with Recharts and shadcn/ui. All data is statically imported JSON; there is no runtime API. The build process runs the actuarial calculations once, which makes the Vercel deployment straightforward and response time instantaneous.

## Portfolio connections

GMM Explorer occupies a specific position within a broader actuarial cycle.

[SIMA](/en/blog/sima) implements the same regulatory framework (LISF/CUSF) but for life insurance. Where GMM Explorer uses morbidity tables by hospitalization level, SIMA uses mortality tables projected with Lee-Carter. Both projects are instances of the same principle: the premium must reflect the probability of the insured event occurring and its expected cost, both estimated with statistical rigor on real data.

The [P&C reserving dashboard](/en/blog/insurance-claims-dashboard) answers the retrospective question: how much to reserve for claims that have already occurred but haven't been fully paid (IBNR). GMM Explorer answers the prospective counterpart: how much to charge before any claim occurs. They are the left and right sides of the same actuarial balance sheet.

[Insurance pricing with ML](/en/blog/actuarial-ml-pricing) applies the same frequency-severity decomposition to auto insurance using GLMs and gradient boosting on the freMTPL2 dataset. The methodological difference is substantive: in auto, risk segmentation comes from driver and vehicle characteristics; in GMM, the most important differentiator is the type of medical event. GMM Explorer adds the hospitalization level dimension and uses AI classification as the segmentation method rather than model input variables.

The [auto insurance platform](/en/blog/cartera-autos) uses the same Frequency × Severity product for pricing, on synthetic data calibrated to the Mexican market. The tail difference matters: in auto, claim development closes in four years; in GMM, chronic conditions can generate claims for years. That asymmetry in the development pattern is one reason GMM reserve models are more complex than property-casualty models.

## Limitations and next steps

Claude AI classification at 82.5% average confidence is materially better than the Random Forest's 59%, but it hasn't been validated against an external standard such as certified medical coders or the official ICD-10 catalog. The remaining 17.5% of lower-confidence classifications is an error source that could concentrate in infrequent diagnoses or non-standard terminology, exactly where the impact on a pricing cell could be largest.

The age range 25–70 excludes two segments with very different behavior: pediatrics, where ambulatory claims dominate and frequencies are high but severities low; and the over-70 population, where Level 3 becomes dominant and premiums grow on a slope that the central range data doesn't capture well.

The current tariff calculator doesn't model product structure. Suma asegurada, deductible, coinsurance, and network type all materially modify the technical premium. A closed-network plan with a \$20,000 peso deductible has a very different risk profile than an open-network plan with first-peso coverage. That parametrization layer is necessary to move from a reference price to a commercially usable tariff.

Credibility was applied as a binary threshold (30 or more claims, full credit). The Bühlmann-Straub approach would give a continuous credibility factor $Z = n / (n + k)$ that acknowledges the difference between a cell with 50 claims and one with 500, instead of treating them identically.

The most important limitation for the next step is distributional. The current pipeline uses average severity per cell, but the average hides what really matters in insurance: the tail. Level 3 almost certainly has heavier tails than Level 1; a single oncology or transplant case can cost orders of magnitude more than its cell mean. Level 2 is open territory: we don't know the kurtosis or the shape of its severity distribution. Studying those tails would change the pricing system (the risk premium should incorporate a tail loading, not just the mean) and reserve decisions (IBNR reserves depend on the distributional shape, not the average).

What I would do differently with more time: use ICD-10 codes directly for classification, eliminating the ambiguity of free text; model frequency and severity as continuous functions of age, sex, and level using GLM or GBM instead of cell averages; and fit severity distributions by level (Pareto, lognormal, or mixture) to capture the tail, which is where the real risk lives.

## Frequently asked questions

### Where does the data come from?

The data comes from CNSF open records: 5.1 million Major Medical Expenses claims and 95.9 million insured-years registered between 2020 and 2024. The universe is large enough that all 276 cells of the pricing matrix exceed the full-credibility threshold, something a single insurer's internal exposure rarely achieves.

### What methodology sets the premium?

The risk premium is the product of frequency and severity, segmented by individual age (25 to 70), hospitalization level, and sex, across a 276-cell matrix. A 40% expense load (administration, acquisition, and profit) is applied on top of the risk premium, and the annual amount converts to a monthly figure using a 10% technical rate; all amounts are first adjusted to 2024 pesos to correct for medical inflation.

### How are diagnoses classified into three levels?

The 9,409 diagnoses in the CNSF catalog were classified into three hospitalization levels by combining a manual reference standard of 1,500 causes with Claude AI classification for the remaining 7,909, reaching 82.5% average confidence and 100% coverage. This approach outperformed the original Random Forest model, which reached only 59% accuracy on free text.

### Is it production-ready as it stands?

No; the calculator returns a reference price, not a commercially usable tariff. It does not yet model product structure (sum insured, deductible, coinsurance, network type), it uses average severity per cell rather than the full distribution, and the AI classification has not been validated against an external standard such as certified medical coders or ICD-10.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "inLanguage": "en",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Where does the data come from?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The data comes from CNSF open records: 5.1 million Major Medical Expenses claims and 95.9 million insured-years registered between 2020 and 2024. The universe is large enough that all 276 cells of the pricing matrix exceed the full-credibility threshold, something a single insurer's internal exposure rarely achieves."
      }
    },
    {
      "@type": "Question",
      "name": "What methodology sets the premium?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The risk premium is the product of frequency and severity, segmented by individual age (25 to 70), hospitalization level, and sex, across a 276-cell matrix. A 40% expense load (administration, acquisition, and profit) is applied on top of the risk premium, and the annual amount converts to a monthly figure using a 10% technical rate; all amounts are first adjusted to 2024 pesos to correct for medical inflation."
      }
    },
    {
      "@type": "Question",
      "name": "How are diagnoses classified into three levels?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 9,409 diagnoses in the CNSF catalog were classified into three hospitalization levels by combining a manual reference standard of 1,500 causes with Claude AI classification for the remaining 7,909, reaching 82.5% average confidence and 100% coverage. This approach outperformed the original Random Forest model, which reached only 59% accuracy on free text."
      }
    },
    {
      "@type": "Question",
      "name": "Is it production-ready as it stands?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No; the calculator returns a reference price, not a commercially usable tariff. It does not yet model product structure (sum insured, deductible, coinsurance, network type), it uses average severity per cell rather than the full distribution, and the AI classification has not been validated against an external standard such as certified medical coders or ICD-10."
      }
    }
  ]
}
</script>

## Closing

The dashboard is live on <a href="https://gmm-explorer.vercel.app/contexto" target="_blank" rel="noopener">Vercel</a> and the code is on <a href="https://github.com/GonorAndres/gmm-explorer" target="_blank" rel="noopener">GitHub</a>. The full nota técnica is available from the `/contexto` section of the dashboard.

The analysis points to something beyond this project: when data exists and is large enough, the question of whether a risk distinction is real has an empirical answer. The industry can continue pricing GMM as a single block, but the CNSF data no longer supports the argument that doing so is a harmless simplification.
