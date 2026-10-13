"use client";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "./store-provider";
import { products } from "@/data/products";
import { lineKey } from "@/lib/commerce";
import { storeConfig } from "@/config/store.config";
import { Dialog, Photo, Quantity, Empty, Forward } from "./ui";
export function CartLines({ compact = false }: { compact?: boolean }) {
  const { cart, text, t, money, quantity, remove } = useShop();
  return (
    <div className={"cart-lines " + (compact ? "compact" : "")}>
      {cart.map((l) => {
        const p = products.find((p) => p.id === l.id)!;
        const v = p.variants.find((v) => v.id === l.variant)!;
        const key = lineKey(l);
        return (
          <div key={key} className="cart-line">
            <Link
              href={"/products/" + p.slug + "/"}
              tabIndex={compact ? -1 : 0}
            >
              <Photo product={p} />
            </Link>
            <div className="cart-line-info">
              <Link
                className="cart-product-name"
                href={"/products/" + p.slug + "/"}
              >
                {text(p.name)}
              </Link>
              <p className="micro">
                {text(p.colors.find((c) => c.id === l.color)!.name)} ·{" "}
                {text(v.name)}
              </p>
              <span className="price">{money(v.price * l.qty)}</span>
              {!compact ? (
                <div className="cart-line-actions">
                  <Quantity
                    value={l.qty}
                    max={Math.min(20, v.stock)}
                    onChange={(n) => quantity(key, n)}
                  />
                  <button
                    className="icon-button"
                    onClick={() => remove(key)}
                    aria-label={t("إزالة ", "Remove ") + text(p.name)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <span className="micro">
                  {t("الكمية: ", "Quantity: ")}
                  {l.qty}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export function CartSummary({ onNavigate }: { onNavigate?: () => void }) {
  const { subtotal, t, money } = useShop();
  const remaining = Math.max(0, storeConfig.shipping.freeAbove - subtotal);
  return (
    <div className="cart-summary">
      <div className="shipping-progress">
        <p>
          {remaining > 0
            ? t(
                "تبقّى " +
                  money(remaining) +
                  " للتوصيل القياسي المجاني في الديمو.",
                money(remaining) + " away from free standard demo delivery.",
              )
            : t(
                "وصلت إلى التوصيل القياسي المجاني في الديمو.",
                "Your demo order qualifies for free standard delivery.",
              )}
        </p>
        <div>
          <span
            style={{
              width:
                Math.min(
                  100,
                  (subtotal / storeConfig.shipping.freeAbove) * 100,
                ) + "%",
            }}
          />
        </div>
      </div>
      <div className="total-row">
        <span>{t("المجموع الفرعي", "Subtotal")}</span>
        <b>{money(subtotal)}</b>
      </div>
      <p className="micro">
        {t(
          "تُحسب رسوم التوصيل في الخطوة التالية.",
          "Delivery is calculated at the next step.",
        )}
      </p>
      <Link href="/checkout/" className="button full" onClick={onNavigate}>
        {t("إتمام الطلب التجريبي", "Continue to demo checkout")}
        <Forward />
      </Link>
      <p className="demo-caption">
        {t(
          "لا يُرسل طلب حقيقي ولا يُحصّل أي مبلغ.",
          "No real order is placed and no payment is collected.",
        )}
      </p>
    </div>
  );
}
export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, t, count } = useShop();
  return (
    <Dialog
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      title={t("سلة اختياراتك", "Your considered edit") + " (" + count + ")"}
      side
    >
      {cart.length ? (
        <>
          <CartLines />
          <CartSummary onNavigate={() => setCartOpen(false)} />
          <button
            className="text-link continue-shopping"
            onClick={() => setCartOpen(false)}
          >
            {t("تابع الاستكشاف", "Continue exploring")}
            <Forward />
          </button>
        </>
      ) : (
        <Empty
          symbol={<ShoppingBag size={40} />}
          title={t("مساحة لشيء مميز", "Room for something special")}
          description={t(
            "ابدأ بقطعة تلفت انتباهك. ستجد اختياراتك هنا.",
            "Start with a piece that catches your eye. Your selections will appear here.",
          )}
        />
      )}
    </Dialog>
  );
}
export function CartPage() {
  const { cart, t, count, ready } = useShop();
  return (
    <section className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">
          {t("مختارة بعناية", "A CONSIDERED EDIT")}
        </span>
        <h1>
          {t("سلة اختياراتك", "Your bag")} <sup>{count}</sup>
        </h1>
      </div>
      {!ready ? (
        <div className="skeleton large-skeleton" />
      ) : cart.length ? (
        <div className="cart-page-layout">
          <CartLines />
          <CartSummary />
        </div>
      ) : (
        <Empty
          symbol={<ShoppingBag size={40} />}
          title={t("اختياراتك تبدأ هنا", "Your edit starts here")}
          description={t(
            "لم تضف أي قطعة بعد. اكتشف المجموعة واحفظ ما يعجبك.",
            "Your bag is waiting. Explore the collection and make it yours.",
          )}
        />
      )}
    </section>
  );
}
