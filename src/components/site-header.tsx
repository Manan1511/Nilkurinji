"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Leaf, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { PRIMARY_NAV } from "@/lib/site-config";

type CartResponse = { cart?: { totalQuantity?: number } | null };

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch("/api/cart", { cache: "no-store" });
        const result = await response.json() as CartResponse;
        if (active) setCartCount(result.cart?.totalQuantity ?? 0);
      } catch {
        if (active) setCartCount(0);
      }
    };
    void refresh();
    window.addEventListener("nilkurinji:cart-updated", refresh);
    return () => {
      active = false;
      window.removeEventListener("nilkurinji:cart-updated", refresh);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="site-header__utility-row mx-auto w-full max-w-[1360px] px-5 md:px-10">
        <button
          className="icon-button site-header__menu"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <Link href="/search" className="site-header__desktop-search" aria-label="Search the shop">
          <Search aria-hidden="true" size={18} />
          <span>Search</span>
        </Link>

        <Link href="/" className="wordmark" aria-label="Nilkurinji home">
          <Leaf className="wordmark__mark" aria-hidden="true" />
          <span className="wordmark__name">NILKURINJI</span>
          <span className="wordmark__tagline">Premium food &amp; beverages</span>
        </Link>

        <nav id="primary-navigation" className={`site-nav ${menuOpen ? "site-nav--open" : ""}`} aria-label="Primary navigation">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="site-nav__link"
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/wishlist"
            className="site-nav__link site-nav__wishlist-link"
            aria-current={pathname === "/wishlist" ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >Your wishlist</Link>
        </nav>

        <div className="site-tools" aria-label="Shop tools">
          <Link href="/search" className="icon-button site-tools__search" aria-label="Search the shop"><Search aria-hidden="true" /></Link>
          <Link href="/account" className="icon-button site-tools__account" aria-label="Shopify customer account"><UserRound aria-hidden="true" /></Link>
          <Link href="/wishlist" className="icon-button site-tools__wishlist" aria-label="Your wishlist"><Heart aria-hidden="true" /></Link>
          <Link href="/cart" className="icon-button site-tools__cart" aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ""}`}>
            <ShoppingBag aria-hidden="true" />
            {cartCount > 0 && <span className="cart-count" aria-hidden="true">{cartCount > 99 ? "99+" : cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
