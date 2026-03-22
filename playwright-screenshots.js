const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  try {
    // Screenshot 1: Hero section visible — valide le nouveau texte du bouton
    console.log('[1/3] Navigating to homepage...');
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    
    const heroSection = page.locator('[data-testid="hero-section"]');
    await heroSection.waitFor({ state: 'visible', timeout: 10000 });
    
    const ctaButton = page.locator('[data-testid="hero-cta-button"]');
    await ctaButton.waitFor({ state: 'visible', timeout: 10000 });
    
    // Valide le texte du bouton
    await expect(ctaButton).toContainText('Get started for free');
    
    await page.screenshot({ path: 'screenshots/screenshot-1-hero.png', fullPage: false });
    console.log('[1/3] Screenshot saved: screenshots/screenshot-1-hero.png');

  } catch (error) {
    console.error('[1/3] Error during Screenshot 1:', error.message);
    await page.screenshot({ path: 'screenshots/screenshot-1-error.png', fullPage: false });
  }

  try {
    // Screenshot 2: CTA clicked — valide la redirection vers le dashboard
    console.log('[2/3] Clicking hero CTA button...');
    const ctaButton = page.locator('[data-testid="hero-cta-button"]');
    await ctaButton.click();
    
    // Attend que l'URL change vers le dashboard
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    
    await page.screenshot({ path: 'screenshots/screenshot-2-cta-redirect.png', fullPage: false });
    console.log('[2/3] Screenshot saved: screenshots/screenshot-2-cta-redirect.png');

  } catch (error) {
    console.error('[2/3] Error during Screenshot 2:', error.message);
    await page.screenshot({ path: 'screenshots/screenshot-2-error.png', fullPage: false });
  }

  try {
    // Screenshot 3: Dashboard reached — confirme que le redirect fonctionne
    console.log('[3/3] Verifying dashboard destination...');
    
    // Attend que la page dashboard soit complètement chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifie qu'on est bien sur /dashboard
    const currentUrl = page.url();
    if (!currentUrl.includes('/dashboard')) {
      throw new Error(`Expected URL to contain /dashboard, got: ${currentUrl}`);
    }
    
    await page.screenshot({ path: 'screenshots/screenshot-3-dashboard.png', fullPage: false });
    console.log('[3/3] Screenshot saved: screenshots/screenshot-3-dashboard.png');
    console.log('[3/3] Redirect confirmed — dashboard destination reached successfully');

  } catch (error) {
    console.error('[3/3] Error during Screenshot 3:', error.message);
    await page.screenshot({ path: 'screenshots/screenshot-3-error.png', fullPage: false });
  }

  await browser.close();
  console.log('Screenshot script completed.');
})();
