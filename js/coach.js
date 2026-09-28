// Lógica de entrenador y nutricionista.
import { S, dayKey, addDays, parseDay, round, uid, fmtNum } from './core.js';
import { EX_BY_ID, EXERCISES } from './data/exercises.js';
import { GYM_PRESETS, FOCUS, DEFAULT_WEEKDAYS, WEEKDAYS } from './data/equipment.js';
import { FOODS } from './data/foods.js';
import { PROGRAMS } from './data/plans.js';

export const ACTIVITY = [
  { v: 1.375, label: 'Ligera', desc: 'Trabajo sentado y entrenas 2-3 días' },
  { v: 1.55, label: 'Moderada', desc: 'Entrenas 3-5 días y te mueves algo a diario' },
  { v: 1.725, label: 'Alta', desc: 'Entrenas 5-6 días o trabajo de pie/físico' },
  { v: 1.9, label: 'Muy alta', desc: 'Trabajo físico duro y entreno diario' },
];

export const GOALS = {
  volumen: { label: 'Ganar masa', kcal: 450, rate: [0.25, 0.5], desc: 'Superávit de unas 450 kcal. Recomendado si te cuesta subir de peso.' },
  'volumen-limpio': { label: 'Volumen limpio', kcal: 300, rate: [0.15, 0.35], desc: 'Superávit moderado para ganar músculo con poca grasa.' },
  mantener: { label: 'Mantener', kcal: 0, rate: [-0.1, 0.1], desc: 'Recomposición: mismo peso, más músculo.' },
  definir: { label: 'Definir', kcal: -450, rate: [-0.7, -0.3], desc: 'Déficit para perder grasa conservando músculo.' },
};

export const EXPERIENCE = {
  novato: 'Menos de 1 año',
  intermedio: '1 a 3 años',
  avanzado: 'Más de 3 años',
};

// Mifflin-St Jeor
export function bmr(p) {
  const base = 10 * p.weight + 6.25 * p.height - 5 * p.age;
  return p.sex === 'f' ? base - 161 : base + 5;
}

export function currentWeight() {
  const w = [...S.weights].sort((a, b) => a.d.localeCompare(b.d));
  return w.length ? w[w.length - 1].kg : (S.profile?.weight || 70);
}

export function targets(p = S.profile) {
  if (!p) return null;
  // En el perfil guardado manda el último peso registrado; en el onboarding, el peso introducido
  const weight = p === S.profile && S.weights.length ? currentWeight() : p.weight;
  const pp = { ...p, weight };
  const b = bmr(pp);
  const tdee = b * p.activity;
  const goal = GOALS[p.goal] || GOALS.volumen;
  const kcal = Math.round((tdee + goal.kcal + (p.kcalAdjust || 0)) / 10) * 10;
  // Proteína 2 g/kg (2,2 en déficit), grasa 25% de las kcal (mínimo 0,8 g/kg), resto hidratos
  const protein = Math.round(weight * (p.goal === 'definir' ? 2.2 : 2));
  const fat = Math.round(Math.max(weight * 0.8, (kcal * 0.25) / 9));
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  const water = Math.round((weight * 35 + 500) / 250) * 250; // ml
  return { bmr: Math.round(b), tdee: Math.round(tdee), surplus: goal.kcal + (p.kcalAdjust || 0), kcal, p: protein, c: carbs, f: fat, water, weight };
}

// Tendencia de peso: regresión lineal de los últimos 28 días (kg/semana)
export function weightTrend(days = 28) {
  const from = addDays(dayKey(), -days);
  const pts = S.weights.filter(w => w.d >= from).sort((a, b) => a.d.localeCompare(b.d));
  if (pts.length < 3) return null;
  const t0 = parseDay(pts[0].d).getTime();
  const xs = pts.map(p => (parseDay(p.d).getTime() - t0) / 864e5);
  const span = xs[xs.length - 1];
  if (span < 6) return null;
  const ys = pts.map(p => p.kg);
  const n = xs.length, mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
  let sxy = 0, sxx = 0;
  xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; });
  const slope = sxx ? sxy / sxx : 0;
  return { perWeek: slope * 7, span, n };
}

