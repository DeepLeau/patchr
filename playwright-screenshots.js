const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Ensure screenshots directory exists
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Starting screenshot capture script...\n');

  // ============================================================
  // Screenshot 1: Hero section visible — validate CTA button text
  // ============================================================
  try {
    console.log('1. Navigating to homepage and waiting for hero section...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    // Wait for hero section to be visible
    const heroSection = page.locator('section, main, [class*="hero"], [class*="Hero"]').first();
    await heroSection.waitFor({ state: 'visible', timeout: 10000 });

    // Validate CTA button with exact text
    const ctaButton = page.getByRole('button', { name: 'Get started for free' });
    await expect(ctaButton).toBeVisible();

    // Additional visual validation — ensure button has visible text
    const buttonText = await ctaButton.textContent();
    if (buttonText.trim() !== 'Get started for free') {
      throw new Error(`Unexpected button text: "${buttonText}"`);
    }

    await page.screenshot({ path: 'screenshots/screenshot-1-hero.png', fullPage: false });
    console.log('   ✓ Hero section visible with CTA button "Get started for free"\n');
  } catch (error) {
    console.error(`   ✗ Screenshot 1 failed: ${error.message}\n`);
    // Continue to next screenshot even if this one fails
  }

  // ============================================================
  // Screenshot 2: Click CTA button — validate click + navigation start
  // ============================================================
  try {
    console.log('2. Clicking CTA button "Get started for free"...');

    const ctaButton = page.getByRole('button', { name: 'Get started for free' });

    // Verify button is still visible and enabled before clicking
    await expect(ctaButton).toBeEnabled();

    // Click the button
    await ctaButton.click();

    // Wait for navigation to initiate (URL change or response)
    await Promise.race([
      page.waitForURL('**/dashboard**', { timeout: 5000 }),
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 5000 })
    ]);

    // Take screenshot immediately after click to capture transition state
    await page.screenshot({ path: 'screenshots/screenshot-2-cta-click.png', fullPage: false });
    console.log('   ✓ CTA button clicked, navigation initiated\n');
  } catch (error) {
    console.error(`   ✗ Screenshot 2 failed: ${error.message}\n`);
    // Continue to next screenshot even if this one fails
  }

  // ============================================================
  // Screenshot 3: Dashboard page — validate redirection
  // ============================================================
  try {
    console.log('3. Waiting for /dashboard page...');

    // Wait for URL to contain /dashboard
    await page.waitForURL('**/dashboard**', { timeout: 10000 });

    // Verify we're on the correct page
    const currentUrl = page.url();
    if (!currentUrl.includes('/dashboard')) {
      throw new Error(`Expected URL to contain /dashboard, got: ${currentUrl}`);
    }

    // Wait for page content to be stable
    await page.waitForLoadState('domcontentloaded');

    // Take screenshot of dashboard
    await page.screenshot({ path: 'screenshots/screenshot-3-dashboard.png', fullPage: false });
    console.log(`   ✓ Redirected to /dashboard: ${currentUrl}\n`);
  } catch (error) {
    console.error(`   ✗ Screenshot 3 failed: ${error.message}\n`);
    // Continue to cleanup even if this one fails
  }

  await browser.close();
  console.log('Screenshot capture complete.');
})();
