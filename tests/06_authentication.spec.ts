import { test, expect } from '@playwright/test';

test.describe('06. Authentication & Password Recovery Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/v1/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ session: null }),
      });
    });
  });

  test('06.01 should load Login page with correct URL and heading', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: /Welcome Back/i })).toBeVisible();
  });

  test('06.02 should have email and password inputs with required attributes', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('form input[placeholder*="Email or Username"]');
    const passwordInput = page.locator('form input[placeholder="••••••••"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    expect(await emailInput.getAttribute('required')).not.toBeNull();
    expect(await passwordInput.getAttribute('required')).not.toBeNull();
  });

  test('06.03 should toggle password visibility between password and text type', async ({ page }) => {
    await page.goto('/login');
    const passwordInput = page.locator('form input[placeholder="••••••••"]');
    await passwordInput.fill('SecretPassword123');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleBtn = page.getByRole('button', { name: /Show password/i });
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    const hideBtn = page.getByRole('button', { name: /Hide password/i });
    await hideBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('06.04 should display Remember Me checkbox and link to Register', async ({ page }) => {
    await page.goto('/login');
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible();
    const registerLink = page.getByRole('link', { name: /Create an account/i });
    await expect(registerLink).toBeVisible();
  });

  test('06.05 should show warning error banner for unregistered or pending client email', async ({ page }) => {
    await page.route('**/rest/v1/clients*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/login');
    await page.locator('form input[placeholder*="Email or Username"]').fill('unknown@client.com');
    await page.locator('form input[placeholder="••••••••"]').fill('wrongpassword');
    await page.getByRole('button', { name: /Sign In/i }).click();

    await expect(page.locator('text=pending admin approval').or(page.locator('text=Invalid email or password'))).toBeVisible();
  });

  test('06.06 should open Forgot Password modal when clicking button', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Forgot password?' }).click();
    await expect(page.getByRole('heading', { name: 'Reset Your Password' })).toBeVisible();
  });

  test('06.07 should close Forgot Password modal via close button', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Forgot password?' }).click();
    await expect(page.getByRole('heading', { name: 'Reset Your Password' })).toBeVisible();
    await page.getByRole('button', { name: 'Close modal' }).click();
    await expect(page.getByRole('heading', { name: 'Reset Your Password' })).not.toBeVisible();
  });

  test('06.08 should submit email in Forgot Password modal', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Forgot password?' }).click();
    const modalInput = page.locator('input[placeholder*="name@company.com"]');
    await modalInput.fill('client@reliance.com');
    await page.getByRole('button', { name: /Send Reset Link/i }).click();
  });

  test('06.09 should mock successful admin login redirecting to /admin', async ({ page }) => {
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-admin-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token',
          user: {
            id: 'admin-id',
            email: 'admin@reliance.com',
            role: 'authenticated',
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          },
        }),
      });
    });

    await page.route('**/rest/v1/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/login');
    await page.locator('form input[placeholder*="Email or Username"]').fill('admin@reliance.com');
    await page.locator('form input[placeholder="••••••••"]').fill('adminpassword');
    await page.getByRole('button', { name: /Sign In/i }).click();

    await expect(page).toHaveURL(/\/admin/);
  });

  test('06.10 should load Registration page with correct URL and heading', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole('heading', { name: /Create Your Account/i })).toBeVisible();
  });

  test('06.11 should display all registration inputs (Full Name, Email, Phone, Password)', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('form input[placeholder="John Doe"]')).toBeVisible();
    await expect(page.locator('form input[placeholder="john@example.com"]')).toBeVisible();
    await expect(page.locator('form input[placeholder*="1XXX"]')).toBeVisible();
    await expect(page.locator('form input[placeholder="••••••••"]')).toBeVisible();
  });

  test('06.12 should validate password minimum length on register', async ({ page }) => {
    await page.goto('/register');
    const pwInput = page.locator('form input[placeholder="••••••••"]');
    expect(await pwInput.getAttribute('minlength')).toBe('8');
  });

  test('06.13 should require agreeing to Terms of Service checkbox on register', async ({ page }) => {
    await page.goto('/register');
    const termsCheckbox = page.locator('#terms');
    await expect(termsCheckbox).toBeVisible();
    expect(await termsCheckbox.getAttribute('required')).not.toBeNull();
  });

  test('06.14 should submit registration form and display success banner', async ({ page }) => {
    await page.route('**/auth/v1/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'new-user-123',
            email: 'john@example.com',
            created_at: new Date().toISOString(),
          },
        }),
      });
    });

    await page.route('**/auth/v1/logout', async (route) => {
      await route.fulfill({ status: 204 });
    });

    await page.route('**/rest/v1/applications', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'app-123' }]),
      });
    });

    await page.goto('/register');
    await page.locator('form input[placeholder="John Doe"]').fill('John Doe');
    await page.locator('form input[placeholder="john@example.com"]').fill('john@example.com');
    await page.locator('form input[placeholder*="1XXX"]').fill('+8801711122233');
    await page.locator('form input[placeholder="••••••••"]').fill('SecurePassword123!');
    await page.locator('#terms').check();
    await page.getByRole('button', { name: /Register Account/i }).click();

    await expect(page.locator('text=Registration successful')).toBeVisible();
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('06.15 should navigate to /login from register link', async ({ page }) => {
    await page.goto('/register');
    const loginLink = page.getByRole('link', { name: /Sign in here/i });
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('06.16 should load Reset Password page with active recovery session', async ({ page }) => {
    await page.addInitScript(() => {
      const session = {
        access_token: 'mock-recovery-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user: {
          id: 'user-id-123',
          email: 'client@example.com',
          role: 'authenticated',
          aud: 'authenticated',
        },
      };
      localStorage.setItem('sb-xldgagnqhmzsykaaupav-auth-token', JSON.stringify(session));
    });

    await page.goto('/reset-password');
    await expect(page).toHaveURL(/\/reset-password/);
    await expect(page.getByRole('heading', { name: /Set New Password/i })).toBeVisible();
  });
});
