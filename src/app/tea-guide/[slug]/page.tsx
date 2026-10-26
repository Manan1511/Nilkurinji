import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage, ArticleUnavailable } from "@/components/editorial/article-page";
import { getArticle } from "@/lib/shopify/content";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticle("tea-guide", slug);
  const article = result.source === "unavailable" ? null : result.data;
  return { title: article?.seo?.title || article?.title || "Tea Guide", description: article?.seo?.description || article?.excerpt || undefined, alternates: article ? { canonical: `/tea-guide/${article.handle}` } : undefined };
}

export default async function TeaGuideArticle({ params }: Props) {
  const { slug } = await params;
  const result = await getArticle("tea-guide", slug);
  if (result.source === "unavailable") return <ArticleUnavailable sectionTitle="Tea Guide" />;
  if (!result.data) notFound();
  return <ArticlePage article={result.data} sectionTitle="Tea Guide" />;
}
