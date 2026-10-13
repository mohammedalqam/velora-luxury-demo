import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import React, { act } from "react";
const dom = new JSDOM(
  '<!doctype html><html lang="ar" dir="rtl"><body></body></html>',
  { url: "https://example.test/" },
);
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  localStorage: dom.window.localStorage,
  sessionStorage: dom.window.sessionStorage,
  HTMLElement: dom.window.HTMLElement,
  Event: dom.window.Event,
  MouseEvent: dom.window.MouseEvent,
  IS_REACT_ACT_ENVIRONMENT: true,
});
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
dom.window.matchMedia = () => ({
  matches: false,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {
    return true;
  },
  media: "",
  onchange: null,
});
class Observer {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = "";
  thresholds = [];
}
Object.assign(globalThis, { IntersectionObserver: Observer });
Object.defineProperty(dom.window.HTMLDialogElement.prototype, "showModal", {
  value: function () {
    this.setAttribute("open", "");
  },
});
Object.defineProperty(dom.window.HTMLDialogElement.prototype, "close", {
  value: function () {
    this.removeAttribute("open");
  },
});
const { createRoot } = await import("react-dom/client");
const { StoreProvider, useShop } = await import(
  "../src/components/store-provider"
);
const { ProductCard, Purchase } = await import("../src/components/products");
const { CartDrawer } = await import("../src/components/cart");
const { Shop } = await import("../src/components/shop");
const { products } = await import("../src/data/products");
let state: ReturnType<typeof useShop>;
function Probe() {
  state = useShop();
  return <output data-testid="count">{state.count}</output>;
}
async function mount(children: React.ReactNode) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () =>
    root.render(
      <StoreProvider>
        {children}
        <Probe />
      </StoreProvider>,
    ),
  );
  return {
    container,
    async cleanup() {
      await act(async () => root.unmount());
      container.remove();
      localStorage.clear();
      sessionStorage.clear();
    },
  };
}
async function click(el: Element | null) {
  assert.ok(el);
  await act(async () =>
    el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })),
  );
}
function button(container: Element, text: string) {
  return (
    [...container.querySelectorAll("button")].find((b) =>
      b.textContent?.includes(text),
    ) || null
  );
}
async function input(el: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    dom.window.HTMLInputElement.prototype,
    "value",
  )!.set!;
  await act(async () => {
    setter.call(el, value);
    el.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  });
}

test("invalid persisted JSON falls back safely, then cart survives a fresh mount", async () => {
  localStorage.setItem("velora-demo-v1", "{broken");
  const a = await mount(null);
  assert.equal(state!.count, 0);
  assert.equal(state!.locale, "ar");
  const p = products.find((p) => p.id === "w01")!;
  await act(async () => state!.add(p, "small", "brown", 2));
  assert.equal(state!.count, 2);
  const saved = localStorage.getItem("velora-demo-v1")!;
  await a.cleanup();
  localStorage.setItem("velora-demo-v1", saved);
  const b = await mount(null);
  assert.equal(state!.count, 2);
  assert.equal(state!.cart[0].variant, "small");
  await b.cleanup();
});
test("variant purchase opens the drawer, quantity changes recalculate, removal empties it", async () => {
  const p = products.find((p) => p.id === "f01")!;
  const m = await mount(
    <>
      <Purchase product={p} />
      <CartDrawer />
    </>,
  );
  await click(button(m.container, "١٠٠ مل"));
  await click(button(m.container, "أضف إلى السلة"));
  assert.equal(state!.cart[0].variant, "100ml");
  assert.equal(state!.subtotal, 585);
  assert.ok(m.container.querySelector("dialog[open]"));
  await click(m.container.querySelector('dialog [aria-label="زيادة الكمية"]'));
  assert.equal(state!.count, 2);
  assert.equal(state!.subtotal, 1170);
  await click(m.container.querySelector('dialog button[aria-label^="إزالة"]'));
  assert.equal(state!.count, 0);
  assert.ok(m.container.textContent?.includes("مساحة لشيء مميز"));
  await m.cleanup();
});
test("wishlist toggles, direction changes, and stored data excludes personal fields", async () => {
  const p = products[0];
  const m = await mount(<ProductCard product={p} />);
  const heart = m.container.querySelector(
    'button[aria-label^="حفظ في المفضلة"]',
  );
  await click(heart);
  assert.deepEqual(state!.wishlist, [p.id]);
  await click(heart);
  assert.deepEqual(state!.wishlist, []);
  await act(async () => state!.setLocale("en"));
  assert.equal(document.documentElement.lang, "en");
  assert.equal(document.documentElement.dir, "ltr");
  const stored = JSON.parse(localStorage.getItem("velora-demo-v1")!);
  assert.deepEqual(Object.keys(stored).sort(), [
    "cart",
    "locale",
    "name",
    "preset",
    "recent",
    "wishlist",
  ]);
  await m.cleanup();
});
test("live search, availability, filter reset, and preset changes update the actual catalog", async () => {
  const m = await mount(<Shop />);
  assert.equal(m.container.querySelectorAll(".product-card").length, 24);
  const search = m.container.querySelector(
    'input[aria-label="البحث في المنتجات"]',
  ) as HTMLInputElement;
  await input(search, "Tempo");
  assert.equal(m.container.querySelectorAll(".product-card").length, 1);
  assert.ok(m.container.textContent?.includes("ساعة إيقاع"));
  await input(search, "no-product-found");
  assert.equal(m.container.querySelectorAll(".product-card").length, 0);
  await click(button(m.container, "مسح البحث والفلاتر"));
  assert.equal(m.container.querySelectorAll(".product-card").length, 24);
  await click(
    m.container.querySelector('.filter-sidebar input[type="checkbox"]'),
  );
  assert.equal(m.container.querySelectorAll(".product-card").length, 22);
  await act(async () => state!.setPreset("tech"));
  assert.equal(m.container.querySelectorAll(".product-card").length, 7);
  assert.ok(m.container.textContent?.includes("سماعة ستوديو"));
  await m.cleanup();
});

