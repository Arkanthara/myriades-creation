import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';

const text = z.string().min(1);
const strings = <T extends readonly string[]>(keys: T) =>
  z.object(Object.fromEntries(keys.map((key) => [key, text])) as Record<T[number], typeof text>);
const localPath = z.string().regex(/^\/(?!\/)[^?#]*$/);
const publicUrl = z
  .url()
  .refine(
    (value) => ['https:', 'http:'].includes(new URL(value).protocol),
    'Utiliser une adresse http(s).',
  );
export const siteSchema = z.object({
  name: text,
  url: publicUrl,
  description: text,
  locale: text,
  language: text,
  demoMode: z.boolean().default(false),
  demoNotice: text,
  logo: z.object({ src: z.union([z.literal(''), localPath]), alt: text, tagline: text }),
  socials: z.array(z.object({ label: text, url: publicUrl })),
  navigation: z.array(z.object({ label: text, href: localPath })).min(1),
  contact: strings([
    'navLabel',
    'eyebrow',
    'title',
    'description',
    'button',
    'pageTitle',
    'pageIntro',
    'nameLabel',
    'emailLabel',
    'subjectLabel',
    'messageLabel',
    'namePlaceholder',
    'emailPlaceholder',
    'messagePlaceholder',
    'submit',
    'copy',
    'copied',
    'copyError',
    'prepared',
    'unavailable',
    'notice',
    'draftTitle',
    'noScript',
    'mailSubjectPrefix',
    'mailGreeting',
    'mailName',
    'mailEmail',
    'mailProject',
    'mailCreation',
  ] as const).extend({
    email: z.union([z.literal(''), z.email()]),
    subjects: z.array(text).min(1),
  }),
  home: strings([
    'eyebrow',
    'title',
    'titleAccent',
    'description',
    'primary',
    'secondary',
    'imageAlt',
    'imageCaption',
    'imageStamp',
    'selectionEyebrow',
    'selectionTitle',
    'selectionText',
    'allCreations',
    'allCouture',
    'allDrawing',
    'atelierEyebrow',
    'atelierTitle',
    'atelierAccent',
    'atelierText',
    'atelierLink',
    'atelierImageAlt',
    'drawingEyebrow',
    'drawingTitle',
    'drawingText',
  ] as const).extend({ image: localPath, atelierImage: localPath, ribbon: z.array(text).min(1) }),
  collections: z.object({
    couture: strings(['eyebrow', 'title', 'description'] as const),
    dessin: strings(['eyebrow', 'title', 'description'] as const),
  }),
  ui: strings([
    'menu',
    'skip',
    'home',
    'close',
    'empty',
    'viewCreation',
    'demoBadge',
    'creationGallery',
    'enlarge',
    'previous',
    'next',
    'imageCounter',
    'share',
    'copyLink',
    'linkCopied',
    'shareError',
    'shareUrl',
    'aboutCreation',
    'materials',
    'year',
    'technique',
    'cut',
    'backCouture',
    'backDrawing',
    'inspired',
    'inspiredText',
    'contactCreation',
    'related',
    'optional',
    'required',
  ] as const),
  footer: strings(['text', 'copyright', 'legal', 'privacy', 'backTop'] as const),
  notFound: strings(['eyebrow', 'title', 'text', 'button'] as const),
});
export const themeSchema = z.object({
  colors: z.object(
    Object.fromEntries(
      [
        'background',
        'surface',
        'ink',
        'muted',
        'primary',
        'primaryHover',
        'accent',
        'gold',
        'goldLight',
        'goldShadow',
        'goldHighlight',
        'line',
        'rose',
      ].map((key) => [key, z.string().regex(/^#[\da-fA-F]{6}$/)]),
    ) as Record<
      | 'background'
      | 'surface'
      | 'ink'
      | 'muted'
      | 'primary'
      | 'primaryHover'
      | 'accent'
      | 'gold'
      | 'goldLight'
      | 'goldShadow'
      | 'goldHighlight'
      | 'line'
      | 'rose',
      z.ZodString
    >,
  ),
  fonts: strings(['heading', 'body'] as const),
  layout: z.object({
    maxWidth: z.number().min(960).max(1800),
    imageRadius: z.number().min(0).max(100),
  }),
});
const id = z
  .string()
  .regex(/^[a-z][a-z0-9-]*$/)
  .refine((value) => value !== 'notes', 'L’identifiant notes est réservé.');
export const orderSchema = strings([
  'navigationLabel',
  'eyebrow',
  'title',
  'description',
  'submit',
  'summaryTitle',
  'notice',
  'notesLabel',
  'notesPlaceholder',
  'mailSubject',
  'mailGreeting',
  'measurementsLabel',
  'optionsLabel',
  'unit',
] as const)
  .extend({
    enabled: z.boolean(),
    measurements: z.array(
      z
        .object({
          id,
          label: text,
          min: z.number().positive(),
          max: z.number().positive(),
          required: z.boolean(),
        })
        .refine((item) => item.max > item.min, 'Le maximum doit dépasser le minimum.'),
    ),
    options: z.array(z.object({ id, label: text, choices: z.array(text).min(1) })),
  })
  .refine((data) => {
    const ids = [...data.measurements, ...data.options].map((item) => item.id);
    return ids.length === new Set(ids).size;
  }, 'Les identifiants de champs doivent être uniques.');

function loadYaml(name: string): unknown {
  return parse(readFileSync(resolve(process.cwd(), 'src/data', `${name}.yaml`), 'utf8'));
}
export const site = siteSchema.parse(loadYaml('site'));
export const theme = themeSchema.parse(loadYaml('theme'));
export const customOrder = orderSchema.parse(loadYaml('custom-order'));
export const siteUrl = (process.env.SITE_URL || site.url).replace(/\/$/, '');
export type OrderConfig = z.infer<typeof orderSchema>;
