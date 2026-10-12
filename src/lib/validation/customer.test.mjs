import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizePhoneNumber,
  normalizeNigerianPhone,
  customerDetailsSchema,
} from "./customer.ts";

test("sanitizePhoneNumber strips spaces, hyphens, dots, and parentheses", () => {
  assert.strictEqual(sanitizePhoneNumber(" +234 (803) 123-4567 "), "+2348031234567");
  assert.strictEqual(sanitizePhoneNumber("080.123.45678"), "08012345678");
  assert.strictEqual(sanitizePhoneNumber(""), "");
  assert.strictEqual(sanitizePhoneNumber(null), "");
});

test("normalizeNigerianPhone normalizes valid local 11-digit prefixes", () => {
  assert.strictEqual(normalizeNigerianPhone("08012345678"), "08012345678");
  assert.strictEqual(normalizeNigerianPhone("07031234567"), "07031234567");
  assert.strictEqual(normalizeNigerianPhone("09012345678"), "09012345678");
  assert.strictEqual(normalizeNigerianPhone("08123456789"), "08123456789");
  assert.strictEqual(normalizeNigerianPhone("09123456789"), "09123456789");
});

test("normalizeNigerianPhone normalizes valid international formats with and without +", () => {
  assert.strictEqual(normalizeNigerianPhone("+2348012345678"), "08012345678");
  assert.strictEqual(normalizeNigerianPhone("+234 801 234 5678"), "08012345678");
  assert.strictEqual(normalizeNigerianPhone("+234-801-234-5678"), "08012345678");
  assert.strictEqual(normalizeNigerianPhone("2348012345678"), "08012345678");
  assert.strictEqual(normalizeNigerianPhone("+23408012345678"), "08012345678");
});

test("normalizeNigerianPhone rejects invalid numbers (fail-closed)", () => {
  // Too short (10 digits)
  assert.strictEqual(normalizeNigerianPhone("0801234567"), null);
  // Too long (12 digits)
  assert.strictEqual(normalizeNigerianPhone("080123456789"), null);
  // Non-mobile prefix (01 landline)
  assert.strictEqual(normalizeNigerianPhone("01234567890"), null);
  // Foreign number
  assert.strictEqual(normalizeNigerianPhone("+12345678901"), null);
  // Letters / garbage
  assert.strictEqual(normalizeNigerianPhone("abcdefghijk"), null);
  // Empty
  assert.strictEqual(normalizeNigerianPhone(""), null);
});

test("customerDetailsSchema validates pickup order successfully without address", () => {
  const result = customerDetailsSchema.safeParse({
    fullName: "Tobi Continental",
    phone: "08012345678",
    deliveryMethod: "pickup",
  });
  assert.strictEqual(result.success, true);
  if (result.success) {
    assert.strictEqual(result.data.fullName, "Tobi Continental");
    assert.strictEqual(result.data.phone, "08012345678");
    assert.strictEqual(result.data.deliveryMethod, "pickup");
  }
});

test("customerDetailsSchema validates delivery order with address successfully", () => {
  const result = customerDetailsSchema.safeParse({
    fullName: "Tobi Continental",
    phone: "+234 801 234 5678",
    deliveryMethod: "delivery",
    deliveryAddress: "12 Marina, Lagos Island",
  });
  assert.strictEqual(result.success, true);
});

test("customerDetailsSchema fails when fullName is empty or too short", () => {
  const result = customerDetailsSchema.safeParse({
    fullName: " ",
    phone: "08012345678",
    deliveryMethod: "pickup",
  });
  assert.strictEqual(result.success, false);
  if (!result.success) {
    const issue = result.error.issues.find((i) => i.path[0] === "fullName");
    assert.ok(issue);
    assert.strictEqual(issue.message, "Enter your full name");
  }
});

test("customerDetailsSchema fails with specific message on invalid phone", () => {
  const result = customerDetailsSchema.safeParse({
    fullName: "Tobi Continental",
    phone: "0801234",
    deliveryMethod: "pickup",
  });
  assert.strictEqual(result.success, false);
  if (!result.success) {
    const issue = result.error.issues.find((i) => i.path[0] === "phone");
    assert.ok(issue);
    assert.strictEqual(issue.message, "Enter an 11-digit phone number, e.g. 08012345678");
  }
});

test("customerDetailsSchema fails when deliveryMethod is delivery but address is missing", () => {
  const result = customerDetailsSchema.safeParse({
    fullName: "Tobi Continental",
    phone: "08012345678",
    deliveryMethod: "delivery",
    deliveryAddress: "   ",
  });
  assert.strictEqual(result.success, false);
  if (!result.success) {
    const issue = result.error.issues.find((i) => i.path[0] === "deliveryAddress");
    assert.ok(issue);
    assert.strictEqual(issue.message, "Enter your delivery area or address");
  }
});
