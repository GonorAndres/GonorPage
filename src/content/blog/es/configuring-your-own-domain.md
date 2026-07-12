---
title: "Configurar tu propio dominio: cómo gonor.me se convirtió en mi lugar en internet"
description: "Compras un dominio, abres el panel de DNS y te encuentras con una tabla vacía sin ninguna pista de qué va dónde. Este es un recorrido llano y honesto para apuntar un dominio propio a GitHub Pages a través de Cloudflare, escrito por alguien que apenas lo hace por segunda vez, con todos los tropiezos incluidos. Al final, las pocas piezas que se mueven quedan lo bastante claras como para reutilizarlas en tu propio dominio."
date: "2026-07-12"
category: "herramientas"
lang: "es"
shape: "narrative"
tags: ["DNS", "Cloudflare", "GitHub Pages", "TLS", "Let's Encrypt", "Dominios"]
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Cloudflare · GitHub Pages · DNS · Let's Encrypt"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/GonorAndres.github.io"
  live: "https://gonor.me"
---

Durante un par de años, mi sitio personal vivió en `gonorandres.github.io`. Funcionaba, y era gratis. También era, sin lugar a dudas, un cuarto en la casa de alguien más: la URL anunciaba a su casero antes que a mí.

Así que compré `gonor.me` en Cloudflare, abrí el panel de DNS y me encontré con una tabla vacía y un menú lleno de siglas que reconocía a medias. Si alguna vez te has sentado frente a esa misma pantalla sin saber qué escribir, este texto es para ti. No soy especialista en redes; esta es apenas la segunda vez en mi vida que configuro un dominio. Lo que sigue es una guía de cómo lo hice, con los tropiezos incluidos, porque los tropiezos son justo donde de verdad aprendí cómo funciona todo esto.

La meta era modesta. Mi sitio está hecho con Astro, el código vive en un repo público, y quería que `https://gonor.me` lo sirviera por HTTPS con un certificado real. También quería dejar espacio para más servicios después, algo que terminó importando más de lo que esperaba.

## Primera decisión: ¿necesito `www`?

Antes de tocar un solo registro, me topé con una pregunta que de algún modo nunca me había hecho: ¿el sitio debe vivir en `gonor.me` o en `www.gonor.me`?

Resulta que `www` es en buena medida un fósil. En los años noventa y dos mil, las organizaciones corrían varios servicios en un mismo dominio y usaban subdominios para distinguirlos: `www.` para el servidor web, `ftp.` para transferencia de archivos, `mail.` para correo. El prefijo `www` era una convención de enrutamiento, nunca un requisito de la web. Basta ver dónde viven los sitios modernos para encontrar a Stripe, OpenAI y el propio GitHub sirviendo directo desde el dominio pelón, el apex.

Así que me fui por solo apex: `gonor.me` es el sitio. (`www` igual se colaría en la historia más adelante, pero eso todavía no lo sabía.)

## El incidente `gonor.gonor.me`

Mi primer registro debía apuntar el dominio raíz a GitHub Pages. En la pestaña de DNS de Cloudflare empecé un CNAME y, suponiendo que el campo "Name" quería el nombre de mi dominio, escribí `gonor`.

Cloudflare lo aceptó sin chistar. Lo que en realidad había creado era un registro para `gonor.gonor.me`.

Aquí está la pieza que me faltaba: dentro de una zona DNS, cada nombre que escribes es *relativo a la zona*. Cloudflare le agrega en silencio el nombre de la zona, `gonor.me`, a lo que sea que escribas. Escribes `www` y obtienes `www.gonor.me`. Escribes `gonor` y obtienes `gonor.gonor.me`. Cuando quieres el dominio raíz en sí, el apex, la convención es el símbolo `@`, que significa "el nombre propio de esta zona".

Borré el registro mutante y guardé la lección: **`@` es el apex.**

## Cuatro registros A y una nube gris

Había un segundo problema con ese primer intento, y me habría mordido aun si hubiera escrito bien el nombre: en general no puedes poner un CNAME simple en el apex. Los registros A apuntan un nombre a una dirección IP; los registros CNAME hacen que un nombre sea alias de otro. El apex, por razones enterradas en los estándares del DNS, tiene que resolver a direcciones directamente.

GitHub Pages publica cuatro IPs estáticas justo para esto. Son direcciones anycast compartidas de balanceo de carga que usan *todos* los dominios apex personalizados de Pages, no algo ligado a mi cuenta:

```
Type  Name  Content            Proxy status
A     @     185.199.108.153    DNS only
A     @     185.199.109.153    DNS only
A     @     185.199.110.153    DNS only
A     @     185.199.111.153    DNS only
```

Esa última columna importa. Cloudflare te da dos modos por registro. **Proxied** (la nube naranja) enruta el tráfico de los visitantes a través de la red edge de Cloudflare. **DNS only** (la nube gris) simplemente responde la pregunta de DNS con honestidad, con la IP real del origen, y se hace a un lado: Cloudflare como directorio telefónico, nada más.

