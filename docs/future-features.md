# Blog UX and accessibility backlog

## Current pass: 2026-09-12

The user authorized a redesign of the blog views and a generated conceptual hero for every
article. Source changes now cover the ES/EN index and category pages, `BlogSearch.tsx`,
`BlogPost.astro`, post metadata, and image preparation. There are 24 shared image briefs and
48 localized post entries. **All 24 second-round diagrams pass visual review; six distinct visual
families now vary the medium by article type while sharing the consulting palette. Stable hero and
thumbnail dimensions and bilingual metadata match the manifest.** The 99-page build and all 25
Playwright tests pass, including responsive layout, controls, image availability, and social
metadata. Desktop and mobile previews were inspected locally. The first-round assets remain
recoverable under `public/blog-illustrations/v1/`. Commit and publication remain pending user
approval; the broader accessibility audit remains open as described below.

The article summary keeps an accessible `Resumen`/`Summary` label for assistive technology, while
the visible “En breve” meta-title has been removed. The summary is now presented as a complete
bordered panel instead of a single left rule.

| Backlog item | Current state |
|---|---|
| BUG 3: search/sort focus | Resolved in source: visible navy focus rings and borders, stronger icons, and accessible control names in `BlogSearch.tsx`. |
| BUG 5: missing DA image | Resolved in source: the nonexistent `data-analyst-portafolio.png` body image was removed from both posts; generated hero metadata replaces it. The finished replacement hero passes visual and browser checks. |
| BUG 6: justified blurbs | Resolved in source: descriptions and index subtitles explicitly use `text-left`. |
| IMP 1: description clamp | Resolved in source: blog rows use `line-clamp-3`; full descriptions remain available for search and metadata. |
| BUG 2: contrast | Partial: changed blog views use the navy text ladder, category hue moves to a small dot, and the off-palette ficha link is corrected. This does not close the historical corpus-wide audit or verify contrast in every state. |
| BUG 4: touch targets | Partial: search/sort, row titles, post back-links, and mobile category/ficha/related links have minimum heights. Some links retain `md:min-h-0`; global `Header.astro` and `Footer.astro` were not fixed in this pass. |
| IMP 2: scan layout | Updated image/text rows use one stretched title link and a non-interactive reading cue. Mobile categories scroll horizontally; controls remain above results. The earlier special lead-card proposal is not implemented. |
| IMP 4: illustrations | Complete: 24 article-specific diagrams use six differentiated visual families, with shared ES/EN assets, reviewed hero/thumb crops, and matching metadata. |

See [blog illustration workflow](blog-illustrations.md) and [prompts and metadata](blog-illustrations.json).
The measurements, line references, proposed snippets, and decision questions below are the
**2026-08-02 historical baseline** unless an item carries a newer status. They are not fresh
measurements of the redesigned views; do not reapply old snippets over the current components.

## Original audit

Origin: a Playwright QA pass run on 2026-08-02 over the blog at 1280x900 and 390x844, against
`npx astro preview` serving the production build. The conclusion was that **post detail pages are
strong** (reading time, "En breve" summary, ficha sidebar, sticky related rail all render and work)
and that **the index is where readers are lost**: 23 typographically identical rows, 617px of chrome
before the first headline on a phone, and every de-emphasized token below the WCAG AA contrast floor.

Everything below was investigated file by file and then re-verified independently. Line references
are from the tree at commit `2d88033` on branch `dev`. Where the verifier corrected an investigation,
the corrected value is what appears here; debunked references were removed rather than repeated.

Three facts recorded during that audit:

1. `npx astro build` printed **97 page(s) built** and `dist/` held **131 `.html` files** on 2026-08-02.
   The "85 pages" figure in `CLAUDE.md` ("How to Add a Blog Post", step 5) is stale. Do not treat 85
   as the build gate.
2. **`npx astro check` cannot run here.** `package.json` has no `@astrojs/check` and no `typescript`
   dependency; scripts are only `dev`, `build`, `preview`, `astro`, `og`, `thumbs`. Consequence:
   TypeScript mistakes in `.astro` frontmatter and in the `BlogSearch` props contract will **not**
   fail `astro build`, because esbuild strips the types. Any change to the `Labels` or `PostData`
   interfaces must be checked by reading all four call sites, not by trusting the build.
3. `src/components/ui/BlogPostPreview.astro` has **zero importers** (`grep -rn BlogPostPreview src/`
   returns no matches at all, not even a self-reference). It is dead code and is the only remaining
   consumer of `blog.readMore` besides `BlogSearch.tsx`.

---

## Measured baseline

ES blog index (`/blog/`), 23 post rows, measured in Chromium against the production build.

| Metric | 1280x900 | 390x844 |
|---|---|---|
| Document height | 7,628 px | 10,835 px (12.8 screens for 23 links) |
| Chrome before first post | first `<article>` top at 407 px | first title top at 617.25 px (73% of the viewport) |
| Cards fully above the fold | 1 | 0 |
| `<article>` height spread | 234 to 375 px (141 px) | 334 to 540 px (206 px) |
| Description lines per card | 3 to 8 (113 lines total) | 4 to 12 (170 lines total) |
| Max inter-word stretch (justified) | 13.69 px against a 3.94 px natural space (3.48x) | n/a, `main p` left-aligns below 640 px |

Mobile chrome breakdown, absolute tops at 390x844: header plus section padding 0 to 109, `h1` 109
(31.5 px), subtitle 152.5 (72 px, 3 lines), category nav 248.5 (112 px, four 28 px rows), search
425.5 (42 px), sort 479.5 (42 px), result count 545.5 (15 px), first `<article>` 568.5.

Contrast ladder for `#1B2A4A` at alpha over cream `#EDE6DD`. Numerator is fixed at 0.848201, so the
break-even for the 4.5:1 AA floor is **67%**; `/70` is the minimum on Tailwind's default scale.

| Alpha | Ratio | Alpha | Ratio |
|---|---|---|---|
| /45 | 2.530 | /67 | 4.505 |
| /50 | 2.862 | /70 | 4.904 |
| /55 | 3.253 | /75 | 5.666 |
| /60 | 3.714 | /85 | 7.597 |
| /65 | 4.259 | /100 | 11.488 |

Palette hues used as text on cream: amber `#D4A574` 1.798, terracotta `#C17654` 2.833 (4.054 on
navy), sage `#7A8B6F` 2.950, steel `#5B7B9A` 3.575, navy `#1B2A4A` 11.488, off-palette `#39c` 2.582.
On the search input fill (`#FFF8F0`/70 composited): `/30` 1.820, `/40` 2.296, `/55` 3.374, `/70` 5.191.

Touch targets at 390x844, against the 44 px minimum in `CLAUDE.md`:

