import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import ScrollRail from "@/components/ScrollRail";
import LivingBackground from "@/components/LivingBackground";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Stack from "@/components/Stack";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Intro />
      <LivingBackground />
      <Nav />
      <ScrollRail />
      <Hero />
      <About />
      <Projects />
      <Stack />
      <Timeline />
      <Contact />
      <Footer />
    </main>
  );
}
