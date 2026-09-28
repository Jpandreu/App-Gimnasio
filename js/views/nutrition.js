import { S, ui, A, IN, SHEETS, render, commit, save, esc, num, uid, fmtNum, round, dayKey, addDays, fmtDay, openSheet, closeSheet, replaceSheet, toast } from '../core.js';
import { targets, dayTotals, dayLog, peekLog, allFoods, foodById, macrosFor, makeLogItem, scalePlan } from '../coach.js';
import { FOOD_CATS } from '../data/foods.js';
import { MEAL_PLANS, MEAL_LABELS, MEAL_ORDER } from '../data/plans.js';
import { icon, seg, ring, macroBar } from '../ui.js';
import { waterCard } from './today.js';

const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const kcalFmt = v => Math.round(v).toLocaleString('es-ES');

export function nutritionView() {
  const sub = ui.sub.nutri;
  return `<div class="screen" data-scroll="nutri-${sub}">
    <header class="top"><h1 class="title">Nutrición</h1></header>
    ${seg('nutriSub', sub, [['diario', 'Diario'], ['plan', 'Plan de comidas'], ['guia', 'Guía']])}
    ${sub === 'diario' ? diary() : sub === 'plan' ? planTab() : guideTab()}
  </div>`;
}
A.nutriSub = (el) => { ui.sub.nutri = el.dataset.v; render(); };

// ---------- Diario ----------
function diary() {
  const k = ui.day || dayKey();
  const t = targets(), tot = dayTotals(k), log = peekLog(k);
  const left = t.kcal - tot.kcal;
  const isToday = k === dayKey();
  return `
  <div class="date-nav">
    <button class="icon-btn" data-a="dayNav" data-v="-1" aria-label="Día anterior">${icon('left')}</button>
    <button class="date-btn" data-a="dayToday"><b>${fmtDay(k)}</b>${isToday ? '' : '<small>Volver a hoy</small>'}</button>
    <button class="icon-btn" data-a="dayNav" data-v="1" aria-label="Día siguiente" ${isToday ? 'disabled' : ''}>${icon('right')}</button>
  </div>
  <section class="card nutri-card">
    <div class="ring-wrap">${ring(tot.kcal / t.kcal, { size: 128, stroke: 11, over: tot.kcal > t.kcal * 1.1 })}
      <div class="ring-in"><b class="num">${kcalFmt(Math.abs(left))}</b><span>${left >= 0 ? 'restantes' : 'de más'}</span></div></div>
    <div class="grow macros">
      <div class="kcal-line"><b class="num">${kcalFmt(tot.kcal)}</b><span> / ${kcalFmt(t.kcal)} kcal</span></div>
      ${macroBar('Proteína', tot.p, t.p, 'm-p')}${macroBar('Hidratos', tot.c, t.c, 'm-c')}${macroBar('Grasa', tot.f, t.f, 'm-f')}
    </div>
  </section>
  ${!log.items.length && peekLog(addDays(k, -1)).items.length ? `<button class="btn block ghost" data-a="copyDay">${icon('copy')} Copiar comidas del día anterior</button>` : ''}
  ${MEAL_ORDER.map(m => {
    const items = log.items.filter(i => i.meal === m);
    if (m === 'extra' && !items.length) return '';
    const mk = items.reduce((a, i) => a + i.kcal, 0), mp = items.reduce((a, i) => a + i.p, 0);
    return `<section class="card meal">
      <div class="meal-head"><div class="grow"><b>${MEAL_LABELS[m]}</b>${items.length ? `<small class="muted num">${kcalFmt(mk)} kcal · ${Math.round(mp)} g proteína</small>` : ''}</div>
        <button class="add-btn" data-a="addFood" data-meal="${m}" aria-label="Añadir a ${MEAL_LABELS[m]}">${icon('plus')}</button></div>
      ${items.map(it => `<button class="food-row" data-a="editItem" data-id="${it.id}">
        <span class="grow"><b>${esc(it.name)}</b><small class="muted">${it.g ? `${fmtNum(it.g, 0)} g · ` : ''}P ${Math.round(it.p)} · H ${Math.round(it.c)} · G ${Math.round(it.f)}</small></span>
        <span class="num kc">${kcalFmt(it.kcal)}</span></button>`).join('')}
    </section>`;
  }).join('')}
  ${waterCard(k)}`;
}
A.dayNav = (el) => { const k = addDays(ui.day || dayKey(), num(el.dataset.v)); ui.day = k > dayKey() ? dayKey() : k; render(); };
A.dayToday = () => { ui.day = dayKey(); render(); };
A.copyDay = () => {
  const k = ui.day || dayKey();
  const prev = peekLog(addDays(k, -1));
  dayLog(k).items = prev.items.map(i => ({ ...i, id: uid() }));
  commit(); toast('Comidas copiadas');
};

