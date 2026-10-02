"use client";

import { useEffect, useRef, type RefObject } from "react";
import { subscribeScroll } from "./SmoothScroll";

export type ProgressMode =
  /** 0 when the element's top meets the viewport bottom, 1 when its bottom leaves the top */
  | "through"
  /** for tall sections with a sticky child: 0 at top-of-viewport, 1 when the end reaches the bottom */
  | "pin"
  /** 0 when top meets viewport bottom, 1 when top reaches viewport top */
  | "enter"
  /** 0 at page top, 1 after the element has scrolled fully out of view (hero) */
  | "exit";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function computeProgress(el: HTMLElement, mode: ProgressMode) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  switch (mode) {
    case "pin":
      return clamp(-r.top / Math.max(1, r.height - vh));
    case "enter":
      return clamp((vh - r.top) / vh);
    case "exit":
      return clamp(-r.top / Math.max(1, r.height));
    default:
      return clamp((vh - r.top) / (vh + r.height));
  }
}

/**
 * Writes scroll progress of `ref` to the CSS variable `--{name}` on `target` (defaults to ref).
 * Optional callback receives the raw progress for JS-driven state.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { mode = "through", name = "p", target, onProgress }: {
    mode?: ProgressMode;
    name?: string;
    target?: RefObject<HTMLElement | null>;
    onProgress?: (p: number) => void;
  } = {},
) {
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = -1;
    return subscribeScroll(() => {
      const p = computeProgress(el, mode);
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      (target?.current ?? el).style.setProperty(`--${name}`, p.toFixed(4));
      cb.current?.(p);
    });
  }, [ref, mode, name, target]);
}

/** Sets data-inview="true" once the element enters the viewport. */
export function useInView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { rootMargin = "0px 0px -12% 0px", once = true }: { rootMargin?: string; once?: boolean } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.inview = "true";
          if (once) io.disconnect();
        } else if (!once) {
          el.dataset.inview = "false";
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once]);
}
