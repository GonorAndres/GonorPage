import type { Lang } from '../i18n';

export type ProjectCategory = 'actuarial' | 'data-science' | 'data-engineering' | 'quant-finance' | 'applied-math';

export interface Project {
  slug: string;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  url: string;           // primary link: live app, Drive folder, Colab, or GitHub if no live version
  urls?: Array<{ label: Record<Lang, string>; url: string }>; // optional: when present, "Ver en vivo" opens a dropdown with multiple live URLs
  repo?: string;         // GitHub repo URL — only set when url points to a live deployment
  platform: 'GitHub' | 'Drive' | 'Vercel' | 'Colab' | 'GCP' | 'HuggingFace' | 'Firebase';
  category: ProjectCategory;
  tags: Record<Lang, string[]>;
  variant: 'standard' | 'tall' | 'wide';
  screenshot?: string;
  gallery?: Array<{ src: string; caption?: Record<Lang, string> }>;
  relatedTo?: string[];
  blogSlug?: string;     // English slug of the blog post for this project (e.g. 'sima', 'actuarial-ml-pricing')
  tier: 1 | 2 | 3 | 4; // internal priority: 1=full package, 2=screenshot+blog, 3=academic, 4=minimal
  status?: 'completed' | 'in-development'; // omit or 'completed' = done; 'in-development' = shows badge
  creation_date: string;           // YYYY-MM-DD — when the project was built/started
  last_modification_date?: string; // YYYY-MM-DD — last significant update (optional)
}

