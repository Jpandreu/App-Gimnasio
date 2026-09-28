// Estilos de rutina: recomendado (frecuencia 2), Push/Pull/Legs y un grupo muscular por día.
import { PROGRAMS } from './plans.js';

export const STYLES = {
  auto: { label: 'Recomendado', desc: 'Cada músculo 2 veces por semana. La opción con más evidencia para ganar masa, sobre todo si llevas menos de 3 años.' },
  ppl: { label: 'Push / Pull / Legs', desc: 'Cada día una zona: empuje (pecho, hombro, tríceps), tirón (espalda, bíceps) y pierna. Con 6 días cada músculo se entrena 2 veces.' },
  split: { label: 'Por grupo muscular', desc: 'Un grupo por día (pecho, espalda, pierna…). Sesiones muy enfocadas. Tú decides cuántos días dedicas a cada zona.' },
};

export const ZONES = {
  pecho: { label: 'Pecho', max: 3 },
  espalda: { label: 'Espalda', max: 3 },
  pierna: { label: 'Pierna', max: 3 },
  hombro: { label: 'Hombro', max: 2 },
  brazos: { label: 'Brazos', max: 2 },
};

// Reparto recomendado según los días por semana (brazos integrados en pecho y espalda)
export function recommendedSplit(days) {
  return {
    2: { pecho: 1, espalda: 1, pierna: 1, hombro: 0, brazos: 0 },
    3: { pecho: 1, espalda: 1, pierna: 1, hombro: 0, brazos: 0 },
    4: { pecho: 1, espalda: 1, pierna: 1, hombro: 1, brazos: 0 },
    5: { pecho: 1, espalda: 1, pierna: 2, hombro: 1, brazos: 0 },
    6: { pecho: 2, espalda: 2, pierna: 2, hombro: 0, brazos: 0 },
  }[Math.min(6, Math.max(2, days))];
}

// Plantillas. [ejercicio, series, repMin, repMax, descanso]
const T = {
  pecho: [
    [['press-banca', 4, 6, 8, 180], ['press-inclinado-manc', 3, 8, 12, 150], ['fondos', 3, 8, 12, 120], ['aperturas-polea', 3, 12, 15, 60]],
    [['press-inclinado-barra', 4, 6, 10, 150], ['press-manc', 3, 8, 12, 150], ['press-maquina', 3, 10, 12, 90], ['pec-deck', 3, 12, 15, 60]],
  ],
  espalda: [
    [['dominadas', 4, 6, 10, 150], ['remo-barra', 4, 6, 8, 150], ['jalon', 3, 8, 12, 120], ['remo-polea', 3, 10, 12, 90]],
    [['jalon-neutro', 4, 8, 12, 120], ['remo-manc', 3, 8, 12, 120], ['remo-t', 3, 8, 12, 120], ['pullover-polea', 3, 12, 15, 60]],
  ],
  pierna: [
    [['sentadilla', 4, 6, 8, 180], ['peso-muerto-rumano', 3, 8, 10, 150], ['prensa', 3, 10, 12, 120], ['curl-femoral-tumbado', 3, 10, 12, 90], ['gemelo-pie', 4, 10, 15, 60], ['crunch-polea', 3, 12, 15, 60]],
    [['hip-thrust', 3, 8, 12, 120], ['bulgara', 3, 8, 12, 120], ['hack', 3, 10, 12, 120], ['ext-cuadriceps', 3, 12, 15, 60], ['curl-femoral-sentado', 3, 10, 15, 60], ['gemelo-sentado', 4, 12, 20, 60]],
  ],
  hombro: [
    [['press-militar', 4, 6, 10, 150], ['press-manc-hombro', 3, 8, 12, 120], ['elev-laterales', 4, 12, 20, 60], ['face-pull', 3, 12, 15, 60], ['pajaros', 3, 12, 20, 60]],
    [['press-arnold', 4, 8, 12, 120], ['press-hombro-maq', 3, 10, 12, 90], ['elev-laterales-polea', 4, 12, 15, 60], ['pajaros', 3, 12, 20, 60], ['face-pull', 3, 12, 15, 60]],
  ],
  brazos: [
    [['curl-barra', 4, 8, 12, 90], ['press-cerrado', 4, 6, 10, 120], ['curl-inclinado', 3, 10, 15, 60], ['ext-cabeza-polea', 3, 10, 15, 60], ['curl-martillo', 3, 10, 12, 60], ['ext-polea', 3, 12, 15, 60]],
    [['curl-predicador', 4, 8, 12, 90], ['press-frances', 4, 8, 12, 90], ['curl-polea', 3, 12, 15, 60], ['ext-triceps-manc', 3, 10, 15, 60], ['curl-martillo', 3, 10, 12, 60], ['curl-muneca', 2, 12, 20, 45]],
  ],
};

