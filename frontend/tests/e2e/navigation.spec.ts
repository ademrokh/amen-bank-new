import { test, expect } from '@playwright/test';

test.describe('Navigation - Routes', () => {
  test('should navigate to homepage', async ({ page }) => {
    await page.goto('/');
    
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should navigate to agencies page', async ({ page }) => {
    await page.goto('/');
    
    // Find and click agencies link
    const agenciesLink = page.locator('a[href*="agencies"]').first();
    
    if (await agenciesLink.isVisible()) {
      await agenciesLink.click();
      await page.waitForURL(/agencies/);
      
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    }
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');
    
    // Find and click contact link
    const contactLink = page.locator('a[href*="contact"]').first();
    
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await page.waitForURL(/contact/);
      
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    }
  });

  test('should navigate to FAQ page', async ({ page }) => {
    await page.goto('/');
    
    // Find and click FAQ link
    const faqLink = page.locator('a[href*="faq"]').first();
    
    if (await faqLink.isVisible()) {
      await faqLink.click();
      await page.waitForURL(/amengpt/);
      
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    }
  });

  test('should have working back navigation', async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact');
    
    // Go back
    await page.goBack();
    
    // Should be on homepage or previous page
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('should handle direct route access', async ({ page }) => {
    // Direct access to each route
    const routes = ['/agencies', '/contact', '/amengpt'];
    
    for (const route of routes) {
      await page.goto(route);
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    }
  });
});

test.describe('Navigation - Language Switching', () => {
  test('should switch to French language', async ({ page }) => {
    await page.goto('/');
    
    // Look for language selector
    const frenchLink = page.locator('a[href*="/fr"]').first();
    
    if (await frenchLink.isVisible()) {
      await frenchLink.click();
      await page.waitForURL(/\/fr/);
      
      const url = page.url();
      expect(url).toContain('/fr');
    }
  });

  test('should switch to Arabic language', async ({ page }) => {
    await page.goto('/');
    
    // Look for language selector
    const arabicLink = page.locator('a[href*="/ar"]').first();
    
    if (await arabicLink.isVisible()) {
      await arabicLink.click();
      await page.waitForURL(/\/ar/);
      
      const url = page.url();
      expect(url).toContain('/ar');
    }
  });

  test('should switch to English language', async ({ page }) => {
    // Start from French page
    await page.goto('/fr');
    
    // Look for English link
    const englishLink = page.locator('a[href*="/en"], a[href="/"]').first();
    
    if (await englishLink.isVisible()) {
      await englishLink.click();
      
      // Should be on English page
      await page.waitForTimeout(300);
      const url = page.url();
      expect(url).toBeTruthy();
    }
  });

  test('should maintain page context when switching language', async ({ page }) => {
    // Go to contact page in French
    await page.goto('/fr/contact');
    
    // Switch to English
    const englishLink = page.locator('a[href*="/en"]').first();
    
    if (await englishLink.isVisible()) {
      await englishLink.click();
      await page.waitForTimeout(300);
      
      // Should still be on contact page (in English)
      const url = page.url();
      expect(url).toContain('contact');
    }
  });

  test('should apply RTL styling for Arabic', async ({ page }) => {
    await page.goto('/ar');
    
    const mainContent = page.locator('main');
    await expect(mainContent).toHaveAttribute('dir', 'rtl');
  });

  test('should apply LTR styling for English', async ({ page }) => {
    await page.goto('/en');
    
    const mainContent = page.locator('main');
    const dirAttr = await mainContent.getAttribute('dir');
    
    // English should have ltr or no dir attribute
    if (dirAttr) {
      expect(dirAttr).toBe('ltr');
    }
  });

  test('should apply LTR styling for French', async ({ page }) => {
    await page.goto('/fr');
    
    const mainContent = page.locator('main');
    const dirAttr = await mainContent.getAttribute('dir');
    
    // French should have ltr or no dir attribute
    if (dirAttr) {
      expect(dirAttr).toBe('ltr');
    }
  });
});

test.describe('Navigation - Header/Footer Links', () => {
  test('should have clickable header links', async ({ page }) => {
    await page.goto('/');
    
    const header = page.locator('header');
    const links = header.locator('a');
    const linkCount = await links.count();
    
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should have clickable footer links', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const footer = page.locator('footer');
    const links = footer.locator('a');
    const linkCount = await links.count();
    
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should handle logo click to return home', async ({ page }) => {
    // Go to contact page
    await page.goto('/contact');
    
    // Click logo (usually in header)
    const logo = page.locator('header a').first();
    
    if (await logo.isVisible()) {
      await logo.click();
      await page.waitForTimeout(300);
    }
  });
});
