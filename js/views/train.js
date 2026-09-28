import { S, ui, A, IN, SHEETS, render, commit, save, esc, num, uid, fmtNum, round, dayKey, fmtDay, fmtMin, openSheet, closeSheet, replaceSheet, confirmBox, toast, MONTHS } from '../core.js';
import { exById, generateProgram, nextRoutine, lastPerformance, workingSets, bestE1rm, e1rm, sessionStats } from '../coach.js';
import { EXERCISES, MUSCLES, EQUIP } from '../data/exercises.js';
import { PROGRAMS } from '../data/plans.js';
import { icon, seg, empty, lineChart } from '../ui.js';
import { estMinutes } from './today.js';
import { startWorkout, addExercisesToWorkout, swapWorkoutExercise } from './workout.js';

const allExercises = () => [...(S.customExercises || []), ...EXERCISES];

export function trainView() {
  const sub = ui.sub.entrenar;
  return `<div class="screen" data-scroll="entrenar-${sub}">
    <header class="top"><h1 class="title">Entrenar</h1></header>
    ${seg('trainSub', sub, [['rutinas', 'Rutinas'], ['ejercicios', 'Ejercicios'], ['historial', 'Historial']])}
    ${sub === 'rutinas' ? routinesTab() : sub === 'ejercicios' ? libraryTab() : historyTab()}
  </div>`;
}
A.trainSub = (el) => { ui.sub.entrenar = el.dataset.v; render(); };

// ---------- Rutinas ----------
function routinesTab() {
  const next = nextRoutine();
  const lastDone = id => { const s = [...S.sessions].reverse().find(x => x.routineId === id); return s ? fmtDay(dayKey(s.start)) : null; };
  return `
  ${S.active ? `<button class="card live-banner" data-a="openWorkout"><i class="pulse"></i><span class="grow"><b>${esc(S.active.name)}</b><small>Entreno en curso · toca para continuar</small></span>${icon('right')}</button>` : ''}
  <section class="card program">
    <div class="row-between"><div><div class="label">Programa actual</div><h2>${esc(S.programName || 'Rutinas propias')}</h2></div>
      <button class="btn sm ghost" data-a="newProgram">${icon('sparkle')} Generar</button></div>
    <p class="hint">Haz las rutinas en orden. La app te propone la siguiente y te dice qué peso usar.</p>
  </section>
  <div class="btn-row"><button class="btn ghost" data-a="emptyWorkout">${icon('bolt')} Entreno libre</button><button class="btn ghost" data-a="newRoutine">${icon('plus')} Nueva rutina</button></div>
  ${S.routines.length ? S.routines.map((r, i) => `
    <section class="card routine ${next && next.id === r.id ? 'is-next' : ''}">
      <div class="row-between">
        <div class="grow" data-a="editRoutine" data-id="${r.id}" role="button" tabindex="0">
          ${next && next.id === r.id ? '<span class="chip accent">Siguiente</span>' : `<span class="label">Día ${i + 1}</span>`}
          <h3>${esc(r.name)}</h3>
          <p class="muted sm">${r.exercises.length} ejercicios · ${r.exercises.reduce((a, e) => a + e.sets, 0)} series · ${estMinutes(r)} min${lastDone(r.id) ? ` · Última: ${lastDone(r.id)}` : ''}</p>
        </div>
        <button class="play-btn" data-a="startRoutine" data-id="${r.id}" aria-label="Empezar ${esc(r.name)}">${icon('play')}</button>
      </div>
      <p class="ex-line">${r.exercises.map(e => esc(exById(e.exId).name)).join(' · ')}</p>
    </section>`).join('') : empty('dumbbell', 'Sin rutinas', 'Genera un programa adaptado a tus días o crea una rutina desde cero.', `<button class="btn primary" data-a="newProgram">Generar programa</button>`)}
  `;
}

