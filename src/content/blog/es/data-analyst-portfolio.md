---
title: "Portafolio de Analista de Datos: 7 Proyectos End-to-End"
description: "Siete proyectos end-to-end en seis dominios: bienes raíces, reservas de seguros, cohortes de e-commerce, experimentación de producto, finanzas (KPIs de SaaS y riesgo de portafolio) y operaciones del sector público. Las mismas herramientas estadísticas atraviesan todos, y ese es el argumento: un analista de datos tiene que sostener varios dominios a la vez, porque el rango es lo que vuelve transferible la profundidad. Cada proyecto se entrega como dashboard interactivo, todos en un solo dominio en vivo."
date: "2026-03-13"
category: "proyectos-y-analisis"
lang: "es"
shape: "narrative"
tags: ["portafolio", "data-analyst", "SQL", "Python", "Next.js", "multidominio"]
ficha:
  rol: "Autor único"
  año: "2024-2026"
  stack: "Python · SQL · Next.js · Plotly"
  datos: "7 proyectos: bienes raíces, e-commerce, seguros, finanzas, A/B testing, KPIs ejecutivos, eficiencia operacional"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/data-analyst-path"
  live: "https://data-analyst.gonor.me"
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/data-analyst-portfolio.webp"
heroAlt: "Distintas series de datos atraviesan un proceso común de ordenación, segmentación y comparación."
heroCaption: "Cambian los dominios; se repite el trabajo de ordenar datos, comparar grupos e interpretar la evidencia."
---


El trabajo de un analista de datos no es producir gráficas. Es convertir una pregunta de negocio en una decisión informada. Cada proyecto de este portafolio sigue ese arco completo: un stakeholder tiene una pregunta, los datos existen en algún formato inconveniente, el análisis produce un hallazgo, y el hallazgo se entrega en un formato que la audiencia puede usar para actuar.

El arco se repite en seis dominios que casi no comparten vocabulario: rentas cortas en Ciudad de México, reservas de seguros en EE.UU., e-commerce brasileño, experimentos de producto, las finanzas de un SaaS y de un portafolio de ETFs, el sistema de quejas públicas de Nueva York. El rango es deliberado. Cada dominio plantea su pregunta en sus propios términos (ocupación, ratios de pérdida, retención, lift de conversión, churn, rendimiento ajustado por riesgo, SLAs), y el analista tiene que ponerse varios de esos lentes a la vez, porque debajo de ellos el trabajo estadístico se repite: segmentar una distribución, estimar lo que todavía no se observa, revisar si un agregado esconde a sus subgrupos. El rango y la profundidad no compiten. El rango es lo que vuelve transferible la profundidad: una curva de supervivencia ajustada sobre pólizas de seguros lee la retención de un e-commerce sin modificación.

La formación actuarial pone el rigor estadístico: Kaplan-Meier, distribuciones de severidad, métodos de reserva. El rol de analista exige el complemento: SQL fluido, dashboards que un stakeholder pueda navegar solo, storytelling para audiencias no técnicas. El método se mantiene constante en los 7 proyectos: ETL cuidadoso, análisis exploratorio antes de cualquier conclusión, segmentación como herramienta recurrente, y entrega en el formato que el stakeholder necesita, ya sea un dashboard interactivo o un PDF automatizado.

## Los 7 proyectos

### 00 - Airbnb CDMX: análisis de mercado

**Pregunta de negocio:** ¿Cómo está estructurado el mercado de rentas cortas en Ciudad de México, y qué tan concentrada está la oferta?

El dataset de Inside Airbnb para CDMX contiene 27,051 listings con 79 columnas. El pipeline ETL limpia precios (llegan como strings con símbolo de moneda), gestiona nulos y segmenta hosts entre operadores enterprise y casuales: fijar umbrales sobre una distribución, asignar etiquetas, comparar los grupos. Ese movimiento regresa en todos los proyectos que siguen. El hallazgo central: el 7% de los hosts controla el 40% de la oferta. Blueground, Mr. W y Clau no son anfitriones compartiendo su departamento, son empresas de hospitalidad operando a escala industrial. Cuauhtémoc concentra el 46% de los listings, mientras que las alcaldías periféricas como Tlalpan (MXN 2,493 promedio) muestran pricing premium con oferta escasa.

