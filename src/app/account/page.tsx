import styles from "@/app/reading.module.css";
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
    <div className={styles.empty}>
      <h1 >Account sign-in is not available yet.</h1>
      <p>Customer account sign-in is not available right now. Continue browsing the shop.</p>
      <Link href="/shop" className="button button--dark">Continue browsing</Link>
    </div>
  );
}