| Control | Height | File |
|---|---|---|
| Category filter rows (x4) | 28 px | `src/pages/blog/index.astro:63,70` |
| Search input | 42 px | `src/components/ui/BlogSearch.tsx:176` |
| Sort select | 42 px | `src/components/ui/BlogSearch.tsx:184` |
| Footer links (x3) | 32 px | `src/components/layout/Footer.astro:26,29,32` |
| Header brand link | 32 px | `src/components/layout/Header.astro:28` |
| Post breadcrumb back-link | 12 px | `src/layouts/BlogPost.astro:182` |
| Post footer back-link | 11 px | `src/layouts/BlogPost.astro:369` |
| EN card title links (2 of 23) | 25 px | `src/components/ui/BlogSearch.tsx:66` |
| "Leer más" CTA | 44 px, passes | `src/components/ui/BlogSearch.tsx:109` |

Corpus figures: 23 ES plus 23 EN posts with matching filenames; 14 of 23 ES posts carry the
`proyectos-y-analisis` category; ES descriptions run 21 to 95 words (avg 53.3, 164 to 571 chars), EN
19 to 84 (avg 48.4, 148 to 560 chars); `public/screenshots/` holds 102 PNGs (11.9 MB) plus a complete
640 px WebP thumbnail set (102 files, 1.44 MB); **zero** of the 46 posts set `heroImage`.

---

## Fix first

Six objective bugs. Each one violates either a stated `CLAUDE.md` rule or a WCAG 2.1 AA threshold.
None of them is a design preference.

### BUG 1. Missing Spanish diacritics in shipped UI labels

**What is wrong.** `CLAUDE.md` ("Writing Standards") makes Spanish diacritics mandatory. Two blog
category display labels and 21 Spanish gallery captions ship without them.

**Evidence.**

- `src/data/categories.ts:15` is `'actuaria-para-todos': 'Actuaria para todos'`; the site spells the
  discipline "Actuaría" everywhere else (`src/pages/blog/index.astro:31`, `src/pages/about.astro:52`).
- `src/data/categories.ts:17` is `'proyectos-y-analisis': 'Proyectos y analisis'`. This is the most
  rendered label on the site: 14 of 23 ES posts, so it appears on every ES blog card
  (`src/components/ui/BlogSearch.tsx:125`), the sidebar filter nav (`src/pages/blog/index.astro:71`),
  the category page `<h1>` and `<title>` (`src/pages/blog/categoria/[cat].astro:53,66`), the post
  category pill (`src/layouts/BlogPost.astro:71,191`), and the structured data.
- Confirmed in built output: `dist/blog/sima/index.html` contains `articleSection":"Proyectos y analisis"`
  and `<meta property="article:section" content="Proyectos y analisis">`;
  `dist/blog/categoria/proyectos-y-analisis/index.html` has `<title>Proyectos y analisis | Blog</title>`.
  Path: `src/layouts/BlogPost.astro:145` to `src/layouts/BaseLayout.astro:72` to
  `src/components/layout/SEOMeta.astro:95,173`.
- Latent second lookup keyed by the display string: `src/components/ui/CategoryBadge.astro:26,28`
  with the fallback at `:51` (`const color = CATEGORY_COLOR[label] ?? SAGE;`). Uncertain how reachable
  this is: its only caller `src/components/ui/BlogPostPreview.astro:27` passes the raw category **key**,
  which hits the key branch at `CategoryBadge.astro:22`, and that component has zero importers. Fix the
  map in the same commit anyway, but the "silent sage fallback" mechanism is doubly latent, not live.
- 21 caption lines in `src/data/projects.ts`, rendered live in the project lightbox at
  `src/components/ui/ProjectsGrid.tsx:201`: lines 297, 299, 300, 301, 303, 304, 305, 306 (LISF agent),
  549 to 557 (actuarial suite, including the `ano` versus `año` case), 918, 920, 922, 923 (teaching APIs).

**The slug is safe.** URL slugs live in a separate array at `src/data/categories.ts:3-9` and are
validated by the Zod enum at `src/content.config.ts:10-16`. Do not touch either, and do not touch the
`category:` frontmatter of the 28 markdown files. `git diff` must show zero changes under `src/content/`.

**Fix.**

```ts
// src/data/categories.ts:15,17
    'actuaria-para-todos': 'Actuaría para todos',
    'fundamentos-actuariales': 'Fundamentos actuariales',
    'proyectos-y-analisis': 'Proyectos y análisis',
```

```astro
<!-- src/components/ui/CategoryBadge.astro:26,28 (same commit) -->
  'Actuaría para todos': SAGE,
  'Fundamentos actuariales': TERRACOTTA,
  'Proyectos y análisis': STEEL,
```

For `src/data/projects.ts`, repair the `es:` half of each caption only; the `en:` strings are already
correct. Keep the escaped `\$` currency markers exactly as they are. Substitutions:
`codigo`→`código`, `Indice`→`Índice`, `articulo(s)`→`artículo(s)`, `Titulos`→`Títulos`,
`tecnicas`→`técnicas`, `constitucion`→`constitución`, `valuacion`→`valuación`, `Version`→`Versión`,
`fraccion`→`fracción`, `disposicion`→`disposición`, `bilingue`→`bilingüe`, `navegacion`→`navegación`,
`danos`→`daños`, `Tarificacion`/`tarificacion`→`Tarificación`/`tarificación`,
`adquisicion`→`adquisición`, `Cotizacion`→`Cotización`, `medicos`→`médicos`,
`Pension`/`pension`→`Pensión`/`pensión`, `calculo`→`cálculo`, `geografica`→`geográfica`,
`ano`→`año`, `modulos`→`módulos`, `inversion`→`inversión`, `correlacion`→`correlación`,
`recuperacion`→`recuperación`, `cesion`→`cesión`, `Documentacion`→`Documentación`,
`parametros`→`parámetros`, `practica`→`práctica`, `Analisis`→`Análisis`, `interes`→`interés`,
`metricas`→`métricas`, `proposito`→`propósito`, `produccion`→`producción`, `Mexico`→`México`,
`hipotetico`→`hipotético`.

Verification (expect zero output):

```bash
grep -rn "Proyectos y analisis\|Actuaria para todos" src/
```

**ES/EN parity.** No EN text changes: `src/data/categories.ts:22,24` already read "Actuarial for
everyone" and "Projects & analysis", and every `en:` caption is correct. But the EN pages read the
same module (`src/pages/en/blog/index.astro:19,27`, `src/pages/en/blog/categoria/[cat].astro:28,36,53,66`)
and `CategoryBadge.astro` holds ES and EN keys in one map, so rebuild and re-check the EN routes.

**Effort.** 35 minutes. **Risk.** Low. The real risks are editing the slug by accident (the build
fails loudly on the Zod enum, so this is caught) and SEO churn: `articleSection` and `article:section`
change value on 14 ES pages. That is a correction, not a regression, but it triggers a re-crawl.