Dashboard construido con Next.js y Recharts, arquitectura estática: JSON precalculado, zero backend.

**Estado:** Completo | <a href="https://data-analyst.gonor.me/airbnb/" target="_blank" rel="noopener">App en vivo</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/00-demo-aestehtics" target="_blank" rel="noopener">GitHub</a>

### 01 - Reservas actuariales P&C: IBNR y siniestralidad

**Pregunta de negocio:** De las 6 líneas de negocio del portafolio, ¿cuáles son rentables y cuál es el IBNR (incurred but not reported, siniestros ocurridos pero no reportados) total que la aseguradora debe reservar?

Las aseguradoras en EE.UU. están obligadas a reportar su historial de siniestros al regulador en un formato estandarizado llamado NAIC Schedule P: básicamente una tabla que muestra, para cada año, cuánto se ha pagado en siniestros y cuánto falta por pagar. El problema es que muchos siniestros tardan años en reportarse. Un seguro de responsabilidad médica (Medical Malpractice, que cubre errores médicos como una cirugía fallida o un diagnóstico incorrecto) puede tener demandas que emergen 5 o 7 años después del evento. Muy diferente al seguro de auto, donde sabes el daño el mismo día del accidente.

Los métodos Chain-Ladder y Bornhuetter-Ferguson atacan ese problema de formas distintas: el primero extrapola los patrones históricos de desarrollo de siniestros para proyectar lo que falta; el segundo combina esa proyección con un supuesto externo del sector cuando los datos propios son escasos. Ambos producen una estimación del IBNR: el dinero que la aseguradora debe reservar hoy para siniestros que ya ocurrieron pero todavía no llegaron a la mesa.

El hallazgo más revelador: Medical Malpractice muestra un ratio de pérdidas de ~280%, lo que significa que por cada \$100 de prima cobrada, la aseguradora pagó \$280 en siniestros. No es una mala racha, es un problema estructural de tarificación. Solo Private Passenger Auto y Product Liability son rentables. El IBNR total del portafolio es ~\$20.4M, concentrado en las líneas donde los siniestros toman más tiempo en resolverse.

Dashboard interactivo con Next.js y FastAPI: triángulos de pérdida en heatmap, waterfall de IBNR, frecuencia-severidad y tendencia de ratios combinados.

**Estado:** Completo | <a href="https://data-analyst.gonor.me/insurance" target="_blank" rel="noopener">App en vivo</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/01-insurance-claims-dashboard" target="_blank" rel="noopener">GitHub</a>

### 02 - Cohortes de E-Commerce: retención, RFM y LTV

**Pregunta de negocio:** ¿Qué diferencia al 3% de clientes que recompran en Olist del 97% que no regresa?

El dataset de Olist tiene ~99K órdenes en 9 archivos de datos. El hallazgo que reencuadra todo el análisis: solo ~3% de los clientes vuelven a comprar. En un negocio de e-commerce normal eso sería una alarma; aquí es la realidad del mercado brasileño en ese período, y cambia la pregunta de "¿qué tan bien retenemos?" a "¿qué tiene de diferente ese 3%?".

Un detalle técnico que importa: el dataset tiene dos identificadores de cliente, y usar el equivocado hace que cada orden parezca un cliente nuevo, inflando artificialmente la retención. Eso cambia los resultados completos, así que el primer paso es asegurarse de contar personas, no transacciones.

El análisis construye cuatro vistas sobre ese 3%: un mapa de calor que muestra cuántos clientes de cada mes de compra regresaron en los meses siguientes; una curva de supervivencia que traza a qué velocidad se van perdiendo los compradores con el tiempo (el mismo estimador Kaplan-Meier que en seguros sigue la mortalidad de los asegurados); una segmentación RFM (Recencia, Frecuencia, Monto) que agrupa a los clientes por qué tan recientemente compraron, con qué frecuencia y cuánto gastaron; y una estimación del valor total que cada segmento generará durante su vida como cliente.

