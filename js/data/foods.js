// Base de alimentos. Valores por 100 g (o 100 ml), hidratos sin fibra como en el etiquetado europeo.
// Fuentes de referencia: BEDCA y USDA FoodData Central, redondeados.
export const FOOD_CATS = {
  proteina: 'Carnes, huevos y embutidos', pescado: 'Pescados y mariscos', lacteo: 'Lácteos', cereal: 'Cereales y tubérculos',
  legumbre: 'Legumbres', fruta: 'Fruta', verdura: 'Verdura', grasa: 'Aceites y grasas', frutoseco: 'Frutos secos y semillas',
  suplemento: 'Suplementos', plato: 'Platos', rapida: 'Comida rápida', panaderia: 'Panadería y bollería',
  salsa: 'Salsas y condimentos', snack: 'Dulces y snacks', bebida: 'Bebidas',
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

// Ampliación: comida rápida, platos, embutidos, salsas, bollería y bebidas
FOODS.push(
  // Carnes, embutidos y pescados
  F('burger-cocinada', 'Carne de hamburguesa de ternera (hecha)', 'proteina', 254, 26, 0, 16, [['1 carne', 100]]),
  F('burger-pollo-crujiente', 'Pollo crujiente empanado', 'proteina', 260, 17, 16, 14, [['Filete', 120]]),
  F('burger-vegetal', 'Hamburguesa vegetal', 'proteina', 200, 15, 8, 12, [['Unidad', 100]]),
  F('bacon', 'Bacon (beicon) a la plancha', 'proteina', 541, 37, 1.4, 42, [['2 lonchas', 16]]),
  F('chorizo', 'Chorizo', 'proteina', 455, 24, 2, 38, [['4 rodajas', 30]]),
  F('salchichon', 'Salchichón / fuet', 'proteina', 438, 25, 1.5, 37, [['6 rodajas', 30]]),
  F('lomo-embuchado', 'Lomo embuchado', 'proteina', 250, 41, 1, 9, [['6 lonchas', 30]]),
  F('jamon-iberico', 'Jamón ibérico', 'proteina', 370, 38, 0, 24, [['Ración', 50]]),
  F('salchicha', 'Salchicha tipo Frankfurt', 'proteina', 280, 12, 2.5, 25, [['Unidad', 50]]),
  F('pollo-asado', 'Pollo asado con piel', 'proteina', 239, 27, 0, 14, [['Cuarto', 200]]),
  F('chuleta-cerdo', 'Chuleta de cerdo a la plancha', 'proteina', 230, 27, 0, 13, [['Unidad', 150]]),
  F('secreto', 'Secreto / presa ibérica', 'proteina', 300, 20, 0, 24, [['Ración', 150]]),
  F('entrecot', 'Entrecot / chuletón', 'proteina', 250, 25, 0, 17, [['Filete', 250]]),
  F('carne-kebab', 'Carne de kebab (ternera/cordero)', 'proteina', 215, 18, 3, 15, [['Ración', 120]]),
  F('pollo-kebab', 'Pollo de kebab', 'proteina', 180, 22, 2, 9, [['Ración', 120]]),
  F('nuggets', 'Nuggets de pollo', 'proteina', 296, 15, 18, 18, [['6 unidades', 100]]),
  F('alitas', 'Alitas de pollo', 'proteina', 290, 27, 0, 19, [['6 alitas', 150]]),
  F('huevo-frito', 'Huevo frito', 'proteina', 196, 13.6, 0.8, 15, [['1 huevo', 46]]),
  F('huevo-cocido', 'Huevo cocido', 'proteina', 155, 12.6, 1.1, 10.6, [['1 huevo', 50]]),
  F('tortilla-francesa', 'Tortilla francesa (2 huevos)', 'proteina', 154, 11, 0.6, 12, [['Unidad', 110]]),
  F('atun-fresco', 'Atún fresco / bonito', 'proteina', 144, 23, 0, 5, [['Filete', 150]]),
  F('bacalao', 'Bacalao', 'proteina', 82, 18, 0, 0.7, [['Lomo', 180]]),
  F('dorada', 'Dorada / lubina', 'proteina', 120, 20, 0, 4.5, [['Pieza', 200]]),
  F('salmon-ahumado', 'Salmón ahumado', 'proteina', 117, 18, 0, 4.3, [['Paquete', 80]]),
  F('calamares', 'Calamares a la romana', 'proteina', 250, 12, 18, 14, [['Ración', 150]]),
  F('mejillones', 'Mejillones', 'proteina', 86, 12, 4, 2, [['Ración', 150]]),
  F('surimi', 'Palitos de surimi', 'proteina', 99, 7, 15, 1, [['4 palitos', 60]]),

  // Lácteos
  F('queso-cheddar', 'Queso cheddar', 'lacteo', 403, 25, 1.3, 33, [['Loncha', 20]]),
  F('queso-lonchas', 'Queso en lonchas (tipo sándwich)', 'lacteo', 280, 15, 7, 21, [['Loncha', 17]]),
  F('mozzarella', 'Mozzarella', 'lacteo', 254, 18, 1, 19, [['Bola', 125]]),
  F('queso-rallado', 'Queso rallado', 'lacteo', 400, 28, 2, 31, [['Puñado', 15]]),
  F('queso-crema', 'Queso crema (untar)', 'lacteo', 250, 5.5, 4, 23, [['Cucharada', 20]]),
  F('queso-cabra', 'Queso de cabra (rulo)', 'lacteo', 300, 19, 1, 24, [['2 rodajas', 40]]),
  F('yogur-azucarado', 'Yogur de sabores / azucarado', 'lacteo', 93, 3.2, 14, 2.6, [['Unidad', 125]]),
  F('natillas', 'Natillas / flan', 'lacteo', 120, 3.8, 18, 3.5, [['Unidad', 125]]),
  F('batido-cacao', 'Batido de cacao', 'lacteo', 70, 3.3, 10.5, 1.6, [['Brik', 200]]),
  F('helado', 'Helado', 'lacteo', 207, 3.5, 24, 11, [['Bola', 60], ['Tarrina', 150]]),
  F('nata-cocinar', 'Nata para cocinar', 'lacteo', 195, 2.5, 3.5, 19, [['Cucharada', 20]]),

  // Panadería y bollería
  F('pan-hamburguesa', 'Pan de hamburguesa', 'panaderia', 280, 9, 49, 5, [['Unidad', 60]]),
  F('pan-brioche', 'Pan brioche', 'panaderia', 340, 9, 52, 10, [['Unidad', 70]]),
  F('pan-pita', 'Pan de pita', 'panaderia', 275, 9, 55, 1.2, [['Unidad', 60]]),
  F('pan-chapata', 'Chapata / pan de barra rústico', 'panaderia', 270, 9, 52, 2.5, [['Unidad', 100]]),
  F('biscotes', 'Pan tostado (biscotes)', 'panaderia', 410, 12, 75, 6, [['2 biscotes', 16]]),
  F('croissant', 'Cruasán', 'panaderia', 406, 8.2, 45, 21, [['Unidad', 60]]),
  F('napolitana', 'Napolitana de chocolate', 'panaderia', 420, 7, 47, 22, [['Unidad', 90]]),
  F('magdalena', 'Magdalena', 'panaderia', 420, 6, 52, 21, [['Unidad', 30]]),
  F('donut', 'Dónut', 'panaderia', 420, 5, 48, 23, [['Unidad', 55]]),
  F('churros', 'Churros', 'panaderia', 380, 5, 40, 22, [['Ración (4)', 100]]),
  F('bizcocho', 'Bizcocho casero', 'panaderia', 360, 6, 52, 14, [['Porción', 60]]),
  F('tortitas-americanas', 'Tortitas americanas (pancakes)', 'panaderia', 227, 6.4, 28, 10, [['2 tortitas', 120]]),

  // Comida rápida
  F('hamburguesa-cadena', 'Hamburguesa con queso (cadena)', 'rapida', 260, 13, 28, 11, [['Unidad', 120]]),
  F('hamburguesa-grande', 'Hamburguesa grande doble (cadena)', 'rapida', 240, 12, 19, 13, [['Unidad', 230]]),
  F('patatas-fritas', 'Patatas fritas', 'rapida', 312, 3.4, 41, 15, [['Ración mediana', 115], ['Ración grande', 160]]),
  F('aros-cebolla', 'Aros de cebolla', 'rapida', 330, 4, 34, 19, [['Ración', 100]]),
  F('pizza-margarita', 'Pizza margarita', 'rapida', 250, 11, 31, 9, [['Porción', 110]]),
  F('pizza-barbacoa', 'Pizza barbacoa', 'rapida', 265, 12, 30, 11, [['Porción', 110]]),
  F('pizza-4quesos', 'Pizza cuatro quesos', 'rapida', 290, 13, 28, 14, [['Porción', 110]]),
  F('pizza-jamon', 'Pizza de jamón y champiñón', 'rapida', 240, 12, 29, 8.5, [['Porción', 110]]),
  F('pizza-pepperoni', 'Pizza pepperoni', 'rapida', 290, 12, 29, 14, [['Porción', 110]]),
  F('pizza-vegetal', 'Pizza vegetal', 'rapida', 220, 9, 30, 7, [['Porción', 110]]),
  F('pizza-carbonara', 'Pizza carbonara', 'rapida', 280, 12, 28, 13, [['Porción', 110]]),
  F('kebab', 'Kebab en pan de pita', 'rapida', 215, 12, 20, 10, [['Unidad', 350]]),
  F('durum', 'Dürüm (rollo)', 'rapida', 220, 11, 22, 10, [['Unidad', 350]]),
  F('burrito', 'Burrito', 'rapida', 206, 9, 25, 8, [['Unidad', 300]]),
  F('hot-dog', 'Perrito caliente', 'rapida', 280, 10, 24, 16, [['Unidad', 150]]),
  F('sandwich-mixto', 'Sándwich mixto', 'rapida', 280, 14, 26, 13, [['Unidad', 120]]),
  F('nachos-queso', 'Nachos con queso', 'rapida', 350, 9, 36, 19, [['Ración', 200]]),
  F('sushi', 'Sushi variado', 'rapida', 150, 6, 26, 2.5, [['Pieza', 30], ['Bandeja (12)', 360]]),
  F('poke', 'Poke bowl', 'rapida', 150, 9, 18, 5, [['Bol', 450]]),

  // Platos
  F('paella', 'Paella', 'plato', 160, 8, 22, 4.5, [['Plato', 350]]),
  F('cocido', 'Cocido', 'plato', 140, 9, 10, 7, [['Plato', 400]]),
  F('croquetas', 'Croquetas', 'plato', 210, 6, 20, 12, [['Unidad', 35]]),
  F('bravas', 'Patatas bravas', 'plato', 180, 2, 20, 10, [['Ración', 250]]),
  F('huevos-rotos', 'Huevos rotos con jamón', 'plato', 220, 8, 14, 15, [['Ración', 300]]),
  F('lasana', 'Lasaña de carne', 'plato', 150, 8, 13, 7, [['Porción', 300]]),
  F('carbonara', 'Espaguetis carbonara', 'plato', 190, 8, 22, 8, [['Plato', 300]]),
  F('pollo-curry', 'Pollo al curry con arroz', 'plato', 150, 9, 18, 4.5, [['Plato', 400]]),
  F('albondigas', 'Albóndigas en salsa', 'plato', 190, 12, 7, 13, [['Ración', 200]]),
  F('ensalada-cesar', 'Ensalada César', 'plato', 150, 9, 6, 10, [['Plato', 250]]),
  F('gazpacho', 'Gazpacho', 'plato', 50, 1, 4, 3.5, [['Vaso', 250]]),
  F('empanadilla', 'Empanadilla / empanada', 'plato', 300, 8, 28, 17, [['Unidad', 60]]),
  F('pisto', 'Pisto', 'plato', 70, 1.5, 7, 4, [['Ración', 200]]),
  F('arroz-cubana', 'Arroz a la cubana', 'plato', 170, 5, 25, 6, [['Plato', 350]]),
  F('fabada', 'Fabada', 'plato', 150, 8, 12, 8, [['Plato', 350]]),

  // Cereales y legumbres extra
  F('pasta-integral', 'Pasta integral (cruda)', 'cereal', 350, 13, 64, 2.5, [['Ración', 90]]),
  F('arroz-basmati', 'Arroz basmati (crudo)', 'cereal', 350, 8, 77, 0.6, [['Ración', 80]]),
  F('noodles', 'Fideos instantáneos (ramen)', 'cereal', 450, 9, 60, 19, [['Paquete', 85]]),
  F('cereales-choco', 'Cereales de chocolate', 'cereal', 390, 8, 78, 4, [['Bol', 40]]),
  F('patata-asada', 'Patata asada / al horno', 'cereal', 93, 2.5, 21, 0.1, [['Mediana', 200]]),
  F('edamame', 'Edamame', 'legumbre', 121, 12, 9, 5, [['Ración', 100]]),
  F('soja-texturizada', 'Soja texturizada', 'legumbre', 350, 50, 14, 1, [['Ración', 50]]),

  // Fruta y verdura extra
  F('melon', 'Melón', 'fruta', 34, 0.8, 8, 0.2, [['Tajada', 200]]),
  F('sandia', 'Sandía', 'fruta', 30, 0.6, 7.6, 0.2, [['Tajada', 250]]),
  F('melocoton', 'Melocotón', 'fruta', 39, 0.9, 9.5, 0.3, [['Unidad', 150]]),
  F('mandarina', 'Mandarina', 'fruta', 53, 0.8, 13, 0.3, [['Unidad', 80]]),
  F('cerezas', 'Cerezas', 'fruta', 63, 1, 16, 0.2, [['Puñado', 100]]),
  F('frutos-rojos', 'Frutos rojos congelados', 'fruta', 45, 1, 9, 0.4, [['Puñado', 80]]),
  F('maiz', 'Maíz dulce', 'verdura', 77, 2.6, 15, 1.2, [['Lata pequeña', 140], ['Cucharada', 30]]),
  F('guisantes', 'Guisantes', 'verdura', 81, 5.4, 14, 0.4, [['Ración', 150]]),
  F('pepino', 'Pepino', 'verdura', 15, 0.7, 3.6, 0.1, [['Medio', 150]]),
  F('berenjena', 'Berenjena', 'verdura', 25, 1, 6, 0.2, [['Media', 150]]),
  F('aceitunas', 'Aceitunas', 'verdura', 145, 1, 4, 15, [['10 unidades', 40]]),
  F('pimiento-asado', 'Pimientos asados', 'verdura', 40, 1, 7, 1, [['Ración', 100]]),

  // Salsas y condimentos
  F('ketchup', 'Kétchup', 'salsa', 100, 1.2, 24, 0.2, [['Cucharada', 15]]),
  F('mostaza', 'Mostaza', 'salsa', 66, 4.4, 5.8, 4, [['Cucharadita', 10]]),
  F('salsa-bbq', 'Salsa barbacoa', 'salsa', 172, 0.8, 40, 0.6, [['Cucharada', 20]]),
  F('alioli', 'Alioli', 'salsa', 700, 1, 1, 77, [['Cucharada', 15]]),
  F('salsa-yogur', 'Salsa de yogur', 'salsa', 120, 2, 6, 10, [['Cucharada', 20]]),
  F('salsa-picante', 'Salsa picante', 'salsa', 60, 1, 10, 2, [['Cucharadita', 5]]),
  F('salsa-cesar', 'Salsa César', 'salsa', 480, 3, 4, 50, [['Cucharada', 20]]),
  F('salsa-burger', 'Salsa burger / especial', 'salsa', 400, 1, 12, 38, [['Cucharada', 20]]),
  F('guacamole', 'Guacamole', 'salsa', 155, 2, 8, 14, [['Ración', 50]]),
  F('salsa-soja', 'Salsa de soja', 'salsa', 53, 8, 4.9, 0.6, [['Cucharada', 15]]),
  F('pesto', 'Pesto', 'salsa', 450, 5, 5, 45, [['Cucharada', 30]]),
  F('vinagreta', 'Vinagre balsámico', 'salsa', 88, 0.5, 17, 0, [['Cucharada', 15]]),
  F('azucar', 'Azúcar', 'salsa', 400, 0, 100, 0, [['Sobre', 8], ['Cucharadita', 5]]),
  F('crema-cacao', 'Crema de cacao con avellanas', 'snack', 540, 6, 57, 31, [['Cucharada', 15]]),

  // Snacks
  F('patatas-chips', 'Patatas fritas de bolsa', 'snack', 536, 7, 53, 34, [['Bolsa pequeña', 40]]),
  F('nachos', 'Nachos (totopos)', 'snack', 489, 7.4, 62, 24, [['Puñado', 30]]),
  F('palomitas', 'Palomitas de microondas', 'snack', 500, 9, 57, 27, [['Media bolsa', 50]]),
  F('barrita-cereales', 'Barrita de cereales', 'snack', 400, 6, 70, 11, [['Unidad', 25]]),
  F('chocolate-blanco', 'Chocolate blanco', 'snack', 540, 6, 59, 32, [['2 onzas', 20]]),
  F('gominolas', 'Gominolas', 'snack', 340, 6, 78, 0, [['Puñado', 50]]),
  F('galletas-choco', 'Galletas con chocolate', 'snack', 490, 6, 65, 23, [['3 galletas', 35]]),

  // Bebidas
  F('cafe-solo', 'Café solo', 'bebida', 2, 0.1, 0, 0, [['Taza', 50]]),
  F('refresco-zero', 'Refresco zero', 'bebida', 1, 0, 0, 0, [['Lata', 330]]),
  F('bebida-energetica', 'Bebida energética', 'bebida', 45, 0, 11, 0, [['Lata', 250]]),
  F('vino', 'Vino', 'bebida', 83, 0, 2.6, 0, [['Copa', 150]]),
  F('zumo-envasado', 'Zumo envasado', 'bebida', 48, 0.4, 11, 0.1, [['Vaso', 200]]),
  F('batido-proteina-rtd', 'Batido de proteína listo para beber', 'bebida', 60, 7.5, 4.5, 1.2, [['Botella', 330]]),
  F('cerveza-sin', 'Cerveza sin alcohol', 'bebida', 22, 0.4, 4.8, 0, [['Tercio', 330]]),
);

// Pescados y frutos secos en sus propias categorías
const PESCADO = ['salmon', 'atun-natural', 'atun-aceite', 'merluza', 'gambas', 'sardinas-lata', 'atun-fresco', 'bacalao', 'dorada', 'salmon-ahumado', 'calamares', 'mejillones', 'surimi'];
const FRUTOSECO = ['crema-cacahuete', 'almendras', 'nueces', 'cacahuetes', 'anacardos'];
for (const f of FOODS) { if (PESCADO.includes(f.id)) f.cat = 'pescado'; if (FRUTOSECO.includes(f.id)) f.cat = 'frutoseco'; }

// Ampliación con los grupos de BEDCA (sin duplicar nombres)
import { FOODS_ES } from './foods-es.js';
{
  const key = n => n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const names = new Set(FOODS.map(f => key(f.name)));
  for (const f of FOODS_ES) if (!names.has(key(f.name))) { FOODS.push(f); names.add(key(f.name)); }
}