// ---------- Buscador ----------
A.addFood = (el) => { ui.fs = { meal: el.dataset.meal, q: '', cat: 'recientes' }; openSheet('foodSearch'); };
function foodResults() {
  const { q, cat } = ui.fs;
  let list;
  if (q.trim()) {
    const words = norm(q).split(/\s+/).filter(Boolean);
    const nq = norm(q.trim());
    const score = f => { const n = norm(f.name); return n.startsWith(nq) ? 0 : n.split(/\s+/).some(w => w.startsWith(words[0])) ? 1 : 2; };
    list = allFoods().filter(f => words.every(w => norm(f.name).includes(w))).sort((a, b) => score(a) - score(b));
  } else if (cat === 'recientes') {
    list = S.recentFoods.map(foodById).filter(Boolean);
    if (!list.length) return `<p class="muted center pad">Aquí verás lo que comes a menudo. Busca un alimento o elige una categoría.</p>`;
  } else if (cat === 'mios') {
    list = S.customFoods;
    if (!list.length) return `<p class="muted center pad">Crea tus alimentos con los datos de la etiqueta.</p>`;
  } else list = allFoods().filter(f => f.cat === cat);
  if (!list.length) return `<p class="muted center pad">Sin resultados para "${esc(q)}". Puedes crearlo.</p>`;
  return list.slice(0, 80).map(f => `<button class="row food-pick" data-a="pickFood" data-id="${f.id}">
    <span class="grow"><b>${esc(f.name)}</b><small class="muted">${Math.round(f.kcal)} kcal · P ${fmtNum(f.p, 1)} · H ${fmtNum(f.c, 1)} · G ${fmtNum(f.f, 1)} <em>/100 g</em></small></span>${icon('plus', 'dim')}</button>`).join('');
}
SHEETS.foodSearch = () => ({
  title: `Añadir a ${MEAL_LABELS[ui.fs.meal].toLowerCase()}`, full: true,
  body: `<div class="search">${icon('search')}<input id="food-q" type="search" placeholder="Buscar alimento" value="${esc(ui.fs.q)}" data-in="foodQ" autocomplete="off"></div>
    <div class="chips scroll-x">${[['recientes', 'Recientes'], ['mios', 'Mis alimentos'], ...Object.entries(FOOD_CATS)].map(([k, l]) => `<button class="chip ${ui.fs.cat === k && !ui.fs.q ? 'on' : ''}" data-a="foodCat" data-v="${k}">${l}</button>`).join('')}</div>
    <div class="btn-row"><button class="btn sm ghost" data-a="quickAdd">${icon('bolt')} Añadir kcal rápidas</button><button class="btn sm ghost" data-a="newFood">${icon('plus')} Crear alimento</button></div>
    <div class="list flush" id="food-results">${foodResults()}</div>`,
});
IN.foodQ = (el) => { ui.fs.q = el.value; document.getElementById('food-results').innerHTML = foodResults(); };
A.foodCat = (el) => { ui.fs.cat = el.dataset.v; ui.fs.q = ''; render(); };
A.pickFood = (el) => {
  const f = foodById(el.dataset.id);
  const g = f.s?.[0]?.[1] || 100;
  ui.fa = { fid: f.id, g, meal: ui.fs.meal, editId: null };
  openSheet('foodAmount');
};

