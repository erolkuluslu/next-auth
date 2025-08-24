import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/');

    // Check if the main heading is visible
    await expect(page.locator('h2')).toContainText(
      'Stage 2 E-commerce Platform'
    );

    // Check if the description is visible
    await expect(page.locator('p')).toContainText(
      'Çok dilli, SEO optimizasyonlu'
    );
  });

  test('should display the correct app name in header', async ({ page }) => {
    await page.goto('/');

    // Check header contains the app name
    const header = page.locator('header h1');
    await expect(header).toBeVisible();

    // Check version badge
    const versionBadge = page.locator('header span').filter({ hasText: 'v' });
    await expect(versionBadge).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    await page.goto('/');

    // Check navigation items
    await expect(page.getByRole('link', { name: 'Ana Sayfa' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ürünler' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sepet' })).toBeVisible();
  });

  test('should display status cards', async ({ page }) => {
    await page.goto('/');

    // Check all status cards are visible
    await expect(page.locator('text=✅ Next.js 14')).toBeVisible();
    await expect(page.locator('text=🎨 Tailwind CSS')).toBeVisible();
    await expect(page.locator('text=🌍 i18n Ready')).toBeVisible();
    await expect(page.locator('text=⚡ Performance')).toBeVisible();
  });

  test('should display bootstrap completion section', async ({ page }) => {
    await page.goto('/');

    // Check completion status
    await expect(page.locator('text=🚀 Bootstrap Completed!')).toBeVisible();
    await expect(page.locator('text=✅ App Structure')).toBeVisible();
    await expect(page.locator('text=✅ Configuration')).toBeVisible();
    await expect(page.locator('text=✅ Environment')).toBeVisible();
    await expect(page.locator('text=✅ i18n Setup')).toBeVisible();
  });

  test('should display footer with correct information', async ({ page }) => {
    await page.goto('/');

    // Check footer content
    const footer = page.locator('footer');
    await expect(footer).toContainText(
      'Built with Next.js 14, TypeScript & Tailwind CSS'
    );
    await expect(footer).toContainText('Port: 3000');
    await expect(footer).toContainText('Environment:');
    await expect(footer).toContainText('Version:');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that main elements are still visible on mobile
    await expect(page.locator('h2')).toContainText(
      'Stage 2 E-commerce Platform'
    );
    await expect(page.locator('header h1')).toBeVisible();

    // Status cards should be stacked vertically on mobile
    const statusCards = page.locator('[class*="grid-cols-1"]').first();
    await expect(statusCards).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Stage 2 E-commerce/);

    // Check heading hierarchy
    const mainHeading = page.locator('h2').first();
    await expect(mainHeading).toBeVisible();

    // Check that navigation is properly structured
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Check that there are no console errors
    expect(consoleErrors.length).toBe(0);
  });
});
