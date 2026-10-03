"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { chapter, type ChapterId } from "@/content/case";
import { Reveal, SplitLines } from "@/components/motion/Reveal";
import { useScrollProgress } from "@/components/motion/hooks";

/** A case-study chapter: hairline, index, title and a short paragraph. */
export function Chapter({
  id,
  title,
  body,
  children,
  className = "",
  headClassName = "",
  aside,
}: {
  id: ChapterId;
  title: readonly string[];
  body: string;
  children?: ReactNode;
  className?: string;
  headClassName?: string;
  aside?: ReactNode;
}) {
  const c = chapter(id);
  return (
    <section id={id} data-chapter={id} aria-labelledby={`${id}-title`} className={`cs-chapter relative ${className}`}>
      <header className={`grid-site gap-y-8 ${headClassName}`}>
        <Reveal kind="line" className="cs-rule col-span-full" />
        <Reveal className="col-span-4 md:col-span-2 lg:col-span-3">
          <p className="t-mono flex items-baseline gap-3">
            <span className="opacity-50">{c.index}</span>
            <span>{c.label}</span>
          </p>
        </Reveal>
        <div className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-4">
          <SplitLines id={`${id}-title`} lines={[...title]} className="t-display-m" />
          <Reveal index={2}>
            <p className="t-lead mt-8 max-w-[50ch] text-ink-2 lg:mt-10">{body}</p>
          </Reveal>
        </div>
        {aside && <div className="col-span-4 self-end md:col-span-8 lg:col-span-2 lg:col-start-11">{aside}</div>}
      </header>
      {children}
    </section>
  );
}

/**
 * Scrub state for scroll-driven demos: follows the page scroll (like the site does)
 * until the visitor drags the control; scrolling again hands control back to the page.
 * `fromScroll` maps the element's scroll progress (0..1, "through") to a 0..1 value.
 */
export function useScrub<T extends HTMLElement>(ref: RefObject<T | null>, fromScroll: (p: number) => number) {
  const [auto, setAuto] = useState(0);
  const [manual, setManual] = useState<number | null>(null);
  const map = useRef(fromScroll);
  map.current = fromScroll;

  useScrollProgress(ref, {
    name: "scroll",
    onProgress: (p) => {
      const v = Math.round(Math.min(1, Math.max(0, map.current(p))) * 200) / 200;
      setAuto((prev) => (prev === v ? prev : v));
      setManual(null);
    },
  });

  return { value: manual ?? auto, set: setManual };
}

export function ScrubControl({
  value,
  onChange,
  label,
  hint,
  className = "",
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  hint: string;
  className?: string;
}) {
  const pct = String(Math.round(value * 100)).padStart(3, "0");
  return (
    <div className={className}>
      <div className="cs-scrub">
        <input
          type="range"
          min={0}
          max={1}
          step={0.005}
          value={value}
          aria-label={label}
          aria-valuetext={`${Math.round(value * 100)} percent`}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <output className="t-mono w-10 text-right tabular-nums">{pct}</output>
      </div>
      <p className="t-mono mt-3 text-mute">{hint}</p>
    </div>
  );
}

/** Mounts children only once the wrapper approaches the viewport (heavy live stages). */
export function useMountInView<T extends HTMLElement>(ref: RefObject<T | null>, rootMargin = "0px 0px -20% 0px") {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || on) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, on]);
  return on;
}
