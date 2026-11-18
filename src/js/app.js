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
  isReferralComplete,
  loadDraft,
  REQUIRED_REFERRAL_COUNT,
  REFERRAL_SLOT_COUNT,
  saveDraft,
  togglePriority,
  validateScreen,
} from "./model.js";

let draft = loadDraft();
let errors = {};
let lastScreen = draft.currentScreen;
let transitionDirection = "forward";
let toastTimer = null;
let activeReferralIndex = 0;

const stage = document.querySelector("#stage");
const nav = document.querySelector("#app-nav");
const previousButton = document.querySelector("#previous-button");
const nextButton = document.querySelector("#next-button");
const currentNumber = document.querySelector("#current-number");
const progressFill = document.querySelector("#progress-fill");
const progressSteps = [...document.querySelectorAll("#progress-steps button")];
const sectionLabel = document.querySelector("#section-label");
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

function wizardSparklesMarkup() {
  const sparkles = [
    [3, 12, "var(--green)", "0ms", 0.72, "1350ms"],
    [17, -7, "var(--paper)", "420ms", 0.48, "1580ms"],
    [29, 76, "var(--green)", "860ms", 0.58, "1420ms"],
    [43, 9, "var(--paper)", "1180ms", 0.42, "1660ms"],
    [57, 88, "var(--green)", "260ms", 0.68, "1520ms"],
    [69, -10, "var(--green)", "740ms", 0.52, "1390ms"],
    [80, 63, "var(--paper)", "1320ms", 0.44, "1720ms"],
    [92, 6, "var(--green)", "520ms", 0.76, "1480ms"],
    [101, 45, "var(--paper)", "980ms", 0.5, "1610ms"],
    [51, 47, "var(--green)", "1540ms", 0.38, "1450ms"],
  ];

  return sparkles
    .map(
      ([x, y, color, delay, scale, duration]) => `
        <svg
          class="title-sparkle"
          viewBox="0 0 21 21"
          aria-hidden="true"
          style="--sparkle-x:${x}%;--sparkle-y:${y}%;--sparkle-color:${color};--sparkle-delay:${delay};--sparkle-scale:${scale};--sparkle-duration:${duration}"
        >
          <path d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z" />
        </svg>`,
    )
    .join("");
}

