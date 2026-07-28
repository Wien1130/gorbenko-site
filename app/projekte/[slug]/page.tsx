import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import CTASection from "../../components/ui/CTASection";
import BrowserFrame from "../../components/ui/BrowserFrame";
import PhoneFrame from "../../components/ui/PhoneFrame";
import MetricValue from "../../components/ui/MetricValue";
import Reveal from "../../components/ui/Reveal";
import SectionLabel from "../../components/ui/SectionLabel";
import LighthouseRow from "../../components/LighthouseRow";
import ProjectCard from "../../components/ProjectCard";
import { getProject, projects, SITE_URL } from "../../lib/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.client} — Case Study`;
  return {
    title,
    description: project.seoDescription,
    alternates: { canonical: `/projekte/${project.slug}` },
    openGraph: { title, description: project.seoDescription },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${project.client} — ${project.headline}`,
    description: project.seoDescription,
    url: `${SITE_URL}/projekte/${project.slug}`,
    author: { "@type": "Person", name: "Andrii Gorbenko", url: SITE_URL },
  };
  if (project.quote) {
    jsonLd.review = {
      "@type": "Review",
      reviewBody: project.quote.text,
      author: { "@type": "Person", name: project.quote.author },
    };
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--accent-dim),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionLabel>Case Study</SectionLabel>
            <h1 className="font-display mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {project.client}
            </h1>
            <p className="mt-4 text-lg text-[var(--accent)]">{project.headline}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
              <span>{project.branch}</span>
              <span>·</span>
              <span>{project.location}</span>
              {project.liveUrl && (
                <>
                  <span>·</span>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-[var(--accent)] hover:underline"
                  >
                    {project.liveLabel}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </a>
                </>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]"
                >
                  {t}
                </span>
              ))}
              {project.badge && (
                <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-[var(--background)]">
                  {project.badge}
                </span>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Screenshot hero */}
      {project.screenshots.desktop && (
        <section className="pb-8">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <BrowserFrame url={project.liveLabel ?? project.client}>
                <Image
                  src={project.screenshots.desktop}
                  alt={`Website von ${project.client}`}
                  width={1440}
                  height={900}
                  className="w-full"
                  priority
                />
              </BrowserFrame>
            </Reveal>
          </div>
        </section>
      )}

      {/* Situation */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Ausgangslage
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-[var(--muted)]">
                {project.situation}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Steps timeline */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Was wir gemacht haben
            </h2>
          </Reveal>
          <div className="relative mt-12 space-y-8 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-px before:bg-[var(--border)] md:before:left-[19px]">
            {project.steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="relative flex gap-6 pl-0">
                  <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[var(--background)] text-xs font-bold text-[var(--accent)] md:h-10 md:w-10 md:text-sm">
                    {i + 1}
                  </span>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-7">
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {s.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Ergebnisse
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {project.metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
                  <MetricValue metric={m} />
                  <p className="mt-2 text-sm text-[var(--muted)]">{m.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Lighthouse scores if measured */}
          <div className="mt-8">
            <Reveal>
              <LighthouseRow slug={project.slug} title="Ladegeschwindigkeit (Google Lighthouse)" />
            </Reveal>
          </div>

          {/* Mobile screenshot */}
          {project.screenshots.mobile && (
            <Reveal delay={0.1}>
              <div className="mt-12 grid items-center gap-10 md:grid-cols-2">
                <PhoneFrame>
                  <Image
                    src={project.screenshots.mobile}
                    alt={`Mobile Ansicht von ${project.client}`}
                    width={390}
                    height={844}
                    className="w-full"
                  />
                </PhoneFrame>
                <div>
                  <h3 className="font-display text-xl font-bold sm:text-2xl">
                    Mobil zuerst
                  </h3>
                  <p className="mt-3 leading-relaxed text-[var(--muted)]">
                    Über 70 % der Besucher kommen vom Smartphone — deshalb wird
                    jede Seite zuerst für das Handy gebaut und dann für den
                    Desktop erweitert.
                  </p>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Quote */}
      {project.quote && (
        <section className="border-t border-[var(--border)] py-20">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <blockquote className="rounded-3xl border border-[var(--accent)]/20 bg-[var(--card)] p-8 md:p-12">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent)" opacity="0.4">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>
                <p className="mt-5 text-lg italic leading-relaxed text-[var(--foreground)]/90 md:text-xl">
                  &ldquo;{project.quote.text}&rdquo;
                </p>
                <footer className="mt-6 text-sm">
                  <strong>{project.quote.author}</strong>
                  <span className="text-[var(--muted)]"> — {project.quote.role}</span>
                </footer>
              </blockquote>
            </Reveal>
          </div>
        </section>
      )}

      {/* More projects */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Weitere Projekte
              </h2>
              <Link href="/projekte" className="text-sm font-medium text-[var(--accent)] hover:underline">
                Alle ansehen →
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {others.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
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
