/* প্রশ্নভান্ডার v2 – static MCQ site (GitHub Pages ready) */
const $app = document.getElementById('app');
const K_RES = 'pb_results_v1', K_WRONG = 'pb_wrong_v1', K_PREF = 'pb_pref_v1';
const LABELS = ['ক', 'খ', 'গ', 'ঘ'];
let INDEX = null, timerId = null;
const openCols = {};

/* ---------- helpers ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const bn = n => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
const fmt = n => bn((Math.round(n * 100) / 100).toString());
const mmss = s => `${bn(String(Math.floor(s / 60)).padStart(2, '0'))}:${bn(String(s % 60).padStart(2, '0'))}`;
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const getResults = () => lsGet(K_RES, []);
const saveResult = r => lsSet(K_RES, [r, ...getResults()].slice(0, 300));
const bestOf = id => getResults().filter(r => r.setId === id && r.mode === 'exam').reduce((m, r) => Math.max(m, r.score), -Infinity);
const attemptsOf = id => getResults().filter(r => r.setId === id).length;

/* ভুল প্রশ্নের খাতা: { "setId#idx": {setId, idx, times, at} } */
const getWrong = () => lsGet(K_WRONG, {});
const wrongCount = () => Object.keys(getWrong()).length;
const wrongOfSet = id => Object.values(getWrong()).filter(w => w.setId === id);
const prefs = () => ({ view: 'focus', fs: 16, shuffle: false, ...lsGet(K_PREF, {}) });
const setPref = (k, v) => lsSet(K_PREF, { ...prefs(), [k]: v });

/* ---------- data loading (data/*.js → memory) ---------- */
const WARN = [];
const letterIdx = x => {
  const t = String(x).trim().toLowerCase().replace(/[()\s.]/g, '');
  const m = { 'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3, 'ঙ': 4, a: 0, b: 1, c: 2, d: 3, e: 4, 1: 0, 2: 1, 3: 2, 4: 3, '১': 0, '২': 1, '৩': 2, '৪': 3 };
  return t in m ? m[t] : -1;
};
const loadScript = src => new Promise(res => {
  const el = document.createElement('script');
  el.src = src + '?t=' + Date.now();
  el.onload = () => res(true); el.onerror = () => res(false);
  document.head.appendChild(el);
});
function normQ(q, where) {
  let o = q.o || q.options;
  if (o && !Array.isArray(o)) o = ['a', 'b', 'c', 'd', 'e'].filter(k => k in o).map(k => o[k]);
  let a = q.a ?? q.ans;
  if (typeof a === 'string') a = letterIdx(a);
  if (!q.q || !o || o.length < 2 || !Number.isInteger(a) || a < 0 || a >= o.length) {
    WARN.push(`${where}: প্রশ্ন/অপশন/উত্তর ঠিক নেই`); return null;
  }
  return { q: String(q.q).trim(), o: o.map(x => String(x).trim()), a, e: String(q.e || q.explain || '').trim() };
}
/* সাধারণ লেখা (পেস্ট করা MCQ) → প্রশ্নের তালিকা */
function parseText(text, where) {
  const out = []; let cur = null, mode = 'q', seq = 0;
  const reQ = /^\s*([0-9০-৯]+)\s*[.)।:\-–]\s*(.*)$/;
  const reO = /^\s*\(?([কখগঘঙ]|[a-eA-E])\s*[).।:]\s*(.*)$/;
  const reA = /^\s*(?:উত্তর|উঃ|সঠিক\s*উত্তর|সঠিক|ans(?:wer)?)\s*[:：\-–=]\s*\(?\s*([কখগঘঙ]|[a-eA-E]|[1-4১-৪])\s*\)?(?![ঀ-৿\w])/i;
  const reE = /^\s*(?:ব্যাখ্যা|exp(?:lanation)?|note)\s*[:：\-–]\s*(.*)$/i;
  const flush = () => {
    if (!cur) return;
    if (!cur.q.trim() || cur.o.length < 2) WARN.push(`${where}: প্রশ্ন ${bn(cur.n)} — অপশন কম বা প্রশ্ন ফাঁকা`);
    else if (cur.a < 0 || cur.a >= cur.o.length) WARN.push(`${where}: প্রশ্ন ${bn(cur.n)} — "উত্তর:" পাওয়া যায়নি বা ভুল`);
    else out.push({ q: cur.q.trim(), o: cur.o, a: cur.a, e: cur.e.trim() });
    cur = null;
  };
  const start = q => { flush(); cur = { n: ++seq, q, o: [], a: -1, e: '' }; mode = 'q'; };
  String(text).split(/\r?\n/).forEach(raw => {
    const line = raw.trim(); if (!line) return;
    let m;
    if ((m = line.match(reA))) { if (cur) { cur.a = letterIdx(m[1]); mode = 'a'; } return; }
    if ((m = line.match(reE))) { if (cur) { cur.e = m[1]; mode = 'e'; } return; }
    if ((m = line.match(reQ))) { start(m[2]); return; }
    if (cur && mode !== 'e' && mode !== 'a' && (m = line.match(reO))) { cur.o.push(m[2]); mode = 'o'; return; }
    if (!cur || mode === 'a') { start(line); return; }          // নম্বর ছাড়া নতুন প্রশ্ন
    if (mode === 'q') cur.q += ' ' + line;
    else if (mode === 'o') cur.o[cur.o.length - 1] += ' ' + line;
    else if (mode === 'e') cur.e += ' ' + line;
  });
  flush();
  return out;
}
/* ---------- ডেটা ফাইল রেজিস্ট্রি ----------
 * data/ ফোল্ডারের যেকোনো ফাইল নিজেকে নিজে রেজিস্টার করে (পুরনো ফাইল ছুঁতে হয় না):
 *   PB.add({ collection: {id,icon,title,desc}, sub: {id,title}, id, title, negative, duration, text })
 *   PB.sets("bcs", { "prelim": [ {…} ] })   ← পুরনো ফরম্যাট, এখনো চলে (এখন একাধিক ফাইল জোড়া লাগে)
 */
