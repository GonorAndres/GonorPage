---
title: "Plataforma de Datos para Siniestros de Seguros sobre GCP"
description: "Las áreas técnicas de las aseguradoras generan datos valiosos que quedan atrapados en hojas de cálculo y procesos manuales que no escalan. Esta plataforma construye el pipeline completo sobre GCP, desde la ingesta de siniestros en streaming hasta el pricing con GLM Tweedie, con Dataform y BigQuery como columna vertebral. El resultado es un flujo automatizado, testeado y reproducible que transforma datos crudos en insumos listos para el regulador."
date: "2026-03-18"
category: "proyectos-y-analisis"
lang: "es"
shape: "narrative"
tags: ["BigQuery", "Terraform", "Pub/Sub", "Apache Beam", "Dagster", "Cloud Run", "DuckDB", "GLM Tweedie", "GCP", "actuarial"]
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Python · BigQuery · Dataform · Dagster · Terraform · Pub/Sub · Apache Beam · Cloud Run · DuckDB · FastAPI"
  datos: "608 siniestros sintéticos · 5 líneas de negocio · 32 estados"
  regulacion: "LISF · CNSF"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/data-engineer-path"
  live: "https://data-engineer.gonor.me"
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/data-engineering-platform.webp"
heroAlt: "Registros de siniestros pasan por validación y tablas estructuradas; una excepción se desvía a revisión antes del análisis."
heroCaption: "Validar y transformar los datos antes del análisis permite seguir el origen de cada resultado y revisar las excepciones."
---

Una aseguradora mediana en México recibe entre 5,000 y 50,000 siniestros al año. Cada uno llega con campos inconsistentes, códigos de estado cambiantes, montos en diferentes etapas de liquidación. El flujo típico: siniestros exporta un CSV, lo envía al área técnica, un analista lo abre en Excel, lo transforma a mano, lo pega en triángulos, genera factores. A 500 siniestros funciona. A 5,000 se vuelve frágil. A 50,000 se rompe. El problema no es solo volumen: es confiabilidad. Un proceso manual no tiene auditoría, no tiene tests de integridad, no tiene reproducibilidad. Si preguntan un mes después, repites todo.

<a href="/blog/sima/">SIMA</a> demostró que un actuario puede construir el motor de cálculo completo: mortalidad graduada, requerimientos de capital bajo LISF. Pero SIMA asume datos limpios y disponibles. La pregunta siguiente es más fundamental: ¿puede un actuario construir la infraestructura que mueve esos datos desde su origen hasta el modelo, automáticamente, testeada y reproducible?

La respuesta es seis proyectos interconectados que forman una plataforma de datos completa sobre Google Cloud.

## La plataforma: 6 proyectos, una arquitectura

Los seis proyectos no son ejercicios independientes. Son capas: warehouse para almacenar, orquestador para ejecutar, streaming para ingestar, Terraform para provisionar, pricing para consumir. Cada uno se construyó sobre el anterior.

### P01: Claims Data Warehouse

La idea central es organizar los datos para que un actuario pueda hacer preguntas directamente: "muéstrame los siniestros incurridos por cobertura y trimestre de ocurrencia". Un esquema estrella hace exactamente eso: cuatro dimensiones (pólizas, coberturas, fechas, geografía) rodean dos tablas de hechos (transacciones y snapshots mensuales). En lugar de buscar entre hojas de Excel, escribes una consulta y obtienes la respuesta.

Los datos crudos pasan por cuatro capas de transformación orquestadas con Dataform: primero se limpian y estandarizan (staging), luego se cruzan y enriquecen con catálogos (intermediate), después se calculan métricas como triángulos de pérdida y frecuencia (marts), y finalmente se preparan vistas listas para el dashboard (reports). Cada capa alimenta la siguiente, y cualquier error se detecta antes de llegar al modelo. Todo con nombres en español mexicano, códigos INEGI, montos en MXN; un warehouse que refleja el dominio real demuestra comprensión del negocio, no solo capacidad de mover columnas.

Para desarrollo local se usa DuckDB: corre directamente en la máquina, sin servidores ni costos. El mismo SQL funciona en BigQuery sin cambios, así que lo que pasa en local pasa en producción. El dashboard está desplegado en Cloud Run: <a href="https://data-engineer.gonor.me" target="_blank" rel="noopener">claims-dashboard</a>. Muestra el resumen de la cartera (608 siniestros, \$26.9M pagados totales, \$44K severidad promedio), triángulos de pérdidas acumuladas con factores de desarrollo, y la documentación completa del pipeline. Cincuenta y dos tests de pytest verifican que el esquema sea correcto, que las referencias entre tablas sean consistentes y que las reglas de negocio se cumplan (montos positivos, fechas coherentes, sumas que cuadran entre capas).

