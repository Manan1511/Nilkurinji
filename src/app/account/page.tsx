import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { safeCustomerAccountUrl } from "@/lib/shopify/account-url";

export const metadata: Metadata = { title: "Customer account", robots: { index: false, follow: false } };

export default function AccountPage() {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN ?? "nilkurinji-jcqze5tu.myshopify.com";
  const accountUrl = safeCustomerAccountUrl(process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL, storeDomain);
  if (accountUrl) redirect(accountUrl);

  return (
    <div className="empty-state">
      <span className="eyebrow">Shopify customer accounts</span>
      <h1 className="page-title">Account access is being prepared.</h1>
      <p>The secure account link will appear here after the Shopify customer account experience is configured.</p>
      <Link href="/shop" className="button button--dark">Continue browsing</Link>
    </div>
  );
}
