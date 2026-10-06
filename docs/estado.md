# Estado de la demo · Bodega Ejemplo (ficticia)

Última actualización: 07/10/2026. Demo de chiq.es: una web de bodega **ficticia** hecha con Astro, para enseñar a las
bodegas cómo una web puede acompañar al cliente y contar la historia del vino de forma inmersiva. Todos los datos de la
bodega son ficticios y la página lo dice. Se publicará en `https://demo.chiq.es` (sin indexar).

## Cómo se trabaja

```bash
npm ci
npm run build
```

Vista previa: servir `dist/` (en el PC del autor, la configuración `demo-bodega` de `.claude/launch.json` de
`estudio-vino`, puerto 8767). Para probar las escenas en el navegador integrado, la pestaña tiene que estar al frente:
en segundo plano no corre `requestAnimationFrame` y las partículas no avanzan. En pantallas táctiles no hay Lenis
(scroll nativo). Las maquetas de `docs/maquetas/premium/` se sirven con la configuración `maquetas-premium` (puerto 8768).

## Páginas

| Ruta | Contenido |
|---|---|
| `/` | Vuelo sobre el viñedo (fotos de Unsplash provisionales) → racimo de moléculas → cinco escenas del recorrido del cliente → carrusel |
| `/mercado/` | La escena de probetas y los gráficos del capítulo E2 de chiq.es, con los JSON reales del modelo (`src/data/capitulos`, `src/data/graficos`). **Sin enlaces desde la home** desde el 07/10/2026 |
| `/como-esta-hecha/` | Esquema de la arquitectura: historia, datos y PrestaShop por API → Astro → Caddy, Coolify y Cloudflare. **Sin enlaces desde la home** desde el 07/10/2026 |

## La home (`src/pages/index.astro`)

Es la maqueta D (`docs/maquetas/premium/d-moleculas.html`, elegida por el autor el 07/10/2026) con el vuelo de entrada y
el carrusel de la home anterior. Papel claro, tipografía Newsreader y el recorrido del cliente en la cabecera
(Descubre, Prueba, Visita, Llévatelo, Quédate). Datos en `src/data/bodega.json`.

- `PLAN`: una entrada por escena, en el orden de las secciones; `n` es el número de pasos y `vista` dónde se coloca la
  forma en el ancho (`d`) y en el móvil (`m`). De ahí salen `formas`, `escenaDe` e `inicio`. Las dos primeras formas
  (la foto y el racimo) son la apertura y tienen su propia vista (`VISTA_APERTURA`).
- Cada escena es una sección con su parte `.fijo` pegada: una escena de un paso reposa en su forma toda la sección; una
  larga reparte sus pasos y el scroll salta al más cercano (`objetivoM`).
- Motor WebGL2 propio: moléculas de vino en 3D (puntos suaves, más grandes y opacos al azar), `uCalma` (sin dispersión
  entre pasos de la misma escena), `aCol` y `aCol2` (color propio por partícula; solo lo usa la bodega) y `uFoto`
  (colores de la foto del racimo).
- El ratón **gira** la forma (no la deforma), con un giro lento de fondo; en las escenas de varios pasos, menos.
- Cifras sobre las formas: `ETIQ[forma]`, etiquetas HTML proyectadas con la misma cámara (`proyectar`), con un halo de
  papel y separadas si se pisan; `pm` es su posición en el móvil. Las listas `.datos` siguen en el HTML para lectores
  de pantalla y sin WebGL.
- Sin botones falsos: lo que aún no existe dice «próximamente» (reservas, tienda, club).
- El vuelo es un solo zoom a ritmo constante hacia el mismo punto de fuga (`ORIGEN_FOTO`) con un cambio de foco de una
  foto a la otra; la segunda llega a `ESCALA_FOTO` en `P_FIN`, la escala a la que las moléculas toman sus píxeles.
- El menú son las secciones de una web de bodega (Historia, Los vinos, Visitas, Tienda, Club) y lleva a su parte de la
  home; «Bodega Ejemplo» solo está en el logo y «ficticia», una vez, en el pie.

| # | Paso | Escena | Forma |
|---|---|---|---|
| — | Apertura | Vuelo y «Cuatro parcelas, un vino» | La foto se acerca hasta las uvas, que se vuelven el racimo de moléculas |
| 01 | Descubre | La ladera | Relieve con cepas en hileras (tronco y copa en vaso; `FILA` y `CEPA`); en el segundo paso las cepas de las cuatro parcelas se ven más frondosas (`terruno.parcelas`; su sitio en el relieve, `SITIO`) |
| 02 | Prueba | Lo que hay en la copa | La rueda de cata de los tres vinos (3 pasos) |
| 03 | Visita | Ven a vernos | La bodega de hormigón con sus colores (lamas en vino, mirador, portón, cipreses), inventada (`visitas`) |
| 04 | Llévatelo | Llévatelo a casa | La botella con precio, stock y formato |
| 05 | Quédate | El sello de la casa | Sello de vino con las iniciales en relieve y en oro (`iniciales`, «CM»), que se ve en 3D al girar |
| — | Final | Carrusel | Cuatro paneles que llevan a su escena: la ladera, la cata (render de su rueda de moléculas, `public/img/cata-3d.webp`), la bodega y «Tienda y club» (fotos de Unsplash, provisionales y sin personas) |

## Pendiente

1. **Publicar en `demo.chiq.es`** con Coolify, desde este repositorio público y su `Dockerfile` (Caddy, puerto 8080).
2. Fotos de Unsplash provisionales; en la web final, fotogramas propios.

## Historial

- 07/10/2026 (noche): primera foto nueva (una vid a contraluz) con el zoom hacia ella; cepas en la ladera; sello «CM»
  en oro; carrusel de cuatro paneles con el render de la cata; los vinos sin «Ejemplo» en el nombre.
- 07/10/2026 (tarde): vuelo con zoom continuo y cambio de foco; carrusel con una foto por sección; menú de bodega;
  menos repeticiones de «Bodega Ejemplo» y «ficticia».
- 07/10/2026: la home pasa a la maqueta D (recorrido del cliente, moléculas en 3D, ladera en relieve); fuera las
  probetas, los bancales, la elaboración, el ensamblaje y el brindis. Maquetas A, B, C y D en `docs/maquetas/premium/`.
- 06/10/2026: escenas 03, 06, 07 y 08 de la home anterior; `/mercado/` sin rectángulos de anchura negativa ni
  «Borrador»; cifras de cuatro dígitos con separador.
