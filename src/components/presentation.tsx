"use client";
import { assetUrl } from "@/lib/paths";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Monitor,
  Smartphone,
  RotateCcw,
  ExternalLink,
  Check,
  SlidersHorizontal,
} from "lucide-react";
import { useShop } from "./store-provider";
import { presets, type Preset } from "@/config/theme.config";
import { Forward } from "./ui";
export function Presentation() {
  const {
    t,
    text,
    name,
    setName,
    preset,
    setPreset,
    locale,
    setLocale,
    reset,
  } = useShop();
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop"),
    [draft, setDraft] = useState(name),
    [revision, setRevision] = useState(0),
    [stageWidth, setStageWidth] = useState(1200);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => setDraft(name), [name]);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () =>
      setStageWidth(el.clientWidth || window.innerWidth - 40);
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const ob = new ResizeObserver(measure);
      ob.observe(el);
      return () => ob.disconnect();
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const viewportWidth = device === "desktop" ? 1440 : 390,
    frameInsets = device === "mobile" ? 16 : 2,
    frameWidth = viewportWidth + frameInsets,
    frameHeight = 855 + frameInsets,
    scale = Math.min(1, Math.max(240, stageWidth - 40) / frameWidth);
  const apply = () => {
    setName(draft.trim().slice(0, 40) || "VELORA");
    setRevision((x) => x + 1);
  };
  return (
    <section className="presentation-page">
      <div className="container">
        <div className="page-heading">
          <span className="eyebrow">
            {t("مساحة العرض الخاصة بك", "YOUR PRIVATE SHOWROOM")}
          </span>
          <h1>{t("تخيّل علامتك هنا.", "Imagine your label here.")}</h1>
          <p>
            {t(
              "غيّر الهوية والمجموعة، واستكشف تجربة الهاتف والديسكتوب. كل التغييرات محلية وتجريبية.",
              "Change the identity and edit, then explore the desktop and mobile experience. Every change is local to this demo.",
            )}
          </p>
        </div>
        <div className="presentation-controls">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              apply();
            }}
          >
            <label htmlFor="brand-name">
              {t("اسم المتجر التجريبي", "Demo store name")}
            </label>
            <div>
              <input
                id="brand-name"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={40}
              />
              <button
                type="submit"
                className="icon-button"
                aria-label={t("تطبيق الاسم", "Apply name")}
              >
                <Check size={19} />
              </button>
            </div>
          </form>
          <label>
            {t("مجال المتجر", "Store direction")}
            <select
              value={preset}
              onChange={(e) => {
                setPreset(e.target.value as Preset);
                setRevision((x) => x + 1);
              }}
            >
              {(Object.keys(presets) as Preset[]).map((p) => (
                <option value={p} key={p}>
                  {text(presets[p])}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("لغة العرض", "Presentation language")}
            <select
              value={locale}
              onChange={(e) => {
                setLocale(e.target.value as typeof locale);
                setRevision((x) => x + 1);
              }}
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </label>
          <div className="device-picker">
            <button
              className={device === "desktop" ? "active" : ""}
              aria-pressed={device === "desktop"}
              onClick={() => setDevice("desktop")}
            >
              <Monitor size={19} />
              {t("ديسكتوب", "Desktop")}
            </button>
            <button
              className={device === "mobile" ? "active" : ""}
              aria-pressed={device === "mobile"}
              onClick={() => setDevice("mobile")}
            >
              <Smartphone size={19} />
              {t("هاتف", "Mobile")}
            </button>
          </div>
          <button
            className="reset-button"
            onClick={() => {
              reset();
              setDraft("VELORA");
              setRevision((x) => x + 1);
            }}
          >
            <RotateCcw size={17} />
            {t("استعادة", "Reset")}
          </button>
        </div>
        <div className="presentation-status">
          <span>
            <span className="status-dot" />
            {name} / {text(presets[preset])}
          </span>
          <a href={assetUrl("/")} target="_blank" rel="noreferrer">
            {t("فتح التجربة", "Open experience")}
            <ExternalLink size={14} />
          </a>
        </div>
        <div ref={stage} className={"preview-stage " + device}>
          <div
            className="preview-envelope"
            style={{ width: frameWidth * scale, height: frameHeight * scale }}
          >
            <div
              className="preview-browser"
              style={{
                width: frameWidth,
                transform: "scale(" + scale + ")",
                transformOrigin: "top left",
                maxWidth: "none",
              }}
            >
              <div className="browser-chrome">
                <div>
                  <i />
                  <i />
                  <i />
                </div>
                <span>
                  {name.toLowerCase().replace(/\s+/g, "-")} ·{" "}
                  {t("تجربة توضيحية", "DEMONSTRATION")}
                </span>
                <span>
                  {viewportWidth} /{" "}
                  {locale.toUpperCase()}
                </span>
              </div>
              <iframe
                key={preset + locale + revision}
                width={viewportWidth}
                style={{ width: viewportWidth }}
                src={assetUrl("/?preview=1")}
                title={t(
                  "معاينة المتجر على " +
                    (device === "mobile" ? "الهاتف" : "الديسكتوب"),
                  "Store preview on " + device,
                )}
                loading="eager"
              />
            </div>
          </div>
        </div>
        <div className="presentation-disclaimer">
          <SlidersHorizontal size={19} />
          <p>
            {t(
              "الكتالوج يتغيّر فعلياً مع المجال. الأزياء تعرض المقاسات، والتقنية تعرض معلومات مناسبة. تغيير المجال يفرغ السلة لمنع خلط تجارب العرض.",
              "The catalog changes with the industry. Fashion includes sizes, while technology uses appropriate product details. Changing direction clears the bag to keep presentations consistent.",
            )}
          </p>
          <Link href="/" className="text-link">
            {t("عُد إلى المتجر", "Return to the store")}
            <Forward />
          </Link>
        </div>
      </div>
    </section>
  );
}
