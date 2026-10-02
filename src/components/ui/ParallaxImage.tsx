"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, type CSSProperties } from "react";
import { useScrollProgress } from "@/components/motion/hooks";

/**
 * Image that drifts inside its frame as the frame crosses the viewport.
 * The frame (parent) must be `relative overflow-hidden` with a set aspect ratio.
 */
export function ParallaxImage({
  image,
  sizes,
  speed = -14,
  scale = 1.16,
  priority,
  position = "center",
  className = "",
}: {
  image: { src: StaticImageData; alt: string };
  sizes: string;
  speed?: number;
  scale?: number;
  priority?: boolean;
  position?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress(ref);
  return (
    <div ref={ref} className="absolute inset-0">
      <div className="absolute inset-0" data-parallax style={{ "--speed": speed, "--scale": scale } as CSSProperties}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          className={`object-cover ${className}`}
          style={{ objectPosition: position }}
        />
      </div>
    </div>
  );
}
