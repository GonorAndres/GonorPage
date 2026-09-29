import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const SITE = 'https://gonor.me';

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
      // the integration cannot discover them on its own.
      customPages: [
        `${SITE}/artifacts/greedy-node/`,
        `${SITE}/artifacts/yuminari-bow/`,
      ],
      serialize(item) {
        const pathname = new URL(item.url).pathname;
        // Legacy /notes/* redirect pages are noindex; keep them out.
        if (/^\/(en\/)?notes\//.test(pathname)) return undefined;
        item.lastmod = blogLastmod(pathname) ?? REPO_LASTMOD;
        // x-default: point search engines at the Spanish (default locale) URL.
        if (item.links?.length) {
          const es = item.links.find((l) => l.lang === 'es');
          if (es && !item.links.some((l) => l.lang === 'x-default')) {
            item.links.push({ url: es.url, lang: 'x-default' });
          }
        }
        return item;
      },
    }),
  ],
  output: 'static',
  // Local-only: lets `astro dev`/`astro preview` be reached through the exe.dev
  // HTTPS proxy (https://<vm>.exe.xyz:<port>/). Vite rejects unknown Host
  // headers otherwise. Astro feeds this to both servers, so it must live here
  // and not under `vite.preview`. No effect on the GitHub Pages or Cloudflare builds.
  server: {
    allowedHosts: ['.exe.xyz'],
  },
  markdown: {
    remarkPlugins: [remarkMath],
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
  },
});
