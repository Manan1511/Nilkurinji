"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import styles from "./wishlist-button.module.css";
const STORAGE_KEY = "nilkurinji-wishlist-v1";
const CHANGE_EVENT = "nilkurinji:wishlist-updated";
export function readWishlistState(): { handles: string[]; error: string } {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) throw new Error("invalid storage");
    return { handles: [...new Set(parsed.filter((value): value is string => typeof value === "string" && /^[a-z0-9-]{1,120}$/.test(value)))].slice(0, 20), error: "" };
  } catch { return { handles: [], error: "Your saved list could not be read on this device. Check browser storage and try again." }; }
}
export function readWishlist(): string[] { return readWishlistState().handles; }
export function WishlistButton({ handle, title = handle, compact = false, removeOnly = false }: { handle: string; title?: string; compact?: boolean; removeOnly?: boolean }) {
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const sync = () => setSaved(readWishlist().includes(handle));
    sync(); window.addEventListener(CHANGE_EVENT, sync); window.addEventListener("storage", sync);
    return () => { window.removeEventListener(CHANGE_EVENT, sync); window.removeEventListener("storage", sync); };
  }, [handle]);
  function toggle() {
    const stored = readWishlistState();
    if (stored.error) { setMessage(stored.error); return; }
    const current = stored.handles;
    const exists = current.includes(handle);
    if (removeOnly && !exists) return;
    if (!exists && current.length >= 20) { setMessage("Your wishlist has 20 items. Remove an item before saving another."); return; }
    const next = exists ? current.filter((item) => item !== handle) : [...current, handle];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setSaved(!exists); setMessage(""); window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch { setMessage("This item could not be saved on this device. Please allow browser storage and try again."); }
  }
  return <div className={`${styles.wrapper} ${compact ? styles.compact : ""}`}><button className={`${styles.button} ${saved ? styles.saved : ""}`} type="button" aria-label={`${saved ? "Remove" : "Save"} ${title}${saved ? " from wishlist" : " to wishlist"}`} aria-pressed={saved} onClick={toggle}><Heart aria-hidden="true" />{!compact && <span>{saved ? removeOnly ? "Remove" : "Saved" : "Save"}</span>}</button>{message && <p className={styles.message} role="status">{message}</p>}</div>;
}
