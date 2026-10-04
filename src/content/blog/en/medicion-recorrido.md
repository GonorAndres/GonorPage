---
title: "How to Verify Ad-to-CRM Conversion Tracking Before Optimizing a Funnel"
description: "Verify each step of the journey, from ad click to page, form submission and CRM record, before reading a funnel decline as a user-experience problem. A fictional ad-to-CRM example shows which events, parameters and outcomes to check so an improvement decision rests on evidence."
date: "2026-09-27"
lastModified: "2026-10-03"
category: "proyectos-y-analisis"
lang: "en"
shape: "case-study"
tags: ["GA4", "GTM", "CRM", "CRO", "measurement"]
ficha:
  rol: "Author"
  año: "2026"
  datos: "Fictional journey and figures; no real person or client"
  estado: "Method case study"
relatedPosts: ["fuentes-no-coinciden", "analytics-dashboards"]
---

A campaign produces clicks, but the team cannot tell how many visitors reached the form, how many submitted it, and how many became useful prospects. Without that chain, a funnel decline might be a user-experience problem or a measurement problem. Changing the site before distinguishing them can send effort to the wrong place.

This journey and its figures are **fictional**. They combine practices I use when reviewing measurement and conversion; they do not describe a client's campaign or form.

## The journey to verify

An ad leads to a page. The page opens a form. A person submits it. The CRM receives a record and, later, the commercial team decides whether it meets the qualification criteria. Each step needs its own evidence: a visit is not a submission, and a submission is not a qualified prospect.

| Step | Check in a fictional example |
|---|---|
| Click → page | The page loads and preserves campaign origin. |
| Page → form | The event is recorded once, at the right step. |
| Submission → CRM | The CRM receives an authorized test record, with no personal data sent to analytics. |
| CRM → qualification | The commercial stage is read using its own definition and date, not treated as another submission. |

GA4 and GTM help observe and validate the digital journey. The CRM holds the commercial outcome. If origin is lost between pages or domains, it should not be retroactively filled as “organic.” If an event fires twice, its count cannot be interpreted as two people.

## From diagnosis to recommendation

Only after checking the chain would I analyze where visitors stop. A session observation may suggest that a form is long or confusing; a rate may show where to focus the investigation. Both are clues, not proof that a redesign will increase sales. A recommendation should say what would change, what evidence motivated it, and how the result would be evaluated.

The practical decision is to separate three states: what is measured, what appears to be failing, and what still needs a test. This case connects to [reconciling sources](/en/blog/fuentes-no-coinciden/) and to my [A/B testing exploration](/en/artifacts/ab-testing-bayesian-frequentist/): a defensible improvement begins with a clear outcome definition.
