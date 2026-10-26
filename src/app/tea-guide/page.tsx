import type { Metadata } from "next";
import { BlogLanding } from "@/components/editorial/blog-landing";
import { getBlog, getBlogLanding } from "@/lib/shopify/content";

export const metadata: Metadata = { title: "Tea Guide", description: "Notes and guidance from Nilkurinji.", alternates: { canonical: "/tea-guide" } };
export const revalidate = 60;

export default async function TeaGuidePage() {
  const [blog, landing] = await Promise.all([getBlog("tea-guide"), getBlogLanding("tea-guide")]);
  return <BlogLanding title="Tea Guide" blog={blog} landing={landing} previewImage="/images/tea-hero-editorial.webp" />;
}
