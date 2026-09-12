---
title: "Dashboards con React: Por qué construir reportes analíticos con código"
description: "Dos dashboards de análisis exploratorio (Airbnb CDMX y Olist E-Commerce) como caso de estudio de por qué Next.js y Recharts son una alternativa seria a Power BI y Tableau para reportes analíticos de producción."
date: "2026-03-05"
category: "herramientas"
lang: "es"
tags: ["React", "Next.js", "Recharts", "dashboards", "data-analytics", "Airbnb", "Olist"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/analytics-dashboards.webp"
heroAlt: "Dos rutas, resultados precalculados y cómputo por solicitud, convergen en una misma presentación analítica."
heroCaption: "La arquitectura depende de si un filtro selecciona resultados ya calculados o exige volver a calcularlos."
---

> **Nota:** Este proyecto es parte del [Portafolio de Analista de Datos: 7 Proyectos End-to-End](/blog/data-analyst-portfolio). Aquí se presenta el análisis completo de este proyecto en particular.

Power BI y Tableau existen por una razón válida: permiten a un analista sin experiencia en frontend construir un reporte funcional en horas. Para exploración ad hoc, para stakeholders internos que necesitan filtros básicos, para el primer borrador de un análisis, son herramientas razonables. El problema aparece cuando ese borrador tiene que convertirse en un producto. Cuando el reporte tiene que ser responsive en móvil. Cuando el modo oscuro es un requisito. Cuando la interacción entre gráficas necesita ser más rica que un simple filtro de segmento. Cuando el diseñador tiene un sistema tipográfico que no encaja en las plantillas de la herramienta. En ese momento, las herramientas drag-and-drop muestran sus límites estructurales.

La premisa de este proyecto es directa: construir dos dashboards de análisis exploratorio completos usando Next.js y Recharts, y documentar en el proceso qué gana y qué pierde un equipo técnico al elegir la ruta de código en lugar de la ruta de la herramienta BI.

## Los dos proyectos

### Airbnb CDMX: análisis de mercado

El punto de partida es el dataset de Inside Airbnb para Ciudad de México, correspondiente a marzo de 2025: 27,051 listings con 79 columnas cada uno. El pipeline ETL en Python (pandas) maneja la limpieza de precios (el campo price llega como string con símbolo de moneda y comas), la gestión de nulos en campos críticos, la segmentación de hosts entre operadores enterprise y casuales, y un muestreo geográfico estratificado a 3,000 puntos para la visualización de dispersión sin saturar el renderizado.

La arquitectura es deliberadamente minimalista: no hay API, no hay base de datos. El ETL produce 5 archivos JSON con un tamaño total menor a 500 KB, que se cargan en el build de Next.js mediante `fs.readFileSync`. El resultado es una aplicación estática que carga instantáneamente y no requiere ninguna infraestructura de servidor en producción.

Los hallazgos que el dashboard hace visibles: Cuauhtémoc concentra el 46% de los listings (12,514), impulsado por Roma Norte, Condesa y Centro Histórico. Los alojamientos de tipo "entire home/apartment" representan el 71% de la oferta y tienen una distribución de precios que se concentra entre MXN 1,000 y MXN 1,500 por noche, el doble que las habitaciones privadas que se agrupan alrededor de MXN 500. El dato más revelador sobre la estructura del mercado: el 7% de los hosts controla el 40% de la oferta. Blueground (221 listings), Mr. W (164) y Clau (156) son los tres operadores más grandes. No son anfitriones particulares rentando su departamento, son empresas de hospitalidad operando a escala industrial en una plataforma diseñada originalmente para particulares.

Las alcaldías periféricas muestran el patrón inverso: Tlalpan (MXN 2,493 promedio) y Cuajimalpa (MXN 2,151) tienen precios superiores a la media del mercado pero volumen bajo. El pricing premium con oferta escasa, probablemente casas de mayor superficie para grupos, que no compite directamente con la densidad hotelera del centro.

### Olist E-Commerce: análisis de cohortes

El segundo dashboard trabaja con el Brazilian E-Commerce Public Dataset de Olist, disponible en Kaggle: 7 tablas CSV que cubren órdenes, productos, clientes, vendedores, reseñas y geolocalizaciones. El ETL en Python produce archivos Parquet que alimentan un backend FastAPI. La elección de un backend activo, frente al JSON estático del dashboard de Airbnb, responde a la naturaleza del análisis: el análisis de cohortes requiere cómputos que dependen de los filtros aplicados, y generarlos todos en build time sería inmanejable.

El panel incluye la matriz de retención de cohortes (heatmap), curvas de LTV, análisis de segmentos RFM, distribución geográfica por estados brasileños, y una gráfica de dispersión que pone en relación el tiempo de entrega con el puntaje de reseña. Esta última es la visualización más directamente accionable del proyecto: muestra con precisión a partir de qué número de días de entrega el puntaje de satisfacción empieza a caer de forma sistemática, información que un equipo de operaciones puede usar directamente para establecer SLAs.

## El argumento a favor de React para reportes de producción

**Control total sobre la estética.** El dashboard de Olist tiene modo oscuro y claro implementados con CSS custom properties. Cuando el usuario cambia el tema, las 12 gráficas del dashboard transicionan suavemente. En Power BI, eso requeriría mantener dos versiones del reporte o depender de una funcionalidad de temas que no controla la tipografía, el espaciado ni los colores de los componentes de Recharts. Con CSS variables y un ThemeToggle en React, la misma lógica se aplica a todos los componentes de la interfaz sin excepción.

La tipografía del dashboard usa una serif editorial para los títulos y monoespaciada para los datos numéricos. Es una decisión de diseño intencionada que comunica que los números son datos, no decoración. No existe un mecanismo en Tableau para hacer eso de forma consistente en todas las visualizaciones.

**Interactividad que va más allá de los filtros.** El FilterBar del dashboard de Airbnb actualiza simultáneamente el histograma de precios, la dispersión geográfica, el ranking de colonias y la segmentación de hosts. No porque haya una funcionalidad nativa de "cross-filtering": porque el estado de los filtros vive en un store de React y cada componente lo consume. Agregar una nueva gráfica que responda a los mismos filtros es añadir un componente que lea del mismo store. En una herramienta BI, esa misma operación requeriría configurar explícitamente las interacciones entre cada par de visualizaciones.

**Flexibilidad arquitectónica.** Los dos dashboards de este proyecto tienen arquitecturas opuestas. Airbnb: JSON estático, cero backend, despliegue a CDN. Olist: FastAPI con cómputo de cohortes server-side, despliegue en Cloud Run. Ninguna herramienta BI permite elegir la arquitectura por proyecto según los requisitos. Streamlit fuerza un modelo de servidor Python para todo. Power BI Service requiere Gateway para datos on-premise. Con Next.js la elección es explícita y reversible.

**Reusabilidad de componentes.** Ambos dashboards comparten KPICard, ChartContainer, ThemeToggle y DatasetInfo. Son componentes escritos una vez y usados en cualquier contexto. El análisis de reservas actuariales del portafolio ([insurance claims dashboard](https://github.com/GonorAndres/data-analyst-path/tree/main/projects/01-insurance-claims-dashboard)) también reutiliza el mismo patrón de KPICard y ChartContainer. En Power BI, los "temas" ofrecen consistencia de color, pero no composición de componentes.

**Control de versiones y colaboración.** Este punto parece obvio pero tiene consecuencias reales. El dashboard es código. Se puede revisar en GitHub, comentar en un PR, hacer checkout de la versión del trimestre pasado para comparar, integrar en un pipeline de CI/CD que verifique que el build no se rompe antes de un merge. Un archivo `.pbix` no puede ser diffed. No se puede ver qué cambió entre la versión del Q3 y la del Q4 sin abrir ambas manualmente.

**Despliegue y costos.** Los dashboards de Airbnb y Olist comparten ahora una aplicación Next.js en Cloudflare Pages. El análisis de Airbnb está en <a href="https://data-analyst.gonor.me/airbnb/" target="_blank" rel="noopener">/airbnb/</a>, servido como archivos estáticos desde la CDN. El backend de Olist corre en Cloud Run: escala a cero cuando no hay peticiones, y el primer millón de requests mensuales entra en el free tier. Sin licencias. Sin renovaciones anuales. Sin negociación con el área de compras.

## Las desventajas reales

Este argumento tiene límites claros, y vale la pena nombrarlos explícitamente.

El tiempo de setup inicial es mayor. Un analista que no conoce React necesita aprender el modelo de componentes, el manejo de estado, el ecosistema de build, y las convenciones de TypeScript antes de poder construir algo útil. Power BI permite producir un reporte con gráficas funcionales en una tarde. Eso no es trivial cuando el objetivo es iterar rápido sobre un análisis exploratorio.

No es adecuado para usuarios no técnicos que necesitan actualizar el reporte. Si el requerimiento es que el analista de negocio pueda agregar una métrica nueva al dashboard sin tocar código, React no es la respuesta correcta. Power BI tiene un modo de edición visual que permite exactamente eso. La ruta de código asume que quien mantiene el dashboard entiende el código.

Recharts no es un sustituto completo para análisis estadístico visual. Para análisis de regresión con bandas de confianza, visualizaciones de distribución complejas, o gráficas de series de tiempo con detección de anomalías, Python (matplotlib, seaborn, plotly) o R (ggplot2) siguen siendo más expresivos. Recharts está diseñado para dashboards operativos, no para análisis estadístico exploratorio.

La propuesta no es reemplazar Tableau para todos los casos de uso. Es que para reportes que van a ser vistos por personas externas, que necesitan comportarse correctamente en cualquier dispositivo, que tienen una identidad visual definida, y que van a ser mantenidos en el tiempo por un equipo técnico, el costo de construirlos en código se amortiza rápidamente.

## Decisiones arquitectónicas: estático vs API

La elección entre JSON estático y un backend depende de dos preguntas: ¿el cómputo puede hacerse en build time? ¿El volumen de datos lo permite?

Para Airbnb CDMX, la respuesta a ambas preguntas es sí. Los 27,051 listings se procesan una vez en el ETL, los datos agrupados caben en menos de 500 KB, y ningún cálculo depende de la interacción del usuario en el servidor. JSON estático es la solución más simple y eficiente.

Para Olist, la respuesta cambia. El análisis de cohortes requiere calcular matrices de retención que varían según el rango de fechas, la categoría de producto y el estado geográfico seleccionados. Generar todas las combinaciones posibles en build time produciría cientos de archivos JSON y tiempos de build impracticables. El backend FastAPI evalúa los filtros en tiempo real y devuelve solo los datos necesarios para la vista actual. El ColdStartBanner en el frontend notifica al usuario cuando el backend está en proceso de arranque en Cloud Run (el cold start tarda unos segundos después de un período de inactividad), que es un detalle de UX que en una herramienta BI no tendría equivalente porque la infraestructura está siempre activa.

Este mismo patrón es el que usa el [dashboard de reservas actuariales](https://github.com/GonorAndres/data-analyst-path/tree/main/projects/01-insurance-claims-dashboard): los triángulos de pérdida y el IBNR se calculan server-side en FastAPI porque dependen de los filtros de línea de negocio y año de origen seleccionados. La arquitectura es la misma, el dominio es diferente.

## Conexiones con otros proyectos

El ETL de este proyecto y el de [SIMA](https://sima.gonor.me) comparten un problema estructural: datos de entrada que requieren limpieza no trivial antes de poder calcular cualquier cosa. En SIMA, las tablas de mortalidad y las tasas técnicas tienen que validarse antes de alimentar el motor de reservas. Aquí, los precios de Airbnb llegan como strings malformados y los timestamps de Olist necesitan parsing cuidadoso para construir las cohortes correctamente. La metodología de limpieza (validación de tipos, manejo explícito de nulos, logging de registros descartados) es transferible entre dominios.

La segmentación de hosts en el dashboard de Airbnb (enterprise vs casual) usa la misma lógica de clasificación por percentiles que aparece en el análisis de segmentos RFM del dashboard de Olist: definir umbrales sobre una distribución para asignar etiquetas de comportamiento. En seguros, esa misma operación es la tarificación por segmento; el [GMM Explorer](https://gmm.gonor.me/contexto) hace exactamente eso para GMM. El patrón es recurrente en análisis de datos: definir grupos a partir de una distribución, medir diferencias entre grupos, tomar decisiones basadas en esa heterogeneidad.

## Material de referencia

- <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/apps/web" target="_blank" rel="noopener">Frontend compartido en GitHub</a>: La aplicación Next.js reúne los componentes React/TypeScript de ambos dashboards y del resto del portafolio.
- <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/00-demo-aestehtics" target="_blank" rel="noopener">Investigación y backend</a>: ETL en Python, notebooks de Jupyter, datos estáticos y backend FastAPI para Olist. Los notebooks de EDA están disponibles para visualización directa en el repositorio.
