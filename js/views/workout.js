import { S, ui, A, IN, SHEETS, render, commit, save, esc, num, uid, fmtNum, round, fmtDuration, fmtMin, openSheet, closeSheet, confirmBox, toast } from '../core.js';
import { exById, lastPerformance, workingSets, suggestion, bestE1rm, e1rm, sessionStats } from '../coach.js';
import { MUSCLES } from '../data/exercises.js';
import { icon } from '../ui.js';

const newSet = (w = false) => ({ kg: '', reps: '', done: false, w });

export function startWorkout(name, routineId, exercises) {
  S.active = {
    id: uid(), name, routineId, start: Date.now(), notes: '',
    exercises: exercises.map(e => ({ exId: e.exId, min: e.min, max: e.max, rest: e.rest, sets: Array.from({ length: e.sets }, () => newSet()) })),
  };
  ui.wkOpen = true; ui.restEnd = 0;
  save(true); render();
  wakeLock();
}

export function addExercisesToWorkout(ids) {
  for (const id of ids) {
    const compound = (exById(id).sec || []).length > 0;
    S.active.exercises.push({ exId: id, min: compound ? 6 : 10, max: compound ? 10 : 15, rest: compound ? 150 : 90, sets: [newSet(), newSet(), newSet()] });
  }
  save();
}
export function swapWorkoutExercise(i, id) {
  const ex = S.active.exercises[i];
  ex.exId = id; ex.sets = ex.sets.map(() => newSet());
  save();
}

// ---------- Wake lock y sonido ----------
let lock = null;
async function wakeLock() {
  try { if ('wakeLock' in navigator && !lock) { lock = await navigator.wakeLock.request('screen'); lock.addEventListener('release', () => { lock = null; }); } } catch { /* no disponible */ }
}
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.active) wakeLock(); });
function releaseLock() { try { lock?.release(); } catch { /* */ } lock = null; }

let actx = null;
function unlockAudio() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch { /* */ } }
function beep() {
  if (S.settings.sound && actx) {
    try {
      [0, 0.22, 0.44].forEach((t, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = 'sine'; o.frequency.value = i === 2 ? 1175 : 880;
        g.gain.setValueAtTime(0.0001, actx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.35, actx.currentTime + t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + t + 0.18);
        o.connect(g).connect(actx.destination); o.start(actx.currentTime + t); o.stop(actx.currentTime + t + 0.2);
      });
    } catch { /* */ }
  }
  if (S.settings.vibrate) try { navigator.vibrate?.([200, 100, 200]); } catch { /* */ }
}

// ---------- Temporizadores ----------
setInterval(() => {
  if (!S.active) return;
  const el = document.getElementById('wk-elapsed');
  const t = fmtDuration(Date.now() - S.active.start);
  if (el) el.textContent = t;
  const mini = document.getElementById('mini-elapsed');
  if (mini) mini.textContent = t;
  if (ui.restEnd) {
    const left = ui.restEnd - Date.now();
    if (left <= 0) { ui.restEnd = 0; beep(); toast('¡Descanso terminado! A por la siguiente serie'); render(); return; }
    const rt = document.getElementById('rest-time'); if (rt) rt.textContent = fmtDuration(left + 999);
    const rb = document.getElementById('rest-bar'); if (rb) rb.style.transform = `scaleX(${left / (ui.restTotal * 1000)})`;
  }
}, 250);

function startRest(sec) { ui.restTotal = sec; ui.restEnd = Date.now() + sec * 1000; }
A.restAdj = (el) => { ui.restEnd += num(el.dataset.v) * 1000; ui.restTotal = Math.max(ui.restTotal + num(el.dataset.v), 5); if (ui.restEnd <= Date.now()) ui.restEnd = 0; render(); };
A.restSkip = () => { ui.restEnd = 0; render(); };

// ---------- Vista ----------
function prevFor(exId) {
  const lp = lastPerformance(exId);
  return lp ? workingSets(lp.ex) : [];
}