test("checkout applies promo and delivery, confirms locally, and stores no contact information", async () => {
  const { AppRouterContext } = await import(
    "next/dist/shared/lib/app-router-context.shared-runtime.js"
  );
  const { Checkout, Confirmation } = await import("../src/components/checkout");
  let destination = "";
  const router = {
    bfcacheId: "test-segment",
    push: (href: string) => {
      destination = href;
    },
    replace() {},
    refresh() {},
    back() {},
    forward() {},
    prefetch: async () => {},
  };
  localStorage.setItem(
    "velora-demo-v1",
    JSON.stringify({
      cart: [{ id: "w01", variant: "standard", color: "brown", qty: 1 }],
    }),
  );
  const m = await mount(
    <AppRouterContext.Provider value={router}>
      <Checkout />
    </AppRouterContext.Provider>,
  );
  const radios = m.container.querySelectorAll('input[name="delivery"]');
  await click(radios[1]);
  const area = [...m.container.querySelectorAll("select")][1];
  await act(async () => {
    area.value = "regional";
    area.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
  });
  await input(
    m.container.querySelector("#promo") as HTMLInputElement,
    " velora10 ",
  );
  await act(async () =>
    m.container
      .querySelector(".promo-form")!
      .dispatchEvent(
        new dom.window.Event("submit", { bubbles: true, cancelable: true }),
      ),
  );
  assert.ok(m.container.textContent?.includes("تم تطبيق خصم تجريبي"));
  await click(button(m.container, "تأكيد الطلب التجريبي"));
  assert.ok((button(m.container, "جارٍ تجهيز") as HTMLButtonElement).disabled);
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 720));
  });
  assert.equal(destination, "/confirmation/");
  assert.equal(state!.count, 0);
  const saved = sessionStorage.getItem("velora-demo-order")!,
    order = JSON.parse(saved);
  assert.equal(order.total, 861);
  assert.equal(order.count, 1);
  assert.match(order.reference, /^VL-DEMO-/);
  const persistent = localStorage.getItem("velora-demo-v1")!;
  for (const data of [persistent, saved]) {
    assert.ok(!data.includes("example.test"));
    assert.ok(!data.includes("address"));
    assert.ok(!data.includes("email"));
  }
  await m.cleanup();
  sessionStorage.setItem("velora-demo-order", saved);
  const c = await mount(<Confirmation />);
  assert.ok(c.container.textContent?.includes(order.reference));
  assert.ok(c.container.textContent?.includes("لم يتم إرسال طلب حقيقي"));
  await c.cleanup();
});
test("presentation changes the brand and uses distinct desktop and mobile viewport widths", async () => {
  const { Presentation } = await import("../src/components/presentation");
  const m = await mount(<Presentation />);
  await input(
    m.container.querySelector("#brand-name") as HTMLInputElement,
    "MY LABEL",
  );
  await act(async () =>
    m.container
      .querySelector(".presentation-controls form")!
      .dispatchEvent(
        new dom.window.Event("submit", { bubbles: true, cancelable: true }),
      ),
  );
  assert.equal(state!.name, "MY LABEL");
  assert.equal(
    (m.container.querySelector(".preview-browser") as HTMLElement).style.width,
    "1440px",
  );
  await click(button(m.container, "هاتف"));
  assert.equal(
    (m.container.querySelector(".preview-browser") as HTMLElement).style.width,
    "390px",
  );
  await click(button(m.container, "استعادة"));
  assert.equal(state!.name, "VELORA");
  assert.equal(state!.preset, "lifestyle");
  await m.cleanup();
});
