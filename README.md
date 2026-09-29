# Forja · Gimnasio y nutrición

App personal para el móvil para **ganar masa muscular**: rutinas, registro de pesos en el gimnasio, calorías y macros, plan de comidas y seguimiento del progreso.

Es una **PWA** (aplicación web instalable): se instala en la pantalla de inicio, funciona sin conexión y guarda los datos en el propio teléfono. No necesita servidor ni cuenta.

## Qué hace

**Entrenamiento**
- **Mi gimnasio**: marca las máquinas y el material de tu gimnasio (27 elementos, con plantillas "completo", "básico" y "en casa"). Las rutinas solo usan ejercicios que puedes hacer y, si falta algo, lo sustituyen por el equivalente más parecido (mismo patrón de movimiento y material similar).
- **Planificador**: eliges qué días de la semana vas (2 a 6), cuánto dura cada sesión (45-90 min), tu experiencia y hasta dos músculos a priorizar.
- **Estilo de rutina**: *Recomendado* (cada músculo 2 veces por semana), *Push/Pull/Legs* o *Por grupo muscular*. En este último eliges cuántos días del ciclo dedicas a pecho, espalda, pierna, hombro y brazos. La app propone un reparto según tus días, integra bíceps y tríceps con espalda y pecho si no hay día de brazos y avisa si un grupo se entrena menos de 2 veces por semana.
- La vista previa muestra las series semanales por músculo frente a la zona óptima (10-20), y el generador limita el volumen para no pasarse. La app genera el programa con vista previa: Full body (2-3 días), Torso/Pierna (4), Torso/Pierna + PPL (5) o Push/Pull/Legs (6).
- **Plan de abdominales**: bloque de ~10 min al final de 2, 3 o todos los entrenos, rotando 3 variantes. Prioridad para tantos músculos como quieras (incluidos abdomen, glúteo y gemelos).
- **Cardio**: caminar, correr, cinta, bici, elíptica, natación, senderismo, remo, comba, HIIT… Registro manual o en directo con cronómetro y GPS (con la app abierta). Km por semana con objetivo, ritmo, récords, historial y calorías gastadas, que se suman a tu objetivo del día.
- La pantalla Hoy sabe si te toca entrenar o descansar, y la semana marca tus días planificados.
- Crea y edita rutinas: series, rango de repeticiones y descanso por ejercicio.
- Biblioteca de 76 ejercicios con indicaciones técnicas, filtro "solo mi gimnasio" y ejercicios propios. Al cambiar un ejercicio durante el entreno te propone alternativas.
- Registro del entreno en directo: kg y repeticiones por serie, la marca de la última vez y series de calentamiento.
- **Coach de progresión (doble progresión)**: cuando llegas al tope del rango en todas las series te dice cuánto peso subir; si no, te pide una repetición más.
- Temporizador de descanso automático con sonido y vibración. La pantalla no se apaga durante el entreno.
- Récords personales (1RM estimado con la fórmula de Epley), historial completo y opción de repetir un entreno.

