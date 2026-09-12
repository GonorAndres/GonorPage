---
title: "Risk Analyst: 13 Proyectos de Análisis Cuantitativo de Riesgos Financieros"
description: "Los modelos de riesgo financiero pierden credibilidad cuando existen solo como fórmulas en un PDF. Estos 13 módulos los implementan en Python tipado con tests automatizados: desde VaR de portafolio y simulación Monte Carlo hasta cópulas, EVT, deep hedging y redes neuronales en grafos para contagio sistémico. Cada módulo combina teoría en LaTeX con resultados reproducibles sobre datos públicos de mercado."
date: "2026-03-19"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Python · PyTorch · scikit-learn · QuantLib · arch · PyTorch Geometric"
  datos: "yfinance · FRED (datos de mercado públicos)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/risk-analyst"
tags: ["Python", "Riesgo Financiero", "VaR", "Monte Carlo", "Machine Learning", "Deep Hedging", "Copulas", "EVT"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/risk-analyst.webp"
heroAlt: "Escenarios de riesgo forman una distribución de pérdidas; los resultados que rebasan el umbral vuelven al proceso de validación."
heroCaption: "Una medida de riesgo gana utilidad cuando sus estimaciones se contrastan con las pérdidas observadas."
---

¿Cómo pasas de un número de VaR en una hoja de cálculo a un sistema validado y reproducible? Lo construyes tú mismo, pieza por pieza. Este proyecto son 13 módulos que avanzan desde los fundamentos (VaR de portafolio, motores Monte Carlo) a herramientas de grado regulatorio (pruebas de estrés, riesgo de cola con EVT) hasta territorio de investigación (deep hedging, redes neuronales en grafos para contagio sistémico, una innovación no trivial en el campo). Cada módulo combina teoría en LaTeX con Python tipado, tests automatizados y resultados reproducibles. Son ejercicios modelados con información pública; alguien con experiencia real en el medio encontrará margen de mejora sustancial, y ese es precisamente el punto de partida.

## Las tres capas

Los tres niveles reflejan cómo se acumula realmente el conocimiento en riesgos. Empiezas con las herramientas que todos necesitan (VaR, Monte Carlo, scoring crediticio, GARCH). Luego enfrentas los problemas que la regulación y la gestión de portafolios te ponen enfrente (colas extremas, dependencia por cópulas, escenarios de estrés). Después llegas a la frontera, donde el machine learning se encuentra con preguntas abiertas.

### Tier 1: Fundamentos (P01 a P04)

**P01. Portfolio Risk Dashboard.** La pregunta central en riesgo de portafolio: cuánto es lo máximo que un portafolio puede perder mañana a un nivel de confianza dado. Y cómo saber cuándo esa estimación está equivocada. El dashboard calcula VaR de tres formas (histórico, paramétrico, Monte Carlo) y lo valida con tres backtests estándar de la industria (Kupiec, Christoffersen, semáforo de Basilea). Lo interesante es el backtesting rolling: detecta exactamente cuándo el modelo empieza a subestimar pérdidas. Cada test automatizado verifica una propiedad matemática, no solo que el código corra.

**P02. Monte Carlo Simulation Engine.** El motor replica precios de opciones europeas dentro del 1% de Black-Scholes en 100,000 trayectorias. Llegar ahí requirió resolver dos problemas: generar trayectorias de activos correlacionadas que respeten la estructura de covarianza, y hacer que las simulaciones converjan lo suficientemente rápido para ser usables. La reducción de varianza hace el trabajo pesado; las antitéticas reducen varianza un 60%, las variables de control un 85%.

**P03. Credit Scoring con ML.** Cada decisión de crédito es una apuesta sobre si el acreditado va a pagar. Equivocarse cuesta dinero por un lado y niega acceso al crédito por el otro. La prueba real no es precisión sino calibración: cuando el modelo dice "5% de probabilidad de default," ¿realmente incumple el 5% de esos acreditados? Tres clasificadores compiten sobre el mismo dataset, SHAP explica decisiones individuales, y las pruebas de calibración verifican que las probabilidades declaradas coincidan con los defaults observados. AUC arriba de 0.85.

**P04. Volatility Modeling.** Los modelos de riesgo que tratan la volatilidad como constante quedan expuestos cada vez que el mercado cambia entre períodos de calma y turbulencia. Detectar en qué régimen estás cambia el número de VaR, el ratio de cobertura y el requerimiento de margen. Cuatro variantes de GARCH capturan distintas asimetrías en cómo los mercados reaccionan a buenas y malas noticias. El modelo más revelador es el Markov switching: identifica transiciones entre regímenes con probabilidades filtradas, produciendo un VaR que sabe si el mercado está en crisis o no.

### Tier 2: Intermedio a Avanzado (P05 a P07)

**P05. EVT para Riesgo de Cola.** El VaR al 99.9% bajo modelado correcto de colas resulta entre 40 y 60% mayor que la estimación gaussiana. Esa brecha importa porque los reguladores fijan requerimientos de capital exactamente en esos niveles de confianza, y subestimar la cola significa subestimar el capital que necesitas. La teoría de valores extremos ofrece dos enfoques (GEV para block maxima, GPD para peaks-over-threshold) con selección automática de umbral. La diferencia entre estimaciones gaussianas y EVT se amplía precisamente donde más cuenta.

**P06. Copula Dependency Modeling.** Se supone que la diversificación protege un portafolio, pero en una crisis todo cae junto. La correlación lineal no captura esto. Cinco familias de cópulas modelan la estructura de dependencia, y la cópula t es la crítica: captura el hecho de que los activos se correlacionan mucho más cuando los mercados caen que en condiciones normales. El VaR del portafolio bajo cópula t resulta entre 15 y 25% mayor que bajo supuestos gaussianos, lo que significa que cualquier modelo de riesgo basado en correlación lineal es sistemáticamente optimista sobre la diversificación.

**P07. Stress Testing Framework.** Después de 2008, los reguladores a nivel mundial exigieron a las instituciones financieras demostrar que sus portafolios podían sobrevivir escenarios macro adversos específicos. El ejercicio no es hipotético; determina colchones de capital y puede bloquear el pago de dividendos. El framework transmite escenarios tipo DFAST/CCAR al portafolio. El módulo más interesante invierte la pregunta habitual: en lugar de preguntar "¿qué pasa si el PIB cae 5%?", pregunta "¿qué combinación macro produce una pérdida inaceptable?" En la literatura, esa inversión revela escenarios que el análisis forward no detecta.

### Tier 3: Frontera (P08 a P13)

**P08. Deep Hedging.** El delta hedging clásico asume mercados sin fricción: cero costos de transacción, rebalanceo continuo. Los mercados reales cobran por cada operación, lo que significa que la estrategia de libro de texto sistemáticamente paga de más. Redes neuronales que aprenden estrategias de cobertura desde cero, incluyendo costos de transacción, sin asumir ningún modelo de mercado particular. Cuando los costos de transacción son significativos, las estrategias aprendidas superan al delta hedging clásico porque internalizan el costo de rebalancear en lugar de ignorarlo.

**P09. CVA Counterparty Risk.** Cuando entras a un contrato derivado, estás expuesto no solo a movimientos de mercado sino a la posibilidad de que tu contraparte incumpla antes de liquidar. Después de 2008, esto dejó de ser una preocupación teórica; el CVA se convirtió en un cargo obligatorio contable y de capital. La implementación estima probabilidades de default desde precios de mercado, simula cómo evoluciona la exposición a lo largo de la vida del contrato, y modela el peor caso: wrong-way risk, donde tu exposición a una contraparte crece precisamente cuando esa contraparte tiene más probabilidad de incumplir.

**P10. GNN Credit Contagion.** Cuando Lehman Brothers colapsó, el shock se propagó por la red interbancaria y golpeó a instituciones que no tenían exposición directa a hipotecas subprime. Predecir qué nodos son más vulnerables requiere modelar la estructura de la red misma, no solo los balances individuales. Redes neuronales en grafos sobre redes interbancarias modelan cómo la quiebra de un banco se propaga por el sistema. DebtRank mide la importancia sistémica de cada banco; el modelo de red predice quién es vulnerable antes de que el contagio empiece.

**P11. Conformal Risk Prediction.** Todo modelo paramétrico de VaR hace supuestos distribucionales que pueden fallar. La pregunta es si se puede obtener cobertura válida sin comprometerse con una distribución específica. La predicción conformal aplicada a bandas de VaR y ES entrega exactamente eso: cobertura nominal sin importar la distribución subyacente, sin supuestos paramétricos. Los intervalos se adaptan automáticamente al régimen de volatilidad.

**P12. Climate Risk Scenarios.** Bancos centrales y reguladores ahora exigen a las instituciones financieras evaluar cómo las trayectorias de transición climática afectan sus portafolios. El riesgo no es solo daño físico; es que cambios de política dejen obsoletas clases enteras de activos antes de que maduren. Tres escenarios NGFS (Net Zero, Delayed Transition, Current Policies) traducidos a métricas de riesgo climático a nivel portafolio. Los índices de sensibilidad de Sobol revelan qué supuestos climáticos dominan la incertidumbre, una pregunta que la literatura señala como frecuentemente ausente en los reportes estándar.

**P13. RL for Portfolio Risk.** La mayoría de las estrategias de rebalanceo siguen un calendario fijo o un umbral, sin importar qué esté pasando en el mercado. La idea aquí es dejar que el modelo aprenda cuándo actuar y cuánto mover, basándose en el estado actual. Dos algoritmos de reinforcement learning entrenan un agente que mantiene las pérdidas de cola bajo control sin sacrificar rendimiento. El resultado: el drawdown máximo cae entre 30 y 40% comparado con un portafolio ingenuo de pesos iguales.

## Validación

Los 192 tests de pytest están escritos contra el código construido. Verifican que las implementaciones respeten las propiedades matemáticas que dicen implementar: el VaR crece con el nivel de confianza, el CVaR excede al VaR, el Monte Carlo converge a la solución cerrada cuando existe una. No son pruebas de que el código corra sin errores; son pruebas de que el código hace lo que la teoría dice que debería hacer.

## Stack técnico

El proyecto usa Python exclusivamente, con separación clara entre datos, modelos, medidas de riesgo, simulación y visualización:

- **Riesgo y finanzas:** QuantLib, riskfolio-lib, arch (GARCH), pyextremes (EVT), copulae
- **Machine learning:** scikit-learn, XGBoost, LightGBM, PyTorch, PyTorch Geometric, SHAP
- **Simulación:** motor Monte Carlo propio con reducción de varianza (antitéticas, control variates, importance sampling)
- **Datos:** yfinance, FRED, pandas
- **Documentación:** LaTeX (texlive) para teoría, Jupyter para walkthroughs interactivos

## Conexión con el resto del portafolio

Dos proyectos del portafolio fueron el punto de partida directo. El <a href="/blog/cartera-autos/">proyecto de cartera de autos</a> trabaja reservas y triángulos de pérdida para un solo ramo; aquí esas ideas se extienden a portafolios con múltiples clases de activos. El <a href="https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/Credit_Risk_Model">modelo de crédito</a> original era un scoring básico; P03 lo retoma con calibración y explicabilidad, y P10 lleva la misma pregunta a redes interbancarias.

El código, los tests y la documentación completa están en <a href="https://github.com/GonorAndres/risk-analyst" target="_blank" rel="noopener">GitHub</a>.