function formatTitle(index, title) {
  const titles = [
    `<span class="title-line title-solid-white">¿NO QUE NO</span>
      <span class="title-line"><span class="title-outline-white">SE POD</span><span class="title-solid-green">ÍA</span><span class="title-outline-white">?</span></span>`,
    `<span class="title-line"><span class="title-solid-white">CON </span><span class="title-outline-white title-sparkles"><span class="title-sparkles__word">WIZARD</span>${wizardSparklesMarkup()}</span></span>
      <span class="title-line"><span class="title-solid-green">TODO</span><span class="title-solid-white"> SE PUEDE.</span></span>`,
    `<span class="title-line title-outline-white">A VER,</span>
      <span class="title-line title-solid-green">SIN FILTRO.</span>`,
    `<span class="title-line title-solid-white">¿QUÉ TAN CÓMODO</span>
      <span class="title-line title-outline-green">TE SIENTES CON TU</span>
      <span class="title-line"><span class="title-solid-white">TECNOLOG</span><span class="title-solid-green">ÍA</span><span class="title-solid-white">?</span></span>`,
    `<span class="title-line title-outline-green">HABLEMOS</span>
      <span class="title-line"><span class="title-solid-white">DEL </span><span class="title-solid-green">FUTURO.</span></span>`,
    `<span class="title-line title-outline-white">¿QUÉ PROYECTO</span>
      <span class="title-line title-solid-green">DEBERÍA ARRANCAR HOY</span>
      <span class="title-line title-solid-white">TU EMPRESA?</span>`,
    `<span class="title-line title-outline-white">Y A TODO ESTO,</span>
      <span class="title-line"><span class="title-solid-green">¿NOS </span><span class="title-solid-white">RECOMENDARÍAS?</span></span>`,
    `<span class="title-line title-outline-white">TE COMPARTO</span>
      <span class="title-line"><span class="title-solid-white">UNOS </span><span class="title-solid-green">CONTACTOS.</span></span>`,
    `<span class="title-line title-solid-white">YA TERMINAMOS.</span>
      <span class="title-line title-outline-white">AHORA, TE ESCUCHAMOS</span>
      <span class="title-line title-solid-green">SIN FILTRO:</span>`,
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
    <div class="cover-actions">
      <div class="cover-meta">
        <span>≈ 3 minutos</span>
        <span>Tu opinión, sin filtro</span>
      </div>
      <a
        class="cover-reel"
        href="https://www.youtube.com/watch?v=U8x98Sk45DI"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ver reel de Wizard en YouTube; se abre en una pestaña nueva"
      >Ver reel</a>
    </div>`;
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
        <span>CONTACTO / ${String(index + 1).padStart(2, "0")} <small>${index < REQUIRED_REFERRAL_COUNT ? "OBLIGATORIO" : "OPCIONAL"}</small></span>
        <button class="text-button" type="button" data-action="clear-referral" data-index="${index}">Limpiar</button>
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
        <textarea data-ref-index="${index}" data-ref-field="note" rows="1">${escapeHtml(referral.note)}</textarea>
      </label>
      <label class="consent-row${cardErrors.consent ? " has-error" : ""}">
        <input data-ref-index="${index}" data-ref-field="consent" type="checkbox" ${referral.consent ? "checked" : ""} />
        <span>Confirmo que esta persona está de acuerdo con que comparta sus datos para que Wizard la contacte.</span>
      </label>
      ${cardErrors.consent ? `<small class="inline-error">${escapeHtml(cardErrors.consent)}</small>` : ""}
    </article>`;
}

function contactReferralBody() {
  const finalIndex = Math.max(0, draft.referrals.length - 1);
  activeReferralIndex = Math.min(activeReferralIndex, finalIndex);
  const activeReferral = draft.referrals[activeReferralIndex];

  return `
    <p class="referral-instruction"><strong>Tres contactos son obligatorios; tienes espacio para cinco.</strong> Por favor, si te gustó Wizard, recomiéndanos cinco contactos a quienes pueda interesarles nuestra tecnología.</p>
    <div class="referral-tabs" role="group" aria-label="Contactos compartidos">
      ${draft.referrals.map((referral, index) => `
        <button
          class="referral-tab${index === activeReferralIndex ? " is-selected" : ""}"
          type="button"
          data-action="referral-tab"
          data-index="${index}"
          aria-pressed="${index === activeReferralIndex}"
          aria-label="Contacto ${index + 1}, ${index < REQUIRED_REFERRAL_COUNT ? "obligatorio" : "opcional"}"
        >Contacto ${index + 1}${index < REQUIRED_REFERRAL_COUNT ? '<span class="required-marker" aria-hidden="true">*</span>' : ""}</button>`).join("")}
    </div>
    <div class="referral-list">
      ${activeReferral ? referralCard(activeReferral, activeReferralIndex) : ""}
    </div>`;
}

function screenSeven() {
  return contactReferralBody();
}

function screenEight() {
  const low = isLowExperience(draft);
  return `
    <div class="final-feedback">
      <label class="field-label field-label--large" for="final-comment">
        <span>${
          low
            ? "¿Qué necesitamos mejorar para que tu experiencia sea mejor?"
            : "¿Qué deberíamos mejorar, mantener o empezar a hacer?"
        } <em>Opcional</em></span>
        <textarea id="final-comment" data-bind="finalComment" rows="6" maxlength="1000" placeholder="Escribe con total libertad…">${escapeHtml(draft.finalComment)}</textarea>
        <small class="character-count"><span id="comment-count">${draft.finalComment.length}</span>/1,000</small>
      </label>
      <div class="final-feedback__aside">
        <div class="field-grid final-feedback__identity">
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
      </div>
    </div>
  `;
}

function closingScreen() {
  return `
    <section class="closing-screen" aria-labelledby="screen-heading">
      <video class="closing-video" muted loop playsinline preload="auto" aria-hidden="true">
        <source src="./assets/robot-fortune-outro.mp4" type="video/mp4" />
      </video>
      <div class="closing-screen__content">
        <p class="eyebrow">RECORRIDO / COMPLETADO</p>
        <h1 class="closing-title" id="screen-heading" tabindex="-1">
          <span class="closing-title__solid">LET’S</span>
          <span class="closing-title__outline">CONJURE<br />THE FUTURE</span>
        </h1>
        <img class="closing-logo" src="./assets/logo-wizard.png" alt="Wizard, Agencia IA Aplicada" />
        <p class="closing-copy"><strong>Recorrido completado.</strong> Gracias por compartir tu experiencia.</p>
        <div class="closing-actions">
          <button class="button button--primary" type="button" data-action="review">Revisar mis respuestas</button>
          <button class="button button--ghost" type="button" data-action="reset">Borrar y empezar de nuevo</button>
        </div>
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
  const variantClass = index === 7 ? " screen--referrals" : index === 8 ? " screen--comment" : "";
  return `
    <section class="screen${index >= 2 ? " screen--question" : ""}${variantClass}${isNewScreen ? ` screen--enter-${transitionDirection}` : ""}" aria-labelledby="screen-heading">
      <div class="screen__copy">
        <div class="screen__copy-inner">
          <p class="eyebrow">${escapeHtml(screen.eyebrow)}</p>
          <h1 class="screen-heading" id="screen-heading" tabindex="-1" aria-label="${escapeHtml(screen.title)}">
            <span class="title-lockup" aria-hidden="true">${formatTitle(index, screen.title)}</span>
          </h1>
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
  nextButton.hidden = index === 9;

  if (index === 0) nextButton.textContent = "A ver, dispara";
  else if (index === 1) nextButton.textContent = "Vamos al futuro";
  else if (index === 8) nextButton.textContent = "Terminar recorrido";
  else nextButton.textContent = "Continuar";

}

function render({ focus = false } = {}) {
  const current = draft.currentScreen;
  stage.innerHTML = screenMarkup(current);
  const closingVideo = stage.querySelector(".closing-video");
  if (closingVideo && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    closingVideo.play().catch(() => {});
  }
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
    if (screenErrors.referrals) {
      const firstInvalidReferral = screenErrors.referrals.findIndex((referralErrors) =>
        referralErrors && Object.keys(referralErrors).length > 0,
      );
      if (firstInvalidReferral >= 0) activeReferralIndex = firstInvalidReferral;
    }
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
  const completeReferrals = draft.referrals.filter(isReferralComplete).length;

  modalLayer.hidden = false;
  modalLayer.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal"></div>
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
      <div class="modal__head"><div><p class="eyebrow">RESUMEN</p><h2 id="review-title">Tus respuestas</h2></div><button class="modal__close" type="button" data-action="close-modal" aria-label="Cerrar">×</button></div>
      <ul class="review-list">
        ${summaryRow("Satisfacción", draft.satisfaction ? `${draft.satisfaction}/10` : "", 2)}
        ${summaryRow("Comodidad con la tecnología", technology, 3)}
        ${summaryRow("Impacto esperado de la IA", impact, 4)}
        ${summaryRow("Prioridades", priorities, 5)}
        ${summaryRow("Probabilidad de recomendar", draft.recommendation ? `${draft.recommendation}/10` : "", 6)}
        ${summaryRow("Contactos recomendados", `${completeReferrals} de ${REFERRAL_SLOT_COUNT}`, 7)}
        ${summaryRow("Comentario final", draft.finalComment, 8)}
      </ul>
    </section>`;
  requestAnimationFrame(() => modalLayer.querySelector(".modal__close")?.focus());
}

function openResetConfirmation() {
  modalLayer.hidden = false;
  modalLayer.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal"></div>
    <section class="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="reset-title">
      <p class="eyebrow">BORRAR RESPUESTAS</p>
      <h2 id="reset-title">¿Empezamos desde cero?</h2>
      <p>Se eliminarán las respuestas guardadas en esta pestaña. Esta acción no se puede deshacer.</p>
      <div class="modal__actions">
        <button class="button button--ghost" type="button" data-action="close-modal">Conservar respuestas</button>
        <button class="button button--danger" type="button" data-action="confirm-reset">Sí, borrar</button>
      </div>
    </section>`;
  requestAnimationFrame(() => modalLayer.querySelector('[data-action="close-modal"]')?.focus());
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
  if (action === "referral-tab") {
    activeReferralIndex = Number(index);
    render();
  }
  if (action === "clear-referral") {
    draft.referrals[Number(index)] = createReferral();
    errors = {};
    render();
  }
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