A.startRoutine = (el) => {
  const r = S.routines.find(x => x.id === el.dataset.id);
  if (!r) return;
  if (S.active) { toast('Ya tienes un entreno en curso'); A.openWorkout(); return; }
  startWorkout(r.name, r.id, r.exercises);
};
A.emptyWorkout = () => {
  if (S.active) { A.openWorkout(); return; }
  startWorkout('Entreno libre', null, []);
};
A.openWorkout = () => { ui.wkOpen = true; render(); };

A.newProgram = () => { ui.progDays = S.profile.days; openSheet('program'); };
SHEETS.program = () => ({
  title: 'Generar programa',
  body: `<p class="muted">Elige cuántos días entrenas. Sustituirá tus rutinas actuales (el historial se conserva).</p>
    <div class="days-pick">${[3, 4, 5, 6].map(n => `<button class="${ui.progDays === n ? 'on' : ''}" data-a="progDays" data-v="${n}"><b>${n}</b><span>días</span></button>`).join('')}</div>
    <div class="card inset"><b>${esc(PROGRAMS[ui.progDays].name)}</b><p class="muted sm">${esc(PROGRAMS[ui.progDays].why)}</p>
    <ul class="plain">${PROGRAMS[ui.progDays].routines.map(r => `<li><b>${esc(r.name)}</b><small>${r.items.map(it => esc(exById(it[0]).name)).join(', ')}</small></li>`).join('')}</ul></div>`,
  foot: `<button class="btn primary block" data-a="applyProgram">Usar este programa</button>`,
});
A.progDays = (el) => { ui.progDays = num(el.dataset.v); render(); };
A.applyProgram = () => {
  const p = generateProgram(ui.progDays);
  S.programName = p.name; S.routines = p.routines; S.profile.days = ui.progDays;
  closeSheet(); commit(); toast('Programa actualizado');
};

// ---------- Editor de rutina ----------
A.newRoutine = () => { ui.draftR = { id: null, name: '', exercises: [] }; openSheet('routineEdit'); };
A.editRoutine = (el) => {
  const r = S.routines.find(x => x.id === el.dataset.id);
  ui.draftR = JSON.parse(JSON.stringify(r));
  openSheet('routineEdit');
};
SHEETS.routineEdit = () => {
  const d = ui.draftR;
  return {
    title: d.id ? 'Editar rutina' : 'Nueva rutina', full: true,
    body: `<label class="field"><span>Nombre</span><input id="r-name" type="text" placeholder="Ej. Torso A" value="${esc(d.name)}" data-in="rName"></label>
      <div class="ed-list">
      ${d.exercises.map((e, i) => {
        const ex = exById(e.exId);
        return `<div class="ed-ex">
          <div class="ed-head"><div class="grow"><b>${esc(ex.name)}</b><small>${MUSCLES[ex.m]}</small></div>
            <button class="icon-btn sm" data-a="rMove" data-i="${i}" data-v="-1" aria-label="Subir" ${i === 0 ? 'disabled' : ''}>${icon('up')}</button>
            <button class="icon-btn sm" data-a="rMove" data-i="${i}" data-v="1" aria-label="Bajar" ${i === d.exercises.length - 1 ? 'disabled' : ''}>${icon('down')}</button>
            <button class="icon-btn sm danger" data-a="rDel" data-i="${i}" aria-label="Quitar">${icon('x')}</button></div>
          <div class="ed-grid">
            <label><span>Series</span><input id="r-${i}-sets" type="number" inputmode="numeric" min="1" max="10" value="${e.sets}" data-in="rField" data-i="${i}" data-k="sets"></label>
            <label><span>Reps mín.</span><input id="r-${i}-min" type="number" inputmode="numeric" min="1" value="${e.min}" data-in="rField" data-i="${i}" data-k="min"></label>
            <label><span>Reps máx.</span><input id="r-${i}-max" type="number" inputmode="numeric" min="1" value="${e.max}" data-in="rField" data-i="${i}" data-k="max"></label>
            <label><span>Descanso</span><select id="r-${i}-rest" data-in="rField" data-i="${i}" data-k="rest">${[45, 60, 90, 120, 150, 180, 240].map(s => `<option value="${s}" ${e.rest === s ? 'selected' : ''}>${s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : `0:${s}`}</option>`).join('')}</select></label>
          </div>
        </div>`;
      }).join('')}
      </div>
      <button class="btn block ghost" data-a="pickEx" data-mode="routine">${icon('plus')} Añadir ejercicios</button>
      ${d.id ? `<button class="btn block text danger" data-a="rDelete">Eliminar rutina</button>` : ''}`,
    foot: `<button class="btn primary block" data-a="rSave">Guardar rutina</button>`,
  };
};
IN.rName = (el) => { ui.draftR.name = el.value; };
IN.rField = (el) => { ui.draftR.exercises[+el.dataset.i][el.dataset.k] = Math.max(1, Math.round(num(el.value))); };
A.rMove = (el) => {
  const i = +el.dataset.i, j = i + num(el.dataset.v), arr = ui.draftR.exercises;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]]; render();
};
A.rDel = (el) => { ui.draftR.exercises.splice(+el.dataset.i, 1); render(); };
A.rSave = () => {
  const d = ui.draftR;
  if (!d.name.trim()) d.name = `Rutina ${S.routines.length + 1}`;
  if (!d.exercises.length) { toast('Añade al menos un ejercicio'); return; }
  for (const e of d.exercises) if (e.max < e.min) [e.min, e.max] = [e.max, e.min];
  if (d.id) S.routines = S.routines.map(r => r.id === d.id ? d : r);
  else { d.id = uid(); S.routines.push(d); }
  closeSheet(); commit(); toast('Rutina guardada');
};
A.rDelete = () => {
  const id = ui.draftR.id;
  confirmBox({ title: '¿Eliminar rutina?', text: 'El historial de entrenos se mantiene.', ok: 'Eliminar', danger: true,
    onOk: () => { S.routines = S.routines.filter(r => r.id !== id); ui.sheets = []; commit(); } });
};

