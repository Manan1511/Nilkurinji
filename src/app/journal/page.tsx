import type { Metadata } from "next";
import { BotanicalEdges } from "@/components/botanical-edges";
import { CustomerReviewArchive } from "@/components/editorial/customer-review-archive";
import { CUSTOMER_REVIEWS } from "@/lib/customer-reviews";
import styles from "./journal.module.css";

export const metadata: Metadata = { title: "Journal", description: "Customer reviews of Nilkurinji Premium.", alternates: { canonical: "/journal" } };

export default function JournalPage() {
  return <main className={styles.page}>
    <header className={styles.heading}>
      <BotanicalEdges placement="banner" />
      <h1>Journal</h1>
    </header>
    <CustomerReviewArchive reviews={CUSTOMER_REVIEWS} compact />
  </main>;
}
