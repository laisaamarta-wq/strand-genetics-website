import Image from "next/image";
import type { ReactNode } from "react";
import { caseMeta } from "@/content/case";
import { shots, type ShotKey } from "@/lib/case-images";

/** Minimal browser chrome. No transform here — live components inside may rely on position: fixed. */
export function BrowserFrame({
  url = caseMeta.liveLabel,
  children,
  className = "",
}: {
  url?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`cs-browser ${className}`}>
      <div className="cs-browser__bar" aria-hidden="true">
        <span className="cs-browser__dots"><i /><i /><i /></span>
        <span className="t-mono cs-browser__url">{url}</span>
        <span />
      </div>
      <div className="cs-browser__view">{children}</div>
    </div>
  );
}

/** A real desktop screenshot inside browser chrome. */
export function DesktopShot({
  shot,
  sizes = "(min-width: 1200px) 80vw, 100vw",
  url,
  className = "",
}: {
  shot: ShotKey;
  sizes?: string;
  url?: string;
  className?: string;
}) {
  const s = shots[shot];
  return (
    <BrowserFrame url={url} className={className}>
      <div className="relative aspect-[16/10] bg-paper-2">
        <Image src={s.src} alt={s.alt} fill sizes={sizes} placeholder="blur" className="object-cover object-top" />
      </div>
    </BrowserFrame>
  );
}

export function PhoneShot({ shot, sizes = "(min-width: 768px) 22vw, 45vw", className = "" }: { shot: ShotKey; sizes?: string; className?: string }) {
  const s = shots[shot];
  return (
    <div className={`cs-phone ${className}`}>
      <div className="cs-phone__screen">
        <Image src={s.src} alt={s.alt} fill sizes={sizes} placeholder="blur" className="object-cover object-top" />
      </div>
    </div>
  );
}

export function TabletShot({ shot, sizes = "(min-width: 768px) 28vw, 50vw", className = "" }: { shot: ShotKey; sizes?: string; className?: string }) {
  const s = shots[shot];
  return (
    <div className={`cs-tablet ${className}`}>
      <div className="cs-tablet__screen">
        <Image src={s.src} alt={s.alt} fill sizes={sizes} placeholder="blur" className="object-cover object-top" />
      </div>
    </div>
  );
}

/** Small caption line used under figures across the case study. */
export function Caption({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`t-mono mt-4 text-mute ${className}`}>{children}</p>;
}

/** "● Live" marker for blocks that run the production component itself. */
export function LiveNote({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`t-mono flex items-center gap-3 text-ink-2 ${className}`}>
      <span className="cs-live-dot shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
