import { z } from 'zod';

export const creationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(300),
  category: z.string().min(1),
  date: z.coerce.date(),
  order: z.number().default(100),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  demo: z.boolean().default(false),
  technique: z.string().min(1),
  materials: z.array(z.string().min(1)).default([]),
  images: z
    .array(
      z.object({
        src: z.string().regex(/^\/images\/[^?#]+$/),
        alt: z.string().min(1),
        caption: z.string().optional(),
        position: z
          .string()
          .regex(/^(center|top|bottom|left|right|\d{1,3}% \d{1,3}%)$/)
          .default('center'),
        width: z.number().int().positive().default(1200),
        height: z.number().int().positive().default(1500),
      }),
    )
    .min(1),
});
export const pageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  eyebrow: z.string().optional(),
});
