"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./route-transition.module.css";

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    // React ViewTransition handles supported browsers. Keep a CSS arrival for
    // browsers where the View Transitions API is not available.
    if (typeof document.startViewTransition === "function") return;
    const element = main.current;
    if (!element) return;

    if (timeout.current) clearTimeout(timeout.current);
    element.classList.add(styles.entering);
    timeout.current = setTimeout(() => {
      element.classList.remove(styles.entering);
      timeout.current = null;
    }, 190);

    return () => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = null;
      element.classList.remove(styles.entering);
    };
  }, [pathname]);

  return (
    <main ref={main} id="main-content" className={styles.main}>
      {children}
    </main>
  );
}
