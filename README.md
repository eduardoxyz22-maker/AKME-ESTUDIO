# AKME Estudio

Sitio público independiente: https://eduardoxyz22-maker.github.io/AKME-ESTUDIO/

Copia de la web AKME aprobada en el commit `3aa5da0ab39acc3ea98be9f1f4566d1fea7240f5`. Conserva las cuatro páginas, galerías, medios y cotizador. No contiene datos ni archivos del panel de ventas.

Publicación con GitHub Pages desde `main`, raíz `/`. Recursos y enlaces internos relativos.

Pruebas: `node tests/test_akme_cotizador.mjs`, `node tests/test_akme_pages.mjs`, `node tests/test_akme_animals.mjs` (Playwright y Edge). Crear `qa-output` antes de ejecutarlas. `AKME_LIVE=1` verifica el sitio público.

## Campaña temporal Halloween

`seasonal-config.js` controla toda la ambientación. Cambiar `enabled: true` a `enabled: false` y publicar retira la franja, las telarañas y el detalle de transición; también restaura el gato y su aviso normales. No hay fecha automática de activación o vencimiento. El gato conserva el temporizador de 10 segundos de `camera.js`.

La versión anterior está disponible en el commit `08abbb14dbfefc3e479bb650f5bbc8206c4d308a`.

Audio Halloween: MP3 original completo (9,56 s). Al aparecer el gato en `#halloween`, se intenta reproducir una vez por sesión de pestaña, al 35 % y sin bucles. No hay selector de entrada ni audio antes de la sección. El navegador decide si permite autoplay; desplazarse no se considera consentimiento ni desbloqueo garantizado. Si lo bloquea, aparece «Oír la risita» junto al gato, sin modal. El silenciamiento explícito se conserva. Ocultar la pestaña pausa, sin reanudar automáticamente. Recargar no duplica la risa. El ciclo de 10 segundos del gato flotante es independiente. Desactivar la campaña retira también esta función.
