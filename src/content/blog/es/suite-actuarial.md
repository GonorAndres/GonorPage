---
title: "suite_actuarial: plataforma actuarial open-source para el mercado mexicano"
description: "No existe una librería actuarial de código abierto pensada para la regulación mexicana. suite_actuarial llena ese vacío: cubre ocho dominios de seguros (vida, daños, salud, pensiones, reservas, reaseguro, regulatorio y configuración) con la EMSSA-09, circulares CNSF y artículos SAT integrados desde el diseño. Se instala con pip, se despliega con Docker, y expone 28 endpoints REST junto con un dashboard bilingüe en Next.js."
date: "2026-03-19"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Python · Pydantic · FastAPI · Next.js · React · Docker"
  datos: "EMSSA-09 · AMIS · parámetros CNSF"
  regulacion: "LISF · CUSF · CNSF (RCS) · SAT (ISR) · Circular S-11.4"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/suite-actuarial"
  live: "https://suite.gonor.me"
tags: ["Python", "Pydantic", "LISF", "CUSF", "CNSF", "RCS", "Reservas", "Chain Ladder", "Reaseguro", "Next.js", "EMSSA-09", "SAT", "FastAPI", "GMM", "IMSS"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/suite-actuarial.webp"
heroAlt: "Un núcleo modular de cálculo actuarial conecta la misma lógica con una biblioteca, una interfaz de servicio y un tablero."
heroCaption: "Una base común de cálculos y parámetros permite reutilizar la lógica actuarial desde distintas interfaces."
---

Si un actuario en México quiere calcular una prima de vida temporal con la EMSSA-09, tiene dos opciones: una hoja de Excel heredada del área técnica, o escribir todo desde cero. Existen librerías actuariales en Python (`chainladder`, `lifelines`, `pyliferisk`), pero ninguna integra la regulación mexicana: no saben lo que es una EMSSA-09, no calculan el RCS conforme a la LISF, no aplican los artículos 93, 142, 151 y 158 de la Ley del ISR para determinar deducibilidad fiscal. La regulación mexicana tiene requisitos que no existen en ningún otro mercado, y el software disponible asume que el usuario adaptará las fórmulas genéricas a su jurisdicción.

**suite_actuarial** es una plataforma actuarial de código abierto construida desde cero para la regulación mexicana. Se puede usar de tres formas: como librería Python (`pip install`), como API REST (28 endpoints vía FastAPI), o como aplicación web con calculadoras interactivas (Next.js 16 bilingüe ES/EN). Ocho dominios de seguros en un solo paquete, con la tabla EMSSA-09 empaquetada como dato del módulo, validación Pydantic v2 en cada entrada y precisión `Decimal` en cada cálculo.

## Por qué open-source

El mercado asegurador mexicano opera bajo la LISF y la CUSF, pero las herramientas actuariales que implementan esas reglas viven en hojas de cálculo privadas dentro de cada compañía. Cada aseguradora reinventa las mismas funciones de conmutación, los mismos triángulos de desarrollo, las mismas validaciones de RCS. No hay una base compartida.

Una librería open-source cambia esa dinámica. Un estudiante de actuaría puede instalar `suite_actuarial` y calcular una prima de vida temporal en cinco líneas de código. Un actuario en una aseguradora puede validar sus cálculos de RCS contra una implementación independiente. Un equipo de datos puede integrar tarificación y reservas en un pipeline automatizado llamando endpoints REST. El código está abierto, las fórmulas son auditables, y las pruebas verifican que los resultados coinciden con las tablas publicadas.

## Los ocho dominios

### Vida

Temporal, ordinario (vida entera) y dotal, construidos sobre la EMSSA-09 con tarificación por principio de equivalencia a tasa técnica del 5.5%. Factores de prima fraccionaria calculados con UDD.

Un hombre de 35 años con \$1,000,000 MXN de suma asegurada en un temporal a 20 años paga \$2,024 de prima neta y \$2,388 de prima total. Desglose de recargos: administración \$101, adquisición \$202, utilidad \$60.

### Daños

Autos, incendio y responsabilidad civil. La tarificación de automóviles está calibrada con datos de la AMIS: frecuencia base, severidad promedio, loss ratio objetivo y sistema Bonus-Malus por historial de siniestralidad. Incendio usa tabla de tasas por tipo de construcción y zona de riesgo. Responsabilidad civil calcula frecuencia y severidad por tipo de cobertura. Un modelo colectivo agrega siniestros con distribuciones Poisson-Gamma y Poisson-Lognormal (Monte Carlo), y credibilidad Bühlmann ajusta las primas cuando el historial del asegurado es corto.

### Salud

Gastos Médicos Mayores con tarificación por bandas quinquenales de edad, zona geográfica y nivel hospitalario, ajustando por deducible y coaseguro. El módulo también cubre accidentes y enfermedades como producto separado.

### Pensiones

IMSS Ley 73 (beneficio definido) y Ley 97 (Afore), rentas vitalicias y tablas de conmutación completas. El dashboard muestra régimen, semanas cotizadas, salario promedio diario, porcentaje de pensión, factor de edad, pensión mensual y anual con aguinaldo. Este módulo comparte lógica actuarial con el <a href="/blog/pension-simulator/" style="color: #C17654; text-decoration: underline;">simulador de pensión</a>, pero integrado dentro de la librería para conectarse con los demás dominios.

### Reservas

Chain Ladder, Bornhuetter-Ferguson y Bootstrap estocástico con percentiles. El Bootstrap entrega una distribución completa de reservas posibles: si P50 = \$2.5M y P75 = \$3.1M, la decisión de cuánto capital mantener se informa con la cola de la distribución.

### Reaseguro

Cuota parte (cesión proporcional), exceso de pérdida (protección contra siniestros grandes, con reinstatements) y stop loss (protección agregada de cartera). Un `model_validator` verifica que el límite sea mayor que la retención; en hojas de cálculo, esa condición se viola con más frecuencia de la que uno quisiera admitir.

### Regulatorio

RCS con tres módulos de riesgo (vida, daños, inversión) agregados con la matriz de correlación de la CNSF. Deducibilidad fiscal por artículos 93, 142, 151 y 158 de la LISR. Retenciones de ISR sobre rendimientos de seguros dotales. Reservas técnicas conforme a la Circular S-11.4.

### Configuración

Parámetros regulatorios versionados por año fiscal: 2024, 2025 y 2026. Valores de UMA, tasas del SAT (ISR personas morales, IVA, retenciones), factores CNSF y parámetros técnicos actuariales. Agregar un año nuevo al sistema consiste en crear un archivo de configuración.

## Tres formas de uso

La misma lógica actuarial se expone de tres maneras:

**Como librería.** `from suite_actuarial import VidaTemporal, TablaMortalidad` y cinco líneas de código para obtener una prima. Los datos de mortalidad viajan empaquetados con el módulo; no hay que descargar archivos externos.

**Como API.** Endpoints REST organizados por dominio, con documentación Swagger en `/docs`. Un sistema de cotización llama al endpoint de tarificación, un proceso batch calcula reservas para toda una cartera, un pipeline de datos ejecuta validaciones regulatorias.

**Como dashboard.** Una aplicación web bilingüe (ES/EN) con calculadoras interactivas para cada dominio. Cada página muestra los resultados clave del cálculo con tablas de detalle y descarga CSV. `docker-compose up` levanta la API y el frontend juntos.

## Por qué estandarizar

Cuando cada aseguradora implementa sus propias funciones de conmutación, sus propios triángulos de desarrollo y sus propias validaciones de RCS, los errores se replican en silencio. Un bug en una fórmula de reserva técnica puede vivir años dentro de un Excel que nadie audita porque "siempre ha dado resultados razonables". Una base de código compartida invierte esa dinámica: si alguien encuentra un error en la función de conmutación, la corrección beneficia a todos los que usan la librería. Si alguien implementa un método de reserva más eficiente, todos acceden a esa mejora con un `pip install --upgrade`.

Estandarizar también reduce la barrera de entrada. Un actuario recién egresado puede empezar a trabajar con herramientas cuyas fórmulas están verificadas contra las tablas EMSSA-09 publicadas, en lugar de heredar un Excel sin documentación. Un equipo de datos puede integrar cálculos actuariales en un pipeline automatizado sin reescribir la lógica desde cero. La complejidad del dominio no desaparece, pero la infraestructura deja de ser un obstáculo.

## Lo que falta

Esta librería cumple su propósito técnico: las pruebas pasan, los cálculos coinciden con las tablas publicadas, la API responde, el dashboard funciona en dos idiomas. Pero una librería open-source solo es exitosa cuando la usa alguien más. Hasta ahora, suite_actuarial tiene un solo autor y cero contribuidores externos.

El siguiente paso es que un actuario en otra aseguradora reporte un bug, o que un estudiante proponga un nuevo producto, o que alguien adapte el módulo de pensiones para un caso que yo no contemplé. También hay decisiones de diseño que solo alguien con experiencia operativa puede cuestionar: si las tasas base de GMM reflejan el mercado real o son aproximaciones optimistas, si el modelo colectivo necesita una distribución que no incluí, si el cálculo de RCS maneja correctamente un caso regulatorio que nunca he visto en la práctica. Esos son los detalles que no se encuentran con pruebas unitarias sino con uso real. Ese es el momento en que el código deja de ser un proyecto personal y se convierte en infraestructura compartida. El repositorio tiene `CONTRIBUTING.md`, la arquitectura está documentada, y cada módulo se puede probar de forma aislada. La invitación está abierta.

## Conexiones

La suite conecta con otros proyectos del portafolio. <a href="/blog/sima/" style="color: #C17654; text-decoration: underline;">SIMA</a> construye su propio pipeline de mortalidad desde datos del INEGI vía Lee-Carter; con la suite como módulo, ese pipeline podría reutilizar las funciones de conmutación y el cálculo de RCS que ya están validados. El <a href="/blog/regulation-agent-rag/" style="color: #C17654; text-decoration: underline;">asistente de regulación</a> navega la LISF y la CUSF para encontrar las disposiciones; esta suite implementa la matemática que esas disposiciones definen.

<div style="margin-top: 2rem; padding: 1rem 1.5rem; border-left: 4px solid #C17654; background-color: #f9f6f2;">
  <p style="margin: 0 0 0.5rem 0;"><strong>Repositorio:</strong> <a href="https://github.com/GonorAndres/suite-actuarial" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">github.com/GonorAndres/suite-actuarial</a></p>
  <p style="margin: 0;"><strong>Aplicación en vivo:</strong> <a href="https://suite.gonor.me" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">suite.gonor.me</a></p>
</div>
