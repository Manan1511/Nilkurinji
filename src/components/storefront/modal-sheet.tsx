"use client";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { X } from "lucide-react";
import { IconButton } from "./action";
import styles from "./modal-sheet.module.css";
let activeDialogCount = 0;
let savedBodyOverflow = "";
const OVERLAY_OPEN_EVENT = "nilkurinji:modal-open";
export type CloseReason = "escape" | "outside" | "close" | "navigation" | "viewport";
export type ModalSheetProps = { open: boolean; id?: string; label: string; placement: "left" | "right" | "top"; triggerRef: RefObject<HTMLElement | null>; initialFocusRef?: RefObject<HTMLElement | null>; onClose: (reason: CloseReason) => void; children: ReactNode };
export function ModalSheet({ open, id, label, placement, triggerRef, initialFocusRef, onClose, children }: ModalSheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeReason = useRef<CloseReason>("close");
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const trigger = triggerRef.current;
    closeReason.current = "close";
    if (activeDialogCount === 0) savedBodyOverflow = document.body.style.overflow;
    activeDialogCount += 1;
    document.body.style.overflow = "hidden";
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    (initialFocusRef?.current ?? dialog.querySelector<HTMLElement>("input,button,a[href]"))?.focus();
    const resize = () => {
      if (window.visualViewport) dialog.style.setProperty("--sheet-available", `${Math.max(140, window.visualViewport.height - (placement === "top" ? dialog.getBoundingClientRect().top : 0))}px`);
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dialog.open) { event.preventDefault(); closeReason.current = "escape"; onCloseRef.current("escape"); }
    };
    const pointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !dialog.contains(event.target) && !trigger?.contains(event.target)) {
        closeReason.current = "outside";
        onCloseRef.current("outside");
      }
    };
    const closeForAnotherOverlay = (event: Event) => {
      if ((event as CustomEvent<HTMLDialogElement>).detail !== dialog) { closeReason.current = "viewport"; onCloseRef.current("viewport"); }
    };
    resize(); window.visualViewport?.addEventListener("resize", resize); document.addEventListener("keydown", keyboard); document.addEventListener("pointerdown", pointer); document.addEventListener(OVERLAY_OPEN_EVENT, closeForAnotherOverlay);
    document.dispatchEvent(new CustomEvent(OVERLAY_OPEN_EVENT, { detail: dialog }));
    return () => {
      window.visualViewport?.removeEventListener("resize", resize); document.removeEventListener("keydown", keyboard); document.removeEventListener("pointerdown", pointer); document.removeEventListener(OVERLAY_OPEN_EVENT, closeForAnotherOverlay);
      if (dialog.open) {
        if (typeof dialog.close === "function") dialog.close();
        else dialog.removeAttribute("open");
      }
      activeDialogCount = Math.max(0, activeDialogCount - 1);
      if (activeDialogCount === 0) document.body.style.overflow = savedBodyOverflow;
      if (closeReason.current !== "outside" && closeReason.current !== "viewport") {
        if (trigger?.isConnected && getComputedStyle(trigger).display !== "none") trigger.focus({ preventScroll: true });
        else document.querySelector<HTMLElement>('a[aria-label="Nilkurinji home"]')?.focus({ preventScroll: true });
      }
    };
  }, [open, initialFocusRef, triggerRef, placement]);
  return <dialog ref={ref} id={id} data-placement={placement} className={`${styles.sheet} ${placement === "top" ? styles.top : placement === "left" ? styles.left : ""}`} aria-label={label} onCancel={(event) => { event.preventDefault(); closeReason.current = "escape"; onCloseRef.current("escape"); }} onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) { closeReason.current = "outside"; onCloseRef.current("outside"); } } }}>
    <div className={styles.heading}><h2>{label}</h2><IconButton aria-label={`Close ${label.toLowerCase()}`} onClick={() => onClose("close")}><X aria-hidden="true" /></IconButton></div>
    {children}
  </dialog>;
}
