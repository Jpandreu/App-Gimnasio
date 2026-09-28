import { S, ui, A, IN, SHEETS, render, commit, save, esc, num, fmtNum, round, dayKey, addDays, parseDay, fmtDay, fmtMin, openSheet, closeSheet, toast, DOW } from '../core.js';
import { targets, dayTotals, peekLog, dayLog, nextRoutine, exById, isTrainingDay, nextTrainingDate, weekdayName, trainingOpts, weightTrend, calorieAdvice, tipOfDay, weekSessions, streakWeeks, sessionStats, currentWeight } from '../coach.js';
import { MUSCLES } from '../data/exercises.js';
import { icon, ring, macroBar, sparkline } from '../ui.js';

const LONG_DOW = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS_FULL = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const estMinutes = r => Math.round(r.exercises.reduce((a, e) => a + e.sets * (45 + (e.rest || 90)), 0) / 60);

function greeting() {
  const h = new Date().getHours();
  return h < 6 ? 'Buenas noches' : h < 13 ? 'Buenos días' : h < 21 ? 'Buenas tardes' : 'Buenas noches';
}

function workoutCard() {
  if (S.active) {
    return `<section class="card hero-card live">
      <div class="label live-l"><i class="pulse"></i>Entreno en curso</div>
      <h2>${esc(S.active.name)}</h2>
      <p class="muted">${S.active.exercises.length} ejercicios</p>
      <button class="btn primary block" data-a="openWorkout">${icon('play')} Continuar</button>
    </section>`;
  }
  const today = dayKey();
  const done = S.sessions.filter(s => dayKey(s.start) === today);
  if (done.length) {
    const s = done[done.length - 1], st = sessionStats(s);
    return `<section class="card hero-card done">
      <div class="label">${icon('check', 'good-i')} Entreno completado</div>
      <h2>${esc(s.name)}</h2>
      <div class="kv3"><div><b class="num">${fmtMin(s.end - s.start)}</b><span>duración</span></div><div><b class="num">${st.sets}</b><span>series</span></div><div><b class="num">${fmtNum(st.volume / 1000, 1)} t</b><span>volumen</span></div></div>
      <p class="hint">Ahora toca comer bien y descansar: el músculo crece fuera del gimnasio.</p>
    </section>`;
  }
  const r = nextRoutine();
  if (!r) {
    return `<section class="card hero-card"><div class="label">Entrenamiento</div><h2>Sin rutinas</h2>
      <p class="muted">Genera un programa o crea tu propia rutina.</p>
      <button class="btn primary block" data-a="goTab" data-v="entrenar">Ir a entrenar</button></section>`;
  }
  if (!isTrainingDay() && !ui.forceTrain) {
    const nd = nextTrainingDate();
    const when = nd ? (dayKey(nd) === addDays(today, 1) ? 'mañana' : `el ${weekdayName(nd).toLowerCase()}`) : '';
    return `<section class="card hero-card rest-day">
      <div class="label">${icon('calendar')} Día de descanso</div>
      <h2>Hoy toca recuperar</h2>
      <p class="muted">El músculo crece mientras descansas. Come tus calorías y duerme bien.${nd ? ` Próximo entreno ${when}: <b>${esc(r.name)}</b>.` : ''}</p>
      <button class="btn ghost block" data-a="forceTrain">${icon('play')} Entrenar igualmente</button>
    </section>`;
  }
  const muscles = [...new Set(r.exercises.map(e => exById(e.exId).m))].slice(0, 4);
  return `<section class="card hero-card">
    <div class="row-between"><div class="label">${isTrainingDay() ? 'Hoy toca' : 'Siguiente entreno'}</div><span class="chip">${estMinutes(r)} min aprox.</span></div>
    <h2>${esc(r.name)}</h2>
    <div class="chips">${muscles.map(m => `<span class="chip soft">${MUSCLES[m]}</span>`).join('')}</div>
    <ol class="mini-ex">${r.exercises.slice(0, 4).map(e => `<li><span>${esc(exById(e.exId).name)}</span><small>${e.sets} × ${e.min}-${e.max}</small></li>`).join('')}
      ${r.exercises.length > 4 ? `<li class="muted"><span>+${r.exercises.length - 4} más</span></li>` : ''}</ol>
    <div class="btn-row"><button class="btn ghost" data-a="goTab" data-v="entrenar">Otra rutina</button><button class="btn primary" data-a="startRoutine" data-id="${r.id}">${icon('play')} Empezar</button></div>
  </section>`;
}

