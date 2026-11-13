import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { site } from '../../src/lib/config';
import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';

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

test('le logo et le nom de la créatrice sont présents dans l’en-tête et le pied de page', async ({
  page,
}) => {
  await page.goto('/');
  for (const area of ['.site-header', '.site-footer']) {
    const brand = page.locator(`${area} .brand`);
    await expect(brand).toHaveAccessibleName(
      `${site.name} ${site.logo.tagline} — ${site.ui.home}`,
    );
    await expect(brand).toHaveAttribute('href', '/');
    await expect(brand.locator('.brand-name')).toHaveText(site.name);
    await expect(brand.locator('.brand-tagline')).toHaveText(site.logo.tagline);
    if (site.logo.src) {
      const logo = brand.locator('img');
      await expect(logo).toHaveAttribute('src', site.logo.src);
      await expect(logo).toHaveAttribute('alt', site.logo.alt);
      await expect(logo).toBeVisible();
      await logo.evaluate((img: HTMLImageElement) => img.decode());
    } else {
      await expect(brand.locator('img')).toHaveCount(0);
    }
  }
});

for (const kind of ['couture', 'dessin'] as const)
  test(`le catalogue ${kind} affiche toutes les créations sans filtre`, async ({ page }) => {
    await page.goto(`/${kind}/`);
    const cards = page.locator('.collection-grid .creation-card');
    const count = await cards.count();
    await expect(page.locator('[data-filter], [data-filters], .filter-list')).toHaveCount(0);
    await expect(page.locator('.collection-toolbar, [data-result-count]')).toHaveCount(0);
    await expect(cards.filter({ visible: true })).toHaveCount(count);
    await expect(page.locator('.empty-state')).toBeVisible({ visible: count === 0 });
    for (const card of await cards.all()) {
      await expect(card.locator('.card-title')).toHaveAttribute(
        'href',
        new RegExp(`^/${kind}/.+/$`),
      );
      await expect(card.locator('.card-meta span').first()).not.toBeEmpty();
    }
    // Le menu mobile n’est pas déployé : aucun bouton de catégorie n’est présent.
    await expect(page.locator('.collection-section button:not([data-gallery-open])')).toHaveCount(
      0,
    );
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
  for (const kind of ['couture', 'dessin'] as const) {
    await page.goto(`${baseURL}/${kind}/`);
    await expect(page.locator('h1')).toHaveText(site.collections[kind].title);
    await expect(page.locator('[data-filter], [data-filters]')).toHaveCount(0);
    const cards = page.locator('.collection-grid .creation-card');
    await expect(cards.filter({ visible: true })).toHaveCount(await cards.count());
    await expect(page.locator('.collection-toolbar, [data-result-count]')).toHaveCount(0);
  }
  await page.goto(`${baseURL}/contact/`);
  await expect(page.getByRole('button', { name: site.contact.submit, exact: true })).toBeDisabled();
  await expect(page.locator('noscript .form-notice')).toHaveText(site.contact.noScript);
  await expect(page.locator('noscript .form-notice')).toBeVisible();
  await context.close();
});

test('le logo et le menu restent séparés sur petit écran', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  const brand = await page.locator('.site-header .brand').boundingBox();
  const menu = await page.locator('.mobile-menu summary').boundingBox();
  expect(brand).not.toBeNull();
  expect(menu).not.toBeNull();
  expect(brand!.x + brand!.width).toBeLessThanOrEqual(menu!.x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.locator('.mobile-menu summary').click();
  await expect(page.locator('.mobile-menu nav')).toBeVisible();
});

test('les pages absentes ont une vraie réponse 404', async ({ page }) => {
  const response = await page.goto('/un-sentier-inexistant/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText(site.notFound.title);
});

for (const [kind, id] of [
  ['couture', 'carnet-de-matieres'],
  ['dessin', 'feuilles-vagabondes'],
] as const) {
  test(`une fiche minimale ${kind} affiche ses images sans métadonnées inventées`, async ({
    page,
  }) => {
    const file = `src/content/${kind}/${id}.md`;
    test.skip(!existsSync(file), 'Exemple minimal remplacé par la créatrice.');
    const source = readFileSync(file, 'utf8');
    const data = parse(/^---\n([\s\S]*?)\n---/.exec(source)![1]);
    test.skip(
      Boolean(data.draft || data.date || data.description || data.category || data.images[0].alt),
      'Exemple enrichi depuis sa livraison.',
    );
    await page.goto(`/${kind}/`);
    const card = page
      .locator('.creation-card')
      .filter({ has: page.locator(`a[href="/${kind}/${id}/"].card-title`) });
    await expect(card.locator('.card-description')).toHaveCount(0);
    await expect(card.locator('.card-meta span')).toHaveText([data.technique]);
    if (kind === 'dessin') {
      await card.locator('[data-gallery-open]').click();
      await expect(page.locator('[data-lightbox-image]')).toHaveAttribute('alt', data.title);
      await page.keyboard.press('Escape');
    }
    await card.locator('.card-title').click();
    await expect(page.locator('h1')).toHaveText(data.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      site.description,
    );
    await expect(page.locator('.detail-heading p:not(.eyebrow)')).toHaveCount(0);
    await expect(page.locator('.creation-story > .eyebrow, .creation-story > .prose')).toHaveCount(
      0,
    );
    await expect(page.locator('.creation-facts dt')).toHaveText(
      kind === 'couture'
        ? [site.ui.technique, site.ui.cut, site.ui.materials]
        : [site.ui.technique],
    );
    const image = page.locator('.detail-gallery img').first();
    await expect(image).toHaveAttribute('src', data.images[0].src);
    await expect(image).toHaveAttribute('alt', data.title);
    await expect(image).not.toHaveAttribute('width');
    await expect(image).not.toHaveAttribute('height');
    await image.evaluate((img: HTMLImageElement) => img.decode());
    await expect(page.locator('.detail-gallery figcaption')).toHaveCount(0);
    await page.locator('.detail-gallery [data-gallery-open]').first().click();
    await expect(page.locator('[data-lightbox-image]')).toHaveAttribute('alt', data.title);
    await expect(page.locator('[data-lightbox-caption]')).toHaveText(data.title);
    await page.keyboard.press('Escape');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test('le thème or poli utilise des fleurs et papillons et respecte la réduction des animations', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('[data-motif="flower"]').first()).toBeVisible();
  await expect(page.locator('[data-motif="butterfly"]').first()).toBeVisible();
  await expect(page.locator('.demo-notice')).toHaveCount(site.demoMode ? 1 : 0);
  for (const path of ['/', '/contact/', '/atelier/']) {
    await page.goto(path);
    await expect(page.locator('main')).not.toContainText(/[✧✦✴★]/);
  }
  await page.goto('/');
  const button = page.locator('.hero .button');
  expect(await button.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain(
    'linear-gradient',
  );
  const frame = page.locator('.card-image-wrap').first();
  if (await frame.count())
    expect(await frame.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain(
      'linear-gradient',
    );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await button.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe(
    '0s',
  );
});
