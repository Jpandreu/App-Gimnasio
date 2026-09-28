import { S, ui, A, IN, SHEETS, render, commit, save, esc, num, round, fmtNum, dayKey, openSheet, closeSheet, confirmBox, toast, replaceState, resetState } from '../core.js';
import { targets, ACTIVITY, GOALS, EXPERIENCE, generateProgram, currentWeight } from '../coach.js';
import { GYM_PRESETS, DEFAULT_WEEKDAYS } from '../data/equipment.js';
import { equipPicker, toggleEquip, weekdayPick, toggleDay, daysLabel, timePick, focusPick, toggleFocus, programPreview } from './gym.js';
import { icon } from '../ui.js';

const draftDefault = () => ({ name: '', sex: 'm', age: 25, weight: 65, height: 180, activity: 1.55, goal: 'volumen', days: 4, exp: 'novato', weekdays: [...DEFAULT_WEEKDAYS[4]], sessionMin: 60, focus: [] });

// ---------- Formulario compartido ----------
function fields(d) {
  return `
  <div class="field-row">
    <div class="field"><span>Sexo</span>
      <div class="seg sm">${[['m', 'Hombre'], ['f', 'Mujer']].map(([v, l]) => `<button type="button" class="${d.sex === v ? 'on' : ''}" data-a="draftSet" data-k="sex" data-v="${v}">${l}</button>`).join('')}</div>
    </div>
    <label class="field"><span>Edad</span><input id="f-age" type="number" inputmode="numeric" min="14" max="90" value="${d.age}" data-in="draft" data-k="age"></label>
  </div>
  <div class="field-row">
    <label class="field"><span>Peso (kg)</span><input id="f-weight" type="number" inputmode="decimal" step="0.1" value="${d.weight}" data-in="draft" data-k="weight"></label>
    <label class="field"><span>Altura (cm)</span><input id="f-height" type="number" inputmode="numeric" value="${d.height}" data-in="draft" data-k="height"></label>
  </div>`;
}

function activityPick(d) {
  return `<div class="opts">${ACTIVITY.map(a => `
    <button type="button" class="opt ${d.activity === a.v ? 'on' : ''}" data-a="draftSet" data-k="activity" data-v="${a.v}" data-num="1">
      <b>${a.label}</b><span>${a.desc}</span></button>`).join('')}</div>`;
}
function goalPick(d) {
  return `<div class="opts">${Object.entries(GOALS).map(([k, g]) => `
    <button type="button" class="opt ${d.goal === k ? 'on' : ''}" data-a="draftSet" data-k="goal" data-v="${k}">
      <b>${g.label}</b><span>${g.desc}</span></button>`).join('')}</div>`;
}
A.obDay = (el) => { ui.ob.weekdays = toggleDay(ui.ob.weekdays, num(el.dataset.v)); render(); };
A.obTime = (el) => { ui.ob.sessionMin = num(el.dataset.v); render(); };
A.obFocus = (el) => { ui.ob.focus = toggleFocus(ui.ob.focus, el.dataset.v); render(); };
A.obEquip = (el) => { ui.obEquip = toggleEquip(ui.obEquip, el); render(); };

IN.draft = (el) => { ui.ob[el.dataset.k] = num(el.value); };
A.draftSet = (el) => { ui.ob[el.dataset.k] = el.dataset.num ? num(el.dataset.v) : el.dataset.v; render(); };