// ---------- Selector de ejercicios ----------
A.pickEx = (el) => { ui.pick = { mode: el.dataset.mode, q: '', m: '', sel: [], idx: el.dataset.i }; openSheet('exPicker'); };
function exMatches(q, m) {
  const qq = q.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return allExercises().filter(e => (!m || e.m === m) && (!qq || e.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(qq)));
}
function exResults() {
  const p = ui.pick, list = exMatches(p.q, p.m);
  return list.length ? list.map(e => `<button class="row ex-row ${p.sel.includes(e.id) ? 'sel' : ''}" data-a="pickToggle" data-id="${e.id}">
      <span class="mk m-${e.m}"></span><span class="grow"><b>${esc(e.name)}</b><small>${MUSCLES[e.m]} · ${EQUIP[e.eq]}</small></span>
      <i class="tick">${p.sel.includes(e.id) ? icon('check') : ''}</i></button>`).join('')
    : `<p class="muted center pad">No hay resultados. Puedes crear el ejercicio.</p>`;
}
SHEETS.exPicker = () => {
  const p = ui.pick, single = p.mode === 'swap';
  return {
    title: single ? 'Cambiar ejercicio' : 'Añadir ejercicios', full: true,
    body: `<div class="search">${icon('search')}<input id="ex-q" type="search" placeholder="Buscar ejercicio" value="${esc(p.q)}" data-in="pickQ" autocomplete="off"></div>
      <div class="chips scroll-x">${[['', 'Todos'], ...Object.entries(MUSCLES)].map(([k, l]) => `<button class="chip ${p.m === k ? 'on' : ''}" data-a="pickM" data-v="${k}">${l}</button>`).join('')}</div>
      <div class="list flush" id="ex-results">${exResults()}</div>
      <button class="btn block ghost" data-a="newCustomEx">${icon('plus')} Crear ejercicio personalizado</button>`,
    foot: single ? '' : `<button class="btn primary block" data-a="pickDone" ${p.sel.length ? '' : 'disabled'}>Añadir${p.sel.length ? ` (${p.sel.length})` : ''}</button>`,
  };
};
IN.pickQ = (el) => { ui.pick.q = el.value; document.getElementById('ex-results').innerHTML = exResults(); };
A.pickM = (el) => { ui.pick.m = el.dataset.v; render(); };
A.pickToggle = (el) => {
  const p = ui.pick, id = el.dataset.id;
  if (p.mode === 'swap') { p.sel = [id]; A.pickDone(); return; }
  p.sel = p.sel.includes(id) ? p.sel.filter(x => x !== id) : [...p.sel, id];
  render();
};
A.pickDone = () => {
  const p = ui.pick;
  if (p.mode === 'routine') {
    for (const id of p.sel) {
      const ex = exById(id);
      const compound = (ex.sec || []).length > 0;
      ui.draftR.exercises.push({ exId: id, sets: 3, min: compound ? 6 : 10, max: compound ? 10 : 15, rest: compound ? 150 : 90 });
    }
  } else if (p.mode === 'workout') addExercisesToWorkout(p.sel);
  else if (p.mode === 'swap') { swapWorkoutExercise(+p.idx, p.sel[0]); ui.sheets.pop(); }
  closeSheet();
};

