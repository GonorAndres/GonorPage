import type { Lang } from '../i18n';

export type NoteCategory = 'actuarial' | 'quant' | 'stats';

export const noteCategories = ['actuarial', 'quant', 'stats'] as const;

export const noteCategoryLabels: Record<Lang, Record<NoteCategory, string>> = {
  es: {
    actuarial: 'Ciencia Actuarial y Seguros',
    quant: 'Finanzas Cuantitativas',
    stats: 'Estadística y Probabilidad',
  },
  en: {
    actuarial: 'Actuarial Science & Insurance',
    quant: 'Quantitative Finance',
    stats: 'Statistics & Probability',
  },
};

export interface NoteLink {
  label: Record<Lang, string>;
  url: string;
}

export interface Note {
  slug: string;
  category: NoteCategory;
  type?: 'note' | 'artifact';
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  urls: NoteLink[];
  tags: Record<Lang, string[]>;
  keywords: Record<Lang, string[]>;
  createdDate: string;
  version: string;
  relatedNotes?: string[];
}

export const categoryOrder: NoteCategory[] = ['actuarial', 'quant', 'stats'];

export const notes: Note[] = [
  // ── Actuarial Science & Insurance ────────────────────────────────
  {
    slug: 'soa-exam-p-reference',
    category: 'actuarial',
    createdDate: '2026-02-18',
    version: '24',
    title: {
      es: 'SOA Exam P : Referencia Inicial de Estudio',
      en: 'SOA Exam P : Initial Study Reference',
    },
    description: {
      es: 'La referencia que construí para prepararme al Examen P. Cubre probabilidad general, variables aleatorias y distribuciones multivariadas, cada tema con intuición actuarial, no solo fórmulas. Incluye problemas resueltos con análisis de por qué los distractores engañan.',
      en: 'The reference I built to prepare for Exam P. Covers general probability, random variables, and multivariate distributions, each topic with actuarial intuition, not just formulas. Includes solved problems with analysis of why the distractors mislead.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1YRa658huJEPi_X1GUXaZPMJI5zaNKy7p/view' },
    ],
    tags: {
      es: ['SOA', 'Examen P', 'Probabilidad', 'Actuaria'],
      en: ['SOA', 'Exam P', 'Probability', 'Actuarial'],
    },
    keywords: {
      es: ['SOA Exam P', 'probabilidad actuarial', 'guía de estudio', 'variables aleatorias', 'distribuciones'],
      en: ['SOA Exam P', 'actuarial probability', 'study reference', 'random variables', 'distributions'],
    },
    relatedNotes: ['eves-law-total-variance', 'glm-actuarial-models'],
  },
  {
    slug: 'glm-actuarial-models',
    category: 'actuarial',
    createdDate: '2025-08-09',
    version: '13',
    title: {
      es: 'GLM para Modelos Actuariales',
      en: 'GLM for Actuarial Models',
    },
    description: {
      es: 'De la teoría a la producción: cómo las aseguradoras realmente estiman frecuencia de siniestros, severidad y caída de pólizas. Este apunte recorre desde la familia exponencial y funciones liga hasta validación con curvas ROC, coeficiente de Gini y tablas de relatividad. Tres casos de estudio completos: autos, vida y riesgos de trabajo. Apunte personal de síntesis actuarial.',
      en: 'From theory to production: how insurers actually estimate claim frequency, severity, and policy lapse. This note walks from exponential families and link functions through validation with ROC curves, Gini coefficients, and relativity tables. Three full case studies: auto, life, and workers\' comp. Personal actuarial synthesis note.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1jJ2eJ9ceVogmDLPf6nAtY4JAo-XEiAOE/view?usp=sharing' },
    ],
    tags: {
      es: ['GLM', 'Actuaria', 'Seguros'],
      en: ['GLM', 'Actuarial', 'Insurance'],
    },
    keywords: {
      es: ['modelos lineales generalizados', 'GLM actuarial', 'frecuencia siniestros', 'severidad', 'tarificación seguros'],
      en: ['generalized linear models', 'actuarial GLM', 'claim frequency', 'severity', 'insurance pricing'],
    },
    relatedNotes: ['soa-exam-p-reference', 'lee-carter-mortality'],
  },
  {
    slug: 'eves-law-total-variance',
    category: 'actuarial',
    createdDate: '2026-02-11',
    version: '10',
    title: {
      es: 'Ley de Eve y Varianza Total',
      en: 'Eve\'s Law and Total Variance',
    },
    description: {
      es: 'Documento puente que conecta la Ley de Adam, la Ley de Eve, distribuciones mixtas (Poisson-Gamma, exponencial mixta) y distribuciones compuestas. Incluye problemas resueltos estilo SOA con análisis de por qué cada distractor está mal. La pieza que une la varianza condicional con la teoría de credibilidad.',
      en: 'Bridge document connecting Adam\'s Law, Eve\'s Law, mixed distributions (Poisson-Gamma, mixed exponential), and compound distributions. Includes SOA-style solved problems with analysis of why each distractor fails. The piece that links conditional variance to credibility theory.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1I3buEoYKAmP_CyMkUgCUfgOI4oBfNFuZ/view' },
    ],
    tags: {
      es: ['Varianza Total', 'Credibilidad', 'SOA'],
      en: ['Total Variance', 'Credibility', 'SOA'],
    },
    keywords: {
      es: ['ley de Eve', 'varianza total', 'distribuciones mixtas', 'credibilidad actuarial', 'Poisson-Gamma'],
      en: ['Eve\'s Law', 'total variance', 'mixed distributions', 'actuarial credibility', 'Poisson-Gamma'],
    },
    relatedNotes: ['soa-exam-p-reference', 'glm-actuarial-models'],
  },
  {
    slug: 'lee-carter-mortality',
    category: 'actuarial',
    createdDate: '2026-02-15',
    version: '8',
    title: {
      es: 'Reestimación de Mortalidad Lee-Carter',
      en: 'Lee-Carter Mortality Reestimation',
    },
    description: {
      es: 'Reestimación del modelo Lee-Carter con datos de mortalidad mexicanos. Descomposición SVD de la matriz de tasas, proyección temporal del índice kappa, y su implicación directa para tablas de vida y reservas de seguros de personas. Conecta la demografía con la práctica actuarial.',
      en: 'Lee-Carter model reestimation using Mexican mortality data. SVD decomposition of the rate matrix, time projection of the kappa index, and its direct implication for life tables and life insurance reserves. Connects demography to actuarial practice.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1I7F_-OYYXLS1H0hYMJJPBdNGxGKUr6x0/view' },
    ],
    tags: {
      es: ['Mortalidad', 'Lee-Carter', 'SVD', 'Tablas de Vida'],
      en: ['Mortality', 'Lee-Carter', 'SVD', 'Life Tables'],
    },
    keywords: {
      es: ['Lee-Carter', 'mortalidad México', 'SVD', 'tablas de vida', 'reservas seguros'],
      en: ['Lee-Carter', 'Mexican mortality', 'SVD', 'life tables', 'insurance reserves'],
    },
    relatedNotes: ['glm-actuarial-models'],
  },
  // ── Quantitative Finance ─────────────────────────────────────────
  {
    slug: 'black-scholes-fra-irs',
    category: 'quant',
    createdDate: '2025-06-15',
    version: '11',
    title: {
      es: 'Black-Scholes, FRA & IRS',
      en: 'Black-Scholes, FRA & IRS',
    },
    description: {
      es: 'Un solo documento que conecta cuatro mundos: cómo ponerle precio a lo que nadie sabe cuánto vale (derivados exóticos), cómo leer el futuro en las curvas de tasas del Tesoro, cómo dos empresas pueden intercambiar riesgo con un swap, y cómo armar un portafolio que no dependa de la suerte. Todo resuelto con Python y atado por la misma lógica de no-arbitraje. Examen integrador de Métodos Cuantitativos en Finanzas, UNAM.',
      en: 'One document tying four worlds together: how to price what nobody knows the value of (exotic derivatives), how to read the future in Treasury yield curves, how two firms can swap risk through an IRS, and how to build a portfolio that doesn\'t rely on luck. All solved in Python and bound by the same no-arbitrage logic. Integrative exam for Quantitative Methods in Finance, UNAM.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1trkP2RDp5ZIEynS8-rV4rkADdzfdhPuW/view?usp=drive_link' },
    ],
    tags: {
      es: ['Black-Scholes', 'FRA/IRS', 'CAPM', 'Python'],
      en: ['Black-Scholes', 'FRA/IRS', 'CAPM', 'Python'],
    },
    keywords: {
      es: ['Black-Scholes', 'FRA', 'IRS', 'derivados financieros', 'no-arbitraje', 'Python finanzas'],
      en: ['Black-Scholes', 'FRA', 'IRS', 'financial derivatives', 'no-arbitrage', 'Python finance'],
    },
    relatedNotes: ['black-scholes-log-normal', 'parametric-returns-fitting'],
  },
  {
    slug: 'black-scholes-log-normal',
    category: 'quant',
    createdDate: '2025-06-27',
    version: '18',
    title: {
      es: 'Black-Scholes y la Log-Normal',
      en: 'Black-Scholes and the Log-Normal',
    },
    description: {
      es: 'Por qué la volatilidad no es solo ruido sino una fuerza que separa la mediana del promedio, y cómo eso hace que las opciones valgan más de lo que la intuición sugiere. Un recorrido por el movimiento browniano geométrico, la distribución del precio terminal y el efecto del "volatility drag". Apunte personal de finanzas cuantitativas.',
      en: 'Why volatility isn\'t just noise but a force that pulls the median away from the mean, and how that makes options worth more than intuition suggests. A walkthrough of geometric Brownian motion, the terminal price distribution, and the "volatility drag" effect. Personal quantitative finance note.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/10jLATDsw39CHDKb7T04gqy3GUezJRx6D/view?usp=drive_link' },
    ],
    tags: {
      es: ['Black-Scholes', 'Log-Normal', 'Volatilidad'],
      en: ['Black-Scholes', 'Log-Normal', 'Volatility'],
    },
    keywords: {
      es: ['Black-Scholes', 'log-normal', 'volatilidad', 'movimiento browniano', 'precio opciones'],
      en: ['Black-Scholes', 'log-normal', 'volatility', 'Brownian motion', 'option pricing'],
    },
    relatedNotes: ['black-scholes-fra-irs', 'parametric-returns-fitting'],
  },
  {
    slug: 'parametric-returns-fitting',
    category: 'quant',
    createdDate: '2025-06-16',
    version: '11',
    title: {
      es: 'Ajuste Paramétrico de Rendimientos Financieros',
      en: 'Parametric Fitting of Financial Returns',
    },
    description: {
      es: 'El camino completo para modelar rendimientos: desde elegir entre normal y log-normal, pasando por momentos y máxima verosimilitud, hasta llegar al VaR paramétrico. Con pruebas de bondad de ajuste, Q-Q plots y criterios de información para no quedarse solo con la primera distribución que parezca funcionar. Apunte del curso de Mercados Financieros, UNAM.',
      en: 'The full path to modeling returns: from choosing between normal and log-normal, through moments and maximum likelihood, all the way to parametric VaR. With goodness-of-fit tests, Q-Q plots, and information criteria so you don\'t settle for the first distribution that looks right. Financial Markets course note, UNAM.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1229dImQ9xEY2tZdh4Wr5KIyNUIRgv3Vz/view?usp=sharing' },
    ],
    tags: {
      es: ['VaR', 'MLE', 'Finanzas'],
      en: ['VaR', 'MLE', 'Finance'],
    },
    keywords: {
      es: ['VaR paramétrico', 'máxima verosimilitud', 'rendimientos financieros', 'bondad de ajuste', 'Q-Q plot'],
      en: ['parametric VaR', 'maximum likelihood', 'financial returns', 'goodness of fit', 'Q-Q plot'],
    },
    relatedNotes: ['black-scholes-fra-irs', 'black-scholes-log-normal'],
  },
  // ── Statistics & Probability ─────────────────────────────────────
  {
    slug: 'ab-testing-bayesian-frequentist',
    category: 'stats',
    createdDate: '2025-06-15',
    version: '10',
    title: {
      es: 'A/B Testing: Bayesiano vs Frecuentista',
      en: 'A/B Testing: Bayesian vs Frequentist',
    },
    description: {
      es: 'La misma pregunta, dos formas de pensar: el enfoque clásico dice que no hay evidencia suficiente, el bayesiano dice que casi seguro B es mejor. Este resumen explora qué pasa cuando dejas de depender solo del p-valor y empiezas a pensar en utilidad esperada para decidir. Proyecto personal de exploración estadística. Disponible en ambos idiomas.',
      en: 'Same question, two ways of thinking: the classical approach says there\'s not enough evidence, the Bayesian one says B is almost certainly better. This summary explores what happens when you stop relying solely on the p-value and start thinking in terms of expected utility to decide. Personal statistical exploration project. Available in both languages.',
    },
    urls: [
      { label: { es: 'Resumen ES', en: 'Resumen ES' }, url: 'https://drive.google.com/file/d/1i-9ZWjJieLJnb3CnEEdb4FKQd_cIKFff/view?usp=drive_link' },
      { label: { es: 'Summary EN', en: 'Summary EN' }, url: 'https://drive.google.com/file/d/1kguG7XKBYd6OLJ3nI1z-Syt7Ozcq0mUB/view?usp=drive_link' },
    ],
    tags: {
      es: ['Estadística', 'Bayes', 'Python'],
      en: ['Statistics', 'Bayes', 'Python'],
    },
    keywords: {
      es: ['A/B testing', 'bayesiano vs frecuentista', 'p-valor', 'utilidad esperada', 'pruebas de hipótesis'],
      en: ['A/B testing', 'Bayesian vs frequentist', 'p-value', 'expected utility', 'hypothesis testing'],
    },
    relatedNotes: ['volcanic-eruption-forecasting'],
  },
  {
    slug: 'time-series-delhi',
    category: 'stats',
    createdDate: '2025-06-15',
    version: '16',
    title: {
      es: 'Series de Tiempo: Temperatura en Delhi',
      en: 'Time Series: Delhi Temperature',
    },
    description: {
      es: 'Cinco años de temperatura en Delhi contados por los datos: encontrar el patrón estacional escondido en el ruido, separar lo que es tendencia real de lo que es variación aleatoria, y construir un modelo en R que pueda anticipar lo que viene. El tipo de ejercicio donde la estadística deja de ser abstracta y se vuelve clima. Proyecto del curso de Análisis de Supervivencia y Series de Tiempo, UNAM.',
      en: 'Five years of Delhi temperature told through data: finding the seasonal pattern hidden in the noise, separating real trend from random variation, and building a model in R that can anticipate what comes next. The kind of exercise where statistics stops being abstract and becomes weather. Course project for Survival Analysis and Time Series, UNAM.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1-t7sihOVxHWceLPPOFnZBDrdhkBsXKmP/view?usp=drive_link' },
    ],
    tags: {
      es: ['R', 'Series de Tiempo', 'ARIMA'],
      en: ['R', 'Time Series', 'ARIMA'],
    },
    keywords: {
      es: ['series de tiempo', 'ARIMA', 'estacionalidad', 'R', 'temperatura Delhi'],
      en: ['time series', 'ARIMA', 'seasonality', 'R', 'Delhi temperature'],
    },
    relatedNotes: ['volcanic-eruption-forecasting'],
  },
  {
    slug: 'volcanic-eruption-forecasting',
    category: 'stats',
    createdDate: '2025-07-30',
    version: '12',
    title: {
      es: 'Predicción Probabilística de Erupciones Volcánicas',
      en: 'Probabilistic Forecasting of Volcanic Eruptions',
    },
    description: {
      es: 'Qué tienen en común un actuario y un vulcanólogo? Que ambos intentan predecir eventos raros con consecuencias enormes. Este apunte revisa cómo se modelan los intervalos entre erupciones del Popocatépetl y el Galeras con distribuciones log-normal, modelos de Markov y procesos de renovación. Las preguntas abiertas al final son genuinamente fascinantes. Apunte personal de probabilidad aplicada.',
      en: 'What do an actuary and a volcanologist have in common? Both try to predict rare events with enormous consequences. This note reviews how eruption intervals for Popocatépetl and Galeras are modeled with log-normal distributions, Markov models, and renewal processes. The open questions at the end are genuinely fascinating. Personal applied probability note.',
    },
    urls: [
      { label: { es: 'Ver PDF', en: 'View PDF' }, url: 'https://drive.google.com/file/d/1eaQmrc0HuQ5fXli6E5HQ54N5vRNkFT9o/view?usp=sharing' },
      { label: { es: 'Publicación en ScienceDirect', en: 'ScienceDirect publication' }, url: 'https://www.sciencedirect.com/science/article/abs/pii/S0895981126003305' },
    ],
    tags: {
      es: ['Probabilidad', 'Volcanes', 'Modelos'],
      en: ['Probability', 'Volcanoes', 'Models'],
    },
    keywords: {
      es: ['erupciones volcánicas', 'predicción probabilística', 'Popocatépetl', 'procesos de renovación', 'Markov'],
      en: ['volcanic eruptions', 'probabilistic forecasting', 'Popocatépetl', 'renewal processes', 'Markov'],
    },
    relatedNotes: ['time-series-delhi', 'ab-testing-bayesian-frequentist'],
  },
  {
    slug: 'bias-variance-tradeoff',
    category: 'stats',
    type: 'artifact',
    createdDate: '2026-04-18',
    version: '1',
    title: {
      es: 'El Dilema: Sesgo y Varianza',
      en: 'The Tradeoff: Bias and Variance',
    },
    description: {
      es: 'Un artefacto interactivo de scrollytelling que explica el balance sesgo-varianza a través de la curva U de error de prueba del Capítulo 2 de ISLR. Seis pasos visuales: desde los datos hasta la validación cruzada, con estética sumi-e en papel washi. En español e inglés.',
      en: 'An interactive scrollytelling artifact explaining the bias-variance tradeoff through the U-shaped test-error curve from ISLR Chapter 2. Six visual steps: from raw data to cross-validation, rendered in a sumi-e ink-on-washi aesthetic. Bilingual: Spanish and English.',
    },
    urls: [
      { label: { es: 'Abrir artefacto', en: 'Open artifact' }, url: '/artifacts/yuminari-bow/' },
    ],
    tags: {
      es: ['Aprendizaje Estadístico', 'Sesgo-Varianza', 'Visualización', 'ISLR'],
      en: ['Statistical Learning', 'Bias-Variance', 'Visualization', 'ISLR'],
    },
    keywords: {
      es: ['sesgo varianza', 'error de prueba', 'sobreajuste', 'subajuste', 'validación cruzada', 'aprendizaje estadístico'],
      en: ['bias variance tradeoff', 'test error', 'overfitting', 'underfitting', 'cross-validation', 'statistical learning'],
    },
    relatedNotes: ['ab-testing-bayesian-frequentist', 'greedy-split-search'],
  },
  {
    slug: 'greedy-split-search',
    category: 'stats',
    type: 'artifact',
    createdDate: '2026-04-19',
    version: '1',
    title: {
      es: 'Búsqueda Egoísta de Particiones',
      en: 'Greedy Split Search',
    },
    description: {
      es: 'Un recorrido paso a paso de cómo un árbol de decisión elige dónde partir un nodo. Con cinco observaciones y cuatro umbrales candidatos, el artefacto recorre el cálculo del RSS para cada partición y deja al lector ver por qué esta búsqueda egoísta gana en claridad lo que pierde en optimalidad global. Animación interactiva y cálculos en vivo, en español e inglés.',
      en: 'A step-by-step walkthrough of how a decision tree picks where to split a node. With five observations and four candidate thresholds, the artifact traces the RSS computation for each split and lets the reader see why greedy search gains in clarity what it loses in global optimality. Interactive animation and live computation, bilingual.',
    },
    urls: [
      { label: { es: 'Abrir artefacto', en: 'Open artifact' }, url: '/artifacts/greedy-node/' },
    ],
    tags: {
      es: ['Aprendizaje Estadístico', 'Árboles de Decisión', 'Visualización', 'ISLR'],
      en: ['Statistical Learning', 'Decision Trees', 'Visualization', 'ISLR'],
    },
    keywords: {
      es: ['árbol de decisión', 'búsqueda egoísta', 'RSS', 'umbral de partición', 'regresión por árboles', 'aprendizaje estadístico'],
      en: ['decision tree', 'greedy search', 'RSS', 'split threshold', 'tree regression', 'statistical learning'],
    },
    relatedNotes: ['bias-variance-tradeoff', 'glm-actuarial-models'],
  },
];

