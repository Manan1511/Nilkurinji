import type { Metadata } from "next";
import { CheckoutStatus } from "@/components/checkout/checkout-status";

export const metadata: Metadata = { title: "Payment status", robots: { index: false, follow: false } };

export default function CheckoutStatusPage() {
  return <CheckoutStatus />;
}
