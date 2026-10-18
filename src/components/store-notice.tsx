import { getStorefrontMode } from "@/lib/shopify/mode";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";

export function StoreNotice() {
  const mode = getStorefrontMode();
  if (mode.mode === "preview") {
    return (
      <div className="store-notice store-notice--visually-hidden" role="status">
        Preview <span aria-hidden="true">·</span> Draft imagery and copy <span aria-hidden="true">·</span> Purchases disabled
      </div>
    );
  }
  if (mode.mode === "unavailable") {
    return <div className="store-notice store-notice--quiet" role="status">Shopify is being connected. Purchases are disabled.</div>;
  }
  if (!isShopifyCheckoutEnabled()) {
    return <div className="store-notice store-notice--quiet" role="status">Catalog connection ready <span aria-hidden="true">·</span> Checkout will open after Shopify setup is approved</div>;
  }
  return null;
}
