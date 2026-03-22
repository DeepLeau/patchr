const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  // Création du dossier screenshots s'il n'existe pas
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Logging console pour diagnostic
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[Console Error] ${msg.text()}`);
    }
  });

  let exitCode = 0;

  try {
    // ============================================
    // SCREENSHOT 1: État initial page "/"
    // ============================================
    console.log('\n📸 Screenshot 1: Navigation vers la page d\'accueil (/)...');
    
    await page.goto('http://localhost:3000/', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    // Attendre un état stable - la page doit être chargée
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      console.log('⚠️ networkidle timeout - continuation avec DOM stable');
    });

    // Localiser le bouton CTA avec le texte exact 'Get started for free'
    const ctaButton = page.getByRole('button', { name: 'Get started for free' });
    
    // Attendre que le bouton soit visible (signifie que la hero section est rendue)
    await ctaButton.waitFor({ state: 'visible', timeout: 10000 });

    // Valider le texte du bouton (assertion explicite)
    const buttonText = await ctaButton.textContent();
    if (buttonText !== 'Get started for free') {
      throw new Error(`Texte du bouton inattendu: "${buttonText}" (attendu: "Get started for free")`);
    }
    console.log('✅ Texte du bouton CTA validé: "Get started for free"');

    // Prendre le screenshot de l'état initial
    const screenshot1Path = path.join(screenshotsDir, 'screenshot-1-homepage.png');
    await page.screenshot({ path: screenshot1Path, fullPage: false });
    console.log(`✅ Screenshot 1 sauvegardé: ${screenshot1Path}`);

    // ============================================
    // SCREENSHOT 2: Navigation vers /dashboard via CTA
    // ============================================
    console.log('\n📸 Screenshot 2: Clic sur le bouton CTA et navigation vers /dashboard...');

    // Clic sur le bouton CTA - démarrer la navigation
    const navigationPromise = page.waitForURL('**/dashboard**', { timeout: 15000 });
    await ctaButton.click();
    
    // Attendre que la navigation se termine
    await navigationPromise;
    console.log('✅ Navigation vers /dashboard terminée');

    // Attendre un état stable sur le dashboard
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      console.log('⚠️ networkidle timeout sur dashboard - continuation');
    });

    // Vérifier si une page de login/auth est affichée (auth requise)
    const currentUrl = page.url();
    if (currentUrl.includes('/login') || currentUrl.includes('/auth') || currentUrl.includes('signin')) {
      console.log('⚠️ Dashboard nécessite une authentification - capture de la page de login');
      
      const loginScreenshotPath = path.join(screenshotsDir, 'screenshot-2-login-required.png');
      await page.screenshot({ path: loginScreenshotPath, fullPage: false });
      console.log(`✅ Screenshot 2 (login) sauvegardé: ${loginScreenshotPath}`);
    } else {
      // Dashboard accessible directement - capture du dashboard
      const dashboardScreenshotPath = path.join(screenshotsDir, 'screenshot-2-dashboard.png');
      await page.screenshot({ path: dashboardScreenshotPath, fullPage: false });
      console.log(`✅ Screenshot 2 (dashboard) sauvegardé: ${dashboardScreenshotPath}`);
    }

    console.log('✅ Navigation validée: le clic sur le bouton redirige correctement');

  } catch (error) {
    console.error(`\n❌ Erreur durant l'exécution: ${error.message}`);
    
    // Capture d'erreur pour diagnostic
    const errorScreenshotPath = path.join(screenshotsDir, 'screenshot-error.png');
    try {
      await page.screenshot({ path: errorScreenshotPath, fullPage: false });
      console.log(`📸 Screenshot d'erreur sauvegardé: ${errorScreenshotPath}`);
    } catch (screenshotError) {
      console.log('Impossible de capturer le screenshot d\'erreur');
    }
    
    exitCode = 1;
  } finally {
    await browser.close();
    console.log('\n🔒 Navigateur fermé');
    process.exit(exitCode);
  }
})();
