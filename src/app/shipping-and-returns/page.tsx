import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPolicies } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { sanitizeMerchantHtml } from "@/lib/shopify/sanitize";
import styles from "@/app/reading.module.css";

export const metadata: Metadata = { title: "Shipping & returns", description: "Nilkurinji shipping and returns information.", alternates: { canonical: "/shipping-and-returns" } };
export const revalidate = 60;

export default async function ShippingAndReturnsPage() {
  const [result, mode] = await Promise.all([getPublishedPolicies(), Promise.resolve(getStorefrontMode())]);
  const isPreview = mode.mode === "preview";
  if (result.source === "unavailable") return <section className={styles.notice} aria-labelledby="delivery-heading"><h1 id="delivery-heading">Shipping &amp; returns</h1><p>Shipping and returns information is temporarily unavailable.</p><Link href="/contact" className="text-link">Contact Nilkurinji</Link></section>;

  const shipping = result.data.shipping?.body ? sanitizeMerchantHtml(result.data.shipping.body) : "";
  const returns = result.data.refund?.body ? sanitizeMerchantHtml(result.data.refund.body) : "";
  return <div>
    <header className={styles.heading}><h1>Shipping &amp; returns</h1><p>Current delivery and return information for Nilkurinji orders.</p></header>
    {shipping || returns ? <section className={styles.body}>
      <section aria-labelledby="shipping-heading"><h2 id="shipping-heading">Shipping</h2>{shipping ? <div dangerouslySetInnerHTML={{ __html: shipping }} /> : <p>Shipping details have not been published yet.</p>}</section>
      <section aria-labelledby="returns-heading"><h2 id="returns-heading">Returns &amp; refunds</h2>{returns ? <div dangerouslySetInnerHTML={{ __html: returns }} /> : <p>Return and refund details have not been published yet.</p>}</section>
    </section> : <section className={styles.notice} role="status"><p>{isPreview ? "Shipping and returns information is being prepared for this preview." : "Shipping and returns details have not been published yet."}</p><Link href="/contact" className="text-link">Contact Nilkurinji</Link></section>}
  </div>;
}
