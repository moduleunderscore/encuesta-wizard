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

test("empty referrals do not block but partial referrals show missing data", () => {
  const referral = createReferral();
  assert.deepEqual(validateReferral(referral), {});
  assert.equal(isReferralComplete(referral), false);

  referral.name = "Ana";
  assert.deepEqual(validateReferral(referral), {
    contact: "Agrega su número.",
    consent: "Confirma que esta persona aceptó compartir sus datos.",
  });
});

test("authorized and well-formed referrals are complete", () => {
  const referral = createReferral();
  Object.assign(referral, {
    name: "Ana",
    channel: "email",
    contact: "ana@empresa.mx",
    consent: true,
  });
  assert.equal(isReferralComplete(referral), true);

  referral.contact = "correo-invalido";
  assert.equal(isReferralComplete(referral), false);
});

test("required question validation is screen-specific", () => {
  const draft = createDraft();
  assert.ok(validateScreen(2, draft).satisfaction);
  draft.satisfaction = 8;
  assert.deepEqual(validateScreen(2, draft), {});

  assert.ok(validateScreen(3, draft).technology);
  draft.technology.insufficientExperience = true;
  assert.deepEqual(validateScreen(3, draft), {});
});

test("low satisfaction or recommendation activates improvement-first routing", () => {
  const draft = createDraft();
  draft.satisfaction = 6;
  assert.equal(isLowExperience(draft), true);
  draft.satisfaction = 9;
  draft.recommendation = 6;
  assert.equal(isLowExperience(draft), true);
  draft.recommendation = 8;
  assert.equal(isLowExperience(draft), false);
});

test("future payload includes only complete and authorized referrals", () => {
  const draft = createDraft();
  const valid = createReferral();
  Object.assign(valid, {
    name: "Ana",
    channel: "whatsapp",
    contact: "+52 55 1234 5678",
    consent: true,
  });
  const incomplete = createReferral();
  incomplete.name = "Luis";
  const unauthorized = createReferral();
  Object.assign(unauthorized, {
    name: "Mara",
    channel: "email",
    contact: "mara@empresa.mx",
    consent: false,
  });
  draft.referrals = [valid, incomplete, unauthorized];

  const payload = prepareSubmissionPayload(draft);
  assert.equal(payload.referrals.length, 1);
  assert.equal(payload.referrals[0].name, "Ana");
});

test("normalization restores nested defaults and clamps the screen", () => {
  const base = createDraft();
  const restored = normalizeDraft({
    ...base,
    currentScreen: 42,
    technology: { rating: 7 },
  });
  assert.equal(restored.currentScreen, 9);
  assert.equal(restored.technology.rating, 7);
  assert.equal(restored.technology.insufficientExperience, false);
});
