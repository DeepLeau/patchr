const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function runScreenshots() {
  // Ensure screenshots directory exists
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  console.log('Starting screenshot capture...');

  try {
    // === SCREENSHOT 1 ===
    // Page: "/" - Wait for get-started-button to be visible
    // Validate: Hero section visible + 'Get started for free' CTA text
    console.log('\n[1/3] Navigating to homepage...');
    await page.goto('http://localhost:3000/', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Wait for the get-started button to be visible
    const getStartedButton = page.getByRole('button', { name: /get started for free/i });
    await getStartedButton.waitFor({ state: 'visible', timeout: 10000 });

    // Validate the button text contains expected copy
    const buttonText = await getStartedButton.textContent();
    if (buttonText && buttonText.toLowerCase().includes('get started for free')) {
      console.log('  ✓ CTA button text validated: "Get started for free"');
    } else {
      console.log('  ⚠ CTA button found but text differs:', buttonText);
    }

    // Take screenshot of hero section
    await page.screenshot({ 
      path: 'screenshots/screenshot-1-hero-cta.png', 
      fullPage: false 
    });
    console.log('  ✓ Screenshot saved: screenshot-1-hero-cta.png');

  } catch (error) {
    console.error('  ✗ Error during Screenshot 1:', error.message);
    await page.screenshot({ 
      path: 'screenshots/error-screenshot-1.png', 
      fullPage: false 
    });
  }

  try {
    // === SCREENSHOT 2 ===
    // Page: "/" - Click get-started-button
    // Validate: Click triggers navigation
    console.log('\n[2/3] Clicking get-started button...');

    const getStartedButton = page.getByRole('button', { name: /get started for free/i });
    await getStartedButton.click();

    // Wait for navigation to start (click should trigger routing)
    await page.waitForLoadState('domcontentloaded');
    
    // Small wait for navigation to initiate
    await page.waitForTimeout(500);

    // Capture the state after click (navigation in progress or URL changing)
    await page.screenshot({ 
      path: 'screenshots/screenshot-2-click-navigation.png', 
      fullPage: false 
    });
    console.log('  ✓ Screenshot saved: screenshot-2-click-navigation.png');

  } catch (error) {
    console.error('  ✗ Error during Screenshot 2:', error.message);
    await page.screenshot({ 
      path: 'screenshots/error-screenshot-2.png', 
      fullPage: false 
    });
  }

  try {
    // === SCREENSHOT 3 ===
    // Page: "/dashboard" - Wait for URL to contain /dashboard
    // Validate: CTA redirects to dashboard
    console.log('\n[3/3] Waiting for dashboard redirect...');

    // Wait for URL to contain /dashboard
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    console.log('  ✓ URL validated: contains /dashboard');

    // Wait for page to settle
    await page.waitForLoadState('networkidle');

    // Take dashboard screenshot
    await page.screenshot({ 
      path: 'screenshots/screenshot-3-dashboard.png', 
      fullPage: false 
    });
    console.log('  ✓ Screenshot saved: screenshot-3-dashboard.png');

  } catch (error) {
    console.error('  ✗ Error during Screenshot 3:', error.message);
    await page.screenshot({ 
      path: 'screenshots/error-screenshot-3.png', 
      fullPage: false 
    });
  }

  // Cleanup
  await browser.close();
  console.log('\nScreenshot capture completed.');
  console.log('Output directory:', screenshotsDir);
}

runScreenshots().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
