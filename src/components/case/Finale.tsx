"use client";

import Image from "next/image";
import { type CSSProperties } from "react";
import { caseMeta, chapter, finale, screens } from "@/content/case";
import { shots, type ShotKey } from "@/lib/case-images";
import { Immersive } from "@/components/sections/Immersive";
import { Reveal, SplitLines } from "@/components/motion/Reveal";
import { Arrow } from "@/components/ui/primitives";

/* ------------------------------------------------------------------ */
/* 11 — every screen of the production site, drifting past             */
/* ------------------------------------------------------------------ */
export function Screens() {
  const c = chapter("cs-screens");
  const items = screens.items;
  return (
    <section id={c.id} data-chapter={c.id} aria-labelledby={`${c.id}-title`} className="cs-chapter relative">
      <header className="grid-site gap-y-8">
        <Reveal kind="line" className="cs-rule col-span-full" />
        <Reveal className="col-span-4 md:col-span-2 lg:col-span-3">
          <p className="t-mono flex items-baseline gap-3">
            <span className="opacity-50">{c.index}</span>
            <span>{c.label}</span>
          </p>
        </Reveal>
        <SplitLines id={`${c.id}-title`} lines={[screens.title]} className="t-display-m col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-4" />
      </header>

      <div className="cs-marquee cs-gap-m" tabIndex={0} aria-label="Screens of the website. Hover or focus to pause.">
        <ul className="cs-marquee__track">
          {[...items, ...items].map((it, i) => {
            const s = shots[it.key as ShotKey];
            const dup = i >= items.length;
            return (
              <li key={i} className="cs-marquee__item" aria-hidden={dup || undefined}>
                <figure>
                  <div className="cs-browser relative aspect-[16/10]">
                    <Image src={s.src} alt={dup ? "" : s.alt} fill sizes="(min-width: 1200px) 42vw, 80vw" className="object-cover object-top" />
                  </div>
                  <figcaption className="t-mono mt-4 flex gap-3 text-mute">
                    <span className="opacity-60">{String((i % items.length) + 1).padStart(2, "0")}</span>
                    <span>{it.caption}</span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Finale — the site's own closing image, then credits and the link    */
/* ------------------------------------------------------------------ */
export function Finale() {
  const letters = finale.brand.split("");
  return (
    <>
      <div className="cs-gap-l">
        <Immersive />
      </div>

      <section aria-labelledby="cs-credits-title" className="relative bg-paper pb-10 pt-[clamp(120px,14vw,240px)]">
        <Reveal kind="group" className="overflow-hidden px-site">
          <h2 id="cs-credits-title" aria-label={finale.brand} className="flex justify-between text-[25.6vw] font-medium leading-[0.78] tracking-[-0.06em]">
            {letters.map((l, i) => (
              <span key={i} aria-hidden="true" className="inline-block overflow-hidden pt-[0.04em]">
                <span className="wordmark-letter" style={{ "--i": i } as CSSProperties}>{l}</span>
              </span>
            ))}
          </h2>
        </Reveal>

        <div className="grid-site cs-gap-m gap-y-8">
          <SplitLines as="p" lines={[finale.tagline]} className="t-display-m col-span-4 md:col-span-4 lg:col-span-5" />
          <Reveal index={1} className="col-span-4 md:col-span-4 md:col-start-5 lg:col-span-4 lg:col-start-8">
            <p className="t-lead text-ink-2">{finale.credit}</p>
            <p className="t-lead mt-3 text-ink-2">{finale.imagery}</p>
          </Reveal>
        </div>

        <Reveal index={2} className="cs-gap-l">
          <a href={caseMeta.liveUrl} target="_blank" rel="noopener noreferrer" className="cs-live-cta">
            <span className="cs-live-cta__inner flex w-full items-center justify-between gap-6">
              <span className="text-[clamp(40px,7.4vw,136px)] font-medium uppercase leading-[0.9] tracking-[-0.045em]">{finale.cta}</span>
              <span className="cs-live-cta__arrow shrink-0" aria-hidden="true">
                <Arrow size={56} className="h-[clamp(28px,4.5vw,72px)] w-[clamp(28px,4.5vw,72px)]" />
              </span>
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Reveal>

        <div className="grid-site mt-8 gap-y-3">
          <p className="t-mono col-span-4 text-mute md:col-span-4">{caseMeta.liveLabel}</p>
          <p className="t-mono col-span-4 text-mute md:col-span-4 md:text-right lg:col-span-4 lg:col-start-9">
            © {caseMeta.year} {caseMeta.author} ·{" "}
            <a href="#cs-cover" className="link-u pb-0.5 text-ink">Back to top ↑</a>
          </p>
        </div>
      </section>
    </>
  );
}
