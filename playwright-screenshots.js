const { chromium, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function takeScreenshots() {
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
    // ═══════════════════════════════════════════════════════════════
    // SCREENSHOT 1: Hero section on home page
    // ═══════════════════════════════════════════════════════════════
    console.log('[Screenshot 1] Navigating to home page...');

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    // Wait for hero section h1 to be visible (stable state indicator)
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toBeVisible({ timeout: 10000 });

    // Validate CTA button text
    const ctaButton = page.getByRole('button', { name: 'Get started for free' });
    await expect(ctaButton).toBeVisible({ timeout: 5000 });

    // Take screenshot of hero section
    await page.screenshot({
      path: path.join(screenshotsDir, 'screenshot-1.png'),
      fullPage: false
    });
    console.log('[Screenshot 1] ✓ Captured: Hero section with CTA button');

    // ═══════════════════════════════════════════════════════════════
    // SCREENSHOT 2: Dashboard after CTA navigation
    // ═══════════════════════════════════════════════════════════════
    console.log('[Screenshot 2] Clicking CTA and waiting for dashboard...');

    await ctaButton.click();

    // Wait for URL to contain /dashboard (navigation milestone)
    await page.waitForURL('**/dashboard**', { timeout: 10000 });

    // Take screenshot of dashboard
    await page.screenshot({
      path: path.join(screenshotsDir, 'screenshot-2.png'),
      fullPage: false
    });
    console.log('[Screenshot 2] ✓ Captured: Dashboard page after navigation');

  } catch (error) {
    console.error('[ERROR]', error.message);
    // Capture error state screenshot if possible
    try {
      await page.screenshot({
        path: path.join(screenshotsDir, 'screenshot-error.png'),
        fullPage: false
      });
      console.log('[ERROR] Captured error state screenshot');
    } catch {
      // Ignore screenshot errors during catch
    }
  } finally {
    await browser.close();
    console.log('[Done] Browser closed');
  }
}

takeScreenshots();
