import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// ─── helpers ────────────────────────────────────────────────────────────────

async function collectPageInfo(page: Page, label: string) {
  const title = await page.title();
  const url = page.url();

  // broken images
  const brokenImages = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs
      .filter(img => !img.complete || img.naturalWidth === 0)
      .map(img => img.src || img.getAttribute('src') || 'no-src');
  });

  // placeholder / dummy text signals
  const bodyText = await page.evaluate(() => document.body.innerText);
  const placeholderHits: string[] = [];
  const placeholderPatterns = [
    'Lorem ipsum', 'TODO', 'placeholder', 'Coming soon', 'PLACEHOLDER',
    'undefined', 'null', '[object', 'NaN',
  ];
  for (const p of placeholderPatterns) {
    if (bodyText.includes(p)) placeholderHits.push(p);
  }

  // broken links that point to '#'
  const hashLinks = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href="#"]'));
    return anchors.map(a => ({
      text: (a as HTMLAnchorElement).innerText.trim().slice(0, 80),
      parent: (a as HTMLAnchorElement).closest('[data-project]')?.getAttribute('data-project') || 'unknown',
    }));
  });

  return { label, title, url, brokenImages, placeholderHits, hashLinks, bodyTextLength: bodyText.length };
}

// ─── test suite ─────────────────────────────────────────────────────────────

const results: Record<string, any> = {};

test('1. Home page - hero + nav + featured projects', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const info = await collectPageInfo(page, 'Home (ES)');

  // Hero section
  const heroHeading = await page.getByRole('heading', { level: 1 }).first().textContent();
  const heroText = await page.evaluate(() => {
    const hero = document.querySelector('section, [class*="hero"]');
    return hero?.textContent?.trim().slice(0, 300) ?? 'HERO NOT FOUND';
  });

  // Nav links
  const navLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('nav a'));
    return links.map(a => ({
      text: (a as HTMLAnchorElement).innerText.trim(),
      href: (a as HTMLAnchorElement).href,
    })).filter(l => l.text.length > 0);
  });

  // Project cards count
  const projectCards = await page.locator('[class*="project"], article, [data-project]').count();

  // Blog section visible?
  const blogSectionVisible = await page.getByText(/últimas entradas|latest posts/i).isVisible().catch(() => false);

  // Featured projects heading
  const featuredHeading = await page.getByRole('heading', { name: /proyectos|projects/i }).first().textContent().catch(() => 'NOT FOUND');

  results['home'] = {
    ...info,
    heroHeading,
    heroTextSnippet: heroText.slice(0, 200),
    navLinks,
    projectCardsVisible: projectCards,
    blogSectionVisible,
    featuredHeading,
  };

  await page.screenshot({ path: '/tmp/audit-home.png', fullPage: false });

  expect(info.brokenImages.length).toBeLessThan(5); // allow minor
  expect(info.placeholderHits.length).toBe(0);
  expect(heroHeading).toBeTruthy();
});

test('2. Expand full project grid', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Find and click the "Ver todos" button
  const expandBtn = page.getByRole('button', { name: /ver todos|show all|todos los proyectos/i }).first();
  const btnVisible = await expandBtn.isVisible().catch(() => false);

  if (btnVisible) {
    await expandBtn.click();
    await page.waitForTimeout(800);
  }

  const info = await collectPageInfo(page, 'Home - Full Grid');

  // All project cards after expansion
  const allCards = await page.evaluate(() => {
    // Try multiple selectors that might represent project cards
    const cards = Array.from(document.querySelectorAll('article, [class*="card"], [class*="project-card"]'));
    return cards.map(c => {
      const title = c.querySelector('h2, h3, h4')?.textContent?.trim() ?? '';
      const links = Array.from(c.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim().slice(0, 40),
        href: a.href,
        isHash: a.href.endsWith('#') || a.getAttribute('href') === '#',
      }));
      const hasDashedBorder = c.className.includes('dashed') || c.className.includes('border-dashed');
      return { title, links, hasDashedBorder };
    }).filter(c => c.title.length > 0);
  });

  // Specifically look for eruption-forecasting and micro-insurance
  const inDevProjects = allCards.filter(c =>
    c.title.toLowerCase().includes('eruption') ||
    c.title.toLowerCase().includes('micro') ||
    c.title.toLowerCase().includes('volcán') ||
    c.title.toLowerCase().includes('seguros')
  );

  // Hash links in project cards
  const hashLinksInCards = allCards.flatMap(c =>
    c.links.filter(l => l.isHash).map(l => ({ project: c.title, linkText: l.text }))
  );

  results['fullGrid'] = {
    ...info,
    expandBtnFound: btnVisible,
    totalCards: allCards.length,
    cards: allCards.slice(0, 20), // cap for readability
    inDevProjects,
    hashLinksInCards,
  };

  await page.screenshot({ path: '/tmp/audit-full-grid.png', fullPage: true });

  expect(allCards.length).toBeGreaterThan(3);
});