Costo: menos de \$1 USD al mes. BigQuery free tier cubre 10 GB de almacenamiento y 1 TB de consultas. GCS para los archivos fuente cuesta centavos.

### P02: Pipeline ELT orquestado

Con el warehouse construido, la siguiente pregunta es quién lo alimenta y cuándo. En la industria, el estándar es Apache Airflow; en GCP, Cloud Composer. Composer cuesta \$400+ USD al mes porque mantiene un cluster de Kubernetes corriendo permanentemente, incluso sin DAGs ejecutándose. Para un pipeline de cinco pasos lineales que corre una vez al día, ese costo no tiene justificación.

La alternativa es Cloud Run + Cloud Scheduler: un contenedor que se despierta cuando toca, ejecuta el pipeline, y se apaga. Costo: \$0.10 USD al mes. La lógica es idéntica, el resultado es idéntico, 4,000 veces más barato. Este patrón aplica a cualquier pipeline pequeño o mediano que corra en horarios predecibles.

Para desarrollo local se usa Dagster, que ofrece algo que Cloud Run no tiene: una interfaz visual donde ves el flujo de datos, rastrear qué se ejecutó y cuándo, y depurar fallos sin leer logs en terminal. Un DAG de referencia en Airflow también está en el repositorio, porque si un empleador usa Airflow puede ver que se entiende su herramienta. La decisión de no desplegarlo es económica, no técnica.

La lección de despliegue ilustra bien qué pasa cuando las suposiciones locales chocan con la realidad de la nube. Cloud Run espera un servidor HTTP escuchando permanentemente. El Dockerfile original ejecutaba el pipeline como script que terminaba al acabar; Cloud Run interpretaba esa terminación como un fallo y reiniciaba en loop. La solución fue agregar un endpoint HTTP que dispara la ejecución bajo demanda. Error simple, pero exactamente el tipo de problema que solo aparece en producción.

### P03: Ingesta de siniestros en streaming

En la realidad, los siniestros no esperan a que alguien corra un proceso al final del día. Un ajustador registra un caso a las 3pm, otro a las 3:15, otro a las 4. La pregunta es si el sistema puede reaccionar a cada uno conforme llega, en lugar de esperar a que se acumulen.

Pub/Sub funciona como un buzón que nunca pierde un mensaje. Cada siniestro se convierte en un mensaje con su cobertura, deducible, estado y monto. Un servicio en Cloud Run recibe cada mensaje, verifica que los campos estén completos y sean válidos, lo enriquece con información de catálogos (tipo de cobertura, entidad federativa), y lo escribe al warehouse. Si un mensaje llega mal formado, se separa automáticamente para revisión en lugar de contaminar los datos.

Apache Beam agrupa esos eventos por ventanas de tiempo: ¿cuántos siniestros llegaron en esta hora? ¿Cuál es el monto acumulado por cobertura en este turno? El detalle importante: el código está escrito con la misma lógica que usaría un sistema en tiempo real, pero corre en batch para controlar costos. Dataflow en modo streaming cuesta \$1,000+ al mes de forma continua. En batch, cuesta centavos por ejecución. El código es idéntico; pasar a tiempo real es cambiar un parámetro de configuración, no reescribir nada.

Costo: entre \$1 y \$5 USD al mes.

### P04: Infraestructura como código con Terraform

¿Qué pasa si toda la plataforma desaparece? ¿Se puede reconstruir? Terraform responde esa pregunta: en lugar de entrar a la consola de GCP y crear recursos uno por uno, escribes qué necesitas (bases de datos, almacenamiento, servicios, permisos) y Terraform lo crea. Un solo comando (`terraform apply`) reconstruye todo desde cero.

Esto importa por tres razones concretas. Reproducibilidad: cualquier persona con acceso al repositorio puede levantar la plataforma completa. Auditabilidad: cada cambio en la infraestructura queda registrado en Git. Colaboración: los cambios se revisan en pull requests antes de aplicarse, con `terraform plan` mostrando exactamente qué va a cambiar.

