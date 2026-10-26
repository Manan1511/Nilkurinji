import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage, ArticleUnavailable } from "@/components/editorial/article-page";
import { getArticle } from "@/lib/shopify/content";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticle("recipes", slug);
  const article = result.source === "unavailable" ? null : result.data;
  return { title: article?.seo?.title || article?.title || "Recipes", description: article?.seo?.description || article?.excerpt || undefined, alternates: article ? { canonical: `/recipes/${article.handle}` } : undefined };
}

export default async function RecipeArticle({ params }: Props) {
  const { slug } = await params;
  const result = await getArticle("recipes", slug);
  if (result.source === "unavailable") return <ArticleUnavailable sectionTitle="Recipes" />;
  if (!result.data) notFound();
  return <ArticlePage article={result.data} sectionTitle="Recipes" />;
}
