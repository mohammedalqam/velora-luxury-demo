"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Heart,
  Eye,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Truck,
  Package,
  Check,
} from "lucide-react";
import { useShop } from "./store-provider";
import { storeConfig } from "@/config/store.config";
import {
  Photo,
  Dialog,
  Quantity,
  Forward,
  SectionHeading,
  TextLink,
  Reveal,
} from "./ui";
import { categories, isAvailable, type Product } from "@/data/products";
export function ProductCard({
  product,
  large = false,
}: {
  product: Product;
  large?: boolean;
}) {
  const { text, t, money, wishlist, toggleWish } = useShop();
  const [quick, setQuick] = useState(false);
  return (
    <article className={"product-card " + (large ? "large" : "")}>
      <div className="product-media">
        <Link
          href={"/products/" + product.slug + "/"}
          className="product-image-link"
          aria-label={text(product.name)}
        >
          <Photo product={product} />
          {product.duo && (
            <Photo product={product} view={1} className="second-image" />
          )}
        </Link>
        <div className="product-label">
          {product.isNew ? (
            <span>{t("جديد", "New")}</span>
          ) : !isAvailable(product) ? (
            <span>{t("غير متاح", "Unavailable")}</span>
          ) : null}
        </div>
        <button
          className={
            "wish-button " + (wishlist.includes(product.id) ? "selected" : "")
          }
          aria-pressed={wishlist.includes(product.id)}
          aria-label={
            t("حفظ في المفضلة: ", "Save to wishlist: ") + text(product.name)
          }
          onClick={() => toggleWish(product.id)}
        >
          <Heart
            size={18}
            fill={wishlist.includes(product.id) ? "currentColor" : "none"}
          />
        </button>
        <button className="quick-button" onClick={() => setQuick(true)}>
          <Eye size={16} />
          {t("نظرة سريعة", "Quick view")}
          <Forward size={15} />
        </button>
      </div>
      <div className="product-caption">
        <div>
          <span className="product-category">
            {text(categories.find((c) => c.id === product.category)!.name)}
          </span>
          <h3>
            <Link href={"/products/" + product.slug + "/"}>
              {text(product.name)}
            </Link>
          </h3>
        </div>
        <span className="price">
          {product.variants.some((v) => v.price !== product.price)
            ? t("من ", "From ")
            : ""}
          {money(product.price)}
        </span>
      </div>
      <div className="swatches">
        {product.colors.map((c) => (
          <span
            key={c.id}
            className="swatch-dot"
            style={{ background: c.hex }}
            title={text(c.name)}
          />
        ))}
        <span className="micro">
          {product.variants.length > 1
            ? t("خيارات متعددة", "Multiple options")
            : t("اختيار مدروس", "A considered choice")}
        </span>
      </div>
      <Dialog
        open={quick}
        onClose={() => setQuick(false)}
        title={t("نظرة أقرب", "A closer look")}
        className="quick-dialog"
      >
        {quick && (
          <div className="quick-layout">
            <Photo product={product} priority />
            <Purchase product={product} compact onAdd={() => setQuick(false)} />
          </div>
        )}
      </Dialog>
    </article>
  );
}
export function ProductGrid({
  items,
  density = 4,
}: {
  items: Product[];
  density?: number;
}) {
  return (
    <div className={"product-grid density-" + density}>
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
export function Purchase({
  product,
  compact = false,
  onAdd,
}: {
  product: Product;
  compact?: boolean;
  onAdd?: () => void;
}) {
  const { text, t, money, add, wishlist, toggleWish, cart } = useShop();
  const first =
    product.variants.find((v) => v.stock > 0) || product.variants[0];
  const [variant, setVariant] = useState(first.id),
    [color, setColor] = useState(product.colors[0].id),
    [qty, setQty] = useState(1),
    [sticky, setSticky] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);
  const v = product.variants.find((x) => x.id === variant)!;
  const existing =
    cart.find(
      (l) => l.id === product.id && l.variant === variant && l.color === color,
    )?.qty || 0;
  const remaining = Math.max(0, v.stock - existing),
    available = remaining > 0;
  useEffect(() => {
    if (compact || !buyRef.current) return;
    const ob = new IntersectionObserver(
      (entries) => setSticky(!entries[0].isIntersecting),
      { threshold: 0 },
    );
    ob.observe(buyRef.current);
    return () => ob.disconnect();
  }, [compact]);
  const purchase = () => {
    if (!available) return;
    onAdd?.();
    add(product, variant, color, Math.min(qty, remaining));
  };
  return (
    <div className="purchase">
      <span className="eyebrow">
        {text(categories.find((c) => c.id === product.category)!.name)} ·{" "}
        {t("المجموعة الأولى", "The first collection")}
      </span>
      <h1>{text(product.name)}</h1>
      <div className="product-price">{money(v.price)}</div>
      <p className="description">{text(product.description)}</p>
      <div className="option-heading">
        {t("اللون", "Color")}{" "}
        <span>{text(product.colors.find((c) => c.id === color)!.name)}</span>
      </div>
      <div className="color-options">
        {product.colors.map((c) => (
          <button
            key={c.id}
            className={"color-option " + (color === c.id ? "active" : "")}
            aria-label={text(c.name)}
            aria-pressed={color === c.id}
            style={{ background: c.hex }}
            onClick={() => setColor(c.id)}
          />
        ))}
      </div>
      <div className="option-heading">
        {product.category === "apparel" || product.id === "j04"
          ? t("المقاس", "Size")
          : t("الخيار", "Option")}
      </div>
      <div className="variant-options">
        {product.variants.map((x) => (
          <button
            key={x.id}
            onClick={() => {
              setVariant(x.id);
              setQty(1);
            }}
            className={variant === x.id ? "active" : ""}
            aria-pressed={variant === x.id}
            disabled={x.stock === 0}
          >
            {text(x.name)}
          </button>
        ))}
      </div>
      <p className={"stock-status " + (!available ? "out" : "")}>
        <span />
        {available
          ? t("متاح في الكتالوج التجريبي", "Available in the demo catalog")
          : v.stock === 0
            ? t("غير متاح في الديمو", "Unavailable in this demo")
            : t(
                "أضفت الكمية المتاحة إلى السلة",
                "Available quantity is already in your bag",
              )}
      </p>
      <div className="buy-row" ref={buyRef}>
        <Quantity
          value={Math.min(qty, remaining || 1)}
          max={remaining || 1}
          onChange={setQty}
        />
        <button className="button" disabled={!available} onClick={purchase}>
          <ShoppingBag size={18} />
          {t("أضف إلى السلة", "Add to bag")}
          <Forward />
        </button>
        <button
          className={
            "icon-button bordered " +
            (wishlist.includes(product.id) ? "selected" : "")
          }
          aria-label={t("حفظ في المفضلة", "Save to wishlist")}
          aria-pressed={wishlist.includes(product.id)}
          onClick={() => toggleWish(product.id)}
        >
          <Heart
            size={20}
            fill={wishlist.includes(product.id) ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="purchase-notes">
        <span>
          <Truck size={17} />
          {t(
            "توصيل تجريبي يُحسب عند الإتمام",
            "Demo delivery calculated at checkout",
          )}
        </span>
        <span>
          <Package size={17} />
          {t("تجربة عرض · لا دفع فعلي", "Demonstration · No real payment")}
        </span>
      </div>
      {compact ? (
        <TextLink href={"/products/" + product.slug + "/"}>
          {t("كل تفاصيل المنتج", "View full details")}
        </TextLink>
      ) : (
        <div className="product-accordions">
          <details open>
            <summary>
              {t("تفاصيل القطعة", "The details")}
              <span>+</span>
            </summary>
            <dl>
              {product.details.map((d, i) => (
                <div key={i}>
                  <dt>{text(d.label)}</dt>
                  <dd>{text(d.value)}</dd>
                </div>
              ))}
            </dl>
          </details>
          <details>
            <summary>
              {t("الخامات والعناية", "Materials & care")}
              <span>+</span>
            </summary>
            <p>{text(product.materials)}</p>
            <p>
              {t(
                "المواصفات والصور توضيحية لمنتجات متخيّلة. لا تمثل ضماناً أو عرض بيع حقيقي.",
                "Specifications and images illustrate concept products. They are not a guarantee or a real sales offer.",
              )}
            </p>
          </details>
          <details>
            <summary>
              {t("التوصيل والاسترجاع", "Delivery & returns")}
              <span>+</span>
            </summary>
            <p>
              {t(
                "القياسي " +
                  money(storeConfig.shipping.standard) +
                  "، والسريع " +
                  money(storeConfig.shipping.express) +
                  ". القياسي مجاني من " +
                  money(storeConfig.shipping.freeAbove) +
                  ". قواعد تجريبية فقط.",
                "Standard " +
                  money(storeConfig.shipping.standard) +
                  ", express " +
                  money(storeConfig.shipping.express) +
                  ". Standard is free from " +
                  money(storeConfig.shipping.freeAbove) +
                  ". Demonstration rules only.",
              )}
            </p>
            <TextLink href="/shipping/">
              {t("اقرأ السياسة التجريبية", "Read the demo policy")}
            </TextLink>
          </details>
        </div>
      )}
      {!compact && sticky && (
        <div className="mobile-purchase">
          <div>
            <span>{text(product.name)}</span>
            <b>{money(v.price)}</b>
          </div>
          <button className="button" onClick={purchase} disabled={!available}>
            {t("أضف إلى السلة", "Add to bag")}
            <ShoppingBag size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
export function ProductDetail({ product }: { product: Product }) {
  const { text, t, catalog, view, recent } = useShop();
  const [active, setActive] = useState(0),
    [zoom, setZoom] = useState(false);
  const touch = useRef<number | null>(null);
  const total = product.duo ? 2 : product.images.length;
  useEffect(() => view(product.id), [product.id, view]);
  const previous = () => setActive((x) => (x + total - 1) % total),
    next = () => setActive((x) => (x + 1) % total);
  const related = catalog
    .filter((p) => product.relatedProductIds.includes(p.id))
    .slice(0, 4);
  const viewed = catalog
    .filter((p) => recent.includes(p.id) && p.id !== product.id)
    .slice(0, 4);
  return (
    <>
      <div className="container product-page">
        <nav
          className="breadcrumbs"
          aria-label={t("مسار التنقل", "Breadcrumb")}
        >
          <Link href="/">{t("الرئيسية", "Home")}</Link>
          <span>/</span>
          <Link href={"/collections/" + product.category + "/"}>
            {text(categories.find((c) => c.id === product.category)!.name)}
          </Link>
          <span>/</span>
          <span>{text(product.name)}</span>
        </nav>
        <div className="product-layout">
          <div className="gallery">
            <div
              className="main-gallery"
              onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (
                  touch.current !== null &&
                  Math.abs(e.changedTouches[0].clientX - touch.current) > 40
                )
                  next();
                touch.current = null;
              }}
            >
              <button
                className="gallery-zoom"
                onClick={() => setZoom(true)}
                aria-label={t("تكبير صورة المنتج", "Enlarge product image")}
              >
                <Photo product={product} view={active} priority />
                <span className="zoom-hint">
                  <ZoomIn size={17} />
                  {t("اكتشف التفاصيل", "Explore the details")}
                </span>
              </button>
              {total > 1 && (
                <div className="gallery-nav">
                  <button
                    className="icon-button"
                    onClick={previous}
                    aria-label={t("الصورة السابقة", "Previous image")}
                  >
                    <ChevronLeft size={19} />
                  </button>
                  <span dir="ltr">
                    0{active + 1} / 0{total}
                  </span>
                  <button
                    className="icon-button"
                    onClick={next}
                    aria-label={t("الصورة التالية", "Next image")}
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>
              )}
            </div>
            <div className="thumbnails">
              {Array.from({ length: total }, (_, i) => (
                <button
                  key={i}
                  className={active === i ? "active" : ""}
                  onClick={() => setActive(i)}
                  aria-label={t("عرض الزاوية ", "View angle ") + (i + 1)}
                  aria-pressed={active === i}
                >
                  <Photo product={product} view={i} />
                </button>
              ))}
            </div>
            <p className="micro gallery-caption">
              {t(
                "صور توضيحية · تصميم متخيّل لأغراض العرض",
                "Illustrative imagery · Concept design for presentation",
              )}
            </p>
          </div>
          <Purchase key={product.id} product={product} />
        </div>
      </div>
      {related.length > 0 && (
        <section className="section container">
          <SectionHeading
            eyebrow={t("أكمل الحكاية", "COMPLETE THE STORY")}
            title={t("قطع تنسجم معك", "Considered companions")}
          />
          <ProductGrid items={related} />
        </section>
      )}
      {viewed.length > 0 && (
        <section className="section container">
          <SectionHeading
            eyebrow={t("نظرة ثانية", "ANOTHER LOOK")}
            title={t("شاهدتها مؤخراً", "Recently viewed")}
          />
          <ProductGrid items={viewed} />
        </section>
      )}
      <Dialog
        open={zoom}
        onClose={() => setZoom(false)}
        title={text(product.name)}
        className="zoom-dialog"
      >
        <Photo product={product} view={active} />
        {total > 1 && (
          <button className="button outline" onClick={next}>
            {t("الزاوية التالية", "Next angle")}
            <Forward />
          </button>
        )}
      </Dialog>
    </>
  );
}
