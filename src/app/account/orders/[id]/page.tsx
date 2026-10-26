import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "@/app/reading.module.css";
import { accountPageSession } from "@/lib/shopify/customer-account-pages";
import { customerAccountQuery } from "@/lib/shopify/customer-account";
import { ACCOUNT_ORDER_DETAILS_QUERY } from "@/lib/shopify/customer-queries";

export const metadata: Metadata = { title: "Order details", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Order = {
  id: string; name: string; createdAt: string; processedAt: string; cancelledAt: string | null; financialStatus: string | null; fulfillmentStatus: string; totalPrice: { amount: string; currencyCode: string }; statusPageUrl: string;
  lineItems: { nodes: { id: string; name: string; quantity: number }[] };
  shippingAddress: { firstName: string | null; lastName: string | null; address1: string | null; address2: string | null; city: string | null; province: string | null; country: string | null; zip: string | null } | null;
};
type Orders = { customer: { orders: { nodes: Order[] } } | null };
type Props = { params: Promise<{ id: string }> };

export default async function AccountOrderPage({ params }: Props) {
  const { id: encodedId } = await params;
  let orderId: string;
  try { orderId = decodeURIComponent(encodedId); }
  catch { notFound(); }
  if (!/^gid:\/\/shopify\/Order\/[A-Za-z0-9_-]+$/.test(orderId)) notFound();
  const session = await accountPageSession(`/account/orders/${encodeURIComponent(orderId)}`);
  if (!session) return <section className={styles.empty}><h1>Sign in to view this order</h1><Link className="button button--dark" href={`/account/login?return_to=${encodeURIComponent(`/account/orders/${encodeURIComponent(orderId)}`)}`}>Sign in</Link></section>;
  let result: Orders;
  try { result = await customerAccountQuery<Orders>(session, ACCOUNT_ORDER_DETAILS_QUERY); }
  catch { return <section className={styles.empty} role="status"><h1>Order details are temporarily unavailable</h1><p>Please try again shortly.</p><Link href="/account/orders" className="text-link">Back to orders</Link></section>; }
  // The requested GID is only rendered when it appears in the signed-in customer's own connection.
  const order = result.customer?.orders.nodes.find((item) => item.id === orderId);
  if (!order) notFound();
  const address = order.shippingAddress;
  const statusUrl = safeStatusUrl(order.statusPageUrl);
  return <article className={styles.section}>
    <header className={styles.heading}><p className="eyebrow">NILKURINJI / ACCOUNT / ORDER</p><h1>{order.name}</h1><p>Placed {formatDate(order.createdAt)} · {label(order.financialStatus)} · {label(order.fulfillmentStatus)}</p></header>
    <section className={styles.body}>
      <h2>Items</h2><ul>{order.lineItems.nodes.map((line) => <li key={line.id}>{line.name} × {line.quantity}</li>)}</ul>
      <h2>Order total</h2><p>{formatMoney(order.totalPrice)}</p>
      {order.cancelledAt && <p>This order was cancelled on {formatDate(order.cancelledAt)}.</p>}
      {address && <><h2>Delivery address</h2><address>{[`${address.firstName ?? ""} ${address.lastName ?? ""}`.trim(), address.address1, address.address2, [address.city, address.province, address.zip].filter(Boolean).join(", "), address.country].filter(Boolean).map((line) => <span key={line}>{line}<br /></span>)}</address></>}
      {statusUrl && <p><a className="text-link" href={statusUrl} target="_blank" rel="noopener noreferrer">View Shopify order status</a></p>}
      <p><Link href="/account/orders" className="text-link">Back to orders</Link></p>
    </section>
  </article>;
}

function safeStatusUrl(value: string): string | null {
  try {
    const url = new URL(value);
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN?.toLowerCase();
    const allowed = new Set((process.env.SHOPIFY_CHECKOUT_ALLOWED_HOSTS ?? "").split(",").map((host) => host.trim().toLowerCase()).filter(Boolean));
    if (storeDomain) allowed.add(storeDomain);
    return url.protocol === "https:" && !url.username && !url.password && allowed.has(url.hostname.toLowerCase()) ? url.toString() : null;
  } catch { return null; }
}
function label(value: string | null): string { return value ? value.replaceAll("_", " ").toLowerCase().replace(/^./, (letter) => letter.toUpperCase()) : "Status unavailable"; }
function formatDate(value: string): string { const date = new Date(value); return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date); }
function formatMoney(value: Order["totalPrice"]): string { const amount = Number(value.amount); return Number.isFinite(amount) ? new Intl.NumberFormat("en-IN", { style: "currency", currency: value.currencyCode, maximumFractionDigits: 2 }).format(amount) : "Amount unavailable"; }
