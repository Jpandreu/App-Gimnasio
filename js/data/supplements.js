// Suplementos con evidencia para ganar masa muscular.
// ev: A = evidencia fuerte, B = útil en ciertos casos, C = opcional / poca evidencia
// food: alimento de la base de datos que se añade al diario al marcarlo
export const SUPP_LIBRARY = [
  { key: 'creatina', name: 'Creatina monohidrato', dose: 5, unit: 'g', time: 'cualquiera', when: 'daily', ev: 'A',
    why: 'Aumenta la fuerza y la ganancia de masa muscular. Es el suplemento con más evidencia científica.',
    how: '5 g al día, todos los días, también los de descanso. A cualquier hora, con agua, zumo o una comida. No hace falta fase de carga ni hacer descansos.',
    note: 'Las primeras 2-4 semanas es normal subir 1-2 kg por agua dentro del músculo. Busca creatina monohidrato (mejor con sello Creapure); otras formas no son mejores.' },
  { key: 'whey', name: 'Proteína whey', dose: 30, unit: 'g', time: 'post', when: 'daily', ev: 'A', food: 'whey',
    why: 'Forma cómoda de llegar a tu proteína diaria. No es imprescindible si llegas comiendo.',
    how: 'Un cacito (30 g) con leche o agua cuando te falte proteína, por ejemplo después de entrenar o en la merienda.' },
  { key: 'cafeina', name: 'Cafeína', dose: 200, unit: 'mg', time: 'pre', when: 'training', ev: 'A',
    why: 'Mejora el rendimiento y la energía en el entreno.',
    how: '3 mg por kg (unos 200 mg, 2 cafés) 30-60 minutos antes de entrenar. No la tomes en las 8 horas antes de dormir.' },
  { key: 'vitd', name: 'Vitamina D3', dose: 2000, unit: 'UI', time: 'comida', when: 'daily', ev: 'B',
    why: 'Útil si tomas poco el sol, sobre todo en otoño e invierno.',
    how: '1.000-2.000 UI al día con una comida que tenga algo de grasa.' },
  { key: 'omega3', name: 'Omega-3', dose: 1, unit: 'g', time: 'comida', when: 'daily', ev: 'B',
    why: 'Recomendable si comes pescado azul menos de 2 veces por semana.',
    how: '1-2 g de EPA + DHA al día con una comida.' },
  { key: 'caseina', name: 'Caseína', dose: 30, unit: 'g', time: 'noche', when: 'daily', ev: 'B', food: 'caseina',
    why: 'Proteína de digestión lenta. Práctica antes de dormir si te cuesta llegar a la proteína.',
    how: '30-40 g antes de dormir. Un yogur griego o queso fresco batido hacen lo mismo.' },
  { key: 'magnesio', name: 'Magnesio', dose: 300, unit: 'mg', time: 'noche', when: 'daily', ev: 'C',
    why: 'Puede ayudar si comes pocos frutos secos, legumbres y verdura de hoja.',
    how: '200-400 mg por la noche.' },
  { key: 'multi', name: 'Multivitamínico', dose: 1, unit: 'cápsula', time: 'comida', when: 'daily', ev: 'C',
    why: 'Un seguro si tu dieta es poco variada. No sustituye a comer fruta y verdura.',
    how: '1 al día con el desayuno o la comida.' },
];

export const SUPP_BY_KEY = Object.fromEntries(SUPP_LIBRARY.map(s => [s.key, s]));

export const SUPP_TIMES = {
  manana: 'Al despertar', comida: 'Con una comida', pre: 'Antes de entrenar', post: 'Después de entrenar', noche: 'Antes de dormir', cualquiera: 'A cualquier hora',
};

export const EVIDENCE = { A: 'Evidencia fuerte', B: 'Útil en algunos casos', C: 'Opcional' };

export const NOT_WORTH = [
  ['BCAA y aminoácidos', 'Si llegas a tu proteína diaria no aportan nada.'],
  ['Glutamina', 'No mejora la ganancia de músculo en personas sanas.'],
  ['"Potenciadores de testosterona"', 'Tribulus, maca y similares no suben la testosterona de forma útil.'],
  ['Quemagrasas', 'No sirven para ganar masa y muchos llevan estimulantes en exceso.'],
  ['Gainers de marca', 'Suelen ser azúcar caro. Un batido casero con avena y leche hace lo mismo.'],
];
