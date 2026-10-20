import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import styles from "./action.module.css";
type Variant = "primary" | "secondary" | "text";
export function ActionButton({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button {...props} className={`${styles.action} ${styles[variant]} ${className}`} />;
}
export function ActionLink({ variant = "primary", className = "", ...props }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link {...props} className={`${styles.action} ${styles[variant]} ${className}`} />;
}
export function IconButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { "aria-label": string }) {
  return <button type="button" {...props} className={`${styles.icon} ${className}`} />;
}
