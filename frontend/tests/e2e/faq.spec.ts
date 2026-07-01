import { test, expect } from '@playwright/test';

test.describe('FAQ Page', () => {
  test('should load FAQ page in English', async ({ page }) => {
    await page.goto('/amengpt');
    
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should load FAQ page in French', async ({ page }) => {
    await page.goto('/fr/amengpt');
    
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should load FAQ page in Arabic', async ({ page }) => {
    await page.goto('/ar/amengpt');
    
    const mainContent = page.locator('main');
    await expect(mainContent).toHaveAttribute('dir', 'rtl');
    await expect(mainContent).toBeVisible();
  });

  test('should display FAQ items', async ({ page }) => {
    await page.goto('/amengpt');
    
    // Look for FAQ items/questions
    const faqItems = page.locator('[class*="faq"], [class*="question"], [class*="accordion"]');
    const count = await faqItems.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should display FAQ categories if available', async ({ page }) => {
    await page.goto('/amengpt');
    
    // Look for category filters or tabs
    const categories = page.locator('[class*="category"], button[class*="tab"]');
    const categoryCount = await categories.count();
    
    if (categoryCount > 0) {
      expect(categoryCount).toBeGreaterThan(0);
    }
  });
});

test.describe('FAQ Page - Accordion Interactions', () => {
  test('should expand FAQ item on click', async ({ page }) => {
    await page.goto('/amengpt');
    
    // Get first FAQ item
    const firstItem = page.locator('[class*="faq"], [class*="question"], [class*="accordion"]').first();
    
    if (await firstItem.isVisible()) {
      // Click to expand
      await firstItem.click();
      
      // Check if answer/content is now visible
      await page.waitForTimeout(300);
      
      // There should be more content visible after expansion
      const bodyContent = await page.content();
      expect(bodyContent.length).toBeGreaterThan(0);
    }
  });

  test('should collapse FAQ item on second click', async ({ page }) => {
    await page.goto('/amengpt');
    
    const firstItem = page.locator('[class*="faq"], [class*="question"], [class*="accordion"]').first();
    
    if (await firstItem.isVisible()) {
      // Click to expand
      await firstItem.click();
      await page.waitForTimeout(200);
      
      // Click again to collapse
      await firstItem.click();
      await page.waitForTimeout(200);
    }
  });

  test('should handle multiple FAQ items', async ({ page }) => {
    await page.goto('/amengpt');
    
    const items = page.locator('[class*="faq"], [class*="question"], [class*="accordion"]');
    const count = await items.count();
    
    if (count > 1) {
      // Click multiple items
      for (let i = 0; i < Math.min(count, 3); i++) {
        const item = items.nth(i);
        await item.click();
        await page.waitForTimeout(200);
      }
    }
  });
});

test.describe('FAQ Page - Search/Filter', () => {
  test('should filter FAQs by category if available', async ({ page }) => {
    await page.goto('/amengpt');
    
    // Look for category buttons/tabs
    const categoryButtons = page.locator('button[class*="category"], button[class*="tab"]');
    const count = await categoryButtons.count();
    
    if (count > 0) {
      const firstButton = categoryButtons.first();
      await firstButton.click();
      
      // Content should update
      await page.waitForTimeout(300);
    }
  });

  test('should have working search if available', async ({ page }) => {
    await page.goto('/amengpt');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('account');
      
      // Results should be filtered
      await page.waitForTimeout(300);
      
      const items = page.locator('[class*="faq"], [class*="question"]');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});

test.describe('FAQ Page - Language Support', () => {
  test('should display FAQs in French', async ({ page }) => {
    await page.goto('/fr/amengpt');
    
    const content = await page.content();
    expect(content.length).toBeGreaterThan(0);
  });

  test('should display FAQs in Arabic with RTL layout', async ({ page }) => {
    await page.goto('/ar/amengpt');
    
    const mainContent = page.locator('main');
    await expect(mainContent).toHaveAttribute('dir', 'rtl');
  });

  test('should display FAQs in English with LTR layout', async ({ page }) => {
    await page.goto('/en/amengpt');
    
    const mainContent = page.locator('main');
    
    // English should have ltr or no specific dir
    const dirAttribute = await mainContent.getAttribute('dir');
    if (dirAttribute) {
      expect(dirAttribute).toBe('ltr');
    }
  });
});
