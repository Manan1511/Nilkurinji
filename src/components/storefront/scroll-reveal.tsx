"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollRevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const targets = [...document.querySelectorAll<HTMLElement>("#main-content [data-reveal]")];
    const observer = new IntersectionObserver((entries, activeObserver) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.revealState = "visible";
        activeObserver.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });

    for (const target of targets) {
      if (target.getBoundingClientRect().top > window.innerHeight * 0.92) {
        target.dataset.revealState = "waiting";
        observer.observe(target);
      } else {
        target.dataset.revealState = "visible";
      }
    }
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
