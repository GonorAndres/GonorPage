---
title: "Asistente de Regulación Actuarial: por qué RAG es el enfoque correcto para LISF y CUSF"
description: "Interpretar la LISF y la CUSF exige navegar entre artículos que se referencian mutuamente entre leyes, y un Ctrl+F no distingue el artículo que define reservas técnicas del que las menciona de paso. La IA permite absorber todo ese volumen sin perder un solo detalle. Este agente usa RAG para indexar cada artículo de forma individual con un grafo de referencias cruzadas, eliminando las alucinaciones de citas y permitiendo que el modelo razone solo sobre texto real de la ley. El resultado es un asistente que amplifica la memoria del actuario sin sustituir su criterio."
date: "2026-03-22"
lastModified: "2026-07-12"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Python · FastAPI · SQLite FTS5 · Claude API · React"
  datos: "LISF · CUSF (2,354 artículos indexados, 2,882 referencias cruzadas)"
  regulacion: "LISF · CUSF · CNSF"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/regulation-actuarial-agent"
  live: "https://actuarial-regulation-agent-451451662791.us-central1.run.app/"
  extraLinks:
    - { label: "Explorador LISF/CUSF", url: "https://actuarial-regulation-agent-451451662791.us-central1.run.app/explorer" }
    - { label: "Versión open-source (HuggingFace)", url: "https://huggingface.co/spaces/GonorAndres/lisf-agent" }
tags: ["RAG", "LISF", "CUSF", "CNSF", "FTS5", "BM25", "Claude", "FastAPI", "GCP", "referencias-cruzadas"]
---

La LISF y la CUSF son el marco regulatorio completo del sector asegurador y afianzador en México. Juntas suman más de mil artículos, y la complejidad no está solo en el volumen: está en las dependencias. El artículo 121 de la LISF habla de reservas técnicas, pero para entender qué reservas y cómo, necesitas las disposiciones del Título 5 de la CUSF. Un artículo de solvencia te remite a tres disposiciones sobre fondos propios admisibles, que a su vez referencian criterios de valuación en otro título. Un actuario que ha estudiado ambas leyes a fondo sigue olvidando detalles, sigue necesitando buscar "en cuál disposición estaba lo de cesión de cartera". Es la naturaleza del documento: demasiado extenso, demasiado interconectado para retener completo en la memoria humana.

Eso hace de la regulación actuarial un caso perfecto para un modelo de lenguaje. Un LLM puede tener el corpus completo disponible, nunca olvida un artículo, y puede razonar sobre relaciones entre disposiciones. La pregunta es cómo hacerlo sin que el sistema invente cosas.

## El problema con la búsqueda convencional

Ctrl+F en un PDF busca cadenas de texto. Si buscas "reservas técnicas", obtienes cada mención en el documento, sin distinción entre el artículo que define las reservas técnicas y los treinta artículos que las mencionan de paso. No hay noción de relevancia regulatoria, no hay peso por contexto, no hay forma de saber que el artículo 121 es el que realmente importa.

Para un actuario que ya sabe dónde buscar, esto funciona. Para consultas donde no recuerdas exactamente en qué título estaba la disposición, Ctrl+F es insuficiente.

## La primera versión: alucinaciones y lentitud

La versión inicial fue directa: cargar los capítulos de la LISF como archivos de texto, pasarlos al modelo y preguntar. El resultado fue predecible. El modelo fabricaba números de artículo con confianza total. Citaba "Artículo 247" cuando el artículo relevante era el 201. Las respuestas eran lentas porque el sistema escaneaba 275 archivos línea por línea con expresiones regulares. Y lo peor: no había forma de verificar si una cita era real sin ir al PDF original.

El problema de raíz es que el modelo no tiene acceso estructurado a la información. Sin un mecanismo de búsqueda que le entregue los artículos correctos, el modelo llena los huecos con su conocimiento general, y su conocimiento general de la regulación mexicana es impreciso.

## RAG: buscar primero, razonar después

Retrieval-Augmented Generation invierte el flujo. En lugar de pedirle al modelo que recuerde, le das un motor de búsqueda que encuentra los artículos relevantes primero. El modelo recibe texto real de la ley y razona sobre él. Si el sistema de búsqueda encuentra el artículo 121 cuando preguntas por reservas técnicas, el modelo cita el 121 porque lo está leyendo, no porque lo está inventando.

