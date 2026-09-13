# CLAUDE.md -- CV

Guidance for Claude Code when working inside `cv/`.

## What This Is

LaTeX source for Andrés González Ortega's CV -- actuarial science graduate from UNAM (Facultad de Ciencias). Spanish.

**Exactly one CV document lives here: `cv-andres-gonzalez.tex`.** It is the public CV, the one
published at `gonor.me/docs/cv-andres-gonzalez.pdf` and handed to anyone. It is edited **in
place** each cycle, not forked monthly; the `\placetopright` date carries the revision month.

### THE RULE: role variants are private, and never live here

Role variants (data scientist, insurance/actuarial, risk management, data analyst/DE, finance,
insurtech, general, and their English counterparts) are **tailored to specific positions and are
not shareable**. They do not belong in this repo in any form -- not under a cycle directory, not
renamed, not "temporarily".

They live in the private **`github.com/GonorAndres/claude-job`** repo, which is also where
employer-specific tailoring, job postings, cover letters and application emails belong.

`.gitignore` enforces this with an **allowlist**: everything under `cv/` is ignored except
`cv-andres-gonzalez.tex`, `qr_portfolio.png`, `build.sh`, `CLAUDE.md`, `README.md`. A new
variant cannot be committed by accident. Do not weaken that allowlist to "just add one".

If a task asks for a tailored variant, do it in `claude-job`, not here.

### THIS REPO IS PUBLIC

`GonorAndres/GonorPage` is a public GitHub repo. Everything committed under `cv/` is
world-readable, **and stays readable in git history even after deletion**. Consequences:

- **Never commit role variants.** See the rule above. This is the one that matters most.
- **Never commit compiled PDFs** under `cv/`. The published PDF is a separate tracked artifact at `../public/docs/cv-andres-gonzalez.pdf`; that is the only PDF anyone should be handed.
- **Never commit job postings** (`*_job.md`), **application emails**, **cover letters**, or **anything named after an employer**. Which companies Andrés applied to is private.
- **Never commit exam proofs, transcripts, or interview prep.** `docs/preliminar_soa.pdf` and similar stay private.
- Contact details (email, phone, portfolio links) inside the `.tex` are fine -- they already appear on the public CV PDF and on the live site.

If a task needs any of the above, do it in the private repo, not here.

### Private counterpart

`github.com/GonorAndres/claude-job` (private) holds the working material that must not be public: compiled PDFs, job postings, employer-specific variants, application emails, validation reports, SOA proofs, interview prep. It stays as the private workbench. This folder is a curated copy of the reusable sources.

## Bootstrap on a new machine

```bash
# TeX Live (Debian/Ubuntu)
sudo apt install texlive-latex-recommended texlive-fonts-recommended texlive-lang-spanish
# The two user-mode packages the preamble needs:
tlmgr --repository https://ftp.math.utah.edu/pub/tex/historic/systems/texlive/2023/tlnet-final/ install fontawesome5 sourcesanspro

# Smoke test
cd cv && ./build.sh cv-andres-gonzalez.tex
# Expect: 1 page, 0 overfull warnings.
```

## Professional Identity -- Key Differentiators (May 2026)

These are Andrés's core differentiators. The CV should signal them through evidence, not through trait claims:

1. **Continuous learning, documented** -- He doesn't just learn; he publishes what he learns (blog, production projects, technical notes). The website IS the evidence. Never claim "aprendo rapido" -- show the blog with 22 bilingual posts and 25+ live projects.
2. **Production-ready mindset** -- Projects are not notebooks or exercises; they run on GCP with CI/CD, tests, and live URLs. The pipeline goes from raw data to deployed API. Highlight deployed systems, not POCs.
3. **Optimization and cost-consciousness** -- The GCP platform at <$10/mo vs $2,000+ conventional is the canonical example. He designs for efficiency and defends trade-offs with numbers.
4. **Risk, contingent scenarios, and stress testing** -- Actuarial foundation applied beyond insurance: Monte Carlo, VaR/TVaR, Weibull renewal processes for rare events, pandemic-impact quantification on mortality drift. Not just "I know risk" -- he models tail events.
5. **Multi-disciplinary interests and collaboration** -- Iterates with marketing/web/operations at Grupo Gigante, co-authors with geophysicists at IGF-UNAM, builds tools for non-technical users (LISF Agent, Pension Simulator). The CV should show range without scattering focus.
6. **Organized and systematic** -- 240 automated tests on SIMA, 52 pytest on the data platform, star-schema warehouse design, Pydantic-validated APIs. Signal through structure, not by saying "soy organizado."

