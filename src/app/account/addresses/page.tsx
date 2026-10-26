import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/reading.module.css";
import { accountPageSession } from "@/lib/shopify/customer-account-pages";
import { customerAccountQuery } from "@/lib/shopify/customer-account";
import { ACCOUNT_ADDRESSES_QUERY } from "@/lib/shopify/customer-queries";
import { AddressManager, type CustomerAddress } from "./address-manager";

export const metadata: Metadata = { title: "Your addresses", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Addresses = { customer: { defaultAddress: { id: string } | null; addresses: { nodes: CustomerAddress[] } } | null };

export default async function AccountAddressesPage() {
  const session = await accountPageSession("/account/addresses");
  if (!session) return <section className={styles.empty}><h1>Sign in to manage addresses</h1><Link className="button button--dark" href="/account/login?return_to=%2Faccount%2Faddresses">Sign in</Link></section>;
  let result: Addresses;
  try { result = await customerAccountQuery<Addresses>(session, ACCOUNT_ADDRESSES_QUERY); }
  catch { return <section className={styles.empty} role="status"><h1>Addresses are temporarily unavailable</h1><p>Please try again shortly.</p><Link href="/account" className="text-link">Back to account</Link></section>; }
  return <section className={styles.section}>
    <header className={styles.heading}><p className="eyebrow">NILKURINJI / ACCOUNT</p><h1>Your addresses</h1><p>Manage delivery addresses saved to your Shopify account.</p></header>
    {result.customer ? <AddressManager addresses={result.customer.addresses.nodes} defaultAddressId={result.customer.defaultAddress?.id ?? null} /> : <div className={styles.empty} role="status"><p>Sign in again to view your addresses.</p></div>}
    <p className={styles.discovery}><Link href="/account">Back to account</Link></p>
  </section>;
}
