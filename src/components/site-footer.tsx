import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { getStorefrontMode } from "@/lib/shopify/mode";
import type { SocialLink } from "@/lib/shopify/social-links";
import styles from "./site-footer.module.css";
export function SiteFooter({ socialLinks = [] }: { socialLinks?: SocialLink[] }) {
  const preview = getStorefrontMode().mode === "preview";
  return <footer className={styles.footer}><div className={styles.inner}>
    <div className={styles.brand}><Link href="/" aria-label="Nilkurinji home" className={styles.logo}><BrandMark /><span>NILKURINJI</span></Link><p>For slow starts, busy middles, and second cups.</p>{socialLinks.length > 0 && <nav className={styles.socials} aria-label="Nilkurinji social media">{socialLinks.map(({ href, label }) => <a href={href} key={label} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</nav>}</div>
    <div><h2>Explore</h2><ul><li><Link href="/shop">Shop all</Link></li><li><Link href="/shop?category=tea">Tea</Link></li><li><Link href="/shop?category=tea-bags">Tea bags</Link></li></ul></div>
    <div><h2>Essentials</h2><ul><li><Link href="/about">Our story</Link></li><li><Link href="/contact">Contact</Link></li><li><Link href="/account">Account</Link></li></ul></div>
    <div><h2>Policies</h2><ul><li><Link href="/pages/privacy-policy">Privacy policy</Link></li><li><Link href="/pages/refund-policy">Refund policy</Link></li><li><Link href="/pages/terms-and-conditions">Terms &amp; conditions</Link></li></ul></div>
  </div><div className={styles.bottom}><p>© {new Date().getFullYear()} Nilkurinji</p>{preview && <p>Design preview. Draft copy, sample prices and concept imagery. Purchases disabled.</p>}</div></footer>;
}
