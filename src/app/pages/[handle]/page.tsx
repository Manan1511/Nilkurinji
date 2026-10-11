import type { Metadata } from "next";
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
      <header className="page-header">
        <p className="eyebrow">The essentials</p>
        <h1 className="page-title">{pageConfig.title}</h1>
      </header>
      <article className="content-page">
        {result.source === "unavailable" ? (
          <div className="notice-card" role="status">{result.reason}</div>
        ) : body ? (
          <div className="content-page__body" dangerouslySetInnerHTML={{ __html: body }} />
        ) : (
          <div className="notice-card" role="status">
            {isPreview ? "This policy will be supplied and published from Shopify Admin before checkout opens." : `Publish the ${pageConfig.title.toLowerCase()} in Shopify Admin to show it here.`}
          </div>
        )}
      </article>
    </>
  );
}