function weekStrip() {
  const now = new Date();
  const mondayK = dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7)));
  const trained = new Set(S.sessions.map(s => dayKey(s.start)));
  const today = dayKey();
  const plan = trainingOpts().weekdays;
  const cells = Array.from({ length: 7 }, (_, i) => {
    const k = addDays(mondayK, i);
    return `<div class="wd ${trained.has(k) ? 'on' : ''} ${plan.includes(parseDay(k).getDay()) ? 'plan' : ''} ${k === today ? 'today' : ''}"><span>${DOW[parseDay(k).getDay()].charAt(0)}</span><i>${trained.has(k) ? icon('check') : ''}</i></div>`;
  }).join('');
  const n = weekSessions().length, goal = trainingOpts().weekdays.length;
  const streak = streakWeeks();
  return `<section class="card week">
    <div class="row-between"><div><div class="label">Esta semana</div><b class="num">${n}</b><span class="muted"> / ${goal} entrenos</span></div>
      ${streak ? `<span class="chip warm">${icon('fire')} ${streak} ${streak === 1 ? 'semana' : 'semanas'}</span>` : ''}</div>
    <div class="week-days">${cells}</div>
  </section>`;
}

function nutritionCard() {
  const t = targets(), k = dayKey(), tot = dayTotals(k);
  const left = t.kcal - tot.kcal;
  return `<section class="card nutri-card" data-a="goTab" data-v="nutricion" role="button" tabindex="0">
    <div class="ring-wrap">${ring(tot.kcal / t.kcal, { over: tot.kcal > t.kcal * 1.1 })}
      <div class="ring-in"><b class="num">${Math.abs(Math.round(left)).toLocaleString('es-ES')}</b><span>${left >= 0 ? 'kcal restantes' : 'kcal de más'}</span></div></div>
    <div class="grow macros">
      <div class="kcal-line"><b class="num">${Math.round(tot.kcal).toLocaleString('es-ES')}</b><span> / ${t.kcal.toLocaleString('es-ES')} kcal</span></div>
      ${macroBar('Proteína', tot.p, t.p, 'm-p')}${macroBar('Hidratos', tot.c, t.c, 'm-c')}${macroBar('Grasa', tot.f, t.f, 'm-f')}
    </div>
  </section>
  <button class="btn block ghost add-food" data-a="quickFood">${icon('plus')} Añadir comida</button>`;
}

export function waterCard(k = dayKey()) {
  const t = targets(), w = peekLog(k).water || 0;
  const glasses = Math.ceil(t.water / 250);
  const filled = Math.floor(w / 250);
  return `<section class="card water">
    <div class="row-between"><div><div class="label">${icon('drop', 'water-i')} Agua</div><b class="num">${fmtNum(w / 1000, 2)}</b><span class="muted"> / ${fmtNum(t.water / 1000, 2)} L</span></div>
      <div class="stepper sm"><button data-a="water" data-v="-250" data-k="${k}" aria-label="Quitar un vaso">${icon('minus')}</button><button data-a="water" data-v="250" data-k="${k}" aria-label="Añadir un vaso">${icon('plus')}</button></div></div>
    <div class="glasses">${Array.from({ length: Math.max(glasses, filled) }, (_, i) => `<button class="glass ${i < filled ? 'on' : ''}" data-a="waterSet" data-v="${(i + 1) * 250}" data-k="${k}" aria-label="${(i + 1) * 250} ml"></button>`).join('')}</div>
  </section>`;
}

function weightCard() {
  const ws = [...S.weights].sort((a, b) => a.d.localeCompare(b.d));
  const last = ws[ws.length - 1];
  const tr = weightTrend();
  const recent = ws.slice(-14).map(w => w.kg);
  const loggedToday = last && last.d === dayKey();
  return `<section class="card weight">
    <div class="row-between">
      <div><div class="label">${icon('scale')} Peso corporal</div>
        <b class="num xl">${last ? fmtNum(last.kg, 1) : '–'}</b><span class="muted"> kg</span>
        <div class="muted sm">${last ? fmtDay(last.d) : ''}${tr ? ` · <span class="${tr.perWeek >= 0 ? 'pos' : 'neg'}">${tr.perWeek >= 0 ? '+' : ''}${fmtNum(tr.perWeek, 2)} kg/sem</span>` : ''}</div>
      </div>
      <div class="spark">${sparkline(recent)}</div>
    </div>
    <button class="btn block ${loggedToday ? 'ghost' : 'primary soft'}" data-a="logWeight">${loggedToday ? 'Actualizar peso de hoy' : 'Registrar peso de hoy'}</button>
  </section>`;
}

