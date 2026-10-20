import { getStorefrontMode } from "@/lib/shopify/mode";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import styles from "./store-notice.module.css";

export function StoreNotice() {
  const mode = getStorefrontMode();
  if (mode.mode === "preview") {
    return (
      <div className={styles.notice} role="status">
        Preview storefront · Purchases disabled
      </div>
    );
  }
  if (mode.mode === "unavailable") {
    return <div className={styles.notice} role="status">The store is being prepared. Purchases disabled.</div>;
  }
  if (!isShopifyCheckoutEnabled()) {
    return <div className={styles.notice} role="status">Browse the collection · Checkout currently closed</div>;
  }
  return null;
}
