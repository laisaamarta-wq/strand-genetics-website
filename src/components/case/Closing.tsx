"use client";

import { closeCase } from "@/content/case";
import { Reveal } from "@/components/motion/Reveal";
import { Chapter } from "./Chapter";
import { Caption, DesktopShot, PhoneShot } from "./Frames";

export function Closing() {
  const c = closeCase.captions;
  return (
    <Chapter id="cs-close" title={closeCase.title} body={closeCase.body}>
      {/* desktop: two large screens, offset */}
      <div className="hidden md:block">
      <div className="grid-site cs-gap-m gap-y-12">
        <Reveal as="figure" className="md:col-span-6 lg:col-span-7">
          <DesktopShot shot="dAboutValues" sizes="(min-width: 1200px) 58vw, 75vw" />
          <figcaption><Caption>{c.values}</Caption></figcaption>
        </Reveal>
        <Reveal as="figure" index={1} className="md:col-span-6 md:col-start-3 lg:col-span-7 lg:col-start-6 lg:-mt-[12vw]">
          <DesktopShot shot="dCta" sizes="(min-width: 1200px) 58vw, 75vw" />
          <figcaption><Caption>{c.cta}</Caption></figcaption>
        </Reveal>
      </div>
      </div>

      {/* mobile: the same moments as captured on a phone */}
      <div className="md:hidden">
      <div className="grid-site cs-gap-m gap-y-8">
        <Reveal as="figure" className="col-span-2">
          <PhoneShot shot="mAbout" sizes="50vw" />
          <figcaption><Caption>{c.values}</Caption></figcaption>
        </Reveal>
        <Reveal as="figure" index={1} className="col-span-2 mt-16">
          <PhoneShot shot="mCta" sizes="50vw" />
          <figcaption><Caption>{c.cta}</Caption></figcaption>
        </Reveal>
      </div>
      </div>

      <div className="cs-gap-l px-site">
        <Reveal as="figure" className="mx-auto max-w-[1180px]">
          <DesktopShot shot="dFooter" sizes="(min-width: 1200px) 82vw, 100vw" />
          <figcaption><Caption>{c.footer}</Caption></figcaption>
        </Reveal>
      </div>
    </Chapter>
  );
}
