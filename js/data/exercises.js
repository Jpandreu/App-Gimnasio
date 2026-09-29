// Biblioteca de ejercicios.
// m: músculo principal · sec: secundarios · eq: material · inc: incremento de carga recomendado (kg)
export const MUSCLES = {
  pecho: 'Pecho', espalda: 'Espalda', hombros: 'Hombros', biceps: 'Bíceps', triceps: 'Tríceps',
  cuadriceps: 'Cuádriceps', femoral: 'Femoral', gluteo: 'Glúteo', gemelos: 'Gemelos',
  abdomen: 'Abdomen', antebrazo: 'Antebrazo',
};

// Series semanales efectivas recomendadas por grupo muscular para hipertrofia
export const WEEKLY_SETS = { min: 10, max: 20 };

export const EQUIP = {
  barra: 'Barra', mancuernas: 'Mancuernas', maquina: 'Máquina', polea: 'Polea', corporal: 'Peso corporal',
};

const E = (id, name, m, eq, inc, tip, sec = []) => ({ id, name, m, eq, inc, tip, sec });

export const EXERCISES = [
  // Pecho
  E('press-banca', 'Press de banca', 'pecho', 'barra', 2.5, 'Escápulas juntas y abajo, pies firmes. Baja la barra a la parte baja del pecho y empuja en ligera diagonal.', ['triceps', 'hombros']),
  E('press-inclinado-barra', 'Press inclinado con barra', 'pecho', 'barra', 2.5, 'Banco a 30°. Codos a unos 60° del torso, toca la parte alta del pecho.', ['hombros', 'triceps']),
  E('press-inclinado-manc', 'Press inclinado con mancuernas', 'pecho', 'mancuernas', 2, 'Banco a 30°. Baja hasta notar estiramiento en el pecho y junta sin chocar arriba.', ['hombros', 'triceps']),
  E('press-manc', 'Press plano con mancuernas', 'pecho', 'mancuernas', 2, 'Mayor recorrido que con barra. Controla la bajada en 2-3 segundos.', ['triceps', 'hombros']),
  E('press-maquina', 'Press de pecho en máquina', 'pecho', 'maquina', 5, 'Ajusta el asiento para que los agarres queden a la altura del pecho medio.', ['triceps']),
  E('aperturas-polea', 'Cruces en polea', 'pecho', 'polea', 2.5, 'Codos ligeramente flexionados y fijos. Aprieta el pecho al cerrar.'),
  E('aperturas-manc', 'Aperturas con mancuernas', 'pecho', 'mancuernas', 2, 'Baja en arco hasta estirar el pecho, sin bloquear los codos.'),
  E('pec-deck', 'Contractor de pecho (pec deck)', 'pecho', 'maquina', 5, 'Pecho alto y hombros atrás. Pausa de 1 segundo con el pecho contraído.'),
  E('fondos', 'Fondos en paralelas', 'pecho', 'corporal', 2.5, 'Inclina el torso adelante para cargar el pecho. Baja hasta hombros a la altura de los codos.', ['triceps', 'hombros']),
  E('flexiones', 'Flexiones', 'pecho', 'corporal', 0, 'Cuerpo en bloque, glúteo apretado. Pecho casi al suelo en cada repetición.', ['triceps', 'hombros']),

  // Espalda
  E('dominadas', 'Dominadas', 'espalda', 'corporal', 2.5, 'Empieza colgado con brazos estirados. Lleva el pecho a la barra tirando con los codos.', ['biceps']),
  E('jalon', 'Jalón al pecho', 'espalda', 'polea', 5, 'Saca pecho e inclínate un poco atrás. Baja la barra a la clavícula llevando codos al costado.', ['biceps']),
  E('jalon-neutro', 'Jalón con agarre neutro', 'espalda', 'polea', 5, 'Agarre estrecho paralelo. Estira completo arriba para trabajar el dorsal en elongación.', ['biceps']),
  E('remo-barra', 'Remo con barra', 'espalda', 'barra', 2.5, 'Torso a unos 45°, espalda neutra. Lleva la barra al ombligo.', ['biceps', 'femoral']),
  E('remo-manc', 'Remo con mancuerna a una mano', 'espalda', 'mancuernas', 2, 'Apoya rodilla y mano en el banco. Tira hacia la cadera, no hacia el hombro.', ['biceps']),
  E('remo-polea', 'Remo sentado en polea', 'espalda', 'polea', 5, 'Pecho alto. Estira adelante sin redondear y tira juntando escápulas.', ['biceps']),
  E('remo-t', 'Remo en T / máquina', 'espalda', 'maquina', 5, 'Apoya el pecho si la máquina lo permite, así eliminas el impulso.', ['biceps']),
  E('pullover-polea', 'Pullover en polea alta', 'espalda', 'polea', 2.5, 'Brazos casi rectos. Baja la cuerda hasta los muslos contrayendo el dorsal.'),
  E('peso-muerto', 'Peso muerto', 'espalda', 'barra', 5, 'Barra pegada a las piernas, espalda neutra. Empuja el suelo con los pies y bloquea con glúteo.', ['femoral', 'gluteo', 'antebrazo']),

  // Hombros
  E('press-militar', 'Press militar con barra', 'hombros', 'barra', 2.5, 'De pie, glúteo y abdomen apretados. Mete la cabeza por delante al pasar la barra.', ['triceps']),
  E('press-manc-hombro', 'Press de hombro con mancuernas', 'hombros', 'mancuernas', 2, 'Sentado con respaldo casi vertical. Baja hasta que las mancuernas rocen los hombros.', ['triceps']),
  E('press-arnold', 'Press Arnold', 'hombros', 'mancuernas', 2, 'Rota las palmas mientras subes. Movimiento controlado, sin rebotes.', ['triceps']),
  E('elev-laterales', 'Elevaciones laterales', 'hombros', 'mancuernas', 1, 'Sube hasta la altura del hombro guiando con el codo. Peso ligero y sin balanceo.'),
  E('elev-laterales-polea', 'Elevaciones laterales en polea', 'hombros', 'polea', 1.25, 'La polea mantiene tensión abajo. Cruza el cable por delante del cuerpo.'),
  E('pajaros', 'Pájaros (deltoide posterior)', 'hombros', 'mancuernas', 1, 'Torso inclinado y brazos abiertos en cruz. Piensa en llevar las manos lejos.'),
  E('face-pull', 'Face pull', 'hombros', 'polea', 2.5, 'Cuerda a la altura de la cara. Tira separando las manos y rota hacia fuera.', ['espalda']),

  // Bíceps
  E('curl-barra', 'Curl con barra', 'biceps', 'barra', 2.5, 'Codos pegados al cuerpo. Sin balanceo del tronco.', ['antebrazo']),
  E('curl-manc', 'Curl con mancuernas', 'biceps', 'mancuernas', 1, 'Gira la palma hacia arriba mientras subes (supinación).'),
  E('curl-martillo', 'Curl martillo', 'biceps', 'mancuernas', 1, 'Agarre neutro. Trabaja braquial y antebrazo, que dan grosor al brazo.', ['antebrazo']),
  E('curl-inclinado', 'Curl inclinado con mancuernas', 'biceps', 'mancuernas', 1, 'Banco a 45-60°. Brazos colgando por detrás del cuerpo para estirar el bíceps.'),
  E('curl-predicador', 'Curl predicador (Scott)', 'biceps', 'maquina', 2.5, 'Axila apoyada en el borde. Baja hasta casi estirar el codo.'),
  E('curl-polea', 'Curl en polea', 'biceps', 'polea', 2.5, 'Tensión constante. Aprieta arriba 1 segundo.'),

  // Tríceps
  E('press-frances', 'Press francés', 'triceps', 'barra', 2.5, 'Barra Z a la frente o detrás de la cabeza. Codos apuntando al techo.'),
  E('ext-polea', 'Extensión de tríceps en polea', 'triceps', 'polea', 2.5, 'Codos fijos al costado. Estira del todo abajo.'),
  E('ext-cabeza-polea', 'Extensión sobre la cabeza en polea', 'triceps', 'polea', 2.5, 'De espaldas a la polea. Trabaja la cabeza larga en estiramiento, la más grande del tríceps.'),
  E('press-cerrado', 'Press de banca agarre cerrado', 'triceps', 'barra', 2.5, 'Manos a la anchura de hombros. Codos pegados al bajar.', ['pecho']),
  E('fondos-banco', 'Fondos entre bancos', 'triceps', 'corporal', 0, 'Espalda pegada al banco. Baja hasta 90° de codo.'),

  // Cuádriceps
  E('sentadilla', 'Sentadilla con barra', 'cuadriceps', 'barra', 2.5, 'Pies a la anchura de hombros. Rodillas en la línea de los pies, baja al menos a paralelo.', ['gluteo', 'femoral']),
  E('sentadilla-frontal', 'Sentadilla frontal', 'cuadriceps', 'barra', 2.5, 'Codos altos y torso vertical. Carga más el cuádriceps.', ['gluteo']),
  E('goblet', 'Sentadilla goblet', 'cuadriceps', 'mancuernas', 2, 'Mancuerna pegada al pecho. Ideal para aprender el patrón.', ['gluteo']),
  E('prensa', 'Prensa de piernas', 'cuadriceps', 'maquina', 10, 'Espalda baja pegada al respaldo. Baja hasta 90° o más sin despegar la cadera.', ['gluteo']),
  E('hack', 'Sentadilla hack', 'cuadriceps', 'maquina', 5, 'Pies algo adelantados. Recorrido completo y controlado.', ['gluteo']),
  E('zancadas', 'Zancadas', 'cuadriceps', 'mancuernas', 2, 'Paso largo y torso erguido. La rodilla trasera casi toca el suelo.', ['gluteo']),
  E('bulgara', 'Sentadilla búlgara', 'cuadriceps', 'mancuernas', 2, 'Pie trasero en el banco. Inclina el torso adelante si quieres más glúteo.', ['gluteo']),
  E('ext-cuadriceps', 'Extensión de cuádriceps', 'cuadriceps', 'maquina', 5, 'Aprieta arriba 1 segundo. Baja controlado.'),

  // Femoral
  E('peso-muerto-rumano', 'Peso muerto rumano', 'femoral', 'barra', 2.5, 'Rodillas algo flexionadas y fijas. Lleva la cadera atrás hasta notar el estiramiento.', ['gluteo', 'espalda']),
  E('curl-femoral-tumbado', 'Curl femoral tumbado', 'femoral', 'maquina', 2.5, 'Cadera pegada al banco. Sube hasta el glúteo y baja lento.'),
  E('curl-femoral-sentado', 'Curl femoral sentado', 'femoral', 'maquina', 2.5, 'Mayor estiramiento que tumbado. Inclina el torso adelante.'),
  E('buenos-dias', 'Buenos días', 'femoral', 'barra', 2.5, 'Barra en la espalda. Bisagra de cadera con espalda neutra y poco peso.', ['gluteo', 'espalda']),

  // Glúteo
  E('hip-thrust', 'Hip thrust', 'gluteo', 'barra', 5, 'Escápulas en el banco y barbilla recogida. Bloquea arriba apretando el glúteo.', ['femoral']),
  E('patada-gluteo', 'Patada de glúteo en polea', 'gluteo', 'polea', 2.5, 'Extiende la cadera sin arquear la zona lumbar.'),
  E('abductores', 'Máquina de abductores', 'gluteo', 'maquina', 5, 'Inclina el torso adelante para trabajar el glúteo medio.'),

  // Gemelos
  E('gemelo-pie', 'Elevación de gemelos de pie', 'gemelos', 'maquina', 5, 'Estira abajo con pausa de 2 segundos. Sube hasta la punta.'),
  E('gemelo-sentado', 'Elevación de gemelos sentado', 'gemelos', 'maquina', 5, 'Rodilla flexionada: trabaja el sóleo. Recorrido completo.'),

  // Abdomen
  E('crunch-polea', 'Crunch en polea', 'abdomen', 'polea', 2.5, 'De rodillas. Enrolla la columna llevando los codos a los muslos.'),
  E('elev-piernas', 'Elevación de piernas colgado', 'abdomen', 'corporal', 0, 'Sube las piernas enrollando la pelvis, sin balanceo.'),
  E('rueda', 'Rueda abdominal', 'abdomen', 'corporal', 0, 'Glúteo apretado y espalda sin hundirse. Llega hasta donde controles.'),
  E('plancha', 'Plancha (segundos)', 'abdomen', 'corporal', 0, 'Anota los segundos en repeticiones. Cuerpo recto y abdomen activo.'),

  // Antebrazo
  E('curl-muneca', 'Curl de muñeca', 'antebrazo', 'barra', 1, 'Antebrazos apoyados. Recorrido completo de la muñeca.'),
  E('paseo-granjero', 'Paseo del granjero (segundos)', 'antebrazo', 'mancuernas', 2, 'Camina erguido con peso pesado. Anota los segundos.', ['abdomen']),

  // Alternativas para adaptar rutinas al material disponible
  E('press-multipower', 'Press de banca en multipower', 'pecho', 'maquina', 2.5, 'Barra guiada: coloca el banco para que baje a la parte baja del pecho.', ['triceps', 'hombros']),
  E('press-inclinado-multipower', 'Press inclinado en multipower', 'pecho', 'maquina', 2.5, 'Banco a 30°. La barra debe tocar la parte alta del pecho.', ['hombros', 'triceps']),
  E('fondos-asistidos', 'Fondos asistidos', 'pecho', 'maquina', 5, 'Más contrapeso = más ayuda. Reduce la ayuda a medida que ganes fuerza.', ['triceps', 'hombros']),
  E('dominadas-asistidas', 'Dominadas asistidas', 'espalda', 'maquina', 5, 'Tira con los codos hacia las costillas. Baja la ayuda poco a poco.', ['biceps']),
  E('pullover-manc', 'Pullover con mancuerna', 'espalda', 'mancuernas', 2, 'Tumbado en el banco, baja la mancuerna por detrás de la cabeza con brazos casi rectos.'),
  E('press-hombro-maq', 'Press de hombro en máquina', 'hombros', 'maquina', 5, 'Agarres a la altura de los hombros al empezar. Sin arquear la zona lumbar.', ['triceps']),
  E('press-militar-multipower', 'Press militar en multipower', 'hombros', 'maquina', 2.5, 'Sentado con respaldo vertical. Baja la barra a la barbilla.', ['triceps']),
  E('ext-triceps-manc', 'Extensión de tríceps con mancuerna', 'triceps', 'mancuernas', 1, 'Sobre la cabeza con las dos manos. Codos apuntando al techo.'),
  E('sentadilla-multipower', 'Sentadilla en multipower', 'cuadriceps', 'maquina', 2.5, 'Pies algo adelantados respecto a la barra. Baja a paralelo con la espalda recta.', ['gluteo']),
  E('rumano-manc', 'Peso muerto rumano con mancuernas', 'femoral', 'mancuernas', 2, 'Mancuernas pegadas a las piernas. Cadera atrás hasta notar el estiramiento.', ['gluteo', 'espalda']),
  E('curl-fem-manc', 'Curl femoral con mancuerna', 'femoral', 'mancuernas', 1, 'Tumbado boca abajo con la mancuerna entre los pies. Movimiento lento.'),
  E('hip-thrust-multipower', 'Hip thrust en multipower', 'gluteo', 'maquina', 5, 'Escápulas en el banco y barra guiada sobre la cadera. Aprieta arriba.', ['femoral']),
  E('puente-gluteo', 'Puente de glúteo', 'gluteo', 'corporal', 2, 'Tumbado en el suelo. Añade una mancuerna sobre la cadera cuando sea fácil.', ['femoral']),
  E('gemelo-prensa', 'Gemelos en prensa', 'gemelos', 'maquina', 5, 'Puntas en el borde de la plataforma. Estira abajo y sube hasta la punta.'),
  E('gemelo-manc', 'Gemelos con mancuerna a una pierna', 'gemelos', 'mancuernas', 2, 'Sobre un escalón, apóyate con la mano libre. Recorrido completo.'),
  E('crunch', 'Crunch abdominal', 'abdomen', 'corporal', 0, 'Enrolla la columna despegando los hombros del suelo. Sin tirar del cuello.'),
  E('plancha-lateral', 'Plancha lateral (segundos)', 'abdomen', 'corporal', 0, 'Codo bajo el hombro y cadera alta. Anota los segundos por lado.'),
  E('dead-bug', 'Dead bug', 'abdomen', 'corporal', 0, 'Zona lumbar pegada al suelo. Estira brazo y pierna contrarios despacio.'),
  E('pallof', 'Press Pallof en polea', 'abdomen', 'polea', 2.5, 'De lado a la polea, empuja al frente y aguanta sin dejar que te gire.'),
  E('crunch-bicicleta', 'Crunch bicicleta', 'abdomen', 'corporal', 0, 'Lleva el codo hacia la rodilla contraria girando el tronco, sin tirar del cuello.'),
  E('hollow', 'Hollow hold (segundos)', 'abdomen', 'corporal', 0, 'Lumbar pegada al suelo, piernas y hombros elevados. Anota los segundos.'),
  E('crunch-inverso', 'Crunch inverso', 'abdomen', 'corporal', 0, 'Tumbado, lleva las rodillas al pecho despegando la pelvis del suelo.'),
  E('elev-piernas-suelo', 'Elevación de piernas tumbado', 'abdomen', 'corporal', 0, 'Piernas casi rectas y lumbar pegada al suelo. Baja lento sin tocar.'),
];