export const projects: Project[] = [
  // repo: https://github.com/GonorAndres/SIMA
  // live: https://sima-d3qj5vwxtq-uc.a.run.app
  // local: /home/andtega349/SIMA
  // source: original work, demographic data from CONAPO/INEGI for mortality projection
  {
    slug: 'sima',
    title: {
      es: 'SIMA: Sistema Integral de Modelación Actuarial',
      en: 'SIMA: Integrated Actuarial Modeling System',
    },
    description: {
      es: 'Valuar reservas de vida exige conectar proyección de mortalidad, producto y capital regulatorio en un solo flujo. SIMA lo hace de extremo a extremo: proyecta mortalidad con Lee-Carter, construye tablas de conmutación, valúa reservas para tres productos y calcula el RCS con pruebas de estrés bajo la LISF. Desplegado en Google Cloud.',
      en: 'Valuing life insurance reserves requires connecting mortality projection, product design, and regulatory capital in one continuous flow. SIMA handles it end-to-end: Lee-Carter mortality projection, commutation tables, reserve valuation for three products, and RCS capital requirements with stress testing under LISF. Deployed on Google Cloud.',
    },
    url: 'https://sima.gonor.me',
    repo: 'https://github.com/GonorAndres/SIMA',
    platform: 'GCP',
    category: 'actuarial',
    tags: {
      es: ['Python', 'FastAPI', 'React', 'Lee-Carter', 'SVD', 'LISF', 'Solvencia II', 'GCP'],
      en: ['Python', 'FastAPI', 'React', 'Lee-Carter', 'SVD', 'LISF', 'Solvency II', 'GCP'],
    },
    variant: 'wide',
    gallery: [
      { src: '/screenshots/sima-01-feature-overview.png', caption: { es: 'Panel principal de SIMA: proyección, tablas y reservas en un solo flujo', en: 'SIMA main dashboard: projection, tables, and reserves in one continuous flow' } },
      { src: '/screenshots/sima-02-kt-trend-covid.png', caption: { es: 'Tendencia κ(t) del modelo Lee-Carter con impacto COVID visible en 2020', en: 'Lee-Carter κ(t) mortality trend with visible COVID impact in 2020' } },
      { src: '/screenshots/sima-03-graduation-curve.png', caption: { es: 'Curva de graduación de mortalidad ajustada por SVD', en: 'Mortality graduation curve fitted via SVD' } },
      { src: '/screenshots/sima-04-3d-mortality-surface.png', caption: { es: 'Superficie de mortalidad 3D: edad, período y tasa proyectada', en: '3D mortality surface: age, period, and projected rate' } },
      { src: '/screenshots/sima-05-premium-sensitivity.png', caption: { es: 'Análisis de sensibilidad de prima ante cambios en mortalidad y tasa técnica', en: 'Premium sensitivity analysis to changes in mortality and technical rate' } },
      { src: '/screenshots/sima-06-scr-breakdown.png', caption: { es: 'Descomposición del RCS por módulo de riesgo bajo la LISF', en: 'RCS capital requirement breakdown by risk module under LISF' } },
    ],
    relatedTo: ['life-insurance', 'property-insurance', 'gmm-explorer', 'michoacan', 'data-analyst-portfolio'],
    blogSlug: 'sima',
    tier: 1,
    creation_date: '2026-01-23',
    last_modification_date: '2026-03-21',
  },

  // repo: https://github.com/GonorAndres/gmm-explorer
  // live: https://gmm-explorer.vercel.app/contexto
  // local: /home/andtega349/gmm-explorer
  // source: CNSF open data — 5.1M GMM claims, 95.9M insured-years (2020-2024)
  {
    slug: 'gmm-explorer',
    title: {
      es: 'GMM Explorer: Gastos Médicos Mayores',
      en: 'GMM Explorer: Major Medical Expenses',
    },
    description: {
      es: 'Tarificar GMM sin datos reales es especular. Este proyecto procesa 5.1M siniestros y 95.9M asegurados-año publicados por la CNSF (2020-2024), los clasifica en tres niveles de hospitalización con IA y calcula la prima pura por frecuencia-severidad ajustada por inflación médica. El resultado: un tarificador interactivo desplegado en Vercel.',
      en: 'Pricing major medical insurance without real claims data is guesswork. This project processes 5.1M claims and 95.9M insured-years from CNSF open data (2020-2024), classifies them into three hospitalization levels with AI, and calculates the net premium via frequency-severity adjusted for medical inflation. The output: an interactive tariff calculator on Vercel.',
    },
    url: 'https://gmm.gonor.me/contexto',
    repo: 'https://github.com/GonorAndres/gmm-explorer',
    platform: 'Vercel',
    category: 'actuarial',
    tags: {
      es: ['Next.js', 'Python', 'Actuaría', 'GMM', 'Tarificación', 'CNSF', 'Claude AI', 'Frecuencia-Severidad', 'Credibilidad'],
      en: ['Next.js', 'Python', 'Actuarial', 'GMM', 'Pricing', 'CNSF', 'Claude AI', 'Frequency-Severity', 'Credibility'],
    },
    variant: 'wide',
    gallery: [
      { src: '/screenshots/gmm-02-siniestros.png', caption: { es: 'Dashboard de siniestros: 3.6M reclamaciones y $213.2B en montos (2020-2024)', en: 'Claims dashboard: 3.6M claims and $213.2B in total amounts (2020-2024)' } },
      { src: '/screenshots/gmm-03-siniestros-charts.png', caption: { es: 'Frecuencia por edad y distribución por nivel de hospitalización', en: 'Claim frequency by age and distribution by hospitalization level' } },
      { src: '/screenshots/gmm-04-polizas.png', caption: { es: 'Explorador de pólizas: 95.9M asegurados-año y $228.5B en prima emitida', en: 'Policy explorer: 95.9M insured-years and $228.5B in issued premiums' } },
      { src: '/screenshots/gmm-06-tarificador.png', caption: { es: 'Tarificador interactivo: prima pura por frecuencia × severidad, desglosada por nivel', en: 'Interactive pricing calculator: net premium via frequency × severity, broken down by level' } },
      { src: '/screenshots/gmm-05-metodologia.png', caption: { es: 'Pipeline metodológico: consolidación, clasificación con IA, cálculo actuarial y tarificación', en: 'Methodology pipeline: consolidation, AI classification, actuarial calculation, and pricing' } },
      { src: '/screenshots/gmm-01-contexto.png', caption: { es: 'Nota técnica: contexto regulatorio CNSF y base matemática del proyecto', en: 'Technical note: CNSF regulatory context and mathematical foundation of the project' } },
    ],
    blogSlug: 'gmm-explorer',
    tier: 1,
    relatedTo: ['sima', 'life-insurance', 'property-insurance', 'data-analyst-portfolio'],
    creation_date: '2025-12-07',
    last_modification_date: '2026-03-21',
  },

  // repo: https://github.com/GonorAndres/data-analyst-path
  // live: 7 dashboards deployed — see blog post for individual URLs
  // local: /home/andtega349/data-analyst-path
  // source: NAIC Schedule P (insurance reserves), Olist e-commerce (Kaggle), Airbnb CDMX (Inside Airbnb)
  {
    slug: 'data-analyst-portfolio',
    title: {
      es: 'Portafolio de Analista de Datos',
      en: 'Data Analyst Portfolio',
    },
    description: {
      es: 'Un analista de datos se evalúa por el rango de problemas que puede resolver, no solo por las herramientas que conoce. Este portafolio reúne 7 proyectos end-to-end: cohortes de e-commerce, reservas actuariales, pruebas A/B, KPIs ejecutivos y análisis de riesgo financiero. Todos desplegados con dashboards interactivos.',
      en: 'A data analyst is evaluated by the range of problems they can solve, not just the tools they know. This portfolio brings together 7 end-to-end projects: e-commerce cohorts, actuarial reserves, A/B testing, executive KPIs, and financial risk analysis. All deployed with interactive dashboards.',
    },
    url: 'https://data-analyst.gonor.me/',
    urls: [
      { label: { es: 'Airbnb - Análisis de Mercado', en: 'Airbnb - Market Analysis' }, url: 'https://data-analyst.gonor.me' },
      { label: { es: 'Reservas P&C - Seguros', en: 'P&C Reserves - Insurance' }, url: 'https://insurance-claims-dashboard-pi.vercel.app' },
      { label: { es: 'Olist - Cohortes E-commerce', en: 'Olist - E-commerce Cohorts' }, url: 'https://da-cohort-streamlit-451451662791.us-central1.run.app' },
      { label: { es: 'A/B Test - Experimentación', en: 'A/B Test - Experimentation' }, url: 'https://ab-test-analysis.vercel.app' },
      { label: { es: 'NovaCRM - KPIs Ejecutivos', en: 'NovaCRM - Executive KPIs' }, url: 'https://executive-kpi-report.vercel.app' },
      { label: { es: 'Portafolio Activos - Finanzas', en: 'Asset Portfolio - Finance' }, url: 'https://financial-portfolio-tracker-iota.vercel.app' },
      { label: { es: 'NYC 311 - Eficiencia Operativa', en: 'NYC 311 - Operational Efficiency' }, url: 'https://operational-efficiency.vercel.app' },
    ],
    repo: 'https://github.com/GonorAndres/data-analyst-path',
    platform: 'Vercel',
    category: 'data-science',
    tags: {
      es: ['Python', 'SQL', 'Streamlit', 'Next.js', 'Plotly', 'Power BI'],
      en: ['Python', 'SQL', 'Streamlit', 'Next.js', 'Plotly', 'Power BI'],
    },
    variant: 'wide',
    gallery: [
      { src: '/screenshots/da-gcp-01-cloud-run-services.png', caption: { es: 'Cloud Run: dos servicios (API FastAPI + app Streamlit) con escala a cero', en: 'Cloud Run: two services (FastAPI API + Streamlit app) with scale-to-zero' } },
      { src: '/screenshots/da-gcp-02-cloud-run-metrics.png', caption: { es: 'Métricas del servicio: request count, CPU y latencia p95 (vista SRE)', en: 'Service metrics: request count, CPU, and p95 latency (SRE view)' } },
      { src: '/screenshots/da-gcp-03-cloud-run-revisions.png', caption: { es: 'Revisiones de Cloud Run: cada deploy crea una revisión inmutable, rollback con un solo comando', en: 'Cloud Run revisions: each deploy creates an immutable revision; one-command rollback' } },
      { src: '/screenshots/da-gcp-04-artifact-registry.png', caption: { es: 'Artifact Registry: imágenes Docker etiquetadas con latest y el SHA del commit exacto', en: 'Artifact Registry: Docker images tagged with latest and the exact git SHA' } },
      { src: '/screenshots/da-gcp-05-wif-pool.png', caption: { es: 'Workload Identity Federation: GitHub intercambia OIDC por credenciales GCP, sin llaves estáticas', en: 'Workload Identity Federation: GitHub exchanges OIDC for GCP credentials, no static keys' } },
      { src: '/screenshots/da-gcp-06-iam-service-account.png', caption: { es: 'Service account con cuatro roles de mínimo privilegio: push de imágenes y rollout de revisiones', en: 'Service account with four least-privilege roles: image push and revision rollout' } },
      { src: '/screenshots/da-gcp-07-gcs-bucket.png', caption: { es: 'GCS bucket: datos viven fuera del repo, CI hace gcloud storage cp antes del docker build', en: 'GCS bucket: data lives outside the repo; CI runs gcloud storage cp before docker build' } },
    ],
    relatedTo: ['sima', 'gmm-explorer', 'ab-testing', 'credit-risk'],
    blogSlug: 'data-analyst-portfolio',
    tier: 1,
    creation_date: '2026-02-21',
    last_modification_date: '2026-03-21',
  },

  // repo: https://github.com/GonorAndres/graph-relation-db
  // local: /home/andtega349/graph-relation-db
  // source: real UK PSC + GLEIF MX ownership topology with synthetic Mexican credit layer
  {
    slug: 'credit-graph',
    title: {
      es: 'CreditGraph: Riesgo Crediticio con Topología de Grafos',
      en: 'CreditGraph: Topological Credit Risk Analysis',
    },
    description: {
      es: 'El análisis crediticio tradicional trata cada préstamo como evento independiente, pero las cadenas de garantías, garantías circulares y concentración accionaria crean exposición correlacionada invisible a modelos relacionales. CreditGraph modela un portafolio de 500 clientes como grafo en Neo4j, procesa datos con PySpark en Databricks, califica con LightGBM calibrado por Platt, y ejecuta pruebas de estrés topológicas que revelan patrones de riesgo estructural ocultos al SQL.',
      en: 'Traditional credit analysis treats each loan as independent, but guarantee chains, circular guarantees, and ownership concentration create correlated exposure invisible to relational models. CreditGraph models a 500-client portfolio as a Neo4j graph, processes data with PySpark on Databricks, scores with Platt-calibrated LightGBM, and runs topological stress tests that reveal structural risk patterns hidden from SQL.',
    },
    url: 'https://graph-relation-db.vercel.app/',
    repo: 'https://github.com/GonorAndres/graph-relation-db',
    platform: 'Vercel',
    category: 'data-science',
    tags: {
      es: ['Neo4j', 'PySpark', 'Databricks', 'Cypher', 'LightGBM', 'Riesgo crediticio', 'Grafos'],
      en: ['Neo4j', 'PySpark', 'Databricks', 'Cypher', 'LightGBM', 'Credit risk', 'Graphs'],
    },
    variant: 'standard',
    gallery: [
      { src: '/screenshots/cg-01-contrast.png', caption: { es: 'Lo que la tabla plana reporta vs. lo que el grafo revela: KPIs saludables ocultan un cluster de riesgo correlacionado', en: 'What the flat table reports vs. what the graph reveals: healthy KPIs hide a correlated risk cluster' } },
      { src: '/screenshots/cg-02-graph-all.png', caption: { es: 'Explora la topología del portafolio: 29 nodos vivos y las cuatro estructuras de riesgo detectadas', en: 'Explore portfolio topology: 29 live nodes and the four detected risk structures' } },
      { src: '/screenshots/cg-03-graph-circular.png', caption: { es: 'Patrón de garantía circular: accionistas cruzando avales entre sus propias empresas', en: 'Circular guarantee pattern: shareholders cross-guaranteeing each other\'s companies' } },
      { src: '/screenshots/cg-04-finding4.png', caption: { es: 'Hallazgos específicos con contraste SQL / Cypher: lo que Cypher encuentra con un patrón que SQL necesita múltiples self-joins para ver', en: 'Specific findings with SQL / Cypher contrast: what Cypher finds with one pattern that SQL needs multiple self-joins to see' } },
      { src: '/screenshots/graph_db_2.png', caption: { es: 'Pipeline ETL en PySpark sobre Databricks', en: 'PySpark ETL pipeline on Databricks' } },
      { src: '/screenshots/graph_db_3.png', caption: { es: 'PDs calibradas con Platt cargadas en Neo4j', en: 'Platt-calibrated PDs loaded into Neo4j' } },
      { src: '/screenshots/graph_db_1.png', caption: { es: 'Topología del grafo en Neo4j AuraDB', en: 'Graph topology in Neo4j AuraDB' } },
      { src: '/screenshots/graph_db_4.png', caption: { es: 'Pruebas de estrés topológicas con Cypher', en: 'Topological stress tests with Cypher' } },
    ],
    relatedTo: ['sima', 'credit-risk', 'lisf-agent', 'data-engineering-platform'],
    blogSlug: 'credit-graph-topological-risk',
    tier: 1,
    creation_date: '2026-03-29',
    last_modification_date: '2026-03-21',
  },

  // repo: https://github.com/GonorAndres/data-engineer-path
  // local: /home/andtega349/data-engineer-path
  // source: 6 projects building a complete GCP data platform for insurance claims
  // 4 deployed to GCP (P01-P04), 2 local-only (P05-P06), total platform cost <$10/month
  {
    slug: 'data-engineering-platform',
    title: {
      es: 'Plataforma de Datos en GCP para Seguros',
      en: 'GCP Data Platform for Insurance',
    },
    description: {
      es: 'Un siniestro de seguros recorre un camino largo entre el evento y el modelo que lo tarifica. Automatizar ese flujo produce datos más rápidos, confiables y consistentes. Este proyecto construye cada tramo sobre GCP: ingesta en tiempo real con Pub/Sub y Beam, warehouse dimensional en BigQuery, orquestación con Dagster, infraestructura con Terraform y un modelo GLM Tweedie que convierte los datos limpios en prima actuarial. Seis etapas, un solo flujo.',
      en: 'An insurance claim travels a long path between the event and the model that prices it. Automating that flow produces faster, more reliable, and more consistent data. This project builds every segment on GCP: real-time ingestion with Pub/Sub and Beam, dimensional warehouse in BigQuery, Dagster orchestration, Terraform infrastructure, and a Tweedie GLM that turns clean data into actuarial premium. Six stages, one continuous flow.',
    },
    url: 'https://claims-dashboard-451451662791.us-central1.run.app',
    repo: 'https://github.com/GonorAndres/data-engineer-path',
    platform: 'GCP',
    category: 'data-engineering',
    tags: {
      es: ['BigQuery', 'Terraform', 'Pub/Sub', 'Apache Beam', 'Dagster', 'Cloud Run', 'DuckDB', 'GLM Tweedie'],
      en: ['BigQuery', 'Terraform', 'Pub/Sub', 'Apache Beam', 'Dagster', 'Cloud Run', 'DuckDB', 'Tweedie GLM'],
    },
    variant: 'wide',
    gallery: [
      { src: '/screenshots/de-01-cicd-pipeline.png', caption: { es: 'Pipeline CI/CD completo: lint, test, build y deploy en Cloud Run en menos de cuatro minutos tras cada merge', en: 'Full CI/CD pipeline: lint, test, build, and Cloud Run deploy in under four minutes after every merge' } },
      { src: '/screenshots/de-02-dagster-assets.png', caption: { es: 'Activos Dagster: cinco capas (raw → staging → intermediate → marts → reports) con linaje explícito', en: 'Dagster assets: five layers (raw → staging → intermediate → marts → reports) with explicit lineage' } },
      { src: '/screenshots/de-03-dagster-lineage.png', caption: { es: 'Grafo de linaje global en Dagster: dependencias entre activos definidas en código', en: 'Global asset lineage graph in Dagster: inter-asset dependencies defined in code' } },
      { src: '/screenshots/de-04-bigquery-schema.png', caption: { es: 'Modelo dimensional en BigQuery: tablas de hechos y dimensiones materializadas por Dataform en cuatro capas', en: 'Dimensional model in BigQuery: fact and dimension tables materialized by Dataform in four layers' } },
      { src: '/screenshots/de-05-artifact-registry.png', caption: { es: 'Artifact Registry: cada commit genera una imagen Docker etiquetada con el SHA exacto del commit', en: 'Artifact Registry: every commit produces a Docker image tagged with the exact git SHA' } },
      { src: '/screenshots/de-06-cloudrun-revisions.png', caption: { es: 'Revisiones de Cloud Run: cada merge despliega una nueva revisión; el rollback es un clic', en: 'Cloud Run revisions: each merge deploys a new revision; rollback is one click away' } },
      { src: '/screenshots/de-07-claims-dashboard.png', caption: { es: 'Dashboard de siniestros en vivo: triángulo de pérdidas, salud del portafolio, adecuación de primas y riesgo geográfico', en: 'Live claims dashboard: loss triangle, portfolio health, pricing adequacy, and geographic risk' } },
    ],
    relatedTo: ['sima', 'insurance-pricing-ml', 'data-analyst-portfolio', 'credit-graph'],
    blogSlug: 'data-engineering-platform',
    tier: 1,
    creation_date: '2026-02-21',
    last_modification_date: '2026-03-21',
  },

  // repo: https://github.com/GonorAndres/seguridad-social
  // local: /home/andtega349/seguridad_social/fondo_bienestar
  // source: original calculations based on LSS (Ley del Seguro Social), UMA historical values, AFORE commission data
  {
    slug: 'pension-simulator',
    title: {
      es: 'Simulador de Pensión IMSS + Fondo Bienestar',
      en: 'IMSS Pension Simulator + Fondo Bienestar',
    },
    description: {
      es: 'La mayoría de los trabajadores mexicanos no sabe bajo qué régimen de pensión cotiza ni cuánto recibirá al retiro. Esta aplicación R Shiny resuelve esa ambigüedad: ingresa salario, semanas cotizadas y rendimiento AFORE esperado para obtener la pensión estimada bajo Ley 73, Ley 97 y Fondo Bienestar, con análisis de sensibilidad y reporte descargable.',
      en: 'Most Mexican workers do not know which pension regime they are enrolled in or what they will actually receive at retirement. This R Shiny app resolves that ambiguity: enter salary, contribution weeks, and expected AFORE return to get estimated benefits under Ley 73, Ley 97, and Fondo Bienestar, with sensitivity analysis and a downloadable report.',
    },
    url: 'https://simulador-pension-d3qj5vwxtq-uc.a.run.app/',
    repo: 'https://github.com/GonorAndres/seguridad-social/tree/main/fondo_bienestar',
    platform: 'GCP',
    category: 'actuarial',
    tags: {
      es: ['R', 'Shiny', 'IMSS', 'AFORE', 'Pensiones'],
      en: ['R', 'Shiny', 'IMSS', 'AFORE', 'Pensions'],
    },
    variant: 'standard',
    screenshot: '/screenshots/pension-simulator.png',
    gallery: [
      { src: '/screenshots/pension-01-landing.png', caption: { es: 'Landing page: calcula tu pensión en 5 minutos, sin registro, 100% privado', en: 'Landing page: calculate your pension in 5 minutes, no registration, 100% private' } },
      { src: '/screenshots/pension-02-control.png', caption: { es: 'Marco de control: comparación honesta de Ley 73, Ley 97 y Fondo Bienestar con lo que puedes y no puedes controlar', en: 'Control framework: honest comparison of Ley 73, Ley 97, and Fondo Bienestar with what you can and cannot control' } },
      { src: '/screenshots/pension-03-afore.png', caption: { es: 'Wizard paso 3: selección de AFORE, saldo actual, aportación voluntaria y escenario de rendimiento', en: 'Wizard step 3: AFORE selection, current balance, voluntary contribution, and return scenario' } },
      { src: '/screenshots/pension-04-results.png', caption: { es: 'Resultado: pensión estimada con desglose AFORE, aportaciones voluntarias y complemento Fondo Bienestar', en: 'Result: estimated pension with AFORE breakdown, voluntary contributions, and Fondo Bienestar supplement' } },
      { src: '/screenshots/pension-05-sensitivity.png', caption: { es: 'Análisis de sensibilidad: sliders de salario, aportación voluntaria y edad de retiro con proyección de saldo', en: 'Sensitivity analysis: salary, voluntary contribution, and retirement age sliders with balance projection' } },
      { src: '/screenshots/pension-06-mobile.png', caption: { es: 'Diseño responsive: landing con contexto educativo desplegable en móvil', en: 'Responsive design: landing with expandable educational context on mobile' } },
    ],
    relatedTo: ['sima', 'life-insurance'],
    blogSlug: 'pension-simulator',
    tier: 1,
    creation_date: '2026-02-07',
    last_modification_date: '2026-03-19',
  },

  // repo: https://github.com/GonorAndres/regulation-actuarial-agent
  // local: /home/andtega349/lisf-agent
  // live: https://actuarial-regulation-agent-d3qj5vwxtq-uc.a.run.app/
  // source: LISF + CUSF PDFs — Mexican insurance and surety regulation
  {
    slug: 'lisf-agent',
    title: {
      es: 'Asistente de Regulación Actuarial',
      en: 'Actuarial Regulation Assistant',
    },
    description: {
      es: 'La LISF y la CUSF suman más de mil artículos y su interpretación requiere navegar entre disposiciones interrelacionadas. Este agente indexa el texto completo de ambas leyes y genera respuestas contextualizadas con referencia exacta al artículo, sin alucinaciones de citas. Incluye un explorador interactivo para recorrer los 510 artículos de la LISF y las 1,833 disposiciones de la CUSF con referencias cruzadas como enlaces activos. Código de acceso: actuaria-claude.',
      en: 'LISF and CUSF together span over a thousand articles, and interpreting them requires navigating interrelated provisions. This agent indexes the full text of both laws and returns contextualized answers with exact article references, with no hallucinated citations. It includes an interactive explorer to browse all 510 LISF articles and 1,833 CUSF provisions with cross-references as active links. Access code: actuaria-claude.',
    },
    url: 'https://lisf.gonor.me/',
    urls: [
      { label: { es: 'Agente RAG - Versión completa (API)', en: 'RAG Agent - Full version (API)' }, url: 'https://lisf.gonor.me/' },
      { label: { es: 'Agente RAG - Versión gratuita (HuggingFace)', en: 'RAG Agent - Free version (HuggingFace)' }, url: 'https://huggingface.co/spaces/GonorAndres/lisf-agent' },
      { label: { es: 'Explorador LISF/CUSF', en: 'LISF/CUSF Explorer' }, url: 'https://lisf.gonor.me/explorer' },
    ],
    repo: 'https://github.com/GonorAndres/regulation-actuarial-agent',
    platform: 'GCP',
    category: 'actuarial',
    tags: {
      es: ['Claude SDK', 'FastAPI', 'LISF', 'CUSF', 'Python', 'GCP'],
      en: ['Claude SDK', 'FastAPI', 'LISF', 'CUSF', 'Python', 'GCP'],
    },
    variant: 'standard',
    screenshot: '/screenshots/lisf-agent.png',
    gallery: [
      { src: '/screenshots/lisf-01-auth.png', caption: { es: 'Pantalla de acceso: el agente es de uso restringido con codigo de acceso', en: 'Access screen: the agent is restricted with an access code' } },
      { src: '/screenshots/lisf-02-landing.png', caption: { es: 'Panel principal: sidebar con estructura LISF/CUSF, preguntas frecuentes y tres modos de respuesta', en: 'Main panel: sidebar with LISF/CUSF structure, FAQ, and three response modes' } },
      { src: '/screenshots/lisf-03-indice.png', caption: { es: 'Indice completo de la LISF: 510 articulos organizados en 13 Titulos', en: 'Full LISF index: 510 articles organized in 13 Titles' } },
      { src: '/screenshots/lisf-04-chat.png', caption: { es: 'Respuesta sobre reservas tecnicas: el agente cita articulos reales con referencias cruzadas LISF-CUSF', en: 'Response on technical reserves: the agent cites real articles with LISF-CUSF cross-references' } },
      { src: '/screenshots/lisf-06-chat-response.png', caption: { es: 'Detalle de respuesta: desglose de los articulos 216, 217 y 218 sobre constitucion y valuacion de reservas', en: 'Response detail: breakdown of articles 216, 217, and 218 on reserve constitution and valuation' } },
      { src: '/screenshots/lisf-05-ayuda.png', caption: { es: 'Panel de ayuda: ejemplos de consultas, consejos de uso y aviso legal', en: 'Help panel: query examples, usage tips, and legal disclaimer' } },
      { src: '/screenshots/lisf-07-hf-landing.png', caption: { es: 'Version open-source en HuggingFace: Qwen2.5-72B, sin codigo de acceso, preguntas frecuentes precalculadas', en: 'Open-source version on HuggingFace: Qwen2.5-72B, no access code, precalculated FAQ' } },
      { src: '/screenshots/lisf-08-hf-art216.png', caption: { es: 'HuggingFace: respuesta sobre el articulo 216, desglose de reservas por fraccion', en: 'HuggingFace: response on article 216, reserve breakdown by section' } },
      { src: '/screenshots/lisf-09-hf-articulos.png', caption: { es: 'HuggingFace: estructura completa de la LISF, 510 articulos y articulos transitorios', en: 'HuggingFace: full LISF structure, 510 articles and transitory articles' } },
      { src: '/screenshots/lisf-10-hf-solvencia.png', caption: { es: 'HuggingFace: requisitos de solvencia con referencia al articulo 237 y disposicion 34.1.2 de la CUSF', en: 'HuggingFace: solvency requirements referencing article 237 and CUSF provision 34.1.2' } },
    ],
    relatedTo: ['sima', 'credit-graph'],
    blogSlug: 'regulation-agent-rag',
    tier: 1,
    creation_date: '2026-02-01',
    last_modification_date: '2026-05-03',
  },

  // repo: no public GitHub repo — Drive folder IS the deliverable
  // source: original technical note (UNAM coursework), aligned to LISF/CUSF regulation
  {
    slug: 'life-insurance',
    title: {
      es: 'Nota Técnica: Seguro de Vida',
      en: 'Technical Note: Life Insurance',
    },
    description: {
      es: 'Registrar un seguro de vida ante la CNSF implica entregar bases técnicas que justifiquen cada supuesto biométrico y cada carga. Esta nota técnica recorre el ciclo completo del producto individual: bases de mortalidad, cálculo de prima neta y comercial, valuación de reservas y cuantificación del requerimiento de capital de solvencia bajo la LISF.',
      en: 'Registering a life insurance product with CNSF requires submitting technical bases that justify every biometric assumption and loading. This technical note covers the full individual product cycle: mortality bases, net and commercial premium calculation, reserve valuation, and solvency capital requirement quantification under LISF.',
    },
    url: 'https://drive.google.com/drive/folders/1PfotLUbidzwk8gdW4kbqQfLB4PbkuYBj',
    platform: 'Drive',
    category: 'actuarial',
    tags: {
      es: ['Actuaría', 'Seguros', 'Regulación'],
      en: ['Actuarial', 'Insurance', 'Regulation'],
    },
    variant: 'standard',
    screenshot: '/screenshots/vida-tecnica.png',
    relatedTo: ['sima', 'property-insurance', 'michoacan', 'gmm-explorer'],
    tier: 2,
    creation_date: '2024-12-01',
  },

  // repo: no public GitHub repo — Drive folder IS the deliverable
  // source: original technical note (UNAM coursework), CNSF auto insurance data
  {
    slug: 'property-insurance',
    title: {
      es: 'Nota Técnica: Seguro de Daños',
      en: 'Technical Note: Property Insurance',
    },
    description: {
      es: 'La prima de un seguro de daños mezcla exposición al riesgo, gastos operativos y margen de utilidad: descomponerlos correctamente requiere estadística. Esta nota técnica usa datos públicos de la CNSF para construir el modelo de frecuencia-severidad para autos, contrasta su estructura con el ramo de vida y entrega un cotizador funcional en Excel.',
      en: 'A property insurance premium blends risk exposure, operating expenses, and profit margin; decomposing them correctly requires statistics. This technical note uses CNSF public data to build a frequency-severity model for auto insurance, contrasts its structure with the life branch, and delivers a functional Excel quoter.',
    },
    url: 'https://drive.google.com/drive/folders/12tF-Ma_sWtDM5k6zYzNx8btUGS78b-0W',
    platform: 'Drive',
    category: 'actuarial',
    tags: {
      es: ['Actuaría', 'Autos', 'CNSF'],
      en: ['Actuarial', 'Auto', 'CNSF'],
    },
    variant: 'standard',
    screenshot: '/screenshots/danos-tecnica.png',
    relatedTo: ['sima', 'life-insurance', 'gmm-explorer'],
    tier: 2,
    creation_date: '2025-06-01',
  },

  // repo: https://github.com/GonorAndres/Proyectos_Aprendizaje (subfolder: EvaluaciónDerivadosDivisas)
  // source: real FX market data (MXN/USD forward curve)
  {
    slug: 'derivatives',
    title: {
      es: 'Derivados de Divisas: Finanzas Cuantitativas',
      en: 'Currency Derivatives: Quantitative Finance',
    },
    description: {
      es: 'El mercado de divisas cotiza tipo spot, forwards y opciones al mismo tiempo; cada precio implica una tasa o volatilidad distinta. Este análisis construye la curva forward MXN/USD a partir de datos reales, valúa contratos forward, calcula spreads bid-offer y mapea la superficie de volatilidad implícita para distintos strikes y vencimientos.',
      en: 'The FX market quotes spot, forwards, and options simultaneously; each price implies a different rate or volatility. This analysis builds the MXN/USD forward curve from real market data, prices forward contracts, calculates bid-offer spreads, and maps the implied volatility surface across strikes and maturities.',
    },
    url: 'https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/Evaluaci%C3%B3nDerivadosDivisas',
    platform: 'GitHub',
    category: 'quant-finance',
    tags: {
      es: ['Python', 'Derivados', 'Opciones'],
      en: ['Python', 'Derivatives', 'Options'],
    },
    variant: 'wide',
    screenshot: '/screenshots/derivatives.png',
    relatedTo: ['markowitz'],
    tier: 3,
    creation_date: '2025-06-12',
    last_modification_date: '2025-08-09',
  },

  // repo: no public GitHub repo — Drive folder IS the deliverable
  // source: Mexican stock market price data (10 assets, historical prices)
  {
    slug: 'markowitz',
    title: {
      es: 'Optimización de Portafolio: Markowitz',
      en: 'Portfolio Optimization: Markowitz',
    },
    description: {
      es: 'La decisión de asignación de activos determina más del rendimiento de una cartera que la selección individual de cada valor. Este proyecto aplica optimización de Markowitz a 10 activos del mercado mexicano, construye la frontera eficiente y calcula la cartera tangente, que alcanzó 110% de rendimiento anualizado en el período de prueba.',
      en: 'Asset allocation decisions explain more of a portfolio\'s return than individual security selection. This project applies Markowitz optimization to 10 Mexican market assets, builds the efficient frontier, and calculates the tangency portfolio, which achieved 110% annualized return over the test period.',
    },
    url: 'https://drive.google.com/drive/folders/1Dz54zcTpa9quMFCkgddBN5GWQfy6CIXv',
    platform: 'Drive',
    category: 'quant-finance',
    tags: {
      es: ['Excel', 'VaR', 'Finanzas'],
      en: ['Excel', 'VaR', 'Finance'],
    },
    variant: 'standard',
    screenshot: '/screenshots/markowitz.png',
    relatedTo: ['derivatives'],
    tier: 3,
    creation_date: '2025-06-01',
  },

  // repo: no public GitHub repo — Drive folder IS the deliverable
  // source: INEGI Census 2020, Michoacán state demographic data
  {
    slug: 'michoacan',
    title: {
      es: 'Análisis Demográfico: Michoacán',
      en: 'Demographic Analysis: Michoacan',
    },
    description: {
      es: 'Las tablas nacionales de mortalidad promedian regiones con realidades muy diferentes. Este análisis toma Michoacán como caso de estudio y construye indicadores demográficos propios con datos del censo INEGI 2020: tasas de mortalidad por edad, índices de fecundidad y estructura poblacional. Un ejercicio que muestra cuánto cambian los supuestos actuariales cuando se usan datos regionales en lugar de promedios nacionales.',
      en: 'National mortality tables average regions with very different realities. This analysis takes Michoacan as a case study and builds its own demographic indicators from INEGI 2020 census data: age-specific mortality rates, fertility indices, and population structure. An exercise showing how much actuarial assumptions change when using regional data instead of national averages.',
    },
    url: 'https://drive.google.com/drive/folders/1U_KrCv0g6o-JWNv0l6RHoPCWZBr0-exu',
    platform: 'Drive',
    category: 'applied-math',
    tags: {
      es: ['Excel', 'INEGI', 'Demografía'],
      en: ['Excel', 'INEGI', 'Demographics'],
    },
    variant: 'standard',
    screenshot: '/screenshots/demografia-michoacan.png',
    relatedTo: ['sima', 'life-insurance'],
    tier: 3,
    creation_date: '2023-12-01',
  },

  // repo: no public GitHub repo — Drive folder IS the deliverable
  // source: Mexico City Government open data — public debt registry with TIIE rate series
  {
    slug: 'data-cleaning',
    title: {
      es: 'Limpieza de Datos: Deuda Pública CDMX',
      en: 'Data Cleaning: CDMX Public Debt',
    },
    description: {
      es: 'Los registros de deuda pública de la Ciudad de México llegaron con inconsistencias de formato, fechas duplicadas y tasas TIIE vacías. El proyecto reconstruye la serie completa y deja la base lista para análisis, documentando cada decisión de limpieza con fórmulas avanzadas de Excel.',
      en: 'Mexico City\'s public debt records arrived with format inconsistencies, duplicate dates, and missing TIIE rates. The project reconstructs the complete rate series and leaves the database analysis-ready, documenting every cleaning decision with advanced Excel formulas.',
    },
    url: 'https://drive.google.com/drive/folders/1qOYJXgcIiZUyhf2OQTCRu_bgskaZ06AE',
    platform: 'Drive',
    category: 'data-science',
    tags: {
      es: ['Excel', 'Datos', 'TIIE'],
      en: ['Excel', 'Data', 'TIIE'],
    },
    variant: 'standard',
    screenshot: '/screenshots/deuda-cdmx.png',
    relatedTo: ['credit-risk'],
    tier: 3,
    creation_date: '2025-06-01',
  },

  // repo: https://github.com/GonorAndres/Proyectos_Aprendizaje (subfolder: TexasPokerCaseStudy)
  // source: original simulation, no external dataset
  {
    slug: 'monte-carlo-poker',
    title: {
      es: 'Simulación Monte Carlo: Poker',
      en: 'Monte Carlo Simulation: Poker',
    },
    description: {
      es: 'Cuando la solución analítica es intratable, simular miles de escenarios es la única opción práctica. Este proyecto aplica Monte Carlo a Texas Hold\'em para estimar probabilidades de mano, muestra la convergencia de las estimaciones conforme crece el número de simulaciones y traza el puente metodológico hacia pricing de derivados y análisis de riesgo actuarial.',
      en: 'When the analytical solution is intractable, simulating thousands of scenarios is the only practical option. This project applies Monte Carlo to Texas Hold\'em to estimate hand probabilities, shows how estimates converge as simulation count grows, and draws the methodological bridge toward derivatives pricing and actuarial risk analysis.',
    },
    url: 'https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/TexasPokerCaseStudy',
    platform: 'GitHub',
    category: 'data-science',
    tags: {
      es: ['Python', 'Simulación', 'Probabilidad'],
      en: ['Python', 'Simulation', 'Probability'],
    },
    variant: 'standard',
    screenshot: '/screenshots/monte-carlo-poker.png',
    relatedTo: ['ab-testing'],
    tier: 3,
    creation_date: '2025-06-12',
    last_modification_date: '2025-08-09',
  },

  // repo: no public GitHub repo — Drive folder IS the deliverable
  // source: original Excel model (UNAM coursework)
  {
    slug: 'amortization',
    title: {
      es: 'Tabla de Amortizaciones Dinámica',
      en: 'Dynamic Amortization Table',
    },
    description: {
      es: 'Los primeros pagos de un crédito casi no reducen el saldo; casi todo va a intereses. Entender por qué exige ver la tabla completa de amortización. Esta herramienta dinámica en Excel construye y compara esquemas de pago fijo, decreciente y francés: ajusta monto, tasa y plazo para ver cómo cambia la distribución entre capital e intereses.',
      en: 'Early loan payments barely reduce the principal balance; almost everything goes to interest. Understanding why requires seeing the full amortization schedule. This dynamic Excel tool builds and compares fixed, decreasing, and French payment schemes: adjust principal, rate, and term to see how the split between capital and interest shifts over time.',
    },
    url: 'https://drive.google.com/drive/folders/15Zyl2XKcXKnmrrFLtlctQwYeVz_C9EdW',
    platform: 'Drive',
    category: 'actuarial',
    tags: {
      es: ['Excel', 'Amortización'],
      en: ['Excel', 'Amortization'],
    },
    variant: 'standard',
    screenshot: '/screenshots/amortizacion.png',
    relatedTo: ['derivatives'],
    tier: 3,
    creation_date: '2024-06-01',
  },

  // repo: https://github.com/GonorAndres/Analisis_Seguros_Mexico
  // local: /home/andtega349/seguridad_social (different path — note the repo is Analisis_Seguros_Mexico)
  // source: EMSSA-09 Mexican mortality tables, original actuarial calculations, no external dataset required
  {
    slug: 'actuarial-suite',
    title: {
      es: 'Suite Actuarial Mexicana',
      en: 'Mexican Actuarial Suite',
    },
    description: {
      es: 'No existe una librería actuarial open-source pensada para la regulación mexicana. suite_actuarial llena ese vacío: ocho dominios de seguros (vida, daños, salud, pensiones, reservas, reaseguro, regulatorio, configuración) con la EMSSA-09, circulares CNSF y artículos SAT integrados desde el diseño. Se instala con pip, se despliega con Docker, y expone endpoints REST junto con un dashboard bilingüe en Next.js.',
      en: 'There is no open-source actuarial library built for Mexican regulation. suite_actuarial fills that gap: eight insurance domains (life, P&C, health, pensions, reserves, reinsurance, regulatory, configuration) with EMSSA-09 mortality tables, CNSF circulars, and SAT tax articles built into the design. It installs with pip, deploys with Docker, and exposes REST endpoints alongside a bilingual Next.js dashboard.',
    },
    url: 'https://suite-actuarial-d3qj5vwxtq-uc.a.run.app',
    repo: 'https://github.com/GonorAndres/Analisis_Seguros_Mexico',
    platform: 'GCP',
    category: 'actuarial',
    tags: {
      es: ['Python', 'Pydantic', 'Next.js', 'FastAPI', 'LISF', 'RCS', 'CNSF', 'Reaseguro', 'EMSSA-09'],
      en: ['Python', 'Pydantic', 'Next.js', 'FastAPI', 'LISF', 'RCS', 'CNSF', 'Reinsurance', 'EMSSA-09'],
    },
    variant: 'wide',
    screenshot: '/screenshots/actuarial-suite.png',
    gallery: [
      { src: '/screenshots/suite-01-home-hero.png', caption: { es: 'Landing bilingue con navegacion por dominio: vida, danos, salud, pensiones, reservas, regulatorio, reaseguro y API', en: 'Bilingual landing with domain navigation: life, P&C, health, pensions, reserves, regulatory, reinsurance, and API' } },
      { src: '/screenshots/suite-02-vida-results.png', caption: { es: 'Tarificacion vida: prima neta \$2,024 y prima total \$2,388 MXN con desglose de recargos (gastos admin, adquisicion, utilidad)', en: 'Life pricing: \$2,024 net premium and \$2,388 MXN gross premium with loading breakdown (admin, acquisition, profit)' } },
      { src: '/screenshots/suite-03-danos-auto.png', caption: { es: 'Cotizacion auto: prima total \$14,825 MXN con desglose por cobertura (danos materiales, robo, RC, gastos medicos)', en: 'Auto quote: \$14,825 MXN total premium with coverage breakdown (material damage, theft, liability, medical)' } },
      { src: '/screenshots/suite-04-pensiones.png', caption: { es: 'Pension IMSS Ley 73: pension mensual \$18,506 MXN para 1,500 semanas cotizadas, con detalle del calculo paso a paso', en: 'IMSS Ley 73 pension: \$18,506 MXN monthly for 1,500 contribution weeks, with step-by-step calculation detail' } },
      { src: '/screenshots/suite-05-salud-gmm.png', caption: { es: 'GMM: prima total \$45,000 MXN con tabla de tarificacion por zona geografica, nivel hospitalario y factores de ajuste', en: 'GMM: \$45,000 MXN total premium with pricing table by geographic zone, hospital level, and adjustment factors' } },
      { src: '/screenshots/suite-06-reservas.png', caption: { es: 'Chain Ladder: reserva total \$4,729 MXN, ultimate \$25,729 MXN con desglose por ano de origen', en: 'Chain Ladder: \$4,729 MXN total reserve, \$25,729 MXN ultimate with breakdown by origin year' } },
      { src: '/screenshots/suite-07-regulatorio.png', caption: { es: 'RCS: capital de solvencia \$209M MXN, ratio 139.58%, con modulos de riesgo vida, danos e inversion agregados por correlacion CNSF', en: 'RCS: \$209M MXN solvency capital, 139.58% ratio, with life, P&C, and investment risk modules aggregated by CNSF correlation' } },
      { src: '/screenshots/suite-08-reaseguro.png', caption: { es: 'Quota Share: \$20K cedido, \$4.98M retenido, recuperacion \$3,240 MXN con ratio de cesion y resumen del contrato', en: 'Quota Share: \$20K ceded, \$4.98M retained, \$3,240 MXN recovery with cession ratio and contract summary' } },
      { src: '/screenshots/suite-09-api-docs.png', caption: { es: 'Documentacion de API: 28 endpoints REST agrupados por dominio con parametros, tipos y descripciones', en: 'API documentation: 28 REST endpoints grouped by domain with parameters, types, and descriptions' } },
    ],
    blogSlug: 'suite-actuarial',
    tier: 1,
    relatedTo: ['sima', 'life-insurance', 'property-insurance'],
    creation_date: '2025-11-18',
    last_modification_date: '2026-05-03',
  },

  // repo: https://github.com/GonorAndres/CarteraSeguroAutos
  // live: https://cartera-autos-d3qj5vwxtq-uc.a.run.app
  // local: /home/andtega349/carteras-autos-R
  // source: synthetic data generated with R, calibrated to AMIS and CONDUSEF market parameters
  {
    slug: 'cartera-autos',
    title: {
      es: 'Plataforma de Siniestralidad Auto',
      en: 'Auto Insurance Claims Platform',
    },
    description: {
      es: 'Gestionar una cartera de autos con datos dispersos entre áreas genera decisiones lentas y riesgo de inconsistencia. Esta plataforma reúne tarificación, reservas, pruebas de estrés y detección de fraude en un solo dashboard sobre 140K pólizas calibradas al mercado mexicano. Cuando cualquier equipo consulta el mismo sistema, la gestión de la cartera se vuelve más rápida y confiable. Construido con 17 módulos R.',
      en: 'Managing an auto portfolio with data scattered across departments leads to slow decisions and inconsistency risk. This platform brings pricing, reserves, stress testing, and fraud detection into a single dashboard over 140K policies calibrated to the Mexican market. When every team queries the same system, portfolio management becomes faster and more reliable. Built with 17 R modules.',
    },
    url: 'https://cartera-autos-451451662791.us-central1.run.app',
    repo: 'https://github.com/GonorAndres/CarteraSeguroAutos',
    platform: 'GCP',
    category: 'actuarial',
    tags: {
      es: ['R', 'Shiny', 'GLM', 'IBNR', 'Monte Carlo', 'bslib', 'CONDUSEF', 'AMIS', 'Fraude', 'Autos'],
      en: ['R', 'Shiny', 'GLM', 'IBNR', 'Monte Carlo', 'bslib', 'CONDUSEF', 'AMIS', 'Fraud', 'Auto'],
    },
    variant: 'wide',
    screenshot: '/screenshots/cartera-autos.png',
    gallery: [
      { src: '/screenshots/cartera-autos-01-resumen.png', caption: { es: 'Resumen ejecutivo: 140K pólizas, frecuencia 9.78%, severidad promedio \$27,715 MXN y prima pura \$324 por póliza', en: 'Executive summary: 140K policies, 9.78% frequency, \$27,715 MXN average severity, and \$324 pure premium per policy' } },
      { src: '/screenshots/cartera-autos-02-temporal.png', caption: { es: 'Análisis temporal: siniestros por mes (año sobre año), severidad mensual promedio, composición por tipo y días de reporte', en: 'Temporal analysis: claims by month (year over year), average monthly severity, composition by type, and report lag' } },
      { src: '/screenshots/cartera-autos-03-severidad.png', caption: { es: 'Análisis de severidad: distribución por tipo de siniestro, histograma de montos y severidad por tipo de vehículo', en: 'Severity analysis: distribution by claim type, amount histogram, and severity by vehicle type' } },
      { src: '/screenshots/cartera-autos-04-pricing.png', caption: { es: 'Motor de pricing GLM: coeficientes Poisson (frecuencia) y Gamma (severidad) con prima pura promedio de \$2,682', en: 'GLM pricing engine: Poisson (frequency) and Gamma (severity) coefficients with \$2,682 average pure premium' } },
      { src: '/screenshots/cartera-autos-05-ibnr.png', caption: { es: 'Reservas IBNR: triángulo de pagos acumulados con factores de desarrollo por año de ocurrencia', en: 'IBNR reserves: cumulative payment triangle with development factors by accident year' } },
      { src: '/screenshots/cartera-autos-06-escenarios.png', caption: { es: 'Stress testing: simulación Monte Carlo con VaR 99.5%, distribución de pérdida agregada baseline vs. estresada', en: 'Stress testing: Monte Carlo simulation with 99.5% VaR, baseline vs. stressed aggregate loss distribution' } },
    ],
    blogSlug: 'cartera-autos',
    tier: 1,
    relatedTo: ['pension-simulator', 'sima', 'property-insurance'],
    creation_date: '2025-08-30',
    last_modification_date: '2026-03-19',
  },

  // repo: https://github.com/GonorAndres/proust-attention
  // local: /home/andtega349/proust-attention
  // source: Project Gutenberg — full text of "À la recherche du temps perdu" (7 volumes)
  {
    slug: 'proust-attention',
    title: {
      es: 'La Máquina de Atención de Proust',
      en: 'The Proust Attention Machine',
    },
    description: {
      es: 'Los modelos de lenguaje se usan a diario pero pocos saben lo que ocurre dentro. Este transformer character-level, entrenado con los 7 volúmenes de En busca del tiempo perdido y construido desde cero en PyTorch, hace visible ese mecanismo: cómo se aprenden embeddings, cómo opera la atención multi-cabeza y por qué todo se reduce a multiplicación de matrices.',
      en: 'Language models are used daily but few people understand what happens inside. This character-level transformer, trained on all 7 volumes of In Search of Lost Time and built from scratch in PyTorch, makes that mechanism visible: how embeddings are learned, how multi-head attention operates, and why everything reduces to matrix multiplication.',
    },
    url: 'https://huggingface.co/spaces/GonorAndres/proust-attention',
    repo: 'https://github.com/GonorAndres/proust-attention',
    platform: 'HuggingFace',
    category: 'data-science',
    tags: {
      es: ['PyTorch', 'Transformers', 'NLP', 'Deep Learning'],
      en: ['PyTorch', 'Transformers', 'NLP', 'Deep Learning'],
    },
    screenshot: '/screenshots/proust-attention.png',
    variant: 'standard',
    relatedTo: ['lisf-agent'],
    blogSlug: 'proust-attention-machine',
    tier: 1,
    creation_date: '2026-02-07',
    last_modification_date: '2026-03-14',
  },

  // repo: https://github.com/GonorAndres/Proyectos_Aprendizaje (subfolder: Bayesian_vs_Frequentist)
  // source: synthetic conversion rate experiment data
  {
    slug: 'ab-testing',
    title: {
      es: 'Test A/B: Inferencia Bayesiana vs Frecuentista',
      en: 'A/B Test: Bayesian vs Frequentist Inference',
    },
    description: {
      es: 'Cuando una prueba A/B termina, la pregunta real es si la diferencia observada justifica cambiar el producto. Este proyecto corre los dos marcos sobre el mismo experimento de conversión: frecuentista con chi-cuadrado y potencia estadística, bayesiano con distribución Beta posterior en PyMC. El resultado muestra cuándo cada enfoque cambia la decisión.',
      en: 'When an A/B test ends, the real question is whether the observed difference justifies changing the product. This project runs both frameworks on the same conversion experiment: frequentist with chi-square and statistical power, Bayesian with Beta posterior in PyMC. The result shows when each approach actually changes the decision.',
    },
    url: 'https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/Bayesian_vs_Frequentist',
    platform: 'GitHub',
    category: 'data-science',
    tags: {
      es: ['Python', 'Bayes', 'PyMC'],
      en: ['Python', 'Bayes', 'PyMC'],
    },
    variant: 'tall',
    screenshot: '/screenshots/ab-testing.png',
    relatedTo: ['credit-risk'],
    tier: 2,
    creation_date: '2025-06-12',
    last_modification_date: '2025-08-09',
  },

  // repo: https://github.com/GonorAndres/data-science-path (subfolder: projects/insurance-pricing)
  // local: /home/andtega349/data-science-path/projects/insurance-pricing
  // source: synthetic insurance data generated with actuarial assumptions (Poisson/Gamma frequency-severity)
  {
    slug: 'insurance-pricing-ml',
    title: {
      es: 'Tarificación de Seguros con ML',
      en: 'Insurance Pricing with ML',
    },
    description: {
      es: 'El modelo actuarial clásico ofrece interpretabilidad; machine learning ofrece capacidad predictiva. La pregunta es cuándo la ganancia en precisión justifica la complejidad adicional. Este proyecto corre ambos enfoques sobre los mismos datos de seguros, compara sus resultados y analiza si las primas que genera cada modelo son equitativas entre género y grupos de edad. Resultados explorables en un dashboard interactivo.',
      en: 'The classic actuarial model offers interpretability; machine learning offers predictive power. The question is when the gain in accuracy justifies the added complexity. This project runs both approaches on the same insurance data, compares their outputs, and analyzes whether each model\'s premiums are equitable across gender and age groups. Results explorable in an interactive dashboard.',
    },
    url: '/blog/actuarial-ml-pricing/',
    repo: 'https://github.com/GonorAndres/data-science-path',
    platform: 'GitHub',
    category: 'data-science',
    tags: {
      es: ['Python', 'GLM', 'XGBoost', 'SHAP', 'Fairness', 'FastAPI'],
      en: ['Python', 'GLM', 'XGBoost', 'SHAP', 'Fairness', 'FastAPI'],
    },
    variant: 'wide',
    relatedTo: ['sima', 'data-analyst-portfolio', 'credit-risk'],
    blogSlug: 'actuarial-ml-pricing',
    tier: 2,
    creation_date: '2026-02-21',
    last_modification_date: '2026-03-15',
  },

  // repo: https://github.com/GonorAndres/b-trees
  // local: /home/andtega349/b-trees
  // source: original Rust implementation, no external dataset — motivated by PostgreSQL index internals study
  {
    slug: 'b-tree-explorer',
    title: {
      es: 'B-Tree Explorer: Cómo Funcionan los Índices',
      en: 'B-Tree Explorer: How Database Indexes Work',
    },
    description: {
      es: 'Los índices de PostgreSQL operan sobre árboles B, pero la documentación no muestra cómo funcionan por dentro. Este explorador, implementado en Rust y compilado a WebAssembly, anima inserciones, búsquedas y divisiones de nodos paso a paso, haciendo visible por qué los árboles B garantizan búsqueda O(log n) sobre almacenamiento en disco.',
      en: 'PostgreSQL indexes operate on B-trees, but the documentation does not show how they work internally. This explorer, implemented in Rust and compiled to WebAssembly, animates insertions, searches, and node splits step by step, making visible why B-trees guarantee O(log n) search on disk-based storage.',
    },
    url: 'https://github.com/GonorAndres/b-trees',
    platform: 'GitHub',
    category: 'applied-math',
    tags: {
      es: ['Rust', 'WASM', 'Estructuras de Datos', 'PostgreSQL'],
      en: ['Rust', 'WASM', 'Data Structures', 'PostgreSQL'],
    },
    variant: 'standard',
    relatedTo: ['data-analyst-portfolio'],
    blogSlug: 'b-trees-optimization',
    tier: 3,
    creation_date: '2026-02-07',
  },

  // repo: https://github.com/GonorAndres/forecasting
  // local: /home/andtega349/forecasting
  // source: historical global volcanic eruption catalog (Smithsonian GVP or equivalent public dataset)
  // advisor: Dr. Hugo Delgado (UNAM)
  {
    slug: 'eruption-forecasting',
    title: {
      es: 'Pronóstico de Erupciones Volcánicas',
      en: 'Volcanic Eruption Forecasting',
    },
    description: {
      es: 'Pronosticar erupciones volcánicas es un problema de eventos raros con alta varianza y datos escasos. Este análisis ajusta modelos ARIMA y suavizamiento exponencial al catálogo histórico del Smithsonian GVP, evalúa los intervalos de predicción y documenta los límites inherentes de aplicar series de tiempo a fenómenos geofísicos extremos.',
      en: 'Forecasting volcanic eruptions is a rare-event problem with high variance and scarce data. This analysis fits ARIMA and exponential smoothing models to the Smithsonian GVP historical catalog, evaluates prediction intervals, and documents the inherent limits of applying time series methods to extreme geophysical events.',
    },
    url: '#', // repo is private; update when blog post is published or repo is made public
    platform: 'GitHub',
    category: 'applied-math',
    tags: {
      es: ['Python', 'Series de Tiempo', 'ARIMA', 'Pronóstico'],
      en: ['Python', 'Time Series', 'ARIMA', 'Forecasting'],
    },
    variant: 'standard',
    relatedTo: ['michoacan', 'ab-testing'],
    status: 'in-development',
    tier: 4,
    creation_date: '2026-02-07',
  },

  // repo: Google Colab notebook (url IS the source)
  // source: original Python implementation (UNAM coursework, Numerical Analysis)
  {
    slug: 'euler-method',
    title: {
      es: 'Método de Euler: Ecuaciones Diferenciales',
      en: 'Euler Method: Differential Equations',
    },
    description: {
      es: 'Las ecuaciones diferenciales describen el mundo continuo; las computadoras operan en tiempo discreto. El método de Euler es el puente más simple entre ambos. Esta implementación en Python parte de la demostración del teorema de Picard-Lindelöf, construye el método paso a paso y cuantifica el error de discretización en función del tamaño de paso.',
      en: 'Differential equations describe the continuous world; computers operate in discrete time. Euler\'s method is the simplest bridge between both. This Python implementation starts from the Picard-Lindelöf existence proof, builds the method step by step, and quantifies the discretization error as a function of step size.',
    },
    url: 'https://colab.research.google.com/drive/1g6uDqBaJoHbx2MyNeh2tgP5nwKOgqPkA',
    platform: 'Colab',
    category: 'applied-math',
    tags: {
      es: ['Python', 'EDOs', 'Euler'],
      en: ['Python', 'ODEs', 'Euler'],
    },
    variant: 'standard',
    screenshot: '/screenshots/euler-method.png',
    relatedTo: ['michoacan'],
    tier: 3,
    creation_date: '2024-04-01',
  },

  // repo: https://github.com/GonorAndres/learning-posgre
  // local: /home/andtega349/learning_posgre
  // source: PostgresPro Airlines demo database — 5.74M rows of real Russian airline data
  {
    slug: 'flight-analytics-pg-bq',
    title: {
      es: 'Flight Analytics: Datos y Dashboards de Aviación',
      en: 'Flight Analytics: Aviation Data and Dashboards',
    },
    description: {
      es: 'Las aerolíneas generan millones de registros de vuelos, retrasos, ingresos y ocupación de flota. Analizar esos datos requiere elegir la base de datos correcta para cada pregunta. Este proyecto toma 5.74M registros de operaciones aéreas reales, los analiza en PostgreSQL para entender cómo optimizar consultas desde el motor, los migra a BigQuery para comparar ambos paradigmas de bases de datos y presenta los hallazgos en un dashboard interactivo: mapa de rutas, patrones de retraso, concentración de ingresos y rendimiento de flota.',
      en: 'Airlines generate millions of records on flights, delays, revenue, and fleet utilization. Analyzing that data requires choosing the right database for each question. This project takes 5.74M real airline operation records, analyzes them in PostgreSQL to understand how to optimize queries from the engine level, migrates them to BigQuery to compare both database paradigms, and presents the findings in an interactive dashboard: route map, delay patterns, revenue concentration, and fleet performance.',
    },
    url: 'https://project-ad7a5be2-a1c7-4510-82d.firebaseapp.com/',
    repo: 'https://github.com/GonorAndres/learning-posgre',
    platform: 'Firebase',
    category: 'data-engineering',
    tags: {
      es: ['PostgreSQL', 'BigQuery', 'Python', 'Docker', 'ETL', 'EXPLAIN ANALYZE', 'Next.js', 'deck.gl', 'Firebase', 'recharts'],
      en: ['PostgreSQL', 'BigQuery', 'Python', 'Docker', 'ETL', 'EXPLAIN ANALYZE', 'Next.js', 'deck.gl', 'Firebase', 'recharts'],
    },
    variant: 'wide',
    screenshot: '/screenshots/flight-analytics-pg-bq.png',
    gallery: [
      { src: '/screenshots/flight-01-map.png', caption: { es: 'Mapa WebGL de 104 aeropuertos y 532 rutas coloreadas por tasa de retraso', en: 'WebGL map of 104 airports and 532 routes colored by delay rate' } },
      { src: '/screenshots/flight-02-delays.png', caption: { es: 'Análisis de retrasos: 4.9% global, heatmap por hora y día, KPIs de la red', en: 'Delay analysis: 4.9% overall, heatmap by hour and day, network KPIs' } },
      { src: '/screenshots/flight-03-revenue.png', caption: { es: 'Ingresos: 37.7B RUB, curva de Pareto (128 rutas = 80% del ingreso), desglose por clase', en: 'Revenue: 37.7B RUB, Pareto curve (128 routes = 80% of revenue), fare class breakdown' } },
      { src: '/screenshots/flight-04-internals.png', caption: { es: 'PostgreSQL internals: mejoras de 44x a 3024x medidas con EXPLAIN ANALYZE', en: 'PostgreSQL internals: 44x to 3024x speedups measured with EXPLAIN ANALYZE' } },
      { src: '/screenshots/flight-05-pipeline.png', caption: { es: 'Pipeline ETL: 5.74M filas migradas en 102s a 56K filas/s, arquitectura Extract-Transform-Load', en: 'ETL pipeline: 5.74M rows migrated in 102s at 56K rows/s, Extract-Transform-Load architecture' } },
    ],
    relatedTo: ['data-engineering-platform', 'data-analyst-portfolio'],
    blogSlug: 'flight-analytics-pg-bq',
    tier: 1,
    creation_date: '2026-02-07',
    last_modification_date: '2026-05-03',
  },

  // repo: https://github.com/GonorAndres/risk-analyst
  // local: /home/andtega349/risk-analyst
  // source: 13 progressive quant risk projects — yfinance, FRED, synthetic data with actuarial assumptions
  {
    slug: 'risk-analyst',
    title: {
      es: 'Risk Analyst: Análisis Cuantitativo de Riesgos',
      en: 'Risk Analyst: Quantitative Risk Analysis',
    },
    description: {
      es: 'El riesgo financiero cuantitativo no se aprende de un solo modelo: requiere construir progresivamente desde los fundamentos. Esta serie recorre 13 proyectos que van desde calcular cuánto puede perder un portafolio en un día (VaR) hasta modelar cómo la quiebra de una institución contagia al sistema financiero completo. Cubre acciones, bonos, opciones y riesgo sistémico con datos reales de mercado.',
      en: 'Quantitative financial risk is not learned from a single model; it requires building progressively from the foundations. This series spans 13 projects ranging from calculating how much a portfolio can lose in a day (VaR) to modeling how one institution\'s failure spreads across the entire financial system. Covers equities, bonds, options, and systemic risk with real market data.',
    },
    url: '/blog/risk-analyst/',
    repo: 'https://github.com/GonorAndres/risk-analyst',
    platform: 'GitHub',
    category: 'quant-finance',
    tags: {
      es: ['Python', 'VaR', 'CVaR', 'Monte Carlo', 'Deep Learning', 'Copulas', '+7'],
      en: ['Python', 'VaR', 'CVaR', 'Monte Carlo', 'Deep Learning', 'Copulas', '+7'],
    },
    variant: 'standard',
    screenshot: '/screenshots/risk-analyst.png',
    relatedTo: ['credit-risk', 'derivatives', 'markowitz'],
    blogSlug: 'risk-analyst',
    tier: 2,
    creation_date: '2026-03-18',
    last_modification_date: '2026-03-19',
  },

  // repo: https://github.com/GonorAndres/Proyectos_Aprendizaje (subfolder: Credit_Risk_Model)
  // source: Kaggle credit default dataset (~32,000 records)
  {
    slug: 'credit-risk',
    title: {
      es: 'Modelo Predictivo de Incumplimiento Crediticio',
      en: 'Credit Default Prediction Model',
    },
    description: {
      es: 'Aprobar un crédito riesgoso no cuesta lo mismo que rechazar uno solvente. Este modelo GLM entrenado con 32,000 registros discrimina riesgo de incumplimiento con variables financieras y demográficas, alcanzando 85.19% de AUC. El análisis incluye calibración del umbral de decisión según el costo asimétrico de cada tipo de error.',
      en: 'Approving a risky loan does not carry the same cost as rejecting a solvent one. This GLM model trained on 32,000 records discriminates default risk using financial and demographic variables, achieving 85.19% AUC. The analysis includes decision threshold calibration based on the asymmetric cost of each error type.',
    },
    url: 'https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/Credit_Risk_Model',
    platform: 'GitHub',
    category: 'data-science',
    tags: {
      es: ['ML', 'GLM', 'Riesgo'],
      en: ['ML', 'GLM', 'Risk'],
    },
    variant: 'wide',
    screenshot: '/screenshots/credit-risk.png',
    relatedTo: ['ab-testing', 'data-cleaning', 'credit-graph'],
    tier: 2,
    creation_date: '2025-06-12',
    last_modification_date: '2025-08-09',
  },

  // local: /home/andtega349/micro-insurance
  // source: original research — INEGI mortality, Banxico remittances, CONEVAL marginalization, EMSSA-2009
  // status: in-development (Phase 1 not started)
  {
    slug: 'micro-insurance',
    title: {
      es: 'MicroInsurance.jl: Tarificación para Economía Informal',
      en: 'MicroInsurance.jl: Pricing Engine for the Informal Economy',
    },
    description: {
      es: '~35M de trabajadores informales en México no tienen acceso a seguros de vida porque el underwriting tradicional exige empleo formal, historial crediticio y examen médico. Este motor reemplaza esos requisitos con señales proxy (mortalidad geográfica, remesas, pagos de servicios) ponderadas por credibilidad Buhlmann-Straub sobre una superficie de mortalidad Lee-Carter. Julia.',
      en: '~35M informal workers in Mexico lack access to life insurance because traditional underwriting requires formal employment, credit history, and medical exams. This engine replaces those requirements with proxy signals (geographic mortality, remittances, utility payments) weighted through Buhlmann-Straub credibility over a Lee-Carter mortality surface. Julia.',
    },
    url: '#',
    platform: 'GitHub',
    category: 'actuarial',
    tags: {
      es: ['Julia', 'Lee-Carter', 'Buhlmann-Straub', 'LISF', 'Microfinanzas', 'INEGI'],
      en: ['Julia', 'Lee-Carter', 'Buhlmann-Straub', 'LISF', 'Microfinance', 'INEGI'],
    },
    variant: 'standard',
    relatedTo: ['sima', 'pension-simulator', 'lisf-agent', 'actuarial-suite', 'michoacan'],
    tier: 3,
    status: 'in-development',
    creation_date: '2026-03-26',
  },

  // repo: https://github.com/GonorAndres/teaching-apis (pending)
  // live: https://learning-apis-451451662791.us-central1.run.app
  // local: /home/andtega349/projects_2.0/teaching-apis
  // source: FRED, Banxico, World Bank APIs + custom mortality API
  {
    slug: 'teaching-apis',
    title: {
      es: 'APIs para Analistas',
      en: 'APIs for Analysts',
    },
    description: {
      es: 'Si trabajas con tasas de la Fed, tipo de cambio de Banxico o indicadores del Banco Mundial, ya consumes APIs sin saberlo. Esta plataforma interactiva enseña qué pasa entre tu solicitud y tus datos: latencia, errores, autenticación, caché. Un playground con datos reales, laboratorios para romper cosas a propósito y escenarios what-if sobre datos de mortalidad y economía.',
      en: 'If you work with Fed rates, Banxico exchange rates, or World Bank indicators, you already consume APIs without knowing it. This interactive platform teaches what happens between your request and your data: latency, errors, authentication, caching. A playground with live data, labs for breaking things on purpose, and what-if scenarios on mortality and economic data.',
    },
    url: 'https://learning-apis-451451662791.us-central1.run.app',
    repo: 'https://github.com/GonorAndres/teaching-apis',
    platform: 'GCP',
    category: 'data-engineering',
    tags: {
      es: ['Next.js', 'TypeScript', 'FRED', 'Banxico', 'APIs', 'Educativo'],
      en: ['Next.js', 'TypeScript', 'FRED', 'Banxico', 'APIs', 'Educational'],
    },
    variant: 'standard',
    screenshot: '/screenshots/teaching-apis.png',
    gallery: [
      { src: '/screenshots/teaching-apis-01-hero.png', caption: { es: 'Landing: del concepto a la practica, con datos reales', en: 'Landing: from concept to practice, with real data' } },
      { src: '/screenshots/teaching-apis-02-playground.png', caption: { es: 'Playground: consulta en vivo a la API de FRED con preview del request y respuesta tabulada', en: 'Playground: live FRED API query with request preview and tabulated response' } },
      { src: '/screenshots/teaching-apis-03-analysis.png', caption: { es: 'Analisis: tasas de interes (FRED), tipo de cambio (Banxico), mortalidad (World Bank) y metricas combinadas', en: 'Analysis: interest rates (FRED), exchange rates (Banxico), mortality (World Bank), and combined metrics' } },
      { src: '/screenshots/teaching-apis-04-latency.png', caption: { es: 'Carrera de latencia: cuatro APIs compiten en tiempo real, la local responde en 28ms vs 714ms de FRED', en: 'Latency race: four APIs compete in real time, local responds in 28ms vs 714ms from FRED' } },
      { src: '/screenshots/teaching-apis-05-chaos.png', caption: { es: 'Laboratorio de errores: provoca cada codigo HTTP a proposito para reconocerlos cuando ocurran en produccion', en: 'Error lab: trigger each HTTP error code on purpose so you recognize them when they happen in production' } },
      { src: '/screenshots/teaching-apis-06-whatif.png', caption: { es: 'Escenarios what-if: ajusta la esperanza de vida de Mexico y compara dato real vs hipotetico', en: 'What-if scenarios: adjust Mexico life expectancy and compare real vs hypothetical data' } },
    ],
    blogSlug: 'teaching-apis',
    relatedTo: ['flight-analytics-pg-bq', 'data-engineering-platform'],
    tier: 1,
    creation_date: '2026-05-01',
  },
];

export function getProjects(lang: Lang) {
  return projects.map((p) => ({
    slug: p.slug,
    title: p.title[lang],
    description: p.description[lang],
    url: p.url.startsWith('/') && lang === 'en' ? `/en${p.url}` : p.url,
    urls: p.urls?.map(u => ({ label: u.label[lang], url: u.url })),
    repo: p.repo,
    platform: p.platform,
    category: p.category,
    tags: p.tags[lang],
    variant: p.variant,
    screenshot: p.screenshot,
    gallery: p.gallery?.map(g => ({ src: g.src, caption: g.caption?.[lang] })),
    relatedTo: p.relatedTo,
    blogSlug: p.blogSlug,
    tier: p.tier,
    status: p.status,
    creation_date: p.creation_date,
    last_modification_date: p.last_modification_date,
  }));
}

export function getRelatedProjectNames(slugs: string[], lang: Lang): string[] {
  return slugs
    .map((slug) => {
      const project = projects.find((p) => p.slug === slug);
      return project ? project.title[lang] : null;
    })
    .filter((name): name is string => name !== null);
}
