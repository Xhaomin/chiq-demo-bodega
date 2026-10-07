# Estado de la demo · Bodega Ejemplo (ficticia)

Última actualización: 07/10/2026. Demo de chiq.es: una web de bodega **ficticia** hecha con Astro, para enseñar a las
bodegas cómo una web puede acompañar al cliente y contar la historia del vino de forma inmersiva. Todos los datos de la
bodega son ficticios y la página lo dice. Publicada en `https://demo.chiq.es` (sin indexar) desde el 07/10/2026.

## Cómo se trabaja

```bash
npm ci
npm run build
```

Vista previa: servir `dist/` (en el PC del autor, la configuración `demo-bodega` de `.claude/launch.json` de
`estudio-vino`, puerto 8767). Para probar las escenas en el navegador integrado, la pestaña tiene que estar al frente:
en segundo plano no corre `requestAnimationFrame` y las partículas no avanzan. En pantallas táctiles no hay Lenis
(scroll nativo). Las maquetas de `docs/maquetas/premium/` se sirven con la configuración `maquetas-premium` (puerto 8768).

## Publicación

Coolify (`http://100.87.235.12:8000`, por Tailscale): proyecto `chiq-demo-bodega`, entorno `production`, aplicación
`yfpizofgkc2qvnlmt4dxfclg` (Public Git Repository `Xhaomin/chiq-demo-bodega`, rama `main`, build con `Dockerfile`).
Dominio `http://demo.chiq.es` con el puerto 8080 y sin redirección; Cloudflare (Flexible) sirve `https://demo.chiq.es` por
el túnel `*.chiq.es`. **No se despliega sola:** tras subir cambios a `main` hay que pulsar «Deploy» en Coolify. El
navegador integrado pide permiso en cada acción sobre esa IP (no admite «permitir siempre»); para leer el estado sin
clics, `ssh ubuntu@100.87.235.12` y `sudo docker exec coolify-db psql -U coolify -d coolify`.

## Páginas

| Ruta | Contenido |
|---|---|
| `/` | Vuelo sobre el viñedo (fotos de Unsplash provisionales) → racimo de moléculas → cinco escenas del recorrido del cliente → carrusel |
| `/404` | «Esta página no existe» y vuelta a la home |

`/mercado/` (los gráficos de E2 con los datos reales del modelo) y `/como-esta-hecha/` se borraron el 07/10/2026. Ya no
se enlazaban, `/mercado/` publicaba cifras de E2 antes que chiq.es y la otra estaba montada alrededor de ella. Si se
quiere contar la arquitectura, será una página nueva con el diseño de la home, con maqueta antes.

## La home (`src/pages/index.astro`)

Es la maqueta D (`docs/maquetas/premium/d-moleculas.html`, elegida por el autor el 07/10/2026) con el vuelo de entrada y
el carrusel de la home anterior. Papel claro, tipografía Newsreader y el recorrido del cliente en la cabecera
(Descubre, Prueba, Visita, Llévatelo, Quédate). Datos en `src/data/bodega.json`.

- `PLAN`: una entrada por escena, en el orden de las secciones; `n` es el número de pasos y `vista` dónde se coloca la
  forma en el ancho (`d`) y en el móvil (`m`). De ahí salen `formas`, `escenaDe` e `inicio`. Las dos primeras formas
  (la foto y el racimo) son la apertura y tienen su propia vista (`VISTA_APERTURA`).
- Cada escena es una sección con su parte `.fijo` pegada: una escena de un paso reposa en su forma toda la sección; una
  larga reparte sus pasos y el scroll salta al más cercano (`objetivoM`). La entrada (`#vuelo`) mide 340vh y las escenas
  de un paso 210vh, para que el ritmo sea parejo (antes, 520vh y 170vh: la entrada pedía demasiada rueda).
- Las vistas del ancho están pensadas para 16:10; en pantallas más cuadradas (1024 × 768) `vistaDe` encoge las formas a
  la par para que quepan junto al texto.
- Motor WebGL2 propio: moléculas de vino en 3D (puntos suaves, más grandes y opacos al azar), `uCalma` (sin dispersión
  entre pasos de la misma escena), `aCol` y `aCol2` (color propio por partícula; solo lo usa la bodega) y `uFoto`
  (colores de la foto del racimo).
- El ratón **gira** la forma (no la deforma), con un giro lento de fondo; en las escenas de varios pasos, menos.
- Cifras sobre las formas: `ETIQ[forma]`, etiquetas HTML proyectadas con la misma cámara (`proyectar`), con un halo de
  papel y separadas si se pisan; `pm` es su posición en el móvil. En la rueda, las de los lados salen del borde hacia
  fuera (`izq`, `der`; en el móvil, el aroma en dos líneas). Las parcelas llevan una línea en SVG hasta su sitio, que
  llega aunque la etiqueta se mueva; en el móvil van en fila sobre el relieve, ordenadas por su sitio (opción A de
  `docs/maquetas/premium/retoques-movil.html`). Las listas `.datos` siguen en el HTML para lectores
  de pantalla y sin WebGL.
