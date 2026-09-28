// Nutrición avanzada: platos personalizables, comidas guardadas, recetas propias y favoritos.
import { S, ui, A, IN, SHEETS, render, commit, save, esc, num, uid, fmtNum, round, dayKey, addDays, openSheet, closeSheet, replaceSheet, confirmBox, toast } from '../core.js';
import { dayLog, peekLog, foodById, macrosFor, makeLogItem } from '../coach.js';
import { DISHES, DISH_BY_ID, defaultSel } from '../data/dishes.js';
import { MEAL_LABELS, MEAL_ORDER } from '../data/plans.js';
import { icon } from '../ui.js';

const kcalFmt = v => Math.round(v).toLocaleString('es-ES');
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const sumItems = items => items.reduce((a, it) => ({ kcal: a.kcal + it.kcal, p: a.p + it.p, c: a.c + it.c, f: a.f + it.f, g: a.g + (it.g || 0) }), { kcal: 0, p: 0, c: 0, f: 0, g: 0 });
const macroPreview = t => `<div class="amount-kcal"><b class="num">${kcalFmt(t.kcal)}</b><span>kcal</span></div>
  <div class="mac3"><div class="m-p"><b class="num">${fmtNum(t.p, 1)} g</b><span>Proteína</span></div><div class="m-c"><b class="num">${fmtNum(t.c, 1)} g</b><span>Hidratos</span></div><div class="m-f"><b class="num">${fmtNum(t.f, 1)} g</b><span>Grasa</span></div></div>`;
const logDay = () => ui.day || dayKey();

export const plural = (u, n) => n === 1 ? u : u.endsWith('ón') ? u.slice(0, -2) + 'ones' : /[ld]$/.test(u) ? u + 'es' : u + 's';

export function mealNow() {
  const h = new Date().getHours();
  return h < 11 ? 'desayuno' : h < 13 ? 'almuerzo' : h < 17 ? 'comida' : h < 20 ? 'merienda' : 'cena';
}

// ================= Platos personalizables =================
const optMacros = (opt, k = 1) => sumItems(opt.i.map(([id, g]) => { const f = foodById(id); return f ? { ...macrosFor(f, g * k), g: g * k } : { kcal: 0, p: 0, c: 0, f: 0, g: 0 }; }));

export function dishTotals(dish, sel, qty = 1) {
  const parts = [];
  dish.groups.forEach((g, gi) => (sel[gi] || []).forEach(oi => { const op = g.o[oi]; if (op) parts.push(optMacros(op, qty)); }));
  return sumItems(parts);
}

// Nombre corto: solo lo que cambia respecto a la versión por defecto
function dishName(dish, sel, qty) {
  const chosen = [], def = defaultSel(dish);
  dish.groups.forEach((g, gi) => {
    const cur = sel[gi] || [];
    cur.forEach(oi => { if (!def[gi].includes(oi) && g.o[oi] && g.o[oi].l !== 'Nada') chosen.push(g.o[oi].l.toLowerCase()); });
    if (g.t === 'many') def[gi].forEach(oi => { if (!cur.includes(oi)) chosen.push(`sin ${g.o[oi].l.toLowerCase()}`); });
  });
  const unitInName = norm(dish.name).includes(norm(dish.unit));
  const base = qty === 1 ? dish.name : unitInName ? `${fmtNum(qty, 1)} × ${dish.name}` : `${dish.name} (${fmtNum(qty, 1)} ${plural(dish.unit, qty)})`;
  const txt = `${base}${chosen.length ? ` · ${chosen.join(', ')}` : ''}`;
  return txt.length > 90 ? txt.slice(0, 88) + '…' : txt;
}

export function dishMatches(q) {
  const nq = norm(q.trim());
  if (!nq) return [];
  return DISHES.filter(d => norm(`${d.name} ${d.keywords}`).includes(nq) || nq.split(/\s+/).some(w => w.length > 2 && norm(d.keywords).split(' ').some(k => k.startsWith(w))));
}

