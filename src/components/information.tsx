"use client";
import { assetUrl } from "@/lib/paths";
import { useState } from "react";
import Link from "next/link";
import { Heart, Mail, Package, ArrowUpRight } from "lucide-react";
import { useShop } from "./store-provider";
import { storeConfig } from "@/config/store.config";
import { ProductGrid } from "./products";
import { Empty, Forward, TextLink, Reveal } from "./ui";
export function Wishlist() {
  const { t, catalog, wishlist, ready } = useShop();
  const items = catalog.filter((p) => wishlist.includes(p.id));
  return (
    <section className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">
          {t("لوقت آخر. أو للحظة الآن.", "FOR LATER. OR FOR RIGHT NOW.")}
        </span>
        <h1>
          {t("تفاصيل أحببتها.", "The pieces you love.")}{" "}
          <sup>{items.length}</sup>
        </h1>
        <p>
          {t(
            "مساحتك الخاصة للأشياء التي لفتت انتباهك.",
            "Your personal space for the things that caught your eye.",
          )}
        </p>
      </div>
      {!ready ? (
        <div className="skeleton large-skeleton" />
      ) : items.length ? (
        <ProductGrid items={items} />
      ) : (
        <Empty
          symbol={<Heart size={40} />}
          title={t("ستجد المفضلة هنا", "A home for your favorites")}
          description={t(
            "اضغط رمز القلب على أي قطعة لحفظها في قائمتك.",
            "Tap the heart on any piece to keep it in your edit.",
          )}
        />
      )}
    </section>
  );
}
export function About() {
  const { t, name } = useShop();
  return (
    <>
      <section className="about-hero">
        <img
          src={assetUrl("/images/architecture.webp")}
          alt={t(
            "مساحة أنيقة بضوء طبيعي",
            "A considered space in natural light",
          )}
          width={1600}
          height={1000}
        />
        <div />
        <div className="about-hero-copy">
          <span className="eyebrow">
            {t("حكاية " + name, "THE " + name + " STORY")}
          </span>
          <h1>{t("الجمال في\nما تختاره.", "Beauty in\nwhat you choose.")}</h1>
        </div>
      </section>
      <section className="container about-content">
        <Reveal>
          <span className="eyebrow">
            {t("فلسفة بسيطة", "A SIMPLE PHILOSOPHY")}
          </span>
          <h2>{t("أقل ضجيجاً.\nأكثر معنى.", "Less noise.\nMore meaning.")}</h2>
        </Reveal>
        <div>
          <p className="intro-paragraph">
            {t(
              name +
                " فكرة عن الأناقة اليومية. عن ساعة ترافقك، أو حقيبة تجد فيها أسلوبك، أو تفصيل صغير يغيّر إحساسك باليوم.",
              name +
                " is an idea of everyday elegance. A watch that becomes your companion. A bag that feels like you. A small detail that changes how a day feels.",
            )}
          </p>
          <p>
            {t(
              "نحب الأشياء التي تحمل حضورها بهدوء. التكوين المتوازن، والخامة التي تود لمسها، والتفاصيل التي تكتشفها في النظرة الثانية. هذه الرؤية هي أساس كل قرار بصري في هذه المجموعة.",
              "We are drawn to objects with a quiet presence. Balanced compositions. Materials you want to touch. Details you discover on a second look. This vision shapes every visual choice in the collection.",
            )}
          </p>
          <p className="muted">
            {t(
              "هذه علامة متخيّلة ومتجر توضيحي لعرض تجربة تسوق متكاملة. المنتجات، المواصفات والأسعار بيانات تجريبية.",
              "This is a fictional label and a demonstration of a complete shopping experience. Products, specifications and prices are illustrative.",
            )}
          </p>
          <TextLink href="/shop/">
            {t("اكتشف المجموعة", "Explore the collection")}
          </TextLink>
        </div>
      </section>
      <section className="container values-grid">
        <div>
          <span>01 /</span>
          <h3>{t("اختيار مدروس", "Considered choices")}</h3>
          <p>
            {t(
              "منتجات منظمة، بتفاصيل واضحة وخيارات يسهل فهمها.",
              "Organized pieces, clear details and options that make sense.",
            )}
          </p>
        </div>
        <div>
          <span>02 /</span>
          <h3>{t("أناقة يومية", "Everyday elegance")}</h3>
          <p>
            {t(
              "تجربة هادئة تجعل المنتج محور الاهتمام.",
              "An effortless experience that places the product at the center.",
            )}
          </p>
        </div>
        <div>
          <span>03 /</span>
          <h3>{t("وضوح من البداية", "Clear from the start")}</h3>
          <p>
            {t(
              "لا مراجعات مختلقة، ولا ندرة مصطنعة، ولا وعود تجارية في الديمو.",
              "No invented reviews, artificial scarcity or commercial promises in this demo.",
            )}
          </p>
        </div>
      </section>
    </>
  );
}
export function Contact() {
  const { t, text, notify } = useShop();
  const [topic, setTopic] = useState("pieces"),
    [message, setMessage] = useState(""),
    [success, setSuccess] = useState(false);
  return (
    <section className="container page-section contact-page">
      <div className="page-heading">
        <span className="eyebrow">
          {t("للحوار، مساحة دائماً", "THERE IS ALWAYS ROOM FOR A CONVERSATION")}
        </span>
        <h1>{t("نحن هنا،\nللتفاصيل.", "Here for\nthe details.")}</h1>
      </div>
      <div className="contact-layout">
        <div className="contact-copy">
          <h2>
            {t("كل سؤال بداية لحكاية.", "Every question begins a story.")}
          </h2>
          <p>
            {t(
              "استكشف طريقة التواصل داخل المتجر. هذا نموذج توضيحي لا يرسل رسائل ولا يحفظ بياناتك.",
              "Explore the store contact experience. This illustrative form does not send messages or save your details.",
            )}
          </p>
          <div className="contact-note">
            <Mail size={24} />
            <span>
              {t(
                "قنوات التواصل الحقيقية تُضاف عند تخصيص المتجر.",
                "Real contact channels are configured when customizing the store.",
              )}
            </span>
          </div>
          {storeConfig.contactLinks.map((link) => (
            <a
              key={link.url}
              className="text-link configured-contact"
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              {text(link.label)}
              <Forward />
            </a>
          ))}
          {storeConfig.contactEmail && (
            <a
              className="text-link"
              href={"mailto:" + storeConfig.contactEmail}
            >
              {storeConfig.contactEmail}
              <Forward />
            </a>
          )}
          <TextLink href="/shipping/">
            {t("التوصيل والاسترجاع", "Delivery & returns")}
          </TextLink>
        </div>
        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSuccess(true);
            setMessage("");
            notify(
              t(
                "تمت معاينة الرسالة محلياً. لم تُرسل لأي جهة.",
                "Message preview complete. Nothing was sent.",
              ),
            );
          }}
        >
          <span className="eyebrow">
            {t("نموذج تجريبي", "DEMO MESSAGE FORM")}
          </span>
          <label>
            {t("بماذا نساعدك؟", "What would you like to explore?")}
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="pieces">
                {t("تفاصيل المنتجات", "Product details")}
              </option>
              <option value="delivery">
                {t("التوصيل والاسترجاع", "Delivery & returns")}
              </option>
              <option value="store">
                {t("تخصيص متجر", "Store customization")}
              </option>
            </select>
          </label>
          <label>
            {t(
              "رسالة تجريبية، دون بيانات شخصية",
              "Sample message, without personal information",
            )}
            <textarea
              value={message}
              maxLength={800}
              onChange={(e) => {
                setMessage(e.target.value);
                setSuccess(false);
              }}
              rows={5}
              required
              placeholder={t(
                "أود معرفة المزيد عن هذه المجموعة…",
                "I would love to learn more about this collection…",
              )}
            />
          </label>
          <button type="submit" className="button">
            {t("معاينة الرسالة التجريبية", "Preview demo message")}
            <Forward />
          </button>
          <p className={success ? "success-message" : "micro"} role="status">
            {success
              ? t(
                  "اكتملت معاينة النموذج. لم تُرسل رسالة ولم تُحفظ بيانات.",
                  "Form demonstration complete. No message was sent and no data was stored.",
                )
              : t(
                  "استخدم نصاً وهمياً. الرسالة تبقى في ذاكرة هذه الصفحة فقط.",
                  "Use fictional text. The message stays only in this page’s memory.",
                )}
          </p>
        </form>
      </div>
    </section>
  );
}
export function Shipping() {
  const { t, money } = useShop();
  return (
    <section className="container page-section policy-page">
      <div className="page-heading">
        <span className="eyebrow">
          {t("وضوح في كل خطوة", "CLARITY IN EVERY STEP")}
        </span>
        <h1>{t("التوصيل\nوالاسترجاع.", "Delivery\n& returns.")}</h1>
        <p>
          {t(
            "سياسة توضيحية لشرح تجربة المتجر. لا تمثل التزاماً تجارياً.",
            "An illustrative policy for the demo experience. This is not a commercial commitment.",
          )}
        </p>
      </div>
      <div className="demo-banner">
        <Package size={22} />
        <span>
          {t(
            "جميع الرسوم والمواعيد هنا تجريبية. لا يتم شحن أي منتج.",
            "All fees and timeframes here are illustrative. No products are shipped.",
          )}
        </span>
      </div>
      <div className="policy-layout">
        <aside>
          <a href="#delivery">{t("التوصيل", "Delivery")}</a>
          <a href="#returns">{t("الاسترجاع", "Returns")}</a>
          <a href="#privacy">{t("بياناتك", "Your data")}</a>
        </aside>
        <div>
          <section id="delivery">
            <h2>{t("التوصيل، ببساطة.", "Delivery, made simple.")}</h2>
            <p>
              {t(
                "في شاشة الطلب، يمكنك استكشاف ثلاث طرق للاستلام. تُحدَّث الرسوم فور تغيير الطريقة أو المنطقة.",
                "At checkout, explore three ways to receive your edit. Fees update when you change the method or area.",
              )}
            </p>
            <table>
              <thead>
                <tr>
                  <th>{t("الطريقة", "Method")}</th>
                  <th>{t("الرسم التوضيحي", "Demo fee")}</th>
                  <th>{t("المدة التوضيحية", "Demo timeframe")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t("قياسي", "Standard")}</td>
                  <td>{money(storeConfig.shipping.standard)}</td>
                  <td>{t("٣–٥ أيام", "3–5 days")}</td>
                </tr>
                <tr>
                  <td>{t("سريع", "Express")}</td>
                  <td>{money(storeConfig.shipping.express)}</td>
                  <td>{t("١–٢ يوم", "1–2 days")}</td>
                </tr>
                <tr>
                  <td>{t("استلام ذاتي", "Collection")}</td>
                  <td>{t("مجاني", "Free")}</td>
                  <td>{t("حسب اختيارك", "At your convenience")}</td>
                </tr>
              </tbody>
            </table>
            <p>
              {t(
                "التوصيل القياسي مجاني للطلبات من ٩٠٠ شيكل قبل الخصم. المنطقة الإضافية تضيف ١٥ شيكل عند وجود رسم توصيل.",
                "Standard delivery is free from ₪900 before discounts. The extended area adds ₪15 when a delivery fee applies.",
              )}
            </p>
          </section>
          <section id="returns">
            <h2>{t("مساحة لإعادة الاختيار.", "Room to reconsider.")}</h2>
            <p>
              {t(
                "واجهة الاسترجاع معروضة كمفهوم: في متجر حقيقي، تُحدَّد المهلة والشروط وفق سياسة المتجر والقانون المطبق قبل النشر التجاري.",
                "Returns are presented as a concept: a real store must define its return window and conditions according to its policy and applicable law before commercial launch.",
              )}
            </p>
            <p>
              {t(
                "يمكنك إزالة أي قطعة من السلة أو تغيير الكمية في أي وقت قبل تأكيد المحاكاة.",
                "Remove a piece or change quantities at any time before completing the simulation.",
              )}
            </p>
          </section>
          <section id="privacy">
            <h2>
              {t("بيانات قليلة. تجربة واضحة.", "Less data. More clarity.")}
            </h2>
            <p>
              {t(
                "يُحفظ اختيار اللغة والهوية ومعرّفات منتجات السلة والمفضلة والمشاهدات الأخيرة محلياً في متصفحك. لا يُحفظ اسم أو بريد أو عنوان تواصل.",
                "Your language, demo identity, bag, wishlist and recently viewed product identifiers are saved locally in your browser. No customer name, email or address is stored.",
              )}
            </p>
            <p>
              {t(
                "رقم التأكيد والإجمالي وعدد القطع يُحفظ في جلسة المتصفح لتبقى شاشة النجاح متاحة عند التحديث. لا يوجد إرسال إلى سيرفر أو دفع.",
                "A demo reference, total and item count are saved for your browser session so the confirmation survives refresh. No server submission or payment takes place.",
              )}
            </p>
            <TextLink href="/contact/">
              {t("استكشف التواصل", "Explore contact")}
            </TextLink>
          </section>
        </div>
      </div>
    </section>
  );
}
export function NotFound() {
  const { t } = useShop();
  return (
    <section className="container notfound-page">
      <span className="notfound-number" dir="ltr">
        404
      </span>
      <h1>{t("تفصيل لم نجده.", "A detail we could not find.")}</h1>
      <p>
        {t(
          "ربما تغيّر الرابط. الحكاية مستمرة في المجموعة.",
          "Perhaps the link has changed. The collection is still waiting.",
        )}
      </p>
      <Link href="/shop/" className="button">
        {t("عُد إلى المجموعة", "Back to the collection")}
        <Forward />
      </Link>
    </section>
  );
}
