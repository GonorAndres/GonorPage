---
title: "GMM Explorer: Tres Niveles de Hospitalización para Tarificar lo que la Industria Trata como un Solo Riesgo"
description: "Cómo clasificar 5.1M de siniestros de Gastos Médicos Mayores en tres niveles de hospitalización cambia la forma de tarificar un riesgo que la industria trata como uno solo. Un proyecto de equipo en la UNAM que se convirtió en un sistema de tarificación completo."
date: "2026-03-21"
lastModified: "2026-07-12"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
ficha:
  rol: "Autor principal, proyecto académico UNAM (equipo)"
  año: "2026"
  stack: "Python · Next.js · Recharts · shadcn/ui · Claude AI"
  datos: "CNSF (5.1M siniestros GMM, 2020-2024)"
  regulacion: "LISF Art. 201 · CUSF 15.3-15.8 · CNSF"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/gmm-explorer"
  live: "https://gmm-explorer.vercel.app/contexto"
tags: ["GMM", "tarificación", "CNSF", "hospitalización", "Claude AI", "frecuencia-severidad", "credibilidad", "LISF", "Next.js", "Python"]
---

Este proyecto empezó como un trabajo final en equipo para una materia de la Facultad de Ciencias en la UNAM. Construimos un sistema de clasificación y tarificación de Gastos Médicos Mayores usando datos abiertos de la CNSF. El resultado original funcionaba, pero los números no me convencían: la clasificación de diagnósticos con Random Forest daba 59% de exactitud, y sobre esa base cualquier cálculo de prima arrastra error. Retomé el proyecto después, rehice la clasificación con un enfoque distinto y afiné el pipeline de tarificación. El resultado actual es materialmente mejor, y con más trabajo dedicado puede seguir mejorando.

La pregunta de fondo es sencilla: la industria de GMM en México tarifica el riesgo como un solo bloque. Una cesárea electiva y un tratamiento oncológico alimentan el mismo promedio de costo. Los datos de la CNSF, 5.1 millones de siniestros y 95.9 millones de asegurados-año entre 2020 y 2024, muestran por qué eso es un problema. El nivel ambulatorio representa el 46.5% de los siniestros pero apenas el 19.9% del monto pagado. El nivel de alta especialidad genera el 26% del gasto con solo el 12.9% de los eventos. Son poblaciones de riesgo fundamentalmente distintas tratadas como si fueran la misma, y lo que aún no sabemos es igual de importante: la forma de la distribución de severidad en cada nivel. El Nivel 3 casi seguro tiene colas más pesadas que el Nivel 1; el Nivel 2 es territorio desconocido en cuanto a curtosis y forma distribucional. Entender esas colas cambiaría no solo la tarificación sino las decisiones de reserva.

GMM Explorer construye la clasificación que le falta a ese análisis: 9,409 diagnósticos distribuidos en tres niveles de hospitalización, frecuencias y severidades por edad individual y sexo, y un tarificador interactivo desplegado en Vercel.

## Los tres niveles

La clasificación no es arbitraria; refleja cómo difieren los recursos médicos que consume cada evento.

**Nivel 1 - Ambulatorio:** Consultas, estudios de laboratorio, odontología, gastroenteritis, enfermedades respiratorias menores. El paciente entra y sale sin hospitalización formal. Representa el 46.5% de los siniestros y el 19.9% del gasto total. Severidad promedio: entre \$23,846 y \$26,651 según sexo.

**Nivel 2 - Hospitalario:** Parto por cesárea electiva, colecistectomía, cirugía programada de columna, COVID-19 moderado. El paciente requiere cama hospitalaria pero sin cuidados críticos. Concentra el 40.6% de los siniestros y el 54.1% del gasto. Severidad promedio: entre \$71,695 y \$86,593.

**Nivel 3 - Alta Especialidad:** Oncología, infarto agudo, cirugía cardiaca, hemorragias, trasplantes, unidad de cuidados intensivos. El 12.9% de los eventos consume el 26% del monto total pagado. Severidad promedio: entre \$115,818 y \$121,996.

