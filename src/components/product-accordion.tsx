import { Minus, Plus, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./product-accordion.module.css";

export function ProductAccordion({ title, Icon, children }: { title: string; Icon: LucideIcon; children: ReactNode }) {
  return <details className={styles.accordion}>
    <summary><Icon aria-hidden="true" /><span>{title}</span><span className={styles.toggle} aria-hidden="true"><Plus className={styles.plus} /><Minus className={styles.minus} /></span></summary>
    {children}
  </details>;
}
