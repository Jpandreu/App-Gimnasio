// Días tipo de comidas para volumen. Las cantidades se escalan al objetivo calórico del usuario.
// Cada item: [foodId, gramos]
export const MEAL_PLANS = [
  {
    id: 'clasico',
    name: 'Día clásico',
    desc: 'Comida tradicional con arroz, carne y pescado. Fácil de preparar en táper.',
    meals: [
      { meal: 'desayuno', name: 'Avena con leche y plátano', items: [['avena', 80], ['leche-entera', 300], ['platano', 120], ['crema-cacahuete', 16]] },
      { meal: 'almuerzo', name: 'Tostadas de jamón y aceite', items: [['pan-integral', 90], ['jamon-serrano', 40], ['tomate', 60], ['aceite-oliva', 8]] },
      { meal: 'comida', name: 'Arroz con pollo y verdura', items: [['arroz-crudo', 100], ['pollo-plancha', 170], ['brocoli', 150], ['aceite-oliva', 13], ['manzana', 180]] },
      { meal: 'merienda', name: 'Batido ganador casero', items: [['leche-entera', 350], ['avena', 50], ['platano', 120], ['whey', 30], ['crema-cacahuete', 16]] },
      { meal: 'cena', name: 'Salmón con patata', items: [['salmon', 160], ['patata-cocida', 300], ['lechuga', 100], ['aceite-oliva', 10], ['yogur-griego', 125]] },
    ],
  },
  {
    id: 'pasta',
    name: 'Día de pasta y huevos',
    desc: 'Más hidratos alrededor del entreno. Buena opción para días de pierna.',
    meals: [
      { meal: 'desayuno', name: 'Huevos, pan y fruta', items: [['huevo', 165], ['pan-blanco', 100], ['aceite-oliva', 8], ['zumo-naranja', 250]] },
      { meal: 'almuerzo', name: 'Yogur con granola', items: [['yogur-griego', 125], ['granola', 50], ['arandanos', 60]] },
      { meal: 'comida', name: 'Pasta boloñesa', items: [['pasta-cruda', 120], ['picada-5', 150], ['tomate-frito', 90], ['queso-curado', 15], ['aceite-oliva', 8]] },
      { meal: 'merienda', name: 'Bocadillo de atún', items: [['pan-blanco', 110], ['atun-aceite', 56], ['tomate', 60], ['platano', 120]] },
      { meal: 'cena', name: 'Tortilla y ensalada', items: [['huevo', 110], ['patata-cocida', 250], ['aceite-oliva', 10], ['lechuga', 100], ['queso-batido', 250], ['nueces', 20]] },
    ],
  },
  {
    id: 'legumbre',
    name: 'Día de legumbre',
    desc: 'Fibra y hierro de las legumbres. Cena ligera de digerir.',
    meals: [
      { meal: 'desayuno', name: 'Tostadas con aguacate y huevo', items: [['pan-integral', 90], ['aguacate', 75], ['huevo', 110], ['leche-entera', 250]] },
      { meal: 'almuerzo', name: 'Frutos secos y fruta', items: [['almendras', 30], ['platano', 120], ['skyr', 150]] },
      { meal: 'comida', name: 'Lentejas con arroz y ternera', items: [['lentejas', 300], ['arroz-cocido', 150], ['ternera-plancha', 130], ['aceite-oliva', 10], ['naranja', 180]] },
      { meal: 'merienda', name: 'Batido de avena y cacao', items: [['leche-entera', 350], ['avena', 50], ['whey', 30], ['cacao-soluble', 18], ['datiles', 24]] },
      { meal: 'cena', name: 'Merluza con boniato', items: [['merluza', 200], ['boniato', 250], ['judias-verdes', 150], ['aceite-oliva', 13], ['yogur-griego', 125]] },
    ],
  },
];

export const MEAL_LABELS = {
  desayuno: 'Desayuno', almuerzo: 'Media mañana', comida: 'Comida', merienda: 'Merienda', cena: 'Cena', extra: 'Extra',
};
export const MEAL_ORDER = ['desayuno', 'almuerzo', 'comida', 'merienda', 'cena', 'extra'];