const PIERNA_UNICA = [['sentadilla', 4, 6, 8, 180], ['peso-muerto-rumano', 3, 8, 10, 150], ['prensa', 3, 10, 12, 120], ['ext-cuadriceps', 3, 12, 15, 60], ['curl-femoral-tumbado', 3, 10, 12, 90], ['hip-thrust', 3, 8, 12, 120], ['gemelo-pie', 3, 10, 15, 60]];

// Complementos cuando una zona no tiene día propio (se reparten por variante A/B)
const EXTRA = {
  triceps: [[['press-frances', 3, 8, 12, 90], ['ext-polea', 3, 10, 15, 60]], [['ext-cabeza-polea', 3, 10, 15, 60], ['press-cerrado', 3, 8, 10, 90]]],
  biceps: [[['curl-barra', 3, 8, 12, 90], ['curl-martillo', 3, 10, 12, 60]], [['curl-inclinado', 3, 10, 15, 60], ['curl-polea', 3, 12, 15, 60]]],
  hombroEmpuje: [[['press-militar', 3, 6, 10, 150], ['elev-laterales', 3, 12, 20, 60]], [['press-manc-hombro', 3, 8, 12, 120], ['elev-laterales-polea', 3, 12, 15, 60]]],
  hombroPost: [[['face-pull', 3, 12, 15, 60]], [['pajaros', 3, 12, 20, 60]]],
  brazosEnHombro: [[['curl-manc', 3, 10, 12, 60], ['ext-polea', 3, 10, 15, 60]], [['curl-martillo', 3, 10, 12, 60], ['ext-cabeza-polea', 3, 10, 15, 60]]],
};

// Ciclo intercalado: primero una vuelta con todas las zonas, después las repetidas
function cycleOrder(split) {
  const order = ['pecho', 'espalda', 'pierna', 'hombro', 'brazos'];
  const out = [];
  for (let round = 0; round < 3; round++) for (const z of order) if ((split[z] || 0) > round) out.push([z, round]);
  return out;
}

function splitProgram(split) {
  const hasHombro = split.hombro > 0, hasBrazos = split.brazos > 0;
  const days = cycleOrder(split);
  const routines = days.map(([z, v]) => {
    const vi = v % 2;
    // Con un solo día de pierna a la semana se usa una sesión completa (cuádriceps, femoral y glúteo)
    const items = z === 'pierna' && split.pierna === 1 ? [...PIERNA_UNICA] : [...T[z][vi]];
    const parts = [ZONES[z].label];
    if (z === 'pecho') {
      if (!hasHombro) { items.push(...EXTRA.hombroEmpuje[vi]); parts.push('hombro'); }
      if (!hasBrazos) { items.push(...EXTRA.triceps[vi]); parts.push('tríceps'); }
    }
    if (z === 'espalda') {
      if (!hasHombro) items.push(...EXTRA.hombroPost[vi]);
      if (!hasBrazos) { items.push(...EXTRA.biceps[vi]); parts.push('bíceps'); }
    }
    if (z === 'hombro' && !hasBrazos) { items.push(...EXTRA.brazosEnHombro[vi]); parts.push('brazos'); }
    let name = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}` : parts[0];
    if ((split[z] || 0) > 1) name += ` ${'ABC'[v]}`;
    return { name, items };
  });
  const n = days.length;
  return {
    name: `Por grupo muscular · ciclo de ${n} ${n === 1 ? 'día' : 'días'}`,
    why: hasBrazos ? 'Un grupo por día con día propio de brazos.' : 'Un grupo por día. Los brazos se trabajan junto a pecho (tríceps) y espalda (bíceps), donde ya participan.',
    routines,
  };
}

// Plantilla base según el estilo elegido
export function baseProgram(opts) {
  const days = Math.min(6, Math.max(2, opts.weekdays.length));
  if (opts.style === 'split') return splitProgram(opts.split || recommendedSplit(days));
  if (opts.style === 'ppl') return { ...PROGRAMS[6], name: 'Push / Pull / Legs', why: STYLES.ppl.desc };
  return PROGRAMS[days];
}

export const cycleLength = opts => opts.style === 'split'
  ? Object.values(opts.split || recommendedSplit(opts.weekdays.length)).reduce((a, b) => a + b, 0)
  : opts.style === 'ppl' ? 3 : Math.min(6, Math.max(2, opts.weekdays.length));
