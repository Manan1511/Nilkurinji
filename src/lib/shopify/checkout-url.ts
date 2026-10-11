export function isSafeCheckoutUrl(
  value: string | null | undefined,
  storeDomain: string,
  allowedHosts: string[] = [storeDomain],
): boolean {
  if (!value || !storeDomain || allowedHosts.length === 0) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      allowedHosts.some((host) => host === url.hostname.toLowerCase()) &&
      !url.username &&
      !url.password &&
      (url.pathname.startsWith("/checkouts/") || url.pathname.startsWith("/cart/c/"))
    );
  } catch {
    return false;
  }
}
