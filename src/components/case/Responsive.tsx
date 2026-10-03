"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { responsive } from "@/content/case";
import { shots, type ShotKey } from "@/lib/case-images";
import { Reveal } from "@/components/motion/Reveal";
import { Chapter } from "./Chapter";
import { BrowserFrame, Caption, DesktopShot, LiveNote, PhoneShot, TabletShot } from "./Frames";

const DEVICES = {
  desktop: { w: 1440, h: 900, poster: "dHero", label: "Desktop" },
  tablet: { w: 834, h: 1112, poster: "tHero", label: "Tablet" },
  mobile: { w: 390, h: 844, poster: "mHero", label: "Mobile" },
} as const;
type Device = keyof typeof DEVICES;

/** The production site in an iframe, rendered at a real device width and scaled to fit. */
function LiveDevice() {
  const wrap = useRef<HTMLDivElement>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);
  const [box, setBox] = useState({ cw: 1200, ch: 760 });

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setBox({ cw: el.clientWidth, ch: Math.min(window.innerHeight * 0.78, 860) });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const d = DEVICES[device];
  const scale = Math.min(box.cw / d.w, (box.ch - 36) / d.h, 1);
  const w = Math.round(d.w * scale);
  const h = Math.round(d.h * scale);
  const poster = shots[d.poster as ShotKey];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="t-heading">{responsive.live.title}</h3>
          <LiveNote className="mt-3">{responsive.live.note}</LiveNote>
        </div>
        <div role="group" aria-label="Device width" className="flex gap-2">
          {(Object.keys(DEVICES) as Device[]).map((k) => (
            <button key={k} type="button" className="cs-pill" aria-pressed={device === k} onClick={() => setDevice(k)}>
              {DEVICES[k].label}
            </button>
          ))}
        </div>
      </div>

      <div ref={wrap} className="mt-8 w-full">
        <div className="cs-device" style={{ width: w }}>
          <BrowserFrame url={`strand-genetics.vercel.app — ${d.w}px`}>
            <div className="relative overflow-hidden bg-paper" style={{ height: h }} onPointerLeave={() => setActive(false)}>
              {loaded ? (
                <>
                  <iframe
                    src="/"
                    title={`Strand, live, at ${d.w} pixels wide`}
                    className="cs-device__iframe"
                    style={{ width: d.w, height: d.h, transform: `scale(${scale})`, pointerEvents: active ? "auto" : "none" }}
                    tabIndex={active ? 0 : -1}
                  />
                  {!active && (
                    <button type="button" className="cs-device__overlay" onClick={() => setActive(true)}>
                      <span className="cs-pill">{responsive.live.interact}</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Image src={poster.src} alt={poster.alt} fill sizes="(min-width: 1200px) 90vw, 100vw" className="object-cover object-top" />
                  <button type="button" className="cs-device__overlay" onClick={() => { setLoaded(true); setActive(true); }}>
                    <span className="cs-pill">{responsive.live.load}</span>
                  </button>
                </>
              )}
            </div>
          </BrowserFrame>
        </div>
      </div>
    </div>
  );
}

export function Responsive() {
  const [desk, tab, mob] = responsive.devices;
  return (
    <Chapter id="cs-responsive" title={responsive.title} body={responsive.body}>
      {/* the same hero at three widths */}
      <div className="grid-site cs-gap-m items-end gap-y-10">
        <Reveal as="figure" className="col-span-4 md:col-span-8 lg:col-span-7">
          <DesktopShot shot="dHero" sizes="(min-width: 1200px) 58vw, 100vw" />
          <figcaption><Caption>{desk.name} — {desk.spec}</Caption></figcaption>
        </Reveal>
        <Reveal as="figure" index={1} className="col-span-2 md:col-span-4 md:col-start-2 lg:col-span-3 lg:col-start-8">
          <TabletShot shot="tHero" sizes="(min-width: 1200px) 25vw, 45vw" />
          <figcaption><Caption>{tab.name} — {tab.spec}</Caption></figcaption>
        </Reveal>
        <Reveal as="figure" index={2} className="col-span-2 md:col-span-2 md:col-start-6 lg:col-span-2 lg:col-start-11">
          <PhoneShot shot="mHero" sizes="(min-width: 1200px) 16vw, 45vw" />
          <figcaption><Caption>{mob.name} — {mob.spec}</Caption></figcaption>
        </Reveal>
      </div>

      {/* what changes, not just what shrinks */}
      <ul className="grid-site cs-gap-l gap-y-12">
        {responsive.details.map((d, i) => (
          <Reveal as="li" key={d.key} index={i} className={`col-span-2 md:col-span-2 lg:col-span-2 ${i === 0 ? "lg:col-start-3" : ""} ${i % 2 ? "mt-16 lg:mt-24" : ""}`}>
            <figure>
              {d.key.startsWith("t") ? (
                <TabletShot shot={d.key as ShotKey} sizes="(min-width: 1200px) 22vw, 45vw" />
              ) : (
                <PhoneShot shot={d.key as ShotKey} sizes="(min-width: 1200px) 22vw, 45vw" />
              )}
              <figcaption><Caption>{d.caption}</Caption></figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>

      <div className="cs-gap-l px-site">
        <LiveDevice />
      </div>
    </Chapter>
  );
}