A.newCustomEx = () => { ui.cex = { name: ui.pick?.q || '', m: ui.pick?.m || 'pecho', eq: 'maquina' }; openSheet('customEx'); };
SHEETS.customEx = () => ({
  title: 'Nuevo ejercicio',
  body: `<label class="field"><span>Nombre</span><input id="cex-name" type="text" value="${esc(ui.cex.name)}" data-in="cexName"></label>
    <div class="field"><span>Músculo principal</span><div class="chips wrap">${Object.entries(MUSCLES).map(([k, l]) => `<button class="chip ${ui.cex.m === k ? 'on' : ''}" data-a="cexSet" data-k="m" data-v="${k}">${l}</button>`).join('')}</div></div>
    <div class="field"><span>Material</span><div class="chips wrap">${Object.entries(EQUIP).map(([k, l]) => `<button class="chip ${ui.cex.eq === k ? 'on' : ''}" data-a="cexSet" data-k="eq" data-v="${k}">${l}</button>`).join('')}</div></div>`,
  foot: `<button class="btn primary block" data-a="cexSave">Crear</button>`,
});
IN.cexName = (el) => { ui.cex.name = el.value; };
A.cexSet = (el) => { ui.cex[el.dataset.k] = el.dataset.v; render(); };
A.cexSave = () => {
  if (!ui.cex.name.trim()) { toast('Escribe un nombre'); return; }
  const ex = { id: 'c-' + uid(), name: ui.cex.name.trim(), m: ui.cex.m, eq: ui.cex.eq, inc: ui.cex.eq === 'maquina' ? 5 : 2.5, tip: '', sec: [], custom: true };
  S.customExercises = [...(S.customExercises || []), ex];
  save();
  closeSheet();
  if (ui.pick && ui.sheets[ui.sheets.length - 1]?.type === 'exPicker') { ui.pick.q = ''; ui.pick.m = ''; A.pickToggle({ dataset: { id: ex.id } }); }
  else render();
  toast('Ejercicio creado');
};

// ---------- Biblioteca ----------
function libraryTab() {
  ui.lib = ui.lib || { q: '', m: '' };
  return `<div class="search">${icon('search')}<input id="lib-q" type="search" placeholder="Buscar ejercicio" value="${esc(ui.lib.q)}" data-in="libQ" autocomplete="off"></div>
    <div class="chips scroll-x">${[['', 'Todos'], ...Object.entries(MUSCLES)].map(([k, l]) => `<button class="chip ${ui.lib.m === k ? 'on' : ''}" data-a="libM" data-v="${k}">${l}</button>`).join('')}</div>
    <section class="card list flush" id="lib-results">${libResults()}</section>`;
}
function libResults() {
  const list = exMatches(ui.lib.q, ui.lib.m);
  return list.map(e => {
    const best = bestE1rm(e.id);
    return `<button class="row ex-row" data-a="exDetail" data-id="${e.id}"><span class="mk m-${e.m}"></span>
      <span class="grow"><b>${esc(e.name)}</b><small>${MUSCLES[e.m]} · ${EQUIP[e.eq]}</small></span>
      ${best ? `<span class="pr-mini num">${fmtNum(best, 0)} kg</span>` : ''}${icon('right', 'dim')}</button>`;
  }).join('') || `<p class="muted center pad">Sin resultados</p>`;
}
IN.libQ = (el) => { ui.lib.q = el.value; document.getElementById('lib-results').innerHTML = libResults(); };
A.libM = (el) => { ui.lib.m = el.dataset.v; render(); };

