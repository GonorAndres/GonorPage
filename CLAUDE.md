# Portfolio Project Guidelines

## Git Workflow -- ALWAYS Ask Before Commit and PR

**Never commit, push, or open/update a PR without asking the user first and receiving explicit confirmation in that same conversation.** "Deploy", "test it", or similar phrasings are NOT authorization to commit; when in doubt, show the pending diff summary and ask. This applies to every branch, including feature branches.

## Git Workflow -- NEVER Push to Main Directly

**NEVER push commits directly to `main`.** All changes go through pull requests.

- Work is always done on a feature branch (e.g. `march2`, `fix/something`)
- To "deploy", open a PR from the feature branch into `main` and let the user merge it
- The only exception is if the user explicitly says "push to main" in that specific message
- This applies even when the user asks to "deploy" or "go live" -- create a PR, don't push

## Session Start Checklist

At the start of every session, read `to-do.md` in the repo root before proposing or starting any work.
It tracks: missing blog posts, missing screenshots, broken/placeholder links, and development status for priority projects.
Update `to-do.md` when tasks are completed (check off items, add new ones as discovered).

## Core Narrative -- Emerges from the Work, Never Stated

The portfolio's message is never declared explicitly. No section, paragraph, or sentence should say "I'm learning," "I know what I don't know," or any variation of "although I lack X, I have Y." The reader arrives at their own conclusions by moving through the projects, posts, and notes.

Guidelines for all content:
- Show the work. The reader infers the rest.
- The natural arc of honest technical writing is: real problem, approach, failure, understanding why it failed, retry with adjustments, satisfactory result. Not every post needs every step, but when the work involved iteration, show it. That's what makes the writing credible.
- Different content carries different weight. Some posts (pension-simulator, SIMA, regulation-agent) naturally show the full arc. Others (math-visualizations, b-trees) are tools posts and don't need to carry narrative.
- The blog is also a resource for others, not just a portfolio showcase. Study guides (SOA posts) help readers learn; that purpose is valid on its own.

## Content Tone -- NEVER Homework Style

When writing or editing any content for this portfolio (blog posts, project descriptions, section text):

- NEVER use assignment framing: "the objective was...", "the professor asked...", "for this project we had to..."
- ALWAYS lead with the problem and why it matters in the real world
- ALWAYS include limitations, assumptions chosen and WHY, and what you'd do differently with more data/time
- ALWAYS end technical pieces with a "so what" -- what decision does this analysis support?
- When describing actuarial work, reference regulatory context (CNSF, LISF, CUSF) where applicable
- When presenting models, include sensitivity analysis or at minimum acknowledge what parameters drive uncertainty

## Project Card Descriptions -- Written for Everyone, Not Engineers

The project card is the front door. Most visitors are not specialists in the project's domain. The description must let anyone understand what the project is about, why it matters, and what it produces, without requiring prior knowledge of the tools or techniques involved.

**Principle:** The card exposes the work so people can understand intuitively what it is. The technical depth lives in the project itself (repo, live URL, PDF, blog post). The card is the invitation, not the documentation.

Guidelines:
- **Use general concepts first, specific tools second.** Say "base de datos" before "PostgreSQL". Say "modelo de riesgo" before "LightGBM calibrado por Platt". The reader should understand the sentence even if they skip every proper noun.
- **Explain the domain, not just the technique.** "Analizar patrones de retraso en vuelos" is accessible. "EXPLAIN ANALYZE sobre 65K filas con Bitmap Index Scan" is not. The second belongs in the blog post.
- **Name the output.** Every description should make clear what the visitor can see or interact with: a dashboard, a calculator, a report, a live app.
- **Keep jargon to the minimum that adds real meaning.** If a tool name helps the reader understand the approach (e.g., "migra de PostgreSQL a BigQuery" explains two paradigms), include it. If it only signals technical depth without adding clarity (e.g., "cursores en batch a 56K filas/s"), save it for the post.
- **Three beats remain:** (1) what problem exists in the real world, (2) what the project does about it using accessible language, (3) what the reader can explore. Present tense.

## Connection Between Projects