### BUG 2. Blog text below the WCAG 1.4.3 AA contrast floor

**What is wrong.** 26 text instances across 8 blog files sit between 1.80:1 and 4.26:1 on cream. The
failures are not only decoration: the category nav links, the breadcrumb, the ficha sidebar keys and
the footer back-link are all interactive or load-bearing.

**Evidence** (ratio in parentheses, from the ladder table above).

- `src/components/ui/BlogSearch.tsx:58` date `/45` (2.530), `:91` description `/65` (4.259),
  `:99` tags `/40` (2.246), `:176` placeholder `/40` on the input fill (2.296), `:202` result count
  `/45` (2.530), `:214` empty state `/50` (2.862).
- `src/pages/blog/index.astro:58` subtitle `/60` (3.714), `:70` category nav links `/55` (3.253);
  identical at `src/pages/en/blog/index.astro:58,70`.
- `src/pages/blog/categoria/[cat].astro:60` kicker `/45`, `:72` and `:85` nav rows `/55`; identical
  at `src/pages/en/blog/categoria/[cat].astro:60,72,85`.
- `src/layouts/BlogPost.astro:179` breadcrumb `/50`, `:194` and `:199` kicker `/55`, `:223` byline
  `/55`, `:244` heroCaption `/50` (dormant, no post sets `heroImage`), `:271`, `:277`, `:282`, `:289`,
  `:297`, `:318`, `:335` ficha labels and keys `/50`, `:369` footer back-link `/50`.
- `src/layouts/BlogPost.astro:304` uses off-palette `#39c` (2.582). The accessible pattern already
  exists two blocks below at `:347`: navy text with a terracotta dotted underline (11.488).
- `src/pages/blog/visualizaciones-matematicas.astro:19` and the EN twin at `:19`, `text-navy/60` (3.714).
- Already passing, do **not** touch: `BlogPost.astro:217` `/75`, `:256` and `:261` `/85`, `:324` `/75`.

**Fix.** Two-step ladder replacing today's 100/65/45 spread with 100/75/70. Hierarchy stays legible
through size, uppercase and font-family, which already differ.

```
src/components/ui/BlogSearch.tsx
  L58  /45 -> /70     L91  /65 -> /75     L99  /40 -> /70
  L176 placeholder:/40 -> /70             L202 /45 -> /70     L214 /50 -> /75

src/pages/blog/index.astro  and  src/pages/en/blog/index.astro
  L58  /60 -> /75     L70  /55 -> /70

src/pages/blog/categoria/[cat].astro  and  src/pages/en/blog/categoria/[cat].astro
  L60  /45 -> /70     L72  /55 -> /70     L85  /55 -> /70

src/layouts/BlogPost.astro
  L179 /50 -> /70   L194 /55 -> /70   L199 /55 -> /70   L223 /55 -> /70
  L244 /50 -> /70   L271 /50 -> /70   L277 /50 -> /70   L282 /50 -> /70
  L289 /50 -> /70   L297 /50 -> /70   L318 /50 -> /70   L335 /50 -> /70   L369 /50 -> /70

src/pages/blog/visualizaciones-matematicas.astro  and its EN twin
  L19  text-navy/60 -> text-navy/75
```

```astro
<!-- src/layouts/BlogPost.astro:304, drop the off-palette #39c -->
class="inline-block py-1 no-underline border-b border-dotted border-[#C17654] text-[#1B2A4A] hover:text-[#A35E3E] hover:border-[#A35E3E]"
```

Two failures are hue-driven, not opacity-driven, and are **gated on a user decision** (see
"Decisions needed"): the per-card category label (`BlogSearch.tsx:121-124`, mirrored at
`BlogPost.astro:188-189`) and the terracotta "Leer más" CTA (`BlogSearch.tsx:109`). No token bump
fixes either; terracotta fails against cream (2.833) and against navy (4.054).

**ES/EN parity.** `BlogSearch.tsx` and `BlogPost.astro` are shared, so one edit each covers both
languages; editing them twice would be wrong. The four page files are duplicated per language and
must each be edited, at identical line numbers. No copy changes, so no diacritics work here.

**Effort.** 40 minutes. **Risk.** Purely color, no reflow. The airy low-contrast look is deliberate,
so the blog will read visibly denser; review `/blog/` side by side before merging. The same classes
appear 94 times across 24 files site-wide, so the blog will diverge from the rest of the site until
the ladder is rolled out (see IMPROVEMENT 5).

### BUG 3. Focus indicator effectively invisible (WCAG 2.4.7)

**2026-09-12: resolved and browser-checked.** The current controls use navy two-pixel focus rings,
stronger borders and icons, and accessible names. Search, reset, sort, and category navigation pass
in both languages.
The evidence and fix below describe the earlier implementation.

**What is wrong.** Both blog controls remove the UA focus ring and replace it with a ring that is
essentially invisible: `focus:ring-[#C17654]/20` measures 1.226:1 and the focus border
`#C17654`/40 measures 1.471:1. Keyboard users get no perceivable focus state. Related, under 1.4.11:
the resting border `border-[#1B2A4A]/10` is 1.199:1 and the fill is 1.121:1 against cream, so the
controls have no perceivable boundary either.

**Evidence.** `src/components/ui/BlogSearch.tsx:176` and `:184`, both carrying
`focus:outline-none focus:border-[#C17654]/40 focus:ring-1 focus:ring-[#C17654]/20`. Also
`src/components/ui/BlogSearch.tsx:158` and `:191`: the icons are `/30` (1.820 on the fill), and the
sort chevron is the only affordance that the control is a dropdown, since `appearance-none` at `:184`
removes the native arrow.

**Fix.**

```
// BlogSearch.tsx:176 and :184, replace
   focus:outline-none focus:border-[#C17654]/40 focus:ring-1 focus:ring-[#C17654]/20
// with
   focus:outline-none focus:border-[#C17654] focus:ring-2 focus:ring-[#C17654]
// and on both lines
   border-[#1B2A4A]/10 -> border-[#1B2A4A]/30
// icons at :158 and :191
   text-[#1B2A4A]/30 -> text-[#1B2A4A]/55   (3.374 on the input fill, clears the 3:1 bar)
```

**ES/EN parity.** One shared component, both languages covered by one edit.

**Effort.** 10 minutes, folded into BUG 2. **Risk.** The heavier border makes the toolbar visually
weightier than the current design intends; that is the trade-off, confirm it is wanted. Note the repo
uses plain `focus:` everywhere and has **zero** uses of `:focus-visible`; switching idiom is a
site-wide decision, not a blog fix.

### BUG 4. Touch targets below the 44 px minimum

**What is wrong.** `CLAUDE.md` ("Responsive Typography and Mobile UI") mandates 44 px. Nine controls
on `/blog/` are under it (see the baseline table), and the category filter rows are the worst: 28 px
with **zero** gap between adjacent rows, so a mis-tap lands on the neighbouring category.

