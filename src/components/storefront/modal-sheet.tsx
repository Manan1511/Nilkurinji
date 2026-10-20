"use client";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { X } from "lucide-react";
import { IconButton } from "./action";
import styles from "./modal-sheet.module.css";
export type CloseReason = "escape" | "outside" | "close" | "navigation" | "viewport";
export type ModalSheetProps = { open: boolean; id?: string; label: string; placement: "right" | "top"; triggerRef: RefObject<HTMLElement | null>; initialFocusRef?: RefObject<HTMLElement | null>; onClose: (reason: CloseReason) => void; children: ReactNode };
export function ModalSheet({ open, id, label, placement, triggerRef, initialFocusRef, onClose, children }: ModalSheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    (initialFocusRef?.current ?? dialog.querySelector<HTMLElement>("input,button,a[href]"))?.focus();
    const resize = () => {
      if (window.visualViewport) dialog.style.setProperty("--sheet-available", `${Math.max(140, window.visualViewport.height - (placement === "top" ? dialog.getBoundingClientRect().top : 0))}px`);
    };
    resize(); window.visualViewport?.addEventListener("resize", resize);
    return () => {
      window.visualViewport?.removeEventListener("resize", resize);
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected && getComputedStyle(trigger).display !== "none") trigger.focus({ preventScroll: true });
      else document.querySelector<HTMLElement>('a[aria-label="Nilkurinji home"]')?.focus({ preventScroll: true });
    };
  }, [open, initialFocusRef, triggerRef, placement]);
  return <dialog ref={ref} id={id} className={`${styles.sheet} ${placement === "top" ? styles.top : ""}`} aria-label={label} onCancel={(event) => { event.preventDefault(); onClose("escape"); }} onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose("outside"); } }}>
    <div className={styles.heading}><h2>{label}</h2><IconButton aria-label={`Close ${label.toLowerCase()}`} onClick={() => onClose("close")}><X aria-hidden="true" /></IconButton></div>
    {children}
  </dialog>;
}