Every project should reference at least one other project in the portfolio where relevant. The portfolio tells a story -- isolated pieces look like coursework, connected pieces look like a body of work.

Key connections to maintain:
- Michoacan mortality data <-> life insurance pricing
- Data cleaning methodology <-> any project involving data preparation
- Quantitative finance (Black-Scholes/FRA/IRS) <-> portfolio optimization
- A/B testing decision framework <-> credit model (both are decision-making under uncertainty)
- SIMA engine <-> all insurance technical notes (SIMA is the implementation of the theory)

## Project Card and Blog Post Sync

Project cards (`src/data/projects.ts`) and blog posts (`src/content/blog/`) are always linked via `blogSlug`. When updating one, always check and update the other:

- **Changing a project card** (URL, description, stack, status): check the blog post's frontmatter (`ficha`) and body for stale URLs, outdated descriptions, or missing features.
- **Changing a blog post** (new section, URL update, ficha edit): check the project card for matching `url`, `urls`, `description`, `tags`, and `last_modification_date`.
- **Adding a new feature to a live app**: update the blog post body, the blog `ficha` (live URL, extraLinks), AND the project card (url/urls, description, last_modification_date).

Every blog post with a corresponding project should have a `ficha:` block in its frontmatter containing at minimum: `rol`, `stack`, `estado`, `repositorio`, and `live` (if the project has a deployed app).

## Blog i18n Filename Convention

All blog posts MUST use the **English slug** as the filename in both `src/content/blog/es/` and `src/content/blog/en/`. The LanguageSwitcher toggles URLs by adding/removing the `/en` prefix, so both language versions of a post must produce the same slug.

- Correct: `es/welcome.md` + `en/welcome.md` (same filename, Spanish content inside the ES file)
- Wrong: `es/bienvenida.md` + `en/welcome.md` (different filenames = 404 on language switch)

The title, description, and body content are fully localized -- only the filename must match.

## Notes / Shared PDFs Metadata

Every note in `src/data/notes.ts` must include:
- `createdDate: string` -- YYYY-MM-DD format, sourced from the Google Drive file's `createdTime` field.
- `version: string` -- sourced from the Google Drive file's `version` field (internal revision counter that increments on every save).

Both fields are fetched via the Drive API v3. The API requires the `x-goog-user-project` header set to the GCP project ID:
```bash
TOKEN=$(gcloud auth application-default print-access-token)
PROJECT=$(gcloud config get-value project)
curl -s "https://www.googleapis.com/drive/v3/files/{FILE_ID}?fields=name,createdTime,version" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-goog-user-project: $PROJECT"
```

When adding a new note:
1. Upload the PDF to the appropriate MisApuntes subfolder in Google Drive
2. Fetch `createdTime` and `version` via the API call above
3. Fill in `keywords` (5 terms per language, SEO-oriented)
4. Set `relatedNotes` to at least one other note slug

When updating an existing note's PDF, re-fetch the `version` field from Drive to keep it in sync.

The version and creation date are displayed on individual note pages (`/notes/[slug]/`).

## Writing Standards

- **No double-dash em-dashes**: Never use `--` as punctuation in blog posts or descriptions. This is a known AI writing pattern and reads unnaturally. Instead, use proper punctuation: commas, semicolons, colons, or restructure the sentence. For example:
  - Wrong: "Not formulas to memorize -- the mental toolkit an actuary uses"
  - Right: "Not formulas to memorize, but the mental toolkit an actuary uses"
  - Right: "Not formulas to memorize; they are the mental toolkit an actuary uses"
