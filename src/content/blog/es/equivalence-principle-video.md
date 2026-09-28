---
title: "El principio de equivalencia en un video de dos minutos"
description: "Explicar cómo se calcula una prima con una fórmula puede ser difícil de seguir. Hice un video de dos minutos que parte de un imprevisto y un fondo común, y llega al tiempo y la probabilidad como base del costo del seguro. Lo armé en unas dos horas y media con un agente de código, Remotion y voz sintética de ElevenLabs, sin grabar nada."
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

Quise explicar en un video corto cómo se decide cuánto cobrar por un seguro. Elegí el principio de equivalencia y empecé por una situación sencilla: una persona enfrenta un imprevisto y un fondo común ayuda a cubrirlo. Hice la animación con código.

## Un par de horas, sin grabar nada

El video completo salió de una sola sesión de unas dos horas y media, desde la primera voz generada hasta el render final. No grabé mi voz, no usé cámara y no abrí un editor de video.

Trabajé en conversación con un agente de código. Yo escribía el guion y describía qué debía verse en cada momento. El agente lo convertía en componentes de Remotion y renderizaba. Yo revisaba el resultado y pedía cambios. La voz la generé en ElevenLabs a partir del texto del guion. Cuando una idea no funcionaba, como la primera versión, la pedía otra vez con otro enfoque.

Así mi tiempo se fue en la parte que conozco: decidir qué explicar, en qué orden, y revisar que cada frase fuera correcta. La corrección del bloque 5, que cuento más abajo, salió de esa revisión.

## La primera versión

Mi primer intento tenía siete escenas mudas y duraba cuarenta segundos en total. Incluía una introducción, los elementos del seguro, la ecuación, un ejemplo numérico, la cartera, la prima comercial y un cierre.

Había metido demasiada información. Mostraba la ecuación antes de explicar para qué servía. Como el video era mudo, había que leer cada letrero para seguirlo.

## Primero escribí el guion

Para la segunda versión, escribí el guion antes de animar. Lo dividí en ocho bloques:

1. Un imprevisto puede ser demasiado para una sola persona.
2. La mutualidad: un fondo común donde cada quien aporta.
3. El seguro: la prima como precio de la protección.
4. ¿Cuánto aportar? El valor presente esperado de las primas puras debe igualar al de las prestaciones.
5. El tiempo: el valor de mil pesos cambia según se reciban hoy o dentro de diez años.
6. La incertidumbre: podemos medir la probabilidad de un siniestro, aunque ignoremos quién lo tendrá.
7. Riesgo y prima: dos estudiantes con la misma cobertura pueden pagar distinto.
8. El cierre, con esta frase del video: «no se trata de controlar el futuro, sino de no enfrentarlo a solas».

Usé una balanza para representar la fórmula. Puse monedas de un lado y un escudo con una casa del otro. Dejé el guion completo en el [repositorio](https://github.com/GonorAndres/principio-equivalencia-video/blob/main/docs/GUION.md), junto con la ecuación que explico con palabras en el bloque 4.

## Ajusté la animación a la voz

Remotion convierte componentes de React en video. En el código puedo definir qué aparece en cada fotograma según su número. Así ajusté los movimientos al momento en que se escucha cada frase.

Generé un clip de voz en ElevenLabs por cada bloque. Calculé la duración de cada bloque sumando la del clip, una entrada breve y un segundo de cola para la transición. Anoté en el código cuándo se escuchaba cada palabra que acompañaba un movimiento:

```ts
// Voz desde 0.6 s: "¿cuánto aportar?" 1.2 · "propone un equilibrio" 6.0 · "primas puras" 8.5
// · "prestaciones" 10.6 · "no incluye gastos" 15.5 · "tiempo y probabilidad" 17.8
```

La balanza se mueve mientras la voz menciona las primas y las prestaciones. Justo después queda nivelada.

## Corregí una frase del bloque 5

Generé dos tomas del bloque sobre el tiempo. La primera terminaba así:

> El valor presente usa una tasa de interés para comparar esos pagos en una misma fecha.

Al revisarla, vi que faltaba precisar la fecha. Podemos comparar pagos llevándolos a una fecha común. Cuando hablamos de valor presente, esa fecha es *hoy*. Cambié la frase y la toma final dice:

> El valor presente usa una tasa de interés para expresar montos de distintas fechas en un valor equivalente hoy, y así poder compararlos.

La nueva toma tiene 2.6 segundos más de audio. Ese cambio también alargó el bloque. Como ya calculaba las duraciones a partir de cada clip, pude hacer el ajuste en minutos. Guardé la toma descartada en `public/voz/alternativas/`, dentro del repositorio, para que se pueda escuchar la diferencia.

## Lo que haría después

- **Automatizar las marcas de tiempo.** Anoté a mano cuándo se escuchaba cada palabra. Para un video más largo usaría las marcas que puede devolver ElevenLabs.
- **Añadir subtítulos.** Usaría esas marcas para sincronizarlos y permitir que el video se siga sin sonido.
- **Hacer una versión vertical de un minuto.** Usaría los bloques 4, 5 y 6, donde explico la equivalencia, el tiempo y la probabilidad.

Dejé el video como una introducción a la prima pura: el costo esperado de la protección, expresado en valor de hoy. El cálculo completo queda para los proyectos donde aplico esa idea. En ellos muestro cómo se [tarifan los Gastos Médicos Mayores](/blog/gmm-explorer/) y cómo [SIMA](/blog/sima/) hace estos cálculos para seguros de vida.