**Nutrición**
- Objetivo de calorías con Mifflin-St Jeor × actividad + superávit. Proteína a 2 g/kg, grasa al 25 % y el resto hidratos.
- **Objetivos**: ganar masa, volumen limpio, mantener, definir (déficit moderado, proteína alta) y bajar peso (déficit ~20 %, 0,5-1 kg/semana), con aviso según tu IMC.
- Diario por comidas con **1.115 alimentos** con emoticono: cocina regional española, latinoamericana (arepas, empanadas, tamales, pupusas…) e internacional, embutidos, comida rápida y productos de supermercado, además de organizados según los grupos de la Base de Datos Española de Composición de Alimentos (BEDCA): lácteos, huevos, carnes, embutidos, pescados y mariscos, cereales, legumbres, frutos secos, verduras, frutas, grasas, dulces, bebidas, platos tradicionales y comida rápida. La búsqueda entiende sinónimos de España y Latinoamérica (papa/patata, frijol/alubia, palta/aguacate…). Si algo no está, se busca en **Open Food Facts** (millones de productos reales) o por código de barras, y se guarda en tus alimentos. Se muestran las kcal por ración habitual y se pueden elegir ½, 1, 1½, 2 o 3 raciones.
- **Platos personalizables** (14): hamburguesa, pizza, bocadillo, tostadas, huevos, ensalada, pasta, arroz, kebab, burrito, poke, porridge, batido y café. Eliges pan, carne, queso, extras, salsas, acompañamiento y bebida, y las calorías se calculan con cada ingrediente. Se pueden volver a editar después.
- **Mis comidas**: guarda una comida entera (p. ej. tu desayuno habitual) y añádela con un toque. Cada comida del diario tiene un menú para copiarla de ayer, guardarla o vaciarla.
- **Recetas propias** por ingredientes y raciones, alimentos propios con los datos de la etiqueta, **favoritos** y añadido rápido de kcal.
- Tres días tipo de comidas que se ajustan automáticamente a tus calorías y macros; cada comida se añade al diario con un toque.
- **Suplementos**: añade los que tomas (creatina, proteína, cafeína, vitamina D, omega-3…) con dosis, momento y frecuencia. Se marcan cada día desde Hoy, con racha y constancia de las últimas semanas. La proteína en polvo se suma sola al diario de comidas, y el coach tiene en cuenta el agua que retiene la creatina las primeras semanas. Incluye qué funciona según la evidencia y qué no merece la pena.
- Registro de agua y guía de nutrición para ganar volumen: cómo comer más si te cuesta, el entreno y los suplementos útiles.

**Progreso**
- Peso corporal con gráfica y tendencia semanal (regresión de 4 semanas).
- **Ajuste automático de calorías**: si no subes al ritmo objetivo (0,25-0,5 kg/semana) te propone sumar 150 kcal, y restarlas si subes demasiado rápido.
- Medidas corporales, evolución de fuerza por ejercicio, entrenos y volumen por semana, y series por músculo frente a la zona óptima (10-20 semanales).

**Datos**
- Todo se guarda en el dispositivo (localStorage). Desde Perfil puedes exportar o importar una copia de seguridad en JSON.

## Instalar en el móvil

1. Publica la app (ver abajo) y abre la URL en el móvil.
2. **iPhone (Safari)**: botón Compartir → *Añadir a pantalla de inicio*.
3. **Android (Chrome)**: menú ⋮ → *Instalar aplicación* o *Añadir a pantalla de inicio*.

### Publicar con GitHub Pages

El repositorio incluye un workflow (`.github/workflows/pages.yml`) que publica la app en cada push a `main`.

1. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Haz push a `main` (o lanza el workflow a mano desde la pestaña *Actions*).
3. La app quedará en `https://<tu-usuario>.github.io/App-Gimnasio/`.

> En cuentas gratuitas, GitHub Pages requiere que el repositorio sea público. Si lo quieres privado, sirve igual en Netlify, Vercel o Cloudflare Pages arrastrando la carpeta.

### Probar en local

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Estructura

```
index.html              Entrada de la app
manifest.webmanifest    Manifiesto PWA
sw.js                   Service worker (modo sin conexión)
css/                    Estilos y fuentes
js/app.js               Shell: navegación, render y eventos
js/core.js              Estado, guardado y utilidades
js/coach.js             Lógica de entrenador y nutricionista
js/ui.js                Iconos y gráficas SVG
js/data/                Ejercicios, material de gimnasio, alimentos, programas y planes de comidas
js/views/               Pantallas: Hoy, Entrenar, Entreno en curso, Mi gimnasio, Nutrición, Progreso y Perfil
```

Sin dependencias ni paso de compilación: HTML, CSS y JavaScript (módulos ES).

---

Recomendaciones generales para adultos sanos; no sustituye el consejo de un profesional sanitario.
