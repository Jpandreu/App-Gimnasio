// Estado global, persistencia y utilidades compartidas.
const KEY = 'forja.v1';

const DEFAULT = () => ({
  v: 1,
  profile: null,
  settings: { autoRest: true, sound: true, vibrate: true },
  programName: '',
  routines: [],
  sessions: [],
  active: null,
  customFoods: [],
  customExercises: [],
  gym: null,
  log: {},
  weights: [],
  measures: [],
  recentFoods: [],
  tipSeen: 0,
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT(), ...JSON.parse(raw) };
  } catch (e) { /* almacenamiento no disponible */ }
  return DEFAULT();
}

export const S = load();

let saveTimer = 0;
export function save(now = false) {
  clearTimeout(saveTimer);
  const write = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* lleno o bloqueado */ } };
  if (now) write(); else saveTimer = setTimeout(write, 150);
}
window.addEventListener('pagehide', () => save(true));
document.addEventListener('visibilitychange', () => { if (document.hidden) save(true); });

export function replaceState(next) {
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, DEFAULT(), next);
  save(true);
}
export const resetState = () => replaceState({});

// Estado de interfaz (no se guarda)
export const ui = {
  tab: 'hoy',
  sub: { entrenar: 'rutinas', nutri: 'diario', progreso: 'cuerpo' },
  day: null,          // fecha en nutrición
  sheets: [],         // pila de hojas modales
  wkOpen: true,       // entreno en curso a pantalla completa
  restEnd: 0, restTotal: 0,
  chartRange: 90,
};

// Render y registro de acciones
let _render = () => {};
export const setRender = f => { _render = f; };
export const render = () => _render();
export const commit = () => { save(); render(); };

export const A = {};   // acciones por click: data-a
export const IN = {};  // acciones de input: data-in
export const SHEETS = {};

export function openSheet(type, props = {}) { ui.sheets.push({ type, ...props }); render(); }
export function closeSheet() { ui.sheets.pop(); render(); }
export function replaceSheet(type, props = {}) { ui.sheets.pop(); ui.sheets.push({ type, ...props }); render(); }

// Confirmación propia (los diálogos nativos no siempre están disponibles)
export function confirmBox({ title, text = '', ok = 'Aceptar', danger = false, onOk }) {
  openSheet('confirm', { title, text, ok, danger, onOk });
}

let toastTimer = 0;
export function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// Utilidades
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-5);
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const round = (v, d = 0) => { const m = 10 ** d; return Math.round(v * m) / m; };
export const num = v => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : 0; };
export const fmtNum = (v, d = 1) => round(v, d).toLocaleString('es-ES', { maximumFractionDigits: d });
export const fmtKg = v => `${fmtNum(v, 2)} kg`;

export function dayKey(d = new Date()) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}
export const parseDay = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (k, n) => { const d = parseDay(k); d.setDate(d.getDate() + n); return dayKey(d); };
export const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export function fmtDay(k, long = false) {
  const d = parseDay(k);
  const t = dayKey();
  if (k === t) return 'Hoy';
  if (k === addDays(t, -1)) return 'Ayer';
  if (k === addDays(t, 1)) return 'Mañana';
  const base = `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  return long ? `${['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][d.getDay()]}, ${base}` : `${DOW[d.getDay()]} ${base}`;
}
export function fmtDuration(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}` : `${m}:${String(ss).padStart(2, '0')}`;
}
export const fmtMin = ms => { const m = Math.round(ms / 60000); return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`; };
