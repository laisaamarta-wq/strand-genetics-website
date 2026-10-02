"use client";

import Image from "next/image";
import { useRef } from "react";
import { science } from "@/content/site";
import { images } from "@/lib/images";
import { useScrollProgress } from "@/components/motion/hooks";
import { Reveal, SplitLines } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/primitives";
import { ParallaxImage } from "@/components/ui/ParallaxImage";

export function Science() {
  const frame = useRef<HTMLDivElement>(null);
  useScrollProgress(frame);

  return (
    <section id="science" aria-labelledby="science-title" className="relative bg-paper pb-32 lg:pb-[200px]">
      <div className="grid-site gap-y-8">
        <Reveal className="col-span-4 md:col-span-2 lg:col-span-3">
          <SectionLabel index={science.index}>{science.label}</SectionLabel>
        </Reveal>
        <div className="col-span-4 md:col-span-6 lg:col-span-9 lg:col-start-4">
          <SplitLines id="science-title" lines={science.title} className="t-display-l" />
          <Reveal index={2}>
            <p className="t-lead mt-8 max-w-[52ch] text-ink-2 lg:mt-12">{science.lead}</p>
          </Reveal>
        </div>
      </div>

      {/* frame opens from an inset window to full bleed as it rises */}
      <figure className="mt-20 lg:mt-32">
        <div ref={frame} className="relative">
          <div className="expand-frame relative aspect-[4/5] w-full overflow-hidden bg-paper-2 [--side:8%] md:aspect-[16/10] md:[--side:14%] lg:aspect-[16/9] lg:[--side:22%]">
            <div className="expand-frame__img absolute inset-0">
              <Image src={images.lab.src} alt={images.lab.alt} fill sizes="100vw" placeholder="blur" className="object-cover" />
            </div>
          </div>
        </div>
        <figcaption className="grid-site mt-4">
          <span className="t-mono col-span-4 text-mute md:col-span-4">{science.figure}</span>
        </figcaption>
      </figure>

      <div className="grid-site mt-24 gap-y-16 lg:mt-40">
        <figure className="col-span-2 md:col-span-3 lg:col-span-3">
          <Reveal kind="clip" className="relative aspect-[3/4] overflow-hidden bg-paper">
            <ParallaxImage image={images.droplet} sizes="(min-width: 1200px) 25vw, 40vw" speed={-10} />
          </Reveal>
          <figcaption className="t-mono mt-4 text-mute">{science.aside}</figcaption>
        </figure>

        <ol className="col-span-4 grid grid-cols-1 gap-x-4 gap-y-12 md:col-span-8 md:grid-cols-2 lg:col-span-7 lg:col-start-6 lg:gap-y-16">
          {science.principles.map((p, i) => (
            <Reveal as="li" key={p.title} index={i % 2} className="border-t border-line pt-6">
              <div className="flex items-baseline justify-between">
                <h3 className="t-heading">{p.title}</h3>
                <span className="t-mono text-mute">{p.index}</span>
              </div>
              <p className="t-body mt-6 max-w-[36ch] text-ink-2 lg:mt-10">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