La diferencia de severidad entre el Nivel 1 y el Nivel 3 es de 4.5 a 5 veces. Promediar esos dos mundos no produce una estimación central robusta; produce un número que subestima el costo real de los asegurados con enfermedades graves y sobretarifica a los que solo usan el seguro para consultas y estudios rutinarios. El artículo 201 de la LISF exige que la nota técnica demuestre suficiencia de prima; tarifar sin esta distinción hace esa demostración técnicamente débil. Los capítulos 15.3 a 15.8 de la CUSF, que gobiernan específicamente el ramo de GMM, dan el marco regulatorio que justifica la segmentación por nivel de hospitalización.

## Clasificar 9,409 diagnósticos

El catálogo de causas de atención médica de la CNSF no viene etiquetado. Son nombres en texto libre, parcialmente alineados con la CIE-10, con inconsistencias en mayúsculas, abreviaciones y caracteres especiales. Clasificar esos 9,409 diagnósticos requirió dos fases.

**Fase 1:** El equipo construyó manualmente un estándar de referencia de 1,500 causas clasificadas. El ejercicio revela de inmediato dónde está la ambigüedad. "PARTO POR CESÁREA ELECTIVA" es claramente Nivel 2: hospitalización programada sin complicación. "TUMOR MALIGNO DEL PEZÓN" es Nivel 3 por definición. "COVID-19" no tiene una respuesta única: el caso leve que se resuelve con medicamento ambulatorio es Nivel 1; el caso que termina en ventilador es Nivel 3. El juicio clínico sobre el diagnóstico más frecuente, no el caso más grave, define la asignación.

**Fase 2 original:** TF-IDF con vocabulario de 5,000 términos y n-gramas de 1 a 3, combinado con Random Forest de 200 árboles. Exactitud: 59%. F1-macro: 58.8%. El modelo aprendió patrones de texto, pero la severidad médica no está en el texto de la misma forma en que una etiqueta de producto vive en sus keywords. "APENDICITIS AGUDA CON PERITONITIS" y "APENDICITIS AGUDA SIN COMPLICACIÓN" comparten las mismas palabras principales; el diferenciador es el contexto clínico que el modelo no tiene cómo capturar. Con 59% de exactitud, el 41% de los siniestros quedan en el nivel incorrecto, contaminando tanto las frecuencias como las severidades de los tres niveles.

**Fase 2 revisada:** Clasificación de los 7,909 diagnósticos restantes con Claude AI. La diferencia es que Claude entiende terminología médica, reconoce la gradación de severidad entre diagnósticos relacionados, y puede interpretar descripciones en español con variaciones ortográficas. Ejemplos concretos: "COLECISTECTOMÍA" va al Nivel 2 porque es una cirugía programada de vesícula; "APENDICITIS AGUDA CON PERITONITIS" va al Nivel 3 porque la peritonitis es una complicación quirúrgica de emergencia; "CARIES DENTAL" va al Nivel 1 porque es atención odontológica rutinaria. Confianza promedio de clasificación: 82.5%. Cobertura: 100% de los siniestros.

Los proyectos tienen ciclos de vida. El equipo construyó el pipeline de datos, el estándar de referencia manual, el dashboard y el despliegue en Vercel. La revisión de la clasificación llegó después, cuando quedó claro que 59% de exactitud era insuficiente para que la tarifa tuviera sustento actuarial. La distancia entre "funciona" y "es correcto" requiere método, conocimiento del dominio y disposición para revisar lo que ya estaba construido.

## El pipeline de tarificación

La idea central es simple: la prima de riesgo es el producto de qué tan seguido ocurre un siniestro (frecuencia) por cuánto cuesta cuando ocurre (severidad).

$$\text{Prima de Riesgo} = \text{Frecuencia} \times \text{Severidad}$$

La frecuencia se calcula como el número de siniestros entre los asegurados expuestos, segmentada por edad individual (25 a 70), nivel de hospitalización y sexo. La severidad es el costo promedio por siniestro en esa misma celda. La matriz resultante tiene 276 celdas: 46 edades por 3 niveles por 2 sexos.

Un ajuste importante: la inflación médica en México supera consistentemente la inflación general. Todos los montos se ajustaron a pesos de 2024 con factores anuales que van desde ×1.41 para 2020 hasta ×1.00 para 2024. El ajuste total incrementó el monto agregado 18.9%, de \$179.7 mil millones a \$213.6 mil millones. Sin ese paso, las severidades históricas subestiman el costo real de siniestros futuros.

