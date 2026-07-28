import Image from "next/image";
import Link from "next/link";
import Reveal from "../ui/Reveal";
import SectionLabel from "../ui/SectionLabel";

export default function AboutTeaser() {
  return (
    <section className="border-t border-[var(--border)] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-[var(--border)]">
              <Image
                src="/andrey.png"
                alt="Andrii Gorbenko"
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--background)]/90 to-transparent p-5">
                <p className="font-semibold">Andrii Gorbenko</p>
                <p className="text-sm text-[var(--muted)]">
                  Unternehmer &amp; KI-Marketer, Wien
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionLabel>Über mich</SectionLabel>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Unternehmer zuerst.
              <br />
              Dann Marketer.
            </h2>
            <p className="mt-6 leading-relaxed text-[var(--muted)]">
              15 Jahre eigenes Business in der Ukraine — ich weiß, wie es ist,
              Verantwortung für Umsatz und Mitarbeiter zu tragen. Deshalb rede
              ich mit Unternehmern auf Augenhöhe, nicht in Agentur-Floskeln.
            </p>
            <p className="mt-4 leading-relaxed text-[var(--muted)]">
              Heute baue ich in Wien digitale Systeme für Betriebe: Websites,
              KI-Assistenten, Content, Werbung. Jedes Werkzeug, das ich
              empfehle, habe ich zuerst selbst gebaut und getestet.
            </p>
            <Link
              href="/ueber-mich"
              className="mt-8 inline-flex items-center gap-2 font-medium text-[var(--accent)] hover:underline"
            >
              Mehr über mich
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
