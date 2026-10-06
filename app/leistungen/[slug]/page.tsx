import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import CTASection from "../../components/ui/CTASection";
import FAQ from "../../components/ui/FAQ";
import MetricValue from "../../components/ui/MetricValue";
import Reveal from "../../components/ui/Reveal";
import SectionLabel from "../../components/ui/SectionLabel";
import ServiceIcon from "../../components/ui/ServiceIcon";
import LighthouseRow from "../../components/LighthouseRow";
import ChatDemo from "../../components/home/ChatDemo";
import MassFigureDemo from "../../components/demos/MassFigureDemo";
import { getService, services, SITE_URL } from "../../lib/content";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: { canonical: `/leistungen/${service.slug}` },
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.seoDescription,
    url: `${SITE_URL}/leistungen/${service.slug}`,
    areaServed: { "@type": "City", name: "Wien" },
    provider: {
      "@type": "Person",
      name: "Andrii Gorbenko",
      url: SITE_URL,
    },
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--accent-dim),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <div
              className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{
                backgroundColor:
                  "color-mix(in srgb, " + service.color + " 12%, transparent)",
              }}
            >
              <ServiceIcon icon={service.icon} color={service.color} size={24} />
            </div>
            <SectionLabel>{service.name}</SectionLabel>
            <h1 className="font-display mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {service.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
              {service.sub}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {service.prices.map((p) => (
                <div
                  key={p.label}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
                >
                  <p className="text-xs text-[var(--muted)]">{p.label}</p>
                  <p className="mt-0.5 font-display text-lg font-bold" style={{ color: service.color }}>
                    {p.value}
                  </p>
                  {p.note && (
                    <p className="mt-0.5 text-xs text-[var(--muted)]">{p.note}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">
              „ab“ = Einstiegspreis. Es fällt keine Umsatzsteuer an (Kleinunternehmer gemäß § 6 Abs. 1 Z 27 UStG). Fixpreis nach der kostenlosen Beratung.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="rounded-full bg-[var(--accent)] px-8 py-4 font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Kostenlose Beratung
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Packages / steps */}
      {service.packages && (
        <section className="border-t border-[var(--border)] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {service.packagesTitle ?? "Pakete"}
              </h2>
              {service.packagesSub && (
                <p className="mt-4 max-w-2xl text-[var(--muted)]">
                  {service.packagesSub}
                </p>
              )}
            </Reveal>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {service.packages.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.08}>
                  <div
                    className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7"
                    style={
                      p.highlight
                        ? {
                            borderColor: service.color,
                            boxShadow: `0 0 0 1px ${service.color}, 0 24px 60px -30px ${service.color}`,
                          }
                        : undefined
                    }
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: service.color }}
                    >
                      {p.step}
                    </p>
                    <h3 className="font-display mt-2 text-2xl font-bold tracking-tight">
                      {p.name}
                    </h3>
                    <p className="font-display mt-3 text-3xl font-bold" style={{ color: service.color }}>
                      {p.price}
                    </p>
                    {p.priceNote && (
                      <p className="mt-1 text-xs text-[var(--muted)]">{p.priceNote}</p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                      {p.tagline}
                    </p>
                    <p className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-medium">
                      {p.format}
                    </p>
                    <ul className="mt-5 space-y-2.5 text-sm leading-relaxed">
                      {p.items.map((it) => (
                        <li key={it} className="flex gap-2.5">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={service.color}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mt-1 shrink-0"
                            aria-hidden
                          >
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto border-t border-[var(--border)] pt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                        Ergebnis
                      </p>
                      <p className="mt-1.5 text-sm font-medium leading-relaxed">
                        {p.result}
                      </p>
                    </div>
                    <Link
                      href="/kontakt"
                      className={
                        "mt-6 inline-flex justify-center rounded-full px-6 py-3 text-sm font-semibold transition hover:opacity-90 " +
                        (p.highlight
                          ? "text-[var(--background)]"
                          : "border border-[var(--border)] text-[var(--foreground)]")
                      }
                      style={p.highlight ? { backgroundColor: service.color } : undefined}
                    >
                      {i === 0 ? "Marketing-Check anfragen" : "Unverbindlich anfragen"}
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pains */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Kennen Sie das?
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {service.pains.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7">
                  <h3 className="font-semibold leading-snug">{p.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
                    {p.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Was ich mache
              </h2>
              <p className="mt-4 text-[var(--muted)]">
                Konkret, ohne Buzzwords — das bekommen Sie:
              </p>
            </Reveal>
            <div className="space-y-4">
              {service.deliverables.map((d, i) => (
                <Reveal key={d.title} delay={i * 0.06}>
                  <div className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        color: service.color,
                        backgroundColor:
                          "color-mix(in srgb, " + service.color + " 12%, transparent)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{d.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
                        {d.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service-specific visual */}
      {service.slug === "ki-chatbots" && (
        <section className="border-t border-[var(--border)] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="font-display text-center text-2xl font-bold tracking-tight sm:text-3xl">
                So arbeitet der Assistent — live
              </h2>
              <div className="mx-auto mt-10 max-w-md">
                <ChatDemo />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {service.slug === "websites" && (
        <>
          <section className="border-t border-[var(--border)] py-20">
            <div className="mx-auto max-w-4xl px-6">
              <Reveal>
                <h2 className="font-display text-center text-2xl font-bold tracking-tight sm:text-3xl">
                  Geschwindigkeit ist messbar
                </h2>
                <div className="mt-10 space-y-6">
                  <LighthouseRow
                    slug="nagl"
                    title="Landingpage Messerschmiede Nagl"
                  />
                  <LighthouseRow slug="gorbenko" title="Diese Website" />
                </div>
              </Reveal>
            </div>
          </section>
          <section className="border-t border-[var(--border)] py-20">
            <div className="mx-auto max-w-5xl px-6">
              <Reveal>
                <h2 className="font-display text-center text-2xl font-bold tracking-tight sm:text-3xl">
                  Konfiguratoren, die man anfassen kann
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-[var(--muted)]">
                  Wenn Standard-Shops nicht reichen: interaktive Produkt-Konfiguratoren
                  mit Maßerfassung und Live-Preis — wie in diesem Demo.
                </p>
                <div className="mt-10">
                  <MassFigureDemo compact />
                </div>
              </Reveal>
            </div>
          </section>
        </>
      )}

      {service.slug === "geo-ai-sichtbarkeit" && (
        <section className="border-t border-[var(--border)] py-20">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <div className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-8 text-center">
                <p className="font-display text-xl font-bold sm:text-2xl">
                  Diese Website ist selbst nach GEO-Prinzipien gebaut.
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                  Sitemap, llms.txt, strukturierte Daten und FAQ auf jeder
                  Seite — fragen Sie ChatGPT nach einer KI-Agentur in Wien und
                  schauen Sie, was passiert.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Mini case */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionLabel>Aus der Praxis</SectionLabel>
            <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 md:p-12">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {service.miniCase.title}
              </h2>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                {service.miniCase.text}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {service.miniCase.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 text-center"
                  >
                    <MetricValue metric={m} />
                    <p className="mt-2 text-sm text-[var(--muted)]">{m.label}</p>
                  </div>
                ))}
              </div>
              <Link
                href={`/projekte/${service.miniCase.projectSlug}`}
                className="mt-8 inline-flex items-center gap-2 font-medium text-[var(--accent)] hover:underline"
              >
                Ganze Case Study lesen
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <FAQ items={service.faqs} />
          </Reveal>
          {service.note && (
            <p className="mt-8 text-center text-sm text-[var(--muted)]">
              {service.note}
            </p>
          )}
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