// ---------- Cantidad ----------
function amountPreview() {
  const f = foodById(ui.fa.fid), m = macrosFor(f, ui.fa.g || 0);
  return `<div class="amount-kcal"><b class="num">${kcalFmt(m.kcal)}</b><span>kcal</span></div>
    <div class="mac3"><div class="m-p"><b class="num">${fmtNum(m.p, 1)} g</b><span>Proteína</span></div><div class="m-c"><b class="num">${fmtNum(m.c, 1)} g</b><span>Hidratos</span></div><div class="m-f"><b class="num">${fmtNum(m.f, 1)} g</b><span>Grasa</span></div></div>`;
}
SHEETS.foodAmount = () => {
  const fa = ui.fa, f = foodById(fa.fid);
  return {
    title: f.name,
    body: `<div id="amount-prev" class="amount-prev">${amountPreview()}</div>
      <div class="field"><span>Cantidad</span>
        <div class="grams-row">
          <button class="icon-btn" data-a="gStep" data-v="-10" aria-label="Restar 10 g">${icon('minus')}</button>
          <label class="grams"><input id="fa-g" type="number" inputmode="decimal" value="${round(fa.g, 1)}" data-in="faG"><span>g</span></label>
          <button class="icon-btn" data-a="gStep" data-v="10" aria-label="Sumar 10 g">${icon('plus')}</button>
        </div></div>
      ${f.s?.length ? `<div class="chips wrap">${f.s.flatMap(([l, g]) => [1, 2].map(n => `<button class="chip" data-a="gSet" data-v="${g * n}">${n > 1 ? `${n} × ` : ''}${esc(l)} <em>${g * n} g</em></button>`)).join('')}<button class="chip" data-a="gSet" data-v="100">100 g</button></div>` : ''}
      <div class="field"><span>Comida</span><div class="chips wrap">${MEAL_ORDER.map(m => `<button class="chip ${fa.meal === m ? 'on' : ''}" data-a="faMeal" data-v="${m}">${MEAL_LABELS[m]}</button>`).join('')}</div></div>`,
    foot: fa.editId
      ? `<div class="btn-row"><button class="btn ghost danger" data-a="delItem">${icon('trash')} Quitar</button><button class="btn primary" data-a="saveAmount">Guardar</button></div>`
      : `<button class="btn primary block" data-a="saveAmount">Añadir</button>`,
  };
};
IN.faG = (el) => { ui.fa.g = Math.max(0, num(el.value)); document.getElementById('amount-prev').innerHTML = amountPreview(); };
A.gStep = (el) => { ui.fa.g = Math.max(0, round((ui.fa.g || 0) + num(el.dataset.v), 1)); document.getElementById('fa-g').value = ui.fa.g; document.getElementById('amount-prev').innerHTML = amountPreview(); };
A.gSet = (el) => { ui.fa.g = num(el.dataset.v); document.getElementById('fa-g').value = ui.fa.g; document.getElementById('amount-prev').innerHTML = amountPreview(); };
A.faMeal = (el) => { ui.fa.meal = el.dataset.v; render(); };
A.saveAmount = () => {
  const fa = ui.fa, f = foodById(fa.fid);
  if (!(fa.g > 0)) { toast('Indica una cantidad'); return; }
  const log = dayLog(ui.day || dayKey());
  if (fa.editId) {
    log.items = log.items.map(i => i.id === fa.editId ? { ...makeLogItem(f, fa.g, fa.meal), id: i.id } : i);
    ui.sheets = [];
  } else {
    log.items.push(makeLogItem(f, fa.g, fa.meal));
    S.recentFoods = [f.id, ...S.recentFoods.filter(x => x !== f.id)].slice(0, 30);
    ui.sheets = [];
    toast(`${f.name} añadido`);
  }
  commit();
};
A.editItem = (el) => {
  const it = peekLog(ui.day || dayKey()).items.find(i => i.id === el.dataset.id);
  if (!it) return;
  if (it.fid && foodById(it.fid)) { ui.fa = { fid: it.fid, g: it.g, meal: it.meal, editId: it.id }; openSheet('foodAmount'); }
  else { ui.qa = { ...it }; openSheet('quickAdd'); }
};
A.delItem = () => {
  const id = ui.fa?.editId || ui.qa?.id;
  const log = dayLog(ui.day || dayKey());
  log.items = log.items.filter(i => i.id !== id);
  ui.sheets = []; commit();
};

