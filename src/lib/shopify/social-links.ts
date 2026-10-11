export type SocialLink = {
  label: "Instagram" | "Facebook" | "YouTube" | "Pinterest";
  href: string;
};

const SOCIAL_HOSTS: Record<SocialLink["label"], string[]> = {
  Instagram: ["instagram.com", "www.instagram.com"],
  Facebook: ["facebook.com", "www.facebook.com"],
  YouTube: ["youtube.com", "www.youtube.com", "youtu.be"],
  Pinterest: ["pinterest.com", "www.pinterest.com"],
};

export function getSocialLinks(fields: Record<string, string>): SocialLink[] {
  return (Object.entries(SOCIAL_HOSTS) as [SocialLink["label"], string[]][]).flatMap(([label, allowedHosts]) => {
    const key = `${label.toLowerCase()}_url`;
    const value = fields[key]?.trim();
    if (!value) return [];
    try {
      const url = new URL(value);
      const safe = url.protocol === "https:" && allowedHosts.includes(url.hostname.toLowerCase()) && !url.username && !url.password;
      return safe ? [{ label, href: url.toString() }] : [];
    } catch {
      return [];
    }
  });
}
