import {
  IMPACT_OPTIONS,
  PRIORITY_OPTIONS,
  SCREENS,
  SCREEN_COUNT,
} from "./content.js";
import {
  clearDraft,
  createDraft,
  createReferral,
  isLowExperience,
  loadDraft,
  saveDraft,
  togglePriority,
  validateScreen,
} from "./model.js";

let draft = loadDraft();
let errors = {};
let lastScreen = draft.currentScreen;
let transitionDirection = "forward";
let toastTimer = null;

const stage = document.querySelector("#stage");
const nav = document.querySelector("#app-nav");
const previousButton = document.querySelector("#previous-button");
const nextButton = document.querySelector("#next-button");
const currentNumber = document.querySelector("#current-number");
const progressFill = document.querySelector("#progress-fill");
const progressSteps = [...document.querySelectorAll("#progress-steps button")];
const sectionLabel = document.querySelector("#section-label");
const navStatus = document.querySelector("#nav-status");
const toast = document.querySelector("#toast");
const modalLayer = document.querySelector("#modal-layer");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setPath(object, path, value) {
  const parts = path.split(".");
  const finalKey = parts.pop();
  const target = parts.reduce((current, key) => current[key], object);
  target[finalKey] = value;
}

function errorText(key) {
  return errors[key]
    ? `<p class="field-error" role="alert"><span aria-hidden="true">!</span>${escapeHtml(errors[key])}</p>`
    : "";
}

function formatTitle(index, title) {
  const titles = [
    "¿NO QUE NO<br>SE <span>PODIA</span>?",
    "CON WIZARD<br><span>TODO SE PUEDE.</span>",
    "A VER,<br><span>SIN FILTRO.</span>",
    "¿YA SON DEL<br><span>MISMO EQUIPO?</span>",
    "HABLEMOS<br><span>DEL FUTURO.</span>",
    "¿QUÉ PENDIENTE<br><span>MANDAS AL RETIRO?</span>",
    "¿NOS SENTARÍAS<br><span>EN TU MESA?</span>",
    "SEGURO CONOCES<br><span>A ALGUIEN.</span>",
    "ÚLTIMA TOMA.<br><span>TE ESCUCHAMOS.</span>",
  ];
  return titles[index] || escapeHtml(title);
}

function scaleMarkup(field, selected, lowLabel, highLabel) {
  return `
    <div class="scale" role="group" aria-label="Escala del 1 al 10">
      <div class="scale__buttons">
        ${Array.from({ length: 10 }, (_, index) => {
          const value = index + 1;
          const pressed = selected === value;
          return `<button
            class="scale-button${pressed ? " is-selected" : ""}"
            type="button"
            data-action="set-rating"
            data-field="${field}"
            data-value="${value}"
            aria-pressed="${pressed}"
            aria-label="${value} de 10"
          >${value}</button>`;
        }).join("")}
      </div>
      <div class="scale__labels"><span>1 · ${lowLabel}</span><span>10 · ${highLabel}</span></div>
    </div>`;
}

function optionButton(action, value, label, selected, extra = "") {
  return `<button
    class="option-button${selected ? " is-selected" : ""}"
    type="button"
    data-action="${action}"
    data-value="${value}"
    aria-pressed="${selected}"
    ${extra}
  ><span class="option-button__mark" aria-hidden="true"></span><span>${escapeHtml(label)}</span></button>`;
}

function screenZero() {
  return `
    <p class="lead">Tu negocio ya empezó otra historia. Cuéntanos cómo va.</p>
    <div class="cover-meta">
      <span>≈ 3 minutos</span>
      <span>Tu opinión, sin filtro</span>
    </div>
    <div class="demo-note"><span class="demo-note__dot"></span><strong>Vista de prueba.</strong> Tus respuestas todavía no se envían.</div>`;
}

function screenOne() {
  return `
    <div class="statement-lines" aria-label="Lo que queremos escuchar">
      <p>Y lo que sigue empieza escuchándote.</p>
      <p>Lo que funciona. Lo que te falta.</p>
      <p>Lo que imaginas para tu negocio.</p>
    </div>
    <p class="support-copy">Diez escenas. Preguntas directas. Sin respuestas para quedar bien.</p>`;
}

