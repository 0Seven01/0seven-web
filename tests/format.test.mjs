import test from "node:test";
import assert from "node:assert/strict";
import { formatNaira, formatWhatsAppNumber } from "../src/lib/format.ts";

test("formatNaira formats kobo into Nigerian Naira currency string", () => {
  assert.strictEqual(formatNaira(1500000), "₦15,000");
  assert.strictEqual(formatNaira(0), "₦0");
  assert.strictEqual(formatNaira(4500000), "₦45,000");
});

test("formatWhatsAppNumber formats 13-digit Nigerian number with country code", () => {
  assert.strictEqual(formatWhatsAppNumber("2347034306187"), "+234 703 430 6187");
  assert.strictEqual(formatWhatsAppNumber("+2347034306187"), "+234 703 430 6187");
});

test("formatWhatsAppNumber formats 11-digit local Nigerian number", () => {
  assert.strictEqual(formatWhatsAppNumber("07034306187"), "+234 703 430 6187");
  assert.strictEqual(formatWhatsAppNumber("08012345678"), "+234 801 234 5678");
});

test("formatWhatsAppNumber returns empty string for empty input and handles other numbers", () => {
  assert.strictEqual(formatWhatsAppNumber(""), "");
  assert.strictEqual(formatWhatsAppNumber("+14155552671"), "+14155552671");
});