**Evidence.** `src/pages/blog/index.astro:63,70` and `src/pages/en/blog/index.astro:63,70` (identical
class strings, only the `href` differs); `src/pages/blog/categoria/[cat].astro:72` plus the shared base
string inside the `class:list` array at `:82`, and the same in the EN twin; `BlogSearch.tsx:176,184`
(no min-height, `py-2.5` on a 20 px line box plus 2 px border = 42 px);
`src/components/layout/Footer.astro:26,29,32` (all `block py-1.5 w-fit text-sm`);
`src/components/layout/Header.astro:28`. Worse on post pages: `src/layouts/BlogPost.astro:182` at 12 px
and `:369` at 11 px.

**Not bugs, do not "fix":** the 1 px skip link at `src/layouts/BaseLayout.astro:87-92` is `sr-only` and
un-collapses on focus, which is the correct pattern; the "Leer más" CTA at `BlogSearch.tsx:109` already
carries `min-h-[44px]`; the tag chips at `BlogSearch.tsx:96-103` are `<span>`, not focusable, so the
rule does not apply.

**Fix.**

```astro
<!-- src/pages/blog/index.astro:63,70 and src/pages/en/blog/index.astro:63,70 -->
class="flex justify-between items-center min-h-[44px] md:min-h-0 py-1.5 border-b border-[#1B2A4A]/15 text-[#1B2A4A]/55 hover:text-[#1B2A4A] no-underline transition-colors"

<!-- src/pages/blog/categoria/[cat].astro:72 and the EN twin: same string -->
<!-- src/pages/blog/categoria/[cat].astro:82 and the EN twin, inside class:list -->
'flex justify-between items-center min-h-[44px] md:min-h-0 py-1.5 border-b no-underline transition-colors',
```

```tsx
// src/components/ui/BlogSearch.tsx:176 and :184, add to each className
min-h-[44px]
```

```astro
<!-- src/components/layout/Footer.astro:26,29,32 -->
class="inline-flex items-center min-h-[44px] w-fit text-sm hover:text-amber transition-colors"
```

`md:min-h-0` keeps the 220 px desktop sidebar compact. It is **not** currently emitted in the built
CSS (verified: `.min-h-\[44px\]{min-height:44px}` is present in `dist/_astro/_slug_.CN3yhmEb.css`,
`md:min-h-0` is absent), so after the build, grep `dist/_astro/*.css` for `md\:min-h-0`; a typo would
silently no-op rather than error.

**ES/EN parity.** Four page files in matched pairs at identical line numbers; `git diff --stat` should
show equal line counts for each pair. `BlogSearch.tsx` and `Footer.astro` are shared and take a `lang`
prop, so one edit each.

**Effort.** 35 minutes. **Risk.** Vertical growth: on mobile the category nav goes from 112 px to
176 px and the footer column gains about 36 px, pushing content further below an already crowded fold.
That interacts directly with IMPROVEMENT 1, which is trying to pull the first headline **up**; decide
the two together. The `Footer.astro` swap changes `block` to `inline-flex`, measured widths unchanged
at 56/46/109 px, but eyeball the footer.

### BUG 5. Broken image, live 404 on two published pages

**2026-09-12: resolved and verified.** Both obsolete body-image tags are removed. The posts
now reference their shared generated hero, which passes visual review and availability checks.

**What is wrong.** Both language versions of the data-analyst-portfolio post embed an image file that
does not exist, so readers get a broken-image icon in the middle of the article.

