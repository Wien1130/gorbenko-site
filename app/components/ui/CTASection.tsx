import Link from "next/link";
import { CONTACT } from "../../lib/content";
import Reveal from "./Reveal";

export default function CTASection() {
  return (
    <section className="border-t border-[var(--border)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[var(--accent)]/20 bg-[var(--card)] px-8 py-14 text-center md:px-16 md:py-20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-20%,var(--accent-dim),transparent_70%)]" />
            <div className="relative">
              <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Lassen Sie uns über Ihr Geschäft reden.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[var(--muted)]">
                Kostenlose Erstberatung — online oder direkt bei Ihnen im
                Betrieb in Wien. Sie bekommen konkrete Ideen, keine
                Verkaufsshow.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Link
                  href="/kontakt"
                  className="rounded-full bg-[var(--accent)] px-8 py-4 font-semibold text-[var(--background)] transition hover:opacity-90"
                >
                  Kostenlose Beratung
                </Link>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[var(--border)] px-8 py-4 font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  WhatsApp schreiben
                </a>
              </div>
              <p className="mt-7 text-xs text-[var(--muted)]">
                Unverbindlich · Antwort innerhalb von 24 h · Deutsch, Englisch,
                Russisch, Ukrainisch
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
