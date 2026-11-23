/* MCHD IT — Core Expertise admin (works with Firebase or in browser demo mode). */
(() => {
  'use strict';
  const { $, $$, esc } = window.MCHD;
  const { ICONS } = window.MCHD_DATA;
  const S = window.MCHD_STORE;
  const view = name => $$('[data-view]').forEach(v => { v.hidden = v.dataset.view !== name; });
  const toast = (msg, kind = 'ok') => {
    const t = $('[data-toast]'); t.textContent = msg; t.dataset.kind = kind; t.classList.add('is-on');
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('is-on'), 3200);
  };
  const slugify = s => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  const iconSvg = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k] || ''}</svg>`;

  // mode badge
  const modeEl = $('[data-mode]');
  modeEl.textContent = S.mode === 'firebase' ? 'Firebase · live' : 'Demo mode · saved in this browser only';
  modeEl.dataset.kind = S.mode;

  /* ---------------- auth ---------------- */
  const loginForm = $('[data-login]');
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const st = $('[data-form-status]', loginForm); st.dataset.kind = ''; st.textContent = 'Signing in…';
    try { await S.signIn(loginForm.email.value.trim(), loginForm.password.value); }
    catch (err) { st.dataset.kind = 'error'; st.textContent = /password|user|credential/i.test(err.code || err.message) ? 'Email or password is incorrect.' : err.message; }
  });
  $('[data-forgot]').addEventListener('click', async () => {
    const st = $('[data-form-status]', loginForm), email = loginForm.email.value.trim();
    if (!email) { st.dataset.kind = 'error'; st.textContent = 'Enter your email first.'; return; }
    try { await S.resetPassword(email); st.dataset.kind = 'ok'; st.textContent = 'Password reset email sent.'; }
    catch (err) { st.dataset.kind = 'error'; st.textContent = err.message; }
  });
  $('[data-signout]').addEventListener('click', () => S.signOut());

  S.onAuth(async user => {
    if (!user) { view('login'); $('[data-signout]').hidden = true; return; }
    $('[data-signout]').hidden = !!user.demo;
    $('[data-reset]').hidden = !user.demo;
    view('app');
    await load();
  }).catch(err => { view('login'); toast('Could not reach Firebase: ' + err.message, 'error'); });

  /* ---------------- list ---------------- */
  let items = [], current = null, dirty = false, isNew = false;
  const listEl = $('[data-list]');

  async function load(selectSlug) {
    try { items = await S.listAll(); }
    catch (err) { toast(err.code === 'permission-denied' ? 'This account is not an admin (see ADMIN.md).' : err.message, 'error'); items = []; }
    $('[data-seed]').hidden = items.length > 0 || S.mode !== 'firebase';
    renderList();
    const pick = items.find(x => x.slug === (selectSlug || current?.slug)) || items[0];
    pick ? edit(pick) : newItem();
  }

  function renderList() {
    listEl.innerHTML = items.map((x, i) => `
      <li draggable="true" data-slug="${esc(x.slug)}" class="${current && x.slug === current.slug ? 'is-current' : ''}">
        <span class="adm-grip" aria-hidden="true">⋮⋮</span>
        <button type="button" class="adm-list__btn" data-open="${esc(x.slug)}">
          <span class="adm-list__n">${String(i + 1).padStart(2, '0')}</span>
          <span class="adm-list__ic">${iconSvg(x.key)}</span>
          <span class="adm-list__t">${esc(x.title)}</span>
          ${x.published === false ? '<span class="adm-pill">Draft</span>' : ''}
        </button>
        <span class="adm-move">
          <button type="button" data-up="${i}" aria-label="Move ${esc(x.title)} up" ${i === 0 ? 'disabled' : ''}>▲</button>
          <button type="button" data-down="${i}" aria-label="Move ${esc(x.title)} down" ${i === items.length - 1 ? 'disabled' : ''}>▼</button>
        </span>
      </li>`).join('');
  }

  listEl.addEventListener('click', async e => {
    const open = e.target.closest('[data-open]');
    if (open) { if (await confirmLeave()) edit(items.find(x => x.slug === open.dataset.open)); return; }
    const up = e.target.closest('[data-up]'), down = e.target.closest('[data-down]');
    if (up || down) { const i = +(up || down).dataset[up ? 'up' : 'down']; move(i, up ? i - 1 : i + 1); }
  });
  // drag & drop reorder
  let dragFrom = null;
  listEl.addEventListener('dragstart', e => { const li = e.target.closest('li'); dragFrom = [...listEl.children].indexOf(li); li.classList.add('is-drag'); });
  listEl.addEventListener('dragend', e => e.target.closest('li')?.classList.remove('is-drag'));
  listEl.addEventListener('dragover', e => { e.preventDefault(); });
  listEl.addEventListener('drop', e => { e.preventDefault(); const li = e.target.closest('li'); if (!li || dragFrom === null) return; move(dragFrom, [...listEl.children].indexOf(li)); dragFrom = null; });

  async function move(from, to) {
    if (to < 0 || to >= items.length || from === to) return;
    const [x] = items.splice(from, 1); items.splice(to, 0, x);
    items.forEach((it, k) => { it.order = k; });
    renderList();
    try { await S.saveOrder(items.map(x => x.slug)); toast('Order saved'); }
    catch (err) { toast(err.message, 'error'); }
  }

  /* ---------------- editor ---------------- */
  const form = $('[data-form]');
  const iconSel = $('[data-icons]');
  iconSel.innerHTML = Object.keys(ICONS).map(k => `<option value="${k}">${k}</option>`).join('');
  iconSel.addEventListener('change', () => { $('[data-icon-pv]').innerHTML = iconSvg(iconSel.value); });
  let images = [];

  function edit(x) {
    current = x; isNew = false; dirty = false;
    $('[data-form-eyebrow]').textContent = 'Edit expertise';
    fill(x);
    renderList();
  }
  function newItem() {
    current = { slug: '', key: 'survey', title: '', text: '', published: false, order: items.length };
    isNew = true; dirty = false;
    $('[data-form-eyebrow]').textContent = 'New expertise';
    fill(current);
    renderList();
    form.title.focus();
  }
  $('[data-new]').addEventListener('click', async () => { if (await confirmLeave()) newItem(); });

  function fill(x) {
    form.title.value = x.title || '';
    form.slug.value = x.slug || '';
    form.key.value = x.key && ICONS[x.key] ? x.key : 'survey';
    form.text.value = x.text || '';
    form.published.checked = x.published !== false;
    form.overview.value = (x.overview || []).join('\n\n');
    form.whatWeDo.value = (x.whatWeDo || []).join('\n');
    form.projects.value = (x.projects || []).map(p => p.name ? `${p.name}: ${p.text || ''}`.trim() : p.text).join('\n');
    form.tools.value = (x.tools || []).join(', ');
    form.meta.value = (x.meta || []).map(m => `${m.label}: ${m.value}`).join('\n');
    images = [...(x.images || [])];
    renderImages();
    $('[data-icon-pv]').innerHTML = iconSvg(form.key.value);
    $('[data-form-title]').textContent = x.title || 'Untitled expertise';
    $('[data-preview]').href = x.slug ? `expertise.html?slug=${encodeURIComponent(x.slug)}` : '#';
    $('[data-preview]').toggleAttribute('aria-disabled', !x.slug || isNew);
    $('[data-delete]').hidden = isNew;
    $('[data-updated]').textContent = x.updatedAt ? 'Last saved ' + new Date(x.updatedAt).toLocaleString() : '';
    updateSlugPreview(); updateCount();
  }

  function read() {
    return {
      ...current,
      title: form.title.value.trim(),
      slug: form.slug.value.trim(),
      key: form.key.value,
      text: form.text.value.trim(),
      published: form.published.checked,
      overview: form.overview.value.split(/\n\s*\n/).map(s => s.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean),
      whatWeDo: form.whatWeDo.value.split('\n').map(s => s.replace(/^[-•*]\s*/, '').trim()).filter(Boolean),
      projects: form.projects.value.split('\n').map(l => { l = l.replace(/^[-•*]\s*/, '').trim(); if (!l) return null; const k = l.indexOf(':'); return k > 0 ? { name: l.slice(0, k).trim(), text: l.slice(k + 1).trim() } : { name: l, text: '' }; }).filter(Boolean),
      tools: form.tools.value.split(',').map(s => s.trim()).filter(Boolean),
      meta: form.meta.value.split('\n').map(l => { const k = l.indexOf(':'); return k > 0 ? { label: l.slice(0, k).trim(), value: l.slice(k + 1).trim() } : null; }).filter(m => m && m.label && m.value),
      images
    };
  }

  form.addEventListener('input', e => {
    dirty = true;
    if (e.target === form.title) {
      $('[data-form-title]').textContent = form.title.value || 'Untitled expertise';
      if (isNew && !form.slug.dataset.touched) form.slug.value = slugify(form.title.value);
    }
    if (e.target === form.slug) form.slug.dataset.touched = '1';
    updateSlugPreview(); updateCount();
    e.target.closest('.field')?.classList.remove('is-invalid');
  });
  const updateSlugPreview = () => { $('[data-slug-preview]').textContent = form.slug.value || '…'; };
  const updateCount = () => { $('[data-count-for="text"]').textContent = `${form.text.value.length}/260`; };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const x = read();
    let bad = null;
    [['title', !x.title], ['slug', !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x.slug)], ['text', !x.text]].forEach(([f, isBad]) => {
      form[f].closest('.field').classList.toggle('is-invalid', isBad); if (isBad && !bad) bad = f;
    });
    if (bad) { form[bad].focus(); return toast(bad === 'slug' ? 'Slug: lowercase letters, numbers and dashes only.' : 'Please fill in the required fields.', 'error'); }
    if (items.some(o => o.slug === x.slug && o !== current)) { form.slug.closest('.field').classList.add('is-invalid'); return toast('Another expertise already uses that slug.', 'error'); }
    const btn = $('[data-save]'); btn.disabled = true; btn.textContent = 'Saving…';
    try {
      const oldSlug = isNew ? null : current.slug;
      if (isNew) x.order = items.length;
      await S.rename(oldSlug, x);
      dirty = false; isNew = false;
      toast('Saved — the website is updated');
      await load(x.slug);
    } catch (err) { toast(err.code === 'permission-denied' ? 'You do not have permission to edit content.' : err.message, 'error'); }
    btn.disabled = false; btn.textContent = 'Save changes';
  });

  $('[data-delete]').addEventListener('click', async () => {
    if (!current || isNew) return;
    if (!confirm(`Delete “${current.title}”? This removes its page from the website and cannot be undone.`)) return;
    try { await S.remove(current.slug); toast('Deleted'); current = null; dirty = false; await load(); }
    catch (err) { toast(err.message, 'error'); }
  });

  $('[data-import]').addEventListener('click', async () => {
    try { await S.importDefaults(); toast('Site content imported'); await load(); } catch (err) { toast(err.message, 'error'); }
  });
  $('[data-reset]').addEventListener('click', async () => {
    if (!confirm('Reset demo content to the original site content? Your demo edits in this browser will be lost.')) return;
    await S.resetDemo(); dirty = false; current = null; toast('Demo content reset'); await load();
  });

  async function confirmLeave() { return !dirty || confirm('You have unsaved changes. Discard them?'); }
  addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  /* ---------------- images ---------------- */
  const imgList = $('[data-images]');
  function renderImages() {
    imgList.innerHTML = images.map((src, i) => `
      <li><img src="${esc(src)}" alt="">
        ${i === 0 ? '<span class="adm-pill adm-pill--cover">Cover</span>' : ''}
        <span class="adm-img-actions">
          ${i > 0 ? `<button type="button" data-img-cover="${i}" title="Make cover">★</button>` : ''}
          <button type="button" data-img-del="${i}" title="Remove image" aria-label="Remove image">✕</button>
        </span></li>`).join('');
  }
  imgList.addEventListener('click', e => {
    const c = e.target.closest('[data-img-cover]'), d = e.target.closest('[data-img-del]');
    if (c) { const [x] = images.splice(+c.dataset.imgCover, 1); images.unshift(x); }
    else if (d) images.splice(+d.dataset.imgDel, 1); else return;
    dirty = true; renderImages();
  });
  const drop = $('[data-drop]'), file = $('[data-file]');
  drop.addEventListener('click', () => file.click());
  drop.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); file.click(); } });
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, () => drop.classList.remove('is-over')));
  drop.addEventListener('drop', e => { e.preventDefault(); upload([...e.dataTransfer.files]); });
  file.addEventListener('change', () => { upload([...file.files]); file.value = ''; });
  async function upload(files) {
    files = files.filter(f => f.type.startsWith('image/'));
    for (const f of files) {
      drop.classList.add('is-busy'); toast(`Uploading ${f.name}…`, '');
      try { images.push(await S.uploadImage(f)); dirty = true; renderImages(); toast('Image added — remember to save'); }
      catch (err) { toast(err.message, 'error'); }
      drop.classList.remove('is-busy');
    }
  }
  $('[data-url-add]').addEventListener('click', () => {
    const u = $('[data-url]').value.trim();
    if (!/^(https?:\/\/|assets\/)/.test(u)) return toast('Use a full https:// URL or an assets/… path', 'error');
    images.push(u); $('[data-url]').value = ''; dirty = true; renderImages();
  });
})();
