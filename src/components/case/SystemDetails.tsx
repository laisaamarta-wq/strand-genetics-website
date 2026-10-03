"use client";

import Image from "next/image";
import { useState } from "react";
import { system } from "@/content/case";
import { hero, nav } from "@/content/site";
import { images } from "@/lib/images";
import { Reveal } from "@/components/motion/Reveal";
import { CtaLink, Plus, SectionLabel } from "@/components/ui/primitives";
import { Chapter } from "./Chapter";
import { LiveNote } from "./Frames";

/** In the case study, the site's nav labels jump to the matching chapter. */
const CHAPTER_OF: Record<string, string> = {
  approach: "cs-opening",
  services: "cs-testing",
  science: "science",
  process: "cs-process",
  about: "cs-close",
};

/** Toggles the site's own grid overlay (Interactions listens for Shift+G). */
function toggleGrid() {
  document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "G", shiftKey: true, bubbles: true }));
}

export function SystemDetails() {
  const [grid, setGrid] = useState(false);

  return (
    <Chapter id="cs-system" title={system.title} body={system.body}>
      {/* typography */}
      <div className="grid-site cs-gap-m gap-y-10">
        <Reveal className="col-span-4 md:col-span-3 lg:col-span-4">
          <p className="text-[clamp(120px,16vw,260px)] font-medium leading-[0.8] tracking-[-0.06em]" aria-hidden="true">Aa</p>
          <p className="t-body mt-8">Host Grotesk</p>
          <p className="t-mono mt-1 text-mute">300–800 · display, text</p>
          <p className="t-body mt-5">IBM Plex Mono</p>
          <p className="t-mono mt-1 text-mute">400 · indexes, labels, figures</p>
        </Reveal>
        <ul className="col-span-4 md:col-span-5 lg:col-span-7 lg:col-start-6">
          {system.type.map((t, i) => (
            <Reveal as="li" key={t.name} index={i} className="cs-rule grid grid-cols-4 items-baseline gap-x-4 py-6 lg:grid-cols-7">
              <span className="t-mono col-span-4 text-mute lg:col-span-2">{t.name}</span>
              <span className={`${t.cls} col-span-4 mt-3 lg:col-span-5 lg:mt-0`}>{t.sample}</span>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* colour */}
      <ul className="grid-site cs-gap-l gap-y-8">
        <Reveal as="li" className="col-span-full lg:col-span-3">
          <h3 className="t-mono text-mute">Colour</h3>
        </Reveal>
        {system.colours.map((c, i) => (
          <Reveal as="li" key={c.name} index={i} className="col-span-1 lg:col-span-1">
            <div className={`cs-swatch ${c.cls}`} />
            <p className="t-small mt-3">{c.name}</p>
            <p className="t-mono text-mute">{c.hex}</p>
            {c.note && <p className="t-mono mt-1 text-accent">{c.note}</p>}
          </Reveal>
        ))}
      </ul>

      {/* grid */}
      <div className="grid-site cs-gap-l gap-y-8">
        <Reveal className="col-span-4 md:col-span-8 lg:col-span-3">
          <h3 className="t-mono text-mute">Grid</h3>
        </Reveal>
        <Reveal index={1} className="col-span-4 md:col-span-8 lg:col-span-9">
          <div className="cs-cols" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => <span key={i} />)}
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
            {system.grid.map((g) => (
              <div key={g.k}>
                <dt className="t-mono text-mute">{g.k}</dt>
                <dd className="t-small mt-1">{g.v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="button"
              className="cs-pill"
              aria-pressed={grid}
              onClick={() => {
                toggleGrid();
                setGrid((g) => !g);
              }}
            >
              {grid ? system.gridButton[1] : system.gridButton[0]}
            </button>
            <span className="t-mono text-mute">{system.gridHint}</span>
          </div>
        </Reveal>
      </div>

      {/* live components */}
      <div className="grid-site cs-gap-l gap-y-8">
        <Reveal className="col-span-4 md:col-span-8 lg:col-span-3">
          <h3 className="t-mono text-mute">Components</h3>
          <LiveNote className="mt-4 max-w-[30ch]">{system.componentsNote}</LiveNote>
        </Reveal>
        <div className="col-span-4 grid grid-cols-1 gap-4 md:col-span-8 md:grid-cols-2 lg:col-span-9">
          <Reveal className="flex min-h-[220px] flex-col justify-between rounded-xl bg-paper-2 p-6 md:p-8">
            <span className="t-mono text-mute">Primary action</span>
            <div className="flex flex-wrap items-center gap-6">
              <CtaLink href="#cs-testing">{nav.cta.label}</CtaLink>
              <a href="#cs-close" className="text-[15px]"><span className="link-u pb-0.5">Talk to a specialist</span></a>
            </div>
          </Reveal>
          <Reveal index={1} className="flex min-h-[220px] flex-col justify-between rounded-xl bg-ink p-6 text-paper md:p-8">
            <span className="t-mono opacity-50">On ink</span>
            <div>
              <CtaLink href="#cs-testing" tone="light">{hero.cta.label}</CtaLink>
            </div>
          </Reveal>
          <Reveal index={2} className="flex min-h-[220px] flex-col justify-between rounded-xl bg-paper-2 p-6 md:p-8">
            <span className="t-mono text-mute">Index & labels</span>
            <div className="space-y-5">
              <SectionLabel index="02">Testing</SectionLabel>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
                {nav.links.map((l) => (
                  <li key={l.id} className="flex items-baseline gap-1.5">
                    <span className="t-mono !text-[10px] opacity-40">{l.index}</span>
                    <a href={`#${CHAPTER_OF[l.id]}`} className="link-u pb-0.5" aria-current={l.id === "services" ? "true" : undefined}>{l.label}</a>
                  </li>
                ))}
              </ul>
              <button type="button" className="cs-plus-btn flex items-center gap-3 text-[15px]" aria-label="Expand (demo)">
                <span className="disc h-8 w-8"><Plus /></span>
                <span className="t-mono text-mute">Expand</span>
              </button>
            </div>
          </Reveal>
          <Reveal index={3} className="relative min-h-[220px] overflow-hidden rounded-xl bg-paper-2">
            <Image src={images.chromosome.src} alt="" fill sizes="(min-width: 1200px) 36vw, 90vw" className="scale-125 object-cover" />
            <span className="t-mono absolute left-6 top-6 text-ink-2 md:left-8 md:top-8">Annotation</span>
            <a href="#cs-opening" className="hotspot-card group absolute bottom-6 left-6 right-6 block p-4 md:bottom-8 md:left-auto md:right-8 md:w-[288px]">
              <span className="flex items-center justify-between">
                <span className="text-[15px] tracking-[-0.015em]">{hero.hotspots[0].title}</span>
                <span className="disc h-7 w-7 group-hover:bg-accent">
                  <Plus className="transition-transform duration-700 group-hover:rotate-90" />
                </span>
              </span>
              <span className="mt-4 block text-[13px] leading-[1.4] text-ink-2">{hero.hotspots[0].body}</span>
            </a>
          </Reveal>
        </div>
      </div>
    </Chapter>
  );
}
