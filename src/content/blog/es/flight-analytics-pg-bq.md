---
title: "Qué 5.74 Millones de Vuelos me Enseñaron sobre PostgreSQL, BigQuery y Cuándo Usar Cada Uno"
description: "Las aerolíneas generan millones de registros de vuelos, retrasos e ingresos, pero analizar esos datos exige elegir la base de datos correcta para cada pregunta. Este proyecto toma 5.74M registros reales, los analiza primero en PostgreSQL optimizando desde el motor, los migra a BigQuery para comparar ambos paradigmas, y presenta los trade-offs con timing, costos y planes de consulta reales."
date: "2026-03-18"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "PostgreSQL · BigQuery · Python · Plotly · Folium · Cloudflare Pages"
  datos: "PostgresPro Airlines demo DB (5.74M filas, 104 aeropuertos)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/learning-posgre"
  live: "https://analytics-flights.gonor.me"
tags: ["PostgreSQL", "BigQuery", "Python", "ETL", "EXPLAIN ANALYZE", "Docker", "GIS", "Plotly", "Folium", "data-engineering"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/flight-analytics-pg-bq.webp"
heroAlt: "Un acceso guiado por índice selecciona un registro, mientras una lectura por columnas reúne datos para una agregación."
heroCaption: "Buscar un registro y agregar muchos registros requieren patrones de lectura distintos."
---

Un índice compuesto en dos columnas redujo el tiempo de una consulta de 33.9ms a 2.6ms. Eso es una mejora de 13x con un solo `CREATE INDEX`. Una vista materializada sobre el mismo dataset la llevó de 174ms a 0.13ms: 1,300x. Y el ejemplo más extremo del proyecto fue una consulta con particionamiento por mes que pasó de escanear toda la tabla a leer solo la partición relevante, con un speedup medido de 3,024x en los datos de EXPLAIN ANALYZE.

Esos no son números de benchmark artificial. Son el resultado de trabajar con 5.74 millones de filas reales de operaciones aéreas rusas y observar cómo el motor de PostgreSQL responde a cada decisión de diseño.

## El dataset y las preguntas que hacía

La <a href="https://postgrespro.com/community/demodb" target="_blank" rel="noopener">base de datos demo de PostgresPro Airlines</a> contiene datos reales: horarios de vuelos en 104 aeropuertos rusos, reservaciones, boletos, tarjetas de abordar, mapas de asientos y especificaciones de aeronaves. Ocho tablas, 5.74 millones de filas, columnas JSONB para nombres bilingües, un tipo `point` para coordenadas de aeropuertos y timestamps con zona horaria. Es el tipo de esquema que expone diferencias entre bases de datos mejor que cualquier dataset de juguete.

Las preguntas no eran técnicas de entrada. Eran de negocio: ¿qué rutas pierden más tiempo en retrasos? ¿Cómo se concentra el ingreso en la red? ¿Qué aeronaves están subutilizadas?

## Lo que revelan los datos

La ruta Voronezh-Pulkovo lidera en retrasos con 11.1%: 10 de 90 vuelos retrasados más de 15 minutos. La tasa general es 4.9%, con 2,394 vuelos afectados. El patrón por hora y día de la semana es visible en el heatmap del dashboard: los vuelos de madrugada muestran retrasos desproporcionados, probablemente por propagación de demoras acumuladas.

La concentración de ingresos es más marcada. La clase Económica captura el 70.8% del ingreso con el 88% de los boletos. Ejecutiva obtiene el 26.5% desde apenas el 10%. Pero el hallazgo más útil está en la curva de Pareto: 128 rutas generan el 80% de los 37.7 mil millones de rublos en ingresos totales. El 64% de rutas restante aporta el 20% final. Ese nivel de concentración tiene implicaciones directas para decisiones de red.

La flota muestra una brecha difícil de ignorar. Los Boeing 777-300 operan con un factor de ocupación promedio de 72.8%; los Cessna 208 Caravans llegan a 16%. No es un problema de aviones pequeños. Es una señal de que esas rutas regionales tienen una demanda real o datos de tarjetas de abordar incompletos. Las dos explicaciones tienen consecuencias distintas para quien diseña la red.

La distancia de ruta no correlaciona linealmente con los retrasos. Las rutas cortas menores de 500 km y las muy largas de más de 4,000 km muestran porcentajes similares. El peor desempeño se concentra entre 500 y 2,000 km, el rango donde la presión de rotación es más alta y los equipos no tienen tiempo de recuperarse completamente.

## Lo que enseña PostgreSQL

Saber sintaxis SQL está bien. Entender por qué una consulta tarda 1,283 milisegundos en lugar de 2.6 milisegundos es otra cosa.

El trabajo con EXPLAIN ANALYZE fue el más revelador. Un filtro simple en `flights WHERE departure_airport = 'SVO' AND status = 'Arrived'` escaneaba las 65,664 filas de la tabla con Sequential Scan. Un índice compuesto en `(departure_airport, status)` cambió eso a Bitmap Index Scan: de 33.9ms a 2.6ms. El índice no cambió la consulta; cambió el plan de ejecución.

Las vistas materializadas llevaron el resultado más extremo. Un resumen de retrasos por ruta tardaba 174ms desde tablas crudas. Desde la vista materializada: 0.13ms. El trade-off es real: hay que ejecutar `REFRESH MATERIALIZED VIEW CONCURRENTLY` para actualizar los datos sin bloquear lecturas. Para analytics donde la frescura importa menos que la velocidad, el trade-off tiene sentido.

El particionamiento por rango mensual demostró lo que EXPLAIN muestra explícitamente: "Partitions selected: 1 of 5." Una consulta para vuelos de julio de 2017 escanea solo esa partición. Con 5.74 millones de filas distribuidas en cinco meses, el speedup compuesto de 3,024x refleja cuánto trabajo se elimina simplemente al diseñar el esquema pensando en las consultas que lo van a leer.

WAL y checkpoints revelaron trade-offs que no son evidentes desde la documentación. Una operación bulk con 100,000 inserciones produce volumen de WAL medible. Configurar `synchronous_commit = off` acelera escrituras pero se pierden los últimos 600ms de commits en un crash. Para analytics, ese riesgo puede ser aceptable. Para transacciones financieras, no lo es.

## La migración y dónde gana cada sistema

El pipeline de migración son cuatro archivos Python. `extract.py` lee de PostgreSQL con cursores en batch a 56,000 filas por segundo. `transform.py` aplana columnas JSONB, convierte el tipo `point` a floats separados de latitud y longitud, elimina espacios de campos `character(3)` y normaliza todos los timestamps a UTC. `load.py` empuja los DataFrames a BigQuery con Application Default Credentials. El pipeline completo mueve 5.74 millones de filas en 102 segundos.

Cada transformación expuso una diferencia concreta entre los dos sistemas. JSONB no existe en BigQuery; la columna `airport_name` con sus valores `{"en": "...", "ru": "..."}` se convirtió en dos columnas planas. El tipo `point` tampoco tiene equivalente directo. Las zonas horarias se almacenan de forma diferente. Estas no son detalles de documentación: aparecen en producción cuando el pipeline falla silenciosamente.

La comparación de timing con las mismas consultas en ambos sistemas:

| Consulta | PostgreSQL (indexado) | BigQuery |
|:------|:--------------------|:---------|
| Análisis de retrasos de ruta (49K filas, 2 JOINs) | 111ms | ~1.5s |
| Ingresos por clase tarifa (2.3M filas) | 1,635ms | ~1.2s |
| Point lookup (1 vuelo por ID) | 2.6ms | ~800ms |
| Consulta de vista materializada | 0.13ms | N/A |

PostgreSQL gana en point lookups por un margen que no es discutible. Con índice apropiado, un registro individual tarda 2.6ms. El tiempo mínimo en BigQuery es ~500ms por overhead de job scheduling. Para un backend de API que sirve registros de vuelos individuales, PostgreSQL es 300x más rápido.

BigQuery gana en analytics de tabla completa. La consulta de ingresos sobre 2.3 millones de filas corrió más rápido en BigQuery (1.2s vs 1.6s) sin ningún trabajo de indexación. El almacenamiento columnar y la ejecución paralela manejan agregaciones grandes sin configuración.

El costo cuenta la historia completa. Para este dataset de 500 MB con consultas analíticas, BigQuery cuesta ~\$0.25 al mes con pago por consulta a \$5/TB. La instancia más pequeña de Cloud SQL cuesta ~\$7 al mes. BigQuery cobra por lo que escaneas; Cloud SQL cobra por lo que provisiones. A escala, la brecha se amplía más.

La conclusión no es cuál sistema es mejor. Es que cada uno resuelve un problema distinto, y el pipeline entre ellos es la parte que más se subestima.

## El mapa y el dashboard como capa de comunicación

Las coordenadas de aeropuertos habilitaron una capa geoespacial. En PostgreSQL, la distancia de gran círculo requiere una función haversine en PL/pgSQL. En BigQuery, el mismo cálculo usa `ST_GEOGPOINT()` y `ST_DISTANCE()` sin código personalizado. El mapa de rutas en el dashboard refleja ese trabajo: 104 aeropuertos conectados por 532 rutas coloreadas por tasa de retraso, filtrables por hub.

El <a href="https://analytics-flights.gonor.me" target="_blank" rel="noopener">dashboard</a> está desplegado en Cloudflare Pages, es bilingüe y corre completamente sobre JSON pre-extraído sin conexión a base de datos. Eso no es un compromiso de arquitectura; es una decisión deliberada para eliminar costo de hosting y latencia de red en una capa que solo necesita presentar resultados.

La sección de internals traduce los resultados de EXPLAIN ANALYZE a barras comparativas: las mejoras de 13x, 1,300x y 3,024x quedan lado a lado sin que el visitante tenga que leer output de query planner. La sección de pipeline muestra las métricas de ETL junto a la tabla comparativa de timing. Revenue expone la curva de Pareto interactiva. Fleet pone el Boeing 777 al 72.8% de ocupación junto al Cessna 208 al 16% como pregunta abierta.

## Limitaciones y siguiente paso

Los datos son operativos, no financieros. El análisis de ingresos usa tarifas del dataset que pueden no reflejar descuentos reales, fees aeroportuarios o revenue sharing entre aerolíneas. Los 37.7 mil millones de rublos son el número que producen los datos disponibles, no necesariamente el ingreso real de la aerolínea.

El análisis de retrasos carece de datos meteorológicos y de tráfico aéreo, que son los factores externos que más explican los retrasos sistémicos. Las rutas de 500-2,000 km tienen peor desempeño, pero sin datos de causa raíz es difícil separar el efecto de la presión de rotación del efecto de rutas que comparten infraestructura congestionada.

Con más tiempo, el paso natural sería agregar series de tiempo: ver si la tasa de retrasos cambió a lo largo del período de los datos, si la concentración de ingresos en 128 rutas es estable o si se está consolidando. Ese análisis necesita las mismas herramientas que ya están construidas; solo requiere formular mejores preguntas.

El código fuente está en <a href="https://github.com/GonorAndres/learning-posgre" target="_blank" rel="noopener">github.com/GonorAndres/learning-posgre</a> y el dashboard en <a href="https://analytics-flights.gonor.me" target="_blank" rel="noopener">analytics-flights.gonor.me</a>. El pipeline se reproduce con `docker compose up` y un proyecto de GCP.

Este proyecto comparte la lógica de decisión bajo incertidumbre con el <a href="/blog/data-engineering-platform/">proyecto de ingeniería de datos actuarial</a>: en ambos casos, la pregunta central no es qué tecnología usar, sino cuándo el costo de la herramienta más sofisticada se justifica por el problema que resuelve.
