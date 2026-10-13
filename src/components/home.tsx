"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown, Package, Truck, Heart } from "lucide-react";
import { useShop } from "./store-provider";
import { presets } from "@/config/theme.config";
import { getCategories } from "@/data/products";
import { storeConfig } from "@/config/store.config";
import { assetUrl } from "@/lib/paths";
import { ProductCard, ProductGrid } from "./products";
import { Photo, Forward, SectionHeading, TextLink, Reveal } from "./ui";
export function Home() {
  const { t, text, name, preset, catalog, recent } = useShop();
  const allCats = getCategories(preset);
  const cats =
    preset === "lifestyle"
      ? storeConfig.home.featuredCollections
          .map((id) => allCats.find((c) => c.id === id))
          .filter((c): c is NonNullable<typeof c> => !!c)
      : allCats;
  const theme =
    preset === "lifestyle"
      ? {
          ...presets.lifestyle,
          hero: storeConfig.home.hero,
          title: storeConfig.home.title,
          description: storeConfig.home.description,
        }
      : presets[preset];
  const hero = useRef<HTMLElement>(null),
    art = useRef<HTMLImageElement>(null);
  const selected = catalog.filter((p) => p.featured);
  const selection = [...selected, ...catalog.filter((p) => !p.featured)].slice(
    0,
    4,
  );
  const story =
    catalog.find(
      (p) =>
        p.category ===
        (preset === "tech"
          ? "audio"
          : preset === "fashion"
            ? "apparel"
            : "jewelry"),
    ) || catalog[0];
  const arrivals = catalog.filter((p) => p.isNew).slice(0, 4);
  const viewed = recent
    .map((id) => catalog.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 4);
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth < 769
    )
      return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (
          art.current &&
          hero.current &&
          window.scrollY < hero.current.offsetHeight + 150
        )
          art.current.style.transform =
            "translateY(" +
            Math.min(80, window.scrollY * 0.12) +
            "px) scale(1.035)";
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <>
      <section className={"hero preset-" + preset} ref={hero}>
        <div className="hero-art">
          <img
            ref={art}
            src={assetUrl(theme.hero)}
            alt={t(
              "المجموعة الأولى من " + name,
              "The first collection from " + name,
            )}
            width={1536}
            height={1024}
            fetchPriority="high"
          />
          <span className="hero-art-caption">
            {preset === "lifestyle"
              ? "THE TEMPO COLLECTION"
              : "THE " + preset.toUpperCase() + " EDIT"}{" "}
            <span>01 — 26</span>
          </span>
        </div>
        <div className="hero-content">
          <span className="eyebrow hero-eyebrow">
            <span className="small-line" />
            {t("المجموعة الأولى · ٢٠٢٦", "THE FIRST COLLECTION · 2026")}
          </span>
          <h1>{text(theme.title)}</h1>
          <p>{text(theme.description)}</p>
          <Link href="/shop/" className="button hero-button">
            {t("اكتشف المجموعة", "Explore the collection")}
            <Forward />
          </Link>
          <span className="hero-note">
            {t(
              "عالم من التفاصيل. برؤية مختلفة.",
              "A world of details. A different perspective.",
            )}
          </span>
        </div>
        <a className="scroll-cue" href="#the-edit">
          <span>{t("واصل الاكتشاف", "SCROLL TO DISCOVER")}</span>
          <ArrowDown size={15} />
        </a>
      </section>
      <div className="brand-strip">
        <span>{t("اختيارات مدروسة", "CONSIDERED OBJECTS")}</span>
        <i>✧</i>
        <span>{t("حضور هادئ", "QUIET CONFIDENCE")}</span>
        <i>✧</i>
        <span>{t("تفاصيل لا تُنسى", "LASTING DETAILS")}</span>
        <i>✧</i>
        <span className="strip-extra">
          {t("أسلوب يشبهك", "ENTIRELY YOURS")}
        </span>
      </div>
      <section className="section container" id="the-edit">
        <Reveal>
          <SectionHeading
            eyebrow={t("٠١ / اختياراتنا", "01 / THE VELORA EDIT")}
            title={t("حضور في كل تفصيل.", "Presence in every detail.")}
          >
            <TextLink href="/shop/?edit=featured">
              {t("استكشف المختارات", "Discover the edit")}
            </TextLink>
          </SectionHeading>
        </Reveal>
        <div className="signature-grid">
          {selection.map((p, i) => (
            <Reveal key={p.id} className={"signature-item signature-" + i}>
              <ProductCard product={p} large={i === 0} />
            </Reveal>
          ))}
          <div className="signature-note">
            <span className="eyebrow">
              {t("اختيار يستحق أن يبقى", "MADE TO STAY WITH YOU")}
            </span>
            <p>
              {t(
                "بعض الأشياء لا تحتاج\nإلى الكثير من الكلام.",
                "Some things speak\nwithout a word.",
              )}
            </p>
            <span className="signature-index">{name} / 01</span>
          </div>
        </div>
      </section>
      <section className="story-section">
        <div className="story-image">
          <Photo product={story} view={story.duo ? 1 : 0} />
          <span className="vertical-note">THE ART OF THE EVERYDAY</span>
        </div>
        <Reveal className="story-copy">
          <span className="eyebrow">
            {t("٠٢ / فلسفتنا", "02 / OUR PHILOSOPHY")}
          </span>
          <h2>{t("الفخامة،\nكما نراها.", "Luxury,\nas we see it.")}</h2>
          <p>
            {t(
              "في التفاصيل التي ترافقك كل يوم. في قطعة تختارها لأنك تحبها، لا لأنها تلفت الأنظار. في البساطة التي تحمل معنى.",
              "In the details that become part of your everyday. In the piece you choose because it feels right. In simplicity with something to say.",
            )}
          </p>
          <p className="muted">
            {t(
              "في " +
                name +
                "، نؤمن أن الأناقة تبدأ باختيار مدروس. مجموعة متخيّلة تعكس هذه الرؤية في كل صورة وتفصيل.",
              "At " +
                name +
                ", we believe elegance begins with a considered choice. An illustrative collection that brings this vision into every detail.",
            )}
          </p>
          <TextLink href="/about/">
            {t("اكتشف الحكاية", "Discover our story")}
          </TextLink>
          <span className="story-monogram" dir="ltr">
            V.
          </span>
        </Reveal>
      </section>
      <section className="section container">
        <Reveal>
          <SectionHeading
            eyebrow={t("٠٣ / عوالمنا", "03 / OUR WORLDS")}
            title={t("اختر ما يشبهك.", "Find your own expression.")}
          >
            <span className="section-note">
              {t("لكل مجموعة، حكايتها.", "A story in every collection.")}
            </span>
          </SectionHeading>
        </Reveal>
        <div className="collection-grid">
          {cats.map((c, i) => {
            const p = catalog.find((p) => p.category === c.id)!;
            return (
              <Reveal key={c.id}>
                <Link
                  className="collection-card"
                  href={"/collections/" + c.id + "/"}
                >
                  <Photo product={p} />
                  <span className="collection-index">0{i + 1}</span>
                  <div className="collection-caption">
                    <div>
                      <h3>{text(c.name)}</h3>
                      <span>{text(c.intro)}</span>
                    </div>
                    <Forward size={24} />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
      <section className="campaign">
        <img
          src={assetUrl(
            preset === "tech"
              ? "/images/tech-laptop.webp"
              : preset === "fashion"
                ? "/images/fashion-coat.webp"
                : storeConfig.home.campaign
          )}
          alt={t(
            "مساحة هادئة للتفاصيل اليومية",
            "A considered space for everyday details",
          )}
          loading="lazy"
          width={1600}
          height={1000}
        />
        <div className="campaign-shade" />
        <Reveal className="campaign-copy">
          <span className="eyebrow">
            {t("لحظات تستحق اهتمامك", "MOMENTS WORTH YOUR ATTENTION")}
          </span>
          <h2>
            {t("أشياء قليلة.\nمعنى أكبر.", "Fewer things.\nMore meaning.")}
          </h2>
          <TextLink href="/shop/" className="light">
            {t("اكتشف اختيارات جديدة", "Find your next favorite")}
          </TextLink>
        </Reveal>
        <span className="campaign-folio">{name} / THE EVERYDAY, ELEVATED</span>
      </section>
      <section className="section container">
        <Reveal>
          <SectionHeading
            eyebrow={t("٠٤ / فصل جديد", "04 / A NEW CHAPTER")}
            title={t("تفاصيل وصلت حديثاً.", "New details to discover.")}
          >
            <TextLink href="/shop/?edit=new">
              {t("كل القطع الجديدة", "All new arrivals")}
            </TextLink>
          </SectionHeading>
        </Reveal>
        <ProductGrid items={arrivals} />
      </section>
      {viewed.length > 0 && (
        <section className="section container">
          <SectionHeading
            eyebrow={t("نظرة ثانية", "ANOTHER LOOK")}
            title={t("شاهدتها مؤخراً", "Recently viewed")}
          />
          <ProductGrid items={viewed} />
        </section>
      )}
      <div className="service-strip container">
        <div>
          <Package size={25} />
          <h3>{t("التفاصيل واضحة", "Every detail, clear")}</h3>
          <p>
            {t(
              "صور وخيارات ومعلومات منظمة.",
              "Thoughtful imagery, options and information.",
            )}
          </p>
        </div>
        <div>
          <Truck size={25} />
          <h3>{t("التوصيل ببساطة", "Delivery made simple")}</h3>
          <p>
            {t(
              "استكشف خيارات التوصيل في الديمو.",
              "Explore delivery options in the demo.",
            )}
          </p>
        </div>
        <div>
          <Heart size={25} />
          <h3>{t("اختياراتك معك", "An edit of your own")}</h3>
          <p>
            {t(
              "احفظ ما يعجبك، وعُد إليه لاحقاً.",
              "Save your favorites and return when you wish.",
            )}
          </p>
        </div>
      </div>
    </>
  );
}
