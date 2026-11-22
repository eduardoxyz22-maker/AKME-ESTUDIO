---
name: tiktok-viral
description: Bajar y analizar TikToks (virales, de la competencia o de referencia) para el estudio — números, gancho de los primeros 3 segundos, transcripción de la voz, ritmo de cortes y escenas — y sacar qué copiar en forma (no en contenido) para un cliente. Usalo cuando el dueño o Claudio pidan «ver qué funciona en TikTok», analizar un video viral, la cuenta de un competidor o referencias para un reel.
---

# TikTok viral — ver, medir y aprender

El dueño (22/11): *«también podés ver y analizar tiktoks virales»*. Esta skill la usan Claudio, Carlos (competencia), Rodrigo
(guiones) y Carla (producción) antes de escribir o producir un reel.

## Cómo se baja
```
python3 -I .claude/skills/tiktok-viral/analizar.py <carpeta del scratchpad> <url> [<url> ...]
python3 -I .claude/skills/tiktok-viral/analizar.py <carpeta del scratchpad> @cuenta --top 5
```
- Necesita `pip install yt-dlp curl_cffi` y ffmpeg. La transcripción va por api.elevenlabs.io (la clave la pone el proxy).
- Por video deja `<id>/resumen.md` (números, interacción %, cortes, música, texto, **gancho hablado 0-3 s**, todo lo que dice),
  `gancho.jpg` (0 · 0,5 · 1 · 1,5 · 2 · 3 s), `escenas.jpg` (cada cambio de plano), `voz.json` (palabras con tiempos) y el video.
- **Mirá las dos hojas de fotos con Read** antes de opinar: el gancho visual y el texto en pantalla no salen de la transcripción.
- `@cuenta --top N` ordena los últimos ~40 de esa cuenta por vistas (sirve para ver qué le funciona a un competidor).
- La búsqueda por hashtag de TikTok **no anda** en yt-dlp: los virales se encuentran por cuentas de referencia, por enlaces que pasa
  el dueño o por búsqueda web (`site:tiktok.com <tema>`).
- La red del entorno «Eduardo» tiene los hosts de TikTok (22/11). Si una descarga falla con «403 … no rule allows this host», el
  error del proxy nombra el servidor de video: hay que sumarlo al entorno (el entorno ya está en el tope de 20 hosts: sacar uno que no
  se use o pedirle al dueño otro entorno).
- Los videos y transcripciones quedan en el scratchpad: **nada de eso va a este repo** (es público).

## Qué se analiza de cada video (una ficha por video)
1. **Números**: vistas, interacción % ((me gusta + comentarios + compartidos + guardados) ÷ vistas), guardados y compartidos (lo
   que más dice de valor), duración, fecha. Comparalo con lo normal de esa cuenta (`--top` da la referencia).
2. **Gancho 0-3 s**: qué se ve (plano, persona, objeto, texto en pantalla) y qué se dice. ¿Pregunta, mito, número, promesa,
   «POV», resultado primero?
3. **Estructura**: gancho → desarrollo → giro/prueba → CTA; en qué segundo aparece cada parte.
4. **Ritmo**: cortes por segundo, cambios de plano, zoom, texto que aparece, subtítulos (estilo, tamaño, dónde van).
5. **Sonido**: voz a cámara, voz en off, música de tendencia o propia, efectos.
6. **CTA**: qué pide y cómo (comentario, guardado, WhatsApp, link en bio).
7. **Por qué funcionó** en una frase, con la evidencia.
8. **Cómo lo adaptamos** a un cliente de AKME: el formato y el ritmo, nunca copiar el contenido ni la música con derechos; con su
   marca (`marca/<cliente>` del panel) y las reglas de Meta del estudio si va a pauta (nada de antes/después, no hablarle al que
   mira de su cuerpo, nada de «garantizado»).

## Dónde queda lo aprendido
Lo que sirve se anota en el Panel AKME, colección `aprendizajes` (cliente o «general», fecha, fuente = enlace del TikTok, qué
funciona, cómo aplicarlo). Rodrigo y Carla lo leen antes de escribir o producir.
