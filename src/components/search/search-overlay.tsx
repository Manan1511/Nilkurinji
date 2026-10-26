"use client";
import { useRef, type RefObject } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { ModalSheet, type CloseReason } from "@/components/storefront/modal-sheet";
import { usePredictiveSearch } from "@/hooks/use-predictive-search";
import { formatMoney } from "@/lib/format";
import { normalizeSearchQuery } from "@/lib/search/query";
import styles from "./search-overlay.module.css";
type Props = { open: boolean; compact: boolean; query: string; onQueryChange: (value: string) => void; onClose: (reason: CloseReason) => void; triggerRef: RefObject<HTMLElement | null> };
export function SearchOverlay({ open, compact, query, onQueryChange, onClose, triggerRef }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const state = usePredictiveSearch(query, open);
  const content = <div className={`${styles.content} ${compact ? styles.compact : ""}`}>
    <SearchForm className={styles.overlayForm} id="header-product-search" inputRef={inputRef} value={query} onQueryChange={onQueryChange} onClear={() => { onQueryChange(""); inputRef.current?.focus(); }} onSubmit={() => onClose("navigation")} />
    <div className={styles.scroll}>
    {(state.status === "idle" || state.status === "empty" || state.status === "error") && <>
      <p className={styles.label}>Browse collections</p>
      <nav className={styles.browse} aria-label="Browse the shop"><Link href="/shop?category=tea" onClick={() => onClose("navigation")}>Tea</Link><Link href="/shop?category=tea-bags" onClick={() => onClose("navigation")}>Tea bags</Link><Link href="/shop" onClick={() => onClose("navigation")}>Shop all</Link></nav>
    </>}
    <p role="status" aria-live="polite" className={state.status === "results" ? "sr-only" : styles.status}>{state.status === "loading" ? "Searching…" : state.status === "results" ? `${state.items.length} suggestions${state.hasMore ? ", with more on the results page" : ""}.` : state.status === "empty" ? "No products found." : state.message}</p>
    {state.status === "error" && <button type="button" className={styles.retry} onClick={state.retry}>Try search again</button>}
    {state.items.length > 0 && <ul className={styles.results}>{state.items.map((product) => <li key={product.id}><Link href={`/products/${product.handle}`} onClick={() => onClose("navigation")}><span className={styles.image}>{product.image && <Image src={product.image.url} alt="" fill sizes="56px" />}</span><span className={styles.name}>{product.title}{product.price && <span className={styles.price}>{product.isPreview ? "Sample price: " : ""}{formatMoney(product.price)}</span>}</span></Link></li>)}</ul>}
    {(state.status === "results" || state.status === "empty") && <Link className={styles.all} href={`/search?q=${encodeURIComponent(normalizeSearchQuery(query))}`} onClick={() => onClose("navigation")}>View all results <ArrowRight size={16} aria-hidden="true" /></Link>}
    </div>
  </div>;
  return <ModalSheet open={open} id="header-search-panel" label="Search" placement="top" triggerRef={triggerRef} initialFocusRef={inputRef} onClose={onClose}>{content}</ModalSheet>;
}
