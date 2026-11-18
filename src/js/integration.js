import { isReferralComplete } from "./model.js";

/**
 * Punto único para preparar la futura conexión con n8n.
 * En demo no se realiza ninguna solicitud de red.
 */
export function prepareSubmissionPayload(draft) {
  return {
    ...structuredClone(draft),
    referrals: draft.referralsConsent
      ? draft.referrals.filter((referral) => isReferralComplete(referral))
      : [],
  };
}

export async function submitSurvey() {
  throw new Error("La recepción remota está desactivada en modo demo.");
}
