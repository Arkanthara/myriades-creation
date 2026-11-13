import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { creationSchema, drawingSchema } from '../../src/lib/content-schema';
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
  technique: 'Broderie',
  cut: 'Carrée',
  materials: ['Lin'],
  images: [{ src: '/images/fleur.webp' }],
};
const drawing = {
  title: 'Une fleur dessinée',
  technique: 'Aquarelle',
  images: [{ src: '/images/fleur.webp' }],
};
it('accepte les seules informations obligatoires de chaque collection', () => {
  for (const [schema, input] of [
    [creationSchema, valid],
    [drawingSchema, drawing],
  ] as const) {
    const data = schema.parse(input);
    expect(data.draft).toBe(false);
    expect(data.demo).toBe(false);
    expect(data.featured).toBe(false);
    expect(data.order).toBe(100);
    expect(data.description).toBeUndefined();
    expect(data.category).toBeUndefined();
    expect(data.date).toBeUndefined();
    expect(data.images[0]).toEqual({ src: '/images/fleur.webp', position: 'center' });
  }
  expect(drawingSchema.parse(drawing).materials).toEqual([]);
  expect(drawingSchema.parse(drawing).cut).toBeUndefined();
});
it.each(['title', 'technique', 'cut', 'materials', 'images'])(
  'exige %s pour la couture',
  (field) => {
    const input: Record<string, unknown> = { ...valid };
    delete input[field];
    expect(creationSchema.safeParse(input).success).toBe(false);
  },
);
it.each(['title', 'technique', 'images'])('exige %s pour les dessins', (field) => {
  const input: Record<string, unknown> = { ...drawing };
  delete input[field];
  expect(drawingSchema.safeParse(input).success).toBe(false);
});
it('refuse les champs obligatoires vides ou composés d’espaces', () => {
  for (const field of ['title', 'technique', 'cut']) {
    for (const value of ['', '   '])
      expect(creationSchema.safeParse({ ...valid, [field]: value }).success).toBe(false);
  }
  for (const materials of [[], [''], ['  ']])
    expect(creationSchema.safeParse({ ...valid, materials }).success).toBe(false);
  for (const field of ['title', 'technique'])
    expect(drawingSchema.safeParse({ ...drawing, [field]: '  ' }).success).toBe(false);
});
it('exige au moins une image avec une source pour les deux collections', () => {
  for (const [schema, input] of [
    [creationSchema, valid],
    [drawingSchema, drawing],
  ] as const) {
    for (const images of [[], [{}], [{ src: '' }], [{ src: '/images/ok.webp' }, {}]])
      expect(schema.safeParse({ ...input, images }).success).toBe(false);
  }
});
it('accepte les métadonnées facultatives et un texte alternatif vide explicite', () => {
  const data = creationSchema.parse({
    ...valid,
    description: '',
    category: '',
    date: '2026-01-01',
    order: 1,
    featured: true,
    draft: true,
    demo: true,
    images: [
      {
        src: '/images/fleur.webp',
        alt: '',
        caption: '',
        width: 800,
        height: 1000,
        position: 'top',
      },
    ],
  });
  expect(data.date).toBeInstanceOf(Date);
  expect(data.images[0].alt).toBe('');
  expect(data.draft).toBe(true);
  expect(data.demo).toBe(true);
  expect(drawingSchema.safeParse({ ...drawing, materials: [], cut: '' }).success).toBe(true);
});
it('valide les métadonnées facultatives lorsqu’elles sont fournies', () => {
  expect(creationSchema.safeParse({ ...valid, date: 'hier' }).success).toBe(false);
  expect(creationSchema.safeParse({ ...valid, description: 'a'.repeat(301) }).success).toBe(false);
  for (const metadata of [{ width: 0 }, { height: -1 }, { width: 1.5 }, { position: 'invalide' }])
    expect(
      creationSchema.safeParse({ ...valid, images: [{ ...valid.images[0], ...metadata }] }).success,
    ).toBe(false);
});
it.each(['couture', 'dessin'] as const)('valide le modèle minimal %s fourni', (kind) => {
  const content = readFileSync(`src/content/${kind}/_exemple-minimal.md`, 'utf8');
  const input = parse(/^---\n([\s\S]*?)\n---/.exec(content)![1]);
  const schema = kind === 'couture' ? creationSchema : drawingSchema;
  const data = schema.parse(input);
  expect(data.demo).toBe(false);
  expect(data.draft).toBe(false);
  expect(Object.keys(input).sort()).toEqual(
    (kind === 'couture'
      ? ['title', 'technique', 'cut', 'materials', 'images']
      : ['title', 'technique', 'images']
    ).sort(),
  );
});
it('désactive le mode démo global par défaut', () => {
  const { demoMode, ...config } = site;
  expect(siteSchema.parse(config).demoMode).toBe(false);
  expect(demoMode).toBe(false);
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

it('accepte un logo local personnalisé ou le nom seul, et refuse un logo externe', () => {
  for (const src of ['', '/images/mon-logo.svg', '/images/mon-logo.png']) {
    expect(siteSchema.safeParse({ ...site, logo: { ...site.logo, src } }).success).toBe(true);
  }
  for (const src of [
    'https://example.org/logo.svg',
    '//example.org/logo.svg',
    'javascript:alert(1)',
  ]) {
    expect(siteSchema.safeParse({ ...site, logo: { ...site.logo, src } }).success).toBe(false);
  }
  expect(siteSchema.safeParse({ ...site, logo: { ...site.logo, alt: '' } }).success).toBe(false);
});

it('valide les quatre nuances du matériau or et refuse une couleur invalide', () => {
  for (const key of ['gold', 'goldLight', 'goldShadow', 'goldHighlight']) {
    expect(
      themeSchema.safeParse({ ...theme, colors: { ...theme.colors, [key]: 'or' } }).success,
    ).toBe(false);
  }
});
