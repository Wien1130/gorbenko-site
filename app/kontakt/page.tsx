import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Reveal from "../components/ui/Reveal";
import SectionLabel from "../components/ui/SectionLabel";
import BeratungForm from "./BeratungForm";
import { CONTACT } from "../lib/content";

export const metadata: Metadata = {
  title: "Kostenlose Beratung — online oder bei Ihnen in Wien",
  description:
    "30 Minuten kostenlose Beratung: online oder direkt in Ihrem Betrieb in Wien. Konkrete Ideen für KI, Website, Content und Werbung — unverbindlich.",
  alternates: { canonical: "/kontakt" },
};

const ways = [
  {
    title: "Online",
    text: "Video-Call oder Telefon — oft noch am selben Tag möglich. Ideal für den ersten Überblick.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8">
        <rect x="2" y="4" width="15" height="14" rx="2" />
        <path d="M17 9l5-3v12l-5-3" />
      </svg>
    ),
  },
  {
    title: "Vor Ort in Wien",
    text: "Ich komme in Ihren Betrieb — vom 1. bis zum 23. Bezirk. Vor Ort sehe ich am meisten. Kaffee genügt.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export default function KontaktPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <section className="relative overflow-hidden pb-24 pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--accent-dim),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionLabel>Kontakt</SectionLabel>
            <h1 className="font-display mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Kostenlose Beratung — online oder bei Ihnen in Wien.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
              30 Minuten. Sie erzählen von Ihrem Betrieb, ich zeige Ihnen
              konkret, was sich automatisieren lässt und was es bringen kann.
              Unverbindlich.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                {ways.map((w, i) => (
                  <Reveal key={w.title} delay={i * 0.08}>
                    <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)]/10">
                        {w.icon}
                      </div>
                      <h2 className="mt-4 font-semibold">{w.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                        {w.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.15}>
                <div className="mt-8 space-y-4">
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-xl border border-[var(--border)] p-4 transition hover:border-[var(--accent)]/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.122 1.528 5.854L0 24l6.335-1.495A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.893 0-3.693-.508-5.27-1.475l-.378-.224-3.916.924.987-3.607-.247-.393A9.715 9.715 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium transition group-hover:text-[var(--accent)]">WhatsApp — schnellste Antwort</p>
                      <p className="text-xs text-[var(--muted)]">{CONTACT.whatsappLabel}</p>
                    </div>
                  </a>
                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="group flex items-center gap-4 rounded-xl border border-[var(--border)] p-4 transition hover:border-[var(--accent)]/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium transition group-hover:text-[var(--accent)]">Anrufen</p>
                      <p className="text-xs text-[var(--muted)]">{CONTACT.phoneLabel}</p>
                    </div>
                  </a>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="group flex items-center gap-4 rounded-xl border border-[var(--border)] p-4 transition hover:border-[var(--accent)]/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M22 4L12 13 2 4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium transition group-hover:text-[var(--accent)]">E-Mail</p>
                      <p className="text-xs text-[var(--muted)]">{CONTACT.email}</p>
                    </div>
                  </a>
                  <a
                    href={CONTACT.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-xl border border-[var(--border)] p-4 transition hover:border-[var(--accent)]/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium transition group-hover:text-[var(--accent)]">Telegram</p>
                      <p className="text-xs text-[var(--muted)]">{CONTACT.telegramLabel}</p>
                    </div>
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <BeratungForm />
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <p className="mt-12 text-center text-sm text-[var(--muted)]">
              Termine vor Ort: Montag–Samstag, ganz Wien.
            </p>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
