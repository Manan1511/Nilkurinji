"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { BotanicalEdges } from "@/components/botanical-edges";
import { CartPanel } from "@/components/cart-panel";
import { useStorefrontCart } from "@/components/cart-provider";
import { SearchOverlay } from "@/components/search/search-overlay";
import { ModalSheet } from "@/components/storefront/modal-sheet";
import { PRIMARY_NAV } from "@/lib/site-config";
import styles from "./site-header.module.css";

type HeaderPanel = "menu" | "search" | "cart" | null;

export function SiteHeader() {
  const pathname = usePathname();
  const [panel, setPanel] = useState<HeaderPanel>(null);
  const [compact, setCompact] = useState(false);
  const [query, setQuery] = useState("");
  const desktopSearchRef = useRef<HTMLButtonElement>(null);
  const mobileSearchRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const cartRef = useRef<HTMLButtonElement>(null);
  const cart = useStorefrontCart();
  const cartCount = cart?.cart?.totalQuantity ?? 0;
  const close = useCallback(() => setPanel(null), []);
  const [previousPathname, setPreviousPathname] = useState(pathname);

  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setPanel(null);
  }

  useEffect(() => {
    const media = window.matchMedia?.("(max-width: 1023px)");
    if (!media) return;
    const sync = () => {
      if (document.activeElement?.closest("#header-search-panel")) (media.matches ? mobileSearchRef : desktopSearchRef).current?.focus({ preventScroll: true });
      setCompact(media.matches);
      setPanel(null);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const openCart = () => setPanel("cart");
    const closeCart = () => setPanel((current) => current === "cart" ? null : current);
    window.addEventListener("nilkurinji:cart-open", openCart);
    window.addEventListener("nilkurinji:cart-close", closeCart);
    return () => { window.removeEventListener("nilkurinji:cart-open", openCart); window.removeEventListener("nilkurinji:cart-close", closeCart); };
  }, []);

  return (
    <header className={styles.header}>
      <BotanicalEdges placement="header" />
      <div className={styles.topRow}>
        <button
          ref={menuRef}
          className={`${styles.tool} ${styles.menu} site-header__menu`}
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={panel === "menu"}
          aria-controls="header-menu-panel"
          onClick={() => setPanel((value) => (value === "menu" ? null : "menu"))}
        >
          <Menu aria-hidden="true" />
        </button>

        <button
          ref={desktopSearchRef}
          className={`${styles.searchTrigger} ${styles.desktopSearch} site-header__search-trigger site-tools__search`}
          type="button"
          aria-label="Search products"
          aria-expanded={panel === "search"}
          aria-controls="header-search-panel"
          onClick={() => setPanel((value) => (value === "search" ? null : "search"))}
        >
          <Search aria-hidden="true" />
          <span>Search</span>
        </button>

        <Link className={styles.logo} href="/" aria-label="Nilkurinji home" onClick={close}>
          <BrandMark className={styles.mark} />
          <span className={styles.name}>NILKURINJI</span>
          <span className={styles.descriptor}><i />PREMIUM FOOD &amp; BEVERAGES<i /></span>
        </Link>

        <div className={styles.tools}>
          <button
          ref={mobileSearchRef}
            className={`${styles.tool} ${styles.mobileSearch} site-header__search-trigger site-tools__search`}
            type="button"
            aria-label="Search products"
            aria-expanded={panel === "search"}
            aria-controls="header-search-panel"
            onClick={() => setPanel((value) => (value === "search" ? null : "search"))}
          >
            <Search aria-hidden="true" />
          </button>
          <Link href="/account" className={`${styles.tool} ${styles.account}`} aria-label="Customer account" onClick={close}>
            <UserRound aria-hidden="true" />
          </Link>
          <button
            ref={cartRef}
            type="button"
            className={styles.tool}
            aria-label={`Shopping cart${cartCount ? `, ${cartCount} ${cartCount === 1 ? "item" : "items"}` : ""}`}
            aria-expanded={panel === "cart"}
            aria-controls="header-cart-panel"
            onClick={() => setPanel((value) => (value === "cart" ? null : "cart"))}
          >
            <ShoppingBag aria-hidden="true" />
            {cartCount > 0 && <span className={styles.count} aria-hidden="true">{cartCount > 99 ? "99+" : cartCount}</span>}
          </button>
        </div>
      </div>

      <Suspense fallback={<PrimaryNavigationFallback onNavigate={close} />}>
        <PrimaryNavigation
          pathname={pathname}
          compact={compact}
          onNavigate={close}
        />
      </Suspense>

      <SearchOverlay open={panel === "search"} compact={compact} query={query} onQueryChange={setQuery} onClose={close} triggerRef={compact ? mobileSearchRef : desktopSearchRef} />
      <ModalSheet open={panel === "menu" && compact} id="header-menu-panel" label="Menu" placement="left" size="menu" triggerRef={menuRef} onClose={close}>
        <BotanicalEdges placement="menu-top" />
        <BotanicalEdges placement="menu" />
        <MobileNavigation onNavigate={close} />
      </ModalSheet>
      <ModalSheet open={panel === "cart"} id="header-cart-panel" label="Your cart" placement="right" triggerRef={cartRef} onClose={close}>
        <CartPanel presentation="drawer" />
      </ModalSheet>
    </header>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/shop") return pathname === "/shop" || pathname.startsWith("/products/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function PrimaryNavigation({
  pathname,
  compact,
  onNavigate,
}: {
  pathname: string;
  compact: boolean;
  onNavigate: () => void;
}) {
  if (compact) return null;

  return (
    <nav className={styles.navigation} aria-label="Primary navigation">
      <Link href="/" aria-current={isActive(pathname, "/") ? "page" : undefined} onClick={onNavigate}>Home</Link>
      <Link href="/shop" aria-current={isActive(pathname, "/shop") ? "page" : undefined} onClick={onNavigate}>Shop</Link>
      {PRIMARY_NAV.filter((item) => item.href !== "/" && item.href !== "/shop").map((item) => (
        <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined} onClick={onNavigate}>{item.label}</Link>
      ))}
    </nav>
  );
}

function PrimaryNavigationFallback({ onNavigate }: { onNavigate: () => void }) {
  return <nav className={styles.navigation} aria-label="Primary navigation">
    <Link href="/" onClick={onNavigate}>Home</Link>
    <Link href="/shop" onClick={onNavigate}>Shop</Link>
    {PRIMARY_NAV.filter((item) => item.href !== "/" && item.href !== "/shop").map((item) => <Link key={item.href} href={item.href} onClick={onNavigate}>{item.label}</Link>)}
  </nav>;
}

function MobileNavigation({ onNavigate }: { onNavigate: () => void }) {
  return <nav className={styles.mobileNav} aria-label="Mobile navigation">
    <Link href="/" onClick={onNavigate}>Home</Link>
    <Link href="/shop" onClick={onNavigate}>Shop</Link>
    {PRIMARY_NAV.filter((item) => item.href !== "/" && item.href !== "/shop").map((item) => <Link key={item.href} href={item.href} onClick={onNavigate}>{item.label}</Link>)}
    <Link href="/account" onClick={onNavigate}>Account</Link>
  </nav>;
}
