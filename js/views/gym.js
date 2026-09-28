// Mi gimnasio (material disponible) y planificador del programa de entreno.
import { S, ui, A, SHEETS, render, commit, save, esc, num, openSheet, closeSheet, confirmBox, toast } from '../core.js';
import { exById, generateProgram, trainingOpts, adaptRoutines, blockedInRoutines, estMinutesItems, gymEquip, EXPERIENCE, plannedWeeklySets } from '../coach.js';
import { STYLES, ZONES, recommendedSplit, cycleLength } from '../data/splits.js';
import { MUSCLES, WEEKLY_SETS } from '../data/exercises.js';
import { EQUIPMENT_GROUPS, EQUIPMENT, GYM_PRESETS, WEEKDAYS, SESSION_TIMES, FOCUS } from '../data/equipment.js';
import { icon } from '../ui.js';

// ---------- Piezas reutilizables (también en el onboarding) ----------
export function presetOf(list) {
  const set = new Set(list);
  return Object.entries(GYM_PRESETS).find(([, p]) => p.equip.length === set.size && p.equip.every(x => set.has(x)))?.[0] || 'personal';
}

export function equipPicker(list, act = 'gymToggle') {
  const set = new Set(list), preset = presetOf(list);
  return `<div class="opts">${Object.entries(GYM_PRESETS).map(([k, p]) => `
      <button type="button" class="opt ${preset === k ? 'on' : ''}" data-a="${act}" data-preset="${k}"><b>${p.name}</b><span>${p.desc}</span></button>`).join('')}
    </div>
    <p class="hint">${preset === 'personal' ? 'Selección personalizada' : 'Marca o desmarca'} · ${set.size} de ${Object.keys(EQUIPMENT).length} elementos.</p>
    ${EQUIPMENT_GROUPS.map(g => `<div class="eq-group"><h3 class="label">${g.name}</h3><div class="eq-list">
      ${g.items.map(([id, label]) => `<button type="button" class="eq ${set.has(id) ? 'on' : ''}" data-a="${act}" data-id="${id}" aria-pressed="${set.has(id)}"><i>${set.has(id) ? icon('check') : ''}</i><span>${label}</span></button>`).join('')}
    </div></div>`).join('')}`;
}
// Cambia un elemento o aplica una plantilla sobre la lista dada
export function toggleEquip(list, el) {
  if (el.dataset.preset) return [...GYM_PRESETS[el.dataset.preset].equip];
  const id = el.dataset.id;
  return list.includes(id) ? list.filter(x => x !== id) : [...list, id];
}

export function weekdayPick(wd, act) {
  return `<div class="wd-pick">${WEEKDAYS.map(([v, s, l]) => `<button type="button" class="${wd.includes(v) ? 'on' : ''}" data-a="${act}" data-v="${v}" aria-pressed="${wd.includes(v)}" aria-label="${l}">${s}</button>`).join('')}</div>`;
}
export const toggleDay = (wd, v) => wd.includes(v) ? wd.filter(x => x !== v) : [...wd, v];
export const daysLabel = wd => {
  const n = wd.length;
  if (n < 2) return 'Elige al menos 2 días';
  if (n > 6) return 'Deja al menos 1 día de descanso';
  return `${n} días: ${WEEKDAYS.filter(w => wd.includes(w[0])).map(w => w[2].toLowerCase()).join(', ')}`;
};

export function timePick(min, act) {
  return `<div class="chips">${SESSION_TIMES.map(t => `<button type="button" class="chip ${min === t ? 'on' : ''}" data-a="${act}" data-v="${t}">${t} min</button>`).join('')}</div>`;
}
export function focusPick(focus, act) {
  return `<div class="chips">${Object.entries(FOCUS).map(([k, f]) => `<button type="button" class="chip ${focus.includes(k) ? 'on' : ''}" data-a="${act}" data-v="${k}">${f.label}</button>`).join('')}</div>`;
}
export const toggleFocus = (focus, v) => focus.includes(v) ? focus.filter(x => x !== v) : [...focus, v].slice(-2);

