import { Loader } from "@/components/sections/Loader";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Services } from "@/components/sections/Services";
import { Science } from "@/components/sections/Science";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Immersive } from "@/components/sections/Immersive";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { Interactions } from "@/components/motion/Interactions";

export default function Home() {
  return (
    <>
      <Loader />
      <Nav />
      {/* main lifts away to reveal the footer beneath it */}
      <main id="main" className="relative z-10 bg-paper">
        <Hero />
        <Intro />
        <Services />
        <Science />
        <Process />
        <About />
        <Immersive />
        <FinalCta />
      </main>
      <Footer />
      <Interactions />
    </>
  );
}