export const dishGrid = () => `<div class="dish-grid">${DISHES.map(d => {
  const t = dishTotals(d, defaultSel(d));
  return `<button class="dish-tile" data-a="openDish" data-id="${d.id}"><b>${esc(d.name)}</b><small class="num">desde ~${kcalFmt(t.kcal)} kcal</small></button>`;
}).join('')}</div>`;

A.openDish = (el) => {
  const d = DISH_BY_ID[el.dataset.id];
  ui.db = { id: d.id, sel: defaultSel(d), qty: 1, meal: ui.fs?.meal || mealNow(), editId: null };
  openSheet('dish');
};

SHEETS.dish = () => {
  const b = ui.db, d = DISH_BY_ID[b.id], t = dishTotals(d, b.sel, b.qty);
  return {
    title: d.name, full: true,
    body: `<div class="amount-prev dish-prev">${macroPreview(t)}</div>
      <div class="qty-row"><span>Cantidad</span>
        <div class="stepper"><button type="button" data-a="dishQty" data-v="-0.5" aria-label="Menos" ${b.qty <= 0.5 ? 'disabled' : ''}>${icon('minus')}</button>
        <span class="num">${fmtNum(b.qty, 1)}</span><button type="button" data-a="dishQty" data-v="0.5" aria-label="Más">${icon('plus')}</button></div>
        <small class="muted">${plural(d.unit, b.qty)}</small></div>
      ${d.groups.map((g, gi) => `<div class="dish-group"><h3 class="label">${esc(g.n)}${g.t === 'many' ? ' <em>· puedes marcar varias</em>' : ''}</h3>
        <div class="chips wrap">${g.o.map((op, oi) => {
          const on = (b.sel[gi] || []).includes(oi), k = Math.round(optMacros(op).kcal);
          return `<button type="button" class="chip opt-chip ${on ? 'on' : ''} ${g.t}" data-a="dishOpt" data-g="${gi}" data-o="${oi}" aria-pressed="${on}">${g.t === 'many' ? `<i class="ck">${on ? icon('check') : ''}</i>` : ''}${esc(op.l)}${k ? ` <em>${k > 0 ? '+' : ''}${k}</em>` : ''}</button>`;
        }).join('')}</div></div>`).join('')}
      <div class="field"><span>Comida</span><div class="chips wrap">${MEAL_ORDER.map(m => `<button type="button" class="chip ${b.meal === m ? 'on' : ''}" data-a="dishMeal" data-v="${m}">${MEAL_LABELS[m]}</button>`).join('')}</div></div>
      <details class="dish-ing"><summary class="hint">Ver ingredientes y cantidades</summary><ul>${dishIngredients(d, b).map(([n, g]) => `<li><span>${esc(n)}</span><span class="num">${Math.round(g)} g</span></li>`).join('')}</ul></details>`,
    foot: b.editId
      ? `<div class="btn-row"><button class="btn ghost danger" data-a="dishDelete">${icon('trash')} Quitar</button><button class="btn primary" data-a="dishSave">Guardar</button></div>`
      : `<button class="btn primary block" data-a="dishSave">Añadir · ${kcalFmt(t.kcal)} kcal</button>`,
  };
};
function dishIngredients(d, b) {
  const m = new Map();
  d.groups.forEach((g, gi) => (b.sel[gi] || []).forEach(oi => g.o[oi]?.i.forEach(([id, gr]) => { const f = foodById(id); if (f) m.set(f.name, (m.get(f.name) || 0) + gr * b.qty); })));
  return [...m.entries()];
}
A.dishOpt = (el) => {
  const b = ui.db, d = DISH_BY_ID[b.id], gi = +el.dataset.g, oi = +el.dataset.o, g = d.groups[gi];
  if (g.t === 'one') b.sel[gi] = [oi];
  else b.sel[gi] = b.sel[gi].includes(oi) ? b.sel[gi].filter(x => x !== oi) : [...b.sel[gi], oi].sort((x, y) => x - y);
  render();
};
A.dishQty = (el) => { ui.db.qty = Math.max(0.5, Math.min(10, ui.db.qty + num(el.dataset.v))); render(); };
A.dishMeal = (el) => { ui.db.meal = el.dataset.v; render(); };
A.dishSave = () => {
  const b = ui.db, d = DISH_BY_ID[b.id], t = dishTotals(d, b.sel, b.qty);
  const item = { id: b.editId || uid(), fid: null, name: dishName(d, b.sel, b.qty), g: Math.round(t.g), meal: b.meal, kcal: t.kcal, p: t.p, c: t.c, f: t.f, dish: { id: d.id, sel: b.sel, qty: b.qty } };
  const log = dayLog(logDay());
  log.items = b.editId ? log.items.map(i => i.id === b.editId ? item : i) : [...log.items, item];
  ui.sheets = []; commit(); toast(b.editId ? 'Guardado' : `${d.name} añadida`);
};
A.dishDelete = () => { const log = dayLog(logDay()); log.items = log.items.filter(i => i.id !== ui.db.editId); ui.sheets = []; commit(); };
export function editDishItem(it) {
  if (!DISH_BY_ID[it.dish?.id]) return false;
  ui.db = { id: it.dish.id, sel: it.dish.sel.map(x => [...x]), qty: it.dish.qty || 1, meal: it.meal, editId: it.id };
  openSheet('dish');
  return true;
}