La calidad del RAG depende enteramente de la calidad del retrieval. Si la búsqueda falla, el modelo recibe artículos irrelevantes y produce respuestas irrelevantes (pero con citas reales, lo cual es mejor que citas inventadas). El trabajo pesado está en construir un índice que devuelva los artículos correctos.

## Los métodos que hacen funcionar el sistema

### Indexación por artículo, no por capítulo

La versión original indexaba 273 archivos de capítulo. Un capítulo de la CUSF puede tener 82 disposiciones, todas compartiendo las mismas 10 palabras clave. Cuando buscabas "reaseguro", el sistema devolvía el capítulo entero y el modelo tenía que encontrar la disposición relevante dentro de miles de líneas.

La solución fue dividir los capítulos en 2,354 archivos individuales, uno por artículo o disposición. Cada archivo tiene su propio frontmatter con metadatos específicos: ley, número, título, capítulo, tema, palabras clave, resumen y referencias cruzadas.

### BM25 con pesos por columna

No todas las columnas tienen el mismo valor para la búsqueda. El título del artículo importa más que una mención casual en el cuerpo. Las palabras clave, curadas específicamente para cada artículo, importan más que el título. El sistema usa FTS5 de SQLite con pesos BM25 diferenciados: título x5, texto x1, palabras clave x10, resumen de contexto x8. Esto significa que un artículo cuyas palabras clave coinciden con tu búsqueda aparece primero, incluso si otro artículo menciona el término más veces en su cuerpo.

### Palabras clave por artículo

Las palabras clave originales eran por capítulo: 82 disposiciones compartiendo las mismas 10 palabras. Eso significa que buscar por palabra clave no servía para distinguir un artículo de otro dentro del mismo capítulo. Después del enriquecimiento, cada artículo tiene sus propias palabras clave (máximo 15), y el 89.6% de los artículos tiene un conjunto único que lo diferencia del resto. "Cesión de cartera" como palabra clave ahora te lleva directamente al artículo que regula la cesión, no a un capítulo de 50 disposiciones donde la cesión se menciona una vez.

El enriquecimiento usó un pipeline de múltiples modelos: Sonnet procesó los 2,354 artículos extrayendo palabras clave y resúmenes del contenido real; después, Opus validó y refinó los resultados agrupados por Título, eliminando términos genéricos, corrigiendo clasificaciones y asegurando que las palabras clave fueran discriminantes dentro de su contexto regulatorio.

### Grafo de referencias cruzadas

La LISF y la CUSF se referencian mutuamente de forma constante. El artículo 121 de la LISF remite a disposiciones de la CUSF sobre reservas; disposiciones de la CUSF referencian artículos de la LISF sobre facultades de la CNSF. El sistema extrae y almacena 2,882 referencias cruzadas en una tabla indexada. Cuando buscas un artículo, el sistema automáticamente incluye sus referencias cruzadas más relevantes en el contexto que le pasa al modelo. Esto replica lo que un actuario experimentado hace mentalmente: "si estoy viendo el artículo 121, necesito también las disposiciones del Título 5 de la CUSF".

### Resúmenes de contexto

Cada artículo tiene un resumen que describe en lenguaje natural qué regula y por qué importa. Estos resúmenes pesan x8 en la búsqueda, lo que permite que consultas conceptuales (como "qué requisitos hay para fondos propios admisibles") encuentren artículos relevantes aunque la formulación exacta no aparezca en el texto legal.

## Resultados

Consultas como "modelo interno rcs", que antes no devolvían ningún artículo relevante, ahora encuentran directamente las disposiciones que regulan modelos internos para el requerimiento de capital de solvencia. Consultas sobre "fondos propios admisibles" o "reservas técnicas" devuelven los artículos centrales en lugar de menciones periféricas. El sistema pasó de escanear 275 archivos con regex (lento, impreciso) a consultas indexadas que responden en milisegundos.

## La interfaz

El frontend usa un diseño brutalista inspirado en Windows 98: barra de título, barra de menú, sidebar con la estructura completa de la LISF y la CUSF, y un área de conversación sin distracciones. La estética es intencional: es una herramienta de trabajo, no una demo bonita. La sidebar permite navegar por título y tema, con respuestas rápidas precalculadas para cada sección de ambas leyes.

