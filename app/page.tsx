import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import HomeHero from "./components/home/HomeHero";
import ClientMarquee from "./components/home/ClientMarquee";
import StatsRow from "./components/home/StatsRow";
import ServicesBento from "./components/home/ServicesBento";
import FeaturedProjects from "./components/home/FeaturedProjects";
import ConsultationSteps from "./components/home/ConsultationSteps";
import AboutTeaser from "./components/home/AboutTeaser";
import HomeFaq from "./components/home/HomeFaq";
import CTASection from "./components/ui/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />
      <HomeHero />
      <ClientMarquee />
      <StatsRow />
      <ServicesBento />
      <FeaturedProjects />
      <ConsultationSteps />
      <AboutTeaser />
      <HomeFaq />
      <CTASection />
      <SiteFooter />
    </main>
  );
}
