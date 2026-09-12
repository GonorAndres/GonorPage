---
title: "Un proyecto con Cloudflare: la app de salas que empezó en un pizarrón"
description: "Las herramientas de la web y los agentes de código permiten algo que antes pedía un equipo entero: que un grupo pequeño tenga una herramienta hecha a su medida. Esta es la historia de un cowork que administraba sus dos salas en un pizarrón físico, donde saber si una estaba libre obligaba a caminar hasta ahí. Mover esa información al teléfono con Cloudflare Pages y una base D1 fue lo fácil; lo demás fue diseñar una forma de coordinación asíncrona, como la que hoy necesitan muchos equipos."
date: "2026-09-05"
category: "herramientas"
lang: "es"
shape: "case-study"
tags: ["Cloudflare Pages", "D1", "SQLite", "UX", "Herramientas internas", "Free tier", "Coordinación"]
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Cloudflare Pages · Pages Functions · D1 (SQLite) · Resend · PostHog · HTML/CSS/JS sin framework"
  estado: "Desplegada, pendiente de estreno"
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/meeting-room-booking.webp"
heroAlt: "Varios teléfonos comparten una cuadrícula de reservas para dos salas, con un intervalo liberado y su rastro de cambio."
heroCaption: "Una agenda compartida permite consultar la ocupación y hacer visibles los cambios sin estar frente al pizarrón."
---

Mientras navegaba por internet encontré una mención a Cloudflare Workers. Yo tenía una idea vaga de Cloudflare: lo veía como un gigante de la infraestructura de internet, asociado a esa famosa imagen sobre el complicado ecosistema que sostiene la red. Por curiosidad, y por mis antecedentes con la nube, decidí investigar. Entré al sitio y entendí un poco la dinámica: Workers permitía usar parte de la infraestructura que ese gigante ha construido durante años, ahora al alcance de cualquiera. Me llamó mucho la atención su base de datos basada en SQLite, que allí se llama D1. Había miles de cosas que al principio me resultaban extrañas, pero poco a poco me fui familiarizando.

No se domina una plataforma en un día, ni siquiera se llega a entender por completo. Aun así seguí explorando, y de ahí salió la idea de que mi página (esta página) tuviera su dominio propio. Después empecé a probar los servicios y la herramienta `wrangler`, que permite manejar Cloudflare desde la línea de comandos y que, con ayuda de Claude Code, OpenCode o el agente que se prefiera, puede convertirse en una herramienta muy poderosa. Empecé a experimentar con mock-ups enfocados en datos, después migré el frontend de mis páginas a Pages y Workers, usé los servicios para crear mi propio correo (puedes escribirme a `andres@gonor.me`) y seguí explorando todo lo que ofrece el nivel gratuito.

## La torre

Esa imagen que menciono arriba es esta:

<img src="/screenshots/xkcd-2347-dependency.png" alt="Viñeta de xkcd: una torre alta e irregular rotulada toda la infraestructura digital moderna, sostenida por un bloque delgado descrito como un proyecto que alguna persona cualquiera en Nebraska ha mantenido sin reconocimiento desde 2003" style="display:block;max-width:100%;margin:1.75rem auto;border:1px solid #d4d4d4;border-radius:4px;background:#fff;" />

Es <a href="https://xkcd.com/2347/">xkcd 2347</a>, de Randall Munroe, publicada bajo CC BY-NC 2.5. La versión que circula desde hace un tiempo le dibuja una flecha a ese bloque delgado de abajo y le escribe encima "Cloudflare".

Y ese chiste describe, casi literalmente, la arquitectura de este proyecto. Todo lo de arriba lo escribí yo y es la parte chica: reservar en tres toques, un archivo HTML con su CSS y su JavaScript, la API en Pages Functions y la base en D1. Debajo van el TLS, el DNS, la caché y la red global de entrega, que nunca toqué y que no sabría construir. Si el bloque delgado no estuviera, nada de lo de arriba sería viable para una persona sola trabajando en un cowork de dos salas.

## Toda esta introducción va sobre reservar salas

La aplicación no es más que una base de datos para que quien va a ocupar un espacio pueda avisarlo. Permite organizar ese lugar físico desde un espacio digital, de forma que cualquiera pueda consultar la información y organizarse de manera asíncrona.

Antes de la app había un pizarrón en otra sala, separado de las salas de juntas.

Un pizarrón tiene una limitación que no depende de cómo esté organizado: hay que estar enfrente. Para saber si la sala grande está libre a las once hay que caminar hasta ahí, y quien no esté en el lugar no puede saberlo, ni reservar, ni avisar que ya no la va a ocupar. Toda la información vive en una pared.

