/* MCHD IT — inner pages: expertise detail, contact, client-portal sign-in. */
(() => {
  'use strict';
  const { $, $$, initNav, initReveals, initParticles, initToTop } = window.MCHD;
  const { ICONS, EXPERTISE, href } = window.MCHD_DATA;
  const esc0 = window.MCHD.esc;
  const ILLOS = window.MCHD_ILLOS || {};

  /* Site settings that are not visible in the material supplied so far.
     Fill these in before launch; empty values are simply not shown. */
  const SITE = {
    contactEndpoint: null,   // e.g. '/api/contact' — receives the form as JSON (POST)
    portalLoginAction: null, // e.g. 'https://portal.example.org/login' — the sign-in form POSTs here
    portalForgotUrl: null
  };

  const svg = (paths, cls = '') => `<svg viewBox="0 0 24 24" aria-hidden="true" class="${cls}">${paths}</svg>`;
  const esc = esc0;

  /* ---------------- expertise detail ----------------
     One template for all 12 expertise pages. Every chapter is built only from content
     that exists for that expertise (data.js / admin); empty chapters are simply not rendered. */
  const TECH = { 'odk': 'odk', 'dhis2': 'dhis2', 'redcap': 'redcap', 'kobotoolbox': 'kobotoolbox', 'sql server': 'sql-server', 'mysql': 'mysql',
    'sqlite': 'sqlite', 'postgresql': 'postgresql', 'python': 'python', 'java': 'java', 'spring boot': 'spring-boot', 'asp.net': 'aspnet',
    'flutter': 'flutter', 'kotlin': 'kotlin', 'android': 'android', 'ios': 'ios' };
  const ARROW = '<path d="M5 12h14M13 6l6 6-6 6"/>';
  const BACK = '<path d="M19 12H5M11 18l-6-6 6-6"/>';
  const EXPAND = '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>';
  const CHECK = '<path d="m5 12.5 4.2 4.2L19 7"/>';
  const FOLDER = '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>';
  const pad = k => String(k).padStart(2, '0');
  const media = (o, cls = '') => o.images?.length
    ? `<img class="${cls}" src="${esc(o.images[0])}" alt="" loading="lazy">`
    : `<svg class="illo ${cls}" viewBox="0 0 600 320" aria-hidden="true">${ILLOS[o.key] || ''}</svg>`;

  async function initExpertise() {
    const list = await window.MCHD_STORE.listPublic();
    const slug = new URLSearchParams(location.search).get('slug');
    let i = list.findIndex(x => x.slug === slug); if (i < 0) i = 0;
    const x = list[i], n = list.length;
    const imgs = x.images || [];
    document.title = `${x.title} — MCHD IT`;

    /* hero */
    $('[data-x-crumb]').textContent = x.title;
    $('[data-x-title]').textContent = x.title;
    $('[data-x-icon]').innerHTML = svg(ICONS[x.key] || '');
    $('[data-x-index]').textContent = `${pad(i + 1)} / ${pad(n)}`;
    const lead = $('[data-x-text]'); if (x.text) lead.textContent = x.text; else lead.remove();
    $('[data-x-cta-title]').textContent = `Interested in ${x.title}?`;
    $('[data-x-cta-icon]').innerHTML = svg(ICONS[x.key] || '');
    $$('[data-x-cta-link]').forEach(a => { a.href = `contact.html?topic=${encodeURIComponent(x.slug)}`; });

    // key facts — only facts that exist
    const facts = [];
    if (x.whatWeDo?.length) facts.push(['Capabilities', pad(x.whatWeDo.length), true]);
    if (x.projects?.length) facts.push(['Selected projects', pad(x.projects.length), true]);
    if (imgs.length) facts.push(['Product screens', pad(imgs.length), true]);
    if (x.tools?.length) facts.push(['Tools', x.tools.map(esc).join(', ')]);
    (x.meta || []).forEach(m => m.label && m.value && facts.push([esc(m.label), esc(m.value)]));
    facts.push(['Delivered by', 'MCHD IT, icddr,b']);
    $('[data-x-meta]').innerHTML = facts.map(([k, v, num]) => `<div${num ? ' class="is-num"' : ''}><dt>${k}</dt><dd>${v}</dd></div>`).join('');

    /* cover */
    $('[data-x-window]').textContent = `MCHD IT · ${x.title}`;
    const cover = $('[data-x-cover]'), cap = $('[data-x-cover-cap]');
    if (imgs.length) {
      cover.innerHTML = `<button type="button" class="xd-window__open" data-lb-open="0" aria-label="View ${esc(x.title)} product screen full size">
          <img src="${esc(imgs[0])}" alt="${esc(x.title)} — product screen"></button>`;
      cap.innerHTML = `<span><b>Product screen</b>${imgs.length > 1 ? ` · 01 of ${pad(imgs.length)}` : ''}</span>
        <button type="button" class="xd-window__zoom" data-lb-open="0">${svg(EXPAND)}View full size</button>`;
    } else {
      cover.innerHTML = `<div class="xd-window__illo">${media(x)}</div>`;
      cap.remove();
    }

    /* chapters */
    const ch = [];
    const head = (id, title, extra = '') => `<header class="xd-head" data-reveal><p class="xd-head__n">${pad(ch.length + 1)}</p><h2 id="${id}-title">${title}</h2>${extra}</header>`;
    const add = (id, title, cls, inner) => {
      ch.push({ id, title, html: `<section class="xd-sec ${cls}" id="${id}" aria-labelledby="${id}-title"><div class="container">${inner(head(id, title))}</div></section>` });
    };
    if (x.overview?.length) {
      const [first, ...rest] = x.overview;
      add('overview', 'Overview', 'xd-sec--overview', h => `<div class="xd-split">${h}
          <div class="xd-prose" data-reveal style="--d:.08s"><p class="xd-lede">${esc(first)}</p>${rest.map(t => `<p>${esc(t)}</p>`).join('')}</div></div>`);
    }
    if (x.whatWeDo?.length) {
      add('what-we-do', 'What we do', 'xd-sec--dark', h => `<div class="xd-dark-bg" aria-hidden="true"><div class="hero__grid"></div></div>
        <div class="xd-split">${h}
          <ol class="xd-caps">${x.whatWeDo.map((t, k) => `<li data-reveal style="--d:${(k % 2) * .08}s"><span class="xd-caps__n">${pad(k + 1)}</span><span class="xd-caps__ic">${svg(CHECK)}</span><p>${esc(t)}</p></li>`).join('')}</ol></div>`);
    }
    if (x.projects?.length) {
      add('projects', 'Selected projects', 'xd-sec--tint', h => `<div class="xd-split">${h}
          <ul class="xd-projects">${x.projects.map((pr, k) => `<li class="xd-project" data-reveal style="--d:${(k % 2) * .08}s">
              <div class="xd-project__top"><span class="xd-project__ic">${svg(FOLDER)}</span><span class="xd-project__n">P${pad(k + 1)}</span></div>
              ${pr.name ? `<h3>${esc(pr.name)}</h3>` : ''}${pr.text ? `<p>${esc(pr.text)}</p>` : ''}</li>`).join('')}</ul></div>`);
    }
    if (x.tools?.length) {
      add('tools', 'Tools', 'xd-sec--tools', h => `<div class="xd-split">${h}
          <ul class="xd-tools" data-reveal style="--d:.08s">${x.tools.map(t => { const k = TECH[t.toLowerCase()];
            return `<li>${k ? `<img src="assets/img/tech/${k}.png" alt="${esc(t)}" loading="lazy">` : `<span>${esc(t)}</span>`}</li>`; }).join('')}</ul></div>`);
    }
    if (imgs.length > 1) {
      add('screens', 'Screens', 'xd-sec--screens', h => `<div class="xd-split">${h}
          <div class="xd-gallery">${imgs.slice(1).map((src, k) => `<figure data-reveal style="--d:${(k % 2) * .08}s">
              <button type="button" class="xd-gallery__open" data-lb-open="${k + 1}" aria-label="View screen ${pad(k + 2)} full size"><img src="${esc(src)}" alt="${esc(x.title)} — product screen ${pad(k + 2)}" loading="lazy"><span class="xd-gallery__zoom">${svg(EXPAND)}</span></button>
              <figcaption>Screen ${pad(k + 2)} of ${pad(imgs.length)}</figcaption></figure>`).join('')}</div></div>`);
    }
    $('[data-x-body]').innerHTML = ch.map(c => c.html).join('');
    document.body.classList.toggle('xd--brief', !ch.length);

    const chip = $('[data-x-chip]');
    if (!ch.length) chip.remove();
    else { chip.href = '#' + ch[0].id; chip.firstChild.textContent = ch[0].id === 'overview' ? 'Read the overview' : `See ${ch[0].title.toLowerCase()}`; }

    if (ch.length > 1) initToc(ch);

    /* more expertise: previous / next, then the rest */
    const prev = list[(i - 1 + n) % n], next = list[(i + 1) % n];
    const pagerCard = (o, dir) => `<a class="xd-pager__item xd-pager__item--${dir}" href="${href(o)}" data-reveal>
        <span class="xd-pager__media">${media(o)}</span>
        <span class="xd-pager__copy"><small>${dir === 'next' ? `Next ${svg(ARROW)}` : `${svg(BACK)} Previous`}</small>
        <strong>${esc(o.title)}</strong>${o.text ? `<span class="xd-pager__text">${esc(o.text)}</span>` : ''}</span></a>`;
    $('[data-x-pager]').innerHTML = n > 2 ? pagerCard(prev, 'prev') + pagerCard(next, 'next') : pagerCard(next, 'next');
    $('[data-x-more]').innerHTML = list.map((o, k) => o === x || (n > 2 && o === prev) || o === next ? '' : `
      <li><a href="${href(o)}"><span class="xd-more__n">${pad(k + 1)}</span><span class="side-list__icon">${svg(ICONS[o.key] || '')}</span><span class="xd-more__t">${esc(o.title)}</span>${svg(ARROW, 'xd-more__go')}</a></li>`).join('');

    initLightbox(x, imgs);
    initParticles($('.xd-hero'));
    initReveals();
    requestAnimationFrame(() => $$('.xd-hero [data-reveal]').forEach(el => el.classList.add('is-in')));
  }

  // sticky chapter bar: highlights the chapter in view and shows reading progress
  function initToc(ch) {
    const toc = $('[data-x-toc]'), listEl = $('[data-x-toc-list]'), bar = $('[data-x-progress]'), body = $('[data-x-body]');
    listEl.innerHTML = ch.map((c, k) => `<li><a href="#${c.id}"><span>${pad(k + 1)}</span>${esc(c.title)}</a></li>`).join('');
    toc.hidden = false;
    const links = $$('a', listEl);
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + en.target.id));
      const cur = links.find(a => a.hasAttribute('aria-current'));
      cur && listEl.scrollTo({ left: cur.offsetLeft - 16, behavior: window.MCHD.reduced() ? 'auto' : 'smooth' });
    }), { rootMargin: '-35% 0px -55% 0px' });
    ch.forEach(c => io.observe(document.getElementById(c.id)));
    let raf = null;
    const run = () => {
      raf = null;
      const r = body.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight * .4 - r.top) / r.height));
      bar.style.transform = `scaleX(${p.toFixed(4)})`;
      toc.classList.toggle('is-stuck', toc.getBoundingClientRect().top <= 100);
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(run); }, { passive: true });
    run();
  }

  // full-size viewer for the real product screens (native <dialog>: Esc closes, focus returns)
  function initLightbox(x, imgs) {
    const dlg = $('[data-x-lightbox]'); if (!dlg) return;
    if (!imgs.length || typeof dlg.showModal !== 'function') { $$('[data-lb-open]').forEach(b => b.removeAttribute('data-lb-open')); return; }
    const img = $('[data-lb-img]', dlg), cap = $('[data-lb-cap]', dlg);
    const prevB = $('[data-lb-prev]', dlg), nextB = $('[data-lb-next]', dlg);
    let k = 0, opener = null;
    const show = j => {
      k = (j + imgs.length) % imgs.length;
      img.src = imgs[k]; img.alt = `${x.title} — product screen ${pad(k + 1)}`;
      cap.textContent = `${x.title} · Screen ${pad(k + 1)} of ${pad(imgs.length)}`;
    };
    prevB.hidden = nextB.hidden = imgs.length < 2;
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-lb-open]'); if (!b) return;
      opener = b; show(+b.dataset.lbOpen); dlg.showModal(); document.documentElement.classList.add('is-lb');
    });
    $('[data-lb-close]', dlg).addEventListener('click', () => dlg.close());
    prevB.addEventListener('click', () => show(k - 1));
    nextB.addEventListener('click', () => show(k + 1));
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', e => { if (imgs.length < 2) return; if (e.key === 'ArrowLeft') show(k - 1); if (e.key === 'ArrowRight') show(k + 1); });
    dlg.addEventListener('close', () => { document.documentElement.classList.remove('is-lb'); opener?.focus({ preventScroll: true }); });
  }

  /* ---------------- shared form helpers ---------------- */
  function validate(form) {
    let ok = true;
    $$('[required]', form).forEach(el => {
      const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
      el.closest('.field').classList.toggle('is-invalid', bad);
      el.setAttribute('aria-invalid', String(bad));
      if (bad && ok) { el.focus(); ok = false; }
    });
    return ok;
  }
  const setStatus = (form, msg, kind = '') => { const s = $('[data-form-status]', form); s.textContent = msg; s.dataset.kind = kind; };

  /* ---------------- contact ---------------- */
  function initContact() {
    const { CONTACT: c, TEAM, TEAM_VISIBLE } = window.MCHD_DATA;
    const I = {
      mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
      phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
      pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>'
    };
    const row = (ic, k, v) => `<li><span class="contact__ic">${svg(I[ic])}</span><div><small>${k}</small><p>${v}</p></div></li>`;
    $('[data-contact-side]').innerHTML = `
      <div class="contact-card" data-reveal>
        <div class="contact-card__who"><span class="contact-card__avatar">${c.person.initials}</span>
          <div><strong>${esc(c.person.name)}</strong><span>${esc(c.person.role)}</span></div></div>
        <ul class="contact__list">
          ${row('mail', 'Email', `<a href="mailto:${c.email}">${c.email}</a>`)}
          ${row('phone', 'Phone', `<a href="tel:${c.phone.replace(/\s/g, '')}">${esc(c.phone)}</a>`)}
          ${row('clock', 'Office Hours', esc(c.hours))}
        </ul>
      </div>
      <div class="contact-card contact-card--dark" data-reveal style="--d:.1s">
        <div class="contact-card__who"><span class="contact-card__avatar contact-card__avatar--icon">${svg(I.home)}</span>
          <div><strong>${esc(c.org)}</strong><span>${esc(c.orgSub)}</span></div></div>
        <ul class="contact__list">
          ${row('mail', 'General Enquiry', `<a href="mailto:${c.generalEmail}">${c.generalEmail}</a>`)}
          ${row('pin', 'Address', esc(c.address))}
        </ul>
        <div class="contact__map" aria-hidden="true"><img src="assets/img/world-dots.svg" alt=""><span class="contact__pin"></span></div>
      </div>`;

    // team grid + show/hide
    const grid = $('[data-team-grid]'); grid.id = 'team-grid';
    grid.innerHTML = TEAM.map(window.MCHD.personCard).join('');
    const cards = $$('.person', grid);
    const toggle = $('[data-team-toggle]'), note = $('[data-team-note]');
    const setOpen = open => {
      cards.forEach((li, i) => { li.hidden = !open && i >= TEAM_VISIBLE; });
      toggle.setAttribute('aria-expanded', String(open));
      $('span', toggle).textContent = open ? 'Hide Team Members' : 'Show Team Members';
      note.hidden = open;
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
      if (open) cards[TEAM_VISIBLE]?.querySelector('a')?.focus({ preventScroll: true });
    });
    setOpen(false);

    // subject options + ?topic= preselect
    const sel = $('[data-topic-select]');
    sel.insertAdjacentHTML('beforeend', EXPERTISE.map(x => `<option value="${x.slug}">${esc(x.title)}</option>`).join(''));
    const t = new URLSearchParams(location.search).get('topic');
    if (t) sel.value = t;

    const form = $('[data-contact-form]');
    form.addEventListener('input', e => e.target.closest('.field')?.classList.remove('is-invalid'));
    form.addEventListener('change', e => e.target.closest('.field')?.classList.remove('is-invalid'));
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validate(form)) return setStatus(form, 'Please complete the highlighted fields.', 'error');
      const data = Object.fromEntries(new FormData(form));
      const btn = $('[type=submit]', form);
      if (SITE.contactEndpoint) {
        btn.disabled = true; setStatus(form, 'Sending…');
        try {
          const r = await fetch(SITE.contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
          if (!r.ok) throw new Error(r.status);
          form.reset(); setStatus(form, 'Thank you — your message has been sent.', 'ok');
        } catch { setStatus(form, 'Sorry, the message could not be sent. Please try again.', 'error'); }
        btn.disabled = false;
      } else {
        // No backend configured: hand the message to the visitor's mail app, addressed to the general enquiry inbox
        const subject = 'Website enquiry: ' + sel.selectedOptions[0].text;
        const body = `${data.message}\n\n— ${data.firstName} ${data.lastName} (${data.email})`;
        location.href = `mailto:${c.generalEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setStatus(form, 'Opening your email app…', 'ok');
      }
    });
  }

  /* ---------------- client portal sign-in ---------------- */
  function initLogin() {
    initParticles($('.login__brand'));
    const form = $('[data-login-form]');
    const pw = $('input[name=password]', form);
    const eye = $('[data-pw-toggle]', form);
    eye.addEventListener('click', () => {
      const show = pw.type === 'password';
      pw.type = show ? 'text' : 'password';
      eye.setAttribute('aria-pressed', String(show));
      eye.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
    const forgot = $('[data-forgot]');
    if (SITE.portalForgotUrl) forgot.href = SITE.portalForgotUrl; else forgot.addEventListener('click', e => { e.preventDefault(); setStatus(form, 'Please contact the MCHD IT team to reset your password.', ''); });
    form.addEventListener('input', e => e.target.closest('.field')?.classList.remove('is-invalid'));
    form.addEventListener('submit', e => {
      if (!validate(form)) { e.preventDefault(); return setStatus(form, 'Please enter your username and password.', 'error'); }
      if (SITE.portalLoginAction) { form.action = SITE.portalLoginAction; form.method = 'post'; return; } // real submit
      e.preventDefault();
      setStatus(form, 'Portal sign-in is not connected yet (set SITE.portalLoginAction in pages.js).', 'error');
    });
  }

  /* ---------------- boot ---------------- */
  const page = $('main')?.dataset.page;
  if ($('[data-nav]')) initNav();
  if (page === 'expertise') initExpertise();
  if (page === 'contact') initContact();
  if (page === 'login') initLogin();
  // page hero particles where present
  $$('.page-hero').forEach(h => $('[data-particles]', h) && initParticles(h));
  if ($('[data-to-top]')) initToTop();
  initReveals();
})();
