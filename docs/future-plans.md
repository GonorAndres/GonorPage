# Future Portfolio Projects

## 1. Dashboard Interactivo TIIE/CETES

**Objetivo:** Visualizador en tiempo real de tasas de referencia del mercado mexicano.

**Alcance:**
- Consumir la API publica de Banxico (SIE) para obtener series historicas de TIIE, CETES, tipo de cambio
- Graficas interactivas con zoom, filtros por periodo y comparacion entre instrumentos
- Calculos derivados: spreads, volatilidad rolling, correlaciones entre tasas
- Contexto editorial breve por periodo (crisis, decisiones de politica monetaria)

**Stack:** React island en Astro, D3.js o Recharts para graficas, fetch directo a API Banxico (sin backend)

**Valor diferenciador:** Demuestra conocimiento del mercado financiero mexicano, manejo de APIs publicas y capacidad de construir herramientas utiles para el sector. Ningun candidato actuarial junior tiene esto en su portafolio.

**Categoria blog:** mercado-mexicano

---

## 2. Visualizador de Tablas de Mortalidad y Analisis de Supervivencia

**Objetivo:** Herramienta interactiva para explorar tablas de mortalidad mexicanas y curvas de supervivencia.

**Alcance:**
- Cargar datos de CONAPO o INEGI (tablas de mortalidad por sexo, entidad, periodo)
- Visualizar qx, lx, ex interactivamente con sliders por edad y filtros por poblacion
- Comparar curvas de supervivencia entre entidades o periodos
- Implementar Kaplan-Meier basico con datos de ejemplo
- Explicar conceptos actuariales (fuerza de mortalidad, esperanza de vida, ley de Gompertz) de forma accesible

**Stack:** React island en Astro, SVG/Canvas para graficas, datos pre-procesados en JSON desde archivos CONAPO

**Valor diferenciador:** Conecta directamente la formacion actuarial con habilidades de visualizacion de datos. Es el proyecto que mas claramente dice "soy actuario Y se programar". No existe nada similar en portafolios actuariales en Mexico.

**Categoria blog:** actuaria-para-todos

---

## 3. Blog Post: Resumen No Tecnico del Articulo de Investigacion

**Objetivo:** Articulo de blog que explique en lenguaje accesible el tema del paper en proceso de publicacion del internship de data science.

**Alcance:**
- Contexto del problema: por que importa, quien se beneficia
- Metodologia simplificada: que tecnicas se usaron y por que, sin formulas densas
- Resultados clave y que significan en la practica
- Reflexion personal sobre el proceso de investigacion
- Link al paper cuando se publique

**Stack:** Markdown en content collection del blog, posiblemente con graficas estaticas o diagramas SVG

**Valor diferenciador:** Demuestra capacidad de comunicar investigacion a audiencia amplia. Los reclutadores ven que puedes ir mas alla del codigo y explicar el "por que". Tambien valida la experiencia del internship con evidencia tangible.

**Categoria blog:** proyectos-y-analisis

---

## 4. Blog Post: Metodologia de Tarificacion del GMM Explorer

**Objetivo:** Desglose tecnico-accesible del modelo de tarificacion de Gastos Medicos Mayores implementado en gmm-explorer.vercel.app.

**Alcance:**
- Explicar la estructura de tarificacion: frecuencia x severidad x factor de edad
- Visualizar como cambia la prima por edad (el factor 7.4x entre 25 y 70 anios)
- Detallar las fuentes de datos: 95.9M asegurados-anio, 5.1M siniestros (2020-2024)
- Contexto regulatorio: que exige la CNSF y como el modelo lo cumple
- Comparar con enfoques alternativos de pricing

**Stack:** Markdown con posibles componentes React embebidos para graficas interactivas de factores de edad

**Valor diferenciador:** Transforma un proyecto academico en contenido de referencia. Si alguien busca "tarificacion GMM Mexico" y encuentra tu blog, eso es posicionamiento profesional real. Tambien refuerza la narrativa del CV: "construyo herramientas Y explico la teoria detras".

**Categoria blog:** actuaria-para-todos

---

## 5. SIMA - Sistema Integral de Modelacion Actuarial (Web Platform)

**Objetivo:** Desplegar la plataforma web de SIMA como aplicacion interactiva, integrando el motor de calculo actuarial ya construido (Phase 2 completa) con un frontend profesional.

**Alcance:**
- Construir API con FastAPI sobre los 6 modulos existentes del engine (life tables, commutation, actuarial values, premiums, reserves, mortality data)
- Frontend interactivo: el usuario selecciona pais, periodo, sexo, edad de entrada, tipo de producto (vida entera, temporal, dotal) y obtiene primas, reservas y trayectorias
- Visualizar curvas de reserva, tablas de mortalidad procesadas, funciones de conmutacion
- Escenarios de sensibilidad: choques de tasa de interes y mortalidad sobre las reservas
- Documentar la alineacion regulatoria (LISF Art. 217, CUSF 7.3-7.6, EMSSA-2009)
- Desplegar en Vercel o Railway, linkear desde el portafolio

