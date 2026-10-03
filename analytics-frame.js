/* Isolated, disposable GA context. This document contains no links or forms. */
(() => {
  'use strict';
  if (parent === window) return;
  const ID = 'G-JLTP3YSG40';
  const pages = {inicio:'index.html', portafolio:'portafolio.html', servicios:'servicios.html', planes:'planes.html'};
  const placements = ['contact','floating','package','quote','quote_custom','brief','halloween'];
  const packages = ['none','smart','esencial','completo','pro','elite','custom'];
  const origins = ['https://www.google.com/','https://www.google.com.bo/','https://www.bing.com/','https://www.facebook.com/','https://l.facebook.com/','https://www.instagram.com/','https://l.instagram.com/','https://eduardoxyz22-maker.github.io/'];
  let initialized = false, scrolled = false;
  function gtag() { window.dataLayer.push(arguments); }
  window.addEventListener('message', e => {
    if (e.source !== parent || e.origin !== location.origin || !e.data) return;
    const d = e.data;
    if (d.type === 'init' && !initialized && Object.hasOwn(pages, d.page)) {
      initialized = true;
      window.dataLayer = [];
      window.gtag = gtag;
      gtag('consent', 'default', {analytics_storage:'granted', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
      gtag('js', new Date());
      gtag('config', ID, {
        send_page_view:false,
        page_location:'https://eduardoxyz22-maker.github.io/AKME-ESTUDIO/' + pages[d.page],
        page_referrer:origins.includes(d.referrer) ? d.referrer : '',
        page_title:'AKME · ' + d.page,
        allow_google_signals:false, allow_ad_personalization_signals:false,
        cookie_domain:location.hostname, cookie_path:'/', cookie_expires:60*60*24*30, cookie_update:false
      });
      gtag('event', 'page_view');
      const tag = document.createElement('script');
      tag.async = true; tag.referrerPolicy = 'no-referrer';
      tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
      document.head.append(tag);
    } else if (initialized && d.type === 'whatsapp_click' && placements.includes(d.placement) && packages.includes(d.package)) {
      gtag('event', 'whatsapp_click', {button_location:d.placement, package:d.package, transport_type:'beacon'});
    } else if (initialized && d.type === 'scroll' && !scrolled) {
      scrolled = true; gtag('event', 'scroll', {percent_scrolled:90});
    }
  });
  parent.postMessage('akme-analytics-ready', location.origin);
})();
