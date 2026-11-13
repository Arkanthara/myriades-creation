import { it, expect } from 'vitest';
import { creationSchema } from '../../src/lib/content-schema';
import {
  orderSchema,
  site,
  siteSchema,
  customOrder,
  theme,
  themeSchema,
} from '../../src/lib/config';
const valid = {
  title: 'Une fleur',
  description: 'Une petite fleur.',
  category: 'Broderie',
  date: '2026-01-01',
  technique: 'Broderie',
  images: [{ src: '/images/fleur.webp', alt: 'Une fleur rose brodée.' }],
};
it('valide les contenus et attribue les valeurs éditoriales par défaut', () => {
  const data = creationSchema.parse(valid);
  expect(data.draft).toBe(false);
  expect(data.date).toBeInstanceOf(Date);
  expect(data.images[0].position).toBe('center');
});
it('refuse une galerie vide, un texte alternatif vide et une date invalide', () => {
  expect(creationSchema.safeParse({ ...valid, images: [] }).success).toBe(false);
  expect(
    creationSchema.safeParse({ ...valid, images: [{ src: '/images/fleur.webp', alt: '' }] })
      .success,
  ).toBe(false);
  expect(creationSchema.safeParse({ ...valid, date: 'hier' }).success).toBe(false);
});
it('refuse les images externes et les protocoles actifs dans la configuration', () => {
  expect(
    creationSchema.safeParse({
      ...valid,
      images: [{ src: 'https://example.org/image.jpg', alt: 'test' }],
    }).success,
  ).toBe(false);
  expect(
    siteSchema.safeParse({ ...site, socials: [{ label: 'Test', url: 'javascript:alert(1)' }] })
      .success,
  ).toBe(false);
});
it('valide les couleurs et les limites de mise en page', () => {
  expect(themeSchema.safeParse(theme).success).toBe(true);
  expect(
    themeSchema.safeParse({ ...theme, colors: { ...theme.colors, ink: 'rouge' } }).success,
  ).toBe(false);
});
it('refuse les champs sur mesure en double et les intervalles inversés', () => {
  expect(
    orderSchema.safeParse({
      ...customOrder,
      measurements: [...customOrder.measurements, customOrder.measurements[0]],
    }).success,
  ).toBe(false);
  expect(
    orderSchema.safeParse({
      ...customOrder,
      measurements: [{ ...customOrder.measurements[0], min: 150, max: 30 }],
    }).success,
  ).toBe(false);
  expect(
    orderSchema.safeParse({
      ...customOrder,
      options: [{ id: 'notes', label: 'Notes', choices: ['Test'] }],
    }).success,
  ).toBe(false);
});
