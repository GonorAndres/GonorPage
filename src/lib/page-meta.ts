import type { Lang } from '../i18n';
import type { Category } from '../data/categories';
import type { NoteCategory } from '../data/notes';

export interface PageMeta {
  title: string;
  description: string;
}

export const homeMeta: Record<Lang, PageMeta> = {
  es: {
    title: 'Andrés González | plataforma actuarial de software',
    description:
      'Plataforma actuarial y software actuarial de Andrés González Ortega, actuario por la UNAM. Cubre tarificación, reservas y la regulación LISF y CUSF.',
  },
  en: {
    title: 'Andrés González | Actuary and data scientist, UNAM',
    description:
      'UNAM actuary and data scientist. Actuarial software for pricing and reserves, Mexican insurance regulation, and the data tools behind that work.',
  },
};

export const aboutMeta: Record<Lang, PageMeta> = {
  es: {
    title: 'Sobre Andrés González Ortega, actuario por la UNAM',
    description:
      'Andrés González Ortega, actuario por la UNAM y especialista en datos de performance marketing en Levely. Trabaja en medición, seguros y datos.',
  },
  en: {
    title: 'About Andrés González Ortega, UNAM-trained actuary',
    description:
      'Andrés González Ortega is a UNAM actuary and a performance marketing data specialist at Levely. He works on measurement, insurance and data.',
  },
};

export const blogIndexMeta: Record<Lang, PageMeta> = {
  es: {
    title: 'Escritos sobre actuaría, datos y finanzas | González',
    description:
      'Ensayos y notas técnicas sobre actuaría, finanzas, datos y herramientas, escritos por Andrés González Ortega, actuario formado en la UNAM en México.',
  },
  en: {
    title: 'Essays on actuarial work, data and finance | González',
    description:
      'Essays and technical notes on actuarial science, finance, data and tools, written by Andrés González Ortega, a UNAM-trained actuary in Mexico.',
  },
};

export const artifactIndexMeta: Record<Lang, PageMeta> = {
  es: {
    title: 'Artefactos interactivos de actuaría, finanzas, datos',
    description:
      'Artefactos interactivos y apuntes de actuaría, finanzas y estadística: exámenes SOA, modelos de seguros, derivados y visualizaciones para estudiar.',
  },
  en: {
    title: 'Interactive artifacts on actuarial work and finance',
    description:
      'Interactive artifacts and technical notes on actuarial science, finance and statistics: SOA exams, insurance models, derivatives and visuals.',
  },
};

export const mathVizMeta: Record<Lang, PageMeta> = {
  es: {
    title: 'Visualizaciones matemáticas interactivas | González',
    description:
      'Demostraciones interactivas de análisis: el límite de sin(x)/x, la derivada del seno y la fórmula de Euler, con los pasos visibles en la pantalla.',
  },
  en: {
    title: 'Math visualizations | Andrés González Ortega, UNAM',
    description:
      'Interactive demonstrations of analysis: the sin(x)/x limit, the derivative of sine and Euler\'s formula, with each step visible on the screen.',
  },
};

export const blogCategoryMeta: Record<Lang, Record<Category, PageMeta>> = {
  es: {
    'actuaria-para-todos': {
      title: 'Actuaría básica para todos | blog de Andrés González',
      description:
        'Ensayos que explican la actuaría con ejemplos concretos: primas, reservas, mortalidad y el principio de equivalencia, sin dar por hecho el vocabulario técnico.',
    },
    'fundamentos-actuariales': {
      title: 'Fundamentos actuariales | blog de Andrés González, UNAM',
      description:
        'Fundamentos del cálculo actuarial: probabilidad, tablas de mortalidad, principio de equivalencia y los pasos que sostienen una prima o una reserva.',
    },
    'proyectos-y-analisis': {
      title: 'Proyectos y análisis actuariales | Andrés González',
      description:
        'Proyectos con datos de seguros y de mercado: tarificación, reservas, crédito, pensiones y plataformas que llevan el cálculo hasta una herramienta usable.',
    },
    herramientas: {
      title: 'Herramientas de datos y modelos | Andrés González, UNAM',
      description:
        'Herramientas para trabajar con datos y modelos: APIs, tableros, índices en bases de datos y visualizaciones que se pueden abrir y revisar aquí.',
    },
    'mercado-mexicano': {
      title: 'Mercado asegurador mexicano | blog de González, UNAM',
      description:
        'El mercado asegurador mexicano en la práctica: LISF, CUSF, EMSSA-09, pensiones del IMSS y el software que aplica esas reglas a un cálculo real.',
    },
  },
  en: {
    'actuaria-para-todos': {
      title: 'Actuarial ideas for everyone | Andrés González, UNAM',
      description:
        'Essays that explain actuarial ideas with concrete examples: premiums, reserves, mortality and the equivalence principle, without assuming the jargon.',
    },
    'fundamentos-actuariales': {
      title: 'Actuarial fundamentals explained | Andrés González',
      description:
        'Actuarial fundamentals: probability, mortality tables, the equivalence principle, and the steps that support a premium or a reserve calculation.',
    },
    'proyectos-y-analisis': {
      title: 'Actuarial projects and analysis | Andrés González, UNAM',
      description:
        'Projects on insurance and market data: pricing, reserves, credit, pensions and platforms that carry a calculation through to a tool you can open.',
    },
    herramientas: {
      title: 'Data, modeling and analysis tools | Andrés González',
      description:
        'Tools for working with data and models: APIs, dashboards, database indexes and visualizations you can open, inspect and reuse on this portfolio.',
    },
    'mercado-mexicano': {
      title: 'Mexican insurance market | blog, Andrés González, UNAM',
      description:
        'The Mexican insurance market in practice: LISF, CUSF, the EMSSA-09 table, IMSS pensions and software that applies those rules to a real calculation.',
    },
  },
};

export const noteCategoryMeta: Record<Lang, Record<NoteCategory, PageMeta>> = {
  es: {
    actuarial: {
      title: 'Ciencia actuarial y de seguros | notas y artefactos',
      description:
        'Apuntes y artefactos de ciencia actuarial y seguros: probabilidad para el Examen P, GLMs, varianza total y modelos que usan las aseguradoras.',
    },
    quant: {
      title: 'Finanzas cuantitativas | notas de Andrés González, UNAM',
      description:
        'Notas de finanzas cuantitativas: Black-Scholes, FRA, IRS, la distribución log-normal y el ajuste de rendimientos, con el cálculo escrito paso a paso.',
    },
    stats: {
      title: 'Apuntes de estadística y probabilidad | artefactos',
      description:
        'Notas y artefactos de estadística y probabilidad: pruebas A/B, series de tiempo, sesgo y varianza, y la búsqueda de particiones en un árbol.',
    },
  },
  en: {
    actuarial: {
      title: 'Actuarial science and insurance | notes, artifacts',
      description:
        'Notes and artifacts on actuarial science and insurance: Exam P probability, GLMs, total variance and models insurers use in pricing and reserving.',
    },
    quant: {
      title: 'Quantitative finance notes | Andrés González Ortega',
      description:
        'Notes on quantitative finance: Black-Scholes, FRAs, interest rate swaps, the log-normal distribution and fitting returns, with the steps written out.',
    },
    stats: {
      title: 'Statistics and probability notes | Andrés González',
      description:
        'Notes and artifacts on statistics and probability: A/B tests, time series, the bias-variance tradeoff and how a tree searches for a split point.',
    },
  },
};
