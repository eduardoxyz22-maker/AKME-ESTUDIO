# AKME · presentación editorial

La identidad conserva Archivo, blanco, negro y lima `#a2d40b`. Las superficies oscuras usan `#171914`, texto blanco y texto secundario `#d1d3cc`; los controles lima usan texto `#0d0d0f`. Todas estas combinaciones superan 4,5:1.

## Componentes

- **Portafolio:** una pieza principal y dos secundarias por marca; las marcas alternan fondo blanco/negro. Todas las imágenes se muestran completas. Los videos mantienen portadas 9:16. Las tarjetas son enlaces nativos; JavaScript abre la galería con Escape y restitución de foco. El HTML inicial incluye las 15 vistas previas para conservar contenido sin JavaScript.
- **Paquetes:** nombre, precio, cuatro métricas mensuales, selector, destinatario, detalles y consulta en orden uniforme. La selección lima usa un botón con `aria-pressed` y refleja la comparación manual existente del cotizador. Al modificar necesidades o restablecer el cálculo, la selección visual se sincroniza. No se modifican precios ni reglas de recomendación.
- **Movimiento:** entradas únicas de 480 ms al aparecer, desplazamiento máximo de 14 px; estados hover de 180–350 ms. El contenido nunca depende de una clase oculta para mostrarse. Sin animación continua, sin desplazamiento de página controlado. `prefers-reduced-motion` cancela animaciones y transiciones.
- **Muestra audiovisual:** video H.264 1280×720, 25 fps, 14 s, sin audio. Portada estática, `preload=none`, reproducción voluntaria y controles nativos. No se descarga el video antes de interactuar. Se pausa al ocultar la pestaña. Texto adjunto identifica las campañas como trabajos realizados, no promociones vigentes.

## Procedencia del montaje

Fragmentos de medios ya publicados, sin recortar marcas o superponer texto sobre las piezas originales. Cada segmento dura 2,8 s y conserva el encuadre completo en una columna de 432×720. Una columna editorial separada identifica la marca.

| Archivo original en assets/clientes | Inicio | Duración |
| --- | ---: | ---: |
| yahweh-agricultura.mp4 | 21 s | 2,8 s |
| mirna-labios-campana.mp4 | 5 s | 2,8 s |
| cosmetic-implantes.mp4 | 17 s | 2,8 s |
| spadental-consulta.mp4 | 15 s | 2,8 s |
| ferromarc-desbrozadora.mp4 | 3 s | 2,8 s |

## Validación

`tests/test_akme_revista.mjs` verifica retícula, portadas, reproducción completa, selección con teclado, sincronización, foco, movimiento reducido, fallback sin JavaScript, contraste y recursos. Se complementa con las pruebas existentes de catálogo, páginas y mascotas. Capturas locales se guardan en `qa-output/` (fuera de Git).

Entorno: Windows, Microsoft Edge mediante Playwright. Los tamaños de viewport móviles no equivalen a pruebas en dispositivos físicos. Safari/WebKit nativo no validado en este equipo.

## Impacto del logo en el pie

Se conserva `assets/logo.png` sin alteraciones. La animación nativa de 1,3 s traslada la imagen 44 px hacia el suelo, rebota 9 px y queda en reposo. Solo se activa cuando el pie completo está visible y el scroll lleva 400 ms detenido. No depende de sessionStorage: una nueva carga puede volver a mostrarla. No se repite automáticamente al subir y bajar dentro de la misma página. El botón circular permite repetirla con clic, toque o teclado sin navegar; el enlace del logo muestra el efecto y luego mantiene su destino de inicio. Clics modificados conservan el comportamiento nativo. La línea, las grietas y los acentos lima son SVG decorativo; el control de repetición es absoluto y no aumenta la altura del pie. Movimiento reducido conserva estado estático, oculta la repetición y mantiene navegación inmediata. Sin JavaScript se conserva el enlace original.

`tests/test_akme_impact.mjs` comprueba la imagen original, ausencia de CLS y overflow, altura idéntica del pie, WhatsApp, teclado, scroll repetido, atrás/adelante y movimiento reducido a 320/390/430/1366/1920 px.

## Portadas, visor y cierre

Las cinco galerías combinan su placa de identidad original con tres trabajos seleccionados. Las placas son enlaces nativos al primer medio y abren el visor con JavaScript; Canelitas conserva su perfil con el único logo disponible. No se recortan ni deforman logos o artes. Mirna presenta video, arte de labios y retrato en escritorio; el arte de rinomodelación sustituye otro retrato repetido en la galería. Los JPG nuevos son copias byte por byte de los finales aprobados:

- Labios: Drive `1LpSdUCt83JfKtcPa4aOe_Pcv6xJKaooI`, Library `libfile_03d6a1febae48191b12e4f7f3e64b53d`.
- Rinomodelación: Drive `19AbGA_WCQPKLlvnAfoZIXBqVj0fKyng7`, Library `libfile_fc17fc4f7b308191bfcd5cbba4e9e17b`.

El visor oscuro reserva filas separadas para título/cierre, medio completo, flechas/contador y selección. Usa `object-fit:contain`, no descarga videos antes de abrirlos y conserva controles nativos. Swipe horizontal de al menos 50 px para tacto/lápiz, sin capturar gestos verticales ni la franja de controles de video. Atrás cierra el modal; adelante lo reabre; Escape/cierre devuelve el foco al enlace de origen después de la navegación del historial. Sin JavaScript permanecen enlaces a los originales.

La navegación marca la página activa con línea lima tanto en escritorio como en el menú móvil; el estado móvil cerrado también muestra el nombre de la página. Las transiciones de 180 ms se desactivan con movimiento reducido. El cierre usa «TU MARCA. NUESTRO PRÓXIMO IMPACTO.», enlace de contacto y el logo/replay existentes. No se modifican el equipo, catálogo, recomendaciones ni mascotas.

QA: `test_akme_identidad.mjs` prueba cinco anchos (320,390,430,1366,1920), cuatro páginas, anclas visibles, controles fuera del arte, touch real emulado mediante CDP, historial, foco, no-JS y navegación. Se complementa con páginas/cotizador, SpaDental, revista, mascotas e impacto. Microsoft Edge 154.0.4258.48 en Windows; viewport y touch emulados, no dispositivo físico ni Safari/iOS nativo.
