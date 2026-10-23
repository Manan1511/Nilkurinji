"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { CartPanel } from "@/components/cart-panel";
import { useStorefrontCart } from "@/components/cart-provider";
import { SearchOverlay } from "@/components/search/search-overlay";
import { ModalSheet } from "@/components/storefront/modal-sheet";
import { PRIMARY_NAV } from "@/lib/site-config";
import styles from "./site-header.module.css";

export function SiteHeader() {
  const pathname = usePathname();
  const [panel, setPanel] = useState<"menu" | "search" | "cart" | null>(null);
  const [compact, setCompact] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const cartRef = useRef<HTMLButtonElement>(null);
  const cart = useStorefrontCart();
  const cartCount = cart?.cart?.totalQuantity ?? 0;
  const close = useCallback(() => setPanel(null), []);
  useEffect(() => {
    const media = window.matchMedia?.("(max-width: 1199px)");
    if (!media) return;
    const sync = () => {
      if (document.activeElement?.closest("#header-search-panel")) searchRef.current?.focus({ preventScroll: true });
      setCompact(media.matches); setPanel(null);
    };
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => { const openCart = () => setPanel("cart"); window.addEventListener("nilkurinji:cart-open", openCart); return () => window.removeEventListener("nilkurinji:cart-open", openCart); }, []);
  useEffect(() => { const closeForNavigation = () => setPanel(null); closeForNavigation(); }, [pathname]);
  const navigation = <Suspense fallback={<PrimaryNavigationFallback onNavigate={close} />}><PrimaryNavigation onNavigate={close} /></Suspense>;
  return <header className={styles.header}>
    <div className={styles.row}>
      <button ref={menuRef} className={`${styles.tool} ${styles.menu} site-header__menu`} type="button" aria-label="Open navigation menu" aria-expanded={panel === "menu"} aria-controls="header-menu-panel" onClick={() => setPanel((value) => value === "menu" ? null : "menu")}><Menu aria-hidden="true" /></button>
      <nav className={styles.nav} aria-label="Primary navigation">{navigation}</nav>
      <Link className={styles.logo} href="/" aria-label="Nilkurinji home" onClick={close}><BrandMark className={styles.mark} /><span className={styles.name}>NILKURINJI</span></Link>
      <div className={styles.tools}>
        <button ref={searchRef} className={`${styles.tool} site-header__search-trigger site-tools__search`} type="button" aria-label="Search products" aria-expanded={panel === "search"} aria-controls="header-search-panel" onClick={() => setPanel((value) => value === "search" ? null : "search")}><Search aria-hidden="true" /></button>
        <Link href="/account" className={`${styles.tool} ${styles.desktopUtility}`} aria-label="Shopify customer account" onClick={close}><UserRound aria-hidden="true" /></Link>
        <button ref={cartRef} type="button" className={styles.tool} aria-label={`Shopping cart${cartCount ? `, ${cartCount} ${cartCount === 1 ? "item" : "items"}` : ""}`} aria-expanded={panel === "cart"} aria-controls="header-cart-panel" onClick={() => setPanel((value) => value === "cart" ? null : "cart")}><ShoppingBag aria-hidden="true" />{cartCount > 0 && <span className={styles.count} aria-hidden="true">{cartCount > 99 ? "99+" : cartCount}</span>}</button>
      </div>
    </div>
    <SearchOverlay open={panel === "search"} compact={compact} query={query} onQueryChange={setQuery} onClose={close} triggerRef={searchRef} />
    <ModalSheet open={panel === "menu" && compact} id="header-menu-panel" label="Menu" placement="left" triggerRef={menuRef} onClose={close}><nav className={styles.mobileNav} aria-label="Mobile navigation"><Link href="/" onClick={close}>Home</Link>{navigation}<Link href="/contact" onClick={close}>Contact</Link><Link href="/account" onClick={close}>Account</Link></nav></ModalSheet>
    <ModalSheet open={panel === "cart"} id="header-cart-panel" label="Your cart" placement="right" triggerRef={cartRef} onClose={close}><CartPanel presentation="drawer" /></ModalSheet>
  </header>;
}

function PrimaryNavigation({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return <>{PRIMARY_NAV.map((item) => {
    const [path, query] = item.href.split("?");
    const expected = new URLSearchParams(query ?? "");
    const isCurrent = pathname === path && [...expected.entries()].every(([key, value]) => searchParams.get(key) === value);
    return <Link key={item.href} href={item.href} aria-current={isCurrent ? "page" : undefined} onClick={onNavigate}>{item.label}</Link>;
  })}</>;
}

function PrimaryNavigationFallback({ onNavigate }: { onNavigate: () => void }) {
  return <>{PRIMARY_NAV.map((item) => <Link key={item.href} href={item.href} onClick={onNavigate}>{item.label}</Link>)}</>;
}
