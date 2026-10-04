---
title: "Cómo verificar el seguimiento de conversiones del anuncio al CRM"
description: "Hay que verificar cada paso del recorrido, del clic en el anuncio a la página, el envío del formulario y el registro en el CRM, antes de interpretar una caída del embudo como un problema de experiencia. Un ejemplo ficticio muestra qué eventos, parámetros y resultados comprobar para que la mejora se apoye en evidencia."
date: "2026-09-27"
lastModified: "2026-10-03"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
tags: ["GA4", "GTM", "CRM", "CRO", "medición"]
ficha:
  rol: "Autor"
  año: "2026"
  datos: "Recorrido y cifras ficticios; ninguna persona o cliente real"
  estado: "Caso metodológico"
relatedPosts: ["fuentes-no-coinciden", "analytics-dashboards"]
---

Una campaña genera clics, pero el equipo no sabe cuántos visitantes llegaron al formulario, cuántos lo enviaron y cuántos terminaron como prospectos útiles. Sin esa cadena, una caída del embudo puede ser un problema de experiencia de usuario o de medición. Cambiar el sitio antes de distinguirlos puede gastar esfuerzo en el lugar equivocado.

Este recorrido y sus cifras son **ficticios**. Reúnen prácticas que uso al revisar medición y conversión; no describen una campaña ni un formulario de un cliente.

## El recorrido que habría que verificar

El anuncio lleva a una página. La página abre un formulario. Una persona lo envía. El CRM recibe un registro y, después, el equipo comercial decide si cumple el criterio de calificación. Cada paso necesita su propia evidencia: una visita no es un envío; un envío no es un prospecto calificado.

| Paso | Comprobación en un ejemplo ficticio |
|---|---|
| Clic → página | La página carga y conserva el origen de la campaña. |
| Página → formulario | El evento se registra una vez y en el paso correcto. |
| Envío → CRM | El CRM recibe un registro de prueba autorizado, sin datos personales en la analítica. |
| CRM → calificación | La etapa comercial se interpreta con su definición y fecha, no como otra versión del envío. |

GA4 y GTM ayudan a observar y validar el recorrido digital. El CRM conserva el resultado comercial. Si se pierde el origen al cambiar de página o de dominio, no se debe rellenar retrospectivamente como «orgánico». Si un evento aparece dos veces, tampoco se puede usar su volumen como si representara a dos personas.

## Del diagnóstico a la recomendación

Sólo después de verificar la cadena analizaría dónde se detienen los usuarios. Una observación de sesión puede sugerir que el formulario es largo o confuso; una tasa puede mostrar en qué paso concentrar la investigación. Ambas son pistas, no una prueba de que el rediseño elevará las ventas. La recomendación debe decir qué cambio se propone, qué señal lo motivó y cómo se evaluaría después.

La decisión práctica es separar tres estados: lo que está medido, lo que parece estar fallando y lo que aún exige una prueba. Este caso se enlaza con [la conciliación entre fuentes](/blog/fuentes-no-coinciden/) y con mi [exploración de pruebas A/B](/artifacts/ab-testing-bayesian-frequentist/): una mejora defendible empieza por saber qué resultado se está midiendo.