function setupPB() {
  PB._reg = [];
  const fileName = () => { try { return ((document.currentScript && document.currentScript.src) || '').split('?')[0].split('/').pop(); } catch { return ''; } };
  PB.sets = (cid, obj) => { PB._reg.push({ file: fileName(), cid, obj }); };
  PB.add = (...items) => { const f = fileName(); items.flat().forEach(it => PB._reg.push({ file: f, add: it })); };
}
window.addEventListener('error', e => {
  const m = String(e.filename || '').match(/\/data\/([^/?]+\.js)/);
  if (m && m[1] !== 'index.js') WARN.push(`${m[1]}: লাইন ${bn(e.lineno || '?')} এর কাছে কোডে ভুল (ব্যাকটিক ( ` + "`" + ` ), কমা বা } ঠিক আছে?) — ${e.message}`);
});
const byFile = (a, b) => (a.legacy === b.legacy ? 0 : a.legacy ? -1 : 1) || a.file.localeCompare(b.file, 'en', { numeric: true });

function normalize() {
  const reg = (PB._reg || []).map(x => ({ ...x, legacy: !!x.cid }));
  Object.keys(PB._sets || {}).forEach(cid => reg.push({ file: '', cid, obj: PB._sets[cid], legacy: true })); // প্রি-লোডেড পুরনো ধরন
  reg.sort(byFile);

  const cols = PB.collections.map(c => ({ ...c, subs: (c.subs || []).map(s => ({ ...s })) }));
  const bucket = {};
  const put = (c, s, r, file) => (bucket[c.id + '\u0000' + s.id] = bucket[c.id + '\u0000' + s.id] || []).push({ r, file });
  const getCol = (def, file) => {
    const d = typeof def === 'string' ? { id: def } : def || {};
    if (!d.id) { WARN.push(`${file}: collection এর id দেওয়া হয়নি`); return null; }
    let c = cols.find(x => x.id === d.id);
    if (!c) {
      if (typeof def === 'string') { WARN.push(`${file}: "${d.id}" নামে কালেকশন নেই — collection: { id, icon, title, desc } দিয়ে নতুন বানান`); return null; }
      c = { id: d.id, icon: d.icon || '📁', title: d.title || d.id, desc: d.desc || '', subs: [] }; cols.push(c);
    } else ['icon', 'title', 'desc'].forEach(k => { if (!c[k] && d[k]) c[k] = d[k]; });
    return c;
  };
  const getSub = (c, def, file) => {
    const d = typeof def === 'string' ? { id: def } : def || {};
    if (!d.id) { WARN.push(`${file}: sub এর id দেওয়া হয়নি`); return null; }
    let s = c.subs.find(x => x.id === d.id);
    if (!s) s = c.subs[c.subs.push({ id: d.id, title: d.title || d.id, icon: d.icon, desc: d.desc }) - 1];
    else ['icon', 'title', 'desc'].forEach(k => { if (!s[k] && d[k]) s[k] = d[k]; });
    return s;
  };

  reg.forEach(x => {
    const file = x.file || 'data';
    if (x.legacy) {
      const c = cols.find(y => y.id === x.cid);
      if (!c) { WARN.push(`${file}: "${x.cid}" নামে কালেকশন index.js এ নেই`); return; }
      Object.keys(x.obj || {}).forEach(sid => {
        const s = c.subs.find(y => y.id === sid);
        if (!s) { WARN.push(`${c.title}: "${sid}" নামে সাবসেকশন index.js এ নেই`); return; }
        (x.obj[sid] || []).forEach(r => put(c, s, r, file));
      });
    } else {
      const { collection, sub, ...r } = x.add || {};
      const c = getCol(collection, file); if (!c) return;
      const s = getSub(c, sub, file); if (!s) return;
      put(c, s, r, file);
    }
  });

  const out = cols.map(c => ({
    id: c.id, icon: c.icon, title: c.title, desc: c.desc,
    subsections: c.subs.map(sub => {
      const seen = new Set(), list = [];
      (bucket[c.id + '\u0000' + sub.id] || []).forEach(({ r, file }, i) => {
        const lid = String(r.id || ('s' + (i + 1)));
        const where = `${c.title} › ${sub.title} › ${r.title || lid}`;
        if (seen.has(lid)) WARN.push(`${where} (${file}): id "${lid}" একই সাবসেকশনে দুইবার আছে`);
        seen.add(lid);
        let qs = (r.questions || []).map((q, j) => normQ(q, `${where} প্রশ্ন ${bn(j + 1)}`)).filter(Boolean);
        if (r.text) qs = qs.concat(parseText(r.text, where));
        if (!qs.length) { WARN.push(`${where}: কোনো প্রশ্ন পাওয়া যায়নি`); return; }
        const title = r.title || lid, negative = r.negative ?? 0.5, duration = r.duration ?? 0;
        list.push({ id: `${c.id}.${sub.id}.${lid}`, title, questions: qs.length, duration, negative,
          data: { title, negative, duration, questions: qs } });
      });
      return { id: sub.id, title: sub.title, icon: sub.icon, desc: sub.desc, sets: list };
    })
  }));
  return { siteTitle: PB.site?.title, tagline: PB.site?.tagline, collections: out };
}

