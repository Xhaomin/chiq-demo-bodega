import { defineConfig } from 'astro/config';

// Demo estática de Bodega Ejemplo (ficticia) para chiq.es: todo se compila a HTML al publicar.
export default defineConfig({
  site: 'https://demo.chiq.es',
  trailingSlash: 'ignore',
});
