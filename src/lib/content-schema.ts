import { z } from 'zod';

const requiredText = z.string().trim().min(1);
const sharedCreationSchema = z.object({
  title: requiredText,
  description: z.string().max(300).optional(),
  category: z.string().optional(),
  date: z.coerce.date().optional(),
  order: z.number().default(100),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  demo: z.boolean().default(false),
  technique: requiredText,
  cut: z.string().optional(),
  materials: z.array(requiredText).default([]),
  images: z
    .array(
      z.object({
        src: z.string().regex(/^\/images\/[^?#]+$/),
        alt: z.string().optional(),
        caption: z.string().optional(),
        position: z
          .string()
          .regex(/^(center|top|bottom|left|right|\d{1,3}% \d{1,3}%)$/)
          .default('center'),
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
      }),
    )
    .min(1),
});
export const creationSchema = sharedCreationSchema.extend({
  cut: requiredText,
  materials: z.array(requiredText).min(1),
});
export const drawingSchema = sharedCreationSchema;
export const pageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  eyebrow: z.string().optional(),
});