// Ajuste calórico sugerido según la tendencia real de peso
export function calorieAdvice() {
  const p = S.profile; if (!p) return null;
  const tr = weightTrend();
  const g = GOALS[p.goal] || GOALS.volumen;
  if (!tr || tr.span < 13) return { state: 'wait', text: 'Pésate 3-4 mañanas por semana, en ayunas y tras ir al baño. Con 2 semanas de datos ajusto tus calorías.' };
  const r = tr.perWeek;
  const rs = `${r >= 0 ? '+' : ''}${fmtNum(r, 2)} kg/semana`, obj = `${fmtNum(g.rate[0], 2)} a ${fmtNum(g.rate[1], 2)} kg`;
  if (r < g.rate[0]) return { state: 'low', delta: 150, rate: r, text: `Tu peso cambia ${rs}, por debajo del objetivo (${obj}). Te recomiendo sumar 150 kcal al día.` };
  if (r > g.rate[1]) return { state: 'high', delta: -150, rate: r, text: `Tu peso cambia ${rs}, más rápido que el objetivo (${obj}). Resta 150 kcal para ganar menos grasa.` };
  return { state: 'ok', rate: r, text: `Tu peso cambia ${rs}, dentro del rango ideal (${obj}). Mantén las calorías.` };
}

// ---------- Nutrición ----------
export const allFoods = () => [...S.customFoods, ...FOODS];
export const foodById = id => S.customFoods.find(f => f.id === id) || FOODS.find(f => f.id === id);

export function macrosFor(food, g) {
  const k = g / 100;
  return { kcal: food.kcal * k, p: food.p * k, c: food.c * k, f: food.f * k };
}

export function dayLog(k) {
  if (!S.log[k]) S.log[k] = { items: [], water: 0 };
  return S.log[k];
}
export function peekLog(k) { return S.log[k] || { items: [], water: 0 }; }

export function dayTotals(k) {
  const t = { kcal: 0, p: 0, c: 0, f: 0 };
  for (const it of peekLog(k).items) { t.kcal += it.kcal; t.p += it.p; t.c += it.c; t.f += it.f; }
  return t;
}

export function makeLogItem(food, g, meal) {
  const m = macrosFor(food, g);
  return { id: uid(), fid: food.id, name: food.name, g, meal, ...m };
}

// Escala un día tipo para cuadrar calorías y macros. Los alimentos se agrupan por su macro
// dominante (proteína, grasa, resto) y se resuelve un factor por grupo (sistema 3x3).
const foodGroup = f => (f.p * 4) / f.kcal > 0.34 ? 0 : (f.f * 9) / f.kcal > 0.6 ? 2 : 1;

export function scalePlan(plan, kcalTarget, t = targets()) {
  const M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; // filas: p, c, f · columnas: grupos
  let base = 0;
  for (const m of plan.meals) for (const [id, g] of m.items) {
    const f = foodById(id); if (!f) continue;
    const gi = foodGroup(f), k = g / 100;
    M[0][gi] += f.p * k; M[1][gi] += f.c * k; M[2][gi] += f.f * k; base += f.kcal * k;
  }
  const ratio = kcalTarget / t.kcal;
  const goal = [t.p * ratio, t.c * ratio, t.f * ratio];
  const det = m => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const D = det(M);
  let ks = [1, 1, 1].map(() => kcalTarget / base);
  if (Math.abs(D) > 1e-6) {
    const sol = [0, 1, 2].map(c => det(M.map((row, r) => row.map((v, j) => j === c ? goal[r] : v))) / D);
    if (sol.every(v => v > 0)) ks = sol.map(v => Math.max(0.35, Math.min(2.8, v)));
  }
  return plan.meals.map(m => {
    const items = m.items.map(([id, g]) => {
      const f = foodById(id);
      let grams = g * ks[foodGroup(f)];
      if (id === 'whey') grams = Math.max(15, Math.round(grams / 15) * 15);
      else if (id === 'huevo') grams = Math.max(55, Math.round(grams / 55) * 55);
      else grams = Math.max(5, Math.round(grams / 5) * 5);
      return { food: f, g: grams, ...macrosFor(f, grams) };
    });
    const tot = items.reduce((a, it) => ({ kcal: a.kcal + it.kcal, p: a.p + it.p, c: a.c + it.c, f: a.f + it.f }), { kcal: 0, p: 0, c: 0, f: 0 });
    return { ...m, items, tot };
  });
}

// ---------- Entrenamiento ----------
export const exById = id => EX_BY_ID[id] || S.customExercises?.find(e => e.id === id) || { id, name: 'Ejercicio', m: 'abdomen', eq: 'corporal', inc: 2.5, tip: '', sec: [] };

