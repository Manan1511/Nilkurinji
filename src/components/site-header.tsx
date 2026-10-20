"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { SearchOverlay } from "@/components/search/search-overlay";
import { ModalSheet } from "@/components/storefront/modal-sheet";
import { PRIMARY_NAV } from "@/lib/site-config";
import styles from "./site-header.module.css";

export function SiteHeader() {
  const pathname = usePathname();
  const [panel, setPanel] = useState<"menu" | "search" | null>(null);
  const [compact, setCompact] = useState(false);
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const searchRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setPanel(null), []);
  useEffect(() => {
    const media = window.matchMedia?.("(max-width: 1023px)");
    if (!media) return;
    const sync = () => { setCompact(media.matches); setPanel(null); };
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    let active = true;
    let generation = 0;
    const refresh = async () => {
      const current = ++generation;
      try {
        const response = await fetch("/api/cart", { cache: "no-store" });
        if (!response.ok) return;
        const body = await response.json() as { cart?: { totalQuantity?: number } | null };
        if (active && generation === current) setCartCount(body.cart?.totalQuantity ?? 0);
      } catch { /* Keep the last confirmed count during an outage. */ }
    };
    void refresh(); window.addEventListener("nilkurinji:cart-updated", refresh);
    return () => { active = false; window.removeEventListener("nilkurinji:cart-updated", refresh); };
  }, []);
  useEffect(() => { const closeForNavigation = () => setPanel(null); closeForNavigation(); }, [pathname]);
  const links = PRIMARY_NAV.filter((item) => item.href !== "/");
  const navigation = <>{links.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={close}>{item.label}</Link>)}</>;
  return <header className={styles.header}>
    <div className={styles.row}>
      <button ref={menuRef} className={`${styles.tool} ${styles.menu} site-header__menu`} type="button" aria-label="Open navigation menu" aria-expanded={panel === "menu"} onClick={() => setPanel((value) => value === "menu" ? null : "menu")}><Menu aria-hidden="true" /></button>
      <Link className={styles.logo} href="/" aria-label="Nilkurinji home" onClick={close}><BrandMark className={styles.mark} /><span className={styles.name}>NILKURINJI</span><span className={styles.tagline}>Food &amp; beverages</span></Link>
      <nav className={styles.nav} aria-label="Primary navigation">{navigation}</nav>
      <div className={styles.tools}>
        <button ref={searchRef} className={`${styles.tool} site-header__search-trigger site-tools__search`} type="button" aria-label="Search products" aria-expanded={panel === "search"} aria-controls="header-search-panel" onClick={() => setPanel((value) => value === "search" ? null : "search")}><Search aria-hidden="true" /></button>
        <Link href="/account" className={`${styles.tool} ${styles.desktopUtility}`} aria-label="Shopify customer account" onClick={close}><UserRound aria-hidden="true" /></Link>
        <Link href="/wishlist" className={`${styles.tool} ${styles.desktopUtility}`} aria-label="Your wishlist" onClick={close}><Heart aria-hidden="true" /></Link>
        <Link href="/cart" className={styles.tool} aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ""}`} onClick={close}><ShoppingBag aria-hidden="true" />{cartCount > 0 && <span className={styles.count} aria-hidden="true">{cartCount > 99 ? "99+" : cartCount}</span>}</Link>
      </div>
    </div>
    <SearchOverlay open={panel === "search"} compact={compact} query={query} onQueryChange={setQuery} onClose={close} triggerRef={searchRef} />
    <ModalSheet open={panel === "menu" && compact} label="Menu" placement="right" triggerRef={menuRef} onClose={close}><nav className={styles.mobileNav} aria-label="Mobile navigation">{navigation}<Link href="/wishlist" onClick={close}>Your wishlist</Link><Link href="/account" onClick={close}>Your account</Link></nav></ModalSheet>
  </header>;
}
