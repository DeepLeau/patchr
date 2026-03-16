const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Helper function to capture screenshot safely
    const captureScreenshot = async (testId, filename) => {
      try {
        console.log(`Waiting for [data-testid='${testId}'] to be visible...`);
        const locator = page.locator(`[data-testid="${testId}"]`);
        
        // Wait for the element to be visible in the DOM
        await locator.waitFor({ state: 'visible', timeout: 10000 });
        
        // Scroll element into view to ensure it's rendered correctly in the viewport
        await locator.scrollIntoViewIfNeeded();

        console.log(`Capturing screenshot: ${filename}`);
        await page.screenshot({ path: `screenshots/${filename}`, fullPage: false });
      } catch (error) {
        console.error(`Failed to capture ${filename}:`, error.message);
      }
    };

    // Screenshot 1: Hero Section
    await captureScreenshot('hero-section', 'screenshot-1.png');

    // Screenshot 2: Features Section
    await captureScreenshot('features-section', 'screenshot-2.png');

    // Screenshot 3: Pricing Section
    await captureScreenshot('pricing-section', 'screenshot-3.png');

    // Screenshot 4: CTA Section
    await captureScreenshot('cta-section', 'screenshot-4.png');

  } catch (error) {
    console.error('Global script error:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
