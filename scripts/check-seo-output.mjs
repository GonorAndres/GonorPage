// Pre-deploy SEO guard for the built site in dist/.
//
// Production and dev are both Cloudflare Pages projects served from the same
// build, so one wrong line in _headers deindexes gonor.me. This script makes
// that a CI failure instead of something noticed weeks later in Search Console.
//
// Fails when:
//   - _headers sets X-Robots-Tag under a rule that is not an absolute
//     https:// URL (a path-only rule such as `/*` also matches gonor.me);
//   - robots.txt disallows the whole site;
//   - a file search engines or Cloudflare rely on is missing (404.html: without
//     it Pages serves the home page with 200 for every unknown path).
//
// Run with: node scripts/check-seo-output.mjs [distDir]   (default: dist)

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const errors = [];

for (const file of ['404.html', 'robots.txt', 'sitemap-index.xml', 'sitemap-0.xml', '_headers', '_redirects', 'favicon.ico', 'apple-touch-icon.png', 'favicon.svg']) {
  if (!existsSync(join(dist, file))) errors.push(`missing ${dist}/${file}`);
}

if (existsSync(join(dist, '_headers'))) {
  let rule = null;
  readFileSync(join(dist, '_headers'), 'utf8').split('\n').forEach((line, i) => {
    if (!line.trim() || line.trimStart().startsWith('#')) return;
    if (!/^\s/.test(line)) {
      rule = line.trim();
      return;
    }
    if (/^\s*x-robots-tag\s*:/i.test(line) && !rule?.startsWith('https://')) {
      errors.push(`_headers:${i + 1}: X-Robots-Tag under "${rule}" would also apply to gonor.me; scope it to an https://...pages.dev rule`);
    }
  });
}

if (existsSync(join(dist, 'robots.txt'))) {
  const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
  if (/^\s*disallow:\s*\/\s*$/im.test(robots)) errors.push('robots.txt disallows the whole site');
  if (!/^Sitemap:\s+https:\/\/gonor\.me\/sitemap-index\.xml\s*$/m.test(robots)) {
    errors.push('robots.txt is missing Sitemap: https://gonor.me/sitemap-index.xml');
  }
}

if (existsSync(join(dist, '_headers'))) {
  const headers = readFileSync(join(dist, '_headers'), 'utf8');
  if (!/Strict-Transport-Security:\s*max-age=15552000\s*$/m.test(headers)) {
    errors.push('_headers is missing Strict-Transport-Security: max-age=15552000');
  }
  if (/Strict-Transport-Security:[^\n]*preload/i.test(headers)) {
    errors.push('_headers HSTS must not include preload');
  }
}

const redirectSources = [];
if (existsSync(join(dist, '_redirects'))) {
  for (const line of readFileSync(join(dist, '_redirects'), 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [src] = trimmed.split(/\s+/);
    if (src) redirectSources.push(src);
  }
  for (const required of ['/sitemap.xml', '/proyectos/flight-analytics', '/proyectos/b-tree-explorer']) {
    if (!redirectSources.includes(required)) errors.push(`_redirects is missing ${required}`);
  }
}

function decodeAttr(value) {
  return value
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function pageFile(pathname) {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (path === '/') return join(dist, 'index.html');
  return join(dist, path.slice(1), 'index.html');
}

function isRedirectPath(pathname) {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return redirectSources.some((src) => {
    if (src.endsWith('*')) return path.startsWith(src.slice(0, -1)) || pathname.startsWith(src.slice(0, -1));
    const normalized = src.endsWith('/') ? src : `${src}/`;
    return path === normalized || pathname === src;
  });
}

if (existsSync(join(dist, 'sitemap-0.xml'))) {
  const xml = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
  const blocks = xml.split('<url>').slice(1);
  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) {
      errors.push('sitemap url is missing <loc>');
      continue;
    }
    if (!/<lastmod>[^<]+<\/lastmod>/.test(block)) errors.push(`sitemap ${loc} is missing lastmod`);
    let pathname;
    try {
      pathname = new URL(loc).pathname;
    } catch {
      errors.push(`sitemap loc is not a URL: ${loc}`);
      continue;
    }
    if (isRedirectPath(pathname)) errors.push(`sitemap lists a redirect: ${loc}`);
    else if (!existsSync(pageFile(pathname))) errors.push(`sitemap lists a missing page: ${loc}`);
    for (const href of block.matchAll(/href="([^"]+)"/g)) {
      let target;
      try {
        target = new URL(href[1]).pathname;
      } catch {
        errors.push(`sitemap hreflang is not a URL: ${href[1]}`);
        continue;
      }
      if (target.includes('lang=')) errors.push(`sitemap hreflang uses a query URL: ${href[1]}`);
      if (isRedirectPath(target) || !existsSync(pageFile(target))) {
        errors.push(`sitemap hreflang points at a missing page: ${href[1]}`);
      }
    }
  }
}

function walkHtml(dir, out = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(p, out);
    else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const titles = new Map();
const descriptions = new Map();
if (existsSync(dist)) {
  for (const file of walkHtml(dist)) {
    const html = readFileSync(file, 'utf8');
    const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
    const title = decodeAttr(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '').trim();
    const description = decodeAttr(html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1] ?? '').trim();
    const rel = relative(dist, file);
    if (!noindex) {
      if (!title) errors.push(`${rel} is missing a title`);
      else if (title.length > 60) errors.push(`${rel} title is ${title.length} chars: ${title}`);
      else if (titles.has(title)) errors.push(`${rel} reuses the title of ${titles.get(title)}: ${title}`);
      else titles.set(title, rel);
      if (!description) errors.push(`${rel} is missing a meta description`);
      else if (description.length > 160) errors.push(`${rel} description is ${description.length} chars`);
      else if (description.length < 140) errors.push(`${rel} description is ${description.length} chars (under 140)`);
      else if (descriptions.has(description)) errors.push(`${rel} reuses the description of ${descriptions.get(description)}`);
      else descriptions.set(description, rel);
    }
    for (const tag of html.matchAll(/<link\b[^>]*rel="alternate"[^>]*>/g)) {
      const href = tag[0].match(/href="([^"]+)"/)?.[1];
      if (!href || !href.startsWith('https://gonor.me')) continue;
      const target = new URL(href).pathname;
      if (href.includes('?') || isRedirectPath(target) || !existsSync(pageFile(target))) {
        errors.push(`${rel} hreflang points at ${href}`);
      }
    }
    // Astro's meta-refresh stubs for /notes and /proyectos are not the pages
    // visitors get (Cloudflare _redirects answers first). Don't treat their
    // generated markup as content links.
    if (/http-equiv="refresh"/i.test(html)) continue;
    for (const href of html.matchAll(/href="(\/(?:en\/)?(?:blog|artifacts|notes|proyectos)[^"]*)"/g)) {
      const raw = href[1];
      const pathOnly = raw.split(/[?#]/)[0];
      if (/\.[a-z0-9]+$/i.test(pathOnly)) continue;
      if (!pathOnly.endsWith('/')) errors.push(`${rel} internal link has no trailing slash: ${raw}`);
      else if (isRedirectPath(pathOnly)) errors.push(`${rel} links to a redirect: ${raw}`);
      else if (!existsSync(pageFile(pathOnly))) errors.push(`${rel} links to a missing page: ${raw}`);
    }
  }
}

if (errors.length) {
  console.error('SEO guard failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`SEO guard passed for ${dist}/`);
