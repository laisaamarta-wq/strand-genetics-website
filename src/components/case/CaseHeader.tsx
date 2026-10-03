"use client";

import { useEffect, useRef, useState } from "react";
import { caseMeta, chapters } from "@/content/case";
import { StrandMark } from "@/components/ui/primitives";
import { subscribeScroll } from "@/components/motion/SmoothScroll";

/** Case-study bar. Reuses the site's .nav states (solid / hidden / tone) so it behaves like the real one. */
export function CaseHeader() {
  const ref = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let lastY = window.scrollY;
    return subscribeScroll(() => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.dataset.solid = String(y > 40);
      if (Math.abs(y - lastY) > 4) {
        el.dataset.hidden = String(y > lastY && y > window.innerHeight * 0.6);
        lastY = y;
      }
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      const hit = document.elementsFromPoint(window.innerWidth / 2, 32).find((n) => !el.contains(n));
      el.dataset.tone = hit?.closest("[data-nav-tone='dark']") ? "dark" : "light";
    });
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent((e.target as HTMLElement).dataset.chapter ?? null)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-chapter]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const c = chapters.find((ch) => ch.id === current);

  return (
    <header ref={ref} className="nav fixed inset-x-0 top-0 z-50" data-hidden="false" data-solid="false" data-tone="light">
      <div className="grid-site h-14 items-center md:h-16">
        <a href="#cs-cover" className="col-span-2 flex items-center gap-2 text-[16px] font-medium tracking-[-0.03em] md:col-span-3" aria-label="Back to the cover">
          <StrandMark size={16} />
          Strand
          <span className="t-mono ml-2 hidden font-normal opacity-50 md:inline">Case study</span>
        </a>
        <p className="t-mono col-span-3 hidden md:col-start-4 md:block lg:col-span-5 lg:col-start-6" aria-live="polite">
          {c ? (
            <>
              <span className="opacity-50">{c.index} / {chapters.length}</span>
              <span className="ml-3">{c.label}</span>
            </>
          ) : null}
        </p>
        <a
          href={caseMeta.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2 col-start-3 justify-self-end py-2 text-[14px] tracking-[-0.01em] md:col-span-2 md:col-start-7 lg:col-start-11"
        >
          <span className="link-u pb-0.5">View live</span> <span aria-hidden="true">↗</span>
        </a>
      </div>
      <span ref={bar} className="absolute bottom-0 left-0 h-px w-full origin-left bg-current opacity-30" style={{ transform: "scaleX(0)" }} aria-hidden="true" />
    </header>
  );
}
