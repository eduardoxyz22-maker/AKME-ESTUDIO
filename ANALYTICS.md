# GA4 · preparación local (sin publicar)

Base: `origin/main` verificado por `git fetch origin main`, commit `803bd5357047d47cc998aae4229ccc3904afd80a`. Se conservan las cuatro páginas, medios, cotizador y campaña Halloween. No cambia hosting, DNS ni otros repositorios.

- Cuenta: `410582427`; propiedad: `557243125`; stream: `16027054932`.
- Measurement ID público: `G-JLTP3YSG40` (no es una credencial).
- Panel privado, con acceso autorizado de Google: https://analytics.google.com/analytics/web/provision/?pli=1#/a410582427p557243125/reports/intelligenthome
- Sitio: https://eduardoxyz22-maker.github.io/AKME-ESTUDIO/

## Funcionamiento

`analytics.js` se incluye en las cuatro páginas. Antes de aceptar no inserta ningún recurso de Google ni crea cookies de Analytics. Rechazar y aceptar tienen el mismo peso visual. La preferencia se guarda localmente; si el navegador bloquea almacenamiento, sigue funcionando durante esa página. El pie permite reabrir y revocar. Cambiar o borrar la elección en otra pestaña detiene los contextos abiertos.

La etiqueta vive en `analytics-frame.html`, un documento local oculto sin enlaces, formularios, textos comerciales ni datos del contacto. No carga Google si se abre directamente. El padre envía mensajes con origen y emisor verificados; el receptor vuelve a validar los enums. Revocar marca `ga-disable`, destruye el iframe (temporizadores y listeners incluidos) y borra las cookies `_ga`/`_ga_*` del sitio. No revierte solicitudes que ya se enviaron.

Se usa una única vista explícita por carga de página (`send_page_view:false`). `scroll` se envía una vez al llegar al 90% después de aceptar; se mide en el padre porque el iframe no tiene contenido desplazable. No se observa automáticamente ningún enlace ni formulario del sitio. Solo los controles marcados y los handlers explícitos del formulario válido/cotizador emiten `whatsapp_click`.

Parámetros de `whatsapp_click`:

| Parámetro | Valores permitidos |
| --- | --- |
| `button_location` | `contact`, `floating`, `package`, `quote`, `quote_custom`, `brief`, `halloween` |
| `package` | `none`, `smart`, `esencial`, `completo`, `pro`, `elite`, `custom` |

No se envían textos, nombres, emails, presupuestos, cantidades, URLs de WhatsApp ni mensajes. `page_location` se construye desde cuatro rutas fijas; el título usa un nombre fijo. No se recogen querystrings, fragmentos ni UTM. El referrer se reduce a orígenes fijos de Google/Bing/Facebook/Instagram y del sitio; los desconocidos se omiten. Esto sacrifica detalle de campañas y referencias a favor de minimizar datos. Los recursos de la etiqueta usan `no-referrer`.

No se configura User-ID. La etiqueta desactiva Google Signals y personalización publicitaria y deniega los tres consentimientos de publicidad. Cookies de Analytics: 30 días, sin renovación automática, dominio exacto, ruta `/`. Este plazo de cookie **no equivale** a la retención de eventos de GA4. La retención de la cuenta sigue pendiente de confirmación, como indica el aviso visible.

## Cuenta y pendientes antes de publicar

Confirmado por la sesión de origen: Google Signals OFF, datos aportados por usuarios OFF, personalización publicitaria desactivada en 307/307 regiones y redacción de email activa. No se modificó la cuenta desde este checkout.

Pendiente de verificar en Administrar → Flujos de datos → stream web → Medición mejorada: vistas de página y scroll ON; clics salientes, interacciones de formularios, búsqueda en el sitio, video y descargas OFF. En las opciones avanzadas de vistas de página desactivar eventos por cambios del historial (sitio multipágina, vistas explícitas). No se afirma que estos ajustes ya estén guardados. El aislamiento evita exponer los formularios aunque el ajuste remoto aún esté pendiente.

Confirmar retención real en Administrar → Configuración de datos → Retención de datos; actualizar el aviso si corresponde. Crear dimensiones personalizadas de ámbito evento `button_location` y `package` para los desgloses. Consultar usuarios/sesiones en adquisición, rutas en páginas y pantallas, y `whatsapp_click` en eventos. Un usuario es una estimación de navegador; un clic no prueba contacto o venta. La medición refleja quienes aceptan y puede perder visitas por bloqueadores.

No hacer push ni publicar sin una ruta autorizada: hubo una denegación previa de push automático a main y esta tarea no la evita mediante cloud ni API. Tras publicación autorizada, probar el sitio real con consentimiento y verificar Realtime/DebugView y payloads sin datos personales. No prometer datos históricos ni medición del tráfico previo.

## Verificación reproducible

Requiere Playwright y un navegador Edge. En este cloud ya están disponibles:

```sh
node --import /workspace/akme-tools/edge-local.mjs tests/test_akme_analytics.mjs
node tests/test_akme_cotizador.mjs
node --import /workspace/akme-tools/edge-local.mjs tests/test_akme_pages.mjs
```

La prueba de Analytics intercepta el script remoto con una respuesta vacía; **no simula ni verifica internamente GA4**. Comprueba solicitudes previas al permiso, comandos preparados, enums, consentimiento/revocación, eliminación de cookies de prueba, pestañas, formulario/cotizador, scroll y dimensiones de pantalla. Guarda capturas y evidencia en `qa-output/analytics-*` (ignorado por Git).

Para verificar la librería real en un entorno que permita el dominio:

```sh
AKME_REAL_GA=1 node --import /workspace/akme-tools/edge-local.mjs tests/test_akme_analytics.mjs
```

Ese modo deja descargar gtag, intercepta todos los envíos collect para no contaminar informes, exige observar payloads reales y busca datos sensibles/eventos automáticos no deseados. En este cloud la descarga de `https://www.googletagmanager.com/gtag/js?id=G-JLTP3YSG40` falla con `CONNECT tunnel failed, response 403`; el modo real no pudo validarse. No se alteró la red para sortearlo.

Referencias: [configuración oficial GA4](https://developers.google.com/analytics/devguides/collection/ga4/reference/config), [consentimiento](https://developers.google.com/tag-platform/security/guides/consent). El aviso describe esta implementación; no certifica cumplimiento legal absoluto.

## Resultado local

Pasaron la suite de Analytics con etiqueta interceptada, el catálogo/cotizador y la suite existente de páginas (navegación, historial, menú móvil, cinco planes, presupuestos, extras, comparación, copiar, WhatsApp, FAQ y galerías completas). Sin errores de JavaScript; `git diff --check` y sintaxis JavaScript correctos. Capturas revisadas en 320 y 1440 px; también generadas en 390 y 768 px y del aviso de privacidad. El modo real queda bloqueado por el 403 mencionado.
