/* Motor de partículas de las maquetas premium de Bodega Ejemplo (canvas 2D, sin dependencias).
   Cada sección de la página pide una «forma». Las partículas viajan a ella empujadas por un flujo de ruido y siguen vivas
   allí: una forma puede moverse con el tiempo (un chorro que cae, un remolino que gira). Las formas trabajan en
   coordenadas normalizadas (u a la derecha, v hacia arriba; 1 es media caja) y el motor las pasa a la pantalla. */
(function () {
  const azar = (() => { let s = 11; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();

  /* Ruido de valor 2D suave y su rotacional, que da un flujo sin fuentes ni sumideros (parece líquido). */
  const PERM = new Uint8Array(512), VAL = new Float32Array(256);
  for (let i = 0; i < 256; i++) { PERM[i] = i; VAL[i] = azar() * 2 - 1; }
  for (let i = 255; i > 0; i--) { const j = (azar() * (i + 1)) | 0; const x = PERM[i]; PERM[i] = PERM[j]; PERM[j] = x; }
  for (let i = 0; i < 256; i++) PERM[i + 256] = PERM[i];
  const sv = (t) => t * t * (3 - 2 * t);
  function ruido(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), u = sv(x - xi), v = sv(y - yi), X = xi & 255, Y = yi & 255;
    const a = VAL[PERM[X + PERM[Y]]], b = VAL[PERM[X + 1 + PERM[Y]]], c = VAL[PERM[X + PERM[Y + 1]]], d = VAL[PERM[X + 1 + PERM[Y + 1]]];
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  const E = 0.07;
  const flujo = (x, y, t, q) => { q[0] = (ruido(x, y + E + t) - ruido(x, y - E + t)) / (2 * E); q[1] = -(ruido(x + E, y + t) - ruido(x - E, y + t)) / (2 * E); };

  /** Puntos dentro de un texto, normalizados a [-1, 1] en su lado mayor (para monogramas y sellos). */
  function muestrear(texto, fuente, cuantos) {
    const c = document.createElement('canvas'), W = 600, H = 400; c.width = W; c.height = H;
    const g = c.getContext('2d'); g.fillStyle = '#000'; g.font = fuente; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(texto, W / 2, H / 2);
    const d = g.getImageData(0, 0, W, H).data, dentro = [];
    let x0 = W, x1 = 0, y0 = H, y1 = 0;
    for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (d[(y * W + x) * 4 + 3] > 128) { dentro.push(x, y); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, m = Math.max(x1 - x0, y1 - y0) / 2 || 1, out = new Float32Array(cuantos * 2), k = dentro.length / 2;
    for (let i = 0; i < cuantos && k; i++) { const j = ((azar() * k) | 0) * 2; out[i * 2] = (dentro[j] + azar() * 2 - cx) / m; out[i * 2 + 1] = -(dentro[j + 1] + azar() * 2 - cy) / m; }
    return out;
  }

  /**
   * opciones: lienzo, n, estilo ('luz' suma colores sobre fondo oscuro; 'tinta' pinta encima; 'moleculas' dibuja puntos
   * redondos y suaves, como las moléculas de vino de la home), paleta [{color, ancho}] (en 'moleculas', [{rgb, tam, alfa}]
   * con tres tamaños y tres opacidades: cada partícula toma uno de los tres, los grandes más opacos),
   * fondo ([r, g, b] o null para dejar ver el fondo CSS), formas (R) => ({ nombre: forma }), cajas (W, H) => ({ tipo: caja }).
   * forma: { pos(i, t, q) escribe u, v en q (q[2] = 1 si salta de un extremo al otro), color(i), caja, flujo, rigidez, estela }.
   * Para un movimiento más calmado: impulso (golpe al cambiar de forma, 5), agitacion (flujo extra al cambiar, 2.5),
   * repulsion (del ratón, 1.8) y enForma (las partículas nacen ya en la primera forma en lugar de repartidas al azar).
   */
  function Motor(o) {
    const { lienzo, estilo, paleta } = o, n = innerWidth < 760 ? Math.round(o.n * 0.45) : o.n, ctx = lienzo.getContext('2d');
    const X = new Float32Array(n), Y = new Float32Array(n), PX = new Float32Array(n), PY = new Float32Array(n), VX = new Float32Array(n), VY = new Float32Array(n);
    const R = { n, R1: new Float32Array(n), R2: new Float32Array(n), R3: new Float32Array(n), R4: new Float32Array(n) };
    for (let i = 0; i < n; i++) { R.R1[i] = azar(); R.R2[i] = azar(); R.R3[i] = azar(); R.R4[i] = azar(); }
    const formas = o.formas(R, muestrear);
    const TAM = Uint8Array.from(R.R4, (r) => Math.min(2, Math.floor(r * 3)));
    /** Una molécula: un disco con el borde difuminado, pintado una vez y estampado en cada cuadro. */
    const molecula = (rgb, d, a) => { const dpr = Math.min(devicePixelRatio || 1, 2), L = Math.ceil(d * dpr) + 2, c = document.createElement('canvas'); c.width = c.height = L;
      const g = c.getContext('2d'), gr = g.createRadialGradient(L / 2, L / 2, 0, L / 2, L / 2, L / 2), col = rgb.join(',');
      gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(0.45, `rgba(${col},${a * 0.85})`); gr.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = gr; g.fillRect(0, 0, L, L); return c; };
    const EM = innerWidth < 760 ? 0.7 : 1;   // en el móvil las formas son pequeñas: moléculas más finas
    const SPR = estilo === 'moleculas' ? paleta.map((p) => p.tam.map((d, k) => molecula(p.rgb, d * EM, p.alfa[k]))) : null;
    let W = 0, H = 0, cajas = {}, forma = null, tCambio = 0, porColor = [], raton = [-1e5, -1e5], visible = true;
    function tam() {
      const dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
      lienzo.width = Math.round(W * dpr); lienzo.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cajas = o.cajas(W, H, W < 760);
      for (let i = 0; i < n; i++) if (!X[i] && !Y[i]) { X[i] = PX[i] = azar() * W; Y[i] = PY[i] = azar() * H; }
    }
    tam(); addEventListener('resize', tam);
    addEventListener('pointermove', (e) => { raton = [e.clientX, e.clientY]; });
    addEventListener('pointerleave', () => { raton = [-1e5, -1e5]; });
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

    const impulso = o.impulso ?? 5, agitacion = o.agitacion ?? 2.5, repulsion = o.repulsion ?? 1.8;
    function poner(nombre) {
      if (forma === formas[nombre]) return;
      const primera = !forma; forma = formas[nombre]; tCambio = performance.now() / 1000;
      porColor = paleta.map(() => []);
      for (let i = 0; i < n; i++) { porColor[Math.min(paleta.length - 1, forma.color(i))].push(i); VX[i] += (azar() - 0.5) * impulso; VY[i] += (azar() - 0.5) * impulso; }
      if (primera && o.enForma) { const b = cajas[forma.caja || 'derecha'], q = [0, 0, 0];
        for (let i = 0; i < n; i++) { forma.pos(i, tCambio, q); X[i] = PX[i] = b.cx + q[0] * b.s + (azar() - 0.5) * 30; Y[i] = PY[i] = b.cy - q[1] * b.s + (azar() - 0.5) * 30; VX[i] = VY[i] = 0; }
        tCambio -= 1.6; }
      porColor = porColor.map((l) => Uint32Array.from(l));
    }
    const q = [0, 0, 0], f = [0, 0];
    function cuadro(ms) {
      requestAnimationFrame(cuadro);
      if (!forma || !visible) return;
      const t = ms / 1000, dt = t - tCambio, b = cajas[forma.caja || 'derecha'];
      const k = 0.004 + (forma.rigidez ?? 0.06) * Math.min(1, (dt / 1.6) ** 2), fl = (forma.flujo ?? 0.3) * (1 + agitacion * Math.max(0, 1 - dt / 1.2)), amort = 0.84;
      ctx.globalCompositeOperation = o.fondo ? 'source-over' : 'destination-out';
      ctx.fillStyle = o.fondo ? `rgba(${o.fondo.join(',')},${forma.estela ?? 0.2})` : `rgba(0,0,0,${forma.estela ?? 0.2})`;
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < n; i++) {
        q[2] = 0; forma.pos(i, t, q);
        const tx = b.cx + q[0] * b.s, ty = b.cy - q[1] * b.s;
        if (q[2] && Math.abs(tx - X[i]) + Math.abs(ty - Y[i]) > b.s * 0.5 && dt > 2) { X[i] = PX[i] = tx; Y[i] = PY[i] = ty; VX[i] = VY[i] = 0; continue; }
        flujo(X[i] * 0.0035, Y[i] * 0.0035, t * 0.12, f);
        let ax = (tx - X[i]) * k + f[0] * fl, ay = (ty - Y[i]) * k + f[1] * fl;
        const dx = X[i] - raton[0], dy = Y[i] - raton[1], d2 = dx * dx + dy * dy;
        if (repulsion && d2 < 10000) { const m = (1 - d2 / 10000) * repulsion / Math.sqrt(d2 + 1); ax += dx * m; ay += dy * m; }
        VX[i] = VX[i] * amort + ax; VY[i] = VY[i] * amort + ay;
        PX[i] = X[i]; PY[i] = Y[i]; X[i] += VX[i]; Y[i] += VY[i];
      }
      if (SPR) {
        ctx.globalCompositeOperation = 'source-over';
        for (let c = 0; c < paleta.length; c++) { const l = porColor[c]; if (!l) continue;
          for (let j = 0; j < l.length; j++) { const i = l[j], k = TAM[i], d = paleta[c].tam[k] * EM; ctx.drawImage(SPR[c][k], X[i] - d / 2, Y[i] - d / 2, d, d); } }
        return;
      }
      ctx.globalCompositeOperation = estilo === 'luz' ? 'lighter' : 'source-over'; ctx.lineCap = 'round';
      for (let c = 0; c < paleta.length; c++) {
        const l = porColor[c]; if (!l || !l.length) continue;
        ctx.beginPath(); ctx.strokeStyle = paleta[c].color; ctx.lineWidth = paleta[c].ancho;
        for (let j = 0; j < l.length; j++) { const i = l[j], x = X[i], y = Y[i]; ctx.moveTo(PX[i], PY[i]); ctx.lineTo(Math.abs(x - PX[i]) + Math.abs(y - PY[i]) < 0.35 ? x + 0.35 : x, y); }
        ctx.stroke();
      }
    }
    requestAnimationFrame(cuadro);
    /** De coordenadas de la forma a la pantalla (para colocar etiquetas HTML). */
    const aPantalla = (u, v, tipo) => { const b = cajas[tipo || forma?.caja || 'derecha']; return [b.cx + u * b.s, b.cy - v * b.s]; };
    return { poner, aPantalla, get forma() { return forma; } };
  }

  /** Une las secciones [data-forma] al motor: la más cercana al centro de la pantalla manda, y el recorrido se ilumina. */
  function enlazar(motor, alCambiar) {
    const secs = [...document.querySelectorAll('[data-forma]')], pasos = [...document.querySelectorAll('[data-paso]')];
    let actual = null;
    const mirar = () => {
      const c = innerHeight / 2; let mejor = secs[0], d0 = Infinity;
      secs.forEach((s) => { const r = s.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - c); if (d < d0) { d0 = d; mejor = s; } });
      if (mejor !== actual) {
        actual = mejor; motor.poner(mejor.dataset.forma);
        pasos.forEach((p) => p.classList.toggle('on', p.dataset.paso === mejor.dataset.formaPaso));
        document.body.dataset.seccion = mejor.dataset.forma; alCambiar?.(mejor);
      }
    };
    addEventListener('scroll', mirar, { passive: true }); addEventListener('resize', mirar); mirar();
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('dentro')), { threshold: 0.3 });
    document.querySelectorAll('section').forEach((s) => io.observe(s));
  }

  window.Maqueta = { Motor, enlazar, muestrear };
})();