Empecé con la nube gris a propósito. Durante la configuración, GitHub necesita confirmar que el dominio de verdad apunta a Pages, y Let's Encrypt necesita alcanzar el origen real para emitir un certificado. Si el proxy de Cloudflare está enfrente durante ese apretón de manos, GitHub ve las direcciones de Cloudflare en lugar de las suyas y todo se confunde. Nube gris ahora; la nube naranja podía esperar.

Luego, en el **Settings → Pages** del repo, configuré el dominio personalizado como `gonor.me`. GitHub revisó el DNS, se puso en verde y solicitó calladamente un certificado en mi nombre. Unos minutos después:

```
$ curl -vI https://gonor.me
< HTTP/2 200
* subject: CN=gonor.me
* issuer: Let's Encrypt
*  start date: Jul 12 2026; expire date: Oct 10 2026
```

Un certificado válido de Let's Encrypt, emitido para mi dominio, servido por GitHub, sin costo. Confieso que se sintió un poco mágico.

## "InvalidDNSError" para un dominio que nunca escribí

Entonces la configuración de Pages lanzó una advertencia: **InvalidDNSError para `www.gonor.me`**.

La leí dos veces. Había escrito `gonor.me` en exactamente una casilla. ¿De dónde salía `www`?

Esto no es un error, es un comportamiento documentado. Cuando configuras un dominio personalizado, Pages siempre revisa *tanto* el apex *como* su contraparte `www`, sin importar cuál escribiste, porque si ambos existen puede redirigir uno hacia el otro automáticamente. El "error" no era algo que yo hubiera hecho mal; era GitHub avisándome que la variante `www` todavía no resolvía. Puramente informativo.

Aun así, me hizo reconsiderar. La gente sí escribe `www` por costumbre, y soportarlo cuesta exactamente un registro:

```
Type   Name  Target                   Proxy status
CNAME  www   gonorandres.github.io    DNS only
```

Fíjate que este sí es un CNAME. `www` es un subdominio, no el apex, así que hacerlo alias de un nombre está permitido y de hecho es lo preferible. GitHub recoge el registro, arma la redirección de vuelta al apex, y quien escriba `www` aterriza en el lugar correcto.

## El misterio del certificado que no coincide

Aquí se puso genuinamente confuso. Segundos después de agregar el CNAME de `www`, revisé la propagación contra el propio resolver de Cloudflare:

```
$ dig www.gonor.me @1.1.1.1 +short
gonorandres.github.io.
185.199.108.153
...
```

El DNS estaba listo, prácticamente al instante. Así que le hice curl a la dirección, y obtuve un error de TLS. La salida verbosa contaba la historia:

```
$ curl -v https://www.gonor.me
* subject: CN=*.github.io
* SSL: no alternative certificate subject name matches
  target host name 'www.gonor.me'
```

La conexión llegaba bien a GitHub, pero GitHub devolvía su certificado comodín genérico, `*.github.io`, que obviamente no cubre `www.gonor.me`. Su tubería de certificados para ese nombre de host específico simplemente todavía no había corrido.

Esta es la lección que subrayaría dos veces: **la propagación del DNS y la emisión del certificado por parte del host son dos procesos separados y asíncronos.** Cuando `dig` dice "listo", significa que el directorio telefónico está actualizado. No dice nada sobre si el host ya notó el nombre nuevo, le pidió un certificado a Let's Encrypt, pasó la validación y lo desplegó. Esa tubería corre con su propio reloj, entre unos minutos y alrededor de una hora. Nada estaba roto. Dos sistemas simplemente se estaban poniendo al día a velocidades distintas, y efectivamente, un rato después el mismo comando regresó limpio.

## Encender la nube naranja, y el ajuste que agradezco haber revisado antes

Con todo funcionando en modo solo DNS, quería los beneficios reales del proxy de Cloudflare. Cambiar un registro a **Proxied** cambia la forma de cada petición: los visitantes llegan primero a la red edge de Cloudflare, y Cloudflare reenvía a GitHub tras bambalinas. Eso es lo que la vuelve una CDN, con respuestas cacheadas servidas desde un nodo edge cercano a cada visitante, más protección contra DDoS, una IP de origen oculta y analíticas gratis.

Pero el proxy parte cada conexión en dos tramos, navegador a Cloudflare y Cloudflare a origen, y un ajuste bajo **SSL/TLS → Overview** decide cómo se cifra el segundo tramo:

- **Off**: nada de HTTPS en ningún lado. No.
- **Flexible**: HTTPS del navegador a Cloudflare, pero HTTP plano de Cloudflare al origen.
- **Full**: HTTPS en ambos tramos, pero el certificado del origen no se valida estrictamente.
- **Full (strict)**: HTTPS en ambos tramos, y el origen tiene que presentar un certificado válido y confiable.

