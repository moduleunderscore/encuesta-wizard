import { isReferralComplete } from "./model.js";

export const SURVEY_WEBHOOK_URL =
  "https://intelligencewizard.app.n8n.cloud/webhook/wizard-encuesta-clientes-v1";

export function prepareSubmissionPayload(draft) {
  return {
    ...structuredClone(draft),
    submissionId: draft.draftId,
    completedAt: draft.completedAt || new Date().toISOString(),
    client: {
      locale: globalThis.navigator?.language || "es-MX",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Mexico_City",
    },
    referrals: draft.referralsConsent
      ? draft.referrals.filter((referral) => isReferralComplete(referral))
      : [],
  };
}

export async function submitSurvey(
  draft,
  {
    fetchImpl = globalThis.fetch,
    endpoint = SURVEY_WEBHOOK_URL,
    timeoutMs = 15_000,
  } = {},
) {
  if (typeof fetchImpl !== "function") {
    throw new Error("No se pudo iniciar la conexión de envío.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(prepareSubmissionPayload(draft)),
      cache: "no-store",
      credentials: "omit",
      mode: "cors",
      signal: controller.signal,
    });
    const responseText = await response.text();
    let receipt = {};
    try {
      receipt = responseText ? JSON.parse(responseText) : {};
    } catch {
      throw new Error("Wizard recibió una respuesta inválida. Intenta de nuevo.");
    }

    if (!response.ok || receipt.ok !== true) {
      throw new Error(receipt.message || "No pudimos guardar tus respuestas. Intenta de nuevo.");
    }
    return receipt;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("El envío tardó demasiado. Revisa tu conexión e intenta de nuevo.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
