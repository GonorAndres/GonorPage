---
title: "Cómo hice un video explicativo con un agente de código y voz sintética"
description: "El principio de equivalencia explica cómo se calcula lo que cada persona paga por un seguro, y suele enseñarse con fórmulas. Este video de dos minutos lo explica con imágenes y una narración, y se hizo sin grabar audio ni usar un editor de video: la animación está escrita en código con Remotion, la voz se generó con ElevenLabs a partir del guion y un agente de código escribió la mayor parte del programa. El flujo permite producir material visual de divulgación en pocas horas y corregirlo con facilidad."
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

Este post describe cómo hice un video explicativo de dos minutos sin grabar audio ni usar un programa de edición de video. Trabajé con un agente de código y un servicio que genera voz a partir de texto. La sesión completa, desde la primera voz generada hasta el video final, duró unas dos horas y media.

El tema del video es el principio de equivalencia. Cuando alguien contrata un seguro, paga una cantidad llamada prima, y este principio es la regla que usan los actuarios para calcularla: lo que se espera cobrar en primas debe ser igual a lo que se espera pagar en siniestros (los eventos que cubre el seguro, como un accidente), con ambas cantidades expresadas en dinero de hoy. El video está pensado para personas que no han estudiado actuaría.

## Qué explica el video

El guion tiene ocho partes. Empieza con una situación cotidiana y explica la idea detrás de la fórmula:

1. Un accidente puede costar más de lo que una persona puede pagar sola.
2. Varias personas pueden reunir dinero en un fondo común para cubrirse entre sí. En seguros esto se llama mutualidad.
3. Un seguro funciona así: cada persona paga una prima y la aseguradora paga cuando ocurre un siniestro.
4. La pregunta es cuánto debe aportar cada quien. La respuesta es el principio de equivalencia.
5. El tiempo cuenta: mil pesos de hoy valen más que mil pesos dentro de diez años, porque mientras tanto pueden generar intereses. Llevar un monto futuro a su valor de hoy se llama calcular su valor presente.
6. Con datos se puede estimar qué tan probable es un accidente y cuánto costaría, aunque no se sepa a quién le va a ocurrir.
7. Por eso dos personas con la misma cobertura pueden pagar primas distintas si su riesgo es distinto.
8. Un cierre sobre la utilidad de este principio.

En pantalla, la ecuación está representada por una balanza: en un plato están las primas y en el otro los pagos que promete el seguro. El texto completo de la narración y la fórmula correspondiente están en el [repositorio del proyecto](https://github.com/GonorAndres/principio-equivalencia-video/blob/main/docs/GUION.md).

## Herramientas usadas

### LLM y agente de código

Un LLM (*large language model*, modelo de lenguaje grande) es un programa de inteligencia artificial entrenado con grandes cantidades de texto para entender instrucciones y producir texto, incluido código. Claude y ChatGPT son ejemplos conocidos.

Un agente de código es un LLM con acceso a una computadora: además de escribir código, puede ejecutarlo y revisar el resultado, todo a partir de instrucciones en lenguaje cotidiano. En este proyecto el flujo fue una conversación: yo le describía una escena ("una balanza con monedas de un lado y un escudo del otro, que se equilibra cuando la voz dice *prestaciones*"), el agente escribía el componente de Remotion y generaba el video, y yo revisaba el resultado.

### Remotion: video escrito con código

[Remotion](https://www.remotion.dev) es una biblioteca para crear videos escribiendo código en [React](https://react.dev), una herramienta con la que se construyen muchas páginas web. En un editor de video tradicional, las animaciones se arman arrastrando elementos sobre una línea de tiempo. En Remotion se describe en código qué se ve en cada fotograma, por ejemplo: "la balanza aparece en el segundo 3 y se inclina entre el segundo 7 y el 9". Remotion convierte esa descripción en un archivo de video.

### ElevenLabs: voz generada a partir de texto

[ElevenLabs](https://elevenlabs.io) es un servicio de texto a voz: recibe un texto escrito y devuelve un audio narrado con una voz sintética que suena natural. Para este video usé su modelo multilingüe en español. Para cambiar una frase basta con editar el texto y generar el audio otra vez.

## Proceso de creación paso a paso

### 1. Una primera versión descartada

La primera versión tenía siete escenas sin narración y duraba cuarenta segundos. Mostraba la ecuación desde el principio y un ejemplo numérico, y dependía de que el espectador leyera cada texto en pantalla. La descarté y empecé de nuevo por el guion.

### 2. Guion y voz por partes

Con el guion listo, generé en ElevenLabs un audio por cada una de las ocho partes. Cada parte del video dura lo mismo que su audio, más una breve entrada y un segundo para la transición.

### 3. Animación sincronizada con la voz

Después ajusté cada animación al momento en que la voz dice la palabra correspondiente. Esos tiempos quedaron anotados en el código:

```ts
// Voz desde 0.6 s: "¿cuánto aportar?" 1.2 · "propone un equilibrio" 6.0 · "primas puras" 8.5
// · "prestaciones" 10.6 · "no incluye gastos" 15.5 · "tiempo y probabilidad" 17.8
```

### 4. Revisión del contenido

La revisión del contenido la hice yo, frase por frase. En la parte 5, la primera versión del audio decía:

> El valor presente usa una tasa de interés para comparar esos pagos en una misma fecha.

A esa frase le faltaba aclarar a qué fecha se refería: el valor presente lleva los pagos al día de hoy. La versión final dice:

> El valor presente usa una tasa de interés para expresar montos de distintas fechas en un valor equivalente hoy, y así poder compararlos.

El audio nuevo dura 2.6 segundos más. Generé la frase de nuevo y actualicé la duración de esa parte en el código. El audio descartado está en el repositorio, en `public/voz/alternativas/`.

## Ventajas y límites del flujo con LLMs

Ventajas que encontré:

- **No requiere grabar.** La voz se genera desde el texto, así que no hacen falta micrófono, estudio ni varias tomas.
- **Los cambios son baratos.** Corregir una frase es editar texto; mover una animación es cambiar un número en el código.
- **El resultado es reproducible.** El código, el guion y los audios están publicados, y cualquier persona puede generar el mismo video o modificarlo.
- **Sirve para explicar con imágenes.** Una balanza, una línea de tiempo o un grupo de personas ayudan a entender una idea técnica a quien no lee fórmulas.

Límites:

- Las marcas de tiempo de cada palabra las anoté a mano. ElevenLabs puede entregarlas automáticamente, y para un video más largo convendría usarlas.
- El video todavía no tiene subtítulos; esas mismas marcas de tiempo servirían para generarlos.
- La voz sintética y el agente reproducen lo que se les pide, correcto o no. Verificar que cada afirmación actuarial sea correcta le toca a alguien que conozca el tema.

Para ver el principio de equivalencia aplicado con datos reales, están los proyectos sobre [la tarifa de Gastos Médicos Mayores](/blog/gmm-explorer/) y sobre [SIMA](/blog/sima/), que hace estos cálculos para seguros de vida.