// ================= Menú de cada comida =================
A.mealMenu = (el) => openSheet('mealMenu', { meal: el.dataset.meal });
SHEETS.mealMenu = ({ meal }) => {
  const k = logDay(), items = peekLog(k).items.filter(i => i.meal === meal);
  const yItems = peekLog(addDays(k, -1)).items.filter(i => i.meal === meal);
  return {
    title: MEAL_LABELS[meal],
    body: `<div class="list">
      <button class="row" data-a="copyMealYesterday" data-meal="${meal}" ${yItems.length ? '' : 'disabled'}>${icon('copy')}<span class="grow">Copiar ${MEAL_LABELS[meal].toLowerCase()} de ayer<small>${yItems.length ? `${yItems.length} alimentos · ${kcalFmt(sumItems(yItems).kcal)} kcal` : 'Ayer no registraste nada'}</small></span></button>
      <button class="row" data-a="saveMealAsk" data-meal="${meal}" ${items.length ? '' : 'disabled'}>${icon('bookmark')}<span class="grow">Guardar como comida habitual<small>Para añadirla entera con un toque</small></span></button>
      <button class="row" data-a="addSavedTo" data-meal="${meal}" ${(S.savedMeals || []).length ? '' : 'disabled'}>${icon('plus')}<span class="grow">Añadir una comida guardada</span></button>
      <button class="row danger" data-a="clearMeal" data-meal="${meal}" ${items.length ? '' : 'disabled'}>${icon('trash')}<span class="grow">Vaciar ${MEAL_LABELS[meal].toLowerCase()}</span></button>
    </div>`,
  };
};
const cloneItem = (i, meal) => ({ ...i, id: uid(), meal: meal ?? i.meal, dish: i.dish ? JSON.parse(JSON.stringify(i.dish)) : undefined });
A.copyMealYesterday = (el) => {
  const k = logDay(), meal = el.dataset.meal;
  const y = peekLog(addDays(k, -1)).items.filter(i => i.meal === meal);
  dayLog(k).items.push(...y.map(i => cloneItem(i)));
  ui.sheets = []; commit(); toast('Copiado de ayer');
};
A.clearMeal = (el) => {
  const meal = el.dataset.meal;
  confirmBox({ title: `¿Vaciar ${MEAL_LABELS[meal].toLowerCase()}?`, ok: 'Vaciar', danger: true,
    onOk: () => { const l = dayLog(logDay()); l.items = l.items.filter(i => i.meal !== meal); ui.sheets = []; commit(); } });
};

