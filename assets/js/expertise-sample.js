/* MCHD IT — Expertise detail page, DESIGN SAMPLE (proposal B).
   Same data source as the live template (data.js / admin store); only the layout differs.
   Every block is built from content that exists for the expertise; nothing is invented. */
(() => {
  'use strict';
  const { $, $$, esc, initNav, initReveals, initParticles, initToTop, reduced } = window.MCHD;
  const { ICONS } = window.MCHD_DATA;
  const ILLOS = window.MCHD_ILLOS || {};
  const PAGE = 'expertise-sample.html';
  const href = o => `${PAGE}?slug=${o.slug}`;
  const svg = (p, cls = '') => `<svg viewBox="0 0 24 24" aria-hidden="true" class="${cls}">${p}</svg>`;
  const pad = k => String(k).padStart(2, '0');
  const I = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
    check: '<path d="m5 12.5 4.2 4.2L19 7"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    screen: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    org: '<path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6M9 11h.01M15 11h.01"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>'
  };
  const visual = (o, cls = '') => o.images?.length
    ? `<img class="${cls}" src="${esc(o.images[0])}" alt="" loading="lazy">`
    : `<svg class="illo ${cls}" viewBox="0 0 600 320" aria-hidden="true">${ILLOS[o.key] || ''}</svg>`;

  async function init() {
    const list = await window.MCHD_STORE.listPublic();
    const slug = new URLSearchParams(location.search).get('slug');
    let i = list.findIndex(x => x.slug === slug); if (i < 0) i = 0;
    const x = list[i], n = list.length, imgs = x.images || [];
    document.title = `${x.title} — MCHD IT`;

    /* ---- hero ---- */
    $('[data-x-crumb]').textContent = x.title;
    $('[data-x-title]').textContent = x.title;
    $('[data-x-icon]').innerHTML = svg(ICONS[x.key] || '');
    $('[data-x-ask-icon]').innerHTML = svg(ICONS[x.key] || '');
    $('[data-x-index]').textContent = `${pad(i + 1)} / ${pad(n)}`;
    const lead = $('[data-x-text]'); x.text ? (lead.textContent = x.text) : lead.remove();
    $$('[data-x-cta-link]').forEach(a => { a.href = `contact.html?topic=${encodeURIComponent(x.slug)}`; });

    // showcase: the real product image as-is (it is already a device mockup), thumbnails switch it
    const show = $('[data-x-show]');
    if (imgs.length) {
      show.innerHTML = `
        <button type="button" class="xs-show__main" data-lb-open="0" aria-label="View ${esc(x.title)} screen full size">
          <img src="${esc(imgs[0])}" alt="${esc(x.title)} — product screen 01" data-show-img>
          <span class="xs-show__zoom">${svg(I.expand)}<span>View full size</span></span>
        </button>
        ${imgs.length > 1 ? `<div class="xs-show__thumbs" role="group" aria-label="Product screens">${imgs.map((src, k) =>
          `<button type="button" class="xs-thumb" aria-pressed="${k === 0}" data-show="${k}" aria-label="Show screen ${pad(k + 1)}"><img src="${esc(src)}" alt=""></button>`).join('')}
          <span class="xs-show__count" data-show-count>01 / ${pad(imgs.length)}</span></div>` : ''}`;
      const main = $('.xs-show__main', show), img = $('[data-show-img]', show);
      show.addEventListener('click', e => {
        const t = e.target.closest('[data-show]'); if (!t) return;
        const k = +t.dataset.show;
        $$('[data-show]', show).forEach(b => b.setAttribute('aria-pressed', String(b === t)));
        img.classList.remove('is-swap'); void img.offsetWidth; img.classList.add('is-swap');
        img.src = imgs[k]; img.alt = `${x.title} — product screen ${pad(k + 1)}`;
        main.dataset.lbOpen = k;
        $('[data-show-count]', show).textContent = `${pad(k + 1)} / ${pad(imgs.length)}`;
      });
    } else {
      show.innerHTML = `<div class="xs-show__illo">${visual(x)}</div>`;
      show.classList.add('is-illo');
    }

    /* ---- key facts (only facts that exist) ---- */
    const facts = [];
    if (x.whatWeDo?.length) facts.push([I.check, pad(x.whatWeDo.length), 'Capabilities']);
    if (x.projects?.length) facts.push([I.folder, pad(x.projects.length), 'Selected projects']);
    if (imgs.length) facts.push([I.screen, pad(imgs.length), imgs.length > 1 ? 'Product screens' : 'Product screen']);
    if (x.tools?.length) facts.push([I.tool, pad(x.tools.length), 'Tools & platforms']);
    (x.meta || []).forEach(m => m.label && m.value && facts.push([I.layers, esc(m.value), esc(m.label), true]));
    facts.push([I.org, 'MCHD IT', 'Delivered by icddr,b', true]);
    $('[data-x-facts]').innerHTML = facts.map(([ic, v, k, text]) =>
      `<div><span class="xs-facts__ic">${svg(ic)}</span><dd class="${text ? 'is-text' : ''}">${v}</dd><dt>${k}</dt></div>`).join('');

    /* ---- chapters ---- */
    const ch = [];
    const sec = (id, title, body, cls = '') => {
      ch.push({ id, title });
      return `<section class="xs-sec ${cls}" id="${id}" aria-labelledby="${id}-t">
        <header class="xs-sec__head" data-reveal><span class="xs-sec__n">${pad(ch.length)}</span><h2 id="${id}-t">${title}</h2></header>${body}</section>`;
    };
    let html = '';
    if (x.overview?.length) {
      const [first, ...rest] = x.overview;
      html += sec('overview', 'Overview', `<div class="xs-prose" data-reveal><p class="xs-lede">${esc(first)}</p>${rest.map(t => `<p>${esc(t)}</p>`).join('')}</div>`);
    }
    if (x.whatWeDo?.length) {
      html += sec('what-we-do', 'What we do', `<ol class="xs-caps" data-reveal>${x.whatWeDo.map((t, k) =>
        `<li><span class="xs-caps__ic">${svg(I.check)}</span><span class="xs-caps__n">${pad(k + 1)}</span><p>${esc(t)}</p></li>`).join('')}</ol>`);
    }
    if (x.projects?.length) {
      html += sec('projects', 'Selected projects', `<ul class="xs-projects">${x.projects.map((p, k) => `
        <li class="xs-project" data-reveal style="--d:${(k % 2) * .06}s">
          <span class="xs-project__n">${pad(k + 1)}</span>
          <div>${p.name ? `<h3>${esc(p.name)}</h3>` : ''}${p.text ? `<p>${esc(p.text)}</p>` : ''}</div>
        </li>`).join('')}</ul>`);
    }
    if (imgs.length > 1) {
      html += sec('screens', 'Product screens', `<div class="xs-gallery">${imgs.map((src, k) => `
        <figure data-reveal style="--d:${(k % 2) * .06}s"><button type="button" data-lb-open="${k}" aria-label="View screen ${pad(k + 1)} full size">
          <img src="${esc(src)}" alt="${esc(x.title)} — product screen ${pad(k + 1)}" loading="lazy"><span class="xs-gallery__zoom">${svg(I.expand)}</span></button>
          <figcaption>Screen ${pad(k + 1)} of ${pad(imgs.length)}</figcaption></figure>`).join('')}</div>`);
    }
    $('[data-x-body]').innerHTML = html;

    // tools: one consistent chip style for every tool, whether or not a logo exists
    if (x.tools?.length) {
      $('[data-x-stack]').hidden = false;
      $('[data-x-tools]').innerHTML = x.tools.map(t => `<li>${esc(t)}</li>`).join('');
    }

    const jump = $('[data-x-jump]');
    if (!ch.length) { jump.remove(); document.body.classList.add('xs--brief'); $('[data-x-toc]').remove(); }
    else { jump.href = '#' + ch[0].id; jump.textContent = ch[0].id === 'overview' ? 'Read the overview' : `See ${ch[0].title.toLowerCase()}`; initToc(ch); }

    /* ---- continue exploring ---- */
    const prev = list[(i - 1 + n) % n], next = list[(i + 1) % n];
    const card = (o, dir) => `<a class="xs-pg xs-pg--${dir}" href="${href(o)}" data-reveal>
      <span class="xs-pg__media">${visual(o)}</span>
      <span class="xs-pg__copy"><small>${dir === 'next' ? `Next ${svg(I.arrow)}` : `${svg(I.back)} Previous`}</small><strong>${esc(o.title)}</strong></span></a>`;
    $('[data-x-pager]').innerHTML = card(prev, 'prev') + card(next, 'next');
    $('[data-x-more]').innerHTML = list.map((o, k) => (o === x || o === prev || o === next) ? '' : `
      <li><a href="${href(o)}"><span class="side-list__icon">${svg(ICONS[o.key] || '')}</span><span class="xs-grid__t">${esc(o.title)}</span><span class="xs-grid__n">${pad(k + 1)}</span></a></li>`).join('');

    initLightbox(x, imgs);
    initParticles($('.xs-hero'));
    initReveals();
    requestAnimationFrame(() => $$('.xs-hero [data-reveal]').forEach(el => el.classList.add('is-in')));
  }

  /* side rail: numbered chapters with the homepage explorer's progress rail */
  function initToc(ch) {
    const listEl = $('[data-x-toc-list]'), rail = $('[data-x-rail]');
    listEl.innerHTML = ch.map((c, k) => `<li><a href="#${c.id}"><span>${pad(k + 1)}</span>${esc(c.title)}</a></li>`).join('');
    const links = $$('a', listEl);
    const set = id => {
      const k = ch.findIndex(c => c.id === id); if (k < 0) return;
      links.forEach((a, j) => { a.toggleAttribute('aria-current', j === k); a.classList.toggle('is-done', j < k); });
      rail.style.transform = `scaleY(${((k + 1) / ch.length).toFixed(3)})`;
      const cur = links[k];
      if (listEl.scrollWidth > listEl.clientWidth) listEl.scrollTo({ left: cur.offsetLeft - 12, behavior: reduced() ? 'auto' : 'smooth' });
    };
    const io = new IntersectionObserver(es => es.forEach(en => en.isIntersecting && set(en.target.id)), { rootMargin: '-30% 0px -60% 0px' });
    ch.forEach(c => io.observe(document.getElementById(c.id)));
    set(ch[0].id);
  }

  /* full-size viewer (native <dialog>: Esc closes, focus returns, arrows switch) */
  function initLightbox(x, imgs) {
    const dlg = $('[data-x-lightbox]');
    if (!imgs.length || typeof dlg.showModal !== 'function') return;
    const img = $('[data-lb-img]', dlg), cap = $('[data-lb-cap]', dlg), pv = $('[data-lb-prev]', dlg), nx = $('[data-lb-next]', dlg);
    let k = 0, opener = null;
    const go = j => { k = (j + imgs.length) % imgs.length; img.src = imgs[k]; img.alt = `${x.title} — product screen ${pad(k + 1)}`; cap.textContent = `${x.title} · Screen ${pad(k + 1)} of ${pad(imgs.length)}`; };
    pv.hidden = nx.hidden = imgs.length < 2;
    document.addEventListener('click', e => { const b = e.target.closest('[data-lb-open]'); if (!b) return; opener = b; go(+b.dataset.lbOpen); dlg.showModal(); document.documentElement.classList.add('is-lb'); });
    $('[data-lb-close]', dlg).addEventListener('click', () => dlg.close());
    pv.addEventListener('click', () => go(k - 1)); nx.addEventListener('click', () => go(k + 1));
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', e => { if (imgs.length < 2) return; if (e.key === 'ArrowLeft') go(k - 1); if (e.key === 'ArrowRight') go(k + 1); });
    dlg.addEventListener('close', () => { document.documentElement.classList.remove('is-lb'); opener?.focus({ preventScroll: true }); });
  }

  initNav();
  initToTop();
  init();
})();
