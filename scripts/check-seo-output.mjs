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

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const errors = [];

for (const file of ['404.html', 'robots.txt', 'sitemap-index.xml', '_headers', '_redirects']) {
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
}

if (errors.length) {
  console.error('SEO guard failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`SEO guard passed for ${dist}/`);
