# Bodega Ejemplo · demo de chiq.es

Demo estática de una web de bodega **ficticia**, hecha con Astro, para enseñar la arquitectura de chiq.es:
vuelo sobre el viñedo con partículas en WebGL2 (`/`), los datos del mercado del MAPA con su fuente (`/mercado/`) y
cómo está hecha (`/como-esta-hecha/`). No vende nada y no se indexa.

- Las páginas `/` y `/mercado/` salen de las maquetas de `Xhaomin/estudio-vino` (`docs/maquetas/`).
- Los datos de `/mercado/` son los JSON que exporta el modelo de evidencia de chiq.es (`src/data/`), no cifras escritas a mano.
- Fotos de viñedo de Unsplash, provisionales.

```bash
npm ci
npm run dev
```

Se publica en `https://demo.chiq.es` con Coolify a partir del `Dockerfile` (Node para compilar, Caddy para servir en el puerto 8080).