Sobre la prima de riesgo se aplica una carga del 40% que cubre administración (20%), adquisición (10%) y utilidad (10%), y se convierte a mensualidad con una tasa técnica del 10% anual basada en TIIE. Los porcentajes de carga son parámetros del modelo; en una nota técnica real se justifican con la estructura de gastos de la aseguradora.

Un dato que vale la pena resaltar: las 276 celdas de la matriz superan el umbral mínimo de 30 siniestros para credibilidad plena. Eso es inusual. La mayoría de las aseguradoras no tiene suficiente exposición propia para alcanzar credibilidad completa en todos sus rangos de edad y sexo. El tamaño del universo CNSF es la ventaja de este análisis.

## Lo que revela el gradiente por edad

El hallazgo más contundente del análisis no es el promedio; es la pendiente. Entre los 25 y los 70 años:

- Nivel 3 hombres: la prima de riesgo se multiplica **22.6 veces**
- Nivel 3 mujeres: **13.9 veces**
- Nivel 2 hombres: **6.9 veces**; mujeres: **4.2 veces**
- Nivel 1 hombres: **7.1 veces**; mujeres: **2.9 veces**

El Nivel 3 masculino tiene la pendiente más pronunciada del sistema. Cáncer, eventos cardiovasculares agudos y complicaciones quirúrgicas mayores se aceleran de forma exponencial con la edad, y ese aceleramiento es más rápido en hombres que en mujeres pasados los 55 años. Eso tiene una consecuencia directa para la tarificación: el gradiente por edad no es el mismo entre niveles. Un esquema de tarificación que mezcla niveles aplica implícitamente un subsidio cruzado: los asegurados jóvenes que generan siniestros ambulatorios financian, en parte, el riesgo de alta especialidad de los mayores. Ese subsidio es invisible en la tarifa pero visible en el resultado técnico.

Las diferencias por sexo también tienen patrón. Las mujeres presentan mayor frecuencia en los niveles 1 y 2 (salud materna, atención preventiva), pero los hombres exhiben mayor severidad en los niveles 2 y 3 (cardiovascular, trauma mayor). La prima neta por nivel y edad captura esa interacción de forma que ningún promedio general puede.

## El dashboard

Cinco secciones forman el entregable final:

**/siniestros:** Explorador de siniestros con filtros por año, edad, sexo y nivel de hospitalización. Permite navegar la distribución de montos, frecuencias y tendencias año a año sobre el universo de 4.7 millones de registros filtrados.

**/polizas:** Explorador de pólizas con gráficas de barras apiladas, pastel y serie de tiempo. Visualiza cómo evoluciona la distribución de asegurados por nivel y cómo cambia la exposición entre 2020 y 2024.

**/tarificador:** Calculadora interactiva. El usuario selecciona edad y sexo; el sistema devuelve las tres primas mensuales, una por nivel de hospitalización. Es el entregable que un equipo de suscripción entregaría a los actuarios de tarificación.

**/metodologia:** Documentación técnica completa del pipeline: supuestos, fuentes, ajustes por inflación, factores de credibilidad y carga de gastos.

**/contexto:** Resumen de la nota técnica y contexto del proyecto.

La arquitectura es Next.js 14 App Router con Recharts y shadcn/ui. Todos los datos son JSON importado estáticamente; no hay API en tiempo de ejecución. El proceso de build genera los cálculos actuariales una sola vez, lo que hace el despliegue en Vercel trivial y el tiempo de respuesta instantáneo.

## Conexiones con el portafolio

La lógica de tarificación de GMM Explorer ocupa un lugar específico dentro de un ciclo actuarial más amplio.

[SIMA](/blog/sima) implementa el mismo marco regulatorio (LISF/CUSF) pero para seguros de vida. Donde GMM Explorer usa tablas de morbilidad por nivel de hospitalización, SIMA usa tablas de mortalidad proyectadas con Lee-Carter. Los dos proyectos son instancias del mismo principio: la prima debe reflejar la probabilidad de ocurrencia del evento asegurado y su costo esperado, ambos estimados con rigor estadístico y con fundamento en datos reales.