Entregado como un tablero de seis páginas sin backend: los 36 MB de parquet que lo respaldan se preagregan en 276 KB de JSON estático, porque los tres filtros de la app resultan ser subconjuntos de una matriz ya agregada y no recálculos. Cómo perdió su backend este proyecto es una historia aparte, contada en la sección de arquitectura. El pipeline técnico sigue visible: los cuatro notebooks se publican dentro del tablero.

**Estado:** Completo | <a href="https://data-analyst.gonor.me/cohorts" target="_blank" rel="noopener">App en vivo</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/02-ecommerce-cohort-analysis" target="_blank" rel="noopener">GitHub</a>

### 03 - Pruebas A/B: frecuentista, bayesiano y paradoja de Simpson

**Pregunta de negocio:** Si ejecutamos un test A/B de conversión, ¿qué enfoque estadístico nos da la respuesta más confiable y por qué los resultados agregados pueden mentir?

Imagina que el equipo de producto quiere saber si cambiar el botón de checkout de azul a verde aumenta las conversiones. Corren el experimento dos semanas y el resultado global dice que la versión verde gana por 2 puntos porcentuales. ¿La lanzamos? Depende de tres preguntas: ¿es esa diferencia real o es ruido estadístico? ¿Cuánta confianza necesitas antes de tomar la decisión? Y si separas el resultado por usuarios móviles contra escritorio, ¿el verde sigue ganando en ambos grupos?

El proyecto evalúa esa misma situación con tres enfoques estadísticos: el test frecuentista clásico (¿el p-value está por debajo de 0.05?), inferencia bayesiana con PyMC (¿cuál es la probabilidad de que B sea mejor que A, y por cuánto?) y monitoreo secuencial (¿podemos parar antes si ya es obvio?). El análisis central es la paradoja de Simpson: cómo un resultado que parece claro a nivel global puede invertirse por completo al segmentar por subgrupo, un riesgo real en cualquier experimento de producto.

Dashboard interactivo con Next.js que permite explorar cada enfoque estadístico, calcular potencia de prueba y visualizar la convergencia bayesiana.

**Estado:** Completo | <a href="https://data-analyst.gonor.me/abtest" target="_blank" rel="noopener">App en vivo</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/03-ab-test-analysis" target="_blank" rel="noopener">GitHub</a>

### 04 - Reporte KPI Ejecutivo: métricas SaaS automatizadas

**Pregunta de negocio:** ¿Cómo automatizar la generación de reportes ejecutivos mensuales con detección de anomalías y forecast de métricas clave?

Los CEOs y directores no viven en dashboards. Reciben un PDF o una presentación una vez al mes. El proceso manual detrás tarda un día completo en armarse, los números siempre llegan con algo de retraso, y las anomalías solo se detectan si alguien está mirando la gráfica correcta en el momento correcto. Un mes con churn inusualmente alto puede pasar de largo.

Este pipeline reemplaza ese proceso. Un solo comando genera el reporte completo: calcula las métricas centrales de un SaaS (MRR, churn, costo de adquisición, valor de vida del cliente), detecta cualquier métrica que se desvíe de su tendencia histórica, proyecta el trimestre siguiente y produce un PDF bilingüe listo para enviar. Ese valor de vida del cliente es la misma cantidad que el proyecto 02 estimó desde cohortes de compra; aquí sale de los datos de ingresos. El analista pasa su tiempo interpretando los hallazgos, no copiando números entre hojas de cálculo.

9 notebooks que cubren generación de datos, análisis exploratorio, detección de anomalías, forecasting, automatización de reportes, arquitectura backend, cálculos KPI, algoritmos de analítica y pipeline PDF. Dashboard Next.js complementario.

**Estado:** Completo | <a href="https://data-analyst.gonor.me/kpi" target="_blank" rel="noopener">App en vivo</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/04-executive-kpi-report" target="_blank" rel="noopener">GitHub</a>

### 05 - Portafolio Financiero: Monte Carlo y frontera eficiente

