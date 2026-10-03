import type { StaticImageData } from "next/image";

import dHero from "@/assets/case/d-hero.webp";
import dApproach from "@/assets/case/d-approach.webp";
import dTesting from "@/assets/case/d-testing.webp";
import dTestingHover from "@/assets/case/d-testing-hover.webp";
import dTestingOpen from "@/assets/case/d-testing-open.webp";
import dScience from "@/assets/case/d-science.webp";
import dSciencePrinciples from "@/assets/case/d-science-principles.webp";
import dProcess1 from "@/assets/case/d-process-1.webp";
import dProcess3 from "@/assets/case/d-process-3.webp";
import dProcess4 from "@/assets/case/d-process-4.webp";
import dAbout from "@/assets/case/d-about.webp";
import dAboutValues from "@/assets/case/d-about-values.webp";
import dPerspective from "@/assets/case/d-perspective.webp";
import dCta from "@/assets/case/d-cta.webp";
import dFooter from "@/assets/case/d-footer.webp";
import tHero from "@/assets/case/t-hero.webp";
import tTesting from "@/assets/case/t-testing.webp";
import tProcess from "@/assets/case/t-process.webp";
import mHero from "@/assets/case/m-hero.webp";
import mMenu from "@/assets/case/m-menu.webp";
import mTestingOpen from "@/assets/case/m-testing-open.webp";
import mScience from "@/assets/case/m-science.webp";
import mProcess from "@/assets/case/m-process.webp";
import mAbout from "@/assets/case/m-about.webp";
import mCta from "@/assets/case/m-cta.webp";
import navTop from "@/assets/case/nav-top.webp";
import navSolid from "@/assets/case/nav-solid.webp";
import navDark from "@/assets/case/nav-dark.webp";

/**
 * Screenshots of the production build, captured with a headless browser
 * at 1440 × 900, 834 × 1194 and 390 × 844. Nothing here is mocked up.
 */
export const shots = {
  dHero: { src: dHero, alt: "Desktop hero: a DNA helix of matte white spheres with ash violet flowing through it, above the headline Genetics, in focus." },
  dApproach: { src: dApproach, alt: "Desktop Approach section: the opening statement, partly lit word by word." },
  dTesting: { src: dTesting, alt: "Desktop Testing section: headline Six disciplines. One laboratory. above an index of six tests." },
  dTestingHover: { src: dTestingHover, alt: "Testing index on hover: one row in focus, the rest faded, a flow cell preview beside the cursor." },
  dTestingOpen: { src: dTestingOpen, alt: "Testing index with Pharmacogenomics opened to show its description." },
  dScience: { src: dScience, alt: "Science section: the laboratory photograph opened to full width." },
  dSciencePrinciples: { src: dSciencePrinciples, alt: "Science principles: a pipette droplet beside four principles, Sequencing, Bioinformatics, Review, Traceability." },
  dProcess1: { src: dProcess1, alt: "Process, step 01 Collect, on a dark background with a sample kit." },
  dProcess3: { src: dProcess3, alt: "Process, step 03 Sequence, with a glass flow cell." },
  dProcess4: { src: dProcess4, alt: "Process, step 04 Understand, with a printed report." },
  dAbout: { src: dAbout, alt: "About section: Genetics is personal before it is scientific, beside gloved hands holding a tube." },
  dAboutValues: { src: dAboutValues, alt: "About values: Precision, Privacy and Clarity, each with one line of text." },
  dPerspective: { src: dPerspective, alt: "Perspective: a large line of type crossing a landscape of white cellular forms." },
  dCta: { src: dCta, alt: "Call to action: Begin with a single sample, with a helix fragment on the right." },
  dFooter: { src: dFooter, alt: "Dark footer with navigation columns above a full-width STRAND wordmark." },
  tHero: { src: tHero, alt: "Tablet hero, recomposed for eight columns." },
  tTesting: { src: tTesting, alt: "Tablet Testing index." },
  tProcess: { src: tProcess, alt: "Tablet Process as a sequence of images and steps." },
  mHero: { src: mHero, alt: "Mobile hero: the helix cropped above the headline." },
  mMenu: { src: mMenu, alt: "Mobile menu: a full-screen dark index of five chapters." },
  mTestingOpen: { src: mTestingOpen, alt: "Mobile Testing: Carrier screening opened, with its image inside the row." },
  mScience: { src: mScience, alt: "Mobile Science: headline and the laboratory frame." },
  mProcess: { src: mProcess, alt: "Mobile Process: steps stacked as a sequence." },
  mAbout: { src: mAbout, alt: "Mobile About values: Precision, Privacy, Clarity." },
  mCta: { src: mCta, alt: "Mobile call to action." },
  navTop: { src: navTop, alt: "Navigation bar at the top of the page, transparent over the helix." },
  navSolid: { src: navSolid, alt: "Navigation bar while reading: frosted, with Testing underlined." },
  navDark: { src: navDark, alt: "Navigation bar inverted over the dark Process section." },
} satisfies Record<string, { src: StaticImageData; alt: string }>;

export type ShotKey = keyof typeof shots;