test('3. Blog page (ES)', async ({ page }) => {
  await page.goto('/blog/');
  await page.waitForLoadState('networkidle');

  const info = await collectPageInfo(page, 'Blog (ES)');

  const posts = await page.evaluate(() => {
    const articles = Array.from(document.querySelectorAll('article, [class*="post"], [class*="blog"]'));
    return articles.map(a => {
      const title = a.querySelector('h2, h3, h4, h1')?.textContent?.trim() ?? '';
      const desc = a.querySelector('p')?.textContent?.trim().slice(0, 120) ?? '';
      const date = a.querySelector('time, [class*="date"]')?.textContent?.trim() ?? '';
      const category = a.querySelector('[class*="category"], [class*="tag"], [class*="badge"]')?.textContent?.trim() ?? '';
      const link = a.querySelector('a')?.href ?? '';
      return { title, desc, date, category, link };
    }).filter(p => p.title.length > 0);
  });

  // Check for category filters
  const categoryFilters = await page.evaluate(() => {
    const filters = Array.from(document.querySelectorAll('[class*="filter"], nav a, [role="tab"]'));
    return filters.map(f => f.textContent?.trim() ?? '').filter(t => t.length > 0 && t.length < 60);
  });

  results['blog'] = {
    ...info,
    postCount: posts.length,
    posts,
    categoryFilters,
  };

  await page.screenshot({ path: '/tmp/audit-blog.png', fullPage: false });

  expect(posts.length).toBeGreaterThan(0);
});

test('4. Artifacts page', async ({ page }) => {
  await page.goto('/artifacts/');
  await page.waitForLoadState('networkidle');

  const info = await collectPageInfo(page, 'Artifacts');

  const artifactCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('article, [class*="card"], [class*="artifact"]'));
    return cards.map(c => {
      const title = c.querySelector('h2, h3, h4, h1')?.textContent?.trim() ?? '';
      const desc = c.querySelector('p')?.textContent?.trim().slice(0, 100) ?? '';
      const links = Array.from(c.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim().slice(0, 40),
        href: a.href,
      }));
      const hasImage = !!c.querySelector('img');
      return { title, desc, links, hasImage };
    }).filter(c => c.title.length > 0);
  });

  // Check page heading
  const pageHeading = await page.getByRole('heading').first().textContent().catch(() => 'NOT FOUND');

  // Look for search input
  const hasSearch = await page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="search"]').isVisible().catch(() => false);

  results['artifacts'] = {
    ...info,
    pageHeading,
    artifactCount: artifactCards.length,
    artifactCards,
    hasSearch,
  };

  await page.screenshot({ path: '/tmp/audit-artifacts.png', fullPage: false });

  expect(artifactCards.length).toBeGreaterThanOrEqual(0); // page may be empty, just check it loads
});

test('5. English home page', async ({ page }) => {
  await page.goto('/en/');
  await page.waitForLoadState('networkidle');

  const info = await collectPageInfo(page, 'Home (EN)');

  const heroHeading = await page.getByRole('heading', { level: 1 }).first().textContent().catch(() => 'NOT FOUND');

  // Verify English content (not Spanish)
  const hasEnglishNav = await page.getByRole('navigation').textContent().then(t => {
    const lower = t.toLowerCase();
    return lower.includes('projects') || lower.includes('blog') || lower.includes('notes') || lower.includes('artifacts');
  }).catch(() => false);

  const navLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('nav a'));
    return links.map(a => ({
      text: (a as HTMLAnchorElement).innerText.trim(),
      href: (a as HTMLAnchorElement).href,
    })).filter(l => l.text.length > 0);
  });

  // Check for language switcher
  const langSwitcher = await page.evaluate(() => {
    const el = document.querySelector('[class*="lang"], [aria-label*="language"], [aria-label*="idioma"]');
    return el?.textContent?.trim() ?? 'NOT FOUND';
  });

  results['homeEN'] = {
    ...info,
    heroHeading,
    hasEnglishNav,
    navLinks,
    langSwitcher,
  };

  await page.screenshot({ path: '/tmp/audit-home-en.png', fullPage: false });

  expect(info.brokenImages.length).toBeLessThan(5);
  expect(heroHeading).toBeTruthy();
});

test('6. English blog page', async ({ page }) => {
  await page.goto('/en/blog/');
  await page.waitForLoadState('networkidle');

  const info = await collectPageInfo(page, 'Blog (EN)');

  const posts = await page.evaluate(() => {
    const articles = Array.from(document.querySelectorAll('article, [class*="post"], [class*="blog"]'));
    return articles.map(a => {
      const title = a.querySelector('h2, h3, h4, h1')?.textContent?.trim() ?? '';
      const desc = a.querySelector('p')?.textContent?.trim().slice(0, 120) ?? '';
      const date = a.querySelector('time, [class*="date"]')?.textContent?.trim() ?? '';
      const link = a.querySelector('a')?.href ?? '';
      return { title, desc, date, link };
    }).filter(p => p.title.length > 0);
  });

  const pageHeading = await page.getByRole('heading').first().textContent().catch(() => 'NOT FOUND');

  // Are posts in English? spot check
  const firstPostTitle = posts[0]?.title ?? '';
  const bodySnippet = (await page.evaluate(() => document.body.innerText)).slice(0, 500);

  results['blogEN'] = {
    ...info,
    pageHeading,
    postCount: posts.length,
    posts,
    bodySnippet,
  };

  await page.screenshot({ path: '/tmp/audit-blog-en.png', fullPage: false });

  expect(posts.length).toBeGreaterThan(0);
});

// ─── write JSON results after all tests ─────────────────────────────────────

test.afterAll(async () => {
  const outPath = '/tmp/audit-results.json';
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Audit results written to ${outPath}`);
});
