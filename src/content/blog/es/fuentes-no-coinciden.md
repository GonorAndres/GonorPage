---
title: "Por qué las conversiones de publicidad no coinciden con las ventas"
description: "Las conversiones de una plataforma publicitaria y las ventas del negocio difieren porque cada fuente observa un momento, una unidad y una ventana de atribución distintos. Un ejemplo ficticio de 20 conversiones atribuidas contra 15 pedidos confirmados las concilia y muestra qué cifra responde cada pregunta."
date: "2026-09-27"
lastModified: "2026-10-03"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
tags: ["medición", "atribución", "calidad de datos", "GCP"]
ficha:
  rol: "Autor"
  año: "2026"
  datos: "Ejemplo ficticio; ninguna cifra corresponde a un cliente"
  estado: "Caso metodológico"
relatedPosts: ["data-engineering-platform", "teaching-apis"]
---

Una campaña puede informar veinte conversiones mientras el sistema comercial registra quince ventas. La diferencia no prueba por sí sola que una de las fuentes esté rota. Cada una observa un momento distinto y responde una pregunta distinta: la plataforma calcula qué acciones puede atribuirse; el negocio registra lo que realmente ocurrió en la venta.

En mi trabajo con datos de publicidad y ventas aprendí a empezar por esa distinción. Antes de construir una tasa o un tablero, escribo qué representa cada cifra: la unidad de análisis, la fecha, la ventana de atribución, las exclusiones y la fuente. Este artículo usa un ejemplo **completamente ficticio** para mostrar el método, sin reproducir datos, pantallas ni reglas de ningún cliente.

## Un ejemplo de dos carriles

Supongamos que, durante una semana, una plataforma reporta 20 conversiones atribuidas. En el sistema de ventas aparecen 15 pedidos confirmados, de los cuales 12 conservan información suficiente para relacionarlos con la campaña.

| Lectura | Valor ficticio | Qué responde |
|---|---:|---|
| Conversiones atribuidas por la plataforma | 20 | ¿Cuántas acciones reclama la plataforma según sus reglas? |
| Pedidos confirmados por el negocio | 15 | ¿Cuántas ventas quedaron registradas? |
| Pedidos con vínculo verificable a la campaña | 12 | ¿Cuántos pedidos pueden relacionarse con esa campaña con la información disponible? |

Restar 20 menos 15 no mide «conversiones perdidas». Una persona puede interactuar con varios anuncios antes de comprar; la plataforma puede contar una acción que el negocio no considera venta; un pedido puede registrarse después del corte; y tres de los quince pedidos carecen de un vínculo comprobable. Incluso cuando ambas fuentes usan la palabra *conversión*, sus definiciones no son intercambiables.

## Qué comprobar antes de concluir

Primero compararía periodos completos bajo la misma zona horaria. Después revisaría qué acción cuenta la plataforma, cuánto dura su ventana de atribución y qué estados del pedido incluye el sistema comercial. Por último mediría la cobertura del vínculo: aquí son 12 de 15 pedidos, o 80 %, para este ejemplo y esta semana. Esa cobertura no dice que el 20 % restante provenga de otra fuente; dice que no se puede verificar su origen con los datos disponibles.

La práctica útil es conservar los dos carriles. La plataforma sirve para revisar campañas dentro de su propio marco; el registro comercial sirve para analizar ventas. La tabla de conciliación muestra dónde se encuentran y dónde queda una pregunta abierta. Si la cobertura cae de repente, la primera decisión no es mover inversión: es investigar la medición.

Este caso se conecta con mi [plataforma de datos para seguros](/blog/data-engineering-platform/), donde el recorrido del dato también debe poder seguirse desde el origen, y con [APIs para analistas](/blog/teaching-apis/), que explica qué puede fallar antes de que una cifra llegue al reporte.
