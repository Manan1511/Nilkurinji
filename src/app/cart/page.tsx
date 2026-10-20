import type { Metadata } from "next";
import { CartPanel } from "@/components/cart-panel";
import styles from "@/app/reading.module.css";

export const metadata: Metadata = { title: "Your cart", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <>
      <header className={styles.heading}>
        <h1>Your cart</h1>
      </header>
      <CartPanel />
    </>
  );
}
