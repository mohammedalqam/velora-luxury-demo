"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  Columns2,
} from "lucide-react";
import { useShop } from "./store-provider";
import {
  categories,
  getCategories,
  isAvailable,
  products,
} from "@/data/products";
import { ProductGrid } from "./products";
import { Dialog, Forward } from "./ui";
type Filters = {
  category: string;
  color: string;
  max: number;
  available: boolean;
  query: string;
  edit: string;
};
export function Shop({ collection }: { collection?: string }) {
  const { catalog: activeCatalog, t, text, money, preset } = useShop();
  const catalog = collection
    ? products.filter((p) => p.category === collection)
    : activeCatalog;
  const cats = collection
    ? categories.filter((c) => c.id === collection)
    : getCategories(preset);
  const limit =
    Math.ceil(Math.max(...catalog.map((p) => p.price), 100) / 100) * 100;
  const defaults: Filters = {
    category: collection || "",
    color: "",
    max: limit,
    available: false,
    query: "",
    edit: "",
  };
  const [filters, setFilters] = useState<Filters>(defaults),
    [draft, setDraft] = useState<Filters>(defaults),
    [open, setOpen] = useState(false),
    [sort, setSort] = useState("featured"),
    [density, setDensity] = useState(4);
  useEffect(() => {
    const edit = new URLSearchParams(window.location.search).get("edit");
    setFilters({
      ...defaults,
      edit: edit === "new" || edit === "featured" ? edit : "",
    });
  }, [preset, collection, limit]);
  const update = (key: keyof Filters, value: string | number | boolean) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const colors = [
    ...new Map(catalog.flatMap((p) => p.colors).map((c) => [c.id, c])).values(),
  ];
  const items = useMemo(() => {
    const result = catalog.filter(
      (p) =>
        (!filters.category || p.category === filters.category) &&
        (!filters.color || p.colors.some((c) => c.id === filters.color)) &&
        p.price <= filters.max &&
        (!filters.available || isAvailable(p)) &&
        (!filters.edit || (filters.edit === "new" ? p.isNew : p.featured)) &&
        (p.name.ar + " " + p.name.en)
          .toLowerCase()
          .includes(filters.query.trim().toLowerCase()),
    );
    return result.sort((a, b) =>
      sort === "price-up"
        ? a.price - b.price
        : sort === "price-down"
          ? b.price - a.price
          : sort === "newest"
            ? b.date.localeCompare(a.date)
            : Number(b.featured) - Number(a.featured),
    );
  }, [catalog, filters, sort]);
  const cat = categories.find((c) => c.id === collection);
  const chips = [
    filters.category && !collection
      ? {
          key: "category" as const,
          label: text(categories.find((c) => c.id === filters.category)!.name),
          reset: "",
        }
      : null,
    filters.color
      ? {
          key: "color" as const,
          label: text(
            colors.find((c) => c.id === filters.color)?.name || {
              ar: "اللون",
              en: "Color",
            },
          ),
          reset: "",
        }
      : null,
    filters.max < limit
      ? {
          key: "max" as const,
          label: t("حتى ", "Up to ") + money(filters.max),
          reset: limit,
        }
      : null,
    filters.available
      ? {
          key: "available" as const,
          label: t("المتاح فقط", "Available only"),
          reset: false,
        }
      : null,
    filters.edit
      ? {
          key: "edit" as const,
          label:
            filters.edit === "new"
              ? t("وصل حديثاً", "New arrivals")
              : t("مختاراتنا", "The edit"),
          reset: "",
        }
      : null,
  ].filter((x): x is NonNullable<typeof x> => !!x);
  const fields = (state: Filters, set: (s: Filters) => void) => (
    <>
      <fieldset>
        <legend>{t("المجموعة", "Collection")}</legend>
        {cats.map((c) => (
          <label className="filter-check" key={c.id}>
            <input
              type="radio"
              name={open ? "drawer-category" : "category"}
              checked={state.category === c.id}
              onChange={() => set({ ...state, category: c.id })}
              disabled={!!collection && collection !== c.id}
            />
            <span>{text(c.name)}</span>
            <small>{catalog.filter((p) => p.category === c.id).length}</small>
          </label>
        ))}
        {!collection && (
          <label className="filter-check">
            <input
              type="radio"
              name={open ? "drawer-category" : "category"}
              checked={!state.category}
              onChange={() => set({ ...state, category: "" })}
            />
            <span>{t("كل المجموعات", "All collections")}</span>
          </label>
        )}
      </fieldset>
      <fieldset>
        <legend>{t("السعر", "Price")}</legend>
        <div className="price-filter-label">
          <span>{money(0)}</span>
          <b>{money(state.max)}</b>
        </div>
        <input
          className="price-range"
          type="range"
          min={0}
          max={limit}
          step={10}
          value={state.max}
          onChange={(e) => set({ ...state, max: Number(e.target.value) })}
          aria-label={t("الحد الأعلى للسعر", "Maximum price")}
        />
      </fieldset>
      <fieldset>
        <legend>{t("اللون", "Color")}</legend>
        <div className="filter-colors">
          {colors.map((c) => (
            <button
              key={c.id}
              style={{ background: c.hex }}
              className={
                "color-option " + (state.color === c.id ? "active" : "")
              }
              onClick={() =>
                set({ ...state, color: state.color === c.id ? "" : c.id })
              }
              aria-pressed={state.color === c.id}
              aria-label={text(c.name)}
              title={text(c.name)}
            />
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>{t("التوفر", "Availability")}</legend>
        <label className="filter-check">
          <input
            type="checkbox"
            checked={state.available}
            onChange={(e) => set({ ...state, available: e.target.checked })}
          />
          <span>{t("المتاح فقط", "Available only")}</span>
        </label>
      </fieldset>
    </>
  );
  return (
    <section className="container page-section shop-page">
      <nav className="breadcrumbs" aria-label={t("مسار التنقل", "Breadcrumb")}>
        <Link href="/">{t("الرئيسية", "Home")}</Link>
        <span>/</span>
        <span>{cat ? text(cat.name) : t("المتجر", "Shop")}</span>
      </nav>
      <div className="shop-title">
        <div>
          <span className="eyebrow">
            {t("مختارة لترافقك", "A COLLECTION TO MAKE YOUR OWN")}
          </span>
          <h1>{cat ? text(cat.name) : t("كل التفاصيل.", "Every detail.")}</h1>
          <p>
            {cat
              ? text(cat.intro)
              : t(
                  "اختيارات مدروسة لأسلوب يشبهك.",
                  "Considered pieces. Entirely your own.",
                )}
          </p>
        </div>
        <span className="shop-folio" dir="ltr">
          {String(catalog.length).padStart(2, "0")}
          <small>{t("قطعة مختارة", "CONSIDERED PIECES")}</small>
        </span>
      </div>
      <div className="shop-tabs">
        <button
          className={!filters.edit ? "active" : ""}
          onClick={() => update("edit", "")}
        >
          {t("كل القطع", "All pieces")}
        </button>
        <button
          className={filters.edit === "new" ? "active" : ""}
          onClick={() => update("edit", "new")}
        >
          {t("وصل حديثاً", "New arrivals")}
        </button>
        <button
          className={filters.edit === "featured" ? "active" : ""}
          onClick={() => update("edit", "featured")}
        >
          {t("مختاراتنا", "The edit")}
        </button>
      </div>
      <div className="shop-toolbar">
        <label className="shop-search">
          <Search size={17} />
          <input
            value={filters.query}
            onChange={(e) => update("query", e.target.value)}
            aria-label={t("البحث في المنتجات", "Search the collection")}
            placeholder={t("ابحث في المجموعة…", "Search the collection…")}
          />
        </label>
        <div className="shop-tools">
          <button
            className="filter-mobile-button"
            onClick={() => {
              setDraft(filters);
              setOpen(true);
            }}
          >
            <SlidersHorizontal size={17} />
            {t("تصفية", "Filter")}{" "}
            {chips.length > 0 && "(" + chips.length + ")"}
          </button>
          <label className="sort-label">
            <span className="sr-only">{t("ترتيب حسب", "Sort by")}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">
                {t("المختارات أولاً", "Featured first")}
              </option>
              <option value="newest">{t("الأحدث", "Newest")}</option>
              <option value="price-up">
                {t("السعر: الأقل أولاً", "Price: low to high")}
              </option>
              <option value="price-down">
                {t("السعر: الأعلى أولاً", "Price: high to low")}
              </option>
            </select>
          </label>
          <div className="density-control">
            <button
              aria-label={t("شبكة واسعة", "Spacious grid")}
              aria-pressed={density === 3}
              onClick={() => setDensity(3)}
            >
              <Columns2 size={18} />
            </button>
            <button
              aria-label={t("شبكة كثيفة", "Compact grid")}
              aria-pressed={density === 4}
              onClick={() => setDensity(4)}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="shop-layout">
        <aside className="filter-sidebar">
          <div className="filter-heading">
            <h2>{t("صفِّ اختياراتك", "Refine your edit")}</h2>
            <SlidersHorizontal size={16} />
          </div>
          {fields(filters, setFilters)}
          <button
            className="clear-filters"
            onClick={() => setFilters(defaults)}
          >
            {t("مسح الفلاتر", "Clear filters")}
          </button>
        </aside>
        <div className="shop-results">
          <div className="results-heading">
            <span aria-live="polite">
              {items.length} {t("قطعة", "pieces")}
            </span>
            {chips.length > 0 && (
              <div className="active-filters">
                {chips.map((c) => (
                  <button key={c.key} onClick={() => update(c.key, c.reset)}>
                    {c.label}
                    <X size={12} />
                  </button>
                ))}
              </div>
            )}
          </div>
          {items.length ? (
            <ProductGrid items={items} density={density === 3 ? 3 : 4} />
          ) : (
            <div className="empty-state">
              <Search size={35} />
              <h2>
                {t("لم نجد ما يطابق اختياراتك", "No pieces match your edit")}
              </h2>
              <p>
                {t(
                  "خفّف الفلاتر أو جرّب عبارة بحث أخرى.",
                  "Refine your filters or try another search.",
                )}
              </p>
              <button className="button" onClick={() => setFilters(defaults)}>
                {t("مسح البحث والفلاتر", "Reset search & filters")}
                <Forward />
              </button>
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t("صفِّ اختياراتك", "Refine your edit")}
        side
        className="filter-drawer"
      >
        {fields(draft, setDraft)}
        <div className="filter-drawer-actions">
          <button
            className="button full"
            onClick={() => {
              setFilters(draft);
              setOpen(false);
            }}
          >
            {t("تطبيق الفلاتر", "Apply filters")}
            <Forward />
          </button>
          <button
            className="text-link"
            onClick={() => {
              setDraft(defaults);
              setFilters(defaults);
              setOpen(false);
            }}
          >
            {t("مسح الفلاتر", "Clear filters")}
          </button>
        </div>
      </Dialog>
    </section>
  );
}
