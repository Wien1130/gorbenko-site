import Link from "next/link";
import { projects } from "../../lib/content";
import ProjectCard from "../ProjectCard";
import Reveal from "../ui/Reveal";
import SectionLabel from "../ui/SectionLabel";

export default function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured);
  return (
    <section className="border-t border-[var(--border)] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Projekte</SectionLabel>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Sichtbare Arbeiten
              </h2>
              <p className="mt-3 max-w-xl text-[var(--muted)]">
                Zwei Websites für Nagl, Shop in Arbeit für Rubberik, Mopeds,
                Parfümerie — zuerst das Bild, dann der Fall.
              </p>
            </div>
            <Link
              href="/projekte"
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Alle Projekte ansehen →
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {featured.map((p, i) => (
            <Reveal
              key={p.slug}
              delay={i * 0.08}
              className={i < 2 ? "lg:col-span-3" : "lg:col-span-2"}
            >
              <ProjectCard project={p} large={i < 2} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
