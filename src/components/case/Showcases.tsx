"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { processCase, scienceCase, testing } from "@/content/case";
import { science } from "@/content/site";
import { images } from "@/lib/images";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow } from "@/components/ui/primitives";
import { Chapter, ScrubControl, useScrub } from "./Chapter";
import { BrowserFrame, Caption, LiveNote } from "./Frames";

/* ------------------------------------------------------------------ */
/* 05 Testing — the production Services section, running as-is        */
/* ------------------------------------------------------------------ */
export function TestingShowcase() {
  return (
    <Chapter id="cs-testing" title={testing.title} body={testing.body}>
      <div className="cs-gap-m px-site">
        <LiveNote className="mb-5">{testing.stageNote}</LiveNote>
        {/* no transforms on this frame: the cursor preview is position: fixed */}
        <BrowserFrame url="strand-genetics.vercel.app/#services">
          <div className="pt-16 lg:pt-24">
            <Services />
          </div>
        </BrowserFrame>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 06 Science — the site's .expand-frame, scrubbable, + the A–D chain */
/* ------------------------------------------------------------------ */
export function ScienceShowcase() {
  const box = useRef<HTMLDivElement>(null);
  // the site opens the frame over the first ~48% of its pass through the viewport
  const { value, set } = useScrub(box, (p) => (p - 0.1) / 0.42);

  return (
    <Chapter id="science" title={scienceCase.title} body={scienceCase.body}>
      <div ref={box} className="cs-gap-m">
        {/* control sits above the frame so both stay in view while dragging */}
        <div className="grid-site mb-6 gap-y-4">
          <ScrubControl
            className="col-span-4 md:col-span-4 lg:col-span-4 lg:col-start-9"
            value={value}
            onChange={set}
            label="How far the laboratory frame has opened"
            hint={scienceCase.hint}
          />
        </div>
        <figure>
          <div
            className="expand-frame relative aspect-[4/5] w-full overflow-hidden bg-paper-2 [--side:8%] md:aspect-[16/10] md:[--side:14%] lg:aspect-[21/10] lg:[--side:22%]"
            style={{ "--p": value / 2.1 } as CSSProperties}
          >
            <div className="expand-frame__img absolute inset-0">
              <Image src={images.lab.src} alt={images.lab.alt} fill sizes="100vw" placeholder="blur" className="object-cover" />
            </div>
          </div>
          <figcaption className="grid-site">
            <Caption className="col-span-4 md:col-span-4">{science.figure}</Caption>
          </figcaption>
        </figure>
      </div>

      <div className="grid-site cs-gap-l gap-y-10">
        <Reveal className="col-span-4 md:col-span-8 lg:col-span-3">
          <h3 className="t-mono text-mute">{scienceCase.chainTitle}</h3>
        </Reveal>
        <ol className="cs-chain col-span-4 grid grid-cols-1 gap-x-4 gap-y-10 md:col-span-8 md:grid-cols-2 lg:col-span-9 lg:grid-cols-4">
          {science.principles.map((p, i) => (
            <Reveal as="li" key={p.title} index={i} className="cs-rule pt-6">
              <div className="flex items-center justify-between">
                <span className="cs-chain__letter t-mono">{p.index}</span>
                {i < science.principles.length - 1 && <Arrow className="hidden text-mute lg:block" />}
              </div>
              <h4 className="t-heading mt-8">{p.title}</h4>
              <p className="t-body mt-4 max-w-[30ch] text-ink-2">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 07 Process — the production pinned section, full bleed            */
/* ------------------------------------------------------------------ */
export function ProcessShowcase() {
  return (
    <>
      <Chapter id="cs-process" title={processCase.title} body={processCase.body} className="pb-[clamp(80px,9vw,160px)]">
        <div className="grid-site cs-gap-s">
          <LiveNote className="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-4">{processCase.hint}</LiveNote>
        </div>
      </Chapter>
      <div data-chapter="cs-process">
        <Process />
      </div>
    </>
  );
}
