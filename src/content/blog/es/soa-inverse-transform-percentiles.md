---
title: "Transformar una Variable Aleatoria No Cambia la Probabilidad: El Truco de la Función Inversa"
description: "Cuando una póliza modifica el pago según la pérdida, lo que tienes es una variable aleatoria transformada. Calcular sus percentiles no requiere derivar una nueva distribución desde cero — solo requiere invertir la transformación y usar la CDF que ya tienes."
date: "2026-03-05"
category: "fundamentos-actuariales"
lang: "es"
shape: "study-guide"
tags: ["transformaciones", "percentiles", "examen-P", "SOA", "seguros", "CDF"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/soa-inverse-transform-percentiles.webp"
heroAlt: "Los mismos puntos ordenados aparecen en dos escalas; la transformación comprime sus valores y conserva el grupo bajo el percentil."
heroCaption: "Una transformación creciente cambia los valores del percentil y conserva el conjunto de escenarios que queda por debajo."
---

Cuando estudias distribuciones por primera vez, el ejercicio estándar es: te dan una distribución, calculas su media, su varianza, su CDF. Pero el Examen P tiene otra pregunta favorita que al principio incomoda: te dan una variable aleatoria X, te dicen que Y = g(X) para alguna función g, y te piden el percentil 90 de Y.

La reacción instintiva es buscar la distribución de Y desde cero — derivar su PDF, integrar, establecer la ecuación. Y eso funciona, pero es lento y propenso a errores. Hay un camino más limpio que solo requiere entender una cosa: *transformar la variable no mueve la probabilidad, solo mueve los valores*.

## El caso simple: un deducible ordinario

Imagina una póliza con pérdida X y deducible d. El pago de la aseguradora es:

$$Y = (X - d)_+ = \max(X - d,\ 0)$$

Si la pérdida no supera d, la aseguradora no paga nada. Si la supera, paga el exceso. Esta transformación es monótona no decreciente: a mayor X, mayor o igual Y.

Ahora alguien te pregunta: ¿cuál es el percentil 80 de Y? Es decir, ¿qué valor y cumple P(Y ≤ y) = 0.80?

La idea clave es que el evento {Y ≤ y} y el evento {X ≤ algo} son exactamente el mismo evento — solo descritos en unidades distintas. Si Y = X − d, entonces Y ≤ y si y solo si X ≤ y + d. Por lo tanto:

$$P(Y \leq y) = P(X \leq y + d) = F_X(y + d)$$

Para encontrar el percentil 80 de Y, igualas F_X(y + d) = 0.80 y despejas y. No necesitaste la PDF de Y. No necesitaste integrar nada nuevo. Solo usaste la CDF de X evaluada en un punto que depende de y.

Eso es todo el truco. Formalmente:

$$F_Y(y) = F_X(g^{-1}(y))$$

Donde g^{-1}(y) es la función inversa de la transformación: el valor de x que produce el pago y. Inviertes la transformación, sustituyes en la CDF de X, y obtienes la CDF de Y automáticamente.

## Por qué funciona: la probabilidad no se mueve

La razón de fondo es simple. La función g es monótona, así que el orden se conserva: si x₁ < x₂ entonces g(x₁) ≤ g(x₂). Esto significa que el evento "la pérdida produce un pago menor a y" es exactamente el mismo conjunto de escenarios que "la pérdida es menor a g^{-1}(y)". La probabilidad de ese conjunto no cambia porque lo escribas de una forma o de otra.

En términos de conjuntos: {ω : Y(ω) ≤ y} = {ω : X(ω) ≤ g^{-1}(y)}. Mismos escenarios, misma probabilidad.

La monotonía es el requisito que hace que esto funcione sin cambiar la dirección de la desigualdad. Todas las transformaciones estándar de seguros la cumplen: multiplicar por una constante positiva (coaseguro α·X), desplazar (X − d), tomar mínimos (min(X, u)), o combinar todo eso en una función por tramos. A mayor pérdida, mayor o igual pago — nunca al revés.

## El caso con estructura por tramos

El problema donde este truco brilla más es cuando la póliza tiene una estructura diferente en distintos rangos de pérdida. Supongamos que la pérdida X tiene distribución exponencial con F(x) = 1 − e^{−x/4}, y la póliza paga así:

- Si la pérdida no supera 10: la aseguradora reembolsa el 100% de la pérdida — es decir, Y = X
- Si la pérdida supera 10: la aseguradora reembolsa el 100% de los primeros 10, más el 50% de lo que exceda 10

Esto define Y como función por tramos:

$$Y = \begin{cases} X & 0 < X \leq 10 \\ 10 + \dfrac{X - 10}{2} & X > 10 \end{cases}$$

¿Cuál es el percentil 90 de Y?

- (A) 5.6
- (B) 7.2
- (C) 8.0
- (D) 9.2
- (E) 10.0

**Paso 1 — Identificar en qué tramo vive el percentil.**

Necesito saber si P(Y ≤ 10) es mayor o menor que 0.90. Como en el primer tramo Y = X, esto es lo mismo que P(X ≤ 10):

$$F(10) = 1 - e^{-10/4} = 1 - e^{-2.5} \approx 0.9179$$

El percentil 90 cumple que el 90% de la masa está por debajo de él. Como F(10) = 0.9179 > 0.90, la cota de 10 ya acumula más del 90% — así que el percentil 90 de Y vive en el primer tramo, donde Y = X directamente.

En el primer tramo la transformación es la identidad: g(x) = x, g^{-1}(y) = y. Entonces F_Y(y) = F_X(y) y el percentil 90 de Y es simplemente el percentil 90 de X:

$$F(x) = 0.90 \implies 1 - e^{-x/4} = 0.90 \implies e^{-x/4} = 0.10 \implies x = -4\ln(0.10) \approx 9.21$$

**El percentil 90 de Y es 9.21.** La respuesta es (D).

---

Ahora supongamos que la pregunta fuera por el percentil 95. El proceso es idéntico, pero ahora la clasificación cambia.

**Paso 1 — Verificar el tramo.** F(10) = 0.9179 < 0.95, así que el percentil 95 vive en el segundo tramo.

**Paso 2 — Invertir la transformación del segundo tramo.** En ese tramo, y = 10 + (x − 10)/2. Despejando x:

$$y - 10 = \frac{x - 10}{2} \implies x = 2(y - 10) + 10 = 2y - 10$$

**Paso 3 — Sustituir en la CDF de X e igualar a 0.95.**

$$F_X(2y - 10) = 0.95$$
$$1 - e^{-(2y-10)/4} = 0.95$$
$$e^{-(2y-10)/4} = 0.05$$
$$-\frac{2y-10}{4} = \ln(0.05)$$
$$2y - 10 = -4\ln(0.05)$$
$$y = 5 - 2\ln(0.05) \approx 5 + 5.99 \approx 10.99$$

**El percentil 95 de Y es aproximadamente 11.0.**

El algoritmo fue siempre el mismo: identificar el tramo, invertir, sustituir, despejar.

## El patrón general

Cada vez que tengas Y = g(X) con g monótona (o monótona por tramos), el algoritmo es:

1. Determinar en qué tramo vive el percentil de interés usando la CDF de X evaluada en los puntos de corte.
2. Invertir la transformación del tramo correspondiente para obtener x en términos de y.
3. Establecer F_X(x(y)) = p y resolver para y.

Esto convierte cualquier problema de percentiles de variables transformadas en un problema de álgebra elemental más una consulta a la CDF de X. La distribución de Y nunca necesita calcularse explícitamente.

## En el Examen P

Este tipo de problema aparece regularmente en el Examen P, especialmente en combinación con distribuciones exponenciales, uniformes y Pareto, donde la CDF tiene forma cerrada simple. La dificultad no está en la transformación algebraica — está en identificar correctamente el tramo antes de invertir, y en no confundirse cuando la transformación incluye coaseguro, deducible y límite simultáneamente.

La señal de alerta que te avisa que necesitas este truco: el enunciado define Y como una función de X con diferentes fórmulas para diferentes rangos de X, y te pide un percentil de Y. En ese momento, lo primero que calculas es la probabilidad acumulada en cada punto de corte. Ese número clasifica el percentil y te dice exactamente qué inversa usar.

Una nota adicional: cuando la transformación tiene tramos *planos* — por ejemplo, un límite de póliza que topa Y en algún valor máximo — la distribución de Y tiene una masa puntual en ese tope. Eso no rompe el método; solo significa que en ese punto la CDF de Y da un salto, y los percentiles en el rango del salto corresponden todos al mismo valor. Es el reflejo matemático de que muchos siniestros terminan exactamente en el límite de la cobertura.

---

## Apéndice: la derivación formal

Sea X una variable aleatoria continua con CDF F_X y sea Y = g(X) donde g es estrictamente monótona creciente. Queremos encontrar F_Y(y) = P(Y ≤ y).

Como g es estrictamente creciente, la desigualdad Y ≤ y es equivalente a g(X) ≤ y, que a su vez es equivalente a X ≤ g^{-1}(y). Por lo tanto:

$$F_Y(y) = P(Y \leq y) = P(g(X) \leq y) = P(X \leq g^{-1}(y)) = F_X(g^{-1}(y))$$

La igualdad P(g(X) ≤ y) = P(X ≤ g^{-1}(y)) es válida precisamente porque g es estrictamente creciente: aplicar g^{-1} a ambos lados de la desigualdad preserva la dirección.

Si g fuera estrictamente decreciente, la desigualdad se invertiría: P(g(X) ≤ y) = P(X ≥ g^{-1}(y)) = 1 − F_X(g^{-1}(y)). En seguros esto casi nunca ocurre porque los pagos siempre crecen con las pérdidas.

Para el caso por tramos, el mismo argumento aplica tramo a tramo. Si g₁ opera sobre (−∞, c] y g₂ sobre (c, ∞), y ambas son monótonas crecientes dentro de su dominio, entonces para y en el rango de g₂:

$$F_Y(y) = P(X \leq c) + P(c < X \leq g_2^{-1}(y)) = F_X(g_2^{-1}(y))$$

La primera igualdad descompone el evento por tramos; la segunda lo colapsa en una sola evaluación de F_X porque ambos tramos apuntan en la misma dirección.
