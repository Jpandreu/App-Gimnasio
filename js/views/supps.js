// Suplementación: tu stack, registro diario, rachas y guía basada en evidencia.
import { S, ui, A, IN, SHEETS, render, commit, save, esc, num, uid, fmtNum, dayKey, addDays, parseDay, openSheet, closeSheet, confirmBox, toast, DOW } from '../core.js';
import { foodById, dayLog, makeLogItem, isTrainingDay, creatineStartedDaysAgo } from '../coach.js';
import { SUPP_LIBRARY, SUPP_BY_KEY, SUPP_TIMES, EVIDENCE, NOT_WORTH } from '../data/supplements.js';
import { icon } from '../ui.js';

const TIME_ORDER = ['manana', 'pre', 'post', 'comida', 'cualquiera', 'noche'];
const byTime = (a, b) => TIME_ORDER.indexOf(a.time) - TIME_ORDER.indexOf(b.time);
const doseLabel = s => `${fmtNum(s.dose, 1)} ${s.unit}`;

// ¿Toca este suplemento en esta fecha?
export function dueOn(s, k) {
  if (s.start && k < s.start) return false;
  if (s.when !== 'training') return true;
  const trained = S.sessions.some(x => dayKey(x.start) === k);
  return trained || isTrainingDay(parseDay(k));
}
export const takenOn = (s, k) => !!S.suppLog?.[k]?.[s.id];

export function streak(s) {
  let k = dayKey(), n = 0;
  if (!takenOn(s, k)) k = addDays(k, -1); // hoy aún se puede tomar
  for (let i = 0; i < 400; i++) {
    if (dueOn(s, k)) { if (takenOn(s, k)) n++; else break; }
    else if (s.start && k < s.start) break;
    k = addDays(k, -1);
  }
  return n;
}

function adherence(s, days = 28) {
  let due = 0, ok = 0;
  for (let i = 0; i < days; i++) { const k = addDays(dayKey(), -i); if (dueOn(s, k)) { due++; if (takenOn(s, k)) ok++; } }
  return due ? Math.round((ok / due) * 100) : 0;
}

// Marcar / desmarcar. Si el suplemento tiene alimento asociado, se añade al diario.
function mealNow() {
  const h = new Date().getHours();
  return h < 11 ? 'desayuno' : h < 13 ? 'almuerzo' : h < 17 ? 'comida' : h < 20 ? 'merienda' : 'cena';
}
A.suppToggle = (el) => {
  const s = S.supps.find(x => x.id === el.dataset.id), k = el.dataset.k || dayKey();
  if (!s) return;
  S.suppLog = S.suppLog || {};
  const day = S.suppLog[k] || (S.suppLog[k] = {});
  const food = s.food && s.addToLog ? foodById(s.food) : null;
  if (day[s.id]) {
    if (typeof day[s.id] === 'string') { const l = dayLog(k); l.items = l.items.filter(i => i.id !== day[s.id]); }
    delete day[s.id];
  } else {
    if (food && s.unit === 'g') {
      const item = makeLogItem(food, s.dose, s.time === 'noche' ? 'cena' : mealNow());
      dayLog(k).items.push(item);
      day[s.id] = item.id;
      toast(`${s.name} tomada · añadida a tu diario`);
    } else {
      day[s.id] = true;
      const st = streak(s);
      if (st > 1) toast(`${s.name}: ${st} días seguidos`);
    }
    try { navigator.vibrate?.(12); } catch { /* */ }
  }
  commit();
};

// ---------- Tarjeta en Hoy ----------
export function suppTodayCard() {
  const k = dayKey();
  const list = (S.supps || []).filter(s => dueOn(s, k)).sort(byTime);
  if (!(S.supps || []).length) {
    return `<section class="card supp-card">
      <div class="label">${icon('pill')} Suplementos</div>
      <p class="muted">Registra lo que tomas y la app te lleva la cuenta cada día.</p>
      <div class="btn-row"><button class="btn primary soft" data-a="suppQuickCreatine">${icon('plus')} Creatina 5 g diaria</button><button class="btn ghost" data-a="goSupps">Otros</button></div>
    </section>`;
  }
  if (!list.length) return '';
  const done = list.filter(s => takenOn(s, k)).length;
  return `<section class="card supp-card">
    <div class="row-between"><div class="label">${icon('pill')} Suplementos de hoy</div><span class="chip ${done === list.length ? 'ok' : ''}">${done}/${list.length}</span></div>
    <div class="supp-list">${list.map(s => {
      const t = takenOn(s, k), st = streak(s);
      return `<button class="supp-row ${t ? 'on' : ''}" data-a="suppToggle" data-id="${s.id}" aria-pressed="${t}">
        <i class="supp-check">${t ? icon('check') : ''}</i>
        <span class="grow"><b>${esc(s.name)}</b><small>${doseLabel(s)} · ${SUPP_TIMES[s.time]}</small></span>
        ${st >= 2 ? `<span class="chip warm sm">${icon('fire')} ${st}</span>` : ''}
      </button>`;
    }).join('')}</div>
  </section>`;
}
A.goSupps = () => { ui.sub.nutri = 'supps'; location.hash = 'nutricion'; if (ui.tab === 'nutricion') render(); };
A.suppQuickCreatine = () => { addFromLibrary('creatina'); commit(); toast('Creatina añadida: 5 g cada día'); };