function coachCard() {
  const adv = calorieAdvice();
  const tip = tipOfDay();
  const cls = { low: 'warn', high: 'warn', ok: 'good', wait: '' }[adv.state];
  return `<section class="card coach">
    <div class="label">${icon('sparkle', 'accent-i')} Tu coach</div>
    <div class="advice ${cls}"><p>${esc(adv.text)}</p>
      ${adv.delta ? `<button class="btn sm primary" data-a="applyAdvice" data-v="${adv.delta}">${adv.delta > 0 ? 'Sumar' : 'Restar'} ${Math.abs(adv.delta)} kcal</button>` : ''}</div>
    <div class="tip"><b>${esc(tip.t)}</b><p>${esc(tip.b)}</p></div>
  </section>`;
}

export function todayView() {
  const p = S.profile;
  const d = new Date();
  return `<div class="screen" data-scroll="hoy">
    <header class="top">
      <div><p class="eyebrow">${LONG_DOW[d.getDay()]}, ${d.getDate()} de ${MONTHS_FULL[d.getMonth()]}</p>
      <h1 class="title">${greeting()}${p.name ? `, ${esc(p.name.split(' ')[0])}` : ''}</h1></div>
    </header>
    ${workoutCard()}
    ${nutritionCard()}
    ${weekStrip()}
    ${weightCard()}
    ${waterCard()}
    ${coachCard()}
  </div>`;
}

// ---------- Acciones ----------
A.goTab = (el) => { location.hash = el.dataset.v; };
A.forceTrain = () => { ui.forceTrain = true; render(); };
A.water = (el) => { const l = dayLog(el.dataset.k); l.water = Math.max(0, (l.water || 0) + num(el.dataset.v)); commit(); };
A.waterSet = (el) => { const l = dayLog(el.dataset.k); const v = num(el.dataset.v); l.water = l.water === v ? v - 250 : v; commit(); };
A.applyAdvice = (el) => { S.profile.kcalAdjust = (S.profile.kcalAdjust || 0) + num(el.dataset.v); commit(); toast(`Objetivo: ${targets().kcal} kcal`); };
A.quickFood = () => {
  const h = new Date().getHours();
  const meal = h < 11 ? 'desayuno' : h < 13 ? 'almuerzo' : h < 17 ? 'comida' : h < 20 ? 'merienda' : 'cena';
  ui.day = dayKey();
  location.hash = 'nutricion';
  setTimeout(() => A.addFood({ dataset: { meal } }), 0);
};

A.logWeight = () => {
  const k = dayKey();
  const cur = S.weights.find(w => w.d === k)?.kg ?? currentWeight();
  ui.wDraft = cur; ui.wDay = k;
  openSheet('weight');
};
SHEETS.weight = () => ({
  title: 'Registrar peso',
  body: `<p class="muted center">${fmtDay(ui.wDay, true)}. Pésate en ayunas y después de ir al baño.</p>
    <div class="big-stepper">
      <button data-a="wStep" data-v="-0.1" aria-label="Restar 100 g">${icon('minus')}</button>
      <label class="bs-val"><input id="w-input" type="number" inputmode="decimal" step="0.1" value="${round(ui.wDraft, 1)}" data-in="wInput"><span>kg</span></label>
      <button data-a="wStep" data-v="0.1" aria-label="Sumar 100 g">${icon('plus')}</button>
    </div>`,
  foot: `<button class="btn primary block" data-a="saveWeight">Guardar</button>`,
});
A.wStep = (el) => {
  ui.wDraft = round(num(document.getElementById('w-input').value) + num(el.dataset.v), 1);
  document.getElementById('w-input').value = ui.wDraft;
};
IN.wInput = (el) => { ui.wDraft = num(el.value); };
A.saveWeight = () => {
  const kg = round(num(document.getElementById('w-input').value), 1);
  if (kg < 30 || kg > 300) { toast('Introduce un peso válido'); return; }
  S.weights = S.weights.filter(w => w.d !== ui.wDay).concat({ d: ui.wDay, kg }).sort((a, b) => a.d.localeCompare(b.d));
  closeSheet(); commit(); toast(`Peso guardado: ${fmtNum(kg, 1)} kg`);
};
