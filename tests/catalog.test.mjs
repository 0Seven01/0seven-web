import test from "node:test";
import assert from "node:assert/strict";
import {
  listCategories,
  getCategory,
  listProducts,
  getProduct,
} from "../src/lib/catalog.ts";

test("listCategories returns only active categories and excludes inactive ones", async () => {
  const categories = await listCategories();
  const slugs = categories.map((c) => c.slug);

  assert.ok(slugs.includes("t-shirts"), "Active category t-shirts should be included");
  assert.ok(!slugs.includes("hoodies"), "Inactive category hoodies must be excluded");
  assert.ok(!slugs.includes("sweatshirts"), "Inactive category sweatshirts must be excluded");
  assert.ok(!slugs.includes("roundnecks"), "Inactive category roundnecks must be excluded");
  assert.ok(!slugs.includes("caps"), "Inactive category caps must be excluded");
  assert.strictEqual(categories.length, 1, "Exactly one category should be active for PO-1");
  assert.strictEqual(categories[0].active, true);
});

test("getCategory returns category object for active category", async () => {
  const tshirts = await getCategory("t-shirts");
  assert.ok(tshirts !== null);
  assert.strictEqual(tshirts?.slug, "t-shirts");
  assert.strictEqual(tshirts?.name, "T-Shirts");
  assert.strictEqual(tshirts?.active, true);
});

test("getCategory returns null for inactive and nonexistent categories (fail closed)", async () => {
  const hoodies = await getCategory("hoodies");
  assert.strictEqual(hoodies, null, "Inactive category hoodies must return null");

  const sweatshirts = await getCategory("sweatshirts");
  assert.strictEqual(sweatshirts, null, "Inactive category sweatshirts must return null");

  const roundnecks = await getCategory("roundnecks");
  assert.strictEqual(roundnecks, null, "Inactive category roundnecks must return null");

  const caps = await getCategory("caps");
  assert.strictEqual(caps, null, "Inactive category caps must return null");

  const nonexistent = await getCategory("nonexistent-cat");
  assert.strictEqual(nonexistent, null, "Unknown category must return null");
});

test("listProducts filters out products for inactive categories", async () => {
  const allProducts = await listProducts();
  assert.ok(allProducts.length > 0);
  assert.ok(allProducts.every((p) => p.categorySlug === "t-shirts"));

  const hoodiesProducts = await listProducts("hoodies");
  assert.deepStrictEqual(hoodiesProducts, []);

  const tshirtProducts = await listProducts("t-shirts");
  assert.strictEqual(tshirtProducts.length, 5);
});

test("getProduct fails closed with null if category is inactive", async () => {
  const inactiveResult = await getProduct("hoodies", "forgiven");
  assert.strictEqual(inactiveResult, null);

  const activeResult = await getProduct("t-shirts", "forgiven");
  assert.ok(activeResult !== null);
  assert.strictEqual(activeResult?.slug, "forgiven");
});

test("getProduct returns Anegkletos product with active white variants and scripture", async () => {
  const anegkletos = await getProduct("t-shirts", "anegkletos");
  assert.ok(anegkletos !== null);
  assert.strictEqual(anegkletos?.name, "Anegkletos");
  assert.strictEqual(anegkletos?.slug, "anegkletos");
  assert.strictEqual(anegkletos?.scriptureRef, "Col 1:22");
  assert.strictEqual(anegkletos?.images.length, 1);
  assert.strictEqual(anegkletos?.images[0].url, "anegkletos--white-studio");
  assert.strictEqual(anegkletos?.images[0].colourName, "White");
  assert.strictEqual(anegkletos?.variants.length, 10);
  const activeVariants = anegkletos?.variants.filter((v) => v.active);
  assert.strictEqual(activeVariants?.length, 6);
  assert.ok(activeVariants?.every((v) => v.colour.name === "White"));
});

