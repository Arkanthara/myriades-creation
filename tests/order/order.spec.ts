import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { customOrder, site } from '../../src/lib/config';
test('active la page, valide les mesures et les intègre dans la demande', async ({ page }) => {
  await page.goto('/sur-mesure/');
  await expect(page.locator('h1')).toHaveText(customOrder.title);
  await page.locator('#name').fill('Zoé');
  await page.locator('#email').fill('zoe@example.org');
  const first = customOrder.measurements[0];
  if (first) {
    await page.locator(`#measure-${first.id}`).fill(String(first.max + 1));
    await page.getByRole('button', { name: customOrder.submit, exact: true }).click();
    await expect(page.locator('[data-draft]')).toBeHidden();
    await page.locator(`#measure-${first.id}`).fill(String(first.min + 1));
  }
  for (const field of customOrder.measurements.filter((field) => field.required))
    await page.locator(`#measure-${field.id}`).fill(String(field.min + 1));
  const choice = customOrder.options[0];
  if (choice) await page.locator(`#option-${choice.id}`).selectOption(choice.choices.at(-1)!);
  await page.locator('#message').fill('Une doublure rose et des poches.');
  await page.route('mailto:**', (route) => route.abort());
  await page.getByRole('button', { name: customOrder.submit, exact: true }).click();
  const body = await page.locator('[data-draft-text]').inputValue();
  expect(body).toContain('Zoé');
  if (first) expect(body).toContain(`${first.label} : ${first.min + 1} ${customOrder.unit}`);
  if (choice) expect(body).toContain(`${choice.label} : ${choice.choices.at(-1)}`);
  expect(body).toContain('Une doublure rose et des poches.');
  if (!site.contact.email)
    await expect(page.locator('[data-inquiry-status]')).toHaveText(site.contact.unavailable);
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
});