**Pregunta de negocio:** Dado un portafolio diversificado de ETFs, ¿realmente vale la pena esa diversificación comparada con simplemente comprar el S&P 500?

El dashboard analiza un portafolio real de 6 ETFs que cubren distintas clases de activos, con datos en vivo de Yahoo Finance y el S&P 500 como benchmark. La pregunta central es simple pero incómoda: si tu portafolio diversificado tuvo peor rendimiento ajustado por riesgo que un solo ETF del índice, la diversificación te costó dinero en lugar de protegerte.

Para responder eso con rigor, el análisis calcula la frontera eficiente de Markowitz (el conjunto de portafolios que maximizan rendimiento para cada nivel de riesgo), corre simulaciones Monte Carlo para ver el rango de escenarios futuros posibles, y mide el riesgo de distintas formas: el VaR (pérdida máxima esperada en condiciones normales), el CVaR (pérdida esperada en los peores escenarios, la cola de la distribución) y los ratios Sharpe y Sortino (rendimiento por unidad de riesgo). El resultado es una respuesta cuantitativa a si tu mezcla de activos tiene sentido matemático.

5 notebooks cubriendo adquisición de datos, construcción de portafolio, análisis de rendimiento, analítica de riesgo y optimización de frontera Monte Carlo.

**Estado:** Completo | <a href="https://data-analyst.gonor.me/portfolio" target="_blank" rel="noopener">App en vivo</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/05-financial-portfolio-tracker" target="_blank" rel="noopener">GitHub</a>

### 06 - Eficiencia Operacional: NYC 311, minería de procesos y SLA

**Pregunta de negocio:** ¿Qué patrones de ineficiencia existen en las solicitudes de servicio de NYC 311 y dónde se violan los SLAs sistemáticamente?

NYC 311 es el sistema de quejas de servicio público de Nueva York: los residentes reportan baches, ruido, plagas de ratas, violaciones de construcción, calefacción rota, basura acumulada. Más de 30 millones de registros desde 2010, repartidos entre más de 40 tipos de queja y más de 20 agencias distintas. El volumen no es lo interesante para el análisis operacional; lo que importa es lo que los datos capturan de forma implícita.

Los datos registran cuándo se abrió cada queja y cuándo se cerró, pero no los pasos intermedios. La minería de procesos reconstruye esos flujos ocultos: si una queja de edificio en mal estado tarda 14 días en promedio pero las más rápidas se cierran en 2, el algoritmo busca qué tienen en común las que se resuelven rápido. Eso revela los cuellos de botella reales, no los reportados.

El análisis muestra lo que los promedios simples esconden. Algunas agencias tienen compromisos de tiempo de respuesta (SLA, service level agreement) estructuralmente imposibles de cumplir con su volumen de quejas: no porque sean lentas, sino porque el compromiso se fijó sin considerar la demanda real. Los tiempos de respuesta en ciertos barrios son sistemáticamente más lentos para quejas idénticas a las de otras zonas. Ciertos tipos de queja tienen picos estacionales predecibles que se acumulan en rezagos si las agencias no ajustan capacidad. El dashboard hace navegables esos patrones por agencia, tipo de queja, barrio y período.

Dashboard Next.js con visualizaciones de flujos de proceso, heatmaps de SLA y rankings de agencias.

**Estado:** Completo | <a href="https://data-analyst.gonor.me/operations" target="_blank" rel="noopener">App en vivo</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/06-operational-efficiency" target="_blank" rel="noopener">GitHub</a>

## Decisiones de arquitectura

Ninguna herramienta de este portafolio se eligió una sola vez y para siempre. La elección sigue la forma de los datos y de la audiencia, y se revisa cuando los datos demuestran que la primera elección estuvo mal. Tres preguntas la deciden: quién es la audiencia, qué tan interactivo necesita ser el output y con qué frecuencia se actualiza.