Esta forma de reservar salas me dio la oportunidad de llevar un proyecto a producción, aunque fuera pequeño. Corre sobre una base SQLite, algo que importa porque habrá, como máximo, veinte usuarios, y tenerlo claro cambia mucho las decisiones: yo pensaba que toda base de datos en producción tenía que ser Postgres, y con Cloudflare ya no es así.

La aplicación fue difícil de hacer, pero no por el código. Me apoyé totalmente en los agentes de código. Fue difícil por el diseño, por la organización, y porque las propiedades transaccionales de una base nunca importan tanto como cuando esa base representa un lugar físico. **No es posible tener dos reuniones al mismo tiempo en el mismo lugar.**

Así que lo que sigue son los retos que tuve que resolver, que no son más que pensar y arquitectar una tarea muy simple: escribir en un lienzo cuadriculado quién y cuándo va a ocupar la sala.

Una aclaración antes de seguir. La app está desplegada pero **todavía no se estrena**: el pizarrón sigue siendo el método vigente mientras escribo esto. Así que aquí todavía no hay experiencias reales de uso ni métricas de adopción, sino decisiones y el razonamiento detrás de cada una, que es justo lo que quiero dejar escrito antes de que la realidad lo ponga a prueba.

## Contra qué compite en realidad

La primera versión no tenía usuarios. Abrías la URL, veías el horario, tocabas una hora libre, escribías tu nombre y listo.

<img src="/screenshots/salas-01-portada.png" alt="Pantalla de inicio de la app: el título ¿Qué necesitas?, un botón grande Reservar con la línea Primero te preguntaremos quién eres, y tres opciones secundarias: Ver horarios, Equipos y Compartir QR" style="display:block;max-width:100%;margin:1.75rem auto;border:1px solid #d4d4d4;border-radius:4px;" />

Esa decisión no fue pereza, fue entender contra qué compite. Una herramienta interna no compite contra otra app de reservas: compite contra el pizarrón. Y un pizarrón no pide cuenta, no se cae, no manda correos de verificación y no tiene curva de aprendizaje. Ese es el nivel que hay que superar, y es más alto de lo que parece.

De ahí salió una regla que se mantuvo durante todo el desarrollo: **consultar el horario no requiere identificarse**. La URL es pública; cualquiera puede entrar, ver qué salas están ocupadas y salir, igual que si se acercara al pizarrón. Para reservar sí hay que identificarse, porque una reserva debe quedar a nombre de alguien. Por eso el botón lo anuncia desde la portada, en lugar de pedirte los datos más adelante.

## Una acción a la vez

Si tuviera que quedarme con un solo principio de todo el diseño, sería este: **cada pantalla hace una sola pregunta.**

La decisión responde al uso que tendrá la aplicación. Una reserva se resuelve paso a paso: primero una pregunta y después la siguiente. Cada pantalla contiene solo la información necesaria para continuar.

<img src="/screenshots/salas-02-puerta.png" alt="Primer paso del acceso: la pregunta ¿De qué equipo eres?, la línea Antes de reservar necesitamos identificarte, la sala quedará a tu nombre, y dos equipos listados con su número de integrantes" style="display:block;max-width:100%;margin:1.75rem auto;border:1px solid #d4d4d4;border-radius:4px;" />

Identificarse son dos preguntas: de qué equipo eres, y quién eres dentro de ese equipo. Nada más en esa pantalla. Debajo, una línea explica qué ocurrirá antes de continuar.

<img src="/screenshots/salas-03-pin.png" alt="Segundo paso: elegida la persona, aparecen cuatro casillas para el PIN con un botón Ver, la línea Tu correo es di•••@example.com, y abajo el botón Enviarme un correo para cambiar mi PIN" style="display:block;max-width:100%;margin:1.75rem auto;border:1px solid #d4d4d4;border-radius:4px;" />

Al elegir tu nombre aparece el PIN, en cuatro casillas y con su ojito, como en el cajero. Copiar una interfaz que la gente ya usó mil veces ahorra toda la explicación. Y aparece tu correo tapado, `di•••@example.com`, para que reconozcas tu cuenta.

Ese botón de abajo cambia según la pantalla, y ese fue un problema que tardé en detectar. Antes decía "Entrar con mi correo" en tres momentos donde significaba tres cosas distintas: darte de alta, recuperar un PIN olvidado, o cambiar el que ya tienes. Cuando tienes la lista de personas delante dice **registrarme**; cuando ya elegiste a una persona, que por definición está registrada, dice **cambiar mi PIN**. En una demostración, quien la presenta sabe qué hace cada botón. La persona que abra la app un miércoles a las 10:55 no.

