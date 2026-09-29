// Cardio: caminar, correr, bici… Registro manual o en directo con cronómetro y GPS.
import { S, ui, A, IN, SHEETS, render, commit, save, esc, num, uid, fmtNum, round, dayKey, addDays, parseDay, fmtDay, fmtDuration, openSheet, closeSheet, confirmBox, toast, MONTHS } from '../core.js';
import { currentWeight } from '../coach.js';
import { icon, barChart, empty } from '../ui.js';

// met: equivalente metabólico medio; perKm: kcal por kg y km (más fiable al caminar o correr)
export const CARDIO_TYPES = {
  caminar: { label: 'Caminar', e: '🚶', perKm: 0.55, met: 3.5, dist: true },
  correr: { label: 'Correr', e: '🏃', perKm: 1.0, met: 9.8, dist: true },
  cinta: { label: 'Cinta', e: '🏃', perKm: 0.9, met: 8, dist: true },
  bici: { label: 'Bici', e: '🚴', met: 7, dist: true },
  estatica: { label: 'Bici estática', e: '🚲', met: 6.8, dist: false },
  eliptica: { label: 'Elíptica', e: '⛷️', met: 5, dist: false },
  senderismo: { label: 'Senderismo', e: '🥾', perKm: 0.7, met: 6, dist: true },
  nadar: { label: 'Natación', e: '🏊', met: 7, dist: true },
  remo: { label: 'Remo', e: '🚣', met: 7, dist: false },
  comba: { label: 'Comba', e: '🪢', met: 11, dist: false },
  hiit: { label: 'HIIT', e: '🔥', met: 8, dist: false },
  otro: { label: 'Otro', e: '⚡', met: 5, dist: false },
};