<img src="/screenshots/regulation-agent-screenshot.png" alt="Interfaz del Asistente de Regulación Actuarial mostrando la barra lateral con estructura LISF/CUSF y el área de conversación" style="max-width: 100%; border: 3px solid #000; box-shadow: 4px 4px 0 #000; margin: 1rem 0;" />

## Explorador de regulación

El chat resuelve consultas que requieren razonamiento, pero no todas las consultas lo necesitan. A veces sabes exactamente qué artículo buscar, o quieres recorrer la estructura completa de un Título para entender qué disposiciones contiene. Para eso, el chat es un intermediario innecesario.

El Explorador es una interfaz de lectura directa para recorrer la LISF (510 artículos, 13 Títulos) y la CUSF (1,833 disposiciones, 35 Títulos) como un índice interactivo. El panel izquierdo muestra el árbol completo de cada ley: Títulos, Capítulos y artículos individuales. Al seleccionar uno, el panel derecho muestra el texto completo con sus referencias cruzadas como enlaces activos. Si la disposición 5.8.3 de la CUSF remite a un artículo de la LISF, el enlace te lleva directamente ahí sin salir de la interfaz. Un botón de regreso permite deshacer el salto y volver al punto de partida.

La barra de búsqueda filtra por número o tema en tiempo real. Las URLs son compartibles: `/cusf#5.8.3` abre directamente esa disposición, lo cual es útil para referenciar artículos específicos en correos o notas técnicas.

El Explorador y el chat RAG cubren necesidades distintas. Cuando la consulta es exploratoria ("¿qué hay en el Título 5?") o puntual ("necesito el artículo 237"), el Explorador es más directo. Cuando la consulta requiere razonamiento sobre múltiples disposiciones interrelacionadas ("¿cómo interactúan las reservas técnicas con los fondos propios admisibles?"), el chat sigue siendo la herramienta correcta.

<a href="https://actuarial-regulation-agent-451451662791.us-central1.run.app/explorer" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">Abrir el Explorador LISF/CUSF</a>

## Para quién es esta herramienta (y para quién no)

El asistente no es un sustituto para estudiar la LISF y la CUSF. No es una herramienta para alguien que no conoce la estructura regulatoria: si no sabes qué es el RCS, qué papel juegan las reservas técnicas, o cómo se organizan los títulos de la CUSF, las respuestas del sistema no van a tener sentido para ti.

Es una herramienta para actuarios y profesionales del sector que ya entienden el marco regulatorio y necesitan un asistente que les ayude a navegar su complejidad. Alguien que sabe que existe una disposición sobre cesión de cartera pero no recuerda en qué título está. Alguien que necesita verificar rápidamente las referencias cruzadas de un artículo antes de escribir una nota técnica. Alguien que está revisando los requisitos de solvencia y quiere confirmar que no está omitiendo una disposición relevante.

El juicio humano sigue siendo el factor más importante en la ecuación. El sistema busca, organiza y presenta. La interpretación regulatoria, la decisión sobre cómo aplicar un artículo a un caso específico, eso sigue siendo responsabilidad del profesional. Siempre.

## Conexión con otros proyectos

El asistente de regulación es complementario a <a href="/projects/sima" style="color: #C17654; text-decoration: underline;">SIMA</a>, que implementa los cálculos de capital bajo LISF (reservas, SCR, funciones de conmutación). Mientras SIMA ejecuta la matemática, el asistente navega la regulación que define qué matemática aplicar. También se conecta con la <a href="/projects/suite-actuarial" style="color: #C17654; text-decoration: underline;">Suite Actuarial</a>, que estandariza esos cálculos en una librería Python reutilizable, y con la <a href="/projects/life-insurance" style="color: #C17654; text-decoration: underline;">nota técnica de seguros de vida</a>, donde los requisitos regulatorios de la LISF y la CUSF se aplican a productos concretos.

El código está en <a href="https://github.com/GonorAndres/regulation-actuarial-agent" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">GitHub</a> y la aplicación está desplegada en <a href="https://actuarial-regulation-agent-451451662791.us-central1.run.app/" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">Google Cloud Run</a>.