// ---------- Añadido rápido y alimentos propios ----------
A.quickAdd = () => { ui.qa = { id: null, name: '', kcal: '', p: '', c: '', f: '', meal: ui.fs.meal }; openSheet('quickAdd'); };
SHEETS.quickAdd = () => {
  const q = ui.qa;
  return {
    title: q.id ? 'Editar entrada' : 'Añadir calorías rápidas',
    body: `<label class="field"><span>Descripción</span><input id="qa-name" type="text" placeholder="Ej. Menú del día" value="${esc(q.name)}" data-in="qaF" data-k="name"></label>
      <div class="field-row four">
        <label class="field"><span>Kcal</span><input id="qa-kcal" type="number" inputmode="decimal" value="${q.kcal === '' ? '' : Math.round(q.kcal)}" data-in="qaF" data-k="kcal"></label>
        <label class="field m-p-t"><span>Prot. g</span><input id="qa-p" type="number" inputmode="decimal" value="${q.p === '' ? '' : round(q.p, 1)}" data-in="qaF" data-k="p"></label>
        <label class="field m-c-t"><span>Hidr. g</span><input id="qa-c" type="number" inputmode="decimal" value="${q.c === '' ? '' : round(q.c, 1)}" data-in="qaF" data-k="c"></label>
        <label class="field m-f-t"><span>Grasa g</span><input id="qa-f" type="number" inputmode="decimal" value="${q.f === '' ? '' : round(q.f, 1)}" data-in="qaF" data-k="f"></label>
      </div>
      <p class="hint">Si dejas las kcal vacías se calculan con los macros (4/4/9).</p>`,
    foot: q.id ? `<div class="btn-row"><button class="btn ghost danger" data-a="delItem">${icon('trash')} Quitar</button><button class="btn primary" data-a="saveQuick">Guardar</button></div>` : `<button class="btn primary block" data-a="saveQuick">Añadir</button>`,
  };
};
IN.qaF = (el) => { ui.qa[el.dataset.k] = el.dataset.k === 'name' ? el.value : (el.value === '' ? '' : num(el.value)); };
A.saveQuick = () => {
  const q = ui.qa;
  const p = num(q.p), c = num(q.c), f = num(q.f);
  const kcal = q.kcal === '' ? p * 4 + c * 4 + f * 9 : num(q.kcal);
  if (!(kcal > 0)) { toast('Indica calorías o macros'); return; }
  const item = { id: q.id || uid(), fid: null, name: q.name.trim() || 'Añadido rápido', g: 0, meal: q.meal, kcal, p, c, f };
  const log = dayLog(ui.day || dayKey());
  log.items = q.id ? log.items.map(i => i.id === q.id ? item : i) : [...log.items, item];
  ui.sheets = []; commit(); toast('Añadido');
};

A.newFood = () => { ui.nf = { name: ui.fs?.q || '', kcal: '', p: '', c: '', f: '', sg: '' }; openSheet('newFood'); };
SHEETS.newFood = () => ({
  title: 'Crear alimento',
  body: `<p class="muted">Copia los valores por 100 g de la etiqueta nutricional.</p>
    <label class="field"><span>Nombre</span><input id="nf-name" type="text" value="${esc(ui.nf.name)}" data-in="nfF" data-k="name"></label>
    <div class="field-row four">
      <label class="field"><span>Kcal</span><input id="nf-kcal" type="number" inputmode="decimal" data-in="nfF" data-k="kcal"></label>
      <label class="field m-p-t"><span>Prot.</span><input id="nf-p" type="number" inputmode="decimal" data-in="nfF" data-k="p"></label>
      <label class="field m-c-t"><span>Hidr.</span><input id="nf-c" type="number" inputmode="decimal" data-in="nfF" data-k="c"></label>
      <label class="field m-f-t"><span>Grasa</span><input id="nf-f" type="number" inputmode="decimal" data-in="nfF" data-k="f"></label>
    </div>
    <label class="field"><span>Ración habitual (g, opcional)</span><input id="nf-sg" type="number" inputmode="decimal" data-in="nfF" data-k="sg"></label>`,
  foot: `<button class="btn primary block" data-a="saveNewFood">Crear y añadir</button>`,
});
IN.nfF = (el) => { ui.nf[el.dataset.k] = el.dataset.k === 'name' ? el.value : num(el.value); };
A.saveNewFood = () => {
  const n = ui.nf;
  if (!n.name.trim()) { toast('Escribe un nombre'); return; }
  const kcal = num(n.kcal) || num(n.p) * 4 + num(n.c) * 4 + num(n.f) * 9;
  if (!(kcal > 0)) { toast('Indica las calorías por 100 g'); return; }
  const food = { id: 'u-' + uid(), name: n.name.trim(), cat: 'mios', kcal, p: num(n.p), c: num(n.c), f: num(n.f), s: num(n.sg) > 0 ? [['Ración', num(n.sg)]] : [] };
  S.customFoods.unshift(food);
  save();
  ui.fa = { fid: food.id, g: num(n.sg) || 100, meal: ui.fs?.meal || 'comida', editId: null };
  replaceSheet('foodAmount');
};

