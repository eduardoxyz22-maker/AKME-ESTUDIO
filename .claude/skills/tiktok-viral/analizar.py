#!/usr/bin/env python3
"""Baja TikToks y deja todo listo para analizarlos: números, transcripción, gancho y hoja de escenas.

Uso:
  python3 analizar.py SALIDA URL [URL ...]          # videos sueltos
  python3 analizar.py SALIDA @usuario --top 5        # los N con más vistas de los últimos ~40 de una cuenta
Necesita: yt-dlp y curl_cffi (pip), ffmpeg, y la red con los hosts de TikTok. La transcripción usa
api.elevenlabs.io (la clave la pone el proxy del entorno; acá va un valor de mentira).
Por cada video deja SALIDA/<id>/ con: video.mp4, datos.json, gancho.jpg (0-3 s), escenas.jpg, voz.json y resumen.md.
"""
import json, os, subprocess, sys

def sh(*a, **k):
    return subprocess.run(a, capture_output=True, text=True, **k)

def listar(usuario, top):
    r = sh(sys.executable, '-m', 'yt_dlp', '--flat-playlist', '--playlist-end', '40', '-J',
           'https://www.tiktok.com/' + usuario)
    try:
        ents = json.loads(r.stdout).get('entries', [])
    except Exception:
        sys.exit('No pude listar ' + usuario + ': ' + r.stderr[-400:])
    ents.sort(key=lambda e: e.get('view_count') or 0, reverse=True)
    return [e.get('url') or e.get('webpage_url') for e in ents[:top]]

def segundos_escena(video, maxn=12):
    r = sh('ffmpeg', '-hide_banner', '-i', video, '-vf', "select='gt(scene,0.32)',showinfo", '-f', 'null', '-')
    ts = []
    for l in r.stderr.splitlines():
        if 'pts_time:' in l:
            try: ts.append(float(l.split('pts_time:')[1].split()[0]))
            except Exception: pass
    return ts[:maxn]

def hoja(video, tiempos, salida, ancho=6):
    os.makedirs(salida + '.tmp', exist_ok=True)
    fotos = []
    for i, t in enumerate(tiempos):
        f = '%s.tmp/%02d.jpg' % (salida, i)
        sh('ffmpeg', '-loglevel', 'error', '-y', '-ss', '%.2f' % t, '-i', video, '-frames:v', '1',
           '-vf', "scale=240:-2,drawtext=text='%.1fs':x=6:y=6:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6" % t, f)
        if os.path.exists(f): fotos.append(f)
    if not fotos: return
    filas = (len(fotos) + ancho - 1) // ancho
    sh('ffmpeg', '-loglevel', 'error', '-y', '-framerate', '1', '-i', salida + '.tmp/%02d.jpg',
       '-vf', 'tile=%dx%d:padding=4:color=white' % (min(ancho, len(fotos)), filas), '-frames:v', '1', salida)
    for f in fotos: os.remove(f)
    os.rmdir(salida + '.tmp')

def voz(video, d):
    mp3 = os.path.join(d, 'voz.mp3')
    sh('ffmpeg', '-loglevel', 'error', '-y', '-i', video, '-vn', '-ac', '1', '-ar', '16000', '-b:a', '48k', mp3)
    r = sh('curl', '-sS', '-X', 'POST', 'https://api.elevenlabs.io/v1/speech-to-text', '-H', 'xi-api-key: x',
           '-F', 'model_id=scribe_v1', '-F', 'file=@' + mp3)
    os.remove(mp3)
    try: return json.loads(r.stdout)
    except Exception: return {'error': r.stdout[-300:] + r.stderr[-300:]}

def uno(url, base):
    r = sh(sys.executable, '-m', 'yt_dlp', '-f', 'best[height<=720]/best', '--write-info-json', '--no-progress',
           '-o', os.path.join(base, '%(id)s', 'video.%(ext)s'), url)
    vid = None
    for l in r.stdout.splitlines():
        if 'Destination:' in l or 'has already been downloaded' in l:
            vid = os.path.dirname(l.split('Destination:')[-1].replace('has already been downloaded', '').strip().strip('[download] '))
    if not vid:
        cands = [os.path.join(base, x) for x in os.listdir(base) if os.path.exists(os.path.join(base, x, 'video.info.json'))]
        cands.sort(key=os.path.getmtime)
        vid = cands[-1] if cands else None
    if not vid: print('✗', url, r.stderr[-300:]); return
    info = json.load(open(os.path.join(vid, 'video.info.json')))
    video = next(os.path.join(vid, f) for f in os.listdir(vid) if f.startswith('video.') and not f.endswith('.json'))
    v = info.get('view_count') or 0
    eng = sum(info.get(k) or 0 for k in ('like_count', 'comment_count', 'repost_count', 'save_count'))
    datos = {k: info.get(k) for k in ('id', 'webpage_url', 'uploader', 'upload_date', 'duration', 'view_count', 'like_count',
             'comment_count', 'repost_count', 'save_count', 'description', 'track', 'artist')}
    datos['interaccion_pct'] = round(100.0 * eng / v, 2) if v else None
    json.dump(datos, open(os.path.join(vid, 'datos.json'), 'w'), ensure_ascii=False, indent=1)
    os.remove(os.path.join(vid, 'video.info.json'))
    dur = float(info.get('duration') or 0)
    hoja(video, [0, 0.5, 1, 1.5, 2, 3], os.path.join(vid, 'gancho.jpg'))
    esc = segundos_escena(video)
    if len(esc) < 6 and dur: esc = sorted(set(esc + [round(dur * i / 8, 1) for i in range(1, 8)]))[:12]
    hoja(video, esc, os.path.join(vid, 'escenas.jpg'))
    t = voz(video, vid)
    json.dump(t, open(os.path.join(vid, 'voz.json'), 'w'), ensure_ascii=False)
    pal = t.get('words') or []
    g = ' '.join(w['text'] for w in pal if w.get('type') == 'word' and (w.get('start') or 0) < 3.0)
    cortes = len(esc)
    md = ['# %s · @%s' % (datos['id'], datos['uploader']), datos['webpage_url'], '',
          '- Fecha %s · %.0f s · %s vistas · %s me gusta · %s comentarios · %s compartidos · %s guardados · interacción %s %%' % (
              datos['upload_date'], dur, v, datos['like_count'], datos['comment_count'], datos['repost_count'],
              datos['save_count'], datos['interaccion_pct']),
          '- Cortes detectados: %d%s' % (cortes, (' (≈ uno cada %.1f s)' % (dur / cortes)) if cortes and dur else ''),
          '- Música: %s — %s' % (datos.get('track'), datos.get('artist')),
          '- Texto del post: %s' % (datos.get('description') or '').replace('\n', ' '),
          '- **Gancho hablado (0-3 s):** %s' % (g or '(sin voz en los primeros 3 s)'),
          '- Idioma de la voz: %s' % t.get('language_code'), '', '## Lo que dice', (t.get('text') or t.get('error') or '')[:4000]]
    open(os.path.join(vid, 'resumen.md'), 'w').write('\n'.join(md) + '\n')
    print('✓', vid)

if __name__ == '__main__':
    if len(sys.argv) < 3: sys.exit(__doc__)
    base, args = sys.argv[1], sys.argv[2:]
    os.makedirs(base, exist_ok=True)
    top = 5
    if '--top' in args:
        i = args.index('--top'); top = int(args[i + 1]); del args[i:i + 2]
    urls = []
    for a in args:
        urls += listar(a, top) if a.startswith('@') else [a]
    for u in urls:
        uno(u, base)
