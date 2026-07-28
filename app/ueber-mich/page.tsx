import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import CTASection from "../components/ui/CTASection";
import Reveal from "../components/ui/Reveal";
import SectionLabel from "../components/ui/SectionLabel";
import { CONTACT } from "../lib/content";

export const metadata: Metadata = {
  title: "Über mich — Andrii Gorbenko",
  description:
    "15 Jahre eigener Unternehmer, heute KI- und Marketing-Spezialist in Wien. Ich baue digitale Systeme für Betriebe — und rede mit Unternehmern auf Augenhöhe.",
  alternates: { canonical: "/ueber-mich" },
};

const principles = [
  {
    title: "Alles aus einer Hand",
    text: "Website, KI-Assistent, Content, Werbung — bei mir greift alles ineinander. Keine drei Agenturen, keine Ausreden.",
  },
  {
    title: "Erst Ergebnis, dann Vertrag",
    text: "Die Erstberatung ist kostenlos und konkret. Sie sehen zuerst, was möglich ist — und entscheiden dann.",
  },
  {
    title: "Ich komme zu Ihnen",
    text: "Vor Ort in Ihrem Betrieb in Wien versteht man ein Geschäft besser als in jedem Video-Call. Kaffee genügt.",
  },
  {
    title: "Keine Buzzwords",
    text: "Ich erkläre alles so, dass es jeder versteht. Wenn etwas nichts bringt, sage ich es Ihnen ehrlich.",
  },
];

export default function UeberMichPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <section className="relative overflow-hidden pb-16 pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--accent-dim),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionLabel>Über mich</SectionLabel>
              <h1 className="font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Unternehmer zuerst.
                <br />
                Dann Marketer.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
                Ich heiße Andrii Gorbenko. 15 Jahre lang habe ich in der
                Ukraine eigene Unternehmen aufgebaut und geführt — unter
                anderem ein Trainingsunternehmen. Ich weiß, wie es ist,
                Verantwortung für Umsatz und Mitarbeiter zu tragen.
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-[var(--muted)]">
                Deshalb rede ich mit Unternehmern auf Augenhöhe, nicht in
                Agentur-Floskeln. Seit September 2025 lebe ich in Wien und
                habe mich voll auf Marketing und Künstliche Intelligenz
                fokussiert — mit einer einfachen Regel: Jedes Werkzeug, das
                ich Kunden empfehle, habe ich zuerst selbst gebaut und
                getestet.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-[var(--border)]">
                <Image
                  src="/hero-portrait.png"
                  alt="Andrii Gorbenko"
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Wie ich arbeite
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
                    {p.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Folgen Sie mir
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              Ich zeige täglich öffentlich, wie ich mit KI arbeite — auf
              Deutsch, ohne Fachchinesisch.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Reveal>
              <a
                href={CONTACT.instagramKi}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 transition hover:border-[var(--accent)]/40"
              >
                <p className="font-semibold">@ki.mit.andrii</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  KI für Unternehmen — täglich auf Instagram, auf Deutsch.
                </p>
              </a>
            </Reveal>
            <Reveal delay={0.06}>
              <a
                href={CONTACT.instagramPersonal}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 transition hover:border-[var(--accent)]/40"
              >
                <p className="font-semibold">@andrii_gorbenko</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Mein persönlicher Kanal — Business und Leben in Wien.
                </p>
              </a>
            </Reveal>
            <Reveal delay={0.12}>
              <a
                href={CONTACT.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 transition hover:border-[var(--accent)]/40"
              >
                <p className="font-semibold">YouTube</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Längere Videos: KI-Werkzeuge und echte Projekte, Schritt für
                  Schritt.
                </p>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection />
      <SiteFooter />
    </main>
  );
}