**CV language rule**: convert each differentiator into a concrete fact or project outcome. Never write the trait name; write the evidence that implies it.

## Narrative Guideline

The CV shows the work and lets the reader draw conclusions. It never states "I'm a fast learner," "I know how to find the right tools," or any explicit claim about character or potential.

- **Project descriptions are problem-first, in a problem -> solution paradigm with intuitive phrasing that a non-technical reader can follow**. Each bullet has two halves joined by a period:
   1. **The problem**, stated as a short everyday observation -- what goes wrong if you don't solve it, or why the obvious approach fails. Use plain language with concrete images (a correo, una cirugía, una red, manos que tocan el dato), not jargon. Examples: *"Los modelos de riesgo tratan a cada cliente como si estuviera solo, pero los clientes se respaldan entre sí."* / *"No cuesta lo mismo una consulta que una cirugía, pero la industria los mete en un mismo precio."* / *"Un dato tarda más mientras más manos lo tocan."* / *"Al probar dos versiones de algo, la forma de leer el resultado cambia cuál gana."*
   2. **The solution**, stated as what the project actually does in plain Spanish -- also readable by a non-technical stakeholder. End with the tools/keywords only in italic at the very end. Do NOT sprinkle tech names, acronyms, or `\hl{}` highlights inside the prose. Examples: *"Dibuja el portafolio como red de conexiones y revela grupos de riesgo que no se ven uno por uno. Python, Neo4j."* / *"Separa 5.1 millones de reclamaciones en tres niveles de gravedad y estima un precio para cada uno. Python, Next.js."* / *"Automatiza el recorrido del evento al tablero para que los equipos vean información fresca. GCP, Python."*

   Rules:
   - Lead with the pain the project removes, not the tool.
   - Narrative in plain Spanish; a recruiter without a DS background should get it on first read.
   - **Use each project's native domain vocabulary, not generic placeholders.** Plain language != generic language. The nouns inside the bullet should be the real things the project touches -- that's what signals competence and keeps the description specific. Swap generic words for their domain counterpart:
     - Credit / risk -> *préstamo, garantías cruzadas, concentración accionaria, cartera, exposición*. Not *cuenta, cliente, evento*.
     - Insurance platforms / pipelines -> *siniestro, aviso, colisión menor, robo total, tarifa, reservas, prima*. Not *evento, dato, insight, tablero*.
     - Health/GMM pricing -> *consulta médica, cirugía, reclamación hospitalaria, prima pura, frecuencia-severidad*. Not *caso, evento, registro*.
     - Retail / customer analytics -> *cohorte de compras, conversión, ticket, propensión, campaña, CRM*. Not *usuario, cliente*.
     - Data engineering -> name the real input (*siniestro, vuelo, transacción, sesión web*) and the real output (*modelo de tarifa, reporte regulatorio, tablero de operación*). Not *evento -> insight*.
     The problem and solution halves should each contain at least one concrete domain noun; otherwise the bullet reads as a stock template that any analyst could have written.
   - Keywords (languages, frameworks, cloud, libraries) appear **only at the end** in italic, 2-4 items. No mid-sentence tool drops, no `\hl{}` on inline tech names.
   - `\hl{}` can still highlight a concrete *result* number (e.g., `\hl{13x-1,300x}`) or a domain anchor that the reader needs to notice (e.g., `\hl{A/B}` in a customer analytics context), but use sparingly.
   - No generic LinkedIn copy, no jargon soup, no feature-list bullets.

   Canonical wordings live in `../src/data/projects.ts` (same repo, one level up) and on the live site at `https://gonor.me/#proyectos` -- start from those for the domain vocabulary, then translate the phrasing to plain language before using.
