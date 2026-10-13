import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeCart,
  cartSubtotal,
  calculateTotals,
  validPromo,
  safeIds,
  lineKey,
} from "../src/lib/commerce.ts";
const catalog = [
  {
    id: "watch",
    colors: [{ id: "brown" }],
    variants: [
      { id: "standard", price: 890, stock: 5 },
      { id: "small", price: 740, stock: 2 },
    ],
  },
  {
    id: "ring",
    colors: [{ id: "silver" }],
    variants: [{ id: "7", price: 420, stock: 0 }],
  },
];
const base = { id: "watch", color: "brown", variant: "standard", qty: 1 };
test("corrupt storage cannot create invalid cart quantities or products", () => {
  for (const raw of [null, {}, "invalid", 1])
    assert.deepEqual(sanitizeCart(raw, catalog), []);
  assert.deepEqual(
    sanitizeCart(
      [
        null,
        { ...base, qty: -1 },
        { ...base, qty: Infinity },
        { ...base, qty: 1.5 },
        { ...base, id: "unknown" },
        { ...base, color: "forged" },
        { ...base, variant: "unknown" },
      ],
      catalog,
    ),
    [],
  );
});
test("duplicate lines merge and respect stock instead of overcounting", () => {
  const result = sanitizeCart(
    [
      { ...base, qty: 4 },
      { ...base, qty: 4 },
    ],
    catalog,
  );
  assert.deepEqual(result, [{ ...base, qty: 5 }]);
  assert.equal(cartSubtotal(result, catalog), 4450);
});
test("out of stock variants cannot be restored to a cart", () => {
  assert.deepEqual(
    sanitizeCart(
      [{ id: "ring", color: "silver", variant: "7", qty: 1 }],
      catalog,
    ),
    [],
  );
});
test("selected variants affect the subtotal and remain separate lines", () => {
  const lines = [
    { ...base, qty: 2 },
    { ...base, variant: "small", qty: 1 },
  ];
  assert.equal(cartSubtotal(lines, catalog), 2520);
  assert.notEqual(lineKey(lines[0]), lineKey(lines[1]));
});
test("standard shipping becomes free at the exact boundary before discounts", () => {
  assert.equal(
    calculateTotals(899.99, "standard", "local", false).shipping,
    25,
  );
  const totals = calculateTotals(900, "standard", "regional", true);
  assert.deepEqual(totals, {
    subtotal: 900,
    discount: 90,
    shipping: 0,
    total: 810,
  });
});
test("express and regional charges are computed independently of promo", () => {
  assert.deepEqual(calculateTotals(1000, "express", "regional", true), {
    subtotal: 1000,
    discount: 100,
    shipping: 60,
    total: 960,
  });
  assert.equal(
    calculateTotals(100, "collection", "regional", false).shipping,
    0,
  );
});
test("empty or invalid subtotals never produce negative totals", () => {
  for (const subtotal of [-100, NaN, Infinity, 0])
    assert.deepEqual(calculateTotals(subtotal, "express", "regional", true), {
      subtotal: 0,
      discount: 0,
      shipping: 0,
      total: 0,
    });
});
test("demo promo is normalized and unknown codes rejected", () => {
  assert.ok(validPromo("  velora10 "));
  assert.equal(validPromo("FREE"), false);
  assert.equal(validPromo(""), false);
});
test("wishlist and recent IDs reject unknown values and deduplicate", () => {
  assert.deepEqual(safeIds(["watch", "bad", "watch", null, 2], ["watch"]), [
    "watch",
  ]);
  assert.deepEqual(safeIds({ id: "watch" }, ["watch"]), []);
});
