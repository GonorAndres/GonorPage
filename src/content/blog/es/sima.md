---
title: "SIMA: De Datos Crudos del INEGI a Requerimientos de Capital bajo LISF, End-to-End"
description: "SIMA centraliza las técnicas actuariales para valuar seguros de vida: toma mortalidad cruda de INEGI/CONAPO, la gradúa con métodos como Whittaker-Henderson y Lee-Carter para obtener curvas que respetan la biología humana, y proyecta hacia el futuro para calcular primas, reservas y requerimientos de capital bajo LISF. Todo expuesto como API, lo que permite conectarlo con otros sistemas, automatizar análisis de sensibilidad y cumplir con los requisitos de la CNSF. Código abierto y diseñado para crecer hacia otros ramos."
date: "2026-03-15"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Python · FastAPI · React · scipy"
  datos: "INEGI · CONAPO · Human Mortality Database"
  regulacion: "LISF · CUSF · CNSF (SCR/RCS, Solvencia II)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/SIMA"
  live: "https://sima.gonor.me"
tags: ["Lee-Carter", "mortalidad", "LISF", "CUSF", "CNSF", "Whittaker-Henderson", "SVD", "reservas", "SCR", "funciones-de-conmutación", "INEGI", "CONAPO", "FastAPI", "React"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/sima.webp"
heroAlt: "Observaciones de mortalidad pasan a una curva graduada, una proyección con incertidumbre y bloques de cálculo actuarial."
heroCaption: "Graduar y proyectar la mortalidad conecta los datos observados con el cálculo de primas, reservas y capital."
---

La carrera de actuaría en México enseña $q_x$, $p_x$, funciones de conmutación y el principio de equivalencia. También enseña a construir tablas de vida. Lo que trata como secundario, como un ejercicio mecánico, es justamente lo que en la práctica define el trabajo actuarial: ante datos empíricos reales, cuál es la mejor forma de llegar a esa tabla. Qué método de graduación, qué modelo de proyección, cómo manejar un evento catastrófico en la serie temporal. Esas decisiones tienen implicaciones regulatorias y financieras concretas, y son el núcleo de lo que una aseguradora defiende ante la CNSF cada trimestre. SIMA es un intento de construir ese pipeline completo, desde el CSV crudo hasta el SCR final, con cada paso documentado, testado y expuesto vía API.

El punto de partida son los datos crudos de mortalidad mexicana: conteos de defunciones por edad y año del INEGI cruzados con estimaciones de población a mitad de año del CONAPO. La tasa cruda $m_{x,t} = d_{x,t} / E_{x,t}$ resultante es ruidosa, especialmente en edades extremas, y necesita un método formal de graduación antes de ser actuarialmente útil. Esa distancia entre el dato crudo y la tabla de vida lista para pricing es el problema central que SIMA resuelve.

## El pipeline de mortalidad

Graduar tasas de mortalidad es análogo a ajustar una línea de tendencia, pero con una restricción: la curva debe respetar la forma biológica conocida (curva en forma de tina). Whittaker-Henderson hace exactamente eso: optimiza $(W + \lambda D'D)^{-1} W m$, donde $\lambda$ es el parámetro que decide cuánto peso darle al dato observado vs. a la suavidad esperada. Con $\lambda$ bajo, reproduces cada oscilación; con $\lambda$ alto, impones una tendencia. Con datos de México, $\lambda$ entre 10 y 1000 con diferencias de segundo orden produce curvas que respetan esos patrones sin perseguir el ruido muestral. La solución se resuelve eficientemente con `scipy.sparse.linalg.spsolve`.

Sobre los datos graduados se ajusta el modelo Lee-Carter: $\ln(m_{x,t}) = a_x + b_x \cdot k_t$. Cada parámetro tiene una interpretación demográfica precisa. $a_x$ es el patrón promedio de mortalidad por edad, la forma general de la curva. $b_x$ mide la sensibilidad de cada edad al cambio temporal: edades donde $b_x$ es alto mejoran rápido cuando $k_t$ baja, edades donde $b_x$ es bajo son refractarias a la mejora. $k_t$ es el índice temporal de mortalidad, la señal que resume en un solo número por año la tendencia histórica de mejora.

La estimación via SVD da exactamente la aproximación de rango 1 que maximiza la varianza explicada del logaritmo de las tasas. Con datos mexicanos de 1990-2019 (pre-COVID), el primer componente singular explica el 77.7% de la varianza, consistente con la literatura internacional. SIMA también procesa datos de EE.UU. y España del Human Mortality Database, lo que permite comparar velocidades de mejora entre mercados: el drift mexicano pre-COVID ($-1.076$) frente al estadounidense y español revela que la mortalidad no mejora al mismo ritmo en todos los países.

El problema interesante apareció con la re-estimación de $k_t$. El Lee-Carter original requiere re-estimar $k_t$ para que el total de muertes observado coincida con el total implicado por el modelo. Esto se resuelve encontrando el punto donde una función residual cruza el cero. Pero cuando pregraduas los datos con Whittaker-Henderson, algunos valores de $b_x$ se vuelven negativos en edades específicas (77, 78, 85 en los datos mexicanos), lo que hace que esa función se doble hacia adentro sin cruzar el cero: el algoritmo estándar busca un cruce y no lo encuentra, así que falla silenciosamente. La solución fue construir una búsqueda adaptativa que expande el intervalo progresivamente hasta encontrar ese cruce, o reconocer que no existe y usar el $k_t$ del SVD directamente. Este es el tipo de detalle que no aparece en los libros de texto pero que define si tu código funciona con datos reales.

La proyección usa Random Walk with Drift: $k_{T+h} = k_T + h \cdot \text{drift} + \sigma \sqrt{h} \cdot Z$. El drift estimado pre-COVID es $-1.076$ (mortalidad mejorando consistentemente). El signo negativo es intuitivo: en Lee-Carter, $k_t$ baja cuando la mortalidad mejora, porque $b_x$ es positivo en promedio y $\ln(m_{x,t})$ cae cuando la gente vive más. Un drift de $-1.076$ equivale a decir que el índice de mortalidad bajó, en promedio, 1.076 puntos por año durante ese período. Cuando incluyes los años de pandemia, el drift sube a $-0.855$: la tendencia de mejora en mortalidad se frenó. El impacto en primas es directo y cuantificable: entre 3% y 10% de incremento dependiendo del producto y la edad de emisión. Ese número importa porque es exactamente el tipo de análisis que la CNSF espera en una nota técnica de suficiencia de prima.

## El motor financiero

Una vez que tienes una tabla de vida proyectada, el paso a funciones de conmutación es computacionalmente trivial pero conceptualmente profundo. $D_x = v^x \cdot l_x$ combina la supervivencia con el valor del dinero en el tiempo en un solo número. $N_x = \sum_{k=x}^{\omega} D_k$ se calcula con recursión hacia atrás: $N_{\omega} = D_{\omega}$, $N_x = N_{x+1} + D_x$. Lo que parecian sumatorias anidadas de complejidad $O(n^2)$ se convierten en operaciones $O(n)$. Las funciones de conmutación son, en esencia, una estructura de datos que precomputa toda la información actuarial necesaria para cualquier cálculo de anualidades, seguros y reservas.

El hallazgo más importante del análisis de sensibilidad es que la tasa de interés domina todo. Para un seguro de vida entera a los 40 años, mover la tasa técnica de 2% a 8% produce un spread de 101% en la prima neta (\$17,910 vs \$7,014). Los shocks de mortalidad son importantes pero asimétricos: un incremento de 30% en $q_x$ genera +16.2% en prima, pero una reducción de 30% genera -18.2%.

Esta asimetría se llama convexidad: la prima reacciona con más fuerza a una mejora en mortalidad que a un deterioro del mismo tamaño. Los seguros temporales son los más proporcionales a mortalidad, casi lineales. Las dotales son las menos sensibles: el componente de ahorro domina y absorbe los shocks demográficos.

## Requerimientos de capital bajo LISF

El marco de Solvencia II, adaptado en México a través de la LISF y la CUSF, requiere que las aseguradoras mantengan capital suficiente para absorber pérdidas con probabilidad del 99.5% a un año. SIMA implementa cuatro módulos de riesgo del SCR para vida, tomando como referencia la fórmula estándar de Solvencia II: mortalidad (+15% shock a $q_x$), longevidad (-20% shock a $q_x$), tasa de interés ($\pm$100 bps como primera aproximación a un shock de curva), y catástrofe (spike de +35% calibrado con datos COVID como proxy del módulo pandemia). La identidad clave que simplifica todo es que el BEL (Best Estimate of Liabilities) es la reserva prospectiva. No hay matemáticas nuevas: $\text{BEL} = SA \cdot A_{x+t} - P \cdot \ddot{a}_{x+t}$ para productos de muerte, y $\text{BEL} = \text{pension} \cdot \ddot{a}_x$ para rentas vitalicias. La maquinaria de funciones de conmutación que ya construiste para pricing sirve idénticamente para Solvencia II.

Los resultados del portafolio de prueba revelan la estructura del riesgo de una cartera de vida. El riesgo de tasa de interés representa el 79.7% del SCR total porque afecta simultáneamente a todos los productos. El riesgo de longevidad es segundo (44.4% antes de diversificación) porque las rentas vitalicias dominan el BEL: \$4.27M de \$5.16M total (83%). El riesgo de mortalidad es sorprendentemente pequeño (4.2%) porque los productos de muerte representan poca reserva relativa. El riesgo de catástrofe es el menor (2.4%). La diversificación reduce el SCR en 14.4%, gracias a la correlación negativa entre mortalidad y longevidad ($\rho = -0.25$): un evento que incrementa las muertes reduce simultáneamente las obligaciones de rentas vitalicias.

## Decisiones de ingeniería

El backend son 12 módulos Python con una cadena de dependencias progresiva: `a01_life_table` no depende de nada, `a02_commutation` depende de `a01`, y así hasta `a12_scr` que integra todo. Cada módulo expone una interfaz limpia, y los tests verifican propiedades actuariales formales: la identidad fundamental $A_x + d \cdot \ddot{a}_x = 1$ confirma que los valores actuariales son internamente consistentes, y la convergencia de $l_x$ a cero confirma que la tabla de vida es demográficamente válida. Son 240 tests en total, incluyendo 33 de integración que verifican los endpoints de la API.

El pipeline es sex-diferenciado: masculino, femenino y unisex. Los datos del HMD (Human Mortality Database) no se pueden redistribuir bajo su licencia CC BY 4.0, así que los tests de CI usan datos mock generados con Gompertz-Makeham: $\mu(x) = A + B \cdot c^x$, calibrado para reproducir el patrón biológico de mortalidad mexicana incluyendo el spike infantil y la joroba de adultos jóvenes.
## Lo que me enseñó este proyecto

Tres lecciones técnicas que no esperaba. Primera: las restricciones de identificabilidad del SVD en Lee-Carter son justamente lo que da interpretación demográfica a los parámetros. Sin la restricción $\sum b_x = 1$, $b_x$ y $k_t$ están definidos salvo una constante multiplicativa arbitraria, y pierdes la capacidad de comparar sensibilidades entre edades. Segunda: la identidad fundamental $A_x + d \cdot \ddot{a}_x = 1$ dice algo concreto: un peso recibido hoy se puede descomponer exactamente en un seguro de vida (pago contingente al fallecimiento) más una anualidad vitalicia (pagos contingentes a la supervivencia). Si tus funciones de conmutación no satisfacen esta identidad con precisión numérica, hay un bug. Tercera: el puente entre actuaria empírica y actuaria teórica es el método `to_life_table()`, que convierte tasas centrales $m_x$ proyectadas en probabilidades $q_x = 1 - e^{-m_x}$ y construye $l_x$ a partir de ellas. Ese método de 15 líneas conecta todo el pipeline de Lee-Carter con toda la maquinaria clásica de conmutación. Sin él, tendrías dos mundos que no se hablan.

SIMA es una demostración de que un actuario puede entender y construir cada capa del pipeline regulatorio, desde el dato demográfico crudo hasta el número que aparece en el reporte de solvencia. El código, los tests y la documentación están en <a href="https://github.com/GonorAndres/SIMA" target="_blank" rel="noopener">GitHub</a>, y la aplicación está desplegada en <a href="https://sima.gonor.me" target="_blank" rel="noopener">Google Cloud Run</a>.
