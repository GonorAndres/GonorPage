---
title: "Por Qué Funciona el Seguro: El Teorema Central del Límite y la Magia de Agregar Riesgos"
description: "Guía de estudio para el tercer tema del Examen P: variables multivariadas, la Ley de Eve y el TCL. Los conceptos que explican por qué el seguro funciona como negocio."
date: "2026-02-18"
category: "fundamentos-actuariales"
lang: "es"
shape: "study-guide"
tags: ["TCL", "examen-P", "SOA", "agregacion", "riesgo"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/soa-multivariate-clt.webp"
heroAlt: "Una cartera pequeña se compara con otra mayor; la distribución de pérdida media es más estrecha en la segunda."
heroCaption: "Con riesgos independientes y varianza finita, una cartera mayor reduce la variabilidad de la pérdida media por póliza."
---

De los tres temas del Examen P, este es el que conecta más directamente con la operación de una aseguradora. Variables multivariadas y el TCL no son conceptos fáciles, pero la SOA mantiene la evaluación dentro de límites razonables. La mayoría de los problemas involucran variables normales o discretas contables, y los patrones se repiten lo suficiente para que la práctica deliberada rinda dividendos rápidos.

Este post cubre las tres piezas que la SOA evalúa en este bloque: covarianza y dependencia, la Ley de Eve para descomponer variabilidad, y el Teorema Central del Límite como justificación matemática de que el seguro funcione.

## Cuando las variables viajan juntas

Imagina que aseguras tanto la casa como el auto de un mismo cliente. Si ese cliente conduce ebrio y choca, es posible que ese mismo cliente tenga más riesgo de un incendio en su casa: las imprudencias se correlacionan con las imprudencias. Las pérdidas del auto y las de la vivienda no son independientes: comparten un factor común (el comportamiento del asegurado), y eso crea una correlación positiva entre ellas. Ignorar esa dependencia tiene consecuencias directas sobre la solvencia.

La fórmula que lo captura es la varianza de una suma: Var(X + Y) = Var(X) + Var(Y) + 2Cov(X,Y). Ese término 2Cov(X,Y) es la alarma matemática. Cuando la covarianza es positiva, es decir, cuando las pérdidas tienden a moverse juntas, la varianza total del portafolio es MAYOR que la suma de las varianzas individuales. La aseguradora que calcula reservas asumiendo independencia entre líneas de negocio está subestimando la variabilidad de su portafolio, y subestimar variabilidad en seguros es subestimar la probabilidad de ruina.

La correlación normaliza la covarianza para hacerla comparable: Corr(X,Y) = Cov(X,Y) / (SD(X) * SD(Y)), un número entre -1 y 1 que mide la fuerza de la relación lineal. Un detalle que el Examen P martilla una y otra vez: covarianza cero NO implica independencia. Dos variables pueden tener covarianza cero y seguir teniendo una relación no lineal fuerte. La covarianza solo captura lo lineal, y asumir que captura todo es otro camino hacia la subestimación del riesgo.

No es un punto académico. La crisis de 2008 fue exactamente eso: modelos que asumían correlaciones bajas entre activos que, en estrés, se movieron juntos. En seguros, una temporada de lluvias extremas en Michoacán puede disparar simultáneamente reclamaciones de vivienda, autos y responsabilidad civil, todas correlacionadas por el mismo evento climático.

## La Ley de Eve

Supongamos que la aseguradora ya entendió que no puede ignorar las dependencias. Ahora tiene otro problema: su portafolio no es homogéneo. Tiene conductores jóvenes de 18 a 25 años (alta frecuencia de siniestros, montos variables) y conductores experimentados de 40 a 60 (baja frecuencia, montos más predecibles). Si mete a todos en el mismo saco y calcula una sola prima promedio, ¿qué pasa con la variabilidad total?

La Ley de la Varianza Total, conocida como la Ley de Eve, da la respuesta exacta:

Var(X) = E[Var(X|Y)] + Var(E[X|Y])

En español: la varianza total se descompone en dos piezas. La primera, E[Var(X|Y)], es el promedio de la varianza dentro de cada grupo, la aleatoriedad irreductible que existe incluso dentro de una clase de riesgo perfectamente definida. La segunda, Var(E[X|Y]), es la varianza de las medias entre grupos: la prima de heterogeneidad.

Veamos el ejemplo concreto. Supongamos que los conductores jóvenes tienen un costo esperado de siniestro E[X|joven] = 15,000 pesos con Var(X|joven) = 90,000,000, mientras que los experimentados tienen E[X|experimentado] = 4,000 pesos con Var(X|experimentado) = 10,000,000. Si el portafolio tiene 40% jóvenes y 60% experimentados, la Ley de Eve descompone así:

E[Var(X|grupo)] = 0.40 * 90,000,000 + 0.60 * 10,000,000 = 42,000,000. Esta es la varianza que existiría incluso con la clasificación perfecta, el ruido dentro de cada grupo.

Var(E[X|grupo]): la media condicional E[X|grupo] toma el valor 15,000 con probabilidad 0.40 y 4,000 con probabilidad 0.60. Su esperanza es 0.40 * 15,000 + 0.60 * 4,000 = 8,400. Entonces Var(E[X|grupo]) = 0.40 * (15,000 - 8,400)^2 + 0.60 * (4,000 - 8,400)^2 = 0.40 * 43,560,000 + 0.60 * 19,360,000 = 17,424,000 + 11,616,000 = 29,040,000.

Varianza total: 42,000,000 + 29,040,000 = 71,040,000. Casi el 41% de la varianza total viene de la heterogeneidad entre grupos, no de la aleatoriedad dentro de ellos. Eso es enorme. Y ese 41% es exactamente lo que se REDUCE cuando segmentas el portafolio y cobras primas diferenciadas.

La aplicación es directa. En México, la Circular Única de Seguros y Fianzas de la CNSF exige que las aseguradoras clasifiquen riesgos y calculen reservas por segmentos. La Ley de Eve es la justificación matemática de ese requisito regulatorio: sin segmentación, la incertidumbre del portafolio se infla por la heterogeneidad no reconocida, y las reservas calculadas sobre esa varianza inflada son o insuficientes (si se ignora el efecto) o ineficientemente altas (si se compensan con margen bruto).

## El Teorema Central del Límite

Ahora estamos listos para la pieza central. Sea S = X1 + X2 + ... + Xn la suma de las pérdidas de n asegurados independientes e idénticamente distribuidos, cada uno con media mu y varianza sigma^2. El Teorema Central del Límite dice: conforme n crece, la suma estandarizada (S - n*mu) / (sigma * sqrt(n)) converge en distribución a una normal estándar N(0,1), sin importar qué forma tenga la distribución de cada Xi individual. En la práctica, esto significa que para n suficientemente grande podemos tratar S como aproximadamente Normal(n*mu, n*sigma^2).

La media de S crece linealmente: E[S] = n * mu. Pero la desviación estándar crece solo como la raíz cuadrada: SD(S) = sigma * sqrt(n). El cociente entre la desviación estándar y la media, el coeficiente de variación que mide la incertidumbre relativa, es CV(S) = sigma / (mu * sqrt(n)). Ese coeficiente se encoge como 1/sqrt(n).

Aquí está la razón por la que el seguro funciona económicamente. Con 100 asegurados, la incertidumbre relativa es proporcional a 1/sqrt(100) = 1/10. Con 10,000 asegurados, baja a 1/sqrt(10,000) = 1/100. Diez veces menos incertidumbre relativa. En términos prácticos: un portafolio de 10,000 pólizas necesita proporcionalmente menos capital de reserva que uno de 100 pólizas para mantener la misma probabilidad de ruina. La prima por unidad de riesgo puede ser menor porque la incertidumbre se diluye con el tamaño.

Ese es el efecto de la Ley de los Grandes Números en acción, y el TCL le pone forma: nos dice no solo que la media converge, sino que la distribución del total se vuelve normal, lo cual permite calcular probabilidades exactas. Una aseguradora con n = 200 pólizas independientes, cada una con pérdida esperada de 800 pesos y varianza de 250,000, puede decir: el total de pérdidas S tiene media 160,000 y desviación estándar sqrt(200 * 250,000) = 7,071. Si quiere que la probabilidad de que las pérdidas excedan la prima sea como máximo 5%, necesita cobrar una prima de 160,000 + 1.645 * 7,071 = 171,632 pesos. Eso es el principio de prima por desviación estándar, y sale directamente del TCL aplicado al percentil 95 de la normal.

Sin el TCL, no podrías hacer ese cálculo. Necesitarías conocer la distribución exacta de cada Xi y convolucionar 200 distribuciones, lo cual es computacionalmente intratable para la mayoría de las distribuciones reales. El TCL es el atajo que convierte un problema imposible en una consulta a la tabla normal.

Hay una sutileza importante. El TCL requiere independencia (o al menos dependencia débil) y varianza finita. Cuando esas condiciones fallan, cuando las pérdidas están fuertemente correlacionadas (como en eventos catastróficos) o cuando la distribución tiene varianza infinita (como en ciertos modelos Pareto de cola pesada), el TCL se rompe, y la reconfortante normalidad del agregado desaparece. Esos son precisamente los escenarios donde las aseguradoras se meten en problemas.

Nassim Taleb martilla este punto en *El Cisne Negro*: nuestros modelos nos seducen a creer que la distribución normal gobierna todo, y dejamos de buscar las colas gruesas que pueden quebrarnos. Leer ese libro cambió cómo pienso sobre la probabilidad: no como la respuesta final al riesgo, sino como una herramienta cuyo poder es inseparable de sus supuestos. El TCL es extraordinariamente útil *dentro de su dominio*, pero tratarlo como ley universal es exactamente el tipo de sobreconfianza epistémica contra la que Taleb advierte. Para un estudiante de actuaría, la lección es concreta: saber cuándo se cumplen los supuestos de tu modelo, y tener un plan para cuando no.

## Para cerrar

La sección menos glamorosa del Examen P es la que cierra el argumento. Sin el TCL, agregar riesgos no reduciría la incertidumbre relativa y el seguro sería una apuesta, no un modelo de negocio. Sin la Ley de Eve, no podrías justificar la segmentación de riesgo. Sin entender covarianza, subestimarías la variabilidad de tu portafolio.

En términos de preparación, mi enfoque es directo: practicar los casos borde, manejar las tablas numéricas sin tropezar, y memorizar las parametrizaciones explícitas que tienden a confundirse (la lognormal es la clásica trampa). No es la sección que define si apruebas o repruebas, pero perder puntos aquí por errores mecánicos sería frustrante. Hay que mover el lápiz.

La misma lógica de agregación aparece en la [simulación Monte Carlo para poker](https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/TexasPokerCaseStudy) (miles de manos simuladas, precisión creciente con n) y en la [optimización Markowitz](https://drive.google.com/drive/folders/1Dz54zcTpa9quMFCkgddBN5GWQfy6CIXv), donde diversificar funciona porque combinar activos con correlación imperfecta reduce la varianza total.

## Material de estudio

- <a href="https://drive.google.com/file/d/1YRa658huJEPi_X1GUXaZPMJI5zaNKy7p/view" target="_blank" rel="noopener">SOA Exam P: Referencia completa de estudio (v2)</a>: Referencia extensa que cubre los tres temas del examen con cientos de problemas resueltos, explicaciones técnicas e intuiciones.
- <a href="https://drive.google.com/file/d/1I3buEoYKAmP_CyMkUgCUfgOI4oBfNFuZ/view" target="_blank" rel="noopener">Ley de Eve y Varianza Total</a>: Documento puente que cubre la Ley de Adam, la Ley de Eve, distribuciones mixtas (Poisson-Gamma, exponencial mixta) y distribuciones compuestas con problemas resueltos de la SOA.
- <a href="https://drive.google.com/file/d/1YY7AaCjgX1DoAEFAk6lAAEXsPxJKYpc1/view" target="_blank" rel="noopener">Aproximación Normal a Distribuciones Discretas</a>: TCL aplicado, protocolo de estandarización, corrección de continuidad, trampas comunes del examen y problemas de práctica.
- <a href="https://drive.google.com/file/d/1fpBmKWUMb5qj1Y_8Xt-Qp3Tfzk8ek5xH/view" target="_blank" rel="noopener">Estadísticos de Orden</a>: Tratamiento completo desde primeros principios: CDF, PDF, conexión con la uniforme, espaciamientos, densidad conjunta y problemas de práctica.
- <a href="https://drive.google.com/file/d/1V8KvVg1MzW3y-YfpY_XDlNgKniPws_3_/view" target="_blank" rel="noopener">Formas Bilineales y Varianza</a>: La estructura algebraica de la covarianza como forma bilineal, la varianza como forma cuadrática, y la conexión con espacios de producto interior.
