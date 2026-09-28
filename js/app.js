import { S, ui, A, IN, SHEETS, setRender, render, closeSheet, esc } from './core.js';
import { icon } from './ui.js';
import { onboarding, profileView } from './views/profile.js';
import { todayView } from './views/today.js';
import { trainView } from './views/train.js';
import { workoutView, miniBar } from './views/workout.js';
import { nutritionView } from './views/nutrition.js';
import { progressView } from './views/progress.js';
import './views/gym.js';
import { DEFAULT_WEEKDAYS } from './data/equipment.js';

// Migración: perfiles creados antes de planificar por días de la semana
if (S.profile && !S.profile.weekdays) {
  Object.assign(S.profile, { weekdays: DEFAULT_WEEKDAYS[S.profile.days] || DEFAULT_WEEKDAYS[4], sessionMin: 60, focus: [] });
}

const TABS = [
  ['hoy', 'Hoy', 'home', todayView],
  ['entrenar', 'Entrenar', 'dumbbell', trainView],
  ['nutricion', 'Nutrición', 'bowl', nutritionView],
  ['progreso', 'Progreso', 'chart', progressView],
  ['perfil', 'Perfil', 'user', profileView],
];

const root = document.getElementById('app');
const scrollMem = {};
let renderedSheets = 0;

// Hoja de confirmación genérica
SHEETS.confirm = (p) => ({
  title: p.title,
  body: p.text ? `<p class="muted">${esc(p.text)}</p>` : '',
  foot: `<div class="btn-row"><button class="btn ghost" data-a="closeSheet">Cancelar</button><button class="btn ${p.danger ? 'danger-fill' : 'primary'}" data-a="confirmOk">${esc(p.ok)}</button></div>`,
  small: true,
});
A.confirmOk = () => { const s = ui.sheets.pop(); s?.onOk?.(); render(); };
A.closeSheet = () => closeSheet();

function sheetsHTML() {
  return ui.sheets.map((s, i) => {
    const fn = SHEETS[s.type];
    if (!fn) return '';
    const r = fn(s);
    const top = i === ui.sheets.length - 1;
    return `<div class="sheet-wrap ${i >= renderedSheets ? 'enter' : ''} ${top ? 'top' : ''}" style="z-index:${100 + i}">
      <div class="backdrop" data-a="closeSheet"></div>
      <div class="sheet ${r.full ? 'full' : ''} ${r.small ? 'small' : ''}" role="dialog" aria-modal="true" aria-label="${esc(r.title)}">
        <div class="grip"></div>
        <header class="sheet-h"><h2>${esc(r.title)}</h2><button class="icon-btn sm" data-a="closeSheet" aria-label="Cerrar">${icon('x')}</button></header>
        <div class="sheet-b" data-scroll="sheet-${i}-${s.type}">${r.body}</div>
        ${r.foot ? `<footer class="sheet-f">${r.foot}</footer>` : ''}
      </div>
    </div>`;
  }).join('');
}

function shell() {
  if (root.dataset.shell === '1') return;
  root.dataset.shell = '1';
  root.innerHTML = `
    <main id="view"></main>
    <div id="mini"></div>
    <nav class="tabbar" id="tabbar" aria-label="Secciones"><i class="tab-lens" aria-hidden="true"></i>${TABS.map(([id, label, ic]) =>
      `<a href="#${id}" data-tab="${id}">${icon(ic)}<span>${label}</span></a>`).join('')}</nav>
    <div id="wk-layer"></div>
    <div id="sheets"></div>
    <div class="status-veil" aria-hidden="true"></div>`;
}

// iOS 26: en apps instaladas con barra de estado translúcida, la altura del viewport llega
// recortada en la altura de la Dynamic Island y lo anclado abajo queda flotando. Se usa la altura real.
function fitViewport() {
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  let h = innerHeight;
  const gap = screen.height - innerHeight;
  if (standalone && gap > 0 && gap < 110 && Math.abs(screen.width - innerWidth) < 2) h = screen.height;
  document.documentElement.style.setProperty('--app-h', `${h}px`);
}
fitViewport();
addEventListener('resize', fitViewport);
addEventListener('orientationchange', () => setTimeout(fitViewport, 300));

