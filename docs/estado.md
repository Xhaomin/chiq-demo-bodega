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
| `/` | Vuelo sobre el viñedo (fotos de Unsplash provisionales) → racimo de partículas → ocho escenas fijas |
| `/mercado/` | La escena de probetas y los gráficos del capítulo E2 de chiq.es, con los JSON reales del modelo (`src/data/capitulos`, `src/data/graficos`) |
| `/como-esta-hecha/` | Esquema de la arquitectura: historia, datos y PrestaShop por API → Astro → Caddy, Coolify y Cloudflare |

## La home (`src/pages/index.astro`)

Salió de la maqueta `docs/maquetas/home-vuelo-particulas-webgl2.html` de `estudio-vino`. Datos en
`src/data/bodega.json`.

- `PLAN`: una entrada por escena, en el orden de las secciones; `n` es el número de pasos (años, vinos…). De ahí salen
  `formas`, `escenaDe` (escena de cada forma) e `inicio` (primera forma de cada escena).
- Cada escena es una sección `larga` con su parte `.fijo` pegada: una escena de un paso reposa en su forma toda la
  sección; una larga reparte sus pasos y el scroll salta al más cercano (`objetivoM`).
- Motor WebGL2 propio: `uCalma` (sin dispersión entre pasos de la misma escena, salvo las marcadas `disperso`),
  `aCol` y `aCol2` (color propio por partícula al principio y al final del tramo; `uTinteA/B` dicen si la forma lo
  tiene) y `uFoto` (colores de la foto del racimo). Las formas con color salen de `conColor(f)`.
- Cifras sobre las formas: `ETIQ[forma]`, etiquetas HTML proyectadas con la misma cámara (`proyectar`) y separadas si
  se pisan; `pm` es su posición en el móvil. Las listas `.datos` siguen en el HTML para lectores de pantalla y sin WebGL.
- Móvil (< 860 px): texto arriba y forma abajo; la ladera se aparta y cada escena puede crecer o subir con `movil` en
  su entrada de `PLAN`.
- El carril lateral se genera con una raya por escena.

| # | Escena | Forma | Estado |
|---|---|---|---|
| 01 | Cada añada, su propia historia | Probetas por marca como las de E2, 2016–2025 (10 pasos) | Hecha |
| 02 | La ladera | Cuatro bancales con muro y cepas en vaso; variedad, parcela y año | Hecha |
| 03 | Del racimo a la botella | Racimo → depósito → barricas → botella (4 pasos sin dispersión, `bodega.json` → `elaboracion`) | Hecha |
| 04 | En la copa | Rueda de cata de tres vinos (3 pasos) | Hecha |
| 05 | Cada botella | Botella con precio, stock y formato | Hecha |
| 06 | El ensamblaje | Tres parcelas que bajan en corrientes a la copa del Reserva (`vinos[].ensamblaje`) | Hecha |
| 07 | La visita | Bodega moderna de hormigón de frente (lamas en diagonal, mirador, cipreses), inventada e inspirada en arquitectura real, sin nombre ni logotipo (`visitas`) | Hecha |
| 08 | La tienda | Dos copas que brindan → ventana de la tienda con los tres vinos y su precio (2 pasos con dispersión); al final, «Cómo está hecha» | Hecha |

Las cifras de 03 no se escriben a mano: las toneladas salen de hectáreas × kg/ha y las 186.000 botellas, de sumar las
cuatro marcas de 2025.

## Pendiente

1. **Publicar en `demo.chiq.es`** con Coolify, desde este repositorio público y su `Dockerfile` (Caddy, puerto 8080).
2. Fotos de Unsplash provisionales; en la web final, fotogramas propios.

## Hecho el 06/10/2026 (segunda sesión)

- Escenas 03, 06, 07 y 08, cada una elegida en maqueta por el autor.
- `/mercado/`: los gráficos no se dibujan sin anchura (con la pestaña oculta salían rectángulos de anchura negativa) y
  el rótulo ya no dice «Borrador».
- Las cifras de cuatro dígitos llevan separador (2.500, 1.240), como el resto de la página.
