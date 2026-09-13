---
title: "Construyendo un Transformer desde cero: La Máquina de Atención de Proust"
description: "Quería entender qué pasa realmente dentro de un modelo de lenguaje. Construí uno desde la primera multiplicación de matrices, lo entrené con los 7 volúmenes de Proust, y lo que más me enseñó no fue la arquitectura sino lo que implica que todo sea números."
date: "2026-02-15"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Python · PyTorch · NumPy"
  datos: "7 volúmenes de \"En busca del tiempo perdido\" de Marcel Proust (7.15M caracteres)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/proust-attention"
  live: "https://huggingface.co/spaces/GonorAndres/proust-attention"
  extraLinks:
    - { label: "Demo interactiva (HuggingFace)", url: "https://huggingface.co/spaces/GonorAndres/proust-attention" }
tags: ["deep-learning", "transformers", "NLP", "PyTorch", "NumPy"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/proust-attention-machine.webp"
heroAlt: "Una secuencia de fichas pasa por una matriz de atención causal y produce probabilidades para la siguiente ficha."
heroCaption: "La atención combina el contexto anterior para calcular una distribución sobre el siguiente carácter."
---

La revolución de la IA ya llegó. Pero lo que me golpeó no fue que los modelos pudieran generar texto; fue que hablar con un modelo frontera se siente como hablar con alguien más capaz intelectualmente que la mayoría de las personas que conozco. No en términos de creatividad libre o espíritu salvaje, sino en capacidad de razonamiento, en conectar ideas, en mantener un argumento. Eso me hizo pensar: algo complejo tiene que estar pasando en esas GPUs. Algo que quiero entender.

Mi primer intento fue con TensorFlow. Seguí tutoriales, usé funciones de alto nivel, entrené modelos que "funcionaban". Pero todo se sentía como un "hello world": estaba usando herramientas sin entender qué hacían por dentro. Sabía la teoría general: los modelos de lenguaje predicen el siguiente token basándose en pesos entrenados, y los gradientes son la herramienta que ajusta esos pesos iteración tras iteración. Me parecía curioso que algo tan mecánico como descender por un gradiente pudiera producir algo que *parece* inteligencia. Pero el proceso es lento, requiere millones de operaciones, y ahí es donde entran las GPUs. Quería ver todo eso con mis propias manos.

Así que decidí construir un transformer desde cero. No usando `nn.TransformerEncoder` como caja negra, sino implementando cada multiplicación de matrices primero en NumPy puro, sin autograd, sin magia, para forzarme a entender cada operación antes de portarla a PyTorch.

## Por qué Proust

Proust es mi libro favorito. "En busca del tiempo perdido" tiene un estilo que no existe en nadie vivo hoy, ni siquiera en escritura personal. Esas oraciones que se extienden por párrafos enteros, con cláusulas subordinadas que se abren dentro de otras cláusulas, esa forma sentimental, melancólica y artística de hilar ideas... no está en mí, y diría que no está en la mayoría de las personas. No importa cuánto lo intente, no puedo imitar ese estilo. La longitud de las frases, el tono: es algo particular de Proust.

Eso hacía que el test fuera alto. Sabía que no iba a crear una máquina de Proust desde cero solo con GPUs. Pero quería saber qué tan lejos llegaría. Si el mecanismo de atención podía capturar algo de ese estilo tan particular, significaba que estaba funcionando de verdad. Y si no podía, que es lo más probable con un modelo pequeño, las limitaciones me iban a enseñar tanto como los aciertos.

Elegí trabajar a nivel de carácter en lugar de usar un tokenizador BPE. Con un vocabulario de apenas 94 símbolos (letras, acentos, puntuación), el modelo tiene que aprender *todo*, desde ortografía hasta sintaxis, puramente a partir de patrones estadísticos. Menos complejidad ajena a la atención, más claridad sobre qué está aprendiendo realmente.

## La construcción

Todo empezó en NumPy. Implementé la arquitectura completa: la lookup table de embeddings con codificación posicional sinusoidal (la fórmula original de "Attention Is All You Need"), las proyecciones Q, K, V de la atención multi-cabeza, el producto escalado con máscara causal, la concatenación de cabezas, los bloques transformer con feedforward y residual connections, y la layer normalization. Cada archivo incluye lo que llamé "Class Notes": bloques de comentario que explican el concepto *antes* del código, con la intención de que cualquier persona con álgebra lineal básica pueda seguir la lógica.

```python
# Atención: softmax(QK^T / sqrt(d_k)) * V
# Q, K, V son proyecciones lineales del input
# sqrt(d_k) escala los scores para evitar que el softmax sature
#   (cuando d_k es grande, los productos punto crecen en magnitud
#    proporcional a sqrt(d_k), empujando el softmax a regiones
#    con gradientes cercanos a cero)
```

La arquitectura es deliberadamente modesta: 419,840 parámetros en total, con una ventana de contexto de 256 caracteres, entrenable en unos 30 minutos con una T4 de Colab. La idea era que todo cupiera en una sola sesión gratuita.

Lo que más me ayudó fue rastrear la shape del tensor en cada capa: el texto entra como una secuencia de caracteres, se convierte en vectores, atraviesa los bloques de atención y termina como una distribución de probabilidad sobre el vocabulario. Anotar esas transformaciones línea por línea fue lo que hizo que el multi-head attention dejara de ser un concepto abstracto.

Una vez que la implementación NumPy estaba completa y cada operación se sentía sólida, el port a PyTorch fue mecánico. Mismos nombres de variables, misma estructura, solo cambiando `np.ndarray` por `torch.Tensor`. Todo el pensamiento ya había ocurrido en NumPy.

## Datos, entrenamiento y las horas de espera

El corpus tuvo su propia historia. La primera versión usaba 2 volúmenes de Project Gutenberg, y fue un desastre: ruido de OCR por todas partes, marcas de agua del editor, metadata filtrándose al texto. El vocabulario se infló a más de 200 caracteres lleno de basura que el modelo aprendía con la misma fidelidad que los patrones reales. La versión final usa los 7 volúmenes completos extraídos de archivos MOBI, nacidos digitales, sin artefactos de escaneo. Después de limpieza por whitelist: 7.15 millones de caracteres con un vocabulario de exactamente 94 símbolos.

Entrené con AdamW y cosine annealing, gradient clipping y un split 90/10. Después de 201,104 pasos sobre el corpus completo:

| Métrica | Valor |
|---------|-------|
| Loss de entrenamiento | 1.348 |
| Loss de validación | 1.192 |

Que el loss de validación sea menor que el de entrenamiento se explica por el dropout: durante entrenamiento se desactivan neuronas aleatoriamente, mientras que en validación el modelo usa toda su capacidad.

Las horas de espera mientras el modelo entrenaba fueron parte del aprendizaje. Ver cómo el loss bajaba, cómo la escritura mejoraba gradualmente: al principio puro ruido, después palabras sueltas en español, después frases con estructura. Con temperatura 0.8 y top-k 40, el modelo entrenado genera esto:

**Prompt**: "Mucho tiempo"
> Mucho tiempo verdad, sin sus muchos que esa cortina de los personas con las que el señor. Es que lo que el amor que acababa de propio de la imaginación y que había causado una gran modo de olvidarla o de vida reductamente el mío). Por eso, mi madre sistencia desconocida con frecuencia, no hubiera ido a consider