- **"Sobre mí"** is a professional summary, first-person throughout ("Soy…", "He construido…", "Escribo…"). Ban: "Me apasiona…", motivation statements, anything that reads like a cover-letter opening.
- **Highlight the outliers, not the expected**. Reserves and pricing are standard for an actuary. A transformer on Proust, a GCP data platform, and a RAG agent over regulation are not.

## CV Sections (order in the document)

1. **Header** -- name, CDMX, email, phone (+52 55 4834 4672), portfolio link "Mi web(25+ proyectos)", GitHub. QR + date in top-right margin.
2. **Sobre mí** -- professional summary. **Three-part structure (strict)**:
   1. **Fact opening**: UNAM + SOA P + **current employer (Levely)** + **IGF-UNAM** -- all four in the first sentence. IGF-UNAM co-authorship is a required differentiator and must appear in the opening sentence.
   2. **Role hook**: one concrete problem/solution clause naming what the person DOES (pricing, reservas, capital; ML models; quant risk; pipelines; etc.) and ending with tech anchors (model, pipeline, API, dashboard / GCP / LISF / Neo4j).
   3. **Fact+preference split (canonical)** -- then blog close:
      - ES: *"Practico la formación continua y disfruto el trabajo colaborativo con equipos multidisciplinarios. En mi página web comparto lo que aprendo y construyo."*
      - EN: *"I practice continuing formation and enjoy collaborative work with multidisciplinary teams. On my website I share what I learn and build."*
3. **Experiencia** -- **single-column, dates inline**: `<Puesto> -- <Empresa>\quad{\small\color{gray}\textit{Junio 2026 -- Presente}}`. Uses `\begin{onecolentry}`, NOT `twocolentry`. Three entries, most recent first:
   - **Analista de Performance Marketing -- Levely** (Junio 2026 -- Presente). No client names, ever: describe the recurring work from measurement to marketing decisions. Emphasize responsibility for the data layer: server-side instrumentation, conversion quality and reconciliation, transformation, analysis, and monitoring. Explain which decisions the work enables. Add CRO as a short secondary clause when space allows: quantitative and qualitative session analysis, structured comparisons, and prioritized improvements using human and statistical criteria; LLM-assisted Playwright review may appear as a method, never as the headline. Do not require isolated cases or client metrics; include results only when they are representative, verifiable, and understandable without internal context. Keep specific integrations out of the prose and finish with 2-4 tools in italics.
   - **Becario Ciencia de Datos -- Grupo Gigante** (Septiembre 2025 -- Mayo 2026, closed; past tense). Job title must say **"Becario Ciencia de Datos"** in full, never "Becario de datos".
   - **Asistente de Investigación Científica -- IGF-UNAM** (2025 -- Presente).
4. **Habilidades** -- 6 bullets in order: Lenguajes, Ciencia Actuarial, Cloud \& DevOps, Medición \& Marketing Analytics, Data Science/ML \& IA, Idiomas. Spoken languages is its own bullet (`\item \textit{Idiomas:} ...`), not pipe-joined.
5. **Educación** -- one line: `Pasante (100\% de créditos cubiertos); titulación por exámenes profesionales SOA (Society of Actuaries).` EN: `Degree requirements completed (100\% of coursework); graduating via SOA exam track.` **Always escape `%` as `\%`.**
6. **Certificaciones** -- 8 items, each a **separate `\item`** with its own link (never `\textbullet`-join; ATS reads only the first entry on a line):
   - Associate Data Analyst (DataCamp) -> Drive `1EqzyjRkWOJBlU9zUTpkcUcj6QtuXRZfK`
     (`Asociate_Data_Analyst.pdf`). This once wrongly pointed at
     `1-QUuVH3zPBPsl6RhUvuUWxpZkP1i8TYb`, which is the `MisDocumentos` **folder**, not the
     certificate, so readers landed in a file listing. Do not reintroduce the folder ID here;
     it belongs only in the Drive-upload section below as the parent folder.
   - Associate Data Scientist in R (DataCamp) -> Drive `1xVLk15A1LBbyXH1fZnd4eBTaJ4d8FLLO`
   - Data Scientist Professional with R (DataCamp) -> Drive `1Woe6xqxofloFZ9uM2f5VsdGxY-WQWCRI`
   - **Databricks Fundamentals** (Abr 2026) -> `https://credentials.databricks.com/45f31d0f-ca80-4e3a-80c1-ede89826f6ce`
   - **AI Agent Fundamentals** (Databricks, Abr 2026) -> `https://credentials.databricks.com/14950fb9-6260-46d2-b78e-8ec864397479`
   - **Generative AI Fundamentals** (Databricks, Abr 2026) -> `https://credentials.databricks.com/9e3a7d69-10f5-4474-901f-d35e73bb69b2`
   - **Create ML Models with BigQuery ML** (Google Cloud, Jun 2026) -> `https://www.credly.com/badges/627e036d-0757-4d8a-9dca-6a40a8088f3c`
   - SOA P (Aprobado Marzo 2026) -> Drive `1rt3emgBnPpQi7NiXkBQeA5WwJTV0JuAf`

   `\href` is redefined in the preamble to always append a visible external-link arrow, so
   `\href{url}{}` with empty text is correct and clickable. Adding link text renders two icons.
   FM and SRM stay out (scheduled exams != certifications).
