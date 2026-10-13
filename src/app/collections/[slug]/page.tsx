import { categories } from "@/data/products";
import { Shop } from "@/components/shop";
import { notFound } from "next/navigation";
export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categories.find((c) => c.id === slug);
  return { title: c?.name.ar || "المجموعة", description: c?.intro.ar };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!categories.some((c) => c.id === slug)) notFound();
  return <Shop collection={slug} />;
}
