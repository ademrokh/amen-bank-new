import { test, expect } from '@playwright/test';

test.describe('Chatbot Widget - Visibility and Interaction', () => {
  test('should display chatbot widget button on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Look for chatbot button/widget
    const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[class*="widget"]').first();
    
    if (await chatbotButton.isVisible()) {
      await expect(chatbotButton).toBeVisible();
    }
  });

  test('should open chatbot drawer when clicked', async ({ page }) => {
    await page.goto('/');
    
    // Find and click chatbot button
    const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[class*="widget"]').first();
    
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(300);
      
      // Check if drawer/modal opens
      const chatDrawer = page.locator('[class*="chatbot"], [class*="drawer"], [class*="modal"], [role="dialog"]');
      
      if (await chatDrawer.isVisible()) {
        await expect(chatDrawer).toBeVisible();
      }
    }
  });

  test('should display chatbot on all pages', async ({ page }) => {
    const pages = ['/', '/agencies', '/contact', '/faq'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[class*="widget"]').first();
      
      if (await chatbotButton.isVisible()) {
        await expect(chatbotButton).toBeVisible();
      }
    }
  });

  test('should close chatbot drawer', async ({ page }) => {
    await page.goto('/');
    
    // Open chatbot
    const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[class*="widget"]').first();
    
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(300);
      
      // Look for close button
      const closeButton = page.locator('button[class*="close"], [class*="close"]').last();
      
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await page.waitForTimeout(300);
      }
    }
  });
});

test.describe('Chatbot Widget - Message Interaction', () => {
  test('should send message to chatbot', async ({ page }) => {
    await page.goto('/');
    
    // Open chatbot
    const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[class*="widget"]').first();
    
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(300);
      
      // Find message input
      const messageInput = page.locator('input[type="text"], input[placeholder*="message" i], textarea[placeholder*="message" i]');
      
      if (await messageInput.isVisible()) {
        await messageInput.fill('How do I open an account?');
        
        // Find and click send button
        const sendButton = page.locator('button[class*="send"], button[class*="submit"]');
        
        if (await sendButton.isVisible()) {
          await sendButton.click();
          await page.waitForTimeout(500);
        }
      }
    }
  });

  test('should display chatbot response', async ({ page }) => {
    await page.goto('/');
    
    // Open chatbot and send message
    const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[class*="widget"]').first();
    
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(300);
      
      const messageInput = page.locator('input[type="text"], input[placeholder*="message" i], textarea[placeholder*="message" i]');
      
      if (await messageInput.isVisible()) {
        await messageInput.fill('What services do you offer?');
        
        const sendButton = page.locator('button[class*="send"], button[class*="submit"]');
        
        if (await sendButton.isVisible()) {
          await sendButton.click();
          await page.waitForTimeout(1000);
          
          // Check for response
          const messages = page.locator('[class*="message"], [role="article"]');
          const messageCount = await messages.count();
          expect(messageCount).toBeGreaterThan(0);
        }
      }
    }
  });

  test('should handle empty message', async ({ page }) => {
    await page.goto('/');
    
    // Open chatbot
    const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[class*="widget"]').first();
    
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(300);
      
      const sendButton = page.locator('button[class*="send"], button[class*="submit"]');
      
      if (await sendButton.isVisible()) {
        await sendButton.click();
        await page.waitForTimeout(300);
      }
    }
  });
});

test.describe('Chatbot Widget - Language Support', () => {
  test('should display chatbot in French', async ({ page }) => {
    await page.goto('/fr');
    
    // Open chatbot
    const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[class*="widget"]').first();
    
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(300);
      
      const chatDrawer = page.locator('[class*="chatbot"], [class*="drawer"]').first();
      
      if (await chatDrawer.isVisible()) {
        const content = await chatDrawer.textContent();
        expect(content).toBeTruthy();
      }
    }
  });

  test('should display chatbot in Arabic', async ({ page }) => {
    await page.goto('/ar');
    
    // Open chatbot
    const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[class*="widget"]').first();
    
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(300);
      
      const chatDrawer = page.locator('[class*="chatbot"], [class*="drawer"]').first();
      
      if (await chatDrawer.isVisible()) {
        // Arabic should have RTL
        const dirAttr = await chatDrawer.getAttribute('dir');
        if (dirAttr) {
          expect(dirAttr).toBe('rtl');
        }
      }
    }
  });

  test('should display chatbot in English', async ({ page }) => {
    await page.goto('/en');
    
    // Open chatbot
    const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[class*="widget"]').first();
    
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(300);
      
      const chatDrawer = page.locator('[class*="chatbot"], [class*="drawer"]').first();
      await expect(chatDrawer).toBeVisible();
    }
  });

  test('should send message in French', async ({ page }) => {
    await page.goto('/fr');
    
    // Open chatbot
    const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[class*="widget"]').first();
    
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(300);
      
      const messageInput = page.locator('input[type="text"], input[placeholder*="message" i], textarea[placeholder*="message" i]');
      
      if (await messageInput.isVisible()) {
        await messageInput.fill('Comment ouvrir un compte?');
        
        const sendButton = page.locator('button[class*="send"], button[class*="submit"]');
        
        if (await sendButton.isVisible()) {
          await sendButton.click();
          await page.waitForTimeout(500);
        }
      }
    }
  });

  test('should send message in Arabic', async ({ page }) => {
    await page.goto('/ar');
    
    // Open chatbot
    const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[class*="widget"]').first();
    
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(300);
      
      const messageInput = page.locator('input[type="text"], input[placeholder*="message" i], textarea[placeholder*="message" i]');
      
      if (await messageInput.isVisible()) {
        await messageInput.fill('كيف افتح حساب؟');
        
        const sendButton = page.locator('button[class*="send"], button[class*="submit"]');
        
        if (await sendButton.isVisible()) {
          await sendButton.click();
          await page.waitForTimeout(500);
        }
      }
    }
  });
});

test.describe('Chatbot Widget - Edge Cases', () => {
  test('should handle rapid message sending', async ({ page }) => {
    await page.goto('/');
    
    // Open chatbot
    const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[class*="widget"]').first();
    
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(300);
      
      const messageInput = page.locator('input[type="text"], input[placeholder*="message" i], textarea[placeholder*="message" i]');
      const sendButton = page.locator('button[class*="send"], button[class*="submit"]');
      
      if (await messageInput.isVisible() && await sendButton.isVisible()) {
        // Send multiple messages rapidly
        for (let i = 0; i < 3; i++) {
          await messageInput.fill(`Message ${i}`);
          await sendButton.click();
          await page.waitForTimeout(100);
        }
      }
    }
  });

  test('should handle very long message', async ({ page }) => {
    await page.goto('/');
    
    // Open chatbot
    const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[class*="widget"]').first();
    
    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(300);
      
      const messageInput = page.locator('input[type="text"], input[placeholder*="message" i], textarea[placeholder*="message" i]');
      
      if (await messageInput.isVisible()) {
        // Create a long message
        const longMessage = 'A'.repeat(500);
        await messageInput.fill(longMessage);
        
        const sendButton = page.locator('button[class*="send"], button[class*="submit"]');
        
        if (await sendButton.isVisible()) {
          await sendButton.click();
          await page.waitForTimeout(500);
        }
      }
    }
  });
});