function exerciseCard(ex, i) {
  const e = exById(ex.exId);
  const prev = prevFor(ex.exId);
  const sg = suggestion(ex.exId, ex.min, ex.max);
  let workIdx = 0, lastKg = null, lastReps = null;
  const rows = ex.sets.map((s, j) => {
    const p = s.w ? null : prev[workIdx];
    const label = s.w ? 'C' : ++workIdx;
    const phKg = lastKg ?? (s.w ? '' : sg?.kg ?? p?.kg ?? '');
    const phReps = s.w ? '' : lastReps ?? sg?.reps ?? p?.reps ?? '';
    if (!s.w && s.kg !== '') lastKg = s.kg;
    if (!s.w && s.reps !== '') lastReps = s.reps;
    return `<div class="set ${s.done ? 'done' : ''} ${s.w ? 'warm' : ''}">
      <button class="set-n" data-a="toggleWarm" data-e="${i}" data-s="${j}" aria-label="Cambiar tipo de serie">${label}</button>
      <button class="set-prev" data-a="copyPrev" data-e="${i}" data-s="${j}" ${p ? '' : 'disabled'}>${p ? `${fmtNum(p.kg, 2)}×${p.reps}` : '–'}</button>
      <input id="s-${i}-${j}-kg" class="num" type="number" inputmode="decimal" step="0.25" placeholder="${phKg === '' ? 'kg' : round(phKg, 2)}" value="${s.kg}" data-in="setVal" data-e="${i}" data-s="${j}" data-k="kg" aria-label="Kilos serie ${label}">
      <input id="s-${i}-${j}-reps" class="num" type="number" inputmode="numeric" placeholder="${phReps === '' ? (s.w ? 'reps' : `${ex.min}-${ex.max}`) : phReps}" value="${s.reps}" data-in="setVal" data-e="${i}" data-s="${j}" data-k="reps" aria-label="Repeticiones serie ${label}">
      <button class="set-ok" data-a="checkSet" data-e="${i}" data-s="${j}" aria-label="Completar serie" aria-pressed="${s.done}">${icon('check')}</button>
    </div>`;
  }).join('');
  const doneAll = ex.sets.length && ex.sets.every(s => s.done);
  return `<section class="card wk-ex ${doneAll ? 'complete' : ''}" id="wk-ex-${i}">
    <div class="wk-ex-head">
      <button class="grow wk-ex-title" data-a="exDetail" data-id="${ex.exId}"><b>${esc(e.name)}</b><small><span class="mk m-${e.m}"></span>${MUSCLES[e.m]} · ${ex.min}-${ex.max} reps</small></button>
      <button class="icon-btn sm" data-a="exMenu" data-e="${i}" aria-label="Opciones del ejercicio">${icon('more')}</button>
    </div>
    ${sg ? `<button class="coach-chip ${sg.up ? 'up' : sg.down ? 'down' : ''}" data-a="applySg" data-e="${i}">${icon(sg.up ? 'up' : 'bolt')}<span>${esc(sg.text)}</span></button>` : `<div class="coach-chip plain">${icon('info')}<span>Primera vez: elige un peso con el que llegues a ${ex.max} reps con buena técnica, dejando 1-2 en reserva.</span></div>`}
    <div class="set head"><span>Serie</span><span>Anterior</span><span>Kg</span><span>Reps</span><span></span></div>
    ${rows}
    <div class="wk-ex-foot">
      <button class="btn sm ghost" data-a="addSet" data-e="${i}">${icon('plus')} Serie</button>
      <button class="btn sm ghost" data-a="restCycle" data-e="${i}">${icon('timer')} ${fmtDuration(ex.rest * 1000)}</button>
    </div>
  </section>`;
}

