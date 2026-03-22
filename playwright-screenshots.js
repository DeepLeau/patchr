const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  // Ensure screenshots directory exists
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // ============================================
    // SCREENSHOT 1: Hero section with CTA
    // ============================================
    console.log('[1/2] Navigating to home page...');
    
    await page.goto('http://localhost:3000/', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });

    // Wait for CTA button to be visible (stable UI state)
    const ctaButton = page.getByRole('button', { name: /get started for free/i });
    await ctaButton.waitFor({ state: 'visible', timeout: 10000 });

    // Validate the button text matches expected wording
    const buttonText = await ctaButton.textContent();
    if (!buttonText.toLowerCase().includes('get started for free')) {
      throw new Error(`CTA text mismatch. Expected "Get started for free", got "${buttonText}"`);
    }
    console.log('✓ CTA button text validated: "Get started for free"');

    // Capture hero section screenshot
    await page.screenshot({ 
      path: 'screenshots/screenshot-1.png', 
      fullPage: false 
    });
    console.log('✓ Screenshot 1 saved: Hero section');

    // ============================================
    // SCREENSHOT 2: Dashboard after navigation
    // ============================================
    console.log('[2/2] Clicking CTA and waiting for dashboard...');

    // Click CTA and wait for URL change
    await Promise.all([
      page.waitForURL('**/dashboard', { timeout: 10000 }),
      ctaButton.click()
    ]);

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Capture dashboard screenshot
    await page.screenshot({ 
      path: 'screenshots/screenshot-2.png', 
      fullPage: false 
    });
    console.log('✓ Screenshot 2 saved: Dashboard');

    // Validate URL
    const currentUrl = page.url();
    if (!currentUrl.includes('/dashboard')) {
      throw new Error(`Navigation failed. Current URL: ${currentUrl}`);
    }
    console.log('✓ Dashboard navigation validated');

  } catch (error) {
    console.error('✗ Error:', error.message);
    
    // Capture error state screenshot
    try {
      await page.screenshot({ 
        path: 'screenshots/screenshot-error.png', 
        fullPage: false 
      });
    } catch (screenshotError) {
      console.error('Failed to capture error screenshot:', screenshotError.message);
    }
    
    // Log any console errors
    if (consoleErrors.length > 0) {
      console.error('Console errors detected:');
      consoleErrors.forEach(err => console.error('  -', err));
    }
  }

  await browser.close();
  console.log('Browser closed. Screenshots available in ./screenshots/');
})();
