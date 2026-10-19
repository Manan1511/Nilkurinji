"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = "[data-scroll-reveal]";
const REVEAL_THRESHOLD = 0.08;

export function ScrollRevealObserver() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealObserver = prefersReducedMotion || !("IntersectionObserver" in window)
      ? null
      : new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < REVEAL_THRESHOLD) continue;
          const target = entry.target as HTMLElement;
          target.dataset.scrollRevealState = "revealed";
          observer.unobserve(target);
        }
      }, { rootMargin: "0px 0px -48px 0px", threshold: REVEAL_THRESHOLD });

    const register = (target: HTMLElement) => {
      if (target.dataset.scrollRevealReady === "true") return;
      target.dataset.scrollRevealReady = "true";

      const rect = target.getBoundingClientRect();
      const visibleWidth = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
      const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight - 48) - Math.max(rect.top, 0));
      const visibleArea = visibleWidth * visibleHeight;
      const elementArea = rect.width * rect.height;
      const alreadyVisible = elementArea > 0 && visibleArea / elementArea >= REVEAL_THRESHOLD;

      if (!revealObserver || alreadyVisible) {
        target.dataset.scrollRevealState = "revealed";
        return;
      }

      const delay = Number(target.dataset.scrollRevealDelay);
      if (Number.isFinite(delay) && delay > 0) {
        target.style.setProperty("--scroll-reveal-delay", `${Math.min(delay, 240)}ms`);
      }

      target.dataset.scrollRevealState = "pending";
      revealObserver.observe(target);
    };

    const scan = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches(REVEAL_SELECTOR)) register(root);
      root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(register);
    };

    scan(document);

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const added of record.addedNodes) {
          if (added instanceof HTMLElement || added instanceof DocumentFragment) scan(added);
        }
        for (const removed of record.removedNodes) {
          if (!(removed instanceof HTMLElement)) continue;
          if (removed.matches(REVEAL_SELECTOR)) revealObserver?.unobserve(removed);
          removed.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((target) => revealObserver?.unobserve(target));
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      revealObserver?.disconnect();
      document.querySelectorAll<HTMLElement>(`${REVEAL_SELECTOR}[data-scroll-reveal-state="pending"]`).forEach((target) => {
        delete target.dataset.scrollRevealReady;
      });
    };
  }, []);

  return null;
}