**Stack:** FastAPI (backend), React island o app standalone, Recharts/D3 para graficas, datos HMD pre-cargados

**Estado actual:** Phase 2 completa (6 modulos, 38 tests passing, backward recursion optimizada). Falta Phase 1 (Lee-Carter), Phase 3 (capital SCR) y Phase 4 (web).

**Valor diferenciador:** Ningun actuario junior en Mexico tiene un sistema de valuacion de reservas funcional, con tests, alineado a regulacion y desplegado como web app. Esto es el proyecto que cierra la narrativa completa: teoria actuarial + ingenieria de software + regulacion mexicana.

**Categoria blog:** actuaria-para-todos / proyectos-y-analisis

---

## Orden de prioridad sugerido

1. **Post del articulo de investigacion** (3) -- requiere menos desarrollo tecnico, alto impacto en CV
2. **Post de metodologia GMM** (4) -- el contenido ya existe en tu cabeza, solo hay que escribirlo
3. **SIMA web platform** (5) -- Phase 2 ya esta lista, el frontend es el paso natural siguiente
4. **Dashboard TIIE/CETES** (1) -- proyecto tecnico con datos reales, buena complejidad
5. **Visualizador de mortalidad** (2) -- proyecto independiente de SIMA, enfocado en CONAPO/INEGI y Kaplan-Meier interactivo

---

## Nuevos proyectos: capacidades desarrolladas en Levely

Estas ideas nacen del trabajo realizado en el área de datos de Levely. Son **proyectos futuros del portafolio**, no fichas de proyectos terminados ni reproducciones de sistemas de clientes. Cada uno debe poder explicarse con datos públicos o ficticios, sin nombres de clientes, cifras comerciales, capturas internas ni identificadores de personas. Las herramientas concretas se mencionarán sólo cuando ayuden a entender el proyecto; el punto de partida es la pregunta que resuelve.

Estas propuestas complementan `docs/capability-roadmap.md`; su secuencia no reemplaza la auditoría de evidencia ni las decisiones de esa hoja de ruta. El orden aquí favorece piezas pequeñas que puedan publicarse con una conclusión verificable. Antes de añadir una tarjeta a `src/data/projects.ts`, debe existir un artefacto o artículo que el visitante pueda abrir. Cuando haya ficha y artículo, mantener las versiones en español e inglés y enlazar las piezas relacionadas del portafolio.

### 1. Cuando las fuentes no cuentan la misma historia

**Pregunta:** ¿Cómo comparar las conversiones que atribuye una plataforma publicitaria con las ventas o prospectos que registra el negocio?

**Proyecto:** Construir un ejemplo de comercio y otro de generación de prospectos con datos ficticios. Mostrar qué mide cada fuente, qué fechas y reglas de atribución usa, dónde se pierde información y qué conclusiones sí sobreviven a la conciliación. El resultado puede ser un artículo acompañado de una tabla interactiva que permita cambiar la ventana de atribución y ver por qué las cifras no coinciden.

**Capacidad que expresa:** criterio de medición, integración de fuentes, definición de métricas y comunicación de límites. La buena práctica central es conservar por separado lo que la plataforma se atribuye y lo que el sistema comercial confirma.

**Primera entrega:** una sola pregunta de negocio, dos fuentes sintéticas y una conciliación reproducible. Relacionar con los proyectos actuales de plataformas de datos y con el material sobre APIs.

### 2. Un tablero que diga hasta qué hora sabe

**Pregunta:** ¿Qué pasa cuando ventas, publicidad y analítica web se actualizan a horas distintas, pero el tablero las compara como si estuvieran completas?

**Proyecto:** Crear una demostración pública con datos ficticios de un día de operación. El visitante podrá mover la hora de actualización de cada fuente y ver cómo cambia la lectura del desempeño. El tablero mostrará el último tramo comparable, la frescura de cada fuente y una referencia histórica del mismo día de la semana.

**Capacidad que expresa:** diseño de herramientas para equipos, análisis intradía y atención a la calidad de los datos. La buena práctica es hacer visible la incertidumbre de cada corte, en vez de presentar como caída un dato que aún no llegó.

**Primera entrega:** una página estática con tres fuentes y un solo indicador compartido. Ampliar después sólo si el ejemplo inicial explica una decisión real. Relacionar con las publicaciones existentes sobre tableros y plataformas de datos.

### 3. Del clic al resultado: una medición que se pueda comprobar

**Pregunta:** ¿Cómo saber si una campaña realmente puede seguirse desde el primer clic hasta el registro final?