A.exDetail = (el) => openSheet('exDetail', { id: el.dataset.id });
SHEETS.exDetail = ({ id }) => {
  const e = exById(id);
  const hist = S.sessions.filter(s => s.exercises.some(x => x.exId === id && workingSets(x).length));
  const pts = hist.map(s => {
    const x = s.exercises.find(q => q.exId === id);
    return { x: s.start, y: Math.max(...workingSets(x).map(st => e1rm(st.kg, st.reps))) };
  });
  let bestSet = null;
  for (const s of hist) for (const st of workingSets(s.exercises.find(q => q.exId === id))) if (!bestSet || st.kg > bestSet.kg || (st.kg === bestSet.kg && st.reps > bestSet.reps)) bestSet = st;
  return {
    title: e.name, full: true,
    body: `<div class="chips"><span class="chip soft m-${e.m}-t">${MUSCLES[e.m]}</span>${(e.sec || []).map(m => `<span class="chip soft">${MUSCLES[m]}</span>`).join('')}<span class="chip soft">${EQUIP[e.eq]}</span></div>
      ${e.tip ? `<div class="card inset tipbox">${icon('info')}<p>${esc(e.tip)}</p></div>` : ''}
      ${hist.length ? `
        <div class="stats3">
          <div class="stat"><span class="label">1RM estimado</span><b class="num">${fmtNum(bestE1rm(id), 1)}</b><small>kg</small></div>
          <div class="stat"><span class="label">Mejor serie</span><b class="num">${fmtNum(bestSet.kg, 1)}×${bestSet.reps}</b><small>kg × reps</small></div>
          <div class="stat"><span class="label">Sesiones</span><b class="num">${hist.length}</b><small>total</small></div>
        </div>
        <h3 class="section-t">Evolución del 1RM estimado</h3>
        <div class="card chart-card">${lineChart(pts, { unit: ' kg', id: 'exd' })}</div>
        <h3 class="section-t">Últimas sesiones</h3>
        <div class="card list">${hist.slice(-6).reverse().map(s => {
          const x = s.exercises.find(q => q.exId === id);
          return `<div class="row col"><div class="row-between"><b>${fmtDay(dayKey(s.start))}</b><small class="muted">${esc(s.name)}</small></div>
            <div class="set-pills">${workingSets(x).map(st => `<span>${fmtNum(st.kg, 2)}×${st.reps}</span>`).join('')}</div></div>`;
        }).join('')}</div>`
      : `<p class="muted center pad">Aún no has registrado este ejercicio.</p>`}
      ${e.custom ? `<button class="btn block text danger" data-a="delCustomEx" data-id="${id}">Eliminar ejercicio personalizado</button>` : ''}`,
  };
};
A.delCustomEx = (el) => {
  const id = el.dataset.id;
  if (S.routines.some(r => r.exercises.some(e => e.exId === id))) { toast('Quítalo antes de tus rutinas'); return; }
  S.customExercises = S.customExercises.filter(e => e.id !== id);
  closeSheet(); commit();
};

