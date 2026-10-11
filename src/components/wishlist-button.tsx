"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const STORAGE_KEY = "nilkurinji-wishlist-v1";
const CHANGE_EVENT = "nilkurinji:wishlist-updated";

export function readWishlist(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((value): value is string => typeof value === "string" && /^[a-z0-9-]{1,120}$/.test(value)))].slice(0, 20);
  } catch {
    return [];
  }
}

export function WishlistButton({ handle, compact = false }: { handle: string; compact?: boolean }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(readWishlist().includes(handle));
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [handle]);

  function toggle(): void {
    const current = readWishlist();
    const next = current.includes(handle) ? current.filter((item) => item !== handle) : [...current, handle].slice(-20);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(next.includes(handle));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <button
      className={`wishlist-button ${compact ? "wishlist-button--compact" : ""} ${saved ? "is-saved" : ""}`}
      type="button"
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={saved}
      onClick={toggle}
    >
      <Heart aria-hidden="true" />
      {!compact && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
