const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = 'screenshots';

async function ensureScreenshotsDir() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
}

async function runScreenshotScript() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  await ensureScreenshotsDir();

  console.log('Starting screenshot capture script...\n');

  // ─── Screenshot 1: Hero CTA Button on Home Page ───
  try {
    console.log('[1/3] Navigating to home page and waiting for hero CTA...');
    await page.goto('http://localhost:3000/', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    const heroCtaButton = page.locator('[data-testid="hero-cta-button"]');
    await heroCtaButton.waitFor({ state: 'visible', timeout: 10000 });
    
    const buttonText = await heroCtaButton.textContent();
    console.log(`    Button text: "${buttonText}"`);
    
    if (buttonText && buttonText.includes('Get started for free')) {
      console.log('    ✓ Button copy validated: "Get started for free"');
    } else {
      console.log(`    ⚠ Unexpected button text: "${buttonText}"`);
    }

    await page.screenshot({ 
      path: 'screenshots/screenshot-1-hero-cta.png', 
      fullPage: false 
    });
    console.log('    ✓ Screenshot saved: screenshot-1-hero-cta.png\n');
  } catch (error) {
    console.error(`    ✗ Screenshot 1 failed: ${error.message}`);
    await page.screenshot({ 
      path: 'screenshots/screenshot-1-error.png', 
      fullPage: false 
    });
  }

  // ─── Screenshot 2: Click CTA and Verify Dashboard Redirect ───
  try {
    console.log('[2/3] Clicking hero CTA and waiting for dashboard redirect...');
    
    const heroCtaButton = page.locator('[data-testid="hero-cta-button"]');
    await Promise.all([
      page.waitForURL('**/dashboard**', { timeout: 10000 }),
      heroCtaButton.click()
    ]);

    const currentUrl = page.url();
    console.log(`    Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/dashboard')) {
      console.log('    ✓ Redirect to dashboard validated');
    } else {
      console.log(`    ⚠ URL does not contain /dashboard: ${currentUrl}`);
    }

    await page.screenshot({ 
      path: 'screenshots/screenshot-2-redirect.png', 
      fullPage: false 
    });
    console.log('    ✓ Screenshot saved: screenshot-2-redirect.png\n');
  } catch (error) {
    console.error(`    ✗ Screenshot 2 failed: ${error.message}`);
    await page.screenshot({ 
      path: 'screenshots/screenshot-2-error.png', 
      fullPage: false 
    });
  }

  // ─── Screenshot 3: Dashboard Page State ───
  try {
    console.log('[3/3] Waiting for dashboard to fully load...');
    
    // Wait for either dashboard-page testid OR h1 to be visible
    const dashboardPage = page.locator('[data-testid="dashboard-page"]');
    const dashboardH1 = page.locator('h1');
    
    // Use Promise.race to wait for first available selector
    const dashboardVisible = await Promise.race([
      dashboardPage.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'dashboard-page'),
      dashboardH1.first().waitFor({ state: 'visible', timeout: 10000 }).then(() => 'h1')
    ]);

    console.log(`    Dashboard detected via: ${dashboardVisible}`);
    console.log('    ✓ Dashboard loaded successfully');

    await page.screenshot({ 
      path: 'screenshots/screenshot-3-dashboard.png', 
      fullPage: false 
    });
    console.log('    ✓ Screenshot saved: screenshot-3-dashboard.png\n');
  } catch (error) {
    console.error(`    ✗ Screenshot 3 failed: ${error.message}`);
    await page.screenshot({ 
      path: 'screenshots/screenshot-3-error.png', 
      fullPage: false 
    });
  }

  console.log('Screenshot capture complete.');
  console.log('Output directory:', SCREENSHOTS_DIR);
  
  await browser.close();
}

runScreenshotScript().catch((error) => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