function screenTwo() {
  return `
    <fieldset class="question-block">
      <legend>Del 1 al 10, ¿qué tan satisfecho estás con nuestra colaboración?</legend>
      ${scaleMarkup("satisfaction", draft.satisfaction, "Nada satisfecho", "Muy satisfecho")}
      ${errorText("satisfaction")}
    </fieldset>
    <p class="support-copy">La respuesta correcta es la que tú piensas.</p>
    ${
      draft.satisfaction !== null && draft.satisfaction <= 6
        ? '<div class="listening-note">Gracias por decirlo como es. Al final queremos entender qué podemos mejorar.</div>'
        : ""
    }`;
}

function screenThree() {
  return `
    <fieldset class="question-block">
      <legend>Del 1 al 10, ¿qué tan cómodo te sientes usando las soluciones que implementamos para tu negocio?</legend>
      ${scaleMarkup("technology.rating", draft.technology.rating, "Nada cómodo", "Muy cómodo")}
      <button
        class="option-button option-button--wide${draft.technology.insufficientExperience ? " is-selected" : ""}"
        type="button"
        data-action="technology-insufficient"
        aria-pressed="${draft.technology.insufficientExperience}"
      ><span class="option-button__mark" aria-hidden="true"></span><span>Aún no las he usado suficiente.</span></button>
      ${errorText("technology")}
    </fieldset>`;
}

function screenFour() {
  return `
    <fieldset class="question-block">
      <legend>¿Cómo crees que la IA impactará tu negocio durante los próximos 12 meses?</legend>
      <div class="option-list option-list--two-columns">
        ${IMPACT_OPTIONS.map((item) =>
          optionButton("set-impact", item.value, item.label, draft.aiImpact.expectation === item.value),
        ).join("")}
      </div>
      ${errorText("aiImpact")}
    </fieldset>
    <label class="field-label" for="impact-note">
      <span>¿En qué crees que lo notarás? <em>Opcional</em></span>
      <textarea id="impact-note" data-bind="aiImpact.note" rows="3" placeholder="En ventas, tiempo para el equipo, atención…">${escapeHtml(draft.aiImpact.note)}</textarea>
    </label>`;
}

function screenFive() {
  const selected = draft.priorities.selected;
  return `
    <fieldset class="question-block">
      <legend>¿Dónde te gustaría que la tecnología te ayudara más?</legend>
      <div class="selection-meta"><span>Elige hasta dos.</span><span>${selected.filter((item) => item !== "unclear").length}/2</span></div>
      <div class="option-list option-list--two-columns">
        ${PRIORITY_OPTIONS.map((item) =>
          optionButton("toggle-priority", item.value, item.label, selected.includes(item.value)),
        ).join("")}
      </div>
      ${errorText("priorities")}
    </fieldset>
    ${
      selected.includes("other")
        ? `<label class="field-label" for="other-priority">
            <span>Cuéntanos cuál <em>Opcional</em></span>
            <input id="other-priority" data-bind="priorities.other" type="text" value="${escapeHtml(draft.priorities.other)}" placeholder="Esa prioridad que no cabe en una lista" />
          </label>`
        : ""
    }`;
}

function screenSix() {
  return `
    <fieldset class="question-block">
      <legend>Del 1 al 10, ¿qué tan probable es que recomiendes Wizard a un amigo, familiar o colega con negocio?</legend>
      ${scaleMarkup("recommendation", draft.recommendation, "Nada probable", "Muy probable")}
      ${errorText("recommendation")}
    </fieldset>
    <p class="support-copy">No buscamos una calificación bonita. Buscamos entender la experiencia.</p>`;
}