// Calorías netas (lo gastado por encima del reposo), que es lo que se suma al objetivo del día
export function cardioKcal(type, km, min, kg = currentWeight()) {
  const t = CARDIO_TYPES[type] || CARDIO_TYPES.otro;
  const h = min / 60;
  const gross = t.perKm && km > 0 ? t.perKm * kg * km : t.met * kg * h;
  return Math.max(0, Math.round(gross - kg * h));
}
export const cardioOn = k => (S.cardio || []).filter(c => c.d === k);
export const cardioKcalOn = k => cardioOn(k).reduce((a, c) => a + (c.kcal || 0), 0);
const paceStr = (km, min) => { if (!(km > 0)) return '–'; const s = Math.round((min * 60) / km); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const minStr = m => (m >= 60 ? `${Math.floor(m / 60)} h ${Math.round(m % 60)} min` : `${Math.round(m)} min`);

function weekRange(offset = 0) {
  const now = new Date();
  const mon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
  const a = dayKey(mon);
  return [a, addDays(a, 6)];
}
function sumRange(a, b) {
  const list = (S.cardio || []).filter(c => c.d >= a && c.d <= b);
  return { n: list.length, km: list.reduce((x, c) => x + (c.km || 0), 0), min: list.reduce((x, c) => x + (c.min || 0), 0), kcal: list.reduce((x, c) => x + (c.kcal || 0), 0), list };
}
export const cardioGoal = () => S.profile?.cardioGoal ?? 0;

// ---------- Tarjeta en Hoy ----------
export function cardioTodayCard() {
  const [a, b] = weekRange(), w = sumRange(a, b), goal = cardioGoal();
  if (!goal && !w.n && !S.cardioLive) return '';
  const pct = goal ? Math.min(100, (w.km / goal) * 100) : 0;
  return `<section class="card cardio-card">
    <div class="row-between"><div class="label">🏃 Cardio esta semana</div>
      <button class="btn sm ghost" data-a="${S.cardioLive ? 'cardioLiveOpen' : 'cardioAdd'}">${S.cardioLive ? `${icon('play')} En curso` : `${icon('plus')} Registrar`}</button></div>
    <div><b class="num xl">${fmtNum(w.km, 1)}</b><span class="muted"> ${goal ? `/ ${goal} km` : 'km'} · ${minStr(w.min)} · ${w.kcal} kcal</span></div>
    ${goal ? `<div class="bar cardio-bar"><i style="width:${pct}%"></i></div>` : ''}
  </section>`;
}

// ---------- Pestaña en Entrenar ----------
export function cardioTab() {
  const [a, b] = weekRange(), w = sumRange(a, b), goal = cardioGoal();
  const all = [...(S.cardio || [])].sort((x, y) => (y.start || 0) - (x.start || 0) || y.d.localeCompare(x.d));
  const weeks = Array.from({ length: 8 }, (_, i) => { const [x, y] = weekRange(i - 7); const s = sumRange(x, y); const d = parseDay(x); return { label: `${d.getDate()}/${d.getMonth() + 1}`, v: round(s.km, 1), hi: i === 7 }; });
  const month = sumRange(dayKey(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), dayKey());
  const totalKm = all.reduce((x, c) => x + (c.km || 0), 0);
  const runs = all.filter(c => ['correr', 'cinta'].includes(c.type) && c.km >= 1 && c.min > 0);
  const bestPace = runs.length ? runs.reduce((x, c) => (c.min / c.km < x.min / x.km ? c : x)) : null;
  const longest = all.filter(c => c.km > 0).reduce((x, c) => (!x || c.km > x.km ? c : x), null);
  const byType = Object.entries(w.list.reduce((m, c) => { m[c.type] = (m[c.type] || 0) + (c.km || 0); return m; }, {}));
  return `
  ${S.cardioLive ? `<button class="card live-banner" data-a="cardioLiveOpen"><i class="pulse"></i><span class="grow"><b>${CARDIO_TYPES[S.cardioLive.type].e} ${CARDIO_TYPES[S.cardioLive.type].label} en curso</b><small>Toca para continuar</small></span>${icon('right')}</button>` : ''}
  <section class="card cardio-week">
    <div class="row-between"><div class="label">Esta semana</div><button class="btn sm ghost" data-a="cardioGoalEdit">${icon('flag')} ${goal ? `Objetivo ${goal} km` : 'Poner objetivo'}</button></div>
    <div class="cw-main"><b class="num">${fmtNum(w.km, 1)}</b><span>km${goal ? ` de ${goal}` : ''}</span></div>
    ${goal ? `<div class="bar cardio-bar"><i style="width:${Math.min(100, (w.km / goal) * 100)}%"></i></div>` : ''}
    <div class="kv3"><div><b class="num">${w.n}</b><span>sesiones</span></div><div><b class="num">${minStr(w.min)}</b><span>tiempo</span></div><div><b class="num">${w.kcal}</b><span>kcal gastadas</span></div></div>
    ${byType.length ? `<div class="chips">${byType.map(([t, km]) => `<span class="chip soft">${CARDIO_TYPES[t]?.e || '⚡'} ${CARDIO_TYPES[t]?.label || t} ${km ? `${fmtNum(km, 1)} km` : ''}</span>`).join('')}</div>` : ''}
  </section>
  <div class="btn-row"><button class="btn primary" data-a="cardioLiveStart">${icon('play')} En directo</button><button class="btn ghost" data-a="cardioAdd">${icon('plus')} Registrar</button></div>
  ${all.length ? `
    <section class="card"><div class="label">Kilómetros por semana</div><div class="chart-card">${barChart(weeks, { target: goal || null, color: 'var(--c-fat)' })}</div></section>
    <div class="stats3">
      <div class="stat"><span class="label">Este mes</span><b class="num">${fmtNum(month.km, 1)}</b><small>km</small></div>
      <div class="stat"><span class="label">Más larga</span><b class="num">${longest ? fmtNum(longest.km, 1) : '–'}</b><small>km</small></div>
      <div class="stat"><span class="label">Mejor ritmo</span><b class="num">${bestPace ? paceStr(bestPace.km, bestPace.min) : '–'}</b><small>min/km corriendo</small></div>
    </div>
    <p class="hint">Total acumulado: ${fmtNum(totalKm, 1)} km en ${all.length} ${all.length === 1 ? 'actividad' : 'actividades'}.</p>
    <h3 class="section-t">Historial</h3>
    <section class="card list">${all.slice(0, 40).map(c => { const t = CARDIO_TYPES[c.type] || CARDIO_TYPES.otro; return `<button class="row cardio-row" data-a="cardioEdit" data-id="${c.id}"><span class="emo">${t.e}</span>
      <span class="grow"><b>${t.label}${c.km ? ` · ${fmtNum(c.km, 2)} km` : ''}</b><small class="muted">${fmtDay(c.d)} · ${minStr(c.min)}${c.km && t.dist ? ` · ${paceStr(c.km, c.min)} min/km` : ''}${c.gps ? ' · GPS' : ''}</small></span>
      <span class="num kc">${c.kcal} kcal</span></button>`; }).join('')}</section>`
  : empty('flag', 'Sin actividades todavía', 'Registra tus paseos, carreras o sesiones de bici y aquí verás tus kilómetros y tu progreso.')}
  <div class="card inset tipbox">${icon('info')}<p>Estás ganando masa: el cardio suave (caminar, bici tranquila) ayuda a la salud y a recuperar. Las calorías que gastas se suman a tu objetivo del día para que no pierdas el superávit.</p></div>`;
}

// ---------- Registrar / editar ----------
A.cardioAdd = () => { ui.cd = { id: null, type: 'caminar', d: dayKey(), km: '', min: 30, notes: '' }; openSheet('cardioEdit'); };
A.cardioEdit = (el) => { ui.cd = { ...S.cardio.find(c => c.id === el.dataset.id) }; openSheet('cardioEdit'); };
function cdPreview() {
  const d = ui.cd, t = CARDIO_TYPES[d.type];
  return `<div class="cd-prev"><div><b class="num">${cardioKcal(d.type, num(d.km), num(d.min))}</b><span>kcal</span></div>
    ${t.dist ? `<div><b class="num">${paceStr(num(d.km), num(d.min))}</b><span>min/km</span></div><div><b class="num">${num(d.km) > 0 && num(d.min) > 0 ? fmtNum(num(d.km) / (num(d.min) / 60), 1) : '–'}</b><span>km/h</span></div>` : ''}</div>`;
}
SHEETS.cardioEdit = () => {
  const d = ui.cd, t = CARDIO_TYPES[d.type];
  return {
    title: d.id ? 'Editar actividad' : 'Registrar actividad',
    body: `<div class="cardio-types">${Object.entries(CARDIO_TYPES).map(([k, x]) => `<button type="button" class="ct-btn ${d.type === k ? 'on' : ''}" data-a="cdType" data-v="${k}"><span>${x.e}</span>${x.label}</button>`).join('')}</div>
      <div class="field-row">
        ${t.dist ? `<label class="field"><span>Distancia (km)</span><input id="cd-km" type="number" inputmode="decimal" step="0.01" value="${d.km}" placeholder="0,0" data-in="cdF" data-k="km"></label>` : ''}
        <label class="field"><span>Duración (min)</span><input id="cd-min" type="number" inputmode="decimal" value="${d.min}" data-in="cdF" data-k="min"></label>
      </div>
      <label class="field"><span>Fecha</span><input id="cd-d" type="date" value="${d.d}" max="${dayKey()}" data-in="cdF" data-k="d"></label>
      <div id="cd-prev">${cdPreview()}</div>
      <label class="field"><span>Notas</span><input id="cd-notes" type="text" value="${esc(d.notes || '')}" placeholder="Ruta, sensaciones…" data-in="cdF" data-k="notes"></label>
      ${d.id ? `<button class="btn block text danger" data-a="cardioDelete">Borrar actividad</button>` : ''}`,
    foot: `<button class="btn primary block" data-a="cardioSave">Guardar</button>`,
  };
};
A.cdType = (el) => { ui.cd.type = el.dataset.v; render(); };
IN.cdF = (el) => {
  const k = el.dataset.k;
  ui.cd[k] = k === 'd' || k === 'notes' ? el.value : el.value === '' ? '' : num(el.value);
  const p = document.getElementById('cd-prev'); if (p) p.innerHTML = cdPreview();
};
A.cardioSave = () => {
  const d = ui.cd, t = CARDIO_TYPES[d.type];
  if (!(num(d.min) > 0)) { toast('Indica la duración'); return; }
  if (!d.d || d.d > dayKey()) d.d = dayKey();
  const item = { id: d.id || uid(), type: d.type, d: d.d, start: d.start || parseDay(d.d).getTime() + 12 * 36e5, km: t.dist ? round(num(d.km), 2) : 0, min: round(num(d.min), 1), kcal: cardioKcal(d.type, t.dist ? num(d.km) : 0, num(d.min)), notes: d.notes || '', gps: !!d.gps };
  S.cardio = d.id ? S.cardio.map(c => (c.id === d.id ? item : c)) : [...(S.cardio || []), item];
  ui.sheets = []; commit();
  toast(`${t.e} Guardado: ${item.km ? `${fmtNum(item.km, 2)} km · ` : ''}${item.kcal} kcal`);
};
A.cardioDelete = () => {
  const id = ui.cd.id;
  confirmBox({ title: '¿Borrar la actividad?', ok: 'Borrar', danger: true, onOk: () => { S.cardio = S.cardio.filter(c => c.id !== id); ui.sheets = []; commit(); } });
};
A.cardioGoalEdit = () => { ui.cg = cardioGoal() || 10; openSheet('cardioGoal'); };
SHEETS.cardioGoal = () => ({
  title: 'Objetivo semanal',
  body: `<p class="muted center">Kilómetros a la semana entre caminar, correr, bici…</p>
    <div class="big-stepper"><button data-a="cgStep" data-v="-1" aria-label="Menos">${icon('minus')}</button>
      <label class="bs-val"><input id="cg-input" type="number" inputmode="decimal" value="${ui.cg}" data-in="cgIn"><span>km</span></label>
      <button data-a="cgStep" data-v="1" aria-label="Más">${icon('plus')}</button></div>
    <p class="hint center">Para ganar masa, 2-3 sesiones suaves o unos 10-20 km caminando a la semana es un buen punto de partida. Pon 0 para no tener objetivo.</p>`,
  foot: `<button class="btn primary block" data-a="cgSave">Guardar</button>`,
});
A.cgStep = (el) => { ui.cg = Math.max(0, num(document.getElementById('cg-input').value) + num(el.dataset.v)); document.getElementById('cg-input').value = ui.cg; };
IN.cgIn = (el) => { ui.cg = Math.max(0, num(el.value)); };
A.cgSave = () => { S.profile.cardioGoal = round(num(document.getElementById('cg-input').value), 1); closeSheet(); commit(); };

// ---------- En directo: cronómetro + GPS ----------
let watchId = null, lock = null;
const hav = (a, b) => {
  const R = 6371, dLat = ((b.lat - a.lat) * Math.PI) / 180, dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};
const liveMs = L => L.acc + (L.running ? Date.now() - L.since : 0);

function startGps() {
  const L = S.cardioLive;
  if (!L || !CARDIO_TYPES[L.type].dist || L.type === 'cinta' || watchId !== null || !('geolocation' in navigator)) return;
  try {
    watchId = navigator.geolocation.watchPosition(pos => {
      const L2 = S.cardioLive; if (!L2 || !L2.running) return;
      const { latitude: lat, longitude: lon, accuracy } = pos.coords;
      if (L2.gpsState !== 'ok') { L2.gpsState = 'ok'; const g = document.getElementById('live-gps'); if (g) g.textContent = '📡 GPS activo. Mantén la app abierta: el iPhone no deja medir con la pantalla bloqueada.'; }
      if (accuracy > 35) return;
      const pt = { lat, lon };
      if (L2.last) { const d = hav(L2.last, pt); if (d > 0.004 && d < 0.5) { L2.km += d; L2.last = pt; } } else L2.last = pt;
      save();
    }, err => { const L2 = S.cardioLive; if (L2) { L2.gpsState = err.code === 1 ? 'denied' : 'error'; render(); } }, { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 });
  } catch { if (S.cardioLive) S.cardioLive.gpsState = 'error'; }
}
function stopGps() { if (watchId !== null) { try { navigator.geolocation.clearWatch(watchId); } catch { /* */ } watchId = null; } }
async function keepAwake() { try { if ('wakeLock' in navigator && !lock) { lock = await navigator.wakeLock.request('screen'); lock.addEventListener('release', () => { lock = null; }); } } catch { /* */ } }
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.cardioLive?.running) { keepAwake(); startGps(); } });