// ---------- Onboarding ----------
export function onboarding() {
  if (!ui.ob) ui.ob = draftDefault();
  if (!ui.obEquip) ui.obEquip = [...GYM_PRESETS.completo.equip];
  const d = ui.ob, step = ui.obStep || 0;
  const steps = [
    () => `<div class="ob-hero">
        <div class="brand-mark">${icon('dumbbell')}</div>
        <h1 class="display">Forja</h1>
        <p class="lead">Tu entrenador y nutricionista de bolsillo. Rutinas, registro de pesos, calorías y progreso en una sola app.</p>
        <ul class="ob-list">
          <li>${icon('dumbbell')}<span>Programa de entreno adaptado a tus días</span></li>
          <li>${icon('bolt')}<span>Te dice cuánto peso poner en cada serie</span></li>
          <li>${icon('bowl')}<span>Calorías y macros calculados para ganar masa</span></li>
          <li>${icon('chart')}<span>Ajusta tu dieta según cómo evoluciona tu peso</span></li>
        </ul>
        <label class="field"><span>¿Cómo te llamas?</span><input id="f-name" type="text" autocomplete="given-name" placeholder="Tu nombre" value="${esc(d.name)}" data-in="draftText" data-k="name"></label>
      </div>`,
    () => `<h2 class="ob-t">Tus datos</h2><p class="ob-s">Con ellos calculo tu gasto calórico con la fórmula Mifflin-St Jeor.</p>${fields(d)}`,
    () => `<h2 class="ob-t">Actividad diaria</h2><p class="ob-s">Incluye el entreno y lo que te mueves fuera del gimnasio.</p>${activityPick(d)}`,
    () => `<h2 class="ob-t">Objetivo</h2><p class="ob-s">Para ganar masa muscular necesitas comer por encima de lo que gastas.</p>${goalPick(d)}`,
    () => `<h2 class="ob-t">Entrenamiento</h2><p class="ob-s">¿Qué días de la semana vas a ir al gimnasio?</p>
      ${weekdayPick(d.weekdays, 'obDay')}<p class="hint">${daysLabel(d.weekdays)}</p>
      <h3 class="label mt">Tiempo por sesión</h3>${timePick(d.sessionMin, 'obTime')}
      <h3 class="label mt">Experiencia</h3>
      <div class="seg sm">${Object.entries(EXPERIENCE).map(([k, l]) => `<button type="button" class="${d.exp === k ? 'on' : ''}" data-a="draftSet" data-k="exp" data-v="${k}">${l}</button>`).join('')}</div>
      <h3 class="label mt">Músculos a priorizar (opcional)</h3>${focusPick(d.focus, 'obFocus')}`,
    () => `<h2 class="ob-t">Tu gimnasio</h2><p class="ob-s">Marca las máquinas y el material que tienes. Tus rutinas solo usarán ejercicios que puedas hacer.</p>
      ${equipPicker(ui.obEquip, 'obEquip')}`,
    () => {
      const t = targets({ ...d, kcalAdjust: 0 });
      return `<h2 class="ob-t">Tu plan</h2><p class="ob-s">Esto es lo que necesitas cada día para ${GOALS[d.goal].label.toLowerCase()}.</p>
      <div class="card plan-sum">
        <div class="big-kcal"><span class="display">${t.kcal.toLocaleString('es-ES')}</span><small>kcal al día</small></div>
        <div class="mac3">
          <div class="m-p"><b>${t.p} g</b><span>Proteína</span></div>
          <div class="m-c"><b>${t.c} g</b><span>Hidratos</span></div>
          <div class="m-f"><b>${t.f} g</b><span>Grasa</span></div>
        </div>
        ${calcExplain(t)}
      </div>
      <h3 class="section-t">Tu programa</h3>
      ${programPreview(d, ui.obEquip)}`;
    },
  ];
  const last = steps.length - 1;
  return `<div class="ob">
    <div class="ob-top">${step > 0 ? `<button class="icon-btn" data-a="obBack" aria-label="Atrás">${icon('left')}</button>` : '<span></span>'}
      <div class="dots">${steps.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div><span></span></div>
    <div class="ob-body" data-scroll="ob-${step}">${steps[step]()}</div>
    <div class="ob-foot"><button class="btn primary block" data-a="${step === last ? 'obFinish' : 'obNext'}" ${step === 4 && (d.weekdays.length < 2 || d.weekdays.length > 6) ? 'disabled' : ''}>${step === 0 ? 'Empezar' : step === last ? 'Crear mi plan' : 'Continuar'}</button></div>
  </div>`;
}
IN.draftText = (el) => { ui.ob[el.dataset.k] = el.value; };
A.obNext = () => { ui.obStep = (ui.obStep || 0) + 1; render(); };
A.obBack = () => { ui.obStep = Math.max(0, (ui.obStep || 0) - 1); render(); };
A.obFinish = () => {
  const d = ui.ob;
  S.profile = { ...d, days: d.weekdays.length, kcalAdjust: 0, startWeight: d.weight, createdAt: Date.now() };
  S.weights = [{ d: dayKey(), kg: d.weight }];
  S.gym = { equip: [...ui.obEquip] };
  const prog = generateProgram(d, new Set(ui.obEquip));
  S.programName = prog.name; S.routines = prog.routines;
  ui.ob = null; ui.obEquip = null; ui.obStep = 0; ui.tab = 'hoy';
  save(true); render();
  toast('Plan creado. ¡A por ello!');
};

