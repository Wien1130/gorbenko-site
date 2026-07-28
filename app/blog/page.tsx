import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import CTASection from "../components/ui/CTASection";
import Reveal from "../components/ui/Reveal";
import SectionLabel from "../components/ui/SectionLabel";
import { posts } from "./posts";

export const metadata: Metadata = {
  title: "Blog — KI, Marketing & Digitalisierung für Wiener Betriebe",
  description:
    "Praxiswissen ohne Buzzwords: KI-Chatbots, GEO, virale Reels und Digitalisierung — erklärt an echten Projekten aus Wien.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <section className="relative overflow-hidden pb-16 pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--accent-dim),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionLabel>Blog</SectionLabel>
            <h1 className="font-display mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Praxiswissen. Keine Buzzwords.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[var(--muted)]">
              KI, Marketing und Digitalisierung — erklärt an echten Projekten
              aus Wien. Alles, was ich hier schreibe, habe ich selbst gebaut
              und getestet.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-5 md:grid-cols-3">
            {sorted.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 0.08}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 transition hover:border-[var(--accent)]/40"
                >
                  <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                    <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[var(--accent)]">
                      {post.tag}
                    </span>
                    <span>{post.dateLabel}</span>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                    {post.description}
                  </p>
                  <p className="mt-5 text-xs text-[var(--muted)]">
                    {post.readingMinutes} Min. Lesezeit
                  </p>
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
