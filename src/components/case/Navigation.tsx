"use client";

import Image from "next/image";
import { useState } from "react";
import { navigation } from "@/content/case";
import { shots, type ShotKey } from "@/lib/case-images";
import { Reveal } from "@/components/motion/Reveal";
import { Chapter } from "./Chapter";
import { Caption } from "./Frames";

export function Navigation() {
  const [menu, setMenu] = useState(false);

  return (
    <Chapter id="cs-navigation" title={navigation.title} body={navigation.body}>
      {/* three real states of the same bar, stacked like specimens */}
      <ol className="cs-gap-m">
        {navigation.states.map((s, i) => {
          const shot = shots[s.key as ShotKey];
          return (
            <Reveal as="li" key={s.key} index={i} className="grid-site items-center gap-y-3 py-4 md:py-6">
              <div className="col-span-4 md:col-span-2 lg:col-span-3">
                <p className="t-mono flex items-baseline gap-3">
                  <span className="opacity-50">0{i + 1}</span>
                  <span>{s.label}</span>
                </p>
                <p className="t-small mt-2 text-mute">{s.note}</p>
              </div>
              <div className="col-span-4 md:col-span-6 lg:col-span-9">
                <div className="cs-strip">
                  <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 1200px) 75vw, (min-width: 768px) 75vw, 200vw" className="object-cover" />
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>

      {/* phone: the menu, open and closed — both are real screenshots */}
      <div className="grid-site cs-gap-l items-center gap-y-12">
        <div className="col-span-4 md:col-span-4 lg:col-span-4 lg:col-start-2">
          <Reveal>
            <h3 className="t-heading max-w-[18ch]">{navigation.mobile.title}</h3>
            <p className="t-body mt-5 max-w-[36ch] text-ink-2">{navigation.mobile.body}</p>
          </Reveal>
          <Reveal index={1} className="mt-10">
            <button type="button" className="cs-pill" aria-pressed={menu} onClick={() => setMenu((m) => !m)}>
              <span className="relative block h-2 w-4" aria-hidden="true">
                <span className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-500 ${menu ? "translate-y-1 rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px w-4 bg-current transition-transform duration-500 ${menu ? "-translate-y-[3px] -rotate-45" : ""}`} />
              </span>
              {menu ? navigation.mobile.close : navigation.mobile.open}
            </button>
          </Reveal>
        </div>
        <Reveal kind="clip" className="col-span-3 col-start-2 md:col-span-3 md:col-start-6 lg:col-span-3 lg:col-start-8">
          <figure>
            <div className="cs-phone">
              <div className="cs-phone__screen">
                <Image src={shots.mHero.src} alt={shots.mHero.alt} fill sizes="(min-width: 1200px) 22vw, 60vw" placeholder="blur" className="object-cover object-top" />
                {/* same wipe and timing as the site's .menu-panel */}
                <div className="cs-wipe absolute inset-0" data-on={menu} aria-hidden={!menu}>
                  <Image src={shots.mMenu.src} alt={shots.mMenu.alt} fill sizes="(min-width: 1200px) 22vw, 60vw" className="object-cover object-top" />
                </div>
              </div>
            </div>
            <figcaption>
              <Caption className="text-center">{navigation.mobile.note}</Caption>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </Chapter>
  );
}
