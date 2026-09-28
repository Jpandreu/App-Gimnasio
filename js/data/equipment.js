// Material y máquinas que puede tener un gimnasio. Los ejercicios declaran qué necesitan (req).
export const EQUIPMENT_GROUPS = [
  { name: 'Pesos libres', items: [
    ['barra', 'Barra olímpica y discos'],
    ['rack', 'Rack o jaula de sentadillas'],
    ['banco', 'Banco plano'],
    ['banco-inc', 'Banco inclinable'],
    ['mancuernas', 'Mancuernas'],
    ['barra-z', 'Barra Z'],
    ['multipower', 'Multipower (máquina Smith)'],
  ] },
  { name: 'Poleas', items: [
    ['polea', 'Poleas / cruce de poleas'],
    ['jalon', 'Máquina de jalón al pecho'],
    ['remo-polea', 'Remo sentado en polea baja'],
  ] },
  { name: 'Máquinas de torso', items: [
    ['press-pecho-maq', 'Press de pecho en máquina'],
    ['pec-deck', 'Contractor de pecho (pec deck)'],
    ['press-hombro-maq', 'Press de hombro en máquina'],
    ['remo-maq', 'Remo en máquina / remo en T'],
    ['scott', 'Banco Scott (predicador)'],
  ] },
  { name: 'Máquinas de pierna', items: [
    ['prensa', 'Prensa de piernas'],
    ['hack', 'Sentadilla hack / péndulo'],
    ['ext-cuad', 'Extensión de cuádriceps'],
    ['curl-fem-tumbado', 'Curl femoral tumbado'],
    ['curl-fem-sentado', 'Curl femoral sentado'],
    ['gemelo-maq', 'Gemelos de pie en máquina'],
    ['gemelo-sentado-maq', 'Gemelos sentado en máquina'],
    ['abductores', 'Máquina de abductores'],
  ] },
  { name: 'Peso corporal y otros', items: [
    ['dominadas', 'Barra de dominadas'],
    ['paralelas', 'Paralelas para fondos'],
    ['asistida', 'Máquina de dominadas y fondos asistidos'],
    ['rueda', 'Rueda abdominal'],
  ] },
];

export const EQUIPMENT = Object.fromEntries(EQUIPMENT_GROUPS.flatMap(g => g.items));
const ALL = Object.keys(EQUIPMENT);

export const GYM_PRESETS = {
  completo: { name: 'Gimnasio completo', desc: 'Pesos libres, poleas y máquinas de todo tipo', equip: ALL },
  basico: { name: 'Gimnasio básico', desc: 'Barra, mancuernas, poleas y las máquinas más comunes',
    equip: ['barra', 'rack', 'banco', 'banco-inc', 'mancuernas', 'barra-z', 'polea', 'jalon', 'remo-polea', 'prensa', 'ext-cuad', 'curl-fem-tumbado', 'dominadas', 'paralelas'] },
  casa: { name: 'En casa', desc: 'Mancuernas, banco y barra de dominadas', equip: ['mancuernas', 'banco', 'banco-inc', 'dominadas'] },
};

// Días de la semana (valores de Date.getDay) en orden lunes-domingo
export const WEEKDAYS = [[1, 'L', 'Lunes'], [2, 'M', 'Martes'], [3, 'X', 'Miércoles'], [4, 'J', 'Jueves'], [5, 'V', 'Viernes'], [6, 'S', 'Sábado'], [0, 'D', 'Domingo']];
export const DEFAULT_WEEKDAYS = { 2: [1, 4], 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 4, 5], 6: [1, 2, 3, 4, 5, 6] };

export const SESSION_TIMES = [45, 60, 75, 90];

export const FOCUS = {
  pecho: { label: 'Pecho', m: ['pecho'] },
  espalda: { label: 'Espalda', m: ['espalda'] },
  hombros: { label: 'Hombros', m: ['hombros'] },
  brazos: { label: 'Brazos', m: ['biceps', 'triceps'] },
  piernas: { label: 'Piernas', m: ['cuadriceps', 'femoral', 'gemelos'] },
  gluteo: { label: 'Glúteo', m: ['gluteo'] },
};
