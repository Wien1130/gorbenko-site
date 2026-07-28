import Link from "next/link";
import { services } from "../../lib/content";
import Reveal from "../ui/Reveal";
import SectionLabel from "../ui/SectionLabel";
import ServiceIcon from "../ui/ServiceIcon";
import TiltGlowCard from "../ui/TiltGlowCard";

export default function ServicesBento() {
  return (
    <section className="border-t border-[var(--border)] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionLabel>Leistungen</SectionLabel>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Was ich für Sie tun kann
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">
            Sechs Bausteine, ein Ziel: mehr Kunden für Ihren Betrieb — ohne
            dass Sie sich um die Technik kümmern müssen.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 0.08}>
              <Link href={`/leistungen/${s.slug}`} className="block h-full">
                <TiltGlowCard className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 transition hover:border-[var(--foreground)]/15">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "color-mix(in srgb, " + s.color + " 12%, transparent)" }}
                  >
                    <ServiceIcon icon={s.icon} color={s.color} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold leading-snug">{s.name}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
                    {s.teaser}
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
                </TiltGlowCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
