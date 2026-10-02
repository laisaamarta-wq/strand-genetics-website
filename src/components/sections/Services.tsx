"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { services } from "@/content/site";
import { images } from "@/lib/images";
import { Reveal, SplitLines } from "@/components/motion/Reveal";
import { Plus, SectionLabel } from "@/components/ui/primitives";

export function Services() {
  const [open, setOpen] = useState<string | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const media = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);

  // cursor-following preview (desktop, fine pointer)
  useEffect(() => {
    const el = media.current;
    const ul = list.current;
    if (!el || !ul) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1200px)").matches) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, vx = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      const nx = x + (tx - x) * 0.14;
      vx = nx - x;
      x = nx;
      y += (ty - y) * 0.14;
      el.style.setProperty("--cx", `${x}px`);
      el.style.setProperty("--cy", `${y}px`);
      el.style.setProperty("--rot", `${Math.max(-6, Math.min(6, vx * 0.25))}deg`);
      raf = requestAnimationFrame(tick);
    };
    const enter = (e: PointerEvent) => {
      x = tx = e.clientX;
      y = ty = e.clientY;
    };
    ul.addEventListener("pointerenter", enter);
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);
    return () => {
      ul.removeEventListener("pointerenter", enter);
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="services" aria-labelledby="services-title" className="relative bg-paper pb-32 lg:pb-[200px]">
      <div className="grid-site gap-y-8">
        <Reveal className="col-span-4 md:col-span-2 lg:col-span-3">
          <SectionLabel index={services.index}>{services.label}</SectionLabel>
        </Reveal>
        <div className="col-span-4 md:col-span-6 lg:col-span-9 lg:col-start-4">
          <SplitLines id="services-title" lines={services.title} className="t-display-l" />
          <Reveal index={2}>
            <p className="t-lead mt-8 max-w-[44ch] text-ink-2 lg:mt-12">{services.lead}</p>
          </Reveal>
        </div>
      </div>

      <ul ref={list} className="svc-list mt-20 lg:mt-32" onPointerLeave={() => setHover(null)}>
        {services.items.map((s, i) => {
          const isOpen = open === s.id;
          return (
            <Reveal
              as="li"
              key={s.id}
              index={i}
              className="border-t border-line last:border-b"
            >
              <div data-open={isOpen} className="svc-row" onPointerEnter={() => setHover(i)}>
                <button
                  type="button"
                  className="grid-site w-full items-center py-6 text-left lg:py-7"
                  aria-expanded={isOpen}
                  aria-controls={`svc-${s.id}`}
                  onClick={() => setOpen(isOpen ? null : s.id)}
                >
                  <span className="t-mono col-span-1 text-mute">{s.index}</span>
                  <span className="svc-shift t-heading col-span-2 md:col-span-4 lg:col-span-5 lg:!text-[40px] lg:!leading-[1] lg:!tracking-[-0.035em]">
                    {s.title}
                  </span>
                  <span className="col-span-3 hidden md:col-span-2 md:block lg:col-span-3 lg:col-start-8">
                    <span className="t-body block text-mute">{s.summary}</span>
                  </span>
                  <span className="t-mono col-span-1 hidden whitespace-nowrap text-mute lg:block">{s.tags.join(" / ")}</span>
                  <span className="col-span-1 flex justify-end self-center md:col-start-8 lg:col-start-12">
                    <span className="svc-plus disc h-8 w-8">
                      <Plus />
                    </span>
                  </span>
                </button>

                <div id={`svc-${s.id}`} className="svc-detail" role="region" aria-label={s.title}>
                  <div>
                    <div className="grid-site gap-y-6 pb-8 lg:pb-12">
                      <p className="t-lead col-span-4 col-start-1 text-ink-2 md:col-span-4 md:col-start-2 lg:col-span-4 lg:col-start-8">
                        {s.detail}
                      </p>
                      <p className="t-mono col-span-4 text-mute md:col-start-2 lg:hidden">{s.tags.join(" / ")}</p>
                      <div className="relative col-span-2 aspect-[4/5] overflow-hidden bg-paper-2 md:col-span-2 md:col-start-6 md:row-start-1 lg:hidden">
                        <Image src={images[s.image].src} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ul>

      {/* floating preview that follows the cursor */}
      <div ref={media} className="cursor-media hidden overflow-hidden bg-paper-2 lg:block" data-active={hover !== null && services.items[hover].id !== open} aria-hidden="true">
        {services.items.map((s, i) => (
          <div key={s.id} className="cursor-media__img" data-active={hover === i}>
            <Image src={images[s.image].src} alt="" fill sizes="240px" loading="eager" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
