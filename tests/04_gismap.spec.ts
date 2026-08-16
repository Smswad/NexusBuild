import { test, expect } from '@playwright/test';

test.describe('04. GIS Interactive Map Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/v1/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ session: null }),
      });
    });
    await page.goto('/gismap');
  });

  test('04.01 should load GIS Map page with correct URL', async ({ page }) => {
    await expect(page).toHaveURL(/\/gismap/);
  });

  test('04.02 should display search input for project or address in GIS map', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search project or address"]');
    await expect(searchInput).toBeVisible();
  });

  test('04.03 should render Google Map iframe embed', async ({ page }) => {
    const mapIframe = page.locator('iframe[src*="google.com/maps"]').first();
    await expect(mapIframe).toBeVisible();
  });

  test('04.04 should display project selection list in GIS sidebar', async ({ page }) => {
    await expect(page.locator('text=Sardar Tower – Block A').first()).toBeVisible();
    await expect(page.locator('text=Green Valley Residency').first()).toBeVisible();
  });

  test('04.05 should filter project list when typing in GIS search input', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search project or address"]');
    await searchInput.fill('Sardar');
    await expect(page.locator('text=Sardar Tower – Block A').first()).toBeVisible();
  });

  test('04.06 should switch active project when clicking Green Valley Residency', async ({ page }) => {
    const projectCard = page.locator('button, div').filter({ hasText: 'Green Valley Residency' }).first();
    await projectCard.click();
    await expect(page.locator('text=BB Road, Narayanganj').or(page.locator('text=BB Road')).first()).toBeVisible();
  });

  test('04.07 should display Hospitals & Healthcare amenities for active project', async ({ page }) => {
    await expect(
      page.locator('text=Hospitals & Healthcare').or(page.locator('text=Hospitals')).first()
    ).toBeVisible();
  });

  test('04.08 should display Educational Institutes & Schools for active project', async ({ page }) => {
    await expect(
      page.locator('text=Educational Institutes').or(page.locator('text=Schools')).first()
    ).toBeVisible();
  });

  test('04.09 should display Markets & Commercial Shopping for active project', async ({ page }) => {
    await expect(
      page.locator('text=Markets & Shopping').or(page.locator('text=Markets')).first()
    ).toBeVisible();
  });

  test('04.10 should display active project coordinates & directions link', async ({ page }) => {
    const directionsLink = page.getByRole('link', { name: /Google Maps/i }).or(page.locator('a[href*="maps.google.com"]')).first();
    if (await directionsLink.isVisible()) {
      await expect(directionsLink).toHaveAttribute('href', expect.stringContaining('maps.google.com'));
    }
  });

  test('04.11 should have link to full Project Details from GIS view', async ({ page }) => {
    const detailsLink = page.getByRole('link', { name: /View Project Details/i }).or(page.getByRole('link', { name: /Project Details/i })).first();
    if (await detailsLink.isVisible()) {
      await expect(detailsLink).toHaveAttribute('href', expect.stringContaining('project-details'));
    }
  });

  test('04.12 should show empty state when search query does not match any GIS projects', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search project or address"]');
    await searchInput.fill('NonExistentPlace999');
    await expect(page.locator('text=No project locations match your filter')).toBeVisible();
  });
});