function referralCard(referral, index) {
  const cardErrors = errors.referrals?.[index] || {};
  const isEmail = referral.channel === "email";
  return `
    <article class="referral-card" data-referral-id="${referral.id}">
      <div class="referral-card__head">
        <span>CONTACTO / ${String(index + 1).padStart(2, "0")}</span>
        <button class="text-button" type="button" data-action="remove-referral" data-index="${index}">Quitar</button>
      </div>
      <div class="field-grid">
        <label class="field-label">
          <span>Nombre</span>
          <input data-ref-index="${index}" data-ref-field="name" type="text" value="${escapeHtml(referral.name)}" autocomplete="name" aria-invalid="${Boolean(cardErrors.name)}" />
          ${cardErrors.name ? `<small class="inline-error">${escapeHtml(cardErrors.name)}</small>` : ""}
        </label>
        <label class="field-label">
          <span>Empresa o giro <em>Opcional</em></span>
          <input data-ref-index="${index}" data-ref-field="company" type="text" value="${escapeHtml(referral.company)}" />
        </label>
      </div>
      <div class="field-grid field-grid--channel">
        <label class="field-label">
          <span>Canal</span>
          <select data-ref-index="${index}" data-ref-field="channel">
            <option value="whatsapp"${!isEmail ? " selected" : ""}>WhatsApp</option>
            <option value="email"${isEmail ? " selected" : ""}>Correo</option>
          </select>
        </label>
        <label class="field-label">
          <span>${isEmail ? "Correo" : "Número"}</span>
          <input
            data-ref-index="${index}"
            data-ref-field="contact"
            type="${isEmail ? "email" : "tel"}"
            inputmode="${isEmail ? "email" : "tel"}"
            value="${escapeHtml(referral.contact)}"
            placeholder="${isEmail ? "nombre@empresa.com" : "+52 55 0000 0000"}"
            aria-invalid="${Boolean(cardErrors.contact)}"
          />
          ${cardErrors.contact ? `<small class="inline-error">${escapeHtml(cardErrors.contact)}</small>` : ""}
        </label>
      </div>
      <label class="field-label">
        <span>¿En qué crees que le podemos ayudar? <em>Opcional</em></span>
        <textarea data-ref-index="${index}" data-ref-field="note" rows="2">${escapeHtml(referral.note)}</textarea>
      </label>
      <label class="consent-row${cardErrors.consent ? " has-error" : ""}">
        <input data-ref-index="${index}" data-ref-field="consent" type="checkbox" ${referral.consent ? "checked" : ""} />
        <span>Confirmo que esta persona está de acuerdo con que comparta sus datos para que Wizard la contacte.</span>
      </label>
      ${cardErrors.consent ? `<small class="inline-error">${escapeHtml(cardErrors.consent)}</small>` : ""}
    </article>`;
}

function referralChoices() {
  return `
    <p class="lead lead--small">Un amigo. Tu prima. Ese colega que sigue haciendo todo a mano.</p>
    <div class="path-choices">
      <button class="path-choice${draft.referralMode === "contact" ? " is-selected" : ""}" type="button" data-action="referral-mode" data-value="contact">
        <span class="path-choice__letter">A</span><span><strong>Te comparto un contacto</strong><small>Hasta tres personas, siempre con su permiso.</small></span>
      </button>
      <button class="path-choice${draft.referralMode === "self_intro" ? " is-selected" : ""}" type="button" data-action="referral-mode" data-value="self_intro">
        <span class="path-choice__letter">B</span><span><strong>Prefiero presentarlos yo</strong><small>Te dejamos un mensaje listo para editar.</small></span>
      </button>
    </div>`;
}

function contactReferralBody() {
  return `
    <div class="referral-list">
      ${draft.referrals.map(referralCard).join("")}
    </div>
    ${
      draft.referrals.length < 3
        ? '<button class="button button--outline button--small" type="button" data-action="add-referral">Agregar otra persona</button>'
        : '<p class="support-copy">Llegaste al máximo de tres personas.</p>'
    }
    <button class="text-button text-button--escape" type="button" data-action="skip-referrals">Ahora no se me ocurre alguien.</button>`;
}

function selfIntroBody() {
  return `
    <label class="field-label message-editor" for="intro-message">
      <span>Mensaje editable</span>
      <textarea id="intro-message" data-bind="selfIntroMessage" rows="5">${escapeHtml(draft.selfIntroMessage)}</textarea>
    </label>
    <div class="share-actions">
      <button class="button button--outline" type="button" data-action="open-whatsapp">Abrir WhatsApp</button>
      <button class="button button--outline" type="button" data-action="open-email">Abrir correo</button>
      <button class="button button--outline" type="button" data-action="copy-message">Copiar mensaje</button>
    </div>
    <p class="support-copy">Solo abrimos el borrador cuando tú pulsas. Tú eliges destinatario y decides si lo envías.</p>
    <button class="text-button text-button--escape" type="button" data-action="skip-referrals">Ahora no se me ocurre alguien.</button>`;
}

