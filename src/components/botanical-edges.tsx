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

const edgeSizes: Record<BotanicalPlacement, { left: string; right: string }> = {
  header: {
    left: "(max-width: 359px) 64px, (max-width: 767px) clamp(64px, 18vw, 80px), (max-width: 1279px) clamp(88px, 9vw, 118px), clamp(96px, 8.5vw, 128px)",
    right: "(max-width: 359px) 64px, (max-width: 767px) clamp(64px, 18vw, 80px), (max-width: 1279px) clamp(88px, 9vw, 118px), clamp(96px, 8.5vw, 128px)",
  },
  "home-hero": {
    left: "(max-width: 359px) 112px, (max-width: 767px) clamp(116px, 34vw, 136px), (max-width: 1279px) clamp(88px, 10vw, 124px), clamp(200px, 15vw, 240px)",
    right: "(max-width: 359px) 100px, (max-width: 767px) clamp(112px, 31vw, 124px), (max-width: 1279px) clamp(64px, 9vw, 112px), clamp(72px, 12vw, 184px)",
  },
  featured: {
    left: "(max-width: 359px) 112px, (max-width: 767px) clamp(112px, 33vw, 130px), (max-width: 1279px) 180px, clamp(170px, 15vw, 220px)",
    right: "(max-width: 359px) 112px, (max-width: 767px) clamp(112px, 33vw, 130px), (max-width: 1279px) 235px, clamp(220px, 19vw, 280px)",
  },
  banner: {
    left: "(max-width: 359px) 88px, (max-width: 767px) clamp(88px, 27vw, 108px), (max-width: 1279px) 150px, 195px",
    right: "(max-width: 359px) 88px, (max-width: 767px) clamp(88px, 27vw, 108px), (max-width: 1279px) 152px, 200px",
  },
  story: {
    left: "(max-width: 359px) 104px, (max-width: 767px) clamp(104px, 30vw, 120px), (max-width: 1279px) 150px, 216px",
    right: "(max-width: 359px) 104px, (max-width: 767px) clamp(104px, 30vw, 120px), (max-width: 1279px) 152px, 214px",
  },
  "menu-top": { left: "(max-width: 767px) 150px, 132px", right: "(max-width: 767px) 150px, 132px" },
  menu: { left: "(max-width: 767px) 270px, 126px", right: "(max-width: 767px) 270px, 136px" },
};

/** Pale background branches add depth to the menu without obscuring its links. */
export function MenuBackgroundFoliage() {
  return <span className={`${styles.edges} ${styles.menuBackground}`} aria-hidden="true">
    <Image className={styles.backgroundLeft} src="/images/botanical/botanical-categories-left.webp" alt="" width={683} height={1024} quality={85} sizes="220px" />
    <Image className={styles.backgroundRight} src="/images/botanical/botanical-editorial-right-kurinji.webp" alt="" width={1024} height={683} quality={85} sizes="200px" />
    <Image className={styles.backgroundRightLower} src="/images/botanical/botanical-categories-right-kurinji.webp" alt="" width={1024} height={683} quality={85} sizes="195px" />
    <Image className={styles.backgroundLeftUpper} src="/images/botanical/botanical-editorial-left.webp" alt="" width={1024} height={683} quality={85} sizes="180px" />
    <Image className={styles.backgroundMidLeft} src="/images/botanical/botanical-header-left-refined.webp" alt="" width={1433} height={1098} quality={85} sizes="180px" />
    <Image className={styles.backgroundMidRight} src="/images/botanical/botanical-header-right-refined.webp" alt="" width={1350} height={1165} quality={85} sizes="190px" />
  </span>;
}

/** Section-specific transparent foliage; each composition has its own silhouette. */
export function BotanicalEdges({ placement }: { placement: BotanicalPlacement }) {
  const pair = assets[placement];
  const sizes = edgeSizes[placement];
  return (
    <span className={`${styles.edges} ${styles[placement]}`} aria-hidden="true">
      <Image className={styles.left} src={pair.left.src} alt="" width={pair.left.width} height={pair.left.height} quality={85} sizes={sizes.left} />
      <Image className={styles.right} src={pair.right.src} alt="" width={pair.right.width} height={pair.right.height} quality={85} sizes={sizes.right} />
    </span>
  );
}
