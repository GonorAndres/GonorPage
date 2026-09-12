---
title: "Árboles B: la estructura simple que sostiene cada consulta que has hecho"
description: "PostgreSQL, MySQL, SQLite y la mayoría de los sistemas de archivos modernos usan árboles B como estructura central de sus índices. Entender por qué cambia cómo piensas sobre el diseño de consultas y el costo real de una búsqueda."
date: "2026-03-13"
category: "herramientas"
lang: "es"
tags: ["Estructuras de Datos", "PostgreSQL", "Optimización", "Rust", "Bases de Datos"]
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Rust · PostgreSQL"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/b-trees"
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/b-trees-optimization.webp"
heroAlt: "Un árbol de índice ancho y poco profundo destaca una sola ruta desde la raíz hasta una hoja."
heroCaption: "Agrupar varias claves en cada nodo permite descartar grandes partes de la búsqueda en cada acceso."
---

Cuando PostgreSQL tarda 40 milisegundos en encontrar un registro entre 500 millones, no es magia ni hardware excepcional. Es una operación de árbol B que tocó exactamente 9 nodos antes de llegar al dato. Si la misma consulta tarda 40 segundos, es porque no había índice y el motor tuvo que leer todos los bloques de disco en secuencia. La diferencia entre esos dos escenarios no es de configuración ni de recursos: es de estructura de datos.

El árbol B es la respuesta que la industria convergió en los años 70 a una pregunta concreta: ¿cómo organizar datos en disco de modo que búsqueda, inserción y eliminación sean todas eficientes, y que los accesos a disco sean mínimos? Esa pregunta sigue siendo relevante porque el disco, incluso el SSD más rápido, es órdenes de magnitud más lento que la RAM. El árbol B fue diseñado para ese gap.

## Por qué no alcanza un árbol binario

El árbol binario de búsqueda (BST) es la primera estructura que aparece en cualquier curso de algoritmos: cada nodo tiene exactamente dos hijos, y la propiedad de ordenamiento garantiza búsqueda en O(log n). Funciona perfectamente cuando el árbol vive en memoria. El problema aparece en disco.

Un BST con un millón de nodos tiene altura aproximada de 20. Cada comparación requiere acceder al siguiente nodo. En memoria, eso son 20 saltos de puntero, nanosegundos. En disco, cada salto es potencialmente un acceso a un bloque diferente: 20 operaciones de I/O, cada una entre 0.1 ms (SSD) y 10 ms (disco magnético). La latencia se acumula, y el problema se agrava porque los nodos de un BST son pequeños: un entero y dos punteros. Un bloque de disco de 8 KB podría alojar cientos de nodos, pero el BST solo usa uno por acceso. La capacidad del bloque se desperdicia.

El árbol B resuelve exactamente eso: en lugar de nodos delgados con dos hijos, usa nodos gordos que pueden tener docenas o cientos de claves, y un número equivalentemente grande de hijos. Un árbol B de orden 100 tiene hasta 99 claves por nodo. En un árbol de esa configuración con un millón de registros, la altura es aproximadamente 3. Tres accesos a disco para cualquier búsqueda, independientemente del tamaño del conjunto.

## La anatomía de un nodo

Un nodo de árbol B de orden M contiene:

- Hasta M-1 claves, guardadas en orden ascendente.
- Hasta M punteros a nodos hijos (uno entre cada par de claves, y uno al extremo de cada lado).

Las claves dentro de un nodo dividen el espacio de búsqueda: si las claves son [20, 50, 80], el primer puntero apunta al subárbol con valores menores a 20, el segundo al subárbol entre 20 y 50, el tercero entre 50 y 80, y el cuarto a valores mayores a 80. La búsqueda dentro de un nodo es una búsqueda binaria sobre sus claves, O(log M), pero como M es constante, en la práctica es O(1) para cualquier M razonable.

Los nodos hoja en un árbol B+ (la variante que usan casi todos los sistemas de bases de datos) almacenan los datos reales junto a las claves, y están enlazados entre sí en una lista doblemente enlazada. Esa cadena de hojas es lo que hace eficiente el escaneo de rangos: `WHERE fecha BETWEEN '2024-01-01' AND '2024-12-31'` no requiere recorrer el árbol repetidamente, solo encontrar el primer nodo hoja que cae en el rango y seguir la cadena hacia adelante.

## Cómo mantiene el balance: la división de nodos

El árbol B tiene una propiedad que lo distingue de la mayoría de los árboles balanceados: se balancea solo, sin rotaciones explícitas.

Cuando se inserta una clave en un nodo que ya está lleno (tiene M-1 claves), el nodo se divide en dos. La clave del medio asciende al nodo padre. Si el padre también está lleno, el proceso se repite hacia arriba. El único caso especial es cuando la raíz se divide: en ese momento se crea una nueva raíz con una sola clave, y la altura del árbol aumenta en uno. Es el único momento en que el árbol crece hacia arriba.

Esta propiedad garantiza que todos los nodos hoja están siempre a la misma profundidad, sin excepciones. No hay caminos de búsqueda más largos que otros. La complejidad O(log n) no es un promedio ni un caso esperado: es el peor caso.

El mínimo de ocupación también está garantizado: cada nodo (excepto la raíz) debe tener al menos ⌈M/2⌉ - 1 claves. Esto previene que los nodos queden casi vacíos después de eliminaciones, lo que mantiene la eficiencia de espacio del árbol.

