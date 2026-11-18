import type { StorefrontProduct } from "@/lib/shopify/types";
import styles from "./tea-details.module.css";

export function TeaDetails({ product }: { product: StorefrontProduct }) {
  const profile = product.teaProfile?.approved ? product.teaProfile : null;
  if (!profile) return null;
  const facts = [
    profile.format ? ["Format", profile.format === "loose-tea" ? "Loose tea" : "Tea bag"] : null,
    profile.origin ? ["Origin", profile.origin] : null,
    profile.estate ? ["Estate", profile.estate] : null,
    profile.elevationM !== null ? ["Elevation", `${profile.elevationM.toLocaleString("en-IN")} m`] : null,
    profile.harvest ? ["Harvest", profile.harvest] : null,
    profile.lot ? ["Lot", profile.lot] : null,
  ].filter((entry): entry is string[] => entry !== null);
  if (profile.tastingNotes.length === 0 && facts.length === 0) return null;

  return <section className={styles.details} aria-label="Tea profile">
    {profile.tastingNotes.length > 0 && <div className={styles.notes}><h2>Tasting notes</h2><ul>{profile.tastingNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>}
    {facts.length > 0 && <dl className={styles.facts}>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
  </section>;
}
