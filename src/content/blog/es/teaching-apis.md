---
title: "Por qué todo analista debería entender APIs (y no solo los desarrolladores)"
description: "Si trabajas con tasas de la Fed, tipo de cambio de Banxico o esperanza de vida del Banco Mundial, ya consumes APIs. Entender qué pasa entre tu solicitud y tus datos te convierte en un mejor analista: puedes diagnosticar cuando algo falla, optimizar cuando algo es lento, y construir cuando necesitas algo que no existe. Este proyecto lo demuestra con datos reales y laboratorios interactivos."
date: "2026-05-03"
category: "herramientas"
lang: "es"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Next.js · TypeScript · Tailwind · Recharts"
  datos: "FRED · Banxico · World Bank · API de mortalidad propia"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/learning-apis"
  live: "https://learning-apis.gonor.me"
tags: ["APIs", "Next.js", "TypeScript", "FRED", "Banxico", "World Bank", "Educativo"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/teaching-apis.webp"
heroAlt: "Una solicitud va de una tabla de análisis a una fuente remota; la respuesta regresa por una ruta con puntos de demora y fallo."
heroCaption: "Seguir el recorrido de la solicitud y la respuesta permite reconocer dónde se demora o falla la entrega de datos."
---

Cuando un actuario abre R y escribe `fredr::fredr(series_id = "FEDFUNDS")`, está consumiendo una API. Cuando un analista de riesgo descarga el tipo de cambio USD/MXN desde el portal de Banxico, el portal está consumiendo una API por él. Cuando un demógrafo consulta esperanza de vida en el sitio del Banco Mundial, hay una API detrás de esa tabla.

La mayoría de los analistas trabajan con datos que llegan a través de APIs sin saber que lo hacen. Esto funciona bien hasta que algo falla: la consulta tarda demasiado, el servidor responde con un error que no entiendes, tu script deja de funcionar porque cambió la autenticación, o necesitas combinar datos de dos fuentes y no sabes cómo. En ese momento, la brecha entre "consumir datos" y "entender cómo llegan" se vuelve visible.

## La idea

Este proyecto nace de una convicción personal: para construir herramientas que funcionen en producción, un actuario necesita entender la infraestructura que entrega los datos. Las APIs son esa infraestructura. Son universales (FRED, Banxico, Banco Mundial, INEGI, cualquier fuente de datos moderna las expone), y los conceptos que las rodean (latencia, códigos de error, autenticación, caché, rate limiting) aparecen en cualquier sistema que quieras construir o consumir.

La plataforma tiene dos niveles. La página principal enseña los fundamentos: qué es una API, cómo funciona una solicitud, y un playground donde puedes hacer consultas reales a FRED, Banxico, el Banco Mundial y una API de mortalidad construida dentro del proyecto. La página avanzada tiene laboratorios interactivos donde las cosas se rompen a propósito.

## El playground

El playground es el centro del proyecto. Tiene cuatro pestañas, una por cada API, y en cada una puedes configurar los parámetros de la consulta, ver exactamente qué request se va a enviar (URL, método, headers), ejecutarlo contra la API real, y ver la respuesta completa: datos tabulados, JSON crudo, tiempo de respuesta, código de estado.

La API de FRED devuelve tasas de interés de la Reserva Federal. La de Banxico devuelve tipo de cambio USD/MXN. La del Banco Mundial devuelve esperanza de vida por país. Y la cuarta es una API de mortalidad que yo construí dentro del proyecto: una tabla de mortalidad actuarial que responde con probabilidades de muerte por edad y sexo. Esa cuarta pestaña cierra el ciclo: pasas de consumir APIs de otros a tener tu propia API funcionando.

## Los laboratorios

La página avanzada tiene laboratorios diseñados para enseñar lo que los tutoriales omiten: el camino que no es feliz.

**Carrera de latencia.** Cuatro APIs compiten en tiempo real. FRED responde desde St. Louis, Banxico desde Ciudad de México, el Banco Mundial desde Washington, y tu API desde localhost. La diferencia es visible: la API local responde en milisegundos, las remotas tardan cientos. Correr la carrera varias veces muestra que la latencia no es fija; fluctúa. Eso es algo que un analista que solo ve el dato final nunca percibe.

**Laboratorio de caos.** Los tutoriales solo muestran el camino feliz: envías un request, recibes un 200 OK, parseas el JSON. En producción, los servidores se caen, los rate limits te bloquean, la autenticación expira, tu URL tiene un typo. Este laboratorio te permite provocar cada error HTTP a propósito en un ambiente seguro, para que los reconozcas cuando ocurran de verdad.

**Escenarios what-if.** Tomas datos reales de esperanza de vida de México del Banco Mundial y los ajustas con un slider: qué pasaría si la esperanza de vida fuera 10% mayor, o 20% menor. El dato real y el hipotético se grafican juntos. La idea es mostrar que una vez que tienes acceso directo a los datos vía API, manipularlos para análisis de sensibilidad es inmediato.

Hay más laboratorios (un debugger que registra cada llamada, un monitor de salud de APIs, un visualizador de la anatomía de un request, un mezclador de datos de múltiples fuentes), pero el punto es el mismo: cada uno enseña un concepto que aparece en cualquier sistema que consuma datos externos.

## Por qué esto importa para un actuario

Un actuario que entiende APIs puede construir un pipeline que consulte tasas de la Fed cada mañana y actualice sus proyecciones automáticamente. Puede detectar cuando Banxico cambia un endpoint y su modelo deja de recibir tipo de cambio. Puede combinar datos de mortalidad del Banco Mundial con datos locales del INEGI para análisis comparativo. Puede construir su propia API para exponer los cálculos de la <a href="/blog/suite-actuarial/" style="color: #C17654; text-decoration: underline;">suite actuarial</a> a otros sistemas.

La diferencia entre un analista que solo consume datos y uno que entiende cómo llegan es la misma que entre alguien que sabe manejar y alguien que además sabe abrir el cofre cuando el coche no arranca. Ambos llegan a su destino la mayoría de los días, pero solo uno puede resolver el problema cuando algo falla.

<div style="margin-top: 2rem; padding: 1rem 1.5rem; border-left: 4px solid #C17654; background-color: #f9f6f2;">
  <p style="margin: 0 0 0.5rem 0;"><strong>Aplicación en vivo:</strong> <a href="https://learning-apis.gonor.me/es" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">learning-apis.gonor.me</a></p>
</div>
