import type { LocalText } from "../config/store.config";
import type { Preset } from "../config/theme.config";
export type Product = {
  id: string;
  slug: string;
  name: LocalText;
  description: LocalText;
  category: string;
  price: number;
  images: string[];
  duo: boolean;
  colors: { id: string; hex: string; name: LocalText }[];
  variants: { id: string; name: LocalText; price: number; stock: number }[];
  featured: boolean;
  isNew: boolean;
  date: string;
  materials: LocalText;
  details: { label: LocalText; value: LocalText }[];
  relatedProductIds: string[];
  presets: Preset[];
};
export const categories = [
  {
    id: "watches",
    name: { ar: "الساعات", en: "Watches" },
    intro: {
      ar: "دقائق صغيرة. حضور كبير.",
      en: "Small moments. Lasting presence.",
    },
    image: "/images/w01.webp",
  },
  {
    id: "jewelry",
    name: { ar: "المجوهرات", en: "Jewelry" },
    intro: {
      ar: "بريق هادئ، وتفاصيل تلامس القلب.",
      en: "A quiet glow. A personal signature.",
    },
    image: "/images/j01.webp",
  },
  {
    id: "bags",
    name: { ar: "الحقائب", en: "Leather goods" },
    intro: {
      ar: "رفيقة يومك، بلمسة مختلفة.",
      en: "Everyday companions, beautifully considered.",
    },
    image: "/images/b01.webp",
  },
  {
    id: "fragrances",
    name: { ar: "العطور", en: "Fragrances" },
    intro: {
      ar: "للذكريات التي لا تُرى.",
      en: "For the memories you cannot see.",
    },
    image: "/images/f01.webp",
  },
  {
    id: "apparel",
    name: { ar: "الأزياء", en: "Apparel" },
    intro: {
      ar: "خطوط بسيطة تعبّر عنك.",
      en: "Silhouettes that speak for you.",
    },
    image: "/images/fashion-coat.webp",
  },
  {
    id: "audio",
    name: { ar: "الصوتيات", en: "Audio" },
    intro: { ar: "تفاصيل تسمعها.", en: "Every detail, heard." },
    image: "/images/tech-headphones.webp",
  },
  {
    id: "technology",
    name: { ar: "التقنية", en: "Technology" },
    intro: { ar: "مصممة لتسهّل يومك.", en: "Designed for your everyday." },
    image: "/images/tech-laptop.webp",
  },
];
const colors: Record<string, { id: string; hex: string; name: LocalText }> = {
  gold: { id: "gold", hex: "#b2965b", name: { ar: "ذهبي", en: "Gold" } },
  silver: { id: "silver", hex: "#a1a3a3", name: { ar: "فضي", en: "Silver" } },
  brown: { id: "brown", hex: "#68422e", name: { ar: "بني", en: "Espresso" } },
  navy: { id: "navy", hex: "#243044", name: { ar: "كحلي", en: "Navy" } },
  black: { id: "black", hex: "#262627", name: { ar: "أسود", en: "Black" } },
  rose: { id: "rose", hex: "#be9690", name: { ar: "وردي", en: "Rose" } },
  green: { id: "green", hex: "#5a6750", name: { ar: "أخضر", en: "Green" } },
  sand: { id: "sand", hex: "#cbb99a", name: { ar: "رملي", en: "Sand" } },
  burgundy: {
    id: "burgundy",
    hex: "#793840",
    name: { ar: "عنّابي", en: "Burgundy" },
  },
  ivory: { id: "ivory", hex: "#e6dfcc", name: { ar: "عاجي", en: "Ivory" } },
  red: { id: "red", hex: "#a83039", name: { ar: "أحمر", en: "Red" } },
  yellow: { id: "yellow", hex: "#dcb844", name: { ar: "أصفر", en: "Yellow" } },
  blue: { id: "blue", hex: "#637e94", name: { ar: "أزرق", en: "Blue" } },
  olive: { id: "olive", hex: "#637049", name: { ar: "زيتي", en: "Olive" } },
  white: { id: "white", hex: "#eeebe3", name: { ar: "أبيض", en: "White" } },
};
type Seed = [string, string, string, string, number, string, string?];
const seeds: Seed[] = [
  ["w01", "ساعة إيقاع", "Tempo Dress Watch", "watches", 890, "brown"],
  ["w02", "ساعة منتصف الليل", "Midnight Mesh Watch", "watches", 740, "navy"],
  ["w03", "ساعة خطوط", "Linea Square Watch", "watches", 960, "black"],
  ["w04", "ساعة روز", "Rose Dial Watch", "watches", 680, "rose"],
  ["w05", "ساعة نوار", "Noir Chronograph", "watches", 1120, "black"],
  ["w06", "ساعة فورست", "Forest Steel Watch", "watches", 1050, "green"],
  ["j01", "أقراط قوس", "Arc Hoops", "jewelry", 290, "gold"],
  ["j02", "قلادة قطرة", "Pearl Drop Necklace", "jewelry", 340, "gold"],
  ["j03", "سوار منحنى", "Curve Cuff", "jewelry", 260, "gold"],
  ["j04", "خاتم ضوء", "Lumière Ring", "jewelry", 420, "silver"],
  ["j05", "أقراط لؤلؤ", "Pearl Drop Earrings", "jewelry", 310, "ivory"],
  ["j06", "سوار سلسلة", "Fine Chain Bracelet", "jewelry", 230, "gold"],
  ["b01", "حقيبة إسبريسو", "Espresso Top Handle", "bags", 1290, "brown"],
  ["b02", "حقيبة هلال", "Crescent Shoulder Bag", "bags", 960, "sand"],
  ["b03", "حقيبة سهرة", "Nocturne Clutch", "bags", 640, "black"],
  ["b04", "حقيبة يوم", "Everyday Tote", "bags", 1180, "sand"],
  ["b05", "حقيبة عنّاب", "Bordeaux Crossbody", "bags", 780, "burgundy"],
  ["b06", "حقيبة أوليف", "Olive Handbag", "bags", 1090, "green"],
  ["f01", "عطر أمبر", "Amber No. 01", "fragrances", 390, "gold"],
  ["f02", "عطر بلانك", "Blanc No. 02", "fragrances", 360, "ivory"],
  ["f03", "عطر روزيه", "Rosé No. 03", "fragrances", 410, "rose"],
  ["f04", "عطر نوار", "Noir No. 04", "fragrances", 450, "black"],
  ["f05", "عطر فيرت", "Vert No. 05", "fragrances", 380, "green"],
  ["f06", "عطر وود", "Wood No. 06", "fragrances", 460, "brown"],
  [
    "a01",
    "قميص أزرق",
    "Blue Everyday Shirt",
    "apparel",
    280,
    "blue",
    "fashion-shirt",
  ],
  [
    "a02",
    "بونشو عاجي",
    "Ivory Knit Poncho",
    "apparel",
    390,
    "ivory",
    "fashion-knit",
  ],
  [
    "a03",
    "معطف كراميل",
    "Caramel Wrap Coat",
    "apparel",
    740,
    "sand",
    "fashion-coat",
  ],
  [
    "a04",
    "فستان روبي",
    "Ruby Evening Dress",
    "apparel",
    890,
    "red",
    "fashion-dress",
  ],
  [
    "a05",
    "جاكيت زيتوني",
    "Olive Utility Jacket",
    "apparel",
    490,
    "olive",
    "fashion-jacket",
  ],
  [
    "a06",
    "تيشيرت أسود",
    "Black Graphic Tee",
    "apparel",
    180,
    "black",
    "lifestyle",
  ],
  [
    "t01",
    "سماعة ستوديو",
    "Studio Headphones",
    "audio",
    590,
    "black",
    "tech-headphones",
  ],
  [
    "t02",
    "سماعة كلاسيك",
    "Classic Over-Ear",
    "audio",
    690,
    "brown",
    "tech-black-headphones",
  ],
  [
    "t03",
    "سماعة محمولة",
    "Portable Speaker",
    "audio",
    420,
    "black",
    "tech-speaker",
  ],
  [
    "t04",
    "سماعات لاسلكية",
    "Wireless Earbuds",
    "audio",
    390,
    "navy",
    "tech-earbuds",
  ],
  [
    "t05",
    "حاسوب محمول",
    "Minimal Laptop",
    "technology",
    3900,
    "silver",
    "tech-laptop",
  ],
  [
    "t06",
    "كاميرا وعدسة",
    "Camera & Lens Kit",
    "technology",
    2450,
    "black",
    "tech-camera",
  ],
  [
    "t07",
    "لوحة مفاتيح",
    "Slim Keyboard",
    "technology",
    260,
    "white",
    "tech-keyboard",
  ],
];
const categoryDescriptions: Record<string, LocalText> = {
  watches: {
    ar: "تصميم متوازن يجمع بين وضوح الميناء وأناقة التفاصيل. قطعة هادئة ترافق يومك، وتضيف حضوراً محسوباً لكل إطلالة.",
    en: "A considered balance of a clear dial and refined detail. An understated companion that brings a quiet presence to your everyday.",
  },
  jewelry: {
    ar: "خطوط رقيقة وبريق مدروس. قطعة تختارها لنفسك أو تهديها لشخص يعني لك الكثير. جمالها في بساطتها وطريقة ارتدائها.",
    en: "Delicate lines and a considered glow. A piece to make your own or give to someone meaningful. Its beauty lies in the smallest details.",
  },
  bags: {
    ar: "حقيبة بتكوين واضح وتفاصيل أنيقة، تجمع بين الحضور والاستخدام اليومي. تصميم يرتّب يومك ويكمّل أسلوبك.",
    en: "A considered silhouette with refined details, bringing everyday practicality and an effortless presence together.",
  },
  fragrances: {
    ar: "تركيبة عطرية متخيّلة للعرض، في عبوة أنيقة تستحق مكاناً في تفاصيل يومك. حضور هادئ يترك أثره.",
    en: "An illustrative fragrance concept in a beautifully considered bottle. A quiet presence, made to leave an impression.",
  },
  apparel: {
    ar: "تصميم معاصر بخطوط واضحة وتفاصيل متوازنة. اختر المقاس المناسب واستكشف كيف تبدو تجربة شراء الأزياء داخل المتجر.",
    en: "A contemporary silhouette with considered details. Choose your size and explore a complete fashion shopping experience.",
  },
  audio: {
    ar: "تصميم مريح وتجربة صوتية توضيحية. المواصفات المدرجة بيانات تجريبية لا تمثل ضماناً لمنتج تجاري.",
    en: "An accessible audio concept. All specifications are illustrative demo data and do not represent a commercial product guarantee.",
  },
  technology: {
    ar: "اختيار تقني بواجهة واضحة لعرض المواصفات والخيارات. المواصفات والأسعار بيانات توضيحية لأغراض الديمو.",
    en: "A technology concept with clear specifications and choices. Prices and specifications are illustrative demo data.",
  },
};
function make(seed: Seed, index: number): Product {
  const [id, ar, en, category, price, color, asset] = seed;
  const stock = index === 11 || index === 20 ? 0 : 5 + (index % 8);
  let variants: Product["variants"];
  if (category === "fragrances")
    variants = [
      { id: "50ml", name: { ar: "٥٠ مل", en: "50 ml" }, price, stock },
      {
        id: "100ml",
        name: { ar: "١٠٠ مل", en: "100 ml" },
        price: Math.round(price * 1.5),
        stock: stock ? 6 : 0,
      },
    ];
  else if (category === "apparel")
    variants = ["S", "M", "L", "XL"].map((size, i) => ({
      id: size,
      name: { ar: size, en: size },
      price,
      stock: i === 3 ? 0 : stock,
    }));
  else if (id === "j04")
    variants = ["6", "7", "8"].map((size) => ({
      id: size,
      name: { ar: "مقاس " + size, en: "Size " + size },
      price,
      stock,
    }));
  else if (category === "watches")
    variants = ["standard", "small"].map((size) => ({
      id: size,
      name:
        size === "standard"
          ? { ar: "سوار قياسي", en: "Standard strap" }
          : { ar: "سوار صغير", en: "Small strap" },
      price,
      stock,
    }));
  else
    variants = [
      { id: "standard", name: { ar: "قياسي", en: "Standard" }, price, stock },
    ];
  const material: Record<string, LocalText> = {
    watches: {
      ar: "تشطيب معدني وسوار حسب التصميم",
      en: "Metal finish and design-specific strap",
    },
    jewelry: {
      ar: "تشطيب معدني زخرفي · نموذج عرض",
      en: "Decorative metal finish · Concept sample",
    },
    bags: {
      ar: "جلد بتشطيب محبّب · نموذج عرض",
      en: "Textured leather finish · Concept sample",
    },
    fragrances: {
      ar: "عبوة زجاجية · تركيبة متخيّلة",
      en: "Glass bottle · Illustrative fragrance",
    },
    apparel: {
      ar: "نسيج حسب القطعة · نموذج عرض",
      en: "Piece-specific fabric · Concept sample",
    },
    audio: {
      ar: "معدن وبوليمر · مواصفات توضيحية",
      en: "Metal and polymer · Illustrative specifications",
    },
    technology: {
      ar: "مواصفات توضيحية لأغراض العرض",
      en: "Illustrative specifications for presentation",
    },
  };
  const details: Product["details"] = [
    { label: { ar: "اللون", en: "Color" }, value: colors[color].name },
    {
      label: { ar: "المجموعة", en: "Collection" },
      value: categories.find((c) => c.id === category)!.name,
    },
  ];
  if (category === "audio")
    details.push(
      {
        label: { ar: "نوع الاتصال التجريبي", en: "Illustrative connection" },
        value: {
          ar: id === "t02" ? "سلكي" : "بلوتوث",
          en: id === "t02" ? "Wired" : "Bluetooth",
        },
      },
      {
        label: { ar: "استخدام الديمو", en: "Demo use" },
        value: {
          ar: "عرض المواصفات ومقارنة الاختيارات",
          en: "Specification and option presentation",
        },
      },
    );
  if (category === "technology")
    details.push({
      label: { ar: "المحتويات التجريبية", en: "Illustrative contents" },
      value: {
        ar:
          id === "t06"
            ? "كاميرا وعدسة"
            : id === "t05"
              ? "حاسوب وشاحن"
              : "لوحة مفاتيح",
        en:
          id === "t06"
            ? "Camera & lens"
            : id === "t05"
              ? "Laptop & charger"
              : "Keyboard",
      },
    });
  return {
    id,
    slug: en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-$/, ""),
    name: { ar, en },
    description: categoryDescriptions[category],
    category,
    price,
    images: [`/images/${asset || id}.webp`],
    duo: !asset,
    colors: [colors[color]],
    variants,
    featured: ["w01", "j01", "b01", "f01", "a03", "t01"].includes(id),
    isNew: index % 4 === 0,
    date: `2026-10-${String(28 - (index % 26)).padStart(2, "0")}`,
    materials: material[category],
    details,
    relatedProductIds: [],
    presets:
      category === "apparel"
        ? ["fashion"]
        : ["audio", "technology"].includes(category)
          ? ["tech"]
          : category === "bags"
            ? ["lifestyle", "fashion"]
            : category === "jewelry"
              ? ["lifestyle", "jewelry"]
              : category === "watches"
                ? ["lifestyle", "jewelry"]
                : ["lifestyle"],
  };
}
const initialProducts = seeds.map(make);
export const products: Product[] = initialProducts.map((p) => ({
  ...p,
  relatedProductIds: initialProducts
    .filter((q) => q.category === p.category && q.id !== p.id)
    .slice(0, 4)
    .map((q) => q.id),
}));
export const getCatalog = (preset: Preset) =>
  products.filter((p) => p.presets.includes(preset));
export const getCategories = (preset: Preset) =>
  categories.filter((c) => getCatalog(preset).some((p) => p.category === c.id));
export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);
export const isAvailable = (p: Product) => p.variants.some((v) => v.stock > 0);
