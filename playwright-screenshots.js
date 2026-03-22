const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  // Création du dossier screenshots s'il n'existe pas
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  console.log('=== Script de Screenshots - Hero CTA Flow ===\n');

  try {
    // ─────────────────────────────────────────────────────────────
    // SCREENSHOT 1: Page d'accueil - Hero section visible
    // Jalon initial : valide que le hero est rendu avec le nouveau texte du bouton
    // ─────────────────────────────────────────────────────────────
    try {
      console.log('Screenshot 1: Navigation vers la page d\'accueil...');
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

      console.log('  → Attente du hero section [data-testid="hero-section"]...');
      const heroSection = page.locator('[data-testid="hero-section"]');
      await heroSection.waitFor({ state: 'visible', timeout: 10000 });

      // Valider le texte du bouton 'Get started for free'
      const ctaButton = page.locator('[data-testid="hero-cta-button"]');
      await expect(ctaButton).toContainText('Get started for free');

      await page.screenshot({ path: 'screenshots/screenshot-1-hero-section.png', fullPage: false });
      console.log('  ✓ Screenshot 1 capturé: screenshots/screenshot-1-hero-section.png\n');
    } catch (err) {
      console.error('  ✗ Erreur Screenshot 1:', err.message);
      await page.screenshot({ path: 'screenshots/screenshot-1-error.png', fullPage: false });
    }

    // ─────────────────────────────────────────────────────────────
    // SCREENSHOT 2: Clic sur le bouton CTA - Déclenche la navigation
    // Action principale : valide que le clic déclenche la navigation
    // ─────────────────────────────────────────────────────────────
    try {
      console.log('Screenshot 2: Clic sur [data-testid="hero-cta-button"]...');
      const ctaButton = page.locator('[data-testid="hero-cta-button"]');
      await ctaButton.click();

      console.log('  → Attente de la navigation vers /dashboard...');
      await page.waitForURL('**/dashboard', { timeout: 10000 });

      await page.screenshot({ path: 'screenshots/screenshot-2-after-cta-click.png', fullPage: false });
      console.log('  ✓ Screenshot 2 capturé: screenshots/screenshot-2-after-cta-click.png\n');
    } catch (err) {
      console.error('  ✗ Erreur Screenshot 2:', err.message);
      await page.screenshot({ path: 'screenshots/screenshot-2-error.png', fullPage: false });
    }

    // ─────────────────────────────────────────────────────────────
    // SCREENSHOT 3: Page /dashboard - Redirection validée
    // Jalon final : valide que la redirection vers /dashboard fonctionne
    // ─────────────────────────────────────────────────────────────
    try {
      console.log('Screenshot 3: Vérification de la page /dashboard...');

      // Confirmer que l'URL contient /dashboard
      const currentUrl = page.url();
      if (!currentUrl.includes('/dashboard')) {
        throw new Error(`URL attendue contenir /dashboard, obtenue: ${currentUrl}`);
      }
      console.log(`  → URL validée: ${currentUrl}`);

      // Attendre un état stable sur la page dashboard
      await page.waitForLoadState('domcontentloaded');

      await page.screenshot({ path: 'screenshots/screenshot-3-dashboard.png', fullPage: false });
      console.log('  ✓ Screenshot 3 capturé: screenshots/screenshot-3-dashboard.png\n');
    } catch (err) {
      console.error('  ✗ Erreur Screenshot 3:', err.message);
      await page.screenshot({ path: 'screenshots/screenshot-3-error.png', fullPage: false });
    }

    console.log('=== Script terminé avec succès ===');

  } catch (error) {
    console.error('\n=== Erreur globale ===', error.message);
    try {
      await page.screenshot({ path: 'screenshots/screenshot-global-error.png', fullPage: false });
    } catch (e) {}
  } finally {
    await browser.close();
  }
})();
