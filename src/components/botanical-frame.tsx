import Image from "next/image";

export function BotanicalFrame({ className }: { className: string }) {
  return (
    <div className={`botanical-frame ${className}`} aria-hidden="true">
      <span className="botanical-frame__spray botanical-frame__spray--left">
        <Image src="/images/botanical-tea-spray.webp" alt="" fill sizes="(max-width: 760px) 30vw, 18vw" />
      </span>
      <span className="botanical-frame__spray botanical-frame__spray--right">
        <Image src="/images/botanical-tea-spray.webp" alt="" fill sizes="(max-width: 760px) 30vw, 18vw" />
      </span>
    </div>
  );
}