export function calcExplain(t) {
  return `<div class="calc">
    <div><span>Metabolismo basal</span><b>${t.bmr.toLocaleString('es-ES')}</b></div>
    <div><span>Gasto diario con actividad</span><b>${t.tdee.toLocaleString('es-ES')}</b></div>
    <div><span>${t.surplus >= 0 ? 'Superávit' : 'Déficit'}</span><b>${t.surplus >= 0 ? '+' : ''}${t.surplus}</b></div>
    <div class="calc-tot"><span>Objetivo</span><b>${t.kcal.toLocaleString('es-ES')} kcal</b></div>
  </div>`;
}

// ---------- Perfil ----------
export function profileView() {
  const p = S.profile, t = targets();
  const w = currentWeight(), bmi = w / (p.height / 100) ** 2;
  const gained = w - (p.startWeight || w);
  return `<div class="screen" data-scroll="perfil">
    <header class="top"><h1 class="title">Perfil</h1></header>
    <section class="card profile-head">
      <div class="avatar">${esc((p.name || 'F').trim().charAt(0).toUpperCase() || 'F')}</div>
      <div class="grow"><h2>${esc(p.name || 'Atleta')}</h2><p class="muted">${p.age} años · ${p.height} cm · ${GOALS[p.goal].label}</p></div>
      <button class="icon-btn" data-a="editProfile" aria-label="Editar perfil">${icon('edit')}</button>
    </section>
    <section class="stats3">
      <div class="stat"><span class="label">Peso</span><b class="num">${fmtNum(w, 1)}</b><small>kg</small></div>
      <div class="stat"><span class="label">IMC</span><b class="num">${fmtNum(bmi, 1)}</b><small>${bmi < 18.5 ? 'bajo' : bmi < 25 ? 'normal' : bmi < 30 ? 'sobrepeso' : 'obesidad'}</small></div>
      <div class="stat"><span class="label">Desde el inicio</span><b class="num ${gained >= 0 ? 'pos' : ''}">${gained >= 0 ? '+' : ''}${fmtNum(gained, 1)}</b><small>kg</small></div>
    </section>

    <h3 class="section-t">Objetivos diarios</h3>
    <section class="card">
      <div class="mac4">
        <div><b class="num">${t.kcal.toLocaleString('es-ES')}</b><span>kcal</span></div>
        <div class="m-p"><b class="num">${t.p}</b><span>proteína g</span></div>
        <div class="m-c"><b class="num">${t.c}</b><span>hidratos g</span></div>
        <div class="m-f"><b class="num">${t.f}</b><span>grasa g</span></div>
      </div>
      ${calcExplain(t)}
      <div class="adjust">
        <div><b>Ajuste manual</b><p class="muted sm">Si no subes de peso en 2 semanas, suma calorías.</p></div>
        <div class="stepper">
          <button data-a="kcalAdj" data-v="-50" aria-label="Restar 50 kcal">${icon('minus')}</button>
          <span class="num">${(p.kcalAdjust || 0) >= 0 ? '+' : ''}${p.kcalAdjust || 0}</span>
          <button data-a="kcalAdj" data-v="50" aria-label="Sumar 50 kcal">${icon('plus')}</button>
        </div>
      </div>
      <p class="hint">Proteína a ${round(t.p / t.weight, 1)} g/kg, grasa al 25% de las calorías y el resto hidratos. Agua recomendada: ${fmtNum(t.water / 1000, 2)} L.</p>
    </section>

    <h3 class="section-t">Entrenamiento</h3>
    <section class="card list">
      <button class="row" data-a="openGym">${icon('dumbbell')}<span class="grow"><b>Mi gimnasio</b><small>${S.gym?.equip?.length ?? 'Todo el'} ${S.gym ? 'elementos de material' : 'material'}</small></span>${icon('right', 'dim')}</button>
      <button class="row" data-a="openPlanner">${icon('calendar')}<span class="grow"><b>Días, duración y prioridades</b><small>${(p.weekdays || []).length || p.days} días por semana · ${p.sessionMin || 60} min</small></span>${icon('right', 'dim')}</button>
      ${toggle('autoRest', 'Temporizador de descanso automático', 'Empieza al marcar una serie')}
      ${toggle('sound', 'Sonido al terminar el descanso', '')}
      ${toggle('vibrate', 'Vibración', 'Solo en Android')}
    </section>

    <h3 class="section-t">Tus datos</h3>
    <section class="card list">
      <button class="row" data-a="exportData">${icon('download')}<span class="grow">Exportar copia de seguridad</span>${icon('right', 'dim')}</button>
      <button class="row" data-a="importData">${icon('upload')}<span class="grow">Importar copia de seguridad</span>${icon('right', 'dim')}</button>
      <button class="row danger" data-a="resetAll">${icon('trash')}<span class="grow">Borrar todos los datos</span></button>
    </section>
    <p class="foot-note">Los datos se guardan solo en este dispositivo. Exporta una copia de vez en cuando.<br>Forja no sustituye el consejo de un profesional sanitario.</p>
  </div>`;
}