export function programPreview(opts, equip) {
  const n = opts.weekdays.length;
  if (n < 2 || n > 6) return `<div class="card inset"><p class="muted">${daysLabel(opts.weekdays)} para generar el programa.</p></div>`;
  const p = generateProgram(opts, new Set(equip));
  const ch = p.changes;
  const ws = plannedWeeklySets(p.routines, opts);
  const main = ['pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'cuadriceps', 'femoral', 'gluteo'];
  const setsBlock = `<div class="pp-sets"><span class="label">Series por semana (óptimo ${WEEKLY_SETS.min}-${WEEKLY_SETS.max})</span>
    <div class="pp-sets-grid">${main.map(m => { const v = Math.round(ws[m] || 0); const st = v < WEEKLY_SETS.min * 0.7 ? 'low' : v < WEEKLY_SETS.min ? 'mid' : v <= WEEKLY_SETS.max + 2 ? 'ok' : 'high';
      return `<div class="pps ${st}"><b class="num">${v}</b><span>${MUSCLES[m]}</span></div>`; }).join('')}</div></div>`;
  return `<div class="card inset prog-prev">
    <b class="pp-name">${esc(p.name)}</b><p class="muted sm">${esc(p.why)}</p>
    ${p.routines.map(r => `<div class="pp-r"><div class="row-between"><b>${esc(r.name)}</b><small class="muted num">${estMinutesItems(r.exercises)} min</small></div>
      <ul>${r.exercises.map(e => `<li><span>${esc(exById(e.exId).name)}</span><small class="num">${e.sets}×${e.min}-${e.max}</small></li>`).join('')}</ul></div>`).join('')}
    ${setsBlock}
    ${ch.length ? `<div class="pp-changes"><span class="label">${icon('swap')} Adaptado a tu material</span>
      <ul>${ch.map(c => `<li>${esc(exById(c.from).name)} → ${c.to ? `<b>${esc(exById(c.to).name)}</b>` : '<i>sin alternativa, se quita</i>'}</li>`).join('')}</ul></div>` : ''}
  </div>`;
}

// ---------- Hoja: Mi gimnasio ----------
A.openGym = () => { ui.gymDraft = [...gymEquip()]; openSheet('gym'); };
SHEETS.gym = () => ({
  title: 'Mi gimnasio', full: true,
  body: `<p class="muted">Marca lo que hay en tu gimnasio. Las rutinas solo usarán ejercicios que puedas hacer ahí.</p>${equipPicker(ui.gymDraft)}`,
  foot: `<button class="btn primary block" data-a="gymSave">Guardar material</button>`,
});
A.gymToggle = (el) => { ui.gymDraft = toggleEquip(ui.gymDraft, el); render(); };
A.gymSave = () => {
  S.gym = { equip: [...ui.gymDraft] };
  save();
  closeSheet();
  // Si venimos del planificador, su vista previa se actualiza sola
  if (ui.sheets[ui.sheets.length - 1]?.type === 'planner') { toast('Material guardado'); return; }
  const blocked = blockedInRoutines();
  if (blocked) {
    confirmBox({
      title: 'Adaptar tus rutinas',
      text: `${blocked} ${blocked === 1 ? 'ejercicio de tus rutinas necesita' : 'ejercicios de tus rutinas necesitan'} material que no tienes. ¿Los cambio por alternativas equivalentes?`,
      ok: 'Adaptar rutinas',
      onOk: () => { const n = adaptRoutines(); save(); toast(`${n} ${n === 1 ? 'ejercicio cambiado' : 'ejercicios cambiados'}`); },
    });
  } else { commit(); toast('Material guardado'); }
};

// ---------- Hoja: Planificador ----------
A.openPlanner = () => {
  const o = trainingOpts();
  ui.pg = { weekdays: [...o.weekdays], sessionMin: o.sessionMin, focus: [...o.focus], exp: o.exp, style: o.style, split: { ...o.split } };
  ui.pg.splitCustom = JSON.stringify(o.split) !== JSON.stringify(recommendedSplit(o.weekdays.length));
  openSheet('planner');
};
SHEETS.planner = () => {
  const d = ui.pg, equip = [...gymEquip()], preset = presetOf(equip);
  return {
    title: 'Planificar entrenamiento', full: true,
    body: `
      <div class="field"><span>¿Qué días vas a ir?</span>${weekdayPick(d.weekdays, 'pgDay')}<small class="hint">${daysLabel(d.weekdays)}</small></div>
      <div class="field"><span>Estilo de rutina</span>${stylePick(d)}</div>
      ${d.style === 'split' ? splitEditor(d) : ''}
      <div class="field"><span>Tiempo por sesión</span>${timePick(d.sessionMin, 'pgTime')}</div>
      <div class="field"><span>Experiencia</span><div class="seg sm">${Object.entries(EXPERIENCE).map(([k, l]) => `<button type="button" class="${d.exp === k ? 'on' : ''}" data-a="pgExp" data-v="${k}">${l}</button>`).join('')}</div></div>
      <div class="field"><span>Prioridad muscular (hasta 2)</span>${focusPick(d.focus, 'pgFocus')}<small class="hint">Añade una serie extra a esos músculos.</small></div>
      <button class="row gym-row" data-a="openGym">${icon('dumbbell')}<span class="grow"><b>Material</b><small>${preset === 'personal' ? 'Personalizado' : GYM_PRESETS[preset].name} · ${equip.length} elementos</small></span><span class="chip">Editar</span></button>
      <h3 class="section-t">Vista previa</h3>
      ${programPreview(d, equip)}`,
    foot: `<button class="btn primary block" data-a="pgApply" ${d.weekdays.length < 2 || d.weekdays.length > 6 ? 'disabled' : ''}>Usar este programa</button>`,
  };
};
A.pgDay = (el) => {
  ui.pg.weekdays = toggleDay(ui.pg.weekdays, num(el.dataset.v));
  if (!ui.pg.splitCustom && ui.pg.weekdays.length >= 2) ui.pg.split = { ...recommendedSplit(ui.pg.weekdays.length) };
  render();
};
A.pgStyle = (el) => { ui.pg.style = el.dataset.v; render(); };
A.pgZone = (el) => {
  const z = el.dataset.z, sp = ui.pg.split;
  const next = Math.max(0, Math.min(ZONES[z].max, (sp[z] || 0) + num(el.dataset.v)));
  const total = Object.values({ ...sp, [z]: next }).reduce((a, b) => a + b, 0);
  if (total < 2) { toast('El ciclo necesita al menos 2 días'); return; }
  sp[z] = next; ui.pg.splitCustom = true; render();
};
A.pgSplitRec = () => { ui.pg.split = { ...recommendedSplit(ui.pg.weekdays.length) }; ui.pg.splitCustom = false; render(); };

function stylePick(d) {
  return `<div class="opts">${Object.entries(STYLES).map(([k, st]) => `<button type="button" class="opt ${d.style === k ? 'on' : ''}" data-a="pgStyle" data-v="${k}">
    <b>${st.label}${k === 'auto' ? ' <em class="rec">Recomendado</em>' : ''}</b><span>${st.desc}</span></button>`).join('')}</div>`;
}

const listJoin = a => a.length > 1 ? `${a.slice(0, -1).join(', ')} y ${a[a.length - 1]}` : a[0];

function splitEditor(d) {
  const sp = d.split, days = d.weekdays.length, cyc = cycleLength(d);
  const rec = recommendedSplit(days);
  const isRec = Object.keys(ZONES).every(z => (sp[z] || 0) === rec[z]);
  const hints = { hombro: 'Con 0 se trabaja en los días de pecho y espalda', brazos: 'Con 0, tríceps con pecho y bíceps con espalda (recomendado)' };
  const perWeek = z => (sp[z] || 0) * days / cyc;
  const once = Object.keys(ZONES).filter(z => ['pecho', 'espalda', 'pierna'].includes(z) && perWeek(z) < 1.5);
  return `<div class="card inset split-ed">
    <span class="label">Días por zona en cada ciclo</span>
    ${Object.entries(ZONES).map(([z, info]) => `<div class="zone-row"><div class="grow"><b>${info.label}</b>${hints[z] && !(sp[z] || 0) ? `<small>${hints[z]}</small>` : `<small>${Number.isInteger(perWeek(z)) ? perWeek(z) : perWeek(z).toFixed(1).replace('.', ',')} ${perWeek(z) === 1 ? 'vez' : 'veces'} por semana</small>`}</div>
      <div class="stepper sm"><button type="button" data-a="pgZone" data-z="${z}" data-v="-1" aria-label="Menos días de ${info.label}" ${(sp[z] || 0) === 0 ? 'disabled' : ''}>${icon('minus')}</button><span class="num">${sp[z] || 0}</span><button type="button" data-a="pgZone" data-z="${z}" data-v="1" aria-label="Más días de ${info.label}" ${(sp[z] || 0) >= info.max ? 'disabled' : ''}>${icon('plus')}</button></div></div>`).join('')}
    <p class="hint">Ciclo de <b>${cyc} días</b> y vas <b>${days} días</b> a la semana.${cyc === days ? ' Cada semana completas el ciclo.' : cyc > days ? ' El ciclo sigue rotando de una semana a la siguiente.' : ' Algunas semanas repetirás parte del ciclo.'}</p>
    ${once.length ? `<div class="advice-mini">${icon('info')}<span>${listJoin(once.map((z, i) => i ? ZONES[z].label.toLowerCase() : ZONES[z].label))} ${once.length === 1 ? 'se entrena' : 'se entrenan'} menos de 2 veces por semana. Para ganar masa rinde más entrenar cada músculo 2 veces: si puedes, sube a 2 lo que más quieras desarrollar.</span></div>` : ''}
    ${isRec ? '' : `<button type="button" class="btn sm ghost" data-a="pgSplitRec">${icon('sparkle')} Usar reparto recomendado para ${days} días</button>`}
  </div>`;
}
A.pgTime = (el) => { ui.pg.sessionMin = num(el.dataset.v); render(); };
A.pgExp = (el) => { ui.pg.exp = el.dataset.v; render(); };
A.pgFocus = (el) => { ui.pg.focus = toggleFocus(ui.pg.focus, el.dataset.v); render(); };
A.pgApply = () => {
  const d = ui.pg;
  const apply = () => {
    const p = generateProgram(d);
    Object.assign(S.profile, { weekdays: [...d.weekdays], days: d.weekdays.length, sessionMin: d.sessionMin, focus: [...d.focus], exp: d.exp, style: d.style, split: { ...d.split } });
    S.programName = p.name; S.routines = p.routines;
    ui.sheets = []; commit(); toast('Programa actualizado');
  };
  if (S.routines.length) confirmBox({ title: '¿Sustituir tus rutinas?', text: 'Se crearán rutinas nuevas. Tu historial de entrenos se conserva.', ok: 'Sustituir', onOk: apply });
  else apply();
};
