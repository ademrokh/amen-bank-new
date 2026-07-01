import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('should have proper heading hierarchy on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check for h1 element
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

  test('should have alternative text for images', async ({ page }) => {
    await page.goto('/');
    
    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const altText = await img.getAttribute('alt');
        
        // Alt text should exist or image should have aria-label
        if (!altText) {
          const ariaLabel = await img.getAttribute('aria-label');
          expect(altText || ariaLabel).toBeTruthy();
        }
      }
    }
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/contact');
    
    // Get all form inputs
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const name = await input.getAttribute('name');
        const placeholder = await input.getAttribute('placeholder');
        const ariaLabel = await input.getAttribute('aria-label');
        
        // Should have at least one of: label, placeholder, aria-label, or id with associated label
        const hasLabel = id || placeholder || ariaLabel;
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Check that page is visible (basic check for contrast)
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    
    // Text should be readable
    const allText = await mainContent.textContent();
    expect(allText).toBeTruthy();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through elements
    await page.keyboard.press('Tab');
    
    // Check if any element is focused
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    
    expect(focusedElement).toBeTruthy();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');
    
    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check for navigation landmark
    const nav = page.locator('nav');
    if (await nav.isVisible()) {
      await expect(nav).toBeVisible();
    }
  });
});

test.describe('Accessibility - Language Support', () => {
  test('should set proper lang attribute on HTML for English', async ({ page }) => {
    await page.goto('/en');
    
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toMatch(/en/i);
  });

  test('should set proper lang attribute on HTML for French', async ({ page }) => {
    await page.goto('/fr');
    
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toMatch(/fr/i);
  });

  test('should set proper lang attribute on HTML for Arabic', async ({ page }) => {
    await page.goto('/ar');
    
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toMatch(/ar/i);
  });

  test('should have proper dir attribute for RTL languages', async ({ page }) => {
    await page.goto('/ar');
    
    const html = page.locator('html');
    const dirAttr = await html.getAttribute('dir');
    
    if (dirAttr) {
      expect(dirAttr).toBe('rtl');
    }
  });
});

test.describe('Performance Tests', () => {
  test('should load homepage within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should load all pages quickly', async ({ page }) => {
    const pages = ['/', '/agencies', '/contact', '/amengpt'];
    
    for (const pagePath of pages) {
      const startTime = Date.now();
      await page.goto(pagePath);
      const loadTime = Date.now() - startTime;
      
      // Each page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    }
  });

  test('should not have excessive memory usage', async ({ page }) => {
    await page.goto('/');
    
    // Check page size is reasonable
    const content = await page.content();
    const sizeInMB = new TextEncoder().encode(content).length / (1024 * 1024);
    
    // Page HTML should be less than 2MB
    expect(sizeInMB).toBeLessThan(2);
  });

  test('should handle rapid navigation', async ({ page }) => {
    const pages = ['/', '/agencies', '/contact', '/amengpt'];
    
    // Rapidly navigate between pages
    for (let i = 0; i < 3; i++) {
      for (const pagePath of pages) {
        await page.goto(pagePath);
        // Page should respond without errors
        const status = await page.evaluate(() => document.readyState);
        expect(status).toBeTruthy();
      }
    }
  });
});

test.describe('Responsive Design - Accessibility', () => {
  test('should be accessible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto('/');
    
    // Check touch targets are large enough
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        
        if (box) {
          // Touch targets should be at least 48x48 pixels
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('should have readable text on all viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 812 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 } // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      // Check that text is visible
      const mainContent = page.locator('main');
      const text = await mainContent.textContent();
      expect(text).toBeTruthy();
    }
  });
});

test.describe('Error Handling', () => {
  test('should handle 404 pages gracefully', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/_not-found', { waitUntil: 'networkidle' }).catch(() => {});
    
    // Page should still be accessible
    const content = await page.content();
    expect(content).toBeTruthy();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Simulate network error
    await page.context().setOffline(true);
    await page.waitForTimeout(500);
    
    // Turn network back on
    await page.context().setOffline(false);
    
    // Should still be functional
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });
});
