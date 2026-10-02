"use client";

import { useEffect, useState } from "react";

/**
 * Page-wide micro-interactions:
 *  - magnetic pull on [data-magnetic] CTAs (fine pointers only)
 *  - Shift+G toggles a 12/8/4-column grid overlay for design review
 */
export function Interactions() {
  const [grid, setGrid] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    if (fine && !reduced) {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
          const y = (e.clientY - (r.top + r.height / 2)) * 0.28;
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        };
        const leave = () => (el.style.transform = "");
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    const key = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === "g" && !(e.target as HTMLElement).closest("input,textarea")) {
        setGrid((g) => !g);
      }
    };
    window.addEventListener("keydown", key);
    cleanups.push(() => window.removeEventListener("keydown", key));
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <div className={`grid-overlay grid-site ${grid ? "is-on" : ""}`} aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className={i >= 8 ? "hidden lg:block" : i >= 4 ? "hidden md:block" : ""} />
      ))}
    </div>
  );
}
