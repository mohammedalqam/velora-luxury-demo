export const themeConfig = {
  background: "#f6f3ed",
  surface: "#ebe6dc",
  ink: "#242420",
  muted: "#6d6961",
  accent: "#886d45",
  border: "#d8d1c5",
  dark: "#242820",
  fontArabic: "IBM Plex Sans Arabic",
  fontSans: "Manrope",
  fontDisplay: "Cormorant Garamond",
  motion: { duration: 600, easing: "cubic-bezier(.2,.65,.3,1)" },
};
export type Preset = "lifestyle" | "jewelry" | "fashion" | "tech";
export const presets: Record<
  Preset,
  {
    ar: string;
    en: string;
    accent: string;
    background: string;
    hero: string;
    title: { ar: string; en: string };
    description: { ar: string; en: string };
  }
> = {
  lifestyle: {
    ar: "أسلوب حياة فاخر",
    en: "Curated lifestyle",
    accent: "#886d45",
    background: "#f6f3ed",
    hero: "/images/hero.webp",
    title: { ar: "تفاصيل\nتصنع الفرق.", en: "Designed to\nbe remembered." },
    description: {
      ar: "قطع مختارة بعناية. أناقة تتجاوز اللحظة.\nاكتشف عالماً من التفاصيل التي تشبهك.",
      en: "Considered objects. Effortless presence.\nA collection for the moments that become yours.",
    },
  },
  jewelry: {
    ar: "مجوهرات وإكسسوارات",
    en: "Jewelry & accessories",
    accent: "#90724d",
    background: "#f6f0e6",
    hero: "/images/jewel-hoops.webp",
    title: {
      ar: "أثر صغير.\nحضور لا يُنسى.",
      en: "A little detail.\nAn enduring presence.",
    },
    description: {
      ar: "تكوينات رقيقة، وبريق محسوب.\nاكتشف مجموعة المجوهرات والإكسسوارات.",
      en: "Quiet compositions. A considered glow.\nDiscover our jewelry and accessories edit.",
    },
  },
  fashion: {
    ar: "أزياء معاصرة",
    en: "Contemporary fashion",
    accent: "#755c53",
    background: "#f5f1ee",
    hero: "/images/fashion-hero.webp",
    title: {
      ar: "أناقة تُحكى\nبطريقتك.",
      en: "An expression.\nEntirely yours.",
    },
    description: {
      ar: "خطوط بسيطة، وتفاصيل مدروسة.\nمجموعة مصممة لإيقاع يومك.",
      en: "Clean silhouettes. Considered details.\nA collection for your everyday rhythm.",
    },
  },
  tech: {
    ar: "تقنية راقية",
    en: "Premium technology",
    accent: "#596e79",
    background: "#f2f4f4",
    hero: "/images/tech-headphones.webp",
    title: {
      ar: "تقنية أذكى.\nتصميم أهدأ.",
      en: "Thoughtful tech.\nBeautifully simple.",
    },
    description: {
      ar: "اختيارات عملية بتصميم واضح.\nتقنية تنسجم مع حياتك.",
      en: "Useful objects. Intentional design.\nTechnology that feels at home in your life.",
    },
  },
};
