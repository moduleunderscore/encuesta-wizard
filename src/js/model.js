import { DEFAULT_INTRO_MESSAGE } from "./content.js";

export const STORAGE_KEY = "wizard-survey-demo-v1";
export const SCHEMA_VERSION = "1.1.0";
const PREVIOUS_SCHEMA_VERSION = "1.0.0";
export const REQUIRED_REFERRAL_COUNT = 3;
export const REFERRAL_SLOT_COUNT = 5;

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

function createReferralSlots(existing = []) {
  const referrals = (Array.isArray(existing) ? existing : [])
    .slice(0, REFERRAL_SLOT_COUNT)
    .map((referral) => ({ ...createReferral(), ...referral }));
  while (referrals.length < REFERRAL_SLOT_COUNT) referrals.push(createReferral());
  return referrals;
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
    referralMode: "contact",
    referrals: createReferralSlots(),
    selfIntroMessage: DEFAULT_INTRO_MESSAGE,
    finalComment: "",
    followUpRequested: false,
  };
}

function normalizeRating(value, schemaVersion) {
  if (!Number.isInteger(value)) return null;
  if (schemaVersion === PREVIOUS_SCHEMA_VERSION && value >= 1 && value <= 10) {
    return Math.ceil(value / 2);
  }
  return value >= 1 && value <= 5 ? value : null;
}

export function normalizeDraft(value) {
  const fresh = createDraft();
  if (
    !value ||
    ![SCHEMA_VERSION, PREVIOUS_SCHEMA_VERSION].includes(value.schemaVersion)
  ) {
    return fresh;
  }

  return {
    ...fresh,
    ...value,
    schemaVersion: SCHEMA_VERSION,
    identity: { ...fresh.identity, ...value.identity },
    satisfaction: normalizeRating(value.satisfaction, value.schemaVersion),
    technology: {
      ...fresh.technology,
      ...value.technology,
      rating: normalizeRating(value.technology?.rating, value.schemaVersion),
    },
    aiImpact: { ...fresh.aiImpact, ...value.aiImpact },
    priorities: { ...fresh.priorities, ...value.priorities },
    recommendation: normalizeRating(value.recommendation, value.schemaVersion),
    referralMode: "contact",
    referrals: createReferralSlots(value.referrals),
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
    (typeof draft.satisfaction === "number" && draft.satisfaction <= 3) ||
    (typeof draft.recommendation === "number" && draft.recommendation <= 3)
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

export function validateReferral(referral, required = false) {
  if (isReferralEmpty(referral) && !required) return {};
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
  if (screenIndex === 7) {
    const referralErrors = Array.from({ length: REFERRAL_SLOT_COUNT }, (_, index) => {
      const referral = draft.referrals[index];
      if (!referral) {
        return index < REQUIRED_REFERRAL_COUNT
          ? {
              name: "Agrega su nombre.",
              contact: "Agrega su número o correo.",
              consent: "Confirma que esta persona aceptó compartir sus datos.",
            }
          : {};
      }
      return validateReferral(referral, index < REQUIRED_REFERRAL_COUNT);
    });
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
