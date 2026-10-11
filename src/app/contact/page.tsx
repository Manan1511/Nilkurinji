import type { Metadata } from "next";
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
      <header className="page-header">
        <p className="eyebrow">We are here to help</p>
        <h1 className="page-title">Contact</h1>
        <p className="page-header__description">Get in touch using the contact links published in Shopify.</p>
      </header>
      <article className="content-page">
        {result.source === "unavailable" ? (
          <div className="notice-card" role="status">{result.reason}</div>
        ) : html ? (
          <div className="content-page__body" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="notice-card" role="status">
            {isPreview ? "Approved email, phone and social links will appear here before launch." : "Add approved contact links to the Shopify Contact page to show them here."}
          </div>
        )}
      </article>
    </>
  );
}
