import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.enum([
      'actuaria-para-todos',
      'fundamentos-actuariales',
      'proyectos-y-analisis',
      'herramientas',
      'mercado-mexicano',
    ]),
    lang: z.enum(['es', 'en']),
    tags: z.array(z.string()).optional(),
    lastModified: z.string().optional(),
    shape: z.enum(['blog', 'case-study', 'narrative', 'study-guide']).optional(),
    readingTime: z.string().optional(),
    ficha: z
      .object({
        rol: z.string().optional(),
        año: z.string().optional(),
        periodo: z.string().optional(),
        stack: z.string().optional(),
        datos: z.string().optional(),
        regulacion: z.string().optional(),
        estado: z.string().optional(),
        repositorio: z.string().optional(),
        live: z.string().optional(),
        extraLinks: z
          .array(z.object({ label: z.string(), url: z.string() }))
          .optional(),
      })
      .optional(),
    heroImage: z.string().optional(),
    heroCaption: z.string().optional(),
    heroAlt: z.string().optional(),
    relatedPosts: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
