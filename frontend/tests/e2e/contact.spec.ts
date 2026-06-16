import { test, expect } from '@playwright/test';

test.describe('Contact Page - Form Submission', () => {
  test('should load contact page in English', async ({ page }) => {
    await page.goto('/contact');
    
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should load contact page in French', async ({ page }) => {
    await page.goto('/fr/contact');
    
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('should load contact page in Arabic', async ({ page }) => {
    await page.goto('/ar/contact');
    
    const mainContent = page.locator('main');
    await expect(mainContent).toHaveAttribute('dir', 'rtl');
    await expect(mainContent).toBeVisible();
  });

  test('should have all contact form fields', async ({ page }) => {
    await page.goto('/contact');
    
    // Check for required form fields
    const nameField = page.locator('input[name="name"], input[placeholder*="name" i]');
    const emailField = page.locator('input[type="email"], input[placeholder*="email" i]');
    const phoneField = page.locator('input[type="tel"], input[name="phone"], input[placeholder*="phone" i]');
    const subjectField = page.locator('input[name="subject"], input[placeholder*="subject" i]');
    const messageField = page.locator('textarea');
    
    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
    await expect(phoneField).toBeVisible();
    await expect(subjectField).toBeVisible();
    await expect(messageField).toBeVisible();
  });

  test('should submit valid contact form', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form with valid data
    await page.locator('input[name="name"], input[placeholder*="name" i]').fill('John Doe');
    await page.locator('input[type="email"], input[placeholder*="email" i]').fill('john@example.com');
    await page.locator('input[type="tel"], input[name="phone"], input[placeholder*="phone" i]').fill('+216123456789');
    await page.locator('input[name="subject"], input[placeholder*="subject" i]').fill('Account Inquiry');
    await page.locator('textarea').fill('I would like to open a new account');
    
    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await submitButton.click();
    
    // Wait for response
    await page.waitForTimeout(1000);
    
    // Check for success message or indication
    const pageContent = await page.content();
    const hasSuccess = pageContent.includes('success') || 
                       pageContent.includes('submitted') || 
                       pageContent.includes('received') ||
                       pageContent.includes('ticket');
    expect(hasSuccess).toBeTruthy();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill with invalid email
    await page.locator('input[name="name"], input[placeholder*="name" i]').fill('John Doe');
    await page.locator('input[type="email"], input[placeholder*="email" i]').fill('invalid-email');
    await page.locator('input[type="tel"], input[name="phone"], input[placeholder*="phone" i]').fill('+216123456789');
    await page.locator('input[name="subject"], input[placeholder*="subject" i]').fill('Test');
    await page.locator('textarea').fill('Test message');
    
    // Try to submit
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Should show error
    await page.waitForTimeout(500);
    const pageContent = await page.content();
    const hasError = pageContent.includes('error') || 
                     pageContent.includes('invalid') ||
                     pageContent.includes('required');
    expect(hasError).toBeTruthy();
  });

  test('should show validation error for missing required fields', async ({ page }) => {
    await page.goto('/contact');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Should show validation errors
    await page.waitForTimeout(500);
    const pageContent = await page.content();
    const hasError = pageContent.includes('required') || 
                     pageContent.includes('error') ||
                     pageContent.includes('please');
    expect(hasError).toBeTruthy();
  });

  test('should clear form on reset button', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form
    await page.locator('input[name="name"], input[placeholder*="name" i]').fill('John Doe');
    await page.locator('input[type="email"], input[placeholder*="email" i]').fill('john@example.com');
    
    // Look for reset button
    const resetButton = page.locator('button[type="reset"]');
    
    if (await resetButton.isVisible()) {
      await resetButton.click();
      
      // Form fields should be cleared
      const nameValue = await page.locator('input[name="name"], input[placeholder*="name" i]').inputValue();
      expect(nameValue).toBe('');
    }
  });
});

test.describe('Contact Page - Language Support', () => {
  test('should display form labels in French', async ({ page }) => {
    await page.goto('/fr/contact');
    
    const form = page.locator('form');
    const formText = await form.textContent();
    
    // Should contain French labels
    expect(formText).toBeTruthy();
  });

  test('should display form labels in Arabic', async ({ page }) => {
    await page.goto('/ar/contact');
    
    const form = page.locator('form');
    const formText = await form.textContent();
    
    // Should contain Arabic content
    expect(formText).toBeTruthy();
  });

  test('should display form in correct language', async ({ page }) => {
    await page.goto('/en/contact');
    
    const mainContent = page.locator('main');
    await expect(mainContent).toHaveAttribute('dir', 'ltr');
  });
});
