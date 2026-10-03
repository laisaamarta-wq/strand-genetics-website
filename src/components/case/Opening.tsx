"use client";

import { useRef, useState, type CSSProperties } from "react";
import { opening } from "@/content/case";
import { intro } from "@/content/site";
import { Hero } from "@/components/sections/Hero";
import { Loader } from "@/components/sections/Loader";
import { Reveal } from "@/components/motion/Reveal";
import { Chapter, ScrubControl, useMountInView, useScrub } from "./Chapter";
import { BrowserFrame, LiveNote } from "./Frames";

/** The production Loader + Hero, mounted when the frame comes into view so the entrance plays in front of the viewer. */
function LiveHero() {
  const screen = useRef<HTMLDivElement>(null);
  const visible = useMountInView(screen, "0px 0px -35% 0px");
  const [run, setRun] = useState(0);

  return (
    <div className="px-site">
      <BrowserFrame>
        <div ref={screen} className="cs-hero-screen">
          {visible && (
            <div key={run} className="absolute inset-0">
              <Loader />
              <Hero />
            </div>
          )}
        </div>
      </BrowserFrame>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <LiveNote>{opening.stageNote}</LiveNote>
        <button type="button" className="cs-pill" onClick={() => setRun((r) => r + 1)}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M10.5 6A4.5 4.5 0 1 1 9 2.6M9.5 0.5V3H7" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {opening.replay}
        </button>
      </div>
    </div>
  );
}

/** The Approach statement with the site's own .read-word mechanic, scrubbable. */
function ReadingDemo() {
  const box = useRef<HTMLDivElement>(null);
  // the site lights the last word at roughly p = 0.56 of the paragraph's pass
  const { value, set } = useScrub(box, (p) => (p - 0.18) / 0.42);
  const words = intro.statement.split(" ");
  const p = 0.1 + value * 0.46;

  return (
    <div ref={box} className="grid-site cs-gap-l gap-y-10">
      <div className="col-span-4 md:col-span-3 lg:col-span-3">
        <Reveal>
          <h3 className="t-heading max-w-[16ch]">{opening.reading.title}</h3>
          <p className="t-body mt-5 max-w-[34ch] text-ink-2">{opening.reading.body}</p>
        </Reveal>
        <ScrubControl
          className="mt-10 max-w-[320px]"
          value={value}
          onChange={set}
          label="Reading progress of the opening statement"
          hint={opening.reading.hint}
        />
      </div>
      <div className="col-span-4 rounded-xl bg-paper-2 p-6 md:col-span-5 md:p-10 lg:col-span-8 lg:col-start-5 lg:p-16">
        <p className="t-mono mb-8 flex items-baseline gap-3 lg:mb-12">
          <span className="opacity-50">({intro.index})</span>
          <span>{intro.label}</span>
        </p>
        <p className="t-statement" style={{ "--n": words.length, "--p": p } as CSSProperties}>
          {words.map((w, i) => (
            <span key={i} className="read-word" style={{ "--w": i } as CSSProperties}>
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export function Opening() {
  return (
    <Chapter id="cs-opening" title={opening.title} body={opening.body}>
      <div className="cs-gap-m">
        <LiveHero />
      </div>
      <ReadingDemo />
    </Chapter>
  );
}
