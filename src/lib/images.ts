import type { StaticImageData } from "next/image";
import type { ImageKey } from "@/content/site";

import heroHelix from "@/assets/images/hero-helix.webp";
import particles from "@/assets/images/hero-particles.webp";
import chromosome from "@/assets/images/chromosome.webp";
import lab from "@/assets/images/lab.webp";
import droplet from "@/assets/images/droplet.webp";
import landscape from "@/assets/images/landscape.webp";
import hands from "@/assets/images/hands.webp";
import kit from "@/assets/images/kit.webp";
import tubes from "@/assets/images/tubes.webp";
import flowcell from "@/assets/images/flowcell.webp";
import report from "@/assets/images/report.webp";
import fragment from "@/assets/images/fragment.webp";

/** Art-directed imagery, generated for Strand with GPT Image 2.5 via Higgsfield. */
export const images: Record<ImageKey, { src: StaticImageData; alt: string }> = {
  heroHelix: { src: heroHelix, alt: "A DNA double helix sculpted from thousands of small matte white spheres, sweeping diagonally across the frame." },
  particles: { src: particles, alt: "" },
  chromosome: { src: chromosome, alt: "A single X-shaped chromosome formed from densely packed pale spheres." },
  lab: { src: lab, alt: "A quiet, light-filled genetics laboratory with a sequencer and sample racks on a long white bench." },
  droplet: { src: droplet, alt: "A pipette tip releasing a single clear droplet against a white background." },
  landscape: { src: landscape, alt: "An abstract landscape of rounded white cellular forms under low, raking light." },
  hands: { src: hands, alt: "Gloved hands holding a small clear sample tube up to soft daylight." },
  kit: { src: kit, alt: "A minimal white sample collection kit with a clear tube, arranged on paper." },
  tubes: { src: tubes, alt: "A row of clear laboratory microtubes in a white rack, the nearest one in focus." },
  flowcell: { src: flowcell, alt: "A glass sequencing flow cell with fine channels catching the light." },
  report: { src: report, alt: "A sheet of paper printed with an abstract pattern of grey bands, like a gel result." },
  fragment: { src: fragment, alt: "A short fragment of a DNA helix made of white spheres, floating in white space." },
};