// ================= Comidas guardadas =================
A.saveMealAsk = (el) => { ui.sm = { meal: el.dataset.meal, name: `Mi ${MEAL_LABELS[el.dataset.meal].toLowerCase()}` }; openSheet('saveMeal'); };
SHEETS.saveMeal = () => {
  const items = peekLog(logDay()).items.filter(i => i.meal === ui.sm.meal), t = sumItems(items);
  return {
    title: 'Guardar comida',
    body: `<label class="field"><span>Nombre</span><input id="sm-name" type="text" value="${esc(ui.sm.name)}" data-in="smName"></label>
      <div class="card inset"><ul class="plan-items">${items.map(i => `<li><span>${esc(i.name)}</span><span class="num">${kcalFmt(i.kcal)} kcal</span></li>`).join('')}</ul>
      <small class="muted num">${kcalFmt(t.kcal)} kcal · P ${Math.round(t.p)} · H ${Math.round(t.c)} · G ${Math.round(t.f)}</small></div>`,
    foot: `<button class="btn primary block" data-a="saveMealDo">Guardar</button>`,
  };
};
IN.smName = (el) => { ui.sm.name = el.value; };
A.saveMealDo = () => {
  const items = peekLog(logDay()).items.filter(i => i.meal === ui.sm.meal).map(({ id, meal, ...rest }) => rest);
  S.savedMeals = [{ id: uid(), name: ui.sm.name.trim() || 'Comida guardada', items }, ...(S.savedMeals || [])];
  ui.sheets = []; commit(); toast('Comida guardada');
};
export function savedMealsList(q = '') {
  const nq = norm(q.trim());
  const list = (S.savedMeals || []).filter(m => !nq || norm(m.name).includes(nq));
  return list.map(m => {
    const t = sumItems(m.items);
    return `<div class="row saved-meal"><button class="grow sm-main" data-a="addSavedMeal" data-id="${m.id}"><b>${esc(m.name)}</b><small class="muted">${m.items.length} ${m.items.length === 1 ? 'alimento' : 'alimentos'} · ${kcalFmt(t.kcal)} kcal · P ${Math.round(t.p)} g</small></button>
      <button class="icon-btn sm" data-a="delSavedMeal" data-id="${m.id}" aria-label="Borrar ${esc(m.name)}">${icon('trash')}</button></div>`;
  }).join('');
}
A.addSavedTo = (el) => { ui.fs = { meal: el.dataset.meal, q: '', cat: 'guardadas' }; ui.sheets = []; openSheet('foodSearch'); };
A.addSavedMeal = (el) => {
  const m = (S.savedMeals || []).find(x => x.id === el.dataset.id);
  if (!m) return;
  dayLog(logDay()).items.push(...m.items.map(i => cloneItem(i, ui.fs?.meal || mealNow())));
  ui.sheets = []; commit(); toast(`${m.name} añadida`);
};
A.delSavedMeal = (el) => {
  const id = el.dataset.id, m = S.savedMeals.find(x => x.id === id);
  confirmBox({ title: `¿Borrar "${m.name}"?`, text: 'Solo se borra la comida guardada, no tu diario.', ok: 'Borrar', danger: true,
    onOk: () => { S.savedMeals = S.savedMeals.filter(x => x.id !== id); save(); } });
};

// ================= Favoritos =================
export const isFav = id => (S.favFoods || []).includes(id);
A.toggleFav = (el) => {
  const id = el.dataset.id;
  S.favFoods = isFav(id) ? S.favFoods.filter(x => x !== id) : [id, ...(S.favFoods || [])];
  save();
  el.classList.toggle('on', isFav(id));
  el.setAttribute('aria-pressed', isFav(id));
  el.innerHTML = `${icon('star')} ${isFav(id) ? 'En favoritos' : 'Añadir a favoritos'}`;
};