function screenSeven() {
  const low = isLowExperience(draft);
  const choosingReferral = draft.referralMode === "contact" || draft.referralMode === "self_intro";
  if (low && !choosingReferral) {
    return `
      <div class="feedback-first">
        <p class="lead lead--small">Antes, cuéntanos qué mejorar.</p>
        <p>Tu experiencia importa más que una recomendación. Vamos directo al comentario final.</p>
        <div class="feedback-first__actions">
          <button class="button button--primary" type="button" data-action="low-to-comment">Quiero contarles</button>
          <button class="button button--ghost" type="button" data-action="low-show-referrals">También quiero recomendar a alguien</button>
        </div>
      </div>`;
  }

  return `
    ${referralChoices()}
    ${draft.referralMode === "contact" ? contactReferralBody() : ""}
    ${draft.referralMode === "self_intro" ? selfIntroBody() : ""}
    ${draft.referralMode === null ? '<button class="text-button text-button--escape" type="button" data-action="skip-referrals">Ahora no se me ocurre alguien.</button>' : ""}
  `;
}

function screenEight() {
  const low = isLowExperience(draft);
  return `
    <label class="field-label field-label--large" for="final-comment">
      <span>${
        low
          ? "¿Qué necesitamos mejorar para que tu experiencia sea mejor?"
          : "¿Qué deberíamos mejorar, mantener o empezar a hacer?"
      } <em>Opcional</em></span>
      <textarea id="final-comment" data-bind="finalComment" rows="7" maxlength="1000" placeholder="Escribe con total libertad…">${escapeHtml(draft.finalComment)}</textarea>
      <small class="character-count"><span id="comment-count">${draft.finalComment.length}</span>/1,000</small>
    </label>
    <div class="field-grid">
      <label class="field-label">
        <span>Tu nombre <em>Opcional</em></span>
        <input data-bind="identity.name" type="text" value="${escapeHtml(draft.identity.name)}" autocomplete="name" />
      </label>
      <label class="field-label">
        <span>Empresa <em>Opcional</em></span>
        <input data-bind="identity.company" type="text" value="${escapeHtml(draft.identity.company)}" autocomplete="organization" />
      </label>
    </div>
    <label class="consent-row consent-row--followup">
      <input data-bind="followUpRequested" type="checkbox" ${draft.followUpRequested ? "checked" : ""} />
      <span>Me gustaría conversar con Wizard sobre mis respuestas.</span>
    </label>
    <div class="demo-note"><span class="demo-note__dot"></span>Vista de prueba: todavía no se enviarán respuestas ni solicitudes de contacto.</div>`;
}

function closingScreen() {
  return `
    <section class="closing-screen" aria-labelledby="screen-heading">
      <div class="closing-screen__glow" aria-hidden="true"></div>
      <img class="closing-logo" src="./assets/logo-wizard.png" alt="Wizard, Agencia IA Aplicada" />
      <p class="eyebrow">RECORRIDO / COMPLETADO</p>
      <h1 class="closing-title" id="screen-heading" tabindex="-1">LET’S CONJURE<br />THE FUTURE.</h1>
      <p class="closing-copy"><strong>Recorrido completado.</strong> Gracias por probar la experiencia.</p>
      <p class="closing-disclaimer">Tus respuestas quedaron únicamente en esta pestaña. Todavía no se enviaron a Wizard.</p>
      <div class="closing-actions">
        <button class="button button--primary" type="button" data-action="review">Revisar mis respuestas</button>
        <button class="button button--ghost" type="button" data-action="reset">Borrar y empezar de nuevo</button>
      </div>
    </section>`;
}

const bodyRenderers = [
  screenZero,
  screenOne,
  screenTwo,
  screenThree,
  screenFour,
  screenFive,
  screenSix,
  screenSeven,
  screenEight,
];