function doRender() {
  // Guardar scroll y foco
  root.querySelectorAll('[data-scroll]').forEach(el => { scrollMem[el.dataset.scroll] = el.scrollTop; });
  const ae = document.activeElement;
  const focusId = ae && ae.id && root.contains(ae) ? ae.id : null;
  const sel = focusId && 'selectionStart' in ae ? (() => { try { return [ae.selectionStart, ae.selectionEnd]; } catch { return null; } })() : null;

  if (!S.profile) {
    root.dataset.shell = '';
    root.innerHTML = onboarding() + `<div id="sheets">${sheetsHTML()}</div>`;
  } else {
    if (!TABS.some(t => t[0] === ui.tab)) ui.tab = 'hoy';
    shell();
    const view = TABS.find(t => t[0] === ui.tab)[3];
    const viewEl = document.getElementById('view');
    viewEl.className = S.active && !ui.wkOpen ? 'has-mini' : '';
    viewEl.innerHTML = view();
    document.getElementById('mini').innerHTML = miniBar();
    // La barra de pestañas no se vuelve a pintar: así la lente de cristal se desliza entre pestañas
    const bar = document.getElementById('tabbar');
    const i = TABS.findIndex(t => t[0] === ui.tab);
    if (bar.style.getPropertyValue('--i') !== String(i)) {
      const lens = bar.querySelector('.tab-lens');
      if (bar.style.getPropertyValue('--i') !== '') lens.animate?.([{ scale: '1' }, { scale: '1.18 0.86' }, { scale: '1' }], { duration: 420, easing: 'ease-out' });
      bar.style.setProperty('--i', i);
    }
    bar.querySelectorAll('a').forEach(a => {
      const on = a.dataset.tab === ui.tab;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.getElementById('wk-layer').innerHTML = S.active && ui.wkOpen ? workoutView() : '';
    document.getElementById('sheets').innerHTML = sheetsHTML();
  }
  renderedSheets = ui.sheets.length;
  document.body.classList.toggle('locked', !!(ui.sheets.length || (S.active && ui.wkOpen)));

  root.querySelectorAll('[data-scroll]').forEach(el => { const v = scrollMem[el.dataset.scroll]; if (v) el.scrollTop = v; });
  if (focusId) {
    const el = document.getElementById(focusId);
    if (el) { el.focus({ preventScroll: true }); if (sel) try { el.setSelectionRange(sel[0], sel[1]); } catch { /* */ } }
  }
}
setRender(doRender);

// ---------- Eventos ----------
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-a]');
  if (!t || t.disabled) return;
  const fn = A[t.dataset.a];
  if (fn) { e.preventDefault(); fn(t, e); }
});
const onInput = (e) => {
  const t = e.target.closest('[data-in]');
  if (!t) return;
  const isChange = t.type === 'checkbox' || t.type === 'file' || t.tagName === 'SELECT';
  if ((e.type === 'change') !== isChange) return;
  IN[t.dataset.in]?.(t, e);
};
document.addEventListener('input', onInput);
document.addEventListener('change', onInput);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && ui.sheets.length) closeSheet();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][data-a]')) { e.preventDefault(); e.target.click(); }
  if (e.key === 'Enter' && e.target.matches('.sheet input:not([type="search"])')) {
    const primary = e.target.closest('.sheet').querySelector('.sheet-f .btn.primary');
    if (primary) { e.preventDefault(); primary.click(); }
  }
});
// Seleccionar el contenido de los campos numéricos al tocarlos para escribir rápido
document.addEventListener('focusin', (e) => {
  if (e.target.matches('input[type="number"]')) setTimeout(() => { try { e.target.select(); } catch { /* */ } }, 0);
});

function route() {
  const h = location.hash.replace('#', '');
  if (TABS.some(t => t[0] === h)) {
    if (ui.tab !== h) { ui.tab = h; ui.sheets = []; }
  }
  render();
  const v = document.querySelector('#view [data-scroll]');
  if (v && !scrollMem[v.dataset.scroll]) v.scrollTop = 0;
}
window.addEventListener('hashchange', route);
route();

// PWA: service worker para funcionar sin conexión
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  try { navigator.serviceWorker?.register('sw.js').catch(() => {}); } catch { /* no permitido */ }
}
