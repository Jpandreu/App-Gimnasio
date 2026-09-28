// Iconos, gráficos SVG y piezas de interfaz reutilizables.
import { esc, fmtNum, parseDay, MONTHS } from './core.js';

const P = {
  home: '<path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
  dumbbell: '<path d="M3 9v6M6.5 6.5v11M17.5 6.5v11M21 9v6M6.5 12h11"/>',
  bowl: '<path d="M3.5 11h17a8.5 8.5 0 0 1-17 0zM8 7.5c0-1.5 1-2 1-3.5M12 7.5c0-1.5 1-2 1-3.5M16 7.5c0-1.5 1-2 1-3.5"/>',
  chart: '<path d="M4 20V4M4 20h16M8 16l4-5 3 3 5-7"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  left: '<path d="m15 5-7 7 7 7"/>',
  right: '<path d="m9 5 7 7-7 7"/>',
  down: '<path d="m5 9 7 7 7-7"/>',
  up: '<path d="m5 15 7-7 7 7"/>',
  play: '<path d="M7 4.5v15l12-7.5z"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2.5h5"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  drop: '<path d="M12 3.5s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10.5 12 3.5 12 3.5z"/>',
  fire: '<path d="M12 21c-4 0-7-2.7-7-6.6 0-3.4 2.6-5.2 3.6-8.4 1.6 1.2 2.4 2.7 2.4 4.4 1.2-.6 2-2 2-3.4 2.8 2 5 5 5 8.2 0 3.3-2.9 5.8-6 5.8z"/>',
  scale: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8.5 9.5a5 5 0 0 1 7 0L13 12"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 13v4M8.5 20h7M9.5 17h5v3h-5z"/>',
  bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  more: '<circle cx="5.5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18.5" cy="12" r="1.3"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.4"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  swap: '<path d="M7 4 4 7l3 3M4 7h13M17 20l3-3-3-3M20 17H7"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
  grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 16V5M7 9.5l5-5 5 5M5 20h14"/>',
  sparkle: '<path d="M12 3.5 13.8 10.2 20.5 12 13.8 13.8 12 20.5 10.2 13.8 3.5 12 10.2 10.2z"/>',
};

export const icon = (name, cls = '') => `<svg class="i ${name === 'play' ? 'fill ' : ''}${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[name] || ''}</svg>`;

// Anillo de progreso
export function ring(pct, { size = 148, stroke = 12, color = 'var(--accent)', track = 'var(--track)', over = false } = {}) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, pct));
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${track}" stroke-width="${stroke}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${over ? 'var(--warn)' : color}" stroke-width="${stroke}"
      stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}" transform="rotate(-90 ${size / 2} ${size / 2})" class="ring-val"/>
  </svg>`;
}

// Barra de macro
export function macroBar(label, val, target, cls) {
  const pct = target ? Math.min(100, (val / target) * 100) : 0;
  return `<div class="macro ${cls}">
    <div class="macro-top"><span class="macro-l">${label}</span><span class="macro-v"><b>${Math.round(val)}</b> / ${Math.round(target)} g</span></div>
    <div class="bar"><i style="width:${pct}%"></i></div>
  </div>`;
}

// Gráfico de línea con área, rejilla y punto final. pts: [{x: ms, y}]
export function lineChart(pts, { h = 180, unit = '', band = null, dec = 1, color = 'var(--accent)', id = 'lc' } = {}) {
  if (pts.length < 2) return `<div class="chart-empty">Registra al menos dos datos para ver la gráfica.</div>`;
  const W = 340, H = h, L = 38, R = 14, T = 14, B = 26;
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
  let x0 = Math.min(...xs), x1 = Math.max(...xs);
  if (x1 === x0) x1 = x0 + 864e5;
  let y0 = Math.min(...ys), y1 = Math.max(...ys);
  if (band) { y0 = Math.min(y0, band[0]); y1 = Math.max(y1, band[1]); }
  const pad = Math.max((y1 - y0) * 0.15, y1 * 0.01, 0.5);
  y0 -= pad; y1 += pad;
  // ticks "bonitos"
  const span = y1 - y0, rawStep = span / 4, mag = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= rawStep) || rawStep;
  const ticks = [];
  for (let v = Math.ceil(y0 / step) * step; v <= y1 + 1e-9; v += step) ticks.push(v);
  const sx = x => L + ((x - x0) / (x1 - x0)) * (W - L - R);
  const sy = y => T + (1 - (y - y0) / (y1 - y0)) * (H - T - B);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join('');
  const area = `${line}L${sx(pts[pts.length - 1].x).toFixed(1)},${H - B}L${sx(pts[0].x).toFixed(1)},${H - B}Z`;
  const last = pts[pts.length - 1];
  const dFmt = x => { const d = new Date(x); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };
  const xl = [x0, (x0 + x1) / 2, x1];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfica">
    <defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    ${band ? `<rect x="${L}" y="${sy(band[1])}" width="${W - L - R}" height="${Math.max(1, sy(band[0]) - sy(band[1]))}" fill="var(--good)" opacity=".1"/>` : ''}
    ${ticks.map(v => `<line x1="${L}" x2="${W - R}" y1="${sy(v)}" y2="${sy(v)}" stroke="var(--line)" stroke-width="1"/><text x="${L - 6}" y="${sy(v) + 4}" text-anchor="end" class="ct">${fmtNum(v, dec)}</text>`).join('')}
    ${xl.map((x, i) => `<text x="${sx(x)}" y="${H - 6}" text-anchor="${['start', 'middle', 'end'][i]}" class="ct">${dFmt(x)}</text>`).join('')}
    <path d="${area}" fill="url(#${id}g)"/>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${pts.length <= 40 ? pts.map(p => `<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="2.5" fill="var(--surface)" stroke="${color}" stroke-width="1.5"/>`).join('') : ''}
    <circle cx="${sx(last.x)}" cy="${sy(last.y)}" r="5" fill="${color}" stroke="var(--surface)" stroke-width="2"/>
    <text x="${Math.min(sx(last.x), W - R - 2)}" y="${Math.max(12, sy(last.y) - 10)}" text-anchor="end" class="ct ct-strong">${fmtNum(last.y, dec)}${unit}</text>
  </svg>`;
}

