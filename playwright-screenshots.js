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

  const baseUrl = 'http://localhost:3000';

  console.log('Starting screenshot capture...\n');

  // ============================================
  // SCREENSHOT 1: Hero Section - CTA Button Copy
  // ============================================
  try {
    console.log('[1/3] Navigating to homepage to capture hero section...');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    
    // Wait for hero section to be visible using accessible selector
    const heroSection = page.locator('section, div').filter({ hasText: /hero|welcome|get started/i }).first();
    await heroSection.waitFor({ state: 'visible', timeout: 10000 });
    
    // Assert button text is 'Get started for free'
    const ctaButton = page.getByRole('button', { name: /get started for free/i });
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveText(/get started for free/i);
    
    console.log('[1/3] CTA button text verified: "Get started for free"');
    
    // Capture screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'screenshot-1-hero-cta.png'),
      fullPage: false 
    });
    console.log('[1/3] Screenshot saved: screenshot-1-hero-cta.png\n');

  } catch (error) {
    console.error('[1/3] ERROR:', error.message);
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'screenshot-1-error.png'),
      fullPage: false 
    });
  }

  // ============================================
  // SCREENSHOT 2: CTA Click - Dashboard Redirect
  // ============================================
  try {
    console.log('[2/3] Clicking CTA button to verify redirect...');
    
    const ctaButton = page.getByRole('button', { name: /get started for free/i });
    await ctaButton.click();
    
    // Wait for URL to contain /dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    console.log('[2/3] Redirect verified: URL contains /dashboard');
    
    // Wait for page to be stable after navigation
    await page.waitForLoadState('domcontentloaded');
    
    // Capture screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'screenshot-2-redirect-dashboard.png'),
      fullPage: false 
    });
    console.log('[2/3] Screenshot saved: screenshot-2-redirect-dashboard.png\n');

  } catch (error) {
    console.error('[2/3] ERROR:', error.message);
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'screenshot-2-error.png'),
      fullPage: false 
    });
  }

  // ============================================
  // SCREENSHOT 3: Dashboard Page Load
  // ============================================
  try {
    console.log('[3/3] Verifying dashboard page is fully loaded...');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the dashboard
    const currentUrl = page.url();
    if (!currentUrl.includes('/dashboard')) {
      throw new Error(`Expected to be on /dashboard, but on: ${currentUrl}`);
    }
    console.log('[3/3] Dashboard URL confirmed');
    
    // Wait for main dashboard content to be visible
    const dashboardContent = page.locator('main, [role="main"], section, div').first();
    await dashboardContent.waitFor({ state: 'visible', timeout: 10000 });
    
    // Capture screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'screenshot-3-dashboard-loaded.png'),
      fullPage: false 
    });
    console.log('[3/3] Screenshot saved: screenshot-3-dashboard-loaded.png\n');

  } catch (error) {
    console.error('[3/3] ERROR:', error.message);
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'screenshot-3-error.png'),
      fullPage: false 
    });
  }

  // Cleanup
  await browser.close();
  console.log('Screenshot capture completed!');
  console.log(`Screenshots saved to: ${screenshotsDir}`);
}

runScreenshots().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
