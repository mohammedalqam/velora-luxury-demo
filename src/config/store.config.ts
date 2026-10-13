export const storeConfig = {
  name: "VELORA",
  logo: "",
  defaultLanguage: "ar" as const,
  currency: "ILS",
  contactEmail: "",
  contactLinks: [] as { label: LocalText; url: string }[],
  socialLinks: [] as { label: string; url: string }[],
  announcement: {
    ar: "المجموعة الأولى · تفاصيل تبقى معك",
    en: "The first collection · Objects worth keeping",
  },
  shipping: {
    freeAbove: 900,
    standard: 25,
    express: 45,
    collection: 0,
    regionalSurcharge: 15,
  },
  home: {
    hero: "/images/hero.webp",
    title: { ar: "تفاصيل\nتصنع الفرق.", en: "Designed to\nbe remembered." },
    description: {
      ar: "قطع مختارة بعناية. أناقة تتجاوز اللحظة.\nاكتشف عالماً من التفاصيل التي تشبهك.",
      en: "Considered objects. Effortless presence.\nA collection for the moments that become yours.",
    },
    campaign: "/images/architecture.webp",
    featuredCollections: ["watches", "jewelry", "bags", "fragrances"],
  },
  footer: {
    ar: "للأشياء التي تختار البقاء.",
    en: "For the things you choose to keep.",
  },
  demoNotice: {
    ar: "تجربة توضيحية · لا طلبات أو مدفوعات فعلية",
    en: "Demonstration · No real orders or payments",
  },
};
export type Locale = "ar" | "en";
export type LocalText = { ar: string; en: string };
