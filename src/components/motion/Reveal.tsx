"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useInView } from "./hooks";

type Props = {
  as?: ElementType;
  kind?: "fade" | "clip" | "line" | "group";
  index?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
};

/**
 * Scroll-triggered reveal. `kind="group"` only sets data-inview so children
 * (e.g. SplitLines, wordmark letters) can animate themselves.
 */
export function Reveal({ as: Tag = "div", kind = "fade", index = 0, delay = 0, className, style, children, id }: Props) {
  const ref = useRef<HTMLElement>(null);
  useInView(ref);
  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal={kind === "group" ? undefined : kind}
      className={className}
      style={{ ...style, "--i": index, "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Masked line-by-line heading reveal. Lines are authored, not measured, so they never re-flow mid-animation. */
export function SplitLines({
  lines,
  as: Tag = "h2",
  className,
  delay = 0,
  id,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useInView(ref);
  return (
    <Tag ref={ref} id={id} className={className} style={{ "--d": `${delay}ms` } as CSSProperties} aria-label={lines.join(" ")}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask" aria-hidden="true">
          <span className="line-inner" style={{ "--i": i } as CSSProperties}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
