"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function ProductDetails({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const shell = document.querySelector(".site-shell")?.getBoundingClientRect().height ?? 100;
      element.dataset.sticky = String(window.innerWidth >= 1024 && element.scrollHeight <= window.innerHeight - shell - 48);
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure); observer?.observe(element); measure(); window.addEventListener("resize", measure);
    return () => { observer?.disconnect(); window.removeEventListener("resize", measure); };
  }, []);
  return <section ref={ref} className={className} aria-labelledby="product-title">{children}</section>;
}