export function workoutView() {
  const w = S.active;
  let done = 0, total = 0, vol = 0;
  for (const ex of w.exercises) for (const s of ex.sets) { total++; if (s.done) { done++; if (!s.w) vol += num(s.kg) * num(s.reps); } }
  const resting = ui.restEnd > Date.now();
  return `<div class="wk ${resting ? 'resting' : ''}">
    <header class="wk-top">
      <button class="icon-btn" data-a="minWorkout" aria-label="Minimizar">${icon('down')}</button>
      <div class="wk-title"><b>${esc(w.name)}</b><span id="wk-elapsed" class="num">${fmtDuration(Date.now() - w.start)}</span></div>
      <button class="btn sm primary" data-a="finishWorkout">Terminar</button>
    </header>
    <div class="wk-progress"><i style="width:${total ? (done / total) * 100 : 0}%"></i></div>
    <div class="wk-body" data-scroll="wk">
      <div class="wk-stats"><div><b class="num">${done}/${total}</b><span>series</span></div><div><b class="num">${fmtNum(vol, 0)}</b><span>kg volumen</span></div><div><b class="num">${w.exercises.length}</b><span>ejercicios</span></div></div>
      ${w.exercises.map(exerciseCard).join('')}
      <button class="btn block ghost" data-a="pickEx" data-mode="workout">${icon('plus')} Añadir ejercicio</button>
      <label class="field"><span>Notas del entreno</span><textarea id="wk-notes" rows="2" placeholder="Sensaciones, molestias, técnica…" data-in="wkNotes">${esc(w.notes)}</textarea></label>
      <button class="btn block text danger" data-a="cancelWorkout">Descartar entreno</button>
    </div>
    ${resting ? `<div class="rest">
      <div class="rest-bar"><i id="rest-bar" style="transform:scaleX(${(ui.restEnd - Date.now()) / (ui.restTotal * 1000)})"></i></div>
      <div class="rest-row">
        <button class="btn sm ghost" data-a="restAdj" data-v="-15">−15</button>
        <div class="rest-mid"><span class="label">Descanso</span><b id="rest-time" class="num">${fmtDuration(ui.restEnd - Date.now() + 999)}</b></div>
        <button class="btn sm ghost" data-a="restAdj" data-v="15">+15</button>
        <button class="btn sm primary" data-a="restSkip">Saltar</button>
      </div></div>` : ''}
  </div>`;
}

export function miniBar() {
  if (!S.active || ui.wkOpen) return '';
  const resting = ui.restEnd > Date.now();
  return `<button class="mini-wk" data-a="openWorkout"><i class="pulse"></i><span class="grow"><b>${esc(S.active.name)}</b><small>${resting ? 'Descansando' : 'Entreno en curso'}</small></span><span id="mini-elapsed" class="num">${fmtDuration(Date.now() - S.active.start)}</span>${icon('up')}</button>`;
}