El [dashboard de reservas P&C](/blog/insurance-claims-dashboard) responde la pregunta retrospectiva: cuánto reservar para siniestros que ya ocurrieron y aún no se han pagado del todo (IBNR). GMM Explorer responde la contraparte prospectiva: cuánto cobrar antes de que ocurra cualquier siniestro. Son el lado izquierdo y el lado derecho del mismo balance actuarial.

[Pricing de seguros con ML](/blog/actuarial-ml-pricing) aplica la misma descomposición frecuencia-severidad al seguro de auto con GLMs y gradient boosting sobre el dataset freMTPL2. La diferencia de enfoque es sustantiva: en auto, la segmentación de riesgo viene del perfil del conductor y el vehículo; en GMM, el diferenciador más importante es el tipo de evento médico. GMM Explorer añade la dimensión de nivel de hospitalización y usa clasificación con IA como método de segmentación en lugar de variables de entrada al modelo.

La [plataforma de siniestralidad auto](/blog/cartera-autos) usa el mismo producto Frecuencia × Severidad para tarificar, pero sobre datos sintéticos calibrados al mercado mexicano. La diferencia de cola importa: en autos, el desarrollo de siniestros se cierra en cuatro años; en GMM, las condiciones crónicas pueden generar reclamaciones durante años. Esa asimetría en el patrón de desarrollo es una de las razones por las que los modelos de reserva de GMM son más complejos que los de daños.

## Limitaciones y lo que sigue

La clasificación con Claude AI a 82.5% de confianza promedio es materialmente mejor que el 59% del Random Forest, pero no ha sido validada contra un estándar externo como codificadores médicos certificados o el catálogo oficial de la CIE-10. El 17.5% restante de clasificaciones con confianza baja es una fuente de error que podría concentrarse en diagnósticos poco frecuentes o terminología no estándar, justamente donde el impacto en la celda de tarificación podría ser mayor.

El rango de edad 25-70 excluye dos segmentos con comportamiento muy distinto: pediatría, donde los siniestros ambulatorios dominan y las frecuencias son altas pero las severidades bajas; y la población mayor de 70, donde el Nivel 3 se vuelve dominante y la prima crece con una pendiente que los datos del rango central no capturan bien.

El tarificador actual no modela la estructura del producto: suma asegurada, deducible, coaseguro y tipo de red médica son variables que modifican sustancialmente la prima técnica. Un plan con red cerrada y deducible de \$20,000 pesos tiene un perfil de riesgo muy diferente al plan con red abierta y primer peso. Esa capa de parametrización es necesaria para pasar de un precio de referencia a una tarifa comercialmente usable.

La credibilidad se aplicó como umbral binario (30 siniestros o más, crédito pleno). El enfoque Bühlmann-Straub daría un factor de credibilidad continuo $Z = n / (n + k)$ que reconoce la diferencia entre una celda con 50 siniestros y una con 500, en lugar de tratarlas igual.

La limitación más relevante para el siguiente paso es distribucional. El pipeline actual usa la severidad promedio por celda, pero el promedio esconde lo que realmente importa en seguros: la cola. El Nivel 3 casi seguro tiene colas más pesadas que el Nivel 1; un solo caso oncológico o de trasplante puede costar órdenes de magnitud más que la media de su celda. El Nivel 2 es territorio abierto: no sabemos cuál es la curtosis ni la forma de su distribución de severidad. Estudiar esas colas cambiaría el sistema de tarificación (la prima de riesgo debería incorporar un recargo por cola, no solo la media) y las decisiones de reserva (las reservas IBNR dependen de la forma distribucional, no del promedio).

Lo que haría diferente con más tiempo: usar directamente los códigos CIE-10 para la clasificación, eliminando la ambigüedad del texto libre; modelar frecuencia y severidad como funciones continuas de edad, sexo y nivel con un GLM o GBM en lugar de promedios por celda; y ajustar distribuciones de severidad por nivel (Pareto, lognormal o mixtura) para capturar la cola, que es donde vive el riesgo real.

## Preguntas frecuentes

### ¿De dónde salen los datos?

