"use client";
import { useRef, useEffect, type ReactNode, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpLeft, ArrowUpRight, X, Plus, Minus } from "lucide-react";
import { useShop } from "./store-provider";
import type { Product } from "@/data/products";
import { assetUrl } from "@/lib/paths";
export function Forward({ size = 18 }: { size?: number }) {
  const { locale } = useShop();
  return locale === "ar" ? (
    <ArrowUpLeft size={size} aria-hidden="true" />
  ) : (
    <ArrowUpRight size={size} aria-hidden="true" />
  );
}
export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={"text-link " + className}>
      {children}
      <Forward />
    </Link>
  );
}
export function Photo({
  product,
  view = 0,
  className = "",
  priority = false,
}: {
  product: Product;
  view?: number;
  className?: string;
  priority?: boolean;
}) {
  const { text } = useShop();
  const src = product.images[view % product.images.length];
  return (
    <div
      className={"photo " + (product.duo ? "duo " : "") + className}
      data-view={product.duo ? view % 2 : 0}
    >
      <img
        src={assetUrl(src)}
        alt={
          text(product.name) +
          (view === 1
            ? " · " + text({ ar: "زاوية جانبية", en: "Side view" })
            : "")
        }
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        width={product.duo ? 1536 : 1100}
        height={product.duo ? 1024 : 1400}
        onError={(e) => {
          if (!e.currentTarget.src.endsWith("/images/fallback.svg")) {
            e.currentTarget.src = assetUrl("/images/fallback.svg");
            e.currentTarget.classList.add("fallback-image");
          }
        }}
      />
    </div>
  );
}
export function Dialog({
  open,
  onClose,
  title,
  children,
  side = false,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: boolean;
  className?: string;
}) {
  const { t } = useShop();
  const ref = useRef<HTMLDialogElement>(null),
    saved = useRef("");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      saved.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      el.showModal();
    } else if (!open && el.open) {
      el.close();
      document.body.style.overflow = saved.current;
    }
    return () => {
      if (el.open) {
        el.close();
        document.body.style.overflow = saved.current;
      }
    };
  }, [open]);
  const id = title.replace(/\s+/g, "-");
  return (
    <dialog
      ref={ref}
      className={"dialog " + (side ? "drawer " : "") + className}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <div className="dialog-heading">
        <h2 id={id}>{title}</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label={t("إغلاق", "Close")}
        >
          <X size={22} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Quantity({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const { t } = useShop();
  return (
    <div className="quantity">
      <button
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={t("تقليل الكمية", "Decrease quantity")}
      >
        <Minus size={14} />
      </button>
      <output aria-live="polite">{value}</output>
      <button
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={t("زيادة الكمية", "Increase quantity")}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
export function Empty({
  symbol,
  title,
  description,
  href = "/shop/",
  action,
}: {
  symbol: ReactNode;
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  const { t } = useShop();
  return (
    <div className="empty-state">
      <div className="empty-symbol">{symbol}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link className="button" href={href}>
        {action || t("اكتشف المجموعة", "Explore the collection")}
        <Forward />
      </Link>
    </div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function Reveal({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    el.classList.add("will-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div className={"reveal " + className} ref={ref} style={style}>
      {children}
    </div>
  );
}