// Barras verticales simples. items: [{label, v, hi?}]
export function barChart(items, { h = 140, target = null, color = 'var(--accent)' } = {}) {
  const W = 340, H = h, T = 16, B = 22, L = 6, R = 6;
  const max = Math.max(1, target || 0, ...items.map(i => i.v));
  const bw = (W - L - R) / items.length;
  const sy = v => T + (1 - v / max) * (H - T - B);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfica de barras">
    ${target ? `<line x1="${L}" x2="${W - R}" y1="${sy(target)}" y2="${sy(target)}" stroke="var(--muted)" stroke-dasharray="3 4"/>` : ''}
    ${items.map((it, i) => {
      const x = L + i * bw + bw * 0.18, w = bw * 0.64, y = sy(it.v);
      return `<rect x="${x}" y="${y}" width="${w}" height="${Math.max(0, H - B - y)}" rx="4" fill="${it.v ? color : 'var(--track)'}" opacity="${it.hi ? 1 : 0.55}"/>
      ${it.v ? `<text x="${x + w / 2}" y="${y - 4}" text-anchor="middle" class="ct">${fmtNum(it.v, 0)}</text>` : ''}
      <text x="${x + w / 2}" y="${H - 6}" text-anchor="middle" class="ct">${esc(it.label)}</text>`;
    }).join('')}
  </svg>`;
}

export function sparkline(vals, { w = 96, h = 32, color = 'var(--accent)' } = {}) {
  if (vals.length < 2) return '';
  const mn = Math.min(...vals), mx = Math.max(...vals), sp = mx - mn || 1;
  const pts = vals.map((v, i) => [(i / (vals.length - 1)) * (w - 4) + 2, h - 3 - ((v - mn) / sp) * (h - 6)]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
  const l = pts[pts.length - 1];
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${l[0]}" cy="${l[1]}" r="3" fill="${color}"/></svg>`;
}

// Control segmentado
export const seg = (action, current, opts) => `<div class="seg" role="tablist">${opts.map(([v, l]) =>
  `<button role="tab" aria-selected="${v === current}" class="${v === current ? 'on' : ''}" data-a="${action}" data-v="${v}">${l}</button>`).join('')}</div>`;

export const empty = (ic, title, text, btn = '') => `<div class="empty">${icon(ic)}<h3>${title}</h3><p>${text}</p>${btn}</div>`;

export const dateLabel = k => { const d = parseDay(k); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };
