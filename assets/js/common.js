/* MCHD IT — shared behaviour for every page. No dependencies. */
window.MCHD = (() => {
  'use strict';
  /* ======================================================
     UTILITIES
     ====================================================== */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => mqReduce.matches;
  const pad2 = n => String(n).padStart(2, '0');

  /* ======================================================
     NAV
     ====================================================== */
  function initNav() {
    const nav = $('[data-nav]');
    const toggle = $('[data-nav-toggle]');
    const sheet = $('[data-nav-sheet]');
    let lastY = scrollY;

    const setOpen = open => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      sheet.hidden = !open;
    };
    toggle.addEventListener('click', () => setOpen(sheet.hidden));
    sheet.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) { setOpen(false); toggle.focus(); } });
    matchMedia('(min-width: 981px)').addEventListener('change', e => e.matches && setOpen(false));

    const onScroll = () => {
      const y = scrollY;
      nav.classList.toggle('is-scrolled', y > 24);
      const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
      if (sheet.hidden) {
        if (goingDown && y > innerHeight * 1.2) nav.classList.add('is-hidden');
        else if (goingUp || y < innerHeight) nav.classList.remove('is-hidden');
      }
      lastY = y;
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // keyboard focus must always reveal the nav
    nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

    // active section
    const links = $$('[data-nav-link]');
    const ids = links.map(a => a.getAttribute('href')).filter(h => h.startsWith('#')).map(h => h.slice(1));
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); el && io.observe(el); });
  }

  /* ======================================================
     REVEALS + COUNTERS
     ====================================================== */
  function countUp(el) {
    const to = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduced()) { el.textContent = to + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const step = now => {
      const t = clamp((now - t0) / dur);
      el.textContent = Math.round(to * easeOut(t)) + suf;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initReveals() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        $$('[data-count]', en.target).concat(en.target.matches('[data-count]') ? [en.target] : []).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal]:not(.is-in)').forEach(el => io.observe(el));
  }

  /* ======================================================
     PARTICLES (hero + portal)
     ====================================================== */
  /* ======================================================
     HERO — particles
     ====================================================== */
  function initParticles(hero) {
    const cvs = $('[data-particles]', hero);
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let w, h, dpr, parts = [], running = false, raf;

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = cvs.clientWidth; h = cvs.clientHeight;
      cvs.width = w * dpr; cvs.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(clamp(w * h / 18000, 30, 90));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.4 + .4, vy: -(Math.random() * .12 + .03), vx: (Math.random() - .5) * .06,
        a: Math.random() * .5 + .15, tw: Math.random() * Math.PI * 2
      }));
      draw(0);
    };
    const draw = t => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        if (!reduced()) {
          p.x += p.vx; p.y += p.vy;
          if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
          if (p.x < -4) p.x = w + 4; else if (p.x > w + 4) p.x = -4;
        }
        const a = p.a * (.6 + .4 * Math.sin(t / 1400 + p.tw));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 230, 238, ${a})`; ctx.fill();
      }
    };
    const loop = t => { draw(t); raf = requestAnimationFrame(loop); };
    const setRunning = on => {
      if (on === running || reduced()) return;
      running = on;
      on ? (raf = requestAnimationFrame(loop)) : cancelAnimationFrame(raf);
    };
    new ResizeObserver(resize).observe(cvs);
    new IntersectionObserver(([en]) => setRunning(en.isIntersecting)).observe(hero);
    document.addEventListener('visibilitychange', () => setRunning(!document.hidden && hero.getBoundingClientRect().bottom > 0));
  }


  function initToTop() {
    const b = $('[data-to-top]');
    addEventListener('scroll', () => b.classList.toggle('is-on', scrollY > innerHeight * 1.5), { passive: true });
    if (!b) return;
    b.addEventListener('click', () => { scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }); $('.nav__brand').focus({ preventScroll: true }); });
  }


  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* team card — shared by the home marquee and the contact page grid */
  const MAIL = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
  const personCard = p => `<li class="person">
      <div class="person__photo"><img src="${p.photo}" alt="" loading="lazy" width="160" height="160"></div>
      <h3>${p.name}</h3>
      <p class="person__role">${p.role}</p>
      <a class="person__mail" href="mailto:${p.email}" title="${p.email}">${MAIL}<span>${p.email}</span></a>
    </li>`;

  return { esc, $, $$, personCard, clamp, lerp, easeInOut, easeOut, reduced, pad2, initNav, countUp, initReveals, initParticles, initToTop };
})();
