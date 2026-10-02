"use client";

import { about } from "@/content/site";
import { images } from "@/lib/images";
import { Reveal, SplitLines } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/primitives";
import { ParallaxImage } from "@/components/ui/ParallaxImage";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative bg-paper py-32 lg:py-[200px]">
      <div className="grid-site gap-y-8">
        <Reveal className="col-span-4 md:col-span-2 lg:col-span-3">
          <SectionLabel index={about.index}>{about.label}</SectionLabel>
        </Reveal>
        <SplitLines id="about-title" lines={about.statement} className="t-display-l col-span-4 md:col-span-8 lg:col-span-9 lg:col-start-4" />
      </div>

      <div className="grid-site mt-20 gap-y-16 lg:mt-32">
        <div className="col-span-4 md:col-span-4 lg:col-span-4 lg:col-start-4">
          {about.body.map((p, i) => (
            <Reveal key={i} index={i}>
              <p className={`t-lead text-ink-2 ${i ? "mt-6" : ""}`}>{p}</p>
            </Reveal>
          ))}
        </div>

        <figure className="col-span-3 col-start-2 md:col-span-4 md:col-start-5 lg:col-span-4 lg:col-start-9">
          <Reveal kind="clip" className="relative aspect-[4/5] overflow-hidden bg-paper-2">
            <ParallaxImage image={images.hands} sizes="(min-width: 1200px) 33vw, 50vw" speed={-12} />
          </Reveal>
          <figcaption className="t-mono mt-4 text-mute">{about.figure}</figcaption>
        </figure>

        <ul className="col-span-4 grid grid-cols-1 gap-x-4 gap-y-10 md:col-span-8 md:grid-cols-3 lg:col-span-9 lg:col-start-4 lg:mt-8">
          {about.values.map((v, i) => (
            <Reveal as="li" key={v.title} index={i} className="border-t border-ink pt-5">
              <span className="t-mono text-mute">0{i + 1}</span>
              <h3 className="t-heading mt-6">{v.title}</h3>
              <p className="t-body mt-3 max-w-[30ch] text-ink-2">{v.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
