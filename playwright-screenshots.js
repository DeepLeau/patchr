const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function runScreenshots() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  
  // Ensure screenshots directory exists
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  try {
    // ========================================
    // Screenshot 1: Hero CTA button on homepage
    // ========================================
    console.log('--- Screenshot 1: Waiting for CTA button on homepage ---');
    
    await page.goto('http://localhost:3000/', { 
      waitUntil: 'domcontentloaded' 
    });
    
    // Wait for the CTA button to be visible using accessible locator
    const ctaButton = page.getByRole('button', { name: /get started for free/i });
    await ctaButton.waitFor({ state: 'visible', timeout: 10000 });
    
    console.log('CTA button is visible - capturing screenshot');
    await page.screenshot({ 
      path: 'screenshots/screenshot-1.png', 
      fullPage: false 
    });
    console.log('Screenshot 1 saved: screenshots/screenshot-1.png');

  } catch (error) {
    console.error('Error during Screenshot 1:', error.message);
    // Capture error state for debugging
    try {
      await page.screenshot({ 
        path: 'screenshots/screenshot-1-error.png', 
        fullPage: false 
      });
    } catch (screenshotError) {
      console.error('Could not capture error screenshot:', screenshotError.message);
    }
  }

  try {
    // ========================================
    // Screenshot 2: Dashboard after CTA click
    // ========================================
    console.log('--- Screenshot 2: Navigating to dashboard via CTA click ---');
    
    // Re-locate the CTA button (page context may have changed)
    const ctaButton = page.getByRole('button', { name: /get started for free/i });
    
    // Click and wait for navigation
    await Promise.all([
      page.waitForURL('**/dashboard', { timeout: 10000 }),
      ctaButton.click()
    ]);
    
    // Wait for dashboard content to be stable
    await page.waitForLoadState('domcontentloaded');
    
    console.log('Dashboard navigation complete - capturing screenshot');
    await page.screenshot({ 
      path: 'screenshots/screenshot-2.png', 
      fullPage: false 
    });
    console.log('Screenshot 2 saved: screenshots/screenshot-2.png');

  } catch (error) {
    console.error('Error during Screenshot 2:', error.message);
    try {
      await page.screenshot({ 
        path: 'screenshots/screenshot-2-error.png', 
        fullPage: false 
      });
    } catch (screenshotError) {
      console.error('Could not capture error screenshot:', screenshotError.message);
    }
  }

  await browser.close();
  console.log('--- Screenshot script completed ---');
}

runScreenshots().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