**Prompt**: "La memoria"
> La memoria y su pasad se sigue, por ejemplo, señora aun sin embargo, al menos encontrar a la Sra. de Guermantes me permanecía yo saber que el mismo seguro, pero en el que, si bien buscar con frecuencia venir a veces a un cual se debe tanto para salir y no podía hacer ella su disposición con la sociedad, por l

Los nombres de personajes aparecen correctamente (Swann, Guermantes, Sra.), aprendidos puramente de frecuencia estadística. La estructura gramatical del español está presente. Se percibe algo del estilo proustiano en las oraciones largas con cláusulas subordinadas. Pero la coherencia semántica se desvanece conforme la oración se alarga: empieza bien y pierde el hilo. Con 420K parámetros y un solo epoch de entrenamiento, eso era esperable.

## Lo que realmente entendí

Toda la parte técnica (los embeddings, la tokenización, las operaciones de atención) está documentada en detalle en el [repositorio](https://github.com/GonorAndres/proust-attention) con las Class Notes. Son demasiados detalles para exponer en un blog post, y el repositorio los explica mejor de lo que yo podría hacerlo aquí. Lo que quiero contar es lo que entendí *después* de construir todo eso.

Lo primero que me impactó es lo simple que es cuando lo piensas. El modelo es un tensor. Números. Y las relaciones y conexiones entre esos números crean outputs que tienen estructura, lógica, mensaje. Todo se reduce a multiplicaciones de matrices y una función de activación. Es demasiado simple si lo piensas desde lejos.

Pero ahí es donde se pone importante. Si estos pesos son solo números interconectados, entonces tienen vulnerabilidades enormes. Es como con las bombas: si sabes cómo desactivar una, sabes cómo construir una. Los tensores de un modelo de lenguaje tienen un potencial combinatorio tan grande que siempre va a ser imposible estar completamente seguro de que todas las conexiones entre pesos no tienen algo dañino escondido. No es cuestión de encontrar la vulnerabilidad; es que el espacio de posibilidades es más grande de lo que podemos inspeccionar.

Parte de lo que me llevó a construir este modelo fueron las posiciones públicas de Anthropic sobre seguridad en IA. No era una empresa diciendo que su producto era peligroso para vender más, sino ingenieros explicando en papers y entrevistas por qué modelos mucho más grandes que el mío les generaban preocupaciones que no podían resolver del todo. Me pregunté si eso era hype, paranoia corporativa, o algo genuino. Construir el modelo me dio mi propia respuesta. Cuando ves que todo se reduce a un tensor de números y que las relaciones entre esos pesos producen outputs con estructura y coherencia, entiendes por qué la frontera entre "útil" y "peligroso" es imposible de trazar con precisión. No hay una línea en la arquitectura que separe lo bueno de lo malo. Todo depende de qué aprendieron esos números durante el entrenamiento, y verificar eso exhaustivamente en un modelo de 420K parámetros ya es difícil; hacerlo con cientos de miles de millones es computacionalmente imposible. Las preocupaciones son válidas porque la arquitectura misma no ofrece garantías.

El proyecto no me dejó siendo experto en embeddings ni en clasificación de tokenización. Tampoco fue sobre la T4 gratuita de Colab ni sobre las horas esperando que terminara cada epoch. Lo que me llevé fue entender las causas y consecuencias que son invisibles cuando usas un modelo de lenguaje como usuario, las que están escondidas en los pesos de estos monstruos computacionales que tenemos hoy.

El escalamiento por la raíz de `d_k`, la máscara causal como matriz triangular de `-inf`, las residual connections que hacen entrenables los transformers profundos. Todo eso lo derivé y lo documenté en el código. Pero si tuviera que elegir una sola lección, no sería ninguna de esas. Sería la comprensión de que algo tan simple como un tensor puede producir algo que se siente intelectual, y que esa misma simplicidad es la razón por la que la seguridad en IA es un problema tan difícil.

## Qué sigue

El modelo no llegó a convergencia; 5 a 10 epochs más probablemente mejorarían la coherencia. Quiero probar pre-norm en lugar de post-norm, experimentar con un tokenizador BPE para capturar la morfología del español, y explorar las attention maps para entender qué patrones aprende cada head.

## Otros de mis usos con la IA

Entrenar desde cero es un extremo del espectro de especialización de modelos de lenguaje: el modelo aprende el dominio desde los pesos hacia arriba. El otro extremo es la recuperación, donde un modelo general se ancla a documentos específicos en tiempo de inferencia sin ningún reentrenamiento. El [asistente de regulación actuarial](/blog/regulation-agent-rag/) ocupa ese otro extremo: usa RAG para que un modelo frontera razone únicamente sobre el texto exacto de la LISF y la CUSF. Ambos enfoques responden la misma pregunta, cómo hacer que un modelo sepa lo que necesitas que sepa, pero con distintos compromisos entre costo, control y generalización.

## Actualización: demo interactiva en HuggingFace

El modelo entrenado está disponible como <a href="https://huggingface.co/spaces/GonorAndres/proust-attention" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">demo interactiva en HuggingFace Spaces</a>. Se puede escribir un prompt y generar texto directamente en el navegador, sin necesidad de clonar el repositorio ni configurar un entorno local. Es la forma más rápida de ver cómo se comporta el modelo con distintos prompts, temperaturas y valores de top-k.
