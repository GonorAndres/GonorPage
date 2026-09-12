---
title: "Variables Aleatorias en el Mundo del Seguro: Deducibles, Límites y la Matemática de Pagar Siniestros"
description: "Guía de estudio para el tema más pesado del Examen P: variables aleatorias, distribuciones y modificaciones de pago. El tema donde los errores mecánicos duelen más que los conceptuales."
date: "2026-02-18"
category: "fundamentos-actuariales"
lang: "es"
shape: "study-guide"
tags: ["variables-aleatorias", "examen-P", "SOA", "seguros", "distribuciones"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/soa-random-variables-insurance.webp"
heroAlt: "La curva de pago permanece en cero, crece después del deducible y se aplana al alcanzar el límite de cobertura."
heroCaption: "El deducible, el coaseguro y el límite transforman el monto del siniestro en el pago de la aseguradora."
---

De los tres temas del Examen P, este es el más denso. Variables aleatorias son el pan de cada día de la actuaría: distribuciones, valores esperados, funciones generadoras de momentos. Lo que cambia es el ángulo: la SOA no pregunta si sabes integrar una PDF, pregunta si puedes pensar en términos de póliza, deducible y pérdida.

Lo complicado de esta sección no es conceptual. Es mecánico. La parte tramposa es elegir el enfoque correcto: condicionar o ir directo, usar la CDF o una transformación, la integral de supervivencia o la fórmula cerrada. Y después están los errores de ejecución: meter un número mal en la calculadora, olvidar usar el complemento, confundir parámetros entre distribuciones. Pierdes puntos no porque no entiendas, sino porque te equivocas en el paso 4 de 7.

Este post cubre lo que la SOA evalúa en variables aleatorias univariadas, cerca del 45% del peso del examen. No es un formulario. Es una guía de cómo se conectan las piezas y por qué importan en seguros.

## Qué es una variable aleatoria, realmente

En la universidad, la definición formal es elegante y abstracta: una variable aleatoria X es una función medible del espacio muestral a los números reales. En seguros, esa abstracción adquiere carne y hueso. X es una pérdida. Un siniestro de auto, una reclamación médica, el monto de un incendio, el costo de una demanda de responsabilidad civil. Cada póliza genera una variable aleatoria cuyo comportamiento necesitamos entender antes de que el siniestro ocurra.

Lo interesante es que la misma variable aleatoria responde preguntas distintas dependiendo de cómo la interrogues. La función de distribución acumulada F(x) = P(X <= x) contesta "¿cuál es la probabilidad de que la pérdida sea a lo mucho x?", una pregunta útil para quien está comprando la póliza y quiere saber qué tan probable es que su siniestro caiga dentro de cierto rango. La función de supervivencia S(x) = 1 - F(x) contesta "¿cuál es la probabilidad de que la pérdida exceda x?", y esta es la pregunta que le quita el sueño al reasegurador, porque él asume la cola de la distribución, la parte donde las pérdidas son enormes e infrecuentes. La tasa de riesgo h(x) = f(x)/S(x) contesta "dado que hemos llegado a x sin que ocurra el evento, ¿cuál es el riesgo instantáneo de que ocurra ahora?"; en seguros de vida es exactamente la fuerza de mortalidad, el concepto central de toda tabla de vida que usa la CNSF para regular reservas.

Tres preguntas operativas, una sola variable aleatoria, tres funciones matemáticas que la describen. El Examen P espera que manejes las tres con fluidez, y con razón: un actuario que solo conoce la CDF está viendo un tercio del panorama.

## El zoológico de distribuciones

El temario del Examen P incluye una docena de distribuciones con nombre. La tentación es memorizarlas como un catálogo de fórmulas: media aquí, varianza allá, MGF por acá. Pero cada distribución existe porque modela algo específico, y entender ese *por qué* hace innecesaria buena parte de la memorización.

Además, la selección es sorprendentemente compacta. Navaja de Occam: unas cuantas distribuciones univariadas bien entendidas cubren una cantidad enorme de fenómenos porque se interconectan entre sí. La exponencial y la Poisson son dos caras de la misma moneda. La lognormal es una normal transformada. La gamma generaliza la exponencial. No necesitas un zoológico infinito; necesitas entender las relaciones.

La exponencial aparece por su propiedad de falta de memoria: P(X > s + t | X > s) = P(X > t). Si llevas 3 meses sin siniestro, la probabilidad de que pasen otros 3 meses sin siniestro es exactamente la misma que al inicio. Contraintuitivo, pero es lo que significa "llegada al azar": sin patrón, sin tendencia, sin acumulación de riesgo. La única distribución continua con esta propiedad.

La Poisson cuenta eventos en intervalos fijos. No modela el *cuándo* sino el *cuántos*: cuántas reclamaciones al mes, cuántos incendios al año. Si los siniestros individuales llegan exponencialmente, el conteo en un período fijo es Poisson. La conexión entre ambas aparece constantemente en el examen.

La Pareto es la razón matemática de que exista el reaseguro. Colas pesadas: una fracción pequeña de siniestros concentra una proporción enorme del costo total. La regla 80/20 no es un cliché; es una propiedad de distribuciones de cola pesada. Cuando un portafolio tiene pérdidas Pareto, la aseguradora directa no puede absorber la cola sin comprometer su solvencia, así que cede ese riesgo a un reasegurador. La decisión de dónde cortar (el punto de retención) es un cálculo directo sobre la función de supervivencia.

La lognormal aparece porque el logaritmo de muchos costos reales se comporta de forma aproximadamente normal. Costos médicos, daños a propiedad, responsabilidad civil. Tiene sentido: los costos se multiplican por factores (inflación, severidad, complejidad), y la suma de factores multiplicativos en escala log se vuelve normal por el TCL. Sesgada a la derecha, siempre positiva, con cola más pesada que la normal pero más ligera que la Pareto; un punto intermedio para siniestros "normales" que no llegan a ser catastróficos.

La normal, por cierto, casi nunca modela pérdidas directamente. Las pérdidas son positivas, sesgadas, con colas pesadas: todo lo contrario de una simétrica que va de menos infinito a más infinito. La normal entra por la puerta trasera del Teorema Central del Límite: la suma de muchas pérdidas independientes se comporta aproximadamente normal sin importar la distribución individual. Eso es tema del tercer bloque del examen.

## Modificaciones de pago: donde el Examen P se vuelve actuarial

Hasta aquí, todo lo anterior se ve en la universidad. Variables aleatorias, distribuciones con nombre, funciones de distribución, valores esperados. Lo que sigue es el territorio que separa al Examen P de un examen universitario: las modificaciones de pago por póliza.

Definir un deducible analíticamente, derivar la integral de supervivencia, y entender por qué E[(X - d)+] tiene esa forma marca la diferencia entre aplicar fórmulas mecánicamente y saber cuándo abandonarlas cuando el escenario cambia. Es la diferencia entre "sé cómo calcularlo" y "sé por qué funciona así."

En el mundo real, la aseguradora casi nunca paga X, es decir, la pérdida completa. Paga una función de X que depende de la estructura de la póliza: deducible, límite, coaseguro.

La idea central es que la aseguradora casi nunca paga el siniestro completo. Con un deducible ordinario, el asegurado absorbe los primeros pesos y la aseguradora solo paga lo que excede ese umbral. Con un deducible franquicia es al revés: si el siniestro no llega al umbral no se paga nada, pero si lo cruza, la aseguradora cubre todo, incluyendo lo que está por debajo. La franquicia es más cara por eso mismo. Y encima de cualquiera de los dos puedes poner un límite (un techo máximo por siniestro) y un coaseguro (la aseguradora paga solo un porcentaje del exceso, digamos 80%, y el asegurado retiene el resto). Todo esto se combina en una sola fórmula que el Examen P espera que manejes con fluidez, y la herramienta matemática que la sostiene es la integral de la función de supervivencia. Es probablemente la fórmula más importante del examen en términos prácticos.

Después está el Loss Elimination Ratio, que mide qué tan agresivo es un deducible. Si un deducible absorbe el 40% del valor esperado de las pérdidas, significa que la aseguradora está filtrando una buena porción de siniestros pequeños antes de que le cuesten. Eso es eficiente desde el lado del negocio, pero desde el lado regulatorio puede ser un problema: la CNSF, siguiendo los lineamientos de la LISF, cuestiona pólizas donde el deducible absorbe demasiado, porque en ese punto la póliza transfiere tan poco riesgo que apenas funciona como seguro.

Y luego está la inflación, que es donde todo se pone interesante. Si los costos de siniestros suben pero el deducible se queda fijo, el pago esperado de la aseguradora crece más que proporcionalmente. Una inflación del 20% en siniestros puede producir un aumento cercano al 30% en lo que la aseguradora paga, porque el deducible fijo se va haciendo relativamente más chico contra pérdidas más grandes. Esto es lo que obliga a los actuarios de pricing a revisar tarifas cada año, y es la razón por la que la inflación de costos médicos es una de las variables más vigiladas en seguros de gastos mayores.

## El salto entre la universidad y el SOA-P

En la carrera, la distribución es el fin del ejercicio: integrar la PDF, calcular la varianza, obtener la MGF. En el Examen P, la distribución es el punto de partida. Lo que importa es qué hagas con ella: aplicar un deducible, ajustar por inflación, calcular el LER, y producir un número que tenga sentido como prima. Las herramientas son las mismas, pero la dirección del pensamiento cambia completamente.

Lo que también cambia es la estructura de las preguntas. La SOA no varía mucho el formato; una vez que reconoces el patrón, la varianza entre preguntas es baja. Pero lo que sí evalúa es la interrelación de conceptos: una pregunta puede combinar una Pareto con un deducible, inflación y coaseguro en el mismo problema. No basta saber cada pieza aislada.

La misma lógica aparece en el [GMM Explorer](https://gmm.gonor.me/contexto), que es uno de mis proyectos de la materia de administración de riesgos, donde el problema es exactamente este: tienes datos de siniestros y necesitas decidir qué mezcla de distribuciones los describe mejor para poder tarificar. También en el [modelo de riesgo crediticio con GLM](https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/Credit_Risk_Model), que comparte la estructura fundamental: una variable aleatoria, una distribución, y una función que transforma probabilidad en decisión operativa.

## Material de estudio

- <a href="https://drive.google.com/file/d/1YRa658huJEPi_X1GUXaZPMJI5zaNKy7p/view" target="_blank" rel="noopener">SOA Exam P: Referencia completa de estudio (v2)</a>: Referencia extensa que cubre los tres temas del examen con cientos de problemas resueltos, explicaciones e intuiciones.
- <a href="https://drive.google.com/file/d/19CMJeh0T0nQBHCdcLc4OToks4e-McaHj/view" target="_blank" rel="noopener">Guía Exponencial y Gamma</a>: Referencia rápida de las distribuciones exponencial y gamma: fórmulas, propiedad de falta de memoria, truco de la integral gamma, y conexiones entre distribuciones.