Reservar sigue el mismo patrón: sala, hora, duración. Tres pantallas, tres preguntas.

<img src="/screenshots/salas-04-sala.png" alt="Pantalla ¿Qué sala? con la línea Vas a reservar a nombre de Marina Ríos, Estudio Norte, un aviso de que el horario de hoy terminó y se reservará para el lunes, el texto Mantén presionada una foto para ver la sala, y las dos salas con su fotografía y disponibilidad" style="display:block;max-width:100%;margin:1.75rem auto;border:1px solid #d4d4d4;border-radius:4px;" />

En esa misma pantalla aprendí a dejar claros tres datos: a nombre de quién se hará la reserva, para qué día y cómo ver las fotos completas. Si el horario de hoy ya terminó, la app lo indica en ese momento y muestra que la reserva será para el día siguiente. La foto se puede mantener presionada para verla completa.

## Decir "ocupada" no es una respuesta

La primera versión del horario solo decía qué equipo había reservado la sala. La información era correcta, pero no bastaba.

Si necesitas la sala y está tomada, saber el equipo no te sirve de mucho: lo que quieres es a quién preguntarle si la va a ocupar durante todo el bloque, si te la presta media hora, o si ya se canceló y nadie la liberó. Un horario que no da un nombre te obliga a salir de la app a averiguarlo, que es justo el trabajo que la app venía a quitar.

<img src="/screenshots/salas-05-horario.png" alt="Horario de la Sala A en un lunes: la tira de salas fija arriba con la sala seleccionada, el selector de días, y la lista de bloques de media hora; los ocupados muestran el equipo, la persona, el rango y el motivo, con un botón LIBERAR" style="display:block;max-width:100%;margin:1.75rem auto;border:1px solid #d4d4d4;border-radius:4px;" />

Ahora cada bloque dice quién reservó, con su nombre y su equipo. Es un cambio de una línea en la consulta y creo que es el que más va a pesar. Detrás hay un detalle que parece menor y no lo es: se guarda una copia del nombre en la reserva, no solo una referencia. Si esa persona algún día se da de baja, el horario sigue diciendo de quién era esa junta. Una reserva que se vuelve anónima con el tiempo es una reserva que nadie va a tocar por si acaso.

En esa captura también se ve la tira de salas pegada arriba. El horario ocupa unas dos pantallas y media, y perder de vista en cuál sala estás es perder el hilo.

## Quién puede liberar una sala

Esta fue la decisión más difícil de todo el proyecto, y no tiene nada que ver con programar.

Liberar tiene que ser fácil, porque una sala reservada pero sin usar es peor que una ocupada: bloquea a los demás y no le sirve a nadie. Pero si liberar es fácil para cualquiera, entonces cualquiera puede liberar tu junta media hora antes de que empiece.

El primer diseño fue el más simple: quien reserva guarda una llave en su navegador, y solo con esa llave se puede liberar la sala. Funciona como el boleto del guardarropa: no dice quién eres, pero prueba que dejaste el abrigo. El problema aparece cuando reservas desde la computadora y quieres liberar desde el teléfono: la llave está en el otro navegador.

El segundo diseño agregó el PIN de quien reservó como segunda llave. Eso cierra el caso del teléfono, pero deja la pregunta social intacta: ¿y si de verdad hace falta liberar una sala ajena porque esa persona no llegó y hay gente esperando afuera?

<img src="/screenshots/salas-08-liberar.png" alt="Ventana para liberar una sala: dice el horario, quién la reservó y de qué equipo, advierte que quedará disponible para alguien más y no se podrá recuperar, y pide el PIN de esa persona en cuatro casillas" style="display:block;max-width:100%;margin:1.75rem auto;border:1px solid #d4d4d4;border-radius:4px;" />

El tercer diseño es el que quedó, y tampoco es técnico. **Toda liberación deja constancia visible**: el bloque liberado no queda simplemente vacío, dice quién lo liberó y de quién era. Cualquiera puede liberar una reserva, pero queda visible quién lo hizo.

El pizarrón también deja ver qué cambia con este diseño. Lo que alguien escribe en una pared se puede borrar y, después, no queda registro de quién lo hizo. En la aplicación quise conservar la posibilidad de liberar una sala y dejar visible cuándo ocurrió y quién la liberó. Eso no evita por sí solo que alguien libere una reserva ajena, pero permite que el resto lo sepa.

