export type CartLine = {
  id: string;
  variant: string;
  color: string;
  qty: number;
};
type CatalogItem = {
  id: string;
  colors: { id: string }[];
  variants: { id: string; price: number; stock: number }[];
};
export const lineKey = (l: Pick<CartLine, "id" | "variant" | "color">) =>
  `${l.id}:${l.variant}:${l.color}`;
export function sanitizeCart(
  raw: unknown,
  products: CatalogItem[],
): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const lines = new Map<string, CartLine>();
  for (const x of raw.slice(0, 100)) {
    if (
      !x ||
      typeof x !== "object" ||
      typeof x.id !== "string" ||
      typeof x.variant !== "string" ||
      typeof x.color !== "string" ||
      !Number.isSafeInteger(x.qty) ||
      x.qty <= 0
    )
      continue;
    const p = products.find((p) => p.id === x.id),
      v = p?.variants.find((v) => v.id === x.variant);
    if (!p || !v || v.stock <= 0 || !p.colors.some((c) => c.id === x.color))
      continue;
    const key = lineKey(x),
      prior = lines.get(key)?.qty || 0;
    lines.set(key, {
      id: x.id,
      variant: x.variant,
      color: x.color,
      qty: Math.min(v.stock, 20, x.qty + prior),
    });
  }
  return [...lines.values()];
}
export function cartSubtotal(lines: CartLine[], products: CatalogItem[]) {
  return (
    Math.round(
      sanitizeCart(lines, products).reduce(
        (sum, l) =>
          sum +
          products
            .find((p) => p.id === l.id)!
            .variants.find((v) => v.id === l.variant)!.price *
            l.qty,
        0,
      ) * 100,
    ) / 100
  );
}
export const validPromo = (code: string) =>
  code.trim().toUpperCase() === "VELORA10";
export function calculateTotals(
  subtotal: number,
  method: "standard" | "express" | "collection",
  region: "local" | "regional",
  promo: boolean,
  shipping = {
    freeAbove: 900,
    standard: 25,
    express: 45,
    collection: 0,
    regionalSurcharge: 15,
  },
) {
  const safe = Math.max(0, Number.isFinite(subtotal) ? subtotal : 0);
  const discount = promo ? Math.round(safe * 10) / 100 : 0;
  const shippingFee =
    safe === 0 || method === "collection"
      ? 0
      : method === "standard" && safe >= shipping.freeAbove
        ? 0
        : shipping[method] +
          (region === "regional" ? shipping.regionalSurcharge : 0);
  return {
    subtotal: safe,
    discount,
    shipping: shippingFee,
    total: Math.round((safe - discount + shippingFee) * 100) / 100,
  };
}
export function safeIds(raw: unknown, ids: string[]) {
  return Array.isArray(raw)
    ? [
        ...new Set(
          raw.filter(
            (x): x is string => typeof x === "string" && ids.includes(x),
          ),
        ),
      ].slice(0, 100)
    : [];
}