## PostgreSQL: el árbol B en producción

El explorador interactivo que construí en Rust ([B-Tree Explorer](https://github.com/GonorAndres/b-trees)) usa un árbol de orden 4 para que las divisiones sean visibles. PostgreSQL usa un orden mucho mayor, calibrado contra el tamaño de página de 8 KB. Cada página del árbol (un bloque del heap de PostgreSQL) almacena tantas claves como quepan en 8 KB después de los metadatos del nodo.

Para un índice sobre un entero de 8 bytes en PostgreSQL, un nodo hoja cabe aproximadamente 250-300 claves por página. Para un índice sobre un VARCHAR(255), menos. Esto tiene consecuencias directas:

**Las claves cortas producen árboles más anchos y menos profundos.** Un índice sobre un UUID (16 bytes) será más alto que un índice sobre un entero de 4 bytes, para el mismo número de filas. La diferencia en altura puede ser 1-2 niveles para tablas grandes, lo que se traduce directamente en accesos a disco adicionales por consulta.

**Los índices compuestos tienen un orden que importa.** Un índice sobre `(pais, ciudad)` es un árbol B cuyas claves son pares ordenados lexicográficamente: primero por país, luego por ciudad dentro del mismo país. Una consulta `WHERE pais = 'MX'` puede usarlo eficientemente porque sabe dónde empieza y termina el rango de México en el árbol. Una consulta `WHERE ciudad = 'Guadalajara'` sin filtrar por país no puede: los valores de Guadalajara están dispersos en todo el árbol, intercalados entre ciudades de otros países. El orden de las columnas en un índice compuesto no es un detalle de estilo: es la diferencia entre O(log n) y O(n).

**El análisis de vuelos a 2.5 GB** que implementé en el proyecto [flight-analytics](/blog/flight-analytics-pg-bq/) ilustra esto en práctica. Con tablas de esa escala, la presencia o ausencia de un índice sobre las columnas de filtrado frecuente determina si una consulta tarda 200 ms o 40 segundos. El plan de ejecución de PostgreSQL (`EXPLAIN ANALYZE`) muestra exactamente cuántos nodos del árbol se recorrieron, cuántas páginas se leyeron de disco, y si se usó el índice o se hizo un sequential scan. Esa información es la diferencia entre optimizar con evidencia o adivinar.

## El costo que no aparece en el `SELECT`

Los índices de árbol B no son gratuitos. Cada inserción en la tabla es también una inserción en cada índice definido sobre ella. Si hay 5 índices sobre una tabla, una inserción escribe en 6 lugares: la tabla más los 5 árboles. Las divisiones de nodo son costosas porque requieren escribir múltiples páginas y actualizar el nodo padre.

El Write Amplification, el problema de que una escritura lógica produce múltiples escrituras físicas, es una razón importante por la que los sistemas OLAP (cargas de trabajo analíticas con muchas escrituras masivas) frecuentemente prefieren otras estructuras. Los Log-Structured Merge Trees (LSM Trees), usados por RocksDB, Cassandra y ClickHouse, sacrifican el rendimiento de lectura aleatoria a cambio de escrituras mucho más eficientes: en lugar de navegar el árbol y dividir nodos, escriben secuencialmente en un buffer en memoria y consolidan en disco en background.

El árbol B es la elección correcta cuando las lecturas son la operación dominante, los datos se actualizan pero no en cargas masivas continuas, y las consultas de rango son frecuentes. Es la mayor parte de las cargas OLTP: aplicaciones transaccionales, sistemas de reservas, bases de datos de pólizas, registros de siniestros.

## Qué cambia cuando lo entiendes

El `EXPLAIN ANALYZE` de PostgreSQL tiene una línea que dice `Index Scan using idx_nombre on tabla`. Detrás de esa línea hay un recorrido del árbol B: baja desde la raíz hasta el nodo hoja correspondiente, recupera el puntero al heap donde vive la fila real, y la lee. Si la consulta recupera muchas filas dispersas en el heap, PostgreSQL puede decidir que un sequential scan es más eficiente que muchos accesos aleatorios por árbol: ese umbral lo controla `enable_indexscan` y los parámetros de costo del planificador.

Entender la estructura del árbol hace que esas decisiones del planificador dejen de ser cajas negras. Cuando el planificador elige un sequential scan sobre un índice disponible, no es un error: está calculando que el costo de recorrer el árbol más el costo de los heap fetches aleatorios supera el costo de leer el archivo de la tabla en secuencia. Para tablas pequeñas o consultas con selectividad baja, eso es correcto.

La siguiente vez que una consulta tarde más de lo esperado, el árbol B es el primer lugar donde mirar. ¿Hay un índice en las columnas del filtro? ¿El orden de las columnas en el índice compuesto coincide con la selectividad de los filtros habituales? ¿El índice existe pero el planificador lo ignora porque la tabla tiene estadísticas desactualizadas? (`ANALYZE` resuelve eso.) Esas preguntas ya no son abstractas cuando se tiene el modelo mental de qué está pasando adentro.

El [B-Tree Explorer](https://github.com/GonorAndres/b-trees) que construí en Rust y compilé a WebAssembly permite ver en tiempo real cómo se divide un nodo, cómo sube la clave del medio al padre, y cómo la altura del árbol crece de forma controlada. No como un tutorial de estructuras de datos, sino como una herramienta para desarrollar la intuición que hace mejores las decisiones de diseño de índices.