## Elegir el equipo una sola vez

Durante un tiempo la app preguntaba el equipo dos veces: una al identificarte y otra al reservar. Cada pantalla por separado tenía sentido, y juntas hacían teclear un dato que la app acababa de mostrar dos pantallas antes. Ahora se elige una sola vez, al identificarte, y ya no hay que volver a escribirlo.

<img src="/screenshots/salas-06-duracion.png" alt="Pantalla de duración: el rango 11:00 a 11:30, la pregunta ¿A qué hora termina?, la línea A nombre de Marina Ríos, Estudio Norte con un enlace Cambiar, dos opciones de duración y el botón Confirmar reserva pegado abajo" style="display:block;max-width:100%;margin:1.75rem auto;border:1px solid #d4d4d4;border-radius:4px;" />

## Las 10:05 también son las diez

Una regla que parecía obvia y estaba mal: en cuanto eran las 10:01, el bloque de las 10:00 dejaba de poder reservarse.

Correcto para un reloj, absurdo para una sala. A las 10:05 todavía quedan veinticinco minutos que se pueden aprovechar, y quien esté parado en la puerta va a querer justo ese bloque. Ahora un bloque sigue disponible mientras no termina: a las 10:18 todavía se puede tomar el de las 10:00, y a las 10:30 ya no. La regla se calcula en la zona horaria del cowork, no en la del servidor ni en la del teléfono, porque las tres pueden diferir y solo una es la correcta.

## El teclado tapaba justo el botón que importa

Este es mi favorito, porque es invisible en la computadora y letal en el teléfono.

El botón que confirma vive pegado abajo. Cuando el teclado del teléfono se abre, se abre encima: en el momento exacto en que acabas de escribir tu PIN, el botón para confirmarlo queda detrás del teclado. Ahora la app mide cuánto ocupa el teclado y sube el botón esa misma distancia, y la ventana donde se teclea el PIN se centra en lo que se ve y no en lo que el teclado esconde.

Nadie va a notar este arreglo. Ese es el punto: es de los que solo se notan cuando faltan.

## Terminar también es una pantalla

<img src="/screenshots/salas-07-recibo.png" alt="Confirmación de reserva guardada con el resumen de sala, día, horario y equipo, y dos botones: Volver al inicio y Ver mi reserva" style="display:block;max-width:100%;margin:1.75rem auto;border:1px solid #d4d4d4;border-radius:4px;" />

El segundo botón decía "Reservar otra", que era el nombre de lo que hacía, no de lo que alguien querría después. Al terminar de reservar, lo natural no es reservar otra: es comprobar que sí quedó. Ahora dice "Ver mi reserva" y abre el horario de esa sala en modo consulta, con tu fila marcada.

<img src="/screenshots/salas-09-equipos.png" alt="Pantalla de equipos: cada equipo en una fila con sus iniciales y un contador de integrantes; el equipo abierto muestra debajo el nombre de su integrante. Abajo, un campo para la clave de administración" style="display:block;max-width:100%;margin:1.75rem auto;border:1px solid #d4d4d4;border-radius:4px;" />

## El correo, o cuánto se puede hacer con un nivel gratuito

Esta parte merece su propia sección, porque fue la que más me sorprendió.

Hay dos correos en esta historia y conviene separarlos. El primero es el mío: `andres@gonor.me` existe porque Cloudflare enruta el correo de un dominio propio sin cobrar por ello. El segundo es el de la aplicación, el que le llega a quien se registra, y ese sale de Resend, otro servicio con un nivel gratuito que alcanza de sobra para un cowork.

<img src="/screenshots/salas-10-correo.png" alt="El correo de acceso: título Bienvenido a Reservar salas, un botón oscuro de ancho completo que dice Entrar a reservar, la dirección en texto por si el botón falla, y debajo una palabra de acceso de seis letras" style="display:block;max-width:100%;margin:1.75rem auto;border:1px solid #d4d4d4;border-radius:4px;" />

El correo está pensado para que la instrucción sea clara desde el primer vistazo. Primero aparece el botón para entrar y después la palabra de acceso, por si el mensaje se abre en otro dispositivo. También incluye la dirección completa como alternativa si el botón no funciona. No depende de imágenes para explicar el acceso, porque algunos clientes de correo las bloquean.

El botón y la palabra de acceso salen de la misma solicitud y solo pueden usarse una vez. Así puedes entrar directamente desde el correo o escribir la palabra si estás usando otro aparato.

