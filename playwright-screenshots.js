const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function captureScreenshots() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  
  // Create screenshots directory if it doesn't exist
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Enable console logging for debugging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Browser console error:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.error('Page error:', error.message);
  });

  try {
    // ========================================
    // SCREENSHOT 1: Hero section on homepage
    // ========================================
    console.log('\n--- Screenshot 1: Hero section ---');
    
    await page.goto('http://localhost:3000/', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Wait for the CTA button with specific text to be visible
    const getStartedButton = page.getByRole('button', { name: /get started for free/i });
    await getStartedButton.waitFor({ state: 'visible', timeout: 10000 });

    // Validate the button text
    const buttonText = await getStartedButton.textContent();
    console.log(`  Button text found: "${buttonText}"`);
    
    if (!buttonText.toLowerCase().includes('get started for free')) {
      throw new Error(`Expected button text to contain "Get started for free", got "${buttonText}"`);
    }
    console.log('  ✓ Button text validated successfully');

    // Capture screenshot 1
    const screenshot1Path = path.join(screenshotsDir, 'screenshot-1-hero-cta.png');
    await page.screenshot({ 
      path: screenshot1Path, 
      fullPage: false,
      animations: 'disabled'
    });
    console.log(`  ✓ Screenshot saved: ${screenshot1Path}`);

    // ========================================
    // SCREENSHOT 2: Dashboard after CTA click
    // ========================================
    console.log('\n--- Screenshot 2: Dashboard ---');

    // Click the CTA button
    await getStartedButton.click();
    console.log('  ✓ Clicked "Get started for free" button');

    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    console.log('  ✓ Navigated to /dashboard');

    // Wait for dashboard content to be visible
    const dashboardContent = page.getByTestId('dashboard-content');
    await dashboardContent.waitFor({ state: 'visible', timeout: 10000 });
    console.log('  ✓ Dashboard content is visible');

    // Capture screenshot 2
    const screenshot2Path = path.join(screenshotsDir, 'screenshot-2-dashboard.png');
    await page.screenshot({ 
      path: screenshot2Path, 
      fullPage: false,
      animations: 'disabled'
    });
    console.log(`  ✓ Screenshot saved: ${screenshot2Path}`);

    console.log('\n========================================');
    console.log('All screenshots captured successfully!');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ Error during screenshot capture:', error.message);
    
    // Capture error screenshot if possible
    try {
      const errorPath = path.join(screenshotsDir, 'screenshot-error.png');
      await page.screenshot({ path: errorPath, fullPage: true });
      console.log(`Error screenshot saved: ${errorPath}`);
    } catch (screenshotError) {
      console.error('Could not capture error screenshot:', screenshotError.message);
    }
    
    throw error;
  } finally {
    await browser.close();
  }
}

// Execute the script
captureScreenshots()
  .then(() => {
    console.log('Script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
