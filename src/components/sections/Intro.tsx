"use client";

import { useRef, type CSSProperties } from "react";
import { intro } from "@/content/site";
import { images } from "@/lib/images";
import { useScrollProgress } from "@/components/motion/hooks";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/primitives";
import { ParallaxImage } from "@/components/ui/ParallaxImage";

export function Intro() {
  const statement = useRef<HTMLParagraphElement>(null);
  useScrollProgress(statement);
  const words = intro.statement.split(" ");

  return (
    <section id="approach" aria-labelledby="approach-title" className="relative bg-paper pt-32 pb-32 md:pt-40 lg:pt-[200px] lg:pb-[200px]">
      <div className="grid-site gap-y-8">
        <Reveal className="col-span-4 md:col-span-2 lg:col-span-3">
          <SectionLabel index={intro.index}>
            <span id="approach-title">{intro.label}</span>
          </SectionLabel>
        </Reveal>

        <p
          ref={statement}
          className="t-statement col-span-4 md:col-span-8 lg:col-span-9 lg:col-start-4 lg:pr-[4vw]"
          style={{ "--n": words.length } as CSSProperties}
        >
          {words.map((w, i) => (
            <span key={i} className="read-word" style={{ "--w": i } as CSSProperties}>
              {w}{" "}
            </span>
          ))}
        </p>
      </div>

      <div className="grid-site mt-24 gap-y-16 md:mt-32 lg:mt-[200px]">
        <figure className="col-span-3 md:col-span-4 lg:col-span-5">
          <Reveal kind="clip" className="relative aspect-[4/5] overflow-hidden bg-paper-2">
            <ParallaxImage image={images.chromosome} sizes="(min-width: 1200px) 40vw, (min-width: 768px) 50vw, 75vw" />
          </Reveal>
          <figcaption className="t-mono mt-4 text-mute">{intro.figure}</figcaption>
        </figure>

        <div className="col-span-4 md:col-span-4 md:col-start-5 md:self-end lg:col-span-6 lg:col-start-7">
          <Reveal>
            <h3 className="t-mono mb-8 text-mute lg:mb-12">{intro.notesTitle}</h3>
          </Reveal>
          <ol>
            {intro.notes.map((n, i) => (
              <Reveal as="li" key={n.title} index={i} className="grid grid-cols-6 gap-x-4 border-t border-line py-6 lg:py-8">
                <span className="t-mono col-span-1 pt-1.5 text-mute">0{i + 1}</span>
                <span className="col-span-5 lg:col-span-2">
                  <span className="t-heading block">{n.title}</span>
                </span>
                <p className="t-body col-span-5 col-start-2 mt-3 text-ink-2 lg:col-span-3 lg:col-start-auto lg:mt-0">{n.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
