// Búsqueda de productos en Open Food Facts (base de datos abierta y colaborativa de alimentos envasados).
// La hace el móvil directamente; los productos que se usan se guardan en "Mis alimentos".
import { S, ui, A, IN, SHEETS, render, save, esc, num, round, openSheet, toast } from '../core.js';
import { OFF_CACHE } from '../coach.js';
import { icon } from '../ui.js';
import { foodEmoji } from '../data/emoji.js';

const FIELDS = 'code,product_name,product_name_es,generic_name_es,brands,nutriments,serving_quantity,quantity';

function toFood(p) {
  const n = p.nutriments || {};
  let kcal = num(n['energy-kcal_100g']);
  if (!kcal && n.energy_100g) kcal = num(n.energy_100g) / 4.184;
  const name = (p.product_name_es || p.product_name || p.generic_name_es || '').trim();
  if (!name || !(kcal > 0) || !p.code) return null;
  const brand = (p.brands || '').split(',')[0].trim();
  const serving = num(p.serving_quantity);
  return {
    id: 'off-' + p.code, name: brand && !name.toLowerCase().includes(brand.toLowerCase()) ? `${name} · ${brand}` : name,
    cat: 'mios', off: true, code: p.code,
    kcal: round(kcal, 1), p: round(num(n.proteins_100g), 1), c: round(num(n.carbohydrates_100g), 1), f: round(num(n.fat_100g), 1),
    s: serving > 0 && serving < 2000 ? [['Ración del envase', round(serving, 1)]] : [],
  };
}

async function getJSON(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error('http ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}

export function onlineBlock() {
  const st = ui.fs?.off;
  const q = (ui.fs?.q || '').trim();
  if (!st || st.q !== q) {
    return q.length >= 3 ? `<button class="btn block ghost off-btn" data-a="offSearch">🌐 Buscar "${esc(q)}" en internet<small>Millones de productos de supermercado (Open Food Facts)</small></button>` : '';
  }
  if (st.state === 'loading') return `<div class="off-state">🌐 Buscando en Open Food Facts…</div>`;
  if (st.state === 'error') return `<div class="off-state">No se ha podido conectar. Comprueba tu conexión a internet e inténtalo de nuevo.<button class="btn sm ghost" data-a="offSearch">Reintentar</button></div>`;
  if (!st.items.length) return `<div class="off-state">No hay productos con información nutricional para "${esc(q)}" en Open Food Facts. Prueba con otra palabra o crea el alimento con su etiqueta.</div>`;
  return `<h3 class="section-t">🌐 En internet · Open Food Facts</h3>${st.items.map(f => `<button class="row food-pick" data-a="pickFood" data-id="${esc(f.id)}"><span class="emo">${foodEmoji(f)}</span>
    <span class="grow"><b>${esc(f.name)}</b><small class="muted">100 g · ${Math.round(f.kcal)} kcal · P ${f.p} · H ${f.c} · G ${f.f}</small></span>${icon('plus', 'dim')}</button>`).join('')}
    <p class="hint">Datos aportados por la comunidad de Open Food Facts. Revisa que coincidan con la etiqueta.</p>`;
}

const refresh = () => { if (ui.sheets.some(s => s.type === 'foodSearch')) render(); };

A.offSearch = async () => {
  const q = (ui.fs.q || '').trim();
  if (q.length < 3) return;
  ui.fs.off = { q, state: 'loading', items: [] };
  refresh();
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=40&sort_by=unique_scans_n&lc=es&fields=${FIELDS}`;
    const data = await getJSON(url);
    const seen = new Set();
    const items = (data.products || []).map(toFood).filter(f => f && !seen.has(f.name.toLowerCase()) && seen.add(f.name.toLowerCase())).slice(0, 30);
    items.forEach(f => OFF_CACHE.set(f.id, f));
    if (ui.fs?.off?.q === q) ui.fs.off = { q, state: 'ok', items };
  } catch {
    if (ui.fs?.off?.q === q) ui.fs.off = { q, state: 'error', items: [] };
  }
  refresh();
};

// Código de barras escrito a mano (la cámara no está disponible en todos los móviles)
A.offBarcode = () => { ui.bc = { code: '', state: '' }; openSheet('barcode'); };
SHEETS.barcode = () => ({
  title: 'Buscar por código de barras',
  body: `<p class="muted">Escribe los números que hay bajo el código de barras del envase.</p>
    <label class="field"><span>Código</span><input id="bc-code" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="8410000000000" value="${esc(ui.bc.code)}" data-in="bcIn"></label>
    ${ui.bc.state === 'loading' ? '<div class="off-state">Buscando…</div>' : ui.bc.state === 'notfound' ? '<div class="off-state">No está en Open Food Facts o no tiene información nutricional.</div>' : ui.bc.state === 'error' ? '<div class="off-state">No se ha podido conectar.</div>' : ''}`,
  foot: `<button class="btn primary block" data-a="bcSearch">Buscar</button>`,
});
IN.bcIn = (el) => { ui.bc.code = el.value.replace(/\D/g, ''); };
A.bcSearch = async () => {
  const code = ui.bc.code;
  if (code.length < 6) { toast('Escribe el código completo'); return; }
  ui.bc.state = 'loading'; render();
  try {
    const data = await getJSON(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=${FIELDS}`);
    const f = data.product ? toFood({ ...data.product, code }) : null;
    if (!f) { ui.bc.state = 'notfound'; render(); return; }
    OFF_CACHE.set(f.id, f);
    ui.sheets.pop();
    A.pickFood({ dataset: { id: f.id } });
  } catch { ui.bc.state = 'error'; render(); }
};

// Al usar un producto de internet se guarda en "Mis alimentos" para tenerlo siempre disponible
export function persistOnline(f) {
  if (!f?.off || S.customFoods.some(x => x.id === f.id)) return;
  S.customFoods.unshift({ ...f });
  save();
}
