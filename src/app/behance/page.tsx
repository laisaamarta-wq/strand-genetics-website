import type { Metadata } from "next";
import { CaseHeader } from "@/components/case/CaseHeader";
import { Cover } from "@/components/case/Cover";
import { Overview } from "@/components/case/Overview";
import { ArtDirection } from "@/components/case/ArtDirection";
import { Opening } from "@/components/case/Opening";
import { Navigation } from "@/components/case/Navigation";
import { TestingShowcase, ScienceShowcase, ProcessShowcase } from "@/components/case/Showcases";
import { Closing } from "@/components/case/Closing";
import { SystemDetails } from "@/components/case/SystemDetails";
import { Responsive } from "@/components/case/Responsive";
import { Screens, Finale } from "@/components/case/Finale";
import { Interactions } from "@/components/motion/Interactions";
import "./case.css";

const description =
  "Case study: Strand, a website concept for a fictional genetic testing laboratory — art direction, UI/UX, interaction and responsive design by Marta Jakovleva.";

export const metadata: Metadata = {
  title: "Case study",
  description,
  alternates: { canonical: "/behance" },
  openGraph: { title: "Strand — Case study", description, url: "/behance", type: "article" },
  twitter: { card: "summary_large_image", title: "Strand — Case study", description },
};

export default function CaseStudyPage() {
  return (
    <>
      <CaseHeader />
      <main id="main" className="relative bg-paper">
        <Cover />
        <Overview />
        <ArtDirection />
        <Opening />
        <Navigation />
        <TestingShowcase />
        <ScienceShowcase />
        <ProcessShowcase />
        <Closing />
        <SystemDetails />
        <Responsive />
        <Screens />
        <Finale />
      </main>
      <Interactions />
    </>
  );
}
