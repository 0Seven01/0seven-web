import test from "node:test";
import assert from "node:assert/strict";
import {
  isPreorderOpen,
  parseCutoffTimestamp,
  isProductionEnvironment,
  PREORDER_CONFIG,
} from "./preorder.ts";

const LAGOS_CUTOFF = "2026-10-18T23:59:59+01:00";
const CUTOFF_EPOCH = Date.parse(LAGOS_CUTOFF); // 1792364399000

test("parseCutoffTimestamp parses valid ISO 8601 string with +01:00 offset to exact UTC epoch", () => {
  const parsed = parseCutoffTimestamp(LAGOS_CUTOFF);
  assert.strictEqual(parsed, CUTOFF_EPOCH);
  assert.strictEqual(typeof parsed, "number");
});

test("parseCutoffTimestamp parses valid UTC Z timestamp", () => {
  const parsed = parseCutoffTimestamp("2026-10-18T22:59:59Z");
  assert.strictEqual(parsed, CUTOFF_EPOCH);
});

test("parseCutoffTimestamp rejects strings without timezone offset (fail closed)", () => {
  assert.strictEqual(parseCutoffTimestamp("2026-10-18T23:59:59"), null);
});

test("parseCutoffTimestamp rejects empty, null, undefined or whitespace (fail closed)", () => {
  assert.strictEqual(parseCutoffTimestamp(""), null);
  assert.strictEqual(parseCutoffTimestamp("   "), null);
  assert.strictEqual(parseCutoffTimestamp(null), null);
  assert.strictEqual(parseCutoffTimestamp(undefined), null);
});

test("parseCutoffTimestamp rejects invalid calendar dates and rollovers (fail closed)", () => {
  // February 30th does not exist
  assert.strictEqual(parseCutoffTimestamp("2026-02-30T23:59:59+01:00"), null);
  // April 31st does not exist
  assert.strictEqual(parseCutoffTimestamp("2026-04-31T23:59:59+01:00"), null);
  // Month 13 does not exist
  assert.strictEqual(parseCutoffTimestamp("2026-13-10T23:59:59+01:00"), null);
  // Garbage text
  assert.strictEqual(parseCutoffTimestamp("not-a-date"), null);
});

test("isPreorderOpen returns true when now is before the cutoff", () => {
  const oneSecondBefore = new Date(CUTOFF_EPOCH - 1000);
  assert.strictEqual(
    isPreorderOpen(oneSecondBefore, { cutoff: LAGOS_CUTOFF, isProduction: false }),
    true
  );

  const daysBefore = new Date("2026-10-12T12:00:00+01:00");
  assert.strictEqual(
    isPreorderOpen(daysBefore, { cutoff: LAGOS_CUTOFF, isProduction: false }),
    true
  );
});

test("isPreorderOpen returns false when now is after the cutoff", () => {
  const oneSecondAfter = new Date(CUTOFF_EPOCH + 1000);
  assert.strictEqual(
    isPreorderOpen(oneSecondAfter, { cutoff: LAGOS_CUTOFF, isProduction: false }),
    false
  );

  const eventDay = new Date("2026-10-26T10:00:00+01:00");
  assert.strictEqual(
    isPreorderOpen(eventDay, { cutoff: LAGOS_CUTOFF, isProduction: false }),
    false
  );
});

test("isPreorderOpen fails closed (false) exactly at the cutoff millisecond", () => {
  const exactlyAtCutoff = new Date(CUTOFF_EPOCH);
  assert.strictEqual(
    isPreorderOpen(exactlyAtCutoff, { cutoff: LAGOS_CUTOFF, isProduction: false }),
    false,
    "Exactly at cutoff must be closed (fail-closed boundary)"
  );
});

test("isPreorderOpen fails closed (false) when cutoff is missing or empty", () => {
  const now = new Date("2026-10-12T12:00:00+01:00");
  assert.strictEqual(isPreorderOpen(now, { cutoff: "" }), false);
  assert.strictEqual(isPreorderOpen(now, { cutoff: null }), false);
});

test("isPreorderOpen fails closed (false) when cutoff is invalid or malformed", () => {
  const now = new Date("2026-10-12T12:00:00+01:00");
  assert.strictEqual(isPreorderOpen(now, { cutoff: "invalid-date" }), false);
  assert.strictEqual(isPreorderOpen(now, { cutoff: "2026-10-18 23:59:59" }), false);
});

test("dev override ?preorder=closed forces closed state in preview/dev environment", () => {
  const beforeCutoff = new Date(CUTOFF_EPOCH - 100000);
  assert.strictEqual(
    isPreorderOpen(beforeCutoff, {
      cutoff: LAGOS_CUTOFF,
      override: "closed",
      isProduction: false,
    }),
    false,
    "Dev override closed must force isPreorderOpen to false"
  );
});

test("dev override ?preorder=open forces open state in preview/dev environment", () => {
  const afterCutoff = new Date(CUTOFF_EPOCH + 100000);
  assert.strictEqual(
    isPreorderOpen(afterCutoff, {
      cutoff: LAGOS_CUTOFF,
      override: "open",
      isProduction: false,
    }),
    true,
    "Dev override open must force isPreorderOpen to true in preview"
  );
});

test("dev override is strictly ignored in production environment (tamper resistance)", () => {
  const beforeCutoff = new Date(CUTOFF_EPOCH - 100000);
  assert.strictEqual(
    isPreorderOpen(beforeCutoff, {
      cutoff: LAGOS_CUTOFF,
      override: "closed",
      isProduction: true,
    }),
    true,
    "Production must ignore ?preorder=closed and stay open if before cutoff"
  );

  const afterCutoff = new Date(CUTOFF_EPOCH + 100000);
  assert.strictEqual(
    isPreorderOpen(afterCutoff, {
      cutoff: LAGOS_CUTOFF,
      override: "open",
      isProduction: true,
    }),
    false,
    "Production must ignore ?preorder=open and stay closed after cutoff"
  );
});

test("default PREORDER_CONFIG.cutoff is valid and active", () => {
  const parsed = parseCutoffTimestamp(PREORDER_CONFIG.cutoff.value);
  assert.ok(parsed !== null, "PREORDER_CONFIG.cutoff must be a parseable ISO timestamp");
  assert.strictEqual(parsed, CUTOFF_EPOCH);
});

test("isProductionEnvironment respects explicit options flag", () => {
  assert.strictEqual(isProductionEnvironment({ isProduction: true }), true);
  assert.strictEqual(isProductionEnvironment({ isProduction: false }), false);
});