- Sin botones falsos: lo que aún no existe dice «próximamente» (reservas, tienda, club).
- El vuelo es un solo zoom a ritmo constante sobre una foto (una cepa vieja con racimos) hacia su racimo central
  (`OBJETIVO`); `ajustarOrigen` calcula dónde cae en la pantalla (`ORIGEN_FOTO`) y el borde se desenfoca (`#foco`) como en
  un objetivo. La foto llega a `ESCALA_FOTO` en `P_FIN`, la escala a la que las moléculas toman sus píxeles.
- Los pasos del recorrido de la cabecera llevan a su escena, con el mismo scroll suave que el menú.
- El menú son las secciones de una web de bodega (Historia, Los vinos, Visitas, Tienda, Club) y lleva a su parte de la
  home; «Bodega Ejemplo» solo está en el logo y «ficticia», una vez, en el pie.

| # | Paso | Escena | Forma |
|---|---|---|---|
| — | Apertura | Vuelo y «Cuatro parcelas, un vino» | La foto se acerca hasta las uvas, que se vuelven el racimo de moléculas |
| 01 | Descubre | La ladera | Relieve con cepas en vaso en hileras (tronco retorcido, tres brazos y hojas; `FILA` y `CEPA`); en el segundo paso las cepas de las cuatro parcelas se ven más frondosas y cada una lleva su etiqueta sobre papel, unida a su sitio por una línea, con variedad, año y altitud (`terruno.parcelas`; su sitio en el relieve, `SITIO`) |
| 02 | Prueba | Lo que hay en la copa | La rueda de cata de los tres vinos (3 pasos) |
| 03 | Visita | Ven a vernos | La bodega de hormigón con sus colores (lamas en vino, mirador, portón, cipreses), inventada (`visitas`) |
| 04 | Llévatelo | Llévatelo a casa | La botella con precio, stock y formato |
| 05 | Quédate | El sello de la casa | Sello con las iniciales en relieve (`iniciales`, «CM») en el rojo de las moléculas sobre una cara clara, que se ve en 3D al girar |
| — | Final | Carrusel | Cinco paneles con foto que llevan a su escena: la ladera (la foto que abría la home original), la vendimia, la cata (tinto girando en una copa grande), la bodega y el club del vino (una bodega con botelleros, elegida por el autor). Unsplash, provisionales, sin personas ni marcas; candidatas en `docs/maquetas/premium/fotos-carrusel.html` |

## Pendiente

1. Que el autor pruebe con su rueda el nuevo ritmo del scroll (entrada de 340vh, escenas de 210vh).
2. Fotos de Unsplash provisionales; en la web final, fotogramas propios.
3. Favicon (ahora la consola da un 404 por él).
4. Los iconos de redes (Instagram, Facebook y YouTube) no enlazan: la bodega no tiene perfiles. Si se quieren
   enlaces, van en `redes` de `bodega.json`.

## Historial

- 07/10/2026 (madrugada, 5): iconos de redes en lugar de la nota del motor; publicada en `https://demo.chiq.es` con
  Coolify.
- 07/10/2026 (madrugada, 4): revisión con el autor. Cifras de la rueda fuera del borde; ladera con margen a 1440 px;
  formas encogidas en pantallas más cuadradas que 16:10; parcelas en fila en el móvil, con líneas que llegan a su sitio;
  índice de los paneles legible; pasos de la cabecera con enlace; entrada más corta y escenas más largas; fotos nuevas
  de la cata y del club; fuera `/mercado/` y `/como-esta-hecha/`.
- 07/10/2026 (madrugada, 3): etiquetas de las parcelas legibles y con altitud (nueva en `bodega.json`); cepas en vaso; sello «CM»
  en rojo; vendimia (hilera con racimos al sol) y club (tinto con velas) nuevos; el pie ya no habla de las fotos.
- 07/10/2026 (madrugada, 2): fotos del carrusel cambiadas (vendimia en cesto, la cata original con el vino saltando en la copa y
  un tinto con vela para el club; la ladera, encuadrada hacia las viñas). El 3D de la cata se queda como está; las
  maquetas alternativas (rosa en relieve, molécula, copa con aromas) están en `docs/maquetas/premium/cata-3d.html`.
- 07/10/2026 (madrugada): las moléculas que salen de la foto ya son del color del vino; carrusel de cinco fotos (ladera, vendimia,
  cata, bodega y club del vino).
- 07/10/2026 (noche, 2): el vuelo pasa a una sola foto (una cepa vieja con racimos) con zoom hasta el racimo central y
  desenfoque del borde.
- 07/10/2026 (noche): primera foto nueva (una vid a contraluz) con el zoom hacia ella; cepas en la ladera; sello «CM»
  en oro; carrusel de cuatro paneles con el render de la cata; los vinos sin «Ejemplo» en el nombre.
- 07/10/2026 (tarde): vuelo con zoom continuo y cambio de foco; carrusel con una foto por sección; menú de bodega;
  menos repeticiones de «Bodega Ejemplo» y «ficticia».
- 07/10/2026: la home pasa a la maqueta D (recorrido del cliente, moléculas en 3D, ladera en relieve); fuera las
  probetas, los bancales, la elaboración, el ensamblaje y el brindis. Maquetas A, B, C y D en `docs/maquetas/premium/`.
- 06/10/2026: escenas 03, 06, 07 y 08 de la home anterior; `/mercado/` sin rectángulos de anchura negativa ni
  «Borrador»; cifras de cuatro dígitos con separador.
