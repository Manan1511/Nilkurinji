import { BadgeCheck, Coffee, Droplets, Leaf, Mountain, Sparkles, Utensils, Timer } from "lucide-react";
import type { ReactNode } from "react";
import type { StorefrontProduct } from "@/lib/shopify/types";
import { ProductAccordion } from "./product-accordion";
import styles from "./product-tea-guide.module.css";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (!minutes) return `${remainder} sec`;
  return remainder ? `${minutes} min ${remainder} sec` : `${minutes} min`;
}

export function ProductTeaGuide({ product, description }: { product: StorefrontProduct; description?: ReactNode }) {
  const isTea = product.collectionHandles.some((handle) => handle === "tea" || handle === "tea-bags");
  if (!isTea || product.comingSoon) return null;
  const brew = product.teaProfile?.approved ? product.teaProfile.brewing : null;
  const isRose = product.handle === "rose-tea";
  const useExample = !brew && product.collectionHandles.includes("tea");
  const steps = brew ? [
    brew.dose && { label: "Tea quantity", value: `${brew.dose.amount} ${brew.dose.unit}`, Icon: Utensils },
    brew.waterMl != null && { label: "Water", value: `${brew.waterMl} ml`, Icon: Droplets },
    brew.temperatureC != null && { label: "Temperature", value: `${brew.temperatureC}°C`, Icon: Sparkles },
    brew.steepSeconds != null && { label: "Steep", value: formatTime(brew.steepSeconds), Icon: Timer },
    brew.infusions != null && { label: "Infusions", value: String(brew.infusions), Icon: Coffee },
  ].filter((step): step is { label: string; value: string; Icon: typeof Utensils } => Boolean(step)) : useExample ? [
    { label: "Tea quantity", value: "1 tsp (2–3 g)", Icon: Utensils },
    { label: "Water", value: "150 ml", Icon: Droplets },
    { label: "Boiling time", value: "3–5 minutes", Icon: Timer },
    { label: "Final step", value: "Strain and enjoy", Icon: Coffee },
  ] : [];

  const features = [
    { label: "Rich Flavour", Icon: Leaf },
    { label: "Aromatic & Fresh", Icon: Coffee },
    { label: "Carefully Blended", Icon: BadgeCheck },
    { label: "Inspired by Nature", Icon: Mountain },
  ];

  return <div className={styles.wrapper}>
    <ul className={styles.features} aria-label="Tea features">
      {features.map(({ label, Icon }) => <li key={label}><Icon aria-hidden="true" strokeWidth={1.5} /><span>{label}</span></li>)}
    </ul>
    {description && <ProductAccordion title="Description" Icon={Leaf}>
      <div className={styles.description}>{description}</div>
    </ProductAccordion>}
    {(steps.length > 0 || brew?.instructions || isRose) && <ProductAccordion title="Tea Guide" Icon={Coffee}>
      {steps.length > 0 && <ol className={styles.steps}>
        {steps.map(({ label, value, Icon }) => <li key={label}><Icon aria-hidden="true" strokeWidth={1.5} /><span className={styles.stepLabel}>{label}</span><strong>{value}</strong></li>)}
      </ol>}
      {brew?.instructions && <p className={styles.instructions}>{brew.instructions}</p>}
      {isRose && <div className={styles.roseNotes}>
        <h3>For the best rose flavour</h3>
        <ul>
          <li><strong>Avoid adding cardamom (elaichi).</strong> Its strong flavour can overpower the delicate rose aroma and taste.</li>
          <li><strong>Use less sugar.</strong> Rose Tea already has a naturally sweet floral character, so there’s no need to add too much sugar. Adjust it according to your preference.</li>
        </ul>
      </div>}
    </ProductAccordion>}
  </div>;
}
