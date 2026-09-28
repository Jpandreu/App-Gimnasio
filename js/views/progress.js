import { S, ui, A, IN, SHEETS, render, commit, save, esc, num, fmtNum, round, dayKey, addDays, parseDay, fmtDay, openSheet, closeSheet, confirmBox, toast } from '../core.js';
import { weightTrend, bestE1rm, e1rm, workingSets, exById, weeklyMuscleSets, sessionStats, GOALS } from '../coach.js';
import { MUSCLES, WEEKLY_SETS } from '../data/exercises.js';
import { icon, seg, lineChart, barChart, empty } from '../ui.js';

export function progressView() {
  const sub = ui.sub.progreso;
  return `<div class="screen" data-scroll="prog-${sub}">
    <header class="top"><h1 class="title">Progreso</h1></header>
    ${seg('progSub', sub, [['cuerpo', 'Cuerpo'], ['fuerza', 'Fuerza'], ['volumen', 'Volumen']])}
    ${sub === 'cuerpo' ? bodyTab() : sub === 'fuerza' ? strengthTab() : volumeTab()}
  </div>`;
}
A.progSub = (el) => { ui.sub.progreso = el.dataset.v; render(); };

// ---------- Cuerpo ----------
const MEASURES = [['brazo', 'Brazo'], ['pecho', 'Pecho'], ['cintura', 'Cintura'], ['muslo', 'Muslo'], ['hombros', 'Hombros']];

function bodyTab() {
  const range = ui.chartRange;
  const from = range ? addDays(dayKey(), -range) : '0000';
  const ws = [...S.weights].sort((a, b) => a.d.localeCompare(b.d));
  const inRange = ws.filter(w => w.d >= from);
  const pts = inRange.map(w => ({ x: parseDay(w.d).getTime(), y: w.kg }));
  const tr = weightTrend();
  const first = inRange[0], last = ws[ws.length - 1];
  const change = first && last ? last.kg - first.kg : 0;
  const g = GOALS[S.profile.goal];
  const start = S.profile.startWeight || first?.kg;
  const ms = [...S.measures].sort((a, b) => a.d.localeCompare(b.d));
  const lm = ms[ms.length - 1], fm = ms[0];
  return `
  <section class="card">
    <div class="row-between"><div><div class="label">Peso corporal</div><b class="num xl">${last ? fmtNum(last.kg, 1) : '–'}</b><span class="muted"> kg</span></div>
      <button class="btn sm primary" data-a="logWeight">${icon('plus')} Peso</button></div>
    <div class="chips">${[[30, '1 mes'], [90, '3 meses'], [365, '1 año'], [0, 'Todo']].map(([v, l]) => `<button class="chip ${range === v ? 'on' : ''}" data-a="chartRange" data-v="${v}">${l}</button>`).join('')}</div>
    <div class="chart-card">${lineChart(pts, { unit: ' kg', id: 'wt' })}</div>
    <div class="kv3">
      <div><b class="num ${change >= 0 ? 'pos' : 'neg'}">${change >= 0 ? '+' : ''}${fmtNum(change, 1)} kg</b><span>en el periodo</span></div>
      <div><b class="num">${tr ? `${tr.perWeek >= 0 ? '+' : ''}${fmtNum(tr.perWeek, 2)}` : '–'}</b><span>kg/semana</span></div>
      <div><b class="num">${start && last ? `${last.kg - start >= 0 ? '+' : ''}${fmtNum(last.kg - start, 1)}` : '–'}</b><span>desde el inicio</span></div>
    </div>
    <p class="hint">Objetivo "${g.label}": ${g.rate[0] > 0 ? '+' : ''}${g.rate[0]} a ${g.rate[1] > 0 ? '+' : ''}${g.rate[1]} kg por semana.</p>
  </section>

  <h3 class="section-t">Medidas</h3>
  <section class="card">
    ${lm ? `<div class="measures">${MEASURES.map(([k, l]) => {
      const v = lm[k], d = fm && fm !== lm && fm[k] && v ? v - fm[k] : null;
      return `<div><span class="label">${l}</span><b class="num">${v ? fmtNum(v, 1) : '–'}</b><small class="${d > 0 ? 'pos' : d < 0 ? 'neg' : 'muted'}">${d !== null ? `${d >= 0 ? '+' : ''}${fmtNum(d, 1)} cm` : 'cm'}</small></div>`;
    }).join('')}</div>
    <p class="hint">Última medición: ${fmtDay(lm.d)}${fm !== lm ? ` · comparado con ${fmtDay(fm.d)}` : ''}</p>`
    : `<p class="muted">Mide brazo, pecho, cintura y muslo una vez al mes. Si el brazo sube y la cintura se mantiene, estás ganando músculo.</p>`}
    <button class="btn block ghost" data-a="addMeasure">${icon('plus')} Añadir medidas</button>
  </section>

  <h3 class="section-t">Registro de peso</h3>
  <section class="card list">
    ${ws.length ? ws.slice(-10).reverse().map((w, i, arr) => {
      const prev = ws[ws.length - 2 - i];
      const d = prev ? w.kg - prev.kg : 0;
      return `<div class="row"><span class="grow">${fmtDay(w.d, true)}</span><small class="${d > 0 ? 'pos' : d < 0 ? 'neg' : 'muted'} num">${prev ? `${d >= 0 ? '+' : ''}${fmtNum(d, 1)}` : ''}</small><b class="num">${fmtNum(w.kg, 1)} kg</b>
        <button class="icon-btn sm" data-a="delWeight" data-d="${w.d}" aria-label="Borrar">${icon('x')}</button></div>`;
    }).join('') : '<p class="muted pad">Sin registros.</p>'}
  </section>`;
}
A.chartRange = (el) => { ui.chartRange = num(el.dataset.v); render(); };
A.delWeight = (el) => {
  if (S.weights.length <= 1) { toast('Debe quedar al menos un registro'); return; }
  S.weights = S.weights.filter(w => w.d !== el.dataset.d); commit();
};

