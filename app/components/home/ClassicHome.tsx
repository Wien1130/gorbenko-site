import HomeHero from "./HomeHero";
import ClientMarquee from "./ClientMarquee";
import StatsRow from "./StatsRow";
import ServicesBento from "./ServicesBento";
import FeaturedProjects from "./FeaturedProjects";
import ConsultationSteps from "./ConsultationSteps";
import AboutTeaser from "./AboutTeaser";
import HomeFaq from "./HomeFaq";
import CTASection from "../ui/CTASection";

export default function ClassicHome() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <HomeHero />
      <ClientMarquee />
      <FeaturedProjects />
      <StatsRow />
      <ServicesBento />
      <ConsultationSteps />
      <AboutTeaser />
      <HomeFaq />
      <CTASection />
    </main>
  );
}
