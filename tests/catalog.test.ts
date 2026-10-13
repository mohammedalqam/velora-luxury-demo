import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  products,
  getCatalog,
  getCategories,
  categories,
} from "../src/data/products.ts";
test("the complete primary catalog contains 24 distinct products in four collections", () => {
  const p = getCatalog("lifestyle");
  assert.equal(p.length, 24);
  assert.equal(new Set(p.map((p) => p.slug)).size, 24);
  assert.equal(getCategories("lifestyle").length, 4);
  for (const c of getCategories("lifestyle"))
    assert.equal(p.filter((p) => p.category === c.id).length, 6);
});
test("every catalog record has translations, a real local image, and valid purchasable variants", () => {
  for (const p of products) {
    assert.ok(p.name.ar && p.name.en && p.description.ar && p.description.en);
    assert.ok(categories.some((c) => c.id === p.category));
    assert.ok(Number.isFinite(p.price) && p.price > 0);
    assert.ok(p.variants.length);
    assert.ok(p.colors.length);
    for (const v of p.variants) {
      assert.ok(Number.isSafeInteger(v.stock) && v.stock >= 0);
      assert.ok(v.price > 0);
    }
    for (const image of p.images)
      assert.ok(existsSync("public" + image), image);
  }
});
test("industry presets have distinct catalogs with relevant size and spec data", () => {
  const fashion = getCatalog("fashion"),
    tech = getCatalog("tech"),
    jewelry = getCatalog("jewelry");
  assert.ok(
    fashion.some((p) => p.category === "apparel" && p.variants.length >= 3),
  );
  assert.ok(
    tech.length >= 6 &&
      tech.every((p) => p.category === "audio" || p.category === "technology"),
  );
  assert.ok(
    jewelry.every((p) => p.category === "jewelry" || p.category === "watches"),
  );
  assert.equal(new Set(products.map((p) => p.id)).size, products.length);
  assert.equal(new Set(products.map((p) => p.slug)).size, products.length);
});