7. **Proyectos** -- 6 projects using `twocolentrynarrow` (2.2cm right column for links). Problem-first descriptions. If you change the count, re-check the 1-page fit.

## Style Rules

### Sobre mí -- banned phrasing (user-authorized overrides)

The general rule against "I'm a fast learner" character claims still holds, but the user has explicitly authorized a **formal professional-development phrasing** in Sobre mí that carries the adaptive-learning signal without the trait claim. Rules:

- **Use**: "Practico la formación continua" / "I practice continuing formation" (fact, verifiable CPD vocabulary).
- **Use**: "disfruto el trabajo colaborativo con equipos multidisciplinarios" / "enjoy collaborative work with multidisciplinary teams" (preference verb + collaboration signal).
- **Reject**: "Aprendo rápido…" / "Me adapto rápido…" / "I learn fast" / "I adapt fast" -- user explicitly rejected both as too casual / too trait-claim.
- **Reject**: "fast learner", "quick learner" (explicit trait claims).
- **Reject**: using "aprender" / "learn" twice in the Sobre mí paragraph -- the blog close already says "comparto lo que aprendo" / "share what I learn", so the soft-skill sentence must use synonyms (colaborativo, multidisciplinary teams, etc.) to avoid word repetition.
- **Reject**: em-dash punctuation (`--`) as sentence connector. Use commas, semicolons, or colons. `-` only for hyphenated compound words (rare-event, RBC-analog, Lee-Carter, IBNR/BEL, etc.).

Blog close (never rephrase):
- ES: *"En mi página web comparto lo que aprendo y construyo."*
- EN: *"On my website I share what I learn and build."*

### General

- **First-person throughout Sobre mí**: "Soy", "He construido", "mi página web" -- never third-person. Check every verb when editing.
- **Full month names in Spanish**: Enero, Febrero, …, Diciembre. Never "Sept" etc. This is a Spanish document.
- **Primary color**: RGB(217, 119, 87) -- Claude orange-red (`#D97757`), set via `\definecolor{primaryColor}`.
- **Font**: Source Sans Pro (type1).
- **ATS parsable**: `glyphtounicode` enabled; use `\%` for literal percent; never split ATS-critical strings across `%` line-continuations.
- **Phone**: E.164 href, human-readable display:
  `\hrefWithoutArrow{tel:+525548344672}{...+52 55 4834 4672}`. Do NOT write `tel:+52 55 48344672` -- Workday/Greenhouse drop spaces inside tel: URIs.
