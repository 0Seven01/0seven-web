import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizePublicId,
  buildCloudinaryUrl,
  buildCloudinaryLqipUrl,
} from "./cloudinary.ts";

test("sanitizePublicId strips leading slashes, whitespace, and image extensions", () => {
  assert.strictEqual(sanitizePublicId(""), "");
  assert.strictEqual(sanitizePublicId("   "), "");
  assert.strictEqual(
    sanitizePublicId("/forgiven--black-hanger"),
    "forgiven--black-hanger"
  );
  assert.strictEqual(
    sanitizePublicId("///god-is-always-in-control--black-studio"),
    "god-is-always-in-control--black-studio"
  );
  assert.strictEqual(
    sanitizePublicId("im-righteous--black-model.webp"),
    "im-righteous--black-model"
  );
  assert.strictEqual(
    sanitizePublicId("justified--green-model-street.jpg"),
    "justified--green-model-street"
  );
  assert.strictEqual(
    sanitizePublicId("/justified--green-model-street.PNG"),
    "justified--green-model-street"
  );
});

test("buildCloudinaryUrl generates standard delivery URL with f_auto,q_auto,w_{width}", () => {
  const urlWithWidth = buildCloudinaryUrl("justified--green-model-street", {
    width: 800,
  });
  assert.strictEqual(
    urlWithWidth,
    "https://res.cloudinary.com/mdsiynsc/image/upload/f_auto,q_auto,w_800/justified--green-model-street"
  );

  const urlWithoutWidth = buildCloudinaryUrl("forgiven--black-hanger");
  assert.strictEqual(
    urlWithoutWidth,
    "https://res.cloudinary.com/mdsiynsc/image/upload/f_auto,q_auto/forgiven--black-hanger"
  );

  const urlWithCustomQuality = buildCloudinaryUrl("im-righteous--black-model", {
    width: 600,
    quality: 85,
  });
  assert.strictEqual(
    urlWithCustomQuality,
    "https://res.cloudinary.com/mdsiynsc/image/upload/f_auto,q_85,w_600/im-righteous--black-model"
  );
});

test("buildCloudinaryUrl automatically sanitizes input public IDs", () => {
  const url = buildCloudinaryUrl("/god-is-always-in-control--black-studio.webp", {
    width: 400,
  });
  assert.strictEqual(
    url,
    "https://res.cloudinary.com/mdsiynsc/image/upload/f_auto,q_auto,w_400/god-is-always-in-control--black-studio"
  );
});

test("buildCloudinaryUrl fails closed when publicId is empty", () => {
  assert.strictEqual(buildCloudinaryUrl(""), "");
  assert.strictEqual(buildCloudinaryUrl("   "), "");
});

test("buildCloudinaryLqipUrl generates LQIP transformation URL for blurDataURL", () => {
  const lqipUrl = buildCloudinaryLqipUrl("justified--green-model-street");
  assert.strictEqual(
    lqipUrl,
    "https://res.cloudinary.com/mdsiynsc/image/upload/q_10,w_20,e_blur:1000/justified--green-model-street"
  );

  const sanitizedLqipUrl = buildCloudinaryLqipUrl(
    "/forgiven--neon-green-flatlay.webp"
  );
  assert.strictEqual(
    sanitizedLqipUrl,
    "https://res.cloudinary.com/mdsiynsc/image/upload/q_10,w_20,e_blur:1000/forgiven--neon-green-flatlay"
  );

  assert.strictEqual(buildCloudinaryLqipUrl(""), "");
});