function screenMarkup(index) {
  if (index === 9) return closingScreen();
  const screen = SCREENS[index];
  const body = bodyRenderers[index]();
  const isNewScreen = index !== lastScreen;
  return `
    <section class="screen${index >= 2 ? " screen--question" : ""}${isNewScreen ? ` screen--enter-${transitionDirection}` : ""}" aria-labelledby="screen-heading">
      <div class="screen__copy">
        <div class="screen__copy-inner">
          <p class="eyebrow">${escapeHtml(screen.eyebrow)}</p>
          <h1 class="screen-heading" id="screen-heading" tabindex="-1">${formatTitle(index, screen.title)}</h1>
          <div class="screen-body">${body}</div>
        </div>
      </div>
      <figure class="screen__visual">
        <img src="${screen.image}" alt="${escapeHtml(screen.imageAlt)}" ${index < 2 ? 'fetchpriority="high"' : 'loading="lazy"'} />
        <figcaption>${String(index + 1).padStart(2, "0")} / WIZARD FEEDBACK</figcaption>
      </figure>
    </section>`;
}

function updateNavigation() {
  const index = draft.currentScreen;
  const labels = [
    "EL COMIENZO",
    "LO QUE SIGUE",
    "TU EXPERIENCIA",
    "LA TECNOLOGÍA",
    "EL FUTURO",
    "TUS PRIORIDADES",
    "LA RECOMENDACIÓN",
    "LAS PRESENTACIONES",
    "TU VOZ",
    "EL CIERRE",
  ];
  currentNumber.textContent = String(index + 1).padStart(2, "0");
  sectionLabel.textContent = labels[index];
  progressFill.style.setProperty("--progress", `${((index + 1) / SCREEN_COUNT) * 100}%`);
  progressSteps.forEach((step, stepIndex) => {
    const visited = stepIndex <= draft.maxVisitedScreen;
    step.classList.toggle("is-current", stepIndex === index);
    step.classList.toggle("is-visited", visited);
    step.disabled = !visited;
    step.setAttribute("aria-current", stepIndex === index ? "step" : "false");
  });
  previousButton.hidden = index === 0 || index === 9;
  nav.hidden = index === 9;
  const referralChoiceOpen = draft.referralMode === "contact" || draft.referralMode === "self_intro";
  nextButton.hidden = index === 9 || (index === 7 && isLowExperience(draft) && !referralChoiceOpen);

  if (index === 0) nextButton.textContent = "A ver, dispara";
  else if (index === 1) nextButton.textContent = "Vamos al futuro";
  else if (index === 8) nextButton.textContent = "Terminar recorrido";
  else nextButton.textContent = "Continuar";

  navStatus.textContent = index === 8
    ? "Nada saldrá de esta pestaña en modo demo."
    : "Tu borrador vive solo en esta pestaña.";
}

