import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/site-config";
import { BrandMark } from "@/components/brand-mark";
import { getStorefrontMode } from "@/lib/shopify/mode";
import type { SocialLink } from "@/lib/shopify/social-links";
import styles from "./site-footer.module.css";
export function SiteFooter({ socialLinks = [] }: { socialLinks?: SocialLink[] }) {
  const preview = getStorefrontMode().mode === "preview";
  return <footer className={styles.footer}><div className={styles.inner}>
    <div className={styles.brand}><Link href="/" aria-label="Nilkurinji home" className={styles.logo}><BrandMark /><span>NILKURINJI</span><small>Food &amp; beverages</small></Link><p>Tea for everyday moments.</p>{socialLinks.length > 0 && <nav className={styles.socials} aria-label="Nilkurinji social media">{socialLinks.map(({ href, label }) => <a href={href} key={label} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</nav>}</div>
    <div><h2>Shop</h2><ul><li><Link href="/shop">Shop all</Link></li>{CATEGORIES.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul></div>
    <div><h2>Information</h2><ul><li><Link href="/about">Our story</Link></li><li><Link href="/contact">Contact</Link></li><li><Link href="/search">Search</Link></li><li><Link href="/account">Your account</Link></li><li><Link href="/wishlist">Wishlist</Link></li></ul></div>
    <div><h2>The essentials</h2><ul><li><Link href="/pages/privacy-policy">Privacy policy</Link></li><li><Link href="/pages/refund-policy">Refund policy</Link></li><li><Link href="/pages/terms-and-conditions">Terms &amp; conditions</Link></li></ul></div>
  </div><div className={styles.bottom}><p>© {new Date().getFullYear()} Nilkurinji</p>{preview && <p>Preview catalog. Draft copy, sample prices and concept imagery. Purchases disabled.</p>}</div></footer>;
}