// Patrón de movimiento (pat) y material necesario (req). Un elemento de req que es una lista
// significa "cualquiera de estos". Se usan para sustituir ejercicios según el gimnasio.
const META = {
  'press-banca': ['press-h', ['barra', 'banco']],
  'press-inclinado-barra': ['press-inc', ['barra', 'banco-inc']],
  'press-inclinado-manc': ['press-inc', ['mancuernas', 'banco-inc']],
  'press-manc': ['press-h', ['mancuernas', 'banco']],
  'press-maquina': ['press-h', ['press-pecho-maq']],
  'aperturas-polea': ['aperturas', ['polea']],
  'aperturas-manc': ['aperturas', ['mancuernas', 'banco']],
  'pec-deck': ['aperturas', ['pec-deck']],
  'fondos': ['fondos', ['paralelas']],
  'flexiones': ['press-h', []],
  'dominadas': ['tiron-v', ['dominadas']],
  'jalon': ['tiron-v', ['jalon']],
  'jalon-neutro': ['tiron-v', ['jalon']],
  'remo-barra': ['tiron-h', ['barra']],
  'remo-manc': ['tiron-h', ['mancuernas', 'banco']],
  'remo-polea': ['tiron-h', ['remo-polea']],
  'remo-t': ['tiron-h', ['remo-maq']],
  'pullover-polea': ['pullover', ['polea']],
  'peso-muerto': ['peso-muerto', ['barra']],
  'press-militar': ['press-v', ['barra']],
  'press-manc-hombro': ['press-v', ['mancuernas']],
  'press-arnold': ['press-v', ['mancuernas']],
  'elev-laterales': ['lateral', ['mancuernas']],
  'elev-laterales-polea': ['lateral', ['polea']],
  'pajaros': ['posterior', ['mancuernas']],
  'face-pull': ['posterior', ['polea']],
  'curl-barra': ['curl', [['barra', 'barra-z']]],
  'curl-manc': ['curl', ['mancuernas']],
  'curl-martillo': ['curl', ['mancuernas']],
  'curl-inclinado': ['curl', ['mancuernas', 'banco-inc']],
  'curl-predicador': ['curl', ['scott']],
  'curl-polea': ['curl', ['polea']],
  'press-frances': ['ext-tri', [['barra', 'barra-z'], 'banco']],
  'ext-polea': ['ext-tri', ['polea']],
  'ext-cabeza-polea': ['ext-tri', ['polea']],
  'press-cerrado': ['ext-tri', ['barra', 'banco']],
  'fondos-banco': ['ext-tri', ['banco']],
  'sentadilla': ['sentadilla', ['barra', 'rack']],
  'sentadilla-frontal': ['sentadilla', ['barra', 'rack']],
  'goblet': ['sentadilla', ['mancuernas']],
  'prensa': ['sentadilla', ['prensa']],
  'hack': ['sentadilla', ['hack']],
  'zancadas': ['zancada', ['mancuernas']],
  'bulgara': ['zancada', ['mancuernas', 'banco']],
  'ext-cuadriceps': ['ext-rodilla', ['ext-cuad']],
  'peso-muerto-rumano': ['bisagra', ['barra']],
  'curl-femoral-tumbado': ['flex-rodilla', ['curl-fem-tumbado']],
  'curl-femoral-sentado': ['flex-rodilla', ['curl-fem-sentado']],
  'buenos-dias': ['bisagra', ['barra', 'rack']],
  'hip-thrust': ['hip-ext', ['barra', 'banco']],
  'patada-gluteo': ['hip-ext', ['polea']],
  'abductores': ['abduccion', ['abductores']],
  'gemelo-pie': ['gemelo', ['gemelo-maq']],
  'gemelo-sentado': ['gemelo', ['gemelo-sentado-maq']],
  'crunch-polea': ['core', ['polea']],
  'elev-piernas': ['core', ['dominadas']],
  'rueda': ['core', ['rueda']],
  'plancha': ['core', []],
  'curl-muneca': ['antebrazo', [['barra', 'mancuernas']]],
  'paseo-granjero': ['antebrazo', ['mancuernas']],
  'press-multipower': ['press-h', ['multipower', 'banco']],
  'press-inclinado-multipower': ['press-inc', ['multipower', 'banco-inc']],
  'fondos-asistidos': ['fondos', ['asistida']],
  'dominadas-asistidas': ['tiron-v', ['asistida']],
  'pullover-manc': ['pullover', ['mancuernas', 'banco']],
  'press-hombro-maq': ['press-v', ['press-hombro-maq']],
  'press-militar-multipower': ['press-v', ['multipower']],
  'ext-triceps-manc': ['ext-tri', ['mancuernas']],
  'sentadilla-multipower': ['sentadilla', ['multipower']],
  'rumano-manc': ['bisagra', ['mancuernas']],
  'curl-fem-manc': ['flex-rodilla', ['mancuernas', 'banco']],
  'hip-thrust-multipower': ['hip-ext', ['multipower', 'banco']],
  'puente-gluteo': ['hip-ext', []],
  'gemelo-prensa': ['gemelo', ['prensa']],
  'gemelo-manc': ['gemelo', ['mancuernas']],
  'crunch': ['core', []],
  'plancha-lateral': ['core', []],
  'dead-bug': ['core', []],
  'pallof': ['core', ['polea']],
  'crunch-bicicleta': ['core', []],
  'hollow': ['core', []],
  'crunch-inverso': ['core', []],
  'elev-piernas-suelo': ['core', []],
};
for (const e of EXERCISES) { const [pat, req] = META[e.id] || ['otro', []]; e.pat = pat; e.req = req; }

export const EX_BY_ID = Object.fromEntries(EXERCISES.map(e => [e.id, e]));
