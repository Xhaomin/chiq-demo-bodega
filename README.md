# Bodega Ejemplo · demo de chiq.es

Demo estática de una web de bodega **ficticia**, hecha con Astro. Cuenta el recorrido del cliente (descubre, prueba,
visita, llévatelo y quédate) con moléculas de vino en 3D, dibujadas con un motor propio en WebGL2. No vende nada y no
se indexa.

- Los datos de la bodega están en `src/data/bodega.json` y son inventados.
- Fotos de Unsplash, provisionales.
- Estado y pendientes en `docs/estado.md`.

```bash
npm ci
npm run dev
```

Se publica en `https://demo.chiq.es` con Coolify a partir del `Dockerfile` (Node para compilar, Caddy para servir en el puerto 8080).
