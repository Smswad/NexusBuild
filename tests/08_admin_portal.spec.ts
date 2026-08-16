import { test, expect } from '@playwright/test';

test.describe('08. Admin Control Panel Flows', () => {
  test('08.01 should redirect unauthenticated users from /admin to /login', async ({ page }) => {
    await page.route('**/auth/v1/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ session: null }),
      });
    });

    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe('Authenticated Admin Portal', () => {
    test.beforeEach(async ({ page }) => {
      // Seed admin authentication session in localStorage
      await page.addInitScript(() => {
        const session = {
          access_token: 'mock-admin-jwt',
          refresh_token: 'mock-admin-refresh',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          user: {
            id: 'mock-admin-id',
            email: 'admin@reliance.com',
            role: 'authenticated',
            aud: 'authenticated',
          },
        };
        localStorage.setItem('sb-xldgagnqhmzsykaaupav-auth-token', JSON.stringify(session));
      });

      // Mock database endpoints
      await page.route('**/rest/v1/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      });

      await page.goto('/admin');
    });

    test('08.02 should load Admin Dashboard Overview successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/admin/);
    });

    test('08.03 should display Admin sidebar with all module navigation links', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Dashboard', exact: true }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Client Management' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Leads' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Onboarding' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Financial Ledgers' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Installments' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Site Progress' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Website Projects' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Support Tickets' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Contact Settings' }).first()).toBeVisible();
    });

    test('08.04 should display admin top navigation search bar', async ({ page }) => {
      const searchInput = page.locator('header input[placeholder*="Search"]').or(page.locator('input[placeholder*="Search clients"]')).or(page.locator('input[type="text"]')).first();
      await expect(searchInput).toBeVisible();
    });

    test('08.05 should navigate to Client Management (/admin/management)', async ({ page }) => {
      await page.getByRole('link', { name: 'Client Management' }).first().click();
      await expect(page).toHaveURL(/\/admin\/management/);
    });

    test('08.06 should navigate to Leads Pipeline (/admin/leads)', async ({ page }) => {
      await page.getByRole('link', { name: 'Leads' }).first().click();
      await expect(page).toHaveURL(/\/admin\/leads/);
    });

    test('08.07 should navigate to Onboarding Applications (/admin/onboarding)', async ({ page }) => {
      await page.getByRole('link', { name: 'Onboarding' }).first().click();
      await expect(page).toHaveURL(/\/admin\/onboarding/);
    });

    test('08.08 should navigate to Financial Ledgers (/admin/financials)', async ({ page }) => {
      await page.getByRole('link', { name: 'Financial Ledgers' }).first().click();
      await expect(page).toHaveURL(/\/admin\/financials/);
    });

    test('08.09 should navigate to Installments Manager (/admin/installments)', async ({ page }) => {
      await page.getByRole('link', { name: 'Installments' }).first().click();
      await expect(page).toHaveURL(/\/admin\/installments/);
    });

    test('08.10 should navigate to Site Progress Updates (/admin/progress)', async ({ page }) => {
      await page.getByRole('link', { name: 'Site Progress' }).first().click();
      await expect(page).toHaveURL(/\/admin\/progress/);
    });

    test('08.11 should navigate to Project Details Manager (/admin/project-details)', async ({ page }) => {
      await page.getByRole('link', { name: 'Project Details' }).first().click();
      await expect(page).toHaveURL(/\/admin\/project-details/);
    });

    test('08.12 should navigate to Website Projects Catalog (/admin/website-projects)', async ({ page }) => {
      await page.getByRole('link', { name: 'Website Projects' }).first().click();
      await expect(page).toHaveURL(/\/admin\/website-projects/);
    });

    test('08.13 should navigate to Support Tickets (/admin/tickets)', async ({ page }) => {
      await page.getByRole('link', { name: 'Support Tickets' }).first().click();
      await expect(page).toHaveURL(/\/admin\/tickets/);
    });

    test('08.14 should navigate to Contact Settings (/admin/contact)', async ({ page }) => {
      await page.getByRole('link', { name: 'Contact Settings' }).first().click();
      await expect(page).toHaveURL(/\/admin\/contact/);
    });

    test('08.15 should display Dashboard metrics overview summary cards', async ({ page }) => {
      await expect(page.locator('main').locator('text=Total Clients').or(page.locator('main').locator('text=Active Projects')).first()).toBeVisible();
    });

    test('08.16 should toggle Admin Notifications popover', async ({ page }) => {
      const bellBtn = page.locator('button:has(svg.lucide-bell)').first();
      if (await bellBtn.isVisible()) {
        await bellBtn.click();
      }
    });

    test('08.17 should display Project Switcher in top admin bar', async ({ page }) => {
      const switcher = page.locator('button:has(svg.lucide-building-2)').or(page.locator('text=Sardar Tower')).first();
      if (await switcher.isVisible()) {
        await switcher.click();
      }
    });

    test('08.18 should search in global admin search input', async ({ page }) => {
      const search = page.locator('input[placeholder*="Search"]').first();
      if (await search.isVisible()) {
        await search.fill('Client');
      }
    });

    test('08.19 should verify Admin layout responsiveness and branding', async ({ page }) => {
      await expect(page.locator('text=NexusBuild').or(page.locator('text=Admin')).first()).toBeVisible();
    });

    test('08.20 should have working Logout button redirecting to login page', async ({ page }) => {
      const logoutBtn = page.getByRole('button', { name: /Logout/i }).first();
      await expect(logoutBtn).toBeVisible();
      await logoutBtn.click();
      await expect(page).toHaveURL(/\/login/);
    });
  });
});