export interface LocalizedNote {
  slug: string;
  category: NoteCategory;
  type: 'note' | 'artifact';
  title: string;
  description: string;
  urls: { label: string; url: string }[];
  tags: string[];
  keywords: string[];
  createdDate: string;
  version: string;
  relatedNotes?: string[];
}

export function getNotes(lang: Lang): LocalizedNote[] {
  return notes.map((n) => ({
    slug: n.slug,
    category: n.category,
    type: n.type ?? 'note',
    title: n.title[lang],
    description: n.description[lang],
    urls: n.urls.map((u) => ({ label: u.label[lang], url: u.url })),
    tags: n.tags[lang],
    keywords: n.keywords[lang],
    createdDate: n.createdDate,
    version: n.version,
    relatedNotes: n.relatedNotes,
  }));
}

export function getNotesByCategory(lang: Lang): { category: NoteCategory; label: string; notes: Omit<LocalizedNote, 'category'>[] }[] {
  const localized = getNotes(lang);

  return categoryOrder.map((cat) => ({
    category: cat,
    label: noteCategoryLabels[lang][cat],
    notes: localized
      .filter((n) => n.category === cat)
      .map(({ category: _cat, ...rest }) => rest),
  })).filter((g) => g.notes.length > 0);
}

export function getNoteBySlug(slug: string, lang: Lang): LocalizedNote | undefined {
  const note = notes.find((n) => n.slug === slug);
  if (!note) return undefined;
  return {
    slug: note.slug,
    category: note.category,
    type: note.type ?? 'note',
    title: note.title[lang],
    description: note.description[lang],
    urls: note.urls.map((u) => ({ label: u.label[lang], url: u.url })),
    tags: note.tags[lang],
    keywords: note.keywords[lang],
    createdDate: note.createdDate,
    version: note.version,
    relatedNotes: note.relatedNotes,
  };
}

export function getNoteSlugs(): string[] {
  return notes.map((n) => n.slug);
}