const toggle = (k, t, s) => `<label class="row toggle"><span class="grow"><b>${t}</b>${s ? `<small>${s}</small>` : ''}</span>
  <input type="checkbox" id="set-${k}" role="switch" ${S.settings[k] ? 'checked' : ''} data-in="setting" data-k="${k}"><i class="sw"></i></label>`;

IN.setting = (el) => { S.settings[el.dataset.k] = el.checked; save(); };
A.kcalAdj = (el) => { S.profile.kcalAdjust = (S.profile.kcalAdjust || 0) + num(el.dataset.v); commit(); };

A.editProfile = () => { ui.ob = { ...S.profile }; openSheet('editProfile'); };
SHEETS.editProfile = () => {
  const d = ui.ob;
  return {
    title: 'Editar perfil',
    body: `<label class="field"><span>Nombre</span><input id="p-name" type="text" value="${esc(d.name)}" data-in="draftText" data-k="name"></label>
      ${fields(d)}
      <h3 class="label mt">Actividad</h3>${activityPick(d)}
      <h3 class="label mt">Objetivo</h3>${goalPick(d)}`,
    foot: `<button class="btn primary block" data-a="saveProfile">Guardar</button>`,
  };
};
A.saveProfile = () => {
  const d = ui.ob;
  const weightChanged = d.weight !== S.profile.weight;
  S.profile = { ...S.profile, ...d };
  if (weightChanged) {
    const k = dayKey();
    S.weights = S.weights.filter(w => w.d !== k).concat({ d: k, kg: d.weight });
  }
  ui.ob = null; closeSheet(); commit(); toast('Perfil actualizado');
};

// ---------- Copias de seguridad ----------
A.exportData = () => openSheet('export');
SHEETS.export = () => {
  const json = JSON.stringify({ ...S, active: null });
  return {
    title: 'Exportar datos',
    body: `<p class="muted">Guarda este texto en tus notas o en un archivo. Para restaurarlo, usa "Importar".</p>
      <textarea id="export-json" class="code" readonly rows="8">${esc(json)}</textarea>
      <p class="hint">${(json.length / 1024).toFixed(1)} KB · ${S.sessions.length} entrenos · ${Object.keys(S.log).length} días de comidas</p>`,
    foot: `<div class="btn-row"><button class="btn" data-a="downloadData">${icon('download')} Descargar</button><button class="btn primary" data-a="copyData">${icon('copy')} Copiar</button></div>`,
  };
};
A.copyData = async () => {
  const ta = document.getElementById('export-json');
  try { await navigator.clipboard.writeText(ta.value); toast('Copiado al portapapeles'); }
  catch { ta.select(); toast('Selecciona y copia el texto'); }
};
A.downloadData = () => {
  try {
    const blob = new Blob([JSON.stringify({ ...S, active: null }, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `forja-${dayKey()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  } catch { toast('No se pudo descargar. Usa "Copiar".'); }
};
A.importData = () => openSheet('import');
SHEETS.import = () => ({
  title: 'Importar datos',
  body: `<p class="muted">Pega el texto exportado o elige el archivo .json. Reemplazará los datos actuales.</p>
    <textarea id="import-json" class="code" rows="7" placeholder='{"v":1,...}'></textarea>
    <label class="btn block ghost file-btn">${icon('upload')} Elegir archivo<input id="import-file" type="file" accept="application/json,.json" data-in="importFile"></label>`,
  foot: `<button class="btn primary block" data-a="doImport">Importar</button>`,
});
IN.importFile = (el) => {
  const f = el.files?.[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { document.getElementById('import-json').value = r.result; };
  r.readAsText(f);
};
A.doImport = () => {
  try {
    const data = JSON.parse(document.getElementById('import-json').value);
    if (!data || typeof data !== 'object' || !('sessions' in data)) throw new Error();
    replaceState(data);
    ui.sheets = []; render(); toast('Datos importados');
  } catch { toast('El texto no es una copia válida de Forja'); }
};
A.resetAll = () => confirmBox({
  title: '¿Borrar todos los datos?', text: 'Se eliminarán perfil, rutinas, entrenos, comidas y pesos. No se puede deshacer.',
  ok: 'Borrar todo', danger: true,
  onOk: () => { resetState(); ui.tab = 'hoy'; ui.obStep = 0; ui.ob = null; render(); },
});
