import type { ShopifyMoney } from "@/lib/shopify/types";

export function formatMoney(money: ShopifyMoney): string {
  const amount = Number(money.amount);
  if (!Number.isFinite(amount)) return "Price unavailable";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: money.currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${money.currencyCode} ${amount.toFixed(2)}`;
  }
}