/* data/ ফোল্ডারে কোন কোন ফাইল আছে — GitHub API দিয়ে নিজে খুঁজে নেয় (২ মিনিট ক্যাশ, ব্যর্থ হলে পুরনো ক্যাশ) */
async function listDataFiles() {
  const K = 'pb_filelist_v1', cached = lsGet(K, null);
  if (cached && Date.now() - cached.t < 120000) return cached.files;
  let o = null, r = null;
  if (PB.repo && PB.repo.includes('/')) [o, r] = PB.repo.split('/');
  else if (/\.github\.io$/i.test(location.hostname)) {
    o = location.hostname.split('.')[0];
    const first = location.pathname.split('/').filter(Boolean)[0];
    r = first && !/\.html?$/i.test(first) ? first : location.hostname;
  }
  if (!o || !r) return cached ? cached.files : [];
  try {
    const res = await fetch(`https://api.github.com/repos/${o}/${r}/contents/data`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const files = (await res.json()).filter(f => f.type === 'file' && /\.js$/i.test(f.name) && f.name !== 'index.js').map(f => 'data/' + f.name);
    lsSet(K, { t: Date.now(), files });
    return files;
  } catch (e) {
    console.warn('ফাইল তালিকা আনা যায়নি, ক্যাশ/ডিফল্ট ব্যবহার হচ্ছে:', e);
    return cached ? cached.files : [];
  }
}
async function loadAll() {
  if (!window.__PB_PRELOADED) {
    await loadScript('data/index.js');
    if (!window.PB || !PB.collections) throw new Error('data/index.js লোড হয়নি');
    setupPB();                                   // নতুন রেজিস্ট্রি (index.js যাই করুক)
    const files = new Set(PB.collections.map(c => 'data/' + c.id + '.js'));
    (PB.files || []).forEach(f => files.add(f.startsWith('data/') ? f : 'data/' + f));
    (await listDataFiles()).forEach(f => files.add(f));
    await Promise.all([...files].map(loadScript));
  }
  return normalize();
}
const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const FIXED = /উপরের|সবগুলো|কোনোটিই|কোনটিই|none of|all of the above|both/i;
function shuffleQ(q) {
  if (q.o.some(x => FIXED.test(x))) return q;
  const order = shuf(q.o.map((_, i) => i));
  return { ...q, o: order.map(i => q.o[i]), a: order.indexOf(q.a) };
}
const crumbs = parts => `<div class="crumbs">${parts.map(p => p.h ? `<a href="${p.h}">${esc(p.t)}</a>` : esc(p.t)).join(' › ')}</div>`;
const countSets = c => c.subsections.reduce((n, s) => n + s.sets.length, 0);
function findSet(id) {
  for (const c of INDEX.collections) for (const s of c.subsections) for (const st of s.sets)
    if (st.id === id) return { c, s, st };
  return null;
}
function nextSet(id) {
  for (const c of INDEX.collections) for (const s of c.subsections) {
    const i = s.sets.findIndex(x => x.id === id);
    if (i >= 0) return s.sets[i + 1] || null;
  }
  return null;
}
function updateWrongBadge() {
  const b = document.getElementById('wrongBadge');
  if (!b) return;
  const n = wrongCount();
  b.textContent = bn(n); b.hidden = !n;
}

/* ---------- theme ---------- */
(function () {
  try { const t = localStorage.getItem('pb_theme'); if (t) document.documentElement.dataset.theme = t; } catch {}
  document.getElementById('themeBtn').onclick = () => {
    const n = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = n;
    try { localStorage.setItem('pb_theme', n); } catch {}
  };
})();

/* ---------- router ---------- */
async function route() {
  clearInterval(timerId);
  if (window.__cleanup) { window.__cleanup(); window.__cleanup = null; }
  document.getElementById('modal').hidden = true;
  window.scrollTo(0, 0);
  const [path, qs] = location.hash.replace(/^#\/?/, '').split('?');
  const seg = path.split('/').filter(Boolean);
  const P = new URLSearchParams(qs || '');
  try {
    if (!INDEX) INDEX = await loadAll();
    updateWrongBadge();
    if (!seg.length) return await viewHome();
    if (seg[0] === 'c' && seg[1] && !seg[2]) return await viewCollection(seg[1]);
    if (seg[0] === 'c' && seg[2] === 's' && seg[3]) return await viewSubsection(seg[1], seg[3]);
    if (seg[0] === 'exam' && seg[1]) {
      const only = P.get('only') === 'wrong';
      return await viewExam(seg[1], P.get('mode') || (only ? 'practice' : 'exam'), only);
    }
    if (seg[0] === 'mix' && seg[1]) return await viewExam('mix', P.get('mode') || 'exam', false, { paper: buildMix(seg[1], seg[2] || null, +P.get('n') || 20) });
    if (seg[0] === 'retake') return await viewExam('retake', P.get('mode') || 'practice', true);
    if (seg[0] === 'wrong') return await viewWrong();
    if (seg[0] === 'history') return await viewHistory();
    viewHome();
  } catch (e) {
    $app.innerHTML = `<div class="empty">⚠️ ${esc(e.message)}<br><br><a class="btn" href="#/">হোমে ফিরুন</a></div>`;
  }
}
window.addEventListener('hashchange', route);
route();

/* ---------- home (accordion) ---------- */
function setCard(c, s, st) {
  const best = bestOf(st.id), n = attemptsOf(st.id), w = wrongOfSet(st.id).length;
  return `
    <div class="xcard">
      <h4>${esc(st.title)}</h4>
      <div class="meta">${bn(st.questions || '?')} প্রশ্ন · ${bn(st.duration || 0)} মিনিট · নেগেটিভ ${fmt(st.negative ?? 0.5)}</div>
      <div>
        ${n ? `<span class="badge done">${bn(n)} বার · সর্বোচ্চ ${best > -Infinity ? fmt(best) : '–'}</span>` : '<span class="badge">নতুন</span>'}
        ${w ? `<span class="badge bad">❌ ${bn(w)} ভুল</span>` : ''}
      </div>
      <div class="btns">
        <a class="btn sm" href="#/exam/${st.id}">পরীক্ষা দিন</a>
        <a class="btn ghost sm" href="#/exam/${st.id}?mode=practice">প্র্যাকটিস</a>
        ${w ? `<a class="btn warn sm" href="#/exam/${st.id}?only=wrong">ভুলগুলো আবার</a>` : ''}
      </div>
    </div>`;
}

function viewHome() {
  const wc = wrongCount();
  $app.innerHTML = `
    <div class="hero">
      <h2>${esc(INDEX.siteTitle || 'প্রশ্নভান্ডার')}</h2>
      <p>${esc(INDEX.tagline || '')}</p>
      <p class="hstat">মোট ${bn(INDEX.collections.reduce((n, c) => n + countSets(c), 0))} টি সেট · ${bn(INDEX.collections.reduce((n, c) => n + c.subsections.reduce((m, s) => m + s.sets.reduce((k, t) => k + t.questions, 0), 0), 0))} টি প্রশ্ন</p>
    </div>
    ${WARN.length ? `<details class="warnbox"><summary>⚠️ ডেটা ফাইলে ${bn(WARN.length)} টি সমস্যা পাওয়া গেছে (দেখুন)</summary><ul>${WARN.map(w => `<li>${esc(w)}</li>`).join('')}</ul></details>` : ''}
    ${wc ? `
    <div class="wrongbanner">
      <div><b>❌ আপনার ${bn(wc)} টি প্রশ্ন ভুল হয়েছে</b><br><span class="muted">সঠিক উত্তর দিলে তালিকা থেকে নিজে থেকেই বাদ যাবে।</span></div>
      <div class="btns"><a class="btn warn" href="#/retake">সব ভুল আবার দিন</a><a class="btn ghost" href="#/wrong">ভুলের খাতা</a></div>
    </div>` : ''}
    <input class="search" id="q" placeholder="🔍 সেট বা বিষয় খুঁজুন…">
    <label class="chk"><input type="checkbox" id="shufChk" ${prefs().shuffle ? 'checked' : ''}> 🔀 প্রশ্ন ও অপশন এলোমেলো (শাফল) করে দিন</label>
    <div id="acc" class="acc">
      ${INDEX.collections.map(c => `
        <section class="acc-item ${openCols[c.id] ? 'open' : ''}" data-id="${c.id}">
          <button class="acc-head" type="button">
            <span class="ico">${c.icon || '📁'}</span>
            <span class="tx"><b>${esc(c.title)}</b><small>${esc(c.desc || '')}</small></span>
            <span class="badge">${bn(countSets(c))} টি সেট</span>
            <span class="arrow">▼</span>
          </button>
          <div class="acc-body"><div class="acc-inner">
            ${countSets(c) ? `<div class="mixbar">🎲 পুরো কালেকশন থেকে র‍্যান্ডম মিক্স: ${[10, 20, 50].map(n => `<a class="mixlink" href="#/mix/${c.id}?n=${n}">${bn(n)} প্রশ্ন</a>`).join('')}</div>` : ''}
            ${c.subsections.map(s => `
              <div class="sub">
                <h3>${s.icon || '🗂️'} ${esc(s.title)} <small>${esc(s.desc || '')}</small>
                  ${s.sets.length ? `<a class="mixlink" href="#/mix/${c.id}/${s.id}?n=20">🎲 মিক্স ${bn(20)}</a>` : ''}</h3>
                ${s.sets.length ? `<div class="xgrid">${s.sets.map(st => setCard(c, s, st)).join('')}</div>` : '<p class="muted small">এখনো কোনো সেট নেই</p>'}
              </div>`).join('')}
          </div></div>
        </section>`).join('')}
    </div>
    <div id="sr"></div>`;

  document.querySelectorAll('.acc-head').forEach(h => h.onclick = () => {
    const it = h.parentElement, id = it.dataset.id;
    openCols[id] = !openCols[id];
    it.classList.toggle('open', openCols[id]);
  });
  document.getElementById('shufChk').onchange = e => setPref('shuffle', e.target.checked);
  const q = document.getElementById('q'), sr = document.getElementById('sr'), acc = document.getElementById('acc');
  q.oninput = () => {
    const t = q.value.trim().toLowerCase();
    sr.innerHTML = ''; acc.hidden = !!t;
    if (!t) return;
    const hits = [];
    INDEX.collections.forEach(c => c.subsections.forEach(s => s.sets.forEach(st => {
      if ((st.title + s.title + c.title).toLowerCase().includes(t)) hits.push(setCard(c, s, st));
    })));
    sr.innerHTML = hits.length ? `<div class="xgrid" style="margin-top:14px">${hits.join('')}</div>` : '<div class="empty">কিছু পাওয়া যায়নি</div>';
  };
}

function viewCollection(cid) {
  openCols[cid] = true; location.replace('#/');
}
function viewSubsection(cid) {
  openCols[cid] = true; location.replace('#/');
}

/* ---------- ভুলের খাতা ---------- */
async function viewWrong() {
  const W = getWrong(), bySet = {};
  Object.values(W).forEach(w => (bySet[w.setId] ||= []).push(w));
  const ids = Object.keys(bySet);
  if (!ids.length) {
    $app.innerHTML = `${crumbs([{ t: 'হোম', h: '#/' }, { t: 'ভুলের খাতা' }])}<div class="empty">🎉 কোনো ভুল প্রশ্ন জমা নেই!<br><br><a class="btn" href="#/">হোমে ফিরুন</a></div>`;
    return;
  }
  $app.innerHTML = `${crumbs([{ t: 'হোম', h: '#/' }, { t: 'ভুলের খাতা' }])}<p class="muted">লোড হচ্ছে…</p>`;
  let html = `${crumbs([{ t: 'হোম', h: '#/' }, { t: 'ভুলের খাতা' }])}
    <h2 class="title">❌ ভুলের খাতা (${bn(wrongCount())} টি)</h2>
    <div class="btns" style="margin:10px 0 4px">
      <a class="btn warn" href="#/retake">সব ভুল একসাথে দিন</a>
      <button class="btn gray sm" id="clrW">খাতা খালি করুন</button>
    </div>`;
  for (const id of ids) {
    const meta = findSet(id);
    if (!meta) continue;
    const data = meta.st.data;
    html += `<div class="setrow" style="display:block"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center">
        <h3>${esc(meta.st.title)} <span class="badge bad">${bn(bySet[id].length)} ভুল</span></h3>
        <a class="btn warn sm" href="#/exam/${id}?only=wrong">এই সেটের ভুলগুলো দিন</a></div>
      ${bySet[id].sort((a, b) => a.idx - b.idx).map(w => {
        const q = data.questions[w.idx]; if (!q) return '';
        return `<div class="wq"><div><b>${bn(w.idx + 1)}.</b> ${esc(q.q)}</div>
          <div class="ca">✅ ${LABELS[q.a]}) ${esc(q.o[q.a])} <span class="muted small">· ${bn(w.times)} বার ভুল</span></div>
          ${q.e ? `<div class="expl">💡 ${esc(q.e)}</div>` : ''}</div>`;
      }).join('')}
    </div>`;
  }
  $app.innerHTML = html;
  document.getElementById('clrW').onclick = () => {
    if (confirm('ভুলের খাতা পুরোপুরি খালি করবেন?')) { lsSet(K_WRONG, {}); updateWrongBadge(); viewWrong(); }
  };
}

function viewHistory() {
  const rs = getResults();
  $app.innerHTML = `
    ${crumbs([{ t: 'হোম', h: '#/' }, { t: 'আমার ফলাফল' }])}
    <h2 class="title">আমার ফলাফল</h2>
    <div class="btns" style="margin:10px 0">
      <button class="btn ghost sm" id="bk">⬇ ব্যাকআপ নামান</button>
      <label class="btn ghost sm" style="cursor:pointer">⬆ ব্যাকআপ ফেরত দিন<input type="file" id="rs" accept=".json" hidden></label>
    </div>
    <p class="muted small">ফলাফল ও ভুলের খাতা শুধু এই ব্রাউজারে থাকে। ফোন/পিসি বদলালে ব্যাকআপ ফাইল দিয়ে ফেরত আনুন।</p>
    ${rs.length ? `
    <div class="tw"><table class="t"><thead><tr><th>তারিখ</th><th>সেট</th><th>ধরন</th><th>সঠিক</th><th>ভুল</th><th>স্কোর</th></tr></thead><tbody>
      ${rs.map(r => `<tr>
        <td>${bn(new Date(r.at).toLocaleString('bn-BD'))}</td>
        <td>${esc(r.title)}</td><td>${r.mode === 'exam' ? 'পরীক্ষা' : 'প্র্যাকটিস'}</td>
        <td>${bn(r.correct)}</td><td>${bn(r.wrong)}</td>
        <td><b>${fmt(r.score)}</b> / ${bn(r.full)}</td></tr>`).join('')}
    </tbody></table></div>
    <div class="btns" style="margin-top:14px"><button class="btn gray sm" id="clr">সব ফলাফল মুছুন</button></div>`
      : '<div class="empty">এখনো কোনো পরীক্ষা দেননি।</div>'}`;
  document.getElementById('bk').onclick = () => {
    const blob = new Blob([JSON.stringify({ v: 1, results: getResults(), wrong: getWrong() })], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'proshnobhandar-backup-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
  };
  document.getElementById('rs').onchange = async e => {
    try {
      const d = JSON.parse(await e.target.files[0].text());
      const seen = new Set(getResults().map(r => r.at));
      lsSet(K_RES, [...getResults(), ...(d.results || []).filter(r => !seen.has(r.at))].sort((a, b) => b.at - a.at).slice(0, 300));
      const W = getWrong();
      Object.entries(d.wrong || {}).forEach(([k, v]) => { if (!W[k] || W[k].times < v.times) W[k] = v; });
      lsSet(K_WRONG, W); updateWrongBadge(); alert('ব্যাকআপ ফেরত এসেছে ✔'); viewHistory();
    } catch { alert('ফাইলটি পড়া যায়নি'); }
  };
  const b = document.getElementById('clr');
  if (b) b.onclick = () => { if (confirm('সব ফলাফল মুছে ফেলবেন?')) { lsSet(K_RES, []); viewHistory(); } };
}

/* ---------- paper builder ---------- */
async function buildPaper(setId, onlyWrong) {
  if (setId === 'retake') {
    const bySet = {};
    Object.values(getWrong()).forEach(w => (bySet[w.setId] ||= []).push(w));
    const qs = [];
    for (const id of Object.keys(bySet)) {
      const meta = findSet(id); if (!meta) continue;
      const data = meta.st.data;
      bySet[id].sort((a, b) => a.idx - b.idx).forEach(w => data.questions[w.idx] &&
        qs.push({ ...data.questions[w.idx], setId: id, idx: w.idx }));
    }
    if (!qs.length) throw new Error('ভুল প্রশ্নের তালিকা খালি – সবগুলো ঠিক হয়ে গেছে 🎉');
    const fin = prefs().shuffle ? shuf(qs).map(shuffleQ) : qs;
    return { saveId: 'retake', title: 'ভুল প্রশ্নের পুনরায় পরীক্ষা', neg: 0.5, duration: 0, qs: fin, trail: [{ t: 'ভুলের খাতা', h: '#/wrong' }, { t: 'পুনরায় পরীক্ষা' }], meta: null };
  }
  const meta = findSet(setId);
  if (!meta) throw new Error('সেট পাওয়া যায়নি');
  const data = meta.st.data;
  let qs = data.questions.map((q, idx) => ({ ...q, setId, idx }));
  const total = qs.length;
  if (onlyWrong) {
    const bad = new Set(wrongOfSet(setId).map(w => w.idx));
    qs = qs.filter(q => bad.has(q.idx));
    if (!qs.length) throw new Error('এই সেটে কোনো ভুল প্রশ্ন জমা নেই 🎉');
  }
  if (prefs().shuffle) qs = shuf(qs).map(shuffleQ);
  const dur = (data.duration ?? meta.st.duration ?? 0);
  return {
    saveId: onlyWrong ? setId + ':wrong' : setId,
    title: (data.title || meta.st.title) + (onlyWrong ? ' – ভুলগুলো' : ''),
    neg: data.negative ?? meta.st.negative ?? 0.5,
    duration: onlyWrong ? 0 : dur * 60,
    qs, meta,
    trail: [{ t: meta.c.title, h: '#/' }, { t: meta.s.title, h: '#/' }, { t: meta.st.title }]
  };
}

async function buildMix(cid, sid, n) {
  const c = INDEX.collections.find(x => x.id === cid);
  if (!c) throw new Error('কালেকশন পাওয়া যায়নি');
  const subs = sid ? c.subsections.filter(x => x.id === sid) : c.subsections;
  const pool = [];
  subs.forEach(sb => sb.sets.forEach(st => st.data.questions.forEach((q, idx) => pool.push({ ...q, setId: st.id, idx }))));
  if (!pool.length) throw new Error('এখানে এখনো কোনো প্রশ্ন যোগ হয়নি');
  let qs = shuf(pool).slice(0, n);
  if (prefs().shuffle) qs = qs.map(shuffleQ);
  return {
    saveId: 'mix:' + cid + (sid ? '.' + sid : ''), neg: 0.5, duration: qs.length * 40, qs, meta: null,
    title: `🎲 র‍্যান্ডম মিক্স – ${c.title}${sid && subs[0] ? ' › ' + subs[0].title : ''}`,
    trail: [{ t: c.title, h: '#/' }, { t: 'র‍্যান্ডম মিক্স' }]
  };
}

/* ---------- exam ---------- */
async function viewExam(setId, mode, onlyWrong, opts = {}) {
  const paper = await (opts.paper || buildPaper(setId, onlyWrong));
  const Q = paper.qs, total = Q.length, neg = paper.neg, full = total;
  const isExam = mode === 'exam';
  const P = prefs();
  const ans = {}, flagged = new Set();
  let finished = false, left = paper.duration, cur = 0, view = P.view;
  document.documentElement.style.setProperty('--fs', P.fs + 'px');

  $app.innerHTML = `
    ${crumbs([{ t: 'হোম', h: '#/' }, ...paper.trail])}
    <div class="exam-head">
      <h1>${esc(paper.title)}</h1>
      <div class="exam-meta"><span>${isExam ? '🧪 পরীক্ষা মোড' : '📖 প্র্যাকটিস মোড'}</span><span>পূর্ণমান: ${bn(full)}</span><span>প্রশ্ন: ${bn(total)}</span><span>নেগেটিভ: ${fmt(neg)}</span></div>
    </div>
    <div class="sticky">
      <span>উত্তর: <b id="cnt">${bn(0)}</b>/${bn(total)}</span>
      ${isExam && paper.duration ? `<span class="timer" id="tm">⏱ ${mmss(left)}</span>` : ''}
      <span class="tools">
        <button class="ib" id="fsM" title="ছোট">A−</button><button class="ib" id="fsP" title="বড়">A+</button>
        <button class="ib" id="vw" title="ভিউ বদল"></button>
        <button class="btn sm" id="subTop">সাবমিট</button>
      </span>
    </div>
    <div class="pbar"><div id="pb"></div></div>
    <div class="qbody">
      <div id="qs" class="qs">
        ${Q.map((q, i) => `
          <div class="q" id="q${i}">
            <button class="flag" data-f="${i}" title="পরে দেখব">🚩</button>
            <div class="q-title">${bn(i + 1)}. ${esc(q.q)}</div>
            <div class="opts">
              ${q.o.map((o, k) => `
                <label class="opt" id="o${i}_${k}">
                  <input type="radio" name="q${i}" value="${k}">
                  <span class="lb">${LABELS[k]}</span><span>${esc(o)}</span>
                </label>`).join('')}
            </div>
            ${isExam ? `<button class="clr" data-c="${i}" hidden>উত্তর মুছুন</button>` : ''}
            <div class="expl" id="e${i}" hidden></div>
          </div>`).join('')}
      </div>
      <div class="nav" id="nav">
        <button class="btn ghost" id="prev">← আগের</button>
        <span class="muted small" id="pos"></span>
        <button class="btn" id="next">পরের →</button>
      </div>
      <div class="palette"><h4>প্রশ্ন গ্রিড <span class="muted small">(কিবোর্ড: ১–৪ বা a–d উত্তর, ← → নেভিগেশন)</span></h4>
        <div class="pgrid">${Q.map((_, i) => `<button class="pb" id="p${i}" data-g="${i}">${bn(i + 1)}</button>`).join('')}</div>
      </div>
      <div class="submit"><button class="btn" id="subBtn">${isExam ? 'পরীক্ষা সাবমিট করুন' : 'শেষ করে ফলাফল দেখুন'}</button></div>
    </div>`;

  const $ = id => document.getElementById(id);
  const qs = $('qs');

  /* view helpers */
  function applyView() {
    qs.classList.toggle('focus', view === 'focus' && !finished);
    $('nav').hidden = !(view === 'focus' && !finished);
    $('vw').textContent = view === 'focus' ? '☰ সব একসাথে' : '▭ একটা একটা';
    Q.forEach((_, i) => $('q' + i).classList.toggle('cur', i === cur));
    $('pos').textContent = `${bn(cur + 1)} / ${bn(total)}`;
    $('prev').disabled = cur === 0;
    $('next').disabled = cur === total - 1;
    document.querySelectorAll('.pb').forEach((b, i) => b.classList.toggle('now', view === 'focus' && !finished && i === cur));
  }
  function go(i) {
    cur = Math.max(0, Math.min(total - 1, i));
    applyView();
    if (view === 'focus' && !finished) window.scrollTo({ top: qs.getBoundingClientRect().top + scrollY - 120, behavior: 'smooth' });
    else $('q' + cur).scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function upd() {
    const n = Object.keys(ans).length;
    $('cnt').textContent = bn(n);
    $('pb').style.width = (n / total * 100) + '%';
  }
  function showExpl(i) {
    if (!Q[i].e) return;
    const el = $('e' + i); el.hidden = false; el.textContent = '💡 ' + Q[i].e;
  }

  /* answering */
  function choose(i, k) {
    if (finished) return;
    if (!isExam && ans[i] !== undefined) return;
    ans[i] = k;
    const p = $('p' + i);
    document.querySelectorAll(`#q${i} .opt`).forEach(l => l.classList.remove('sel'));
    $(`o${i}_${k}`).classList.add('sel');
    $(`o${i}_${k}`).querySelector('input').checked = true;
    p.classList.add('ans');
    if (isExam) { const c = document.querySelector(`[data-c="${i}"]`); if (c) c.hidden = false; }
    if (!isExam) {                               // সাথে সাথে ফিডব্যাক
      const c = Q[i].a;
      document.querySelectorAll(`input[name=q${i}]`).forEach(r => r.disabled = true);
      document.querySelectorAll(`#q${i} .opt`).forEach(l => l.classList.add('locked'));
      $(`o${i}_${c}`).classList.add('ok');
      p.classList.remove('ans');
      if (k === c) p.classList.add('ok');
      else { $(`o${i}_${k}`).classList.add('bad', 'flash'); p.classList.add('bad'); }
      showExpl(i);
      if (view === 'focus' && i < total - 1) $('next').classList.add('pulse');
    }
    upd();
  }
  const onChange = e => {
    if (!e.target.matches('input[type=radio]')) return;
    choose(+e.target.name.slice(1), +e.target.value);
  };
  $app.addEventListener('change', onChange);

  const onKey = e => {
    if (e.ctrlKey || e.metaKey || e.altKey || /INPUT|TEXTAREA/.test(e.target.tagName) && e.target.type !== 'radio') return;
    if (!$('modal').hidden) return;
    const k = e.key.toLowerCase();
    if (e.key === 'ArrowRight' || k === 'n') { go(cur + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' || k === 'p') { go(cur - 1); e.preventDefault(); }
    else if (!finished && view === 'focus') {
      const idx = '1234'.indexOf(k) >= 0 ? '1234'.indexOf(k) : 'abcd'.indexOf(k);
      if (k.length === 1 && idx >= 0) { choose(cur, idx); e.preventDefault(); }
      else if (e.key === 'Enter' && !isExam && ans[cur] !== undefined) go(cur + 1);
    }
  };
  document.addEventListener('keydown', onKey);
  window.__cleanup = () => {
    $app.removeEventListener('change', onChange);
    document.removeEventListener('keydown', onKey);
  };

  /* buttons */
  $('prev').onclick = () => { $('next').classList.remove('pulse'); go(cur - 1); };
  $('next').onclick = () => { $('next').classList.remove('pulse'); go(cur + 1); };
  $('vw').onclick = () => { view = view === 'focus' ? 'list' : 'focus'; setPref('view', view); applyView(); go(cur); };
  $('fsP').onclick = () => { const n = Math.min(24, prefs().fs + 2); setPref('fs', n); document.documentElement.style.setProperty('--fs', n + 'px'); };
  $('fsM').onclick = () => { const n = Math.max(13, prefs().fs - 2); setPref('fs', n); document.documentElement.style.setProperty('--fs', n + 'px'); };
  document.querySelectorAll('[data-g]').forEach(b => b.onclick = () => go(+b.dataset.g));
  document.querySelectorAll('[data-f]').forEach(b => b.onclick = () => {
    const i = +b.dataset.f;
    flagged.has(i) ? flagged.delete(i) : flagged.add(i);
    b.classList.toggle('on', flagged.has(i));
    $('p' + i).classList.toggle('mark', flagged.has(i));
  });
  document.querySelectorAll('[data-c]').forEach(b => b.onclick = () => {
    const i = +b.dataset.c; delete ans[i];
    document.querySelectorAll(`input[name=q${i}]`).forEach(r => r.checked = false);
    document.querySelectorAll(`#q${i} .opt`).forEach(l => l.classList.remove('sel'));
    $('p' + i).classList.remove('ans'); b.hidden = true; upd();
  });
  const submit = auto => {
    if (finished) return;
    const un = total - Object.keys(ans).length;
    if (!auto && un && !confirm(`${bn(un)} টি প্রশ্নের উত্তর দেওয়া হয়নি। সাবমিট করবেন?`)) return;
    finish();
  };
  $('subBtn').onclick = $('subTop').onclick = () => submit(false);

  if (isExam && paper.duration) {
    timerId = setInterval(() => {
      left--;
      const t = $('tm'); if (!t) return clearInterval(timerId);
      t.textContent = '⏱ ' + mmss(Math.max(left, 0));
      t.classList.toggle('low', left <= 60);
      if (left <= 0) { clearInterval(timerId); alert('সময় শেষ! পরীক্ষা জমা হচ্ছে।'); submit(true); }
    }, 1000);
  }

  /* finish + ভুলের খাতা আপডেট */
  function finish() {
    finished = true; clearInterval(timerId);
    let correct = 0, wrong = 0, fixed = 0, newWrong = 0;
    const W = getWrong();
    Q.forEach((q, i) => {
      if (ans[i] === undefined) return;
      const key = q.setId + '#' + q.idx;
      if (ans[i] === q.a) {
        correct++;
        if (W[key]) { delete W[key]; fixed++; }          // ঠিক হলে খাতা থেকে বাদ
      } else {
        wrong++;
        if (W[key]) { W[key].times++; W[key].at = Date.now(); }
        else { W[key] = { setId: q.setId, idx: q.idx, times: 1, at: Date.now() }; newWrong++; }
      }
    });
    lsSet(K_WRONG, W); updateWrongBadge();
    const score = correct - wrong * neg, unans = total - correct - wrong;
    saveResult({ setId: paper.saveId, title: paper.title, mode, at: Date.now(), correct, wrong, unans, score, full });

    Q.forEach((q, i) => {
      document.querySelectorAll(`input[name=q${i}]`).forEach(r => r.disabled = true);
      document.querySelectorAll(`#q${i} .opt`).forEach(l => l.classList.add('locked', 'rv'));
      $(`o${i}_${q.a}`).classList.add('ok');
      const p = $('p' + i); p.classList.remove('ans');
      if (ans[i] === undefined) p.classList.add('skip');
      else if (ans[i] === q.a) p.classList.add('ok');
      else { $(`o${i}_${ans[i]}`).classList.add('bad'); p.classList.add('bad'); }
      showExpl(i);
    });
    document.querySelectorAll('.clr').forEach(b => b.hidden = true);
    upd(); applyView();

    const pct = Math.max(0, score / full * 100);
    const grade = pct >= 80 ? '🏆 চমৎকার!' : pct >= 60 ? '👍 ভালো হয়েছে' : pct >= 40 ? '🙂 আরও অনুশীলন দরকার' : '📚 আবার চেষ্টা করুন';
    const nx = paper.meta ? nextSet(setId) : null;
    const wl = paper.meta ? wrongOfSet(setId).length : wrongCount();
    const retry = paper.meta ? `#/exam/${setId}?only=wrong` : '#/retake';
    $('modalBox').innerHTML = `
      <h3 style="text-align:center">পরীক্ষার ফলাফল</h3>
      <div class="score-big">${fmt(score)} <small>/ ${bn(full)}</small></div>
      <p style="text-align:center">${grade} (${bn(Math.round(pct))}%)</p>
      <div class="stats">
        <div class="stat"><b>${bn(correct + wrong)}</b>উত্তর দিয়েছেন</div>
        <div class="stat g"><b>${bn(correct)}</b>সঠিক</div>
        <div class="stat r"><b>${bn(wrong)}</b>ভুল (−${fmt(wrong * neg)})</div>
        <div class="stat y"><b>${bn(unans)}</b>উত্তরহীন</div>
      </div>
      ${fixed ? `<p class="note ok">🎉 ${bn(fixed)} টি আগের ভুল এবার ঠিক হয়েছে — ভুলের খাতা থেকে বাদ গেছে।</p>` : ''}
      ${newWrong ? `<p class="note bad">📝 ${bn(newWrong)} টি নতুন ভুল ভুলের খাতায় জমা হয়েছে।</p>` : ''}
      <div class="btns" style="justify-content:center;margin-top:12px">
        ${wl ? `<a class="btn warn" href="${retry}">❌ ভুলগুলো আবার দিন (${bn(wl)})</a>` : ''}
        <button class="btn ghost sm" id="rv">উত্তর রিভিউ</button>
        ${paper.meta && !onlyWrong ? `<button class="btn ghost sm" id="again">আবার দিন</button>` : ''}
        ${nx ? `<a class="btn sm" href="#/exam/${nx.id}">পরের সেট →</a>` : `<a class="btn sm" href="#/">হোম</a>`}
      </div>`;
    const m = $('modal'); m.hidden = false;
    const ag = $('again'); if (ag) ag.onclick = () => route();
    $('rv').onclick = () => { m.hidden = true; window.scrollTo({ top: 0, behavior: 'smooth' }); };
    m.onclick = e => { if (e.target === m) m.hidden = true; };
  }

  applyView();
}
