import test from "node:test";
import assert from "node:assert/strict";
import {
  isPreorderOpen,
  parseCutoffTimestamp,
  isProductionEnvironment,
  PREORDER_CONFIG,
  formatPreorderCutoff,
  formatPreorderEventDate,
  isProductPreorderOpen,
  formatPreorderClosedMessage,
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

test("override: null explicitly suppresses dev overrides and evaluates cutoff", () => {
  const beforeCutoff = new Date(CUTOFF_EPOCH - 100000);
  assert.strictEqual(
    isPreorderOpen(beforeCutoff, {
      cutoff: LAGOS_CUTOFF,
      override: null,
      isProduction: false,
    }),
    true,
    "override: null must bypass dev URL override and return true when before cutoff"
  );

  const afterCutoff = new Date(CUTOFF_EPOCH + 100000);
  assert.strictEqual(
    isPreorderOpen(afterCutoff, {
      cutoff: LAGOS_CUTOFF,
      override: null,
      isProduction: false,
    }),
    false,
    "override: null must bypass dev URL override and return false when after cutoff"
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

test("formatPreorderCutoff formats Africa/Lagos cutoff date correctly", () => {
  const formatted = formatPreorderCutoff(LAGOS_CUTOFF);
  assert.ok(formatted.includes("18 Oct"), `Expected date string to include "18 Oct", got: "${formatted}"`);
  assert.ok(formatted.includes("11:59"), `Expected date string to include "11:59", got: "${formatted}"`);
  assert.strictEqual(formatted, formatPreorderCutoff(), "Default cutoff call must match explicit LAGOS_CUTOFF call");
});

test("formatPreorderCutoff returns empty string for missing or invalid cutoff", () => {
  assert.strictEqual(formatPreorderCutoff(null), "");
  assert.strictEqual(formatPreorderCutoff(""), "");
  assert.strictEqual(formatPreorderCutoff("invalid-date"), "");
});

test("PREORDER_CONFIG.eventName is configured with Kairos Camp Meeting 2026 placeholder", () => {
  assert.strictEqual(PREORDER_CONFIG.eventName.value, "Kairos Camp Meeting 2026");
  assert.strictEqual(PREORDER_CONFIG.eventName.isPlaceholder, true);
});

test("formatPreorderEventDate formats event date to short Lagos format", () => {
  assert.strictEqual(formatPreorderEventDate(), "26 Oct");
  assert.strictEqual(formatPreorderEventDate("2026-10-26"), "26 Oct");
  assert.strictEqual(formatPreorderEventDate("2026-11-05"), "5 Nov");
});

test("formatPreorderEventDate fails closed and returns empty string for missing or invalid date", () => {
  assert.strictEqual(formatPreorderEventDate(null), "");
  assert.strictEqual(formatPreorderEventDate(""), "");
  assert.strictEqual(formatPreorderEventDate("   "), "");
  assert.strictEqual(formatPreorderEventDate("invalid-iso-date"), "");
});

test("isProductPreorderOpen respects campaign state and per-product preorderClosed flag", () => {
  const normalProduct = { id: "p1", name: "Forgiven Tee" };
  const soldOutProduct = { id: "p2", name: "Justified Tee", preorderClosed: true };
  const explicitOpenProduct = { id: "p3", name: "Righteous Tee", preorderClosed: false };

  // When campaign is open:
  assert.strictEqual(isProductPreorderOpen(normalProduct, true), true);
  assert.strictEqual(isProductPreorderOpen(explicitOpenProduct, true), true);
  assert.strictEqual(isProductPreorderOpen(soldOutProduct, true), false);

  // When campaign is closed:
  assert.strictEqual(isProductPreorderOpen(normalProduct, false), false);
  assert.strictEqual(isProductPreorderOpen(explicitOpenProduct, false), false);
  assert.strictEqual(isProductPreorderOpen(soldOutProduct, false), false);
});

test("formatPreorderClosedMessage formats default closed announcement", () => {
  const msg = formatPreorderClosedMessage();
  assert.ok(msg.startsWith("Pre-orders for Kairos Camp Meeting 2026 closed on "));
  assert.ok(msg.includes("18 Oct"));
  assert.ok(msg.endsWith(". Thank you!"));
});

test("formatPreorderClosedMessage formats with custom eventName and cutoff", () => {
  const msg = formatPreorderClosedMessage({
    eventName: "our 26 October event",
    cutoff: "2026-10-20T20:00:00+01:00",
  });
  assert.ok(msg.startsWith("Pre-orders for our 26 October event closed on "));
  assert.ok(msg.includes("20 Oct"));
  assert.ok(msg.endsWith(". Thank you!"));
});

test("formatPreorderClosedMessage fails closed when cutoff is missing or invalid", () => {
  const msg1 = formatPreorderClosedMessage({ cutoff: null });
  assert.strictEqual(
    msg1,
    "Pre-orders for Kairos Camp Meeting 2026 are now closed. Thank you!"
  );

  const msg2 = formatPreorderClosedMessage({
    eventName: "the 26 October event",
    cutoff: "invalid-cutoff",
  });
  assert.strictEqual(
    msg2,
    "Pre-orders for the 26 October event are now closed. Thank you!"
  );
});



