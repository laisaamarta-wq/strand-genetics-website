"use client";

import { cta } from "@/content/site";
import { images } from "@/lib/images";
import { Reveal, SplitLines } from "@/components/motion/Reveal";
import { CtaLink, Arrow } from "@/components/ui/primitives";
import { ParallaxImage } from "@/components/ui/ParallaxImage";

export function FinalCta() {
  return (
    <section id="contact" aria-labelledby="cta-title" className="relative overflow-hidden bg-paper">
      <div className="relative min-h-[100svh]">
        {/* the helix fragment sits in the right third; type lives in its negative space */}
        <div className="absolute inset-0 top-[38%] lg:top-0" aria-hidden="true">
          <ParallaxImage image={{ ...images.fragment, alt: "" }} sizes="100vw" speed={-18} scale={1.14} position="72% 50%" />
        </div>

        <div className="relative grid-site min-h-[100svh] content-start gap-y-10 pb-16 pt-32 lg:content-center lg:pt-0 lg:gap-y-12">
          <div className="col-span-4 md:col-span-6 lg:col-span-7">
            <SplitLines id="cta-title" lines={cta.title} className="t-display-xl" />
          </div>
          <Reveal index={2} className="col-span-4 md:col-span-4 lg:col-span-4 lg:col-start-1">
            <p className="t-lead max-w-[34ch] text-ink-2">{cta.body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <CtaLink href={cta.primary.href}>{cta.primary.label}</CtaLink>
              <a href={cta.secondary.href} className="group inline-flex items-center gap-3 text-[15px]">
                <span className="link-u pb-0.5">{cta.secondary.label}</span>
                <Arrow className="transition-transform duration-500 group-hover:translate-x-1" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
