type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 13.9C13.7 9.2 15.3 3.5 20 .7c4.7 2.8 6.3 8.5 0 13.2Z" fill="currentColor" />
      <path d="M18.6 17.6C10.4 18.2 5.6 13.8 5.1 7.1c7.2-.4 12.1 3.2 13.5 10.5Z" fill="currentColor" />
      <path d="M21.4 17.6C29.6 18.2 34.4 13.8 34.9 7.1c-7.2-.4-12.1 3.2-13.5 10.5Z" fill="currentColor" />
      <path d="M20 13.4v15.1M15.6 28.5h8.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
