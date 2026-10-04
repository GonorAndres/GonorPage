---
title: "Tablero con fuentes distintas: por qué usar un corte común de datos"
description: "Un tablero que compara fuentes con actualizaciones distintas debe mostrar un corte común, la última hora que todas tienen completa. Un día ficticio, con publicidad completa hasta las 15:00, ventas hasta las 13:00 y tráfico web hasta las 14:00, muestra cómo el retorno mezcla tres relojes si no se hace."
date: "2026-09-27"
lastModified: "2026-10-03"
category: "herramientas"
lang: "es"
shape: "case-study"
tags: ["tableros", "frescura", "calidad de datos", "GCP"]
ficha:
  rol: "Autor"
  año: "2026"
  datos: "Escenario ficticio; ninguna cifra corresponde a un cliente"
  estado: "Caso metodológico"
relatedPosts: ["analytics-dashboards", "fuentes-no-coinciden"]
---

Un tablero puede verse actualizado y, al mismo tiempo, comparar datos que no llegaron juntos. Si la publicidad ya tiene información hasta las 15:00, las ventas hasta las 13:00 y el tráfico web hasta las 14:00, el retorno calculado a las 15:00 mezcla tres relojes. El gasto parece crecer sin ventas que lo acompañen. Puede ser un problema real, pero también puede ser sólo una diferencia en la llegada de los datos.

Este ejemplo es **ficticio**. Sirve para explicar una decisión de diseño que adopté al construir herramientas para equipos: antes de presentar una variación, el tablero debe poder decir hasta qué hora es comparable.

| Fuente | Última hora completa en el ejemplo |
|---|---:|
| Publicidad | 15:00 |
| Analítica web | 14:00 |
| Ventas | 13:00 |

El corte común es la última hora completa de la fuente más lenta: 13:00. Por eso la comparación de gasto, sesiones y ventas acumula cada serie desde el inicio del día hasta las 13:00. Las horas posteriores pueden mostrarse como preliminares, pero no se mezclan en una misma tasa. La referencia histórica usa el mismo día de la semana y también se detiene a las 13:00. Comparar las 13 horas de hoy con un día anterior completo produciría otra distorsión.

## Qué debe verse en la pantalla

El encabezado puede declarar la hora de reconstrucción, la última hora completa por fuente y cuál de ellas fija el corte. Una marca discreta distingue lo preliminar de lo comparable. Si una fuente no llegó, un cero no la sustituye: el dato se declara ausente y el indicador que depende de él queda pendiente.

Un tablero así no garantiza que cada fuente sea correcta. Todavía hay que revisar definiciones, zonas horarias, fallas de carga y cambios posteriores en los registros. Tampoco permite atribuir una caída a una campaña por sí solo. Sí evita una conclusión innecesaria: llamar «deterioro» a una venta que simplemente no se había cargado.

La decisión práctica es mirar primero la frescura y luego el desempeño. El criterio conecta con mis [proyectos de tableros](/blog/analytics-dashboards/) y con la [conciliación entre fuentes](/blog/fuentes-no-coinciden/): una interfaz útil también explica dónde termina su evidencia.