Flexible es el que hay que vigilar, y vale la pena entender por qué antes de siquiera encender la nube naranja. GitHub Pages *impone* HTTPS: cualquier petición HTTP plano recibe como respuesta una redirección a HTTPS. Sigue ese hilo por el modo Flexible y obtienes un bucle. El navegador pide `https://gonor.me` y llega a Cloudflare por HTTPS. Cloudflare, siguiendo la regla de Flexible, reenvía a GitHub por HTTP plano. GitHub responde "redirige a HTTPS". Cloudflare le pasa eso de vuelta, el navegador vuelve a pedir HTTPS, Cloudflare vuelve a degradar, y así da vueltas hasta que el navegador se rinde con `ERR_TOO_MANY_REDIRECTS`. Cada pieza funciona exactamente como está configurada, y el sitio queda completamente inaccesible, sin que nada en el error apunte a un menú tres pestañas más allá.

No caí en este, pero solo porque me detuve a leer qué significaban los modos primero. Como GitHub ya sirve un certificado real y válido, no hay razón para usar otra cosa que **Full (strict)**: cifrado de extremo a extremo, completamente validado. Mi lista de verificación antes de tocar la nube naranja era corta:

1. GitHub Pages muestra "DNS valid"
2. El HTTPS funciona demostrablemente en el dominio
3. El modo SSL/TLS está en Full (strict) *antes* de activar el proxy

## "¿Me estoy encadenando?"

Una cosa todavía me rondaba. Full (strict) exige un certificado válido de todo origen. ¿Qué pasa si, algún día, apunto un subdominio a alguna VM improvisada que solo habla HTTP plano?

La preocupación se disolvió desde tres frentes. Primero, es un menú desplegable, no un juramento; el modo es reversible cuando yo quiera. Segundo, la solución correcta para un origen solo-HTTP es darle un certificado, no debilitar la zona entera. Let's Encrypt con certbot es gratis, y Cloudflare incluso emite sus propios **certificados Origin CA**, válidos hasta por quince años y hechos específicamente para el tramo Cloudflare a origen. Tercero, el ajuste no tiene por qué aplicar a toda la zona: las **Configuration Rules** del plan gratuito de Cloudflare me dejan sobrescribir el modo SSL/TLS por nombre de host, así que un origen raro nunca dicta la seguridad de todo lo demás.

Sin encadenarme. Full (strict) se queda.

## El siguiente capítulo: un dominio, muchos servicios

Esta es la parte que más me emociona, y la razón por la que me importaba dejar espacio antes. `gonor.me` nunca fue pensado para ser un solo sitio estático. Quiero correr cosas en él, una aplicación web en Vercel, una API en Google Cloud Run, y necesitaba un modelo mental de cómo un dominio se reparte entre plataformas de hosting que no tienen nada que ver entre sí.

El modelo resulta ser agradablemente simple: **un nombre de host apunta a un destino**, y los subdominios son gratis. El patrón estándar es un subdominio por servicio:

```
gonor.me       →  GitHub Pages   (registros A → 185.199.108-111.153)
app.gonor.me   →  Vercel         (CNAME → cname.vercel-dns.com)
api.gonor.me   →  Cloud Run      (CNAME → ghs.googlehosted.com)
```

Cada subdominio recibe su propio registro DNS dirigido a su proveedor. Cada proveedor verifica su propio nombre de host y gestiona su propio certificado TLS: el de GitHub para el apex, el de Vercel para `app`, el de Google para `api`. Nunca chocan, porque los certificados tienen alcance por nombre de host. Cloudflare sigue siendo exactamente lo que ha sido todo este tiempo, una capa neutral de DNS y CDN sobre todo el conjunto.

Hay una alternativa más sofisticada, el enrutamiento por ruta, donde `gonor.me/app` y `gonor.me/api` viven bajo un mismo nombre de host. Pero eso necesita un proxy inverso o un Cloudflare Worker eligiendo un origen en cada petición. Para un dominio personal, es costo sin recompensa. Ganan los subdominios.

## Lo que me enseñó el panel vacío

Un día antes, el DNS era una tabla de siglas que copiaba y pegaba sin entender de verdad. Ahora puedo leer el camino completo de principio a fin: el navegador le pregunta al resolver de Cloudflare, la zona responde con registros A o sigue un CNAME, la petición aterriza en un nodo edge o en el origen mismo, y el TLS se negocia por nombre de host con un certificado que alguna tubería emitió en su propio horario. Cada capa es un sistema separado corriendo con su propio reloj, y casi toda mi confusión había venido de esperar que se movieran al mismo paso.

`https://gonor.me` carga con candado verde ahora, y por fin se siente como *mi* dirección. El apex está resuelto. `app.` y `api.` están esperando.

Siguiente capítulo pronto.