// ---------- Mi gimnasio ----------
export const gymEquip = () => new Set(S.gym?.equip ?? GYM_PRESETS.completo.equip);

export function canDo(e, equip = gymEquip()) {
  if (!e) return false;
  return (e.req || []).every(r => Array.isArray(r) ? r.some(x => equip.has(x)) : equip.has(r));
}

const isCompound = e => (e.sec || []).length > 0;

// Mejor alternativa disponible: mismo patrón de movimiento, después mismo músculo.
export function alternatives(exId, equip = gymEquip(), exclude = new Set()) {
  const o = exById(exId);
  const pool = [...(S.customExercises || []), ...EXERCISES].filter(e => e.id !== exId && canDo(e, equip));
  const score = e => {
    let sc;
    if (e.pat && e.pat === o.pat && e.pat !== 'otro') sc = 0;
    else if (e.m === o.m && isCompound(e) === isCompound(o)) sc = 1;
    else if (e.m === o.m) sc = 2;
    else return null;
    // A igualdad de patrón, preferir un material parecido: barra → máquina → mancuernas → polea → peso corporal
    const rank = { barra: 0, maquina: 0.1, mancuernas: 0.2, polea: 0.25, corporal: 0.45 };
    sc += e.eq === o.eq ? 0 : (rank[e.eq] ?? 0.3);
    if (o.eq === 'barra' && e.id.includes('multipower')) sc -= 0.08; // la barra guiada es lo más parecido
    if (exclude.has(e.id)) sc += 3;
    return sc;
  };
  return pool.map((e, i) => ({ e, sc: score(e), i })).filter(x => x.sc !== null)
    .sort((a, b) => a.sc - b.sc || a.i - b.i).map(x => x.e);
}

export const estMinutesItems = items => Math.round(items.reduce((a, e) => a + e.sets * (45 + (e.rest || 90)), 0) / 60);

export function trainingOpts(p = S.profile) {
  const weekdays = p?.weekdays?.length ? p.weekdays : DEFAULT_WEEKDAYS[p?.days || 4];
  return { weekdays, sessionMin: p?.sessionMin || 60, focus: p?.focus || [], exp: p?.exp || 'novato' };
}

// Genera un programa adaptado a días, material, duración, experiencia y prioridades.
export function generateProgram(opts = trainingOpts(), equip = gymEquip()) {
  const days = Math.min(6, Math.max(2, opts.weekdays.length));
  const prog = PROGRAMS[days];
  const focusM = new Set(opts.focus.flatMap(f => FOCUS[f]?.m || []));
  const changes = [];
  const routines = prog.routines.map(r => {
    // Los ejercicios originales disponibles se reservan para que las sustituciones no los repitan
    const used = new Set(r.items.map(it => it[0]).filter(id => canDo(exById(id), equip)));
    const added = new Set();
    let items = [];
    for (const [exId, sets, min, max, rest] of r.items) {
      let id = exId;
      if (!canDo(exById(exId), equip)) {
        const alt = alternatives(exId, equip, used)[0];
        if (!alt) { changes.push({ from: exId, to: null }); continue; }
        changes.push({ from: exId, to: alt.id });
        id = alt.id;
      }
      if (added.has(id)) continue;
      used.add(id); added.add(id);
      items.push({ exId: id, sets, min, max, rest });
    }
    // Experiencia: los novatos recuperan peor de mucho volumen
    if (opts.exp === 'novato') items.forEach(e => { e.sets = Math.min(e.sets, 3); });
    // Prioridades: una serie extra en los músculos elegidos
    items.forEach(e => { if (focusM.has(exById(e.exId).m)) e.sets = Math.min(5, e.sets + 1); });
    // Ajustar a la duración de la sesión
    const budget = opts.sessionMin;
    const isFocus = e => focusM.has(exById(e.exId).m);
    // Recortar por orden: series extra de accesorios → quitar un accesorio → series de básicos
    const fromEnd = f => [...items].reverse().find(f);
    const steps = [
      () => fromEnd((e, i) => e.sets > 3 && !isFocus(e) && items.indexOf(e) >= 2),
      () => fromEnd(e => e.sets > 3 && !isFocus(e)),
      () => fromEnd(e => e.sets > 3),
      () => { if (items.length <= 4) return null; const i = items.map(isFocus).lastIndexOf(false); return i >= 2 ? { remove: i } : null; },
      () => fromEnd(e => e.sets > 2 && !isFocus(e) && items.indexOf(e) >= 2),
      () => fromEnd(e => e.sets > 2),
    ];
    let guard = 80;
    while (estMinutesItems(items) > budget + 3 && guard--) {
      let done = false;
      for (const st of steps) {
        const r = st();
        if (!r) continue;
        if (r.remove !== undefined) items.splice(r.remove, 1); else r.sets--;
        done = true; break;
      }
      if (!done) break;
    }
    guard = 60;
    while (estMinutesItems(items) < budget - 10 && guard--) {
      const cap = e => (isFocus(e) && opts.exp !== 'novato' ? 5 : 4);
      const cand = items.filter(e => e.sets < cap(e)).sort((a, b) => (isFocus(b) - isFocus(a)) || (a.sets - b.sets))[0];
      if (!cand) break;
      cand.sets++;
    }
    return { id: uid(), name: r.name, exercises: items };
  });
  return { name: prog.name, why: prog.why, routines, changes };
}

