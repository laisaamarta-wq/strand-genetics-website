"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { hero } from "@/content/site";
import { images } from "@/lib/images";
import { useScrollProgress } from "@/components/motion/hooks";
import { CtaLink, Plus } from "@/components/ui/primitives";

/* Hotspot anchor points, as % of the helix image (desktop composition only). */
const HOTSPOTS = [
  { x: 17, y: 46, card: "left-4 top-6" },
  { x: 71, y: 30, card: "left-4 top-6" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, { mode: "exit" });

  // pointer depth: eased --mx / --my in [-1, 1]
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const move = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const tick = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty("--mx", x.toFixed(4));
      el.style.setProperty("--my", y.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="hero relative h-[100svh] min-h-[640px] overflow-hidden bg-paper md:min-h-[760px]"
    >
      {/* Layer 1 — the helix */}
      <div className="hero__helix absolute left-[-62%] top-[11%] w-[250%] md:left-[-30%] md:top-[10%] md:w-[170%] lg:left-[-5%] lg:top-[-7%] lg:w-[112%]">
        <div className="hero__fade enter-image relative">
          <Image
            src={images.heroHelix.src}
            alt={images.heroHelix.alt}
            priority
            sizes="(min-width: 1200px) 112vw, (min-width: 768px) 170vw, 250vw"
            className="h-auto w-full"
            placeholder="blur"
          />
          {/* hotspots ride on the helix so they share its depth */}
          {hero.hotspots.map((h, i) => (
            <div
              key={h.id}
              className="enter absolute hidden lg:block"
              style={{ left: `${HOTSPOTS[i].x}%`, top: `${HOTSPOTS[i].y}%`, "--i": 6 + i } as CSSProperties}
            >
              <span className="hotspot-dot relative block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" aria-hidden="true" />
              <a
                href={h.href}
                className={`hotspot-card group absolute ${HOTSPOTS[i].card} block w-[288px] p-4`}
              >
                <span className="flex items-center justify-between">
                  <span className="text-[15px] tracking-[-0.015em]">{h.title}</span>
                  <span className="disc h-7 w-7 group-hover:bg-accent">
                    <Plus className="transition-transform duration-700 group-hover:rotate-90" />
                  </span>
                </span>
                <span className="mt-4 block text-[13px] leading-[1.4] text-ink-2">{h.body}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Layer 2 — loose molecules, closest to the viewer */}
      <div
        className="hero__particles pointer-events-none absolute right-[-4%] top-[36%] w-[30vw] max-w-[520px] md:right-[2%] md:top-[40%] md:w-[20vw] lg:right-auto lg:top-auto lg:bottom-[-6%] lg:left-[33%] lg:w-[17vw]"
        aria-hidden="true"
      >
        <div className="enter-image" style={{ animationDelay: "1.6s" }}>
          <Image src={images.particles.src} alt="" sizes="(min-width: 1200px) 17vw, 46vw" className="h-auto w-full" />
        </div>
      </div>

      {/* Layer 3 — typography */}
      <div className="hero__title absolute inset-x-0 bottom-0 pb-6 md:pb-10 lg:pb-12">
        <div className="grid-site items-end gap-y-8">
          <div className="col-span-4 md:col-span-4 lg:col-span-4 lg:row-start-1">
            <p className="enter t-lead max-w-[30ch] text-ink-2 lg:max-w-[28ch]" style={{ "--i": 4 } as CSSProperties}>
              {hero.lead}
            </p>
            <div className="enter mt-6 lg:mt-8" style={{ "--i": 5 } as CSSProperties}>
              <CtaLink href={hero.cta.href}>{hero.cta.label}</CtaLink>
            </div>
          </div>

          <div className="col-span-4 row-start-1 md:col-span-8 lg:col-span-6 lg:col-start-7">
            <h1 id="hero-title" className="t-display-xl" aria-label={hero.title.join(" ")}>
              {hero.title.map((line, i) => (
                <span key={line} className="line-mask" aria-hidden="true">
                  <span className="enter-line" style={{ "--i": i } as CSSProperties}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <div className="enter mt-6 flex items-center gap-4 lg:mt-8" style={{ "--i": 3 } as CSSProperties}>
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-paper-2 lg:h-14 lg:w-14">
                <Image src={images.chromosome.src} alt="" fill sizes="56px" className="scale-[1.6] object-cover" />
              </span>
              <span className="text-[13px] leading-[1.3] tracking-[-0.005em]">
                <span className="block uppercase">{hero.meta.tags}</span>
                <span className="block text-mute">by {hero.meta.by}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="enter t-mono absolute right-[var(--margin)] top-[calc(var(--nav-h)+16px)] hidden items-center gap-3 lg:flex" style={{ "--i": 8 } as CSSProperties}>
        <span className="opacity-50">Scroll</span>
        <span className="relative block h-px w-12 overflow-hidden bg-line">
          <span className="absolute inset-0 origin-left animate-[scrollcue_2.4s_var(--ease-io)_infinite] bg-ink" />
        </span>
      </div>
    </section>
  );
}
