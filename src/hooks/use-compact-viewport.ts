"use client";
import { useSyncExternalStore } from "react";
function subscribe(callback: () => void) { const media = window.matchMedia?.("(max-width: 1023px)"); media?.addEventListener("change", callback); return () => media?.removeEventListener("change", callback); }
export function useCompactViewport(): boolean { return useSyncExternalStore(subscribe, () => window.matchMedia?.("(max-width: 1023px)").matches ?? false, () => false); }
