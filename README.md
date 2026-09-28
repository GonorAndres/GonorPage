# gonor.me

Portfolio and blog of Andrés González Ortega: actuarial, data science, data
engineering and quantitative finance projects, plus a bilingual (ES/EN) blog and
a catalogue of notes and interactive artifacts.

Built with Astro 5, Tailwind and React islands. Static output.

## Environments

| Environment | Branch | Host | URL |
|---|---|---|---|
| Production | `main` | GitHub Pages | https://gonor.me |
| Development | `dev` | Cloudflare Pages | https://gonorpage-dev.pages.dev |

Cloudflare builds only `dev`; no other branch produces a preview. Push straight
to `dev` and Cloudflare rebuilds it automatically. The only pull request in
this model is `dev` → `main`, and it is the only way into production: direct
pushes to `main` are blocked by a repository ruleset, and a CI check rejects
PRs into `main` from any branch other than `dev`.

The dev URL is public to anyone who has it, and noindexed so it stays out of
search results.

**Read [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) before deploying or changing
anything about how the site is built.**

## Local development

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static build into dist/
npm run preview      # serve dist/ locally
```

Analytics are disabled on localhost and on Cloudflare; they run only in
production.

## Repository structure

```
src/
  pages/          Astro routes; /en/* mirrors the Spanish default locale
  layouts/        BaseLayout and page shells
  components/     ui/ (React islands) and sections/ (Astro sections)
  content/blog/   Blog posts: es/<slug>.md and en/<slug>.md, same filename
  data/           projects, notes, skills, education, categories
  i18n/           es.ts and en.ts translation tables
  styles/         global.css
public/
  docs/           PDFs offered for download
  screenshots/    project thumbnails and gallery images
  artifacts/      self-contained interactive HTML artifacts
  _headers        Cloudflare-only: keeps dev out of search indexes
docs/             deployment, planning and reference documents
scripts/          OG image and thumbnail generation
.github/workflows/
  deploy.yml      production build, test gate and GitHub Pages publish
  guard-main.yml  enforces dev as the only source branch for main
```

## Conventions

Content, writing and data-layer conventions (blog filename parity between
languages, project card style, note metadata, category colours, button radii)
are documented in [`AGENTS.md`](AGENTS.md). Interactive HTML artifacts follow
the contract in [`ARTIFACTS.md`](ARTIFACTS.md).

The current exploration-stage [capability roadmap](docs/capability-roadmap.md)
records how portfolio evidence, reliable AI and decision-quality data work will
be assessed before new projects are started.
