/* MCHD IT — content store for Core Expertise.
   Firebase mode : Firestore collection `expertise` (one doc per slug), Storage for images, Auth for admins.
   Demo mode     : no Firebase config → content lives in this browser's localStorage (admin + site, same browser).
   Either way the public site falls back to the built-in content in data.js if nothing is stored yet. */
window.MCHD_STORE = (() => {
  'use strict';
  const CFG = window.MCHD_FIREBASE_CONFIG;
  const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  const LS_KEY = 'mchd.expertise.v1';
  const mode = CFG ? 'firebase' : 'demo';

  const FIELDS = ['slug', 'key', 'title', 'text', 'overview', 'whatWeDo', 'projects', 'tools', 'meta', 'images', 'order', 'published'];
  const clean = x => {
    const o = {};
    FIELDS.forEach(f => { if (x[f] !== undefined && x[f] !== null && !(Array.isArray(x[f]) && !x[f].length) && x[f] !== '') o[f] = x[f]; });
    o.published = x.published !== false;
    o.order = Number.isFinite(+x.order) ? +x.order : 999;
    return o;
  };
  const defaults = () => window.MCHD_DATA.EXPERTISE.map((x, i) => clean({ ...x, order: i, published: true }));
  const sortByOrder = list => list.slice().sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  /* ---------- Firebase (lazy-loaded compat SDK) ---------- */
  let fbReady = null;
  const loadScript = src => new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load ' + src));
    document.head.append(s);
  });
  function fb() {
    if (!fbReady) fbReady = (async () => {
      await loadScript(SDK + 'firebase-app-compat.js');
      await Promise.all(['auth', 'firestore', 'storage'].map(m => loadScript(`${SDK}firebase-${m}-compat.js`)));
      const app = window.firebase.apps.length ? window.firebase.app() : window.firebase.initializeApp(CFG);
      return { app, auth: window.firebase.auth(), db: window.firebase.firestore(), storage: window.firebase.storage() };
    })();
    return fbReady;
  }

  /* ---------- demo storage ---------- */
  const lsRead = () => { try { const v = JSON.parse(localStorage.getItem(LS_KEY)); return Array.isArray(v) ? v : null; } catch { return null; } };
  const lsWrite = list => { try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch (e) { throw new Error('Browser storage is full — use smaller images or connect Firebase.'); } };

  /* ---------- public API ---------- */
  // Published expertise for the website (never throws: falls back to built-in content)
  async function listPublic() {
    try {
      if (mode === 'firebase') {
        const { db } = await fb();
        const snap = await db.collection('expertise').where('published', '==', true).get();
        const list = snap.docs.map(d => d.data());
        return list.length ? sortByOrder(list) : defaults();
      }
      const local = lsRead();
      return local ? sortByOrder(local).filter(x => x.published !== false) : defaults();
    } catch (e) {
      console.warn('[MCHD] content store unavailable, using built-in content:', e.message);
      return defaults();
    }
  }

  // Everything, including drafts (admin)
  async function listAll() {
    if (mode === 'firebase') {
      const { db } = await fb();
      const snap = await db.collection('expertise').get();
      return sortByOrder(snap.docs.map(d => d.data()));
    }
    return sortByOrder(lsRead() || defaults());
  }

  async function save(item) {
    const doc = clean(item);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(doc.slug || '')) throw new Error('Slug must be lowercase letters, numbers and dashes.');
    doc.updatedAt = new Date().toISOString();
    if (mode === 'firebase') {
      const { db } = await fb();
      await db.collection('expertise').doc(doc.slug).set(doc);
      return doc;
    }
    const list = lsRead() || defaults();
    const i = list.findIndex(x => x.slug === doc.slug);
    i >= 0 ? (list[i] = doc) : list.push(doc);
    lsWrite(list);
    return doc;
  }

  async function remove(slug) {
    if (mode === 'firebase') { const { db } = await fb(); await db.collection('expertise').doc(slug).delete(); return; }
    lsWrite((lsRead() || defaults()).filter(x => x.slug !== slug));
  }

  async function rename(oldSlug, item) { // slug changed: write new doc, then delete old
    const saved = await save(item);
    if (oldSlug && oldSlug !== saved.slug) await remove(oldSlug);
    return saved;
  }

  async function saveOrder(slugs) {
    if (mode === 'firebase') {
      const { db } = await fb();
      const batch = db.batch();
      slugs.forEach((s, i) => batch.update(db.collection('expertise').doc(s), { order: i }));
      await batch.commit(); return;
    }
    const list = lsRead() || defaults();
    list.forEach(x => { x.order = slugs.indexOf(x.slug); });
    lsWrite(list);
  }

  // Seed the store with the site's built-in content (first-time setup / reset)
  async function importDefaults({ overwrite = false } = {}) {
    const items = defaults();
    if (mode === 'firebase') {
      const { db } = await fb();
      const existing = new Set((await db.collection('expertise').get()).docs.map(d => d.id));
      const batch = db.batch();
      items.forEach(x => { if (overwrite || !existing.has(x.slug)) batch.set(db.collection('expertise').doc(x.slug), { ...x, updatedAt: new Date().toISOString() }); });
      await batch.commit(); return;
    }
    if (overwrite || !lsRead()) lsWrite(items);
  }

  // Resize to ≤1600px JPEG, then upload (Storage) or inline (demo). Returns a URL.
  async function uploadImage(file) {
    const blob = await shrink(file, 1600, .84);
    if (mode === 'firebase') {
      const { storage } = await fb();
      const ref = storage.ref().child(`expertise/${Date.now()}-${file.name.replace(/[^\w.-]+/g, '-').replace(/\.\w+$/, '')}.jpg`);
      await ref.put(blob, { contentType: 'image/jpeg', cacheControl: 'public,max-age=31536000' });
      return ref.getDownloadURL();
    }
    if (blob.size > 900 * 1024) throw new Error('In demo mode images must be under ~900 KB after resizing. Connect Firebase for full uploads.');
    return new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });
  }
  function shrink(file, max, q) {
    return new Promise((res, rej) => {
      const img = new Image(); const url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(b => b ? res(b) : rej(new Error('Could not process image')), 'image/jpeg', q);
      };
      img.onerror = () => rej(new Error('That file is not a readable image'));
      img.src = url;
    });
  }

  /* ---------- auth (Firebase mode) ---------- */
  async function signIn(email, password) { const { auth } = await fb(); return auth.signInWithEmailAndPassword(email, password); }
  async function signOut() { if (mode === 'firebase') { const { auth } = await fb(); return auth.signOut(); } }
  async function onAuth(cb) { if (mode !== 'firebase') return cb({ demo: true }); const { auth } = await fb(); auth.onAuthStateChanged(cb); }
  async function resetPassword(email) { const { auth } = await fb(); return auth.sendPasswordResetEmail(email); }
  async function resetDemo() { localStorage.removeItem(LS_KEY); }

  return { mode, listPublic, listAll, save, rename, remove, saveOrder, importDefaults, uploadImage, signIn, signOut, onAuth, resetPassword, resetDemo, defaults };
})();