- **Spanish diacritics are mandatory**: Every Spanish text (blog posts, descriptions, i18n strings, data files) MUST use proper accents (á, é, í, ó, ú) and tildes (ñ). Missing accents change meaning ("año" vs "ano", "está" vs "esta", "cómo" vs "como") and make the portfolio look unprofessional. When writing or editing Spanish content, always verify accents on: words ending in -ción/-sión, interrogatives (qué, cómo, cuál, dónde, cuándo), past tense verbs (empezó, decidió, construí), and common words (más, también, aquí, así, México, análisis).
- Bilingual: all major content should exist in both ES and EN
- Professional but accessible -- imagine the reader is a hiring manager at an insurance company or consultancy who has 2 minutes
- Technical depth is good but must serve a point, not just demonstrate you can do math
- Every PDF or document linked should have a 2-3 sentence description explaining what it demonstrates and what skills it shows
- **Blog post descriptions: problem, approach, implication**: The `description` field in blog frontmatter follows three beats: (1) the real-world problem, (2) the key approach with only the most important technical terms, (3) what that approach makes possible. Present tense. Don't list every tool or technique; name only the ones that matter most and explain what they enable. Save raw numbers and full stack details for the post body.
  - Wrong: "This post explains why RAG is the right approach for regulatory documents."
  - Wrong (too many technical terms): "...FTS5 con BM25 ponderado, grafo de referencias cruzadas, palabras clave enriquecidas por pipeline Sonnet/Opus, backend FastAPI en GCP..."
  - Wrong (LinkedIn-style hook): "Over a thousand articles. Two laws. One Ctrl+F that fails you when it matters most. This project builds the search infrastructure Mexican actuarial regulation needed." Avoid punchy, inspirational, or engagement-bait phrasing.
  - Right: "Interpretar la LISF y la CUSF exige navegar entre artículos que se referencian mutuamente entre leyes. Este agente usa RAG para indexar cada artículo con un grafo de referencias cruzadas, eliminando las alucinaciones de citas y permitiendo que el modelo razone solo sobre texto real de la ley. El resultado es un asistente que amplifica la memoria del actuario sin sustituir su criterio."

## Blog Posts from Academic Work

When converting academic notes to blog posts:
1. Reframe the motivation (real-world problem, not course requirement)
2. Add context the original didn't have (regulatory, market, practical applications)
3. Include sensitivity analysis if the original lacks it
4. Connect to other portfolio projects
5. Add a "what I'd do differently" or "next steps" section
6. Link the original PDF as supplementary material, not as the main content

## PDFs: Content to NOT Share Standalone

- Amortizador/Instrucciones_Examen.pdf (exam instructions, not original work)
- Formulario_MetodosCuantitativosParcial1.pdf (cheat sheet)
- Covarianza_Regresion.pdf (2-page proof, too brief)
- EticaActuarialEnsayo.pdf (opinion essay, not technical)

## How to Add a Blog Post

1. **Pick an English slug** for the filename (e.g. `credit-risk-model`). Both languages use the same filename.

2. **Create two files** with identical names:
   - `src/content/blog/es/<slug>.md` -- Spanish content
   - `src/content/blog/en/<slug>.md` -- English content

3. **Frontmatter** (required fields):
   ```yaml
   ---
   title: "Your Title Here"
   description: "2-3 sentence summary."
   date: "2026-03-01"
   category: "proyectos-y-analisis"
   lang: "es"
   tags: ["optional", "tags"]
   lastModified: "2026-03-21"  # optional, add when editing an existing post
   ---
   ```
   - `category` must be one of: `actuaria-para-todos`, `fundamentos-actuariales`, `proyectos-y-analisis`, `herramientas`, `mercado-mexicano`
   - `lang` must match the directory (`es` or `en`)
   - `date` format: `YYYY-MM-DD` as a quoted string. **This is the publication date and must NEVER be changed after a post is first published.**
   - `lastModified`: optional. When editing an existing post, add or update this field with today's date (`YYYY-MM-DD`). Internal metadata only, not displayed in UI.

4. **Write the body** in standard Markdown. For inline HTML (buttons, styled links), use inline `style=""` attributes -- Tailwind classes are purged from markdown content.

5. **Verify**: run `npx astro build` from the project root (currently 85 pages). The new post should appear in the blog index, its category page, and LatestPostCard.

