import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPage } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { sanitizeMerchantHtml } from "@/lib/shopify/sanitize";
import styles from "./about.module.css";
export const metadata: Metadata = { title: "About Nilkurinji", description: "Learn about Nilkurinji.", alternates: { canonical: "/about" } };
export default async function AboutPage() {
  const result = await getPublishedPage("about"); const preview = getStorefrontMode().mode === "preview";
  const page = result.source === "unavailable" ? null : result.data; const html = page?.body ? sanitizeMerchantHtml(page.body) : "";
  return <article className={styles.about}><div className={styles.copy}><h1>{page?.title || "Meet Nilkurinji"}</h1>{html ? <div className={styles.body} dangerouslySetInnerHTML={{ __html: html }} /> : <div className={styles.body} role="status"><p>{result.source === "unavailable" ? "Brand information is temporarily unavailable. Please check back soon." : preview ? "The Nilkurinji story is being prepared. This preview uses concept imagery and draft copy." : "Brand information is not available yet."}</p></div>}<Link href="/shop" className="text-link">Explore the collection</Link></div>{preview && <figure className={styles.image}><Image src="/images/preview-about-leaves.png" alt="Illustrative tea imagery for the Nilkurinji preview" fill sizes="(max-width: 1023px) 100vw, 45vw" /><figcaption>Concept imagery</figcaption></figure>}</article>;
}