**Next.js** entrega hoy los 7 proyectos (del 00 al 06). Lo que compra: control total sobre la estética, modo oscuro, responsive en móvil y componentes reutilizados entre dashboards (KPICard, ChartContainer y ThemeToggle se comparten entre todos). El costo es real: React, TypeScript y un pipeline de build. Se justifica cuando los dashboards tienen vida larga y los componentes de verdad se reutilizan, y después de siete proyectos, se reutilizan.

**Streamlit** ya no está, y cómo salió enseña más que cómo entró. El proyecto 02 empezó como una app de Streamlit desplegada en Cloud Run, una elección razonable: el análisis vivía en Python y Streamlit es el camino más corto de notebook a app interactiva. Luego el propio análisis desarmó su infraestructura. Los tres filtros de la app resultaron ser subconjuntos de una matriz ya agregada, no recálculos sobre las órdenes crudas; nada de lo que el usuario podía tocar necesitaba Python al momento de la petición. La app se reconstruyó como export estático sin backend. La interactividad sobrevivió intacta, y desapareció un servicio con estado, junto con sus cold starts y su costo. El código de Streamlit se archivó fuera del repo y se retiró; los notebooks y datos de investigación se conservaron.

La línea entre **JSON estático** y un **backend con FastAPI** parecía al principio una pregunta sobre filtros: si el usuario puede filtrar, necesitas un servidor. El proyecto 02 desmintió esa regla. La pregunta real es si un filtro cambia el cómputo o solo selecciona un subconjunto de un agregado precalculado. Las vistas de cohortes solo rebanan una matriz agregada, así que viajan como JSON estático. Los triángulos de pérdida del proyecto 01 sí recalculan sobre los datos subyacentes, así que ese dashboard conserva su backend FastAPI; y los datos de mercado en vivo del proyecto 05 no se pueden precalcular, así que ese también.

**Un dominio, un servicio.** Los siete dashboards empezaron como siete despliegues separados, cada uno en la URL de su proveedor. Hoy son un solo proyecto de Cloudflare Pages sirviendo data-analyst.gonor.me, con rutas para cada análisis (/insurance, /olist, /cohorts, /abtest, /kpi, /portfolio, /operations y /airbnb); la raíz reúne el portafolio. Los backends pasaron por la misma consolidación: un solo servicio FastAPI en Cloud Run, con la API de cada proyecto montada bajo su propio prefijo de ruta. Las razones son simples. Siete URLs dividían a la audiencia que pueda tener un portafolio, y ninguna decía de quién era el trabajo. Un dominio es una sola cosa que mantener, un solo lugar adonde mandar a un reclutador y un solo juego de analytics.

## Lo que se transfiere entre dominios

Después de construir 7 proyectos en dominios diferentes, los patrones recurrentes son más instructivos que cualquier hallazgo individual. También son la evidencia de la afirmación con la que abre este texto.

**El ETL consume la mayor parte del tiempo real.** En todos los proyectos, la limpieza y transformación de datos tomó más tiempo que el análisis. Los precios de Airbnb llegan como strings con símbolo de moneda y comas. Los timestamps de Olist necesitan parsing cuidadoso para construir cohortes correctas. Los datos del NAIC Schedule P requieren validación cruzada entre tablas antes de construir triángulos confiables. Los datos de NYC 311 tienen inconsistencias entre agencias en cómo registran los tipos de solicitud. La metodología es transferible: validación de tipos, manejo explícito de nulos, logging de registros descartados.

**El movimiento de segmentación del proyecto 00 nunca dejó de aparecer.** Los hosts de Airbnb se parten en enterprise vs casual (por número de listings), los clientes de Olist en clusters RFM (por recencia, frecuencia y monto), las líneas de seguros por perfil de cola, las agencias de NYC por cumplimiento de SLA. El patrón es idéntico cada vez: definir umbrales sobre una distribución, asignar etiquetas, medir diferencias entre grupos, decidir con base en la heterogeneidad.

**El 3% de recompra de Olist cambia cómo se enmarca un análisis de cohortes.** Cuando la gran mayoría de clientes son one-time buyers, la pregunta no es "qué tan bien retenemos" sino "qué diferencia a los que regresan." Ese reencuadre aplica en seguros (qué diferencia a las pólizas que renuevan), en SaaS (qué diferencia a los usuarios que no hacen churn) y en cualquier negocio con alta tasa de abandono.