// ---------- Plan de comidas ----------
function planTab() {
  const t = targets();
  ui.planOpen = ui.planOpen ?? MEAL_PLANS[0].id;
  return `<p class="muted">Tres días tipo ajustados a tus <b>${kcalFmt(t.kcal)} kcal</b>. Alterna entre ellos o úsalos como idea. Puedes añadir cada comida a tu diario con un toque.</p>
  ${MEAL_PLANS.map(plan => {
    const meals = scalePlan(plan, t.kcal);
    const tot = meals.reduce((a, m) => ({ kcal: a.kcal + m.tot.kcal, p: a.p + m.tot.p, c: a.c + m.tot.c, f: a.f + m.tot.f }), { kcal: 0, p: 0, c: 0, f: 0 });
    const open = ui.planOpen === plan.id;
    return `<section class="card plan ${open ? 'open' : ''}">
      <button class="plan-head" data-a="planToggle" data-id="${plan.id}" aria-expanded="${open}">
        <span class="grow"><b>${esc(plan.name)}</b><small class="muted">${esc(plan.desc)}</small>
        <span class="plan-mac num"><i>${kcalFmt(tot.kcal)} kcal</i><i class="m-p-t">P ${Math.round(tot.p)}</i><i class="m-c-t">H ${Math.round(tot.c)}</i><i class="m-f-t">G ${Math.round(tot.f)}</i></span></span>
        ${icon(open ? 'up' : 'down', 'dim')}</button>
      ${open ? `${meals.map((m, mi) => `<div class="plan-meal">
          <div class="row-between"><div><span class="label">${MEAL_LABELS[m.meal]}</span><b>${esc(m.name)}</b></div>
            <button class="btn sm ghost" data-a="planAdd" data-id="${plan.id}" data-mi="${mi}">${icon('plus')} Añadir</button></div>
          <ul class="plan-items">${m.items.map(it => `<li><span>${esc(it.food.name)}</span><span class="num">${it.food.id === 'huevo' ? `${Math.round(it.g / 55)} ud.` : `${it.g} g`}</span></li>`).join('')}</ul>
          <small class="muted num">${kcalFmt(m.tot.kcal)} kcal · P ${Math.round(m.tot.p)} · H ${Math.round(m.tot.c)} · G ${Math.round(m.tot.f)}</small>
        </div>`).join('')}
        <button class="btn block primary soft" data-a="planAddAll" data-id="${plan.id}">Añadir el día completo a hoy</button>` : ''}
    </section>`;
  }).join('')}`;
}
A.planToggle = (el) => { ui.planOpen = ui.planOpen === el.dataset.id ? '' : el.dataset.id; render(); };
function addPlanMeals(planId, onlyIdx = null) {
  const plan = MEAL_PLANS.find(p => p.id === planId);
  const meals = scalePlan(plan, targets().kcal);
  const log = dayLog(dayKey());
  meals.forEach((m, i) => {
    if (onlyIdx !== null && i !== onlyIdx) return;
    for (const it of m.items) log.items.push(makeLogItem(it.food, it.g, m.meal));
  });
}
A.planAdd = (el) => { addPlanMeals(el.dataset.id, +el.dataset.mi); commit(); toast('Comida añadida al diario de hoy'); };
A.planAddAll = (el) => { addPlanMeals(el.dataset.id); commit(); toast('Día completo añadido a hoy'); };

