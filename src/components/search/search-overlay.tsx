"use client";

import { useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, X } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import type { CloseReason } from "@/components/storefront/modal-sheet";
import { usePredictiveSearch } from "@/hooks/use-predictive-search";
import { formatMoney } from "@/lib/format";
import { isEligibleSearchQuery, normalizeSearchQuery } from "@/lib/search/query";
import { CATEGORIES } from "@/lib/site-config";
import styles from "./search-overlay.module.css";

type Props = {
  open: boolean;
  compact: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onOpen: () => void;
  onClose: (reason: CloseReason) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  enabledCategories: string[];
};

export function SearchOverlay({ open, compact, query, onQueryChange, onOpen, onClose, triggerRef, enabledCategories }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeReason = useRef<CloseReason>("close");
  const onCloseRef = useRef(onClose);
  const state = usePredictiveSearch(query, open);
  const normalizedQuery = normalizeSearchQuery(query);
  const queryStarted = normalizedQuery.length > 0;

  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open) return;
    closeReason.current = "close";
    const trigger = triggerRef.current;
    const focusFrame = window.requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeReason.current = "escape";
        onCloseRef.current("escape");
      }
    };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        closeReason.current = "outside";
        onCloseRef.current("outside");
      }
    };
    document.addEventListener("keydown", keyboard);
    document.addEventListener("pointerdown", outside);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("pointerdown", outside);
      if (closeReason.current !== "outside" && closeReason.current !== "navigation" && closeReason.current !== "viewport") {
        trigger?.focus({ preventScroll: true });
      }
    };
  }, [open, triggerRef]);

  const close = (reason: CloseReason) => {
    closeReason.current = reason;
    onClose(reason);
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.control} data-open={open}>
        <button
          ref={triggerRef}
          className={styles.trigger}
          type="button"
          aria-label="Open search"
          aria-expanded={open}
          aria-controls="header-search-panel"
          aria-hidden={open}
          tabIndex={open ? -1 : 0}
          onClick={onOpen}
        >
          <Search aria-hidden="true" />
        </button>
        <div className={styles.pill} aria-hidden={!open} inert={!open}>
          <button className={styles.close} type="button" aria-label="Close search" tabIndex={open ? 0 : -1} onClick={() => close("close")}>
            <X aria-hidden="true" />
          </button>
          <SearchForm
            className={styles.inlineForm}
            id="header-product-search"
            inputRef={inputRef}
            value={query}
            onQueryChange={onQueryChange}
            onClear={() => { onQueryChange(""); inputRef.current?.focus({ preventScroll: true }); }}
            onSubmit={() => close("navigation")}
            iconSubmit
            placeholder={compact ? "Search…" : "Search tea and pantry"}
          />
        </div>
      </div>

      <div
        id="header-search-panel"
        className={styles.panel}
        data-open={open}
        role="region"
        aria-label="Search suggestions"
        aria-hidden={!open}
        inert={!open}
      >
        <div className={styles.content}>
          <div className={styles.scroll}>
            {!queryStarted && <>
              <p className={styles.label}>Browse collections</p>
              <nav className={styles.browse} aria-label="Browse the shop">
                <Link href="/shop" onClick={() => close("navigation")}>Shop all</Link>
                {CATEGORIES.filter((category) => enabledCategories.includes(category.handle)).map((category) => (
                  <Link key={category.handle} href={category.href} onClick={() => close("navigation")}>{category.label}</Link>
                ))}
              </nav>
            </>}

            {queryStarted && !isEligibleSearchQuery(query) && <p className={styles.status}>Enter at least two characters to search.</p>}
            {state.status === "waiting" && <p role="status" aria-live="polite" className={styles.status}>Searching…</p>}
            {state.status === "loading" && <p role="status" aria-live="polite" className={styles.status}>Searching…</p>}
            {state.status === "error" && <>
              <p role="status" aria-live="polite" className={styles.status}>{state.message}</p>
              <button type="button" className={styles.retry} onClick={state.retry}>Try search again</button>
            </>}
            {state.status === "empty" && <p role="status" aria-live="polite" className={styles.status}>No matching products. Try another search.</p>}
            {state.status === "results" && <p role="status" aria-live="polite" className="sr-only">{state.items.length} suggestions{state.hasMore ? ", with more in the shop" : ""}.</p>}

            {state.items.length > 0 && <ul className={styles.results}>
              {state.items.map((product) => (
                <li key={product.id}>
                  <Link href={`/products/${product.handle}`} onClick={() => close("navigation")}>
                    <span className={styles.image}>{product.image && <Image src={product.image.url} alt="" fill sizes="56px" />}</span>
                    <span className={styles.name}>{product.title}{product.price && <span className={styles.price}>{product.isPreview ? "Sample price: " : ""}{formatMoney(product.price)}</span>}</span>
                  </Link>
                </li>
              ))}
            </ul>}

            {(state.status === "results" || state.status === "empty") && <Link className={styles.all} href={`/shop?q=${encodeURIComponent(normalizeSearchQuery(query))}`} onClick={() => close("navigation")}>
              View all results <ArrowRight size={16} aria-hidden="true" />
            </Link>}
          </div>
        </div>
      </div>
    </div>
  );
}
