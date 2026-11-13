import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { creationSchema, drawingSchema, pageSchema } from './lib/content-schema';

const couture = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/couture' }),
  schema: creationSchema,
});
const dessin = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/dessin' }),
  schema: drawingSchema,
});
const pages = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/pages' }),
  schema: pageSchema,
});
export const collections = { couture, dessin, pages };