- **Project links**: one link per project. Priority: live app > blog > GitHub. Text: "app live" for deployed, "blog" for posts, "repo" for GitHub.
- **Project descriptions**: problem-first, ~150-230 chars, ending with italic tools.
- **Experience entries**: single-column (`onecolentry`), date inline after role as `\quad{\small\color{gray}\textit{DATE}}`. No `twocolentry` for experience anymore.
- **Project entries**: `twocolentrynarrow` with 2.2cm right column for the link. Keep them.
- **Footer**: `Andrés Ortega -- Página X de Y`. **No variant code** (`[A1] General`, etc.) anywhere, including `pdftitle` -- this is the public CV.
- **QR block**: anchored at `(paperwidth-0.3cm, paperheight-0.2cm)`, width 1.3cm. Sits in right margin, above the centered header's horizontal reach. Do not move it into a wider position or it will collide with the GitHub link.
- **QR image path**: `qr_portfolio.png`, loaded via the `\pdfximage` primitive (no `graphicx`).

## LaTeX Environments

| Environment | Purpose |
|---|---|
| `header` | Centered name + contact info |
| `onecolentry` | Full-width block (**used for Experience and Education**) |
| `twocolentrynarrow{link}` | Projects -- 2.2cm right column |
| `twocolentry{right}` | Legacy 4.0cm right column -- still used for Education dates only |
| `highlights` | Indented bullet list |
| `highlightsforbulletentries` | Bullet list without left margin (skills) |

`\vspace{0.02 cm}` between experience entries; project entries have NO vspace between them (inline) to save vertical room.

## Build

```bash
./build.sh cv-andres-gonzalez.tex
```

The document is `article` + `paracol` and **requires pdflatex** (run twice -- `lastpage` needs
the second pass). `build.sh` picks the engine from the document class and does both passes,
then reports page count and overfull boxes.

Verify: **1 page, 0 overfull.** Any overfull > 1pt must be fixed before publishing.

**Tectonic cannot build this document.** Tectonic is XeTeX-only; this lineage needs pdflatex.
On a bare VM install TeX Live instead:

```bash
sudo apt-get update
sudo apt-get install -y texlive-latex-recommended texlive-latex-extra \
                        texlive-fonts-recommended texlive-fonts-extra texlive-lang-spanish
```

Output PDFs land next to the source and are gitignored. To publish, copy the built PDF over
`../public/docs/cv-andres-gonzalez.pdf` and deploy -- see Version Tracking below.

## Tailoring for Job Postings

Do **all** tailoring in the private `claude-job` repo, not here. Copy `cv-andres-gonzalez.tex` out, tailor it there, and keep the posting text with it. Bring a change back into this file only if it improves the **public** CV for every reader. A position-specific edit never comes back.

### ATS Pass + Technical Depth

The CV must clear the ATS filter AND survive scrutiny from a technical reviewer.
- **ATS layer**: echo the JD's vocabulary exactly where possible.
- **Technical layer**: name the algorithm, dataset size, regulatory framework, metric. Vague bullets fail technical review even if they pass ATS.

### Skill Integrity Rules (strict)

**Never add a skill not backed by a real project, even if the JD asks for it.** Every keyword must be defensible in interview.

- Reframe real experience in the JD's words -- don't invent tools.
- If a required skill has no backing project, flag to Andrés instead of silently adding it.

### Mexican actuarial job market -- hot keywords (researched April 2026)

**Safe to claim (backed by current projects):**
Tarificación, GLM, GLM Tweedie, frecuencia-severidad, credibilidad (Bühlmann-Straub), Reservas (BEL, IBNR, Chain Ladder, BF), Lee-Carter, Whittaker-Henderson, RCS/SCR, LISF/CUSF, EMSSA-09, Reaseguro, Tablas CONAPO/HMD, Pensiones IMSS (Ley 73, Ley 97, Fondo Bienestar), Procesos de renovación Weibull, SOA P.

