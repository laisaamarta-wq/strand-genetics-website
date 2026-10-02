"use client";

import { useEffect, useRef } from "react";
import { StrandMark } from "@/components/ui/primitives";

/**
 * Brief entrance: a counting hairline, then the curtain lifts.
 * Timing is pure CSS (see .loader in globals.css) so the page never waits on JS.
 */
export function Loader() {
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = count.current;
    if (!el) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 1250);
      const eased = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      el.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="loader" aria-hidden="true">
      <div className="mb-6 flex items-end justify-between">
        <span className="flex items-center gap-2 text-[17px] font-medium tracking-[-0.03em]">
          <StrandMark /> Strand
        </span>
        <span className="t-mono">
          <span ref={count}>000</span>
        </span>
      </div>
      <div className="loader__bar" />
    </div>
  );
}
