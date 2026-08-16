import { test, expect } from '@playwright/test';

test.describe('01. Homepage & Landing Experience', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept session calls to start in guest mode
    await page.route('**/auth/v1/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ session: null }),
      });
    });
    await page.goto('/');
  });

  test('01.01 should load Homepage and have valid page title', async ({ page }) => {
    await expect(page).toHaveTitle(/NexusBuild/i);
  });

  test('01.02 should display brand logo link navigating to home', async ({ page }) => {
    const brand = page.getByRole('link', { name: 'NexusBuild', exact: true }).first();
    await expect(brand).toBeVisible();
    await expect(brand).toHaveAttribute('href', '/');
  });

  test('01.03 should display top navigation links in header', async ({ page }) => {
    const nav = page.locator('header nav');
    await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'GIS Map' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('01.04 should display Login and Register CTA buttons in navbar', async ({ page }) => {
    const header = page.locator('header');
    await expect(header.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Register' })).toBeVisible();
  });

  test('01.05 should display hero section headline and sub-headline', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Building Narayanganj's Future Architecture/i })
    ).toBeVisible();
    await expect(
      page.locator('text=Precision-engineered residential complexes')
    ).toBeVisible();
  });

  test('01.06 should have hero CTA linking to Explore All Projects', async ({ page }) => {
    const cta = page.getByRole('link', { name: /Explore All Projects/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/projects');
  });

  test('01.07 should have hero CTA linking to Interactive GIS Map', async ({ page }) => {
    const cta = page.getByRole('link', { name: /Interactive GIS Map/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/gismap');
  });

  test('01.08 should display hero statistics counters', async ({ page }) => {
    await expect(page.locator('text=150+')).toBeVisible();
    await expect(page.locator('text=Projects Delivered').or(page.locator('text=Completed Projects'))).toBeVisible();
    await expect(page.locator('text=12k+')).toBeVisible();
    await expect(page.locator('text=Families Housed').or(page.locator('text=Happy Families'))).toBeVisible();
  });

  test('01.09 should render Signature Developments section header', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Signature Developments/i }).first()
    ).toBeVisible();
  });

  test('01.10 should render featured project cards in Signature Developments', async ({ page }) => {
    await expect(page.locator('text=Sardar Tower – Block A').first()).toBeVisible();
    await expect(page.locator('text=Green Valley Residency').first()).toBeVisible();
  });

  test('01.11 should have link to View All Projects from featured section', async ({ page }) => {
    const viewAllLink = page.getByRole('link', { name: /View All Projects/i });
    await expect(viewAllLink).toBeVisible();
    await expect(viewAllLink).toHaveAttribute('href', '/projects');
  });

  test('01.12 should display Neighborhoods section with prime sectors', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Explore Narayanganj Neighborhoods/i })).toBeVisible();
    await expect(page.locator('text=Chashiara').first()).toBeVisible();
    await expect(page.locator('text=Deobhog').first()).toBeVisible();
    await expect(page.locator('text=Masdair').first()).toBeVisible();
    await expect(page.locator('text=BB Road').first()).toBeVisible();
  });

  test('01.13 should have Launch Interactive GIS Map button in neighborhoods section', async ({ page }) => {
    const launchGis = page.getByRole('link', { name: /Launch Interactive GIS Map/i });
    await expect(launchGis).toBeVisible();
    await expect(launchGis).toHaveAttribute('href', '/gismap');
  });

  test('01.14 should display Professional Services & Remodeling section', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Professional Services & Remodeling/i })
    ).toBeVisible();
    await expect(page.locator('text=Full-Scope Remodeling').first()).toBeVisible();
    await expect(page.locator('text=Consultation & Site Visits').first()).toBeVisible();
  });

  test('01.15 should display Empowering Property Owners platform section', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Empowering Property Owners/i })
    ).toBeVisible();
    await expect(page.locator('text=Financial Reporting').first()).toBeVisible();
    await expect(page.locator('text=24/7 Client Care').first()).toBeVisible();
  });

  test('01.16 should have working Client Portal Login link in platform card', async ({ page }) => {
    const portalLink = page.getByRole('link', { name: /Client Portal Login/i });
    await expect(portalLink).toBeVisible();
    await expect(portalLink).toHaveAttribute('href', '/login');
  });

  test('01.17 should render full Footer component with contact info and copyright', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('text=Reliance Housing Ltd.')).toBeVisible();
    await expect(footer.locator('text=Shamabay New Market')).toBeVisible();
    await expect(footer.locator('text=info@reliancehousing.com')).toBeVisible();
  });

  test('01.18 should have Newsletter subscription input in footer', async ({ page }) => {
    const footer = page.locator('footer');
    const emailInput = footer.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });
});