La plataforma tiene 24 recursos organizados en 6 módulos. Para el despliegue automático, GitHub Actions se conecta a GCP usando Workload Identity Federation, que genera tokens temporales de corta duración sin guardar contraseñas ni llaves de servicio. En la práctica, nadie tiene credenciales estáticas que puedan filtrarse.

La trampa de inicialización: Terraform guarda el estado en un bucket de GCS, pero ese bucket es parte de la infraestructura que Terraform debería crear. No puedes inicializarlo sin el bucket, ni crear el bucket sin Terraform. La solución es crear el bucket primero con estado local en disco, y luego migrar. Una paradoja que solo descubres cuando despliegas de verdad.

Costo: \$0. Terraform es open source. El bucket de estado cuesta fracciones de centavo.

### P05: Streaming verdadero (solo local)

P03 responde "¿qué pasó hoy?" después de que los hechos ocurrieron. P05 responde "¿qué está pasando ahora mismo?" mientras ocurre. La diferencia importa en producción: detectar fraude necesita segundos, no horas.

¿Qué ganas con streaming verdadero que no tienes con batch? Tres cosas. Primera: los datos que llegan tarde se manejan correctamente; un siniestro registrado con retraso de 40 minutos se incorpora a la ventana temporal correcta. Segunda: los resultados se actualizan conforme llega nueva información, en lugar de un número final al cierre del día. Tercera: deduplicación garantizada, cada evento se procesa exactamente una vez por ventana.

P03 usa modo descarte (cada resultado es independiente). P05 usa modo acumulativo, acepta datos hasta 1 hora después del cierre de ventana, y garantiza procesamiento exactamente una vez mediante deduplicación por estado.

Este proyecto no está desplegado porque Dataflow en modo streaming cuesta entre \$50 y \$100 USD al día; requiere workers corriendo permanentemente. El código está listo para Dataflow, solo cambia el destino de ejecución. Un demo de 2 horas costaría menos de \$10 USD si fuera necesario demostrar que funciona en producción.

### P06: Pipeline de pricing con ML

Todo lo anterior converge aquí: datos del warehouse procesados por el pipeline orquestado alimentan un modelo de pricing. La ingeniería de features es SQL puro en tres capas de transformación, diseñado para BigQuery ML sin modificación.

El modelo es un GLM Tweedie con $p = 1.5$. La Tweedie es el estándar actuarial para prima pura porque resuelve un problema específico del dato asegurador: la mayoría de asegurados no reporta siniestros en un período dado (masa en cero), pero cuando hay siniestro el costo es continuo y positivo. La Tweedie con $1 < p < 2$ es Poisson compuesta con severidad Gamma: la descomposición frecuencia-severidad que la industria usa desde décadas, estimada en un modelo único. Prima pura: $E[Y] = \exp(X\beta)$, donde $Y$ es el costo total por póliza y $X$ incluye características del vehículo, conductor y geografía.

La evaluación usa métricas actuariales: Gini para discriminación, lift para ordenamiento de riesgos, ratio A/E por segmento para identificar subsidios cruzados. La adecuación de prima por cobertura es el output final: el número que el actuario defiende ante la CNSF.

¿Por qué Tweedie GLM y no XGBoost? Interpretabilidad y cumplimiento regulatorio. La CNSF requiere notas que demuestren suficiencia actuarial. Un GLM produce coeficientes interpretables como multiplicadores sobre prima base. El <a href="/blog/actuarial-ml-pricing/">proyecto de pricing con ML</a> explora XGBoost y LightGBM con SHAP; este demuestra el baseline regulatorio.

## La estrategia de costos

| Proyecto | Costo mensual | Alternativa convencional |
|----------|--------------|--------------------------|
| P01: Claims Warehouse | < \$1 | Enterprise DWH: \$500+ |
| P02: Pipeline orquestado | \$0.10 | Cloud Composer: \$400+ |
| P03: Streaming (batch Beam) | \$1-5 | Dataflow streaming: \$1,000+ |
| P04: Terraform | \$0 | Provisión manual en consola |
| P05: Streaming real | \$0 (local) | Dataflow streaming: \$1,500+ |
| P06: Pricing ML | < \$1 | BigQuery ML: incluido |
| **Total** | **< \$10** | **\$2,000+** |

