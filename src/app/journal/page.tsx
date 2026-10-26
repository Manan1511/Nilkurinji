import type { Metadata } from "next";
import { BlogLanding } from "@/components/editorial/blog-landing";
import { getBlog, getBlogLanding } from "@/lib/shopify/content";

export const metadata: Metadata = { title: "Journal", description: "Stories published by Nilkurinji.", alternates: { canonical: "/journal" } };
export const revalidate = 60;

export default async function JournalPage() {
  const [blog, landing] = await Promise.all([getBlog("journal"), getBlogLanding("journal")]);
  return <BlogLanding title="Journal" blog={blog} landing={landing} previewImage="/images/preview-about-leaves.png" />;
}