// Plantillas de programa. Cada ejercicio: [id, series, repMin, repMax, descanso(s)]
export const PROGRAMS = {
  3: {
    name: 'Full body 3 días',
    why: 'Cada músculo se entrena 3 veces por semana. Ideal si empiezas o tienes poco tiempo.',
    routines: [
      { name: 'Full body A', items: [['sentadilla', 3, 6, 8, 180], ['press-banca', 3, 6, 8, 180], ['remo-barra', 3, 8, 10, 150], ['press-manc-hombro', 2, 8, 12, 120], ['curl-femoral-tumbado', 2, 10, 12, 90], ['curl-barra', 2, 10, 12, 90]] },
      { name: 'Full body B', items: [['peso-muerto-rumano', 3, 8, 10, 150], ['press-inclinado-manc', 3, 8, 12, 150], ['jalon', 3, 8, 12, 120], ['prensa', 2, 10, 15, 120], ['elev-laterales', 3, 12, 20, 60], ['ext-polea', 2, 10, 15, 90]] },
      { name: 'Full body C', items: [['hack', 3, 8, 10, 150], ['press-manc', 3, 8, 10, 150], ['dominadas', 3, 6, 10, 150], ['hip-thrust', 2, 8, 12, 120], ['face-pull', 2, 12, 15, 60], ['curl-martillo', 2, 10, 12, 60], ['gemelo-pie', 3, 10, 15, 60]] },
    ],
  },
  4: {
    name: 'Torso / Pierna 4 días',
    why: 'Frecuencia 2 por músculo y buen volumen. La opción más equilibrada para ganar masa.',
    routines: [
      { name: 'Torso A · Fuerza', items: [['press-banca', 4, 6, 8, 180], ['remo-barra', 4, 6, 8, 150], ['press-militar', 3, 6, 10, 150], ['jalon', 3, 8, 12, 120], ['curl-barra', 3, 8, 12, 90], ['press-frances', 3, 8, 12, 90]] },
      { name: 'Pierna A · Fuerza', items: [['sentadilla', 4, 6, 8, 180], ['peso-muerto-rumano', 3, 8, 10, 150], ['prensa', 3, 10, 12, 120], ['curl-femoral-tumbado', 3, 10, 12, 90], ['gemelo-pie', 4, 10, 15, 60], ['crunch-polea', 3, 12, 15, 60]] },
      { name: 'Torso B · Hipertrofia', items: [['press-inclinado-manc', 4, 8, 12, 150], ['remo-polea', 4, 10, 12, 120], ['dominadas', 3, 6, 10, 150], ['aperturas-polea', 3, 12, 15, 60], ['elev-laterales', 4, 12, 20, 60], ['curl-inclinado', 3, 10, 15, 60], ['ext-cabeza-polea', 3, 10, 15, 60]] },
      { name: 'Pierna B · Hipertrofia', items: [['hip-thrust', 3, 8, 12, 120], ['bulgara', 3, 8, 12, 120], ['ext-cuadriceps', 3, 12, 15, 90], ['curl-femoral-sentado', 3, 10, 15, 90], ['gemelo-sentado', 4, 12, 20, 60], ['elev-piernas', 3, 10, 15, 60]] },
    ],
  },
  5: {
    name: 'Torso / Pierna + PPL 5 días',
    why: 'Combina fuerza en torso-pierna con volumen extra de empuje y tirón.',
    routines: [
      { name: 'Torso · Fuerza', items: [['press-banca', 4, 5, 8, 180], ['remo-barra', 4, 6, 8, 150], ['press-militar', 3, 6, 10, 150], ['dominadas', 3, 6, 10, 150], ['curl-barra', 2, 8, 12, 90], ['press-cerrado', 2, 8, 12, 90]] },
      { name: 'Pierna · Fuerza', items: [['sentadilla', 4, 5, 8, 180], ['peso-muerto-rumano', 3, 6, 10, 150], ['prensa', 3, 10, 12, 120], ['curl-femoral-tumbado', 3, 10, 12, 90], ['gemelo-pie', 4, 10, 15, 60]] },
      { name: 'Empuje', items: [['press-inclinado-manc', 4, 8, 12, 150], ['press-maquina', 3, 10, 12, 120], ['press-manc-hombro', 3, 8, 12, 120], ['elev-laterales', 4, 12, 20, 60], ['aperturas-polea', 3, 12, 15, 60], ['ext-cabeza-polea', 3, 10, 15, 60]] },
      { name: 'Tirón', items: [['jalon', 4, 8, 12, 120], ['remo-manc', 3, 8, 12, 120], ['remo-polea', 3, 10, 12, 90], ['face-pull', 3, 12, 15, 60], ['curl-inclinado', 3, 10, 15, 60], ['curl-martillo', 3, 10, 12, 60]] },
      { name: 'Pierna · Hipertrofia', items: [['hack', 3, 8, 12, 150], ['hip-thrust', 3, 8, 12, 120], ['bulgara', 3, 10, 12, 90], ['ext-cuadriceps', 3, 12, 15, 60], ['curl-femoral-sentado', 3, 10, 15, 60], ['gemelo-sentado', 4, 12, 20, 60]] },
    ],
  },
  6: {
    name: 'Push / Pull / Legs 6 días',
    why: 'Máximo volumen, cada rutina se repite dos veces por semana. Para quien ya tiene experiencia y recupera bien.',
    routines: [
      { name: 'Empuje', items: [['press-banca', 4, 6, 10, 180], ['press-inclinado-manc', 3, 8, 12, 150], ['press-militar', 3, 8, 10, 150], ['elev-laterales', 4, 12, 20, 60], ['aperturas-polea', 3, 12, 15, 60], ['ext-polea', 3, 10, 15, 60], ['ext-cabeza-polea', 2, 10, 15, 60]] },
      { name: 'Tirón', items: [['dominadas', 4, 6, 10, 150], ['remo-barra', 3, 6, 10, 150], ['jalon-neutro', 3, 10, 12, 90], ['remo-polea', 3, 10, 12, 90], ['face-pull', 3, 12, 15, 60], ['curl-barra', 3, 8, 12, 90], ['curl-martillo', 2, 10, 12, 60]] },
      { name: 'Pierna', items: [['sentadilla', 4, 6, 10, 180], ['peso-muerto-rumano', 3, 8, 10, 150], ['prensa', 3, 10, 15, 120], ['curl-femoral-tumbado', 3, 10, 12, 90], ['ext-cuadriceps', 2, 12, 15, 60], ['gemelo-pie', 4, 10, 15, 60], ['crunch-polea', 3, 12, 15, 60]] },
    ],
  },
};
