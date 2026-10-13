"use client";
import { useShop } from "@/components/store-provider";
export default function Error({ reset }: { reset: () => void }) {
  const { t } = useShop();
  return (
    <section className="container empty-state">
      <h1>{t("تعذّر عرض هذا التفصيل.", "We could not load this detail.")}</h1>
      <p>
        {t(
          "أعد المحاولة للعودة إلى التجربة.",
          "Try again to return to the experience.",
        )}
      </p>
      <button className="button" onClick={reset}>
        {t("إعادة المحاولة", "Try again")}
      </button>
    </section>
  );
}