// Cambia los ejercicios de las rutinas actuales que no se pueden hacer con el material
export function adaptRoutines(equip = gymEquip()) {
  let n = 0;
  for (const r of S.routines) {
    const used = new Set(r.exercises.map(e => e.exId));
    r.exercises = r.exercises.flatMap(e => {
      if (canDo(exById(e.exId), equip)) return [e];
      const alt = alternatives(e.exId, equip, used)[0];
      n++;
      if (!alt) return [];
      used.add(alt.id);
      return [{ ...e, exId: alt.id }];
    });
  }
  return n;
}
export const blockedInRoutines = (equip = gymEquip()) => S.routines.reduce((a, r) => a + r.exercises.filter(e => !canDo(exById(e.exId), equip)).length, 0);

// ---------- Calendario ----------
export const isTrainingDay = (d = new Date()) => trainingOpts().weekdays.includes(d.getDay());
export function nextTrainingDate(from = new Date()) {
  const wd = trainingOpts().weekdays;
  for (let i = 1; i <= 7; i++) { const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i); if (wd.includes(d.getDay())) return d; }
  return null;
}
export const weekdayName = d => WEEKDAYS.find(w => w[0] === d.getDay())[2];

export function nextRoutine() {
  if (!S.routines.length) return null;
  const last = [...S.sessions].reverse().find(s => S.routines.some(r => r.id === s.routineId));
  if (!last) return S.routines[0];
  const i = S.routines.findIndex(r => r.id === last.routineId);
  return S.routines[(i + 1) % S.routines.length];
}

export const workingSets = ex => ex.sets.filter(s => s.done && !s.w && s.reps > 0);

// Última vez que se hizo un ejercicio (antes de una fecha)
export function lastPerformance(exId, beforeTs = Infinity) {
  for (let i = S.sessions.length - 1; i >= 0; i--) {
    const s = S.sessions[i];
    if (s.start >= beforeTs) continue;
    const ex = s.exercises.find(e => e.exId === exId);
    if (ex && workingSets(ex).length) return { session: s, ex };
  }
  return null;
}

// Doble progresión: cuando todas las series llegan al tope del rango, subir carga.
export function suggestion(exId, min, max) {
  const lp = lastPerformance(exId);
  if (!lp) return null;
  const sets = workingSets(lp.ex);
  const top = Math.max(...sets.map(s => s.kg));
  const topSets = sets.filter(s => s.kg === top);
  const ex = exById(exId);
  const inc = ex.inc || 2.5;
  if (top > 0 && topSets.every(s => s.reps >= max)) {
    return { kg: round(top + inc, 2), reps: min, up: true, text: `Llegaste a ${max} reps en todas las series: sube a ${fmtNum(top + inc, 2)} kg` };
  }
  const minReps = Math.min(...topSets.map(s => s.reps));
  if (top > 0 && minReps < min - 2 && sets.length >= 2) {
    return { kg: round(Math.max(0, top - inc), 2), reps: min, down: true, text: `Te quedaste lejos del rango: baja a ${fmtNum(Math.max(0, top - inc), 2)} kg y céntrate en la técnica` };
  }
  const target = Math.min(max, minReps + 1);
  return { kg: top, reps: target, text: top > 0 ? `Mismo peso, busca ${target} reps o más en cada serie` : `Intenta ${target} reps o más` };
}

export const e1rm = (kg, reps) => (reps <= 0 || kg <= 0) ? 0 : reps === 1 ? kg : kg * (1 + Math.min(reps, 15) / 30);

