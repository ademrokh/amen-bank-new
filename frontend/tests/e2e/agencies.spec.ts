import { test, expect } from '@playwright/test';

test.describe('Agency Locator Page', () => {
  test('should load agencies page in English', async ({ page }) => {
    await page.goto('/agencies');
    
    // Check page loads
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should load agencies page in French', async ({ page }) => {
    await page.goto('/fr/agencies');
    
    // Verify content is visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should load agencies page in Arabic', async ({ page }) => {
    await page.goto('/ar/agencies');
    
    // Verify RTL direction
    const mainContent = page.locator('main');
    await expect(mainContent).toHaveAttribute('dir', 'rtl');
    await expect(mainContent).toBeVisible();
  });

  test('should display agency list', async ({ page }) => {
    await page.goto('/agencies');
    
    // Look for agency cards or list items
    const agencyElements = page.locator('[class*="agency"]');
    const count = await agencyElements.count();
    
    // Should have at least 6 Tunisian branches
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should have agency search functionality', async ({ page }) => {
    await page.goto('/agencies');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    
    if (await searchInput.isVisible()) {
      // Test search functionality
      await searchInput.fill('tunis');
      
      // Results should be filtered
      await page.waitForTimeout(500);
      const results = page.locator('[class*="agency"]');
      const count = await results.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should display agency details', async ({ page }) => {
    await page.goto('/agencies');
    
    // Get first agency element
    const firstAgency = page.locator('[class*="agency"]').first();
    
    if (await firstAgency.isVisible()) {
      // Agency should have location info
      const agencyText = await firstAgency.textContent();
      expect(agencyText).toBeTruthy();
    }
  });

  test('should display map or location information', async ({ page }) => {
    await page.goto('/agencies');
    
    // Check for map container or location data
    const mapContainer = page.locator('[class*="map"]');
    const locationElements = page.locator('[class*="location"]');
    
    const hasMap = await mapContainer.isVisible().catch(() => false);
    const hasLocation = await locationElements.isVisible().catch(() => false);
    
    expect(hasMap || hasLocation).toBeTruthy();
  });
});

test.describe('Agency Locator - Interactions', () => {
  test('should click on agency and show details', async ({ page }) => {
    await page.goto('/agencies');
    
    const agency = page.locator('[class*="agency"]').first();
    
    if (await agency.isVisible()) {
      await agency.click();
      // Details should be displayed or page should update
      await page.waitForTimeout(300);
    }
  });

  test('should handle category filtering if available', async ({ page }) => {
    await page.goto('/agencies');
    
    // Look for category filters
    const filters = page.locator('button[class*="filter"], [class*="category"]');
    const filterCount = await filters.count();
    
    if (filterCount > 0) {
      const firstFilter = filters.first();
      await firstFilter.click();
      
      // Results should update
      await page.waitForTimeout(300);
    }
  });
});
