import { DEFAULT_INTRO_MESSAGE } from "./content.js";

export const STORAGE_KEY = "wizard-survey-demo-v1";
export const SCHEMA_VERSION = "1.0.0";

function createId(prefix = "draft") {
  const uuid = globalThis.crypto?.randomUUID?.();
  return uuid ? `${prefix}_${uuid}` : `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function createReferral() {
  return {
    id: createId("ref"),
    name: "",
    company: "",
    channel: "whatsapp",
    contact: "",
    note: "",
    consent: false,
  };
}

export function createDraft(now = new Date()) {
  return {
    draftId: createId(),
    schemaVersion: SCHEMA_VERSION,
    mode: "demo",
    demo: true,
    startedAt: now.toISOString(),
    completedAt: null,
    currentScreen: 0,
    maxVisitedScreen: 0,
    identity: { name: "", company: "" },
    satisfaction: null,
    technology: { rating: null, insufficientExperience: false },
    aiImpact: { expectation: null, note: "" },
    priorities: { selected: [], other: "" },
    recommendation: null,
    referralMode: null,
    referrals: [],
    selfIntroMessage: DEFAULT_INTRO_MESSAGE,
    finalComment: "",
    followUpRequested: false,
  };
}

export function normalizeDraft(value) {
  const fresh = createDraft();
  if (!value || value.schemaVersion !== SCHEMA_VERSION) return fresh;

  return {
    ...fresh,
    ...value,
    identity: { ...fresh.identity, ...value.identity },
    technology: { ...fresh.technology, ...value.technology },
    aiImpact: { ...fresh.aiImpact, ...value.aiImpact },
    priorities: { ...fresh.priorities, ...value.priorities },
    referralMode: value.referralMode === "self_intro" ? null : value.referralMode,
    referrals: Array.isArray(value.referrals) ? value.referrals.slice(0, 3) : [],
    currentScreen: Number.isInteger(value.currentScreen)
      ? Math.min(9, Math.max(0, value.currentScreen))
      : 0,
    maxVisitedScreen: Number.isInteger(value.maxVisitedScreen)
      ? Math.min(9, Math.max(0, value.maxVisitedScreen))
      : 0,
  };
}

export function loadDraft(storage = globalThis.sessionStorage) {
  if (!storage) return createDraft();
  try {
    const saved = storage.getItem(STORAGE_KEY);
    return saved ? normalizeDraft(JSON.parse(saved)) : createDraft();
  } catch {
    return createDraft();
  }
}

export function saveDraft(draft, storage = globalThis.sessionStorage) {
  if (!storage) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearDraft(storage = globalThis.sessionStorage) {
  storage?.removeItem(STORAGE_KEY);
}

export function isLowExperience(draft) {
  return (
    (typeof draft.satisfaction === "number" && draft.satisfaction <= 6) ||
    (typeof draft.recommendation === "number" && draft.recommendation <= 6)
  );
}

export function isReferralEmpty(referral) {
  return !(
    referral.name.trim() ||
    referral.company.trim() ||
    referral.contact.trim() ||
    referral.note.trim() ||
    referral.consent
  );
}

export function isValidContact(referral) {
  const value = referral.contact.trim();
  if (referral.channel === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function validateReferral(referral) {
  if (isReferralEmpty(referral)) return {};
  const errors = {};
  if (!referral.name.trim()) errors.name = "Agrega su nombre.";
  if (!referral.contact.trim()) {
    errors.contact = referral.channel === "email" ? "Agrega su correo." : "Agrega su número.";
  } else if (!isValidContact(referral)) {
    errors.contact =
      referral.channel === "email"
        ? "Escribe un correo válido."
        : "Escribe un número con 10 a 15 dígitos.";
  }
  if (!referral.consent) {
    errors.consent = "Confirma que esta persona aceptó compartir sus datos.";
  }
  return errors;
}

export function isReferralComplete(referral) {
  return !isReferralEmpty(referral) && Object.keys(validateReferral(referral)).length === 0;
}

export function validateScreen(screenIndex, draft) {
  const errors = {};
  if (screenIndex === 2 && draft.satisfaction === null) {
    errors.satisfaction = "Elige una calificación para continuar.";
  }
  if (
    screenIndex === 3 &&
    draft.technology.rating === null &&
    !draft.technology.insufficientExperience
  ) {
    errors.technology = "Elige una calificación o indica que aún no la has usado suficiente.";
  }
  if (screenIndex === 4 && !draft.aiImpact.expectation) {
    errors.aiImpact = "Elige la opción que más se acerque a lo que piensas.";
  }
  if (screenIndex === 5 && draft.priorities.selected.length === 0) {
    errors.priorities = "Elige una o dos prioridades.";
  }
  if (screenIndex === 6 && draft.recommendation === null) {
    errors.recommendation = "Elige una calificación para continuar.";
  }
  if (screenIndex === 7 && draft.referralMode === "contact") {
    const referralErrors = draft.referrals.map(validateReferral);
    if (referralErrors.some((item) => Object.keys(item).length > 0)) {
      errors.referrals = referralErrors;
    }
  }
  return errors;
}

export function togglePriority(draft, value) {
  const current = draft.priorities.selected;
  if (value === "unclear") {
    draft.priorities.selected = current.includes("unclear") ? [] : ["unclear"];
    return { changed: true };
  }

  let next = current.filter((item) => item !== "unclear");
  if (next.includes(value)) {
    next = next.filter((item) => item !== value);
  } else if (next.length >= 2) {
    return { changed: false, reason: "Puedes elegir hasta dos prioridades." };
  } else {
    next.push(value);
  }
  draft.priorities.selected = next;
  return { changed: true };
}
