---
title: "Pricing de Seguros con ML: Lo que México Puede Aprender de la Revolución Actuarial Europea"
description: "Modelos de frecuencia-severidad sobre freMTPL2: Poisson GLM vs XGBoost vs LightGBM con explicabilidad SHAP, auditorías de fairness y un análisis transfronterizo de lo que las técnicas europeas de pricing con ML significan para el mercado mexicano donde el 70% de los autos no tiene seguro."
date: "2026-03-14"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Python · XGBoost · LightGBM · SHAP · FastAPI"
  datos: "freMTPL2 (678,013 pólizas reales, asegurador francés)"
  regulacion: "LISF (nota técnica de suficiencia)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/insurance-pricing-ml"
tags: ["pricing", "GLM", "XGBoost", "LightGBM", "SHAP", "freMTPL2", "actuarial", "frecuencia-severidad", "Optuna", "MLflow", "fairness"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/actuarial-ml-pricing.webp"
heroAlt: "Los mismos datos de pólizas recorren un modelo lineal y otro de árboles para comparar predicciones y contribuciones de variables."
heroCaption: "Comparar modelos de tarificación exige considerar tanto la capacidad predictiva como la explicación de cada resultado."
---

México es el único país de la OCDE sin seguro obligatorio federal de responsabilidad civil vehicular. Aproximadamente el 30% de los vehículos tienen alguna cobertura. El 70% restante representa 35 millones de autos sin seguro en las calles; una falla de mercado con doble efecto. Las víctimas de accidentes no tienen recurso legal. Las aseguradoras tarifican conservadoramente para compensar la selección adversa que enfrentan. Y los métodos usados por la mayoría de las aseguradoras mexicanas permanecen tradicionales: tablas de tarificación manuales con pocas variables, juicio actuarial por encima de la precisión algorítmica, uso limitado de las técnicas de modelado predictivo que ya han transformado el seguro europeo y norteamericano.

Este proyecto plantea una pregunta concreta: ¿qué puede aprender el mercado mexicano de seguros de auto de la revolución de ciencia de datos actuarial europea? No en teoría, sino demostrado sobre el mismo dataset que la comunidad actuarial global usa como benchmark.

## Por qué freMTPL2 importa

El dataset se llama freMTPL2. Contiene 678,013 pólizas reales de responsabilidad civil de un asegurador francés: conteos de siniestros, exposición, características del vehículo, demografía del conductor y densidad geográfica. Es el dataset que Noll, Salzmann y Wuthrich usaron en su paper fundacional de 2020 para demostrar que los gradient boosting machines superan a los GLMs en predicción de frecuencia de siniestros. Es el dataset que scikit-learn usa en su tutorial oficial de regresión Tweedie. Es el dataset que la Casualty Actuarial Society, la Asociación Actuarial Alemana (DAV) y el Insurance Pricing Game de Imperial College London referencian como el estándar.

Construir sobre freMTPL2 es una decisión deliberada, no un atajo. Cuando haces benchmark contra datos que usa la literatura publicada, tus resultados son directamente comparables. Un coeficiente de Gini en freMTPL2 es algo específico y verificable. En un dataset propietario, significa solo lo que tú digas.

## La descomposición actuarial

El pricing de seguros se reduce a dos problemas de predicción interconectados: con qué frecuencia ocurren los siniestros y cuánto cuestan cuando ocurren. La prima pura —que determina el precio técnico— es el producto de la frecuencia esperada por la severidad esperada. Esta descomposición frecuencia-severidad es el estándar actuarial, codificado en marcos regulatorios desde Solvencia II en Europa hasta la LISF en México. No es un truco de modelado; es una estructura obligatoria.

Para frecuencia, la regresión Poisson con función liga logarítmica y exposición como offset es el estándar. Para severidad, la distribución Gamma con liga logarítmica captura la distribución de costos sesgada a la derecha y estrictamente positiva una vez ocurre un siniestro. Estos GLMs forman el baseline regulatorio en todas las aseguradoras de autos globalmente, elegidos por tres razones: transparencia, auditabilidad y décadas de teoría actuarial detrás de ellos.

Los GLMs funcionan; la pregunta es si dejan precisión predictiva sobre la mesa. ¿No capturan interacciones no lineales entre variables? ¿Y la mejora de los modelos de machine learning es lo suficientemente grande como para justificar la complejidad adicional?

## Lo que muestran los modelos

La respuesta, consistente con los benchmarks publicados, es sí. En este dataset:

El **Poisson GLM** alcanza un coeficiente de Gini de 0.242 con un D² (deviance explicada) de 0.031. BonusMalus domina la tabla de coeficientes (la bonificación por no siniestralidad es la señal más fuerte), y varias regiones junto con los dos códigos de Area más densos concentran las relatividades más altas. La interpretabilidad aquí es inherente: cada coeficiente mapea directamente a un factor multiplicativo sobre la frecuencia base.

**XGBoost** con objetivo Poisson, afinado vía Optuna con 40 iteraciones de optimización bayesiana (un presupuesto dimensionado para la máquina de 2 núcleos donde corrió, no un número redondo impuesto de antemano), alcanza un Gini de 0.341 con un D² de 0.085. **LightGBM**, afinado de la misma forma, queda muy cerca con 0.337 de Gini. Ambos GBM superan al GLM en Gini por aproximadamente 40%. El D² se mantiene bajo en los tres modelos, incluido el GLM: en freMTPL2 la ocurrencia de siniestros está dominada por aleatoriedad que ningún conjunto de variables estáticas explica del todo, así que unos pocos puntos porcentuales de deviance explicada son el techo realista aquí, no una señal de que algo esté mal.

El análisis de double-lift agrupa a los asegurados en deciles según la predicción del GLM, y luego compara la propia predicción del GLM contra la del GBM ganador y la frecuencia realmente observada en cada decil. El GBM distribuye sus predicciones en un rango más amplio que el GLM (una razón de aproximadamente 4.8x entre su decil de mayor y menor riesgo, contra 4.5x del GLM), consistente con capturar efectos no lineales y de interacción que el modelo lineal promedia. La diferencia es real pero modesta, no la mala tarificación dramática que una primera lectura de la tabla de coeficientes podría sugerir, y esa modestia es informativa en sí misma: la mayor parte de la señal de frecuencia en este dataset es casi lineal una vez que se controla por BonusMalus y geografía; la ventaja del GBM viene de los casos extremos, no de reescribir todo el orden de riesgo.

Del lado de severidad, un GLM Gamma ajustado sobre los cerca de 5,000 siniestros de prueba arrojó un D² negativo (-0.051): explica menos deviance que simplemente predecir el costo promedio de siniestro para todos. Es un hallazgo genuino, no un error. La severidad de siniestros en freMTPL2 tiene cola pesada y depende de circunstancias específicas del daño (qué se golpeó, con qué gravedad) que las variables estáticas de la póliza, como edad del vehículo o bonus-malus, no pueden ver. Es el recordatorio honesto detrás de la descomposición frecuencia-severidad: el lado de frecuencia premia mejores variables y mejores modelos; el de severidad, muchas veces no. Un actuario que solo reporta el Gini de frecuencia cuenta la mitad de la historia.

## El problema de la explicabilidad

Un modelo de caja negra que supera al GLM no tiene valor si los reguladores no pueden inspeccionarlo y los actuarios no pueden firmarlo. Esto no es hipotético. El EU AI Act (vigente desde 2024) clasifica el pricing de seguros como IA de alto riesgo. El Colorado AI Act entra en vigor en febrero 2026. México no ha emitido regulación específica de IA para seguros aún, pero la CNSF requiere notas técnicas para todos los registros de tarifas, y se espera una ley general de IA para 2026.

SHAP (SHapley Additive exPlanations) es la respuesta. TreeSHAP descompone la predicción del GBM ajustado para cada asegurado en contribuciones aditivas por variable. El resumen global de SHAP confirma lo que los actuarios ya esperan de BonusMalus: domina, por delante de edad del vehículo y edad del conductor. La gráfica de dependencia de BonusMalus muestra una aceleración no lineal clara arriba de un puntaje de 100, justo donde las penalizaciones francesas por siniestralidad empiezan a acumularse. La edad del conductor es más desordenada que el clásico efecto en forma de U: el riesgo sube para los conductores más jóvenes, cae en el rango de 25 a 40 años, y vuelve a subir a partir de los 40, manteniéndose elevado hasta edades avanzadas. Es un patrón real y verificable en estos datos, no una curva suave ajustada para calzar con lo esperado.

Kuo y Lupton (2023, revista Variance) formalizaron este resultado: SHAP combinado con gráficas de dependencia parcial provee la capa de interpretabilidad que los reguladores necesitan para aprobar modelos de pricing basados en ML. No es especulativo; es el estándar emergente.

## La pregunta de fairness

La variable Area en freMTPL2 codifica la densidad poblacional de A (rural) a F (urbano denso). La densidad es actuarialmente sólida: las zonas urbanas enfrentan más tráfico, más accidentes, costos de reparación más altos. La densidad también correlaciona con nivel socioeconómico. Francia monitorea esto bajo GDPR y la Directiva de Género de la UE. La desigualdad de ingresos entre la Ciudad de México y Oaxaca rural en México es un orden de magnitud mayor, lo que hace la misma pregunta mucho más aguda.

La auditoría de fairness compara las frecuencias predichas contra las frecuencias realmente observadas en los segmentos de Area, de la A a la F, tanto para el GLM como para el GBM ganador. En esta corrida, el resultado no es dramático: la desviación absoluta promedio del GBM respecto a la frecuencia real por área (0.0021 siniestros por año de exposición) es cercana a la del GLM (0.0020), con la brecha más grande en el Area F, el segmento urbano más denso. Ninguno de los dos modelos muestra una señal relevante de explotar la densidad como proxy no justificado más allá de lo que el modelo lineal ya captura. Ese es un hallazgo útil y verificable por sí mismo, no una conclusión dada de antemano: significa que la ganancia de precisión del GBM en esta corrida no viene acompañada de un costo de equidad, al menos no uno que esta auditoría pueda detectar solo con Area. El análisis no resuelve la pregunta ética más amplia de tarificar por geografía, pero la hace empíricamente contestable, que es el prerrequisito para cualquier discusión regulatoria.

## Conexiones con el resto del portafolio

Este proyecto ocupa una posición específica en el pipeline técnico de seguros. El [dashboard de reservas P&C](/blog/insurance-claims-dashboard) respondió la pregunta retrospectiva: qué pasa después de que los siniestros ocurren (patrones de desarrollo, IBNR, ratios de siniestralidad por ramo). Este responde la contraparte prospectiva: dadas las características de un asegurado, ¿qué prima debería pagar antes de que ocurra cualquier siniestro?

La conexión es directa. La frecuencia predicha del modelo de pricing alimenta los inputs de pérdida esperada del modelo de reservas. Si el modelo de pricing subestima sistemáticamente la frecuencia para un segmento, el modelo de reservas eventualmente mostrará desarrollo adverso. Los dos proyectos son etapas consecutivas de un solo ciclo actuarial.

[SIMA](https://sima.gonor.me) implementa la capa de cálculo regulatorio para México: reservas bajo LISF/CUSF, proyección de mortalidad Lee-Carter y suficiencia de capital mandatada por la CNSF. Las primas técnicas de este proyecto alimentan los módulos de reservas de SIMA río abajo. Productos distintos (auto vs. vida), misma lógica regulatoria: la CNSF requiere notas técnicas que demuestren suficiencia actuarial, y el pricing con ML más explicabilidad SHAP entrega exactamente eso.

El [GMM Explorer](https://gmm.gonor.me/contexto) aborda la distribución de severidad: dado un portafolio de siniestros, ¿qué mezcla de distribuciones describe mejor el costo? Este es el lado de severidad de la descomposición frecuencia-severidad que este proyecto maneja en el lado de frecuencia.

## Lo que esto significa para México

La brecha no es teórica. Solo el 15–20% de las aseguradoras mexicanas usa alguna forma de IA o ML en tarificación. Qualitas (33% de participación en auto) aún usa métodos tradicionales. Crabi es la única aseguradora de auto nativa digital con licencia en México en 25 años. México tiene 68 insurtechs, el segundo ecosistema más grande en América Latina, pero la disrupción de metodología de pricing apenas ha comenzado.

El entorno regulatorio es paradójicamente más permisivo que el europeo. La CNSF requiere notas técnicas para registros de tarifas pero no aprobación previa. No existe regulación específica de IA comparable al EU AI Act. Una aseguradora mexicana podría adoptar pricing con ML y explicabilidad SHAP hoy: presentar la nota técnica demostrando suficiencia actuarial y desplegar, evitando el proceso de aprobación multianual que enfrentan las aseguradoras europeas.

El caso de negocio es directo: primas adecuadas al riesgo basadas en ML significan precios más bajos para buenos conductores y precios más precisos para los malos. En un mercado donde el 70% de los vehículos no está asegurado, hacer el seguro más barato para la mayoría de la población no es solo ventaja competitiva; expande el mercado mismo. Con 96.5% de penetración móvil, México tiene la infraestructura para telemática basada en smartphones (UBI), el paso natural después de demostrar que las variables tradicionales ya soportan pricing con ML.

## Limitaciones y lo que sigue

Este proyecto usa datos europeos para demostrar técnicas relevantes para México. La limitación es clara: los patrones de manejo franceses, las flotas vehiculares y los perfiles de riesgo geográfico difieren de México. Un Nissan March en Guadalajara enfrenta riesgos distintos que un Renault Clio en Lyon. La metodología se transfiere; los parámetros no.

Lo que México carece es una base de datos centralizada y anonimizada de siniestros equivalente a freMTPL2. Francia tiene una. El Reino Unido tiene una. México no. AMIS (la Asociación Mexicana de Instituciones de Seguros) podría construir esto, con resultados transformadores: un freMTPL2 mexicano que permita a todas las aseguradoras, no solo a las más grandes, construir modelos de pricing basados en datos.

En el lado de modelado, CatBoost y Explainable Boosting Machines (EBMs) extenderían la comparación. Un GLM Tweedie que modele la prima pura directamente (omitiendo la descomposición frecuencia-severidad) es la extensión natural del baseline. Intervalos de confianza bootstrap sobre Gini y deviance convertirían estimaciones puntuales en rangos que reflejan incertidumbre honesta.

Todo lo anterior, incluyendo el código de afinación, las pruebas para las métricas de evaluación y un pequeño endpoint FastAPI que sirve la predicción del modelo ganador, está en el [repositorio del proyecto](https://github.com/GonorAndres/insurance-pricing-ml), junto con la tabla completa de resultados y cada gráfica referenciada aquí.

## Fundamento académico

Los cuatro papers que sustentan este proyecto:

Noll, Salzmann y Wuthrich (2020) establecieron el benchmark freMTPL2 y mostraron superioridad del GBM para frecuencia de siniestros. Colella y Jones (2023, CAS E-Forum) confirmaron que ningún modelo domina universalmente, validando el enfoque comparativo. MDPI Risks (2024) mostró que un modelo híbrido GLM+ANN supera a todos los modelos individuales, apuntando hacia estrategias de ensamble como el futuro probable del pricing actuarial. Kuo y Lupton (2023, Variance) formalizaron el marco de explicabilidad que hace el pricing con ML regulatoriamente viable.
