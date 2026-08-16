import { test, expect } from '@playwright/test';

test.describe('09. Interactive Components & Forms Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/v1/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ session: null }),
      });
    });
  });

  test('09.01 should display floating ChatWidget trigger button on Home page', async ({ page }) => {
    await page.goto('/');
    const chatBtn = page.getByRole('button', { name: /Open Chat/i });
    await expect(chatBtn).toBeVisible();
  });

  test('09.02 should open ChatWidget window when clicked', async ({ page }) => {
    await page.goto('/');
    const chatBtn = page.getByRole('button', { name: /Open Chat/i });
    await chatBtn.click();
    await expect(page.locator('text=NexusBuild Support').first()).toBeVisible();
  });

  test('09.03 should display automated greeting messages in ChatWidget', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Open Chat/i }).click();
    await expect(page.locator('text=Welcome to NexusBuild Support').first()).toBeVisible();
  });

  test('09.04 should display quick prompt pill buttons in ChatWidget', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Open Chat/i }).click();
    await expect(page.getByRole('button', { name: 'Check project status' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'View documents' })).toBeVisible();
  });

  test('09.05 should type and send message in ChatWidget with mock API reply', async ({ page }) => {
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ reply: 'All developments are seismic-rated and fully verified.' }),
      });
    });

    await page.goto('/');
    await page.getByRole('button', { name: /Open Chat/i }).click();

    const input = page.locator('input[placeholder="Type your message..."]');
    await input.fill('Are buildings seismic certified?');
    await page.getByRole('button', { name: /Send message/i }).click();

    await expect(page.locator('text=Are buildings seismic certified?').first()).toBeVisible();
    await expect(page.locator('text=All developments are seismic-rated').first()).toBeVisible();
  });

  test('09.06 should close ChatWidget window when clicking close button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Open Chat/i }).click();
    await expect(page.locator('text=NexusBuild Support').first()).toBeVisible();

    const closeBtn = page.getByRole('button', { name: /Close Chat/i });
    await closeBtn.click();
    await expect(page.locator('text=NexusBuild Support')).not.toBeVisible();
  });

  test('09.07 should load Contact page and display all 3 contact cards', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: /General Inquiries/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Sales & Investment/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Customer Support/i })).toBeVisible();
  });

  test('09.08 should display office address and business operating hours on contact page', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('text=Shamabay New Market').first()).toBeVisible();
    await expect(page.locator('text=Mon – Fri: 9:00 AM – 6:00 PM').first()).toBeVisible();
  });

  test('09.09 should validate required fields in contact form', async ({ page }) => {
    await page.goto('/contact');
    const nameInput = page.locator('#fullName');
    const emailInput = page.locator('#email');
    const subjectSelect = page.locator('#subject');
    const messageInput = page.locator('#message');

    expect(await nameInput.getAttribute('required')).not.toBeNull();
    expect(await emailInput.getAttribute('required')).not.toBeNull();
    expect(await subjectSelect.getAttribute('required')).not.toBeNull();
    expect(await messageInput.getAttribute('required')).not.toBeNull();
  });

  test('09.10 should submit Contact Form and show success confirmation message', async ({ page }) => {
    await page.route('**/rest/v1/leads*', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'lead-lead1' }]),
      });
    });

    await page.goto('/contact');
    await page.locator('#fullName').fill('Rahim Uddin');
    await page.locator('#email').fill('rahim@example.com');
    await page.locator('#subject').selectOption('Sales & Investment');
    await page.locator('#message').fill('Interested in purchasing 2 commercial units in Narayanganj.');
    await page.getByRole('button', { name: /Send Message/i }).click();

    await expect(page.locator('text=Message sent!').or(page.locator('text=We\'ll be in touch soon'))).toBeVisible();
  });

  test('09.11 should display openstreetmap external directions link on contact page', async ({ page }) => {
    await page.goto('/contact');
    const mapLink = page.getByRole('link', { name: /Open in Full Map/i });
    await expect(mapLink).toBeVisible();
    await expect(mapLink).toHaveAttribute('href', expect.stringContaining('openstreetmap.org'));
  });

  test('09.12 should test responsive mobile viewport menu toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const menuToggle = page.getByRole('button', { name: /Toggle menu/i }).or(page.locator('button:has(svg.lucide-menu)')).first();
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
    }
  });

  test('09.13 should test responsive mobile search bar toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const searchToggle = page.getByRole('button', { name: /Toggle search/i }).or(page.locator('button:has(svg.lucide-search)')).first();
    if (await searchToggle.isVisible()) {
      await searchToggle.click();
    }
  });

  test('09.14 should maintain persistent chat icon across different routes', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('button', { name: /Open Chat/i })).toBeVisible();
    await page.goto('/projects');
    await expect(page.getByRole('button', { name: /Open Chat/i })).toBeVisible();
  });
});