function render({ focus = false } = {}) {
  const current = draft.currentScreen;
  stage.innerHTML = screenMarkup(current);
  updateNavigation();
  saveDraft(draft);

  const nextImage = SCREENS[current + 1]?.image;
  if (nextImage) {
    const preload = new Image();
    preload.src = nextImage;
  }

  if (focus) {
    requestAnimationFrame(() => stage.querySelector("#screen-heading")?.focus({ preventScroll: true }));
  }
  lastScreen = current;
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function pulseProgress() {
  progressFill.classList.remove("is-pulsing");
  requestAnimationFrame(() => progressFill.classList.add("is-pulsing"));
}

function goTo(index, direction = "forward") {
  transitionDirection = direction;
  draft.currentScreen = Math.min(9, Math.max(0, index));
  draft.maxVisitedScreen = Math.max(draft.maxVisitedScreen, draft.currentScreen);
  errors = {};
  render({ focus: true });
  stage.scrollTop = 0;
}

function goNext() {
  const screenErrors = validateScreen(draft.currentScreen, draft);
  if (Object.keys(screenErrors).length > 0) {
    errors = screenErrors;
    render();
    requestAnimationFrame(() => stage.querySelector(".field-error, .inline-error")?.scrollIntoView({ block: "center", behavior: "smooth" }));
    return;
  }

  if (draft.currentScreen === 8) {
    draft.completedAt = new Date().toISOString();
  }
  goTo(draft.currentScreen + 1, "forward");
}

function updateRating(field, value) {
  setPath(draft, field, Number(value));
  if (field === "technology.rating") draft.technology.insufficientExperience = false;
  errors = {};
  pulseProgress();
  render();
}

async function copyMessage() {
  const text = draft.selfIntroMessage.trim();
  try {
    await navigator.clipboard.writeText(text);
    showToast("Mensaje copiado. Tú decides dónde compartirlo.");
  } catch {
    const field = document.createElement("textarea");
    field.value = text;
    document.body.append(field);
    field.select();
    document.execCommand("copy");
    field.remove();
    showToast("Mensaje copiado.");
  }
}

function openDraft(kind) {
  const message = encodeURIComponent(draft.selfIntroMessage.trim());
  const url = kind === "whatsapp"
    ? `https://wa.me/?text=${message}`
    : `mailto:?subject=${encodeURIComponent("Te presento a Wizard")}&body=${message}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function summaryRow(label, value, editScreen) {
  return `<li><span><small>${escapeHtml(label)}</small><strong>${escapeHtml(value || "Sin respuesta")}</strong></span><button type="button" data-action="edit-screen" data-screen="${editScreen}">Editar</button></li>`;
}

function openReview() {
  const impact = IMPACT_OPTIONS.find((item) => item.value === draft.aiImpact.expectation)?.label;
  const priorities = PRIORITY_OPTIONS.filter((item) => draft.priorities.selected.includes(item.value))
    .map((item) => item.label)
    .join(" · ");
  const technology = draft.technology.insufficientExperience
    ? "Aún no las ha usado suficiente"
    : draft.technology.rating ? `${draft.technology.rating}/10` : "";

  modalLayer.hidden = false;
  modalLayer.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal"></div>
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
      <div class="modal__head"><div><p class="eyebrow">BORRADOR LOCAL</p><h2 id="review-title">Tus respuestas</h2></div><button class="modal__close" type="button" data-action="close-modal" aria-label="Cerrar">×</button></div>
      <ul class="review-list">
        ${summaryRow("Satisfacción", draft.satisfaction ? `${draft.satisfaction}/10` : "", 2)}
        ${summaryRow("Comodidad con la tecnología", technology, 3)}
        ${summaryRow("Impacto esperado de la IA", impact, 4)}
        ${summaryRow("Prioridades", priorities, 5)}
        ${summaryRow("Probabilidad de recomendar", draft.recommendation ? `${draft.recommendation}/10` : "", 6)}
        ${summaryRow("Modalidad de recomendación", draft.referralMode || "Sin referidos", 7)}
        ${summaryRow("Comentario final", draft.finalComment, 8)}
      </ul>
      <p class="modal__note">Este resumen también vive solo en tu sesión. Nada se ha enviado.</p>
    </section>`;
  requestAnimationFrame(() => modalLayer.querySelector(".modal__close")?.focus());
}

function openResetConfirmation() {
  modalLayer.hidden = false;
  modalLayer.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal"></div>
    <section class="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="reset-title">
      <p class="eyebrow">BORRAR BORRADOR</p>
      <h2 id="reset-title">¿Empezamos desde cero?</h2>
      <p>Se eliminarán las respuestas guardadas en esta pestaña. Esta acción no se puede deshacer.</p>
      <div class="modal__actions">
        <button class="button button--ghost" type="button" data-action="close-modal">Conservar respuestas</button>
        <button class="button button--danger" type="button" data-action="confirm-reset">Sí, borrar</button>
      </div>
    </section>`;
  requestAnimationFrame(() => modalLayer.querySelector('[data-action="close-modal"]')?.focus());
}

function openPreviewInfo() {
  modalLayer.hidden = false;
  modalLayer.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal"></div>
    <section class="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="preview-title">
      <div class="modal__head">
        <div><p class="eyebrow">MODO DEMO</p><h2 id="preview-title">Nada sale de esta pestaña.</h2></div>
        <button class="modal__close" type="button" data-action="close-modal" aria-label="Cerrar">×</button>
      </div>
      <p>Las respuestas se conservan temporalmente para que pruebes el recorrido. Todavía no se envían a Wizard, n8n, Excel ni ningún otro servicio.</p>
    </section>`;
  requestAnimationFrame(() => modalLayer.querySelector(".modal__close")?.focus());
}

function closeModal() {
  modalLayer.hidden = true;
  modalLayer.innerHTML = "";
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, value, field, index, screen } = button.dataset;

  if (action === "next") goNext();
  if (action === "previous") goTo(draft.currentScreen - 1, "backward");
  if (action === "jump-screen" && Number(screen) <= draft.maxVisitedScreen) {
    goTo(Number(screen), Number(screen) < draft.currentScreen ? "backward" : "forward");
  }
  if (action === "preview-info") openPreviewInfo();
  if (action === "set-rating") updateRating(field, value);
  if (action === "technology-insufficient") {
    draft.technology.insufficientExperience = !draft.technology.insufficientExperience;
    if (draft.technology.insufficientExperience) draft.technology.rating = null;
    errors = {};
    pulseProgress();
    render();
  }
  if (action === "set-impact") {
    draft.aiImpact.expectation = value;
    errors = {};
    pulseProgress();
    render();
  }
  if (action === "toggle-priority") {
    const result = togglePriority(draft, value);
    if (!result.changed) showToast(result.reason);
    else pulseProgress();
    errors = {};
    render();
  }
  if (action === "referral-mode") {
    draft.referralMode = value;
    if (value === "contact" && draft.referrals.length === 0) draft.referrals.push(createReferral());
    errors = {};
    render();
  }
  if (action === "add-referral" && draft.referrals.length < 3) {
    draft.referrals.push(createReferral());
    render();
  }
  if (action === "remove-referral") {
    draft.referrals.splice(Number(index), 1);
    render();
  }
  if (action === "skip-referrals") {
    draft.referralMode = "none";
    goTo(8, "forward");
  }
  if (action === "low-to-comment") {
    draft.referralMode = "feedback_first";
    goTo(8, "forward");
  }
  if (action === "low-show-referrals") {
    draft.referralMode = "contact";
    if (draft.referrals.length === 0) draft.referrals.push(createReferral());
    render();
  }
  if (action === "copy-message") copyMessage();
  if (action === "open-whatsapp") openDraft("whatsapp");
  if (action === "open-email") openDraft("email");
  if (action === "review") openReview();
  if (action === "reset") openResetConfirmation();
  if (action === "close-modal") closeModal();
  if (action === "confirm-reset") {
    clearDraft();
    draft = createDraft();
    closeModal();
    goTo(0, "backward");
  }
  if (action === "edit-screen") {
    closeModal();
    goTo(Number(screen), "backward");
  }
});

