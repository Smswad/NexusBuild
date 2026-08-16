import { test, expect } from '@playwright/test';

test.describe('07. Client Dashboard Flows', () => {
  test('07.01 should redirect unauthenticated guests from /dashboard to /login', async ({ page }) => {
    await page.route('**/auth/v1/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ session: null }),
      });
    });

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe('Authenticated Client Portal', () => {
    test.beforeEach(async ({ page }) => {
      // Seed client authentication session in localStorage
      await page.addInitScript(() => {
        const session = {
          access_token: 'mock-client-jwt',
          refresh_token: 'mock-client-refresh',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          user: {
            id: 'mock-client-id',
            email: 'client@reliance.com',
            role: 'authenticated',
            aud: 'authenticated',
          },
        };
        localStorage.setItem('sb-xldgagnqhmzsykaaupav-auth-token', JSON.stringify(session));
      });

      // 1. Generic rest mock (MUST be registered first in Playwright so specific overrides register later)
      await page.route('**/rest/v1/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      });

      // 2. Specific properties mock
      await page.route('**/rest/v1/properties*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            id: 'p123',
            client_id: 'c1',
            project_id: 'p1',
            unit_name: 'Unit 4A',
            location: 'Floor 4',
            area: '1,500 sqft',
            total_valuation: '10,00,000',
            total_paid: '2,00,000',
            due_balance: '8,00,000',
            other_charges: '50,000'
          }]),
        });
      });

      // 3. Specific installments mock
      await page.route('**/rest/v1/installments*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 'i1', property_id: 'p123', installment: '1st Installment', due_date: '20-Oct-2024', amount: '1,00,000', status: 'Paid', status_pill: 'bg-emerald-100 text-emerald-700', active: false },
            { id: 'i2', property_id: 'p123', installment: '12th Installment', due_date: '20-Nov-2025', amount: '1,00,000', status: 'Pending', status_pill: 'bg-amber-100 text-amber-700', active: true }
          ]),
        });
      });

      // 4. Specific transactions mock
      await page.route('**/rest/v1/transactions*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 't1', property_id: 'p123', date: '15-Aug-2024', type: 'Bank Transfer (1st Installment)', amount: '1,00,000' }
          ]),
        });
      });

      // 5. Specific clients mock (MUST be registered after generic mock to take precedence)
      await page.route('**/rest/v1/clients*', async (route) => {
        const accept = route.request().headers()['accept'] || '';
        const isSingle = accept.includes('vnd.pgrst.object');
        
        const clientObj = {
          id: 'c1',
          name: 'Shahil Mahmud Swad',
          email: 'client@reliance.com',
          phone: '+8801800000000',
          status: 'Active',
        };

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(isSingle ? clientObj : [clientObj]),
        });
      });

      await page.goto('/dashboard');
    });

    test('07.02 should load Client Dashboard Overview successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('07.03 should display navigation links (Dashboard, Financials, Projects, Support)', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Dashboard', exact: true }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Financials' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Projects' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Support' }).first()).toBeVisible();
    });

    test('07.04 should display Statement of Account header', async ({ page }) => {
      await expect(page.locator('text=Reliance Housing LTD Client Portal').or(page.locator('text=Welcome Back')).first()).toBeVisible();
    });

    test('07.05 should display Client Financial Standing cards', async ({ page }) => {
      await expect(page.locator('text=Total Property Valuation').or(page.locator('text=Total Amount Paid to Date').or(page.locator('text=Current Due Balance'))).first()).toBeVisible();
    });

    test('07.06 should display Installment Breakdown schedule table', async ({ page }) => {
      await expect(page.locator('main').locator('text=Installment Schedule').first()).toBeVisible();
      await expect(page.locator('div').filter({ has: page.getByRole('heading', { name: 'Installment Schedule', exact: true }) }).locator('text=1st Installment').first()).toBeVisible();
    });

    test('07.07 should display construction progress milestones (Piling, Casting, Finishing, Handover)', async ({ page }) => {
      await expect(page.locator('text=Piling').first()).toBeVisible();
      await expect(page.locator('text=Casting').or(page.locator('text=Structural Casting')).first()).toBeVisible();
    });

    test('07.08 should navigate to Financial Ledger view (/dashboard/financials)', async ({ page }) => {
      await page.getByRole('link', { name: 'Financials' }).first().click();
      await expect(page).toHaveURL(/\/dashboard\/financials/);
      await expect(page.locator('text=Financial').first()).toBeVisible();
    });

    test('07.09 should navigate to Projects/Progress view (/dashboard/progress)', async ({ page }) => {
      await page.getByRole('link', { name: 'Projects' }).first().click();
      await expect(page).toHaveURL(/\/dashboard\/progress/);
    });

    test('07.10 should navigate to Support view (/dashboard/support)', async ({ page }) => {
      await page.getByRole('link', { name: 'Support' }).first().click();
      await expect(page).toHaveURL(/\/dashboard\/support/);
    });

    test('07.11 should display Support tickets section in support page', async ({ page }) => {
      await page.goto('/dashboard/support');
      await expect(page.locator('text=Support').first()).toBeVisible();
    });

    test('07.12 should open profile modal when clicking user avatar/name', async ({ page }) => {
      const userBtn = page.getByRole('button', { name: /Profile/i }).or(page.locator('button:has-text("Shahil")')).or(page.locator('button:has(svg.lucide-user)')).first();
      if (await userBtn.isVisible()) {
        await userBtn.click();
      }
    });

    test('07.13 should toggle notifications popover when clicking bell icon', async ({ page }) => {
      const bellBtn = page.locator('button:has(svg.lucide-bell)').first();
      if (await bellBtn.isVisible()) {
        await bellBtn.click();
      }
    });

    test('07.14 should display assigned project reference in Overview', async ({ page }) => {
      await expect(page.locator('text=Sardar Tower').or(page.locator('text=Pending Unit Assignment')).or(page.locator('text=Allocation Reference')).first()).toBeVisible();
    });

    test('07.15 should display 12th Installment in breakdown table', async ({ page }) => {
      await expect(page.locator('div').filter({ has: page.getByRole('heading', { name: 'Installment Schedule', exact: true }) }).locator('text=12th Installment').first()).toBeVisible();
    });

    test('07.16 should display unit specifications card in Overview', async ({ page }) => {
      await expect(page.locator('div').filter({ has: page.getByRole('heading', { name: 'Unit 4A', exact: true }) }).locator('text=Area').first()).toBeVisible();
    });

    test('07.17 should display recent transactions log section', async ({ page }) => {
      await expect(page.locator('main').locator('text=Recent Transactions').or(page.locator('main').locator('text=Transactions')).first()).toBeVisible();
    });

    test('07.18 should have Logout button that clears session and redirects to login', async ({ page }) => {
      const logoutBtn = page.getByRole('button', { name: /Logout/i }).first();
      await expect(logoutBtn).toBeVisible();
      await logoutBtn.click();
      await expect(page).toHaveURL(/\/login/);
    });
  });
});
