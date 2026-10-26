import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/reading.module.css";
import { accountPageSession } from "@/lib/shopify/customer-account-pages";
import { customerAccountQuery } from "@/lib/shopify/customer-account";
import { ACCOUNT_ORDERS_QUERY } from "@/lib/shopify/customer-queries";

export const metadata: Metadata = { title: "Your orders", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Order = { id: string; name: string; createdAt: string; financialStatus: string | null; fulfillmentStatus: string; totalPrice: { amount: string; currencyCode: string } };
type Orders = { customer: { orders: { nodes: Order[] } } | null };

export default async function AccountOrdersPage() {
  const session = await accountPageSession("/account/orders");
  if (!session) return <section className={styles.empty}><h1>Sign in to view your orders</h1><Link className="button button--dark" href="/account/login?return_to=%2Faccount%2Forders">Sign in</Link></section>;
  let result: Orders;
  try { result = await customerAccountQuery<Orders>(session, ACCOUNT_ORDERS_QUERY); }
  catch { return <section className={styles.empty} role="status"><h1>Orders are temporarily unavailable</h1><p>Please try again shortly.</p><Link href="/account" className="text-link">Back to account</Link></section>; }
  const orders = result.customer?.orders.nodes ?? [];
  return <section className={styles.section}>
    <header className={styles.heading}><p className="eyebrow">NILKURINJI / ACCOUNT</p><h1>Your orders</h1><p>Orders associated with this Shopify account.</p></header>
    <div className={styles.body}>
      {orders.length ? <ul>{orders.map((order) => <li key={order.id}>
        <Link href={`/account/orders/${encodeURIComponent(order.id)}`}>{order.name}</Link> · {formatDate(order.createdAt)} · {formatMoney(order.totalPrice)} · {label(order.financialStatus)} · {label(order.fulfillmentStatus)}
      </li>)}</ul> : <p>No orders are associated with this account yet.</p>}
      <p><Link href="/account" className="text-link">Back to account</Link></p>
    </div>
  </section>;
}

function label(value: string | null): string { return value ? value.replaceAll("_", " ").toLowerCase().replace(/^./, (letter) => letter.toUpperCase()) : "Status unavailable"; }
function formatDate(value: string): string { const date = new Date(value); return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date); }
function formatMoney(value: Order["totalPrice"]): string { const amount = Number(value.amount); return Number.isFinite(amount) ? new Intl.NumberFormat("en-IN", { style: "currency", currency: value.currencyCode, maximumFractionDigits: 2 }).format(amount) : "Amount unavailable"; }
