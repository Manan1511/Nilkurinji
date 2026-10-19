import type { ShopifyMoney } from "@/lib/shopify/types";

export function formatMoney(money: ShopifyMoney): string {
  const amount = Number(money.amount);
  if (!Number.isFinite(amount)) return "Price unavailable";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: money.currencyCode,
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${money.currencyCode} ${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
  }
}