**Proyecto:** Diseñar un recorrido ficticio entre sitio, formulario y CRM. Mostrar la especificación de los eventos y parámetros necesarios, una prueba de extremo a extremo y un panel donde aparezcan las brechas de cobertura. Incluir un caso en que el canal parece «orgánico» porque se perdió el origen, y otro en que un evento llega a GA4 pero no equivale al resultado comercial.

**Capacidad que expresa:** trabajo con GA4 y GTM, verificación de instrumentación y análisis de atribución. La buena práctica es probar el recorrido completo y documentar lo que queda fuera de la medición.

**Primera entrega:** diagrama y checklist verificable con datos inventados; la demostración interactiva puede venir después. Relacionar con el artículo sobre APIs y con el futuro proyecto de conciliación de fuentes.

### 4. Un almacén de datos que explique sus propios límites

**Pregunta:** ¿Qué necesita saber un analista antes de confiar en una cifra que aparece en un reporte?

**Proyecto:** Crear un pequeño conjunto de datos público o sintético que avance de registros originales a métricas de negocio. Cada métrica mostrará su origen, fecha de actualización, unidad, denominador y prueba de calidad. Un fallo provocado, como una carga ausente o un duplicado, permitirá enseñar por qué una cifra debe retenerse hasta aclarar el problema.

**Capacidad que expresa:** ingeniería de datos en GCP, modelado, observabilidad y diseño de información para usuarios no técnicos. La buena práctica es que la calidad y la procedencia formen parte del resultado, no de una nota escondida.

**Primera entrega:** un flujo pequeño y documentado que produzca un reporte y una prueba visible. Conectar con la plataforma de datos para seguros que ya aparece en el portafolio, sin presentar este ejemplo como sistema de un cliente.

### 5. Del análisis de embudo a una recomendación responsable

**Pregunta:** ¿Cómo convertir señales de abandono y observaciones de uso en mejoras priorizadas sin prometer que ya aumentaron las conversiones?

**Proyecto:** Construir un recorrido móvil ficticio con eventos medidos y observaciones de experiencia de usuario. Comparar dónde se detiene la gente, qué fricción se observa, qué hipótesis tiene sustento y qué experimento haría falta para comprobar una mejora. El resultado será un informe breve, con un prototipo y una matriz de prioridad que distinga evidencia, hipótesis y decisión.

**Capacidad que expresa:** análisis cuantitativo y cualitativo de CRO, lectura de embudos y comunicación de recomendaciones. La buena práctica es separar un diagnóstico de un efecto causal demostrado.

**Primera entrega:** un caso narrado con datos sintéticos y una sola propuesta de cambio. Relacionar con el artefacto de pruebas A/B existente.

### 6. LLM dentro del trabajo de otra persona

**Pregunta:** ¿Cómo puede alguien incorporar un LLM en una tarea que domina sin cederle el criterio sobre el contenido?

**Proyecto:** Preparar una guía y una demostración para un flujo de trabajo elegido por un especialista ficticio, por ejemplo revisar un reporte o resumir hallazgos para una reunión. Mostrar cómo se define la entrada, qué parte puede apoyar el LLM, cómo se revisa la salida y cuándo se vuelve al responsable del tema. El ejemplo debe dejar claro que el especialista decide qué es correcto y útil; el aporte aquí está en explicar la herramienta y dar estructura al proceso.

**Capacidad que expresa:** creación de herramientas para el equipo y apoyo para integrar LLM en flujos de trabajo ajenos, respetando el conocimiento de cada integrante. La buena práctica es mantener trazabilidad, revisión humana y límites claros de lo que la herramienta puede afirmar.

**Primera entrega:** una guía breve con un caso ficticio y sus puntos de revisión. Evitar promesas de productividad o afirmaciones de capacitación formal no documentadas. Relacionar con los proyectos actuales de agentes y con el artículo sobre APIs.

### Secuencia sugerida para estas ideas

Después de los hitos y decisiones de `docs/capability-roadmap.md`:

1. Publicar primero **«Cuando las fuentes no cuentan la misma historia»** como artículo y ejemplo pequeño. Tiene una pregunta clara y conecta la experiencia de Levely con el trabajo de datos que el sitio ya muestra.
2. Construir después **«Un tablero que diga hasta qué hora sabe»**. Permite enseñar una herramienta visible para equipos y por qué la frescura de los datos cambia una decisión.
3. Publicar **«Del clic al resultado»** y **«LLM dentro del trabajo de otra persona»** como guías breves. El segundo debe describir el apoyo al flujo, no atribuir conocimiento del contenido de los compañeros.
4. Ampliar el portafolio con **«Un almacén de datos que explique sus propios límites»** y **«Del análisis de embudo a una recomendación responsable»** cuando sus demostraciones y conclusiones estén listas.

**Criterio común de publicación:** cada pieza debe responder una pregunta, mostrar una salida que funcione, explicar de dónde viene el dato y declarar qué conclusión no permite. La ficha pública sólo se crea cuando la pieza exista; este backlog por sí solo no acredita un proyecto terminado.
