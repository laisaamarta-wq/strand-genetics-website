"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { caseMeta, cover, finale } from "@/content/case";
import { images } from "@/lib/images";
import { useScrollProgress } from "@/components/motion/hooks";

export function Cover() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, { mode: "exit" });
  const letters = finale.brand.split("");

  return (
    <section
      id="cs-cover"
      ref={ref}
      aria-label={`${finale.brand} — ${cover.kicker}`}
      className="cs-cover relative flex h-[100svh] min-h-[620px] flex-col justify-end overflow-hidden bg-paper"
    >
      {/* the helix, larger and closer than on the site */}
      <div className="cs-cover__img pointer-events-none absolute left-[-70%] top-[12%] w-[260%] md:left-[-28%] md:top-[6%] md:w-[160%] lg:left-[-6%] lg:top-[-10%] lg:w-[116%]">
        <div className="hero__fade">
          <Image src={images.heroHelix.src} alt={images.heroHelix.alt} priority placeholder="blur" sizes="(min-width: 1200px) 116vw, 200vw" className="h-auto w-full" />
        </div>
      </div>

      <div className="cs-cover__mark relative">
        <div className="grid-site gap-y-2 pb-4 md:pb-6">
          <p className="cs-fade t-mono col-span-2 md:col-span-2 lg:col-span-3" style={{ "--i": 0 } as CSSProperties}>
            ({cover.kicker})
          </p>
          <p className="cs-fade t-mono col-span-4 row-start-2 md:col-span-4 md:col-start-3 md:row-start-1 lg:col-span-5 lg:col-start-4" style={{ "--i": 1 } as CSSProperties}>
            {cover.disciplines}
          </p>
          <p className="cs-fade t-mono col-span-2 col-start-3 text-right md:col-span-2 md:col-start-7 lg:col-span-3 lg:col-start-10" style={{ "--i": 2 } as CSSProperties}>
            {caseMeta.author} — {caseMeta.year}
          </p>
        </div>
        <h1 className="px-site pb-1 md:pb-2" aria-label={finale.brand}>
          <span aria-hidden="true" className="flex justify-between text-[25.6vw] font-medium leading-[0.78] tracking-[-0.06em]">
            {letters.map((l, i) => (
              <span key={i} className="inline-block overflow-hidden pt-[0.04em]">
                <span className="cs-rise" style={{ "--i": i } as CSSProperties}>{l}</span>
              </span>
            ))}
          </span>
        </h1>
      </div>
    </section>
  );
}
