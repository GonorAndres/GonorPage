---
title: "Reservas y Siniestralidad: Dashboard Interactivo de Seguros P&C"
description: "Análisis de reservas actuariales con métodos Chain-Ladder y Bornhuetter-Ferguson sobre datos regulatorios NAIC Schedule P. Dashboard interactivo con triángulos de pérdida, IBNR y ratios combinados para 6 ramos de seguros."
date: "2026-03-05"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Python · FastAPI · Next.js · SQL · Jupyter"
  datos: "NAIC Schedule P · siniestros sintéticos (~50,000 reclamaciones)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/data-analyst-path/tree/main/projects/01-insurance-claims-dashboard"
  live: "https://data-analyst.gonor.me/insurance"
tags: ["reservas", "chain-ladder", "BF", "IBNR", "P&C", "dashboard", "Python", "SQL"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/insurance-claims-dashboard.webp"
heroAlt: "Un triángulo de desarrollo distingue los pagos observados de las celdas de desarrollo futuro estimado."
heroCaption: "La experiencia observada permite proyectar el desarrollo pendiente; esa parte futura sigue siendo una estimación."
---

> **Nota:** Este proyecto es parte del [Portafolio de Analista de Datos: 7 Proyectos End-to-End](/blog/data-analyst-portfolio). Aquí se presenta el análisis completo de este proyecto en particular.

Todo CFO de una aseguradora tiene la misma pregunta debajo de la superficie en cada cierre contable: ¿estamos reservando suficiente? No es una pregunta filosófica. Es operativa. Si las reservas son insuficientes, el estado de resultados muestra utilidades que no existen, se distribuyen dividendos que son en realidad pasivos diferidos, y cuando los siniestros tardíos finalmente se liquidan, el balance revienta. Si las reservas son excesivas, el capital queda atrapado sin generar rendimiento, los ratios de solvencia parecen robustos cuando en realidad hay ineficiencia operativa. El actuario de reservas vive en ese espacio: estimar, con la información disponible hoy, cuánto va a costar en el futuro una cartera de siniestros que todavía no se ha reportado del todo.

Este proyecto construye el pipeline completo de esa tarea: desde la ingesta de datos regulatorios hasta un dashboard interactivo que muestra, por línea de negocio, cómo se comportan los triángulos de pérdida, qué dice cada método de reservas sobre el IBNR pendiente, y cuáles líneas son rentables y cuáles no.

## Los datos: NAIC Schedule P y siniestros sintéticos

El punto de partida son los datos del NAIC Schedule P, el reporte regulatorio que las aseguradoras en Estados Unidos presentan ante la National Association of Insurance Commissioners. Contiene triángulos de pérdida por ramo, primas, y la evolución de las liquidaciones a lo largo de múltiples años de desarrollo. Es información pública, auditada y estructurada exactamente para el tipo de análisis que hacen los actuarios de reservas.

Sobre esa base agregada construí una capa de siniestros individuales sintéticos: aproximadamente 50,000 reclamaciones generadas con distribuciones actuarialmente realistas. La severidad sigue una distribución lognormal (refleja el sesgo positivo que tienen los costos de siniestros en la práctica), la frecuencia es Poisson (llegadas aleatorias sin patrón de acumulación temporal), el rezago de reporte sigue una distribución exponencial (la mayoría de siniestros se reportan pronto; unos pocos tardan mucho), y el tiempo de liquidación sigue una distribución gamma (los siniestros más complejos tardan más en resolverse, generando una cola de liquidación).

La razón de usar datos sintéticos en esta capa es directa: los triángulos del NAIC son datos agregados. Para ilustrar la distribución de severidad individual, la frecuencia por período, y los patrones de rezago que alimentan cualquier modelo de frecuencia-severidad, se necesita granularidad a nivel de reclamación. Los datos reales de siniestros individuales son propietarios y no se comparten públicamente. La síntesis permite demostrar el pipeline completo sin comprometer información confidencial.

La limitación más importante de esta capa sintética es precisamente esa: las distribuciones son supuestos, no calibraciones contra datos reales de una aseguradora específica. El tail behavior de una distribución lognormal calibrada contra 50,000 siniestros reales de Responsabilidad Civil Médica será diferente a la teórica. En producción, ese paso de calibración es donde se gasta la mayor parte del tiempo actuarial.

Las seis líneas de negocio analizadas son: Private Passenger Auto, Commercial Auto, Medical Malpractice, Workers' Compensation, Product Liability y Other Liability.

## Metodología: Chain-Ladder y Bornhuetter-Ferguson

El método Chain-Ladder (CL) parte de los triángulos de pérdida acumulada. Para cada par de columnas de desarrollo consecutivas, se calcula el factor de desarrollo (link ratio): qué tanto crecen en promedio las pérdidas de un año de desarrollo al siguiente. La proyección hacia la diagonal final multiplica los datos conocidos de cada año de origen por los factores pendientes. Es un método completamente basado en los datos históricos del triángulo: si el portafolio cambió de composición o el patrón de liquidación se alteró, esa experiencia pasada puede ser una guía engañosa.

El método Bornhuetter-Ferguson (BF) combina dos fuentes de información: la experiencia histórica del triángulo (a través de los factores de desarrollo) y una estimación a priori de las pérdidas finales esperadas, típicamente derivada del ratio de pérdidas planeado sobre la prima. La reserva BF es una mezcla ponderada de ambas: en los años de origen más recientes, donde el triángulo tiene poca experiencia desarrollada, BF le da más peso al a priori. En los años más maduros, donde el triángulo ya muestra la mayor parte del desarrollo, le da más peso a los datos observados.

Cuándo usar cada uno: Chain-Ladder es más apropiado cuando el portafolio es estable, el historial de desarrollo es consistente, y la experiencia pasada es un predictor confiable de la futura. BF es preferible cuando los años de origen recientes tienen poca experiencia (cualquier movimiento en el triángulo se amplifica por los factores residuales), cuando el portafolio cambió de composición recientemente, o cuando hay razones para creer que el pasado no representa bien el futuro. En la práctica, los actuarios calculan ambos y usan el juicio profesional, no una regla mecánica, para decidir cuál se aproxima más a la realidad.

Los factores de desarrollo se calculan para cada año de desarrollo como promedios ponderados de los link ratios observados. El factor cola (tail factor), que proyecta más allá de la última columna disponible en el triángulo, es uno de los supuestos más sensibles del modelo, especialmente en líneas de cola larga como Medical Malpractice, donde los siniestros pueden tomar más de una década en resolverse completamente.

## Lo que muestran los números

Los resultados del análisis revelan diferencias sustanciales entre líneas de negocio:

**Private Passenger Auto** y **Product Liability** son las únicas dos líneas con ratio combinado menor al 100%, lo que las convierte en las únicas líneas rentables del portafolio en el período analizado.

**Medical Malpractice** muestra un ratio de pérdidas de aproximadamente 280%, la señal más clara de un problema de pricing estructural. En términos de reservas, esto implica que las primas cobradas cubren menos de un tercio de las pérdidas incurridas. No es un accidente: Medical Malpractice es la línea de mayor cola larga del portafolio. Los siniestros de responsabilidad médica pueden tardar años en reportarse (el paciente puede no descubrir el daño hasta mucho después del procedimiento) y años más en liquidarse (litigios prolongados, periciales, apelaciones). El IBNR de esta línea absorbe una proporción desproporcionada del IBNR total del portafolio.

El **IBNR total del portafolio es aproximadamente \$20.4 millones**, distribuido de manera heterogénea entre líneas. La concentración del IBNR en las líneas de cola larga (Medical Malpractice, Product Liability, Other Liability) es exactamente el tipo de información que un CRO necesita ver para decidir si el nivel de capital disponible es adecuado.

La comparación entre los resultados de Chain-Ladder y Bornhuetter-Ferguson muestra las mayores divergencias en los años de origen más recientes, donde el triángulo tiene menos desarrollo observado. Esa divergencia no es un defecto: es información. Donde los dos métodos coinciden, hay más confianza en la estimación. Donde divergen significativamente, ahí es donde el actuario debe profundizar el análisis.

## El dashboard: por qué la visualización interactiva importa aquí

El análisis de reservas produce una cantidad grande de información: factores de desarrollo por línea, proyecciones de pérdidas finales, comparaciones entre métodos, evolución histórica de ratios. Un reporte estático puede presentar esa información, pero no permite explorarla. Un CFO que quiere entender por qué el IBNR de Medical Malpractice creció 40% respecto al trimestre anterior necesita poder ver el triángulo directamente, no leer un párrafo que lo resume.

El dashboard (Next.js en el frontend, FastAPI en el backend) presenta:

- **KPI bar**: ratio combinado del portafolio, IBNR total, primas devengadas y frecuencia de siniestros, de un vistazo.
- **Heatmap del triángulo de pérdidas**: visualización de la matriz de desarrollo donde los colores muestran concentración de pérdidas. Los patrones anómalos en el triángulo saltan visualmente antes de que cualquier modelo los capture numéricamente.
- **Waterfall de IBNR**: contribución de cada línea de negocio al IBNR total, mostrando qué líneas dominan la incertidumbre de reservas.
- **Gráfica de frecuencia-severidad**: la relación entre número de siniestros y costo promedio por línea. Útil para distinguir si una línea tiene problema de frecuencia, de severidad, o de ambos.
- **Ratios por línea de negocio**: ratio de pérdidas y ratio combinado visualizados lado a lado para comparación directa.
- **Tendencia del ratio combinado**: evolución temporal que muestra si la rentabilidad de cada línea está mejorando o deteriorándose.
- **Distribución de severidad**: densidad del costo individual de siniestros, que revela si la cola derecha es pesada (reaseguro necesario) o controlable.
- **Modo oscuro y claro**: porque los actuarios trabajan en ambos.

## Conexiones con otros proyectos del portafolio

El núcleo de cálculo de este proyecto y el de [SIMA](https://sima.gonor.me) comparten una lógica fundamental: ambos calculan reservas, aunque para productos distintos. SIMA calcula reservas para seguros de vida (reservas prospectivas de largo plazo bajo regulación mexicana LISF/CUSF, con Lee-Carter para proyección de mortalidad). Este proyecto calcula reservas IBNR para seguros de daños (P&C), usando metodología de triángulos. La diferencia es el horizonte temporal y el mecanismo: vida trabaja con tablas de vida y tasas de interés técnico; daños trabaja con experiencia de desarrollo de siniestros. Pero la pregunta subyacente es la misma: cuánto reservar hoy para cubrir compromisos futuros inciertos.

Las [notas técnicas de seguro de vida](https://drive.google.com/drive/folders/1PfotLUbidzwk8gdW4kbqQfLB4PbkuYBj) y [seguro de daños](https://drive.google.com/drive/folders/12tF-Ma_sWtDM5k6zYzNx8btUGS78b-0W) del portafolio son el referente regulatorio: los marcos de la CNSF que gobiernan cómo se calculan y presentan las reservas en el mercado mexicano. Las metodologías de este proyecto son análogas, adaptadas al contexto regulatorio americano (NAIC), pero el razonamiento actuarial es el mismo.

El [GMM Explorer](https://gmm.gonor.me/contexto) aborda una pieza relacionada: dado un portafolio de siniestros de GMM, ¿qué mezcla de distribuciones los describe mejor para tarificar? La tarificación correcta hoy es el input que determina si el ratio de pérdidas mañana va a ser sostenible o no. Son dos etapas del mismo ciclo de gestión técnica del seguro.

## Limitaciones y lo que haría diferente

El análisis actual produce estimaciones puntuales de IBNR. Lo que falta es la incertidumbre alrededor de esas estimaciones.

El **método de Mack** extiende Chain-Ladder añadiendo una estructura estocástica que permite calcular intervalos de confianza para el IBNR sin suponer ninguna distribución paramétrica. Es el paso natural siguiente para convertir las estimaciones puntuales en rangos de reservas que pueda defender ante un regulador.

El **bootstrapping de los triángulos** (Over-Dispersed Poisson o Normal) es la alternativa más común en la práctica: se remuestrea el triángulo, se recalculan los factores de desarrollo en cada muestra, y se construye la distribución empírica del IBNR. Computacionalmente más costoso, pero produce distribuciones completas, no solo intervalos. Eso permite calcular el percentil 75 o el CVaR de las reservas, que es exactamente lo que piden los marcos de solvencia basados en riesgo.

Para las líneas de cola larga (Medical Malpractice especialmente), los **factores cola** son el supuesto más sensible del modelo. Con el triángulo disponible solo hay algunos años de desarrollo; proyectar más allá requiere ya sea benchmarks de la industria o modelos paramétricos de la curva de desarrollo. Un análisis de sensibilidad explícito sobre el factor cola de Medical Malpractice cambiaría materialmente el IBNR estimado.

Finalmente, el dashboard conecta el backend de FastAPI directamente a los resultados del análisis en Python. En producción, ese pipeline necesitaría validación de datos de entrada, versionado del modelo (para comparar estimaciones entre trimestres), y un proceso de aprobación actuarial antes de que los números lleguen a la dirección.

## Conclusión

Un departamento de reservas que solo produce un número de IBNR al cierre trimestral está haciendo la mitad del trabajo. El número sin contexto no permite tomar decisiones: ¿creció el IBNR porque el portafolio creció, porque los factores de desarrollo cambiaron, porque una línea específica está deteriorándose? El valor de un pipeline integrado como este es que hace esa pregunta respondible en minutos, no en días.

El resultado concreto que soporta este análisis: de las seis líneas de negocio del portafolio, dos son rentables y cuatro no. Medical Malpractice tiene un problema estructural de pricing que no se resuelve con reservas más altas, sino con una revisión de la tarifa técnica. Esa es la conversación que este análisis habilita.

## Material de referencia

- <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/01-insurance-claims-dashboard" target="_blank" rel="noopener">Repositorio en GitHub</a>: Código completo del proyecto: 5 notebooks de Jupyter (ingesta, EDA, frecuencia-severidad, triángulos de pérdida, ratios combinados), 5 queries SQL analíticas, backend FastAPI y frontend Next.js con el dashboard interactivo. Los notebooks están disponibles para visualización directa en nbviewer usando las URLs del repositorio.