document.addEventListener("input", (event) => {
  const input = event.target;
  if (input.dataset.bind && input.type !== "checkbox") {
    setPath(draft, input.dataset.bind, input.value);
    if (input.dataset.bind === "finalComment") {
      const count = document.querySelector("#comment-count");
      if (count) count.textContent = input.value.length;
    }
    saveDraft(draft);
  }
  if (input.dataset.refField && input.type !== "checkbox") {
    draft.referrals[Number(input.dataset.refIndex)][input.dataset.refField] = input.value;
    saveDraft(draft);
  }
});

document.addEventListener("change", (event) => {
  const input = event.target;
  if (input.dataset.bind && input.type === "checkbox") {
    setPath(draft, input.dataset.bind, input.checked);
    saveDraft(draft);
  }
  if (input.dataset.refField) {
    const referral = draft.referrals[Number(input.dataset.refIndex)];
    referral[input.dataset.refField] = input.type === "checkbox" ? input.checked : input.value;
    errors = {};
    render();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalLayer.hidden) {
    closeModal();
    return;
  }
  const tag = event.target.tagName;
  const isEditing = ["INPUT", "TEXTAREA", "SELECT"].includes(tag);
  if (isEditing || !modalLayer.hidden) return;
  if (event.key === "ArrowRight" && draft.currentScreen < 9) goNext();
  if (event.key === "ArrowLeft" && draft.currentScreen > 0 && draft.currentScreen < 9) {
    goTo(draft.currentScreen - 1, "backward");
  }
});

render();
