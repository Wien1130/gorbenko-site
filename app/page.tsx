import Header from "./components/Header";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import Process from "./components/Process";
import CaseStudy from "./components/CaseStudy";
import Pricing from "./components/Pricing";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <Hero />
      <Problem />
      <Process />
      <CaseStudy />
      <Pricing />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
