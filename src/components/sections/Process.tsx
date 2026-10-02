"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { processContent as content } from "@/content/site";
import { images } from "@/lib/images";
import { useScrollProgress } from "@/components/motion/hooks";
import { Reveal, SplitLines } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/primitives";

const N = content.steps.length;
const stateOf = (i: number, active: number) => (i < active ? "past" : i === active ? "active" : "next");

export function Process() {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // colour shift as the section arrives (paper → ink)
  useScrollProgress(section, { mode: "enter", name: "e" });
  // pinned storytelling: progress through the tall section picks the active step
  useScrollProgress(pin, {
    mode: "pin",
    name: "pp",
    onProgress: (p) => setActive((prev) => {
      const next = Math.min(N - 1, Math.floor(p * N * 0.999));
      return next === prev ? prev : next;
    }),
  });

  return (
    <section
      id="process"
      ref={section}
      aria-labelledby="process-title"
      data-nav-tone="dark"
      className="process process__bg relative"
    >
      {/* ---------- desktop: pinned ---------- */}
      <div ref={pin} className="relative hidden lg:block" style={{ height: `${N * 100}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="grid-site h-full pb-12 pt-[calc(var(--nav-h)+24px)]">
            <div className="col-span-5 flex flex-col">
              <SectionLabel index={content.index}>{content.label}</SectionLabel>
              <h2 id="process-title" className="t-display-m mt-8 max-w-[12ch]">{content.title}</h2>

              <div className="mt-auto">
                <div className="flex items-end gap-6" aria-hidden="true">
                  <span className="block overflow-hidden text-[clamp(120px,15vw,240px)] font-medium leading-[0.8] tracking-[-0.06em]">
                    <span className="inline-block">0</span>
                    <span className="inline-block h-[0.8em] overflow-hidden align-top">
                      <span className="digit-track flex flex-col" style={{ transform: `translate3d(0, ${-active * 0.8}em, 0)` }}>
                        {content.steps.map((s) => (
                          <span key={s.index} className="block h-[0.8em]">{s.index.slice(1)}</span>
                        ))}
                      </span>
                    </span>
                  </span>
                  <span className="t-mono mb-3 opacity-50">/ 0{N}</span>
                </div>

                <div className="relative mt-10 h-[150px]">
                  {content.steps.map((s, i) => (
                    <div key={s.index} className="process-copy absolute inset-0" data-state={stateOf(i, active)} aria-hidden={i !== active}>
                      <h3 className="t-heading">{s.title}</h3>
                      <p className="t-body mt-4 max-w-[40ch] opacity-70">{s.body}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-4 gap-2" aria-hidden="true">
                  {content.steps.map((s, i) => (
                    <span key={s.index} className="relative h-px overflow-hidden bg-line-inv">
                      <span
                        className="absolute inset-0 origin-left bg-current transition-transform duration-700"
                        style={{ transform: `scaleX(${i <= active ? 1 : 0})` }}
                      />
                    </span>
                  ))}
                </div>
                <ol className="t-mono mt-3 grid grid-cols-4 gap-2">
                  {content.steps.map((s, i) => (
                    <li key={s.index} className={`transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-40"}`}>
                      {s.index} {s.title}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="col-span-5 col-start-8 flex items-center justify-end">
              <figure className="h-[72vh] aspect-[4/5]">
                <div className="relative h-full w-full overflow-hidden bg-ink-2">
                  {content.steps.map((s, i) => (
                    <div key={s.index} className="process-img absolute inset-0" data-state={stateOf(i, active)} style={{ zIndex: i }}>
                      <Image src={images[s.image].src} alt={images[s.image].alt} fill sizes="40vw" className="object-cover" />
                    </div>
                  ))}
                </div>
                <figcaption className="t-mono mt-4 flex justify-between opacity-50">
                  <span>Fig. 04.{active + 1}</span>
                  <span>{content.steps[active].caption}</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- tablet + mobile: sequential ---------- */}
      <div className="py-32 lg:hidden">
        <div className="grid-site gap-y-8">
          <Reveal className="col-span-4 md:col-span-8">
            <SectionLabel index={content.index}>{content.label}</SectionLabel>
          </Reveal>
          <SplitLines lines={[content.title]} as="h2" className="t-display-m col-span-4 md:col-span-6" />
        </div>
        <ol className="mt-20">
          {content.steps.map((s, i) => (
            <li key={s.index} className="grid-site mt-16 gap-y-6 first:mt-0">
              <Reveal kind="clip" className={`relative col-span-3 aspect-[4/5] overflow-hidden bg-ink-2 md:col-span-4 ${i % 2 ? "col-start-2 md:col-start-5" : ""}`}>
                <Image src={images[s.image].src} alt={images[s.image].alt} fill sizes="(min-width: 768px) 50vw, 75vw" className="object-cover" />
              </Reveal>
              <Reveal className={`col-span-4 md:col-span-4 md:self-end ${i % 2 ? "md:col-start-1 md:row-start-1" : "md:col-start-5"}`} style={{ "--i": 1 } as CSSProperties}>
                <span className="t-mono opacity-50">{s.index} / 0{N}</span>
                <h3 className="t-heading mt-3">{s.title}</h3>
                <p className="t-body mt-3 max-w-[40ch] opacity-70">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
