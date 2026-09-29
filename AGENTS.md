# Portfolio Project Guidelines

## Git Workflow -- ALWAYS Ask Before Commit and PR

**Never commit, push, or open/update a PR without asking the user first and receiving explicit confirmation in that same conversation.** "Deploy", "test it", or similar phrasings are NOT authorization to commit; when in doubt, show the pending diff summary and ask. This applies to every branch, including feature branches.

## Git Workflow -- Environments and Branches

Full detail in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). Read it before doing anything deployment-related.

| Environment | Branch | Host | URL |
|---|---|---|---|
| Production | `main` | GitHub Pages | https://gonor.me |
| Development | `dev` | Cloudflare Pages | https://gonorpage-dev.pages.dev |

Cloudflare builds only `dev` (`preview_deployment_setting: "none"`). No other
branch, including `main` or any `feature/*` branch, produces a build, a URL, or
a dashboard row.

The flow is `push -> dev -> PR -> main`. There is exactly one pull request in this model, and it is `dev` -> `main`. Rules:

- **NEVER push commits directly to `main`.** All changes reach production through a pull request. The `main is production` ruleset blocks direct pushes, force-pushes and deletion.
- **A PR into `main` may only come from `dev`.** `.github/workflows/guard-main.yml` fails the check otherwise. Never open `feature/x` -> `main`; that skips the dev environment.
- **Pushing directly to `dev` is allowed and expected.** Do not open a PR into `dev`. Committing to `dev` still requires the user's confirmation under the rule above; it is the PR ceremony that is dropped, not the asking.
- Feature branches are fine to use for an isolated diff, but Cloudflare will not build them. Merge into `dev` and check the dev URL to verify.
- Cloudflare rebuilds https://gonorpage-dev.pages.dev on every push to `dev`, normally within two minutes. That is how work gets verified.
- "Deploy" means: push the work to `dev`, verify it on the dev URL, then open `dev` -> `main` and let the user merge it.
- The dev URL is public to anyone holding the link. Never push anything to `dev` that must stay private.
- The only exception is if the user explicitly says "push to main" in that specific message.
- Cloudflare Pages builds dev through its GitHub App, so there are no Cloudflare secrets in this repo and nothing to configure in Actions. Its build settings live in the Cloudflare dashboard and are mirrored in `docs/DEPLOYMENT.md`; if they change, update that file in the same PR.
- `public/_headers` noindexes everything Cloudflare serves. It is inert on GitHub Pages. Do not "fix" it, and do not move production to Cloudflare without reworking it first.
- Old dev deployments accumulate in the Cloudflare dashboard as history; delete stale ones per `docs/DEPLOYMENT.md` if it gets cluttered.

## Session Start Checklist

At the start of every session, read [`../PORTFOLIO_STATUS_AND_DOMAIN.md`](../PORTFOLIO_STATUS_AND_DOMAIN.md) before proposing or starting any work.
It carries the work queue that used to live in this repo's `to-do.md`: missing blog posts, missing screenshots, broken or placeholder links, the live-app audit, and development status for priority projects.
Update that guide when tasks are completed (check off items, add new ones as discovered).

Before any blog or design work, also read [`docs/future-features.md`](docs/future-features.md).
It holds the open blog UX and accessibility backlog from the Playwright QA pass of 2026-08-02; the bugs listed there are confirmed against file:line evidence, not speculative.
Consult it before touching the blog index, `BlogSearch.tsx` or `BlogPost.astro`, and update it (tick the task list, add findings) as work lands.

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

## Routes That Exist -- Do Not Invent Internal Paths

The site has exactly five route families, each mirrored under `/en/`:

| Route | Example |
|---|---|
| `/` | home, where the project cards live |
| `/about` | `/about/` |
| `/blog/<slug>/` | `/blog/sima/`, `/en/blog/sima/` |
| `/artifacts/<slug>/` | |
| `/notes/<slug>/` | plus `/notes/categoria/<cat>/` |

**There is no `/projects/*` or `/proyectos/*` route, and there never has been.** Project cards render on the home page from `src/data/projects.ts` and carry no per-card `id`, so no anchor targets an individual card either.

This is not a hypothetical. The 2026-08-14 audit found nine links to invented `/projects/<slug>` and `/proyectos/<slug>` paths across four posts in both languages, every one a 404 for every visitor since publication. A project slug existing in `projects.ts` does not make it a URL.

To link a project from a post, use one of:

1. Its blog post -- `/blog/<blogSlug>/`, and `/en/blog/<blogSlug>/` from an English post. Prefer this when the project has a post.
2. Its live app or repo -- copy the exact `url` or `repo` string from the card in `projects.ts`; do not retype the host.
3. The card's own destination when it is a document -- several cards point at Drive folders rather than apps.

Language matters: an English post must link `/en/blog/...`, a Spanish post `/blog/...`. Getting this wrong silently switches the reader's language.

Before adding any internal link, confirm the target builds: after `npm run build`, `ls dist/<path>/index.html`. `/notes/*` is a real route family but is excluded from the sitemap, so absence from `sitemap-0.xml` is not proof a path is invalid -- check `dist/`.

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

5. **Verify**: run `npm run build` from the project root. The new post should appear in the blog index, its category page, and LatestPostCard.

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
- **`rounded-xl` (6px)** — page-level CTAs and cards (e.g. the "Ver todos los artefactos" button, the search input, project cards). Signals "primary surface or action for the page".
- **`rounded-lg` (5px)** — reserved for the home hero's primary CTAs only. Do not introduce new uses; if adding a new button, pick one of the first two.

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
- CV LaTeX sources go in cv/ -- see [`cv/AGENTS.md`](cv/AGENTS.md)

## CV (`cv/`)

The LaTeX CV lives in this repo so its wording and `src/data/projects.ts` stay in sync: when a project card's description changes, the matching CV bullet should follow, and vice versa. Read [`cv/AGENTS.md`](cv/AGENTS.md) before editing anything under `cv/` -- it carries the narrative rules, ATS constraints, and the skill-integrity rule (never claim a skill no project backs).

**Only sources are tracked.** This repo is public, so `.gitignore` excludes compiled PDFs, job postings, application emails, exam proofs, and employer-specific variants. That material stays in the private `GonorAndres/claude-job` repo, which is also where employer-specific tailoring is done. Check the diff before committing anything under `cv/`.

Build with `cd cv && ./build.sh <file.tex>` (or `--all <cycle-dir>`). Target: 1 page, 0 overfull boxes. `cv/` is inert to the Astro build -- nothing there reaches `dist/`.

The public CV PDF is served from the Drive permanent link (`16cdRmnzf0drNv9c5848N6ZedgYX9WhwV`) that `src/components/sections/Hero.astro` and `Contact.astro` point at. Building a new PDF does not change the site; updating that Drive file in place does, and it needs the user's explicit approval.


## Portfolio status and domain reference

The shared status, public-link inventory, domain strategy, work queue, and live-app audit are maintained in [`../PORTFOLIO_STATUS_AND_DOMAIN.md`](../PORTFOLIO_STATUS_AND_DOMAIN.md). Read and update that guide instead of maintaining a second copy here.

## Capability planning

Read [`docs/capability-roadmap.md`](docs/capability-roadmap.md) before proposing skill-gap projects or changing public skill claims. It records the current exploration-stage direction: AI engineering first, with reusable evaluation practices and credible BI and actuarial applications. The posting sample is a prioritization signal, not a project specification. Do not treat candidates in the roadmap as implemented features.
