import About from "./components/About";
import BackgroundEffects from "./components/BackgroundEffects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/projects";
import Services from "./components/Services";
import Skills from "./components/Skills";
import Timeline from "./components/Timeline";

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <BackgroundEffects />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Skills />
      <Timeline />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
