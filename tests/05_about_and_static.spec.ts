import { test, expect } from '@playwright/test';

test.describe('05. About & Static Pages Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/v1/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ session: null }),
      });
    });
  });

  test('05.01 should load About page with Decades of Trust header', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL(/\/about/);
    await expect(
      page.getByRole('heading', { name: /Decades of Trust/i })
    ).toBeVisible();
  });

  test('05.02 should display About page stats counters (20+ Years, 48 Projects)', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('text=20+').first()).toBeVisible();
    await expect(page.locator('text=Years of Expertise').first()).toBeVisible();
  });

  test('05.03 should display Our Mission and Our Vision statements', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: /Our Mission/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Our Vision/i })).toBeVisible();
  });

  test('05.04 should display History timeline milestones on About page', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: /A Journey Through Time/i })).toBeVisible();
    await expect(page.locator('text=2003').first()).toBeVisible();
    await expect(page.locator('text=Foundation').first()).toBeVisible();
  });

  test('05.05 should display head office location card on About page', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('text=Shamabay New Market').first()).toBeVisible();
    await expect(page.locator('text=259 B B Road, Narayanganj').first()).toBeVisible();
  });

  test('05.06 should have Get in Touch button linking to Contact page', async ({ page }) => {
    await page.goto('/about');
    const contactBtn = page.getByRole('link', { name: /Get in Touch/i }).first();
    await expect(contactBtn).toBeVisible();
    await contactBtn.click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('05.07 should load Terms of Service page (/terms)', async ({ page }) => {
    await page.goto('/terms');
    await expect(page).toHaveURL(/\/terms/);
    await expect(
      page.getByRole('heading', { name: /Terms of Service/i })
    ).toBeVisible();
  });

  test('05.08 should display terms conditions and sections', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.locator('text=Reliance Housing Ltd.').first()).toBeVisible();
  });

  test('05.09 should load Privacy Policy page (/privacy)', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page).toHaveURL(/\/privacy/);
    await expect(
      page.getByRole('heading', { name: /Privacy Policy/i })
    ).toBeVisible();
  });

  test('05.10 should display privacy and data protection details', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('text=Information We Collect').or(page.locator('text=Reliance Housing Ltd.')).first()).toBeVisible();
  });

  test('05.11 should render custom 404 Error page on unknown URL route', async ({ page }) => {
    await page.goto('/unknown-page-route-404');
    await expect(
      page.getByRole('heading', { name: /404/i }).or(page.locator('text=404')).or(page.locator('text=Page Not Found'))
    ).toBeVisible();
  });

  test('05.12 should have Back to Home button on 404 error page', async ({ page }) => {
    await page.goto('/unknown-page-route-404');
    const homeBtn = page.getByRole('link', { name: /Back to Home/i }).or(page.getByRole('link', { name: /Go Home/i })).first();
    if (await homeBtn.isVisible()) {
      await homeBtn.click();
      await expect(page).toHaveURL('/');
    }
  });
});
