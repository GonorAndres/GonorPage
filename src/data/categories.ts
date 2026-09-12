import type { Lang } from '../i18n/ui';

export const categories = [
  'actuaria-para-todos',
  'fundamentos-actuariales',
  'proyectos-y-analisis',
  'herramientas',
  'mercado-mexicano',
] as const;

export type Category = (typeof categories)[number];

export const categoryLabels: Record<Lang, Record<Category, string>> = {
  es: {
    'actuaria-para-todos': 'Actuaría para todos',
    'fundamentos-actuariales': 'Fundamentos actuariales',
    'proyectos-y-analisis': 'Proyectos y análisis',
    'herramientas': 'Herramientas',
    'mercado-mexicano': 'Mercado mexicano',
  },
  en: {
    'actuaria-para-todos': 'Actuarial for everyone',
    'fundamentos-actuariales': 'Actuarial Fundamentals',
    'proyectos-y-analisis': 'Projects & analysis',
    'herramientas': 'Tools',
    'mercado-mexicano': 'Mexican market',
  },
};
