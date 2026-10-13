import type { Metadata } from "next";
import { assetUrl } from "@/lib/paths";
import { StoreProvider } from "@/components/store-provider";
import { Shell } from "@/components/site-shell";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4173"),
  title: { default: "VELORA — تفاصيل تصنع الفرق", template: "%s · VELORA" },
  description:
    "اكتشف تجربة VELORA: متجر توضيحي فاخر للساعات والمجوهرات والحقائب والعطور، بالعربية والإنجليزية. تجربة طلب كاملة بلا دفع فعلي.",
  icons: { icon: assetUrl("/icon.svg") },
  openGraph: {
    title: "VELORA — Designed to be remembered",
    description:
      "A considered luxury shopping demonstration. No real orders or payments.",
    images: [{ url: assetUrl("/images/hero.webp"), width: 1536, height: 1024 }],
  },
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
