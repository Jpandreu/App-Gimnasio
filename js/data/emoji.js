// Emoticono para cada alimento según su nombre (primera regla que coincide) o su categoría.
const RULES = [
  [/flan/, '🍮'], [/queso|mozzarella|ricotta|mascarpone|reques[óo]n|feta|brie|parmesano|emmental|gouda|cheddar/, '🧀'],
  [/huevo|clara|yema|revuelto|tortilla francesa/, '🥚'],
  [/hamburgues/, '🍔'], [/pizza|calzone/, '🍕'], [/patatas fritas|patatas gajo|patatas onduladas|patatas chips|patatas deluxe/, '🍟'],
  [/kebab|d[üu]r[üu]m|falafel|pita/, '🥙'], [/burrito|wrap|quesadilla/, '🌯'], [/taco|nachos|totopos/, '🌮'], [/perrito|hot dog|salchicha|frankfurt|butifarra/, '🌭'],
  [/s[áa]ndwich|bocadillo|montadito|pepito|bagel|bao/, '🥪'], [/sushi|poke/, '🍣'], [/gyoza|empanad|dumpling/, '🥟'], [/rollito/, '🥠'],
  [/paella|arroz negro|arroz a banda|fideu|arroz caldoso|arroz con pollo|arroz a la cubana/, '🥘'], [/curry|pad thai|ramen|noodles|fideos de arroz|fideos instant/, '🍜'],
  [/lasa|canelon|macarron|espagueti|carbonara|pasta|tortellini|[ñn]oquis|fideos|cusc[úu]s|bulgur/, '🍝'],
  [/sopa|^cocido|potaje|fabada|caldo|crema de verduras|gazpacho|salmorejo|marmitako|callos|estofad|rabo/, '🍲'],
  [/ensalad|mezclum|can[óo]nigos|r[úu]cula/, '🥗'], [/tortilla de patatas|tortilla de patatas con|pincho de tortilla/, '🍳'],
  [/pollo|pavo|alitas|nuggets|pato|codorniz|contramuslo/, '🍗'],
  [/jam[óo]n|bacon|beicon|panceta|chorizo|salchich[óo]n|fuet|salami|lomo embuchado|mortadela|sobrasada|morcilla|cecina|cortezas/, '🥓'],
  [/ternera|entrecot|chulet|carne|solomillo|cordero|cerdo|secreto|costillas|cochinillo|conejo|ciervo|h[íi]gado|oreja|pinchos morunos|flamenqu|san jacobo|carpaccio/, '🥩'],
  [/gamba|langostino|bogavante|langosta|cigala/, '🦐'], [/pulpo/, '🐙'], [/calamar|sepia|chipir[óo]n|gulas/, '🦑'], [/cangrejo|centollo|surimi/, '🦀'],
  [/mejill[óo]n|almeja|berberecho|navaja|ostra/, '🦪'],
  [/salm[óo]n|at[úu]n|bonito|merluza|bacalao|dorada|lubina|sardina|boquer|caballa|jurel|trucha|emperador|pez espada|lenguado|rape|gallo|pescadilla|panga|tilapia|anchoa|huevas|palometa|pesca[íi]to|pescado/, '🐟'],
  [/leche|bebida de (soja|avena|almendra|arroz)|k[ée]fir|batido|horchata/, '🥛'],
  [/yogur|skyr|cuajada|natillas|flan|arroz con leche/, '🥣'], [/mantequilla|margarina|ghee|manteca/, '🧈'], [/nata/, '🥛'], [/helado|polo/, '🍨'],
  [/cruas[áa]n|croissant/, '🥐'], [/baguette|barra|chapata|picos|colines|pan rallado/, '🥖'], [/pan|biscote|tostada|migas|torrija/, '🍞'],
  [/tortitas americanas|pancake|gofre|crep/, '🥞'], [/d[óo]nut|berlina/, '🍩'], [/galleta|cookie|crackers|pretzel/, '🍪'],
  [/tarta|bizcocho|brownie|muffin|magdalena|ensaimada|palmera|napolitana|churro/, '🍰'],
  [/chocolate|cacao|bomb[óo]n|nutella/, '🍫'], [/caramelo|gominola|regaliz|chuche|az[úu]car|panela|turr[óo]n|mazap[áa]n|polvor[óo]n/, '🍬'],
  [/miel|sirope|mermelada|dulce de leche/, '🍯'], [/palomitas/, '🍿'], [/avena|muesli|granola|cereal|salvado|porridge|copos/, '🥣'],
  [/arroz|quinoa|mijo|sarraceno/, '🍚'], [/ma[íi]z|kikos/, '🌽'],
  [/boniato|yuca/, '🍠'], [/patata|pur[ée]/, '🥔'],
  [/lenteja|garbanzo|alubia|jud[íi]as blancas|frijol|guisantes secos|habas|altramuces|soja|edamame|tempeh|seit[áa]n|heura|hummus|tofu/, '🫘'],
  [/cacahuete/, '🥜'], [/almendra|nuez|nueces|avellana|pistacho|anacardo|pi[ñn]on|macadamia|frutos secos|pipas|semillas|ch[íi]a|lino|s[ée]samo|tahini|casta[ñn]a/, '🌰'],
  [/aguacate|guacamole/, '🥑'], [/aceite|aceituna/, '🫒'],
  [/pl[áa]tano/, '🍌'], [/manzana|compota/, '🍎'], [/pera/, '🍐'], [/naranja|mandarina|pomelo/, '🍊'], [/lim[óo]n|limonada/, '🍋'],
  [/uva|pasas/, '🍇'], [/fresa/, '🍓'], [/ar[áa]ndano|frutos rojos|frambuesa|mora/, '🫐'], [/cereza/, '🍒'],
  [/melocot[óo]n|nectarina|albaricoque|orej[óo]n|paraguayo/, '🍑'], [/mango|papaya|maracuy/, '🥭'], [/pi[ñn]a/, '🍍'], [/kiwi/, '🥝'],
  [/sand[íi]a/, '🍉'], [/mel[óo]n/, '🍈'], [/coco/, '🥥'], [/d[áa]til|higo|ciruela|caqui|chirimoya|granada|lichi|macedonia|smoothie/, '🍑'],
  [/br[óo]coli|coliflor|coles|col |col\/|kale|lombarda/, '🥦'], [/lechuga|espinaca|acelga|endivia|brotes/, '🥬'], [/tomate|ketchup|k[ée]tchup|salsa brava|romesco/, '🍅'],
  [/pimiento|padr[óo]n/, '🫑'], [/pepino|pepinillo|calabac[íi]n/, '🥒'], [/berenjena|escalivada|musaka/, '🍆'], [/zanahoria/, '🥕'],
  [/cebolla|puerro/, '🧅'], [/ajo/, '🧄'], [/champi|seta/, '🍄'], [/calabaza/, '🎃'],
  [/esp[áa]rrago|alcachofa|jud[íi]as verdes|guisantes|apio|r[áa]bano|nabo|remolacha|menestra|verdura|pisto|alcaparra/, '🥬'],
  [/caf[ée]|capuchino|frapp/, '☕'], [/t[ée] |t[ée]\/|infusi|kombucha/, '🍵'], [/cerveza|clara \(/, '🍺'], [/vino|cava|champ[áa]n|sangr[íi]a|tinto|vermut/, '🍷'],
  [/gin|cubata|licor|chupito/, '🍸'], [/zumo|n[ée]ctar/, '🧃'], [/refresco|isot[óo]nica|energ[ée]tica|t[ée] fr[íi]o/, '🥤'], [/agua/, '💧'],
  [/whey|case[íi]na|prote[íi]na|gainer|ganador|barrita/, '💪'], [/sal$|pastilla de caldo/, '🧂'],
  [/mayonesa|alioli|salsa|mostaza|vinagre|pesto|bechamel|mojo|tzatziki/, '🥫'],
];

const CAT = {
  proteina: '🍗', pescado: '🐟', lacteo: '🥛', cereal: '🍚', legumbre: '🫘', fruta: '🍎', verdura: '🥬', grasa: '🫒', frutoseco: '🌰',
  suplemento: '💪', plato: '🍽️', rapida: '🍔', panaderia: '🥐', salsa: '🥫', snack: '🍬', bebida: '🥤', mios: '⭐', receta: '👨‍🍳',
};
export const CAT_EMOJI = CAT;

const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const NRULES = RULES.map(([r, e]) => [new RegExp(norm(r.source)), e]);

export function foodEmoji(f) {
  if (!f) return '🍽️';
  if (f.e) return f.e;
  const n = norm(f.name);
  const hit = NRULES.find(([r]) => r.test(n));
  f.e = hit ? hit[1] : (f.recipe ? '👨‍🍳' : CAT[f.cat] || '🍽️');
  return f.e;
}

export const MEAL_EMOJI = { desayuno: '☕', almuerzo: '🍎', comida: '🍽️', merienda: '🥪', cena: '🌙', extra: '➕' };
export const DISH_EMOJI = { hamburguesa: '🍔', pizza: '🍕', bocadillo: '🥪', tostadas: '🍞', huevos: '🍳', ensalada: '🥗', pasta: '🍝', arroz: '🍚', kebab: '🥙', burrito: '🌯', poke: '🍣', porridge: '🥣', batido: '🥤', cafe: '☕' };
