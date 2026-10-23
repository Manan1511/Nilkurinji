import type { StorefrontProduct } from "@/lib/shopify/types";
import styles from "./tea-details.module.css";

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (!minutes) return `${remainder} sec`;
  return remainder ? `${minutes} min ${remainder} sec` : `${minutes} min`;
}

export function TeaDetails({ product }: { product: StorefrontProduct }) {
  const profile = product.teaProfile?.approved ? product.teaProfile : null;
  if (!profile) return null;
  const brew = profile.brewing;
  const facts = [
    profile.format ? ["Format", profile.format === "loose-tea" ? "Loose tea" : "Tea bag"] : null,
    profile.origin ? ["Origin", profile.origin] : null,
    profile.estate ? ["Estate", profile.estate] : null,
    profile.elevationM !== null ? ["Elevation", `${profile.elevationM.toLocaleString("en-IN")} m`] : null,
    profile.harvest ? ["Harvest", profile.harvest] : null,
    profile.lot ? ["Lot", profile.lot] : null,
  ].filter((entry): entry is string[] => entry !== null);
  const brewing = brew ? [
    brew.dose ? ["Dose", `${brew.dose.amount} ${brew.dose.unit}`] : null,
    brew.waterMl !== null ? ["Water", `${brew.waterMl} ml`] : null,
    brew.temperatureC !== null ? ["Temperature", `${brew.temperatureC}°C`] : null,
    brew.steepSeconds !== null ? ["Steep", formatTime(brew.steepSeconds)] : null,
    brew.infusions !== null ? ["Infusions", String(brew.infusions)] : null,
  ].filter((entry): entry is string[] => entry !== null) : [];

  return <section className={styles.details} aria-label="Tea profile">
    {profile.tastingNotes.length > 0 && <div className={styles.notes}><h2>Tasting notes</h2><ul>{profile.tastingNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>}
    {facts.length > 0 && <dl className={styles.facts}>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
    {brewing.length > 0 && <div className={styles.brewing}><h2>Brewing this tea</h2><dl>{brewing.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{brew?.instructions && <p>{brew.instructions}</p>}</div>}
  </section>;
}
