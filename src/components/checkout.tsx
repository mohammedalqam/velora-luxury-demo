"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Check,
  Package,
  Truck,
  MapPin,
  Loader2,
} from "lucide-react";
import { useShop } from "./store-provider";
import { calculateTotals, validPromo } from "@/lib/commerce";
import { storeConfig } from "@/config/store.config";
import { CartLines } from "./cart";
import { Empty, Forward, TextLink } from "./ui";
const profiles = [
  {
    ar: "ليان · عميلة تجريبية",
    en: "Layan · Demo customer",
    name: "Layan Demo",
    email: "layan@example.test",
    address: "12 Example Street, Demo City",
  },
  {
    ar: "آدم · عميل تجريبي",
    en: "Adam · Demo customer",
    name: "Adam Demo",
    email: "adam@example.test",
    address: "28 Sample Avenue, Demo City",
  },
];
export function Checkout() {
  const { cart, subtotal, t, money, text, clearCart, ready } = useShop();
  const router = useRouter();
  const [method, setMethod] = useState<"standard" | "express" | "collection">(
      "standard",
    ),
    [region, setRegion] = useState<"local" | "regional">("local"),
    [profile, setProfile] = useState(0),
    [code, setCode] = useState(""),
    [promo, setPromo] = useState(false),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    lock = useRef(false);
  const totals = calculateTotals(
    subtotal,
    method,
    region,
    promo,
    storeConfig.shipping,
  );
  const p = profiles[profile];
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const confirm = () => {
    if (lock.current || !cart.length) return;
    lock.current = true;
    setBusy(true);
    timer.current = setTimeout(() => {
      const order = {
        reference: "VL-DEMO-" + Date.now().toString(36).toUpperCase(),
        total: totals.total,
        count: cart.reduce((s, l) => s + l.qty, 0),
        createdAt: new Date().toISOString(),
      };
      try {
        sessionStorage.setItem("velora-demo-order", JSON.stringify(order));
      } catch {}
      clearCart();
      router.push("/confirmation/");
    }, 650);
  };
  if (!ready)
    return (
      <div className="container page-section">
        <div className="skeleton large-skeleton" />
      </div>
    );
  if (!cart.length && !busy)
    return (
      <section className="container page-section">
        <Empty
          symbol={<ShoppingBag size={40} />}
          title={t("ابدأ باختياراتك", "Begin with your edit")}
          description={t(
            "أضف قطعة إلى السلة لتجربة إتمام الطلب.",
            "Add a piece to your bag to explore demo checkout.",
          )}
        />
      </section>
    );
  return (
    <section className="container page-section checkout-page">
      <nav className="breadcrumbs" aria-label={t("مسار التنقل", "Breadcrumb")}>
        <Link href="/cart/">{t("السلة", "Your bag")}</Link>
        <span>/</span>
        <span>{t("إتمام الطلب", "Checkout")}</span>
      </nav>
      <div className="page-heading">
        <span className="eyebrow">
          {t("الخطوة الأخيرة في التجربة", "THE FINAL DETAIL")}
        </span>
        <h1>{t("اختياراتك، مكتملة.", "Your edit, complete.")}</h1>
      </div>
      <div className="demo-banner">
        <Package size={20} />
        <div>
          <b>
            {t(
              "هذه محاكاة كاملة، بلا دفع حقيقي.",
              "A complete simulation. No real payment.",
            )}
          </b>
          <p>
            {t(
              "البيانات أدناه وهمية وجاهزة. لا تدخل بيانات شخصية أو مصرفية. لا يُرسل أي طلب إلى جهة خارجية.",
              "The details below are fictional samples. No personal or payment information is needed. No order is sent anywhere.",
            )}
          </p>
        </div>
      </div>
      <div className="checkout-layout">
        <div className="checkout-fields">
          <section className="checkout-block">
            <h2>
              <span>01</span>
              {t("بيانات العميل التجريبي", "Demo customer details")}
            </h2>
            <label>
              {t("اختر نموذجاً وهمياً", "Choose a fictional profile")}
              <select
                value={profile}
                onChange={(e) => setProfile(Number(e.target.value))}
              >
                {profiles.map((x, i) => (
                  <option key={i} value={i}>
                    {text(x)}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-grid">
              <label>
                {t("الاسم التجريبي", "Demo name")}
                <input readOnly value={p.name} autoComplete="off" />
              </label>
              <label>
                {t("البريد التجريبي", "Demo email")}
                <input readOnly value={p.email} autoComplete="off" dir="ltr" />
              </label>
            </div>
            <label>
              {t("العنوان الوهمي", "Fictional address")}
              <input readOnly value={p.address} autoComplete="off" dir="ltr" />
            </label>
          </section>
          <section className="checkout-block">
            <h2>
              <span>02</span>
              {t("طريقة الاستلام", "Delivery, your way")}
            </h2>
            <label>
              {t("منطقة التوصيل التجريبية", "Demo delivery area")}
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as typeof region)}
                disabled={method === "collection"}
              >
                <option value="local">
                  {t("المنطقة الأساسية", "Standard area")}
                </option>
                <option value="regional">
                  {t(
                    "منطقة إضافية · رسوم ١٥ شيكل",
                    "Extended area · ₪15 supplement",
                  )}
                </option>
              </select>
            </label>
            <div className="delivery-options">
              {(["standard", "express", "collection"] as const).map((m) => (
                <label
                  key={m}
                  className={
                    "delivery-option " + (method === m ? "active" : "")
                  }
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={method === m}
                    onChange={() => setMethod(m)}
                  />
                  {m === "collection" ? (
                    <MapPin size={23} />
                  ) : (
                    <Truck size={23} />
                  )}
                  <span>
                    <b>
                      {m === "standard"
                        ? t("توصيل قياسي", "Standard delivery")
                        : m === "express"
                          ? t("توصيل سريع", "Express delivery")
                          : t("استلام ذاتي", "Collect in person")}
                    </b>
                    <small>
                      {m === "standard"
                        ? t("٣–٥ أيام · توضيحي", "3–5 days · Illustrative")
                        : m === "express"
                          ? t("١–٢ يوم · توضيحي", "1–2 days · Illustrative")
                          : t(
                              "نقطة استلام وهمية",
                              "Fictional collection point",
                            )}
                    </small>
                  </span>
                  <b>
                    {money(
                      calculateTotals(
                        subtotal,
                        m,
                        region,
                        promo,
                        storeConfig.shipping,
                      ).shipping,
                    )}
                  </b>
                </label>
              ))}
            </div>
          </section>
          <section className="checkout-block">
            <h2>
              <span>03</span>
              {t("تأكيد التجربة", "Complete the experience")}
            </h2>
            <p className="muted">
              {t(
                "ستظهر شاشة تأكيد ورقم طلب تجريبي. لا توجد بوابة دفع، ولا تتحول هذه الخطوة إلى طلب حقيقي.",
                "You will see a confirmation and a local demo reference. No payment gateway is connected and no real order is created.",
              )}
            </p>
            <button className="button full" onClick={confirm} disabled={busy}>
              {busy ? (
                <>
                  <Loader2 className="spinner" size={18} />
                  {t("جارٍ تجهيز التأكيد…", "Preparing your confirmation…")}
                </>
              ) : (
                <>
                  {t("تأكيد الطلب التجريبي", "Confirm demo order")}
                  <Forward />
                </>
              )}
            </button>
          </section>
        </div>
        <aside className="checkout-summary">
          <h2>{t("اختياراتك", "Your edit")}</h2>
          <CartLines compact />
          <form
            className="promo-form"
            onSubmit={(e) => {
              e.preventDefault();
              const ok = validPromo(code);
              setPromo(ok);
              setMessage(
                ok
                  ? t(
                      "تم تطبيق خصم تجريبي ١٠٪.",
                      "Demo discount of 10% applied.",
                    )
                  : t(
                      "الكود غير صالح. جرّب VELORA10.",
                      "Code not recognized. Try VELORA10.",
                    ),
              );
            }}
          >
            <label htmlFor="promo">
              {t("كود تجريبي · VELORA10", "Demo code · VELORA10")}
            </label>
            <div>
              <input
                id="promo"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setPromo(false);
                  setMessage("");
                }}
                autoComplete="off"
                placeholder="VELORA10"
                dir="ltr"
                maxLength={30}
              />
              <button type="submit">{t("تطبيق", "Apply")}</button>
            </div>
            <p
              className={promo ? "success-message" : "error-message"}
              role="status"
            >
              {message}
            </p>
          </form>
          <div className="summary-breakdown">
            <div>
              <span>{t("المجموع الفرعي", "Subtotal")}</span>
              <b>{money(totals.subtotal)}</b>
            </div>
            {promo && (
              <div>
                <span>{t("خصم تجريبي ١٠٪", "Demo discount 10%")}</span>
                <b>− {money(totals.discount)}</b>
              </div>
            )}
            <div>
              <span>{t("التوصيل التجريبي", "Demo delivery")}</span>
              <b>
                {totals.shipping
                  ? money(totals.shipping)
                  : t("مجاني", "Complimentary")}
              </b>
            </div>
            <div className="grand-total">
              <span>{t("الإجمالي", "Total")}</span>
              <b>{money(totals.total)}</b>
            </div>
          </div>
          <p className="demo-caption">
            {t(
              "المبلغ للعرض فقط. لا يتم تحصيله.",
              "Displayed for demonstration. Nothing is charged.",
            )}
          </p>
        </aside>
      </div>
    </section>
  );
}
type Order = {
  reference: string;
  total: number;
  count: number;
  createdAt: string;
};
export function Confirmation() {
  const { t, money, ready } = useShop();
  const [order, setOrder] = useState<Order | null>(null),
    [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const x = JSON.parse(
        sessionStorage.getItem("velora-demo-order") || "null",
      );
      if (
        x &&
        typeof x.reference === "string" &&
        x.reference.startsWith("VL-DEMO-") &&
        Number.isFinite(x.total) &&
        x.total >= 0 &&
        Number.isSafeInteger(x.count) &&
        x.count > 0
      )
        setOrder(x);
    } catch {}
    setLoaded(true);
  }, []);
  if (!ready || !loaded)
    return (
      <div className="container page-section">
        <div className="skeleton large-skeleton" />
      </div>
    );
  return (
    <section className="container confirmation-page">
      {order ? (
        <>
          <div className="confirmation-seal">
            <Check size={38} />
          </div>
          <span className="eyebrow">
            {t("اكتملت التجربة", "THE EXPERIENCE IS COMPLETE")}
          </span>
          <h1>
            {t(
              "اختيارات جميلة.\nتجربة مكتملة.",
              "A beautiful edit.\nA complete experience.",
            )}
          </h1>
          <p>
            {t(
              "تمت محاكاة الطلب بنجاح. لم يتم إرسال طلب حقيقي أو تحصيل أي مبلغ.",
              "Your order has been simulated successfully. No real order was placed and no money was collected.",
            )}
          </p>
          <div className="confirmation-receipt">
            <div>
              <span>{t("المرجع التجريبي", "Demo reference")}</span>
              <b dir="ltr">{order.reference}</b>
            </div>
            <div>
              <span>{t("عدد القطع", "Pieces")}</span>
              <b>{order.count}</b>
            </div>
            <div>
              <span>{t("المجموع التوضيحي", "Illustrative total")}</span>
              <b>{money(order.total)}</b>
            </div>
            <div className="receipt-stamp">DEMO / NO PAYMENT</div>
          </div>
          <TextLink href="/shop/">
            {t("عُد إلى الاكتشاف", "Return to the collection")}
          </TextLink>
        </>
      ) : (
        <Empty
          symbol={<Package size={40} />}
          title={t("قصتك تبدأ باختيار", "Your story starts with a choice")}
          description={t(
            "نفّذ طلباً تجريبياً لعرض شاشة التأكيد الخاصة به.",
            "Complete a demo checkout to see its confirmation.",
          )}
        />
      )}
    </section>
  );
}