<div style="background-color: #1B2A4A; padding: 1rem 1.5rem; border-left: 4px solid #C17654; margin-top: 2rem; font-size: 1.05rem;">
<strong style="color: #EDE6DD;">Código de acceso para probar la aplicación en vivo:</strong> <code style="background-color: #C17654; color: #EDE6DD; padding: 0.2rem 0.5rem; border-radius: 3px; font-weight: bold;">actuaria-claude</code>
</div>

## Versión abierta con modelo open-source

La versión principal del asistente usa Claude a través de la API de Anthropic, lo que ofrece la mejor calidad de respuesta pero tiene un costo por consulta. Para quienes quieran explorar la herramienta sin restricciones de acceso, existe una <a href="https://huggingface.co/spaces/GonorAndres/lisf-agent" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">versión desplegada en HuggingFace Spaces</a> que usa Qwen2.5-72B, un modelo open-source.

La diferencia en calidad es real: Qwen interpreta bien consultas directas sobre artículos específicos, pero en preguntas que requieren razonar sobre múltiples disposiciones interrelacionadas, Claude es notablemente más preciso. Para trabajo regulatorio serio, la versión con Claude sigue siendo la recomendación. Pero para familiarizarte con la estructura de la LISF y la CUSF, o para consultas rápidas cuando el presupuesto es limitado, la versión open-source es una alternativa funcional, sin código de acceso y sin límite de uso.

## Preguntas frecuentes

### ¿Qué leyes cubre el asistente?

El asistente cubre la LISF (510 artículos en 13 Títulos) y la CUSF (1,833 disposiciones en 35 Títulos), el marco regulatorio completo del sector asegurador y afianzador en México. En total indexa 2,354 artículos individuales y 2,882 referencias cruzadas entre ambas leyes.

### ¿Cómo evita las alucinaciones de citas?

El sistema usa RAG (Retrieval-Augmented Generation): primero un motor de búsqueda encuentra los artículos relevantes y luego el modelo razona únicamente sobre ese texto real de la ley. Así el modelo cita el artículo 121 porque lo está leyendo, no porque lo esté inventando, a diferencia de la primera versión que fabricaba números de artículo con confianza total.

### ¿Reemplaza el criterio del actuario?

No; el sistema busca, organiza y presenta, pero la interpretación regulatoria y la decisión sobre cómo aplicar un artículo a un caso concreto siguen siendo responsabilidad del profesional. Está pensado para amplificar la memoria de un actuario que ya conoce el marco, no para sustituir su juicio ni para reemplazar el estudio de la LISF y la CUSF.

### ¿Necesito conocimientos previos para usarlo?

Sí; es una herramienta para actuarios y profesionales del sector que ya entienden la estructura regulatoria. Si no sabes qué es el RCS, qué papel juegan las reservas técnicas o cómo se organizan los Títulos de la CUSF, las respuestas del sistema no van a tener sentido.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "inLanguage": "es",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué leyes cubre el asistente?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El asistente cubre la LISF (510 artículos en 13 Títulos) y la CUSF (1,833 disposiciones en 35 Títulos), el marco regulatorio completo del sector asegurador y afianzador en México. En total indexa 2,354 artículos individuales y 2,882 referencias cruzadas entre ambas leyes."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo evita las alucinaciones de citas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El sistema usa RAG (Retrieval-Augmented Generation): primero un motor de búsqueda encuentra los artículos relevantes y luego el modelo razona únicamente sobre ese texto real de la ley. Así el modelo cita el artículo 121 porque lo está leyendo, no porque lo esté inventando, a diferencia de la primera versión que fabricaba números de artículo con confianza total."
      }
    },
    {
      "@type": "Question",
      "name": "¿Reemplaza el criterio del actuario?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No; el sistema busca, organiza y presenta, pero la interpretación regulatoria y la decisión sobre cómo aplicar un artículo a un caso concreto siguen siendo responsabilidad del profesional. Está pensado para amplificar la memoria de un actuario que ya conoce el marco, no para sustituir su juicio ni para reemplazar el estudio de la LISF y la CUSF."
      }
    },
    {
      "@type": "Question",
      "name": "¿Necesito conocimientos previos para usarlo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí; es una herramienta para actuarios y profesionales del sector que ya entienden la estructura regulatoria. Si no sabes qué es el RCS, qué papel juegan las reservas técnicas o cómo se organizan los Títulos de la CUSF, las respuestas del sistema no van a tener sentido."
      }
    }
  ]
}
</script>
