import test from "node:test";
import assert from "node:assert/strict";

import { prepareSubmissionPayload } from "../src/js/integration.js";
import {
  createDraft,
  createReferral,
  isLowExperience,
  isReferralComplete,
  normalizeDraft,
  togglePriority,
  validateReferral,
  validateScreen,
} from "../src/js/model.js";

test("a new demo draft uses null for unanswered ratings", () => {
  const draft = createDraft(new Date("2026-11-18T12:00:00.000Z"));
  assert.equal(draft.demo, true);
  assert.equal(draft.mode, "demo");
  assert.equal(draft.satisfaction, null);
  assert.equal(draft.technology.rating, null);
  assert.equal(draft.recommendation, null);
  assert.equal(draft.referralsConsent, false);
  assert.equal(draft.completedAt, null);
});

test("priority selection enforces two choices and exclusive uncertainty", () => {
  const draft = createDraft();
  assert.equal(togglePriority(draft, "new_clients").changed, true);
  assert.equal(togglePriority(draft, "follow_up").changed, true);
  assert.equal(togglePriority(draft, "operations").changed, false);
  assert.deepEqual(draft.priorities.selected, ["new_clients", "follow_up"]);

  togglePriority(draft, "unclear");
  assert.deepEqual(draft.priorities.selected, ["unclear"]);
  togglePriority(draft, "decisions");
  assert.deepEqual(draft.priorities.selected, ["decisions"]);
});

test("optional empty referrals do not block but required or partial referrals do", () => {
  const referral = createReferral();
  assert.deepEqual(validateReferral(referral), {});
  assert.equal(isReferralComplete(referral), false);
  assert.deepEqual(validateReferral(referral, true), {
    name: "Agrega su nombre.",
    contact: "Agrega su número.",
  });

  referral.name = "Ana";
  assert.deepEqual(validateReferral(referral), {
    contact: "Agrega su número.",
  });
});

test("well-formed referrals are complete independently of group consent", () => {
  const referral = createReferral();
  Object.assign(referral, {
    name: "Ana",
    channel: "email",
    contact: "ana@empresa.mx",
  });
  assert.equal(isReferralComplete(referral), true);

  referral.contact = "correo-invalido";
  assert.equal(isReferralComplete(referral), false);
});

test("required question validation is screen-specific", () => {
  const draft = createDraft();
  const identityErrors = validateScreen(1, draft);
  assert.equal(identityErrors.identityName, "Escribe tu nombre.");
  assert.equal(identityErrors.identityCompany, "Escribe el nombre de tu empresa.");
  draft.identity.name = "Ana";
  draft.identity.company = "Empresa Demo";
  assert.deepEqual(validateScreen(1, draft), {});

  assert.ok(validateScreen(2, draft).satisfaction);
  draft.satisfaction = 4;
  assert.deepEqual(validateScreen(2, draft), {});

  assert.ok(validateScreen(3, draft).technology);
  draft.technology.insufficientExperience = true;
  assert.deepEqual(validateScreen(3, draft), {});
});

test("screen eight requires three complete referrals and keeps five slots", () => {
  const draft = createDraft();
  assert.equal(draft.referrals.length, 5);
  assert.equal(validateScreen(7, draft).referrals.length, 5);

  draft.referrals.slice(0, 3).forEach((referral, index) => {
    Object.assign(referral, {
      name: `Contacto ${index + 1}`,
      contact: `+52 55 1234 567${index}`,
    });
  });
  assert.equal(validateScreen(7, draft).referralsConsent.length > 0, true);
  draft.referralsConsent = true;
  assert.deepEqual(validateScreen(7, draft), {});
});

test("ratings of three or less activate improvement-first routing", () => {
  const draft = createDraft();
  draft.satisfaction = 3;
  assert.equal(isLowExperience(draft), true);
  draft.satisfaction = 4;
  draft.recommendation = 3;
  assert.equal(isLowExperience(draft), true);
  draft.recommendation = 4;
  assert.equal(isLowExperience(draft), false);
});

test("future payload includes complete referrals only after group consent", () => {
  const draft = createDraft();
  const valid = createReferral();
  Object.assign(valid, {
    name: "Ana",
    channel: "whatsapp",
    contact: "+52 55 1234 5678",
  });
  const incomplete = createReferral();
  incomplete.name = "Luis";
  const secondValid = createReferral();
  Object.assign(secondValid, {
    name: "Mara",
    channel: "email",
    contact: "mara@empresa.mx",
  });
  draft.referrals = [valid, incomplete, secondValid];

  assert.equal(prepareSubmissionPayload(draft).referrals.length, 0);
  draft.referralsConsent = true;
  const payload = prepareSubmissionPayload(draft);
  assert.equal(payload.referrals.length, 2);
  assert.equal(payload.referrals[0].name, "Ana");
});

test("normalization restores nested defaults and clamps the screen", () => {
  const base = createDraft();
  const restored = normalizeDraft({
    ...base,
    currentScreen: 42,
    technology: { rating: 5 },
  });
  assert.equal(restored.currentScreen, 9);
  assert.equal(restored.technology.rating, 5);
  assert.equal(restored.technology.insufficientExperience, false);
  assert.equal(restored.referrals.length, 5);
});

test("legacy drafts require fresh group consent and drop per-contact consent", () => {
  const legacy = {
    ...createDraft(),
    schemaVersion: "1.1.0",
    referralsConsent: true,
    referrals: [{ ...createReferral(), name: "Ana", consent: true }],
  };
  const restored = normalizeDraft(legacy);
  assert.equal(restored.schemaVersion, "1.2.0");
  assert.equal(restored.referralsConsent, false);
  assert.equal("consent" in restored.referrals[0], false);
});

test("normalization migrates legacy ten-point ratings to five points", () => {
  const legacy = {
    ...createDraft(),
    schemaVersion: "1.0.0",
    satisfaction: 8,
    technology: { rating: 7, insufficientExperience: false },
    recommendation: 6,
  };
  const restored = normalizeDraft(legacy);
  assert.equal(restored.schemaVersion, "1.2.0");
  assert.equal(restored.satisfaction, 4);
  assert.equal(restored.technology.rating, 4);
  assert.equal(restored.recommendation, 3);
});
