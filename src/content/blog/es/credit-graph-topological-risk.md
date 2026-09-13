---
title: "CreditGraph: Riesgo de Crédito Topológico con Neo4j, PySpark y LightGBM"
description: "El análisis crediticio tradicional trata cada préstamo como independiente, pero las cadenas de garantías, las garantías circulares y la concentración accionaria crean exposición correlacionada que los modelos relacionales no pueden expresar. Este proyecto modela un portafolio de 500 clientes como un grafo en Neo4j, procesado con PySpark en Databricks y calificado con LightGBM calibrado, para hacer visibles los patrones de riesgo estructural que el SQL oculta."
date: "2026-03-30"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Neo4j · PySpark · Databricks · LightGBM · Python"
  datos: "Registro PSC del Reino Unido · GLEIF · 500 clientes ficticios"
  regulacion: "CNBV Circular Única de Bancos (Art. 73, Circular 3/2012)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/graph-relation-db"
  live: "https://graph-db.gonor.me/"
tags: ["Neo4j", "PySpark", "Databricks", "Riesgo de crédito", "Cypher", "LightGBM", "Calibración Platt", "Grafos"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/credit-graph-topological-risk.webp"
heroAlt: "Un propietario compartido conecta tres grupos de empresas deudoras en un mapa de relaciones."
heroCaption: "Un propietario compartido puede vincular créditos que parecen independientes en una revisión por registro."
---

Cuando AIG colapsó en 2008, la pregunta más costosa no era cuánto debían los clientes individuales. Era quién garantizaba a quién, y cuántos niveles de separación había entre una hipoteca tóxica y una institución que juraba no tener exposición. Lehman Brothers necesitó 7,000 entidades legales para reportar su estructura de riesgo a los reguladores, una estructura que ninguna base de datos relacional podía expresar de forma coherente. Por eso existe GLEIF hoy: para mapear la topología de propiedad global en un formato que los modelos puedan leer.

El problema no era falta de datos. Era falta de estructura para ver las conexiones.

## Por qué SQL no basta

Una tabla de créditos en SQL tiene una fila por préstamo. Cada fila es, desde la perspectiva del motor, completamente independiente de las demás. Puedes hacer JOINs para relacionar acreditados con garantías, y con otro JOIN puedes llegar al garante del garante. Pero SQL no tiene una noción nativa de "profundidad variable": la consulta que busca a dos saltos de distancia es diferente, estructuralmente, de la que busca a cinco saltos.

En un portafolio real, eso importa. Un acreditado con 725 puntos en el buró puede tener un perfil individual impecable y al mismo tiempo estar a dos nodos de un default activo, vía una cadena de garantías que ningún analista ha trazado porque la base de datos no se lo facilita. Tres acreditados pueden garantizarse mutuamente en un ciclo cerrado, reportando cobertura del 100% cuando la cobertura real es cero: en caso de incumplimiento de cualquiera de los tres, el sistema colapsa en cascada.

Eso no es un problema de calidad de datos. Es un problema de representación.

## La motivación real: Neo4j y Databricks en las convocatorias

Revisando ofertas de trabajo en análisis de riesgo crediticio, los mismos dos nombres aparecían con frecuencia: Neo4j para modelado de relaciones y Databricks para procesamiento en escala. No quería estudiarlos con tutoriales aislados. Quería construir algo donde el problema mismo exigiera esas herramientas, donde la elección de tecnología no fuera arbitraria sino la consecuencia lógica de lo que el problema requiere.

Un portafolio de crédito con estructura de garantías y propiedad accionaria es ese problema.

## La arquitectura

El proyecto tiene cuatro capas que se conectan en secuencia.

**Datos con topología real.** La base no es un grafo generado aleatoriamente. Los nodos de entidad corporativa provienen del registro PSC del Reino Unido (Person with Significant Control) y de GLEIF para entidades mexicanas: datos reales de propiedad accionaria donde las conexiones representan relaciones legales verificadas. Sobre esa topología se empotraron 500 clientes ficticios con sus créditos, garantías y atributos crediticios.

**ETL en PySpark sobre Databricks.** Cinco CSVs con 1,150 registros en total, y 127 problemas de calidad intencionalmente sembrados: valores nulos en campos clave, estados de México sin estandarizar (registros como "Jalisco", "JAL" y "jalisco" coexistiendo), fechas en formatos inconsistentes, montos negativos. El pipeline los detecta todos.

Con 1,150 filas pandas resuelve en milisegundos. Elegí PySpark porque quería forzarme a pensar en producción desde el principio: schemas explícitos con `StructType` en lugar de `inferSchema=True` (que adivina tipos y te enteras del error tres meses después), anti-joins para validar llaves foráneas en vez de `.isin()` que colapsa el driver en datasets grandes. Me costó más tiempo del que habría tomado en pandas, pero cada error que cometí en PySpark a esta escala es uno que no voy a cometer cuando los datos pesen de verdad.

**Scoring con LightGBM y calibración Platt.** El modelo de clasificación produce scores, pero los scores crudos de un clasificador no son probabilidades. LightGBM optimiza AUC, no calibración. La diferencia es importante: si el modelo dice "score 0.8", eso no significa que el 80% de esos acreditados incumplan. Puede significar que el 40% incumple, o el 60%, dependiendo de cómo se distribuyen los scores.

Para convertir scores en probabilidades de default (PD) utilizables en la fórmula de pérdida esperada (EL = PD × EAD × LGD), se necesita calibración. La calibración de Platt ajusta una regresión logística sobre los scores del modelo usando un conjunto de calibración separado del entrenamiento y del test: tres particiones en lugar de dos. El conjunto de calibración es la diferencia entre un número que el modelo usa internamente y una PD que el área de reservas puede usar para calcular provisiones.

**Neo4j AuraDB: 853 nodos, 726 aristas.** El grafo final tiene entidades corporativas, personas físicas, acreditados, créditos y garantías como nodos; las aristas representan propiedad accionaria, garantías otorgadas y relaciones de control. Con los 248 créditos calificados en el grafo, las consultas Cypher pueden combinar la topología con los scores calibrados en una sola expresión.

## Lo que el grafo ve que SQL no ve

El notebook de stress testing ejecuta cuatro consultas Cypher contra el grafo vivo. Cada una revela una categoría de riesgo invisible en la vista relacional.

### Cadenas de garantía

```cypher
MATCH path = (defaulted:Client)-[:GUARANTEES*1..5]->(target:Client)
WHERE defaulted.loan_status = 'Default'
  AND target.loan_status <> 'Default'
RETURN target.name,
       target.bureau_score,
       length(path) AS hops,
       [n IN nodes(path) | n.name] AS chain
ORDER BY hops ASC
```

El operador `[:GUARANTEES*1..5]` atraviesa hasta cinco saltos en una sola expresión. No hay cinco JOINs anidados, no hay CTEs recursivos: la profundidad variable es nativa en Cypher. El resultado: un acreditado con 725 puntos en el buró aparece a dos saltos de un default activo. En la vista SQL, ese acreditado es de bajo riesgo. En el grafo, su garante inmediato tiene un garante en default.

### Garantías circulares

```cypher
MATCH path = (a:Client)-[:GUARANTEES*2..6]->(a)
RETURN [n IN nodes(path) | n.name] AS cycle,
       length(path) AS cycle_length,
       reduce(exp = 0, n IN nodes(path) |
         exp + n.total_exposure) AS combined_exposure
```

Tres acreditados se garantizan mutuamente en un ciclo cerrado. La exposición combinada reportada como garantizada llega a MXN 2.1 millones. La cobertura real en caso de incumplimiento es cero. Esto viola la Circular 3/2012 de la CNBV sobre garantías recíprocas: el regulador las considera instrumentos de cobertura ficticia y requiere que las instituciones las identifiquen y las excluyan del cómputo de mitigantes de riesgo.

La consulta de detección de ciclos sobre un grafo es trivial. La misma lógica en SQL requiere un CTE recursivo cuya profundidad hay que definir de antemano, y en motores sin soporte de CTEs recursivos directamente es impráctica.

### Concentración por persona física

```cypher
MATCH (p:Person)-[:CONTROLS]->(company:Company)-[:HAS_LOAN]->(loan:Loan)
WITH p,
     count(DISTINCT company) AS companies_controlled,
     sum(loan.outstanding_balance) AS total_exposure
WHERE companies_controlled >= 3
RETURN p.name,
       companies_controlled,
       total_exposure
ORDER BY total_exposure DESC
```

Una sola persona física controla cuatro empresas en sectores distintos con exposición total de MXN 7.1 millones. Las cuatro empresas aparecen en sectores diferentes, lo que en la vista SQL parece diversificación. En el grafo, son un solo punto de concentración. El Artículo 73 de la Circular Única de Bancos de la CNBV (personas relacionadas) exige que las instituciones identifiquen y consoliden la exposición a grupos de personas vinculadas, precisamente por este patrón.

### Hubs de contagio

Una empresa en proceso de reestructuración tiene cinco accionistas con créditos activos. La exposición indirecta agregada a través de ese hub es MXN 5.2 millones. Si la reestructuración falla, el impacto no se limita al crédito de la empresa: se propaga a los cinco accionistas cuya capacidad de pago depende parcialmente del valor de su participación.

## SQL vs. grafo: el resumen del stress test

| Dimensión | Vista SQL | Vista grafo |
|:---|:---|:---|
| Riesgo individual | 725 bureau score = bajo riesgo | A 2 saltos de un default activo |
| Cobertura de garantías | MXN 2.1M reportados | MXN 0 reales (ciclo cerrado) |
| Concentración sectorial | 4 empresas, 4 sectores | 1 persona, MXN 7.1M de exposición real |
| Riesgo de contagio | No modelable directamente | Hub con MXN 5.2M de exposición indirecta |

El SQL no estaba mal. Estaba describiendo correctamente lo que la estructura de datos le permite ver. El problema era la estructura misma.

## Las limitaciones que importa mencionar

Los datos son sintéticos. La topología de propiedad proviene de registros reales, pero los acreditados, los montos, los scores y las relaciones de garantía son ficticios y diseñados para ilustrar los patrones. En un portafolio real, la calidad de estas conclusiones depende críticamente de dos cosas: la completitud del registro de garantías (una cadena que no está en el sistema es invisible), y la frecuencia de actualización del grafo (una empresa que entra en reestructuración hoy debería modificar el riesgo del portafolio hoy, no en el próximo corte mensual).

El modelo de LightGBM tampoco está en producción. No fue calibrado sobre datos de incumplimiento mexicanos reales, ni validado sobre un período de tiempo suficiente para capturar un ciclo crediticio. Las PDs que produce son calibradas internamente y útiles para ilustrar el flujo técnico; no son estimaciones que un área de reservas pueda usar directamente.

El flujo completo queda: PySpark limpia y valida, LightGBM califica con Platt, Neo4j almacena topología y scores, Cypher responde las preguntas que SQL no puede formular.

## Conexión con el portafolio

El proyecto de <a href="/blog/risk-analyst/" style="color: #C17654; text-decoration: underline;">Risk Analyst</a> tiene un módulo (P10) que modela contagio interbancario con redes neuronales en grafos: la misma intuición de que la topología de la red importa más que los balances individuales, aplicada a riesgo sistémico en lugar de riesgo crediticio de portafolio. El <a href="/blog/regulation-agent-rag/" style="color: #C17654; text-decoration: underline;">asistente de regulación</a> navega la CNBV Circular Única de Bancos y la LISF: las mismas normas que este proyecto aplica en la detección de personas relacionadas y garantías recíprocas. Y <a href="/blog/sima/" style="color: #C17654; text-decoration: underline;">SIMA</a> implementa la matemática actuarial de reservas que la fórmula EL = PD × EAD × LGD alimenta directamente.

El código está en <a href="https://github.com/GonorAndres/graph-relation-db" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">GitHub</a>.

Lo que me quedo pensando: la detección de ciclos y la traversal de profundidad variable son triviales en Cypher. No son ventajas menores de Neo4j sobre SQL; son capacidades fundamentalmente distintas. Para un analista de riesgo crediticio que hoy usa únicamente modelos relacionales, el costo de adoptar un grafo es una curva de aprendizaje. El costo de no adoptarlo son los patrones que el portafolio tiene y que el modelo simplemente no puede ver.
