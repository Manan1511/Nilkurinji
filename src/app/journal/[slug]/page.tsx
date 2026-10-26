import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage, ArticleUnavailable } from "@/components/editorial/article-page";
import { getArticle } from "@/lib/shopify/content";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticle("journal", slug);
  const article = result.source === "unavailable" ? null : result.data;
  return { title: article?.seo?.title || article?.title || "Journal", description: article?.seo?.description || article?.excerpt || undefined, alternates: article ? { canonical: `/journal/${article.handle}` } : undefined };
}

export default async function JournalArticle({ params }: Props) {
  const { slug } = await params;
  const result = await getArticle("journal", slug);
  if (result.source === "unavailable") return <ArticleUnavailable sectionTitle="Journal" />;
  if (!result.data) notFound();
  return <ArticlePage article={result.data} sectionTitle="Journal" />;
}