**Skip unless/until a project backs them** (all hot in postings but not in Andrés's repo):
- **Prophet / MoSes / GGY AXIS / PathWise** -- vendor valuation software; licensed on the job, not self-taught.
- **IFRS 17 / NIIF 17** -- highest-demand gap. Quick win: add an IFRS 17 mini-module to SIMA (CSM unlocking + LIC/LRC split).
- **Embedded Value / MCEV** -- add EV projection to SIMA.
- **US GAAP / STAT reserves / LDTI** -- narrow employer universe (MetLife, Chubb, AIG subs).
- **Solvency II (Europe)** -- 80% isomorphic to LISF; claim only if targeting European multinationals, and qualify as "LISF/CUSF (Solvency II-inspired)".
- **Options and guarantees / GMxB** -- requires stochastic projection + vendor software.
- **VBA, SAS, Looker Studio** -- pick up only if a specific target requires it.

Adding any of these to the CV breaks the defensibility rule.

## Version Tracking

Permanent public link (never create a new file; always update in place):
https://drive.google.com/file/d/16cdRmnzf0drNv9c5848N6ZedgYX9WhwV/view?usp=drive_link

**This Drive file is NOT what the site serves.** `Hero.astro` and `Contact.astro` both link
`/docs/cv-andres-gonzalez.pdf`, a tracked binary at `../public/docs/cv-andres-gonzalez.pdf`.
Updating the Drive file changes nothing on gonor.me; updating the tracked PDF and deploying is
what changes it. Keep both in sync when publishing a new CV, or decide which one is canonical.

**Workflow:**
1. Edit `.tex`, compile with `build.sh`.
2. Validate all hrefs (Playwright -- 200 OK).
3. **Ask the user for confirmation** before updating the permanent Drive file. Do NOT auto-push intermediate versions.
4. On explicit approval, update the permanent PDF in place:

```python
from google.auth import default
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
creds, _ = default(scopes=['https://www.googleapis.com/auth/drive'])
service = build('drive', 'v3', credentials=creds)
media = MediaFileUpload('<compiled>.pdf', mimetype='application/pdf')
service.files().update(fileId='16cdRmnzf0drNv9c5848N6ZedgYX9WhwV', media_body=media).execute()
```

- Drive file: `CV_GonzalezAndres.pdf` (ID: `16cdRmnzf0drNv9c5848N6ZedgYX9WhwV`)
- Parent folder: `PortafolioPDF/MisDocumentos/` (ID: `1-QUuVH3zPBPsl6RhUvuUWxpZkP1i8TYb`)

Requires Google Cloud application-default credentials (`gcloud auth application-default login`). Without them, upload the PDF to Drive manually.

## Grupo Gigante ML Context (for retail/e-commerce tailoring)

The internship covers three distinct ML workstreams:

| Workstream | What it is | Surface when targeting |
|---|---|---|
| **Churn** | Classification models per brand | Retail DS/ML |
| **Cross-brand propensity** | Cross-sell/upsell across brands (enabled by identity resolution) | Retail, CRM, customer analytics |
| **Web behavior** | Clickstream and session models | E-commerce, growth, product analytics |

The CV bullet covers all three at a high level. Expand only in a private tailored copy.

**CDP ownership phrasing**: Andrés is an intern -- use "Contribuyo al CDP" / "I contribute to the group's CDP", NOT "Desarrollo el CDP" / "I develop the CDP". Ownership claims raise red flags in tech screens.

## Portfolio Content Map -- now in the same repo

The portfolio site is the single source of truth for project descriptions, skills, certificates, and blog writeups. It now sits one level up, so read it directly:

| Path | Use |
|---|---|
| `../src/data/projects.ts` | Canonical descriptions + live URLs per project |
| `../src/data/skills.ts` | 7 skill groups (bilingual) |
| `../src/data/education.ts` | UNAM degree + certificates with dates |
| `../src/data/notes.ts` | Academic PDF metadata |
| `../src/content/blog/es/` (mirrored in `en/`) | Richest source for CV bullet content -- frontmatter `description` is a 2-3 sentence summary; the body has the full technical narrative |

**When a project's wording changes in `projects.ts`, the CV bullet should follow, and vice versa.** That sync is the reason these live in one repo.

### Priority projects (most solid, prioritize when tailoring)

| Project | Blog (ES) | Key tech |
|---|---|---|
| **SIMA** | `sima.md` | Lee-Carter, BEL, RCS bajo LISF, Python/FastAPI/React/GCP |
| **LISF Agent** | `regulation-agent-rag.md` | RAG over 1,000+ articles, FTS5/BM25, Claude Agent SDK |
| **GMM Explorer** | `gmm-explorer.md` | 5.1M CNSF claims, frequency-severity, credibility, Next.js/Vercel |
| **CreditGraph** | `credit-graph-topological-risk.md` | Neo4j, PySpark/Databricks, LightGBM+Platt. **Describe without metrics** (no AUC, no record counts). |
| **Cartera Autos** | `cartera-autos.md` | GLM pricing, IBNR (Chain Ladder + BF), Monte Carlo VaR/TVaR, fraud, R Shiny |
| **Suite Actuarial** | `actuarial-suite.md` | LISF/RCS/CNSF/EMSSA-09, 4 ramos, Pydantic, Streamlit/GCP |
| **Pension IMSS** | `imss-pension-simulator.md` | R Shiny, Ley 73/97, Fondo Bienestar |
| **DA Portfolio** | (on site) | 7 projects, dashboards, SQL/Python/Streamlit/Power BI |
| **Flight Analytics** | `flight-analytics.md` | Postgres -> BQ ETL, 5.74M rows, WebGL map |
| **Proust** | `proust-attention-machine.md` | **URL slug is `proust-attention-machine`, not `proust-attention`.** Transformer from scratch |
| **Risk Analyst** | `risk-analyst.md` | 13 projects, VaR/CVaR to systemic contagion |
| **Insurance ML Pricing** | `actuarial-ml-pricing.md` | **URL slug is `actuarial-ml-pricing/`, not `insurance-ml-pricing`.** GLM vs XGBoost with SHAP |
| **Data Platform GCP** | `data-engineering-platform.md` | Pub/Sub + Beam, BigQuery, Dagster, Terraform, GLM Tweedie |

### GMM tech stack (standardized)

`\textit{Python, Next.js, Vercel.}` -- NOT "TypeScript, Astro, Vercel" (old template error).

## Common Pitfalls (learned the hard way)

- **`100%` in LaTeX is a comment marker**. Always write `100\%` or the rest of the line disappears silently.
- **Workday/Greenhouse strip spaces in `tel:` URIs** -- use `tel:+525548344672`, not `tel:+52 55 48344672`.
- **ATS parses the first item of a bulleted line**. Don't `\textbullet`-join multiple certs on one line; split into separate `\item`s.
- **ATS sees programming "Languages" and spoken "Languages" as the same field**. In EN variants rename the programming bullet to "Programming" and keep "Languages" for spoken -- otherwise one overrides the other.
- **The 1.3cm QR will collide with a wide header contact line** if anchored any further left than `paperwidth-0.3cm`. The centered header's right edge caps at ~`paperwidth-3.3cm`, so a 1.3cm QR in the right 0.3-1.6cm zone clears it.
- **Compact-preamble variants need a blank line** between name and contact info in the header block -- otherwise the full contact row sits on the same line as the name.
- **`Bornhuetter-Ferguson` is an unbreakable long word**. Abbreviate to `BF` if a skills line overflows by < 2pt.
- **Scheduled exams are not certifications**. FM and SRM should never appear under Certifications until passed.
- **Drive link on the personal CV is a permanent ID** -- never create a new file, always `files().update(fileId=..., media_body=...)` in place.
- **IGF-UNAM must appear in every variant's Sobre mí opening**. It's the strongest differentiator (co-authored scientific paper on Popocatépetl rare-event modeling) and ATS/HR readers need it in the first sentence. Past validation passes have caught B1/B2/E1/E2/F1/F2 missing it -- always check.
- **"Becario Ciencia de Datos" full title** -- never abbreviate to "Becario de datos" in any variant (except USI which leads with "Actuarial analyst" and can legitimately shorten).
- **Sobre mí word-repeat trap**: the blog close "comparto lo que aprendo / I share what I learn" uses the word `aprender/learn`. Do NOT use `aprender/learn` anywhere else in Sobre mí -- instead use `formación continua`, `colaborativo`, `multidisciplinary teams`.
- **Em-dash `--` as sentence punctuation in Sobre mí is banned**. Use commas, colons, or semicolons. Hyphens inside compound words (Lee-Carter, rare-event, IBNR/BEL) stay.
- **This repo is public.** Before `git add`, check that nothing employer-specific, no PDF, and no exam proof is in the diff.
