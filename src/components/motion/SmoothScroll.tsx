"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * One scroll loop for the whole page.
 * Lenis smooths wheel input; every scroll-linked effect subscribes here
 * and writes CSS variables directly (no React re-renders per frame).
 */

type Sub = () => void;
const subs = new Set<Sub>();
let lenisRef: Lenis | null = null;

export function subscribeScroll(fn: Sub) {
  subs.add(fn);
  fn();
  return () => {
    subs.delete(fn);
  };
}

export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (lenisRef) {
    lenisRef.scrollTo(el as HTMLElement | number, { offset, duration: 1.6 });
  } else if (typeof el === "number") {
    window.scrollTo({ top: el });
  } else {
    el.scrollIntoView();
  }
}

export function getLenis() {
  return lenisRef;
}

const ReducedMotionContext = createContext(false);
export const useReducedMotion = () => useContext(ReducedMotionContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const run = () => subs.forEach((fn) => fn());
    let lenis: Lenis | null = null;

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
      lenisRef = lenis;
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      lenis.on("scroll", run);
      const raf = (t: number) => {
        lenis?.raf(t);
        frame.current = requestAnimationFrame(raf);
      };
      frame.current = requestAnimationFrame(raf);
    } else {
      window.addEventListener("scroll", run, { passive: true });
    }
    window.addEventListener("resize", run);
    run();

    // in-page anchors → smooth scroll
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector<HTMLElement>(id);
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame.current);
      lenis?.destroy();
      lenisRef = null;
      window.removeEventListener("scroll", run);
      window.removeEventListener("resize", run);
      document.removeEventListener("click", onClick);
    };
  }, [reduced]);

  return <ReducedMotionContext.Provider value={reduced}>{children}</ReducedMotionContext.Provider>;
}
