# Blog illustrations

Each article has one conceptual diagram shared by its Spanish and English versions. The
2026-09-12 pass covers all 24 slugs and 48 localized posts. All 24 diagrams were generated with
the native tool, reviewed against their articles, and optimized into 24 heroes and 24 thumbnails
(1.22 MiB combined). Metadata and dimensions match the manifest; the 99-page Astro build and
all 25 Playwright tests pass. Desktop and mobile index/detail previews were inspected locally.
Commit and publication are pending user approval.

## Meaning and style

Use a restrained consulting-report exhibit: warm cream `#EDE6DD`, navy `#1B2A4A`, muted
terracotta, sage, and steel-blue accents, precise relationships, and generous whitespace.
There are no embedded words, letters, numbers, logos, or legends. Titles and explanations
remain accessible HTML and can be localized without generating a second image.

These are conceptual explanations, not measured charts, real dashboard screenshots, or
empirical results. A shape, relative area, arrow, or grouping must not imply a finding that
the article's evidence does not support. Measured research figures retain their own sources
and belong in the article separately.

## Generation record

[blog-illustrations.json](blog-illustrations.json) stores the shared style prompt, the style
reference, each article's concept and mechanism, pitfalls to avoid, localized alt/caption
text, and output paths. Use the reference for visual consistency; choose the actual subject
and relationships from the article's brief.

Generate with the native `image_gen.imagegen` tool and keep its original output available
while reviewing variants. That tool does not expose an explicit model selector; do not
attribute a specific model version to an asset without evidence. A prompt record describes
intent, not a guarantee of identical future output.

## Prepare an asset

From the repository root, pass the generated image file and the article's English slug:

```bash
node scripts/prepare-blog-illustration.mjs /path/to/generated-image.png article-slug
```

The script reads the native output and writes optimized WebP assets:

| Asset | Location | Dimensions |
|---|---|---|
| Hero | `public/blog-illustrations/<slug>.webp` | 1536 × 864 |
| Thumbnail | `public/blog-illustrations/thumbs/<slug>.webp` | 640 × 360 |

Both outputs preserve the complete diagram. The optimizer uses `fit: 'contain'` and cream
padding when needed, rather than cropping away arrows or relationships. It does not mutate
the input. Re-running it for a slug replaces that slug's two optimized files.

## Metadata and review

Both posts point `heroImage` at `/blog-illustrations/<slug>.webp`. Each language has its own
`heroAlt` describing what is visible and `heroCaption` explaining the relationship. Keep
these fields synchronized with the JSON record. Alt text and captions must match the final
pixels, not merely the requested prompt; revise the wording or regenerate when they diverge.

Inspect every hero and thumbnail for legible relationships, plausible geometry, unwanted
text, misleading quantitative implications, and lost detail. Then verify file coverage,
ES/EN metadata, dimensions, the site build, and responsive index/category/detail rendering.
Do not infer completed visual QA from an image file or frontmatter entry alone.
