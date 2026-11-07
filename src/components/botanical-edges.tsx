import Image from "next/image";
import styles from "./botanical-edges.module.css";

type BotanicalPlacement = "header" | "home-hero" | "home-story" | "categories" | "featured" | "delivery" | "banner" | "story" | "menu-top" | "menu";

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
  "home-story": {
    left: { src: "/images/botanical/botanical-editorial-left.webp", width: 1024, height: 683 },
    right: { src: "/images/botanical/botanical-editorial-right-kurinji.webp", width: 1024, height: 683 },
  },
  categories: {
    left: { src: "/images/botanical/botanical-categories-left.webp", width: 683, height: 1024 },
    right: { src: "/images/botanical/botanical-categories-right-kurinji.webp", width: 1024, height: 683 },
  },
  featured: {
    left: { src: "/images/botanical/botanical-categories-left.webp", width: 683, height: 1024 },
    right: { src: "/images/botanical/botanical-categories-right-kurinji.webp", width: 1024, height: 683 },
  },
  delivery: {
    left: { src: "/images/botanical/botanical-editorial-left.webp", width: 1024, height: 683 },
    right: { src: "/images/botanical/botanical-editorial-right-kurinji.webp", width: 1024, height: 683 },
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
    left: { src: "/images/botanical/kurinji-branch-tall.webp", width: 900, height: 1200 },
    right: { src: "/images/botanical/kurinji-branch-cascade.webp", width: 1097, height: 1200 },
  },
};

const depthAssets: Partial<Record<BotanicalPlacement, BotanicalPair>> = {
  header: {
    left: { src: "/images/botanical/botanical-header-left.webp", width: 1024, height: 683 },
    right: { src: "/images/botanical/botanical-editorial-right-kurinji.webp", width: 1024, height: 683 },
  },
  "home-hero": {
    left: { src: "/images/botanical/botanical-editorial-left.webp", width: 1024, height: 683 },
    right: { src: "/images/botanical/botanical-editorial-right-kurinji.webp", width: 1024, height: 683 },
  },
  "home-story": {
    left: { src: "/images/botanical/botanical-header-left.webp", width: 1024, height: 683 },
    right: { src: "/images/botanical/botanical-header-right-refined.webp", width: 1350, height: 1165 },
  },
  categories: {
    left: { src: "/images/botanical/botanical-header-left.webp", width: 1024, height: 683 },
    right: { src: "/images/botanical/botanical-header-right-refined.webp", width: 1350, height: 1165 },
  },
  featured: {
    left: { src: "/images/botanical/botanical-header-left-refined.webp", width: 1433, height: 1098 },
    right: { src: "/images/botanical/botanical-header-right-refined.webp", width: 1350, height: 1165 },
  },
  delivery: {
    left: { src: "/images/botanical/botanical-categories-left.webp", width: 683, height: 1024 },
    right: { src: "/images/botanical/botanical-header-right-refined.webp", width: 1350, height: 1165 },
  },
  story: {
    left: { src: "/images/botanical/botanical-header-left.webp", width: 1024, height: 683 },
    right: { src: "/images/botanical/botanical-header-right-refined.webp", width: 1350, height: 1165 },
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
  "home-story": {
    left: "(max-width: 359px) 128px, (max-width: 767px) 160px, (max-width: 1279px) 190px, 224px",
    right: "(max-width: 359px) 132px, (max-width: 767px) 164px, (max-width: 1279px) 194px, 236px",
  },
  categories: {
    left: "(max-width: 359px) 120px, (max-width: 767px) 145px, (max-width: 1279px) 190px, 220px",
    right: "(max-width: 359px) 140px, (max-width: 767px) 165px, (max-width: 1279px) 210px, 250px",
  },
  featured: {
    left: "(max-width: 359px) 112px, (max-width: 767px) clamp(112px, 33vw, 130px), (max-width: 1279px) 180px, clamp(170px, 15vw, 220px)",
    right: "(max-width: 359px) 112px, (max-width: 767px) clamp(112px, 33vw, 130px), (max-width: 1279px) 235px, clamp(220px, 19vw, 280px)",
  },
  delivery: {
    left: "(max-width: 767px) 140px, (max-width: 1279px) 190px, 230px",
    right: "(max-width: 767px) 150px, (max-width: 1279px) 210px, 250px",
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
export function BotanicalEdges({ placement, textOnly = false }: { placement: BotanicalPlacement; textOnly?: boolean }) {
  const pair = assets[placement];
  const depthPair = depthAssets[placement];
  const depthSizes = placement === "home-hero" || placement === "home-story"
    ? "(max-width: 767px) 160px, (max-width: 1279px) 210px, 300px"
    : placement === "header"
      ? "(max-width: 767px) 112px, (max-width: 1279px) 160px, 190px"
      : placement === "categories"
        ? "(max-width: 767px) 145px, (max-width: 1279px) 210px, 260px"
          : placement === "story"
            ? "(max-width: 767px) 132px, (max-width: 1279px) 220px, 260px"
        : placement === "delivery"
          ? "(max-width: 767px) 150px, (max-width: 1279px) 220px, 260px"
          : "(max-width: 767px) 175px, (max-width: 1279px) 240px, 310px";
  const sizes = edgeSizes[placement];
  return (
    <span className={`${styles.edges} ${styles[placement]} ${textOnly ? styles.textOnly : ""}`} aria-hidden="true">
      {depthPair && <>
        <Image className={styles.depthLeft} src={depthPair.left.src} alt="" width={depthPair.left.width} height={depthPair.left.height} quality={75} sizes={depthSizes} />
        {placement !== "home-hero" && <Image className={styles.depthRight} src={depthPair.right.src} alt="" width={depthPair.right.width} height={depthPair.right.height} quality={75} sizes={depthSizes} />}
      </>}
      <Image className={styles.left} src={pair.left.src} alt="" width={pair.left.width} height={pair.left.height} quality={85} sizes={sizes.left} />
      {placement !== "home-hero" && <Image className={styles.right} src={pair.right.src} alt="" width={pair.right.width} height={pair.right.height} quality={85} sizes={sizes.right} />}
    </span>
  );
}
