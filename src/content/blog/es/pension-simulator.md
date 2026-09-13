---
title: "Simulador de Pensión IMSS: Ley 73, Ley 97 y Fondo Bienestar en una Sola Herramienta"
description: "La mayoría de los trabajadores mexicanos no sabe bajo qué régimen de pensión cotiza ni cuánto recibirá al retiro, y la información oficial no simplifica la comparación entre Ley 73, Ley 97 y Fondo Bienestar. Este simulador implementa las tres fórmulas con datos actualizados (UMA, tablas CONSAR, mortalidad EMSSA 2009) y permite explorar escenarios con análisis de sensibilidad interactivo. El resultado es una estimación educativa que muestra qué controlas y qué no."
date: "2026-03-16"
category: "proyectos-y-analisis"
lang: "es"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "R · Shiny · bslib · Plotly · Docker"
  datos: "DOF (reforma 2020) · CONAPO · IMSS (constantes regulatorias 2025)"
  regulacion: "LSS (Ley 73 · Ley 97 · Art. 167) · CONSAR · Fondo de Pensiones para el Bienestar (DOF 2024)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/seguridad-social/tree/main/fondo_bienestar"
  live: "https://simulador-pension-d3qj5vwxtq-uc.a.run.app/"
tags: ["R", "Shiny", "IMSS", "AFORE", "Pensiones", "Ley 73", "Ley 97", "Fondo Bienestar", "seguridad social", "CONSAR"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/pension-simulator.webp"
heroAlt: "Dos recorridos convierten una historia laboral en pagos de pensión; el de ahorro individual incluye un complemento condicionado."
heroCaption: "El régimen define cómo se calcula la pensión; en el ahorro individual, el complemento depende de cumplir condiciones."
---

El sistema de pensiones mexicano es una acumulación de legislaciones superpuestas. Desde julio de 1997, dos regímenes del IMSS corren en paralelo. Los trabajadores que comenzaron a cotizar antes de esa fecha se pensionan bajo Ley 73, con una fórmula de beneficio definido ligada al salario y semanas trabajadas. Los que empezaron después de 1997 caen en Ley 97, donde cuentas AFORE individuales acumulan un saldo que se convierte en su pensión. Luego, en mayo de 2024, el gobierno publicó el decreto del Fondo de Pensiones para el Bienestar. Esta tercera capa complementa pensiones de trabajadores Ley 97 que ganan por debajo del promedio del IMSS. El resultado: tres conjuntos de reglas superpuestas, cada uno con sus propias fórmulas, requisitos y supuestos ocultos. Este simulador las calcula las tres en un solo lugar, con todas las tasas actualizadas a 2025.

## Dos leyes, tres escenarios

La Ley 73 usa una tabla de 23 tramos salariales (Artículo 167 de la LSS). Cada tramo recibe un porcentaje base (cuantía básica) más un incremento por cada año trabajado después de 500 semanas. Un trabajador con salario de 1.77 veces el mínimo y 1,500 semanas acumula 19 años de incrementos, rindiendo aproximadamente 73%. A los 65, recibe el 100% de ese cálculo. A los 60, el factor de cesantía lo reduce a 75%. El piso mínimo de pensión es un salario mínimo mensual: \$8,474 en 2025. El mecanismo es completamente determinista. Metes los mismos números, obtienes la misma respuesta, siempre.

La Ley 97 funciona diferente. El trabajador y patrón aportan cada mes a una cuenta AFORE individual. El saldo crece por el rendimiento real menos la comisión de la administradora. Al retirarse, la pensión viene de dividir el saldo acumulado entre los meses de esperanza de vida (retiro programado). Tres incógnitas impulsan el resultado: el rendimiento real de la AFORE, la densidad de cotización (qué fracción de los meses realmente cotizaste), y la tasa de comisión de la administradora. Si el saldo proyectado produce una pensión inferior a 2.5 UMAs mensuales (\$8,598 en 2025), el gobierno garantiza ese piso de todas formas.

El Fondo Bienestar añade una tercera capa, pero solo para trabajadores Ley 97 que cumplan cuatro condiciones: régimen Ley 97, al menos 65 años de edad, al menos 1,000 semanas cotizadas, y salario por debajo del umbral del Fondo (aproximadamente \$17,364/mes en 2025, indexado al salario promedio del IMSS). Para quienes califiquen, el Fondo cierra la brecha entre lo que paga la pensión AFORE y el 100% de su último salario, sujeto al tope del umbral.

## La reforma que cambia las cuentas

La reforma DOF de diciembre 2020 subió las aportaciones patronales al seguro de retiro en fases de 2023 a 2030. El cambio principal: las tasas CEAV (Cesantía en Edad Avanzada y Vejez) dejaron de ser un porcentaje plano. Ahora están escalonadas en 8 tramos salariales, medidos en UMAs. En el tramo más alto (4.01+ UMAs, aproximadamente \$13,600/mes y arriba), la tasa patronal CEAV sube de 4.241% en 2023 a 11.875% en 2030. La aportación del trabajador (1.125%) y el retiro patronal base (2%) no cambian.

Esto importa para las proyecciones AFORE. Usar una tasa plana durante toda la proyección subestima el saldo final entre 15 y 25 por ciento, dependiendo del tramo salarial y los años restantes. El simulador aplica la tasa correcta para cada año, usando datos del DOF. Incluye las 8 tablas de transición de 2023 a 2030, luego aplica la tasa de 2030 para años posteriores.

La misma reforma también cambió las semanas mínimas para calificar a pensión Ley 97. Empezó en 750 semanas en 2021 y sube 25 semanas cada año, llegando a 1,000 en 2031. En 2025, el requisito es 850 semanas. (Esto es aparte del piso de 1,000 semanas que el Fondo Bienestar mismo exige.)

## El Fondo de Pensiones para el Bienestar

El decreto del 1 de mayo de 2024 creó el Fondo para resolver un problema real. Las proyecciones de tasa de reemplazo para trabajadores Ley 97 son decepcionantes: típicamente 20 a 40 por ciento del último salario para quienes no hacen aportaciones voluntarias. El Fondo busca cerrar esa brecha para trabajadores en los tramos bajos y medios.

La fórmula es directa: complemento = mín(salario, umbral) - pensión AFORE. Si tu pensión AFORE es de \$5,000 y tu salario era de \$12,000, el complemento es \$7,000, para una pensión total de \$12,000 (100% de reemplazo). Si tu salario superaba el umbral, el complemento se calcula con el umbral como tope.

Pero la transparencia importa aquí. El Fondo se financia del presupuesto federal sin un impuesto dedicado ni reserva constituida. Su viabilidad fiscal a 20 o 30 años descansa en decisiones políticas que nadie puede prometer que sean permanentes. Elegí presentar el Fondo como un escenario posible, con avisos claros de que es una proyección bajo los supuestos de hoy y que mañana puede cambiar. Llamar garantizado al complemento sería engañoso. Mostrarlo como una posibilidad educativa es más honesto.

## Qué revelan los números

Toma un trabajador Ley 73 con salario de \$15,000/mes y 1,500 semanas en los registros. El simulador calcula una pensión de \$11,245/mes a los 65 años (75% tasa de reemplazo). Agrega Modalidad 40 (5 años al máximo SBC), y salta a \$17,694/mes; cuesta \$6,939/mes pero se recupera en 14 meses. La belleza de Ley 73: es predecible. Sin riesgo de mercado, sin sorpresas de déficit.

Ahora un trabajador Ley 97: mismo salario de \$15,000, \$300,000 de saldo AFORE actual, 800 semanas, rendimiento base 4% real. A los 65, el saldo proyecta \$1,624,910. El retiro programado divide eso entre 204 meses de esperanza de vida masculina, rindiendo \$7,965/mes. Eso está por debajo del piso legal de \$8,598/mes (2.5 UMAs), así que el piso aplica en su lugar. Agrega el Fondo Bienestar, y la pensión salta a \$15,000/mes. La brecha de \$6,401 entre el mínimo legal y el salario completo se cierra.

La brecha de género es brutal y matemática. Una mujer con el mismo salario de \$12,000, \$150,000 de saldo AFORE, y 600 semanas proyecta un saldo de \$1,011,005. Pero la esperanza de vida femenina es más larga (240 meses vs. 204 para hombres), así que el retiro programado es solo \$4,212/mes. El Fondo cierra la brecha hasta \$12,000, pero sin él, la penalización de género es casi 50 por ciento, pura matemática de esperanza de vida.

El análisis de sensibilidad entre escenarios conservador (3%), base (4%) y optimista (5%) muestra una dispersión de 30 a 40 por ciento en saldo final. Pero aquí está lo que me sorprendió: la variable que más mueve el resultado de Ley 97 no es la tasa de rendimiento, es la reforma de contribuciones 2020. Las tasas CEAV patronales casi se triplican de 2023 a 2030. Ese efecto compuesto sobre los años de trabajo le gana al rendimiento de mercado en impacto. Para Ley 73, el factor de cesantía se comporta como se espera: retirarse a los 62 da 85% de la cantidad a los 65 (aproximadamente \$10,588 vs. el completo \$12,456).

Un bug real atrapado en las pruebas: el simulador solía aceptar semanas por debajo de 500 para Ley 73. Con 300 semanas, calculaba una pensión que caía al piso mínimo (\$8,485). En realidad, los trabajadores con menos de 500 semanas no reciben pensión bajo Ley 73 en absoluto, solo una devolución en una sola exhibición de aportaciones. Por eso 126 tests unitarios importan. El bug apareció en el suite de pruebas, lo corregí, y se desplegó en el mismo ciclo. La validación está en producción ahora.

## Decisiones de ingeniería

La arquitectura mantiene el cálculo separado de la interfaz. Las fórmulas para Ley 73/97 viven en `R/calculations.R` (777 líneas); la lógica del Fondo Bienestar está en `R/fondo_bienestar.R` (505 líneas). Ninguna depende de Shiny en absoluto. Ambas pueden ejecutarse y probarse desde la terminal usando `testthat`. Ese diseño me permitió mantener 126 tests unitarios cubriendo la tabla del Artículo 167, factores de cesantía, proyecciones AFORE con tasas variables, cálculos del Fondo, y casos borde (semanas por debajo del mínimo, salario sobre el tope, rendimiento cero).

Las constantes regulatorias viven en `R/constants.R` fuera de cualquier contexto Shiny. UMA 2025 (\$113.14 diaria), salario mínimo (\$278.80), umbral del Fondo (\$17,364): un solo lugar para actualizarlas todas. Las tasas de la reforma DOF 2020 vienen de un CSV con los 8 tramos y columnas año por año (2023-2030), no hardcodeadas.

La interfaz es un wizard de 4 pasos construido con `bslib` (Bootstrap 5 para R Shiny), navegación controlada por `shinyjs`. Los gráficos de trayectoria de saldo usan Plotly. Los usuarios descargan un reporte PDF (generado con `rmarkdown`) que muestra todos los supuestos y resultados. Lo desplegué en Google Cloud Run con Docker y configuré CI/CD vía GitHub Actions e Identidad de Workload Federation.

## Lo que aprendí

Para trabajadores Ley 97, el calendario de contribuciones importa más que tasas de rendimiento o comisiones AFORE. Las tasas CEAV del patrón se disparan de 4.2% a casi 12% en los tramos altos durante siete años. Compón eso sobre 30 años de trabajo, y domina las cuentas.

La extrapolación del umbral del Fondo Bienestar es una opción, no una fórmula. El umbral publicado de 2025 es \$17,364 (salario promedio IMSS). Para años futuros, asumí crecimiento de 3.5% anual, basado en tendencias observadas. Cambia esa suposición a 2% o 4%, y los resultados se mueven materialmente. El simulador lo marca como un supuesto porque eso es lo que es.

Un detalle conecta con otros proyectos del portafolio: el retiro programado de Ley 97 divide el saldo entre la esperanza de vida restante. Esas vienen de tablas de CONAPO (17 años para hombres a los 65, 20 para mujeres). Proyectar mortalidad con tendencias de mejora en longevidad (como hace SIMA con Lee-Carter) requeriría datos por generación no disponibles para poblaciones de pensionistas; el piso legal de pensión mínima captura la incertidumbre en la práctica. <a href="/blog/sima/" style="color: #C17654; text-decoration: underline;">SIMA</a> recorre exactamente ese camino: proyecta mortalidad con Lee-Carter sobre datos del INEGI y construye tablas de vida que podrían alimentar este tipo de cálculo. Por otro lado, la <a href="/blog/cartera-autos/" style="color: #C17654; text-decoration: underline;">plataforma de siniestralidad auto</a> comparte la misma arquitectura R Shiny con despliegue en Cloud Run, pero aplicada a un problema completamente distinto: tarificación y reservas de daños.

<img src="/screenshots/pension-simulator.png" alt="Simulador de Pensión IMSS mostrando el desglose de pensión estimada con AFORE, piso legal y complemento Fondo Bienestar" style="max-width: 100%; border: 1px solid #d4d4d4; border-radius: 4px; margin: 1rem 0;" />

La aplicación está desplegada en <a href="https://simulador-pension-d3qj5vwxtq-uc.a.run.app/" target="_blank" rel="noopener">Google Cloud Run</a> y el código fuente está en <a href="https://github.com/GonorAndres/seguridad-social/tree/main/fondo_bienestar" target="_blank" rel="noopener">GitHub</a>.
