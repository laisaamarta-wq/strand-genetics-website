"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { nav } from "@/content/site";
import { StrandMark } from "@/components/ui/primitives";
import { getLenis, subscribeScroll } from "@/components/motion/SmoothScroll";

export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // hide on scroll down, reveal on scroll up; solid after leaving the top; tone follows dark sections
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

      // tone: is the surface actually visible under the nav a [data-nav-tone=dark] section?
      // (hit-test rather than rects, so the sticky footer hidden beneath <main> doesn't count)
      const probe = 40;
      const hit = document.elementsFromPoint(window.innerWidth / 2, probe).find((n) => !el.contains(n));
      const dark = !!hit?.closest("[data-nav-tone='dark']");
      el.dataset.tone = dark ? "dark" : "light";
    });
  }, []);

  // active section underline
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nav.links.forEach((l) => {
      const s = document.getElementById(l.id);
      if (s) io.observe(s);
    });
    return () => io.disconnect();
  }, []);

  // menu: lock scroll + Esc to close
  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        ref={ref}
        className={`nav fixed inset-x-0 top-0 z-50 ${open ? "nav--menu" : ""}`}
        data-hidden="false"
        data-solid="false"
        data-tone="light"
      >
        <div className="grid-site h-[var(--nav-h)] items-center">
          <a
            href="#top"
            className="col-span-2 flex items-center gap-2 text-[17px] font-medium tracking-[-0.03em]"
            aria-label="Strand — back to top"
          >
            <StrandMark />
            Strand
          </a>

          <nav aria-label="Primary" className="hidden lg:col-span-7 lg:col-start-4 lg:block">
            <ul className="flex gap-8">
              {nav.links.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    className="group flex items-baseline gap-1.5 py-2 text-[14px] tracking-[-0.01em]"
                    aria-current={active === l.id ? "true" : undefined}
                  >
                    <span className="t-mono !text-[10px] opacity-40">{l.index}</span>
                    <span className="link-u pb-0.5" aria-current={active === l.id ? "true" : undefined}>
                      {l.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 col-start-3 flex items-center justify-end gap-6 md:col-start-7 lg:col-span-2 lg:col-start-11">
            <a href={nav.cta.href} className="hidden py-2 text-[14px] tracking-[-0.01em] md:inline-flex md:items-center md:gap-2 lg:inline-flex">
              <span className="link-u pb-0.5">{nav.cta.label}</span>
              <span className="disc h-2 w-2" aria-hidden="true" />
            </a>
            <button
              type="button"
              className="t-mono -mr-3 flex h-11 items-center gap-2 px-3 lg:hidden"
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span className="relative block h-2 w-4" aria-hidden="true">
                <span className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-500 ${open ? "translate-y-1 rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px w-4 bg-current transition-transform duration-500 ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
        <span ref={bar} className="absolute bottom-0 left-0 h-px w-full origin-left bg-current opacity-30" style={{ transform: "scaleX(0)" }} aria-hidden="true" />
      </header>

      {/* mobile / tablet menu */}
      <div
        id="menu"
        className="menu-panel fixed inset-0 z-40 flex flex-col bg-ink pt-[var(--nav-h)] text-paper lg:hidden"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <ul className="px-site mt-auto">
          {nav.links.map((l, i) => (
            <li key={l.id} className="overflow-hidden border-t border-line-inv">
              <a
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="menu-item flex items-baseline justify-between py-4 text-[40px] font-medium leading-none tracking-[-0.04em] md:text-[56px]"
                style={{ "--i": i } as CSSProperties}
              >
                {l.label}
                <span className="t-mono opacity-40">{l.index}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="px-site flex items-center justify-between border-t border-line-inv py-6">
          <a href={nav.cta.href} onClick={() => setOpen(false)} className="text-[15px]">
            {nav.cta.label} →
          </a>
          <span className="t-mono opacity-50">Genetic laboratory</span>
        </div>
      </div>
    </>
  );
}
