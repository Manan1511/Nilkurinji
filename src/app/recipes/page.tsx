import type { Metadata } from "next";
import { BlogLanding } from "@/components/editorial/blog-landing";
import { getBlog, getBlogLanding } from "@/lib/shopify/content";

export const metadata: Metadata = { title: "Recipes", description: "Recipes published by Nilkurinji.", alternates: { canonical: "/recipes" } };
export const revalidate = 60;

export default async function RecipesPage() {
  const [blog, landing] = await Promise.all([getBlog("recipes"), getBlogLanding("recipes")]);
  return <BlogLanding title="Recipes" blog={blog} landing={landing} previewImage="/images/preview-hero-tea-kurinji.webp" />;
}