export function bestE1rm(exId, beforeTs = Infinity) {
  let best = 0;
  for (const s of S.sessions) {
    if (s.start >= beforeTs) continue;
    const ex = s.exercises.find(e => e.exId === exId);
    if (!ex) continue;
    for (const set of workingSets(ex)) best = Math.max(best, e1rm(set.kg, set.reps));
  }
  return best;
}

export function sessionStats(s) {
  let volume = 0, sets = 0, reps = 0;
  for (const ex of s.exercises) for (const set of workingSets(ex)) { volume += set.kg * set.reps; sets++; reps += set.reps; }
  return { volume, sets, reps };
}

// Series efectivas por grupo muscular en los últimos 7 días (secundarios cuentan 0,5)
export function weeklyMuscleSets() {
  const from = Date.now() - 7 * 864e5;
  const out = {};
  for (const s of S.sessions) {
    if (s.start < from) continue;
    for (const ex of s.exercises) {
      const n = workingSets(ex).length;
      if (!n) continue;
      const e = exById(ex.exId);
      out[e.m] = (out[e.m] || 0) + n;
      for (const m of e.sec || []) out[m] = (out[m] || 0) + n * 0.5;
    }
  }
  return out;
}

export function weekSessions() {
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  return S.sessions.filter(s => s.start >= monday.getTime());
}

export function streakWeeks() {
  // Semanas consecutivas (incluida la actual si ya hay entreno) con al menos un entreno
  const weekIdx = ts => { const d = new Date(ts); const m = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7)); return Math.round(m.getTime() / (7 * 864e5)); };
  const set = new Set(S.sessions.map(s => weekIdx(s.start)));
  let cur = weekIdx(Date.now());
  if (!set.has(cur)) cur--;
  let n = 0;
  while (set.has(cur)) { n++; cur--; }
  return n;
}

// ---------- Consejos ----------
export const TIPS = [
  { t: 'Come aunque no tengas hambre', b: 'Si te cuesta llegar a las calorías, reparte en 5 comidas y usa calorías líquidas: batidos con leche entera, avena, plátano y crema de cacahuete.' },
  { t: 'La proteína, repartida', b: 'Unos 25-40 g de proteína en cada comida principal estimulan mejor la síntesis muscular que concentrarla en una sola.' },
  { t: 'Sobrecarga progresiva', b: 'El músculo crece si cada semana haces un poco más: una repetición más o algo más de peso. La app te lo sugiere en cada serie.' },
  { t: 'Cerca del fallo, sin llegar siempre', b: 'Termina la mayoría de series dejando 1-2 repeticiones en reserva. El fallo total cansa mucho y aporta poco extra.' },
  { t: 'El sueño también construye', b: 'Duerme 7-9 horas. Dormir poco reduce la ganancia de músculo y aumenta la de grasa.' },
  { t: 'Creatina: el suplemento con más evidencia', b: '3-5 g de creatina monohidrato al día, cualquier hora. Mejora fuerza y ganancia de masa. No hace falta fase de carga.' },
  { t: 'Pésate bien', b: 'En ayunas, tras ir al baño y en ropa interior. Fíjate en la media semanal, no en el dato de un día.' },
  { t: 'Hidratos alrededor del entreno', b: 'Una comida con hidratos y proteína 1-3 horas antes del entreno te dará energía para rendir más.' },
  { t: 'Rango de repeticiones', b: 'Básicos pesados a 6-10 repeticiones y accesorios a 10-20. Todos los rangos construyen músculo si llegas cerca del fallo.' },
  { t: 'Descansa entre series', b: 'En ejercicios compuestos descansa 2-3 minutos. Descansar poco reduce las repeticiones y con ello el estímulo.' },
  { t: 'Técnica antes que peso', b: 'Recorrido completo y bajada controlada. Si el peso te obliga a acortar el movimiento, es demasiado.' },
  { t: 'Descarga cada 6-8 semanas', b: 'Si notas que te estancas y vas cansado, haz una semana con la mitad de series para recuperar.' },
  { t: 'Snacks densos', b: 'Frutos secos, dátiles, granola o crema de cacahuete aportan muchas calorías en poco volumen. Llévalos encima.' },
  { t: 'Paciencia', b: 'Un principiante puede ganar 0,5-1 kg de músculo al mes. Mide el progreso en meses, no en días.' },
];

export function tipOfDay() {
  const d = Math.floor(Date.now() / 864e5);
  return TIPS[d % TIPS.length];
}