The post will automatically show up in:
- The blog index (`/blog/` and `/en/blog/`)
- Its category page (`/blog/categoria/<category>/`)
- The "Latest posts" card in the Hero section (if it's recent enough)
- The language switcher will work as long as both filenames match

## Claude Code Agents (`.claude/agents/`)

Five persistent agents are defined for periodic maintenance. Claude auto-delegates based on task context, or you can invoke them by name.

- **data-architect** -- Maintains `src/data/` (projects, notes, skills, education, categories). Use when adding/editing/removing data entries or updating TypeScript interfaces.
- **project-organizer** -- Manages how projects appear to visitors: categories, grid layout, narrative order, visual prominence, cross-project connections. Use when rethinking project display or adding new categories.
- **blog-organizer** -- Maintains the blog section: adding posts, managing categories, fixing structure, ensuring ES/EN parity. Use when creating blog posts or fixing blog issues.
- **blog-writer** -- Writes new blog posts from scratch (project slug, topic, or source material). Drafts both ES and EN versions with natural, honest voice. Use when you want to go from "I have this project/topic" to two ready-to-publish markdown files.
- **code-quality** -- Handles SEO, accessibility, performance, bug fixes, TypeScript safety, and dead code removal. Use for technical health checks, meta tag updates, or fixing broken behavior.

All agents save work reports to `subagents_outputs/`.

## External Project Plans

Two sibling directories contain implementation plans for upcoming portfolio additions. Read the relevant plan.md before starting work on either topic.

- **`/home/andtega349/microsoft-suite-data/plan.md`** -- Excel consolidation card + Power BI insurance claims dashboard. Covers project card metadata, DAX measures, star schema, cross-linking to existing projects. Both cards use `data-science` category and share insurance domain data.
- **`/home/andtega349/risk-analyst/plan.md`** -- 4 theory PDFs (VaR/CVaR foundations, EVT tail risk, copula dependency, stress testing) to add as notes under the `quant` category. Includes note slugs, descriptions (ES+EN), tags, keywords, relatedNotes, and back-linking instructions for existing notes.

Neither plan has been executed yet as of 2026-07-12 (no Excel-consolidation/Power-BI project cards in `src/data/projects.ts`, no VaR/CVaR/EVT/copula/stress-testing notes in `src/data/notes.ts`), so both entries stay. Note: as of this session's environment, `/home/andtega349` does not exist -- if it's still missing next session too, confirm with the user whether those sibling repos moved before assuming the plans are stale.

## HTML Artifacts Section (`/artifacts/`)

The `/artifacts/` route (formerly `/notes/` — renamed 2026-04-19) houses both PDF entries and interactive HTML artifacts. All entries live in `src/data/notes.ts`; HTML artifacts also have `type: 'artifact'` and a folder under `public/artifacts/<folder>/index.html`.

- **Pattern contract**: `ARTIFACTS.md` (repo root) — folder convention, required universal back-pill snippet, `?lang=` auto-detect logic, per-artifact checklist. Read this before adding a new HTML artifact.
- **Legacy URLs**: `/notes/*` paths still resolve via redirect pages declared in `astro.config.mjs`.

### Current HTML artifacts and their sandbox sources

| Note slug (detail at `/artifacts/<slug>/`) | Live file (`public/artifacts/<folder>/`) | Sandbox source |
|---|---|---|
| `bias-variance-tradeoff` | `yuminari-bow/` | `/home/andtega349/sandbox/17abril/bias-variance-html/` |
| `greedy-split-search` | `greedy-node/` | `/home/andtega349/sandbox/19abril/greedy-node/` |

When editing an artifact: the portfolio copy under `public/artifacts/` is what ships. The sandbox directory is a dev scratch. Keep them in sync (`cp` back and forth) or treat the portfolio copy as canonical.

## Local Testing with Playwright MCP

After making changes, use the Playwright MCP browser tools to verify rendering before committing:

1. Build the site: `npx astro build` (must pass with no errors)
2. Start preview: `npx astro preview --host 0.0.0.0` (runs on port 4321)
3. Use `mcp__playwright__browser_navigate` to load `http://localhost:4321/`
4. Use `mcp__playwright__browser_snapshot` to inspect the DOM (better than screenshots for verifying text content, links, and structure)
5. Use `mcp__playwright__browser_click` to expand sections (e.g., "Ver todos los proyectos" button) and verify new project cards
6. Navigate to specific pages (`/blog/<slug>/`, `/en/blog/<slug>/`) to verify blog post rendering
7. Check for: KaTeX math rendering issues (currency `$` signs parsed as math), broken links, missing i18n keys, correct category badges
8. Kill the preview server when done: `pkill -f "astro preview"`

Common issue: `$` followed by a digit in blog prose (e.g., `$10`, `$400`) gets parsed as inline math by remark-math. Fix by escaping: `\$10`, `\$400`. Actual math expressions like `$p = 1.5$` should NOT be escaped.

## Button Radii Convention

Three radius values are used across the site; pick by role, not by aesthetic whim:

- **`rounded-full` (9999px)** — inline row actions (pill buttons inside list rows, e.g. `Abrir artefacto`, `Ver PDF` in the artifacts catalog). Signals "small secondary action scoped to this row".
- **`rounded-xl` (12px)** — page-level CTAs and cards (e.g. the "Ver todos los artefactos" button, the search input, project cards). Signals "primary surface or action for the page".
- **`rounded-lg` (8px)** — reserved for the home hero's primary CTAs only. Do not introduce new uses; if adding a new button, pick one of the first two.

If a new pattern is needed, extend this list explicitly rather than inventing a fourth value.

## Responsive Typography and Mobile UI

- Paragraph text in main content uses justified alignment with language-aware hyphenation. Keep headings, labels, navigation, buttons, short metadata, and controls naturally aligned; forcing those elements to justify reduces readability.
- Treat 320px wide screens as a supported baseline. Use `px-4 sm:px-6` for page gutters unless a narrower component requires less.
- Interactive controls need a minimum 44px touch target. On small screens, controls may wrap or stack but must never overflow horizontally.
- Mobile menus and disclosure panels should animate their open and closed states, support Escape to close, and expose their state with the appropriate ARIA attributes.

## Project Categories

- `actuarial`: terracotta (#C17654)
- `data-science`: sage (#7A8B6F)
- `data-engineering`: steel blue (#5B7B9A)
- `quant-finance`: amber (#D4A574)
- `applied-math`: navy (#1B2A4A)

Project cards also accept `status?: 'completed' | 'in-development'`. Set to `'in-development'` to render a dashed "En desarrollo"/"In development" badge. Omit for finished projects.

Adding a new category requires changes in: `src/data/projects.ts` (type), `src/components/ui/ProjectsGrid.tsx` (accent, badge, gradient, icon), `src/i18n/es.ts` + `en.ts` (translation key), `src/components/sections/FeaturedProjects.astro` (labels object).

## Project Gallery (Creation Steps)

Every project card with a `screenshot` is clickable: clicking the image opens a full-screen lightbox. If the project also has a `gallery` array, the lightbox becomes a sequential gallery showing the creation process step by step.

**Goal:** all projects should eventually have a `gallery` that walks through the most important stages of building the project (data pipeline, model fitting, UI iteration, key result, etc.).

**UI layout (one image at a time):**
```
┌─────────────────────────────────────[X]─┐
│  ┌───────────────────────────────────┐   │
│  │           [ image ]               │   │
│  └───────────────────────────────────┘   │
│  ←   "Caption describing this step"  →   │
│               •  •  ●  •  •             │
└─────────────────────────────────────────┘
```
Arrows and keyboard (←/→/Escape) navigate between steps. Dots show position.

**How to add a gallery to a project** (`src/data/projects.ts`):
```ts
gallery: [
  { src: '/screenshots/sima-step1.png', caption: { es: 'Proyección Lee-Carter', en: 'Lee-Carter projection' } },
  { src: '/screenshots/sima-step2.png', caption: { es: 'Tabla de conmutación', en: 'Commutation table' } },
],
```
Place images in `public/screenshots/`. Captions are optional but recommended. The `screenshot` field stays as the card thumbnail; `gallery` adds the step-by-step view.

**Status (2026-07-12):** 11 of 24 screenshot-bearing projects have a `gallery`: `sima`, `gmm-explorer`, `data-analyst-portfolio`, `credit-graph`, `data-engineering-platform`, `pension-simulator`, `lisf-agent`, `actuarial-suite`, `cartera-autos`, `flight-analytics-pg-bq`, `teaching-apis`. Next priority: `life-insurance` (still pending), then the remaining screenshot-only projects (`property-insurance`, `derivatives`, `markowitz`, `michoacan`, `data-cleaning`, `monte-carlo-poker`, `amortization`, `proust-attention`, `ab-testing`, `euler-method`, `risk-analyst`, `credit-risk`) by tier.

## Technical Preferences

- Framework: Astro 5 + Tailwind + React islands + MDX
- Content Layer: config at `src/content.config.ts` with explicit `glob()` loader; posts use `post.id` (format: `es/slug` or `en/slug`) not `post.slug`; render via `import { render } from 'astro:content'` then `render(post)`
- Deployment: GitHub Pages (GonorAndres.github.io)
- Project platforms: GitHub, Drive, Vercel, Colab, GCP, HuggingFace, Firebase
- i18n: ES (default, no prefix) / EN (/en/)
- Blog categories: actuaria-para-todos, fundamentos-actuariales, proyectos-y-analisis, herramientas, mercado-mexicano
- Color palette: cream (#EDE6DD), header (#E8E0D7), navy (#1B2A4A), amber (#D4A574), terracotta (#C17654), sage (#7A8B6F), steel blue (#5B7B9A)
- Fonts: Lora (headings), Inter (body)

## Analytics

Two systems run in production, disabled on localhost:
- **GA4**: initialized in `BaseLayout.astro`, automatic pageview tracking
- **PostHog**: initialized in `src/lib/analytics.ts`; three custom events:
  - `tool_used` — project card primary link clicks (ProjectsGrid)
  - `contact_clicked` — contact link interactions
  - `content_engaged` — blog post reads
  - API key injected from GitHub secrets during build via `.github/workflows/deploy.yml`

## File Organization

- PDFs for download go in public/docs/
- Blog content in src/content/blog/es/ and src/content/blog/en/; collection config at src/content.config.ts
- Subagent outputs go to repositorio/subagents_outputs/
- Planning and reference docs go in docs/

## Live App Polish Backlog (re-audited 2026-07-12)

Originally audited via Playwright on 2026-04-20; re-checked via curl/WebFetch on 2026-07-12 (no Playwright MCP available in that session, so purely visual questions — theme colors, sidebar label styling — could not be re-verified and are marked below). Address these when working on the affected project. Do NOT silently skip them.

### CRITICAL — broken, must fix before showing to anyone

**`data-engineering-platform`** (`claims-dashboard-451451662791.us-central1.run.app`):
- Still broken as of 2026-07-12: same BigQuery 404, error text unchanged — `Could not load KPI summary. 404 Not found: Table project-ad7a5be2-a1c7-4510-82d:dev_claims_analytics.fct_claims was not found in location us-central1`.
- Fix path A: re-run the Dagster pipeline locally to recreate the BigQuery tables, then redeploy.
- Fix path B: replace BigQuery queries with a DuckDB + Parquet static file so the dashboard has no cloud dependency.
- After the data is fixed: apply a custom Streamlit theme (navy `#1B2A4A` primary, amber `#D4A574` accent, cream `#EDE6DD` background) via `.streamlit/config.toml`, and rename sidebar pages from raw Python filenames to proper title case.

**`actuarial-suite`** (`suite-actuarial-d3qj5vwxtq-uc.a.run.app`) — escalated from NEEDS POLISH:
- As of 2026-07-12 the root URL no longer serves the Streamlit dashboard at all — it returns raw FastAPI JSON (`{"name":"Mexican Insurance Analytics Suite API",...}`). Checked `/app`, `/ui`, `/dashboard`, `/streamlit`: all 404. Only `/docs` (Swagger) responds.
- This is worse than the previously-reported "default Streamlit chrome" issue: the demo is currently inaccessible to a visitor, not just unpolished.
- Fix: find where the Streamlit frontend service actually lives (may be a separate Cloud Run service that needs redeploying, or the routing/proxy in front of the API changed) and confirm the portfolio card's `url` in `src/data/projects.ts` still points at a live dashboard, not the bare API.

### NEEDS POLISH — functional but visually plain, dated, or unverifiable without a browser

**`lisf-agent`** (`actuarial-regulation-agent-451451662791.us-central1.run.app`, access code `actuaria-claude`):
- Partially improved since 2026-04-20: no longer a tiny centered box — now a full-width layout with sidebar nav (LISF/CUSF structure index, browsing modes, CNSF links). Still doesn't explain what the tool does or hint the access code to a cold visitor.
- Note: the portfolio's `src/data/projects.ts` URL changed since the last audit (was `-d3qj5vwxtq-uc.a.run.app`, now `-451451662791.us-central1.run.app`) but **the old domain is still live and serves byte-identical content** — an orphaned duplicate Cloud Run deployment. Worth decommissioning to avoid confusion/cost, or confirm intentional.
- Fix: add a brief explainer + access-code hint to the login screen.

**`data-analyst-portfolio` — Olist Streamlit** (`da-cohort-streamlit-451451662791.us-central1.run.app`):
- Still up and functional; confirmed genuine Streamlit app via HTML source. Sidebar page names are client-rendered via JS, so whether they've been fixed (previously raw lowercase Python slugs without accents) **could not be confirmed from curl/WebFetch** — needs an actual Playwright/browser check.

### MINOR — low priority but noted

**`proust-attention`** (`huggingface.co/spaces/GonorAndres/proust-attention`):
- Unchanged: Space sleeps due to inactivity (free HuggingFace tier), shows "Restart this Space", ~30s wake. Expected, not a bug.

**Five Vercel apps under `data-analyst-portfolio`'s `urls` dropdown** — new finding, 2026-07-12: `insurance-claims-dashboard-pi.vercel.app`, `ab-test-analysis.vercel.app`, `executive-kpi-report.vercel.app`, `financial-portfolio-tracker-iota.vercel.app`, `operational-efficiency.vercel.app` all return HTTP 307 with **no `Location` header** instead of 200 (confirmed with raw headers, cache-busted, `x-vercel-cache: HIT`). A real browser still renders the page fine since there's nowhere to redirect to, but it's spec-non-compliant and could make a bot/crawler/strict fetcher treat these as failed loads. Worth checking each app's Next.js middleware/redirect config.

**`eruption-forecasting` and `micro-insurance`** (both have `url: '#'`):
- Both have `status: 'in-development'` badge, so the placeholder is intentional.
- The "ver en vivo" button currently does nothing (clicks `#`). Consider hiding the live button entirely when `url === '#'` in `ProjectsGrid.tsx` to avoid confusion.

### GOOD — no action needed (reconfirmed 2026-07-12)

| Project | Live URL | Notes |
|---------|----------|-------|
| `sima` | sima-d3qj5vwxtq-uc.a.run.app | Custom React app, title confirmed live. Best live app in portfolio. |
| `gmm-explorer` | gmm-explorer.vercel.app | Up, full nav + docs content confirmed. |
| `credit-graph` | graph-relation-db.vercel.app | Up, full narrative + visualization content confirmed. |
| `cartera-autos` | cartera-autos-451451662791.us-central1.run.app | Up, custom-themed "Siniestralidad Auto Mexico" dashboard with KPI cards and model tabs (GLM, IBNR, Monte Carlo, fraud) confirmed. |
| `pension-simulator` | simulador-pension-d3qj5vwxtq-uc.a.run.app | Up, landing page content confirmed. |
| `flight-analytics-pg-bq` | project-ad7a5be2-a1c7-4510-82d.firebaseapp.com | Up, dashboard loads with data (104 airports, 100 routes) confirmed. |
| `data-analyst-portfolio` (main) | demo-aesthetics.vercel.app | Up, HTTP 200, full content confirmed. |
| `teaching-apis` | learning-apis-451451662791.us-central1.run.app | New since last audit — up, ES/EN educational site (Concept/Playground/Analysis/Build) confirmed working. |
