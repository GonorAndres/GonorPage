---
title: "El principio de equivalencia en un video de dos minutos"
description: "Explicar cómo se calcula una prima suele empezar por la fórmula y perder a quien no es actuario. Este video, animado con Remotion y narrado con voz de ElevenLabs, llega a la equivalencia desde el problema: un imprevisto, un fondo común y dos ingredientes, tiempo y probabilidad. Queda una pieza que cualquiera puede ver y un repositorio con el código, el guion y las tomas descartadas."
date: "2026-09-28"
category: "actuaria-para-todos"
lang: "es"
shape: "case-study"
tags: ["Remotion", "ElevenLabs", "Divulgación", "Principio de equivalencia", "Valor presente", "React"]
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Remotion 4 · React · ElevenLabs (eleven_multilingual_v2)"
  estado: "Publicado"
  repositorio: "https://github.com/GonorAndres/principio-equivalencia-video"
  live: "https://youtu.be/tHidN68enIg"
---

<div style="position:relative;padding-bottom:56.25%;height:0;margin:1.75rem 0;">
<iframe src="https://www.youtube-nocookie.com/embed/tHidN68enIg" title="El principio de equivalencia actuarial" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:4px;" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Si le preguntas a alguien cuánto debería costar su seguro, casi nunca responde con una fórmula. Responde con una sensación: que es caro, que no sabe qué paga, que ojalá no lo necesite. La actuaría tiene una respuesta precisa a esa pregunta, el principio de equivalencia, pero suele presentarse al revés: primero la ecuación y después, si queda tiempo, el porqué.

Quise hacer lo contrario en un video corto, y lo hice con código.

## La primera versión explicaba demasiado

El primer intento fueron siete escenas mudas, cuarenta segundos en total: introducción, elementos, ecuación, un ejemplo numérico, la cartera, la prima comercial y un cierre. Estaba bien hecho y era correcto. También era una clase en diapositivas.

El problema no era técnico. La ecuación aparecía antes de que hubiera una razón para que importara, y sin voz el video dependía de que alguien leyera cada letrero con atención. Quien ya sabe actuaría no lo necesita; quien no sabe, se va en la escena tres.

## Primero el guion

La segunda versión se escribió al revés. Antes de animar nada, escribí un guion de ocho bloques que llega a la equivalencia desde el problema humano:

1. Un imprevisto puede ser demasiado para una sola persona.
2. La mutualidad: un fondo común donde cada quien aporta.
3. El seguro: la prima como precio de la protección.
4. La pregunta: ¿cuánto aportar? El valor presente esperado de las primas puras debe igualar al de las prestaciones.
5. El tiempo: mil pesos hoy no valen lo mismo que dentro de diez años.
6. La incertidumbre: no se sabe quién tendrá un siniestro, pero sí se puede medir qué tan probable es.
7. Riesgo y prima: dos estudiantes con la misma cobertura pueden pagar distinto.
8. El cierre: no se trata de controlar el futuro, sino de no enfrentarlo a solas.

La fórmula desaparece de la pantalla. En su lugar queda una balanza: de un lado monedas, del otro un escudo y una casa. El guion completo está en el [repositorio](https://github.com/GonorAndres/principio-equivalencia-video/blob/main/docs/GUION.md), junto con la ecuación que el bloque 4 dice con palabras.

## La voz manda sobre el tiempo

Remotion convierte componentes de React en video: cada frame es una función del número de frame. Eso permite algo que en un editor tradicional es tedioso, que la animación obedezca a la voz y no al revés.

Generé cada bloque como un clip independiente en ElevenLabs. La duración de cada bloque sale de su clip, más una entrada breve y un segundo de cola para la transición. Dentro del bloque, cada movimiento está anclado a la palabra que lo justifica, y los tiempos quedaron anotados en el propio código:

```ts
// Voz desde 0.6 s: "¿cuánto aportar?" 1.2 · "propone un equilibrio" 6.0 · "primas puras" 8.5
// · "prestaciones" 10.6 · "no incluye gastos" 15.5 · "tiempo y probabilidad" 17.8
```

La balanza oscila mientras la voz nombra las primas y las prestaciones, y se nivela justo después.

## La toma que no quedó

El bloque 5, el del tiempo, se generó dos veces. La primera toma terminaba así:

> El valor presente usa una tasa de interés para comparar esos pagos en una misma fecha.

Suena bien, y es impreciso. Para comparar pagos basta cualquier fecha común; el valor presente los lleva a *hoy*, y eso es justo lo que le da nombre. La toma final dice:

> El valor presente usa una tasa de interés para expresar montos de distintas fechas en un valor equivalente hoy, y así poder compararlos.

Son 2.6 segundos más de audio. Con voz sintética rehacer una frase cuesta poco, pero cada corrección mueve la línea de tiempo. Separar la voz por bloques y calcular las duraciones a partir de los clips es lo que hizo que esa corrección tomara minutos y no una tarde. La toma descartada está en el repositorio, en `public/voz/alternativas/`, para quien quiera escuchar la diferencia.

## Lo que haría distinto

- **Marcas de tiempo automáticas.** ElevenLabs puede devolver el momento exacto de cada palabra. Anotarlas a mano funcionó para ocho bloques, pero no escala.
- **Subtítulos.** Mucha gente ve video sin sonido; esas mismas marcas de tiempo darían subtítulos sincronizados.
- **Una versión vertical de un minuto** con los bloques 4, 5 y 6, que son el corazón del argumento.

El video no enseña a calcular una prima, y no lo intenta. Su trabajo es que alguien que nunca ha oído la palabra "equivalencia" entienda por qué su prima no es un número arbitrario: es lo que, en promedio y traído a hoy, cuesta protegerlo. Quien quiera la versión con símbolos puede ver cómo se [tarifan los Gastos Médicos Mayores](/blog/gmm-explorer/) o cómo [SIMA](/blog/sima/) implementa estos cálculos para seguros de vida.
