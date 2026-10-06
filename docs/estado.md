# Estado de la demo · Bodega Ejemplo (ficticia)

Última actualización: 06/10/2026. Demo de chiq.es: una web de bodega **ficticia** hecha con Astro, para enseñar a las
bodegas cómo cuenta su historia y sus datos una web «sin cabeza». Todos los datos de la bodega son ficticios y la
página lo dice. Se publicará en `https://demo.chiq.es` (sin indexar).

## Cómo se trabaja

```bash
npm ci
npm run build
```

Vista previa: servir `dist/` (en el PC del autor, la configuración `demo-bodega` de `.claude/launch.json` de
`estudio-vino`, puerto 8767). Para probar las escenas en el navegador integrado, la pestaña tiene que estar al frente:
en segundo plano no corre `requestAnimationFrame` y las partículas no avanzan. En pantallas táctiles no hay Lenis
(scroll nativo).

## Páginas

| Ruta | Contenido |
|---|---|
| `/` | Vuelo sobre el viñedo (fotos de Unsplash provisionales) → racimo de partículas → seis escenas fijas |
| `/mercado/` | La escena de probetas y los gráficos del capítulo E2 de chiq.es, con los JSON reales del modelo (`src/data/capitulos`, `src/data/graficos`) |
| `/como-esta-hecha/` | Esquema de la arquitectura: historia, datos y PrestaShop por API → Astro → Caddy, Coolify y Cloudflare |

## La home (`src/pages/index.astro`)

Salió de la maqueta `docs/maquetas/home-vuelo-particulas-webgl2.html` de `estudio-vino`. Datos en
`src/data/bodega.json`.

- `PLAN`: una entrada por escena, en el orden de las secciones; `n` es el número de pasos (años, vinos…). De ahí salen
  `formas`, `escenaDe` (escena de cada forma) e `inicio` (primera forma de cada escena).
- Cada escena es una sección `larga` con su parte `.fijo` pegada: una escena de un paso reposa en su forma toda la
  sección; una larga reparte sus pasos y el scroll salta al más cercano (`objetivoM`).
- Motor WebGL2 propio: `uCalma` (sin dispersión entre pasos de la misma escena), `uTinteA/B` (color propio por
  partícula; lo usan las probetas), `uFoto` (colores de la foto del racimo).
- Cifras sobre las formas: `ETIQ[forma]`, etiquetas HTML proyectadas con la misma cámara (`proyectar`) y separadas si
  se pisan. Las listas `.datos` siguen en el HTML para lectores de pantalla y sin WebGL.
- Móvil (< 860 px): texto arriba y forma abajo; ajustes por escena en `vista` (la ladera se aparta, las probetas
  crecen).

| # | Escena | Forma | Estado |
|---|---|---|---|
| 01 | Cada añada, su propia historia | Probetas por marca como las de E2, 2016–2025 (10 pasos) | Hecha |
| 02 | La ladera | Cuatro bancales con muro y cepas en vaso; variedad, parcela y año | Hecha |
| 03 | El cliente es el dato | Red de canales | **Se sustituye** por «Del racimo a la botella» (aprobado) |
| 04 | En la copa | Rueda de cata de tres vinos (3 pasos) | Hecha |
| 05 | Cada botella | Botella con precio, stock y formato | Hecha |
| 06 | Sin cabeza | Ventana de web | **Se sustituye** por una escena final por decidir; el enlace a «Cómo está hecha» pasa a su final y a la galería |

## Pendiente

1. **03 · Del racimo a la botella** (aprobado con maqueta): escena larga de 4 pasos con `uCalma`: racimo → depósito →
   barricas → botella. Cifras ficticias y coherentes: 80 ha a mano, 2.500 kg/ha (200 t de uva) · 140.000 l en
   depósito, 18 días · 560 barricas de roble francés, 14 meses · 186.000 botellas en 2025 (la suma de las cuatro
   marcas de ese año; calcularla desde `bodega.json`).
2. **06 · Escena final**: el autor descartó las siluetas de personas reales y la cepa vieja (ya está el bancal).
   Opciones por enseñar en maqueta antes de construir: tres parcelas que se funden en un vino, la fachada de la
   bodega y la visita, el brindis y la tienda, el monograma de la bodega. Inspiración permitida: webs de bodegas reales
   (cepas viejas, terruño, bajo rendimiento), nunca sus personas, sus fotos ni sus datos.
3. **Publicar en `demo.chiq.es`** con Coolify, desde este repositorio público y su `Dockerfile` (Caddy, puerto 8080).
4. `/mercado/`: la consola da errores de `<rect>` con anchura negativa (rectángulos transparentes de los gráficos) y
   la escena dice «Borrador» porque E2 no tiene fecha de publicación.
5. Fotos de Unsplash provisionales; en la web final, fotogramas propios.
