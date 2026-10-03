/* Basic opt-in: no Google code runs in the page containing contact data. */
(() => {
  'use strict';
  const KEY = 'akme.analytics.v1';
  const pages = {inicio: 'index.html', portafolio: 'portafolio.html', servicios: 'servicios.html', planes: 'planes.html'};
  const page = document.body.dataset.page;
  if (!pages[page]) return;
  const packages = ['none', 'smart', 'esencial', 'completo', 'pro', 'elite', 'custom'];
  const placements = ['contact', 'floating', 'package', 'quote', 'quote_custom', 'brief', 'halloween'];
  let frame, ready = false, pending = [], scrolled = false, choice;
  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const referrer = () => {
    // Fixed origins only: never forward arbitrary paths, subdomains, queries or credentials.
    try {
      const url = new URL(document.referrer);
      const origins = ['https://www.google.com', 'https://www.google.com.bo', 'https://www.bing.com', 'https://www.facebook.com', 'https://l.facebook.com', 'https://www.instagram.com', 'https://l.instagram.com', 'https://eduardoxyz22-maker.github.io'];
      return origins.includes(url.origin) ? url.origin + '/' : '';
    } catch { return ''; }
  };
  function send(event) {
    if (choice !== 'accepted' || !frame) return;
    if (ready) frame.contentWindow.postMessage(event, location.origin);
    else if (pending.length < 30) pending.push(event);
  }
  function start() {
    if (frame) return;
    frame = document.createElement('iframe');
    frame.hidden = true;
    frame.title = 'Medición opcional';
    frame.setAttribute('aria-hidden', 'true');
    frame.referrerPolicy = 'no-referrer';
    frame.src = 'analytics-frame.html';
    document.body.append(frame);
  }
  function clearCookies() {
    const paths = ['/', '/AKME-ESTUDIO', '/AKME-ESTUDIO/'];
    const host = location.hostname;
    const domains = ['', host, '.' + host];
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const path of paths) for (const domain of domains) {
        document.cookie = `${name}=; Max-Age=0; path=${path}${domain ? '; domain=' + domain : ''}; SameSite=Lax`;
      }
    }
  }
  function stop() {
    // Destroy the entire GA execution context, including timers and automatic listeners.
    if (frame?.contentWindow) frame.contentWindow['ga-disable-G-JLTP3YSG40'] = true;
    frame?.remove(); frame = null; ready = false; pending = []; scrolled = false;
    clearCookies();
  }
  const panel = document.createElement('section');
  panel.id = 'analytics-preferences';
  panel.className = 'analytics-preferences';
  panel.setAttribute('aria-labelledby', 'analytics-heading');
  panel.innerHTML = '<h2 id="analytics-heading">¿Nos ayudás a mejorar?</h2><p>Con tu permiso usamos Google Analytics para medir visitas y clics en WhatsApp. Es opcional. <a href="servicios.html#privacidad">Privacidad</a></p><div><button type="button" data-consent="accepted">Aceptar</button><button type="button" data-consent="rejected">Rechazar</button></div>';
  document.body.append(panel);
  const preferenceButton = document.querySelector('[data-analytics-preferences]');
  function display(open) {
    panel.hidden = !open;
    preferenceButton?.setAttribute('aria-expanded', String(open));
  }
  function apply(value, persist = false) {
    choice = value === 'accepted' ? 'accepted' : value === 'rejected' ? 'rejected' : null;
    if (persist) { try { localStorage.setItem(KEY, choice); } catch { /* session-only choice */ } }
    if (choice === 'accepted') start(); else stop();
    panel.querySelector('[data-consent="rejected"]').textContent = choice === 'accepted' ? 'Revocar permiso' : 'Rechazar';
    display(!choice);
  }
  panel.addEventListener('click', e => {
    const button = e.target.closest('[data-consent]');
    if (!button) return;
    apply(button.dataset.consent, true);
    preferenceButton?.focus({preventScroll:true});
  });
  preferenceButton?.addEventListener('click', () => { display(true); panel.querySelector('button').focus({preventScroll:true}); });
  window.addEventListener('storage', e => { if (e.key === KEY || e.key === null) apply(read()); });
  window.addEventListener('pageshow', () => { if (read() !== choice) apply(read()); });
  window.addEventListener('message', e => {
    if (!frame || e.source !== frame.contentWindow || e.origin !== location.origin || e.data !== 'akme-analytics-ready' || ready) return;
    ready = true;
    send({type:'init', page, referrer:referrer()});
    for (const event of pending) send(event);
    pending = [];
  });
  window.akmeAnalytics = Object.freeze({
    whatsapp(placement, packageName = 'none') {
      const plan = typeof packageName === 'string' ? packageName.toLowerCase() : '';
      if (!placements.includes(placement) || !packages.includes(plan)) return;
      send({type:'whatsapp_click', placement, package:plan});
    }
  });
  // Explicitly marked controls only. Never inspect href, textContent or form values.
  document.addEventListener('click', e => {
    const link = e.target.closest('[data-analytics-wa]');
    if (link) window.akmeAnalytics.whatsapp(link.dataset.analyticsWa, link.dataset.analyticsPackage || 'none');
  });
  window.addEventListener('scroll', () => {
    const height = document.documentElement.scrollHeight;
    if (choice === 'accepted' && !scrolled && height > innerHeight && (scrollY + innerHeight) / height >= .9) {
      scrolled = true; send({type:'scroll'});
    }
  }, {passive:true});
  apply(read());
})();
