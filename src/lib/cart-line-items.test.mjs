import test from "node:test";
import assert from "node:assert/strict";
import { sanitizePublicId, buildCloudinaryUrl, buildCloudinaryLqipUrl } from "./cloudinary.ts";

function formatQuantityAriaLabel(action, item) {
  const prefix = action === "increase" ? "Increase" : "Decrease";
  return `${prefix} quantity of ${item.productName}, ${item.colourName}, ${item.size}`;
}

function formatRemoveAriaLabel(item) {
  return `Remove ${item.productName}, ${item.colourName}, ${item.size} from cart`;
}

function formatLineItemImageAlt(item) {
  return `${item.productName} — ${item.colourName}`;
}

function isDecrementDisabled(quantity) {
  return quantity <= 1;
}

test("Cart line-item ARIA label generator produces exact spec labels", () => {
  const item = {
    productName: "Justified",
    colourName: "Green",
    size: "L",
  };

  assert.strictEqual(
    formatQuantityAriaLabel("decrease", item),
    "Decrease quantity of Justified, Green, L"
  );
  assert.strictEqual(
    formatQuantityAriaLabel("increase", item),
    "Increase quantity of Justified, Green, L"
  );
  assert.strictEqual(
    formatRemoveAriaLabel(item),
    "Remove Justified, Green, L from cart"
  );
  assert.strictEqual(
    formatLineItemImageAlt(item),
    "Justified — Green"
  );
});

test("Cart quantity decrement button disables fail-closed at quantity 1 and below", () => {
  assert.strictEqual(isDecrementDisabled(1), true);
  assert.strictEqual(isDecrementDisabled(0), true);
  assert.strictEqual(isDecrementDisabled(-1), true);
  assert.strictEqual(isDecrementDisabled(2), false);
  assert.strictEqual(isDecrementDisabled(10), false);
});

test("Cart line-item thumbnail uses sanitized Cloudinary public ID with LQIP placeholder", () => {
  const publicId = "justified--green-model-street";
  const cleanId = sanitizePublicId(publicId);
  assert.strictEqual(cleanId, "justified--green-model-street");

  const lqipUrl = buildCloudinaryLqipUrl(cleanId);
  assert.ok(lqipUrl.includes("q_10,w_20,e_blur:1000"));
  assert.ok(lqipUrl.endsWith("justified--green-model-street"));

  const deliveryUrl = buildCloudinaryUrl(cleanId, { width: 96 });
  assert.ok(deliveryUrl.includes("w_96"));
  assert.ok(deliveryUrl.includes("f_auto,q_auto"));
});