// ---------- Acciones ----------
A.minWorkout = () => { ui.wkOpen = false; render(); };
IN.wkNotes = (el) => { S.active.notes = el.value; save(); };
IN.setVal = (el) => {
  const s = S.active.exercises[+el.dataset.e].sets[+el.dataset.s];
  s[el.dataset.k] = el.value === '' ? '' : Math.max(0, num(el.value));
  save();
};
A.checkSet = (el) => {
  unlockAudio();
  const ex = S.active.exercises[+el.dataset.e], s = ex.sets[+el.dataset.s];
  if (!s.done) {
    const kgIn = document.getElementById(`s-${el.dataset.e}-${el.dataset.s}-kg`);
    const rIn = document.getElementById(`s-${el.dataset.e}-${el.dataset.s}-reps`);
    if (s.kg === '') s.kg = kgIn && kgIn.placeholder !== 'kg' ? num(kgIn.placeholder) : 0;
    if (s.reps === '') {
      const ph = rIn?.placeholder || '';
      if (/^\d+$/.test(ph)) s.reps = num(ph);
      else { rIn?.focus(); toast('Escribe las repeticiones que hiciste'); return; }
    }
    if (!(s.reps > 0)) { rIn?.focus(); toast('Escribe las repeticiones que hiciste'); return; }
    s.done = true;
    if (S.settings.autoRest) startRest(s.w ? 60 : ex.rest || 90);
    try { navigator.vibrate?.(15); } catch { /* */ }
  } else {
    s.done = false;
  }
  commit();
};
A.toggleWarm = (el) => { const s = S.active.exercises[+el.dataset.e].sets[+el.dataset.s]; s.w = !s.w; commit(); };
A.copyPrev = (el) => {
  const ex = S.active.exercises[+el.dataset.e];
  const j = +el.dataset.s;
  const idx = ex.sets.slice(0, j + 1).filter(x => !x.w).length - 1;
  const p = prevFor(ex.exId)[idx];
  if (p) { ex.sets[j].kg = p.kg; ex.sets[j].reps = p.reps; commit(); }
};
A.applySg = (el) => {
  const ex = S.active.exercises[+el.dataset.e];
  const sg = suggestion(ex.exId, ex.min, ex.max);
  if (!sg) return;
  for (const s of ex.sets) if (!s.done && !s.w) { s.kg = sg.kg; if (s.reps === '') s.reps = sg.reps; }
  commit(); toast('Peso aplicado a las series pendientes');
};
A.addSet = (el) => {
  const ex = S.active.exercises[+el.dataset.e];
  const last = [...ex.sets].reverse().find(s => !s.w);
  ex.sets.push({ ...newSet(), kg: last && last.kg !== '' ? last.kg : '' });
  commit();
};
A.restCycle = (el) => {
  const opts = [60, 90, 120, 150, 180, 240];
  const ex = S.active.exercises[+el.dataset.e];
  ex.rest = opts[(opts.indexOf(ex.rest) + 1) % opts.length] || 90;
  commit();
};

A.exMenu = (el) => openSheet('exMenu', { i: +el.dataset.e });
SHEETS.exMenu = ({ i }) => {
  const ex = S.active.exercises[i], e = exById(ex.exId);
  return {
    title: e.name,
    body: `<div class="list">
      <button class="row" data-a="exDetail" data-id="${ex.exId}">${icon('info')}<span class="grow">Técnica e historial</span></button>
      <button class="row" data-a="addWarm" data-e="${i}">${icon('fire')}<span class="grow">Añadir serie de calentamiento</span></button>
      <button class="row" data-a="pickEx" data-mode="swap" data-i="${i}">${icon('swap')}<span class="grow">Cambiar por otro ejercicio</span></button>
      <button class="row" data-a="wkMove" data-e="${i}" data-v="-1" ${i === 0 ? 'disabled' : ''}>${icon('up')}<span class="grow">Mover arriba</span></button>
      <button class="row" data-a="wkMove" data-e="${i}" data-v="1" ${i === S.active.exercises.length - 1 ? 'disabled' : ''}>${icon('down')}<span class="grow">Mover abajo</span></button>
      <button class="row" data-a="delLastSet" data-e="${i}" ${ex.sets.length ? '' : 'disabled'}>${icon('minus')}<span class="grow">Quitar última serie</span></button>
      <button class="row danger" data-a="wkRemove" data-e="${i}">${icon('trash')}<span class="grow">Quitar ejercicio</span></button>
    </div>`,
  };
};
A.addWarm = (el) => {
  const ex = S.active.exercises[+el.dataset.e];
  const firstWork = ex.sets.findIndex(s => !s.w);
  ex.sets.splice(firstWork < 0 ? ex.sets.length : firstWork, 0, newSet(true));
  closeSheet(); save();
};
A.wkMove = (el) => {
  const arr = S.active.exercises, i = +el.dataset.e, j = i + num(el.dataset.v);
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
  closeSheet(); save();
};
A.delLastSet = (el) => { S.active.exercises[+el.dataset.e].sets.pop(); closeSheet(); save(); };
A.wkRemove = (el) => { S.active.exercises.splice(+el.dataset.e, 1); closeSheet(); save(); };