La filosofía detrás de estos números no es austeridad. Es selección deliberada de herramientas. DuckDB localmente porque el desarrollo iterativo no necesita servidor. Cloud Run con scale-to-zero porque un pipeline de cinco minutos al día no justifica un cluster permanente. Beam en batch porque la API de streaming es idéntica y el patrón se demuestra sin costo operativo. Cada decisión tiene justificación técnica; el ahorro es consecuencia.

## Decisiones y trade-offs

| Decisión | Alternativa | Razón |
|----------|-------------|-------|
| DuckDB local | PostgreSQL | Zero-install, en proceso, suficiente para datos de desarrollo |
| Dagster local + Cloud Run | Airflow / Composer | Dagster para DX (UI gratuita, assets); Cloud Run para producción (4,000x más barato) |
| Beam batch | Beam streaming | Misma API, 1,000x menos costo, el código es idéntico |
| Tweedie GLM | XGBoost | Interpretabilidad + cumplimiento CNSF. El ML está en otro proyecto |
| Terraform | Consola GCP | Reproducibilidad. `terraform apply` reconstruye todo en minutos |
| Workload Identity Federation | Llaves de servicio | Sin secretos estáticos, tokens de corta duración, estándar Google |

Cada trade-off tiene respuesta diferente en otro contexto. Una aseguradora con 200 DAGs interdependientes necesita Composer. Un pipeline de fraude en tiempo real necesita streaming verdadero. Pricing para millones de pólizas justifica XGBoost con SHAP. Las decisiones correctas son las que demuestran comprensión de los trade-offs, no las que siguen el estándar por inercia.

## Conexión con el trabajo actuarial

El trabajo actuarial, en el fondo, consiste en tomar grandes volúmenes de eventos inciertos (siniestros, pagos, reclamaciones) y convertirlos en números confiables: reservas, primas, requerimientos de capital. Una plataforma de datos hace exactamente lo mismo, pero automatizado.

Los siniestros llegan uno por uno (streaming), se agrupan por período (warehouse), se agregan en triángulos de desarrollo (marts), y alimentan modelos de pricing. Ese flujo es el proceso actuarial. La diferencia es que en lugar de depender de que alguien copie columnas correctamente entre archivos, cada paso está automatizado, verificado con tests, y registrado en Git. Cuando la CNSF pregunta cómo llegaste a un número, la respuesta es un commit, un log de ejecución, y 52 pruebas pasando.

Las conexiones con el resto del portafolio son naturales. <a href="/blog/sima/">SIMA</a> calcula mortalidad graduada, funciones de conmutación y requerimientos de capital bajo LISF; todo eso necesita datos limpios como insumo, exactamente lo que esta plataforma produce. El <a href="/blog/actuarial-ml-pricing/">proyecto de pricing con ML</a> usa la misma descomposición frecuencia-severidad que P06, pero explora modelos de mayor complejidad para comparar contra el baseline regulatorio. El <a href="/blog/data-analyst-portfolio/">portafolio de analista de datos</a> es la capa de análisis sobre esta infraestructura: los dashboards y reportes que consumen lo que los marts producen.

## Lo que cambiaría

La limitación más significativa es el dato sintético. Todos los proyectos generan siniestros con distribuciones calibradas (severidad lognormal, frecuencia Poisson, rezago exponencial), pero los datos sintéticos no tienen las correlaciones reales, la estacionalidad, ni el comportamiento en colas que tienen los datos de producción. La siguiente iteración natural es migrar a freMTPL2 (French Motor Third-Party Liability), un dataset público actuarialmente realista y benchmarkeable contra la literatura.

P05 debería correr en Dataflow al menos en una demostración de dos horas. La ejecución local prueba que el código funciona; la ejecución en Dataflow prueba que el despliegue funciona. Esa diferencia importa.

También falta monitoreo de calidad de datos: Great Expectations o Soda entre la ingesta y la transformación, con alertas cuando un batch rompe expectativas. En producción, la calidad de datos es tan crítica como la disponibilidad del servicio.

Cuando la infraestructura de datos es confiable, el juicio actuarial se concentra en lo que realmente importa: elegir supuestos, calibrar modelos, interpretar resultados. No en limpiar datos.

El código, los tests y la documentación están en <a href="https://github.com/GonorAndres/data-engineer-path" target="_blank" rel="noopener">GitHub</a>. El dashboard de siniestros está en producción en <a href="https://data-engineer.gonor.me" target="_blank" rel="noopener">Cloud Run</a>.