A.addMeasure = () => {
  const last = [...S.measures].sort((a, b) => a.d.localeCompare(b.d)).pop() || {};
  ui.md = { d: dayKey(), ...Object.fromEntries(MEASURES.map(([k]) => [k, last[k] ?? ''])) };
  openSheet('measure');
};
SHEETS.measure = () => ({
  title: 'Medidas corporales',
  body: `<p class="muted">En centímetros, con cinta métrica y sin apretar. Brazo contraído, cintura a la altura del ombligo.</p>
    <div class="field-row wrap2">${MEASURES.map(([k, l]) => `<label class="field"><span>${l}</span><input id="md-${k}" type="number" inputmode="decimal" step="0.1" value="${ui.md[k]}" data-in="mdF" data-k="${k}"></label>`).join('')}</div>`,
  foot: `<button class="btn primary block" data-a="saveMeasure">Guardar</button>`,
});
IN.mdF = (el) => { ui.md[el.dataset.k] = el.value === '' ? '' : num(el.value); };
A.saveMeasure = () => {
  const m = ui.md;
  if (!MEASURES.some(([k]) => num(m[k]) > 0)) { toast('Introduce al menos una medida'); return; }
  S.measures = S.measures.filter(x => x.d !== m.d).concat(m);
  closeSheet(); commit(); toast('Medidas guardadas');
};

// ---------- Fuerza ----------
const KEY_LIFTS = ['press-banca', 'sentadilla', 'peso-muerto', 'press-militar', 'remo-barra', 'dominadas', 'press-inclinado-manc', 'hip-thrust'];

