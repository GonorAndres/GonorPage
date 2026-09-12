import { readdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const locales = [
  { lang: 'es', prefix: '', category: 'Proyectos y análisis', nav: 'Categorías del blog' },
  { lang: 'en', prefix: '/en', category: 'Projects & analysis', nav: 'Blog categories' },
] as const;

for (const locale of locales) {
  const indexPath = `${locale.prefix}/blog/`;
  const slugs = readdirSync(new URL(`../src/content/blog/${locale.lang}/`, import.meta.url))
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));

  test(`${locale.lang}: illustrated articles remain searchable, sortable and reachable by category`, async ({ page }) => {
    await page.goto(indexPath);
    const articles = page.locator('main article');
    await expect(articles).toHaveCount(slugs.length);

    const search = page.getByRole('searchbox');
    await expect(search).toHaveAccessibleName(/.+/);
    await search.fill('Neo4j');
    await expect(articles).toHaveCount(1);
    await expect(articles.getByRole('link', { name: /CreditGraph/ })).toBeVisible();
    await expect(page.getByRole('status')).toContainText('1');

    await search.fill('no-matching-article-8675309');
    await expect(articles).toHaveCount(0);
    await expect(page.getByRole('status')).toContainText('0');
    await search.fill('');
    await expect(articles).toHaveCount(slugs.length);

    const sort = page.getByRole('combobox');
    await expect(sort).toHaveAccessibleName(/.+/);
    await sort.selectOption('oldest');
    await expect.poll(async () => {
      const dates = await articles.locator('time').evaluateAll((times) =>
        times.map((time) => time.getAttribute('datetime')!),
      );
      return dates.join() === [...dates].sort().join();
    }).toBe(true);
    const oldest = await articles.locator('time').evaluateAll((times) =>
      times.map((time) => time.getAttribute('datetime')!),
    );
    await sort.selectOption('recent');
    await expect.poll(() => articles.locator('time').first().getAttribute('datetime'))
      .toBe(oldest.at(-1));
    await sort.selectOption('title');
    await expect.poll(async () => {
      const titles = await articles.getByRole('heading', { level: 2 }).allTextContents();
      return titles.join() === [...titles].sort((a, b) => a.localeCompare(b)).join();
    }).toBe(true);

    await page.getByRole('navigation', { name: locale.nav })
      .getByRole('link', { name: new RegExp(locale.category) }).click();
    await expect(page).toHaveURL(`${indexPath}categoria/proyectos-y-analisis/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(locale.category);
    await expect(page.getByRole('navigation', { name: locale.nav }).locator('[aria-current="page"]'))
      .toContainText(locale.category);
    expect(await articles.count()).toBeGreaterThan(0);
    expect(await articles.count()).toBeLessThan(slugs.length);
    await expect(articles.first().getByRole('img')).toBeVisible();
    await articles.first().getByRole('link').click();
    await expect(page).toHaveURL(new RegExp(`^https?://[^/]+${indexPath}[^/]+/$`));
    await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
  });

  for (const width of [320, 1280]) {
    test(`${locale.lang}: illustrations fit the index and article at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(indexPath);
      const firstArticle = page.locator('main article').first();
      const thumbnail = firstArticle.getByRole('img');
      await expect(thumbnail).toBeVisible();
      await expect.poll(() => thumbnail.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
        .toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      const illustrationBox = await thumbnail.boundingBox();
      const headingBox = await firstArticle.getByRole('heading', { level: 2 }).boundingBox();
      expect(illustrationBox).not.toBeNull();
      expect(headingBox).not.toBeNull();
      if (width < 768) {
        expect(headingBox!.y).toBeGreaterThanOrEqual(illustrationBox!.y + illustrationBox!.height);
        for (const control of await page.locator('main input, main select, main nav a').all()) {
          expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
        }
      } else {
        expect(headingBox!.x).toBeGreaterThan(illustrationBox!.x + illustrationBox!.width);
      }

      await page.goto(`${indexPath}credit-graph-topological-risk/`);
      const hero = page.locator('main article figure img[src^="/blog-illustrations/"]');
      await expect(hero).toBeVisible();
      await expect(hero).toHaveAttribute('alt', /\S+/);
      await expect(hero).toHaveAttribute('loading', 'eager');
      await expect(hero).toHaveAttribute('fetchpriority', 'high');
      await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
        .toBe(true);
      const dimensions = await hero.evaluate((img: HTMLImageElement) => ({
        width: Number(img.getAttribute('width')),
        height: Number(img.getAttribute('height')),
        currentSrc: img.currentSrc,
      }));
      expect(dimensions.width).toBeGreaterThan(0);
      expect(dimensions.height).toBeGreaterThan(0);
      expect(dimensions.width / dimensions.height).toBeCloseTo(16 / 9, 2);
      expect(dimensions.currentSrc).toContain('/blog-illustrations/');
      await expect(hero.locator('..').locator('source')).toHaveAttribute('srcset', /thumbs\/.*640w,.*1536w/);
      const caption = page.locator('main article figure figcaption').first();
      await expect(caption).toBeVisible();
      expect((await caption.textContent())!.trim()).not.toBe(await hero.getAttribute('alt'));
      const heroBox = await hero.boundingBox();
      const titleBox = await page.getByRole('heading', { level: 1 }).boundingBox();
      const summaryBox = await page.locator('main article section').first().boundingBox();
      expect(heroBox!.y).toBeGreaterThan(titleBox!.y + titleBox!.height);
      expect(heroBox!.y + heroBox!.height).toBeLessThan(summaryBox!.y);
      const summary = page.locator('main article section.lede');
      await expect(summary).toHaveAttribute('aria-label', locale.lang === 'es' ? 'Resumen' : 'Summary');
      await expect(summary.locator('h2')).toHaveCount(0);
      expect(await summary.evaluate((el) => {
        const style = getComputedStyle(el);
        return [style.borderTopStyle, style.borderRightStyle, style.borderBottomStyle, style.borderLeftStyle];
      })).toEqual(['solid', 'solid', 'solid', 'solid']);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }

  test(`${locale.lang}: every published post serves its own illustration and social preview`, async ({ page, request }) => {
    test.setTimeout(60000);
    for (const slug of slugs) {
      await test.step(slug, async () => {
        const path = `${indexPath}${slug}/`;
        const response = await request.get(path);
        expect(response.status(), path).toBe(200);
        const markup = await response.text();
        const data = await page.evaluate((html) => {
          const document = new DOMParser().parseFromString(html, 'text/html');
          const image = document.querySelector('main article figure img[src^="/blog-illustrations/"]');
          return {
            lang: document.documentElement.lang,
            hero: image?.getAttribute('src'),
            alt: image?.getAttribute('alt'),
            caption: document.querySelector('main article figure figcaption')?.textContent?.trim(),
            srcset: image?.parentElement?.querySelector('source')?.getAttribute('srcset'),
            social: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
            socialAlt: document.querySelector('meta[property="og:image:alt"]')?.getAttribute('content'),
          };
        }, markup);
        const heroPath = `/blog-illustrations/${slug}.webp`;
        const thumbnailPath = `/blog-illustrations/thumbs/${slug}.webp`;
        expect(data.lang).toBe(locale.lang);
        expect(data.hero).toBe(heroPath);
        expect(data.alt?.trim()).toBeTruthy();
        expect(data.caption).toBeTruthy();
        expect(data.caption).not.toBe(data.alt);
        expect(data.srcset).toContain(thumbnailPath);
        expect(data.social).toBe(`https://gonor.me${heroPath}`);
        expect(data.socialAlt).toBe(data.alt);
        for (const assetPath of [heroPath, thumbnailPath]) {
          const asset = await request.get(assetPath);
          expect(asset.status(), assetPath).toBe(200);
          expect(asset.headers()['content-type'], assetPath).toContain('image/webp');
          expect((await asset.body()).length, assetPath).toBeGreaterThan(0);
        }
      });
    }
  });
}
