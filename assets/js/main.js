/* MCHD IT — interactions. No dependencies. */
(() => {
  'use strict';

  /* ======================================================
     CONTENT CONFIG (all strings verbatim from live site)
     ====================================================== */

  // Featured systems for the hero stage. Add the remaining carousel slides here;
  // with more than one system the stage auto-advances and shows prev/next.
  const SYSTEMS = [
    {
      // MCHD IT showreel (45 s). Plays muted, inline and looping as the hero film — no caption or chapters.
      reel: true,
      name: 'MCHD IT',
      tags: [],
      poster: 'assets/img/systems/showreel-poster.jpg',
      sources: [{ src: 'assets/video/showreel.mp4', type: 'video/mp4' }],
      chapters: []
    }
  ];
  const showChapterLabels = true;

  const ILLOS = window.MCHD_ILLOS;
  const { ICONS, XP_VISIBLE, href: xpHref } = window.MCHD_DATA;

  // Map pins in the coordinate space of world-dots.svg (traced from the live map)
  const HUB = { name: 'Bangladesh', x: 817.5, y: 311, at: 't' };
  // at: label placement relative to the pin (t, b, l, r) to keep the East-Africa cluster readable
  const PINS = [
    { name: 'India', x: 759, y: 312.5, at: 'b' }, { name: 'Nepal', x: 746.5, y: 275, at: 't' }, { name: 'Pakistan', x: 703.5, y: 294, at: 'l' },
    { name: 'Ethiopia', x: 638.5, y: 371.5, at: 'r' }, { name: 'Kenya', x: 615, y: 395, at: 'r' }, { name: 'Uganda', x: 584, y: 376.5, at: 't' },
    { name: 'Tanzania', x: 604, y: 412.5, at: 'l' }, { name: 'Mozambique', x: 600.5, y: 451.5, at: 'r' }, { name: 'South Africa', x: 559.5, y: 478.5, at: 'l' },
    { name: 'Nigeria', x: 517.5, y: 376, at: 'b' }, { name: 'Mali', x: 491.5, y: 320, at: 't' }, { name: 'Sierra Leone', x: 464.5, y: 373, at: 'l' },
    { name: 'Gambia', x: 450, y: 344, at: 'l' }, { name: 'Argentina', x: 296.5, y: 492, at: 'r' }
  ];

  const { $, $$, clamp, lerp, easeInOut, reduced, pad2, initNav, initReveals, initParticles, initToTop } = window.MCHD;

  function splitTitle() {
    const h = $('[data-split]');
    if (!h) return;
    const words = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', h.textContent.trim());
    h.innerHTML = words.map((w, i) => {
      const inner = /^(Digital|Excellence)$/.test(w) ? `<em>${w}</em>` : w;
      const br = w === 'Research' ? '<br class="br-lg">' : '';
      return `<span class="w" aria-hidden="true"><span style="--i:${i}">${inner}</span></span>${br}`;
    }).join(' ');
    requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add('is-in')));
  }

  /* ======================================================
     HERO — featured-system stage (video + chapters)
     ====================================================== */
  function initStage(hero) {
    const stage = $('[data-stage]', hero);
    const media = $('[data-stage-media]', stage);
    const titleEl = $('[data-stage-title]', stage);
    const tagsEl = $('[data-stage-tags]', stage);
    const chapEl = $('[data-stage-chapters]', stage);
    const idxEl = $('[data-stage-index]', stage);
    const totEl = $('[data-stage-total]', stage);
    const playBtn = $('[data-stage-play]', stage);
    const sysNav = $('[data-sys-nav]', stage);

    // Always autoplays (muted, inline, looping) whenever the stage is on screen — no click needed.
    let sys = 0, chapter = -1, userPaused = reduced(), visible = false, raf; // OS 'reduce motion' users start paused
    const canPlay = () => visible && !userPaused;

    const videos = SYSTEMS.map((s, i) => {
      const v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.setAttribute('playsinline', '');
      v.preload = i === 0 ? 'auto' : 'none';
      v.poster = s.poster; v.loop = SYSTEMS.length === 1;
      v.setAttribute('aria-label', s.reel ? 'MCHD IT showreel' : `${s.name} — product walkthrough`);
      s.sources.forEach(src => { const so = document.createElement('source'); so.src = src.src; so.type = src.type; v.append(so); });
      v.addEventListener('ended', () => go(sys + 1));
      v.addEventListener('error', () => fallbackPoster(v, s), true);
      media.append(v);
      return v;
    });

    function fallbackPoster(v, s) {
      if (v.dataset.failed) return;
      v.dataset.failed = '1';
      const img = new Image(); img.src = s.poster; img.alt = s.name; img.className = 'is-active';
      v.replaceWith(img);
    }

    if (SYSTEMS.length > 1) sysNav.hidden = false;
    $('[data-sys-prev]', stage)?.addEventListener('click', () => go(sys - 1));
    $('[data-sys-next]', stage)?.addEventListener('click', () => go(sys + 1));

    function renderChapters() {
      const s = SYSTEMS[sys];
      chapEl.innerHTML = s.chapters.map((c, i) =>
        `<button type="button" class="chapter" role="tab" aria-selected="false" data-ch="${i}" aria-label="${c.label}"><i></i>${showChapterLabels ? `<span>${c.label}</span>` : ''}</button>`).join('');
      totEl.textContent = pad2(s.chapters.length);
      chapter = -1;
    }
    chapEl.addEventListener('click', e => {
      const b = e.target.closest('[data-ch]'); if (!b) return;
      const v = videos[sys]; const c = SYSTEMS[sys].chapters[+b.dataset.ch];
      v.currentTime = c.start + .01; tick(); if (!userPaused) safePlay(v);
    });

    function go(n) {
      const len = SYSTEMS.length; const next = (n + len) % len;
      if (next === sys && len > 1) return;
      const prev = videos[sys];
      sys = next;
      const s = SYSTEMS[sys];
      titleEl.textContent = s.name;
      titleEl.classList.remove('is-swap'); void titleEl.offsetWidth; titleEl.classList.add('is-swap');
      tagsEl.innerHTML = s.tags.map(t => `<li>${t}</li>`).join('');
      renderChapters();
      videos.forEach((v, i) => v.classList?.toggle('is-active', i === sys));
      const v = videos[sys];
      if (v !== prev && prev.pause) setTimeout(() => prev.pause(), 900);
      if (v.currentTime) v.currentTime = 0;
      if (canPlay()) safePlay(v);
      tick();
    }

    function safePlay(v) {
      if (!v || !v.play) return;
      v.play().catch(() => {
        // Autoplay refused (e.g. data-saver / low-power mode): retry on the first interaction of any kind.
        const retry = () => { ['scroll', 'pointerdown', 'touchstart', 'keydown'].forEach(ev => removeEventListener(ev, retry)); if (canPlay()) v.play().catch(() => {}); };
        ['scroll', 'pointerdown', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, retry, { passive: true, once: true }));
      });
    }

    function setPaused(p, byUser = true) {
      if (byUser) userPaused = p;
      playBtn.setAttribute('aria-pressed', String(p));
      playBtn.setAttribute('aria-label', p ? 'Play video' : 'Pause video');
      const v = videos[sys];
      if (!v.play) return;
      p ? v.pause() : (canPlay() && safePlay(v));
    }
    playBtn.addEventListener('click', () => setPaused(!(playBtn.getAttribute('aria-pressed') === 'true')));

    function tick() {
      const v = videos[sys], s = SYSTEMS[sys];
      if (!v || !v.duration) return;
      const t = v.currentTime, chs = s.chapters;
      let ci = 0; for (let i = 0; i < chs.length; i++) if (t >= chs[i].start) ci = i;
      $$('.chapter', chapEl).forEach((b, i) => {
        const end = i < chs.length - 1 ? chs[i + 1].start : v.duration;
        const p = i < ci ? 1 : i > ci ? 0 : clamp((t - chs[i].start) / (end - chs[i].start));
        b.style.setProperty('--p', p.toFixed(4));
        if (i === ci !== (b.getAttribute('aria-selected') === 'true')) b.setAttribute('aria-selected', String(i === ci));
      });
      if (ci !== chapter) { chapter = ci; idxEl.textContent = pad2(ci + 1); }
    }
    const loop = () => { tick(); raf = requestAnimationFrame(loop); };

    new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      const v = videos[sys];
      if (visible) { if (canPlay()) safePlay(v); raf = requestAnimationFrame(loop); }
      else { v.pause && v.pause(); cancelAnimationFrame(raf); }
    }, { threshold: .2 }).observe(stage);

    stage.classList.toggle('is-reel', !!SYSTEMS[0].reel);
    renderChapters();
    videos[0].classList.add('is-active');
    videos[0].autoplay = !userPaused;
    if (userPaused) setPaused(true);
    videos[0].addEventListener('loadedmetadata', tick);
    document.addEventListener('visibilitychange', () => { const v = videos[sys]; if (!v.play) return; document.hidden ? v.pause() : canPlay() && safePlay(v); });
  }

  /* ======================================================
     HERO — cinematic scroll (stage expands to full-bleed)
     ====================================================== */
  // The hero showreel intentionally stays at a fixed width while scrolling.
  // Keep this hook as a no-op so the existing boot sequence remains compatible.
  function initHeroScroll(hero) {
    if (!hero) return;
    hero.classList.remove('is-pinned');
  }


  /* ======================================================
     WHAT WE DO — connected explorer
     Desktop: 50/50 split. Click / tap an item in the list (or use
     the arrow keys) to show its panel; a connector beam links the
     active item to the panel. Mobile: stacked cards + Show More.
     ====================================================== */
  function initExplorer(EXPERTISE) {
    const esc = window.MCHD.esc;
    const root = $('[data-xp]');
    const tabsEl = $('[data-xp-tabs]', root);
    const panelsEl = $('[data-xp-panels]', root);
    const navEl = $('.xp__nav', root);
    const link = $('[data-xp-link]', root);
    const counter = $('[data-xp-count]', root);
    const moreBtn = $('[data-xp-more]', root);
    const n = EXPERTISE.length;
    const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

    tabsEl.innerHTML = EXPERTISE.map((x, i) => `
      <button type="button" class="xp-tab" role="tab" id="xp-tab-${i}" aria-controls="xp-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}">
        <span class="xp-tab__n">${pad2(i + 1)}</span>
        <span class="xp-tab__icon"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[x.key] || ''}</svg></span>
        <span class="xp-tab__t">${esc(x.title)}</span>
        <span class="xp-tab__bar" aria-hidden="true"><i></i></span>
      </button>`).join('');
    panelsEl.innerHTML = EXPERTISE.map((x, i) => `
      <article class="xp-panel${i === 0 ? ' is-active' : ''}${i >= XP_VISIBLE ? ' is-collapsed' : ''}" role="tabpanel" id="xp-panel-${i}" aria-labelledby="xp-tab-${i}" data-i="${i}">
        <div class="xp-panel__visual" aria-hidden="true">
          ${x.images && x.images.length ? `<img class="xp-panel__shot" src="${esc(x.images[0])}" alt="" loading="lazy">` : `<svg class="illo" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet">${ILLOS[x.key] || ''}</svg>`}
          <span class="xp-panel__num">${pad2(i + 1)}</span>
        </div>
        <div class="xp-panel__body">
          <span class="xp-panel__icon"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[x.key] || ''}</svg></span>
          <h3><a href="${xpHref(x)}">${esc(x.title)}</a></h3>
          ${x.text ? `<p>${esc(x.text)}</p>` : ''}
          <a class="link-arrow" href="${xpHref(x)}" aria-label="Learn more about ${esc(x.title)}">Learn more${arrow}</a>
        </div>
      </article>`).join('');

    const tabs = $$('.xp-tab', tabsEl), panels = $$('.xp-panel', panelsEl);
    let active = 0, scrolly = false;

    // "Show More" (stacked layout only, mirrors the live site: 6 first)
    const hasMore = n > XP_VISIBLE;
    moreBtn.hidden = !hasMore;
    moreBtn.addEventListener('click', () => {
      const open = moreBtn.getAttribute('aria-expanded') !== 'true';
      moreBtn.setAttribute('aria-expanded', String(open));
      $('span', moreBtn).textContent = open ? 'Show Less' : 'Show More';
      panels.forEach((p, i) => i >= XP_VISIBLE && p.classList.toggle('is-collapsed', !open));
      if (open) panels[XP_VISIBLE]?.querySelector('a')?.focus({ preventScroll: true });
    });

    function placeLink() {
      if (!scrolly) return;
      const t = tabs[active];
      const y = t.offsetTop + t.offsetHeight / 2;
      root.style.setProperty('--ly', y.toFixed(1) + 'px');
    }

    let setActive = function (i, focus = false) {
      if (i === active) return;
      const prev = panels[active];
      const dir = i > active ? 1 : -1;
      prev.classList.remove('is-active');
      prev.style.setProperty('--dir', dir);
      prev.classList.add('is-leaving');
      setTimeout(() => prev.classList.remove('is-leaving'), 700);
      tabs[active].setAttribute('aria-selected', 'false'); tabs[active].tabIndex = -1;
      active = i;
      panels[i].style.setProperty('--dir', dir);
      panels[i].classList.add('is-active');
      tabs[i].setAttribute('aria-selected', 'true'); tabs[i].tabIndex = 0;
      if (counter) counter.textContent = pad2(i + 1);
      link.classList.remove('is-pulse'); void link.offsetWidth; link.classList.add('is-pulse');
      placeLink();
      if (focus) tabs[i].focus({ preventScroll: true });
    };

    function scrollToIndex(i) { setActive(i); }
    tabsEl.addEventListener('click', e => { const t = e.target.closest('.xp-tab'); t && setActive(+t.dataset.i); });
    tabsEl.addEventListener('keydown', e => {
      let i = active;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') i = (active + 1) % n;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') i = (active - 1 + n) % n;
      else if (e.key === 'Home') i = 0; else if (e.key === 'End') i = n - 1; else return;
      e.preventDefault(); setActive(i, true);
    });
    void scrollToIndex;

    // progress rail + per-row fill follow the active item
    const paint = () => {
      root.style.setProperty('--xp', ((active + 1) / n).toFixed(4));
      tabs.forEach((t, k) => t.style.setProperty('--f', k < active ? 1 : k === active ? 1 : 0));
    };
    const _setActive = setActive;
    setActive = (i, focus) => { _setActive(i, focus); paint(); };

    /* Manual exploration only: visitors click / tap an item (or use the arrow keys) to change
       the panel. Wheel and trackpad gestures always scroll the page normally — the explorer
       never switches content on scroll. */

    const io = new IntersectionObserver(es => es.forEach(en => en.target.classList.toggle('is-in', en.isIntersecting)), { threshold: .25 });
    panels.forEach(p => io.observe(p));

    const mq = matchMedia('(min-width: 1025px) and (min-height: 700px)');
    const setMode = () => {
      scrolly = mq.matches;
      root.classList.toggle('is-scrolly', scrolly);
      if (scrolly) requestAnimationFrame(() => { placeLink(); paint(); });
    };
    mq.addEventListener('change', setMode);
    addEventListener('resize', () => { if (scrolly) placeLink(); }, { passive: true });
    document.fonts?.ready.then(placeLink);
    setMode();
    void navEl;
  }

  /* ======================================================
     TEAM — continuous marquee (pauses on hover / focus)
     ====================================================== */
  function initTeam() {
    const root = $('[data-team]'); if (!root) return;
    const track = $('[data-team-track]', root);
    track.innerHTML = window.MCHD_DATA.TEAM.map(window.MCHD.personCard).join('');
    if (reduced()) { root.classList.add('is-static'); return; }
    // duplicate the set until it is at least twice the viewport width, for a seamless loop
    const originals = [...track.children];
    const fill = () => {
      while (track.scrollWidth < innerWidth * 2.2) originals.forEach(li => {
        const c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.inert = true; track.append(c);
      });
    };
    fill();
    // the loop distance is exactly one original set (+ gap)
    const setDist = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      const w = originals.reduce((s, li) => s + li.offsetWidth + gap, 0);
      track.style.setProperty('--dist', `-${w}px`);
      track.style.setProperty('--dur', `${(w / 45).toFixed(1)}s`); // ~45px per second
    };
    setDist();
    new ResizeObserver(() => { fill(); setDist(); }).observe(root);
    new IntersectionObserver(([en]) => root.classList.toggle('is-paused', !en.isIntersecting)).observe(root);
  }

  /* ======================================================
     GLOBAL map
     ====================================================== */
  function initMap() {
    const fig = $('[data-map]'); if (!fig) return;
    const svg = $('[data-map-svg]', fig);
    const NS = 'http://www.w3.org/2000/svg';
    svg.innerHTML = `<defs><linearGradient id="arcGrad" x1="0" x2="1"><stop offset="0" stop-color="#6fd6dd" stop-opacity=".25"/><stop offset="1" stop-color="#6fd6dd"/></linearGradient></defs><g data-arcs></g><g data-pins></g>`;
    const arcs = $('[data-arcs]', svg), pinsG = $('[data-pins]', svg);

    PINS.forEach((p, i) => {
      const dx = HUB.x - p.x, dy = HUB.y - p.y, dist = Math.hypot(dx, dy);
      const cx = (HUB.x + p.x) / 2, cy = Math.min(HUB.y, p.y) - dist * .32;
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', `M${HUB.x} ${HUB.y} Q${cx} ${cy} ${p.x} ${p.y}`);
      path.setAttribute('class', 'map__arc');
      arcs.append(path);
      const len = path.getTotalLength();
      path.style.setProperty('--len', len.toFixed(1));
      path.style.setProperty('--d', (i * .08).toFixed(2) + 's');
    });

    [...PINS, HUB].forEach((p, i) => {
      const hub = p === HUB;
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'map__pin' + (hub ? ' is-hub' : ''));
      g.setAttribute('transform', `translate(${p.x} ${p.y})`);
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'img');
      g.setAttribute('aria-label', p.name);
      g.style.setProperty('--d', (hub ? 0 : i * .08).toFixed(2) + 's');
      const lh = hub ? 26 : 20;
      g.innerHTML = `<circle class="ring" r="${hub ? 9 : 6}"/><circle class="dot" r="${hub ? 6 : 4}"/><g class="label"><rect rx="${lh / 2}" height="${lh}"/><text text-anchor="middle" dominant-baseline="central">${p.name}</text></g>`;
      pinsG.append(g);
      const text = $('text', g), rect = $('rect', g), lab = $('.label', g);
      const w = text.getComputedTextLength() + (hub ? 26 : 16);
      const gap = hub ? 14 : 10;
      const [lx, ly] = { t: [0, -(gap + lh / 2)], b: [0, gap + lh / 2], l: [-(gap + w / 2), 0], r: [gap + w / 2, 0] }[p.at || 't'];
      rect.setAttribute('width', w.toFixed(1)); rect.setAttribute('x', (lx - w / 2).toFixed(1)); rect.setAttribute('y', (ly - lh / 2).toFixed(1));
      text.setAttribute('x', lx.toFixed(1)); text.setAttribute('y', ly.toFixed(1));
      void lab;
    });

    new IntersectionObserver(([en], o) => { if (en.isIntersecting) { fig.classList.add('is-in'); o.disconnect(); } }, { threshold: .3 }).observe(fig);
  }

  /* ======================================================
     MARQUEE + BACK TO TOP
     ====================================================== */
  function initMarquee() {
    const track = $('[data-marquee] .marquee__track'); if (!track || reduced()) return;
    [...track.children].forEach(li => { const c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); $('img', c).alt = ''; track.append(c); });
  }
  /* ======================================================
     BOOT
     ====================================================== */
  const hero = $('[data-hero]');
  splitTitle();
  initNav();
  initParticles(hero);
  initStage(hero);
  initHeroScroll(hero);
  window.MCHD_STORE.listPublic().then(list => { initExplorer(list); initReveals(); });
  initTeam();
  initMap();
  initMarquee();
  initToTop();
  initReveals();
  // hero badge/lead/actions reveal immediately
  requestAnimationFrame(() => $$('.hero [data-reveal]').forEach(el => el.classList.add('is-in')));
})();
