/* قالب عيادة أسنان — واجهة، لغتان، حجز عبر واتساب، وسنّ ثلاثي الأبعاد يُحمَّل ويُفكَّك حسب الظهور */
import { CONFIG, SERVICE_IDS, DOCTOR_IDS, T } from './content.js';

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = { get(k, d) { try { return localStorage.getItem(k) ?? d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* خاص/محجوب */ } } };
document.documentElement.classList.add('js');

/* ------------------------------------------------ أيقونات (خطوط 24px) */
const I = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const TOOTH = 'M12 5.2c-1.7-1.7-5.6-1.5-6.3 2-.5 2.5.9 4 1.3 6.3.4 2.1.6 4.5 2 4.5 1.1 0 1.2-2.8 1.7-4.2.3-.9.9-.9 1.2 0 .5 1.4.6 4.2 1.7 4.2 1.4 0 1.6-2.4 2-4.5.4-2.3 1.8-3.8 1.3-6.3-.7-3.5-4.6-3.7-6.3-2z';
const ICONS = {
  check: I('<circle cx="10.5" cy="10.5" r="6.2"/><path d="M15.2 15.2L20.5 20.5M8 10.6l1.8 1.8 3.2-3.4"/>'),
  whitening: I('<path d="M11 3l1.9 4.9 4.9 1.9-4.9 1.9L11 16.6 9.1 11.7 4.2 9.8l4.9-1.9z"/><path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>'),
  implant: I('<path d="M7 3.5h10l-1.1 5.2H8.1z"/><path d="M9 11.2h6M9.5 14h5M10 16.8h4M11 19.6h2"/>'),
  braces: I('<rect x="2.8" y="8.8" width="5.4" height="6.4" rx="1.6"/><rect x="9.3" y="8.8" width="5.4" height="6.4" rx="1.6"/><rect x="15.8" y="8.8" width="5.4" height="6.4" rx="1.6"/><path d="M2.8 12h18.4"/>'),
  root: I(`<path d="${TOOTH}"/><path d="M12 12.5v6.5"/>`),
  veneer: I('<path d="M12 3l7 3v5.2c0 4.8-2.9 8.2-7 9.8-4.1-1.6-7-5-7-9.8V6z"/><path d="M9 12l2.2 2.2L15.2 10"/>'),
  kids: I('<circle cx="12" cy="12" r="9"/><path d="M8.4 14.2c1 1.6 2.2 2.4 3.6 2.4s2.6-.8 3.6-2.4"/><circle cx="9" cy="10" r=".9" fill="currentColor"/><circle cx="15" cy="10" r=".9" fill="currentColor"/>'),
  emergency: I('<circle cx="12" cy="12" r="9"/><path d="M12 7.6v8.8M7.6 12h8.8"/>'),
  pin: I('<path d="M12 21s7-6.2 7-11.2A7 7 0 0 0 5 9.8C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.4"/>'),
  clock: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5.4l3.4 2"/>'),
  phone: I('<path d="M5 4h4l1.6 4.2-2.3 1.5a11 11 0 0 0 5.9 5.9l1.5-2.3L20 14.9V19a2 2 0 0 1-2 2A15.5 15.5 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
  chat: I('<path d="M4 20l1.4-4.1A8.5 8.5 0 1 1 8.2 18.7z"/><path d="M9 10.2c.4 2 2.3 3.9 4.4 4.5l1.3-1.2-1.7-1-.9.6c-.8-.3-1.5-1-1.8-1.8l.6-.9-1-1.7z"/>'),
  cal: I('<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>')
};

/* ------------------------------------------------ صور رمزية للأطباء (رسوم، لا صور أشخاص حقيقيين) */
const AV = {
  layla: { skin: '#f0c7a3', hair: '#2a1a14', bg: ['#d7f5ef', '#9fe0d6'], style: 'long' },
  omar: { skin: '#dfae88', hair: '#1c1c1f', bg: ['#e0f1fb', '#a9d6ee'], style: 'short' },
  sara: { skin: '#f4d2b6', hair: '#5a3826', bg: ['#fdeedd', '#f8cfa6'], style: 'bun' }
};
function avatar(id) {
  const a = AV[id] || AV.layla, g = `av-${id}`;
  const hair = a.style === 'long' ? `<path d="M37 56c-4-26 9-38 23-38s27 12 23 38c-1-10-6-18-23-18S38 46 37 56z" fill="${a.hair}"/><path d="M37 54c-4 16-3 30 4 38l5-7c-3-9-3-19-2-31z" fill="${a.hair}"/><path d="M83 54c4 16 3 30-4 38l-5-7c3-9 3-19 2-31z" fill="${a.hair}"/>`
    : a.style === 'bun' ? `<circle cx="60" cy="22" r="10" fill="${a.hair}"/><path d="M38 55c-3-24 9-34 22-34s25 10 22 34c-2-10-8-16-22-16S40 45 38 55z" fill="${a.hair}"/>`
      : `<path d="M39 52c-3-20 8-31 21-31s24 11 21 31c-2-8-7-13-21-13S41 44 39 52z" fill="${a.hair}"/><path d="M42 60c2 12 8 20 18 20s16-8 18-20c-4 6-9 8-18 8s-14-2-18-8z" fill="${a.hair}" opacity=".9"/>`;
  return `<svg viewBox="0 0 120 120" role="img" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a.bg[0]}"/><stop offset="1" stop-color="${a.bg[1]}"/></linearGradient></defs><rect width="120" height="120" fill="url(#${g})"/><path d="M10 124c2-28 21-40 50-40s48 12 50 40z" fill="#fff"/><path d="M45 86l15 19 15-19z" fill="#cfeee9"/><rect x="51" y="66" width="18" height="22" rx="7" fill="${a.skin}"/><ellipse cx="60" cy="52" rx="19" ry="22" fill="${a.skin}"/>${hair}<circle cx="53" cy="53" r="1.7" fill="#2a1a14"/><circle cx="67" cy="53" r="1.7" fill="#2a1a14"/><path d="M54 62c2 2.6 10 2.6 12 0" fill="none" stroke="#b5654f" stroke-width="2" stroke-linecap="round"/></svg>`;
}

/* ------------------------------------------------ الحالة واللغة */
let lang = 'ar';
const params = new URLSearchParams(location.search);
{ const q = params.get('lang'), s = store.get('mc-lang', ''); lang = T[q] ? q : T[s] ? s : CONFIG.DEFAULT_LANG; }
const L = () => T[lang];

function waLink(text) { return `https://wa.me/${CONFIG.WA_NUMBER || ''}?text=${encodeURIComponent(text)}`; }

function renderAll() {
  const t = L(), html = document.documentElement;
  html.lang = t.lang; html.dir = t.dir; document.title = t.title;
  const md = $('meta[name="description"]'); md && (md.content = t.desc);
  $('#skip').textContent = t.skip;
  { const cv = $('#toothCanvas'); cv && cv.setAttribute('aria-label', lang === 'ar' ? 'سنّ ثلاثي الأبعاد' : '3D tooth'); }
  $('#brandName').textContent = t.brand; $('#brandSub').textContent = t.brandSub;
  $('#nav').innerHTML = ['services', 'steps', 'doctors', 'faq', 'book'].map((k) => `<a href="#${k}" data-k="${k}">${esc(t.nav[k])}</a>`).join('');
  $('#lang').textContent = t.switchTo; $('#lang').setAttribute('aria-label', t.switchTo);
  $('#hdrCta').textContent = t.cta; $('#burger').setAttribute('aria-label', t.menu);
  // البطل
  const h = t.hero;
  $('#hKicker').textContent = h.kicker; $('#h1a').textContent = h.h1a; $('#h1b').textContent = h.h1b; $('#hSub').textContent = h.sub;
  $('#hCta').textContent = t.cta; $('#hCta2').textContent = h.cta2; $('#chip1').textContent = h.chip1; $('#chip2').textContent = h.chip2;
  $('#hPoints').innerHTML = h.points.map((p) => `<li>${esc(p)}</li>`).join('');
  // الخدمات
  $('#sKicker').textContent = t.services.kicker; $('#sH2').textContent = t.services.h2;
  $('#sGrid').innerHTML = SERVICE_IDS.map((id, i) => { const [n, d] = t.services.items[id]; return `<a class="card rv" style="--d:${(i % 4) * .06}s" href="#book" data-svc="${id}"><span class="ico">${ICONS[id]}</span><h3>${esc(n)}</h3><p>${esc(d)}</p><span class="more">${esc(t.services.book)}</span></a>`; }).join('');
  // الخطوات
  $('#stKicker').textContent = t.steps.kicker; $('#stH2').textContent = t.steps.h2;
  $('#stList').innerHTML = t.steps.items.map(([n, d], i) => `<li class="rv" style="--d:${i * .07}s"><h3>${esc(n)}</h3><p>${esc(d)}</p></li>`).join('');
  // الأطباء
  $('#dKicker').textContent = t.doctors.kicker; $('#dH2').textContent = t.doctors.h2;
  $('#dGrid').innerHTML = DOCTOR_IDS.map((id, i) => { const [n, r] = t.doctors.items[id]; return `<article class="doc rv" style="--d:${i * .08}s"><div class="avatar">${avatar(id)}</div><h3>${esc(n)}</h3><p class="role">${esc(r)}</p><p class="langs">${esc(t.doctors.langs)}</p><a class="btn btn-sm btn-ghost" href="#book" data-doc="${id}">${esc(t.doctors.bookWith)} ${esc(n)}</a></article>`; }).join('');
  // الأسئلة
  $('#fKicker').textContent = t.faq.kicker; $('#fH2').textContent = t.faq.h2;
  $('#fList').innerHTML = t.faq.items.map(([q, a]) => `<details class="rv"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
  $('#fNote').textContent = t.faq.note;
  renderBook();
  // التذييل والشريط
  $('#fBrand').textContent = `${CONFIG.BRAND} · ${t.brandSub}`; $('#fTag').textContent = t.footer.tag;
  $('#fCredit').textContent = `© ${CONFIG.YEAR} ${CONFIG.BRAND}. ${t.footer.rights}. ${t.footer.credit} ${CONFIG.CREDIT}.`;
  renderBar();
  observeReveal();
}

function renderBook() {
  const t = L(), b = t.book, v = t.visit;
  $('#bKicker').textContent = b.kicker; $('#bH2').textContent = b.h2; $('#bLead').textContent = b.lead;
  const row = (ic, k, val) => `<div class="visit-row"><span class="vi">${ICONS[ic]}</span><div><small>${esc(k)}</small>${val}</div></div>`;
  $('#visit').innerHTML = row('pin', v.address, `<b>${esc(v.addressV)}</b>`) + row('clock', v.hours, `<b>${esc(v.hoursV)}</b>`)
    + (CONFIG.PHONE ? row('phone', v.phone, `<a href="tel:${esc(CONFIG.PHONE)}"><b dir="ltr">${esc(CONFIG.PHONE_DISPLAY || CONFIG.PHONE)}</b></a>`) : '')
    + row('chat', v.whatsapp, `<a href="${waLink(t.wa.generic)}" target="_blank" rel="noopener"><b>${esc(v.waV)}</b></a>`);
  const svc = SERVICE_IDS.map((id) => `<option value="${id}">${esc(t.services.items[id][0])}</option>`).join('');
  const doc = DOCTOR_IDS.map((id) => `<option value="${id}">${esc(t.doctors.items[id][0])} — ${esc(t.doctors.items[id][1])}</option>`).join('');
  const times = b.times.map((x, i) => `<option value="${i}">${esc(x)}</option>`).join('');
  const f = $('#form'), keep = f.dataset.svc || '', keepDoc = f.dataset.doc || '';
  f.innerHTML = `
    <div class="field"><label for="fName">${esc(b.name)}</label><input id="fName" name="name" autocomplete="name" required><span class="err">${esc(b.errName)}</span></div>
    <div class="field"><label for="fPhone">${esc(b.phone)}</label><input id="fPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" required><span class="err">${esc(b.errPhone)}</span></div>
    <div class="field"><label for="fSvc">${esc(b.service)}</label><select id="fSvc" name="svc"><option value="">${esc(b.serviceAny)}</option>${svc}</select></div>
    <div class="field"><label for="fDoc">${esc(b.doctor)}</label><select id="fDoc" name="doc"><option value="">${esc(b.doctorAny)}</option>${doc}</select></div>
    <div class="field"><label for="fDate">${esc(b.date)}</label><input id="fDate" name="date" type="date" min="${new Date().toISOString().slice(0, 10)}"></div>
    <div class="field"><label for="fTime">${esc(b.time)}</label><select id="fTime" name="time">${times}</select></div>
    <div class="field full"><label for="fNote2">${esc(b.note)}</label><textarea id="fNote2" name="note"></textarea></div>
    <button class="btn full" type="submit" style="grid-column:1/-1">${ICONS.chat.replace('<svg ', '<svg width="22" height="22" ')} ${esc(b.send)}</button>
    <p class="priv">${esc(b.privacy)}</p>`;
  if (keep) $('#fSvc').value = keep; if (keepDoc) $('#fDoc').value = keepDoc;
}

function renderBar() {
  const t = L(), bar = $('#mbar');
  bar.innerHTML = `<a class="main" href="#book">${ICONS.cal} ${esc(t.bar.book)}</a><a href="${waLink(t.wa.generic)}" target="_blank" rel="noopener">${ICONS.chat} ${esc(t.bar.wa)}</a>` + (CONFIG.PHONE ? `<a href="tel:${esc(CONFIG.PHONE)}">${ICONS.phone} ${esc(t.bar.call)}</a>` : '');
}

/* ------------------------------------------------ تفاعل */
function toast(m) { const e = $('#toast'); e.textContent = m; e.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('on'), 3400); }

$('#lang').addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar'; store.set('mc-lang', lang);
  const u = new URL(location.href); u.searchParams.set('lang', lang); history.replaceState(null, '', u);
  renderAll();
});
$('#burger').addEventListener('click', () => { const o = $('#nav').classList.toggle('open'); $('#burger').setAttribute('aria-expanded', String(o)); });
$('#nav').addEventListener('click', () => { $('#nav').classList.remove('open'); $('#burger').setAttribute('aria-expanded', 'false'); });
document.addEventListener('click', (e) => {   // تذكّر الخدمة/الطبيب المختارَين من البطاقات ثم عبّئ النموذج
  const a = e.target.closest('[data-svc],[data-doc]'); if (!a) return;
  const f = $('#form'); if (a.dataset.svc) { f.dataset.svc = a.dataset.svc; $('#fSvc').value = a.dataset.svc; } if (a.dataset.doc) { f.dataset.doc = a.dataset.doc; $('#fDoc').value = a.dataset.doc; }
});
$('#form').addEventListener('submit', (e) => {
  e.preventDefault(); const t = L(), f = e.currentTarget, v = (n) => f.elements[n].value.trim();
  const badName = v('name').length < 2, badPhone = v('phone').replace(/\D/g, '').length < 7;
  $('#fName').closest('.field').classList.toggle('bad', badName); $('#fPhone').closest('.field').classList.toggle('bad', badPhone);
  if (badName) { $('#fName').focus(); return; } if (badPhone) { $('#fPhone').focus(); return; }
  const w = t.wa, svc = v('svc') ? t.services.items[v('svc')][0] : '', doc = v('doc') ? t.doctors.items[v('doc')][0] : '';
  const lines = [w.hello, '', `${w.name}: ${v('name')}`, `${w.phone}: ${v('phone')}`];
  if (svc) lines.push(`${w.service}: ${svc}`); if (doc) lines.push(`${w.doctor}: ${doc}`); if (v('date')) lines.push(`${w.date}: ${v('date')}`);
  lines.push(`${w.time}: ${t.book.times[+v('time')]}`); if (v('note')) lines.push(`${w.note}: ${v('note')}`);
  const win = window.open(waLink(lines.join('\n')), '_blank', 'noopener'); if (!win) location.href = waLink(lines.join('\n'));
  toast(t.book.sent);
});

/* ظهور تدريجي (المحتوى مرئي دائماً إن تعطّل المراقب) */
let rvIO = null;
function observeReveal() {
  const els = $$('.rv:not(.in)'); if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  rvIO = rvIO || new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); rvIO.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  els.forEach((e) => rvIO.observe(e));
}
setTimeout(() => $$('.rv').forEach((e) => e.classList.add('in')), 4000);   // شبكة أمان

/* رأس ثابت، تمييز الرابط الحالي، وشريط الموبايل */
const hdr = $('#hdr'), mbar = $('#mbar'), book = $('#book');
function onScroll() {
  hdr.classList.toggle('scrolled', scrollY > 8);
  const bk = book.getBoundingClientRect(), nearBook = bk.top < innerHeight * .8 && bk.bottom > 0;
  mbar.classList.toggle('on', scrollY > 420 && !nearBook);
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) $$('#nav a').forEach((a) => a.classList.toggle('on', a.dataset.k === en.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  ['services', 'steps', 'doctors', 'faq', 'book'].forEach((id) => spy.observe($('#' + id)));
}

/* ------------------------------------------------ السنّ ثلاثي الأبعاد: يُبنى حين يقترب القسم ويُفكَّك بالكامل حين يبتعد */
const heroEl = $('.hero'), heroArt = $('#heroArt');
let tooth = null, building = false;
const saveData = navigator.connection && navigator.connection.saveData;
async function makeTooth() {
  if (tooth || building || saveData) return; building = true;
  try {
    const m = await import('./tooth3d.js');
    if (!inView) { building = false; return; }
    tooth = m.createTooth($('#toothCanvas'), heroArt);
    if (tooth) { heroArt.classList.add('ready'); tooth.wake(); }
  } catch (e) { /* يبقى الرسم الاحتياطي */ }
  building = false;
}
function killTooth() {
  if (!tooth) return; tooth.dispose(); tooth = null; heroArt.classList.remove('ready');
  const old = $('#toothCanvas'), nu = old.cloneNode(false); old.replaceWith(nu);   // سياق WebGL الجديد يحتاج عنصراً جديداً
}
let inView = true;
if ('IntersectionObserver' in window) {
  new IntersectionObserver((es) => { inView = es[0].isIntersecting; inView ? makeTooth() : killTooth(); }, { rootMargin: '500px 0px' }).observe(heroEl);
}

renderAll();
const idle = window.requestIdleCallback || ((f) => setTimeout(f, 250));
addEventListener('load', () => idle(() => makeTooth()));
window.__mc = { get tooth() { return tooth; }, get lang() { return lang; } };