function strengthTab() {
  const done = new Set(S.sessions.flatMap(s => s.exercises.filter(e => workingSets(e).length).map(e => e.exId)));
  if (!done.size) return empty('trophy', 'Aún sin datos de fuerza', 'Completa entrenos y aquí verás tu 1RM estimado por ejercicio y tus récords.');
  const ids = [...KEY_LIFTS.filter(id => done.has(id)), ...[...done].filter(id => !KEY_LIFTS.includes(id))];
  ui.liftSel = ids.includes(ui.liftSel) ? ui.liftSel : ids[0];
  const sel = ui.liftSel;
  const pts = S.sessions.filter(s => s.exercises.some(e => e.exId === sel && workingSets(e).length)).map(s => {
    const e = s.exercises.find(x => x.exId === sel);
    return { x: s.start, y: round(Math.max(...workingSets(e).map(st => e1rm(st.kg, st.reps))), 1) };
  });
  const recentPRs = S.sessions.slice().reverse().flatMap(s => (s.prs || []).map(id => ({ s, id }))).slice(0, 8);
  return `
  <section class="card">
    <div class="label">1RM estimado</div>
    <div class="chips scroll-x">${ids.map(id => `<button class="chip ${sel === id ? 'on' : ''}" data-a="liftSel" data-v="${id}">${esc(exById(id).name)}</button>`).join('')}</div>
    <div class="row-between"><b class="num xl">${fmtNum(bestE1rm(sel), 1)} <small>kg</small></b>
      <button class="btn sm ghost" data-a="exDetail" data-id="${sel}">Detalle ${icon('right')}</button></div>
    <div class="chart-card">${lineChart(pts, { unit: ' kg', id: 'st' })}</div>
    <p class="hint">Estimación con la fórmula de Epley a partir de tu mejor serie de cada día.</p>
  </section>
  <h3 class="section-t">Mejores marcas</h3>
  <section class="card list">${ids.map(id => {
    let best = null;
    for (const s of S.sessions) { const e = s.exercises.find(x => x.exId === id); if (e) for (const st of workingSets(e)) if (!best || e1rm(st.kg, st.reps) > e1rm(best.kg, best.reps)) best = st; }
    return `<button class="row" data-a="exDetail" data-id="${id}"><span class="mk m-${exById(id).m}"></span><span class="grow"><b>${esc(exById(id).name)}</b><small class="muted">Mejor serie ${fmtNum(best.kg, 2)} kg × ${best.reps}</small></span><b class="num">${fmtNum(bestE1rm(id), 1)}</b></button>`;
  }).join('')}</section>
  ${recentPRs.length ? `<h3 class="section-t">Récords recientes</h3><section class="card list">${recentPRs.map(({ s, id }) => `<div class="row">${icon('trophy', 'warm-i')}<span class="grow"><b>${esc(exById(id).name)}</b><small class="muted">${fmtDay(dayKey(s.start))}</small></span></div>`).join('')}</section>` : ''}`;
}
A.liftSel = (el) => { ui.liftSel = el.dataset.v; render(); };

// ---------- Volumen ----------
function volumeTab() {
  if (!S.sessions.length) return empty('chart', 'Sin entrenos todavía', 'Aquí verás cuántas series haces por músculo y tu constancia semana a semana.');
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7)).getTime();
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const a = monday - (7 - i) * 7 * 864e5, b = a + 7 * 864e5;
    const ss = S.sessions.filter(s => s.start >= a && s.start < b);
    const d = new Date(a);
    return { label: `${d.getDate()}/${d.getMonth() + 1}`, v: ss.length, vol: ss.reduce((x, s) => x + sessionStats(s).volume, 0), hi: i === 7 };
  });
  const ms = weeklyMuscleSets();
  const maxSets = Math.max(WEEKLY_SETS.max + 4, ...Object.values(ms));
  return `
  <section class="card">
    <div class="label">Entrenos por semana</div>
    <div class="chart-card">${barChart(weeks, { target: S.profile.days })}</div>
    <p class="hint">La línea discontinua es tu objetivo de ${S.profile.days} días.</p>
  </section>
  <section class="card">
    <div class="label">Volumen total por semana (toneladas)</div>
    <div class="chart-card">${barChart(weeks.map(w => ({ ...w, v: round(w.vol / 1000, 1) })), { color: 'var(--c-carb)' })}</div>
  </section>
  <h3 class="section-t">Series por músculo · últimos 7 días</h3>
  <section class="card">
    <div class="vol-legend"><span><i class="zone"></i>Zona óptima ${WEEKLY_SETS.min}-${WEEKLY_SETS.max} series</span></div>
    <div class="vol-bars">${Object.entries(MUSCLES).map(([k, l]) => {
      const v = ms[k] || 0;
      const st = v < WEEKLY_SETS.min * 0.6 ? 'low' : v <= WEEKLY_SETS.max ? (v >= WEEKLY_SETS.min ? 'ok' : 'mid') : 'high';
      return `<div class="vb"><span class="vb-l">${l}</span><div class="vb-track"><i class="vb-zone" style="left:${WEEKLY_SETS.min / maxSets * 100}%;width:${(WEEKLY_SETS.max - WEEKLY_SETS.min) / maxSets * 100}%"></i><i class="vb-fill ${st}" style="width:${Math.min(100, v / maxSets * 100)}%"></i></div><b class="num">${fmtNum(v, 1)}</b></div>`;
    }).join('')}</div>
    <p class="hint">Los músculos secundarios cuentan media serie (p. ej. tríceps en press de banca). Antebrazo, abdomen y gemelos pueden quedar por debajo sin problema.</p>
  </section>`;
}
