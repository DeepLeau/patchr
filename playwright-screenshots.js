const { chromium } = require('@playwright/test');
const path = require('path');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Enable console logging for debugging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`Console error: ${msg.text()}`);
    }
  });

  // Create screenshots directory if not exists
  const fs = require('fs');
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const baseUrl = 'http://localhost:3000';

  console.log('Starting screenshot capture...');

  // === Screenshot 1: Dashboard principal ===
  try {
    console.log('\n[Screenshot 1/3] Navigating to /dashboard...');
    await page.goto(`${baseUrl}/dashboard`, { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });

    // Wait for charts to be visible - look for canvas (chart.js) or SVG charts
    console.log('Waiting for charts to render...');
    
    // Try multiple selectors for robustness
    const chartSelectors = [
      'canvas[data-testid="area-chart"]',
      'canvas[data-testid="bar-chart"]',
      'canvas[data-testid="pie-chart"]',
      'canvas[data-testid="line-chart"]',
      'canvas',
      '[data-testid="stat-card"]',
      '[class*="chart"]',
      'svg.recharts-surface'
    ];

    let chartsVisible = false;
    for (const selector of chartSelectors) {
      try {
        const element = page.locator(selector).first();
        await element.waitFor({ state: 'visible', timeout: 5000 });
        console.log(`Charts found with selector: ${selector}`);
        chartsVisible = true;
        break;
      } catch {
        // Try next selector
      }
    }

    if (!chartsVisible) {
      // Fallback: wait for network to be idle and any chart element
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      const anyChart = page.locator('canvas, svg.recharts-surface, [class*="chart"]').first();
      await anyChart.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    }

    // Additional wait for animations/rendering to complete
    await page.waitForLoadState('networkidle').catch(() => {});
    
    // Small delay for final render
    await page.waitForFunction(() => document.querySelector('canvas, svg') !== null, { timeout: 5000 }).catch(() => {});

    console.log('Charts visible, capturing screenshot...');
    await page.screenshot({ 
      path: 'screenshots/screenshot-1-dashboard.png', 
      fullPage: false 
    });
    console.log('Screenshot 1 saved: screenshots/screenshot-1-dashboard.png');

  } catch (error) {
    console.error('Screenshot 1 failed:', error.message);
    await page.screenshot({ 
      path: 'screenshots/screenshot-1-error.png', 
      fullPage: false 
    }).catch(() => {});
  }

  // === Screenshot 2: Security page ===
  try {
    console.log('\n[Screenshot 2/3] Navigating to /dashboard/security...');
    await page.goto(`${baseUrl}/dashboard/security`, { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });

    // Wait for SecurityAlerts component to be visible
    console.log('Waiting for SecurityAlerts to render...');
    
    const securitySelectors = [
      '[data-testid="security-alerts"]',
      '[data-testid="security-alerts-component"]',
      '[class*="security-alerts"]',
      '[class*="SecurityAlerts"]',
      '[role="region"][aria-label*="security" i]',
      '[role="alert"]'
    ];

    let securityVisible = false;
    for (const selector of securitySelectors) {
      try {
        const element = page.locator(selector).first();
        await element.waitFor({ state: 'visible', timeout: 5000 });
        console.log(`SecurityAlerts found with selector: ${selector}`);
        securityVisible = true;
        break;
      } catch {
        // Try next selector
      }
    }

    if (!securityVisible) {
      // Fallback: wait for page content
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      // Look for any alert-like content
      const alertContent = page.locator('h1, h2, [class*="alert"], [class*="security"]').first();
      await alertContent.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    }

    await page.waitForLoadState('networkidle').catch(() => {});
    
    console.log('Security page loaded, capturing screenshot...');
    await page.screenshot({ 
      path: 'screenshots/screenshot-2-security.png', 
      fullPage: false 
    });
    console.log('Screenshot 2 saved: screenshots/screenshot-2-security.png');

  } catch (error) {
    console.error('Screenshot 2 failed:', error.message);
    await page.screenshot({ 
      path: 'screenshots/screenshot-2-error.png', 
      fullPage: false 
    }).catch(() => {});
  }

  // === Screenshot 3: Analytics page ===
  try {
    console.log('\n[Screenshot 3/3] Navigating to /dashboard/analytics...');
    await page.goto(`${baseUrl}/dashboard/analytics`, { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });

    // Wait for page content to load
    console.log('Waiting for analytics page content...');
    
    // Wait for any main content element
    await page.waitForLoadState('networkidle').catch(() => {});
    
    const analyticsSelectors = [
      '[data-testid="analytics-content"]',
      '[data-testid="analytics-page"]',
      'canvas[data-testid*="chart"]',
      'svg.recharts-surface',
      '[class*="analytics"]',
      'main',
      'h1',
      'h2'
    ];

    for (const selector of analyticsSelectors) {
      try {
        const element = page.locator(selector).first();
        await element.waitFor({ state: 'visible', timeout: 3000 });
        console.log(`Analytics content found with selector: ${selector}`);
        break;
      } catch {
        // Try next selector
      }
    }

    // Additional stabilization
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForFunction(() => document.readyState === 'complete', { timeout: 5000 }).catch(() => {});

    console.log('Analytics page loaded, capturing screenshot...');
    await page.screenshot({ 
      path: 'screenshots/screenshot-3-analytics.png', 
      fullPage: false 
    });
    console.log('Screenshot 3 saved: screenshots/screenshot-3-analytics.png');

  } catch (error) {
    console.error('Screenshot 3 failed:', error.message);
    await page.screenshot({ 
      path: 'screenshots/screenshot-3-error.png', 
      fullPage: false 
    }).catch(() => {});
  }

  // Cleanup
  await browser.close();
  console.log('\nScreenshot capture complete!');
  console.log('Output: screenshots/screenshot-{1-3}-{name}.png');
}

captureScreenshots().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
