---
title: "GLM Poisson vs XGBoost para tarificar seguros de auto: laboratorio interactivo"
description: "Con 678,013 pólizas de autos, XGBoost ordena mejor el riesgo que un GLM Poisson, pero cada tarifa debe explicarse en una nota técnica y defenderse ante el regulador, lo que mantiene al ML como challenger. El laboratorio interactivo muestra explicaciones SHAP y una revisión de fairness geográfico."
date: "2026-09-13"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Python · XGBoost · LightGBM · SHAP · FastAPI · Cloud Run · Cloudflare"
  datos: "freMTPL2 (678,013 pólizas francesas de autos)"
  regulacion: "Nota técnica LISF · Solvencia II"
  estado: "Finalizado"
  live: "https://ml-insurance.gonor.me"
tags: ["tarificación", "GLM", "XGBoost", "SHAP", "fairness", "freMTPL2", "actuaría", "Cloud Run"]
lastModified: "2026-10-03"
heroImage: "/blog-illustrations/actuarial-ml-pricing.webp"
heroAlt: "Los datos de pólizas de autos recorren un modelo lineal y otro de árboles para comparar sus predicciones de riesgo."
heroCaption: "Un modelo de tarificación necesita evidencia predictiva y una explicación que se pueda auditar."
relatedPosts: ["actuarial-ml-pricing", "sima", "gmm-explorer"]
---

Una aseguradora no puede usar un modelo solo porque sea más preciso. Cada tarifa se debe explicar en una nota técnica, defender ante un regulador y mantener cuando cambie la cartera. El Laboratorio de Tarificación vuelve visible esa tensión: arma una póliza hipotética y compara la fórmula actuarial estándar con un challenger de aprendizaje automático.

El laboratorio está disponible en [ml-insurance.gonor.me](https://ml-insurance.gonor.me). Su guía en español y el Lab interactivo se sirven desde Cloudflare Pages; un backend FastAPI en Cloud Run responde mediante un proxy same-origin `/api/*`. La aplicación usa archivos de modelos congelados que salen del flujo de investigación. No reentrena un modelo cada vez que cambia un campo.

## La pregunta detrás de la interfaz

La comparación es entre un GLM Poisson, el modelo convencional de frecuencia, y árboles de gradient boosting. El GLM usa la exposición como offset y deja cada factor visible como una relatividad multiplicativa. XGBoost puede capturar interacciones y efectos no lineales que la fórmula promedia, pero su precio necesita una capa de explicación antes de que un actuario pueda defenderlo.

Los datos son freMTPL2: 678,013 pólizas reales francesas de responsabilidad civil de autos, divididas en 406,807 para entrenamiento, 135,603 para validación y 135,603 para prueba. La exposición se limita a un año y los conteos de siniestros a cuatro; no se elimina ninguna póliza. La validación se usa para afinación y early stopping, y todas las métricas principales provienen del conjunto de prueba.

## Mejor para ordenar el riesgo

| Modelo | Gini | D², deviance Poisson explicada |
|---|---:|---:|
| GLM Poisson | 0.242 | 0.031 |
| XGBoost | 0.341 | 0.085 |
| LightGBM | 0.337 | 0.086 |

XGBoost mejora el Gini en 41% respecto al GLM. También separa más sus predicciones de frecuencia: el decil de mayor riesgo predicho es 4.8 veces el menor, frente a 4.5 veces para el GLM. Eso sirve para ordenar una cartera por riesgo.

No significa que el modelo pueda predecir si un conductor en particular chocará el próximo año. El D² permanece bajo para todos los modelos porque la ocurrencia de un siniestro es mayormente aleatoria a nivel de póliza individual. Las 40 iteraciones de Optuna por modelo boosted fueron un presupuesto de comparación deliberadamente moderado en una máquina de 2 vCPU: 320 segundos para XGBoost y 252 para LightGBM; suficiente para compararlos limpiamente, no para insinuar una optimización exhaustiva.

## Qué mueve una predicción

TreeSHAP hace que el resultado de XGBoost se pueda inspeccionar. La contribución absoluta promedio es mayor para BonusMalus (0.2927), seguida por edad del vehículo (0.1870), edad del conductor (0.1286), región (0.0711), marca del vehículo (0.0674), potencia (0.0635), densidad (0.0510) y Area (0.0314).

Ese orden importa. El modelo boosted se apoya sobre todo en el historial de conducción y el vehículo, mientras que las relatividades categóricas más grandes del GLM son dummies geográficas: Area E 1.237, Area F 1.228 y Region R21 1.214. Son evidencias de distinta naturaleza; no se deben mezclar en una sola tabla de factores "principales".

En el perfil de ejemplo del laboratorio—conductor de 35 años, vehículo de 5 años, BonusMalus 60, densidad 1,000, Area C, marca B1, gasolina regular, Region R24 y un año de exposición—el GLM estima una frecuencia de 0.1004 y XGBoost de 0.0809. En este perfil relativamente seguro, el challenger boosted tarifica por debajo de la fórmula.

## Revisión de fairness geográfico

Area va de A rural a F de ciudad densa. La densidad es actuarialmente relevante, pero también puede representar diferencias socioeconómicas. La auditoría compara la frecuencia promedio predicha por cada modelo con la frecuencia observada en las seis áreas.

La desviación absoluta media es 0.0020 siniestros por póliza-año para el GLM y 0.0021 para XGBoost; la brecha individual más grande es 0.0037 en Area F. Esta corrida no encuentra evidencia significativa de que XGBoost use Area como un proxy injustificado más allá de lo que ya hace el GLM. Es un resultado nulo sobre una variable en un dataset, no una certificación de fairness para el método.

## Por qué el modelo sigue siendo un challenger

La mitad de severidad no funcionó: un GLM Gamma sobre los 4,999 siniestros de prueba obtuvo D² = −0.051, peor que cobrar a cada reclamante el costo promedio. El costo de un choque depende de detalles que el archivo de póliza no contiene. Por lo tanto, el proyecto modela bien la frecuencia, no una prima pura completa.

Tampoco incorpora gastos, margen de riesgo, credibilidad para segmentos pequeños, capital, reservas ni un año de prueba separado para evaluar cambios en el comportamiento de conducción. La LISF y Solvencia II exigen una nota técnica auditable; un modelo que ordena mejor el riesgo pero no se puede convertir en una estructura de tarifa defendible no supera ese umbral.

El uso responsable es como challenger: revisar dónde cambia el ordenamiento del GLM, convertir hallazgos estables en propuestas de factores y validarlos dentro del marco actuarial registrado. Los siguientes pasos naturales son un baseline Tweedie de prima pura, restricciones monotónicas para BonusMalus, splines o un GAM donde el lift sea plano y credibilidad para regiones pequeñas.

El [análisis técnico de investigación](/blog/actuarial-ml-pricing/) contiene la comparación amplia. Junto con [SIMA](/blog/sima/), que implementa el lado de capital y reservas de la regulación mexicana, este laboratorio sitúa la tarificación dentro de un ciclo actuarial más amplio.
