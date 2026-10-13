"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { products, getCatalog, type Product } from "@/data/products";
import { presets, themeConfig, type Preset } from "@/config/theme.config";
import {
  storeConfig,
  type Locale,
  type LocalText,
} from "@/config/store.config";
import {
  sanitizeCart,
  safeIds,
  lineKey,
  cartSubtotal,
  type CartLine,
} from "@/lib/commerce";
type Shop = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (ar: string, en: string) => string;
  text: (x: LocalText) => string;
  money: (n: number) => string;
  name: string;
  setName: (s: string) => void;
  preset: Preset;
  setPreset: (p: Preset) => void;
  catalog: Product[];
  cart: CartLine[];
  count: number;
  subtotal: number;
  add: (p: Product, variant: string, color: string, qty?: number) => void;
  quantity: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWish: (id: string) => void;
  recent: string[];
  view: (id: string) => void;
  cartOpen: boolean;
  setCartOpen: (b: boolean) => void;
  notify: (s: string) => void;
  ready: boolean;
  reset: () => void;
};
const Context = createContext<Shop | null>(null);
const KEY = "velora-demo-v1";
export function StoreProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(storeConfig.defaultLanguage),
    [name, setName] = useState<string>(storeConfig.name),
    [preset, setPresetState] = useState<Preset>("lifestyle");
  const [cart, setCart] = useState<CartLine[]>([]),
    [wishlist, setWishlist] = useState<string[]>([]),
    [recent, setRecent] = useState<string[]>([]),
    [cartOpen, setCartOpen] = useState(false),
    [toast, setToast] = useState(""),
    [ready, setReady] = useState(false);
  const t = useCallback(
    (ar: string, en: string) => (locale === "ar" ? ar : en),
    [locale],
  );
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (raw && typeof raw === "object") {
        setCart(sanitizeCart(raw.cart, products));
        setWishlist(
          safeIds(
            raw.wishlist,
            products.map((p) => p.id),
          ),
        );
        setRecent(
          safeIds(
            raw.recent,
            products.map((p) => p.id),
          ).slice(0, 8),
        );
        if (raw.locale === "ar" || raw.locale === "en") setLocale(raw.locale);
        if (typeof raw.name === "string" && raw.name.trim())
          setName(raw.name.slice(0, 40));
        if (
          typeof raw.preset === "string" &&
          Object.hasOwn(presets, raw.preset)
        )
          setPresetState(raw.preset);
      }
    } catch {
      /* Invalid or unavailable storage falls back to in-memory state. */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ locale, name, preset, cart, wishlist, recent }),
      );
    } catch {
      /* Shopping continues without persistence. */
    }
  }, [ready, locale, name, preset, cart, wishlist, recent]);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    const style = document.documentElement.style;
    style.setProperty(
      "--accent",
      preset === "lifestyle" ? themeConfig.accent : presets[preset].accent,
    );
    style.setProperty(
      "--paper",
      preset === "lifestyle"
        ? themeConfig.background
        : presets[preset].background,
    );
    for (const [key, value] of Object.entries({
      surface: themeConfig.surface,
      ink: themeConfig.ink,
      muted: themeConfig.muted,
      line: themeConfig.border,
      dark: themeConfig.dark,
    }))
      style.setProperty("--" + key, value);
    style.setProperty(
      "--body-font",
      locale === "ar" ? themeConfig.fontArabic : themeConfig.fontSans,
    );
    style.setProperty(
      "--display-font",
      locale === "ar" ? themeConfig.fontArabic : themeConfig.fontDisplay,
    );
  }, [locale, preset]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(timer);
  }, [toast]);
  const notify = useCallback((s: string) => setToast(s), []);
  const add = useCallback(
    (p: Product, variant: string, color: string, qty = 1) => {
      const v = p.variants.find((x) => x.id === variant);
      if (!v || v.stock === 0 || !p.colors.some((x) => x.id === color)) return;
      const next = {
        id: p.id,
        variant,
        color,
        qty: Math.max(1, Math.min(v.stock, Math.floor(qty))),
      };
      setCart((prev) => sanitizeCart([...prev, next], products));
      setCartOpen(true);
    },
    [],
  );
  const quantity = useCallback(
    (key: string, qty: number) =>
      setCart((prev) =>
        sanitizeCart(
          prev.map((l) => (lineKey(l) === key ? { ...l, qty } : l)),
          products,
        ),
      ),
    [],
  );
  const remove = useCallback(
    (key: string) => setCart((prev) => prev.filter((l) => lineKey(l) !== key)),
    [],
  );
  const toggleWish = useCallback((id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);
  const view = useCallback(
    (id: string) =>
      setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8)),
    [],
  );
  const setPreset = useCallback(
    (p: Preset) => {
      if (p === preset) return;
      setPresetState(p);
      setCart([]);
      notify(
        t(
          "تم تغيير المجموعة وإفراغ السلة التجريبية.",
          "Collection changed. Your demo bag has been cleared.",
        ),
      );
    },
    [preset, notify, t],
  );
  const reset = useCallback(() => {
    setName(storeConfig.name);
    setPresetState("lifestyle");
    setLocale("ar");
    setCart([]);
    setWishlist([]);
    setRecent([]);
    notify(
      t(
        "استُعيدت هوية VELORA الأصلية.",
        "The original VELORA identity is restored.",
      ),
    );
  }, [notify, t]);
  const value: Shop = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      text: (x) => x[locale],
      money: (n) =>
        new Intl.NumberFormat(locale === "ar" ? "ar-PS" : "en-IL", {
          style: "currency",
          currency: storeConfig.currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(n),
      name,
      setName,
      preset,
      setPreset,
      catalog: getCatalog(preset),
      cart,
      count: cart.reduce((s, l) => s + l.qty, 0),
      subtotal: cartSubtotal(cart, products),
      add,
      quantity,
      remove,
      clearCart: () => setCart([]),
      wishlist,
      toggleWish,
      recent,
      view,
      cartOpen,
      setCartOpen,
      notify,
      ready,
      reset,
    }),
    [
      locale,
      t,
      name,
      preset,
      setPreset,
      cart,
      add,
      quantity,
      remove,
      wishlist,
      toggleWish,
      recent,
      view,
      cartOpen,
      notify,
      ready,
      reset,
    ],
  );
  return (
    <Context.Provider value={value}>
      {children}
      <div
        className={"toast " + (toast ? "visible" : "")}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {toast}
      </div>
    </Context.Provider>
  );
}
export function useShop() {
  const x = useContext(Context);
  if (!x) throw new Error("Store context missing");
  return x;
}
