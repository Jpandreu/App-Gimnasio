// Platos personalizables. Cada grupo es de elección única (one) o múltiple (many).
// Cada opción suma ingredientes reales de la base de alimentos: [idAlimento, gramos].
// d: opción marcada por defecto. unit: nombre de la unidad para el contador de cantidad.
const o = (l, i, d = false) => ({ l, i, d });
const NADA = o('Nada', [], true);

export const DISHES = [
  {
    id: 'hamburguesa', name: 'Hamburguesa', unit: 'hamburguesa', keywords: 'burger hamburguesa queso bacon',
    groups: [
      { n: 'Pan', t: 'one', o: [o('Pan de hamburguesa', [['pan-hamburguesa', 60]], true), o('Pan brioche', [['pan-brioche', 70]]), o('Sin pan (en lechuga)', [['lechuga', 40]])] },
      { n: 'Carne', t: 'one', o: [o('Ternera', [['burger-cocinada', 100]], true), o('Doble de ternera', [['burger-cocinada', 200]]), o('Triple', [['burger-cocinada', 300]]), o('Pollo a la plancha', [['pollo-plancha', 120]]), o('Pollo crujiente', [['burger-pollo-crujiente', 120]]), o('Vegetal', [['burger-vegetal', 100]])] },
      { n: 'Queso', t: 'one', o: [o('Sin queso', []), o('Con queso', [['queso-cheddar', 20]], true), o('Doble queso', [['queso-cheddar', 40]]), o('Queso de cabra', [['queso-cabra', 30]])] },
      { n: 'Extras', t: 'many', o: [o('Lechuga y tomate', [['lechuga', 15], ['tomate', 30]], true), o('Bacon', [['bacon', 16]]), o('Huevo frito', [['huevo-frito', 46]]), o('Cebolla', [['cebolla', 20]]), o('Aguacate', [['aguacate', 40]]), o('Pepinillos', [['pepino', 15]])] },
      { n: 'Salsas', t: 'many', o: [o('Kétchup', [['ketchup', 15]], true), o('Mostaza', [['mostaza', 10]]), o('Mayonesa', [['mayonesa', 15]]), o('Barbacoa', [['salsa-bbq', 20]]), o('Salsa especial', [['salsa-burger', 20]])] },
      { n: 'Acompañamiento', t: 'one', o: [NADA, o('Patatas medianas', [['patatas-fritas', 115]]), o('Patatas grandes', [['patatas-fritas', 160]]), o('Aros de cebolla', [['aros-cebolla', 100]]), o('Ensalada', [['lechuga', 80], ['tomate', 50]])] },
      { n: 'Bebida', t: 'one', o: [NADA, o('Refresco', [['refresco', 400]]), o('Refresco zero', [['refresco-zero', 400]]), o('Cerveza', [['cerveza', 330]])] },
    ],
  },
  {
    id: 'pizza', name: 'Pizza', unit: 'porción', keywords: 'pizza',
    groups: [
      { n: 'Tipo', t: 'one', o: [o('Margarita', [['pizza-margarita', 110]], true), o('Barbacoa', [['pizza-barbacoa', 110]]), o('Cuatro quesos', [['pizza-4quesos', 110]]), o('Jamón y champiñón', [['pizza-jamon', 110]]), o('Pepperoni', [['pizza-pepperoni', 110]]), o('Carbonara', [['pizza-carbonara', 110]]), o('Vegetal', [['pizza-vegetal', 110]])] },
      { n: 'Extras (por porción)', t: 'many', o: [o('Extra de queso', [['mozzarella', 15]]), o('Borde relleno de queso', [['mozzarella', 12]]), o('Bacon', [['bacon', 8]]), o('Salsa barbacoa', [['salsa-bbq', 10]])] },
    ],
  },
  {
    id: 'bocadillo', name: 'Bocadillo o sándwich', unit: 'bocadillo', keywords: 'bocadillo bocata sandwich sándwich',
    groups: [
      { n: 'Pan', t: 'one', o: [o('Media barra', [['pan-blanco', 125]], true), o('Barra entera', [['pan-blanco', 250]]), o('Media barra integral', [['pan-integral', 125]]), o('Chapata', [['pan-chapata', 100]]), o('Pan de molde (2 rebanadas)', [['pan-molde', 56]]), o('Wrap', [['wrap', 60]])] },
      { n: 'Relleno', t: 'many', o: [o('Jamón serrano', [['jamon-serrano', 40]], true), o('Jamón cocido', [['jamon-cocido', 45]]), o('Pavo', [['pavo-lonchas', 50]]), o('Lomo a la plancha', [['lomo-cerdo', 90]]), o('Pechuga de pollo', [['pollo-plancha', 100]]), o('Tortilla de patatas', [['tortilla-patatas', 120]]), o('Atún', [['atun-aceite', 56]]), o('Queso', [['queso-lonchas', 34]]), o('Queso curado', [['queso-curado', 30]]), o('Chorizo', [['chorizo', 40]]), o('Bacon', [['bacon', 32]]), o('Huevo frito', [['huevo-frito', 46]]), o('Calamares', [['calamares', 120]])] },
      { n: 'Extras', t: 'many', o: [o('Tomate', [['tomate', 30]]), o('Aceite de oliva', [['aceite-oliva', 8]]), o('Lechuga y tomate', [['lechuga', 15], ['tomate', 30]]), o('Mayonesa', [['mayonesa', 15]]), o('Pimientos', [['pimiento-asado', 40]]), o('Aguacate', [['aguacate', 40]])] },
    ],
  },
  {
    id: 'tostadas', name: 'Tostadas', unit: 'ración', keywords: 'tostada tostadas pan desayuno',
    groups: [
      { n: 'Pan', t: 'one', o: [o('1 rebanada de pan', [['pan-blanco', 40]]), o('2 rebanadas de pan', [['pan-blanco', 80]], true), o('2 rebanadas integral', [['pan-integral', 80]]), o('2 de pan de molde', [['pan-molde', 56]]), o('Media barra', [['pan-blanco', 125]])] },
      { n: 'Encima', t: 'many', o: [o('Aceite de oliva', [['aceite-oliva', 10]], true), o('Tomate', [['tomate', 40]], true), o('Aguacate', [['aguacate', 50]]), o('Jamón serrano', [['jamon-serrano', 30]]), o('Pavo', [['pavo-lonchas', 30]]), o('Huevo', [['huevo', 55]]), o('Queso fresco', [['queso-burgos', 40]]), o('Queso crema', [['queso-crema', 20]]), o('Salmón ahumado', [['salmon-ahumado', 40]]), o('Mantequilla', [['mantequilla', 10]]), o('Mermelada', [['mermelada', 20]]), o('Crema de cacahuete', [['crema-cacahuete', 16]]), o('Crema de cacao', [['crema-cacao', 15]]), o('Plátano', [['platano', 60]])] },
    ],
  },
  {
    id: 'huevos', name: 'Huevos / tortilla francesa', unit: 'ración', keywords: 'huevo huevos tortilla francesa revuelto',
    groups: [
      { n: 'Huevos', t: 'one', o: [o('1 huevo', [['huevo', 55]]), o('2 huevos', [['huevo', 110]], true), o('3 huevos', [['huevo', 165]]), o('4 huevos', [['huevo', 220]]), o('2 huevos + 2 claras', [['huevo', 110], ['claras', 66]])] },
      { n: 'Cómo', t: 'one', o: [o('Cocidos / plancha sin aceite', [], true), o('Con un poco de aceite', [['aceite-oliva', 5]]), o('Fritos', [['aceite-oliva', 12]])] },
      { n: 'Con', t: 'many', o: [o('Jamón cocido', [['jamon-cocido', 30]]), o('Queso', [['queso-lonchas', 20]]), o('Espinacas', [['espinacas', 50]]), o('Champiñones', [['champinones', 50]]), o('Atún', [['atun-natural', 56]]), o('Bacon', [['bacon', 16]]), o('Patata', [['patata-cocida', 100]])] },
    ],
  },
  {
    id: 'ensalada', name: 'Ensalada', unit: 'plato', keywords: 'ensalada',
    groups: [
      { n: 'Base', t: 'one', o: [o('Lechuga / mezclum', [['lechuga', 100]], true), o('De pasta', [['pasta-cocida', 150], ['lechuga', 40]]), o('De arroz', [['arroz-cocido', 150], ['lechuga', 40]]), o('De quinoa', [['quinoa', 150], ['lechuga', 40]]), o('De patata', [['patata-cocida', 200]])] },
      { n: 'Proteína', t: 'many', o: [o('Atún', [['atun-natural', 56]], true), o('Pollo', [['pollo-plancha', 100]]), o('Huevo cocido', [['huevo-cocido', 50]]), o('Queso fresco', [['queso-burgos', 50]]), o('Queso de cabra', [['queso-cabra', 40]]), o('Gambas', [['gambas', 80]]), o('Salmón ahumado', [['salmon-ahumado', 50]]), o('Garbanzos', [['garbanzos', 100]])] },
      { n: 'Extras', t: 'many', o: [o('Tomate', [['tomate', 80]], true), o('Maíz', [['maiz', 40]]), o('Zanahoria', [['zanahoria', 40]]), o('Pepino', [['pepino', 50]]), o('Aceitunas', [['aceitunas', 20]]), o('Aguacate', [['aguacate', 50]]), o('Nueces', [['nueces', 15]]), o('Cebolla', [['cebolla', 20]])] },
      { n: 'Aliño', t: 'one', o: [o('Aceite y vinagre', [['aceite-oliva', 13], ['vinagreta', 10]], true), o('Poco aceite', [['aceite-oliva', 5]]), o('Salsa César', [['salsa-cesar', 30]]), o('Salsa de yogur', [['salsa-yogur', 30]]), o('Sin aliño', [])] },
    ],
  },
  {
    id: 'pasta', name: 'Plato de pasta', unit: 'plato', keywords: 'pasta macarrones espaguetis espagueti',
    groups: [
      { n: 'Pasta (en crudo)', t: 'one', o: [o('Pequeño (70 g)', [['pasta-cruda', 70]]), o('Normal (90 g)', [['pasta-cruda', 90]], true), o('Grande (120 g)', [['pasta-cruda', 120]]), o('Integral (90 g)', [['pasta-integral', 90]])] },
      { n: 'Salsa', t: 'one', o: [o('Tomate', [['tomate-frito', 80]], true), o('Boloñesa', [['tomate-frito', 60], ['picada-mixta', 100]]), o('Carbonara', [['nata-cocinar', 60], ['bacon', 25], ['queso-rallado', 10]]), o('Pesto', [['pesto', 30]]), o('Atún y tomate', [['atun-natural', 56], ['tomate-frito', 60]]), o('Aceite y ajo', [['aceite-oliva', 13]])] },
      { n: 'Extras', t: 'many', o: [o('Queso rallado', [['queso-rallado', 15]]), o('Pollo', [['pollo-plancha', 100]]), o('Champiñones', [['champinones', 80]]), o('Chorizo', [['chorizo', 30]])] },
    ],
  },
  {
    id: 'arroz', name: 'Plato de arroz', unit: 'plato', keywords: 'arroz',
    groups: [
      { n: 'Arroz (en crudo)', t: 'one', o: [o('Pequeño (60 g)', [['arroz-crudo', 60]]), o('Normal (80 g)', [['arroz-crudo', 80]], true), o('Grande (110 g)', [['arroz-crudo', 110]]), o('Basmati (80 g)', [['arroz-basmati', 80]])] },
      { n: 'Con', t: 'many', o: [o('Pollo', [['pollo-plancha', 150]], true), o('Ternera', [['ternera-plancha', 130]]), o('Atún', [['atun-natural', 56]]), o('Huevo', [['huevo-frito', 46]]), o('Salmón', [['salmon', 130]]), o('Verduras', [['pimiento', 60], ['calabacin', 60]]), o('Tomate frito', [['tomate-frito', 60]]), o('Salsa de soja', [['salsa-soja', 15]])] },
      { n: 'Aceite', t: 'one', o: [o('Sin aceite', []), o('1 cucharada', [['aceite-oliva', 13]], true), o('2 cucharadas', [['aceite-oliva', 26]])] },
    ],
  },
  {
    id: 'kebab', name: 'Kebab / dürüm', unit: 'unidad', keywords: 'kebab durum dürüm shawarma',
    groups: [
      { n: 'Formato', t: 'one', o: [o('En pan de pita', [['pan-pita', 90]], true), o('Dürüm (rollo)', [['wrap', 90]]), o('Plato con patatas', [['patatas-fritas', 150]]), o('Box con patatas', [['patatas-fritas', 120]])] },
      { n: 'Carne', t: 'one', o: [o('Ternera / cordero', [['carne-kebab', 120]], true), o('Pollo', [['pollo-kebab', 120]]), o('Mixto', [['carne-kebab', 60], ['pollo-kebab', 60]]), o('Doble de carne', [['carne-kebab', 220]])] },
      { n: 'Extras', t: 'many', o: [o('Ensalada', [['lechuga', 40], ['tomate', 30], ['cebolla', 15]], true), o('Salsa de yogur', [['salsa-yogur', 30]], true), o('Salsa picante', [['salsa-picante', 10]]), o('Queso', [['queso-cheddar', 20]]), o('Patatas dentro', [['patatas-fritas', 60]])] },
    ],
  },
  {
    id: 'burrito', name: 'Burrito / tacos', unit: 'unidad', keywords: 'burrito tacos taco mexicano',
    groups: [
      { n: 'Tortilla', t: 'one', o: [o('Burrito (tortilla grande)', [['wrap', 75]], true), o('2 tacos', [['wrap', 60]]), o('Bol sin tortilla', [])] },
      { n: 'Relleno', t: 'many', o: [o('Pollo', [['pollo-plancha', 100]], true), o('Ternera picada', [['picada-5', 100]]), o('Frijoles', [['alubias', 80]], true), o('Arroz', [['arroz-cocido', 100]], true)] },
      { n: 'Extras', t: 'many', o: [o('Queso', [['queso-rallado', 30]]), o('Guacamole', [['guacamole', 40]]), o('Pico de gallo', [['tomate', 40], ['cebolla', 15]]), o('Maíz', [['maiz', 30]]), o('Salsa picante', [['salsa-picante', 10]])] },
    ],
  },
  {
    id: 'poke', name: 'Poke bowl', unit: 'bol', keywords: 'poke bowl bol',
    groups: [
      { n: 'Base', t: 'one', o: [o('Arroz', [['arroz-cocido', 180]], true), o('Quinoa', [['quinoa', 180]]), o('Mitad arroz, mitad lechuga', [['arroz-cocido', 100], ['lechuga', 50]])] },
      { n: 'Proteína', t: 'one', o: [o('Salmón', [['salmon', 100]], true), o('Atún fresco', [['atun-fresco', 100]]), o('Pollo', [['pollo-plancha', 100]]), o('Gambas', [['gambas', 100]]), o('Tofu', [['tofu', 100]]), o('Doble de proteína', [['salmon', 200]])] },
      { n: 'Toppings', t: 'many', o: [o('Aguacate', [['aguacate', 50]], true), o('Edamame', [['edamame', 40]], true), o('Mango', [['mango', 50]]), o('Pepino', [['pepino', 40]]), o('Maíz', [['maiz', 30]]), o('Zanahoria', [['zanahoria', 30]])] },
      { n: 'Salsa', t: 'many', o: [o('Soja', [['salsa-soja', 15]], true), o('Mayonesa picante', [['mayonesa', 15], ['salsa-picante', 5]])] },
    ],
  },
  {
    id: 'porridge', name: 'Bol de avena (porridge)', unit: 'bol', keywords: 'avena porridge gachas bol desayuno',
    groups: [
      { n: 'Avena', t: 'one', o: [o('40 g', [['avena', 40]]), o('60 g', [['avena', 60]], true), o('80 g', [['avena', 80]]), o('100 g', [['avena', 100]])] },
      { n: 'Líquido', t: 'one', o: [o('Leche entera (250 ml)', [['leche-entera', 250]], true), o('Leche semidesnatada', [['leche-semi', 250]]), o('Bebida de avena', [['bebida-avena', 250]]), o('Agua', [])] },
      { n: 'Toppings', t: 'many', o: [o('Plátano', [['platano', 120]], true), o('Frutos rojos', [['frutos-rojos', 80]]), o('Crema de cacahuete', [['crema-cacahuete', 16]]), o('Proteína whey', [['whey', 30]]), o('Miel', [['miel', 15]]), o('Cacao', [['cacao-soluble', 10]]), o('Nueces', [['nueces', 15]]), o('Yogur griego', [['yogur-griego', 125]])] },
    ],
  },
  {
    id: 'batido', name: 'Batido casero', unit: 'batido', keywords: 'batido shake proteína ganador',
    groups: [
      { n: 'Base', t: 'one', o: [o('Leche entera (300 ml)', [['leche-entera', 300]], true), o('Leche semidesnatada (300 ml)', [['leche-semi', 300]]), o('Bebida de avena (300 ml)', [['bebida-avena', 300]]), o('Agua', [])] },
      { n: 'Ingredientes', t: 'many', o: [o('Proteína whey', [['whey', 30]], true), o('Plátano', [['platano', 120]], true), o('Avena', [['avena', 50]]), o('Crema de cacahuete', [['crema-cacahuete', 16]]), o('Cacao', [['cacao-soluble', 18]]), o('Fresas', [['fresas', 100]]), o('Dátiles', [['datiles', 24]]), o('Yogur griego', [['yogur-griego', 125]]), o('Miel', [['miel', 15]])] },
    ],
  },
  {
    id: 'cafe', name: 'Café', unit: 'café', keywords: 'cafe café cortado latte capuchino',
    groups: [
      { n: 'Tipo', t: 'one', o: [o('Solo', [['cafe-solo', 50]]), o('Cortado', [['cafe-solo', 50], ['leche-entera', 30]]), o('Con leche entera', [['cafe-solo', 50], ['leche-entera', 150]], true), o('Con leche semi', [['cafe-solo', 50], ['leche-semi', 150]]), o('Con leche desnatada', [['cafe-solo', 50], ['leche-desnatada', 150]]), o('Con bebida de avena', [['cafe-solo', 50], ['bebida-avena', 150]]), o('Latte grande', [['cafe-solo', 50], ['leche-entera', 280]])] },
      { n: 'Azúcar', t: 'one', o: [o('Sin azúcar', [], true), o('1 sobre', [['azucar', 8]]), o('2 sobres', [['azucar', 16]]), o('Edulcorante', [])] },
      { n: 'Para acompañar', t: 'many', o: [o('Cruasán', [['croissant', 60]]), o('Magdalena', [['magdalena', 30]]), o('Galletas', [['galletas-maria', 24]]), o('Tostada con tomate', [['pan-blanco', 60], ['tomate', 30], ['aceite-oliva', 8]])] },
    ],
  },
];

export const DISH_BY_ID = Object.fromEntries(DISHES.map(d => [d.id, d]));

// Selección por defecto: índices de opciones marcadas por grupo
export function defaultSel(dish) {
  return dish.groups.map(g => {
    const idx = g.o.map((x, i) => (x.d ? i : -1)).filter(i => i >= 0);
    return g.t === 'one' ? [idx[0] ?? 0] : idx;
  });
}