**Evidence.** `src/content/blog/es/data-analyst-portfolio.md:20` and
`src/content/blog/en/data-analyst-portfolio.md:20` both contain
`<img src="/screenshots/data-analyst-portafolio.png" ...>`. Verified: no such file in
`public/screenshots/` (note "portafolio" versus the repo's "portfolio").

**Fix.** Delete line 20 from both files. Do not substitute
`/screenshots/da-gcp-01-cloud-run-services.png`: it is a 1306x324 GCP console strip that crops badly,
and the post is about seven analytics dashboards, not infrastructure. See "Decisions needed".

**ES/EN parity.** Both files, same line, same commit.

**Effort.** 5 minutes. **Risk.** None. This is the one change in this document that could ship alone.

### BUG 6. Card blurbs inherit body justification and produce rivers

**2026-09-12: resolved in source.** `BlogSearch.tsx` descriptions and both index subtitles
explicitly set `text-left`. The old measurement below remains the baseline for browser comparison.

**What is wrong.** `CLAUDE.md` ("Responsive Typography and Mobile UI") reserves justification for
"paragraph text in main content" and excludes "short metadata". A 3 to 8 line blurb inside one of 23
list rows is metadata about a link target, not the main content of `/blog/`. The measured cost is
inter-word gaps up to 13.69 px against a 3.94 px natural space, a 3.48x stretch.

**Evidence.** `src/styles/global.css:72-76` sets `main p { text-align: justify; text-justify:
inter-word; hyphens: auto; }`, which reaches the blurb because `src/layouts/BaseLayout.astro:94`
wraps everything in `<main id="main" class="flex-1">`. `src/components/ui/BlogSearch.tsx:91` sets no
alignment of its own. The site already concedes the point: `src/styles/global.css:78-84` left-aligns
`main p` below 640 px, so the defect exists only from 640 px up.

**Fix.** Add `text-left` to the card blurb (the clamp in IMPROVEMENT 2 is a separate decision):

```tsx
// src/components/ui/BlogSearch.tsx:91
<p className="text-sm text-left text-[#1B2A4A]/75 leading-relaxed max-w-[62ch] mb-3">
```

`.text-left` is **absent from every current `dist/_astro/*.css` file**, so after rebuilding, grep for
`.text-left{` before concluding it works. It will be JIT-generated once the literal appears in
`BlogSearch.tsx`, which is inside the Tailwind content glob (`tailwind.config.mjs:5`). It wins over
`main p` because Tailwind utilities sit in a later `@layer`.

The same objection applies to the sibling paragraph directly above the cards, the index subtitle at
`src/pages/blog/index.astro:58` and the EN twin, at a wider measure. Uncertain whether that one counts
as "main content"; flagged for the user rather than fixed here.

**ES/EN parity.** Shared component, one edit, both languages.

**Effort.** 5 minutes. **Risk.** Rollback is deleting one class. Note the `/75` in the snippet above
folds in the BUG 2 contrast change on the same line; apply them together to avoid the conflict noted
below.

---

## Improvements, ranked by payoff over effort

Judgment calls, not rule violations. Ranked by measured effect divided by effort.

### IMPROVEMENT 1. Clamp card descriptions (largest measured win per minute)

**2026-09-12: implemented in source.** Blog-row descriptions use `line-clamp-3`. The new
image/text layout needs fresh measurements; the percentage improvements below apply to the old layout.

**Payoff.** Card height becomes uniform, which is what actually creates a scannable list. Measured by
injecting `line-clamp-3` live: desktop document height 7,628 to 6,627 px (-13.1%), `<article>` spread
collapses from 141 px to 28 px; mobile 10,835 to 8,537 px (-21.2%), spread from 206 px to 43 px. Every
description settles at exactly 68 px (3 x 22.75 px).

**Why not rewrite the descriptions instead.** The `description` field also feeds `og:description` and
the JSON-LD, and `CLAUDE.md` mandates the three-beat structure. `src/layouts/BlogPost.astro:127-130`
already machine-truncates the meta tag at 157 chars while `:135-137` passes the **full** text as
`structuredDescription`. Shortening the field would degrade the structured data. A CSS clamp changes
neither: the full string stays in the DOM and in the served HTML.

**Does the clamp cut mid-hook?** Measured: at the 548 px desktop measure (71 chars per line), the
entire first sentence fits within 3 lines for 20 of 23 ES posts and 20 of 23 EN posts. The six
exceptions are `es/sima.md` (318-char opening sentence), `en/sima.md` (314),
`es/actuarial-ml-pricing.md` (289, and it is the only sentence), `en/actuarial-ml-pricing.md` (236,
same), `es/credit-graph-topological-risk.md` (241), `en/pension-simulator.md` (222).

**Fix.**

```tsx
// src/components/ui/BlogSearch.tsx:91, combined with BUG 2 and BUG 6 on the same line
<p className="text-sm text-left text-[#1B2A4A]/75 leading-relaxed max-w-[62ch] mb-3 line-clamp-3">
```

`line-clamp-3` needs no plugin (Tailwind 3.4.19, core since 3.3) and is already emitted:
`.line-clamp-3{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3}`
is present in `dist/_astro/_slug_.CN3yhmEb.css`. Six existing in-repo usages, including
`src/components/sections/NotesTeaser.astro:48` and `src/layouts/NoteLayout.astro:214`.

**ES/EN parity.** Structurally guaranteed: one island imported by all four list pages.

**Effort.** 5 minutes on top of BUG 6. **Risk.** Search still matches text that is now visually
clipped (`BlogSearch.tsx:143` filters the full string), so a query can return a card whose match is
invisible; acceptable, but decide it consciously. `line-clamp` switches the paragraph to
`display: -webkit-box` and computes `hyphens: none`; re-check at 320 px, the supported baseline.

### IMPROVEMENT 2. Blog index scan layout: lead post, redundant CTA, mobile control order

**Payoff.** Measured ladder at 390x844: 10,835 baseline, 9,547 after removing the CTA and its trailing
margin, 7,386 after `line-clamp-3`, 6,758 with a typographic lead card, 6,787 after relocating the
mobile controls. Net -37%, and the first headline moves from 617 px to about 452 px.

**Evidence.** The per-card "Leer más" button is fully redundant: `BlogSearch.tsx:53` computes `href`
once and it is used both at `:65` (title anchor) and `:108` (button). Removing the block reclaims
44 px per card, 56 px with the residual `mb-3`, so 1,288 px over 23 cards. No analytics regression:
`BlogSearch.tsx` imports no analytics module; `content_engaged` fires at
`src/layouts/BlogPost.astro:378-382` on the article page, and PostHog `autocapture`
(`src/lib/analytics.ts:18`) simply consolidates the click onto the title anchor.

**Two constraints.** (a) On the EN index, 2 of 23 title links measure only 25 px, so deleting the
44 px button leaves those rows under the minimum; compensate with a stretched link. (b) The lead card
must be suppressed when a query is active or the sort is not `recent`, or the "Lo más reciente"
framing lies. The filter pipeline itself is untouched: `BlogSearch.tsx:136-151` is a pure `useMemo`
consumed at `:208`.

**Fix sketch** (full code in the investigation; the load-bearing parts):

```tsx
// BlogSearch.tsx:57, add `relative` to the row
<article className="relative grid grid-cols-1 sm:grid-cols-[80px_1fr] md:grid-cols-[92px_1fr_140px] ...">

// BlogSearch.tsx:66, stretched link so the whole row is tappable
className="... after:absolute after:inset-0 after:content-['']"

// delete BlogSearch.tsx:106-117 (the CTA block) and reset the trailing margin at :62
<div className="[&>*:last-child]:mb-0">

// gate the lead card
const pristine = query.trim() === '' && sort === 'recent';
const lead = pristine && visible.length > 0 ? visible[0] : null;
const rows = lead ? visible.slice(1) : visible;
```

Rejected after measuring: turning the 4-row category nav into wrapped 44 px chips makes mobile
**worse**, 112 px to 148 px, because the ES labels force three chip rows. Rejected on correctness: CSS
`order:` for the mobile controls (breaks WCAG 2.4.3 focus order) and `<details>` (a media-query-derived
initial state produces a React 19 hydration mismatch under `client:idle`, `src/pages/blog/index.astro:78`).
Duplicated markup gated by `hidden sm:block` / `sm:hidden` is the only option correct pre-hydration.

**ES/EN parity.** Any change to the `Labels` interface breaks all four pages
(`src/pages/blog/index.astro:34-43`, `src/pages/en/blog/index.astro:34-43`,
`src/pages/blog/categoria/[cat].astro:41-50`, `src/pages/en/blog/categoria/[cat].astro:41-50`) and, with
no `astro check`, it breaks them **silently**. New copy needs both locales: "Lo más reciente" and
"Latest". The 44 px finding is EN-only, so re-measure `/en/blog/` specifically.

**Effort.** 95 minutes. **Risk.** The stretched link kills text selection over the card and would
swallow any link later added inside a row; it is safe today only because tags (`:97`) and the category
(`:121`) are `<span>`, so leave a comment saying so. Two `<input type="search">` and two `<select>`
would exist in the DOM, one `display:none` at every breakpoint; verify unique ids and tab order at
390 px. Also note `ClientRouter` at `src/layouts/BaseLayout.astro:78`: `BlogSearch` is `client:idle`,
so query and sort state resets on soft navigation, and the duplicated controls interact with that.

### IMPROVEMENT 3. Reading time on the index cards

**Payoff.** The blog already computes reading time, but only after the visitor has committed to a
click. Adding it to the card puts the cost-of-attention estimate where the decision is made.

**Evidence.** The formula is duplicated verbatim in `src/pages/blog/[...slug].astro:18-20` and
`src/pages/en/blog/[...slug].astro:18-20`, rendered at `src/layouts/BlogPost.astro:237` with the label
hardcoded at `:89` (`read: lang === 'es' ? 'de lectura' : 'read'`). The index pages call the same
`getCollection('blog')`, so `post.body` is already in scope; `src/pages/blog/index.astro:12-22` simply
never reads it. No i18n key exists for the label.

Two traps. The suffix must be "de lectura" / "read", **not** "min de lectura", because the value
already contains the unit; `dist/blog/insurance-claims-dashboard/index.html` reads `10 min de lectura`.
And the ES and EN numbers legitimately differ by up to 3 minutes (that post is 2,040 ES words against
1,453 EN words); that is honest, not a parity break, since each reader sees one language.

**Fix.**

```ts
// src/lib/readingTime.ts (new file, single canonical API, see the conflict list)
export function readingMinutes(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function readingTimeLabel(body: string | undefined, frontmatter?: string): string {
  return frontmatter ?? `${readingMinutes(body)} min`;
}
```

```ts
// src/i18n/es.ts after line 29        // src/i18n/en.ts after line 29
  'blog.readSuffix': 'de lectura',        'blog.readSuffix': 'read',
```

Then add `readingTime: readingTimeLabel(post.body, post.data.readingTime)` to the `postsData` map in
all four list pages, `readingTime?: string` to `PostData` (`BlogSearch.tsx:10-20`), `readSuffix: string`
to `Labels`, and render it beside the CTA row with `items-center` and `text-[#1B2A4A]/70`.

**ES/EN parity.** The key must land in **both** locale files: `t()` is typed `key: keyof typeof es` and
evaluates `translations[lang][key]`, so an ES-only key is a type error plus an `undefined` render on
every EN card. Four page files, not two. Corrected line numbers: the EN category page has `postsData`
at 21-31 and `labels` at 41-50, identical to the ES file.

**Effort.** 35 minutes. **Risk.** The index will publish the same markup-inflated counts the post page
already publishes (`es/data-engineering-platform.md` reads 12 min against about 9 min of actual prose
once code fences, HTML tags and table rows are stripped). Nothing regresses, but the error becomes
visible on a higher-traffic surface. Skip `LatestPostCard.astro` for now: it is a mixed feed and only
blog items have a body, so two of the three visible cards would show nothing.

### IMPROVEMENT 4. Generated concept diagrams for every post

**2026-09-12 direction replaces the original screenshot-reuse proposal.** The user requested
consulting-report-style generated diagrams matched to each article's meaning. There are now
24 briefs, one per English slug, shared across the 24 ES and 24 EN posts. The former proposal
to select 12 screenshots, add gradient fallbacks, and reuse project-gallery captions is superseded.
Existing evidence screenshots may remain in article bodies where they support the narrative.

**Implemented in source:** `heroImage`, localized `heroAlt`, and localized `heroCaption` in all
48 posts; `heroAlt` in the content schema and both detail-page callers; image metadata in all
four index/category mappers; responsive thumbnail/hero sources in `BlogSearch.tsx` and
`BlogPost.astro`; fixed image dimensions and eager loading for the priority image; hero image
and alt passed to the SEO layout. Titles are the only interactive target in each stretched-link
row, so adding a second image link would break that interaction model.

**Verified locally:** all 24 second-round diagrams generated with the native image tool, optimized
heroes and thumbnails (4.2 MiB for the active set; first-round assets archived under `v1/`),
pixel-to-caption review, 48 matching localized metadata entries, 99-page build, and 25 passing
browser tests. Six visual families now cover quantitative models, systems, evidence, algorithms,
regulation, and mathematical intuition. Risk Analyst alt wording was aligned with the visible
subject. No material visual findings remain.

The generation record is [blog-illustrations.json](blog-illustrations.json); dimensions, asset paths,
optimization, and review rules are documented in [blog-illustrations.md](blog-illustrations.md).
Do not run the screenshot thumbnail generator for this collection.

### IMPROVEMENT 5. Roll the contrast ladder out site-wide

**Payoff.** BUG 2 fixes 8 blog files. The same low-opacity classes appear **94 times across 24 files**
(`grep -rn "text-\[#1B2A4A\]/[0-6][0-9]\?\b\|text-navy/[0-6][0-9]\?\b" src/ --include=*.astro
--include=*.tsx | wc -l`), including `src/pages/artifacts/index.astro`,
`src/components/ui/NotesSearch.tsx`, `src/components/sections/Hero.astro`,
`src/components/ui/ProjectsGrid.tsx` and the 404 page. Until it is rolled out, the blog reads darker
than the rest of the site.

`src/components/ui/NotesSearch.tsx` is `BlogSearch`'s structural twin and carries every identical
defect: `:76` date `/45`, `:117` tags `/40`, `:135` the same terracotta CTA, `:206` input with
`focus:outline-none` plus a `/20` ring, `:232` count `/45`, `:244` empty state `/50`. If IMPROVEMENT 1
or 2 changes the blog card, `/artifacts/` silently diverges.

**Effort.** Uncertain, roughly 90 to 120 minutes for the remaining 16 files. **Risk.** Wide visual
change; do it as its own commit so it can be reverted independently.

### IMPROVEMENT 6. Delete dead code and dead i18n keys

- `src/components/ui/BlogPostPreview.astro`: zero importers, and it is the only thing keeping
  `blog.readMore` alive besides `BlogSearch.tsx:115` and the sole caller of the fragile
  display-label map in `CategoryBadge.astro`.
- `'blog.categories'` (`src/i18n/es.ts:23`, `src/i18n/en.ts:23`) and `'blog.allYears'`
  (`src/i18n/es.ts:26`, `src/i18n/en.ts:26`): zero consumers outside the i18n files.
- Six orphan screenshots: `data-engineering-bq-{details,features,model,scoring}.png` and
  `data-engineering-streaming.png` appear to predate the current `de-*` gallery; `insurance-claims.png`
  should be adopted by IMPROVEMENT 4 rather than deleted.

**ES/EN parity.** Key deletions must be symmetric; never delete one locale only.

**Effort.** 15 minutes. **Risk.** Low, but confirm the grep before deleting anything.

---

## Historical decision questions and remaining scope

The user-authorized 2026-09-12 pass resolves the image direction and permits the blog-view changes
recorded above. These earlier questions describe competing proposals; they do not require asking
again before completing that authorized work. For future backlog changes, review only the unresolved
choices that actually apply. The original investigations often targeted the same lines, so do not
combine their snippets mechanically.

**Conflicts on the same lines**

1. `src/components/ui/BlogSearch.tsx:106-117`, the "Leer más" CTA, is claimed three ways:
   leave it exactly as is (it already meets 44 px), delete the whole block as redundant
   (IMPROVEMENT 2), or restyle it to navy text with a navy hover fill (BUG 2, since terracotta cannot
   reach 4.5:1 in either direction). Mutually exclusive. **Decide first**, because two other items
   depend on the answer.
2. `BlogSearch.tsx:91`, the card description, is edited by three items: `/65` to `/75` (BUG 2),
   `text-left` (BUG 6), `line-clamp-3` (IMPROVEMENT 1). The combined line is written out once in
   IMPROVEMENT 1; use that and do not apply the three separately.
3. `BlogSearch.tsx:62`, the content-cell `<div>`, has two incompatible replacements: a flex row
   wrapping a thumbnail `<picture>` (IMPROVEMENT 4) versus `[&>*:last-child]:mb-0` (IMPROVEMENT 2).
4. `BlogSearch.tsx:57`, the row `<article>`: IMPROVEMENT 4 needs `items-baseline` to become
   `items-start`; IMPROVEMENT 2 adds `relative` and keeps `items-baseline`. Applying 2 after 4
   reintroduces the exact date drift 4 identified.
5. `BlogSearch.tsx:66`: IMPROVEMENT 2's stretched link is justified by "nothing else inside the row is
   a link", which stops being true the moment IMPROVEMENT 4 adds an `<a>` around the thumbnail.
6. `BlogSearch.tsx:176` and `:184`: BUG 2 and BUG 3 change their colors and focus ring, BUG 4 adds
   `min-h-[44px]`, IMPROVEMENT 2 extracts both into a `Controls` subcomponent rendered **twice**.
   After the extraction those line numbers no longer exist and every other fix must be applied inside
   the extracted component, where a miss means a half-fixed control.
7. `src/lib/readingTime.ts` is created as a new file by two investigations with incompatible APIs:
   `readingMinutes(body)` plus `readingTimeLabel(body, frontmatter)` versus `readingTime(body, override)`.
   **Use the first**, as written in IMPROVEMENT 3.
8. The `Labels` interface and the labels object in all four pages: one item adds `readSuffix`, another
   removes `readMore` and adds `lead`. Both rewrite the same four objects, and with no `astro check` a
   partial application ships as a silent type error.
9. `PostData` (`BlogSearch.tsx:10-20`) gains `heroImage` from one item and `readingTime` from two,
   populated by two different helper signatures (see 7).
10. `src/data/categories.ts:15,17`: three investigations propose the same two-line fix, one of them
    citing the wrong lines (16 and 18) and two of them omitting the companion edit to
    `CategoryBadge.astro:26,28`. Use BUG 1 as written.
11. `src/data/projects.ts` captions: one investigation fixes **21** lines, another fixes 9 of the same
    lines with slightly different Spanish wording. Applying the 9-line version first leaves 12 lines
    still violating the rule. Use the 21-line set in BUG 1.

**Open questions**

12. `'Actuaría para todos'` (the discipline) or `'Actuaria para todos'` (a female actuary)? The EN
    label "Actuarial for everyone" points to the discipline, which is what BUG 1 assumes.
13. Category label hue: four of the five palette hues cannot reach 4.5:1 on cream as text (amber 1.798,
    terracotta 2.833, sage 2.950, steel 3.575). `CLAUDE.md` forbids inventing hues, so: (a) keep the
    hue but move it off the text onto a dot or a left rule and set the label to navy/70, (b) darken the
    five palette values globally, which affects `ProjectsGrid`, badges and category pages, or
    (c) accept and document the exception.
14. Should the 44 px minimum apply at desktop widths, or only below `md`? BUG 4 proposes
    `md:min-h-0`. Dropping it grows the desktop sidebar by 64 px.
15. Even scoped to mobile, the category nav grows 112 px to 176 px, pushing the first post further
    down, while IMPROVEMENT 2 is trying to pull it up. Accept the trade, or restructure the mobile nav?
16. Post-page back-links (12 px and 11 px, worse than anything on the index) in this pass or a separate
    ticket? Same for the header brand link at 32 px, which commit `2d88033` just touched.
17. Clamp at 3 lines everywhere, or `line-clamp-4 sm:line-clamp-3`? A line holds about 71 chars at the
    548 px desktop measure but only about 45 at 390 px, so a flat 3-line clamp bisects the hook for
    roughly half the posts on mobile.
18. Split the six overlong opening sentences (`es/sima.md`, `en/sima.md`, both
    `actuarial-ml-pricing.md`, `es/credit-graph-topological-risk.md`, `en/pension-simulator.md`)? Note
    both `actuarial-ml-pricing.md` files and both `analytics-dashboards.md` files are single-sentence
    descriptions that do not visibly express the mandated three beats, so they may be due for an edit
    regardless.
19. Add a `cardSummary` optional field to `src/content.config.ts` now as a reserved no-op, or leave it
    out until there is a concrete reason to write 46 more bilingual strings?
20. `risk-analyst`: ship the GitHub-repo screenshot as a weak hero, leave the post image-less, or
    produce a real chart first? Same question for `data-analyst-portfolio` after BUG 5.
21. Is the category-tinted gradient block an acceptable permanent fallback for the four SOA study
    guides, or do they want a generated typographic card?
22. `src/layouts/BlogPost.astro:242` sets `alt={heroCaption ?? title}` while also printing
    `heroCaption` in a visible `<figcaption>`, so screen readers hear the sentence twice. Change `alt`
    to `""`, or keep the redundancy?
23. Where do the mobile search and sort controls go: after the lead plus 2 rows (measured), or after
    the lead only? A search box positioned below results is unconventional; is the count line enough of
    a cue, or is a small "Buscar y filtrar" anchor wanted?
24. Delete `src/components/ui/BlogPostPreview.astro` (and then `blog.readMore` from both locales), or
    keep it?
25. Should `CLAUDE.md`'s "Responsive Typography and Mobile UI" section gain an explicit sentence
    excluding list-row and card blurbs from justification, so the next component does not reintroduce
    BUG 6?
26. Do the `src/data/projects.ts` caption fixes ride in the same commit as the two category labels, or
    go out as their own commit? Same surface (the rule), different surface (the project lightbox).

---

## Gaps not yet investigated

None of the seven investigations covered these. They are observations with evidence, not costed work.

1. **No RSS or Atom feed exists.** `src/lib/feed.ts` is an internal helper consumed only by
   `src/components/sections/Hero.astro:93,96`; there is no `src/pages/rss.xml.*` route and
   `find src public -iname '*rss*'` returns nothing. 46 published posts, zero syndication.
2. **Blog index and category pages emit no collection-level structured data.**
   `dist/blog/index.html` contains only `WebSite`, `Person`, `WebPage` and `CollegeOrUniversity`: no
   `Blog`, `CollectionPage`, `ItemList` or `BreadcrumbList`.
3. **The post-page breadcrumb omits the category level.**
   `src/layouts/BlogPost.astro:148-174` goes Inicio to Blog to title, even though `:186-192` renders a
   visible link to `/blog/categoria/<cat>/`.
4. **Category pages ship the generic site-wide meta description.**
   `src/pages/blog/categoria/[cat].astro:53` and the EN twin pass only `title`, so
   `src/layouts/BaseLayout.astro:44-46` substitutes the boilerplate (verified in
   `dist/blog/categoria/proyectos-y-analisis/index.html`). The `<title>` also lacks the site name,
   unlike `src/pages/blog/index.astro:46`.
5. **`src/components/ui/NotesSearch.tsx` is BlogSearch's untouched twin** (see IMPROVEMENT 5).
6. **`src/components/ui/DiscoverPostCard.astro` was never examined.** It is `LatestPostCard`'s twin,
   rendered at `Hero.astro:96`, with the same failing date color at `:49` (`text-navy/50`, 3.03:1), and
   it shuffles its pool with `Math.random()` at `:15-18`, freezing a random "discover" set per build.
7. **No dark mode and no print styles.** `prefers-color-scheme`, `dark:` and `@media print` return zero
   hits across `src/` (only `prefers-reduced-motion` at `src/styles/global.css:101` and
   `src/layouts/BaseLayout.astro:107`). Every color recommendation here is implicitly light-only.
8. **Zero uses of `:focus-visible`** anywhere in the repo; every control uses plain `focus:`.
9. **`CLAUDE.md`'s Button Radii Convention quotes wrong pixel values.** It documents
   `rounded-xl` = 12 px and `rounded-lg` = 8 px, but `tailwind.config.mjs:21-29` overrides
   `borderRadius` to DEFAULT 3 px, sm 2 px, md 4 px, lg 5 px, xl 6 px. Any radius decision made from
   `CLAUDE.md` is made on false numbers.
10. **View transitions are never considered.** `ClientRouter` is enabled at
    `src/layouts/BaseLayout.astro:78`; `BlogSearch` is `client:idle`, so its query and sort state resets
    on every soft navigation. `BlogPost.astro:396` already rebinds on `astro:page-load`, so the pattern
    is known to be needed.
11. **The in-body `<img>` tags have no width, height, `loading` attribute or WebP source.**
    `src/content/blog/{es,en}/pension-simulator.md:75`, `regulation-agent-rag.md:80` and
    `cartera-autos.md:73` serve unoptimized full-resolution PNGs above the fold on six live pages.
12. **The index subtitle is itself justified** (`src/pages/blog/index.astro:58` and the EN twin), at a
    wider measure than the card blurbs BUG 6 addresses.

---

## How to verify a fix

```bash
npx astro build                    # zero errors; record the actual page count for the current corpus
npx astro preview --host 0.0.0.0   # port 4321
# ... run the checks below ...
pkill -f "astro preview"
```

`npx astro check` is **not** available in this repo (no `@astrojs/check`, no `typescript`), so type
errors in `.astro` frontmatter and in the `BlogSearch` props contract will not fail the build. Read all
four call sites manually after any `Labels` or `PostData` change.

With Playwright MCP, at **1280x900** and **390x844**, load `/blog/`, `/en/blog/`,
`/blog/categoria/proyectos-y-analisis/`, `/en/blog/categoria/proyectos-y-analisis/` and one post in each
language, then:

- **Contrast**: `browser_evaluate` with `getComputedStyle` over every text node, asserting each computed
  color reaches 4.5:1 against `rgb(237,230,221)`. This is the method that produced the baseline numbers,
  so before and after are directly comparable.
- **Page height**: `document.documentElement.scrollHeight`. Compare against the baseline table.
- **Touch targets**: scan `a, button, input, select, textarea, [role=button], [tabindex]` for
  `getBoundingClientRect().height < 44`. Expect zero results other than the 1 px skip link.
- **Overflow**: `documentElement.scrollWidth === clientWidth` at 320 px, 390 px and 1280 px.
- **Built CSS**: after any new arbitrary utility, grep `dist/_astro/*.css` for it. `.text-left{` and
  `md\:min-h-0` are both absent from the current build, so their appearance is a real check.
- **Structured data**: `grep -o 'articleSection":"[^"]*"' dist/blog/sima/index.html` after BUG 1.

---

## Task list

**Fix first (bugs)**

- [x] BUG 1a. Spanish category accents corrected in `src/data/categories.ts` and `src/components/ui/CategoryBadge.astro`; category navigation verified (2026-09-12).
- [ ] BUG 1b. 21 caption lines in `src/data/projects.ts` (297, 299 to 301, 303 to 306, 549 to 557, 918, 920, 922, 923)
- [ ] BUG 2. Partial: source contrast changes in the redesigned blog views; remaining historical targets and final rendered-state audit still open.
- [x] BUG 3. Visible search/sort focus rings, borders, icons, and accessible names implemented in `BlogSearch.tsx` (2026-09-12; browser checks pass).
- [ ] BUG 4. Partial: changed blog controls and mobile links have minimum heights; desktop exceptions and global header/footer targets remain open.
- [x] BUG 5. Removed the missing `data-analyst-portafolio.png` image from both posts (2026-09-12); replacement hero passes visual and browser checks.
- [x] BUG 6. Explicit `text-left` on blog descriptions and index subtitles (2026-09-12).

**Improvements**

- [x] IMP 1. `line-clamp-3` on blog-row descriptions (2026-09-12).
- [x] IMP 2. Image/text rows, one stretched title link, and horizontal mobile categories verified on desktop and mobile. The original special lead-card proposal is superseded by the authorized redesign.
- [ ] IMP 3. Reading time on cards: `src/lib/readingTime.ts`, `blog.readSuffix` in both locales, 4 pages
- [x] IMP 4a. New 24-diagram direction, shared ES/EN metadata, responsive index/detail layout, and SEO image wiring implemented.
- [x] IMP 4b. All 24 generated heroes and thumbnails complete; visual review, localized metadata, dimensions, build, and browser checks pass (2026-09-12).
- [ ] IMP 5. Contrast ladder rolled out to the remaining 16 files (94 instances total)
- [ ] IMP 6. Delete `BlogPostPreview.astro`, `blog.categories`, `blog.allYears`, the 5 stale screenshots

**Before implementing**

- [ ] Review unresolved historical conflicts only when implementing the remaining backlog; current authorized pass is recorded above.
- [ ] Reassess remaining historical questions for future work; image direction and current blog layout no longer await a new decision.
- [ ] Replace stale fixed build counts in `CLAUDE.md` with the current verified corpus count; 97 was the August baseline.
- [ ] Correct the Button Radii Convention pixel values in `CLAUDE.md` against `tailwind.config.mjs:21-29`

**Gaps to scope**

- [ ] RSS/Atom feed
- [ ] Collection-level JSON-LD on index and category pages
- [ ] Category level in the post breadcrumb
- [ ] Per-category meta description and title
- [ ] `NotesSearch.tsx` parity with whatever `BlogSearch.tsx` becomes
- [ ] `DiscoverPostCard.astro`: contrast at `:49` and the per-build `Math.random()` at `:15-18`
- [ ] Dark mode and print styles decision
- [ ] `:focus-visible` idiom, site-wide
- [ ] `ClientRouter` state reset on soft navigation
- [ ] In-body `<img>` optimization on the 6 pages that embed screenshots
