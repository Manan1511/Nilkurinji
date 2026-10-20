import styles from "@/app/reading.module.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedPolicies } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { sanitizeMerchantHtml } from "@/lib/shopify/sanitize";

const POLICIES = {
  "privacy-policy": { key: "privacy", title: "Privacy policy" },
  "refund-policy": { key: "refund", title: "Refund policy" },
  "terms-and-conditions": { key: "terms", title: "Terms & conditions" },
} as const;

type PageProps = { params: Promise<{ handle: string }> };
type PolicyKey = typeof POLICIES[keyof typeof POLICIES]["key"];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const policy = POLICIES[handle as keyof typeof POLICIES];
  return { title: policy?.title ?? "Policy", alternates: policy ? { canonical: `/pages/${handle}` } : undefined };
}

export default async function PolicyPage({ params }: PageProps) {
  const { handle } = await params;
  const pageConfig = POLICIES[handle as keyof typeof POLICIES];
  if (!pageConfig) notFound();
  const [result, mode] = await Promise.all([getPublishedPolicies(), Promise.resolve(getStorefrontMode())]);
  const isPreview = mode.mode === "preview";
  const policy = result.source === "unavailable" ? null : result.data[pageConfig.key as PolicyKey];
  const body = policy?.body ? sanitizeMerchantHtml(policy.body) : "";

  return (
    <>
      <header className={styles.heading}>
        <h1 >{policy?.title || pageConfig.title}</h1>
      </header>
      <article className={styles.body}>
        {result.source === "unavailable" ? (
          <div  role="status">
            <p>This policy page is temporarily unavailable. Please check back soon.</p>
            <Link href="/shop" className="button button--outline">Browse the shop</Link>
          </div>
        ) : body ? (
          <div  dangerouslySetInnerHTML={{ __html: body }} />
        ) : (
          <div  role="status">
            <p>{isPreview ? "This policy is being prepared. Please check back soon." : "This policy is not available yet. Please check back soon."}</p>
            <Link href="/shop" className="button button--outline">Browse the shop</Link>
          </div>
        )}
      </article>
    </>
  );
}
