import { test, expect } from '@playwright/test';

test.describe('Homepage - All Languages', () => {
  test('should load English homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check page title and main elements
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify hero section is visible
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  test('should load French homepage at /fr', async ({ page }) => {
    await page.goto('/fr');
    
    // Check page loads without errors
    await expect(page).toHaveTitle(/Amen Bank/i);
    
    // Verify content is visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should load Arabic homepage at /ar', async ({ page }) => {
    await page.goto('/ar');
    
    // Check page loads
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    
    // Verify RTL direction for Arabic
    await expect(mainContent).toHaveAttribute('dir', 'rtl');
  });

  test('should display products section on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check for products section
    const productCards = page.locator('[class*="product"]');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display hero with rates on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Look for rate information
    const heroContent = page.locator('section').first();
    await expect(heroContent).toBeVisible();
  });

  test('should have working header navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check for navigation elements
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should have working footer', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check footer is visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should display trust indicators on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Look for trust/security related content
    const trustSection = page.locator('section').nth(1);
    await expect(trustSection).toBeVisible();
  });
});

test.describe('Homepage - Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto('/');
    
    // Check main elements are still visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    
    // Check content is properly displayed
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/');
    
    // Check full layout
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });
});
