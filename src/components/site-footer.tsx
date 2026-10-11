import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/site-config";
import type { SocialLink } from "@/lib/shopify/social-links";

export function SiteFooter({ socialLinks = [], preview = false }: { socialLinks?: SocialLink[]; preview?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="mx-auto grid w-full max-w-[1360px] gap-12 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-10 md:py-20">
        <div className="site-footer__brand">
          <Link href="/" className="wordmark wordmark--footer">Nilkurinji<span className="wordmark__period">.</span></Link>
          <p>{preview ? "A thoughtful pantry for the everyday table." : "Tea, tea bags, rice, snacks and other foods."}</p>
          {preview && <p className="site-footer__note">Illustrative imagery is used in the storefront preview.</p>}
          {socialLinks.length > 0 && (
            <div className="site-footer__socials" aria-label="Nilkurinji social media">
              {socialLinks.map(({ label, href }) => {
                return <a href={href} key={label} aria-label={`Nilkurinji on ${label}`} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRight aria-hidden="true" size={13} /></a>;
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="site-footer__heading">Explore</h2>
          <ul className="site-footer__links">
            <li><Link href="/shop">Shop all</Link></li>
            {CATEGORIES.map((category) => <li key={category.handle}><Link href={category.href}>{category.label}</Link></li>)}
          </ul>
        </div>

        <div>
          <h2 className="site-footer__heading">The essentials</h2>
          <ul className="site-footer__links">
            <li><Link href="/about">About Nilkurinji</Link></li>
            <li><Link href="/contact">Contact <ArrowUpRight aria-hidden="true" size={13} /></Link></li>
            <li><Link href="/pages/privacy-policy">Privacy policy</Link></li>
            <li><Link href="/pages/refund-policy">Refund policy</Link></li>
            <li><Link href="/pages/terms-and-conditions">Terms &amp; conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="site-footer__bottom">
        <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-2 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-10">
          <p>© {new Date().getFullYear()} Nilkurinji</p>
          <p>{preview ? "Design preview · Purchases disabled" : "Shopify-hosted storefront"}</p>
        </div>
      </div>
    </footer>
  );
}