Lo notable no es el correo. Es que **una sola persona pueda montar esto**. Un dominio propio con certificado, una base de datos administrada con respaldo, una API distribuida en todo el mundo y un servicio de entrega de correo que llega a la bandeja y no a spam: hasta hace pocos años, para hacer esto se necesitaba un equipo de infraestructura y una factura mensual. Hoy cabe en un nivel gratuito y en unas tardes de trabajo, y para un grupo de veinte personas resulta suficiente.

Esto no lo digo como publicidad. Lo digo porque me parece que ahí hay algo que agradecer y que no siempre se nombra: ese nivel gratuito existe porque mucha gente construyó, pagó y mantuvo la infraestructura antes de que yo llegara. Escribir este proceso es mi forma de devolver algo. Si alguien lo encuentra y le sirve para llevar su propia herramienta a producción, el texto ya hizo su trabajo.

Y hay una segunda deuda del mismo tipo. Me apoyé totalmente en los agentes de código, que son el corpus Maximus y los hombros de gigantes: engloban a todos los muertos que vivieron y legaron su conocimiento. No son modelos ex nihilo: nuestros queridos LLM se entrenaron con el conocimiento humano acumulado en textos, código y muchas otras fuentes. La app es el cruce de esas dos herencias, la del conocimiento acumulado y la de la infraestructura acumulada, puestas al servicio de una pregunta bastante modesta: ¿está libre la sala a las once?

## Cómo funciona el acceso

Identificarse tenía que ser sencillo o nadie lo haría, y una contraseña más no era opción: nadie quiere inventar una para reservar una sala, y las que sí se inventarían serían malas.

El acceso quedó dividido en dos claves, cada una con una función distinta. La palabra del correo sirve una sola vez y vive diez minutos; su único trabajo es probar que ese correo es tuyo. El PIN de cuatro cifras es la puerta de entrada de todos los días. En la base solo viven versiones cifradas de ambos, así que una fuga no deja entrar a nadie.

Cuatro dígitos son diez mil combinaciones y la lista de nombres es pública, así que lo que de verdad cuida la puerta no es el cifrado sino el tope de intentos: cinco fallos y la cuenta se cierra una hora. De ahí salió el problema más interesante del proyecto, y es usabilidad disfrazada de seguridad: como el tope contaba cualquier solicitud, incluso una vacía, mandar cinco peticiones bastaba para dejar a una persona fuera durante una hora sin que hubiera tecleado un solo PIN. El candado pensado para frenar a quien adivina servía para bloquear a quien no había hecho nada.

Hay otro caso que tuve que considerar: algunos servicios de correo corporativo revisan los enlaces antes de entregarlos. Si la primera apertura consumiera el enlace, esa revisión lo dejaría inutilizable antes de que la persona lo tocara. Por eso la llave viaja después del signo `#`, en una parte de la dirección que el navegador no envía al servidor. El servicio puede revisar la página sin consumir el acceso; la aplicación utiliza la llave cuando la persona abre el enlace.

## Lo que todavía no sé

Todo lo anterior son decisiones tomadas antes del estreno, así que conviene decir en voz alta qué son: apuestas razonadas, no resultados.

Queda además una decisión de fondo pendiente: el alta por correo no restringe dominios, así que cualquier correo que exista puede crear una cuenta. Para un espacio pequeño fue lo más práctico, y por eso crear equipos sigue requiriendo una clave de administración. Es también la razón por la que no anexo el enlace de la app: es una herramienta de un espacio de trabajo real, no una demo, y publicar la dirección sería invitar a desconocidos a darse de alta en ella.

Si algo deja este proyecto, es esto: el pizarrón no está mal diseñado. Hace su trabajo; lo único que no puede hacer es estar en otro lado. Todo lo demás (la identidad, los PIN, los correos, el bloqueo por intentos) existe solo para sostener esa única mejora. Diseñar herramientas para organizarse de forma asíncrona cobra más importancia ahora que la IA generativa pone al alcance de una persona lo que antes requería un equipo, y la parte difícil sigue sin ser el código. Sigue siendo decidir quién puede hacer qué, y cómo se entera el resto.

Si quieres ver la otra mitad de esta historia, la del dominio y el panel de DNS vacío, está en <a href="/blog/configuring-your-own-domain/">cómo gonor.me se convirtió en mi lugar en internet</a>. Y la misma disciplina de no romper datos que le importan a alguien, aplicada a algo mucho más grande, está en la <a href="/blog/data-engineering-platform/">plataforma de datos sobre GCP</a>.
