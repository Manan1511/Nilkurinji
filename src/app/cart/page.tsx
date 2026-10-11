import type { Metadata } from "next";
import { CartPanel } from "@/components/cart-panel";

export const metadata: Metadata = { title: "Your cart", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <>
      <header className="page-header">
        <p className="eyebrow">A small recap</p>
        <h1 className="page-title">Your cart</h1>
      </header>
      <CartPanel />
    </>
  );
}