A.cardioLiveStart = () => {
  if (S.cardioLive) { A.cardioLiveOpen(); return; }
  S.cardioLive = { type: 'caminar', running: false, acc: 0, since: 0, km: 0, last: null, gpsState: 'off', start: Date.now() };
  save(); openSheet('cardioLive');
};
A.cardioLiveOpen = () => { openSheet('cardioLive'); if (S.cardioLive?.running) { startGps(); keepAwake(); } };
SHEETS.cardioLive = () => {
  const L = S.cardioLive;
  if (!L) return { title: 'Cardio', body: '' };
  const t = CARDIO_TYPES[L.type], ms = liveMs(L), min = ms / 60000;
  const gpsTxt = !t.dist ? 'Sin distancia para esta actividad' : L.type === 'cinta' ? 'En cinta: introduce los km al terminar' : { off: 'El GPS se activará al empezar', ok: 'GPS activo', denied: 'Permiso de ubicación denegado: introduce los km al terminar', error: 'Buscando señal GPS…' }[L.gpsState] || 'Buscando señal GPS…';
  return {
    title: `${t.e} ${t.label}`,
    body: `${!L.running && !ms ? `<div class="cardio-types">${Object.entries(CARDIO_TYPES).map(([k, x]) => `<button type="button" class="ct-btn ${L.type === k ? 'on' : ''}" data-a="liveType" data-v="${k}"><span>${x.e}</span>${x.label}</button>`).join('')}</div>` : ''}
      <div class="live-clock"><b id="live-time" class="num">${fmtDuration(ms)}</b><span>${L.running ? 'en marcha' : ms ? 'en pausa' : 'listo para empezar'}</span></div>
      ${t.dist ? `<div class="live-stats"><div><b id="live-km" class="num">${fmtNum(L.km, 2)}</b><span>km</span></div><div><b id="live-pace" class="num">${paceStr(L.km, min)}</b><span>min/km</span></div><div><b id="live-kcal" class="num">${cardioKcal(L.type, L.km, min)}</b><span>kcal</span></div></div>`
        : `<div class="live-stats"><div><b id="live-kcal" class="num">${cardioKcal(L.type, 0, min)}</b><span>kcal</span></div></div>`}
      <p class="hint center" id="live-gps">${L.gpsState === 'ok' ? '📡 ' : ''}${gpsTxt}. Mantén la app abierta: el iPhone no deja medir con la pantalla bloqueada.</p>`,
    foot: `<div class="btn-row">${ms ? `<button class="btn ghost danger" data-a="liveDiscard">Descartar</button>` : ''}
      <button class="btn ${L.running ? 'ghost' : 'primary'}" data-a="liveToggle">${L.running ? 'Pausar' : ms ? 'Reanudar' : `${icon('play')} Empezar`}</button>
      ${ms ? `<button class="btn primary" data-a="liveFinish">Terminar</button>` : ''}</div>`,
  };
};
A.liveType = (el) => { S.cardioLive.type = el.dataset.v; save(); render(); };
A.liveToggle = () => {
  const L = S.cardioLive;
  if (L.running) { L.acc += Date.now() - L.since; L.running = false; L.last = null; stopGps(); }
  else { L.running = true; L.since = Date.now(); if (!L.acc) L.start = Date.now(); startGps(); keepAwake(); }
  save(); render();
};
A.liveDiscard = () => confirmBox({ title: '¿Descartar la actividad?', ok: 'Descartar', danger: true, onOk: () => { stopGps(); S.cardioLive = null; ui.sheets = []; commit(); } });
A.liveFinish = () => {
  const L = S.cardioLive;
  if (L.running) { L.acc += Date.now() - L.since; L.running = false; }
  stopGps(); try { lock?.release(); } catch { /* */ }
  const t = CARDIO_TYPES[L.type];
  ui.cd = { id: null, type: L.type, d: dayKey(), start: L.start, km: t.dist && L.km > 0 ? round(L.km, 2) : '', min: round(L.acc / 60000, 1), notes: '', gps: L.km > 0 };
  S.cardioLive = null; save();
  ui.sheets = []; openSheet('cardioEdit');
};
// Actualiza el cronómetro sin repintar la hoja entera
setInterval(() => {
  const L = S.cardioLive; if (!L) return;
  const el = document.getElementById('live-time'); if (!el) return;
  const ms = liveMs(L), min = ms / 60000;
  el.textContent = fmtDuration(ms);
  const km = document.getElementById('live-km'); if (km) km.textContent = fmtNum(L.km, 2);
  const pc = document.getElementById('live-pace'); if (pc) pc.textContent = paceStr(L.km, min);
  const kc = document.getElementById('live-kcal'); if (kc) kc.textContent = cardioKcal(L.type, CARDIO_TYPES[L.type].dist ? L.km : 0, min);
}, 1000);
