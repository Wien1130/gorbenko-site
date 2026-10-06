import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import CTASection from "../components/ui/CTASection";
import Reveal from "../components/ui/Reveal";
import SectionLabel from "../components/ui/SectionLabel";
import ServiceIcon from "../components/ui/ServiceIcon";
import { formatEur, getService, priceList, SITE_URL } from "../lib/content";

export const metadata: Metadata = {
  title: "Preise — Marketing, KI, Websites & Werbung in Wien",
  description:
    "Transparente Einstiegspreise für Betriebe in Wien: Marketing-Strategie ab 890 €, KI-Assistent ab 2.000 €, Landingpage ab 2.500 €, Reels ab 1.500 €/Monat, Meta & Google Ads ab 600 €. Alle Preise „ab“, netto.",
  alternates: { canonical: "/preise" },
};

function PriceCell({ item }: { item: (typeof priceList)[number]["items"][number] }) {
  if (item.einmalig === 0 && !item.monatlich) {
    return <span className="font-display text-xl font-bold">kostenlos</span>;
  }
  return (
    <span className="flex flex-col items-end gap-0.5 sm:items-start">
      {item.einmalig ? (
        <span className="font-display text-xl font-bold">
          ab {formatEur(item.einmalig)}
          <span className="ml-1 text-xs font-normal text-[var(--muted)]">einmalig</span>
        </span>
      ) : null}
      {item.monatlich ? (
        <span className={"font-display font-bold " + (item.einmalig ? "text-base" : "text-xl")}>
          {item.einmalig ? "+ " : ""}ab {formatEur(item.monatlich)}
          <span className="ml-1 text-xs font-normal text-[var(--muted)]">/ Monat</span>
        </span>
      ) : null}
    </span>
  );
}

export default function PreisePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Preise Gorbenko — Marketing & KI für Betriebe in Wien",
    url: `${SITE_URL}/preise`,
    itemListElement: priceList.flatMap((g) =>
      g.items.map((it) => ({
        "@type": "Offer",
        name: it.name,
        description: it.loest,
        priceCurrency: "EUR",
        price: it.einmalig || it.monatlich || 0,
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: it.einmalig || it.monatlich || 0,
          priceCurrency: "EUR",
        },
        url: `${SITE_URL}/leistungen/${g.serviceSlug}`,
      })),
    ),
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <section className="relative overflow-hidden pb-12 pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--accent-dim),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionLabel>Preise</SectionLabel>
            <h1 className="font-display mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Was es kostet — offen, ab dem ersten Gespräch.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[var(--muted)]">
              Alle Preise sind Einstiegspreise („ab“), netto. Den Fixpreis für
              Ihren Betrieb bekommen Sie nach der kostenlosen Beratung — schriftlich,
              mit allem, was drin ist, und ohne Überraschungen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
              <span className="rounded-full border border-[var(--border)] px-4 py-2">50 % Anzahlung, Rest bei Übergabe</span>
              <span className="rounded-full border border-[var(--border)] px-4 py-2">Werbebudget geht immer direkt an Google / Meta</span>
              <span className="rounded-full border border-[var(--border)] px-4 py-2">Monatliche Leistungen jederzeit kündbar</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-6xl space-y-10 px-6">
          {priceList.map((group, gi) => {
            const service = getService(group.serviceSlug);
            if (!service) return null;
            return (
              <Reveal key={group.serviceSlug} delay={Math.min(gi, 3) * 0.05}>
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: "color-mix(in srgb, " + service.color + " 12%, transparent)" }}
                      >
                        <ServiceIcon icon={service.icon} color={service.color} />
                      </div>
                      <h2 className="font-display text-2xl font-bold tracking-tight">{group.title}</h2>
                    </div>
                    <Link
                      href={`/leistungen/${group.serviceSlug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                      style={{ color: service.color }}
                    >
                      Zur Leistung
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </div>

                  <ul className="mt-6 divide-y divide-[var(--border)]">
                    {group.items.map((item) => (
                      <li
                        key={item.name}
                        className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-8"
                      >
                        <div>
                          <h3 className="font-semibold leading-snug">{item.name}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{item.loest}</p>
                          {item.note && (
                            <p className="mt-1.5 text-xs text-[var(--muted)]">{item.note}</p>
                          )}
                        </div>
                        <div className="text-right sm:min-w-[180px] sm:text-left" style={{ color: service.color }}>
                          <PriceCell item={item} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}

          <Reveal>
            <p className="text-center text-sm text-[var(--muted)]">
              Preise netto, Stand Oktober 2026. Fremdkosten (Domain, Werbebudget,
              SMS-Versand) gehen direkt an den jeweiligen Anbieter und sind nicht
              Teil meiner Rechnung.
            </p>
          </Reveal>
        </div>
      </section>

      <CTASection />
      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
