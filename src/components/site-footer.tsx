import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { CATEGORIES } from "@/lib/site-config";
import { getStorefrontMode } from "@/lib/shopify/mode";
import type { SocialLink } from "@/lib/shopify/social-links";
import styles from "./site-footer.module.css";

export function SiteFooter({ socialLinks = [] }: { socialLinks?: SocialLink[] }) {
  const preview = getStorefrontMode().mode === "preview";

  return <footer className={styles.footer}>
    <div className={`${styles.signature} ${socialLinks.length ? "" : styles.signatureWithoutSocial}`}>
      <div className={styles.brand}>
        <Link href="/" aria-label="Nilkurinji home" className={styles.logo}>
          <BrandMark />
          <span className={styles.wordmark}>NILKURINJI</span>
          <span className={styles.descriptor}>PREMIUM FOOD &amp; BEVERAGES</span>
        </Link>
      </div>
      <div className={styles.contact}>
        <h2>Get in touch</h2>
        <p>Questions about a product or order?</p>
        <Link href="/contact">Contact Nilkurinji <ArrowUpRight size={14} aria-hidden="true" /></Link>
      </div>
      {socialLinks.length > 0 && <div className={styles.socialBlock}>
          <h2>Follow Nilkurinji</h2>
          <nav className={styles.socials} aria-label="Nilkurinji social media">
            {socialLinks.map(({ href, label }) => <a href={href} key={label} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}
          </nav>
      </div>}
      <p className={styles.signoff}>Tea and pantry, for your table.</p>
      <Image className={`${styles.botanical} ${styles.botanicalLeft}`} src="/images/footer-botanical-left.svg" alt="" aria-hidden="true" width={144} height={120} />
      <Image className={`${styles.botanical} ${styles.botanicalRight}`} src="/images/footer-botanical-right.svg" alt="" aria-hidden="true" width={144} height={120} />
    </div>

    <div className={styles.links}>
      <nav aria-label="Shop categories">
        <h2>Shop</h2>
        <ul>
          <li><Link href="/shop">Shop all</Link></li>
          {CATEGORIES.map((category) => <li key={category.handle}><Link href={category.href}>{category.label}</Link></li>)}
        </ul>
      </nav>
      <nav aria-label="Discover Nilkurinji">
        <h2>Discover</h2>
        <ul>
          <li><Link href="/our-story">Our story</Link></li>
          <li><Link href="/tea-guide">Tea Guide</Link></li>
          <li><Link href="/recipes">Recipes</Link></li>
          <li><Link href="/journal">Journal</Link></li>
        </ul>
      </nav>
      <nav aria-label="Help and policies">
        <h2>Help &amp; policies</h2>
        <ul>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/shipping-and-returns">Shipping &amp; returns</Link></li>
          <li><Link href="/pages/privacy-policy">Privacy policy</Link></li>
          <li><Link href="/pages/refund-policy">Refund policy</Link></li>
          <li><Link href="/pages/terms-and-conditions">Terms &amp; conditions</Link></li>
        </ul>
      </nav>
    </div>

    <div className={styles.bottom}>
      <p>© {new Date().getFullYear()} Nilkurinji</p>
      {preview && <p>Design preview. Draft copy, sample prices and concept imagery. Purchases disabled.</p>}
    </div>
  </footer>;
}
