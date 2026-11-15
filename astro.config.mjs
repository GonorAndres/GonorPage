import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { remarkInternalLinks } from './src/lib/remark-internal-links.mjs';

const SITE = 'https://gonor.me';

// Paths that 301 somewhere else, or that have no page. They must not appear
// as a sitemap <loc> or as an hreflang target.
const SITEMAP_SKIP = /^\/(?:en\/)?(?:notes|proyectos)(?:\/|$)/;
const MISSING_EN_PAGES = new Set([
  '/en/artifacts/greedy-node/',
  '/en/artifacts/yuminari-bow/',
]);
// One HTML file serves both languages (the toggle does not change the URL).
const BILINGUAL_ARTIFACTS = new Set([
  '/artifacts/greedy-node/',
  '/artifacts/yuminari-bow/',
]);

function shouldSkipSitemap(url) {
  try {
    const path = new URL(url).pathname;
    return SITEMAP_SKIP.test(path) || MISSING_EN_PAGES.has(path);
  } catch {
    return false;
  }
}

// Last commit date of the repo, used as <lastmod> for pages that are not blog
// posts (home, about, blog index, artifacts). Falls back to build time.
function repoLastCommit() {
  try {
    return execSync('git log -1 --format=%cI', { encoding: 'utf8' }).trim();
  } catch {
    return new Date().toISOString();
  }
}
const REPO_LASTMOD = repoLastCommit();

// <lastmod> for a blog post: `lastModified` if present, else `date`, read from
// the post's frontmatter so the sitemap reflects real edits, not build time.
function blogLastmod(pathname) {
  const m = pathname.match(/^\/(en\/)?blog\/([^/]+)\/$/);
  if (!m) return null;
  const lang = m[1] ? 'en' : 'es';
  const file = `src/content/blog/${lang}/${m[2]}.md`;
  if (!existsSync(file)) return null;
  const fm = readFileSync(file, 'utf8').split('---')[1] ?? '';
  const pick = (k) => fm.match(new RegExp(`^${k}:\\s*"?(\\d{4}-\\d{2}-\\d{2})"?`, 'm'))?.[1];
  return pick('lastModified') ?? pick('date') ?? null;
}

export default defineConfig({
  site: 'https://gonor.me',
  integrations: [
    tailwind(),
    mdx(),
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es', en: 'en' },
      },
      // Static HTML artifacts live under public/ and are not Astro pages, so
      // the integration cannot discover them on its own. Do not add an /en/
      // copy: those URLs 404. Both languages are the same document.
      customPages: [
        `${SITE}/artifacts/greedy-node/`,
        `${SITE}/artifacts/yuminari-bow/`,
      ],
      filter: (page) => !shouldSkipSitemap(page),
      serialize(item) {
        const pathname = new URL(item.url).pathname;
        if (shouldSkipSitemap(item.url)) return undefined;
        item.lastmod = blogLastmod(pathname) ?? REPO_LASTMOD;
        if (BILINGUAL_ARTIFACTS.has(pathname)) {
          // hreflang only to this URL. /en/artifacts/<folder>/ and ?lang=en
          // are not separate pages.
          item.links = ['es', 'en', 'x-default'].map((lang) => ({ url: item.url, lang }));
          return item;
        }
        if (item.links?.length) {
          item.links = item.links.filter((link) => !shouldSkipSitemap(link.url));
          const es = item.links.find((l) => l.lang === 'es');
          if (es && !item.links.some((l) => l.lang === 'x-default')) {
            item.links.push({ url: es.url, lang: 'x-default' });
          }
          if (item.links.length < 2) delete item.links;
        }
        return item;
      },
    }),
  ],
  output: 'static',
  // Local-only: lets `astro dev`/`astro preview` be reached through the exe.dev
  // HTTPS proxy (https://<vm>.exe.xyz:<port>/). Vite rejects unknown Host
  // headers otherwise. Astro feeds this to both servers, so it must live here
  // and not under `vite.preview`. No effect on the Cloudflare Pages builds.
  server: {
    allowedHosts: ['.exe.xyz'],
  },
  markdown: {
    remarkPlugins: [remarkInternalLinks, remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'github-light',
    },
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Legacy /notes/* URLs redirect to /artifacts/* after the 2026-04 rename.
  redirects: {
    '/notes/': '/artifacts/',
    '/notes/[slug]': '/artifacts/[slug]',
    '/notes/categoria/[cat]': '/artifacts/categoria/[cat]',
    '/en/notes/': '/en/artifacts/',
    '/en/notes/[slug]': '/en/artifacts/[slug]',
    '/en/notes/categoria/[cat]': '/en/artifacts/categoria/[cat]',
    // Old project paths Google still requests. Final URLs are the blog posts.
    '/proyectos/flight-analytics': '/blog/flight-analytics-pg-bq/',
    '/proyectos/b-tree-explorer': '/blog/b-trees-optimization/',
    '/en/proyectos/flight-analytics': '/en/blog/flight-analytics-pg-bq/',
    '/en/proyectos/b-tree-explorer': '/en/blog/b-trees-optimization/',
  },
});
