# AKME Estudio

Sitio público independiente: https://eduardoxyz22-maker.github.io/AKME-ESTUDIO/

Copia de la web AKME aprobada en el commit `3aa5da0ab39acc3ea98be9f1f4566d1fea7240f5`. Conserva las cuatro páginas, galerías, medios y cotizador. No contiene datos ni archivos del panel de ventas.

Publicación con GitHub Pages desde `main`, raíz `/`. Recursos y enlaces internos relativos.

Pruebas: `node tests/test_akme_cotizador.mjs`, `node tests/test_akme_pages.mjs`, `node tests/test_akme_animals.mjs` (Playwright y Edge). Crear `qa-output` antes de ejecutarlas. `AKME_LIVE=1` verifica el sitio público.

## Campaña temporal Halloween

`seasonal-config.js` controla toda la ambientación. Cambiar `enabled: true` a `enabled: false` y publicar retira la franja, las telarañas y el detalle de transición; también restaura el gato y su aviso normales. No hay fecha automática de activación o vencimiento. El gato conserva el temporizador de 10 segundos de `camera.js`.

La versión anterior está disponible en el commit `08abbb14dbfefc3e479bb650f5bbc8206c4d308a`.

Audio de bienvenida: MP3 original completo (9,56 s), únicamente en Inicio y al aparecer el gato de la franja, después de elegir «Entrar con sonido». Se reproduce una vez por sesión de pestaña, volumen inicial 35 %, sin bucles. «Entrar sin sonido» no solicita el archivo. El control visible permite silenciar/reanudar; ocultar la pestaña pausa y exige reanudar explícitamente. Desactivar la campaña también elimina esta opción.

La sección `#halloween` ofrece «Oír la risita» si no hubo consentimiento o si el navegador bloqueó el inicio automático tras desplazarse. La elección de silencio se respeta hasta que se active explícitamente ese botón. Se guardan por separado elección y reproducción iniciada: recargar no duplica la risa. No se vincula al ciclo de 10 segundos del gato flotante.
