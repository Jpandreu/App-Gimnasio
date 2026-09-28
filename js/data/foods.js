// Base de alimentos. Valores por 100 g (o 100 ml), hidratos sin fibra como en el etiquetado europeo.
// Fuentes de referencia: BEDCA y USDA FoodData Central, redondeados.
export const FOOD_CATS = {
  proteina: 'Carnes, pescados y huevos', lacteo: 'Lácteos', cereal: 'Cereales y tubérculos',
  legumbre: 'Legumbres', fruta: 'Fruta', verdura: 'Verdura', grasa: 'Grasas y frutos secos',
  suplemento: 'Suplementos', plato: 'Platos', snack: 'Dulces y extras', bebida: 'Bebidas',
};

// s: raciones típicas [etiqueta, gramos]
const F = (id, name, cat, kcal, p, c, f, s = []) => ({ id, name, cat, kcal, p, c, f, s });

export const FOODS = [
  // Proteína
  F('pollo-plancha', 'Pechuga de pollo a la plancha', 'proteina', 165, 31, 0, 3.6, [['Filete', 150]]),
  F('pollo-crudo', 'Pechuga de pollo (cruda)', 'proteina', 110, 23, 0, 1.5, [['Filete', 180]]),
  F('muslo-pollo', 'Muslo de pollo sin piel (asado)', 'proteina', 209, 26, 0, 11, [['Muslo', 100]]),
  F('pavo-lonchas', 'Pechuga de pavo en lonchas', 'proteina', 105, 19, 2, 2, [['4 lonchas', 40]]),
  F('ternera-plancha', 'Filete de ternera a la plancha', 'proteina', 180, 28, 0, 7, [['Filete', 150]]),
  F('picada-5', 'Carne picada de ternera 5% (cruda)', 'proteina', 137, 21, 0, 5, [['Ración', 150]]),
  F('picada-mixta', 'Carne picada mixta (cruda)', 'proteina', 250, 17, 0, 20, [['Ración', 150]]),
  F('lomo-cerdo', 'Lomo de cerdo a la plancha', 'proteina', 170, 29, 0, 6, [['Filete', 130]]),
  F('salmon', 'Salmón', 'proteina', 208, 20, 0, 13, [['Lomo', 150]]),
  F('atun-natural', 'Atún al natural (escurrido)', 'proteina', 116, 26, 0, 1, [['Lata', 56]]),
  F('atun-aceite', 'Atún en aceite (escurrido)', 'proteina', 198, 29, 0, 8, [['Lata', 56]]),
  F('merluza', 'Merluza', 'proteina', 90, 18, 0, 1.5, [['Filete', 180]]),
  F('gambas', 'Gambas / langostinos', 'proteina', 99, 24, 0, 0.3, [['Ración', 120]]),
  F('sardinas-lata', 'Sardinas en aceite (escurridas)', 'proteina', 208, 25, 0, 11.5, [['Lata', 60]]),
  F('huevo', 'Huevo', 'proteina', 143, 12.6, 0.7, 9.5, [['1 huevo L', 55]]),
  F('claras', 'Claras de huevo', 'proteina', 52, 11, 0.7, 0.2, [['1 clara', 33], ['Vaso', 250]]),
  F('jamon-serrano', 'Jamón serrano', 'proteina', 241, 31, 0, 13, [['3 lonchas', 30]]),
  F('jamon-cocido', 'Jamón cocido extra', 'proteina', 110, 20, 1, 3, [['3 lonchas', 45]]),
  F('tofu', 'Tofu firme', 'proteina', 144, 17, 3, 9, [['Ración', 125]]),
  F('hamburguesa-ternera', 'Hamburguesa de ternera (cruda)', 'proteina', 215, 18, 2, 15, [['Unidad', 125]]),

  // Lácteos
  F('leche-entera', 'Leche entera', 'lacteo', 64, 3.2, 4.7, 3.6, [['Vaso', 250]]),
  F('leche-semi', 'Leche semidesnatada', 'lacteo', 46, 3.2, 4.8, 1.6, [['Vaso', 250]]),
  F('leche-desnatada', 'Leche desnatada', 'lacteo', 35, 3.4, 5, 0.1, [['Vaso', 250]]),
  F('bebida-avena', 'Bebida de avena', 'lacteo', 45, 0.5, 7, 1.4, [['Vaso', 250]]),
  F('yogur-griego', 'Yogur griego natural', 'lacteo', 130, 4, 4.5, 10, [['Unidad', 125]]),
  F('skyr', 'Skyr / yogur proteico', 'lacteo', 63, 11, 4, 0.2, [['Unidad', 150]]),
  F('yogur-natural', 'Yogur natural', 'lacteo', 61, 3.5, 4.7, 3.2, [['Unidad', 125]]),
  F('queso-batido', 'Queso fresco batido 0%', 'lacteo', 46, 8, 3.5, 0.1, [['Tarrina', 250], ['Cucharada', 30]]),
  F('queso-burgos', 'Queso fresco de Burgos', 'lacteo', 174, 12.4, 3.2, 12.8, [['Tarrina', 75]]),
  F('queso-curado', 'Queso curado', 'lacteo', 400, 26, 0.5, 33, [['Cuña', 30]]),
  F('requeson', 'Requesón / cottage', 'lacteo', 98, 11, 3.4, 4.3, [['Tarrina', 200]]),
  F('kefir', 'Kéfir', 'lacteo', 60, 3.5, 4.5, 3, [['Vaso', 250]]),

  // Cereales y tubérculos
  F('arroz-crudo', 'Arroz blanco (crudo)', 'cereal', 355, 7, 79, 0.6, [['Ración', 80]]),
  F('arroz-cocido', 'Arroz blanco cocido', 'cereal', 130, 2.7, 28, 0.3, [['Plato', 250]]),
  F('arroz-integral-cocido', 'Arroz integral cocido', 'cereal', 123, 2.7, 25.6, 1, [['Plato', 250]]),
  F('pasta-cruda', 'Pasta (cruda)', 'cereal', 357, 12.5, 72, 1.5, [['Ración', 90]]),
  F('pasta-cocida', 'Pasta cocida', 'cereal', 158, 5.8, 31, 0.9, [['Plato', 250]]),
  F('avena', 'Copos de avena', 'cereal', 375, 13, 60, 7, [['Cazo', 40], ['Taza', 80]]),
  F('crema-arroz', 'Crema de arroz', 'cereal', 370, 7, 80, 1, [['Cazo', 50]]),
  F('pan-blanco', 'Pan blanco (barra)', 'cereal', 265, 9, 49, 3.2, [['Rebanada', 30], ['Media barra', 125]]),
  F('pan-integral', 'Pan integral', 'cereal', 247, 13, 41, 3.4, [['Rebanada', 30]]),
  F('pan-molde', 'Pan de molde', 'cereal', 270, 8, 48, 4, [['Rebanada', 28]]),
  F('tortitas-arroz', 'Tortitas de arroz', 'cereal', 387, 8, 81, 3, [['Tortita', 8]]),
  F('wrap', 'Tortilla de trigo (wrap)', 'cereal', 310, 8, 51, 8, [['Unidad', 60]]),
  F('patata-cocida', 'Patata cocida', 'cereal', 86, 1.9, 20, 0.1, [['Mediana', 170]]),
  F('patata-cruda', 'Patata (cruda)', 'cereal', 77, 2, 17, 0.1, [['Mediana', 170]]),
  F('boniato', 'Boniato asado', 'cereal', 90, 2, 21, 0.2, [['Mediano', 150]]),
  F('quinoa', 'Quinoa cocida', 'cereal', 120, 4.4, 21.3, 1.9, [['Plato', 200]]),
  F('cuscus', 'Cuscús cocido', 'cereal', 112, 3.8, 23, 0.2, [['Plato', 200]]),
  F('corn-flakes', 'Cereales tipo corn flakes', 'cereal', 378, 7, 84, 0.9, [['Bol', 40]]),
  F('granola', 'Granola', 'cereal', 450, 10, 64, 17, [['Bol', 50]]),

  // Legumbres
  F('lentejas', 'Lentejas cocidas', 'legumbre', 116, 9, 20, 0.4, [['Plato', 250]]),
  F('garbanzos', 'Garbanzos cocidos', 'legumbre', 164, 8.9, 27, 2.6, [['Plato', 250], ['Bote', 400]]),
  F('alubias', 'Alubias cocidas', 'legumbre', 127, 8.7, 22.8, 0.5, [['Plato', 250]]),
  F('hummus', 'Hummus', 'legumbre', 166, 7.9, 14.3, 9.6, [['Cucharada', 30]]),

  // Fruta
  F('platano', 'Plátano', 'fruta', 89, 1.1, 22.8, 0.3, [['Unidad', 120]]),
  F('manzana', 'Manzana', 'fruta', 52, 0.3, 13.8, 0.2, [['Unidad', 180]]),
  F('naranja', 'Naranja', 'fruta', 47, 0.9, 11.8, 0.1, [['Unidad', 180]]),
  F('pera', 'Pera', 'fruta', 57, 0.4, 15, 0.1, [['Unidad', 170]]),
  F('fresas', 'Fresas', 'fruta', 32, 0.7, 7.7, 0.3, [['Bol', 150]]),
  F('arandanos', 'Arándanos', 'fruta', 57, 0.7, 14.5, 0.3, [['Puñado', 60]]),
  F('uvas', 'Uvas', 'fruta', 69, 0.7, 18, 0.2, [['Racimo', 150]]),
  F('kiwi', 'Kiwi', 'fruta', 61, 1.1, 14.7, 0.5, [['Unidad', 75]]),
  F('pina', 'Piña', 'fruta', 50, 0.5, 13, 0.1, [['Rodaja', 100]]),
  F('mango', 'Mango', 'fruta', 60, 0.8, 15, 0.4, [['Medio', 150]]),
  F('datiles', 'Dátiles', 'fruta', 282, 2.5, 75, 0.4, [['Unidad', 8]]),
  F('pasas', 'Uvas pasas', 'fruta', 299, 3, 79, 0.5, [['Puñado', 30]]),

  // Verdura
  F('brocoli', 'Brócoli', 'verdura', 34, 2.8, 7, 0.4, [['Ración', 150]]),
  F('espinacas', 'Espinacas', 'verdura', 23, 2.9, 3.6, 0.4, [['Ración', 100]]),
  F('tomate', 'Tomate', 'verdura', 18, 0.9, 3.9, 0.2, [['Unidad', 120]]),
  F('lechuga', 'Lechuga / ensalada verde', 'verdura', 15, 1.4, 2.9, 0.2, [['Plato', 100]]),
  F('zanahoria', 'Zanahoria', 'verdura', 41, 0.9, 9.6, 0.2, [['Unidad', 80]]),
  F('pimiento', 'Pimiento', 'verdura', 31, 1, 6, 0.3, [['Unidad', 150]]),
  F('calabacin', 'Calabacín', 'verdura', 17, 1.2, 3.1, 0.3, [['Unidad', 200]]),
  F('cebolla', 'Cebolla', 'verdura', 40, 1.1, 9.3, 0.1, [['Media', 60]]),
  F('champinones', 'Champiñones', 'verdura', 22, 3.1, 3.3, 0.3, [['Ración', 100]]),
  F('judias-verdes', 'Judías verdes', 'verdura', 31, 1.8, 7, 0.2, [['Ración', 150]]),
  F('aguacate', 'Aguacate', 'verdura', 160, 2, 8.5, 14.7, [['Medio', 75]]),

  // Grasas y frutos secos
  F('aceite-oliva', 'Aceite de oliva', 'grasa', 884, 0, 0, 100, [['Cucharada', 13], ['Cucharadita', 5]]),
  F('crema-cacahuete', 'Crema de cacahuete', 'grasa', 588, 25, 20, 50, [['Cucharada', 16]]),
  F('almendras', 'Almendras', 'grasa', 598, 21, 7, 52, [['Puñado', 30]]),
  F('nueces', 'Nueces', 'grasa', 670, 15, 4, 66, [['Puñado', 30]]),
  F('cacahuetes', 'Cacahuetes tostados', 'grasa', 585, 26, 12, 49, [['Puñado', 30]]),
  F('anacardos', 'Anacardos', 'grasa', 553, 18, 27, 44, [['Puñado', 30]]),
  F('mantequilla', 'Mantequilla', 'grasa', 717, 0.9, 0.1, 81, [['Porción', 10]]),
  F('mayonesa', 'Mayonesa', 'grasa', 680, 1, 1, 75, [['Cucharada', 15]]),
  F('choco-negro', 'Chocolate negro 85%', 'grasa', 580, 9, 21, 48, [['2 onzas', 20]]),

  // Suplementos
  F('whey', 'Proteína whey', 'suplemento', 390, 78, 7, 6, [['Cacito', 30]]),
  F('caseina', 'Caseína', 'suplemento', 360, 80, 5, 2, [['Cacito', 30]]),
  F('barrita-proteina', 'Barrita de proteína', 'suplemento', 350, 33, 33, 12, [['Unidad', 60]]),
  F('ganador', 'Ganador de peso (gainer)', 'suplemento', 380, 20, 70, 3, [['Toma', 100]]),

  // Platos
  F('tortilla-patatas', 'Tortilla de patatas', 'plato', 180, 6, 15, 11, [['Pincho', 120], ['Ración', 200]]),
  F('arroz-pollo', 'Arroz con pollo', 'plato', 160, 9, 20, 5, [['Plato', 350]]),
  F('lentejas-chorizo', 'Lentejas con chorizo', 'plato', 130, 7, 13, 5, [['Plato', 350]]),
  F('macarrones-tomate', 'Macarrones con tomate y carne', 'plato', 165, 8, 22, 5, [['Plato', 350]]),
  F('pizza', 'Pizza', 'plato', 266, 11, 33, 10, [['Porción', 110]]),
  F('bocadillo-jamon', 'Bocadillo de jamón serrano', 'plato', 260, 14, 34, 7, [['Unidad', 180]]),
  F('ensaladilla', 'Ensaladilla rusa', 'plato', 170, 4, 10, 13, [['Ración', 200]]),

  // Dulces y extras
  F('miel', 'Miel', 'snack', 304, 0.3, 82, 0, [['Cucharada', 20]]),
  F('mermelada', 'Mermelada', 'snack', 250, 0.4, 60, 0.1, [['Cucharada', 20]]),
  F('cacao-soluble', 'Cacao soluble', 'snack', 378, 5.6, 78, 3.1, [['2 cucharadas', 18]]),
  F('galletas-maria', 'Galletas María', 'snack', 437, 6.9, 74, 12, [['4 galletas', 24]]),
  F('choco-leche', 'Chocolate con leche', 'snack', 535, 7.7, 59, 30, [['2 onzas', 20]]),
  F('tomate-frito', 'Tomate frito', 'snack', 71, 1.3, 9.3, 3.1, [['Cucharada', 30]]),

  // Bebidas
  F('zumo-naranja', 'Zumo de naranja', 'bebida', 45, 0.7, 10.4, 0.2, [['Vaso', 250]]),
  F('isotonica', 'Bebida isotónica', 'bebida', 24, 0, 6, 0, [['Botella', 500]]),
  F('refresco', 'Refresco con azúcar', 'bebida', 42, 0, 10.6, 0, [['Lata', 330]]),
  F('cerveza', 'Cerveza', 'bebida', 43, 0.5, 3.6, 0, [['Caña', 200], ['Tercio', 330]]),
];