Los datos provienen de la información abierta de la CNSF: 5.1 millones de siniestros de Gastos Médicos Mayores y 95.9 millones de asegurados-año registrados entre 2020 y 2024. Es un universo lo suficientemente grande para que las 276 celdas de la matriz de tarificación superen el umbral de credibilidad plena, algo que la exposición interna de una sola aseguradora rara vez alcanza.

### ¿Qué metodología usa para calcular la prima?

La prima de riesgo se calcula como el producto de frecuencia por severidad, segmentado por edad individual (25 a 70), nivel de hospitalización y sexo, en una matriz de 276 celdas. Sobre esa prima de riesgo se aplica una carga de gastos del 40% (administración, adquisición y utilidad) y se convierte a mensualidad con una tasa técnica del 10% anual; todos los montos se ajustan previamente a pesos de 2024 para corregir la inflación médica.

### ¿Cómo se clasifican los diagnósticos en tres niveles?

Los 9,409 diagnósticos del catálogo de la CNSF se clasificaron en tres niveles de hospitalización combinando un estándar de referencia manual de 1,500 causas con clasificación asistida por Claude AI para las 7,909 restantes, alcanzando 82.5% de confianza promedio y 100% de cobertura. Este enfoque superó al modelo original de Random Forest, que solo lograba 59% de exactitud sobre texto libre.

### ¿Se puede usar en producción tal como está?

No; el tarificador entrega un precio de referencia, no una tarifa comercialmente usable. Todavía no modela la estructura del producto (suma asegurada, deducible, coaseguro, tipo de red), usa la severidad promedio por celda en lugar de la distribución completa, y la clasificación con IA no ha sido validada contra un estándar externo como codificadores médicos certificados o la CIE-10.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "inLanguage": "es",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿De dónde salen los datos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los datos provienen de la información abierta de la CNSF: 5.1 millones de siniestros de Gastos Médicos Mayores y 95.9 millones de asegurados-año registrados entre 2020 y 2024. Es un universo lo suficientemente grande para que las 276 celdas de la matriz de tarificación superen el umbral de credibilidad plena, algo que la exposición interna de una sola aseguradora rara vez alcanza."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué metodología usa para calcular la prima?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La prima de riesgo se calcula como el producto de frecuencia por severidad, segmentado por edad individual (25 a 70), nivel de hospitalización y sexo, en una matriz de 276 celdas. Sobre esa prima de riesgo se aplica una carga de gastos del 40% (administración, adquisición y utilidad) y se convierte a mensualidad con una tasa técnica del 10% anual; todos los montos se ajustan previamente a pesos de 2024 para corregir la inflación médica."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo se clasifican los diagnósticos en tres niveles?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los 9,409 diagnósticos del catálogo de la CNSF se clasificaron en tres niveles de hospitalización combinando un estándar de referencia manual de 1,500 causas con clasificación asistida por Claude AI para las 7,909 restantes, alcanzando 82.5% de confianza promedio y 100% de cobertura. Este enfoque superó al modelo original de Random Forest, que solo lograba 59% de exactitud sobre texto libre."
      }
    },
    {
      "@type": "Question",
      "name": "¿Se puede usar en producción tal como está?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No; el tarificador entrega un precio de referencia, no una tarifa comercialmente usable. Todavía no modela la estructura del producto (suma asegurada, deducible, coaseguro, tipo de red), usa la severidad promedio por celda en lugar de la distribución completa, y la clasificación con IA no ha sido validada contra un estándar externo como codificadores médicos certificados o la CIE-10."
      }
    }
  ]
}
</script>

## Cierre

El dashboard está desplegado en <a href="https://gmm-explorer.vercel.app/contexto" target="_blank" rel="noopener">Vercel</a> y el código está en <a href="https://github.com/GonorAndres/gmm-explorer" target="_blank" rel="noopener">GitHub</a>. La nota técnica completa está disponible desde la sección `/contexto` del dashboard.

El análisis muestra algo que va más allá de este proyecto concreto: cuando los datos existen y son lo suficientemente grandes, la pregunta de si una distinción de riesgo es real tiene respuesta empírica. La industria puede seguir tarificando GMM como un solo bloque, pero los datos de la CNSF ya no permiten argumentar que eso es una simplificación inocua.
