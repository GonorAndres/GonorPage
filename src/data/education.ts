import type { Lang } from '../i18n';

export interface Education {
  degree: Record<Lang, string>;
  school: Record<Lang, string>;
  details: Record<Lang, string>;
  note?: Record<Lang, string>;
}

export interface Certificate {
  name: string;
  issuer: string;
  date: Record<Lang, string>;
  url: string;
  note?: Record<Lang, string>;
}

export const education: Education[] = [
  {
    degree: {
      es: 'Licenciatura en Actuaria',
      en: 'B.S. in Actuarial Science',
    },
    school: {
      es: 'Universidad Nacional Autónoma de México (UNAM)',
      en: 'National Autonomous University of Mexico (UNAM)',
    },
    details: {
      es: 'Facultad de Ciencias · 2021 – 2025',
      en: 'Faculty of Sciences · 2021 – 2025',
    },
    note: {
      es: '100% créditos completados, en proceso de titulación',
      en: '100% credits completed, degree in progress',
    },
  },
];

export const certificates: Certificate[] = [
  {
    name: 'SOA Exam P',
    issuer: 'Society of Actuaries',
    date: { es: 'Mar 2026', en: 'Mar 2026' },
    url: 'https://drive.google.com/file/d/1rt3emgBnPpQi7NiXkBQeA5WwJTV0JuAf/view?usp=drive_link',
    note: { es: 'Resultado preliminar aprobado, en espera de confirmación oficial', en: 'Preliminary pass, awaiting official confirmation' },
  },
  {
    name: 'Associate Data Analyst (SQL)',
    issuer: 'DataCamp',
    date: { es: 'Ago 2024', en: 'Aug 2024' },
    url: 'https://drive.google.com/file/d/1EqzyjRkWOJBlU9zUTpkcUcj6QtuXRZfK/view?usp=drive_link',
  },
  {
    name: 'Associate Data Scientist R',
    issuer: 'DataCamp',
    date: { es: 'Sep 2024', en: 'Sep 2024' },
    url: 'https://drive.google.com/file/d/1xVLk15A1LBbyXH1fZnd4eBTaJ4d8FLLO/view?usp=drive_link',
  },
  {
    name: 'Data Scientist in R',
    issuer: 'DataCamp',
    date: { es: 'Oct 2024', en: 'Oct 2024' },
    url: 'https://drive.google.com/file/d/1Woe6xqxofloFZ9uM2f5VsdGxY-WQWCRI/view?usp=drive_link',
  },
  {
    name: 'Databricks Fundamentals',
    issuer: 'Databricks Academy',
    date: { es: 'Abr 2026', en: 'Apr 2026' },
    url: 'https://credentials.databricks.com/45f31d0f-ca80-4e3a-80c1-ede89826f6ce',
  },
  {
    name: 'AI Agent Fundamentals',
    issuer: 'Databricks Academy',
    date: { es: 'Abr 2026', en: 'Apr 2026' },
    url: 'https://credentials.databricks.com/14950fb9-6260-46d2-b78e-8ec864397479',
  },
  {
    name: 'Generative AI Fundamentals',
    issuer: 'Databricks Academy',
    date: { es: 'Abr 2026', en: 'Apr 2026' },
    url: 'https://credentials.databricks.com/9e3a7d69-10f5-4474-901f-d35e73bb69b2',
  },
  {
    name: 'Create ML Models with BigQuery ML',
    issuer: 'Google Cloud',
    date: { es: 'Jun 2026', en: 'Jun 2026' },
    url: 'https://www.credly.com/badges/627e036d-0757-4d8a-9dca-6a40a8088f3c',
  },
];

export function getEducation(lang: Lang) {
  return education.map((e) => ({
    degree: e.degree[lang],
    school: e.school[lang],
    details: e.details[lang],
    note: e.note ? e.note[lang] : undefined,
  }));
}

export function getCertificates(lang: Lang) {
  return certificates.map((c) => ({
    name: c.name,
    issuer: c.issuer,
    date: c.date[lang],
    url: c.url,
    note: c.note ? c.note[lang] : undefined,
  }));
}