// ================= Recetas propias =================
A.newRecipe = () => {
  // La receta sustituye al buscador para no tener dos buscadores abiertos a la vez
  ui.rc = { name: '', servings: 1, items: [], meal: ui.fs?.meal || null };
  ui.sheets = ui.sheets.filter(x => x.type !== 'foodSearch');
  openSheet('recipe');
};
SHEETS.recipe = () => {
  const r = ui.rc, t = sumItems(r.items), per = r.servings || 1;
  return {
    title: 'Crear receta', full: true,
    body: `<p class="muted">Añade los ingredientes en crudo y en cuántas raciones sale. Se guardará en "Mis alimentos".</p>
      <label class="field"><span>Nombre</span><input id="rc-name" type="text" placeholder="Ej. Lentejas de mi madre" value="${esc(r.name)}" data-in="rcName"></label>
      <div class="qty-row"><span>Raciones</span><div class="stepper"><button type="button" data-a="rcServ" data-v="-1" ${per <= 1 ? 'disabled' : ''} aria-label="Menos raciones">${icon('minus')}</button><span class="num">${per}</span><button type="button" data-a="rcServ" data-v="1" aria-label="Más raciones">${icon('plus')}</button></div></div>
      <div class="card inset rc-list">${r.items.length ? r.items.map((it, i) => `<div class="rc-row"><span class="grow"><b>${esc(it.name)}</b><small class="muted num">${fmtNum(it.g, 0)} g · ${kcalFmt(it.kcal)} kcal</small></span><button class="icon-btn sm" data-a="rcDel" data-i="${i}" aria-label="Quitar">${icon('x')}</button></div>`).join('') : '<p class="muted">Aún no hay ingredientes.</p>'}
        <button class="btn sm ghost" data-a="rcAddIng">${icon('plus')} Añadir ingrediente</button></div>
      ${r.items.length ? `<div class="card inset"><span class="label">Por ración (${fmtNum(t.g / per, 0)} g)</span><div class="amount-prev">${macroPreview({ kcal: t.kcal / per, p: t.p / per, c: t.c / per, f: t.f / per })}</div></div>` : ''}`,
    foot: `<button class="btn primary block" data-a="rcSave" ${r.items.length ? '' : 'disabled'}>Guardar receta</button>`,
  };
};
IN.rcName = (el) => { ui.rc.name = el.value; };
A.rcServ = (el) => { ui.rc.servings = Math.max(1, Math.min(20, ui.rc.servings + num(el.dataset.v))); render(); };
A.rcDel = (el) => { ui.rc.items.splice(+el.dataset.i, 1); render(); };
A.rcAddIng = () => { ui.fs = { meal: 'comida', q: '', cat: 'recientes', mode: 'recipe' }; openSheet('foodSearch'); };
export function addRecipeIngredient(food, g) {
  ui.rc.items.push({ fid: food.id, name: food.name, g, ...macrosFor(food, g) });
  ui.sheets.pop(); ui.sheets.pop(); // cantidad + buscador
  render();
}
A.rcSave = () => {
  const r = ui.rc;
  if (!r.name.trim()) { toast('Ponle un nombre a la receta'); return; }
  const t = sumItems(r.items);
  const k = 100 / t.g;
  const food = { id: 'r-' + uid(), name: r.name.trim(), cat: 'mios', recipe: true, kcal: t.kcal * k, p: t.p * k, c: t.c * k, f: t.f * k, s: [['Ración', Math.round(t.g / r.servings)]] };
  S.customFoods.unshift(food);
  save();
  toast('Receta guardada');
  ui.sheets.pop();
  if (r.meal) {
    // Veníamos de añadir a una comida: se ofrece añadir una ración
    ui.fs = { meal: r.meal, q: '', cat: 'mios' };
    ui.fa = { fid: food.id, g: food.s[0][1], meal: r.meal, editId: null };
    openSheet('foodAmount');
  } else render();
};
A.delCustomFood = (el) => {
  const id = el.dataset.id, f = foodById(id);
  confirmBox({ title: `¿Borrar "${f.name}"?`, text: 'Se quita de tus alimentos. Lo ya registrado en el diario se mantiene.', ok: 'Borrar', danger: true,
    onOk: () => { S.customFoods = S.customFoods.filter(x => x.id !== id); S.favFoods = (S.favFoods || []).filter(x => x !== id); S.recentFoods = S.recentFoods.filter(x => x !== id); ui.sheets = ui.sheets.filter(s => s.type !== 'foodAmount'); commit(); } });
};