**El rigor estadístico de la formación actuarial se aplica directamente a producto.** Kaplan-Meier es una curva que muestra qué fracción de clientes seguía activa en cada punto del tiempo, sin necesitar que todos hayan abandonado para estimar la tendencia: en seguros modela cuántos asegurados permanecen vivos; en producto, cuántos usuarios siguen comprando. Las distribuciones de severidad no describen solo el monto promedio de una transacción sino toda la forma de la distribución: cuántos clientes gastan \$50, cuántos \$500, cuántos \$5,000, que es exactamente lo que se necesita para estimar el valor de vida de un cliente sin que los casos extremos distorsionen el promedio. Bornhuetter-Ferguson combina lo que tus datos actuales dicen con lo que la experiencia histórica del sector sugiere, útil cuando tienes pocos registros propios para confiar solo en ellos. El punto no es los nombres. Es que la analítica de seguros y la analítica de producto resuelven el mismo problema: estimar lo que aún no ha ocurrido a partir de lo que sí observaste.

## Conexiones con el portafolio actuarial

Este portafolio de DA no existe en aislamiento. Los proyectos actuariales en el portafolio principal complementan directamente el trabajo aquí:

- **SIMA** (Sistema Integral de Modelación Actuarial) comparte con el proyecto 01 la lógica de cálculo de reservas, aunque para productos de vida en lugar de daños. Los mismos factores de descuento y patrones de desarrollo que aparecen en los triángulos del NAIC viven como funciones modulares en el motor de SIMA.
- **GMM Explorer** conecta con la segmentación de este portafolio: definir grupos a partir de distribuciones de siniestros de Gastos Médicos Mayores es el mismo patrón de clasificación por percentiles que aparece en RFM, segmentación de hosts y análisis de SLA.
- Las **notas técnicas de seguros** (vida y daños) son el referente regulatorio: los marcos de la CNSF que gobiernan cómo se calculan reservas en el mercado mexicano. La metodología del proyecto 01 es análoga, adaptada al contexto americano (NAIC).

## Material de referencia

- <a href="https://github.com/GonorAndres/data-analyst-path" target="_blank" rel="noopener">Repositorio principal en GitHub</a>: Código completo de los 7 proyectos, notebooks numerados, queries SQL, pipelines ETL y configuración de despliegue. El <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/apps/web" target="_blank" rel="noopener">frontend compartido</a> vive en `apps/web`.
- <a href="https://data-analyst.gonor.me/airbnb/" target="_blank" rel="noopener">Airbnb CDMX (App en vivo)</a>: Dashboard Next.js con análisis de mercado de rentas cortas.
- <a href="https://data-analyst.gonor.me/insurance" target="_blank" rel="noopener">Reservas Actuariales P&C (App en vivo)</a>: Dashboard Next.js + FastAPI con triángulos de pérdida y IBNR.
- <a href="https://data-analyst.gonor.me/cohorts" target="_blank" rel="noopener">Cohortes E-Commerce (App en vivo)</a>: export estático sin backend, con los cuatro notebooks publicados al lado.
- <a href="https://data-analyst.gonor.me/abtest" target="_blank" rel="noopener">Pruebas A/B (App en vivo)</a>: Dashboard Next.js con enfoques frecuentista, bayesiano y paradoja de Simpson.
- <a href="https://data-analyst.gonor.me/kpi" target="_blank" rel="noopener">Reporte KPI Ejecutivo (App en vivo)</a>: Dashboard Next.js con métricas SaaS automatizadas.
- <a href="https://data-analyst.gonor.me/portfolio" target="_blank" rel="noopener">Portafolio Financiero (App en vivo)</a>: Dashboard Next.js + FastAPI con datos en vivo de yfinance.
- <a href="https://data-analyst.gonor.me/operations" target="_blank" rel="noopener">Eficiencia Operacional (App en vivo)</a>: Dashboard Next.js con minería de procesos y análisis de SLA.
