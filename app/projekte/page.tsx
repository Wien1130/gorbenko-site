import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import CTASection from "../components/ui/CTASection";
import Reveal from "../components/ui/Reveal";
import SectionLabel from "../components/ui/SectionLabel";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../lib/content";

export const metadata: Metadata = {
  title: "Projekte — Websites, KI-Bots & Kampagnen für Wiener Betriebe",
  description:
    "Echte Projekte für echte Betriebe in Wien: Messerschmiede Nagl, BlinHaus, Rubberik, G-Bike, Zum Eisbären. Websites, KI-Chatbots, Reels, Werbung.",
  alternates: { canonical: "/projekte" },
};

export default function ProjektePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <section className="relative overflow-hidden pb-16 pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--accent-dim),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionLabel>Projekte</SectionLabel>
            <h1 className="font-display mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Echte Betriebe. Echte Ergebnisse.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[var(--muted)]">
              Vom Handwerksbetrieb bis zum Traditionsgeschäft: Hier sehen Sie,
              was ich für Wiener Unternehmen gebaut habe — und was es gebracht
              hat.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.08}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <SiteFooter />
    </main>
  );
}
