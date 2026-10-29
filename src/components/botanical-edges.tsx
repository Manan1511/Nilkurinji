import Image from "next/image";
import styles from "./botanical-edges.module.css";

type BotanicalPlacement = "header" | "home-hero" | "featured" | "banner" | "story" | "menu-top" | "menu";

type BotanicalAsset = { src: string; width: number; height: number };
type BotanicalPair = { left: BotanicalAsset; right: BotanicalAsset };

const assets: Record<BotanicalPlacement, BotanicalPair> = {
  header: {
    left: { src: "/images/botanical/botanical-header-left-refined.webp", width: 1433, height: 1098 },
    right: { src: "/images/botanical/botanical-header-right-refined.webp", width: 1350, height: 1165 },
  },
  "home-hero": {
    left: { src: "/images/botanical/botanical-home-hero-left-refined.webp", width: 1327, height: 1186 },
    right: { src: "/images/botanical/botanical-home-hero-right-refined.webp", width: 1327, height: 1186 },
  },
  featured: {
    left: { src: "/images/botanical/botanical-categories-left.webp", width: 683, height: 1024 },
    right: { src: "/images/botanical/botanical-categories-right-kurinji.webp", width: 1024, height: 683 },
  },
  banner: {
    left: { src: "/images/botanical/botanical-editorial-left.webp", width: 1024, height: 683 },
    right: { src: "/images/botanical/botanical-editorial-right-kurinji.webp", width: 1024, height: 683 },
  },
  story: {
    left: { src: "/images/botanical/botanical-editorial-left.webp", width: 1024, height: 683 },
    right: { src: "/images/botanical/botanical-editorial-right-kurinji.webp", width: 1024, height: 683 },
  },
  menu: {
    left: { src: "/images/botanical/botanical-editorial-left.webp", width: 1024, height: 683 },
    right: { src: "/images/botanical/botanical-categories-right-kurinji.webp", width: 1024, height: 683 },
  },
  "menu-top": {
    left: { src: "/images/botanical/botanical-home-hero-left-refined.webp", width: 1327, height: 1186 },
    right: { src: "/images/botanical/botanical-home-hero-right-refined.webp", width: 1327, height: 1186 },
  },
};

/** Section-specific transparent foliage; each composition has its own silhouette. */
export function BotanicalEdges({ placement }: { placement: BotanicalPlacement }) {
  const pair = assets[placement];
  const mobileSize = {
    header: "22vw",
    "home-hero": "36vw",
    featured: "32vw",
    banner: "28vw",
    story: "30vw",
    "menu-top": "23vw",
    menu: "36vw",
  }[placement];
  const narrowMobileSize = {
    header: "24vw",
    "home-hero": "36vw",
    featured: "35vw",
    banner: "28vw",
    story: "33vw",
    "menu-top": "26vw",
    menu: "40vw",
  }[placement];
  const desktopSize = placement === "header" || placement === "home-hero" ? "12vw" : placement === "menu-top" ? "14vw" : "18vw";
  const sizes = `(max-width: 359px) ${narrowMobileSize}, (max-width: 767px) ${mobileSize}, ${desktopSize}`;
  return (
    <span className={`${styles.edges} ${styles[placement]}`} aria-hidden="true">
      <Image className={styles.left} src={pair.left.src} alt="" width={pair.left.width} height={pair.left.height} sizes={sizes} />
      <Image className={styles.right} src={pair.right.src} alt="" width={pair.right.width} height={pair.right.height} sizes={sizes} />
    </span>
  );
}
