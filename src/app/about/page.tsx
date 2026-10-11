import type { Metadata } from "next";
import { getPublishedPage } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { sanitizeMerchantHtml } from "@/lib/shopify/sanitize";

export const metadata: Metadata = { title: "About Nilkurinji", description: "A little about the Nilkurinji pantry.", alternates: { canonical: "/about" } };

const ABOUT_DRAFT = `<p>We are bringing together tea, rice, snacks and the other foods that make a pantry feel personal.</p><p>As Nilkurinji grows, this is where we will share the people, places, ingredients and choices behind each product. Every detail should help you decide what belongs on your table.</p>`;

export default async function AboutPage() {
  const [result, mode] = await Promise.all([getPublishedPage("about"), Promise.resolve(getStorefrontMode())]);
  const isPreview = mode.mode === "preview";
  const page = result.source === "unavailable" ? null : result.data;
  const html = page?.body ? sanitizeMerchantHtml(page.body) : isPreview ? sanitizeMerchantHtml(ABOUT_DRAFT) : "";

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">A note from Nilkurinji</p>
        <h1 className="page-title">About us</h1>
      </header>
      <article className="content-page">
        {isPreview && <p className="content-page__notice">Draft copy · Please confirm the Nilkurinji brand story before launch.</p>}
        {result.source === "unavailable" ? (
          <div className="notice-card" role="status">{result.reason}</div>
        ) : html ? (
          <div className="content-page__body" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="notice-card" role="status">Add the approved About page in Shopify Admin to show it here.</div>
        )}
      </article>
    </>
  );
}
