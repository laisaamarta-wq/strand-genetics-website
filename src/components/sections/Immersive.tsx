"use client";

import Image from "next/image";
import { useRef } from "react";
import { immersive } from "@/content/site";
import { images } from "@/lib/images";
import { useScrollProgress } from "@/components/motion/hooks";
import { SectionLabel } from "@/components/ui/primitives";

/**
 * The page's held breath: a pinned, full-screen landscape that settles
 * from a close crop while one long line of type travels across it.
 */
export function Immersive() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, { mode: "pin" });

  return (
    <section ref={ref} aria-label="Perspective" className="relative h-[220vh] bg-paper-2 md:h-[260vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="immersive__img absolute inset-0">
          <Image
            src={images.landscape.src}
            alt={images.landscape.alt}
            fill
            sizes="100vw"
            placeholder="blur"
            className="object-cover object-[60%_50%]"
          />
        </div>

        <div className="absolute inset-x-0 top-[calc(var(--nav-h)+24px)]">
          <div className="grid-site">
            <SectionLabel index={immersive.index} className="col-span-2 md:col-span-4">
              {immersive.label}
            </SectionLabel>
          </div>
        </div>

        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
          <p className="immersive__line w-max whitespace-nowrap text-[clamp(88px,15vw,280px)] font-medium leading-[0.9] tracking-[-0.05em]">
            {immersive.line}
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-6 md:bottom-10">
          <div className="grid-site">
            <p className="t-mono col-span-4 text-ink-2 md:col-span-4">{immersive.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