// ---------- Historial ----------
function historyTab() {
  if (!S.sessions.length) return empty('calendar', 'Sin entrenos todavía', 'Cuando termines tu primer entreno aparecerá aquí con todas tus series.');
  const groups = {};
  for (const s of [...S.sessions].reverse()) {
    const d = new Date(s.start), k = `${d.getFullYear()}-${d.getMonth()}`;
    (groups[k] = groups[k] || { label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, items: [] }).items.push(s);
  }
  return Object.values(groups).map(g => `<h3 class="section-t cap">${g.label} · ${g.items.length} entrenos</h3>
    ${g.items.map(s => {
      const st = sessionStats(s);
      return `<button class="card hist" data-a="sessionDetail" data-id="${s.id}">
        <div class="hist-date"><b class="num">${new Date(s.start).getDate()}</b><span>${fmtDay(dayKey(s.start)).split(' ')[0]}</span></div>
        <div class="grow"><b>${esc(s.name)}</b>
          <small class="muted">${fmtMin(s.end - s.start)} · ${st.sets} series · ${fmtNum(st.volume, 0)} kg</small>
          ${s.prs?.length ? `<span class="chip warm sm">${icon('trophy')} ${s.prs.length} ${s.prs.length === 1 ? 'récord' : 'récords'}</span>` : ''}</div>
        ${icon('right', 'dim')}</button>`;
    }).join('')}`).join('');
}

A.sessionDetail = (el) => openSheet('session', { id: el.dataset.id });
SHEETS.session = ({ id }) => {
  const s = S.sessions.find(x => x.id === id);
  if (!s) return { title: 'Entreno', body: '' };
  const st = sessionStats(s);
  return {
    title: s.name, full: true,
    body: `<p class="muted">${fmtDay(dayKey(s.start), true)} · ${new Date(s.start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
      <div class="stats3">
        <div class="stat"><span class="label">Duración</span><b class="num">${fmtMin(s.end - s.start)}</b></div>
        <div class="stat"><span class="label">Series</span><b class="num">${st.sets}</b></div>
        <div class="stat"><span class="label">Volumen</span><b class="num">${fmtNum(st.volume, 0)}</b><small>kg</small></div>
      </div>
      ${s.exercises.map(x => {
        const e = exById(x.exId), pr = s.prs?.includes(x.exId);
        return `<div class="card sess-ex"><div class="row-between"><b>${esc(e.name)}</b>${pr ? `<span class="chip warm sm">${icon('trophy')} Récord</span>` : ''}</div>
          <table class="sets-t"><tbody>${x.sets.filter(q => q.done).map((q, i) => `<tr><td class="muted">${q.w ? 'C' : i + 1 - x.sets.filter((z, j) => j < i && z.w && z.done).length}</td><td class="num">${fmtNum(q.kg, 2)} kg</td><td class="num">× ${q.reps}</td><td class="muted num">${q.w ? 'calentamiento' : `1RM ${fmtNum(e1rm(q.kg, q.reps), 1)}`}</td></tr>`).join('') || '<tr><td class="muted">Sin series</td></tr>'}</tbody></table></div>`;
      }).join('')}
      ${s.notes ? `<div class="card inset"><b>Notas</b><p>${esc(s.notes)}</p></div>` : ''}
      <div class="btn-row"><button class="btn ghost danger" data-a="delSession" data-id="${s.id}">${icon('trash')} Borrar</button><button class="btn ghost" data-a="repeatSession" data-id="${s.id}">${icon('swap')} Repetir</button></div>`,
  };
};
A.delSession = (el) => {
  const id = el.dataset.id;
  confirmBox({ title: '¿Borrar este entreno?', text: 'Se perderán sus series y récords.', ok: 'Borrar', danger: true,
    onOk: () => { S.sessions = S.sessions.filter(s => s.id !== id); ui.sheets = []; commit(); } });
};
A.repeatSession = (el) => {
  const s = S.sessions.find(x => x.id === el.dataset.id);
  if (S.active) { toast('Ya tienes un entreno en curso'); return; }
  ui.sheets = [];
  startWorkout(s.name, s.routineId, s.exercises.map(x => ({ exId: x.exId, sets: Math.max(1, workingSets(x).length), min: x.min || 8, max: x.max || 12, rest: x.rest || 90 })));
};