A.cancelWorkout = () => confirmBox({
  title: '¿Descartar el entreno?', text: 'No se guardará nada de esta sesión.', ok: 'Descartar', danger: true,
  onOk: () => { S.active = null; ui.restEnd = 0; releaseLock(); ui.sheets = []; commit(); },
});

A.finishWorkout = () => {
  const w = S.active;
  const done = w.exercises.reduce((a, e) => a + e.sets.filter(s => s.done).length, 0);
  const pending = w.exercises.reduce((a, e) => a + e.sets.filter(s => !s.done).length, 0);
  if (!done) { confirmBox({ title: 'No has completado ninguna serie', text: 'Marca las series con ✓ al hacerlas. ¿Quieres descartar el entreno?', ok: 'Descartar', danger: true, onOk: () => { S.active = null; ui.restEnd = 0; releaseLock(); ui.sheets = []; commit(); } }); return; }
  if (pending) { confirmBox({ title: '¿Terminar el entreno?', text: `Tienes ${pending} ${pending === 1 ? 'serie' : 'series'} sin marcar. No se guardarán.`, ok: 'Terminar', onOk: () => { ui.sheets = []; saveWorkout(); } }); return; }
  saveWorkout();
};

function saveWorkout() {
  const w = S.active;
  const session = {
    ...w, end: Date.now(),
    exercises: w.exercises.map(e => ({ ...e, sets: e.sets.filter(s => s.done).map(s => ({ kg: num(s.kg), reps: num(s.reps), done: true, w: !!s.w })) })).filter(e => e.sets.length),
  };
  const prs = [];
  for (const ex of session.exercises) {
    const prevBest = bestE1rm(ex.exId, session.start);
    const best = Math.max(0, ...workingSets(ex).map(s => e1rm(s.kg, s.reps)));
    if (prevBest > 0 && best > prevBest + 0.01) prs.push(ex.exId);
  }
  session.prs = prs;
  S.sessions.push(session);
  S.active = null; ui.restEnd = 0; ui.wkOpen = true;
  releaseLock();
  save(true);
  openSheet('summary', { id: session.id });
}

SHEETS.summary = ({ id }) => {
  const s = S.sessions.find(x => x.id === id);
  const st = sessionStats(s);
  const n = S.sessions.length;
  return {
    title: '¡Entreno completado!',
    body: `<div class="summary-hero"><div class="trophy">${icon(s.prs.length ? 'trophy' : 'check')}</div>
        <h2>${esc(s.name)}</h2><p class="muted">Entreno número ${n}. ${s.prs.length ? 'Has batido récords personales.' : 'Constancia es lo que construye músculo.'}</p></div>
      <div class="stats3">
        <div class="stat"><span class="label">Duración</span><b class="num">${fmtMin(s.end - s.start)}</b></div>
        <div class="stat"><span class="label">Series</span><b class="num">${st.sets}</b></div>
        <div class="stat"><span class="label">Volumen</span><b class="num">${fmtNum(st.volume, 0)}</b><small>kg</small></div>
      </div>
      ${s.prs.length ? `<h3 class="section-t">Récords personales</h3><div class="card list">${s.prs.map(id => {
        const ex = s.exercises.find(e => e.exId === id);
        const top = workingSets(ex).reduce((a, b) => e1rm(b.kg, b.reps) > e1rm(a.kg, a.reps) ? b : a);
        return `<div class="row">${icon('trophy', 'warm-i')}<span class="grow"><b>${esc(exById(id).name)}</b><small>${fmtNum(top.kg, 2)} kg × ${top.reps} · 1RM est. ${fmtNum(e1rm(top.kg, top.reps), 1)} kg</small></span></div>`;
      }).join('')}</div>` : ''}
      <div class="card inset tipbox">${icon('bowl')}<p>Toma una comida con 30-40 g de proteína e hidratos en las próximas horas para recuperar.</p></div>`,
    foot: `<button class="btn primary block" data-a="closeAll">Genial</button>`,
  };
};
A.closeAll = () => { ui.sheets = []; render(); };
