import { test, expect } from '@playwright/test';

test.describe('Deploy Gate -- blocks deploy if any fail', () => {

  // --- Core pages load ---

  test('homepage loads (ES)', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('header')).toBeVisible();
  });

  test('homepage loads (EN)', async ({ page }) => {
    const response = await page.goto('/en/');
    expect(response?.status()).toBe(200);
  });

  test('blog loads', async ({ page }) => {
    const response = await page.goto('/blog/');
    expect(response?.status()).toBe(200);
  });

  test('notes loads', async ({ page }) => {
    const response = await page.goto('/notes/');
    expect(response?.status()).toBe(200);
  });

  // --- SEO & meta ---

  test('SEO meta tags present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /.+/);
  });

  test('JSON-LD structured data valid', async ({ page }) => {
    await page.goto('/');
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toBeTruthy();
    const parsed = JSON.parse(jsonLd!);
    expect(parsed['@context']).toBe('https://schema.org');
  });

  // --- i18n ---

  test('default language is Spanish', async ({ page }) => {
    await page.goto('/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('es');
  });

  test('English page has correct lang', async ({ page }) => {
    await page.goto('/en/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('en');
  });

  test('og:locale correct for each language', async ({ page }) => {
    await page.goto('/');
    const esLocale = await page.locator('meta[property="og:locale"]').getAttribute('content');
    expect(esLocale).toBe('es_MX');

    await page.goto('/en/');
    const enLocale = await page.locator('meta[property="og:locale"]').getAttribute('content');
    expect(enLocale).toBe('en_US');
  });

  // --- Navigation ---

  test('navigation works between pages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');

    await page.getByRole('link', { name: /blog/i }).first().click();
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(/\/blog\//);
  });

  test('language switcher works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');

    const enLink = page.getByRole('link', { name: 'English' });
    await enLink.click();
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(/\/en\//);
  });

  // --- Assets ---

  test('fonts load', async ({ page, request }) => {
    const r1 = await request.get('/fonts/Inter-Regular.woff2');
    expect(r1.status()).toBe(200);
    const r2 = await request.get('/fonts/Lora-Regular.woff2');
    expect(r2.status()).toBe(200);
  });

  test('no broken images on homepage', async ({ page }) => {
    const failedImages: string[] = [];
    page.on('response', (response) => {
      if (response.request().resourceType() === 'image' && response.status() >= 400) {
        failedImages.push(response.url());
      }
    });
    await page.goto('/');
    await page.waitForLoadState('load');
    expect(failedImages).toHaveLength(0);
  });

  test('no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('load');
    expect(errors).toHaveLength(0);
  });
});

test.describe('Mobile layout', () => {
  test.use({ viewport: { width: 320, height: 720 }, isMobile: true });

  test('menu opens accessibly and the page does not overflow horizontally', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');

    const menuButton = page.getByRole('button', { name: 'Menu' });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-menu')).toHaveAttribute('aria-hidden', 'false');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('body copy is justified', async ({ page }) => {
    await page.goto('/about/');
    const alignment = await page.locator('main p').first().evaluate(
      (element) => getComputedStyle(element).textAlign
    );
    expect(alignment).toBe('justify');
  });

  test('PDF notes provide an in-page preview', async ({ page }) => {
    await page.goto('/artifacts/black-scholes-fra-irs/');
    const preview = page.locator('iframe[title*="Vista previa"]');
    await expect(preview).toHaveAttribute('src', /drive\.google\.com\/file\/d\/.*\/preview/);
  });
});
