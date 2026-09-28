# CV -- LaTeX source

Source for the **public CV** of Andrés González Ortega, versioned alongside the portfolio site
so the CV wording and `src/data/projects.ts` stay in sync.

```bash
./build.sh cv-andres-gonzalez.tex
```

Target: **1 page, 0 overfull boxes.**

## Only one CV lives here

`cv-andres-gonzalez.tex` is the single document in this folder. It is the public CV, published
at `gonor.me/docs/cv-andres-gonzalez.pdf`, and it is edited **in place** each cycle rather than
forked into a new file per month. The revision month lives in the `\placetopright` date.

**Role variants are not kept here.** Versions tailored to a specific position (data scientist,
insurance, risk, data analyst, finance, insurtech, ...) are written for a particular application
and are **not shareable**, so they live in the private `GonorAndres/claude-job` repo along with
job postings, cover letters and application emails.

This repo is public, and `.gitignore` enforces the rule as an allowlist: everything under `cv/`
is ignored except `cv-andres-gonzalez.tex`, `qr_portfolio.png`, `build.sh`, `AGENTS.md`, `CLAUDE.md` and
`README.md`. Do not weaken it to add "just one" variant.

## Requirements

The document is `article` + `paracol` and **needs pdflatex** (run twice, for `lastpage`).
Tectonic cannot build it -- Tectonic is XeTeX-only.

```bash
sudo apt-get install -y texlive-latex-recommended texlive-latex-extra \
                        texlive-fonts-recommended texlive-fonts-extra texlive-lang-spanish
```

`fontawesome5` and `sourcesanspro` come from `texlive-fonts-extra`.

## Publishing

Building a PDF does not change the site. To publish, copy the built PDF over
`../public/docs/cv-andres-gonzalez.pdf` and deploy -- that tracked file is what `Hero.astro`
and `Contact.astro` link to.

See `AGENTS.md` for the full editorial rules: narrative, style, ATS, skill integrity.
