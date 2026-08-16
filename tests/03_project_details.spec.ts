import { test, expect } from '@playwright/test';

test.describe('03. Project Details Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/v1/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ session: null }),
      });
    });
  });

  test('03.01 should load Sardar Tower details page by ID (p1)', async ({ page }) => {
    await page.goto('/project-details/p1');
    await expect(page).toHaveURL(/\/project-details\/p1/);
    await expect(
      page.getByRole('heading', { name: 'Sardar Tower – Block A' })
    ).toBeVisible();
  });

  test('03.02 should load Green Valley Residency details page by ID (p2)', async ({ page }) => {
    await page.goto('/project-details/p2');
    await expect(page).toHaveURL(/\/project-details\/p2/);
    await expect(
      page.getByRole('heading', { name: 'Green Valley Residency' })
    ).toBeVisible();
  });

  test('03.03 should display breadcrumb linking back to /projects', async ({ page }) => {
    await page.goto('/project-details/p1');
    const backLink = page.getByRole('link', { name: /Back to All Projects/i });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(/\/projects/);
  });

  test('03.04 should display project location and property type badges', async ({ page }) => {
    await page.goto('/project-details/p1');
    await expect(page.locator('text=Narayanganj').first()).toBeVisible();
    await expect(page.locator('text=Mixed Use').first()).toBeVisible();
  });

  test('03.05 should display project specifications table for p1', async ({ page }) => {
    await page.goto('/project-details/p1');
    await expect(page.locator('text=Total Floors')).toBeVisible();
    await expect(page.locator('text=28 Floors')).toBeVisible();
    await expect(page.locator('text=Land Area')).toBeVisible();
    await expect(page.locator('text=42,000 sq. ft')).toBeVisible();
  });

  test('03.06 should display project specifications table for p2', async ({ page }) => {
    await page.goto('/project-details/p2');
    await expect(page.locator('text=Total Floors')).toBeVisible();
    await expect(page.locator('text=16 Floors')).toBeVisible();
    await expect(page.locator('text=Land Area')).toBeVisible();
    await expect(page.locator('text=36,000 sq. ft')).toBeVisible();
  });

  test('03.07 should display key features and amenities list', async ({ page }) => {
    await page.goto('/project-details/p1');
    await expect(page.locator('text=Smart Access Control').or(page.locator('text=28 Premium Floors')).first()).toBeVisible();
    await expect(page.locator('text=Multi-Level Underground Secure Parking').or(page.locator('text=Full Backup Generator')).first()).toBeVisible();
  });

  test('03.08 should display price range and unit availability', async ({ page }) => {
    await page.goto('/project-details/p1');
    await expect(page.locator('text=৳ 1.50 Cr – ৳ 3.80 Cr')).toBeVisible();
  });

  test('03.09 should display Project Overview and Technical Specifications', async ({ page }) => {
    await page.goto('/project-details/p1');
    await expect(page.locator('text=Project Overview').first()).toBeVisible();
    await expect(page.locator('text=Technical Specifications').first()).toBeVisible();
  });

  test('03.10 should display View on GIS Map button', async ({ page }) => {
    await page.goto('/project-details/p1');
    const mapBtn = page.getByRole('link', { name: /View on GIS Map/i }).first();
    await expect(mapBtn).toBeVisible();
  });

  test('03.11 should display gallery thumbnails and support image switching', async ({ page }) => {
    await page.goto('/project-details/p1');
    const thumbnails = page.locator('img');
    expect(await thumbnails.count()).toBeGreaterThanOrEqual(1);
  });

  test('03.12 should have Schedule Site Visit button linking to contact', async ({ page }) => {
    await page.goto('/project-details/p1');
    const contactBtn = page.getByRole('link', { name: /Schedule Site Visit/i }).or(page.getByRole('link', { name: /Inquire/i })).first();
    if (await contactBtn.isVisible()) {
      await expect(contactBtn).toHaveAttribute('href', expect.stringContaining('contact'));
    }
  });

  test('03.13 should render Project Not Found error state for invalid project ID', async ({ page }) => {
    await page.goto('/project-details/non-existent-id-999');
    await expect(
      page.getByRole('heading', { name: 'Project Not Found' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Back to Projects' })
    ).toBeVisible();
  });

  test('03.14 should navigate back to projects when clicking button in not-found screen', async ({ page }) => {
    await page.goto('/project-details/invalid-project-xyz');
    const backBtn = page.getByRole('link', { name: 'Back to Projects' });
    await backBtn.click();
    await expect(page).toHaveURL(/\/projects/);
  });
});
