"use client";

import { direction } from "@/content/case";
import type { ImageKey } from "@/content/site";
import { images } from "@/lib/images";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Chapter } from "./Chapter";
import { Caption } from "./Frames";

function Figure({
  img,
  caption,
  aspect,
  className = "",
  sizes,
  speed,
}: {
  img: ImageKey;
  caption: string;
  aspect: string;
  className?: string;
  sizes: string;
  speed?: number;
}) {
  return (
    <figure className={className}>
      <Reveal kind="clip" className={`relative overflow-hidden bg-paper-2 ${aspect}`}>
        <ParallaxImage image={images[img]} sizes={sizes} speed={speed} />
      </Reveal>
      <figcaption>
        <Caption>{caption}</Caption>
      </figcaption>
    </figure>
  );
}

export function ArtDirection() {
  return (
    <Chapter id="cs-direction" title={direction.title} body={direction.body}>
      {/* the largest image of the set, nearly full bleed */}
      <div className="cs-gap-l px-site">
        <Figure img="landscape" aspect="aspect-[4/5] md:aspect-[21/9]" sizes="100vw" speed={-10} caption="Cellular surface — Perspective" />
      </div>

      <div className="grid-site cs-gap-l gap-y-16">
        <Figure img="chromosome" aspect="aspect-[4/5]" className="col-span-3 md:col-span-4 lg:col-span-5 lg:col-start-2" sizes="(min-width: 1200px) 40vw, 70vw" caption="Chromosome — Approach" />
        <Figure img="hands" aspect="aspect-[4/5]" className="col-span-3 col-start-2 md:col-span-3 md:col-start-6 md:mt-[30%] lg:col-span-4 lg:col-start-8 lg:mt-[45%]" sizes="(min-width: 1200px) 33vw, 70vw" speed={-18} caption="Handled with care — About" />
      </div>

      <ul className="grid-site cs-gap-l gap-y-10">
        {direction.rules.map((r, i) => (
          <Reveal as="li" key={r.title} index={i} className={`cs-rule col-span-4 pt-6 md:col-span-4 lg:col-span-3 ${i === 0 ? "lg:col-start-4" : ""}`}>
            <span className="t-mono text-mute">0{i + 1}</span>
            <h3 className="t-heading mt-6">{r.title}</h3>
            <p className="t-body mt-3 max-w-[32ch] text-ink-2">{r.body}</p>
          </Reveal>
        ))}
      </ul>

      <div className="grid-site cs-gap-l gap-y-12">
        <Figure img="kit" aspect="aspect-[3/4]" className="col-span-2 md:col-span-2 lg:col-span-3" sizes="(min-width: 1200px) 25vw, 45vw" caption="Collect" />
        <Figure img="tubes" aspect="aspect-[3/4]" className="col-span-2 mt-16 md:col-span-2 lg:col-span-3 lg:mt-32" sizes="(min-width: 1200px) 25vw, 45vw" speed={-18} caption="Extract" />
        <Figure img="flowcell" aspect="aspect-[3/4]" className="col-span-2 md:col-span-2 lg:col-span-3" sizes="(min-width: 1200px) 25vw, 45vw" caption="Sequence" />
        <Figure img="report" aspect="aspect-[3/4]" className="col-span-2 mt-16 md:col-span-2 lg:col-span-3 lg:mt-32" sizes="(min-width: 1200px) 25vw, 45vw" speed={-18} caption="Understand" />
      </div>

      <div className="grid-site cs-gap-l gap-y-12">
        <Figure img="lab" aspect="aspect-[4/3] md:aspect-[16/9]" className="col-span-4 md:col-span-6 lg:col-span-8" sizes="(min-width: 1200px) 66vw, 100vw" caption="The sequencing laboratory — Science" />
        <Figure img="droplet" aspect="aspect-[3/4]" className="col-span-2 col-start-3 md:col-span-2 md:col-start-7 md:self-end lg:col-span-3 lg:col-start-10" sizes="(min-width: 1200px) 25vw, 45vw" speed={-20} caption="One drop, prepared" />
      </div>
    </Chapter>
  );
}
