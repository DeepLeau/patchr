const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const screenshots = [];

  try {
    // Navigate to dashboard
    console.log('Navigating to /dashboard...');
    await page.goto('http://localhost:3000/dashboard', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    // Screenshot 1: Wait for .charts-section to be visible
    console.log('Screenshot 1: Waiting for .charts-section...');
    try {
      const chartsSection = page.locator('.charts-section');
      await expect(chartsSection).toBeVisible({ timeout: 10000 });
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      await page.screenshot({
        path: 'screenshots/screenshot-1.png',
        fullPage: false
      });
      screenshots.push('screenshot-1.png');
      console.log('✓ Screenshot 1 captured');
    } catch (error) {
      console.error('✗ Screenshot 1 failed:', error.message);
    }

    // Screenshot 2: Focus on Vulnerability Trends chart
    console.log('Screenshot 2: Scrolling to vulnerability-trends-chart...');
    try {
      const vulnChart = page.locator('[data-testid="vulnerability-trends-chart"]');
      await vulnChart.scrollIntoViewIfNeeded();
      await expect(vulnChart).toBeVisible({ timeout: 5000 });
      // Small delay for smooth scroll completion
      await page.waitForTimeout(300);
      await page.screenshot({
        path: 'screenshots/screenshot-2.png',
        fullPage: false
      });
      screenshots.push('screenshot-2.png');
      console.log('✓ Screenshot 2 captured');
    } catch (error) {
      console.error('✗ Screenshot 2 failed:', error.message);
    }

    // Screenshot 3: Focus on Resolution Time chart
    console.log('Screenshot 3: Scrolling to resolution-time-chart...');
    try {
      const resolutionChart = page.locator('[data-testid="resolution-time-chart"]');
      await resolutionChart.scrollIntoViewIfNeeded();
      await expect(resolutionChart).toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(300);
      await page.screenshot({
        path: 'screenshots/screenshot-3.png',
        fullPage: false
      });
      screenshots.push('screenshot-3.png');
      console.log('✓ Screenshot 3 captured');
    } catch (error) {
      console.error('✗ Screenshot 3 failed:', error.message);
    }

    // Screenshot 4: Focus on Dependencies chart
    console.log('Screenshot 4: Scrolling to dependencies-chart...');
    try {
      const depsChart = page.locator('[data-testid="dependencies-chart"]');
      await depsChart.scrollIntoViewIfNeeded();
      await expect(depsChart).toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(300);
      await page.screenshot({
        path: 'screenshots/screenshot-4.png',
        fullPage: false
      });
      screenshots.push('screenshot-4.png');
      console.log('✓ Screenshot 4 captured');
    } catch (error) {
      console.error('✗ Screenshot 4 failed:', error.message);
    }

    // Screenshot 5: Focus on Severity Distribution chart
    console.log('Screenshot 5: Scrolling to severity-distribution-chart...');
    try {
      const severityChart = page.locator('[data-testid="severity-distribution-chart"]');
      await severityChart.scrollIntoViewIfNeeded();
      await expect(severityChart).toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(300);
      await page.screenshot({
        path: 'screenshots/screenshot-5.png',
        fullPage: false
      });
      screenshots.push('screenshot-5.png');
      console.log('✓ Screenshot 5 captured');
    } catch (error) {
      console.error('✗ Screenshot 5 failed:', error.message);
    }

  } catch (error) {
    console.error('Fatal error during screenshot capture:', error.message);
  } finally {
    await browser.close();
    console.log('\n--- Summary ---');
    console.log(`Screenshots captured: ${screenshots.length}/5`);
    screenshots.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
    console.log('Browser closed. Script complete.');
  }
})();
