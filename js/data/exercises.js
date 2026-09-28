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
];

export const EX_BY_ID = Object.fromEntries(EXERCISES.map(e => [e.id, e]));