// ---------- Guía ----------
function guideTab() {
  const t = targets(), w = t.weight;
  const perMeal = Math.round(t.p / 4);
  return `
  <section class="card guide-hero">
    <div class="label">Tu fórmula para ganar masa</div>
    <div class="formula">
      <div><b class="num">${kcalFmt(t.kcal)}</b><span>kcal/día</span></div>
      <div class="m-p"><b class="num">${t.p} g</b><span>proteína</span></div>
      <div><b class="num">+${fmtNum(w * 0.004, 1)}-${fmtNum(w * 0.007, 1)}</b><span>kg por semana</span></div>
    </div>
    <p class="hint">Ganar entre el 0,4 y el 0,7% de tu peso por semana maximiza el músculo y limita la grasa.</p>
  </section>

  <details class="card acc" open><summary><b>1. Come más de lo que gastas</b>${icon('down', 'dim')}</summary>
    <p>Tu cuerpo gasta unas ${kcalFmt(t.tdee)} kcal al día. Sin superávit no hay material para construir músculo, por mucho que entrenes. Si en 2 semanas tu peso no sube, suma 150-200 kcal (la app te avisa en la pantalla Hoy).</p></details>

  <details class="card acc"><summary><b>2. Proteína en cada comida</b>${icon('down', 'dim')}</summary>
    <p>Reparte tus ${t.p} g en 4-5 tomas de unos ${perMeal} g. Equivalencias de ${perMeal} g de proteína:</p>
    <ul class="dots-list"><li>${Math.round(perMeal / 0.31)} g de pechuga de pollo cocinada</li><li>${Math.round(perMeal / 0.26 / 56 * 10) / 10} latas de atún (${Math.round(perMeal / 0.26)} g)</li><li>${Math.round(perMeal / 6.9)} huevos</li><li>${Math.round(perMeal / 0.11)} g de skyr o yogur proteico</li><li>${Math.round(perMeal / 0.78)} g de proteína whey</li></ul></details>

  <details class="card acc"><summary><b>3. Si te cuesta comer tanto</b>${icon('down', 'dim')}</summary>
    <ul class="dots-list">
      <li><b>Bebe calorías:</b> un batido de 500 ml de leche entera, 60 g de avena, un plátano y una cucharada de crema de cacahuete aporta unas 750 kcal.</li>
      <li><b>Alimentos densos:</b> aceite de oliva en platos (120 kcal por cucharada), frutos secos, dátiles, granola, queso curado.</li>
      <li><b>Más comidas, no más grandes:</b> 5 tomas y un snack antes de dormir.</li>
      <li><b>Menos verdura voluminosa</b> en las comidas principales: llena y aporta pocas calorías. No la elimines, ponla de acompañamiento.</li>
      <li><b>Horario fijo:</b> pon alarmas. El hambre no es buena guía cuando buscas superávit.</li>
    </ul></details>

  <details class="card acc"><summary><b>4. Alrededor del entreno</b>${icon('down', 'dim')}</summary>
    <ul class="dots-list">
      <li><b>1-3 h antes:</b> hidratos y proteína. Ej: arroz o pasta con pollo, o tostadas con pavo y un plátano.</li>
      <li><b>Después:</b> comida completa con 30-40 g de proteína en las 2 horas siguientes.</li>
      <li><b>Día de pierna:</b> más hidratos ese día, rindes y recuperas mejor.</li>
    </ul></details>

  <details class="card acc"><summary><b>5. Suplementos que merecen la pena</b>${icon('down', 'dim')}</summary>
    <ul class="dots-list">
      <li><b>Creatina monohidrato:</b> 3-5 g diarios, siempre. El suplemento con más evidencia para ganar fuerza y masa.</li>
      <li><b>Proteína whey:</b> no es imprescindible, pero es una forma cómoda de llegar a tu proteína.</li>
      <li><b>Cafeína:</b> 1-3 mg/kg antes de entrenar si te ayuda a rendir. Evítala por la tarde para no dormir peor.</li>
      <li><b>Gainers:</b> suelen ser azúcar caro. Un batido casero hace lo mismo.</li>
    </ul></details>

  <details class="card acc"><summary><b>6. Lista de la compra para volumen</b>${icon('down', 'dim')}</summary>
    <div class="shop">
      <div><span class="label m-p-t">Proteína</span><p>Pollo, pavo, huevos, atún, salmón, carne picada, skyr, queso fresco batido, leche entera.</p></div>
      <div><span class="label m-c-t">Hidratos</span><p>Arroz, pasta, avena, pan, patata, boniato, legumbres, plátanos, dátiles.</p></div>
      <div><span class="label m-f-t">Grasas</span><p>Aceite de oliva, crema de cacahuete, frutos secos, aguacate, chocolate negro.</p></div>
    </div></details>

  <details class="card acc"><summary><b>7. Descanso e hidratación</b>${icon('down', 'dim')}</summary>
    <p>Duerme 7-9 horas: el músculo se construye mientras descansas. Bebe unos ${fmtNum(t.water / 1000, 1)} L de agua al día, más si sudas mucho.</p></details>
  <p class="foot-note">Recomendaciones generales para adultos sanos. Si tienes alguna condición médica, consulta con un profesional.</p>`;
}
