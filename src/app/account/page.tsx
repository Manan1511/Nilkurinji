import styles from "@/app/reading.module.css";
import type { Metadata } from "next";
import Link from "next/link";
import { accountPageSession } from "@/lib/shopify/customer-account-pages";
import { customerAccountQuery, CustomerAccountError } from "@/lib/shopify/customer-account";
import { ACCOUNT_OVERVIEW_QUERY } from "@/lib/shopify/customer-queries";

export const metadata: Metadata = { title: "Customer account", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Order = { id: string; name: string; createdAt: string; financialStatus: string | null; fulfillmentStatus: string; totalPrice: { amount: string; currencyCode: string } };
type Overview = { customer: { firstName: string | null; lastName: string | null; emailAddress: { emailAddress: string } | null; orders: { nodes: Order[] } } | null };
type Props = { searchParams: Promise<{ error?: string; signed_out?: string }> };

export default async function AccountPage({ searchParams }: Props) {
  const params = await searchParams;
  const session = await accountPageSession("/account");
  if (!session) return <div className={styles.empty}>
    <p className="eyebrow">NILKURINJI / ACCOUNT</p>
    <h1>Sign in to your account</h1>
    <p>{params.error === "unavailable" ? "Customer sign-in needs to be configured for the secure storefront domain." : params.error === "expired" ? "Your sign-in expired. Please sign in again." : params.error === "cancelled" ? "Sign-in was cancelled." : params.error === "failed" ? "We could not verify that sign-in. Please try again." : params.signed_out ? "You have signed out." : "View orders and manage your delivery addresses through your Nilkurinji account."}</p>
    <Link href="/account/login?return_to=%2Faccount" className="button button--dark">Continue to sign in</Link>
    <p className={styles.discovery}><Link href="/shop">Continue browsing the shop</Link></p>
  </div>;

  let result: Overview;
  try { result = await customerAccountQuery<Overview>(session, ACCOUNT_OVERVIEW_QUERY); }
  catch (error) {
    return <div className={styles.empty} role="status"><h1>Account information is unavailable</h1><p>{error instanceof CustomerAccountError ? error.message : "Please try again shortly."}</p><Link href="/account/login?return_to=%2Faccount" className="button button--outline">Sign in again</Link></div>;
  }
  const customer = result.customer;
  if (!customer) return <div className={styles.empty} role="status"><h1>Account information is unavailable</h1><p>Please sign in again to continue.</p><Link href="/account/login?return_to=%2Faccount" className="button button--outline">Sign in again</Link></div>;
  const displayName = [customer.firstName, customer.lastName].filter(Boolean).join(" ") || customer.emailAddress?.emailAddress || "Your account";
  return <section className={styles.section} aria-labelledby="account-heading">
    <header className={styles.heading}><p className="eyebrow">NILKURINJI / ACCOUNT</p><h1 id="account-heading">Welcome, {displayName}</h1>{customer.emailAddress?.emailAddress && <p>{customer.emailAddress.emailAddress}</p>}</header>
    <div className={styles.discovery}>
      <Link href="/account/orders">View all orders</Link><Link href="/account/addresses">Manage addresses</Link><form action="/account/logout" method="post"><button type="submit">Sign out</button></form>
    </div>
    <section className={styles.section} aria-labelledby="recent-orders"><h2 id="recent-orders">Recent orders</h2>
      {customer.orders.nodes.length ? <ul>{customer.orders.nodes.map((order) => <li key={order.id}><Link href={`/account/orders/${encodeURIComponent(order.id)}`}>{order.name}</Link> · {formatDate(order.createdAt)} · {formatMoney(order.totalPrice)} · {order.fulfillmentStatus.replaceAll("_", " ").toLowerCase()}</li>)}</ul> : <p>No orders are associated with this account yet.</p>}
    </section>
  </section>;
}

function formatDate(value: string): string { const date = new Date(value); return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date); }
function formatMoney(value: Order["totalPrice"]): string { const amount = Number(value.amount); return Number.isFinite(amount) ? new Intl.NumberFormat("en-IN", { style: "currency", currency: value.currencyCode, maximumFractionDigits: 2 }).format(amount) : "Amount unavailable"; }
