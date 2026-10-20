"use client";
import { useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { ModalSheet, type CloseReason } from "@/components/storefront/modal-sheet";
import { IconButton } from "@/components/storefront/action";
import { usePredictiveSearch } from "@/hooks/use-predictive-search";
import { formatMoney } from "@/lib/format";
import { normalizeSearchQuery } from "@/lib/search/query";
import styles from "./search-overlay.module.css";
type Props = { open: boolean; compact: boolean; query: string; onQueryChange: (value: string) => void; onClose: (reason: CloseReason) => void; triggerRef: RefObject<HTMLElement | null> };
export function SearchOverlay({ open, compact, query, onQueryChange, onClose, triggerRef }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const state = usePredictiveSearch(query, open);
  useEffect(() => {
    if (!open || compact) return;
    inputRef.current?.focus();
    const pointer = (event: PointerEvent) => { if (event.target instanceof Node && !panelRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) onClose("outside"); };
    const keyboard = (event: KeyboardEvent) => { if (event.key === "Escape") { onClose("escape"); triggerRef.current?.focus(); } };
    document.addEventListener("pointerdown", pointer); document.addEventListener("keydown", keyboard);
    return () => { document.removeEventListener("pointerdown", pointer); document.removeEventListener("keydown", keyboard); };
  }, [open, compact, onClose, triggerRef]);
  const content = <div className={`${styles.content} ${compact ? styles.compact : ""}`}>
    <SearchForm id="header-product-search" inputRef={inputRef} value={query} onQueryChange={onQueryChange} onSubmit={() => onClose("navigation")} />
    <div className={styles.scroll}>
    {(state.status === "idle" || state.status === "empty" || state.status === "error") && <>
      <p className={styles.label}>{state.status === "empty" ? "No products found. Explore a collection instead." : "Explore the collections"}</p>
      <nav className={styles.browse} aria-label="Browse collections"><Link href="/collections/tea" onClick={() => onClose("navigation")}>Tea</Link><Link href="/collections/tea-bags" onClick={() => onClose("navigation")}>Tea bags</Link><Link href="/shop" onClick={() => onClose("navigation")}>Shop all</Link></nav>
    </>}
    <p role="status" aria-live="polite" className={styles.status}>{state.status === "loading" ? "Searching…" : state.status === "results" ? `${state.items.length} suggestions${state.hasMore ? ", with more on the results page" : ""}.` : state.status === "empty" ? "No products found." : state.message}</p>
    {state.status === "error" && <button type="button" className={styles.retry} onClick={state.retry}>Try search again</button>}
    {state.items.length > 0 && <ul className={styles.results}>{state.items.map((product) => <li key={product.id}><Link href={`/products/${product.handle}`} onClick={() => onClose("navigation")}><span className={styles.image}>{product.image && <Image src={product.image.url} alt="" fill sizes="56px" />}</span><span className={styles.name}>{product.title}{product.price && <span className={styles.price}>{product.isPreview ? "Sample price: " : ""}{formatMoney(product.price)}</span>}</span></Link></li>)}</ul>}
    {(state.status === "results" || state.status === "empty") && <Link className={styles.all} href={`/search?q=${encodeURIComponent(normalizeSearchQuery(query))}`} onClick={() => onClose("navigation")}>View all results <ArrowRight size={16} aria-hidden="true" /></Link>}
    </div>
  </div>;
  if (compact) return <ModalSheet open={open} id="header-search-panel" label="Search" placement="top" triggerRef={triggerRef} initialFocusRef={inputRef} onClose={onClose}>{content}</ModalSheet>;
  return <section id="header-search-panel" ref={panelRef} className={styles.popover} hidden={!open} aria-label="Search products" onBlur={(event) => { const next = event.relatedTarget; if (next instanceof Node && !event.currentTarget.contains(next) && !triggerRef.current?.contains(next)) onClose("outside"); }}>
    <div className={styles.heading}><h2>Search</h2><IconButton aria-label="Close search" onClick={() => { onClose("close"); triggerRef.current?.focus(); }}><X aria-hidden="true" /></IconButton></div>{content}
  </section>;
}
