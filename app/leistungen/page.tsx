import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import CTASection from "../components/ui/CTASection";
import Reveal from "../components/ui/Reveal";
import SectionLabel from "../components/ui/SectionLabel";
import ServiceIcon from "../components/ui/ServiceIcon";
import TiltGlowCard from "../components/ui/TiltGlowCard";
import { services } from "../lib/content";

export const metadata: Metadata = {
  title: "Leistungen — KI, Websites, Content & Werbung in Wien",
  description:
    "Alle Leistungen aus einer Hand: KI-Chatbots, Websites & Online-Shops, virale Reels, Meta Ads, GEO und Digitalisierung — für Betriebe in Wien.",
  alternates: { canonical: "/leistungen" },
};

export default function LeistungenPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <section className="relative overflow-hidden pb-16 pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--accent-dim),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionLabel>Leistungen</SectionLabel>
            <h1 className="font-display mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Alles, was Ihr Betrieb digital braucht — aus einer Hand.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[var(--muted)]">
              Keine drei Agenturen, keine Schnittstellen-Probleme: Website,
              KI-Assistent, Content und Werbung greifen bei mir ineinander —
              mit einem Ziel: mehr Kunden für Ihr Geschäft.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 2) * 0.08}>
                <Link href={`/leistungen/${s.slug}`} className="block h-full">
                  <TiltGlowCard className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 transition hover:border-[var(--foreground)]/15">
                    <div className="flex items-start gap-5">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, " + s.color + " 12%, transparent)",
                        }}
                      >
                        <ServiceIcon icon={s.icon} color={s.color} size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold leading-snug">{s.name}</h2>
                        <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
                          {s.description}
                        </p>
                        <p
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
                          style={{ color: s.color }}
                        >
                          Mehr erfahren
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </p>
                      </div>
                    </div>
                  </TiltGlowCard>
                </Link>
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
