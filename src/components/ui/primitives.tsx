import type { ReactNode } from "react";

export function Arrow({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path d="M1 7h11.5M7.5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function Plus({ size = 12, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
      <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Original Strand mark: two phase-shifted strands crossing twice. */
export function StrandMark({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path d="M3 1c0 6 14 6 14 9s-14 3-14 9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M17 1c0 6-14 6-14 9s14 3 14 9" stroke="currentColor" strokeWidth="1.6" opacity="0.4" />
    </svg>
  );
}

/** "(01) Label" — the index system that runs through every section. */
export function SectionLabel({ index, children, className = "" }: { index: string; children: ReactNode; className?: string }) {
  return (
    <p className={`t-mono flex items-baseline gap-3 ${className}`}>
      <span className="opacity-50">({index})</span>
      <span>{children}</span>
    </p>
  );
}

export function CtaLink({
  href,
  children,
  tone = "dark",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <a href={href} className={`cta ${tone === "light" ? "cta--light" : ""} ${className}`} data-magnetic>
      <span>{children}</span>
      <span className="cta__icon">
        <Arrow />
      </span>
    </a>
  );
}
