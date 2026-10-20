import styles from "@/app/reading.module.css";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPage } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { sanitizeMerchantHtml } from "@/lib/shopify/sanitize";

export const metadata: Metadata = { title: "Contact", description: "Contact the Nilkurinji team.", alternates: { canonical: "/contact" } };

export default async function ContactPage() {
  const [result, mode] = await Promise.all([getPublishedPage("contact"), Promise.resolve(getStorefrontMode())]);
  const isPreview = mode.mode === "preview";
  const page = result.source === "unavailable" ? null : result.data;
  const html = page?.body ? sanitizeMerchantHtml(page.body) : "";

  return (
    <>
      <header className={styles.heading}>
        <h1 >Contact</h1>
        {html && <p >Use the contact details below to get in touch.</p>}
      </header>
      <article className={styles.body}>
        {result.source === "unavailable" ? (
          <div  role="status">
            <p>Contact information is temporarily unavailable. Please check back soon.</p>
            <Link href="/shop" className="button button--outline">Browse the shop</Link>
          </div>
        ) : html ? (
          <div  dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div  role="status">
            <p>{isPreview ? "Contact information is being prepared. Please check back soon." : "Contact information is not available yet."}</p>
            <Link href="/shop" className="button button--outline">Browse the shop</Link>
          </div>
        )}
      </article>
    </>
  );
}
