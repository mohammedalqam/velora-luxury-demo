"use client";
import { assetUrl } from "@/lib/paths";
import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  ChevronDown,
  ArrowUp,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useShop } from "./store-provider";
import { storeConfig } from "@/config/store.config";
import { getCategories } from "@/data/products";
import { Photo, Dialog, TextLink, Forward } from "./ui";
import { CartDrawer } from "./cart";
export function Shell({ children }: { children: ReactNode }) {
  const {
    t,
    text,
    name,
    locale,
    setLocale,
    count,
    wishlist,
    setCartOpen,
    preset,
    catalog,
  } = useShop();
  const [menu, setMenu] = useState(false),
    [mega, setMega] = useState(false),
    [search, setSearch] = useState(false),
    [query, setQuery] = useState(""),
    [scrolled, setScrolled] = useState(false),
    [top, setTop] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const cats = getCategories(preset);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setTop(window.scrollY > 700);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setMenu(false);
    setMega(false);
    setSearch(false);
    setCartOpen(false);
  }, [pathname, setCartOpen]);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMega(false);
    };
    const outside = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMega(false);
    };
    document.addEventListener("keydown", esc);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", esc);
      document.removeEventListener("pointerdown", outside);
    };
  }, []);
  const results = catalog
    .filter((p) =>
      (p.name.ar + " " + p.name.en)
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    )
    .slice(0, 8);
  return (
    <>
      <a href="#main-content" className="skip-link">
        {t("تجاوز إلى المحتوى", "Skip to content")}
      </a>
      <div className="announcement">
        <span>
          <Sparkles size={11} />
          {text(storeConfig.announcement)}
        </span>
        <Link href="/shipping/">
          {t(
            "توصيل تجريبي مجاني من " + storeConfig.shipping.freeAbove + " شيكل",
            "Free standard demo delivery from ₪" +
              storeConfig.shipping.freeAbove,
          )}
          <Forward size={12} />
        </Link>
      </div>
      <header
        className={"header " + (scrolled ? "scrolled" : "")}
        ref={headerRef}
      >
        <div className="header-inner">
          <nav
            className="desktop-nav"
            aria-label={t("التنقل الرئيسي", "Main navigation")}
          >
            <button
              onClick={() => setMega(!mega)}
              aria-expanded={mega}
              aria-controls="mega-menu"
            >
              {t("المجموعات", "Collections")}
              <ChevronDown size={12} />
            </button>
            <Link href="/shop/?edit=new">
              {t("وصل حديثاً", "New arrivals")}
            </Link>
            <Link href="/shop/?edit=featured">
              {t("مختاراتنا", "The edit")}
            </Link>
            <Link href="/about/">{t("حكايتنا", "Our story")}</Link>
          </nav>
          <button
            className="icon-button mobile-menu-button"
            aria-label={t("فتح القائمة", "Open navigation")}
            onClick={() => setMenu(true)}
          >
            <Menu size={22} />
          </button>
          <Link
            href="/"
            className="wordmark"
            aria-label={name + " " + t("الرئيسية", "Home")}
            dir="ltr"
          >
            {storeConfig.logo && name === storeConfig.name ? (
              <img src={assetUrl(storeConfig.logo)} alt={name} width={190} height={45} />
            ) : (
              name
            )}
          </Link>
          <div className="header-actions">
            <button
              className="language-button"
              aria-label={t("التبديل إلى الإنجليزية", "Switch to Arabic")}
              onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            >
              {locale === "ar" ? "EN" : "عربي"}
            </button>
            <button
              className="icon-button"
              aria-label={t("بحث عن منتج", "Search products")}
              onClick={() => setSearch(true)}
            >
              <Search size={20} />
            </button>
            <Link
              className="icon-button header-wishlist"
              href="/wishlist/"
              aria-label={t("المفضلة", "Wishlist")}
            >
              <Heart size={20} />
              {wishlist.length > 0 && <sup>{wishlist.length}</sup>}
            </Link>
            <button
              className="icon-button"
              aria-label={t("فتح سلة المشتريات", "Open shopping bag")}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={20} />
              {count > 0 && <sup>{count}</sup>}
            </button>
          </div>
        </div>
        {mega && (
          <div id="mega-menu" className="mega-menu">
            <div className="mega-links">
              <span className="eyebrow">
                {t("عالم من التفاصيل", "A WORLD OF DETAILS")}
              </span>
              {cats.map((c) => (
                <Link
                  key={c.id}
                  href={"/collections/" + c.id + "/"}
                  onClick={() => setMega(false)}
                >
                  {text(c.name)}
                  <Forward />
                </Link>
              ))}
              <TextLink href="/shop/">{t("كل القطع", "All pieces")}</TextLink>
            </div>
            <div className="mega-images">
              {cats.slice(0, 2).map((c) => {
                const p = catalog.find((p) => p.category === c.id)!;
                return (
                  <Link
                    key={c.id}
                    href={"/collections/" + c.id + "/"}
                    onClick={() => setMega(false)}
                  >
                    <Photo product={p} />
                    <span>
                      {text(c.name)}
                      <Forward />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="page-content"
        key={pathname}
      >
        {children}
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-intro">
              <span className="eyebrow">
                {t("التفاصيل هي الحكاية", "EVERY DETAIL TELLS A STORY")}
              </span>
              <h2>{text(storeConfig.footer)}</h2>
              <p>
                {t(
                  "علامة متخيّلة. تجربة متكاملة.\nاكتشف أسلوباً مختلفاً للتسوّق.",
                  "A fictional label. A considered experience.\nDiscover a different way to explore.",
                )}
              </p>
            </div>
            <div className="footer-links">
              <h3>{t("اكتشف", "Explore")}</h3>
              <Link href="/shop/">{t("كل القطع", "All pieces")}</Link>
              {cats.map((c) => (
                <Link key={c.id} href={"/collections/" + c.id + "/"}>
                  {text(c.name)}
                </Link>
              ))}
            </div>
            <div className="footer-links">
              <h3>{t("نحن هنا", "Here for you")}</h3>
              <Link href="/about/">{t("حكايتنا", "Our story")}</Link>
              <Link href="/contact/">{t("تواصل معنا", "Get in touch")}</Link>
              <Link href="/shipping/">
                {t("التوصيل والاسترجاع", "Delivery & returns")}
              </Link>
              <Link href="/wishlist/">{t("المفضلة", "Your wishlist")}</Link>
              <Link href="/cart/">{t("سلة اختياراتك", "Your bag")}</Link>
              <Link href="/presentation/" className="presentation-link">
                <SlidersHorizontal size={14} />
                {t("وضع العرض", "Presentation mode")}
              </Link>
              {storeConfig.socialLinks.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div className="footer-wordmark" dir="ltr">
            {name}
          </div>
          <div className="footer-bottom">
            <span>© 2026 {name}</span>
            <span>{text(storeConfig.demoNotice)}</span>
            <button onClick={() => setLocale(locale === "ar" ? "en" : "ar")}>
              {locale === "ar" ? "English" : "العربية"}
            </button>
          </div>
        </div>
      </footer>
      <CartDrawer />
      <Dialog
        open={menu}
        onClose={() => setMenu(false)}
        title={name}
        side
        className="mobile-nav"
      >
        <Link href="/shop/">
          {t("كل القطع", "All pieces")}
          <Forward />
        </Link>
        {cats.map((c) => (
          <Link key={c.id} href={"/collections/" + c.id + "/"}>
            {text(c.name)}
            <Forward />
          </Link>
        ))}
        <Link href="/shop/?edit=new">
          {t("وصل حديثاً", "New arrivals")}
          <Forward />
        </Link>
        <Link href="/about/">
          {t("حكايتنا", "Our story")}
          <Forward />
        </Link>
        <Link href="/wishlist/">
          {t("المفضلة", "Wishlist")}
          <Heart size={20} />
        </Link>
        <Link href="/contact/">
          {t("تواصل معنا", "Get in touch")}
          <Forward />
        </Link>
        <button
          className="button outline"
          onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
        >
          {locale === "ar" ? "English" : "العربية"}
        </button>
      </Dialog>
      <Dialog
        open={search}
        onClose={() => setSearch(false)}
        title={t("ما الذي تبحث عنه؟", "What are you looking for?")}
        className="search-dialog"
      >
        <label className="search-input">
          <Search size={22} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              "ساعة، حقيبة، تفاصيل جديدة…",
              "A watch, a bag, a new detail…",
            )}
            aria-label={t("اسم المنتج", "Product name")}
            autoFocus
          />
        </label>
        <div className="search-label">
          {query
            ? t("نتائج البحث", "SEARCH RESULTS")
            : t("ابدأ من هنا", "START HERE")}{" "}
          <span>({results.length})</span>
        </div>
        <div className="search-results">
          {results.length ? (
            results.map((p) => (
              <Link
                key={p.id}
                href={"/products/" + p.slug + "/"}
                onClick={() => setSearch(false)}
              >
                <Photo product={p} />
                <div>
                  <h3>{text(p.name)}</h3>
                  <span className="micro">
                    {t("استكشف التفاصيل", "Explore the details")}
                  </span>
                </div>
                <Forward />
              </Link>
            ))
          ) : (
            <p>
              {t(
                "لا توجد نتائج. جرّب كلمة أخرى.",
                "No matches. Try another word.",
              )}
            </p>
          )}
        </div>
        <TextLink href="/shop/">
          {t("استكشف كل القطع", "Explore all pieces")}
        </TextLink>
      </Dialog>
      {top && (
        <button
          className="back-top icon-button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
            })
          }
          aria-label={t("العودة للأعلى", "Back to top")}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}
