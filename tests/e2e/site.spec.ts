import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { site } from '../../src/lib/config';

test('accueil, images, navigation et mise en page sans débordement', async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(new RegExp(site.name));
  await expect(page.locator('h1')).toContainText(site.home.title);
  await expect(page.locator('.hero-image img')).toBeVisible();
  await page.locator('.hero-image img').evaluate((img: HTMLImageElement) => img.decode());
  await page.locator('main img').evaluateAll((images) =>
    Promise.all(
      images.map(async (img) => {
        (img as HTMLImageElement).loading = 'eager';
        await (img as HTMLImageElement).decode();
      }),
    ),
  );
  await page.screenshot({
    path: `test-results/accueil-${isMobile ? 'mobile' : 'ordinateur'}.png`,
    fullPage: true,
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  if (isMobile) await page.locator('.mobile-menu summary').click();
  const navigation = page.locator(isMobile ? '.mobile-menu nav' : '.desktop-nav');
  await navigation
    .getByRole('link', {
      name: site.navigation.find((item) => item.href === '/couture/')?.label || 'Couture',
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/couture\/$/);
  expect(errors).toEqual([]);
});

test('les filtres affichent le bon ensemble et permettent de tout retrouver', async ({ page }) => {
  await page.goto('/couture/');
  const cards = page.locator('[data-category]');
  const count = await cards.count();
  test.skip(count === 0, 'Aucune création publiée dans cette collection.');
  const category = await cards.first().getAttribute('data-category');
  await page.getByRole('button', { name: category!, exact: true }).click();
  await expect(page.getByRole('button', { name: category!, exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const visible = cards.filter({ visible: true });
  for (const card of await visible.all())
    await expect(card).toHaveAttribute('data-category', category!);
  await expect(page.locator('[data-result-count]')).toHaveText(String(await visible.count()));
  await page.getByRole('button', { name: site.ui.filterAll, exact: true }).click();
  await expect(cards.filter({ visible: true })).toHaveCount(count);
});

test('une création ouvre une galerie navigable au clavier et restitue le focus', async ({
  page,
}) => {
  await page.goto('/couture/');
  const first = page.locator('.card-title').first();
  test.skip((await first.count()) === 0, 'Aucune création publiée.');
  await first.click();
  const images = page.locator('.detail-gallery [data-gallery-open]');
  const count = await images.count();
  await images.first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('img')).toHaveAttribute(
    'alt',
    (await images.first().getAttribute('data-alt')) || '',
  );
  if (count > 1) {
    await page.keyboard.press('ArrowRight');
    await expect(dialog.locator('[data-lightbox-counter]')).toHaveText(`2 / ${count}`);
    await page.keyboard.press('ArrowLeft');
    await expect(dialog.locator('[data-lightbox-counter]')).toHaveText(`1 / ${count}`);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(images.first()).toBeFocused();
});

test('les dessins peuvent être agrandis depuis la galerie', async ({ page }) => {
  await page.goto('/dessin/');
  const button = page.locator('[data-gallery-open]').first();
  test.skip((await button.count()) === 0, 'Aucun dessin publié.');
  await button.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: site.ui.close, exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('le partage copie l’URL de la création avec un repli sans partage natif', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true }),
  );
  await page.goto('/dessin/');
  const first = page.locator('.card-title').first();
  test.skip((await first.count()) === 0, 'Aucun dessin publié.');
  await first.click();
  await page.getByRole('button', { name: site.ui.share, exact: true }).click();
  await expect(page.locator('[data-share-status]')).toHaveText(site.ui.linkCopied);
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());
});

test('le contact valide les champs puis prépare le message avec la création', async ({ page }) => {
  await page.goto('/contact/?creation=Une%20robe%20f%C3%A9%C3%A9rique');
  const button = page.getByRole('button', { name: site.contact.submit, exact: true });
  await button.click();
  await expect(page.locator('[data-draft]')).toBeHidden();
  await page.getByLabel(site.contact.nameLabel, { exact: false }).fill('Élodie');
  await page.getByLabel(site.contact.emailLabel, { exact: false }).fill('elodie@example.org');
  await page.locator('#message').fill('Bonjour, une robe en lin & des boutons en bois ?');
  // Intercepte la demande de messagerie lorsque l’artiste aura renseigné son adresse.
  await page.route('mailto:**', (route) => route.abort());
  await button.click();
  await expect(page.locator('[data-draft]')).toBeVisible();
  await expect(page.locator('[data-draft-text]')).toHaveValue(/Élodie/);
  await expect(page.locator('[data-draft-text]')).toHaveValue(/Une robe féérique/);
  await expect(page.locator('[data-draft-text]')).toHaveValue(/lin & des boutons/);
  if (!site.contact.email)
    await expect(page.locator('[data-inquiry-status]')).toHaveText(site.contact.unavailable);
});

test('une copie indisponible propose un texte sélectionnable', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true }),
  );
  await page.goto('/contact/');
  await page.locator('#name').fill('Camille');
  await page.locator('#email').fill('camille@example.org');
  await page.locator('#message').fill('Une illustration botanique.');
  await page.route('mailto:**', (route) => route.abort());
  await page.getByRole('button', { name: site.contact.submit, exact: true }).click();
  await page.getByRole('button', { name: site.contact.copy, exact: true }).click();
  await expect(page.locator('[data-inquiry-status]')).toHaveText(site.contact.copyError);
  await expect(page.locator('[data-draft-text]')).toBeFocused();
});

for (const path of ['/', '/couture/', '/dessin/', '/contact/', '/atelier/'])
  test(`accessibilité WCAG A/AA : ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });

test('le contenu reste accessible sans JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/couture/`);
  await expect(page.locator('h1')).toHaveText(site.collections.couture.title);
  await expect(page.locator('[data-filters]')).toBeHidden();
  await page.goto(`${baseURL}/contact/`);
  await expect(page.getByRole('button', { name: site.contact.submit, exact: true })).toBeDisabled();
  await expect(page.locator('noscript .form-notice')).toHaveText(site.contact.noScript);
  await expect(page.locator('noscript .form-notice')).toBeVisible();
  await context.close();
});

test('les pages absentes ont une vraie réponse 404', async ({ page }) => {
  const response = await page.goto('/un-sentier-inexistant/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText(site.notFound.title);
});
