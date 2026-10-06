# Demo de Bodega Ejemplo (chiq.es): se compila con Node y se sirve estática con Caddy en el puerto 8080.
FROM node:22-alpine AS compilar
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY astro.config.mjs ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=compilar /app/dist /srv
EXPOSE 8080