function addFromLibrary(key) {
  const lib = SUPP_BY_KEY[key];
  const s = { id: uid(), key, name: lib.name, dose: lib.dose, unit: lib.unit, time: lib.time, when: lib.when, food: lib.food || null, addToLog: !!lib.food, start: dayKey() };
  if (key === 'cafeina' && S.profile) s.dose = Math.round((S.profile.weight * 3) / 10) * 10;
  S.supps = [...(S.supps || []), s];
  return s;
}

// ---------- Pestaña en Nutrición ----------
export function suppsTab() {
  const list = [...(S.supps || [])].sort(byTime);
  const last14 = Array.from({ length: 14 }, (_, i) => addDays(dayKey(), i - 13));
  return `
  ${list.length ? `<h3 class="section-t">Tu suplementación</h3>
    ${list.map(s => {
      const lib = SUPP_BY_KEY[s.key], st = streak(s);
      return `<section class="card supp-item">
        <div class="row-between"><div class="grow"><b class="supp-name">${esc(s.name)}</b>
          <small class="muted">${doseLabel(s)} · ${SUPP_TIMES[s.time]} · ${s.when === 'training' ? 'días de entreno' : 'todos los días'}</small></div>
          <button class="icon-btn sm" data-a="suppEdit" data-id="${s.id}" aria-label="Editar ${esc(s.name)}">${icon('edit')}</button></div>
        <div class="supp-days">${last14.map(k => `<button class="sd ${takenOn(s, k) ? 'on' : dueOn(s, k) ? (k === dayKey() ? 'today' : 'miss') : 'off'}" data-a="suppToggle" data-id="${s.id}" data-k="${k}" aria-label="${k}" ${dueOn(s, k) || takenOn(s, k) ? '' : 'disabled'}><span>${DOW[parseDay(k).getDay()].charAt(0)}</span></button>`).join('')}</div>
        <div class="supp-stats"><span>${icon('fire')} <b class="num">${st}</b> ${st === 1 ? 'día' : 'días'} seguidos</span><span><b class="num">${adherence(s)}%</b> últimas 4 semanas</span></div>
        ${s.key === 'creatina' ? creatineNote() : lib?.note ? `<p class="hint">${esc(lib.note)}</p>` : ''}
      </section>`;
    }).join('')}`
  : `<section class="card"><p class="muted">Añade los suplementos que tomas. Podrás marcarlos cada día desde la pantalla Hoy y ver tu constancia.</p></section>`}
  <button class="btn block ghost" data-a="suppAdd">${icon('plus')} Añadir suplemento</button>

  <h3 class="section-t">Qué funciona</h3>
  ${SUPP_LIBRARY.slice(0, 5).map(l => `<details class="card acc"><summary><span class="grow"><b>${l.name}</b> <em class="ev ev-${l.ev}">${EVIDENCE[l.ev]}</em></span>${icon('down', 'dim')}</summary>
    <p>${esc(l.why)}</p><p><b>Cómo:</b> ${esc(l.how)}</p>${l.note ? `<p>${esc(l.note)}</p>` : ''}</details>`).join('')}
  <h3 class="section-t">No merece la pena</h3>
  <section class="card list">${NOT_WORTH.map(([t, d]) => `<div class="row">${icon('x', 'neg')}<span class="grow"><b>${t}</b><small>${d}</small></span></div>`).join('')}</section>
  <p class="foot-note">Consulta con un médico antes de tomar suplementos si tienes alguna enfermedad renal, hepática o tomas medicación.</p>`;
}

function creatineNote() {
  const d = creatineStartedDaysAgo();
  if (d === null) return '';
  if (d < 28) return `<div class="advice-mini info">${icon('info')}<span>Llevas ${d} ${d === 1 ? 'día' : 'días'}. El músculo se satura de creatina hacia la semana 4 con 5 g diarios. Hasta entonces es normal subir 1-2 kg de agua: el coach lo tiene en cuenta al ajustar tus calorías.</span></div>`;
  return `<p class="hint">Músculo saturado de creatina. Sigue con 5 g diarios; si lo dejas, los niveles bajan en 4-6 semanas.</p>`;
}

