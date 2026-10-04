---
title: "Del anuncio a la compra: cómo construí Motion Commerce Lab"
description: "Motion Commerce Lab convierte ideas de marketing en piezas que se pueden abrir, revisar y cambiar: seis anuncios de producto y una propuesta de página de compra, construidos para trabajar juntos el momento del anuncio y el de la página de producto. Este post cuenta cómo se construyó."
date: "2026-09-29"
lastModified: "2026-10-03"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
tags: ["marketing de performance", "video de producto", "ecommerce", "CRO", "Codex", "Playwright", "FFmpeg"]
ficha:
  rol: "Dirección creativa y desarrollo con agentes de código"
  año: "2026"
  stack: "HTML · CSS · JavaScript · Playwright · FFmpeg · Cloudflare Pages"
  estado: "Portafolio desplegado; conceptos independientes"
  live: "https://code-video.gonor.me/index.es"
  extraLinks:
    - { label: "Propuesta de página de producto", url: "https://code-video.gonor.me/cro.es" }
    - { label: "Proceso reutilizable", url: "https://code-video.gonor.me/skill.es" }
heroImage: "/blog-illustrations/motion-commerce-lab.webp"
heroAlt: "Ilustración conceptual: una idea de producto pasa por un espacio de trabajo con Codex y se convierte en un video y una página de compra, rodeados de brotes."
heroCaption: "Del brief a una pieza que se puede ver y revisar: esa es la evolución del proceso que explora este proyecto."
---

Imagina que alguien ve un producto por primera vez en su teléfono. El anuncio tiene unos segundos para mostrarle qué es y por qué podría importarle. Si toca el enlace, la página de producto debe ayudarle a decidir. Son dos momentos de la misma conversación, pero muchas veces se diseñan por separado.

Quise trabajar los dos momentos juntos. No solo escribir una idea para un anuncio o dibujar una mejora para una tienda, sino construir versiones que otras personas pudieran abrir, mirar con calma y cambiar. De ahí salió [Motion Commerce Lab](https://code-video.gonor.me/index.es): seis videos cortos de producto, una propuesta interactiva de página de compra y un proceso para crear nuevas piezas.

## Primero: contar para qué sirve el producto

El punto de partida fue una pregunta de marketing muy simple: **¿qué tendría que ver una persona para entender este producto en pocos segundos?** La respuesta cambió según el caso. Para un juguete KONG, importaba mostrar al perro y cómo se usa. Para el escurridor OXO, los ingredientes y la preparación daban sentido al mecanismo. En Clinique, la aplicación y la textura explicaban más que una foto aislada del envase.

Hice un brief para cada pieza: situación de uso, idea principal, imágenes necesarias y cierre. Después construí [seis videos verticales de 18 segundos](https://code-video.gonor.me/index.es#work). Cada uno tiene una página donde se puede ver el resultado y abrir su escena editable.

Las primeras versiones también enseñaron algo. Algunas imágenes eran correctas, pero la secuencia no explicaba suficientemente bien el beneficio. En KONG, OXO y Clinique volví al brief, cambié imágenes y ajusté la composición. Al revisar los videos en tamaño de teléfono aparecieron además textos tapados y recortes débiles. Corregirlos fue parte del trabajo creativo, no un detalle de exportación.

## Después: mirar qué pasa al llegar a la tienda

Un anuncio puede despertar interés; la página de producto tiene que sostenerlo. Para explorar esa segunda parte, construí una [propuesta interactiva de página de compra](https://code-video.gonor.me/cro.es) a partir de una referencia de vela.

Se puede comparar una versión base recreada con dos cambios: poner los datos importantes del producto cerca del botón de compra y mantener un resumen visible al desplazarse por la página. El sitio permite mover un comparador, cambiar entre estados y ver un recorrido animado. Así, una conversación abstracta como «hagamos más clara la página» se convierte en algo concreto que el equipo puede señalar y discutir.

La pregunta que plantea el prototipo es si esos cambios ayudarían a encontrar antes la información y la acción de compra. Para responderla con datos habría que probar los cambios en una tienda real, idealmente por separado, y medir qué hacen las personas. Aquí se muestra la propuesta; todavía no se ha medido un efecto en ventas o conversión.

## De una entrega a una forma de trabajar

Quería que el aprendizaje de una pieza sirviera para la siguiente. Por eso reuní las decisiones en una [skill reutilizable](https://code-video.gonor.me/skill.es): un conjunto de instrucciones para pasar de observar un producto a escribir el brief, elegir imágenes, construir la escena y revisar el video terminado. No dicta cómo debe verse cada anuncio; ayuda a no olvidar las preguntas y comprobaciones importantes.

Trabajé con agentes de código, incluido Codex, para convertir esas decisiones creativas en escenas editables. La idea de hacer video con código tiene antecedentes como [Remotion](https://www.remotion.dev/docs/the-fundamentals). En este caso la implementación es distinta: las escenas usan HTML, CSS y JavaScript; Playwright captura cada cuadro y FFmpeg produce el MP4. Esa separación deja tanto un video para compartir como el material necesario para modificarlo.

Los videos publicados son silenciosos. Una futura versión podría incorporar narración con modelos de voz de [ElevenLabs](https://elevenlabs.io/docs/overview/models), después de definir el guion, la voz y los permisos de uso.

Este laboratorio no sustituye una campaña ni una prueba con clientes. Su valor hoy es hacer que una idea de marketing deje de vivir solo en un documento: se puede [ver el anuncio](https://code-video.gonor.me/index.es#work), [recorrer la propuesta de compra](https://code-video.gonor.me/cro.es) y decidir qué vale la pena probar después.
