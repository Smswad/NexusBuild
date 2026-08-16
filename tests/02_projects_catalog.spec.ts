import { test, expect } from '@playwright/test';

test.describe('02. Public Catalog & Search Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/v1/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ session: null }),
      });
    });
    await page.goto('/projects');
  });

  test('02.01 should load Projects page and display hero title', async ({ page }) => {
    await expect(page).toHaveURL(/\/projects/);
    await expect(
      page.getByRole('heading', { name: /Modern Real Estate & Infrastructure Management/i })
    ).toBeVisible();
  });

  test('02.02 should display Signature Developments section heading on projects page', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Signature Developments/i }).first()
    ).toBeVisible();
  });

  test('02.03 should display multiple project cards in the catalog', async ({ page }) => {
    const cards = page.locator('.bg-white.border');
    await expect(cards.first()).toBeVisible();
    await expect(page.locator('text=Sardar Tower – Block A').first()).toBeVisible();
    await expect(page.locator('text=Green Valley Residency').first()).toBeVisible();
  });

  test('02.04 should display project location badges on cards', async ({ page }) => {
    await expect(page.locator('text=Narayanganj').first()).toBeVisible();
    await expect(page.locator('text=BB Road').first()).toBeVisible();
  });

  test('02.05 should display project property type badges (Mixed Use / Residential)', async ({ page }) => {
    await expect(page.locator('.bg-white.border').locator('text=Mixed Use').first()).toBeVisible();
    await expect(page.locator('.bg-white.border').locator('text=Residential').first()).toBeVisible();
  });

  test('02.06 should have Project Details buttons on each catalog card', async ({ page }) => {
    const detailsButtons = page.getByRole('link', { name: /Project Details/i });
    expect(await detailsButtons.count()).toBeGreaterThanOrEqual(2);
  });

  test('02.07 should have View Map buttons on each catalog card', async ({ page }) => {
    const mapButtons = page.getByRole('link', { name: /View Map/i });
    expect(await mapButtons.count()).toBeGreaterThanOrEqual(2);
  });

  test('02.08 should search for Sardar Tower in top navbar and see dropdown item', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search projects"]');
    await searchInput.fill('Sardar');
    const option = page.locator('ul[role="listbox"] button').filter({ hasText: 'Sardar Tower' }).first();
    await expect(option).toBeVisible();
  });

  test('02.09 should navigate to Sardar Tower details when clicking search result', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search projects"]');
    await searchInput.fill('Sardar');
    const option = page.locator('ul[role="listbox"] button').filter({ hasText: 'Sardar Tower' }).first();
    await option.click();
    await expect(page).toHaveURL(/\/project-details\/p1/);
  });

  test('02.10 should search for Green Valley in top navbar and navigate to p2', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search projects"]');
    await searchInput.fill('Valley');
    const option = page.locator('ul[role="listbox"] button').filter({ hasText: 'Green Valley' }).first();
    await option.click();
    await expect(page).toHaveURL(/\/project-details\/p2/);
  });

  test('02.11 should show empty search state in dropdown when no matching projects exist', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search projects"]');
    await searchInput.fill('NonExistentProject12345');
    await expect(page.locator('text=No projects found for')).toBeVisible();
  });

  test('02.12 should clear search query when clicking the X button in navbar search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search projects"]');
    await searchInput.fill('Residency');
    const clearBtn = page.getByLabel('Clear search');
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await expect(searchInput).toHaveValue('');
  });

  test('02.13 should close search dropdown when pressing Escape key', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search projects"]');
    await searchInput.fill('Sardar');
    await expect(page.locator('ul[role="listbox"]')).toBeVisible();
    await searchInput.press('Escape');
    await expect(page.locator('ul[role="listbox"]')).not.toBeVisible();
  });

  test('02.14 should support keyboard arrow down and Enter navigation in search dropdown', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search projects"]');
    await searchInput.fill('Sardar');
    await expect(page.locator('ul[role="listbox"]')).toBeVisible();
    await searchInput.press('ArrowDown');
    await searchInput.press('Enter');
    await expect(page).toHaveURL(/\/project-details\/p1/);
  });

  test('02.15 should navigate to project details from catalog card click', async ({ page }) => {
    const card = page.locator('.bg-white.border').filter({ hasText: 'Green Valley Residency' }).first();
    await card.getByRole('link', { name: /Project Details/i }).click();
    await expect(page).toHaveURL(/\/project-details\/p2/);
  });

  test('02.16 should display Request Professional Remodeling section on projects page', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Professional Services & Remodeling/i })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Request Remodeling/i })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Schedule Site Visit/i })
    ).toBeVisible();
  });
});