// ---------- Añadir / editar ----------
A.suppAdd = () => openSheet('suppLib');
SHEETS.suppLib = () => {
  const have = new Set((S.supps || []).map(s => s.key));
  return {
    title: 'Añadir suplemento', full: true,
    body: `<div class="list flush">${SUPP_LIBRARY.map(l => `<button class="row supp-lib" data-a="suppPick" data-key="${l.key}" ${have.has(l.key) ? 'disabled' : ''}>
        <span class="grow"><b>${l.name}</b><small>${esc(l.why)}</small><em class="ev ev-${l.ev}">${EVIDENCE[l.ev]}</em></span>
        ${have.has(l.key) ? '<span class="chip sm">Añadido</span>' : icon('plus', 'dim')}</button>`).join('')}</div>
      <button class="btn block ghost" data-a="suppCustom">${icon('plus')} Otro suplemento</button>`,
  };
};
A.suppPick = (el) => { const s = addFromLibrary(el.dataset.key); save(); ui.sheets = []; ui.sd = { ...s }; openSheet('suppEdit'); };
A.suppCustom = () => { ui.sheets = []; ui.sd = { id: null, key: null, name: '', dose: 1, unit: 'cápsula', time: 'comida', when: 'daily', food: null, addToLog: false, start: dayKey() }; openSheet('suppEdit'); };
A.suppEdit = (el) => { ui.sd = { ...S.supps.find(s => s.id === el.dataset.id) }; openSheet('suppEdit'); };

SHEETS.suppEdit = () => {
  const d = ui.sd, lib = SUPP_BY_KEY[d.key];
  return {
    title: d.id ? d.name || 'Suplemento' : 'Nuevo suplemento',
    body: `${lib ? `<div class="card inset tipbox">${icon('info')}<p>${esc(lib.how)}</p></div>` : `<label class="field"><span>Nombre</span><input id="sd-name" type="text" value="${esc(d.name)}" data-in="sdF" data-k="name" placeholder="Ej. Colágeno"></label>`}
      <div class="field-row">
        <label class="field"><span>Dosis</span><input id="sd-dose" type="number" inputmode="decimal" step="0.5" value="${d.dose}" data-in="sdF" data-k="dose"></label>
        <label class="field"><span>Unidad</span><input id="sd-unit" type="text" value="${esc(d.unit)}" data-in="sdF" data-k="unit"></label>
      </div>
      <div class="field"><span>Cuándo</span><div class="chips">${Object.entries(SUPP_TIMES).map(([k, l]) => `<button type="button" class="chip ${d.time === k ? 'on' : ''}" data-a="sdSet" data-k="time" data-v="${k}">${l}</button>`).join('')}</div></div>
      <div class="field"><span>Frecuencia</span><div class="seg sm">${[['daily', 'Todos los días'], ['training', 'Solo días de entreno']].map(([k, l]) => `<button type="button" class="${d.when === k ? 'on' : ''}" data-a="sdSet" data-k="when" data-v="${k}">${l}</button>`).join('')}</div></div>
      ${d.food ? `<label class="row toggle"><span class="grow"><b>Sumar al diario de comidas</b><small>Al marcarlo se añaden sus calorías y proteína</small></span><input type="checkbox" id="sd-log" role="switch" ${d.addToLog ? 'checked' : ''} data-in="sdLog"><i class="sw"></i></label>` : ''}
      ${d.id ? `<button class="btn block text danger" data-a="suppDelete">Quitar suplemento</button>` : ''}`,
    foot: `<button class="btn primary block" data-a="suppSave">Guardar</button>`,
  };
};
IN.sdF = (el) => { ui.sd[el.dataset.k] = el.dataset.k === 'dose' ? num(el.value) : el.value; };
IN.sdLog = (el) => { ui.sd.addToLog = el.checked; };
A.sdSet = (el) => { ui.sd[el.dataset.k] = el.dataset.v; render(); };
A.suppSave = () => {
  const d = ui.sd;
  if (!d.name.trim()) { toast('Escribe un nombre'); return; }
  if (!(d.dose > 0)) { toast('Indica la dosis'); return; }
  if (d.id) S.supps = S.supps.map(s => s.id === d.id ? { ...d } : s);
  else S.supps = [...(S.supps || []), { ...d, id: uid() }];
  ui.sheets = []; commit(); toast('Guardado');
};
A.suppDelete = () => {
  const id = ui.sd.id;
  confirmBox({ title: `¿Quitar ${ui.sd.name}?`, text: 'Se borrará también su historial.', ok: 'Quitar', danger: true,
    onOk: () => { S.supps = S.supps.filter(s => s.id !== id); for (const k of Object.keys(S.suppLog || {})) delete S.suppLog[k][id]; ui.sheets = []; commit(); } });
};
