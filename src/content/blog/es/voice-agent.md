---
title: "Tener un asistente personal en tu teléfono ya está al alcance de todos: agente de voz con Twilio y OpenAI"
description: "Si no alcanzas a contestar tu iPhone o tu Pixel, que conteste alguien por ti. Conecté el desvío de llamadas de mi teléfono a Twilio y al modelo de voz de OpenAI, y en menos de un par de horas tenía un asistente que atiende como yo le pido y me manda un mensaje con quién llamó. Después lo puse a responder preguntas sobre mi trabajo, aquí mismo."
date: "2026-10-04"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
tags: ["agente de voz", "OpenAI Realtime", "Twilio", "WebRTC", "Node.js", "LLM", "desvío de llamadas"]
ficha:
  rol: "Diseño y desarrollo"
  año: "2026"
  stack: "Node.js · Twilio · OpenAI Realtime (gpt-realtime) · WebRTC"
  estado: "En vivo"
  live: "https://ai-caller.gonor.me/talk"
heroImage: "/blog-illustrations/voice-agent.webp"
heroAlt: "Un asistente de IA con audífonos atiende varias llamadas entrantes y envía un mensaje con el resumen al teléfono de su dueño."
heroCaption: "Tú no alcanzas a contestar; el asistente atiende y te manda lo que importa."
relatedPosts: ["regulation-agent-rag", "proust-attention-machine", "meeting-room-booking"]
---

Tu teléfono suena, no alcanzas a contestar, y en lugar del buzón de voz responde un asistente que habla como tú le pediste, sabe lo que tú le dijiste que supiera y al colgar te manda un mensaje con quién llamó y para qué. Eso funciona hoy en un iPhone o en un Pixel, sin instalar nada en el teléfono.

La idea no es nueva. Apple la presentó en iOS 26 como [Call Screening](https://www.youtube.com/watch?v=-ir_hrbFHMk) (este video de Apple muestra en un minuto cómo funciona) y Google la tiene en el Pixel como [Call Screen](https://support.google.com/phoneapp/answer/9118387?hl=es-419): el teléfono contesta a un número desconocido y le pregunta quién es y para qué llama. Lo que quise probar es el paso siguiente: que el asistente no solo pregunte, sino que converse, con la información y el tono que yo decida.

Lo armé en menos de un par de horas. Quiero contar cómo, porque la integración es mucho más sencilla de lo que parece.

## Cómo funciona

El truco está en el desvío condicional de llamadas, una función de tu compañía telefónica que ya tiene tu teléfono. Con un código como `*61*número#`, que se marca como si fuera un número normal, le dices que, si no contestas, mande la llamada a otro número.

Ese otro número es de [Twilio](https://www.twilio.com/), una empresa que renta números telefónicos y deja que un programa reciba y haga llamadas. Twilio entrega el audio de la llamada, en vivo, a un servidor: un programa pequeño escrito en JavaScript (Node.js) que corre en una computadora siempre encendida. El servidor pasa ese audio a `gpt-realtime`, el modelo de voz de OpenAI. A diferencia de ChatGPT escribiendo texto, este modelo escucha y habla directamente, en tiempo real, y por eso la conversación se siente como una llamada y no como un dictado. Su respuesta regresa a la llamada por el mismo camino.

```
Llamada → tu iPhone o Pixel (no contestas)
        → desvío del operador → número de Twilio
        → servidor Node → OpenAI Realtime → voz de regreso a la llamada
        → al colgar: SMS con el resumen
```

Tu teléfono sigue sonando primero; el asistente solo atiende lo que tú no alcanzas. Si la llamada es urgente, puede intentar comunicarte en vivo, y si tampoco contestas ahí, vuelve con la persona, se lo dice y toma el recado.

Lo que más me sorprendió es cuánto se puede ajustar sin tocar código. Una página de administración, protegida con contraseña, permite cambiar la voz, la velocidad, el saludo, la despedida y el tono, y los cambios aplican desde la siguiente llamada. Lo que el asistente sabe vive en un archivo de texto. Si mañana quieres que conteste como recepcionista de un consultorio en lugar de como tu asistente personal, cambias ese archivo y unas cuantas frases.

## De mi teléfono a mi portafolio

Con la pieza funcionando, la llevé a otro lugar: un asistente que responde preguntas sobre mi experiencia y mis proyectos. Está en [ai-caller.gonor.me/talk](https://ai-caller.gonor.me/talk), con un botón para hablarle desde el navegador o un número al que se puede llamar. Conoce solo lo que está en mi CV y en este sitio, habla español de México y cambia a inglés si tú lo haces. Al terminar, me llega un resumen de la conversación.

El puente con el modelo es el mismo. Cambió el archivo de conocimiento, el saludo y la entrada desde el navegador, que usa WebRTC (la tecnología con la que una página web manda audio en vivo, la misma de las videollamadas en el navegador) y no necesita teléfono.

## Cuánto cuesta

Los números hasta ahora, de mis pruebas y las primeras conversaciones:

| Concepto | Costo |
|---|---|
| Número de Twilio (EE. UU.) | ~1.15 USD al mes |
| Llamada entrante en Twilio | ~0.0085 USD por minuto |
| Modelo de voz de OpenAI | ~0.06 a 0.10 USD por minuto de conversación |
| SMS con el resumen a México | ~0.18 USD cada uno |

En octubre van 10 conversaciones y poco más de 9 minutos de voz, lo que en el modelo equivale a menos de un dólar. El servidor corre en una máquina que ya tenía. Le puse un presupuesto de 30 minutos al día y 200 al mes, que deja el gasto máximo del modelo entre 12 y 20 dólares mensuales.

## Lo que todavía no está bien

- **Latencia.** La respuesta es rápida, pero no instantánea. En algunas preguntas se nota una pausa antes de que empiece a hablar.
- **Audio telefónico.** Una llamada normal transmite el sonido con mucha menos calidad que internet (8 kHz, contra 24 kHz o más en el navegador), y la voz suena más plana por teléfono.
- **El número es de Estados Unidos.** Para alguien en México, llamar directo a un +1 cuesta como llamada internacional. Un número mexicano lo resolvería, pero exige más trámite en Twilio.
- **El buzón de voz desaparece.** Con el desvío por no contestar activo, el buzón del operador deja de recibir llamadas; el asistente lo reemplaza por completo.
- **Sabe lo que le escribes, y nada más.** Si el archivo de conocimiento se queda viejo, el asistente repite información vieja con toda seguridad. Tampoco tengo todavía un conjunto fijo de preguntas para medir si contesta bien; lo he probado hablando con él.

## Oportunidades

Es un proyecto simple, y por eso sirve para muchas cosas. Un consultorio, un taller o un despacho podrían tener una recepción que conteste fuera de horario y deje el recado ordenado. Un vendedor podría filtrar llamadas y recibir solo las que valen la pena. Un evento podría tener una línea que responda las mismas diez preguntas de siempre. Conectado a un calendario, podría agendar citas; conectado a un CRM, el sistema donde una empresa guarda a sus clientes y prospectos, registrar cada contacto sin que nadie lo capture a mano.

La parte difícil, que el teléfono hable con un modelo de lenguaje en tiempo real, ya está resuelta por las herramientas. Lo que queda es decidir qué quieres que conteste y cómo.

La idea de que un modelo responda solo desde un texto conocido es la misma que sostiene el [asistente de regulación de la LISF y la CUSF](/blog/regulation-agent-rag/). Y si quieres ver qué pasa dentro de un modelo de lenguaje, la [máquina de atención de Proust](/blog/proust-attention-machine/) lo construye desde cero.
